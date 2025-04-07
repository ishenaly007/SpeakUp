package com.abit8.speakupengbot.db.service;

import com.abit8.speakupengbot.db.entity.User;
import com.abit8.speakupengbot.db.entity.Word;
import com.abit8.speakupengbot.db.repository.UserWordRepository;
import com.abit8.speakupengbot.db.repository.WordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class WordService {

    @Autowired
    private WordRepository wordRepository;
    @Autowired
    private UserWordRepository userWordRepository;

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