import React, { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface AICourseBuilderProps {
  onBuild?: (courseData: any) => void;
}

const AICourseBuilder: React.FC<AICourseBuilderProps> = ({ onBuild }) => {
  const [topic, setTopic] = React.useState('');
  const [level, setLevel] = React.useState('beginner');
  const [duration, setDuration] = React.useState('4 weeks');
  const [isBuilding, setIsBuilding] = React.useState(false);

  const handleBuild = async () => {
    if (!topic.trim()) return;

    setIsBuilding(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onBuild?.({ topic, level, duration });
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <SparklesIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">AI Course Builder</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="E.g., Web Development Fundamentals"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="2 weeks">2 Weeks</option>
            <option value="4 weeks">4 Weeks</option>
            <option value="8 weeks">8 Weeks</option>
            <option value="12 weeks">12 Weeks</option>
          </select>
        </div>

        <button
          onClick={handleBuild}
          disabled={!topic.trim() || isBuilding}
          className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {isBuilding ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Building Course...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Build Course Outline
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          AI will generate a complete course structure with modules and lessons
        </p>
      </div>
    </div>
  );
};

export default AICourseBuilder;
