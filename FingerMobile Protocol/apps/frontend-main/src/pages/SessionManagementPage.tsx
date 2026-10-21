import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useSession } from '../hooks/useSession';
import { useAppContext } from '../contexts/AppContext';
import { ShieldCheckIcon, DeviceMobileIcon, LockClosedIcon, TrashIcon } from '../icons';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';

const SessionManagementPage: React.FC = () => {
  const { sessions, loading, error, fetchSessions, revokeSession, revokeAllSessions } = useSession();
  const { showToast } = useAppContext();

  const handleRevoke = async (sessionId: string) => {
    try {
      const ok = await revokeSession(sessionId);
      if (ok) {
        showToast('Session revoked successfully.', 'success');
      } else {
        showToast('Failed to revoke session.', 'error');
      }
    } catch (err) {
      showToast('Error revoking session.', 'error');
    }
  };

  const handleRevokeAll = async () => {
    try {
      const ok = await revokeAllSessions();
      if (ok) {
        showToast('All other sessions revoked successfully.', 'success');
      } else {
        showToast('Failed to revoke all sessions.', 'error');
      }
    } catch (err) {
      showToast('Error revoking sessions.', 'error');
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
    case 'mobile':
      return <DeviceMobileIcon className="h-6 w-6 text-emerald-600" />;
    case 'desktop':
      return <LockClosedIcon className="h-6 w-6 text-purple-600" />;
    default:
      return <ShieldCheckIcon className="h-6 w-6 text-blue-600" />;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 py-8 space-y-6">
        <PlatformOwnershipCard />

        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-300 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Active Sessions</h1>
            <p className="text-sm text-slate-700 font-medium mt-1">
              Review and manage logged-in devices authorized to access your FingerMobile account.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchSessions()}
              className="px-4 py-2 border border-slate-300 text-slate-800 rounded-lg hover:bg-slate-100 text-sm font-bold transition cursor-pointer"
            >
              Refresh
            </button>
            <button
              onClick={handleRevokeAll}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 text-sm font-black shadow-xs transition cursor-pointer"
            >
              Revoke All Other Sessions
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-48 text-slate-700 font-medium text-sm">
            Loading active sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-8 text-center text-slate-700">
            No active sessions found.
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-xl shadow-sm border border-slate-300 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-300 transition"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl border border-slate-200 flex-shrink-0">
                    {getPlatformIcon(session.platform)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        {session.memberAgent || session.userAgent || 'Web Browser'}
                      </h3>
                      {session.current && (
                        <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 rounded-full">
                          Current Device
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-700 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <span>IP: <strong className="text-slate-800 font-bold">{session.ipAddress}</strong></span>
                      <span>
                        Last active:{' '}
                        <strong className="text-slate-800 font-bold">
                          {new Date(session.lastAccessed).toLocaleString()}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {!session.current && (
                  <button
                    onClick={() => handleRevoke(session.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-950 hover:bg-rose-200 bg-rose-100 border border-rose-300 rounded-lg transition cursor-pointer"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Revoke Access
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SessionManagementPage;
