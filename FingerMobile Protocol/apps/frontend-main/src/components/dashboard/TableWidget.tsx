import React, { useState } from 'react';
import { TableCellsIcon } from '@heroicons/react/24/outline';

interface TableWidgetProps {}

const TableWidget: React.FC<TableWidgetProps> = () => {
  const [data] = React.useState([
    { id: '1', name: 'Item 1', value: '100', status: 'active' },
    { id: '2', name: 'Item 2', value: '250', status: 'inactive' },
    { id: '3', name: 'Item 3', value: '175', status: 'active' }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TableCellsIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Data Table</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-800 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-800 uppercase">Value</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-800 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-2 text-sm text-gray-900">{row.name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{row.value}</td>
                <td className="px-4 py-2">
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
    </div>
  );
};

export default TableWidget;
