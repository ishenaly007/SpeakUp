import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext'; // Import ThemeProvider
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer'; // Import Footer
import HomePage from './pages/HomePage';
import LessonsPage from './pages/LessonsPage';
import LessonDetailPage from './pages/LessonDetailPage';
import ChatPage from './pages/ChatPage';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import ContactsPage from './pages/ContactsPage'; // Import ContactsPage
import AboutUsPage from './pages/AboutUsPage'; // Import AboutUsPage
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'; // Import PrivacyPolicyPage

import './styles/global.scss'; // Assuming global styles

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>Загрузка приложения...</div>; // Global loading state
  }

  return (
    <ThemeProvider> {/* Wrap the application with ThemeProvider */}
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
            <Route path="contacts" element={<ContactsPage />} /> {/* Add route for ContactsPage */}
            <Route path="about-us" element={<AboutUsPage />} /> {/* Add route for AboutUsPage */}
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} /> {/* Add route for PrivacyPolicyPage */}
          </Route>
          
          {/* Redirect to login if no other route matches and not logged in */}
          <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        {user && <Footer />} {/* Display footer only if user is logged in */}
      </div>
    </ThemeProvider>
  );
}

export default App;
