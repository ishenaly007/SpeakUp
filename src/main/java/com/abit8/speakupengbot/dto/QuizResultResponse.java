package com.abit8.speakupengbot.dto;

import java.util.List;

public class QuizResultResponse {
    private List<QuizResultItem> results;
    private Integer totalQuizzes;
    private String totalWinrate;

    // Геттеры и сеттеры
    public List<QuizResultItem> getResults() {
        return results;
    }

    public void setResults(List<QuizResultItem> results) {
        this.results = results;
    }

    public Integer getTotalQuizzes() {
        return totalQuizzes;
    }

    public void setTotalQuizzes(Integer totalQuizzes) {
        this.totalQuizzes = totalQuizzes;
    }

    public String getTotalWinrate() {
        return totalWinrate;
    }

    public void setTotalWinrate(String totalWinrate) {
        this.totalWinrate = totalWinrate;
    }
}