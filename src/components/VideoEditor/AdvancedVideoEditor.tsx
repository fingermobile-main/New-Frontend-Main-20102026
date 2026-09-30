import React, { useState } from 'react';
import { VideoCameraIcon, ScissorsIcon } from '@heroicons/react/24/outline';

interface AdvancedVideoEditorProps {
  videoUrl?: string;
  onSave?: (editedVideo: any) => void;
}

const AdvancedVideoEditor: React.FC<AdvancedVideoEditorProps> = ({
  videoUrl,
  onSave
}) => {
  const [trimStart, setTrimStart] = React.useState(0);
  const [trimEnd, setTrimEnd] = React.useState(100);
  const [speed, setSpeed] = React.useState(1);
  const [filter, setFilter] = React.useState('none');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <VideoCameraIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Advanced Video Editor</h3>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
          {videoUrl ? (
            <video src={videoUrl} controls className="max-w-full max-h-full" />
          ) : (
            <p className="text-gray-400">No video loaded</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trim Start (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={trimStart}
              onChange={(e) => setTrimStart(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">{trimStart}%</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trim End (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={trimEnd}
              onChange={(e) => setTrimEnd(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">{trimEnd}%</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Playback Speed</label>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value={0.5}>0.5x (Slow)</option>
            <option value={1}>1x (Normal)</option>
            <option value={1.5}>1.5x (Fast)</option>
            <option value={2}>2x (Very Fast)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="none">None</option>
            <option value="grayscale">Grayscale</option>
            <option value="sepia">Sepia</option>
            <option value="vintage">Vintage</option>
          </select>
        </div>

        <button
          onClick={() => onSave?.({ trimStart, trimEnd, speed, filter })}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <ScissorsIcon className="w-5 h-5" />
          Apply Edits
        </button>
      </div>
    </div>
  );
};

export default AdvancedVideoEditor;
