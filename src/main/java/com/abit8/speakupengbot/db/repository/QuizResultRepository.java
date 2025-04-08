package com.abit8.speakupengbot.db.repository;

import com.abit8.speakupengbot.db.entity.QuizResult;
import com.abit8.speakupengbot.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByUser(User user);
}