import React, {} from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';

interface RenderedComponentProps {
  component?: any;
}

const RenderedComponent: React.FC<RenderedComponentProps> = ({ component }) => {
  if (!component) {
    return <div className="p-4 bg-gray-50 rounded-lg text-center text-slate-700">No component</div>;
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg">
      <h4 className="font-medium text-gray-900">{component.name || 'Component'}</h4>
      <div className="text-sm text-gray-600 mt-2">{component.content || 'Content'}</div>
    </div>
  );
};

export default RenderedComponent;
