import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
// Placeholders for pages to be created - create these files with basic content
// e.g., const HomePage = () => <h2>Home Page</h2>; export default HomePage;
import HomePage from './pages/HomePage'; // To be created
import LessonsPage from './pages/LessonsPage'; // To be created
import LessonDetailPage from './pages/LessonDetailPage';
import ChatPage from './pages/ChatPage'; // To be created
import QuizPage from './pages/QuizPage'; // To be created
import ProfilePage from './pages/ProfilePage'; // To be created

import './styles/global.scss'; // Assuming global styles

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading application...</div>; // Global loading state
  }

  return (
    <div className="App">
      {user && <Header />} {/* Display header only if user is logged in */}
      <main> {/* Add a main tag for content */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<HomePage />} />
            <Route path="lessons" element={<LessonsPage />} />
            <Route path="lessons/:title" element={<LessonDetailPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="quizzes" element={<QuizPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          {/* Redirect to login if no other route matches and not logged in */}
          <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
