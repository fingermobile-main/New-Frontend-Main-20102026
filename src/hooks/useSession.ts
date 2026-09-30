import { useState, useEffect, useCallback } from 'react';
import identityService, { UserSessionData } from '../services/identityService';

export const useSession = () => {
  const [sessions, setSessions] = useState<UserSessionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await identityService.getActiveSessions();
      setSessions(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch active sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  const revokeSession = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      const ok = await identityService.revokeSession(sessionId);
      if (ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
      }
      return ok;
    } catch (err) {
      return false;
    }
  }, []);

  const revokeAllSessions = useCallback(async (): Promise<boolean> => {
    try {
      const ok = await identityService.revokeAllSessions();
      if (ok) {
        setSessions(prev => prev.filter(s => s.current));
      }
      return ok;
    } catch (err) {
      return false;
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    revokeSession,
    revokeAllSessions
  };
};

export default useSession;
