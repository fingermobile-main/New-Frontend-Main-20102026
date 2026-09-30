import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { moderationAdminService, ModerationQueueItem } from '../../services/moderationAdminService';
import { ShieldAlert, CheckCircle2, RefreshCw, Loader2 } from 'lucide-react';

const ModerationPage: React.FC = () => {
  const { showToast, handleApproveContent, handleRemoveContent } = useAppContext();
  const [items, setItems] = useState<ModerationQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadQueue = async () => {
    try {
      setLoading(true);
      const data = await moderationAdminService.getQueue();
      setItems(data.filter(i => i.status === 'pending'));
    } catch (err: any) {
      showToast?.(err.message || 'Failed to load moderation queue', 'error');
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Moderation Queue</h1>
          <p className="text-sm text-gray-600">Review flagged posts, comments, and member activities</p>
        </div>
        <button
          onClick={loadQueue}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-semibold">{item.reporter_username || item.reported_by || 'Member'}</span>
                    {' reported '}
                    <span className="font-semibold text-purple-700 uppercase text-xs px-2 py-0.5 bg-purple-50 rounded">
                      {item.content_type}
                    </span>
                    {' for '}
                    <span className="font-semibold text-red-600">{item.reason}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Priority: {item.priority.toUpperCase()}</p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>

              <div className="my-3 p-3 bg-gray-50 rounded-md text-gray-700 text-sm border border-gray-100">
                &quot;{item.contentPreview || item.description || `Item ID: ${item.content_id}`}&quot;
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => handleApprove(String(item.id))}
                  disabled={actionId === String(item.id)}
                  className="px-4 py-1.5 text-xs font-semibold bg-green-100 text-green-800 rounded-md hover:bg-green-200 disabled:opacity-50 flex items-center gap-1"
                >
                  {actionId === String(item.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                  Approve
                </button>
                <button
                  onClick={() => handleRemove(String(item.id))}
                  disabled={actionId === String(item.id)}
                  className="px-4 py-1.5 text-xs font-semibold bg-red-100 text-red-800 rounded-md hover:bg-red-200 disabled:opacity-50 flex items-center gap-1"
                >
                  {actionId === String(item.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                  Remove Content
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-lg font-semibold text-gray-800">The moderation queue is clear!</p>
          <p className="text-sm text-gray-500 mt-1">No content is currently flagged or awaiting review.</p>
        </div>
      )}
    </div>
  );
};

export default ModerationPage;

