import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { moderationAdminService, ModerationQueueItem } from '../../../services/moderationAdminService';

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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Flamingo Luxury Content Moderation</h1>
          <p className="text-sm text-gray-500">Review brand sizing, trademark authenticity, and outfits</p>
        </div>
        <button
          onClick={loadSubmissions}
          disabled={loading}
          className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg transition"
        >
          Refresh Queue
        </button>
      </div>

      {submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400">
                    Flamingo Asset
                  </span>
                  <span className="text-xs text-gray-400">ID: {item.content_id}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mt-1 text-base">{item.reason}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                <p className="text-xs text-gray-400 mt-2">Submitted on {new Date(item.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDeny(item.id)}
                  className="px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded-lg transition"
                >
                  Deny
                </button>
                <button
                  onClick={() => handleApprove(item.id)}
                  className="px-4 py-2 text-sm font-semibold bg-green-600 text-white hover:bg-green-700 rounded-lg shadow-sm transition"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-16 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-gray-200">The Flamingo approval queue is clean</p>
          <p className="text-sm text-gray-400 mt-1">No pending luxury outfits or sizing charts awaiting review.</p>
        </div>
      )}
    </div>
  );
};

export default FlamingoApprovalPage;
