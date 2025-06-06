import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchLessons } from '../services/lessonService';
import LessonCard from '../components/LessonCard';
import styles from './Lessons.module.scss';
import { FaBookOpen } from 'react-icons/fa'; // Import icon

const LessonsPage = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get user to pass userId

  useEffect(() => {
    if (user?.id) { // Ensure user and user.id are available
      setLoading(true); // Set loading true at the start of fetch
      setError(null); // Clear previous errors
      fetchLessons(user.id)
        .then(data => {
          setLessons(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message || 'Failed to load lessons.');
          setLoading(false);
        });
    } else {
      // Handle case where user or user.id is not available
      setLoading(false);
      if (!user) { // If user is null/undefined (AuthContext might still be loading)
        setError('Authenticating user... Please wait.');
      } else { // User object exists but no id
        setError('User ID not available to fetch lessons.');
        console.error("User object without ID:", user);
      }
    }
  }, [user]);

  if (loading) return <div className={styles.loadingMessage}>Loading lessons...</div>;
  if (error) return <div className={styles.errorMessage}>Error: {error}</div>;

  return (
    <div className={styles.lessonsContainer}>
      <div className={styles.lessonsHeader}>
        {/* Optional: Image can be kept or removed if header is more text-focused */}
        {/* <img src="https://c0.wallpaperflare.com/preview/634/900/965/book-bindings-bookcase-books-bookshelf.jpg" alt="Lessons banner" /> */}
        <h2><FaBookOpen /> Available Lessons</h2>
        <p>Explore our curated lessons designed to help you master English, step by step. Choose a lesson and start learning today!</p>
      </div>

      <div className={styles.motivationSection}>
        <h4>✨ Tip of the Day ✨</h4>
        <p>Consistency is key! Even 15 minutes of practice a day can make a big difference in your learning journey.</p>
      </div>
      
      {lessons.length === 0 && !loading && <p className={styles.noLessonsMessage}>No lessons available at the moment. Please check back later!</p>}
      
      <div className={styles.lessonsGrid}>
        {lessons.map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};

export default LessonsPage;
