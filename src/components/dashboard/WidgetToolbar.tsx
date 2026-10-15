import React, {} from 'react';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

interface WidgetToolbarProps {
  onAdd?: () => void;
  onRefresh?: () => void;
}

const WidgetToolbar: React.FC<WidgetToolbarProps> = ({ onAdd, onRefresh }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-slate-300">
      <button onClick={onAdd} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Add Widget" aria-label="Button"><svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      </button>
      <button onClick={onRefresh} className="p-2 hover:bg-gray-100 rounded transition-colors" title="Refresh" aria-label="Button"><svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      </button>
      <div className="flex-1"></div>
      <WrenchScrewdriverIcon className="w-5 h-5 text-gray-600" />
    </div>
  );
};

export default WidgetToolbar;
