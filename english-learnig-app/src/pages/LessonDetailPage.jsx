import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchLessons } from '../services/lessonService';
import { useAuth } from '../contexts/AuthContext';
import styles from './LessonDetail.module.scss';

const LessonDetailPage = () => {
  const { lessonTitle: lessonTitleSlug } = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id && lessonTitleSlug) {
      setLoading(true);
      fetchLessons(user.id)
        .then(lessons => {
          const foundLesson = lessons.find(
            l => l.title.toLowerCase().replace(/\s+/g, '-') === lessonTitleSlug
          );
          if (foundLesson) {
            // If lesson structure has 'content' use it, otherwise use 'description'
            // For now, assuming 'description' and 'title' are primary fields.
            // If 'content' is rich (e.g., HTML), ensure it's handled safely if rendered directly.
            setLesson(foundLesson);
          } else {
            setError('Lesson not found.');
          }
          setLoading(false);
        })
        .catch(err => {
          setError(err.message || 'Failed to load lesson details.');
          setLoading(false);
        });
    } else if (!user?.id) {
        setError("User not authenticated. Cannot fetch lesson.");
        setLoading(false);
    }
  }, [user, lessonTitleSlug]);

  if (loading) {
    return (
      <div className={styles.pageContentWrapper}>
        <div className={styles.lessonDetailContainer}>
          <p>Loading lesson details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContentWrapper}>
        <div className={styles.lessonDetailContainer}>
          <p className={styles.errorText}>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className={styles.pageContentWrapper}>
        <div className={styles.lessonDetailContainer}>
          <p>Lesson not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContentWrapper}>
      <div className={styles.lessonDetailContainer}>
        <h1>{lesson.title}</h1>
        <p>{lesson.description || lesson.content || 'No description available.'}</p>
        {/* If lesson.content is HTML, this is unsafe: <div dangerouslySetInnerHTML={{ __html: lesson.content }} /> */}
        {/* For complex content, consider a more structured approach or markdown parsing. */}
      </div>
    </div>
  );
};

export default LessonDetailPage;
