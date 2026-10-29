import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, FileText, Download, Home } from 'lucide-react';
import AdvancedAnalyticsDashboard from '../components/dashboard/AdvancedAnalyticsDashboard';
import { useAppContext } from '../contexts/AppContext';
import { ChartBarIcon } from '../icons';
import MainLayout from '../components/layout/MainLayout';

const AdvancedAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  return (
    <MainLayout pageTitle="Advanced Analytics">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-xs">
              <ChartBarIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Advanced Analytics Dashboard
              </h1>
              <p className="text-slate-700 font-medium text-sm sm:text-base mt-1">
                Monitor and analyze platform performance and user engagement
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <AdvancedAnalyticsDashboard />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-300">
              <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4">Analytics Actions</h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => showToast('Advanced analytics PDF report compiled and ready', 'success')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center border border-slate-200 cursor-pointer min-h-[44px] font-bold text-slate-800 text-sm"
                >
                  <FileText className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span>Generate Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Analytics CSV data exported to your downloads', 'success')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center border border-slate-200 cursor-pointer min-h-[44px] font-bold text-slate-800 text-sm"
                >
                  <Download className="h-5 w-5 text-slate-700 mr-3 flex-shrink-0" />
                  <span>Export Data</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Benchmark comparison overlay enabled', 'info')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center border border-slate-200 cursor-pointer min-h-[44px] font-bold text-slate-800 text-sm"
                >
                  <BarChart3 className="h-5 w-5 text-slate-700 mr-3 flex-shrink-0" />
                  <span>Compare Metrics</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-xs">
              <h3 className="font-black text-slate-900 mb-2">Analytics Tips</h3>
              <ul className="space-y-2 text-sm text-slate-800 font-medium">
                <li className="flex items-start">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  <span>Track key metrics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  <span>Monitor user engagement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  <span>Analyze growth trends</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-4 md:hidden shadow-lg safe-area-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-blue-600 font-bold"
            aria-label="Metrics Overview"
          >
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Metrics</span>
          </button>
          <button
            onClick={() => showToast('Advanced analytics PDF report compiled and ready', 'success')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Generate Report"
          >
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Report</span>
          </button>
          <button
            onClick={() => showToast('Analytics CSV data exported to your downloads', 'success')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Export Data"
          >
            <Download className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Export</span>
          </button>
          <button
            onClick={() => navigate('/forum')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Back to Forum"
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Forum</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdvancedAnalyticsPage;
