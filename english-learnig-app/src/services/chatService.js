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
    return response.data; // Should be List<ChatHistoryResponse>
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error.response?.data || { message: 'Failed to fetch chat history' };
  }
};
