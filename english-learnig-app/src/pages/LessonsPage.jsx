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
          setError(err.message || 'Не удалось загрузить уроки.');
          setLoading(false);
        });
    } else {
      // Handle case where user or user.id is not available
      setLoading(false);
      if (!user) { // If user is null/undefined (AuthContext might still be loading)
        setError('Аутентификация пользователя... Пожалуйста, подождите.');
      } else { // User object exists but no id
        setError('ID пользователя недоступен для загрузки уроков.');
        console.error("User object without ID:", user);
      }
    }
  }, [user]);

  if (loading) return <div className={styles.loadingMessage}>Загрузка уроков...</div>;
  if (error) return <div className={styles.errorMessage}>Ошибка: {error}</div>;

  return (
    <div className={styles.lessonsContainer}>
      <div className={styles.lessonsHeader}>
        {/* Optional: Image can be kept or removed if header is more text-focused */}
        {/* <img src="https://c0.wallpaperflare.com/preview/634/900/965/book-bindings-bookcase-books-bookshelf.jpg" alt="Lessons banner" /> */}
        <h2><FaBookOpen /> Доступные уроки</h2>
        <p>Изучите наши тщательно подобранные уроки, разработанные, чтобы помочь вам овладеть английским шаг за шагом. Выберите урок и начните учиться уже сегодня!</p>
      </div>

      <div className={styles.motivationSection}>
        <h4>✨ Совет дня ✨</h4>
        <p>Постоянство - ключ к успеху! Даже 15 минут практики в день могут существенно повлиять на ваш прогресс в обучении.</p>
      </div>
      
      {lessons.length === 0 && !loading && <p className={styles.noLessonsMessage}>На данный момент уроков нет. Пожалуйста, зайдите позже!</p>}
      
      <div className={styles.lessonsGrid}>
        {lessons.map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};

export default LessonsPage;
