import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Header.module.scss';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className={styles.header}>
            <NavLink to="/" className={styles.siteTitle}>
                EduSpeak
            </NavLink>
            <nav className={styles.nav}>
                {user ? (
                    <>
                        <NavLink
                            to="/lessons"
                            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                        >
                            Уроки
                        </NavLink>
                        <NavLink
                            to="/chat"
                            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                        >
                            Чат с ИИ
                        </NavLink>
                        <NavLink
                            to="/quizzes"
                            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                        >
                            Пройти Квизы
                        </NavLink>
                        <NavLink
                            to="/profile"
                            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                        >
                            Профиль
                        </NavLink>
                        <NavLink
                            to="/contacts"
                            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                        >
                            Контакты
                        </NavLink>
                        <NavLink
                            to="/about-us"
                            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                        >
                            О нас
                        </NavLink>
                        <NavLink
                            to="/privacy-policy"
                            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                        >
                            Политика
                        </NavLink>
                        <button onClick={handleLogout}>Выйти</button>
                    </>
                ) : (
                    <></>
                )}
            </nav>
        </header>
    );
};

export default Header;