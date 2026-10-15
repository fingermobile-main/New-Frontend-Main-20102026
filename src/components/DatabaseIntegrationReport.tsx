import React, { useState, useEffect } from 'react';
import { ServerIcon as DatabaseIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface DatabaseIntegrationReportProps {
  reportData?: any;
}

const DatabaseIntegrationReport: React.FC<DatabaseIntegrationReportProps> = ({ reportData }) => {
  const [report, setReport] = React.useState<any | null>(null);

  React.useEffect(() => {
    // Mock report data
    setReport(reportData || {
      status: 'healthy',
      lastCheck: new Date().toISOString(),
      tables: 45,
      records: 125000,
      size: '2.5 GB',
      uptime: '99.9%',
      issues: []
    });
  }, [reportData]);

  if (!report) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <DatabaseIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h3 className="text-lg font-bold text-gray-900">Database Integration Report</h3>
            <p className="text-sm text-gray-500">Last checked: {new Date(report.lastCheck).toLocaleString()}</p>
          </div>
        </div>

        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
          report.status === 'healthy' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' :
            report.status === 'warning' ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold' :
              'bg-red-100 text-red-950 border border-red-400 font-bold'
        }`}>
          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Tables</p>
          <p className="text-2xl font-bold text-gray-900">{report.tables}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Records</p>
          <p className="text-2xl font-bold text-gray-900">{report.records.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Size</p>
          <p className="text-2xl font-bold text-gray-900">{report.size}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Uptime</p>
          <p className="text-2xl font-bold text-green-600">{report.uptime}</p>
        </div>
      </div>

      {report.issues && report.issues.length > 0 ? (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 mb-3">Issues Found</h4>
          {report.issues.map((issue: any, index: number) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">{issue.title}</p>
                <p className="text-xs text-red-700 mt-1">{issue.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircleIcon className="w-6 h-6 text-green-500" />
          <div>
            <p className="text-sm font-medium text-green-900">All systems operational</p>
            <p className="text-xs text-green-700 mt-1">No issues detected in database integration</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseIntegrationReport;
