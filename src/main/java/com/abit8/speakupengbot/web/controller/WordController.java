package com.abit8.speakupengbot.web.controller;

import com.abit8.speakupengbot.db.entity.Word;
import com.abit8.speakupengbot.db.service.WordService;
import com.abit8.speakupengbot.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/words")
public class WordController {

    @Autowired
    private WordService wordService;

    @Autowired
    private TranslationService translationService;

    private static final Pattern CYRILLIC_PATTERN = Pattern.compile("[\\p{IsCyrillic}]");

    @GetMapping("/daily")
    public ResponseEntity<Word> getWordOfDay() {
        Word word = wordService.getRandomWord();
        if (word == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(word);
    }

    @PostMapping("/translate")
    public ResponseEntity<String> translate(@RequestBody String text) {
        if (CYRILLIC_PATTERN.matcher(text).find()) {
            return ResponseEntity.badRequest().body("Please enter text in English");
        }

        String trimmedText = text.trim();
        Optional<Word> foundWord = wordService.findWordByEnglish(trimmedText);
        if (foundWord.isPresent()) {
            return ResponseEntity.ok(foundWord.get().getRussian());
        }

        String translation = translationService.translate(trimmedText);
        return translation != null ? ResponseEntity.ok(translation) : ResponseEntity.status(500).body("Translation failed");
    }
}