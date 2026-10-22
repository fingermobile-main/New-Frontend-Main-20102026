import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { MagnifyingGlassIcon as SearchIcon, BellIcon } from '@/icons'; // Changed import to use our icons
import BurgerMenu from './BurgerMenu';

interface HeaderProps {
  pageTitle?: string;
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    onMenuToggle?.();
  };

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <BurgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
          <div className="relative">
            <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-64 rounded-md border bg-transparent pl-8 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/notifications"
            aria-label="View notifications"
            className="relative inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <BellIcon className="h-5 w-5" />
            <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2 rounded-md shadow-sm transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
