/*
 * FingerMobile Protocol™ - People You May Know Member Discovery Carousel
 * Document: Member Users Profile Page Wall Charter Development 15102026.md (Section 3)
 * Horizontally arranged recommendation cards with mutual-friend contexts,
 * connection request triggers, dismiss controls, and accessible navigation.
 * Compliant with WCAG AAA contrast hierarchy standards.
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Check,
  X,
  Users,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export interface RecommendationMember {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  relationship_context: string;
  mutual_count?: number;
  category?: string;
  status?: 'none' | 'pending' | 'friends';
}

interface PeopleYouMayKnowCarouselProps {
  title?: string;
  // eslint-disable-next-line no-unused-vars
  onConnect?: (memberId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onDismiss?: (memberId: string) => void;
  initialRecommendations?: RecommendationMember[];
}

export const PeopleYouMayKnowCarousel: React.FC<PeopleYouMayKnowCarouselProps> = ({
  title = 'Connections',
  onConnect,
  onDismiss,
  initialRecommendations
}) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [recommendations, setRecommendations] = useState<RecommendationMember[]>(() => {
    if (initialRecommendations && initialRecommendations.length > 0) {
      return initialRecommendations;
    }
    return [
      {
        id: 'rec-1',
        name: 'Mbah Redice Obinna',
        handle: 'redice200',
        avatar: '/assets/branding/mbah_israel_obinna.jpeg',
        relationship_context: 'GraceLink Business Technologies Limited • 6 mutual connections',
        mutual_count: 6,
        category: 'Creator & Tech Lead',
        status: 'none'
      },
      {
        id: 'rec-2',
        name: 'Sarah Jenkins',
        handle: 'sarahjenkins',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        relationship_context: 'Cryptographic Lead • 4 mutual connections',
        mutual_count: 4,
        category: 'Cryptographic Lead',
        status: 'friends'
      },
      {
        id: 'rec-3',
        name: 'Michael Scott',
        handle: 'michaelscott',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        relationship_context: 'Regional Commerce Node • 2 mutual connections',
        mutual_count: 2,
        category: 'Commerce Lead',
        status: 'none'
      },
      {
        id: 'rec-4',
        name: 'Elena Rostova',
        handle: 'elenarostova',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        relationship_context: 'Shared community: Beatwave SoundMasters',
        mutual_count: 3,
        category: 'Audio Architect',
        status: 'none'
      },
      {
        id: 'rec-5',
        name: 'David Kim',
        handle: 'davidkim',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        relationship_context: 'Followed by Alex Chen',
        mutual_count: 1,
        category: 'Security Node',
        status: 'none'
      },
      {
        id: 'rec-6',
        name: 'Marcus Adeyemi',
        handle: 'marcusadeyemi',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200',
        relationship_context: 'Shared community: Sovereign Developers',
        mutual_count: 5,
        category: 'Ecosystem Eng',
        status: 'none'
      }
    ];
  });

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const handleToggleConnect = (id: string) => {
    setRecommendations((prev) =>
      prev.map((member) => {
        if (member.id === id) {
          const nextStatus =
            member.status === 'none'
              ? 'pending'
              : member.status === 'pending'
                ? 'friends'
                : 'none';
          if (onConnect) onConnect(id);
          return { ...member, status: nextStatus };
        }
        return member;
      })
    );
  };

  const handleDismissCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecommendations((prev) => prev.filter((m) => m.id !== id));
    if (onDismiss) onDismiss(id);
  };

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-300 p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header with Title, See All & Arrows */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-100 text-orange-950 border border-orange-300">
            <Users className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{title}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-950 border border-slate-400 font-black">
                {recommendations.length}
              </span>
            </h3>
            <p className="text-xs font-medium text-slate-700">
              Discover verified protocol participants, co-workers, and shared community peers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/network/suggestions')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline mr-1 hidden sm:inline"
          >
            See all recommendations →
          </button>

          <button
            type="button"
            onClick={scrollLeft}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-xs transition-colors"
            title="Scroll recommendations left"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-xs transition-colors"
            title="Scroll recommendations right"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar scrollbar-none"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {recommendations.map((rec) => {
          const isPending = rec.status === 'pending';
          const isFriends = rec.status === 'friends';

          return (
            <div
              key={rec.id}
              style={{ scrollSnapAlign: 'start' }}
              className="w-56 shrink-0 bg-slate-50 hover:bg-white rounded-2xl border border-slate-300 p-4 flex flex-col justify-between space-y-3 relative group shadow-xs hover:shadow-md transition-all"
            >
              {/* Dismiss Control (X Button) */}
              <button
                type="button"
                onClick={(e) => handleDismissCard(rec.id, e)}
                className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-700 hover:text-slate-800 hover:bg-slate-200 transition-colors z-10"
                title="Dismiss recommendation"
                aria-label={`Dismiss recommendation for ${rec.name}`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Avatar & Member Identification */}
              <div
                onClick={() => navigate(`/profile/${rec.handle || rec.id}`)}
                className="cursor-pointer space-y-2 text-center"
              >
                <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-emerald-500/80 bg-slate-200 group-hover:scale-105 transition-transform border text-slate-950 border-slate-400 font-black">
                  <img
                    src={rec.avatar}
                    alt={rec.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
                    }}
                  />
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-900 truncate hover:text-emerald-700 transition-colors flex items-center justify-center gap-1">
                    <span className="truncate">{rec.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  </h4>
                  <p className="text-[11px] font-mono font-bold text-slate-600">@{rec.handle}</p>
                </div>

                {/* Relationship Context Badge */}
                <p className="text-[10px] font-medium text-slate-700 line-clamp-2 h-7 leading-tight">
                  {rec.relationship_context}
                </p>
              </div>

              {/* Primary Connection CTA */}
              <button
                type="button"
                onClick={() => handleToggleConnect(rec.id)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                  isFriends
                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-400'
                    : isPending
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-400'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isFriends ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>✓ Friends</span>
                  </>
                ) : isPending ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Request Sent</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add Friend</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PeopleYouMayKnowCarousel;
