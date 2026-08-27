import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-orange-500">FingerMobile</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
            Log In
          </button>
          <button className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
            Create Account
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;