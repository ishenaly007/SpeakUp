package com.abit8.speakupengbot.controller;

import com.abit8.speakupengbot.db.entity.ChatHistory;
import com.abit8.speakupengbot.db.entity.LanguageLevel;
import com.abit8.speakupengbot.db.entity.User;
import com.abit8.speakupengbot.db.service.ChatHistoryService;
import com.abit8.speakupengbot.db.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatHistoryService chatHistoryService;
    private final UserService userService;
    private final WebClient webClient;

    public ChatController(ChatHistoryService chatHistoryService, UserService userService, WebClient.Builder webClient) {
        this.chatHistoryService = chatHistoryService;
        this.userService = userService;
        this.webClient = webClient.baseUrl("https://openrouter.ai/api/v1").build();
    }

    @Value("${openrouter.api.key}")
    private String openRouterApiKey;

    private static final int MAX_TOKENS = 1000;

    // Отправка сообщения в чат
    @PostMapping
    public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody Map<String, String> request) {
        Long userId = Long.parseLong(request.get("userId"));
        String userMessage = request.get("message");
        String aiModel = "microsoft/mai-ds-r1:free";

        chatHistoryService.saveChatMessage(userId, userMessage, true, aiModel);

        // Получаем уровень пользователя
        LanguageLevel userLevel = userService.loginTelegramUser(userId)
                .map(User::getLevel)
                .orElse(LanguageLevel.A1);

        // Формируем историю чата
        List<ChatHistory> history = chatHistoryService.getRecentChatHistory(userId, 15);
        StringBuilder historyBlock = new StringBuilder();
        int totalChars = 0;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
        // Переворачиваем историю, чтобы старые сообщения шли первыми
        for (int i = history.size() - 1; i >= 0; i--) {
            ChatHistory entry = history.get(i);
            String time = entry.getCreatedAt().format(formatter);
            String prefix = entry.isUserMessage() ? "Пользователь" : "Бот";
            String line = String.format("[%s, %s]: %s", prefix, time, entry.getMessage());
            historyBlock.append(line).append("\n");
            totalChars += entry.getMessage().length();
            if (totalChars > MAX_TOKENS * 4) break;
        }

        // Формируем промпт
        String nowTime = LocalDateTime.now().format(formatter);
        String systemPrompt = String.format(
                "Ты — система, управляющая ботом, моим другом и учителем английского для уровня %s. Сейчас %s. " +
                "Говори от имени бота, как человек: просто, с позитивом и легким юмором. " +
                "Объясняй грамматику и слова на русском, как будто мы тусим, максимум 100 слов. " +
                "В диалогах — коротко, 20-30 слов, с намеком на английский. Если я про 'пока' или погоду, будь дружелюбным, кинь английскую фишку, без уроков. " +
                "Мотивируй учиться! Форматируй ответ в MarkdownV2, экранируй символы \\* \\_ \\[ \\] \\( \\) \\~ \\` \\> \\# \\+ \\- \\= \\| \\{ \\} \\. \\!. " +
                "Пример: \\*bold\\* для жирного, \\_italic\\_ для курсива, \\[text\\]\\(url\\) для ссылок.\n\n" +
                "История чата:\n%s---\n\n" +
                "Мой вопрос: %s\n\n" +
                "Знай историю, но отвечай на мой вопрос. Если продолжаю тему — подхвати, иначе веди за мной. Будь бро и учи с кайфом!",
                userLevel,
                nowTime,
                historyBlock.length() > 0 ? historyBlock.toString() : "Пока не трындел с тобой, начнем с нуля!\n",
                userMessage
        );

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));

        Map<String, Object> body = new HashMap<>();
        body.put("model", aiModel);
        body.put("messages", messages);

        // Вызов OpenRouter API
        String aiResponse = "Эй, что\\-то пошло не так, давай еще разок\\? 😎";
        int maxRetries = 2;
        int retryCount = 0;
        boolean success = false;

        while (retryCount <= maxRetries && !success) {
            try {
                Mono<Map> responseMono = webClient.post()
                        .uri("/chat/completions")
                        .header("Authorization", "Bearer " + openRouterApiKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(body)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .timeout(Duration.ofSeconds(70));

                Map responseBody = responseMono.block();
                if (responseBody != null && responseBody.containsKey("choices")) {
                    List<Map> choices = (List<Map>) responseBody.get("choices");
                    if (!choices.isEmpty()) {
                        Map choice = choices.get(0);
                        Map message = (Map) choice.get("message");
                        aiResponse = (String) message.get("content");
                        success = true;
                    }
                }
            } catch (Exception e) {
                retryCount++;
                if (retryCount > maxRetries) {
                    aiResponse = retryCount == 1 ? "API подвис, дай минутку\\!" : "Не могу достучаться до ИИ, попробуй позже\\!";
                } else {
                    try {
                        Thread.sleep(1000 * retryCount);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
        }

        chatHistoryService.saveChatMessage(userId, aiResponse, false, aiModel);

        Map<String, Object> response = new HashMap<>();
        response.put("message", aiResponse);
        return ResponseEntity.ok(response);
    }

    // Получение истории чата
    @GetMapping("/{userId}/history")
    public ResponseEntity<List<Map<String, Object>>> getChatHistory(@PathVariable Long userId) {
        List<ChatHistory> history = chatHistoryService.getRecentChatHistory(userId, 15);
        // Переворачиваем историю, чтобы старые сообщения шли первыми
        List<Map<String, Object>> response = new ArrayList<>();
        for (int i = history.size() - 1; i >= 0; i--) {
            ChatHistory entry = history.get(i);
            Map<String, Object> message = new HashMap<>();
            message.put("isUserMessage", entry.isUserMessage());
            message.put("message", entry.getMessage());
            message.put("createdAt", entry.getCreatedAt().toString());
            response.add(message);
        }
        return ResponseEntity.ok(response);
    }
}