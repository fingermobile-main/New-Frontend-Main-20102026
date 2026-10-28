import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';
import { BuildingOfficeIcon, SparklesIcon as MagicWandIcon } from '@heroicons/react/24/solid';
import CrmWidget from '../../components/dashboard/crm/CrmWidget';
import ErpFinanceWidget from '../../components/dashboard/erp/ErpFinanceWidget';
import ErpHRWidget from '../../components/dashboard/erp/ErpHRWidget';
import CrmMarketingWidget from '../../components/dashboard/crm/CrmMarketingWidget';
import CrmInvoicingWidget from '../../components/dashboard/crm/CrmInvoicingWidget';
import CrmIntegrationsWidget from '../../components/dashboard/crm/CrmIntegrationsWidget';
import MainLayout from '../../components/layout/MainLayout';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

const BusinessHubPage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal, ficBalance, showToast } = useAppContext();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('Finance');

  const onLike = async (id: string) => {
    try {
      await apiService.post(`/posts/${id}/like`);
      showToast?.('Content liked!', 'success');
    } catch {
      showToast?.('Failed to like content', 'error');
    }
  };

  const onAddComment = async (id: string, comment: string) => {
    try {
      await apiService.post(`/posts/${id}/comments`, { content: comment });
      showToast?.('Comment added!', 'success');
    } catch {
      showToast?.('Failed to add comment', 'error');
    }
  };

  const onOpenGiftModal = (id: string) => {
    openModal('gift', { targetId: id });
  };

  const onOpenPaylinkModal = (id: string) => {
    openModal('paylink', { targetId: id });
  };

  const onVote = async (id: string, vote: 'up' | 'down') => {
    try {
      await apiService.post(`/posts/${id}/vote`, { direction: vote });
      showToast?.(`Voted ${vote}!`, 'success');
    } catch {
      showToast?.('Voting failed', 'error');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      await apiService.delete(`/posts/${id}`);
      showToast?.('Post deleted successfully', 'success');
    } catch {
      showToast?.('Failed to delete post', 'error');
    }
  };

  const handleTokenizePost = async (id: string) => {
    try {
      await apiService.post(`/monetization/tokenize`, { postId: id });
      showToast?.('Tokenization initiated!', 'success');
    } catch {
      showToast?.('Tokenization failed', 'error');
    }
  };

  const handleAiAssist = async (id: string) => {
    openModal('aiAssistant', { contextId: id });
  };

  const departments = ['Finance', 'HR', 'Marketing'];

  return (
    <MainLayout pageTitle="Business Hub">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 overflow-x-hidden text-slate-900 pb-28 md:pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-md">
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Business Hub &amp; ERP Mesh
              </h1>
              <p className="text-slate-700 font-medium text-sm mt-0.5">
                AI-powered enterprise operations, CRM pipeline, and ledger reconciliation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openModal('aiAssistant')}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-sm text-xs cursor-pointer"
            >
              <MagicWandIcon className="w-4 h-4 mr-2" />
              <span>Launch AI Advisor</span>
            </button>
          </div>
        </div>

        {/* Platform Ownership Card */}
        <PlatformOwnershipCard />

        {/* Department Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-300 pb-2">
          <span className="text-xs font-bold text-slate-700 mr-2 uppercase tracking-wide">Department:</span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedDepartment === dept
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {dept} Operations
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {selectedDepartment === 'Finance' && (
                <>
                  <div className="lg:col-span-2">
                    <ErpFinanceWidget />
                  </div>
                  <div className="lg:col-span-1">
                    <CrmInvoicingWidget />
                  </div>
                </>
              )}
              {selectedDepartment === 'HR' && (
                <>
                  <div className="lg:col-span-3">
                    <ErpHRWidget />
                  </div>
                </>
              )}
              {selectedDepartment === 'Marketing' && (
                <>
                  <div className="lg:col-span-1">
                    <CrmIntegrationsWidget />
                  </div>
                  <div className="lg:col-span-2">
                    <CrmMarketingWidget />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
              <h2 className="text-base font-black text-slate-900 mb-3 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 text-blue-600 mr-2" />
                Enterprise Treasury
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900">{ficBalance.toFixed(2)} FIC</span>
                <button
                  onClick={() => navigate('/financials/wallet')}
                  className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg shadow-sm cursor-pointer"
                >
                  Manage Wallet
                </button>
              </div>
              <p className="text-[11px] text-slate-700 font-bold mt-2 font-mono">
                Parity: 1 FIC = ₦100.00 NGN (Active Settlement)
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-300">
              <h2 className="text-base font-black text-slate-900 mb-4">Enterprise Shortcuts</h2>
              <div className="space-y-2.5">
                <button
                  onClick={() => setSelectedDepartment('Marketing')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <span className="flex items-center">
                    <BuildingOfficeIcon className="h-4 w-4 text-blue-600 mr-2.5" />
                    CRM Pipeline &amp; Contacts
                  </span>
                  <span className="text-slate-400">→</span>
                </button>
                <button
                  onClick={() => navigate('/dashboard/finance')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <span className="flex items-center">
                    <BuildingOfficeIcon className="h-4 w-4 text-emerald-600 mr-2.5" />
                    Treasury &amp; Financial Reports
                  </span>
                  <span className="text-slate-400">→</span>
                </button>
                <button
                  onClick={() => setSelectedDepartment('HR')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-xl transition flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <span className="flex items-center">
                    <BuildingOfficeIcon className="h-4 w-4 text-purple-600 mr-2.5" />
                    HR Roster &amp; Payroll
                  </span>
                  <span className="text-slate-400">→</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-300">
              <h3 className="font-black text-slate-900 mb-2 text-sm">ERP Operational Checklist</h3>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 font-bold">✓</span>
                  <span>Double-entry ledger auto-reconciles at midnight</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 font-bold">✓</span>
                  <span>POS terminals report hourly transaction volume</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2 font-bold">✓</span>
                  <span>WORM cryptographic audit logging active</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* MOBILE NAVIGATION QUICK DOCK */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around z-30 shadow-lg">
          <button
            type="button"
            onClick={() => setSelectedDepartment('Finance')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold transition-colors ${
              selectedDepartment === 'Finance' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <BuildingOfficeIcon className="w-5 h-5 mb-0.5" />
            <span>Finance</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedDepartment('HR')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold transition-colors ${
              selectedDepartment === 'HR' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <BuildingOfficeIcon className="w-5 h-5 mb-0.5 text-purple-600" />
            <span>HR</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedDepartment('Marketing')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold transition-colors ${
              selectedDepartment === 'Marketing' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <BuildingOfficeIcon className="w-5 h-5 mb-0.5 text-emerald-600" />
            <span>Marketing</span>
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <span className="text-base font-black leading-none mb-0.5">↑</span>
            <span>Top</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default BusinessHubPage;
