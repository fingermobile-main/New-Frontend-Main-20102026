import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
  ShieldCheckIcon,
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  CogIcon,
  BellIcon
} from '../icons';

const ContentAdminDashboardPage: React.FC = () => {
  return (
    <MainLayout pageTitle="Content Admin Dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] -mt-20 -mr-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] -mb-20 -ml-20"></div>

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl flex items-center justify-center border border-rose-200 shadow-inner">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Content Admin Dashboard</h1>
              <p className="text-slate-500 font-medium mt-1">Platform-wide content governance and analytics overview.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-colors shadow-sm relative">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            </button>
            <button className="px-5 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md">
               Generate Report
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 relative z-10">
          {[
            { label: 'Total Users', value: '24.5K', trend: '+12%', icon: <UsersIcon className="w-6 h-6 text-blue-500" />, color: 'blue' },
            { label: 'Active Content', value: '142.8K', trend: '+8.4%', icon: <DocumentTextIcon className="w-6 h-6 text-emerald-500" />, color: 'emerald' },
            { label: 'Pending Reviews', value: '842', trend: '-2.1%', icon: <ShieldCheckIcon className="w-6 h-6 text-amber-500" />, color: 'amber' },
            { label: 'Platform Revenue', value: '$45.2K', trend: '+15.3%', icon: <ChartBarIcon className="w-6 h-6 text-purple-500" />, color: 'purple' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-${stat.color}-50`}>
                  {stat.icon}
                </div>
                <span className={`text-sm font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'} bg-${stat.trend.startsWith('+') ? 'emerald' : 'rose'}-50 px-2 py-1 rounded-lg`}>
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-slate-500 font-medium text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/60 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-900">Platform Growth</h2>
                <select className="bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-rose-500 focus:border-rose-500 block p-2.5 font-medium font-bold border-slate-300 focus:ring-2">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="h-72 w-full flex items-end gap-2">
                {/* Placeholder for chart */}
                {[40, 60, 30, 80, 50, 90, 70, 100, 60, 80, 40, 60].map((h, i) => (
                  <div key={i} className="flex-1 bg-rose-100 rounded-t-lg relative group">
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-rose-500 to-orange-400 rounded-t-lg transition-all duration-1000 group-hover:opacity-80"
                      style={{ height: `${h}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/60 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Admin Actions</h2>
              <div className="space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center font-bold">
                             AD
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">System configuration updated</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">By Admin user • 2 hours ago</p>
                      </div>
                    </div>
                    <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/60 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">System Health</h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">Server Load</span>
                    <span className="text-sm font-bold text-emerald-500">42%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 border text-slate-950 border-slate-400 font-black">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">Database Capacity</span>
                    <span className="text-sm font-bold text-amber-500">78%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 border text-slate-950 border-slate-400 font-black">
                    <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">Storage API</span>
                    <span className="text-sm font-bold text-rose-500">92%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 border text-slate-950 border-slate-400 font-black">
                    <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-8 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors">
                View Infrastructure
              </button>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              <CogIcon className="w-10 h-10 text-rose-400 mb-4" />
              <h3 className="font-black text-xl mb-2">Admin Settings</h3>
              <p className="text-slate-400 text-sm font-medium mb-6">Manage platform configurations, user roles, and global policies.</p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-slate-700 font-bold rounded-xl border border-white/20 transition-colors backdrop-blur-md">
                 Open Settings
              </button>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default ContentAdminDashboardPage;
