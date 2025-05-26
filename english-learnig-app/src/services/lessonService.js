import apiClient from './api';

export const fetchLessons = async (userId) => {
  try {
    // The backend expects userId as a query parameter
    const response = await apiClient.get('/lessons', {
      params: { userId }
    });
    return response.data; // This should be List<LessonResponse>
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error.response?.data || { message: 'Failed to fetch lessons' };
  }
};

// Optional: Add fetchLessonDetails if planning ahead for lesson detail view
export const fetchLessonDetails = async (lessonId, userId) => {
  try {
    const response = await apiClient.get(`/lessons/${lessonId}`, {
      params: { userId }
    });
    return response.data; // This should be LessonDetailsResponse
  } catch (error) {
    console.error(`Error fetching lesson details for lesson ${lessonId}:`, error);
    throw error.response?.data || { message: 'Failed to fetch lesson details' };
  }
};
