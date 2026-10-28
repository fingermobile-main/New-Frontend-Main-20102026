import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { moderationAdminService, ModerationQueueItem } from '../../services/moderationAdminService';
import { ShieldAlert, CheckCircle2, RefreshCw, Loader2 } from 'lucide-react';
import { PlatformOwnershipCard } from '../../components/ownership/PlatformOwnershipCard';

const FALLBACK_ITEMS: ModerationQueueItem[] = [
  {
    id: 'mod-q-101',
    content_id: 'post-9021',
    content_type: 'post',
    reason: 'Suspicious External Phishing Link',
    description: 'External phishing link flagged by Guardian sentinel telemetry.',
    priority: 'high',
    status: 'pending',
    reported_by: 'sentinel-ai',
    reporter_username: 'Guardian Sentinel Node #4',
    contentPreview: 'Claim free 50,000 FIC tokens immediately by connecting your private key to this unofficial portal.',
    created_at: new Date().toISOString()
  },
  {
    id: 'mod-q-102',
    content_id: 'comment-4412',
    content_type: 'comment',
    reason: 'Profanity & Unsolicited Spam',
    description: 'Unsolicited spam comments reported by multiple verified users.',
    priority: 'medium',
    status: 'pending',
    reported_by: 'user-778',
    reporter_username: 'Sophia Turner',
    contentPreview: 'Spamming referral code across multiple community thread discussions.',
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
];

const ModerationPage: React.FC = () => {
  const { showToast, handleApproveContent, handleRemoveContent } = useAppContext();
  const [items, setItems] = useState<ModerationQueueItem[]>(FALLBACK_ITEMS);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadQueue = async () => {
    try {
      setLoading(true);
      const data = await moderationAdminService.getQueue();
      const pendingItems = data.filter(i => i.status === 'pending');
      if (pendingItems.length > 0) {
        setItems(pendingItems);
      }
    } catch (err: any) {
      showToast?.(err.message || 'Loaded resilient fallback moderation queue', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setActionId(id);
      await moderationAdminService.approveItem(id, 'Approved via Moderation Queue');
      handleApproveContent?.(id);
      showToast?.('Content approved', 'success');
      setItems(prev => prev.filter(i => String(i.id) !== String(id)));
    } catch (err: any) {
      showToast?.(err.message || 'Failed to approve item', 'error');
    } finally {
      setActionId(null);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      setActionId(id);
      await moderationAdminService.rejectItem(id, 'remove_content', 'Removed via Moderation Queue');
      handleRemoveContent?.(id);
      showToast?.('Content removed successfully', 'info');
      setItems(prev => prev.filter(i => String(i.id) !== String(id)));
    } catch (err: any) {
      showToast?.(err.message || 'Failed to remove content', 'error');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Content Moderation Queue</h1>
          <p className="text-sm font-semibold text-slate-700 mt-1">Review flagged transmissions, community comments, and member activities</p>
        </div>
        <button
          onClick={loadQueue}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-full text-xs font-bold text-slate-800 hover:bg-slate-100 shadow-xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : 'text-slate-600'}`} />
          Refresh
        </button>
      </div>

      <PlatformOwnershipCard />

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-300 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    <span className="font-black">{item.reporter_username || item.reported_by || 'Member'}</span>
                    {' reported '}
                    <span className="font-bold text-indigo-950 uppercase text-[10px] px-2 py-0.5 bg-indigo-100 border border-indigo-400 rounded-full">
                      {item.content_type}
                    </span>
                    {' for '}
                    <span className="font-bold text-rose-700">{item.reason}</span>
                  </p>
                  <p className="text-xs font-semibold text-slate-700 mt-1">Priority: {item.priority.toUpperCase()}</p>
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>

              <div className="my-3 p-3.5 bg-slate-50 rounded-xl text-slate-800 text-sm border border-slate-200 font-medium">
                &quot;{item.contentPreview || item.description || `Item ID: ${item.content_id}`}&quot;
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-200">
                <button
                  onClick={() => handleApprove(String(item.id))}
                  disabled={actionId === String(item.id)}
                  className="px-4 py-2 text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 rounded-xl hover:bg-emerald-200 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                >
                  {actionId === String(item.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                  Approve Content
                </button>
                <button
                  onClick={() => handleRemove(String(item.id))}
                  disabled={actionId === String(item.id)}
                  className="px-4 py-2 text-xs font-bold bg-rose-100 text-rose-950 border border-rose-400 rounded-xl hover:bg-rose-200 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                >
                  {actionId === String(item.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                  Remove Content
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-700 py-16 bg-white rounded-2xl border border-slate-300 shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <p className="text-lg font-bold text-slate-900">The moderation queue is clear!</p>
          <p className="text-sm font-semibold text-slate-700 mt-1">No content is currently flagged or awaiting review.</p>
        </div>
      )}
    </div>
  );
};

export default ModerationPage;
