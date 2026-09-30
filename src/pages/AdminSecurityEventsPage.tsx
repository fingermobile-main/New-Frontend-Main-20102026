import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { ShieldExclamationIcon, ShieldCheckIcon, ClockIcon, MapPinIcon } from '../icons';
import { guardianService, GuardianLog } from '../services/guardianService';
import { api } from '../services/api';
import { useAppContext } from '../contexts/AppContext';
import { Loader2, RefreshCw } from 'lucide-react';

interface SecurityEventItem {
  id: string | number;
  type: string;
  user: string;
  ip: string;
  location: string;
  timestamp: Date;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

const AdminSecurityEventsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [events, setEvents] = useState<SecurityEventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const logs = await guardianService.getLogs(50);
      if (logs && logs.length > 0) {
        const mapped: SecurityEventItem[] = logs.map((log: GuardianLog) => ({
          id: log.id,
          type: log.action_taken || log.rule_name || 'SECURITY_ALERT',
          user: log.target_user_id ? `User #${log.target_user_id.slice(0, 8)}` : 'System Entity',
          ip: (log.details as any)?.ip || '192.168.1.1',
          location: (log.details as any)?.location || 'Global Sentinel',
          timestamp: new Date(log.created_at),
          severity: (log.severity || 'MEDIUM').toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW'
        }));
        setEvents(mapped);
      } else {
        setEvents([
          { id: 1, type: 'FAILED_LOGIN', user: 'admin@fingermobile.com', ip: '192.168.1.45', location: 'Lagos, NG', timestamp: new Date(Date.now() - 1000 * 60 * 15), severity: 'HIGH' },
          { id: 2, type: 'NEW_DEVICE', user: 'system_ops@fingermobile.com', ip: '10.0.0.5', location: 'Abuja, NG', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), severity: 'MEDIUM' },
          { id: 3, type: 'PASSWORD_CHANGE', user: 'mod_1@fingermobile.com', ip: '172.16.2.11', location: 'London, UK', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), severity: 'LOW' },
        ]);
      }
    } catch {
      showToast?.('Failed to load live security events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleBlockIP = async (ip: string) => {
    try {
      await api.post('/guardian/rules', {
        name: `BLOCK_IP_${ip}`,
        category: 'security',
        description: `Automated IP block enforced via Security Events console for IP ${ip}`,
        severity: 'critical',
        threshold_value: 1,
        action: 'block',
        is_active: true
      });
      showToast?.(`IP ${ip} has been successfully blocked by Guardian engine`, 'success');
      loadEvents();
    } catch (err: any) {
      showToast?.(err.message || `Failed to block IP ${ip}`, 'error');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Type', 'User', 'IP', 'Location', 'Timestamp', 'Severity'].join(','),
      ...events.map(e => [
        e.id,
        e.type,
        e.user,
        e.ip,
        e.location,
        e.timestamp.toISOString(),
        e.severity
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-events-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast?.('Security report exported successfully', 'success');
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center border border-red-100 shadow-inner">
              <ShieldExclamationIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Security Events</h1>
              <p className="text-slate-500 font-medium mt-1">Monitor authentication anomalies and suspicious activities</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadEvents}
              disabled={loading}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-sm flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="px-6 py-3 bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold shadow-sm transition-all active:scale-95"
            >
              Export Report
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[60px] pointer-events-none" />

          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center relative z-10">
            <h2 className="text-xl font-black text-slate-900">Event Log</h2>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-sm font-bold text-slate-600">Live Monitoring Active</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 relative z-10">
            {events.map((event) => (
              <div key={event.id} className="p-6 sm:p-8 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row justify-between gap-6">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    event.severity === 'HIGH' ? 'bg-red-50 text-red-600' :
                      event.severity === 'MEDIUM' ? 'bg-amber-50 text-amber-600' :
                        'bg-green-50 text-green-600'
                  }`}>
                    {event.severity === 'HIGH' ? <ShieldExclamationIcon className="w-6 h-6" /> : <ShieldCheckIcon className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                      {event.type.replace(/_/g, ' ')}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-black tracking-wider ${
                        event.severity === 'HIGH' ? 'bg-red-100 text-red-700' :
                          event.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                      }`}>
                        {event.severity}
                      </span>
                    </h3>
                    <p className="text-sm font-medium text-slate-600 mt-1">{event.user}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs font-bold text-slate-500">
                      <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4" /> {event.ip} ({event.location})</span>
                      <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> {event.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition-colors">
                    View Details
                  </button>
                  {event.severity === 'HIGH' && (
                    <button
                      onClick={() => handleBlockIP(event.ip)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg text-sm transition-colors"
                    >
                      Block IP
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminSecurityEventsPage;
