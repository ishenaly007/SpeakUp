package com.abit8.speakupengbot.db.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_histories")
public class ChatHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "is_user_message", nullable = false)
    private boolean isUserMessage;

    @Column(name = "ai_model", nullable = false)
    private String aiModel;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ChatHistory() {}

    public ChatHistory(Long userId, String message, boolean isUserMessage, String aiModel) {
        this.userId = userId;
        this.message = message;
        this.isUserMessage = isUserMessage;
        this.aiModel = aiModel;
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public boolean isUserMessage() { return isUserMessage; }
    public void setUserMessage(boolean userMessage) { isUserMessage = userMessage; }
    public String getAiModel() { return aiModel; }
    public void setAiModel(String aiModel) { this.aiModel = aiModel; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}