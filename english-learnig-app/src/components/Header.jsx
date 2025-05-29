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
                SpeakUp
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