import React from 'react';

import { useAppContext } from '../../../contexts/AppContext';
import type { SystemStatus } from '../../../types';
import { CpuChipIcon } from '../../../components/icons';

const SystemStatusPage: React.FC = () => {
  const { showToast } = useAppContext();
  
  // Mock system statuses since it's not in AppContext yet
  const systemStatuses: SystemStatus[] = [
    { id: '1', serviceName: 'API Server', status: 'operational', lastChecked: new Date().toISOString(), module: undefined, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', serviceName: 'Database', status: 'operational', lastChecked: new Date().toISOString(), module: undefined, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', serviceName: 'CDN', status: 'operational', lastChecked: new Date().toISOString(), module: undefined, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '4', serviceName: 'Email Service', status: 'degraded', lastChecked: new Date().toISOString(), module: undefined, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];

    const getStatusColor = (status: any) => {
        switch (status) {
            case 'operational':
                return 'bg-green-100 text-green-800';
            case 'degraded':
                return 'bg-yellow-100 text-yellow-800';
            case 'down':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const StatusRow: React.FC<{ status: SystemStatus }> = ({ status }) => (
        <div className="flex items-center justify-between p-4 border-b last:border-0">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status.status).replace('text-', 'bg-')}`}></div>
                <p className="font-semibold">{status.serviceName}</p>
            </div>
            <div className="flex items-center gap-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status.status)}`}>
                    {status.status}
                </span>
                <p className="text-sm text-gray-500">Last Checked: {new Date(status.lastChecked).toLocaleTimeString()}</p>
            </div>
        </div>
    );
    
    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <CpuChipIcon className="w-8 h-8 text-gray-600"/>
                <h1 className="text-2xl font-bold">System Status</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-sm text-gray-500">Overall Status</p>
                    <p className="text-2xl font-bold text-green-600">All Systems Operational</p>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-sm text-gray-500">Current Build Version</p>
                    <p className="text-2xl font-bold font-mono">2.5.1-alpha</p>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-sm text-gray-500">Last Backup</p>
                    <p className="text-2xl font-bold">Today, 4:00 AM</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
                {systemStatuses.map((status: SystemStatus) => <StatusRow key={status.module} status={status} />)}
            </div>
        </div>
    );
};

export default SystemStatusPage;

