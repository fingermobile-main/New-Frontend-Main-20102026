import React, {} from 'react';
import type { EditorComponent } from '../../types';

interface ComponentLibraryProps {
  onDrop: (type: string) => void;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onDrop }) => {
  const componentTypes = [
    { type: 'text', label: 'Text Block', icon: '📝' },
    { type: 'image', label: 'Image', icon: '🖼️' },
    { type: 'button', label: 'Button', icon: '🔘' },
    { type: 'video', label: 'Video', icon: '🎥' },
    { type: 'container', label: 'Container', icon: '📦' }
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-300 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Components</h2>
      <div className="space-y-2">
        {componentTypes.map((comp) => (
          <button
            key={comp.type}
            onClick={() => onDrop(comp.type)}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('componentType', comp.type);
            }}
          >
            <span className="mr-2">{comp.icon}</span>
            {comp.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ComponentLibrary;
