/**
 * useLushSwipe
 * Manages: swipe deck loading, swipe mutation, WebSocket match events.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { LushProfile, SwipeDirection } from '../components/SwipeCard';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

interface SwipeResult {
  isMatch: boolean;
  match?: { id: number; user_a_id: number; user_b_id: number };
  matchedProfile?: LushProfile;
}

export function useLushSwipe() {
  const [deck, setDeck] = useState<LushProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const offsetRef = useRef(0);
  const hasFetched = useRef(false);

  const fetchDeck = useCallback(async (reset = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const offset = reset ? 0 : offsetRef.current;
      const resp = await fetch(
        `${API_BASE}/lushpressies/discover/queue?limit=20&offset=${offset}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (!resp.ok) throw new Error('Failed to fetch deck');
      const data = await resp.json();

      setDeck((prev) => reset ? data.profiles : [...prev, ...data.profiles]);
      offsetRef.current = offset + data.profiles.length;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchDeck(true);
    }
  }, [fetchDeck]);

  const loadMore = useCallback(() => {
    fetchDeck(false);
  }, [fetchDeck]);

  const recordSwipe = useCallback(async (
    targetUserId: number,
    direction: SwipeDirection
  ): Promise<SwipeResult | null> => {
    try {
      const resp = await fetch(`${API_BASE}/lushpressies/swipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ targetUserId, direction }),
      });
      if (!resp.ok) return null;
      const data = await resp.json();

      if (data.isMatch) {
        // Fetch the partner profile so MatchModal can display it
        const matchedProfile = deck.find((p) => p.id === targetUserId) || null;
        return { isMatch: true, match: data.match, matchedProfile: matchedProfile ?? undefined };
      }
      return { isMatch: false };
    } catch {
      return null;
    }
  }, [deck]);

  const reverseRoll = useCallback(async (targetUserId: number) => {
    try {
      const resp = await fetch(`${API_BASE}/lushpressies/swipe/reverse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ targetUserId }),
      });
      const data = await resp.json();
      if (!resp.ok) return { error: data.error, upgradeRequired: data.upgradeRequired };
      // Re-add the profile to the top of the deck
      const profile = deck.find((p) => p.id === targetUserId);
      if (profile) setDeck((prev) => [profile, ...prev]);
      return { success: true };
    } catch {
      return { error: 'Network error' };
    }
  }, [deck]);

  return { deck, isLoading, error, recordSwipe, reverseRoll, loadMore };
}

// ─── Auth token helper ────────────────────────────────────────────────────
function getToken(): string {
  return (
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('authToken') ||
    ''
  );
}
