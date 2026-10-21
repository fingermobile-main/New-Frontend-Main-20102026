import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { moderationAdminService, ModerationQueueItem } from '../../../services/moderationAdminService';
import PlatformOwnershipCard from '../../../components/dashboard/PlatformOwnershipCard';

const FlamingoApprovalPage: React.FC = () => {
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
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Flamingo Luxury Content Moderation</h1>
          <p className="text-sm text-slate-700 font-medium mt-1">Review brand sizing, trademark authenticity, luxury fashion assets and outfits</p>
        </div>
        <button
          onClick={loadSubmissions}
          disabled={loading}
          className="px-4 py-2 text-xs font-bold bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh Queue'}
        </button>
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
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDeny(item.id)}
                  className="px-4 py-2 text-xs font-bold bg-rose-50 text-rose-950 border border-rose-300 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                >
                  Deny Asset
                </button>
                <button
                  onClick={() => handleApprove(item.id)}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-sm transition cursor-pointer"
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
    </div>
  );
};

export default FlamingoApprovalPage;
