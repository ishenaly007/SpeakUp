package com.abit8.speakupengbot.controller;

import com.abit8.speakupengbot.db.entity.QuizResult;
import com.abit8.speakupengbot.db.entity.User;
import com.abit8.speakupengbot.db.entity.Word;
import com.abit8.speakupengbot.db.service.QuizService;
import com.abit8.speakupengbot.db.service.UserService;
import com.abit8.speakupengbot.db.service.WordService;
import com.abit8.speakupengbot.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private UserService userService;

    @Autowired
    private WordService wordService;

    // Получение всех результатов квизов пользователя
    @GetMapping("/{userId}/results")
    public ResponseEntity<?> getQuizResults(@PathVariable Long userId) {
        Optional<User> userOpt = userService.getUserById(userId);
        if (!userOpt.isPresent()) {
            ErrorResponse error = new ErrorResponse();
            error.setError("User not found");
            return ResponseEntity.badRequest().body(error);
        }
        User user = userOpt.get();
        List<QuizResult> results = quizService.getQuizResults(user);
        List<QuizResultItem> resultList = results.stream().map(result -> {
            QuizResultItem item = new QuizResultItem();
            item.setId(result.getId());
            item.setScore(result.getScore());
            item.setTotalQuestions(result.getTotalQuestions());
            item.setCompletedAt(result.getCompletedAt().toString());
            item.setWinrate(String.format("%d%%", (result.getScore() * 100 / result.getTotalQuestions())));
            return item;
        }).collect(Collectors.toList());

        QuizResultResponse response = new QuizResultResponse();
        response.setResults(resultList);
        response.setTotalQuizzes(quizService.getTotalQuizzes(user));
        response.setTotalWinrate(quizService.getTotalWinrate(user));
        return ResponseEntity.ok(response);
    }

    // Запуск новой викторины
    @PostMapping("/{userId}/start")
    public ResponseEntity<?> startQuiz(@PathVariable Long userId, @Valid @RequestBody StartQuizRequest request) {
        Optional<User> userOpt = userService.getUserById(userId);
        if (!userOpt.isPresent()) {
            ErrorResponse error = new ErrorResponse();
            error.setError("User not found");
            return ResponseEntity.badRequest().body(error);
        }
        User user = userOpt.get();
        String theme = request.getTheme();
        List<Word> quizWords = new ArrayList<>();
        Set<String> usedWords = new HashSet<>();
        int totalQuestions = 10;

        // Собираем 10 уникальных слов для викторины
        for (int i = 0; i < totalQuestions; i++) {
            Word word = theme != null ? wordService.getRandomWordByTheme(theme) : wordService.getRandomWord();
            if (word == null || usedWords.contains(word.getEnglish())) {
                ErrorResponse error = new ErrorResponse();
                error.setError("Not enough unique words" + (theme != null ? " for theme: " + theme : ""));
                return ResponseEntity.badRequest().body(error);
            }
            quizWords.add(word);
            usedWords.add(word.getEnglish());
        }

        StartQuizResponse response = new StartQuizResponse();
        response.setQuizId(UUID.randomUUID().toString());
        response.setUserId(userId);
        response.setTotalQuestions(totalQuestions);
        response.setTheme(theme != null ? theme : "general");
        List<QuizQuestion> questions = new ArrayList<>();
        for (int i = 0; i < quizWords.size(); i++) {
            Word word = quizWords.get(i);
            QuizQuestion question = new QuizQuestion();
            question.setQuestionNumber(i + 1);
            question.setEnglishWord(word.getEnglish());
            List<String> options = new ArrayList<>();
            options.add(word.getRussian());
            int maxAttempts = 10;
            int attempts = 0;
            while (options.size() < 3 && attempts < maxAttempts) {
                Word wrongWord = theme != null ? wordService.getRandomWordByTheme(theme) : wordService.getRandomWord();
                if (wrongWord != null && !wrongWord.getEnglish().equals(word.getEnglish()) && !usedWords.contains(wrongWord.getEnglish())) {
                    options.add(wrongWord.getRussian());
                }
                attempts++;
            }
            if (options.size() < 3) {
                ErrorResponse error = new ErrorResponse();
                error.setError("Not enough unique answer options" + (theme != null ? " for theme: " + theme : ""));
                return ResponseEntity.badRequest().body(error);
            }
            Collections.shuffle(options);
            question.setOptions(options);
            question.setCorrectAnswer(word.getRussian());
            questions.add(question);
        }
        response.setQuestions(questions);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{userId}/submit")
    public ResponseEntity<?> submitQuiz(@PathVariable Long userId, @Valid @RequestBody SubmitQuizRequest request) {
        Optional<User> userOpt = userService.getUserById(userId);
        if (!userOpt.isPresent()) {
            ErrorResponse error = new ErrorResponse();
            error.setError("User not found");
            return ResponseEntity.badRequest().body(error);
        }
        User user = userOpt.get();
        Integer score = request.getScore();
        Integer totalQuestions = request.getTotalQuestions();
        List<WordData> correctWordsData = request.getCorrectWords();
        if (score == null || totalQuestions == null || correctWordsData == null) {
            ErrorResponse error = new ErrorResponse();
            error.setError("Invalid request data");
            return ResponseEntity.badRequest().body(error);
        }

        List<Word> correctWords = new ArrayList<>();
        for (WordData wordData : correctWordsData) {
            String english = wordData.getEnglish();
            Optional<Word> wordOpt = wordService.findWordByEnglish(english);
            if (wordOpt.isPresent()) {
                correctWords.add(wordOpt.get());
            }
        }

        quizService.saveQuizResult(user, score, totalQuestions, correctWords);

        SubmitQuizResponse response = new SubmitQuizResponse();
        response.setMessage("Quiz result saved");
        response.setScore(score);
        response.setTotalQuestions(totalQuestions);
        response.setXpEarned(score + (score == totalQuestions ? 5 : 0));
        response.setWinrate(String.format("%d%%", (score * 100 / totalQuestions)));
        return ResponseEntity.ok(response);
    }
}