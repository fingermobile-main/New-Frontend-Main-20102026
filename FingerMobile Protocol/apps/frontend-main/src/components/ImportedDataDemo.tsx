import React, { useState, useEffect } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface ImportedDataDemoProps {
  dataType?: string;
  data?: any[];
}

const ImportedDataDemo: React.FC<ImportedDataDemoProps> = ({
  dataType = 'CSV',
  data
}) => {
  const [demoData, setDemoData] = React.useState<any[]>(data || []);

  React.useEffect(() => {
    if (!data || data.length === 0) {
      setDemoData([
        { id: '1', name: 'Sample Record 1', value: 'Value A', status: 'active' },
        { id: '2', name: 'Sample Record 2', value: 'Value B', status: 'inactive' },
        { id: '3', name: 'Sample Record 3', value: 'Value C', status: 'active' }
      ]);
    }
  }, [data]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <DocumentTextIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Imported Data Preview</h3>
        <span className="ml-auto text-sm text-slate-700">{dataType}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-800 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-800 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-800 uppercase">Value</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-800 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {demoData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{row.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{row.value}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    row.status === 'active' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' : 'bg-gray-100 text-green-950'
                  }font-black`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {demoData.length === 0 && (
        <div className="text-center py-8 text-slate-700">
          <p>No data imported yet</p>
        </div>
      )}
    </div>
  );
};

export default ImportedDataDemo;
