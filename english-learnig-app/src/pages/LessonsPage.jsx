import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchLessons } from '../services/lessonService';
import LessonCard from '../components/LessonCard'; // Import LessonCard
import styles from './Lessons.module.scss'; // Create this file

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
  }, [user]); // Re-run if user object changes

  if (loading) return <div>Loading lessons...</div>;
  // Error display should be more prominent or user-friendly
  if (error) return <div style={{ color: 'red', padding: '1rem' }}>Error: {error}</div>;

  return (
    <div className={styles.lessonsContainer}>
      <div className={styles.lessonsHeader}>
        <img src="https://media.makeameme.org/created/no-nooo-5c950d.jpg" alt="Lessons banner" />
        <h2>Доступные уроки</h2>
        <p>Здесь вы найдете все доступные уроки. Выбирайте и начинайте учиться!</p>
      </div>
      
      {lessons.length === 0 && !loading && <p>No lessons available at the moment.</p>}
      
      <div className={styles.lessonsGrid}>
        {lessons.map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};

export default LessonsPage;
