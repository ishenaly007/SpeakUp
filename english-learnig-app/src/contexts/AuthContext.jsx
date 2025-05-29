import React, { createContext, useContext, useState, useEffect } from 'react';
// fetchUserProfile is removed from here as it's not directly used by the context's core logic anymore
import { loginUser as loginApi, registerUser as registerApi } from '../services/authService';
import apiClient from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        // Handle potential parsing error
        console.error("Error parsing stored user:", e);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const responseData = await loginApi(credentials); // responseData includes user details and hopefully token
      
      // IMPORTANT ASSUMPTION: Spring Security returns token in responseData.token
      // If token is in headers, this needs to be adjusted based on actual backend behavior.
      if (!responseData.token) {
        console.warn('No token found in login response. Backend should provide it in responseData.token.');
        // Potentially handle missing token error, or proceed if backend doesn't issue tokens this way
      }
      // Store token even if it's undefined/null to clear any old token if backend stops sending it
      localStorage.setItem('authToken', responseData.token); 
      localStorage.setItem('authUser', JSON.stringify(responseData)); // Store the whole user object from UserResponse
      if (responseData.token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${responseData.token}`;
      } else {
        // If no token, ensure header is not set with a stale one or "Bearer undefined"
        delete apiClient.defaults.headers.common['Authorization'];
      }
      setUser(responseData); // Set user from UserResponse
      return responseData;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const data = await registerApi(userData);
      // Registration does not auto-login as per instructions
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser'); // Remove stored user object
    delete apiClient.defaults.headers.common['Authorization'];
    // Optionally, call a backend logout endpoint if one exists
  };

  // fetchUserProfile removed from context value
  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
