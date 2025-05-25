import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllLessons } from '../api/lessons'
import { useAuth } from '../context/AuthContext'
import styles from './Lessons.module.scss'

const Lessons = () => {
  const [lessons, setLessons] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    getAllLessons(user.id, user.token)
      .then(res => setLessons(res.data))
      .catch(() => alert('Ошибка загрузки уроков'))
  }, [user])

  return (
    <div className={styles.wrapper}>
      <h2>Уроки</h2>
      <ul>
        {lessons.map(lesson => (
          <li key={lesson.id}>
            <Link to={`/lessons/${lesson.id}`}>{lesson.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Lessons
