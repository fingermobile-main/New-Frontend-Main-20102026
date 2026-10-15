import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useSession } from '../hooks/useSession';
import { useAppContext } from '../contexts/AppContext';
import { ShieldCheckIcon, DeviceMobileIcon, LockClosedIcon, TrashIcon } from '../icons';

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Active Sessions</h1>
            <p className="text-sm text-gray-500 mt-1">
              Review and manage logged-in devices authorized to access your FingerMobile account.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchSessions()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
            >
              Refresh
            </button>
            <button
              onClick={handleRevokeAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium shadow-sm transition"
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
          <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
            Loading active sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-8 text-center text-gray-500">
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
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0">
                    {getPlatformIcon(session.platform)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        {session.memberAgent || session.userAgent || 'Web Browser'}
                      </h3>
                      {session.current && (
                        <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                          Current Device
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <span>IP: <strong className="text-gray-700">{session.ipAddress}</strong></span>
                      <span>
                        Last active:{' '}
                        <strong className="text-gray-700">
                          {new Date(session.lastAccessed).toLocaleString()}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {!session.current && (
                  <button
                    onClick={() => handleRevoke(session.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 rounded-lg transition"
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
