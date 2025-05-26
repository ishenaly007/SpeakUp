import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import LessonsPage from '../pages/LessonsPage';
import LessonDetailPage from '../pages/LessonDetailPage';
import ChatPage from '../pages/ChatPage';
import QuizPage from '../pages/QuizPage';
import ProfilePage from '../pages/ProfilePage';
import Header from '../components/Header';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '../contexts/AuthContext';

const AppRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading application...</div>; // Or a more sophisticated loading spinner
  }

  return (
    <BrowserRouter>
      {user && <Header />} {/* Display header only if user is logged in */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Private Routes */}
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/lessons" element={<PrivateRoute><LessonsPage /></PrivateRoute>} />
        <Route path="/lessons/:lessonTitle" element={<PrivateRoute><LessonDetailPage /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path="/quizzes" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
