import apiClient from './api';

export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/users/login', credentials); // Endpoint based on UserController and UserLoginRequest
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchUserFullProfile = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}/profile`);
    return response.data; // UserResponse from profile endpoint
  } catch (error) {
    console.error('Error fetching user full profile:', error);
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/users/register', userData); // Endpoint based on UserController and UserRegisterRequest
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await apiClient.get('/users/profile'); // Assuming this endpoint for fetching user profile
    return response.data;
  } catch (error) {
    // It's often better to handle 401/403 specifically in the AuthContext or UI
    throw error.response.data;
  }
};
