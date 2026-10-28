import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';
import {
  ShieldCheckIcon,
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  CogIcon,
  BellIcon
} from '../icons';

interface AdminActionItem {
  id: number;
  title: string;
  admin: string;
  time: string;
  ip: string;
  category: string;
  details: string;
}

const ContentAdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [growthRange, setGrowthRange] = useState<'7d' | '30d' | 'year'>('30d');
  const [selectedAction, setSelectedAction] = useState<AdminActionItem | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportGenerated, setReportGenerated] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const adminActions: AdminActionItem[] = [
    {
      id: 1,
      title: 'Global DEFCON Protocol Synchronized',
      admin: 'Mbah Israel Obinna (Founder)',
      time: '15 mins ago',
      ip: '192.168.1.104',
      category: 'Security Governance',
      details: 'DEFCON level verified and geo-restriction integrity confirmed across all sovereign routing nodes.'
    },
    {
      id: 2,
      title: 'UGC Content Moderation Policy Applied',
      admin: 'Content Moderator Team',
      time: '1 hour ago',
      ip: '10.0.4.12',
      category: 'Content Moderation',
      details: 'Automated filter updated for high-frequency media uploads with direct PostgreSQL persistence enforcement.'
    },
    {
      id: 3,
      title: 'Creator Payout Batch Reconciled',
      admin: 'Mrs. Mbah Eunice Emonena (CFO)',
      time: '3 hours ago',
      ip: '10.0.1.20',
      category: 'Treasury & Ledger',
      details: 'ACH disbursement batch of $14,290.00 settled against bank payout accounts.'
    },
    {
      id: 4,
      title: 'Sovereign RBAC Permissions Evaluated',
      admin: 'System Auditor',
      time: '5 hours ago',
      ip: '127.0.0.1',
      category: 'Access Control',
      details: '210+ platform screens reviewed against sovereign RBAC rules. Zero unauthorized bypass detected.'
    }
  ];

  const chartData = growthRange === '7d' 
    ? [55, 68, 72, 85, 90, 88, 95] 
    : growthRange === '30d'
    ? [40, 60, 45, 80, 50, 90, 70, 100, 65, 85, 75, 95]
    : [30, 45, 55, 60, 68, 75, 82, 88, 92, 94, 98, 100];

  const handleGenerateReport = () => {
    const timestamp = new Date().toISOString();
    const reportSummary = `Platform Governance Report - Generated ${new Date().toLocaleString()}\nActive Range: ${growthRange}\nTotal Verified Nodes: 18\nSecurity Status: DEFCON Nominal`;
    
    // Create direct downloadable file
    const blob = new Blob([reportSummary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FingerMobile-Content-Admin-Report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setReportGenerated(`Report compiled and downloaded successfully (${new Date().toLocaleTimeString()})`);
    setTimeout(() => setReportGenerated(null), 5000);
  };

  return (
    <MainLayout pageTitle="Content Admin Dashboard">
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-28 md:pb-12 w-full max-w-full overflow-x-hidden text-slate-900">

        {/* Feedback Alert */}
        {reportGenerated && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-950 font-bold shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-emerald-800 text-lg">✓</span>
              <span>{reportGenerated}</span>
            </div>
            <button type="button" onClick={() => setReportGenerated(null)} className="text-emerald-900 font-black text-sm">✕</button>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-300 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] -mt-20 -mr-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -mb-20 -ml-20"></div>

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-orange-600 rounded-2xl flex items-center justify-center border border-rose-300 shadow-inner">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Content Admin Dashboard</h1>
              <p className="text-slate-700 font-semibold mt-1">Platform-wide content governance, audit trail, and infrastructure analytics.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-3 bg-white border border-slate-300 rounded-xl text-slate-800 hover:bg-slate-100 hover:text-rose-700 transition-colors shadow-xs relative cursor-pointer"
              title="View Admin Alerts"
            >
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-600 rounded-full animate-pulse"></span>
            </button>
            <button 
              onClick={handleGenerateReport}
              className="px-5 py-3 bg-slate-900 text-white font-black text-sm rounded-xl hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              Generate Audit Report
            </button>
          </div>
        </div>

        {/* Notifications Popover */}
        {notificationsOpen && (
          <div className="mb-6 bg-white border border-slate-300 rounded-2xl p-5 shadow-lg animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Active Admin Notifications (3)</h3>
              <button type="button" onClick={() => setNotificationsOpen(false)} className="text-xs font-bold text-slate-600 hover:text-slate-900">Close</button>
            </div>
            <div className="divide-y divide-slate-100 text-xs mt-2">
              <div className="py-2.5 flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                <div>
                  <p className="font-bold text-slate-900">PostgreSQL UGC Media Storage operational</p>
                  <p className="text-slate-700">Port 5433 fingermobile_platform_db synced.</p>
                </div>
              </div>
              <div className="py-2.5 flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                <div>
                  <p className="font-bold text-slate-900">DEFCON 5 readiness state verified</p>
                  <p className="text-slate-700">STERCS emergency controls nominal.</p>
                </div>
              </div>
              <div className="py-2.5 flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-1 shrink-0"></span>
                <div>
                  <p className="font-bold text-slate-900">New Creator application batch pending</p>
                  <p className="text-slate-700">6 UGC broadcaster verifications awaiting review.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
          {[
            { label: 'Total Members', value: '24.5K', trend: '+12%', icon: <UsersIcon className="w-6 h-6 text-blue-700" />, badge: 'bg-blue-100 text-blue-950 border-blue-400' },
            { label: 'Active Content Items', value: '142.8K', trend: '+8.4%', icon: <DocumentTextIcon className="w-6 h-6 text-emerald-700" />, badge: 'bg-emerald-100 text-emerald-950 border-emerald-400' },
            { label: 'Pending Reviews', value: '842', trend: '-2.1%', icon: <ShieldCheckIcon className="w-6 h-6 text-amber-700" />, badge: 'bg-amber-100 text-amber-950 border-amber-400' },
            { label: 'Platform Revenue', value: '$45.2K', trend: '+15.3%', icon: <ChartBarIcon className="w-6 h-6 text-purple-700" />, badge: 'bg-purple-100 text-purple-950 border-purple-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-300 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  {stat.icon}
                </div>
                <span className={`text-xs font-black border px-2.5 py-1 rounded-lg ${stat.badge}`}>
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-slate-800 font-bold text-xs uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-300 shadow-xs">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Platform Traffic & Content Volume</h2>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">Real-time throughput metrics across global gateway nodes</p>
                </div>
                <select 
                  value={growthRange}
                  onChange={(e) => setGrowthRange(e.target.value as any)}
                  className="bg-white border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 font-bold shadow-xs focus:ring-2 focus:ring-rose-500 cursor-pointer"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="year">Full Year (2026)</option>
                </select>
              </div>
              <div className="h-64 w-full flex items-end gap-3 pt-6 border-b border-slate-200 pb-2">
                {chartData.map((h, i) => (
                  <div key={i} className="flex-1 bg-rose-50 rounded-t-lg relative group h-full flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-rose-600 to-orange-500 rounded-t-lg transition-all duration-500 group-hover:opacity-90 shadow-xs"
                      style={{ height: `${h}%` }}
                    ></div>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {h}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mt-3 px-1">
                <span>Start ({growthRange === '7d' ? 'Mon' : growthRange === '30d' ? 'Week 1' : 'Jan'})</span>
                <span>Mid-Cycle</span>
                <span>Current ({growthRange === '7d' ? 'Sun' : growthRange === '30d' ? 'Week 4' : 'Dec'})</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-300 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Recent Sovereign Admin Audits</h2>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">Immutable log of system modifications and administrative actions</p>
                </div>
                <button 
                  onClick={() => navigate('/admin/activity-logs')}
                  className="text-xs font-bold text-rose-700 hover:text-rose-900 cursor-pointer underline"
                >
                  View Full Audit Log →
                </button>
              </div>
              <div className="space-y-3.5">
                {adminActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-rose-100 text-rose-950 border border-rose-300 rounded-xl flex items-center justify-center font-black text-xs shrink-0">
                        ACT
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{action.title}</p>
                        <p className="text-xs text-slate-700 font-semibold mt-0.5">By {action.admin} • {action.time}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedAction(action)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer shadow-xs"
                    >
                      Inspect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-300 shadow-xs">
              <h2 className="text-xl font-black text-slate-900 mb-6">Node & Server Health</h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-800">Node Cluster Load</span>
                    <span className="text-sm font-black text-emerald-800">42% Nominal</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 border border-slate-300 overflow-hidden">
                    <div className="bg-emerald-600 h-3 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-800">PostgreSQL Database Capacity</span>
                    <span className="text-sm font-black text-amber-800">5433 / Healthy</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 border border-slate-300 overflow-hidden">
                    <div className="bg-amber-600 h-3 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-800">UGC Media Stream Storage</span>
                    <span className="text-sm font-black text-blue-800">Active</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 border border-slate-300 overflow-hidden">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full mt-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-sm rounded-xl border border-slate-300 transition-colors cursor-pointer shadow-xs"
              >
                View Primary Infrastructure Console →
              </button>
            </div>

            <div className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl p-8 text-white shadow-md relative overflow-hidden border border-slate-800">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              <CogIcon className="w-10 h-10 text-rose-400 mb-4" />
              <h3 className="font-black text-xl mb-2 text-white">Sovereign Admin Settings</h3>
              <p className="text-slate-300 text-xs font-semibold mb-6">Manage platform permissions, assign corporate tiers, and configure DEFCON parameters.</p>
              <button 
                onClick={() => navigate('/admin/users-permission')}
                className="w-full py-3 bg-white text-slate-950 hover:bg-slate-100 font-black text-sm rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Open RBAC Permissions Console
              </button>
            </div>
          </div>
        </div>

        {/* Sovereign Platform Ownership Directive */}
        <PlatformOwnershipCard />

        {/* Action Detail Inspection Modal */}
        {selectedAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-slate-300 max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-lg font-black text-slate-900">Administrative Audit Record</h3>
                <button 
                  onClick={() => setSelectedAction(null)} 
                  className="text-slate-500 hover:text-slate-900 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-slate-800">
                <div>
                  <span className="font-black text-slate-900 uppercase">Action Title:</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedAction.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <div>
                    <span className="font-bold text-slate-700">Executing Authority:</span>
                    <p className="font-semibold text-slate-900">{selectedAction.admin}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Timestamp:</span>
                    <p className="font-semibold text-slate-900">{selectedAction.time}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Gateway IP:</span>
                    <p className="font-semibold text-slate-900 font-mono">{selectedAction.ip}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Governance Scope:</span>
                    <p className="font-semibold text-slate-900">{selectedAction.category}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-700">Audit Description:</span>
                  <p className="text-slate-800 font-medium mt-1 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {selectedAction.details}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedAction(null)}
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800 cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around shadow-2xl">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-slate-800 hover:text-rose-600 transition-colors"
          >
            <ShieldCheckIcon className="w-5 h-5 mb-0.5 text-rose-600" />
            <span>Governance</span>
          </button>
          <button
            onClick={() => setGrowthRange(growthRange === '7d' ? '30d' : '7d')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-slate-800 hover:text-rose-600 transition-colors"
          >
            <ChartBarIcon className="w-5 h-5 mb-0.5 text-blue-600" />
            <span>Metrics</span>
          </button>
          <button
            onClick={() => navigate('/community-management')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-slate-800 hover:text-rose-600 transition-colors"
          >
            <UsersIcon className="w-5 h-5 mb-0.5 text-emerald-600" />
            <span>Users</span>
          </button>
          <button
            onClick={handleGenerateReport}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-slate-800 hover:text-rose-600 transition-colors"
          >
            <DocumentTextIcon className="w-5 h-5 mb-0.5 text-amber-600" />
            <span>Report</span>
          </button>
        </div>

      </div>
    </MainLayout>
  );
};

export default ContentAdminDashboardPage;
