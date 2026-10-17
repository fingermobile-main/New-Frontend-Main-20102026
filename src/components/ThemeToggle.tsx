import React, {} from 'react';
import { useAppContext } from '../contexts/AppContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppContext();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-950 dark:text-gray-200 border border-gray-400 font-black"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <span role="img" aria-label="moon">🌙</span>
      ) : (
        <span role="img" aria-label="sun">☀️</span>
      )}
    </button>
  );
};

export default ThemeToggle;
