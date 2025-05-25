package com.abit8.speakupengbot.dto;

import jakarta.validation.constraints.NotBlank;

public class WordData {
    @NotBlank(message = "English word is required")
    private String english;

    // Геттеры и сеттеры
    public String getEnglish() {
        return english;
    }

    public void setEnglish(String english) {
        this.english = english;
    }
}