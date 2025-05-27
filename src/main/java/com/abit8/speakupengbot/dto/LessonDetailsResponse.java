package com.abit8.speakupengbot.dto;

import java.util.List;

public class LessonDetailsResponse {
    private Long id;
    private String title;
    private String level;
    private String description;
    private String note;
    private String htmlContent;
    private String cssContent;
    private String javascriptContent;
    private Boolean completed;
    private List<TestData> tests;

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getHtmlContent() {
        return htmlContent;
    }

    public void setHtmlContent(String htmlContent) {
        this.htmlContent = htmlContent;
    }

    public String getCssContent() {
        return cssContent;
    }

    public void setCssContent(String cssContent) {
        this.cssContent = cssContent;
    }

    public String getJavascriptContent() {
        return javascriptContent;
    }

    public void setJavascriptContent(String javascriptContent) {
        this.javascriptContent = javascriptContent;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public List<TestData> getTests() {
        return tests;
    }

    public void setTests(List<TestData> tests) {
        this.tests = tests;
    }
}