/**
 * LushMatchContext
 * Provides: active matches list, real-time match events via WebSocket,
 * conversation create helper, match status updates.
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

interface LushMatch {
  id: number;
  partner_id: number;
  partner_username: string;
  partner_first_name?: string;
  partner_last_name?: string;
  partner_avatar?: string;
  partner_bio?: string;
  status: 'active' | 'unmatched' | 'blocked' | 'archived';
  match_score: number;
  gift_sent: boolean;
  pin_exchanged: boolean;
  commit_eligible_at?: string;
  matched_at: string;
  last_message?: string;
  unread_count: number;
}

interface NewMatchEvent {
  matchId: number;
  matchedWith: number;
  message: string;
}

interface LushMatchContextValue {
  matches: LushMatch[];
  newMatchEvent: NewMatchEvent | null;
  isLoading: boolean;
  clearNewMatch: () => void;
  updateMatchStatus: (matchId: number, status: string) => Promise<void>;
  refreshMatches: () => Promise<void>;
  totalUnread: number;
}

const LushMatchContext = createContext<LushMatchContextValue>({
  matches: [], newMatchEvent: null, isLoading: false,
  clearNewMatch: () => {}, updateMatchStatus: async () => {},
  refreshMatches: async () => {}, totalUnread: 0,
});

function getToken() {
  return (
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('authToken') ||
    ''
  );
}

export const LushMatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<LushMatch[]>([]);
  const [newMatchEvent, setNewMatchEvent] = useState<NewMatchEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/lushpressies/matches`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!resp.ok) return;
      const data = await resp.json();
      setMatches(data.matches || []);
    } catch { /* silent */ }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  // WebSocket: listen for lush:match events
  useEffect(() => {
    const wsUrl = ((import.meta as any).env?.VITE_WS_URL || 'ws://localhost:5000') + '/ws';
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.event === 'lush:match') {
            setNewMatchEvent({
              matchId: msg.matchId,
              matchedWith: msg.matchedWith,
              message: msg.message,
            });
            // Refresh matches list
            fetchMatches();
          }
        } catch { /* ignore */ }
      };

      ws.onerror = () => {};
      return () => ws.close();
    } catch { /* no WS available */ }
  }, [fetchMatches]);

  const clearNewMatch = useCallback(() => setNewMatchEvent(null), []);

  const updateMatchStatus = useCallback(async (matchId: number, status: string) => {
    try {
      const resp = await fetch(`${API_BASE}/lushpressies/matches/${matchId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
      });
      if (resp.ok) {
        setMatches((prev) =>
          prev.map((m) => m.id === matchId ? { ...m, status: status as LushMatch['status'] } : m)
        );
      }
    } catch { /* silent */ }
  }, []);

  const totalUnread = matches.reduce((sum, m) => sum + (m.unread_count || 0), 0);

  return (
    <LushMatchContext.Provider value={{
      matches, newMatchEvent, isLoading,
      clearNewMatch, updateMatchStatus,
      refreshMatches: fetchMatches, totalUnread,
    }}>
      {children}
    </LushMatchContext.Provider>
  );
};

export const useLushMatch = () => useContext(LushMatchContext);
export default LushMatchContext;
