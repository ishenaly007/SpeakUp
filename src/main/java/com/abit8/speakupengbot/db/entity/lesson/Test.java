package com.abit8.speakupengbot.db.entity.lesson;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "tests")
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(name = "question", nullable = false)
    private String question;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "test_options", joinColumns = @JoinColumn(name = "test_id"))
    @Column(name = "option")
    private List<String> options;

    @Column(name = "correct_option", nullable = false)
    private String correctOption;

    public Test() {}

    public Test(Lesson lesson, String question, List<String> options, String correctOption) {
        this.lesson = lesson;
        this.question = question;
        this.options = options;
        this.correctOption = correctOption;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Lesson getLesson() { return lesson; }
    public void setLesson(Lesson lesson) { this.lesson = lesson; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
    public String getCorrectOption() { return correctOption; }
    public void setCorrectOption(String correctOption) { this.correctOption = correctOption; }
}