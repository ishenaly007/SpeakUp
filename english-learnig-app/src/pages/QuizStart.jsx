import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { startQuiz, submitQuiz } from '../api/quiz'
import { useAuth } from '../context/AuthContext'
import styles from './QuizStart.module.scss'

const QuizStart = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    if (user) {
      startQuiz(user.id, {}, user.token) // убрали theme
        .then(res => setQuiz(res.data))
        .catch(err => {
          console.error(err)
          alert('Ошибка загрузки квиза: ' + (err?.response?.data?.error || ''))
        })
    }
  }, [user])

  const handleSelect = (questionIndex, option) => {
    setAnswers({ ...answers, [questionIndex]: option })
  }

  const handleSubmit = async () => {
    const totalQuestions = quiz.questions.length
    let score = 0
    const correctWords = []

    quiz.questions.forEach((q, index) => {
      const correctAnswer = q.correctAnswer
      const userAnswer = answers[index]
      if (userAnswer === correctAnswer) {
        score++
        correctWords.push({ english: correctAnswer })
      }
    })

    const result = {
      score,
      totalQuestions,
      correctWords,
    }

    try {
      await submitQuiz(user.id, result, user.token)
      navigate('/quiz/results')
    } catch {
      alert('Ошибка отправки квиза')
    }
  }

  return (
    <div className={styles.quizWrapper}>
      <h2>Квиз</h2>

      {!quiz && <p>Загрузка квиза...</p>}

      {quiz &&
        quiz.questions.map((q, index) => (
          <div key={index} className={styles.questionBlock}>
            <p>{q.question}</p>
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(index, opt)}
                className={`${styles.optionBtn} ${
                  answers[index] === opt ? styles.selected : ''
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ))}

      {quiz && (
        <button onClick={handleSubmit} className={styles.submitBtn}>
          Отправить
        </button>
      )}
    </div>
  )
}

export default QuizStart
