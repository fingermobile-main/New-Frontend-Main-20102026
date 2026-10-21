import React, { useEffect, useState } from 'react';
import ThemeManager, { Theme } from '../utils/themeManager';

interface ThemeSelectorProps {
  className?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className = '' }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('crystalline-white');

  useEffect(() => {
    setCurrentTheme(ThemeManager.getCurrentTheme());
  }, []);

  const handleThemeChange = (theme: Theme) => {
    ThemeManager.setTheme(theme);
    setCurrentTheme(theme);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label htmlFor="theme-selector" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Theme:
      </label>
      <select
        id="theme-selector"
        value={currentTheme}
        onChange={(e) => handleThemeChange(e.target.value as Theme)}
        className="bg-crystalline-white-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <option value="crystalline-white">Crystalline White</option>
        <option value="black">Black</option>
        <option value="system">System Settings</option>
      </select>
    </div>
  );
};

export default ThemeSelector;
