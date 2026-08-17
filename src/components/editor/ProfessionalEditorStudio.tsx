import React, {} from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface ProfessionalEditorStudioProps {}

const ProfessionalEditorStudio: React.FC<ProfessionalEditorStudioProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <SparklesIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">Professional Editor Studio</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white text-center">
          <p className="font-medium">Advanced Editing</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg text-white text-center">
          <p className="font-medium">Live Preview</p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalEditorStudio;
