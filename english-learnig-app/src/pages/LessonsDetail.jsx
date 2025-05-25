import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLessonById, submitTestAnswer } from '../api/lessons';
import { useAuth } from '../context/AuthContext';
import styles from './LessonsDetail.module.scss';

const LessonDetail = () => {
  const { lessonId } = useParams();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    getLessonById(lessonId)
      .then((res) => setLesson(res.data))
      .catch(() => alert('Ошибка загрузки урока'));
  }, [lessonId]);

  const handleAnswer = async (testIndex, value) => {
    try {
      await submitTestAnswer(lessonId, testIndex, { answer: value }, user.token);
      setAnswers({ ...answers, [testIndex]: value });
    } catch {
      alert('Ошибка отправки ответа');
    }
  };

  if (!lesson) return <div>Загрузка...</div>;

  return (
    <div className={styles.wrapper}>
    <h2>{lesson.title}</h2>
    <p>{lesson.description}</p>

    {lesson.tests?.map((test, index) => (
      <div key={index}>
        <h4>{test.question}</h4>
        {test.options.map((option, i) => (
          <button
            key={i}
            disabled={answers[index]}
            onClick={() => handleAnswer(index, option)}
            style={{
              background: answers[index] === option ? 'lightgreen' : '',
            }}
          >
            {option}
          </button>
        ))}
      </div>
    ))}
  </div>
  );
};

export default LessonDetail;
