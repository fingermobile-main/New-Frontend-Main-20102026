import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-slate-300 dark:border-gray-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold text-orange-500 hover:text-orange-600 transition-colors">
            FingerMobile
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm inline-block"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="text-slate-800 dark:text-gray-200 hover:text-slate-900 dark:hover:text-white font-medium transition-colors text-sm inline-block"
          >
            Create Account
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
