import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, RefreshCw, CheckCircle2, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../../contexts/AppContext';
import { moderationAdminService, ModerationQueueItem } from '../../../services/moderationAdminService';
import PlatformOwnershipCard from '../../../components/dashboard/PlatformOwnershipCard';

const FlamingoApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [submissions, setSubmissions] = useState<ModerationQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const items = await moderationAdminService.getCategoryItems('flamingo');
      setSubmissions(items);
    } catch {
      showToast('Error loading Flamingo approval queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await moderationAdminService.approveCategoryItem('flamingo', id, 'Approved by fashion moderator');
      setSubmissions(prev => prev.filter(s => s.id !== id));
      showToast('Flamingo content approved successfully', 'success');
    } catch {
      showToast('Failed to approve submission', 'error');
    }
  };

  const handleDeny = async (id: string) => {
    try {
      await moderationAdminService.rejectCategoryItem('flamingo', id, 'Rejected due to trademark policy');
      setSubmissions(prev => prev.filter(s => s.id !== id));
      showToast('Flamingo content denied & removed', 'success');
    } catch {
      showToast('Failed to reject submission', 'error');
    }
  };

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-3 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Flamingo Luxury Content Moderation</h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">Review brand sizing, trademark authenticity, luxury fashion assets and outfits</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/masterdashboard')}
            className="min-h-[44px] px-3.5 py-2 text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl transition cursor-pointer shadow-xs inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={loadSubmissions}
            disabled={loading}
            className="min-h-[44px] px-4 py-2 text-xs font-bold bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 text-slate-700 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Queue'}</span>
          </button>
        </div>
      </div>

      <PlatformOwnershipCard />

      {submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-pink-100 text-pink-950 border border-pink-400">
                    Flamingo Asset
                  </span>
                  <span className="text-xs font-mono text-slate-700 font-bold">ID: {item.content_id}</span>
                </div>
                <h3 className="font-black text-slate-900 mt-2 text-base">{item.reason}</h3>
                <p className="text-sm text-slate-700 font-medium mt-1">{item.description}</p>
                <p className="text-xs text-slate-700 font-medium mt-2">Submitted on {new Date(item.created_at).toLocaleString()}</p>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleDeny(item.id)}
                  className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 text-xs font-bold bg-rose-50 text-rose-950 border border-rose-300 hover:bg-rose-100 rounded-xl transition cursor-pointer"
                >
                  Deny Asset
                </button>
                <button
                  onClick={() => handleApprove(item.id)}
                  className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl shadow-sm transition cursor-pointer"
                >
                  Approve Asset
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="font-black text-slate-900 text-base">The Flamingo approval queue is clean</p>
          <p className="text-sm text-slate-700 font-medium mt-1">No pending luxury outfits or sizing charts awaiting review.</p>
        </div>
      )}

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Flamingo Approval Mobile Navigation"
        className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span>Flamingo</span>
        </button>
        <button
          type="button"
          onClick={loadSubmissions}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-5 h-5 mb-0.5" />
          <span>Refresh</span>
        </button>
        <button
          type="button"
          onClick={() => {
            if (submissions.length > 0) {
              handleApprove(submissions[0].id);
            } else {
              showToast('No pending assets to approve', 'info');
            }
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5 mb-0.5" />
          <span>Quick OK</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/masterdashboard')}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 mb-0.5" />
          <span>Back</span>
        </button>
      </nav>
    </div>
  );
};

export default FlamingoApprovalPage;
