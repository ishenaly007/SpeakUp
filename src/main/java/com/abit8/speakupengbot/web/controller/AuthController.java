//package com.abit8.speakupengbot.web.controller;
//
//import com.abit8.speakupengbot.db.entity.User;
//import com.abit8.speakupengbot.db.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//
//    @Autowired
//    private UserService userService;
//
//    // Регистрация через сайт
//    @PostMapping("/register")
//    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
//        try {
//            userService.registerWebUser(request.getEmail(), request.getUsername(), request.getPassword());
//            return ResponseEntity.ok("Регистрация успешна. Пожалуйста, подтвердите свою почту.");
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
//
//    // Подтверждение почты
//    @PostMapping("/confirm")
//    public ResponseEntity<String> confirmEmail(@RequestBody ConfirmRequest request) {
//        boolean confirmed = userService.confirmEmail(request.getEmail(), request.getCode());
//        if (confirmed) {
//            return ResponseEntity.ok("Почта подтверждена.");
//        } else {
//            return ResponseEntity.badRequest().body("Неверный код или email.");
//        }
//    }
//
//    // Авторизация через сайт
//    @PostMapping("/login")
//    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
//        Optional<User> userOpt = userService.loginWebUser(request.getEmail(), request.getPassword());
//        if (userOpt.isPresent()) {
//            User user = userOpt.get();
//            if (user.isEmailConfirmed()) {
//                return ResponseEntity.ok("Авторизация успешна.");
//            } else {
//                return ResponseEntity.status(403).body("Почта не подтверждена.");
//            }
//        } else {
//            return ResponseEntity.status(401).body("Неверный email или пароль.");
//        }
//    }
//}
//
//// DTO для запросов
//class RegisterRequest {
//    private String email;
//    private String username;
//    private String password;
//
//    public String getEmail() { return email; }
//    public void setEmail(String email) { this.email = email; }
//    public String getUsername() { return username; }
//    public void setUsername(String username) { this.username = username; }
//    public String getPassword() { return password; }
//    public void setPassword(String password) { this.password = password; }
//}
//
//class ConfirmRequest {
//    private String email;
//    private String code;
//
//    public String getEmail() { return email; }
//    public void setEmail(String email) { this.email = email; }
//    public String getCode() { return code; }
//    public void setCode(String code) { this.code = code; }
//}
//
//class LoginRequest {
//    private String email;
//    private String password;
//
//    public String getEmail() { return email; }
//    public void setEmail(String email) { this.email = email; }
//    public String getPassword() { return password; }
//    public void setPassword(String password) { this.password = password; }
//}