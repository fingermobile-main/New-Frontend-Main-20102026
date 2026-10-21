/**
 * MatchModal
 * Celebratory overlay shown when two members mutually like each other.
 * Provides: gift-to-unlock-chat CTA, dismiss action.
 */
import React, { useEffect, useRef } from 'react';
import { LushProfile } from './SwipeCard';

interface MatchModalProps {
  profile: LushProfile;
  matchId: number;
  onClose: () => void;
}

const MatchModal: React.FC<MatchModalProps> = ({ profile, matchId, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Animate in
  useEffect(() => {
    if (ref.current) {
      ref.current.style.opacity = '0';
      ref.current.style.transform = 'scale(0.8)';
      requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
          ref.current.style.opacity = '1';
          ref.current.style.transform = 'scale(1)';
        }
      });
    }
  }, []);

  const displayName = profile.first_name
    ? `${profile.first_name}${profile.last_name ? ' ' + profile.last_name[0] + '.' : ''}`
    : profile.username;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(160deg, #2d1b4e 0%, #1a1040 100%)',
          border: '1px solid rgba(167,139,250,0.3)',
          borderRadius: 28,
          padding: '48px 36px',
          maxWidth: 380,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glowing aura */}
        <div style={{
          position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        {/* Hearts particle */}
        <div style={{ fontSize: 56, marginBottom: 8, letterSpacing: 4 }}>
          💕
        </div>

        <h2 style={{
          margin: '0 0 6px', fontSize: 32, fontWeight: 800,
          background: 'linear-gradient(90deg, #f9a8d4, #c084fc)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          fontFamily: 'Inter, sans-serif',
        }}>
          It's a Match!
        </h2>

        <p style={{
          margin: '0 0 28px', color: '#c4b5fd', fontSize: 15,
          fontFamily: 'Inter, sans-serif', lineHeight: 1.6,
        }}>
          You and <strong style={{ color: '#f9a8d4' }}>{displayName}</strong> liked each other!
          <br />Send a gift to unlock the chat. 🎁
        </p>

        {/* Avatar */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 28,
        }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            border: '3px solid rgba(236,72,153,0.6)',
            overflow: 'hidden', boxShadow: '0 0 30px rgba(236,72,153,0.3)',
          }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={displayName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 36, fontWeight: 700, color: '#fff',
              }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => {
              // Navigate to gift shop with match context
              window.location.href = `/gifts/shop?matchId=${matchId}`;
            }}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              color: '#fff', border: 'none', borderRadius: 14,
              padding: '14px 24px', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            🎁 Send a Gift to Chat
          </button>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.07)',
              color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)',
              borderRadius: 14, padding: '12px 24px',
              fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              transition: 'background 0.15s ease',
            }}
          >
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;
