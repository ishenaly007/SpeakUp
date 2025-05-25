package com.abit8.speakupengbot.db.repository;

import com.abit8.speakupengbot.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByTelegramChatId(Long telegramChatId);
    Optional<User> findByEmail(String email);
}