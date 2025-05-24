package com.abit8.speakupengbot.controller;

import com.abit8.speakupengbot.db.entity.User;
import com.abit8.speakupengbot.db.entity.lesson.Lesson;
import com.abit8.speakupengbot.db.entity.lesson.Test;
import com.abit8.speakupengbot.db.entity.lesson.UserLesson;
import com.abit8.speakupengbot.db.service.LessonService;
import com.abit8.speakupengbot.db.service.TestService;
import com.abit8.speakupengbot.db.service.UserLessonService;
import com.abit8.speakupengbot.db.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    public ResponseEntity<List<Map<String, Object>>> getLessons(@RequestParam Long userId) {
        List<Lesson> lessons = lessonService.findAll();
        List<Map<String, Object>> response = lessons.stream().map(lesson -> {
            Map<String, Object> lessonData = new HashMap<>();
            lessonData.put("id", lesson.getId());
            lessonData.put("title", lesson.getTitle());
            lessonData.put("level", lesson.getLevel());
            lessonData.put("description", lesson.getDescription());
            lessonData.put("completed", userLessonService.existsByUserIdAndLessonId(userId, lesson.getId()));
            return lessonData;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<Map<String, Object>> getLesson(@PathVariable Long lessonId, @RequestParam Long userId) {
        Optional<Lesson> lessonOpt = lessonService.findById(lessonId);
        if (!lessonOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lesson not found"));
        }
        Lesson lesson = lessonOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("id", lesson.getId());
        response.put("title", lesson.getTitle());
        response.put("level", lesson.getLevel());
        response.put("description", lesson.getDescription());
        response.put("note", lesson.getNote());
        response.put("htmlContent", lesson.getHtmlContent());
        response.put("cssContent", lesson.getCssContent());
        response.put("completed", userLessonService.existsByUserIdAndLessonId(userId, lesson.getId()));
        List<Test> tests = testService.findByLessonId(lessonId);
        response.put("tests", tests.stream().map(test -> {
            Map<String, Object> testData = new HashMap<>();
            testData.put("id", test.getId());
            testData.put("question", test.getQuestion());
            testData.put("options", test.getOptions());
            return testData;
        }).collect(Collectors.toList()));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{lessonId}/tests/{testIndex}")
    public ResponseEntity<Map<String, Object>> checkTest(
            @PathVariable Long lessonId,
            @PathVariable int testIndex,
            @RequestBody Map<String, Object> request) {
        Long userId = Long.parseLong(request.get("userId").toString());
        String answer = request.get("answer").toString();

        Optional<Lesson> lessonOpt = lessonService.findById(lessonId);
        if (!lessonOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lesson not found"));
        }
        List<Test> tests = testService.findByLessonId(lessonId);
        if (testIndex >= tests.size()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Test index out of bounds"));
        }
        Test test = tests.get(testIndex);
        boolean isCorrect = answer.equals(test.getCorrectOption());

        Map<String, Object> response = new HashMap<>();
        response.put("isCorrect", isCorrect);
        response.put("correctOption", test.getCorrectOption());

        Optional<User> userOpt = userService.loginTelegramUser(userId);
        if (userOpt.isPresent() && !userLessonService.existsByUserIdAndLessonId(userId, lessonId)) {
            User user = userOpt.get();
            int xpChange = isCorrect ? 5 : -2;
            user.setXp(user.getXp() + xpChange);
            userService.saveUser(user);
            response.put("xpChange", xpChange);
        }

        if (testIndex == tests.size() - 1 && isCorrect && userOpt.isPresent()) {
            User user = userOpt.get();
            if (!userLessonService.existsByUserIdAndLessonId(userId, lessonId)) {
                UserLesson userLesson = new UserLesson(user, lessonOpt.get());
                userLesson.setCompletedAt(LocalDateTime.now());
                userLessonService.save(userLesson);
                response.put("lessonCompleted", true);
            }
        }
        return ResponseEntity.ok(response);
    }
}