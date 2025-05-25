import api from './axios';

export const getAllLessons = () => api.get('/lessons');
export const getLessonById = (id) => api.get(`/lessons/${id}`);
export const submitTestAnswer = (lessonId, testIndex, answer, token) =>
  api.post(`/lessons/${lessonId}/tests/${testIndex}`, answer, {
    headers: { Authorization: `Bearer ${token}` },
  });
