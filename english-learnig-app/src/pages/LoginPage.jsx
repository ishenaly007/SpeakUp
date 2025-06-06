import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.scss';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Введите действительный email';
    }
    if (!password || password.length < 8) {
      errors.password = 'Пароль должен содержать минимум 8 символов';
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
      await login({ email, password });
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Ошибка входа. Проверьте email и пароль.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className={styles.loginContainer}>
        <div className={styles.formWrapper}>
          <h2 className={styles.title}>Вход</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
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
            {error && <p className={styles.errorMessage}>{error}</p>}
            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>
          <p className={styles.linkWrapper}>
            Нет аккаунта? <Link to="/register" className={styles.link}>Зарегистрироваться</Link>
          </p>
        </div>
      </div>
  );
};

export default LoginPage;