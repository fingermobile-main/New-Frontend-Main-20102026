/**
 * SwipeDeck
 * Manages the stack of SwipeCards, handles API calls, gesture/button interactions,
 * keyboard controls, and drives the MatchModal when a mutual like is detected.
 */
import React, { useState, useCallback, useEffect } from 'react';
import SwipeCard, { LushProfile, SwipeDirection } from './SwipeCard';
import MatchModal from './MatchModal';
import { useLushSwipe } from '../hooks/useLushSwipe';
import './SwipeDeck.css';

interface SwipeDeckProps {
  userId?: number;
  compact?: boolean;
  onRewindNotification?: (message: string) => void;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({
  userId = 1,
  compact = false,
  onRewindNotification
}) => {
  const { deck, isLoading, recordSwipe, reverseRoll, loadMore, swipedHistory } = useLushSwipe();
  const [matchData, setMatchData] = useState<{
    matchId: number;
    profile: LushProfile;
  } | null>(null);
  const [swipedCount, setSwipedCount] = useState(0);

  const handleSwipe = useCallback(
    async (profileId: number, direction: SwipeDirection) => {
      const result = await recordSwipe(profileId, direction);
      setSwipedCount((c) => c + 1);

      if (result?.isMatch && result.matchedProfile && result.match) {
        setMatchData({ matchId: result.match.id, profile: result.matchedProfile });
      }

      // Pre-load more cards when deck runs low
      if (deck.length - swipedCount <= 4) {
        loadMore();
      }
    },
    [recordSwipe, deck.length, swipedCount, loadMore]
  );

  const handleRewind = useCallback(async () => {
    if (swipedHistory.length === 0 && swipedCount === 0) {
      if (onRewindNotification) onRewindNotification('No swipes to rewind yet!');
      return;
    }
    const res = await reverseRoll();
    if (res.success) {
      setSwipedCount((c) => Math.max(0, c - 1));
      if (onRewindNotification) {
        onRewindNotification(`Returned ${res.profile?.first_name || res.profile?.username} to the deck!`);
      }
    }
  }, [reverseRoll, swipedHistory.length, swipedCount, onRewindNotification]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const currentCard = deck.slice(swipedCount, swipedCount + 4)[0];
      if (!currentCard) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSwipe(currentCard.id, 'pass');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSwipe(currentCard.id, 'like');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleSwipe(currentCard.id, 'super_like');
      } else if (e.key === 'Backspace' || e.key === 'z') {
        e.preventDefault();
        handleRewind();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deck, swipedCount, handleSwipe, handleRewind]);

  const visibleCards = deck.slice(swipedCount, swipedCount + 4);

  if (isLoading && visibleCards.length === 0) {
    return (
      <div className={`swipe-deck ${compact ? 'swipe-deck--compact' : ''}`}>
        <div className="swipe-deck__loading">
          <div className="swipe-deck__spinner" />
          <p>Curating exceptional Lush matches…</p>
        </div>
      </div>
    );
  }

  if (visibleCards.length === 0) {
    return (
      <div className={`swipe-deck ${compact ? 'swipe-deck--compact' : ''}`}>
        <div className="swipe-deck__empty">
          <div style={{ fontSize: 64 }}>🌸</div>
          <h3>You've explored the nearby deck</h3>
          <p>Refresh to discover new radiating profiles or review high-scoring connections.</p>
          <button
            onClick={() => {
              setSwipedCount(0);
              loadMore();
            }}
            className="swipe-deck__refresh-btn"
          >
            Refresh Deck
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`swipe-deck ${compact ? 'swipe-deck--compact' : ''}`}>
      <div className="swipe-deck__stack">
        {/* Render cards reversed so top card is last in DOM (highest z-index) */}
        {[...visibleCards].reverse().map((profile, i) => {
          const stackIndex = visibleCards.length - 1 - i;
          return (
            <SwipeCard
              key={`${profile.id}-${stackIndex}`}
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
          className="swipe-deck__action-btn swipe-deck__action-btn--rewind"
          onClick={handleRewind}
          title="Rewind / Undo Last Swipe"
          disabled={swipedCount === 0 && swipedHistory.length === 0}
        >
          ↺
        </button>
        <button
          className="swipe-deck__action-btn swipe-deck__action-btn--pass"
          onClick={() => visibleCards[0] && handleSwipe(visibleCards[0].id, 'pass')}
          title="Pass (Left Arrow)"
        >
          ✗
        </button>
        <button
          className="swipe-deck__action-btn swipe-deck__action-btn--super"
          onClick={() => visibleCards[0] && handleSwipe(visibleCards[0].id, 'super_like')}
          title="Super Like (Up Arrow)"
        >
          ⭐
        </button>
        <button
          className="swipe-deck__action-btn swipe-deck__action-btn--like"
          onClick={() => visibleCards[0] && handleSwipe(visibleCards[0].id, 'like')}
          title="Like (Right Arrow)"
        >
          💚
        </button>
      </div>

      {!compact && (
        <div className="swipe-deck__shortcuts">
          <span><span className="swipe-deck__shortcut-badge">←</span> Pass</span>
          <span><span className="swipe-deck__shortcut-badge">↑</span> Super Like</span>
          <span><span className="swipe-deck__shortcut-badge">→</span> Like</span>
          <span><span className="swipe-deck__shortcut-badge">↺</span> Rewind</span>
        </div>
      )}

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
