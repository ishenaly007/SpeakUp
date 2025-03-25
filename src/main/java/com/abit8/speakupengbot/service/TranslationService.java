package com.abit8.speakupengbot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class TranslationService {

    @Autowired
    private RestTemplate restTemplate;

    private final String deepLApiKey = System.getenv("DEEPL_API_KEY");
    private final String deepLApiKey2 = System.getenv("DEEPL_API_KEY2"); // Второй ключ
    private final String myMemoryApiKey = System.getenv("MYMEMORY_API_KEY");

    // DTO для ответа DeepL
    private static class DeepLResponse {
        private List<Translation> translations;

        public List<Translation> getTranslations() {
            return translations;
        }

        public void setTranslations(List<Translation> translations) {
            this.translations = translations;
        }
    }

    private static class Translation {
        private String detected_source_language;
        private String text;

        public String getDetectedSourceLanguage() {
            return detected_source_language;
        }

        public void setDetectedSourceLanguage(String detected_source_language) {
            this.detected_source_language = detected_source_language;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }

    // DTO для ответа MyMemory
    private static class MyMemoryResponse {
        private ResponseData responseData;

        public ResponseData getResponseData() {
            return responseData;
        }

        public void setResponseData(ResponseData responseData) {
            this.responseData = responseData;
        }
    }

    private static class ResponseData {
        private String translatedText;
        private double match;

        public String getTranslatedText() {
            return translatedText;
        }

        public void setTranslatedText(String translatedText) {
            this.translatedText = translatedText;
        }

        public double getMatch() {
            return match;
        }

        public void setMatch(double match) {
            this.match = match;
        }
    }

    public String translate(String text) {
        String translation = translateWithDeepL(text, deepLApiKey); // Пробуем первый ключ
        if (translation == null) {
            translation = translateWithDeepL(text, deepLApiKey2); // Пробуем второй ключ
        }
        if (translation == null) {
            translation = translateWithMyMemory(text); // Если оба ключа DeepL не сработали
        }
        return translation;
    }

    private String translateWithDeepL(String text, String apiKey) {
        if (apiKey == null || apiKey.isEmpty()) {
            System.out.println("DeepL API key is not provided");
            return null;
        }

        try {
            String url = "https://api-free.deepl.com/v2/translate";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("Authorization", "DeepL-Auth-Key " + apiKey); // Используем переданный ключ

            // Формируем тело запроса
            String body = "text=" + URLEncoder.encode(text, StandardCharsets.UTF_8) +
                          "&target_lang=RU";
            HttpEntity<String> entity = new HttpEntity<>(body, headers);

            //System.out.println("DeepL URL: " + url);
            //System.out.println("DeepL body: " + body);

            ResponseEntity<DeepLResponse> response = restTemplate.exchange(url, HttpMethod.POST, entity, DeepLResponse.class);
            DeepLResponse deepLResponse = response.getBody();

            if (deepLResponse != null && deepLResponse.getTranslations() != null && !deepLResponse.getTranslations().isEmpty()) {
                String translatedText = deepLResponse.getTranslations().get(0).getText();

                return translatedText;
            }
            System.out.println("DeepL: No translations found in response");
            return null;
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().value() == 456) { // Quota exceeded
                System.out.println("DeepL quota exceeded for key: " + apiKey);
                return null; // Возвращаем null, чтобы попробовать следующий ключ
            }
            System.out.println("DeepL translation failed: " + e.getMessage());
            return null;
        } catch (Exception e) {
            System.out.println("DeepL translation failed: " + e.getMessage());
            return null;
        }
    }

    private String translateWithMyMemory(String text) {
        if (myMemoryApiKey == null || myMemoryApiKey.isEmpty()) {
            System.out.println("MyMemory API key is not provided");
            return null;
        }

        try {
            String encodedText = URLEncoder.encode(text, StandardCharsets.UTF_8);
            String url = "https://api.mymemory.translated.net/get?q=" + encodedText +
                         "&langpair=en|ru&key=" + myMemoryApiKey;

            ResponseEntity<MyMemoryResponse> response = restTemplate.exchange(url, HttpMethod.GET, null, MyMemoryResponse.class);
            MyMemoryResponse myMemoryResponse = response.getBody();

            if (myMemoryResponse != null && myMemoryResponse.getResponseData() != null) {
                String translatedText = myMemoryResponse.getResponseData().getTranslatedText();
                String decodedText = URLDecoder.decode(translatedText, StandardCharsets.UTF_8);

                if (myMemoryResponse.getResponseData().getMatch() < 0.9 || decodedText.contains(text)) {
                    System.out.println("MyMemory: Translation quality too low or no translation occurred");
                    return null;
                }
                return decodedText;
            }
            System.out.println("MyMemory: No translation found in response");
            return null;
        } catch (Exception e) {
            System.out.println("MyMemory translation failed: " + e.getMessage());
            return null;
        }
    }
}