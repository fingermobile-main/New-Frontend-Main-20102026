import React, {} from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface ErpFinanceWidgetProps {}

const ErpFinanceWidget: React.FC<ErpFinanceWidgetProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-bold text-gray-900">ERP Finance</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">Revenue</p>
          <p className="text-2xl font-bold text-green-900 mt-1">125K FIC</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-800">Expenses</p>
          <p className="text-2xl font-bold text-red-900 mt-1">78K FIC</p>
        </div>
      </div>
    </div>
  );
};

export default ErpFinanceWidget;
