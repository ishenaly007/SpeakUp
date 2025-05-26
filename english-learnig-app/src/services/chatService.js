import apiClient from './api';

export const sendMessageToAI = async (userId, message) => {
    try {
        const response = await apiClient.post('/chat', { userId, message });
        return response.data; // Should be SendMessageResponse { message: "AI response" }
    } catch (error) {
        console.error('Error sending message to AI:', error);
        throw error.response?.data || { message: 'Failed to send message' };
    }
};

export const fetchChatHistory = async (userId) => {
    try {
        const response = await apiClient.get(`/chat/${userId}/history`);
        // Проверяем, является ли ответ пустым массивом
        if (Array.isArray(response.data)) {
            return response.data; // Возвращаем пустой массив или список сообщений
        }
        throw new Error('Invalid response format');
    } catch (error) {
        console.error('Error fetching chat history:', error);
        // Возвращаем пустой массив вместо ошибки, если история недоступна
        return [];
    }
};