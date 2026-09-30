import { Link} from 'react-router-dom';
import React, { useState } from 'react';

interface EnhancedComponentLibraryProps {
  onComponentSelect?: (type: string) => void;
  categories?: Array<{
    id: string;
    name: string;
    components: Array<{ type: string; label: string; icon: string }>;
  }>;
}

const EnhancedComponentLibrary: React.FC<EnhancedComponentLibraryProps> = ({
  onComponentSelect,
  categories: propCategories
}) => {
  const [activeCategory, setActiveCategory] = React.useState<string>('basic');

  const defaultCategories = [
    {
      id: 'basic',
      name: 'Basic',
      components: [
        { type: 'text', label: 'Text Block', icon: '📝' },
        { type: 'heading', label: 'Heading', icon: '🔤' },
        { type: 'paragraph', label: 'Paragraph', icon: '📄' }
      ]
    },
    {
      id: 'media',
      name: 'Media',
      components: [
        { type: 'image', label: 'Image', icon: '🖼️' },
        { type: 'video', label: 'Video', icon: '🎥' },
        { type: 'audio', label: 'Audio', icon: '🎵' }
      ]
    },
    {
      id: 'interactive',
      name: 'Interactive',
      components: [
        { type: 'button', label: 'Button', icon: '🔘' },
        { type: 'link', label: 'Link', icon: '🔗' },
        { type: 'form', label: 'Form', icon: '📋' }
      ]
    },
    {
      id: 'layout',
      name: 'Layout',
      components: [
        { type: 'container', label: 'Container', icon: '📦' },
        { type: 'grid', label: 'Grid', icon: '⊞' },
        { type: 'section', label: 'Section', icon: '▭' }
      ]
    }
  ];

  const categories = propCategories || defaultCategories;
  const activeComponents = categories.find(c => c.id === activeCategory)?.components || [];

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Component Library</h2>
      </div>

      <div className="flex border-b border-gray-200">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {activeComponents.map((comp) => (
            <button
              key={comp.type}
              onClick={() => onComponentSelect?.(comp.type)}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('componentType', comp.type);
              }}
              className="w-full flex items-center px-3 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-all group"
            >
              <span className="mr-3 text-xl">{comp.icon}</span>
              <span className="font-medium">{comp.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedComponentLibrary;
