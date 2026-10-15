import React, {} from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface CrmInvoicingWidgetProps {}

const CrmInvoicingWidget: React.FC<CrmInvoicingWidgetProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <DocumentTextIcon className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-bold text-gray-900">CRM Invoicing</h3>
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">Pending Invoices</p>
          <p className="text-2xl font-bold text-green-900 mt-1">12</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">45.2K FIC</p>
        </div>
      </div>
    </div>
  );
};

export default CrmInvoicingWidget;
