import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { startQuiz, submitQuiz } from '../services/quizService';
import { useNavigate } from 'react-router-dom';
import styles from './Quiz.module.scss';
import { FaPlay, FaQuestionCircle, FaClock, FaAward, FaRedo, FaHome } from 'react-icons/fa'; // FaTimesCircle, FaCheckCircle not directly used based on current structure

const QuizPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizState, setQuizState] = useState('initial'); // 'initial', 'active', 'results'
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10); // 10 seconds per question
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnswer = useCallback(
      async (selectedOption, answerType = 'selected') => {
        console.log(`handleAnswer called: option=${selectedOption}, type=${answerType}`);
        if (timerIntervalId) {
          clearInterval(timerIntervalId);
          setTimerIntervalId(null);
        }

        const question = currentQuestions[currentQuestionIndex];
        if (!question) {
          setError('Ошибка: Данные вопроса отсутствуют.');
          setQuizState('initial');
          return;
        }

        const isCorrect = selectedOption === question.correctAnswer;
        if (isCorrect) {
          setScore(prevScore => prevScore + 1);
        }

        const newAnswer = {
          questionEnglishWord: question.englishWord,
          selectedAnswer: selectedOption,
          correctAnswer: question.correctAnswer,
          isCorrect: isCorrect,
        };
        const updatedUserAnswers = [...userAnswers, newAnswer];
        setUserAnswers(updatedUserAnswers);

        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < currentQuestions.length) {
          setCurrentQuestionIndex(nextIndex);
        } else {
          setLoading(true);
          setError(null);

          const finalScore = updatedUserAnswers.filter(ans => ans.isCorrect).length;
          const correctWordsForSubmission = updatedUserAnswers
              .filter(ans => ans.isCorrect)
              .map(ans => ({ english: ans.questionEnglishWord }));

          try {
            const results = await submitQuiz(user.id, finalScore, currentQuestions.length, correctWordsForSubmission);
            setQuizResults(results);
            setQuizState('results');
          } catch (err) {
            setError(err.message || 'Не удалось отправить результаты.');
          } finally {
            setLoading(false);
          }
        }
      },
      [currentQuestionIndex, currentQuestions, userAnswers, timerIntervalId, user?.id]
  );

  // Timer Logic
  useEffect(() => {
    if (quizState === 'active' && currentQuestionIndex < currentQuestions.length) {
      console.log(`Starting timer for question ${currentQuestionIndex + 1}`);
      setTimer(10); // Reset timer to 10 seconds
      const intervalId = setInterval(() => {
        setTimer(prevTimer => {
          console.log(`Timer: ${prevTimer.toFixed(1)}s`);
          if (prevTimer <= 0) {
            clearInterval(intervalId);
            console.log('Timer expired, calling handleAnswer');
            handleAnswer(null, 'timeout');
            return 0;
          }
          return prevTimer - 0.1;
        });
      }, 100);
      setTimerIntervalId(intervalId);
      return () => {
        console.log('Cleaning up timer interval');
        clearInterval(intervalId);
      };
    }
  }, [quizState, currentQuestionIndex, currentQuestions, handleAnswer]);

  const handleStartQuiz = async (theme = null) => {
    if (!user?.id) {
      setError('Пользователь не аутентифицирован.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await startQuiz(user.id, theme);
      if (data && data.questions && data.questions.length > 0) {
        setCurrentQuestions(data.questions);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setScore(0);
        setQuizResults(null);
        setQuizState('active');
      } else {
        setError('Вопросы не получены с сервера. Пожалуйста, попробуйте позже.');
        setQuizState('initial');
      }
    } catch (err) {
      setError(err.message || 'Не удалось начать квиз.');
      setQuizState('initial');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAgain = () => {
    setQuizState('initial');
    setCurrentQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setTimer(10);
    if (timerIntervalId) clearInterval(timerIntervalId);
    setTimerIntervalId(null);
    setQuizResults(null);
    setError(null);
    setLoading(false);
  };

  const navigateToHome = () => {
    navigate('/');
  };

  // Render logic based on quizState
  if (error && quizState !== 'active') { // Show general error view if error occurs outside active quiz
    return (
        <div className={styles.quizContainer}>
          <p className={styles.errorText}>Ошибка: {error}</p>
          <button onClick={handlePlayAgain} className={styles.button}>
            <FaRedo /> Попробовать снова
          </button>
        </div>
    );
  }

  if (quizState === 'initial') {
    return (
        <div className={styles.quizContainer}>
          <div className={styles.initialView}>
            <img
                src="https://wallpaperaccess.com/full/3308619.jpg" // Consider a more theme-aligned or locally hosted image
                alt="Quiz Time"
                className={styles.headerImage}
            />
            <h2>Проверьте свои знания!</h2>
            <p>Нажмите кнопку ниже, чтобы начать.</p>
            {loading ? (
                <p className={styles.loadingMessage}>Загрузка квиза...</p>
            ) : (
                <button
                    onClick={() => handleStartQuiz()}
                    className={styles.button} // Primary button class
                    disabled={loading}
                >
                  <FaPlay /> Начать квиз
                </button>
            )}
            {error && <p className={styles.errorTextSmall}>{error}</p>}
          </div>
        </div>
    );
  }

  if (quizState === 'active') {
    if (loading) return <div className={styles.quizContainer}><p className={styles.loadingMessage}>Загрузка вопроса...</p></div>;
    if (!currentQuestions || currentQuestions.length === 0 || currentQuestionIndex >= currentQuestions.length) {
      return (
          <div className={styles.quizContainer}>
            <p className={styles.errorText}>Ошибка: Вопросы отсутствуют или индекс вне диапазона.</p>
            <button onClick={handlePlayAgain} className={styles.button}>
              <FaRedo /> Начать заново
            </button>
          </div>
      );
    }

    const question = currentQuestions[currentQuestionIndex];
    if (!question) { // Should ideally not happen if previous check is robust
      return <div className={styles.quizContainer}><p className={styles.loadingMessage}>Загрузка данных вопроса...</p></div>;
    }

    return (
        <div className={styles.quizContainer}>
          <div className={styles.activeQuizView}>
            <p className={styles.questionCounter}>
              <FaQuestionCircle /> Вопрос {currentQuestionIndex + 1} / {currentQuestions.length}
            </p>
            <div className={styles.timerBarContainer}>
              <div
                  className={styles.timerBar}
                  style={{ width: `${(timer / 10) * 100}%` }}
              />
            </div>
            <p className={styles.timerText}><FaClock /> Осталось времени: {timer.toFixed(1)}с</p>
            <h3 className={styles.questionWord}>{question.englishWord}</h3>
            <div className={styles.optionsContainer}>
              {question.options.map((opt, index) => (
                  <button
                      key={index}
                      onClick={() => handleAnswer(opt)}
                      className={styles.optionButton}
                      disabled={timer <= 0} // Keep disabled logic
                  >
                    {opt}
                  </button>
              ))}
            </div>
            {error && <p className={styles.errorTextSmall}>{error}</p>} {/* Keep error display for active quiz */}
          </div>
        </div>
    );
  }

  if (quizState === 'results') {
    if (loading) return <div className={styles.quizContainer}><p className={styles.loadingMessage}>Отправка результатов...</p></div>;
    if (!quizResults) { // Error fetching results
      return (
          <div className={styles.quizContainer}>
            <p className={styles.errorText}>Не удалось загрузить результаты квиза.</p>
            <button onClick={handlePlayAgain} className={styles.button}>
              <FaRedo /> Играть снова
            </button>
          </div>
      );
    }
    return (
        <div className={styles.quizContainer}>
          <div className={styles.resultsView}>
            <img // Consider a more theme-aligned or locally hosted image for results
                src="https://img.freepik.com/free-photo/flat-lay-assortment-optimism-concept-elements_23-2148861677.jpg?semt=ais_items_boosted&w=740"
                alt="Quiz Completed"
                className={styles.headerImage}
            />
            <h2><FaAward /> Квиз завершен!</h2>
            <p>Ваш счет: <strong>{quizResults.score}</strong> из <strong>{quizResults.totalQuestions}</strong></p>
            <p>Получено XP: <strong>{quizResults.xpEarned}</strong></p>
            <div className={styles.resultsActions}>
              <button onClick={handlePlayAgain} className={styles.button}> {/* Primary button */}
                <FaRedo /> Играть снова
              </button>
              <button
                  onClick={navigateToHome}
                  className={styles.secondaryButton} // Secondary button class
              >
                <FaHome /> На главную
              </button>
            </div>
          </div>
        </div>
    );
  }

  // Fallback for any unknown state
  return <div className={styles.quizContainer}><p className={styles.infoMessage}>Что-то пошло не так. Пожалуйста, обновите страницу.</p></div>;
};

export default QuizPage;