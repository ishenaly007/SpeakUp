import axios from './axios';

export const register = (data) => axios.post('/users/register', data);
export const login = (data) => axios.post('/users/login', data);
export const getProfile = (userId, token) =>
  axios.get(`/users/${userId}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
