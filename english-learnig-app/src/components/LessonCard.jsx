import React from 'react';
import { useNavigate } from 'react-router-dom'; // Optional: for navigation
import styles from './LessonCard.module.scss'; // To be created

const LessonCard = ({ lesson }) => {
  const navigate = useNavigate(); // Optional

  const handleClick = () => {
    console.log(`Card clicked for lesson: ${lesson.id} - ${lesson.title}`);
    // If you want to navigate to a lesson detail page:
    // navigate(`/lessons/${lesson.id}`); 
  };

  return (
    <div 
      className={`${styles.lessonCard} ${lesson.completed ? styles.completed : ''}`} 
      onClick={handleClick}
    >
      <h3>{lesson.title}</h3>
      <p><strong>Level:</strong> {lesson.level}</p>
      <p className={styles.description}>{lesson.description}</p>
      {lesson.completed && <p className={styles.completedText}>✔ Completed</p>}
    </div>
  );
};

export default LessonCard;
