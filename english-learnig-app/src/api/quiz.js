import api from './axios';

export const startQuiz = (userId, token) =>
  api.post(`/quizzes/${userId}/start`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const submitQuiz = (userId, answers, token) =>
  api.post(`/quizzes/${userId}/submit`, { answers }, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getQuizResults = (userId, token) =>
  api.get(`/quizzes/${userId}/results`, {
    headers: { Authorization: `Bearer ${token}` },
  });
