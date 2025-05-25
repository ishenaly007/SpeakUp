package com.abit8.speakupengbot.dto;

public class CheckTestResponse {
    private Boolean isCorrect;
    private String correctOption;
    private Integer xpChange;
    private Boolean lessonCompleted;

    // Геттеры и сеттеры
    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public String getCorrectOption() {
        return correctOption;
    }

    public void setCorrectOption(String correctOption) {
        this.correctOption = correctOption;
    }

    public Integer getXpChange() {
        return xpChange;
    }

    public void setXpChange(Integer xpChange) {
        this.xpChange = xpChange;
    }

    public Boolean getLessonCompleted() {
        return lessonCompleted;
    }

    public void setLessonCompleted(Boolean lessonCompleted) {
        this.lessonCompleted = lessonCompleted;
    }
}