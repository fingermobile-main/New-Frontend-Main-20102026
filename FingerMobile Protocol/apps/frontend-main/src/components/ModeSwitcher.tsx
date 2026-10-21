import React, {} from 'react';

interface ModeSwitcherProps {
  currentMode: 'professional' | 'social';
  onModeChange: (mode: 'professional' | 'social') => void;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-fm-card p-4 mb-6">
      <h3 className="font-bold text-fm-gray-900 mb-3">Platform Mode</h3>
      <p className="text-xs text-fm-gray-500 mb-4">
        Adjust your experience between professional and social contexts
      </p>

      <div className="flex rounded-full bg-gray-200 p-1 mb-3 border text-gray-950 border-gray-400 font-black">
        <button
          onClick={() => onModeChange('professional')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-medium transition-colors ${
            currentMode === 'professional'
              ? 'bg-fm-orange text-white shadow'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Professional
        </button>
        <button
          onClick={() => onModeChange('social')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-medium transition-colors ${
            currentMode === 'social'
              ? 'bg-fm-orange text-white shadow'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Social
        </button>
      </div>

      <div className="text-xs text-fm-gray-500">
        {currentMode === 'professional'
          ? 'Showing professional content, job opportunities, and industry news'
          : 'Showing social content, personal updates, and casual interactions'}
      </div>
    </div>
  );
};

export default ModeSwitcher;
