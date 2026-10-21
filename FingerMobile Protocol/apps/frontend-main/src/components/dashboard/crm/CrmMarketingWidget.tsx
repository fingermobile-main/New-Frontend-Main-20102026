import React, {} from 'react';
import { MegaphoneIcon } from '@heroicons/react/24/outline';

interface CrmMarketingWidgetProps {}

const CrmMarketingWidget: React.FC<CrmMarketingWidgetProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <MegaphoneIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">CRM Marketing</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800">Campaigns</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">8</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">Leads</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">234</p>
        </div>
      </div>
    </div>
  );
};

export default CrmMarketingWidget;
