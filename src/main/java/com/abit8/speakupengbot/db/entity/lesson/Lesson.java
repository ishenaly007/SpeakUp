package com.abit8.speakupengbot.db.entity.lesson;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "lessons")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "level", nullable = false)
    private String level;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "note")
    private String note;

    @Column(name = "telegraph_url")
    private String telegraphUrl; // Ссылка на Telegraph

    @Column(name = "html_content", columnDefinition = "TEXT")
    private String htmlContent; // HTML для сайта

    @Column(name = "css_content", columnDefinition = "TEXT")
    private String cssContent; // CSS для сайта

    @Column(name = "javascript_content", columnDefinition = "TEXT")
    private String javascriptContent; // JavaScript для сайта

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Test> tests;

    public Lesson() {}

    public Lesson(String title, String level, String description, String note, String telegraphUrl, String htmlContent, String cssContent, String javascriptContent) {
        this.title = title;
        this.level = level;
        this.description = description;
        this.note = note;
        this.telegraphUrl = telegraphUrl;
        this.htmlContent = htmlContent;
        this.cssContent = cssContent;
        this.javascriptContent = javascriptContent;
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public String getTelegraphUrl() { return telegraphUrl; }
    public void setTelegraphUrl(String telegraphUrl) { this.telegraphUrl = telegraphUrl; }
    public String getHtmlContent() { return htmlContent; }
    public void setHtmlContent(String htmlContent) { this.htmlContent = htmlContent; }
    public String getCssContent() { return cssContent; }
    public void setCssContent(String cssContent) { this.cssContent = cssContent; }
    public String getJavascriptContent() { return javascriptContent; }
    public void setJavascriptContent(String javascriptContent) { this.javascriptContent = javascriptContent; }
    public List<Test> getTests() { return tests; }
    public void setTests(List<Test> tests) { this.tests = tests; }
}