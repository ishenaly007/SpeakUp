package com.abit8.speakupengbot.db.service;

import com.abit8.speakupengbot.db.entity.User;
import com.abit8.speakupengbot.db.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerTelegramUser(Long telegramChatId, String telegramUsername) {
        Optional<User> existingUser = userRepository.findByTelegramChatId(telegramChatId);
        if (existingUser.isPresent()) {
            return existingUser.get();
        }
        User user = new User(telegramChatId, telegramUsername != null ? "@" + telegramUsername : "Unknown", java.time.LocalDateTime.now());
        return userRepository.save(user);
    }

    public Optional<User> loginTelegramUser(Long telegramChatId) {
        return userRepository.findByTelegramChatId(telegramChatId);
    }

    public String getUsernameById(long chatId) {
        Optional<User> user = loginTelegramUser(chatId);
        return user.map(User::getUsername).orElse("Unknown");
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
}