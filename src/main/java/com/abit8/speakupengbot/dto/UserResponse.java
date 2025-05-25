package com.abit8.speakupengbot.dto;

public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String level;
    private Integer xp;
    private String calculatedLevel;
    private Integer remainingXp; // Только для profile
    private String createdAt; // Только для profile

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Integer getXp() {
        return xp;
    }

    public void setXp(Integer xp) {
        this.xp = xp;
    }

    public String getCalculatedLevel() {
        return calculatedLevel;
    }

    public void setCalculatedLevel(String calculatedLevel) {
        this.calculatedLevel = calculatedLevel;
    }

    public Integer getRemainingXp() {
        return remainingXp;
    }

    public void setRemainingXp(Integer remainingXp) {
        this.remainingXp = remainingXp;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}