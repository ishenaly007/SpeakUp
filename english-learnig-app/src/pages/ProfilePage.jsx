import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserFullProfile } from '../services/authService'; // Assuming it's added here
import { fetchLessons } from '../services/lessonService';
import { fetchQuizResults } from '../services/quizService';
import styles from './Profile.module.scss'; // Create this file

const ProfilePage = () => {
  const { user } = useAuth(); // Basic user info from login
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
        let errorMessage = 'Failed to load profile information.';
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
        setError("User not authenticated. Please log in.");
    } else if (!user && loading) {
        // If AuthContext is still loading user, wait for it.
        // setError("Authenticating user..."); // Or just let it be loading
    }
  }, [user, loading]); // Added loading to dependency array to re-evaluate if user becomes available

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    }); // Example: 01 Jan 2023
  };
  
  if (loading && !profileData) return <div className={styles.loading}>Loading profile...</div>; // Show loading only if no data yet
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!profileData && !loading) return <div className={styles.noData}>No profile data available. Please try refreshing.</div>;


  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.profileHeader}>My Profile</h2>
      {profileData && ( // Render card only if profileData is available
        <div className={styles.profileCard}>
          <div className={styles.avatarPlaceholder}>
            <span>Avatar</span>
          </div>
          <div className={styles.profileItem}><strong>Username:</strong> {profileData.username}</div>
          <div className={styles.profileItem}><strong>Email:</strong> {profileData.email}</div>
          <div className={styles.profileItem}>
            <strong>Current Level:</strong> {profileData.calculatedLevel || 'N/A'} 
            {profileData.level && ` (Set: ${profileData.level})`}
          </div>
          <div className={styles.profileItem}><strong>XP:</strong> {profileData.xp || 0}</div>
          {(profileData.remainingXp !== null && typeof profileData.remainingXp !== 'undefined') && (
            <div className={styles.profileItem}><strong>XP for Next Level:</strong> {profileData.remainingXp}</div>
          )}
          <div className={styles.profileItem}><strong>Member Since:</strong> {formatDate(profileData.createdAt)}</div>
          
          <h3>Learning Progress</h3> {/* This h3 will be styled by .profileCard h3 in SCSS */}
          <div className={styles.profileItem}><strong>Lessons Completed:</strong> {completedLessonsCount}</div>
          <div className={styles.profileItem}><strong>Quizzes Taken:</strong> {quizStats.totalQuizzes}</div>
          <div className={styles.profileItem}>
            <strong>Average Quiz Win Rate:</strong> 
            {typeof quizStats.totalWinrate === 'number' ? `${(quizStats.totalWinrate * 100).toFixed(1)}%` : quizStats.totalWinrate}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
