import React, { useState } from 'react';
import { MicrophoneIcon } from '@heroicons/react/24/outline';

const AdvancedVoiceEngine: React.FC = () => {
  const [isRecording, setIsRecording] = React.useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <MicrophoneIcon className="w-6 h-6 text-red-600" />
        <h3 className="text-lg font-bold text-gray-900">Voice Engine</h3>
      </div>
      <div className="space-y-4">
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`w-full px-4 py-3 rounded-lg transition-colors ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {isRecording && (
          <div className="p-4 bg-red-50 rounded-lg text-center">
            <div className="animate-pulse text-red-600 font-medium">Recording...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedVoiceEngine;
