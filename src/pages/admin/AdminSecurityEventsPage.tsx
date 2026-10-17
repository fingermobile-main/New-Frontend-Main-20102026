import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { guardianService, GuardianLog } from '../../services/guardianService';
import { RefreshCw } from 'lucide-react';

interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: string;
  source: string;
  description?: string;
  severity: string;
}

const AdminSecurityEventsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSecurityEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const logs = await guardianService.getLogs(50);
      const mapped: SecurityEvent[] = logs.map((log: GuardianLog) => ({
        id: String(log.id),
        timestamp: log.created_at || new Date().toISOString(),
        eventType: log.action_taken || log.rule_name || 'SECURITY_TRIGGER',
        source: log.target_user_id ? `User #${log.target_user_id.slice(0, 8)}` : 'Guardian Protocol',
        description: (log.details as any)?.description || `Security rule violation (${log.rule_name})`,
        severity: (log.severity || 'medium').toLowerCase()
      }));
      setSecurityEvents(mapped);
    } catch (err: any) {
      setError('Failed to fetch security events.');
      console.error('Error fetching security events:', err);
      showToast?.('Failed to fetch security events from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityEvents();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading security events...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Security Events</h1>
          <p className="text-sm text-gray-500 mt-1">Live Sentinel & Guardian Event Log</p>
        </div>
        <button
          onClick={fetchSecurityEvents}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-blue-600" />
          Refresh
        </button>
      </div>
      {securityEvents.length === 0 ? (
        <p className="text-gray-600">No security events to display.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Event Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                  Severity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {securityEvents.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.eventType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.description}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium 
                    ${
                event.severity === 'high'
                  ? 'text-red-600'
                  : event.severity === 'medium'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }
                  `}
                  >
                    {event.severity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default AdminSecurityEventsPage;
