package com.abit8.speakupengbot.dto;

public class SubmitQuizResponse {
    private String message;
    private Integer score;
    private Integer totalQuestions;
    private Integer xpEarned;
    private String winrate;

    // Геттеры и сеттеры
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getXpEarned() {
        return xpEarned;
    }

    public void setXpEarned(Integer xpEarned) {
        this.xpEarned = xpEarned;
    }

    public String getWinrate() {
        return winrate;
    }

    public void setWinrate(String winrate) {
        this.winrate = winrate;
    }
}