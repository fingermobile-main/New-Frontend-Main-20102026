import React, { useState } from 'react';

interface EnhancedPropertiesPanelProps {
  component?: any;
  onUpdate?: (id: string, updates: unknown) => void;
  onDelete?: (id: string) => void;
}

const EnhancedPropertiesPanel: React.FC<EnhancedPropertiesPanelProps> = ({
  component,
  onUpdate,
  onDelete
}) => {
  const [activeTab, setActiveTab] = React.useState<'properties' | 'styles' | 'advanced'>('properties');

  if (!component) {
    return (
      <div className="w-80 bg-white border-l border-slate-300 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center text-gray-500">
            <p className="text-sm">Select a component to edit</p>
          </div>
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
    <div className="w-80 bg-white border-l border-slate-300 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
      </div>

      <div className="flex border-b border-gray-200">
        {(['properties', 'styles', 'advanced'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-2 text-xs font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'properties' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">ID</label>
              <input
                type="text"
                value={component.id}
                disabled
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-gray-50" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <input
                type="text"
                value={component.type}
                disabled
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-gray-50 capitalize" />
            </div>

            {component.props && Object.entries(component.props).map(([key, value]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="text"
                  value={String(value || '')}
                  onChange={(e) => handlePropChange(key, e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'styles' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-500 text-center py-8">Style properties coming soon</p>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <button
              onClick={() => onDelete?.(component.id)}
              className="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors"
            >
              Delete Component
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedPropertiesPanel;
