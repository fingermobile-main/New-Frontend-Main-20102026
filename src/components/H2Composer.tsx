import React, { useState } from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/outline';

interface H2ComposerProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

const H2Composer: React.FC<H2ComposerProps> = ({ 
  initialValue = '',
  onChange 
}) => {
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <CodeBracketIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">H2 Composer</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="headingText" className="block text-sm font-medium text-gray-700 mb-2">Heading Text</label>
          <textarea
            id="headingText"
            value={value}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="Enter your heading content..."
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Preview:</p>
          <h2 className="text-2xl font-bold text-gray-900">{value || 'Your heading will appear here'}</h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setValue('')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
          >
            Clear
          </button>
          <button
            onClick={() => onChange?.(value)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default H2Composer;
