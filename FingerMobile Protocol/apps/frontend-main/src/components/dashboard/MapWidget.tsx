import React, {} from 'react';
import { MapIcon } from '@heroicons/react/24/outline';

interface MapWidgetProps {}

const MapWidget: React.FC<MapWidgetProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Location Map</h3>
      </div>
      <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
        <p className="text-slate-700 font-medium">Interactive map visualization</p>
      </div>
    </div>
  );
};

export default MapWidget;
