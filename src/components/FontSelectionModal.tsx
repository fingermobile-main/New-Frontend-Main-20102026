import React, {} from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface FontSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (fontFamily: string) => void;
  currentFont?: string;
}

const FontSelectionModal: React.FC<FontSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentFont = 'Inter'
}) => {
  const fonts = [
    { name: 'Inter', category: 'Sans-serif' },
    { name: 'Roboto', category: 'Sans-serif' },
    { name: 'Open Sans', category: 'Sans-serif' },
    { name: 'Lato', category: 'Sans-serif' },
    { name: 'Montserrat', category: 'Sans-serif' },
    { name: 'Playfair Display', category: 'Serif' },
    { name: 'Merriweather', category: 'Serif' },
    { name: 'Georgia', category: 'Serif' },
    { name: 'Times New Roman', category: 'Serif' },
    { name: 'Courier New', category: 'Monospace' },
    { name: 'Fira Code', category: 'Monospace' },
    { name: 'Source Code Pro', category: 'Monospace' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Select Font</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 gap-3">
            {fonts.map((font) => (
              <button
                key={font.name}
                onClick={() => {
                  onSelect?.(font.name);
                  onClose();
                }}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  currentFont === font.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ fontFamily: font.name }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-gray-900">{font.name}</p>
                    <p className="text-sm text-gray-500">{font.category}</p>
                  </div>
                  <span className="text-2xl text-gray-400">Aa</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontSelectionModal;
