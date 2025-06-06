import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserFullProfile } from '../services/authService';
import { fetchLessons } from '../services/lessonService';
import { fetchQuizResults } from '../services/quizService';
import styles from './Profile.module.scss';
import { FaUserCircle, FaEnvelope, FaBook, FaQuestionCircle, FaTrophy, FaStar, FaCalendarAlt, FaLevelUpAlt } from 'react-icons/fa'; // Added more icons

const ProfilePage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const [quizStats, setQuizStats] = useState({ totalQuizzes: 0, totalWinrate: '0%' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      setError(null); // Clear previous errors
      Promise.all([
        fetchUserFullProfile(user.id),
        fetchLessons(user.id), // Ensure this returns an array
        fetchQuizResults(user.id) // Ensure this returns an object with totalQuizzes and totalWinrate
      ])
      .then(([profile, lessonsData, quizData]) => {
        setProfileData(profile);
        
        // Ensure lessonsData is an array before filtering
        const completedCount = Array.isArray(lessonsData) ? lessonsData.filter(lesson => lesson.completed).length : 0;
        setCompletedLessonsCount(completedCount);
        
        // Ensure quizData is an object and has the expected properties
        setQuizStats({
          totalQuizzes: quizData?.totalQuizzes || 0,
          totalWinrate: quizData?.totalWinrate || '0%' // Handle potential string or number for winrate
        });
      })
      .catch(err => {
        console.error("Failed to load profile data:", err);
        let errorMessage = 'Не удалось загрузить информацию профиля.';
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
    } else if (!user && !loading) { // Check if user is null and not already in loading state from context
        setLoading(false);
        setError("Пользователь не аутентифицирован. Пожалуйста, войдите в систему.");
    } else if (!user && loading) {
        // If AuthContext is still loading user, wait for it.
        // setError("Authenticating user..."); // Or just let it be loading
    }
  }, [user, loading]); // Added loading to dependency array to re-evaluate if user becomes available

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit', month: 'long', year: 'numeric'
    }); // Example: 01 января 2023 г.
  };
  
  if (loading && !profileData) return <div className={styles.loadingMessage}>Загрузка профиля...</div>;
  if (error) return <div className={styles.errorMessage}>Ошибка: {error}</div>;
  if (!profileData && !loading) return <div className={styles.noDataMessage}>Данные профиля отсутствуют. Пожалуйста, попробуйте обновить страницу.</div>;

  return (
    <div className={styles.profileContainer}>
      {/* Removed the separate "My Profile" h2, header implies it */}
      {profileData && (
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <FaUserCircle size={80} className={styles.avatarPlaceholder} />
            <span className={styles.username}>{profileData.username}</span>
          </div>

          <div className={`${styles.profileItem} ${styles.emailItem}`}>
            <FaEnvelope /> <strong>Email:</strong> {profileData.email}
          </div>

          <div className={styles.profileItem}>
            <FaLevelUpAlt /> <strong>Текущий уровень:</strong> {profileData.calculatedLevel || 'N/A'}
            {profileData.level && ` (Set: ${profileData.level})`}
          </div>

          <div className={styles.profileItem}>
            <FaStar /> <strong>XP:</strong> {profileData.xp || 0}
          </div>

          {(profileData.remainingXp !== null && typeof profileData.remainingXp !== 'undefined') && (
            <div className={styles.profileItem}>
              <FaStar /> <strong>XP до следующего уровня:</strong> {profileData.remainingXp}
            </div>
          )}

          <div className={styles.profileItem}>
            <FaCalendarAlt /> <strong>Зарегистрирован с:</strong> {formatDate(profileData.createdAt)}
          </div>

          <h3 className={styles.sectionTitle}>Прогресс обучения</h3>
          <div className={styles.statsSection}>
            <div className={styles.statItem}>
              <FaBook />
              <div>
                <strong>Завершено уроков:</strong> {completedLessonsCount}
              </div>
            </div>
            <div className={styles.statItem}>
              <FaQuestionCircle />
              <div>
                <strong>Пройдено квизов:</strong> {quizStats.totalQuizzes}
              </div>
            </div>
            <div className={styles.statItem}>
              <FaTrophy />
              <div>
                <strong>Средний процент побед в квизах:</strong>
                {typeof quizStats.totalWinrate === 'number' ? `${(quizStats.totalWinrate * 100).toFixed(1)}%` : quizStats.totalWinrate}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
