import { useEffect, useState } from 'react';
import { getAllLessons } from '../api/lessons';
import { Link } from 'react-router-dom';

const Lessons = () => {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    getAllLessons().then((res) => setLessons(res.data)).catch(() => alert('Ошибка загрузки уроков'));
  }, []);

  return (
    <div>
      <h2>Уроки</h2>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson._id || lesson.id}>
            <Link to={`/lessons/${lesson._id || lesson.id}`}>{lesson.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lessons;
