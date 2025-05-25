package com.abit8.speakupengbot.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public class SubmitQuizRequest {
    @NotNull(message = "Score is required")
    private Integer score;

    @NotNull(message = "Total questions is required")
    private Integer totalQuestions;

    @NotNull(message = "Correct words are required")
    private List<WordData> correctWords;

    // Геттеры и сеттеры
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

    public List<WordData> getCorrectWords() {
        return correctWords;
    }

    public void setCorrectWords(List<WordData> correctWords) {
        this.correctWords = correctWords;
    }
}