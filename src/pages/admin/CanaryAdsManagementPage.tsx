import React, { useEffect, useState, useCallback } from 'react';
import UniversalHeader from '../../components/layout/UniversalHeader';
import H2AdBucket from '../../components/layout/H2AdBucket';
import { advertisingService, QueueItem } from '../../services/advertisingService';
import { useAppContext } from '../../contexts/AppContext';

export const CanaryAdsManagementPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreative, setSelectedCreative] = useState<QueueItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [actionProcessing, setActionProcessing] = useState(false);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const items = await advertisingService.getAdminQueue();
      setQueue(items);
      if (items.length > 0) {
        setSelectedCreative((prev) => (prev ? items.find((i) => i.id === prev.id) || items[0] : items[0]));
      } else {
        setSelectedCreative(null);
      }
    } catch (err: any) {
      console.error('Error fetching admin queue:', err);
      showToast('Failed to load review queue', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const handleModerate = async (action: 'approve' | 'reject') => {
    if (!selectedCreative) return;
    if (action === 'reject' && !rejectionReason.trim()) {
      showToast('Please provide a reason for rejecting this ad creative.', 'error');
      return;
    }

    setActionProcessing(true);
    try {
      await advertisingService.moderateCreative(
        selectedCreative.id,
        action,
        action === 'reject' ? rejectionReason : undefined,
        scheduleDate || undefined
      );

      showToast(`Creative has been successfully ${action === 'approve' ? 'approved and activated' : 'rejected'}.`, 'success');
      setSelectedCreative(null);
      setRejectionReason('');
      setScheduleDate('');
      await fetchQueue();
    } catch (err: any) {
      showToast(err?.message || 'Failed to moderate creative', 'error');
    } finally {
      setActionProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* STATIC H1 HEADER */}
      <UniversalHeader pageTitle="SuperAdmin RBC" />

      {/* STATIC H2 AD BUCKET */}
      <H2AdBucket />

      {/* DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40">
                SuperAdmin RBC
              </span>
              <span className="text-xs text-slate-400">Role-Based Control Ads Moderation & Scheduling</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Canary™ Internal Ad Review Queue</h1>
            <p className="text-xs text-slate-400 mt-1">
              Inspect merchant media, verify community guidelines, AI policy scores, and schedule public ad releases.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-amber-400">
              Pending Queue: <strong>{queue.length}</strong>
            </span>
            <button
              type="button"
              onClick={fetchQueue}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* WORKSPACE GRID */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">Loading Canary Review Queue...</div>
        ) : queue.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <span className="text-4xl">🎉</span>
            <h3 className="text-base font-bold text-white">All Ad Submissions Cleared!</h3>
            <p className="text-xs text-slate-400">No campaigns currently pending SuperAdmin RBC review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">

            {/* LEFT COLUMN: PENDING SUBMISSIONS LIST (5 COLS) */}
            <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {queue.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedCreative(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedCreative?.id === item.id
                      ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-amber-400 uppercase tracking-wider">{item.placement.replace('_', ' ')}</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>

                  <h4 className="text-sm font-black text-white truncate">{item.headline}</h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{item.company_name} ({item.billing_email})</p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                      Campaign: {item.campaign_title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.ai_policy_passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      AI Score: {item.ai_policy_score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT COLUMN: INSPECTION & DECISION CONTROLS (7 COLS) */}
            {selectedCreative && (
              <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Creative ID: {selectedCreative.id}</span>
                    <span className="text-xs font-bold text-amber-400">{selectedCreative.placement.toUpperCase()}</span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">{selectedCreative.headline}</h3>
                  <p className="text-xs text-slate-400 mt-1">{selectedCreative.description}</p>
                </div>

                {/* Media Inspector Preview */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-700">
                  {selectedCreative.media_url.endsWith('.mp4') || selectedCreative.media_url.endsWith('.mov') ? (
                    <video src={selectedCreative.media_url} controls playsInline className="w-full h-full object-contain" />
                  ) : (
                    <img src={selectedCreative.media_url} alt={selectedCreative.headline} className="w-full h-full object-contain" />
                  )}
                </div>

                {/* Advertiser & Policy Audit Metadata */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
                  <div>
                    <span className="text-slate-400 block">Merchant:</span>
                    <span className="font-bold text-white">{selectedCreative.company_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Contact:</span>
                    <span className="font-bold text-white">{selectedCreative.billing_email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Destination URL:</span>
                    <a href={selectedCreative.destination_url} target="_blank" rel="noreferrer" className="text-amber-400 underline truncate block">
                      {selectedCreative.destination_url}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block">AI Policy Verdict:</span>
                    <span className={selectedCreative.ai_policy_passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {selectedCreative.ai_policy_passed ? '✓ Guidelines Passed' : '✕ Violation Flagged'}
                    </span>
                  </div>
                </div>

                {/* Scheduling & Decision Controls */}
                <div className="space-y-4 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Scheduled Launch Date & Time (Optional - defaults to immediate)
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Rejection Reason (Required only if rejecting creative)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g. Thumbnail exceeds 20% text rule, or landing page link is unreachable."
                      rows={2}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => handleModerate('reject')}
                      disabled={actionProcessing}
                      className="flex-1 py-3 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-xs transition-all disabled:opacity-50"
                    >
                      {actionProcessing ? 'Processing...' : '✕ Reject Creative'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModerate('approve')}
                      disabled={actionProcessing}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg transition-all disabled:opacity-50"
                    >
                      {actionProcessing ? 'Processing...' : '✓ Approve & Schedule Ad'}
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
};

export default CanaryAdsManagementPage;
