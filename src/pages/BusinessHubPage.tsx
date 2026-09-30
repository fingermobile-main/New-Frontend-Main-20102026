import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';
import {
  BriefcaseIcon,
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  MegaphoneIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon
} from '../icons';

const BusinessHubPage: React.FC = () => {
  const { ficBalance } = useAppContext();

  const businessTools = [
    { name: 'Ad Campaigns', icon: <MegaphoneIcon className="w-6 h-6" />, desc: 'Create and manage advertising', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    { name: 'Storefront', icon: <BuildingOfficeIcon className="w-6 h-6" />, desc: 'Manage your digital products', color: 'bg-purple-100 text-purple-600 border-purple-200' },
    { name: 'Team Hub', icon: <UserGroupIcon className="w-6 h-6" />, desc: 'Manage roles and permissions', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
    { name: 'Analytics', icon: <ChartBarIcon className="w-6 h-6" />, desc: 'Advanced performance metrics', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
    { name: 'Invoices', icon: <DocumentTextIcon className="w-6 h-6" />, desc: 'Billing and payment history', color: 'bg-amber-100 text-amber-600 border-amber-200' },
    { name: 'Growth Tools', icon: <ArrowTrendingUpIcon className="w-6 h-6" />, desc: 'SEO and marketing suite', color: 'bg-rose-100 text-rose-600 border-rose-200' },
  ];

  return (
    <MainLayout pageTitle="Business Hub">
      <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mt-20 -mr-20"></div>

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-slate-900 rounded-2xl flex items-center justify-center border border-indigo-200 shadow-inner">
              <BriefcaseIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Hub</h1>
              <p className="text-slate-500 font-medium mt-1">Centralize your business operations and monetization</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center gap-2 relative z-10">
            <BriefcaseIcon className="w-5 h-5" />
            New Project
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CurrencyDollarIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Monthly Revenue</p>
                <p className="text-2xl font-black text-slate-900 mt-1">45,230 FIC</p>
                <p className="text-sm font-medium text-emerald-600 flex items-center gap-1 mt-2">
                  <ArrowTrendingUpIcon className="w-4 h-4" /> +12.5%
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UserGroupIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Active Clients</p>
                <p className="text-2xl font-black text-slate-900 mt-1">1,204</p>
                <p className="text-sm font-medium text-emerald-600 flex items-center gap-1 mt-2">
                  <ArrowTrendingUpIcon className="w-4 h-4" /> +5.2%
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-6 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MegaphoneIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Ad Conversion</p>
                <p className="text-2xl font-black text-slate-900 mt-1">4.8%</p>
                <p className="text-sm font-medium text-emerald-600 flex items-center gap-1 mt-2">
                  <ArrowTrendingUpIcon className="w-4 h-4" /> +1.1%
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-8">
              <h2 className="text-xl font-black text-slate-900 mb-6">Business Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {businessTools.map((tool, i) => (
                  <button key={i} className="flex flex-col items-start p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all text-left group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${tool.color} group-hover:scale-110 transition-transform`}>
                      {tool.icon}
                    </div>
                    <h3 className="font-bold text-slate-900">{tool.name}</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">{tool.desc}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-3xl p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-[30px]" />

              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2 relative z-10">
                <CurrencyDollarIcon className="w-4 h-4" />
                 Business Account
              </h3>
              <p className="text-4xl font-black tracking-tight mb-6 relative z-10">{ficBalance.toFixed(2)} <span className="text-xl text-slate-400">FIC</span></p>

              <button className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold transition-all active:scale-95 relative z-10 shadow-lg shadow-white/10">
                 Withdraw Funds
              </button>
            </div>

            <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
              <h3 className="font-bold text-indigo-900 mb-3 text-sm flex items-center gap-2">
                <ArrowTrendingUpIcon className="w-4 h-4" />
                Upgrade to Pro
              </h3>
              <p className="text-sm text-indigo-700 font-medium mb-4">
                Unlock advanced analytics, API access, and priority support for your business.
              </p>
              <button className="w-full py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold transition-all shadow-md shadow-indigo-200">
                View Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BusinessHubPage;
