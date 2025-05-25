import api from './axios';

export const getAllLessons = (userId, token) =>
  api.get(`/lessons?userId=${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getLessonById = (id) => api.get(`/lessons/${id}`);
export const submitTestAnswer = (lessonId, testIndex, answer, token) =>
  api.post(`/lessons/${lessonId}/tests/${testIndex}`, answer, {
    headers: { Authorization: `Bearer ${token}` },
  });
