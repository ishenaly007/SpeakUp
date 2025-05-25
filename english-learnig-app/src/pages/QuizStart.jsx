import { useEffect, useState } from 'react';
import { startQuiz, submitQuiz } from '../api/quiz';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const QuizStart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    startQuiz(user.userId, user.token)
      .then((res) => setQuiz(res.data))
      .catch(() => alert('Ошибка загрузки квиза'));
  }, [user]);

  const handleSelect = (questionIndex, option) => {
    setAnswers({ ...answers, [questionIndex]: option });
  };

  const handleSubmit = async () => {
    try {
      await submitQuiz(user.userId, answers, user.token);
      navigate('/quiz/results');
    } catch {
      alert('Ошибка отправки квиза');
    }
  };

  if (!quiz) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Квиз</h2>
      {quiz.questions.map((q, index) => (
        <div key={index}>
          <p><strong>{q.question}</strong></p>
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(index, opt)}
              style={{
                marginRight: '6px',
                background: answers[index] === opt ? 'lightgreen' : '',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Отправить</button>
    </div>
  );
};

export default QuizStart;
