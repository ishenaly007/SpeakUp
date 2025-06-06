import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Register.module.scss';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { register, error, setError } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        if (!username || username.length < 3) {
            errors.username = 'Имя пользователя должно содержать минимум 3 символа';
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Введите действительный email';
        }
        if (!password || password.length < 8) {
            errors.password = 'Пароль должен содержать минимум 8 символов';
        }
        if (password !== confirmPassword) {
            errors.confirmPassword = 'Пароли не совпадают';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setFormErrors({});

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await register({ username, email, password });
            navigate('/login');
        } catch (err) {
            console.error('Registration failed:', err);
            setError(err.message || 'Ошибка регистрации. Попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.formWrapper}>
                <h2 className={styles.title}>Регистрация</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username" className={styles.label}>Имя пользователя:</label>
                        <input
                            type="text"
                            id="username"
                            className={`${styles.input} ${formErrors.username ? styles.error : ''}`}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        {formErrors.username && <p className={styles.errorMessage}>{formErrors.username}</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email:</label>
                        <input
                            type="email"
                            id="email"
                            className={`${styles.input} ${formErrors.email ? styles.error : ''}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {formErrors.email && <p className={styles.errorMessage}>{formErrors.email}</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            className={`${styles.input} ${formErrors.password ? styles.error : ''}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {formErrors.password && <p className={styles.errorMessage}>{formErrors.password}</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>Подтверждение пароля:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className={`${styles.input} ${formErrors.confirmPassword ? styles.error : ''}`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {formErrors.confirmPassword && <p className={styles.errorMessage}>{formErrors.confirmPassword}</p>}
                    </div>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <button type="submit" className={styles.button} disabled={isLoading}>
                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>
                <p className={styles.linkWrapper}>
                    Уже есть аккаунт? <Link to="/login" className={styles.link}>Войти</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;