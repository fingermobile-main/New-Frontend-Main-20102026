import React, {} from 'react';

interface EnhancedRenderedComponentProps {
  component?: any;
}

const EnhancedRenderedComponent: React.FC<EnhancedRenderedComponentProps> = ({ component }) => {
  if (!component) {
    return <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">No component to render</div>;
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <h4 className="font-medium text-gray-900 mb-2">{component.type || 'Component'}</h4>
      <div className="text-sm text-gray-600">
        {component.content || component.text || 'Component content'}
      </div>
    </div>
  );
};

export default EnhancedRenderedComponent;
