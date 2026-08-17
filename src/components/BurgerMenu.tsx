import React, {} from 'react';
import { XIcon, MenuIcon } from '@/icons'; // Updated import to get icons from the main icons directory

interface BurgerMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ isOpen, toggleMenu }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  };

  return (
    <button
      onClick={toggleMenu}
      onKeyDown={handleKeyDown}
      className="text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="main-navigation-menu"
    >
      {isOpen ? (
        <XIcon className="w-6 h-6" />
      ) : (
        <MenuIcon className="w-6 h-6" />
      )}
    </button>
  );
};

export default BurgerMenu;