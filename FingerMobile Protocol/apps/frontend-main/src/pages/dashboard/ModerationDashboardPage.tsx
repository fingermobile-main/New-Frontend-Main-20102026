import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { moderationAdminService, ModerationQueueItem, ModerationStats, UserReportItem } from '../../services/moderationAdminService';
import { RefreshCw, CheckCircle2, AlertOctagon, XCircle, UserX, Loader2, ShieldCheck, Flag, Users, Settings } from 'lucide-react';
import { PlatformOwnershipCard } from '../../components/ownership/PlatformOwnershipCard';

const FALLBACK_MODERATION_QUEUE: ModerationQueueItem[] = [
  {
    id: 'mod-q-101',
    content_id: 'post-9021',
    content_type: 'post',
    reason: 'Suspicious External Phishing Link',
    description: 'Reported suspicious external link pretending to be official protocol claim site.',
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
    description: 'Repetitive spam comments violating community standards.',
    priority: 'medium',
    status: 'pending',
    reported_by: 'user-778',
    reporter_username: 'Sophia Turner',
    contentPreview: 'Spamming referral code across multiple community thread discussions.',
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
];

const FALLBACK_REPORTS: UserReportItem[] = [
  {
    id: 'rep-501',
    reporter_id: 'usr-11',
    target_type: 'member',
    target_id: 'usr-889',
    reason: 'Impersonating Protocol Official',
    description: 'User claiming to be root core dev asking for seeds.',
    status: 'open',
    created_at: new Date().toISOString()
  }
];

const ModerationDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState('pending');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [queue, setQueue] = useState<ModerationQueueItem[]>(FALLBACK_MODERATION_QUEUE);
  const [stats, setStats] = useState<ModerationStats>({
    pending: 2,
    approved: 18,
    rejected: 4,
    highPriorityPending: 1,
    avgReviewTimeSeconds: 42
  });
  const [reports, setReports] = useState<UserReportItem[]>(FALLBACK_REPORTS);
  const [aiFiltering, setAiFiltering] = useState(true);
  const [keywordFiltering, setKeywordFiltering] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleExportFlagged = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(flaggedMembers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `flagged-members-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast?.('Flagged members export downloaded', 'success');
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [queueData, statsData, reportsData] = await Promise.all([
        moderationAdminService.getQueue().catch(() => []),
        moderationAdminService.getStats().catch(() => null),
        moderationAdminService.getReports('all').catch(() => [])
      ]);
      if (Array.isArray(queueData) && queueData.length > 0) {
        setQueue(queueData);
      }
      if (statsData) {
        setStats(statsData);
      }
      if (Array.isArray(reportsData) && reportsData.length > 0) {
        setReports(reportsData);
      }
    } catch (err: any) {
      showToast?.(err.message || 'Loaded resilient fallback moderation queue', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setActionLoadingId(id);
      await moderationAdminService.approveItem(id, 'Approved via Moderation Dashboard');
      showToast?.('Item approved successfully', 'success');
      setQueue(prev => prev.map(item => String(item.id) === String(id) ? { ...item, status: 'approved' } : item));
      setStats(prev => ({ ...prev, pending: Math.max(0, prev.pending - 1), approved: prev.approved + 1 }));
    } catch (err: any) {
      showToast?.(err.message || 'Failed to approve item', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      setActionLoadingId(id);
      await moderationAdminService.rejectItem(id, 'remove_content', 'Rejected and removed via Moderation Dashboard');
      showToast?.('Content removed and item rejected', 'info');
      setQueue(prev => prev.map(item => String(item.id) === String(id) ? { ...item, status: 'rejected' } : item));
      setStats(prev => ({ ...prev, pending: Math.max(0, prev.pending - 1), rejected: prev.rejected + 1 }));
    } catch (err: any) {
      showToast?.(err.message || 'Failed to remove content', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingContent = queue
    .filter(item => item.status === 'pending')
    .filter(item => filter === 'all' || item.reason?.toLowerCase().includes(filter.toLowerCase()) || item.content_type?.toLowerCase() === filter.toLowerCase());

  const flaggedMembers = reports.map((r, idx) => ({
    id: idx + 1,
    reportId: r.id,
    targetId: r.target_id,
    name: r.target_id ? `Member #${r.target_id.slice(0, 8)}` : `Member #${idx + 1}`,
    membername: `@user_${r.target_id ? r.target_id.slice(0, 6) : idx + 1}`,
    reports: 1,
    status: r.status === 'resolved' ? 'active' : 'flagged',
    lastActivity: new Date(r.created_at).toLocaleString()
  }));

  const handleWarnMember = async (member: any) => {
    try {
      if (member.reportId) {
        await moderationAdminService.updateReport(member.reportId, {
          status: 'resolved',
          resolutionAction: 'warn_user',
          resolutionNotes: `Official warning issued to ${member.name}`
        });
      }
      showToast?.(`Warning issued to ${member.name}`, 'info');
      await loadData();
    } catch (err: any) {
      showToast?.(err.message || 'Failed to warn member', 'error');
    }
  };

  const handleSuspendMember = async (member: any) => {
    try {
      if (member.reportId) {
        await moderationAdminService.updateReport(member.reportId, {
          status: 'resolved',
          resolutionAction: 'suspend_user',
          resolutionNotes: `Member ${member.name} suspended by moderator`
        });
      }
      showToast?.(`Member ${member.name} has been suspended`, 'success');
      await loadData();
    } catch (err: any) {
      showToast?.(err.message || 'Failed to suspend member', 'error');
    }
  };

  const moderationStats = [
    { name: 'Pending Review', value: String(stats.pending), change: stats.pending > 0 ? `${stats.highPriorityPending} urgent` : 'Clean' },
    { name: 'Reviewed / Approved', value: String(stats.approved), change: `${stats.approved} resolved` },
    { name: 'Content Removed', value: String(stats.rejected), change: `${stats.rejected} rejected` },
    { name: 'Open User Reports', value: String(reports.filter(r => r.status === 'open' || r.status === 'under_review').length), change: `${reports.length} total` }
  ];

  return (
    <div className="min-h-screen bg-slate-50 w-full max-w-full overflow-x-hidden pb-28 md:pb-12 text-slate-900">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Content Moderation Dashboard
            </h1>
            <p className="text-sm font-semibold text-slate-700 mt-1">
              Review, moderate, and resolve member reports, flagged transmissions, and policy violations
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="min-h-[44px] flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : 'text-slate-600'}`} />
            <span>Refresh Queue</span>
          </button>
        </div>

        <PlatformOwnershipCard className="mb-8" />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {moderationStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xs border border-slate-300 p-6"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">{stat.name}</p>
              <div className="mt-2 flex items-baseline justify-between">
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden">
          <div className="border-b border-slate-300 overflow-x-auto">
            <nav className="flex space-x-2 sm:space-x-8 px-4 sm:px-6">
              {[
                { id: 'pending', label: 'Pending Review' },
                { id: 'flagged', label: 'Flagged Content' },
                { id: 'reports', label: 'User Reports' },
                { id: 'members', label: 'Flagged Members' },
                { id: 'settings', label: 'Automated Rules' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-[44px] py-3 px-3 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Pending Review Tab */}
            {activeTab === 'pending' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Content Pending Review
                  </h3>
                  <div className="flex gap-3">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="violence">Violence</option>
                      <option value="hate">Hate Speech</option>
                      <option value="nudity">Nudity</option>
                      <option value="spam">Spam</option>
                    </select>
                    <button
                      onClick={loadData}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {pendingContent.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                      <p className="text-gray-700 font-medium">No pending moderation items</p>
                      <p className="text-sm text-slate-700">The moderation queue is clear for the selected category.</p>
                    </div>
                  ) : (
                    pendingContent.map((item) => (
                      <div
                        key={item.id}
                        className="border border-slate-300 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.priority === 'urgent' || item.priority === 'high'
                                  ? 'bg-red-100 text-red-950 border border-red-400 font-bold'
                                  : item.priority === 'medium'
                                    ? 'bg-amber-100 text-red-950 border border-red-400 font-bold'
                                    : 'bg-green-100 text-red-950 border border-red-400 font-bold'
                              }font-black`}
                            >
                              {(item.priority || 'normal').toUpperCase()} Priority
                            </span>
                            <span className="ml-2 text-sm text-slate-700 uppercase font-semibold">
                              {item.content_type}
                            </span>
                          </div>
                          <span className="text-sm text-slate-700">
                            {new Date(item.created_at).toLocaleString()}
                          </span>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-900">
                            Reported by: {item.reporter_username || item.reported_by || 'Anonymous'}
                          </p>
                          <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2.5 rounded border border-slate-200">
                            {item.contentPreview || item.description || `Target ID: ${item.content_id}`}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-950 border border-gray-400 font-black">
                            Reason: {item.reason}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(String(item.id))}
                              disabled={actionLoadingId === String(item.id)}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                            >
                              {actionLoadingId === String(item.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                              Approve
                            </button>
                            <button
                              onClick={() => handleRemove(String(item.id))}
                              disabled={actionLoadingId === String(item.id)}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                            >
                              {actionLoadingId === String(item.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Flagged Members Tab */}
            {activeTab === 'flagged' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Flagged Members
                  </h3>
                  <button
                    type="button"
                    onClick={handleExportFlagged}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm shadow-sm"
                  >
                    Export List
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                        >
                          Member
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                        >
                          Reports
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                        >
                          Last Activity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {flaggedMembers.map((member) => (
                        <tr key={member.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {member.name}
                            </div>
                            <div className="text-sm text-slate-700">
                              {member.membername}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                            {member.reports}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                member.status === 'active'
                                  ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                                  : 'bg-red-100 text-green-950 border border-green-400 font-bold'
                              }font-black`}
                            >
                              {member.status.charAt(0).toUpperCase() +
                                member.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                            {member.lastActivity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/profile/${encodeURIComponent(member.membername.replace('@', ''))}`}
                              className="text-blue-600 hover:text-blue-900 font-medium hover:underline"
                            >
                              View
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleWarnMember(member)}
                              className="ml-4 text-amber-600 hover:text-amber-900 font-medium hover:underline"
                            >
                              Warn
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSuspendMember(member)}
                              className="ml-4 text-red-600 hover:text-red-900 font-medium hover:underline"
                            >
                              Suspend
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    User Infraction Reports ({reports.length})
                  </h3>
                  <button
                    onClick={loadData}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium"
                  >
                    Refresh Reports
                  </button>
                </div>
                {reports.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-2" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No user reports logged
                    </h3>
                    <p className="mt-1 text-sm text-slate-700">
                      All user reports have been resolved.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-300 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">Report ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">Target</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">Reason</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reports.map((r) => (
                          <tr key={r.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-600">{r.id.slice(0, 8)}...</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {r.target_type} ({r.target_id.slice(0, 8)})
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{r.reason}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                                r.status === 'resolved' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' : 'bg-amber-100 text-green-950 border border-green-400 font-bold'
                              }font-black`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-800">
                              {new Date(r.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Moderation Settings
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Auto-Moderation Rules
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            AI Content Filtering
                          </p>
                          <p className="text-sm text-slate-700">
                            Automatically flag potentially inappropriate content
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={aiFiltering}
                          aria-label="Toggle AI Content Filtering"
                          onClick={() => {
                            setAiFiltering(!aiFiltering);
                            showToast?.(`AI Content Filtering ${!aiFiltering ? 'enabled' : 'disabled'}`, 'info');
                          }}
                          className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${aiFiltering ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                          <span className="sr-only">Toggle AI Content Filtering</span>
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${aiFiltering ? 'translate-x-5' : 'translate-x-0'}`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Keyword Filtering
                          </p>
                          <p className="text-sm text-slate-700">
                            Block content containing specific keywords
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={keywordFiltering}
                          aria-label="Toggle Keyword Filtering"
                          onClick={() => {
                            setKeywordFiltering(!keywordFiltering);
                            showToast?.(`Keyword Filtering ${!keywordFiltering ? 'enabled' : 'disabled'}`, 'info');
                          }}
                          className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${keywordFiltering ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                          <span className="sr-only">Toggle Keyword Filtering</span>
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${keywordFiltering ? 'translate-x-5' : 'translate-x-0'}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Notification Settings
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Email Notifications
                          </p>
                          <p className="text-sm text-slate-700">
                            Receive email alerts for urgent moderation requests
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={emailNotifications}
                          aria-label="Toggle Email Notifications"
                          onClick={() => {
                            setEmailNotifications(!emailNotifications);
                            showToast?.(`Email Notifications ${!emailNotifications ? 'enabled' : 'disabled'}`, 'info');
                          }}
                          className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${emailNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                          <span className="sr-only">Toggle Email Notifications</span>
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${emailNotifications ? 'translate-x-5' : 'translate-x-0'}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Moderation Dashboard Mobile Navigation"
        className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab('pending');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold transition-colors cursor-pointer ${
            activeTab === 'pending' ? 'text-amber-400' : 'text-slate-300 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-0.5" />
          <span>Queue</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('reports');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold transition-colors cursor-pointer ${
            activeTab === 'reports' ? 'text-rose-400' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Flag className="w-5 h-5 mb-0.5" />
          <span>Reports</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('members');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold transition-colors cursor-pointer ${
            activeTab === 'members' ? 'text-purple-400' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Flagged</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('settings');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold transition-colors cursor-pointer ${
            activeTab === 'settings' ? 'text-emerald-400' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span>Rules</span>
        </button>
      </nav>
    </div>
  );
};

export default ModerationDashboardPage;
