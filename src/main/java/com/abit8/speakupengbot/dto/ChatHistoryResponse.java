package com.abit8.speakupengbot.dto;

public class ChatHistoryResponse {
    private Boolean isUserMessage;
    private String message;
    private String createdAt;

    // Геттеры и сеттеры
    public Boolean getIsUserMessage() {
        return isUserMessage;
    }

    public void setIsUserMessage(Boolean isUserMessage) {
        this.isUserMessage = isUserMessage;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}