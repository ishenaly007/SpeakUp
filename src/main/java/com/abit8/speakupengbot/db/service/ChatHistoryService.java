package com.abit8.speakupengbot.db.service;

import com.abit8.speakupengbot.db.entity.ChatHistory;
import com.abit8.speakupengbot.db.repository.ChatHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatHistoryService {
    private final ChatHistoryRepository chatHistoryRepository;

    public ChatHistoryService(ChatHistoryRepository chatHistoryRepository) {
        this.chatHistoryRepository = chatHistoryRepository;
    }

    @Transactional
    public void saveChatMessage(Long userId, String message, boolean isUserMessage, String aiModel) {
        ChatHistory chatHistory = new ChatHistory(userId, message, isUserMessage, aiModel);
        chatHistoryRepository.save(chatHistory);
    }

    public List<ChatHistory> getRecentChatHistory(Long userId, int limit) {
        return chatHistoryRepository.findTopNByUserIdOrderByCreatedAtDesc(userId, limit);
    }

    public List<ChatHistory> getFullChatHistory(Long userId) {
        return chatHistoryRepository.findAllByUserIdOrderByCreatedAtAsc(userId);
    }
}