package com.abit8.speakupengbot.db.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "telegram_chat_id", unique = true)
    private Long telegramChatId;

    @Column(name = "username")
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(name = "level") // Уровень пользователя (A1-C2)
    private LanguageLevel level;

    @Column(name = "xp") // Очки опыта
    private int xp = 0;

    @Column(name = "keys") // Ключи для доп. квизов
    private int keys = 0;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {}

    public User(Long telegramChatId, String username, LocalDateTime createdAt) {
        this.telegramChatId = telegramChatId;
        this.username = username;
        this.createdAt = createdAt;
    }

    public int calculateLevel() {
        int xp = this.getXp();
        int level = 1;
        double requiredXp = 100; // Базовый XP для уровня 2
        while (xp >= requiredXp) {
            xp -= (int) requiredXp;
            requiredXp *= 1.25; // Увеличение на 25% для следующего уровня
            level++;
        }
        return level;
    }

    public int getRemainingXpForNextLevel() {
        int xp = this.getXp();
        double requiredXp = 100;
        while (xp >= requiredXp) {
            xp -= (int) requiredXp;
            requiredXp *= 1.25;
        }
        return (int) requiredXp - xp; // Сколько осталось до следующего уровня
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public Long getTelegramChatId() { return telegramChatId; }
    public void setTelegramChatId(Long telegramChatId) { this.telegramChatId = telegramChatId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public LanguageLevel getLevel() { return level; }
    public void setLevel(LanguageLevel level) { this.level = level; }
    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }
    public int getKeys() { return keys; }
    public void setKeys(int keys) { this.keys = keys; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}