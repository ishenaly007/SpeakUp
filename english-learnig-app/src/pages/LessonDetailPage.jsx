import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchLesson, submitTestAnswer } from '../services/lessonService';
import styles from './LessonDetail.module.scss';

const LessonDetailPage = () => {
    const { title } = useParams();
    const { state } = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTests, setShowTests] = useState(false);
    const [currentTestIndex, setCurrentTestIndex] = useState(0);
    const [testResults, setTestResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [timer, setTimer] = useState(10);
    const [timerIntervalId, setTimerIntervalId] = useState(null);
    const testCardRef = useRef(null);
    const lessonScriptId = 'lesson-dynamic-script'; // ID for the script tag

    useEffect(() => {
        if (!user?.id || !state?.lessonId) {
            console.error('User not authenticated or lesson ID missing');
            setError('User not authenticated or lesson ID missing.');
            setLoading(false);
            return;
        }

        console.log(`Loading lesson: lessonId=${state.lessonId}, userId=${user.id}`);
        setLoading(true);
        fetchLesson(state.lessonId, user.id)
            .then(data => {
                console.log('Lesson loaded:', data);
                console.log('Number of tests:', data.tests?.length || 0);
                setLesson(data);
                setLoading(false);
                // Log to confirm javascriptContent is available
                console.log('Lesson data with JS content:', data.javascriptContent ? 'Available' : 'MISSING', data);
            })
            .catch(err => {
                console.error('Failed to load lesson:', err);
                setError(err.message || 'Failed to load lesson.');
                setLoading(false);
            });
    }, [user?.id, state?.lessonId]);

    // Effect to handle dynamic JavaScript execution
    useEffect(() => {
        // Remove any existing script first
        const existingScript = document.getElementById(lessonScriptId);
        if (existingScript) {
            existingScript.remove();
        }

        if (lesson?.htmlContent && lesson.javascriptContent) {
            console.log('Applying JavaScript for lesson:', lesson.title);
            const script = document.createElement('script');
            script.id = lessonScriptId;
            script.type = 'text/javascript';
            script.textContent = lesson.javascriptContent; // Using textContent is safer

            // Append to the div where HTML content is rendered to keep it somewhat scoped
            // Or document.body if it needs broader scope / DOM interaction outside the lesson content div
            const lessonContentDiv = document.querySelector(`.${styles.lessonContent} > div`); // Assumes htmlContent is in a div
            if (lessonContentDiv) {
                 // The script might rely on the HTML being fully rendered.
                 // A small delay or ensuring it's appended after HTML is set might be needed,
                 // but dangerouslySetInnerHTML should be synchronous enough.
                lessonContentDiv.appendChild(script);
                console.log('Appended script to lesson content div');
            } else {
                // Fallback to body, though less ideal for scoping
                document.body.appendChild(script);
                console.warn('Lesson content div not found, appended script to document.body');
            }
        }

        // Cleanup function to remove the script when the component unmounts or dependencies change
        return () => {
            const scriptToRemove = document.getElementById(lessonScriptId);
            if (scriptToRemove) {
                scriptToRemove.remove();
                console.log('Cleaned up lesson script:', lesson?.title);
            }
        };
    }, [lesson?.id, lesson?.htmlContent, lesson?.javascriptContent]); // Rerun if lesson ID or JS content changes

    useEffect(() => {
        if (showTests && testCardRef.current) {
            testCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [showTests]);

    useEffect(() => {
        if (showTests && lesson?.tests?.length > 0 && currentTestIndex < lesson.tests.length) {
            console.log(`Starting timer for test ${currentTestIndex + 1}/${lesson.tests.length}`);
            setTimer(10);
            const intervalId = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer <= 1) {
                        clearInterval(intervalId);
                        setTimeout(() => {
                            handleAnswerSubmit(null, 'timeout');
                        }, 100);
                        return 0;
                    }
                    return prevTimer - 0.1;
                });
            }, 100);
            setTimerIntervalId(intervalId);
            return () => clearInterval(intervalId);
        }
    }, [showTests, currentTestIndex, lesson?.tests]);

    const handleShowTests = () => {
        console.log('Starting lesson tests:', lesson?.title, ', test count:', lesson?.tests?.length || 0);
        setShowTests(true);
        setCurrentTestIndex(0);
        setTestResults([]);
        setShowResults(false);
    };

    const handleAnswerSubmit = async (answer, answerType = 'selected') => {
        if (timerIntervalId) {
            clearInterval(timerIntervalId);
        }

        const currentTest = lesson.tests[currentTestIndex];
        const selectedAnswer = answerType === 'timeout'
            ? currentTest.options.find(opt => opt !== currentTest.correctAnswer) || currentTest.options[0]
            : answer;

        console.log(`Submitting answer: answer="${selectedAnswer}", testIndex=${currentTestIndex}, type=${answerType}, isLastTest=${currentTestIndex === lesson.tests.length - 1}`);

        try {
            const result = await submitTestAnswer(state.lessonId, currentTestIndex, user.id, selectedAnswer);
            console.log('Test result:', result);
            setTestResults(prev => {
                const updatedResults = [...prev, result];
                console.log('Updated testResults:', updatedResults, 'length:', updatedResults.length);
                return updatedResults;
            });

            const nextIndex = currentTestIndex + 1;
            if (nextIndex < lesson.tests.length) {
                setCurrentTestIndex(nextIndex);
            } else {
                console.log('All tests completed, showing results');
                setShowTests(false);
                setShowResults(true);
                if (result.lessonCompleted) {
                    console.log('Lesson marked as completed');
                    setLesson(prev => ({ ...prev, completed: true }));
                }
            }
        } catch (err) {
            console.error('Error submitting answer:', err);
            setError(err.message || 'Failed to submit answer.');
        }
    };

    const handleRestartLesson = () => {
        console.log('Restarting lesson:', lesson?.title);
        // Перезагружаем страницу, чтобы начать урок заново
        window.location.reload();
    };

    const navigateToLessons = () => {
        console.log('Navigating to lessons list');
        navigate('/lessons');
    };

    if (loading) return <div className={styles.loading}>Loading lesson...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!lesson) return <div className={styles.error}>Lesson not found.</div>;

    const correctAnswers = testResults.filter(result => result.isCorrect === true).length;

    return (
        <div className={styles.lessonContainer}>
            <div className={styles.lessonHeader}>
                <h2>{lesson.title}</h2>
                <p><strong>Level:</strong> {lesson.level}</p>
                <p>{lesson.description}</p>
                {lesson.note && <p className={styles.note}>{lesson.note}</p>}
                {lesson.completed && <p className={styles.completed}>✔ Урок пройден</p>}
            </div>

            <div className={styles.lessonContent}>
                <style>{lesson.cssContent}</style>
                {/* This div will be targeted by the JS execution effect for script appending */}
                <div dangerouslySetInnerHTML={{ __html: lesson.htmlContent }} id="lesson-html-render-area" />
            </div>

            {!showResults && (
                <div className={styles.testsSection}>
                    <button onClick={handleShowTests} className={styles.testButton}>
                        Пройти тест
                    </button>
                    {showTests && lesson.tests?.length > 0 && (
                        <div className={styles.testCard} ref={testCardRef}>
                            <p className={styles.questionCounter}>Вопрос {currentTestIndex + 1} / {lesson.tests.length}</p>
                            <div className={styles.timerBarContainer}>
                                <div
                                    className={styles.timerBar}
                                    style={{ width: `${(timer / 10) * 100}%` }}
                                />
                            </div>
                            <h3 className={styles.questionWord}>{lesson.tests[currentTestIndex].question}</h3>
                            <div className={styles.optionsContainer}>
                                {lesson.tests[currentTestIndex].options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSubmit(option)}
                                        className={styles.optionButton}
                                        disabled={timer === 0}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {showResults && (
                <div className={styles.resultsView}>
                    <h2>Урок завершен!</h2>
                    <p>Ваш результат: {correctAnswers} из {lesson.tests.length}</p>
                    <p>Заработано XP: {testResults.reduce((sum, result) => sum + (result.xpChange || 0), 0)}</p>
                    {lesson.note && <p className={styles.note}>Совет: {lesson.note}</p>}
                    <div className={styles.resultsActions}>
                        <button onClick={handleRestartLesson} className={styles.testButton}>
                            Пройти урок заново
                        </button>
                        <button onClick={navigateToLessons} className={`${styles.testButton} ${styles.secondaryButton}`}>
                            К списку уроков
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonDetailPage;