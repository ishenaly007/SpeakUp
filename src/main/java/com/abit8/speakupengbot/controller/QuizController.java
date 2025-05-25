package com.abit8.speakupengbot.controller;

import com.abit8.speakupengbot.db.entity.QuizResult;
import com.abit8.speakupengbot.db.entity.User;
import com.abit8.speakupengbot.db.entity.Word;
import com.abit8.speakupengbot.db.service.QuizService;
import com.abit8.speakupengbot.db.service.UserService;
import com.abit8.speakupengbot.db.service.WordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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
    public ResponseEntity<Map<String, Object>> getQuizResults(@PathVariable Long userId) {
        Optional<User> userOpt = userService.getUserById(userId);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        User user = userOpt.get();
        List<QuizResult> results = quizService.getQuizResults(user);
        List<Map<String, Object>> resultList = new ArrayList<>();
        for (QuizResult result : results) {
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("id", result.getId());
            resultMap.put("score", result.getScore());
            resultMap.put("totalQuestions", result.getTotalQuestions());
            resultMap.put("completedAt", result.getCompletedAt().toString());
            resultMap.put("winrate", String.format("%d%%", (result.getScore() * 100 / result.getTotalQuestions())));
            resultList.add(resultMap);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("results", resultList);
        response.put("totalQuizzes", quizService.getTotalQuizzes(user));
        response.put("totalWinrate", quizService.getTotalWinrate(user));
        return ResponseEntity.ok(response);
    }

    // Запуск новой викторины
    @PostMapping("/{userId}/start")
    public ResponseEntity<Map<String, Object>> startQuiz(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        Optional<User> userOpt = userService.getUserById(userId);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        User user = userOpt.get();
        String theme = request.get("theme"); // Тема необязательна
        List<Word> quizWords = new ArrayList<>();
        Set<String> usedWords = new HashSet<>();
        int totalQuestions = 10;

        // Собираем 10 уникальных слов для викторины
        for (int i = 0; i < totalQuestions; i++) {
            Word word = theme != null ? wordService.getRandomWordByTheme(theme) : wordService.getRandomWord();
            if (word == null || usedWords.contains(word.getEnglish())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Not enough unique words" + (theme != null ? " for theme: " + theme : "")));
            }
            quizWords.add(word);
            usedWords.add(word.getEnglish());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("quizId", UUID.randomUUID().toString()); // Уникальный идентификатор викторины
        response.put("userId", userId);
        response.put("totalQuestions", totalQuestions);
        response.put("theme", theme != null ? theme : "general");
        List<Map<String, Object>> questions = new ArrayList<>();
        for (int i = 0; i < quizWords.size(); i++) {
            Word word = quizWords.get(i);
            Map<String, Object> question = new HashMap<>();
            question.put("questionNumber", i + 1);
            question.put("englishWord", word.getEnglish());
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
                return ResponseEntity.badRequest().body(Map.of("error", "Not enough unique answer options" + (theme != null ? " for theme: " + theme : "")));
            }
            Collections.shuffle(options);
            question.put("options", options);
            question.put("correctAnswer", word.getRussian());
            questions.add(question);
        }
        response.put("questions", questions);
        return ResponseEntity.ok(response);
    }

    // Сохранение результата викторины
    @PostMapping("/{userId}/submit")
    public ResponseEntity<Map<String, Object>> submitQuiz(@PathVariable Long userId, @RequestBody Map<String, Object> request) {
        Optional<User> userOpt = userService.getUserById(userId);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        User user = userOpt.get();
        Integer score = (Integer) request.get("score");
        Integer totalQuestions = (Integer) request.get("totalQuestions");
        List<Map<String, String>> correctWordsData = (List<Map<String, String>>) request.get("correctWords");
        if (score == null || totalQuestions == null || correctWordsData == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid request data"));
        }

        List<Word> correctWords = new ArrayList<>();
        for (Map<String, String> wordData : correctWordsData) {
            String english = wordData.get("english");
            Optional<Word> wordOpt = wordService.findWordByEnglish(english);
            if (wordOpt.isPresent()) {
                correctWords.add(wordOpt.get());
            }
        }

        quizService.saveQuizResult(user, score, totalQuestions, correctWords);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Quiz result saved");
        response.put("score", score);
        response.put("totalQuestions", totalQuestions);
        response.put("xpEarned", score + (score == totalQuestions ? 5 : 0));
        response.put("winrate", String.format("%d%%", (score * 100 / totalQuestions)));
        return ResponseEntity.ok(response);
    }
}