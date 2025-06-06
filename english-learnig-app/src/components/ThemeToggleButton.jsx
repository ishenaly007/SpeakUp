import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import './ThemeToggleButton.module.scss'; // We'll create this SCSS module next

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className={`themeToggleButton ${theme === 'dark' ? 'themeToggleButtonDark' : 'themeToggleButtonLight'}`}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? '🌙' : '☀️'} {/* Simple emoji icons for now */}
    </button>
  );
};

export default ThemeToggleButton;
