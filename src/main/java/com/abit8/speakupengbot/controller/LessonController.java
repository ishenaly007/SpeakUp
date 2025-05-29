package com.abit8.speakupengbot.controller;

import com.abit8.speakupengbot.db.entity.User;
import com.abit8.speakupengbot.db.entity.lesson.Lesson;
import com.abit8.speakupengbot.db.entity.lesson.Test;
import com.abit8.speakupengbot.db.entity.lesson.UserLesson;
import com.abit8.speakupengbot.db.service.LessonService;
import com.abit8.speakupengbot.db.service.TestService;
import com.abit8.speakupengbot.db.service.UserLessonService;
import com.abit8.speakupengbot.db.service.UserService;
import com.abit8.speakupengbot.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @Autowired
    private TestService testService;

    @Autowired
    private UserLessonService userLessonService;

    @Autowired
    private UserService userService;

    // Получение списка уроков
    @GetMapping
    public ResponseEntity<List<LessonResponse>> getLessons(@RequestParam Long userId) {
        List<Lesson> lessons = lessonService.findAll();
        List<LessonResponse> response = lessons.stream().map(lesson -> {
            LessonResponse lessonData = new LessonResponse();
            lessonData.setId(lesson.getId());
            lessonData.setTitle(lesson.getTitle());
            lessonData.setLevel(lesson.getLevel());
            lessonData.setDescription(lesson.getDescription());
            lessonData.setCompleted(userLessonService.existsByUserIdAndLessonId(userId, lesson.getId()));
            return lessonData;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // Получение деталей урока
    @GetMapping("/{lessonId}")
    public ResponseEntity<?> getLesson(@PathVariable Long lessonId, @RequestParam Long userId) {
        Optional<Lesson> lessonOpt = lessonService.findById(lessonId);
        if (!lessonOpt.isPresent()) {
            ErrorResponse error = new ErrorResponse();
            error.setError("Lesson not found");
            return ResponseEntity.badRequest().body(error);
        }
        Lesson lesson = lessonOpt.get();
        LessonDetailsResponse response = new LessonDetailsResponse();
        response.setId(lesson.getId());
        response.setTitle(lesson.getTitle());
        response.setLevel(lesson.getLevel());
        response.setDescription(lesson.getDescription());
        response.setNote(lesson.getNote());
        response.setHtmlContent(lesson.getHtmlContent());
        response.setCssContent(lesson.getCssContent());
        response.setCompleted(userLessonService.existsByUserIdAndLessonId(userId, lesson.getId()));
        List<Test> tests = testService.findByLessonId(lessonId);
        response.setTests(tests.stream().map(test -> {
            TestData testData = new TestData();
            testData.setId(test.getId());
            testData.setQuestion(test.getQuestion());
            testData.setOptions(test.getOptions());
            return testData;
        }).collect(Collectors.toList()));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{lessonId}/tests/{testIndex}")
    public ResponseEntity<?> checkTest(
            @PathVariable Long lessonId,
            @PathVariable int testIndex,
            @Valid @RequestBody CheckTestRequest request) {
        Long userId = request.getUserId();
        String answer = request.getAnswer();

        Optional<Lesson> lessonOpt = lessonService.findById(lessonId);
        if (!lessonOpt.isPresent()) {
            ErrorResponse error = new ErrorResponse();
            error.setError("Lesson not found");
            return ResponseEntity.badRequest().body(error);
        }
        List<Test> tests = testService.findByLessonId(lessonId);
        if (testIndex >= tests.size()) {
            ErrorResponse error = new ErrorResponse();
            error.setError("Test index out of bounds");
            return ResponseEntity.badRequest().body(error);
        }
        Test test = tests.get(testIndex);
        boolean isCorrect = answer.equals(test.getCorrectOption());

        CheckTestResponse response = new CheckTestResponse();
        response.setIsCorrect(isCorrect);
        response.setCorrectOption(test.getCorrectOption());


        Optional<User> userOpt = userService.getUserById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            boolean lessonAlreadyCompleted = userLessonService.existsByUserIdAndLessonId(userId, lessonId);
            if (!lessonAlreadyCompleted) {
                int xpChange = isCorrect ? 5 : -2;
                user.setXp(user.getXp() + xpChange);
                userService.saveUser(user);
                response.setXpChange(xpChange);
            } else {
                response.setXpChange(0);
            }

            if (testIndex == tests.size() - 1 && !lessonAlreadyCompleted) {
                UserLesson userLesson = new UserLesson(user, lessonOpt.get());
                userLesson.setCompletedAt(LocalDateTime.now());
                userLessonService.save(userLesson);
                response.setLessonCompleted(true);
            } else if (lessonAlreadyCompleted) {
                response.setLessonCompleted(true);
            } else {
                response.setLessonCompleted(false);
            }
        } else {
            response.setXpChange(0);
            response.setLessonCompleted(false);
        }

        return ResponseEntity.ok(response);
    }
}