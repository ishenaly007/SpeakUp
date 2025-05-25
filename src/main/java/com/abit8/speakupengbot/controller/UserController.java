package com.abit8.speakupengbot.controller;

import com.abit8.speakupengbot.db.entity.User;
import com.abit8.speakupengbot.db.entity.LanguageLevel;
import com.abit8.speakupengbot.db.service.UserService;
import com.abit8.speakupengbot.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegisterRequest request) {
        try {
            User user = userService.registerUser(request.getEmail(), request.getUsername(), request.getPassword());
            UserResponse response = new UserResponse();
            response.setId(user.getId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setLevel(user.getLevel() != null ? user.getLevel().toString() : "A1_A2");
            response.setXp(user.getXp());
            response.setCalculatedLevel(String.valueOf(user.calculateLevel()));
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            ErrorResponse error = new ErrorResponse();
            error.setError(e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginRequest request) {
        Optional<User> userOpt = userService.loginUser(request.getEmail(), request.getPassword());
        if (!userOpt.isPresent()) {
            ErrorResponse error = new ErrorResponse();
            error.setError("Invalid email or password");
            return ResponseEntity.badRequest().body(error);
        }

        User user = userOpt.get();
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setLevel(user.getLevel() != null ? user.getLevel().toString() : "A1_A2");
        response.setXp(user.getXp());
        response.setCalculatedLevel(String.valueOf(user.calculateLevel()));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        Optional<User> userOpt = userService.getUserById(userId);
        if (!userOpt.isPresent()) {
            ErrorResponse error = new ErrorResponse();
            error.setError("User not found");
            return ResponseEntity.badRequest().body(error);
        }
        User user = userOpt.get();
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setLevel(user.getLevel() != null ? user.getLevel().toString() : "A1");
        response.setXp(user.getXp());
        response.setCalculatedLevel(String.valueOf(user.calculateLevel()));
        response.setRemainingXp(user.getRemainingXpForNextLevel());
        response.setCreatedAt(user.getCreatedAt().toString());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/level")
    public ResponseEntity<?> updateLevel(@PathVariable Long userId, @Valid @RequestBody UpdateLevelRequest request) {
        Optional<User> userOpt = userService.getUserById(userId);
        if (!userOpt.isPresent()) {
            ErrorResponse error = new ErrorResponse();
            error.setError("User not found");
            return ResponseEntity.badRequest().body(error);
        }
        User user = userOpt.get();
        try {
            user.setLevel(LanguageLevel.valueOf(request.getLevel()));
            userService.saveUser(user);
            UpdateLevelResponse response = new UpdateLevelResponse();
            response.setMessage("Level updated");
            response.setLevel(request.getLevel());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            ErrorResponse error = new ErrorResponse();
            error.setError("Invalid level");
            return ResponseEntity.badRequest().body(error);
        }
    }
}