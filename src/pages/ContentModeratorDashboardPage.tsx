import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import {
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ClockIcon
} from '../icons';

const ContentModeratorDashboardPage: React.FC = () => {
  return (
    <MainLayout pageTitle="Moderation Queue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mt-20 -mr-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] -mb-20 -ml-20"></div>

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-rose-600 rounded-2xl flex items-center justify-center border border-amber-200 shadow-inner">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Moderation Queue</h1>
              <p className="text-slate-500 font-medium mt-1">Review flagged content and maintain community standards.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-rose-700 font-bold text-sm">24 items require attention</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
          {[
            { label: 'Pending Reviews', value: '24', icon: <ClockIcon className="w-6 h-6 text-amber-500" />, color: 'amber' },
            { label: 'High Priority', value: '5', icon: <ExclamationTriangleIcon className="w-6 h-6 text-rose-500" />, color: 'rose' },
            { label: 'Resolved Today', value: '142', icon: <CheckCircleIcon className="w-6 h-6 text-emerald-500" />, color: 'emerald' },
            { label: 'Appeals', value: '12', icon: <DocumentTextIcon className="w-6 h-6 text-blue-500" />, color: 'blue' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-${stat.color}-50`}>
                  {stat.icon}
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                <p className="text-slate-500 font-medium text-sm mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Moderation Queue */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/60 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Active Queue</h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-amber-50 text-amber-700 text-sm font-bold rounded-lg border border-amber-100">All Flags</button>
                  <button className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 text-sm font-bold rounded-lg border border-slate-200 transition-colors">Spam</button>
                  <button className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 text-sm font-bold rounded-lg border border-slate-200 transition-colors">Harassment</button>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { type: 'Post', user: '@crypto_king', reason: 'Potential Spam / Scam', time: '10 mins ago', priority: 'High', color: 'rose' },
                  { type: 'Comment', user: '@angry_user99', reason: 'Harassment', time: '45 mins ago', priority: 'Medium', color: 'amber' },
                  { type: 'Profile', user: '@fake_vitalik', reason: 'Impersonation', time: '2 hours ago', priority: 'High', color: 'rose' },
                  { type: 'Post', user: '@defi_degen', reason: 'Inappropriate Content', time: '3 hours ago', priority: 'Low', color: 'slate' }
                ].map((item, i) => (
                  <div key={i} className={`p-5 bg-white rounded-2xl border border-${item.color}-200 shadow-sm hover:shadow-md transition-shadow`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 bg-${item.color}-50 text-${item.color}-700 text-xs font-bold rounded-md uppercase tracking-wider`}>
                          {item.priority} Priority
                        </span>
                        <span className="text-sm font-medium text-slate-500">{item.time}</span>
                      </div>
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors">
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <p className="font-bold text-slate-900 mb-1">Reported {item.type} by {item.user}</p>
                      <p className="text-sm font-medium text-rose-600">Flagged for: {item.reason}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4 text-sm font-medium text-slate-700 italic">
                          "Click this link to double your ETH instantly! Not a scam 100% legit air drop..."
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1">
                        <CheckCircleIcon className="w-5 h-5" /> Approve
                      </button>
                      <button className="flex-1 py-2 bg-rose-50 text-rose-700 font-bold rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors flex items-center justify-center gap-1">
                        <XCircleIcon className="w-5 h-5" /> Remove
                      </button>
                      <button className="px-4 py-2 bg-slate-50 text-slate-700 font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                             Escalate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Moderation Guidelines */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-amber-500 to-rose-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

              <h2 className="text-xl font-black mb-4 relative z-10">Quick Actions</h2>

              <div className="space-y-3 relative z-10">
                <button className="w-full py-3.5 bg-white text-rose-700 font-bold rounded-xl hover:bg-rose-50 transition-colors shadow-lg shadow-rose-900/20 active:scale-[0.98]">
                     Review Automod Filters
                </button>
                <button className="w-full py-3.5 bg-transparent text-white font-bold rounded-xl border border-white/30 hover:bg-white/10 transition-colors">
                     View Appeal Inbox
                </button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/60 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5 text-indigo-500" />
                   Guidelines Reminder
              </h2>
              <ul className="space-y-3">
                {[
                  'Remove clear phishing links immediately.',
                  'Escalate severe harassment to Admins.',
                  'Context matters: check thread history before banning.',
                  'When in doubt, use the \'Escalate\' option.'
                ].map((guideline, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-medium text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs shrink-0 mt-0.5">{i+1}</div>
                    <span>{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default ContentModeratorDashboardPage;
