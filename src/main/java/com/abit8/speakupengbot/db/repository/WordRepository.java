package com.abit8.speakupengbot.db.repository;

import com.abit8.speakupengbot.db.entity.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WordRepository extends JpaRepository<Word, Long> {
    Optional<Word> findByEnglishIgnoreCase(String english);

    @Query("SELECT w FROM Word w ORDER BY RANDOM() LIMIT 1")
    Word findRandomWord();

    @Query("SELECT w FROM Word w WHERE w.theme = :theme ORDER BY RANDOM() LIMIT 1")
    Word findRandomWordByTheme(String theme);
}