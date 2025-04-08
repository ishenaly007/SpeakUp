package com.abit8.speakupengbot.db.entity;

import com.abit8.speakupengbot.db.entity.nonusesnow.LanguageLevel;
import jakarta.persistence.*;

@Entity
@Table(name = "words")
public class Word {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "word_seq")
    @SequenceGenerator(name = "word_seq", sequenceName = "word_sequence", allocationSize = 1)
    private Long id;

    @Column(name = "english", nullable = false, unique = true)
    private String english;

    @Column(name = "russian", nullable = false)
    private String russian;

    @Column(name = "example_en")
    private String exampleEn;

    @Column(name = "example_ru")
    private String exampleRu;

    @Column(name = "sticker_id")
    private String stickerId;

    @Column(name = "theme")
    private String theme;

    @Enumerated(EnumType.STRING)
    @Column(name = "level") // Уровень слова (A1-C2)
    private LanguageLevel level;

    public Word() {}

    public Word(String english, String russian, String exampleEn, String exampleRu, String stickerId, String theme, LanguageLevel level) {
        this.english = english;
        this.russian = russian;
        this.exampleEn = exampleEn;
        this.exampleRu = exampleRu;
        this.stickerId = stickerId;
        this.theme = theme;
        this.level = level;
    }

    public Long getId() { return id; }
    public String getEnglish() { return english; }
    public void setEnglish(String english) { this.english = english; }
    public String getRussian() { return russian; }
    public void setRussian(String russian) { this.russian = russian; }
    public String getExampleEn() { return exampleEn; }
    public void setExampleEn(String exampleEn) { this.exampleEn = exampleEn; }
    public String getExampleRu() { return exampleRu; }
    public void setExampleRu(String exampleRu) { this.exampleRu = exampleRu; }
    public String getStickerId() { return stickerId; }
    public void setStickerId(String stickerId) { this.stickerId = stickerId; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
    public LanguageLevel getLevel() { return level; }
    public void setLevel(LanguageLevel level) { this.level = level; }
}