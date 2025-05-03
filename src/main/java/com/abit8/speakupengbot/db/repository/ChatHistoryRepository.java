package com.abit8.speakupengbot.db.repository;

import com.abit8.speakupengbot.db.entity.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    @Query("SELECT ch FROM ChatHistory ch WHERE ch.userId = :userId ORDER BY ch.createdAt DESC LIMIT :limit")
    List<ChatHistory> findTopNByUserIdOrderByCreatedAtDesc(Long userId, int limit);

    List<ChatHistory> findAllByUserIdOrderByCreatedAtAsc(Long userId);
}