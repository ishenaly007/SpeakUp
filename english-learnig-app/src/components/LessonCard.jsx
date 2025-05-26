import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LessonCard.module.scss';

const LessonCard = ({ lesson }) => {
  if (!lesson || !lesson.title) {
    // Handle cases where lesson or lesson.title is undefined
    // This could be logging an error, rendering a placeholder, or returning null
    console.error("LessonCard: Lesson or lesson title is undefined", lesson);
    return <div className={styles.lessonCard}>Lesson data is missing.</div>;
  }

  const lessonTitleSlug = encodeURIComponent(lesson.title.toLowerCase().replace(/\s+/g, '-'));

  return (
    <Link to={`/lessons/${lessonTitleSlug}`} className={`${styles.lessonCard} ${lesson.completed ? styles.completed : ''}`}>
      <h3>{lesson.title}</h3>
      <p><strong>Level:</strong> {lesson.level}</p>
      <p className={styles.description}>{lesson.description}</p>
      {lesson.completed && <p className={styles.completedText}>✔ Completed</p>}
    </Link>
  );
};

export default LessonCard;
