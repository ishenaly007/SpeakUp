package com.abit8.speakupengbot.dto;

public class StartQuizRequest {
    private String theme; // Может быть null

    // Геттеры и сеттеры
    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }
}