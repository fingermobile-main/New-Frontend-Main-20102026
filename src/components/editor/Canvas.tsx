import React, {} from 'react';
import type { EditorComponent } from '../../types';

interface CanvasProps {
  components?: EditorComponent[];
  projectId?: string;
  pageId?: string;
  onSave?: () => Promise<void>;
  onPreview?: () => void;
  onDrop?: (type: string) => void;
  onAdd?: (type: string) => void;
  onSelect?: (id: string | null) => void;
  onDelete?: (id: string) => void;
  onMove?: (dragIndex: number, hoverIndex: number) => void;
  selectedComponentId?: string | null;
}

const Canvas: React.FC<CanvasProps> = ({
  components = [],
  onSelect,
  selectedComponentId
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Drop handling would be implemented by parent
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="flex-1 p-8 bg-gray-50 min-h-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm min-h-[600px] p-8">
        {components.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-700">
            <div className="text-center">
              <p className="text-lg mb-2">Drag components here</p>
              <p className="text-sm">Start building your page</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {components.map((component, index) => (
              <div
                key={component.id}
                onClick={() => onSelect?.(component.id)} role="button" tabIndex={0}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedComponentId === component.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {component.type}
                  </span>
                  <span className="text-xs text-slate-700">#{index + 1}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Component: {component.type}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
