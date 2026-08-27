import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="container mx-auto text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} FingerMobile Protocol. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;