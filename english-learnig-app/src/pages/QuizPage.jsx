import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { startQuiz, submitQuiz } from '../services/quizService'; // fetchQuizResults might be used later
import { useNavigate } from 'react-router-dom';
import styles from './Quiz.module.scss'; // To be created

const QuizPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizState, setQuizState] = useState('initial'); // 'initial', 'active', 'results'
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(5); // 5 seconds per question
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnswer = useCallback(async (selectedOption, answerType = 'selected') => {
    if (timerIntervalId) clearInterval(timerIntervalId);

    const question = currentQuestions[currentQuestionIndex];
    // Ensure question is valid before proceeding
    if (!question) {
        setError("Error: Question data is missing.");
        setQuizState('initial'); // Or some other error state
        return;
    }
    
    const isCorrect = selectedOption === question.correctAnswer;
    let currentScore = score;

    if (isCorrect) {
      currentScore += 1;
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
      // Timer for next question will start via useEffect
    } else {
      // All questions answered, submit quiz
      setLoading(true);
      setError(null);
      
      // Calculate final score from the updatedUserAnswers array for accuracy
      const finalScore = updatedUserAnswers.filter(ans => ans.isCorrect).length;
      
      const correctWordsForSubmission = updatedUserAnswers
        .filter(ans => ans.isCorrect)
        .map(ans => ({ english: ans.questionEnglishWord }));

      try {
        const results = await submitQuiz(user.id, finalScore, currentQuestions.length, correctWordsForSubmission);
        setQuizResults(results);
        setQuizState('results');
      } catch (err) {
        setError(err.message || 'Failed to submit results.');
      } finally {
        setLoading(false);
      }
    }
  }, [currentQuestionIndex, currentQuestions, userAnswers, score, timerIntervalId, user?.id]);


  // --- Timer Logic ---
  useEffect(() => {
    if (quizState === 'active' && currentQuestionIndex < currentQuestions.length) {
      setTimer(5); // Reset timer for new question
      const intervalId = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) { // When timer reaches 1, next tick will be 0
            clearInterval(intervalId);
            handleAnswer(null, 'timeout'); // Auto-submit as incorrect/timeout
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      setTimerIntervalId(intervalId);
      return () => clearInterval(intervalId); // Cleanup on unmount or question change
    }
  }, [quizState, currentQuestionIndex, currentQuestions, handleAnswer]);


  const handleStartQuiz = async (theme = null) => {
    if (!user?.id) {
      setError("User not authenticated.");
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
        // Timer will be started by useEffect
      } else {
        setError("No questions received from the server. Please try again later.");
        setQuizState('initial');
      }
    } catch (err) {
      setError(err.message || 'Failed to start quiz.');
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
    setTimer(5);
    if (timerIntervalId) clearInterval(timerIntervalId);
    setTimerIntervalId(null);
    setQuizResults(null);
    setError(null);
    setLoading(false);
  };

  const navigateToHome = () => {
    navigate('/');
  };

  // --- Render logic based on quizState ---
  if (error && quizState !== 'active') { // Show prominent error unless in active quiz (where error might be temporary)
    return (
      <div className={styles.quizContainer}>
        <p className={styles.errorText}>Error: {error}</p>
        <button onClick={handlePlayAgain} className={styles.button}>Try Again</button>
      </div>
    );
  }

  if (quizState === 'initial') {
    return (
      <div className={styles.quizContainer}>
        <div className={styles.initialView}>
          <img 
            src="https://via.placeholder.com/1200x200.png?text=Quiz+Time!" 
            alt="Quiz Time" 
            className={styles.headerImage}
          />
          <h2>Проверьте свои знания!</h2>
          <p>Нажмите кнопку ниже, чтобы начать.</p>
          {loading ? (
            <p>Loading quiz...</p>
          ) : (
            <button onClick={() => handleStartQuiz()} className={styles.button} disabled={loading}>
              Начать квиз
            </button>
          )}
          {/* Optional: Theme selection could be added here */}
        </div>
      </div>
    );
  }
  
  if (quizState === 'active') {
    if (loading) return <div className={styles.quizContainer}><p>Loading question...</p></div>;
    if (!currentQuestions || currentQuestions.length === 0 || currentQuestionIndex >= currentQuestions.length) {
      return (
        <div className={styles.quizContainer}>
          <p className={styles.errorText}>Error: No questions available or index out of bounds.</p>
          <button onClick={handlePlayAgain} className={styles.button}>Start Over</button>
        </div>
      );
    }

    const question = currentQuestions[currentQuestionIndex];
    if(!question) { 
      return <div className={styles.quizContainer}><p>Loading question data...</p></div>;
    }

    return (
      <div className={styles.quizContainer}>
        <div className={styles.activeQuizView}>
          <p className={styles.questionCounter}>Вопрос {currentQuestionIndex + 1} / {currentQuestions.length}</p>
          <div className={styles.timerBarContainer}>
            <div 
              className={styles.timerBar} 
              style={{ width: `${(timer / 5) * 100}%` }} 
            />
          </div>
          <p className={styles.timerText}>Осталось времени: {timer}с</p>
          
          <h3 className={styles.questionWord}>{question.englishWord}</h3>
          
          <div className={styles.optionsContainer}>
            {question.options.map((opt, index) => (
              <button 
                key={index} 
                onClick={() => handleAnswer(opt)} 
                className={styles.optionButton}
                disabled={timer === 0} // Disable if timer ran out
              >
                {opt}
              </button>
            ))}
          </div>
          {error && <p className={styles.errorTextSmall}>{error}</p>}
        </div>
      </div>
    );
  }
  
  if (quizState === 'results') {
    if (loading) return <div className={styles.quizContainer}><p>Submitting results...</p></div>;
    if (!quizResults) {
      return (
         <div className={styles.quizContainer}>
            <p className={styles.errorText}>Could not load quiz results.</p>
            <button onClick={handlePlayAgain} className={styles.button}>Play Again</button>
         </div>
      );
    }
    return (
      <div className={styles.quizContainer}>
        <div className={styles.resultsView}>
          <h2>Квиз завершен!</h2>
          <p>Ваш результат: {quizResults.score} из {quizResults.totalQuestions}</p>
          <p>Заработано XP: {quizResults.xpEarned}</p>
          <p>Общий винрейт: {quizResults.winrate ? `${(quizResults.winrate * 100).toFixed(1)}%` : 'N/A'}</p>
          {/* Display correct words if needed */}
          {/* quizResults.correctWords might contain the list if backend sends it back */}
          <div className={styles.resultsActions}>
            <button onClick={handlePlayAgain} className={styles.button}>Play Again</button>
            <button onClick={navigateToHome} className={`${styles.button} ${styles.secondaryButton}`}>Home</button>
          </div>
        </div>
      </div>
    );
  }

  return <div className={styles.quizContainer}><p>Something went wrong. Please try refreshing.</p></div>; // Default fallback
};

export default QuizPage;
