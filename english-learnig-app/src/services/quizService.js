import apiClient from './api';

export const startQuiz = async (userId, theme = null) => {
  try {
    const response = await apiClient.post(`/quizzes/${userId}/start`, { theme });
    return response.data;
  } catch (error) {
    console.error('Error starting quiz:', error);
    throw error.response?.data || { message: 'Failed to start quiz' };
  }
};

export const submitQuiz = async (userId, score, totalQuestions, correctWords) => {
  try {
    const payload = { score, totalQuestions, correctWords };
    const response = await apiClient.post(`/quizzes/${userId}/submit`, payload);
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error.response?.data || { message: 'Failed to submit quiz' };
  }
};

export const fetchQuizResults = async (userId) => {
  try {
    const response = await apiClient.get(`/quizzes/${userId}/results`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    throw error.response?.data || { message: 'Failed to fetch quiz results' };
  }
};
