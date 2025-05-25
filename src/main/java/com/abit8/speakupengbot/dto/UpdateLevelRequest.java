package com.abit8.speakupengbot.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateLevelRequest {
    @NotBlank(message = "Level is required")
    private String level;

    // Геттеры и сеттеры
    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}