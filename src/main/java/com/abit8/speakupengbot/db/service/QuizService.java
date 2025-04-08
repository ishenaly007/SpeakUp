package com.abit8.speakupengbot.db.service;

import com.abit8.speakupengbot.db.entity.*;
import com.abit8.speakupengbot.db.repository.QuizResultRepository;
import com.abit8.speakupengbot.db.repository.UserWordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {
    @Autowired
    private QuizResultRepository quizResultRepository;

    @Autowired
    private UserWordRepository userWordRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private WordService wordService;

    public void saveQuizResult(User user, int score, int totalQuestions, List<Word> correctWords) {
        QuizResult result = new QuizResult(user, score, totalQuestions, java.time.LocalDateTime.now());
        quizResultRepository.save(result);

        // Начисление XP
        int xp = score;
        int bonusXp = (score == totalQuestions) ? 5 : 0; // Бонус за 100%
        user.setXp(user.getXp() + xp + bonusXp);
        userService.saveUser(user);

        // Добавление выученных слов
        for (Word word : correctWords) {
            if (!userWordRepository.existsByUserAndWord(user, word)) { // Проверяем, не выучено ли уже
                userWordRepository.save(new UserWord(user, word));
            }
        }
    }

    public int getTotalQuizzes(User user) {
        return quizResultRepository.findByUser(user).size();
    }

    public String getTotalWinrate(User user) {
        var results = quizResultRepository.findByUser(user);
        int totalScore = results.stream().mapToInt(QuizResult::getScore).sum();
        int totalQuestions = results.stream().mapToInt(QuizResult::getTotalQuestions).sum();
        int percentage = totalQuestions > 0 ? (totalScore * 100 / totalQuestions) : 0;
        return String.format("%d/%d (%d%%)", totalScore, totalQuestions, percentage);
    }

    public long getLearnedWordsCount(User user) {
        return userWordRepository.countByUser(user);
    }
}