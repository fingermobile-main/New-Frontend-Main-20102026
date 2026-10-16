/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Key,
  MessageCircle,
  Filter,
  Users
} from 'lucide-react';
import {
  SharedInterestMember,
  DiscoveryDomain,
  MatchCelebrationData
} from './types';
import { SharedInterestMatchCelebrationModal } from './SharedInterestMatchCelebrationModal';

interface UniversalDiscoverGridProps {
  domain: DiscoveryDomain;
  members: SharedInterestMember[];
  onOpenLapidaireModal: () => void;
  onSendMessage?: (_memberId: string) => void;
  onExchangePin?: (_memberId: string) => void;
}

export const UniversalDiscoverGrid: React.FC<UniversalDiscoverGridProps> = ({
  domain,
  members,
  onOpenLapidaireModal,
  onSendMessage,
  onExchangePin
}) => {
  const isBeatwave = domain === 'beatwaveng';
  const accentColor = isBeatwave ? 'amber' : 'rose';
  const gradientBg = isBeatwave
    ? 'from-amber-500 to-orange-600'
    : 'from-rose-500 to-red-600';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [matchData, setMatchData] = useState<MatchCelebrationData | null>(null);

  // Dynamic filter chips depending on domain
  const filterOptions = useMemo(() => {
    if (isBeatwave) {
      return [
        { id: 'all', label: 'All Shared Interests' },
        { id: 'same_artist', label: 'Same Artist' },
        { id: 'same_album', label: 'Same Album' },
        { id: 'same_concert', label: 'Same Concert / Event' },
        { id: 'same_ai_playlist', label: 'Same AI Playlist' },
        { id: 'high_resonance', label: 'High Resonance (90%+)' }
      ];
    } else {
      return [
        { id: 'all', label: 'All Shared Interests' },
        { id: 'same_movie', label: 'Same Movie' },
        { id: 'same_director', label: 'Same Director' },
        { id: 'same_premiere', label: 'Same Premiere / Event' },
        { id: 'same_genre', label: 'Same Cinema Genre' },
        { id: 'high_resonance', label: 'High Resonance (90%+)' }
      ];
    }
  }, [isBeatwave]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // Search matching
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        !query ||
        m.name.toLowerCase().includes(query) ||
        m.handle.toLowerCase().includes(query) ||
        m.location.toLowerCase().includes(query) ||
        m.sharedInterests.some(
          (si) =>
            si.label.toLowerCase().includes(query) ||
            si.value.toLowerCase().includes(query)
        );

      if (!matchesSearch) return false;

      // Category filter matching
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'high_resonance') return m.compatibilityScore >= 90;

      return m.sharedInterests.some((si) => si.category === selectedFilter);
    });
  }, [members, searchTerm, selectedFilter]);

  const handleConnectClick = (member: SharedInterestMember) => {
    const highlights = member.sharedInterests.slice(0, 3).map((si) => `${si.label}: ${si.value}`);
    setMatchData({
      member,
      matchType: 'mutual_like',
      matchedAt: new Date().toISOString(),
      sharedHighlights: highlights
    });
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              isBeatwave
                ? 'Search by artist, album, concert, or name...'
                : 'Search by movie, director, premiere, or name...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
          />
        </div>

        {/* Lapidaire Calibration Shortcut */}
        <button
          onClick={onOpenLapidaireModal}
          className="w-full sm:w-auto py-2 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 flex items-center justify-center gap-2 transition"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Sharpen Lapidaire AI Calibration</span>
        </button>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
        {filterOptions.map((opt) => {
          const isActive = selectedFilter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelectedFilter(opt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? `bg-${accentColor}-500 text-slate-950 shadow-md shadow-${accentColor}-500/30`
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Like-Minded Members */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Top Member Card Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
                      />
                      {member.isOnline && (
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white">{member.name}</h4>
                        {member.verified && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                        {member.ninVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {member.handle}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{member.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Badge */}
                  <div className="px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-mono text-[11px] font-bold shrink-0">
                    {member.compatibilityScore}% Match
                  </div>
                </div>

                {/* Member Bio */}
                <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                  {member.bio}
                </p>

                {/* Shared Interest Chips */}
                <div className="mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Shared Resonance:
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {member.sharedInterests.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-950 border border-slate-800 text-slate-200"
                      >
                        <span>{tag.icon || '✨'}</span>
                        <span className="text-amber-400 font-bold">{tag.label}:</span>
                        <span>{tag.value}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Favorite Media Preview */}
                {member.favoriteMedia && (
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-3 mb-4">
                    <img
                      src={member.favoriteMedia.imageUrl}
                      alt={member.favoriteMedia.title}
                      className="w-11 h-11 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {member.favoriteMedia.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {member.favoriteMedia.subtitle}
                      </div>
                    </div>
                    {member.favoriteMedia.extraBadge && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-amber-400 border border-slate-800 shrink-0">
                        {member.favoriteMedia.extraBadge}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => handleConnectClick(member)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r ${gradientBg} text-white hover:brightness-110 shadow-md transition flex items-center justify-center gap-1.5`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>
                    {isBeatwave ? 'Exchange PIN / Colabo+' : 'Invite to Watch-Party'}
                  </span>
                </button>
                <button
                  onClick={() => {
                    if (onSendMessage) onSendMessage(member.id);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                  title="Direct Message"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 space-y-3">
          <Users className="w-10 h-10 mx-auto text-slate-600" />
          <h4 className="text-base font-bold text-white">No Matching Members Found</h4>
          <p className="text-xs max-w-sm mx-auto">
            Try adjusting your search query or reset filter category to see all like-minded sovereign members.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedFilter('all');
            }}
            className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800 text-amber-400 hover:bg-slate-700 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Mutual Match Celebration Modal */}
      <SharedInterestMatchCelebrationModal
        data={matchData}
        domain={domain}
        onClose={() => setMatchData(null)}
        onSendMessage={onSendMessage}
        onExchangePin={onExchangePin}
      />
    </div>
  );
};
