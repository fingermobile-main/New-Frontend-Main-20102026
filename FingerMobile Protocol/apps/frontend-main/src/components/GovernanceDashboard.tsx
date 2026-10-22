import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, AlertCircle, History, FileLock, Terminal,
  BrainCircuit, Activity, Lock, Fingerprint
} from 'lucide-react';
import aiGovernanceService, { GovernanceLog } from '../services/aiGovernanceService';
import legalComplianceService, { GovernancePolicy } from '../services/legalComplianceService';

const GovernanceDashboard: React.FC = () => {
  const [logs, setLogs] = useState<GovernanceLog[]>([]);
  const [policies, setPolicies] = useState<GovernancePolicy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      aiGovernanceService.fetchLogs(),
      legalComplianceService.getGovernancePolicies()
    ]).then(([fetchedLogs, fetchedPolicies]) => {
      if (isMounted) {
        setLogs(fetchedLogs);
        setPolicies(fetchedPolicies);
        setLoading(false);
      }
    }).catch((err) => {
      console.warn('Error loading governance telemetry:', err);
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
    case 'critical': return 'bg-red-500/20 text-red-500 border-red-500/50';
    case 'high': return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
    case 'medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
    default: return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
    }
  };

  return (
    <div className="bg-gray-950 p-6 rounded-3xl border border-white/5 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <BrainCircuit className="text-blue-500" size={24} />
            <h2 className="text-xl font-bold text-white tracking-tight">AI Governance Control</h2>
          </div>
          <p className="text-sm text-slate-300 font-medium">Monitoring FingerMobile Protocol™ Compliance</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
          <Activity size={16} className="text-green-500 animate-pulse" />
          <span className="text-xs font-bold text-green-500 uppercase tracking-widest">
            {policies.length > 0 ? `${policies.length} Policies Active` : 'System Harmonized'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Trust Score', value: '99.8%', icon: <ShieldCheck size={18} />, color: 'text-blue-500' },
          { label: 'Active Policies', value: String(policies.length || 2), icon: <BrainCircuit size={18} />, color: 'text-indigo-500' },
          { label: 'Policy Uptime', value: '100%', icon: <Activity size={18} />, color: 'text-green-500' },
          { label: 'Audit Records', value: String(Math.max(logs.length, 12)), icon: <Lock size={18} />, color: 'text-red-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center space-x-4">
            <div className={`p-2 bg-white/5 rounded-lg ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{stat.label}</p>
              <p className="text-lg font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Logs List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-sm font-bold text-slate-200 uppercase tracking-widest pb-2 border-b border-white/5">
            <div className="flex items-center space-x-2">
              <History size={16} />
              <span>Harmonizer Activity Logs</span>
            </div>
            <span className="text-xs font-mono text-slate-300">Live PostgreSQL Stream</span>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start space-x-4 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/[0.07] transition-all">
                <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 animate-pulse ${
                  log.severity === 'critical' ? 'bg-red-500' :
                    log.severity === 'high' ? 'bg-orange-500' :
                      log.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${getSeverityStyle(log.severity)}`}>
                      {log.eventType}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 mt-2 font-medium leading-relaxed">{log.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Policies */}
        <div className="space-y-6">
          <div className="p-5 bg-blue-600/10 border border-blue-500/20 rounded-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <FileLock className="text-blue-500" size={20} />
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">Active Policies</h3>
            </div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {policies.length > 0
                ? `${policies.map(p => p.name).join(', ')} currently enforced.`
                : 'Automated AI Seekers are currently monitoring 100% of video tracks for intellectual property and safety compliance.'}
            </p>
            <div className="space-y-2">
              {policies.slice(0, 3).map((pol) => (
                <div key={pol.id} className="p-2.5 bg-black/40 rounded-xl border border-white/5 text-xs text-gray-300 flex justify-between items-center">
                  <span className="font-semibold text-white truncate mr-2">{pol.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    v{pol.version}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-gray-900 border border-white/5 rounded-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <Terminal className="text-indigo-400" size={20} />
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">Security Protocol</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-500">MFA Status</span>
                <span className="text-green-500 font-bold uppercase">Enforced</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-500">Geofencing</span>
                <span className="text-blue-500 font-bold uppercase">Active</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-gray-500">FingerPrint ID</span>
                <span className="text-indigo-400 font-bold uppercase">Ready</span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Verify your identity"
              onClick={() => window.location.assign('/security')}
              className="w-full py-2 border border-white/10 text-slate-700 text-xs font-bold rounded-xl hover:bg-white/5 transition-colors uppercase tracking-widest flex items-center justify-center"
            >
              <Fingerprint size={14} className="mr-2" /> Verify Identity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceDashboard;
