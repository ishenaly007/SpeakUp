import { useEffect, useState } from 'react';
import { getQuizResults } from '../api/quiz';
import { useAuth } from '../context/AuthContext';

const QuizResults = () => {
  const { user } = useAuth();
  const [results, setResults] = useState(null);

  useEffect(() => {
    getQuizResults(user.userId, user.token)
      .then((res) => setResults(res.data))
      .catch(() => alert('Ошибка загрузки результатов'));
  }, [user]);

  if (!results) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Результаты квиза</h2>
      <p><strong>Правильных ответов:</strong> {results.correct}</p>
      <p><strong>Всего вопросов:</strong> {results.total}</p>
      <p><strong>Оценка:</strong> {results.score}</p>
    </div>
  );
};

export default QuizResults;
