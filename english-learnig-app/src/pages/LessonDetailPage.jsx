import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchLesson } from '../services/lessonService';
import styles from './LessonDetail.module.scss';

const LessonDetailPage = () => {
    const { title } = useParams(); // Получаем slug из URL
    const { state } = useLocation(); // Получаем lessonId из state
    const { user } = useAuth();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTests, setShowTests] = useState(false);
    const [currentTestIndex, setCurrentTestIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [testResult, setTestResult] = useState(null);

    useEffect(() => {
        if (!user?.id || !state?.lessonId) {
            setError('User not authenticated or lesson ID missing.');
            setLoading(false);
            return;
        }

        setLoading(true);
        fetchLesson(state.lessonId, user.id)
            .then(data => {
                setLesson(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || 'Failed to load lesson.');
                setLoading(false);
            });
    }, [user?.id, state?.lessonId]);

    const handleShowTests = () => {
        setShowTests(true);
        setCurrentTestIndex(0);
        setTestResult(null);
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAnswer || !user?.id) return;

        try {
            const response = await fetch(`/api/lessons/${state.lessonId}/tests/${currentTestIndex}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, answer: selectedAnswer }),
            });
            if (!response.ok) throw new Error('Failed to check test');
            const result = await response.json();
            setTestResult(result);
            setSelectedAnswer('');

            if (result.isCorrect && currentTestIndex < lesson.tests.length - 1) {
                setCurrentTestIndex(prev => prev + 1);
            } else if (result.lessonCompleted) {
                setShowTests(false);
                setLesson(prev => ({ ...prev, completed: true }));
            }
        } catch (err) {
            setError(err.message || 'Failed to submit answer.');
        }
    };

    if (loading) return <div className={styles.loading}>Loading lesson...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (!lesson) return <div className={styles.error}>Lesson not found.</div>;

    return (
        <div className={styles.lessonContainer}>
            <div className={styles.lessonHeader}>
                <h2>{lesson.title}</h2>
                <p><strong>Level:</strong> {lesson.level}</p>
                <p>{lesson.description}</p>
                {lesson.note && <p className={styles.note}>{lesson.note}</p>}
                {lesson.completed && <p className={styles.completed}>✔ Lesson Completed</p>}
            </div>

            <div className={styles.lessonContent}>
                <style>{lesson.cssContent}</style>
                <div dangerouslySetInnerHTML={{ __html: lesson.htmlContent }} />
            </div>

            {!lesson.completed && (
                <div className={styles.testsSection}>
                    <button onClick={handleShowTests} className={styles.testButton}>
                        Пройти тесты
                    </button>
                    {showTests && lesson.tests?.length > 0 && (
                        <div className={styles.testCard}>
                            <h3>{lesson.tests[currentTestIndex].question}</h3>
                            <form onSubmit={handleAnswerSubmit}>
                                {lesson.tests[currentTestIndex].options.map((option, index) => (
                                    <div key={index} className={styles.option}>
                                        <input
                                            type="radio"
                                            id={`option-${index}`}
                                            name="answer"
                                            value={option}
                                            checked={selectedAnswer === option}
                                            onChange={(e) => setSelectedAnswer(e.target.value)}
                                        />
                                        <label htmlFor={`option-${index}`}>{option}</label>
                                    </div>
                                ))}
                                <button type="submit" disabled={!selectedAnswer} className={styles.submitButton}>
                                    Отправить
                                </button>
                            </form>
                            {testResult && (
                                <div className={styles.testResult}>
                                    <p>{testResult.isCorrect ? 'Correct!' : `Incorrect. Correct answer: ${testResult.correctOption}`}</p>
                                    <p>XP Change: {testResult.xpChange}</p>
                                    {testResult.lessonCompleted && <p>Lesson Completed!</p>}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LessonDetailPage;