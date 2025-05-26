import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss'; // Create this file

// If using a local image, uncomment and adjust path:
// import heroImage from '../assets/images/hero-image.jpg'; 

const HomePage = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate('/lessons');
  };

  return (
    <div className={styles.homeContainer}>
      <section className={styles.heroSection}>
        {/* Option 1: Placeholder image */}
        <img 
          src="https://via.placeholder.com/1200x400.png?text=Learn+English+Effectively" 
          alt="Learning English" 
          className={styles.heroImage} 
        />
        {/* Option 2: Local image (ensure image is in src/assets/images/ and imported) */}
        {/* <img src={heroImage} alt="Learning English" className={styles.heroImage} /> */}
        
        <div className={styles.heroTextContainer}>
          <h1 className={styles.heroTitle}>Добро пожаловать в SpeakUp!</h1>
          <p className={styles.heroSubtitle}>Начните свой путь к свободному владению английским уже сегодня.</p>
          <button onClick={handleStartLearning} className={styles.ctaButton}>
            Начать учиться
          </button>
        </div>
      </section>
      
      {/* You can add more sections to the home page later if needed */}
    </div>
  );
};

export default HomePage;
