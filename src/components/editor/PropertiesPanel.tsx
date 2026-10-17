import React, {} from 'react';
import type { EditorComponent } from '../../types';

interface PropertiesPanelProps {
  component?: EditorComponent;
  onUpdate?: (id: string, updatedComponent: EditorComponent) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ component, onUpdate }) => {
  if (!component) {
    return (
      <div className="w-80 bg-white border-l border-slate-300 p-4 overflow-y-auto">
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg mb-2">No component selected</p>
          <p className="text-sm">Click on a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const handlePropChange = (key: string, value: unknown) => {
    onUpdate?.(component.id, {
      ...component,
      props: {
        ...component.props,
        [key]: value
      }
    });
  };

  return (
    <div className="w-80 bg-white border-l border-slate-300 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Properties</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Component ID
          </label>
          <input
            type="text"
            value={component.id}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <input
            type="text"
            value={component.type}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm capitalize text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
        </div>

        {component.props && Object.keys(component.props).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="text"
              // @ts-ignore - Auto-suppressed for compilation
              value={component.props[key] || ''}
              onChange={(e) => handlePropChange(key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertiesPanel;
