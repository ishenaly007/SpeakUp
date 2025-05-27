import apiClient from './api';

export const fetchLessons = async (userId) => {
  try {
    console.log(`Fetching lessons for userId: ${userId}`);
    const response = await apiClient.get('/lessons', {
      params: { userId }
    });
    console.log('Lessons fetched successfully:', response.data);
    return response.data; // List<LessonResponse>
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error.response?.data || { message: 'Failed to fetch lessons' };
  }
};

export const fetchLesson = async (lessonId, userId) => {
  try {
    console.log(`Fetching lesson details for lessonId: ${lessonId}, userId: ${userId}`);
    const response = await apiClient.get(`/lessons/${lessonId}`, {
      params: { userId }
    });
    console.log('Lesson details fetched successfully:', response.data);
    return response.data; // LessonDetailsResponse
  } catch (error) {
    console.error(`Error fetching lesson details for lesson ${lessonId}:`, error);
    throw error.response?.data || { message: 'Failed to fetch lesson details' };
  }
};

export const submitTestAnswer = async (lessonId, testIndex, userId, answer) => {
  try {
    console.log(`Submitting test answer: lessonId=${lessonId}, testIndex=${testIndex}, userId=${userId}, answer="${answer}"`);
    const response = await apiClient.post(`/lessons/${lessonId}/tests/${testIndex}`, {
      userId,
      answer
    });
    console.log(`Test answer submitted successfully: lessonId=${lessonId}, testIndex=${testIndex}, response=`, response.data);
    return response.data; // CheckTestResponse
  } catch (error) {
    console.error(`Error submitting test answer: lessonId=${lessonId}, testIndex=${testIndex}, error:`, error);
    throw error.response?.data || { message: 'Failed to submit test answer' };
  }
};