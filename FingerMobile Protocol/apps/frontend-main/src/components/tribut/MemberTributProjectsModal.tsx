import React, { useState } from 'react';
import {
  XMarkIcon,
  BookmarkIcon,
  ShareIcon,
  ShoppingBagIcon,
  ShieldIcon,
  SparklesIcon,
  ChatBubbleIcon,
  ArrowDownTrayIcon,
  ChevronRightIcon
} from '../../icons';
import {
  TributPinItem,
  UserProjectBoard,
  COMMUNITY_DESIGN_DISCUSSIONS
} from '../../data/tributData';

interface MemberTributProjectsModalProps {
  author: TributPinItem['author'];
  allPins: TributPinItem[];
  allBoards: UserProjectBoard[];
  savedPinIds: string[];
  onClose: () => void;
  onSelectPin: (pin: TributPinItem) => void;
  onToggleSavePin: (pin: TributPinItem, e?: React.MouseEvent) => void;
  onOpenDownloadModal: (pin: TributPinItem) => void;
}

export const MemberTributProjectsModal: React.FC<MemberTributProjectsModalProps> = ({
  author,
  allPins,
  allBoards,
  savedPinIds,
  onClose,
  onSelectPin,
  onToggleSavePin,
  onOpenDownloadModal
}) => {
  const [activeTab, setActiveTab] = useState<'tribut' | 'boards' | 'discussions' | 'store'>('tribut');
  const [isFollowing, setIsFollowing] = useState(false);
  const [collabSent, setCollabSent] = useState(false);
  const [critiqueRequested, setCritiqueRequested] = useState(false);

  // Filter member's pins
  const memberPins = allPins.filter(
    (p) => p.author.id === author.id || p.author.name === author.name || p.author.handle === author.handle
  );

  // If member has few pins, supplement with category matching pins so it's a rich view
  const displayPins = memberPins.length > 0 ? memberPins : allPins.slice(0, 6);

  // Member's boards
  const memberBoards = allBoards.filter((b) =>
    displayPins.some((p) => p.boardName.toLowerCase() === b.name.toLowerCase())
  );
  const displayBoards = memberBoards.length > 0 ? memberBoards : allBoards.slice(0, 3);

  // Member's discussions
  const memberDiscussions = COMMUNITY_DESIGN_DISCUSSIONS.filter(
    (d) => d.authorName.toLowerCase() === author.name.toLowerCase() || d.authorHandle === author.handle
  );

  // Total saves across member's pins
  const totalSaves = displayPins.reduce((acc, curr) => acc + (curr.metrics?.saves || 0), 0);
  const totalLikes = displayPins.reduce((acc, curr) => acc + (curr.metrics?.likes || 0), 0);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER PROFILE HERO ================= */}
        <div className="relative bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 sm:p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-700 transition"
            title="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-purple-400/40 shadow-xl"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-black text-white">{author.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                    {author.domainReputation}
                  </span>
                </div>
                <div className="text-sm font-semibold text-purple-200">{author.handle}</div>
                <div className="flex items-center gap-2 text-xs text-slate-700 pt-1">
                  <SparklesIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{author.consistencyStreak || 'Consistent Daily Creator'}</span>
                  <span>•</span>
                  <span>FingerMobile Sovereign Curator</span>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`py-2 px-5 rounded-xl font-bold text-xs transition shadow-sm ${
                  isFollowing
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-slate-900 hover:bg-slate-100'
                }`}
              >
                {isFollowing ? '✓ Following' : '+ Follow Member'}
              </button>

              <button
                onClick={() => setCollabSent(true)}
                className={`py-2 px-4 rounded-xl border font-bold text-xs transition cursor-pointer ${
                  collabSent
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : 'bg-purple-600/40 hover:bg-purple-600/60 border-purple-400/50 text-white'
                }`}
              >
                {collabSent ? '✓ Studio Invite Dispatched' : 'Collaborate'}
              </button>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10 text-xs">
            <div>
              <span className="block text-slate-700 font-medium">Published Tribut Pins</span>
              <strong className="text-lg font-black text-white">{displayPins.length} Pins</strong>
            </div>
            <div>
              <span className="block text-slate-700 font-medium">Curated Project Boards</span>
              <strong className="text-lg font-black text-white">{displayBoards.length} Boards</strong>
            </div>
            <div>
              <span className="block text-slate-700 font-medium">Community Pin Saves</span>
              <strong className="text-lg font-black text-white">{totalSaves.toLocaleString()} Saves</strong>
            </div>
            <div>
              <span className="block text-slate-700 font-medium">Total Likes</span>
              <strong className="text-lg font-black text-white">{totalLikes.toLocaleString()} Likes</strong>
            </div>
          </div>
        </div>

        {/* ================= NAVIGATION TABS ================= */}
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('tribut')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'tribut'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            1. Member's Tribut ({displayPins.length})
          </button>

          <button
            onClick={() => setActiveTab('boards')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'boards'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            2. Project Planning Boards ({displayBoards.length})
          </button>

          <button
            onClick={() => setActiveTab('discussions')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'discussions'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            3. Design Discussions & Critiques ({memberDiscussions.length})
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'store'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            4. Shoppable Products & Buy & Share
          </button>
        </div>

        {/* ================= TAB 1: MEMBER'S TRIBUT PINS ================= */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'tribut' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">
                  Showing {displayPins.length} designs created and indexed by {author.name}.
                </span>
                <span className="text-slate-600">Click any card to inspect full details</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {displayPins.map((p) => {
                  const isSaved = savedPinIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectPin(p)}
                      className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200"
                    >
                      <img
                        src={p.mediaUrl}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Top Save badge */}
                      <button type="button" aria-label="Bookmark"
                        onClick={(e) => onToggleSavePin(p, e)}
                        className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition ${
                          isSaved ? 'bg-red-600 text-white' : 'bg-black/60 hover:bg-red-600 text-white'
                        }`}
                      >
                        <BookmarkIcon className="w-3.5 h-3.5" />
                      </button>

                      {/* Clean visual representation: minimal hover reveal */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end pointer-events-none">
                        <span className="text-xs font-black text-white line-clamp-1">{p.title}</span>
                        <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1">
                          <span>{p.categoryLabel}</span>
                          <span>{p.metrics?.saves || 0} saves</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB 2: MEMBER'S PROJECT BOARDS ================= */}
          {activeTab === 'boards' && (
            <div className="space-y-6">
              <div className="text-xs text-slate-700">
                Explore project moodboards curated by {author.name} for design ideation, architectural plans, and shopping wishlists.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {displayBoards.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all group flex flex-col"
                  >
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={b.coverImage}
                        alt={b.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase">
                        {b.purpose}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{b.name}</h4>
                        <span className="text-xs text-slate-600 font-semibold">{b.pinCount} Curated Pins</span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            if (displayPins[0]) onSelectPin(displayPins[0]);
                          }}
                          className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                        >
                          Explore Board Pins
                          <ChevronRightIcon className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (displayPins[0]) onOpenDownloadModal(displayPins[0]);
                          }}
                          className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700"
                          title="Download Board Bundle"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: DESIGN DISCUSSIONS & CRITIQUES ================= */}
          {activeTab === 'discussions' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">
                  Active topics & design feedback started by {author.name}.
                </span>
                <button
                  onClick={() => setCritiqueRequested(true)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    critiqueRequested
                      ? 'bg-emerald-600 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {critiqueRequested ? '✓ Critique Room Requested' : `+ Ask ${author.name} for Design Critique`}
                </button>
              </div>

              {memberDiscussions.length > 0 ? (
                <div className="space-y-3">
                  {memberDiscussions.map((d) => (
                    <div
                      key={d.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-purple-300 transition"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-700">{d.category}</span>
                        <span className="text-slate-500">{d.createdAt}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">{d.title}</h4>
                      <p className="text-xs text-slate-700 leading-relaxed">{d.content}</p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex gap-1.5">
                          {d.tags.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 font-bold">
                          <span>💬 {d.commentsCount} comments</span>
                          <span>▲ {d.upvotesCount} upvotes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <ChatBubbleIcon className="w-8 h-8 text-purple-500 mx-auto" />
                  <h4 className="font-bold text-slate-900 text-sm">No Open Design Critiques</h4>
                  <p className="text-xs text-slate-600">
                    Be the first to ask {author.name} a question about materials, prompts, or styling advice!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 4: STOREFRONT & COMMERCE ================= */}
          {activeTab === 'store' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-700">
                Products linked to {author.name}'s tribut pins with live e-commerce inventory sync. Earn commission on every Buy & Share.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {displayPins
                  .filter((p) => p.shopping?.isShoppable)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <img
                          src={p.mediaUrl}
                          alt={p.shopping?.productName || p.title}
                          className="h-36 w-full object-cover rounded-xl"
                        />
                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-purple-700">
                          <span>{p.shopping?.storeEngine} Store</span>
                          <span className="text-emerald-700">In Stock</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-2">
                          {p.shopping?.productName}
                        </h4>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-black text-slate-900">
                            ₦{p.shopping?.priceNgn.toLocaleString()}
                          </span>
                          <span className="text-[11px] font-bold text-purple-900">
                            Earn {p.shopping?.buyAndShareCommissionPercent}%
                          </span>
                        </div>

                        <button
                          onClick={() => onSelectPin(p)}
                          className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm transition"
                        >
                          View & Checkout
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberTributProjectsModal;
