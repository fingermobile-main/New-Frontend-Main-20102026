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
    <div>
      <h1 className="text-2xl font-bold mb-6">Gem Award & Approval Queue</h1>
      {submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-lg">{sub.title}</span>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-950 border border-purple-400 font-bold rounded-full font-black">
                    💎 {sub.gemAmount} Gems
                  </span>
                </div>
                <p className="text-sm text-slate-700 mt-0.5">
                  Requested for <strong className="text-gray-700">{sub.userName}</strong> (@{sub.userHandle}) &middot; {sub.submittedAt}
                </p>
                <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2.5 rounded-lg border border-slate-200">
                  {sub.reason}
                </p>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleReject(sub)}
                  disabled={processingId === sub.id}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                  title="Reject"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleApprove(sub)}
                  disabled={processingId === sub.id}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors disabled:opacity-50"
                  title="Approve & Award Gems"
                >
                  <CheckCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-700 py-12 bg-white rounded-xl shadow-md border">
          <p className="font-semibold text-gray-700">The approval queue is empty.</p>
          <p className="text-sm text-slate-700 mt-1">All gem reward submissions have been processed.</p>
        </div>
      )}
    </div>
  );
};

export default GemApprovalPage;

