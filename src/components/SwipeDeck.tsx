/**
 * SwipeDeck
 * Manages the stack of SwipeCards, handles API calls, and drives the
 * MatchModal when a mutual like is detected.
 */
import React, { useState, useCallback, useEffect } from 'react';
import SwipeCard, { LushProfile, SwipeDirection } from './SwipeCard';
import MatchModal from './MatchModal';
import { useLushSwipe } from '../hooks/useLushSwipe';

interface SwipeDeckProps {
  userId: number;
}

export const SwipeDeck: React.FC<Partial<SwipeDeckProps>> = ({ userId = 1 }) => {
  const { deck, isLoading, recordSwipe, loadMore } = useLushSwipe();
  const [matchData, setMatchData] = useState<{
    matchId: number;
    profile: LushProfile;
  } | null>(null);
  const [swipedCount, setSwipedCount] = useState(0);

  const handleSwipe = useCallback(async (profileId: number, direction: SwipeDirection) => {
    const result = await recordSwipe(profileId, direction);
    setSwipedCount((c) => c + 1);

    if (result?.isMatch && result.matchedProfile && result.match) {
      setMatchData({ matchId: result.match.id, profile: result.matchedProfile });
    }

    // Pre-load more cards when deck runs low
    if (deck.length - swipedCount <= 4) {
      loadMore();
    }
  }, [recordSwipe, deck.length, swipedCount, loadMore]);

  const visibleCards = deck.slice(swipedCount, swipedCount + 4);

  if (isLoading && visibleCards.length === 0) {
    return (
      <div className="swipe-deck__loading">
        <div className="swipe-deck__spinner" />
        <p>Finding your matches…</p>
      </div>
    );
  }

  if (visibleCards.length === 0) {
    return (
      <div className="swipe-deck__empty">
        <div style={{ fontSize: 64 }}>🌸</div>
        <h3>You've seen everyone nearby</h3>
        <p>Check back soon or expand your search radius in preferences.</p>
        <button onClick={loadMore} className="btn btn--primary">Refresh Deck</button>
      </div>
    );
  }

  return (
    <div className="swipe-deck">
      <div className="swipe-deck__stack">
        {/* Render top 3 cards reversed so top card is last in DOM (highest z-index) */}
        {[...visibleCards].reverse().map((profile, i) => {
          const stackIndex = visibleCards.length - 1 - i;
          return (
            <SwipeCard
              key={profile.id}
              profile={profile}
              onSwipe={handleSwipe}
              isTop={stackIndex === 0}
              stackIndex={stackIndex}
            />
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="swipe-deck__actions">
        <button
          className="swipe-deck__action-btn swipe-deck__action-btn--pass"
          onClick={() => visibleCards[0] && handleSwipe(visibleCards[0].id, 'pass')}
          title="Pass"
        >
          ✗
        </button>
        <button
          className="swipe-deck__action-btn swipe-deck__action-btn--super"
          onClick={() => visibleCards[0] && handleSwipe(visibleCards[0].id, 'super_like')}
          title="Super Like"
        >
          ⭐
        </button>
        <button
          className="swipe-deck__action-btn swipe-deck__action-btn--like"
          onClick={() => visibleCards[0] && handleSwipe(visibleCards[0].id, 'like')}
          title="Like"
        >
          💚
        </button>
      </div>

      {matchData && (
        <MatchModal
          profile={matchData.profile}
          matchId={matchData.matchId}
          onClose={() => setMatchData(null)}
        />
      )}
    </div>
  );
};

export default SwipeDeck;
