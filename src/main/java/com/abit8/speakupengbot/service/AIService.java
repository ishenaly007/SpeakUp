//package com.abit8.speakupengbot.service;
//
//import com.abit8.speakupengbot.db.entity.User;
//import com.abit8.speakupengbot.db.entity.ChatHistory;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpMethod;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.List;
//
//@Service
//public class AIService {
//    private final RestTemplate restTemplate = new RestTemplate();
//
//    @Value("${xai.api.key}")
//    private String xaiApiKey;
//
//    @Value("${openai.api.key}")
//    private String openaiApiKey;
//
//    public String getAIResponse(User user, String userMessage, List<ChatHistory> chatHistory, String aiModel) {
//        String prompt = buildPrompt(user, userMessage, chatHistory);
//        if ("GROK".equalsIgnoreCase(aiModel)) {
//            return callGrokAPI(prompt);
//        } else {
//            return callOpenAIAPI(prompt);
//        }
//    }
//
//    private String buildPrompt(User user, String userMessage, List<ChatHistory> chatHistory) {
//        StringBuilder prompt = new StringBuilder();
//        prompt.append("Ты — преподаватель английского языка для пользователя по имени ")
//                .append(user.getUsername() != null ? user.getUsername() : "Пользователь")
//                .append(" с уровнем английского ")
//                .append(user.getLevel() != null ? user.getLevel() : "неизвестен")
//                .append(". Адаптируй ответы под его уровень, сосредоточься на обучении английскому через диалог, новые слова или грамматику. Делай ответы краткими и образовательными.\n\n");
//
//        if (!chatHistory.isEmpty()) {
//            prompt.append("Недавний диалог:\n");
//            for (ChatHistory history : chatHistory) {
//                prompt.append(history.isUserMessage() ? "Пользователь: " : "ИИ: ")
//                        .append(history.getMessage())
//                        .append("\n");
//            }
//        }
//
//        prompt.append("Пользователь: ").append(userMessage).append("\nИИ: ");
//        return prompt.toString();
//    }
//
//    private String callGrokAPI(String prompt) {
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", "Bearer " + xaiApiKey);
//        headers.set("Content-Type", "application/json");
//
//        String requestBody = "{\"prompt\": \"" + escapeJson(prompt) + "\", \"model\": \"grok\"}";
//        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
//
//        try {
//            ResponseEntity<String> response = restTemplate.exchange(
//                    "https://api.x.ai/v1/chat/completions",
//                    HttpMethod.POST,
//                    entity,
//                    String.class
//            );
//            return extractResponse(response.getBody());
//        } catch (Exception e) {
//            return "Извини, не удалось связаться с ИИ. Попробуй позже.";
//        }
//    }
//
//    private String callOpenAIAPI(String prompt) {
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", "Bearer " + openaiApiKey);
//        headers.set("Content-Type", "application/json");
//
//        String requestBody = "{\"model\": \"gpt-4o-mini\", \"messages\": [{\"role\": \"user\", \"content\": \"" + escapeJson(prompt) + "\"}]}";
//        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
//
//        try {
//            ResponseEntity<String> response = restTemplate.exchange(
//                    "https://api.openai.com/v1/chat/completions",
//                    HttpMethod.POST,
//                    entity,
//                    String.class
//            );
//            return extractResponse(response.getBody());
//        } catch (Exception e) {
//            return "Извини, не удалось связаться с ИИ. Попробуй позже.";
//        }
//    }
//
//    private String escapeJson(String input) {
//        return input.replace("\"", "\\\"").replace("\n", "\\n");
//    }
//
//    private String extractResponse(String responseBody) {
//        // Упрощённый парсинг ответа (нужно адаптировать под реальный формат API)
//        return responseBody.contains("\"content\":") ? responseBody.split("\"content\":")[1].split("}")[0].replace("\\n", "\n").trim() : "Ошибка парсинга ответа";
//    }
//}