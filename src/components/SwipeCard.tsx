/**
 * SwipeCard
 * Gesture-driven profile card for Lush Pressies Discover tab.
 * Uses pointer events for cross-device (touch + mouse) gesture detection.
 * Thresholds: ±100px horizontal → like/pass, -120px vertical → super_like
 */

import React, { useRef, useState, useCallback } from 'react';

export interface LushProfile {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio_extended?: string;
  interests?: string[];
  matching_intents?: string[];
  zodiac_sign?: string;
  love_language?: string;
  match_score?: number;
  badge_level?: number;
  body_video_url?: string;
  profile_completeness?: number;
}

export type SwipeDirection = 'like' | 'pass' | 'super_like';

interface SwipeCardProps {
  profile: LushProfile;
  onSwipe: (profileId: number, direction: SwipeDirection) => void;
  isTop: boolean;
  stackIndex: number;
}

const SWIPE_THRESHOLD_X = 100;
const SWIPE_THRESHOLD_Y = -120;

const DIR_META: Record<SwipeDirection, { label: string; color: string; emoji: string }> = {
  like:       { label: 'LIKE',       color: '#4ade80', emoji: '💚' },
  pass:       { label: 'PASS',       color: '#f87171', emoji: '✗'  },
  super_like: { label: 'SUPER LIKE', color: '#818cf8', emoji: '⭐' },
};

const SwipeCard: React.FC<SwipeCardProps> = ({ profile, onSwipe, isTop, stackIndex }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [activeDir, setActiveDir] = useState<SwipeDirection | null>(null);
  const [exited, setExited] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!isTop || exited) return;
    cardRef.current?.setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
  }, [isTop, exited]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || exited) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    setPos({ x: dx, y: dy });
    if (dy < SWIPE_THRESHOLD_Y && Math.abs(dx) < 60) setActiveDir('super_like');
    else if (dx > SWIPE_THRESHOLD_X) setActiveDir('like');
    else if (dx < -SWIPE_THRESHOLD_X) setActiveDir('pass');
    else setActiveDir(null);
  }, [dragging, exited]);

  const onPointerUp = useCallback(() => {
    if (!dragging || exited) return;
    setDragging(false);
    if (activeDir) {
      setExited(true);
      setTimeout(() => onSwipe(profile.id, activeDir), 350);
    } else {
      setPos({ x: 0, y: 0 });
      setActiveDir(null);
    }
  }, [dragging, exited, activeDir, onSwipe, profile.id]);

  const rotation = pos.x * 0.08;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 400;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

  const tx = exited
    ? activeDir === 'pass' ? -vw * 1.5
      : activeDir === 'like' ? vw * 1.5
        : pos.x
    : pos.x;
  const ty = exited && activeDir === 'super_like' ? -vh * 1.5 : pos.y;

  const style: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    transform: `translate(${tx}px, ${ty}px) rotate(${rotation}deg) scale(${1 - stackIndex * 0.04})`,
    top: `${stackIndex * 8}px`,
    transition: exited
      ? 'transform 0.35s cubic-bezier(0.4,0,0.2,1)'
      : dragging ? 'none'
        : 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
    zIndex: 10 - stackIndex,
    cursor: isTop ? (dragging ? 'grabbing' : 'grab') : 'default',
    userSelect: 'none',
    touchAction: 'none',
    borderRadius: '20px',
    overflow: 'hidden',
    background: 'linear-gradient(160deg, #1e1b2e 0%, #2d1b4e 100%)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    aspectRatio: '3/4',
  };

  const displayName = profile.first_name
    ? `${profile.first_name}${profile.last_name ? ' ' + profile.last_name[0] + '.' : ''}`
    : profile.username;

  const dirMeta = activeDir ? DIR_META[activeDir] : null;

  return (
    <div
      ref={cardRef}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Direction badge overlay */}
      {dirMeta && (
        <div style={{
          position: 'absolute', top: 24, left: 24, zIndex: 20,
          border: `3px solid ${dirMeta.color}`,
          color: dirMeta.color, borderRadius: 8,
          padding: '4px 14px', fontSize: 22, fontWeight: 800,
          letterSpacing: 2, fontFamily: 'Inter, sans-serif',
          background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
          transform: 'rotate(-12deg)',
        }}>
          {dirMeta.emoji} {dirMeta.label}
        </div>
      )}

      {/* Avatar */}
      <div style={{ position: 'relative', height: '62%', overflow: 'hidden' }}>
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={displayName}
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 80, fontWeight: 700, color: '#fff',
          }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
        }} />

        {/* Match score */}
        {profile.match_score !== undefined && profile.match_score > 0 && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            color: '#fff', borderRadius: 20, padding: '4px 12px',
            fontSize: 13, fontWeight: 700, fontFamily: 'Inter, sans-serif',
          }}>
            {Math.round(profile.match_score)}% Match
          </div>
        )}

        {/* Verification */}
        {profile.badge_level && profile.badge_level > 0 ? (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: '4px 10px',
            fontSize: 13, backdropFilter: 'blur(4px)',
          }} title="Verified Profile">
            {'⭐'.repeat(Math.min(profile.badge_level, 3))} Verified
          </div>
        ) : null}
      </div>

      {/* Info panel */}
      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 style={{
            margin: 0, fontSize: 22, fontWeight: 700, color: '#fff',
            fontFamily: 'Inter, sans-serif',
          }}>
            {displayName}
          </h3>
          {profile.zodiac_sign && (
            <span style={{ fontSize: 13, color: '#a78bfa', fontFamily: 'Inter, sans-serif' }}>
              {profile.zodiac_sign}
            </span>
          )}
        </div>

        {profile.matching_intents && profile.matching_intents.length > 0 && (
          <p style={{ margin: 0, fontSize: 13, color: '#c4b5fd', fontFamily: 'Inter, sans-serif' }}>
            {profile.matching_intents.slice(0, 2).join(' · ')}
          </p>
        )}

        {profile.bio_extended && (
          <p style={{
            margin: 0, fontSize: 13, color: '#e2e8f0', lineHeight: 1.5,
            fontFamily: 'Inter, sans-serif',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {profile.bio_extended}
          </p>
        )}

        {profile.interests && profile.interests.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
            {profile.interests.slice(0, 5).map((tag) => (
              <span key={tag} style={{
                background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(167,139,250,0.4)',
                color: '#c4b5fd', borderRadius: 20, padding: '2px 10px',
                fontSize: 11, fontFamily: 'Inter, sans-serif',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeCard;
