package com.abit8.speakupengbot.controller;

import com.abit8.speakupengbot.db.entity.LanguageLevel;
import com.abit8.speakupengbot.db.entity.User;
import com.abit8.speakupengbot.db.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Регистрация/логин пользователя
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        Long telegramChatId = Long.parseLong(request.get("telegramChatId"));
        String telegramUsername = request.get("telegramUsername");

        User user = userService.registerTelegramUser(telegramChatId, telegramUsername);
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("level", user.getLevel() != null ? user.getLevel().toString() : "A1_A2");
        response.put("xp", user.getXp());
        response.put("calculatedLevel", user.calculateLevel());
        return ResponseEntity.ok(response);
    }

    // Получение профиля
    @GetMapping("/{userId}/profile")
    public ResponseEntity<Map<String, Object>> getProfile(@PathVariable Long userId) {
        Optional<User> userOpt = userService.getUserById(userId);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        User user = userOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("level", user.getLevel() != null ? user.getLevel().toString() : "A1_A2");
        response.put("xp", user.getXp());
        response.put("calculatedLevel", user.calculateLevel());
        response.put("remainingXp", user.getRemainingXpForNextLevel());
        response.put("createdAt", user.getCreatedAt().toString());
        return ResponseEntity.ok(response);
    }

    // Обновление уровня
    @PutMapping("/{userId}/level")
    public ResponseEntity<Map<String, Object>> updateLevel(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        Optional<User> userOpt = userService.loginTelegramUser(userId);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        User user = userOpt.get();
        String level = request.get("level");
        try {
            user.setLevel(LanguageLevel.valueOf(level));
            userService.saveUser(user);
            return ResponseEntity.ok(Map.of("message", "Level updated", "level", level));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid level"));
        }
    }
}