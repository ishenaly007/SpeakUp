package com.abit8.speakupengbot.db.repository;

import com.abit8.speakupengbot.db.entity.QuizResult;
import com.abit8.speakupengbot.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    // Найти все результаты пользователя
    List<QuizResult> findByUser(User user);

    // Найти последние N результатов пользователя, отсортированные по дате завершения
    @Query("SELECT qr FROM QuizResult qr WHERE qr.user = :user ORDER BY qr.completedAt DESC LIMIT :limit")
    List<QuizResult> findTopNByUserOrderByCompletedAtDesc(User user, int limit);
}