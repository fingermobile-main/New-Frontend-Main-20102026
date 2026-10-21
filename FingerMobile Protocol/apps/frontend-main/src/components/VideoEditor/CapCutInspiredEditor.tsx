import React, { useState } from 'react';
import { VideoCameraIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface CapCutInspiredEditorProps {
  videoUrl?: string;
  onSave?: (editedVideo: any) => void;
}

const CapCutInspiredEditor: React.FC<CapCutInspiredEditorProps> = ({
  videoUrl,
  onSave
}) => {
  const [selectedTool, setSelectedTool] = React.useState<'trim' | 'split' | 'speed' | 'effects'>('trim');
  const [effects, setEffects] = React.useState<string[]>([]);
  const [transitions, setTransitions] = React.useState('fade');

  const tools = [
    { id: 'trim', name: 'Trim', icon: '✂️' },
    { id: 'split', name: 'Split', icon: '📐' },
    { id: 'speed', name: 'Speed', icon: '⚡' },
    { id: 'effects', name: 'Effects', icon: '✨' }
  ];

  const availableEffects = ['Blur', 'Glitch', 'Vintage', 'Neon', 'Retro'];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-6">
        <VideoCameraIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">CapCut-Inspired Editor</h3>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
          {videoUrl ? (
            <>
              <video src={videoUrl} controls className="max-w-full max-h-full" />
              {effects.includes('Blur') && <div className="absolute inset-0 backdrop-blur-sm pointer-events-none"></div>}
              {effects.includes('Neon') && <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 pointer-events-none"></div>}
            </>
          ) : (
            <p className="text-slate-700">No video loaded</p>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id as any)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedTool === tool.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-slate-300 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{tool.icon}</div>
              <p className="text-xs font-medium">{tool.name}</p>
            </button>
          ))}
        </div>

        {selectedTool === 'effects' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video Effects</label>
            <div className="grid grid-cols-3 gap-2">
              {availableEffects.map((effect) => (
                <button
                  key={effect}
                  onClick={() => {
                    setEffects(prev =>
                      prev.includes(effect)
                        ? prev.filter(e => e !== effect)
                        : [...prev, effect]
                    );
                  }}
                  className={`p-2 rounded-lg border-2 text-sm transition-all ${
                    effects.includes(effect)
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-slate-300 hover:border-gray-300'
                  }`}
                >
                  {effect}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTool === 'speed' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Playback Speed</label>
            <input
              type="range"
              min="0.25"
              max="4"
              step="0.25"
              defaultValue="1"
              className="w-full text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
            <div className="flex justify-between text-xs text-slate-700 mt-1">
              <span>0.25x</span>
              <span>1x</span>
              <span>2x</span>
              <span>4x</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Transition</label>
          <select
            value={transitions}
            onChange={(e) => setTransitions(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="fade">Fade</option>
            <option value="slide">Slide</option>
            <option value="zoom">Zoom</option>
            <option value="wipe">Wipe</option>
          </select>
        </div>

        <button
          onClick={() => onSave?.({ effects, transitions, speed: 1 })}
          className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center justify-center gap-2"
        >
          <SparklesIcon className="w-5 h-5" />
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default CapCutInspiredEditor;
