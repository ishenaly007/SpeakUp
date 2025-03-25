package com.abit8.speakupengbot.db.service;

import com.abit8.speakupengbot.db.entity.User;
import com.abit8.speakupengbot.db.entity.Word;
import com.abit8.speakupengbot.db.repository.UserWordRepository;
import com.abit8.speakupengbot.db.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Objects;
import java.util.Optional;

@Service
public class WordService {

    @Autowired
    private WordRepository wordRepository;
    @Autowired
    private UserWordRepository userWordRepository;

//    @Transactional
//    public void loadWordsFromFile() {
//        try (BufferedReader br = new BufferedReader(new InputStreamReader(
//                Objects.requireNonNull(getClass().getClassLoader().getResourceAsStream("eng_ru_word_text.txt"))))) {
//            String line;
//            while ((line = br.readLine()) != null) {
//                String[] parts = line.split(";", 6); // Увеличиваем до 6, чтобы учесть theme
//                Word word = new Word();
//                word.setEnglish(parts[0]);
//                word.setRussian(parts[1]);
//                word.setExampleEn(parts.length > 2 ? parts[2] : "");
//                word.setExampleRu(parts.length > 3 ? parts[3] : "");
//                word.setStickerId(parts.length > 4 ? parts[4] : "");
//                word.setTheme(parts.length > 5 ? parts[5] : null); // Устанавливаем тему, если есть
//                wordRepository.save(word);
//            }
//        } catch (Exception e) {
//            System.err.println("Failed to load words: " + e.getMessage());
//        }
//    }

    public Optional<Word> findWordByEnglish(String english) {
        return wordRepository.findByEnglishIgnoreCase(english);
    }

    public Word getRandomWord() {
        return wordRepository.findRandomWord();
    }

    public Word getRandomWordByTheme(String theme) {
        return wordRepository.findRandomWordByTheme(theme);
    }

    @Transactional
    public void updateSticker(String english, String stickerId) {
        Optional<Word> wordOpt = wordRepository.findByEnglishIgnoreCase(english);
        if (wordOpt.isPresent()) {
            Word word = wordOpt.get();
            word.setStickerId(stickerId);
            wordRepository.save(word);
        }
    }

    public long countWordByUser(User user) {
        return userWordRepository.countByUser(user);
    }
}