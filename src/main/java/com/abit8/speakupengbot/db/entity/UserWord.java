package com.abit8.speakupengbot.db.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_words")
public class UserWord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "word_id", nullable = false)
    private Word word;

    @Column(name = "learned_at", nullable = false)
    private LocalDateTime learnedAt = LocalDateTime.now();

    public UserWord() {}

    public UserWord(User user, Word word) {
        this.user = user;
        this.word = word;
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Word getWord() { return word; }
    public void setWord(Word word) { this.word = word; }
    public LocalDateTime getLearnedAt() { return learnedAt; }
    public void setLearnedAt(LocalDateTime learnedAt) { this.learnedAt = learnedAt; }
}