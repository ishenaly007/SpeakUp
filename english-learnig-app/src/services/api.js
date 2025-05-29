import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // Assuming backend is proxied via /api by Vite
  // You might need to add headers like 'Content-Type': 'application/json'
});

// Add a request interceptor to include the auth token if available
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;
