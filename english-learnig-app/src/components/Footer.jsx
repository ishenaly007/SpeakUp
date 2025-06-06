import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>&copy; {new Date().getFullYear()} EduSpeak. Все права защищены.</p>
        <nav className={styles.footerNav}>
          <NavLink to="/contacts" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}>Контакты</NavLink>
          <NavLink to="/about-us" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}>О нас</NavLink>
          <NavLink to="/privacy-policy" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}>Политика конфиденциальности</NavLink>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
