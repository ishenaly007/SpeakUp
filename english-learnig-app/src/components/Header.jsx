import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Header.module.scss'; // To be created

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
    {/* <header> */}
      <nav>
        {user ? (
          <>
            <NavLink to="/" className={styles.logo}>EnglishLearningApp</NavLink>
            {/* Add a logo or app name if desired */}
            {/* <NavLink to="/" className={styles.navLink} activeClassName={styles.activeLink}>Главная</NavLink> */}
            <NavLink to="/lessons">Уроки</NavLink>
            <NavLink to="/chat">Чат с ИИ</NavLink>
            <NavLink to="/quizzes">Пройти Квизы</NavLink>
            <NavLink to="/profile">Профиль</NavLink>
            <button onClick={handleLogout}>Выйти</button>
          </>
        ) : (
          <>
            {/* Optionally, show something in header when not logged in, e.g., App Name */}
            {/* Or simply render null / empty fragment if header should not appear on login/register pages */}
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
