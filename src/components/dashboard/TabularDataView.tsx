import React, { useState } from 'react';
import { TableCellsIcon } from '@heroicons/react/24/outline';

interface TabularDataViewProps {}

const TabularDataView: React.FC<TabularDataViewProps> = () => {
  const [data] = React.useState([
    { id: '1', name: 'Record 1', value: '100' },
    { id: '2', name: 'Record 2', value: '250' },
    { id: '3', name: 'Record 3', value: '175' }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TableCellsIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Tabular Data</h3>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-2 text-sm text-gray-900">{row.name}</td>
              <td className="px-4 py-2 text-sm text-gray-600">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabularDataView;
