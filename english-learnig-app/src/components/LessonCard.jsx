import React from 'react';
import { useNavigate } from 'react-router-dom'; // Optional: for navigation
import styles from './LessonCard.module.scss'; // To be created

const LessonCard = ({ lesson }) => {
  const navigate = useNavigate(); // Optional

  // Преобразуем title в slug: нижний регистр, пробелы → дефисы, удаляем лишние символы
  const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Заменяем не-буквы и не-цифры на дефис
        .replace(/(^-|-$)/g, ''); // Удаляем дефисы в начале и конце
  };

  const handleClick = () => {
    console.log(`Card clicked for lesson: ${lesson.id} - ${lesson.title}`);
    navigate(`/lessons/${slugify(lesson.title)}`, { state: { lessonId: lesson.id } });
  };

  return (
    <div 
      className={`${styles.lessonCard} ${lesson.completed ? styles.completed : ''}`} 
      onClick={handleClick}
    >
      <h3>{lesson.title}</h3>
      <p><strong>Level:</strong> {lesson.level}</p>
      <p className={styles.description}>{lesson.description}</p>
      {lesson.completed && <p className={styles.completedText}>✔ Пройден</p>}
    </div>
  );
};

export default LessonCard;
