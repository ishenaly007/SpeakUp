package com.abit8.speakupengbot.db.service;

import com.abit8.speakupengbot.db.entity.User;
import com.abit8.speakupengbot.db.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User registerUser(String email, String username, String password) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }
        User user = new User(email, username, passwordEncoder.encode(password), java.time.LocalDateTime.now());
        return userRepository.save(user);
    }

    public Optional<User> loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return userOpt;
        }
        return Optional.empty();
    }

    // Для обратной совместимости с Telegram
    public User registerTelegramUser(Long telegramChatId, String telegramUsername) {
        Optional<User> existingUser = userRepository.findByTelegramChatId(telegramChatId);
        if (existingUser.isPresent()) {
            return existingUser.get();
        }
        User user = new User(telegramChatId, null, telegramUsername != null ? "@" + telegramUsername : "Unknown", null, java.time.LocalDateTime.now());
        return userRepository.save(user);
    }

    public Optional<User> loginTelegramUser(Long telegramChatId) {
        return userRepository.findByTelegramChatId(telegramChatId);
    }

    public String getUsernameById(long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(User::getUsername).orElse("Unknown");
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public List<User> findTopUsersByXp(int limit) {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "xp")).stream()
                .limit(limit)
                .collect(Collectors.toList());
    }
}