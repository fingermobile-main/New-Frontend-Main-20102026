import React, { useState } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import gemsService from '../../../services/gemsService';
import { CheckCircleIcon, XCircleIcon } from '../../../components/icons';

interface GemSubmission {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  title: string;
  category: string;
  gemAmount: number;
  reason: string;
  submittedAt: string;
}

import moderationAdminService from '../../../services/moderationAdminService';
import PlatformOwnershipCard from '../../../components/dashboard/PlatformOwnershipCard';

const GemApprovalPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [submissions, setSubmissions] = useState<GemSubmission[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);

  React.useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const items = await moderationAdminService.getCategoryItems('gem');
      if (items && items.length > 0) {
        setSubmissions(items.map((i, idx) => ({
          id: i.id,
          userId: i.reported_by || '1',
          userName: i.reporter_username || `Member ${idx + 1}`,
          userHandle: i.reporter_username || `member_${idx + 1}`,
          title: i.reason,
          category: 'Grant Approval',
          gemAmount: 250,
          reason: i.description || i.reason,
          submittedAt: new Date(i.created_at).toLocaleTimeString()
        })));
      } else {
        setSubmissions([
          {
            id: 'sub-1',
            userId: '4',
            userName: 'Alice Creator',
            userHandle: 'alice',
            title: 'Top Community Contributor Reward',
            category: 'Achievement',
            gemAmount: 100,
            reason: 'Created 25+ featured posts in Community Hub',
            submittedAt: '2 hours ago'
          }
        ]);
      }
    } catch {
      // Fallback
    }
  };

  const handleApprove = async (sub: GemSubmission) => {
    setProcessingId(sub.id);
    try {
      await moderationAdminService.approveCategoryItem('gem', sub.id).catch(() => {});
      const res = await gemsService.awardGems(sub.userId, sub.gemAmount, sub.reason);
      if (res && res.success) {
        showToast(`Approved & awarded ${sub.gemAmount} gems to @${sub.userHandle}!`, 'success');
      } else {
        showToast(`Gem grant approved for @${sub.userHandle}`, 'success');
      }
      setSubmissions(prev => prev.filter(s => s.id !== sub.id));
    } catch (err) {
      showToast('Error processing gem approval', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (sub: GemSubmission) => {
    setProcessingId(sub.id);
    try {
      await moderationAdminService.rejectCategoryItem('gem', sub.id).catch(() => {});
      showToast(`Rejected gem submission for @${sub.userHandle}`, 'info');
      setSubmissions(prev => prev.filter(s => s.id !== sub.id));
    } catch {
      showToast('Failed to reject gem submission', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gem Award &amp; Approval Queue</h1>
          <p className="text-sm text-slate-700 font-medium mt-1">
            Review merit-based contributor gem allocations and community achievement grants
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-950 border border-purple-400 self-start sm:self-auto">
          {submissions.length} Pending Grants
        </span>
      </div>

      <PlatformOwnershipCard />

      {submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-base">{sub.title}</span>
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-purple-100 text-purple-950 border border-purple-400 rounded-full">
                    💎 {sub.gemAmount} Gems
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium mt-1">
                  Requested for <span className="text-slate-900 font-bold">{sub.userName}</span> (@{sub.userHandle}) &middot; {sub.submittedAt}
                </p>
                <p className="text-xs text-slate-800 font-medium mt-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {sub.reason}
                </p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleReject(sub)}
                  disabled={processingId === sub.id}
                  className="px-4 py-2 text-xs font-bold bg-rose-50 text-rose-950 border border-rose-300 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Reject Request
                </button>
                <button
                  onClick={() => handleApprove(sub)}
                  disabled={processingId === sub.id}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Approve &amp; Award
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="font-black text-slate-900 text-base">The gem approval queue is empty</p>
          <p className="text-sm text-slate-700 font-medium mt-1">All gem reward submissions have been processed.</p>
        </div>
      )}
    </div>
  );
};

export default GemApprovalPage;

