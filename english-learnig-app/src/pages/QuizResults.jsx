import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizResults } from '../api/quiz';
import { useAuth } from '../context/AuthContext';
import styles from './QuizResults.module.scss';

const QuizResults = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!user) return;
    getQuizResults(user.id, user.token)
      .then((res) => setResults(res.data))
      .catch(() => alert('Ошибка загрузки результатов'));
  }, [user]);

  if (!results) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Результаты квиза</h2>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.label}>Правильных ответов:</span>
            <span className={styles.value}>{results.correct}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>Всего вопросов:</span>
            <span className={styles.value}>{results.total}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>Оценка:</span>
            <span className={styles.value}>{results.score}</span>
          </div>
        </div>
      </div>

      <button
        className={styles.backButton}
        onClick={() => navigate(-1)}
        type="button"
      >
        ← Назад
      </button>
    </div>
  );
};

export default QuizResults;
