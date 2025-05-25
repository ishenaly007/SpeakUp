import api from './axios';

export const startQuiz = (userId, data, token) =>
  api.post(`/quizzes/${userId}/start`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

export const submitQuiz = (userId, resultData, token) =>
  api.post(`/quizzes/${userId}/submit`, resultData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });


export const getQuizResults = (userId, token) =>
  api.get(`/quizzes/${userId}/results`, {
    headers: { Authorization: `Bearer ${token}` },
  });
