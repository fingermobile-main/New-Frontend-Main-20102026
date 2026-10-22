import React, { useState, useEffect, useRef } from 'react';
import {
  XMarkIcon,
  BookmarkIcon,
  ShareIcon,
  ShoppingBagIcon,
  ArrowsPointingOutIcon,
  SwatchIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  DotsHorizontalIcon,
  ChatBubbleIcon,
  PhotoIcon,
  EmojiHappyIcon,
  SparklesIcon,
  ShieldIcon,
  SearchIcon
} from '../../icons';
import { TributPinItem, PinCommentItem, UserProjectBoard } from '../../data/tributData';

interface TributPinDetailModalProps {
  pin: TributPinItem;
  allPins: TributPinItem[];
  userBoards: UserProjectBoard[];
  savedPinIds: string[];
  onClose: () => void;
  onSelectPin: (pin: TributPinItem) => void;
  onToggleSavePin: (pin: TributPinItem, e?: React.MouseEvent) => void;
  onSharePin: (pin: TributPinItem, e?: React.MouseEvent) => void;
  onCheckoutPin: (pin: TributPinItem) => void;
  onOpenDownloadModal: (pin: TributPinItem) => void;
  onAddComment: (pinId: string, comment: PinCommentItem) => void;
}

export const TributPinDetailModal: React.FC<TributPinDetailModalProps> = ({
  pin,
  allPins,
  userBoards,
  savedPinIds,
  onClose,
  onSelectPin,
  onToggleSavePin,
  onSharePin,
  onCheckoutPin,
  onOpenDownloadModal,
  onAddComment
}) => {
  // Swipe & Touch gesture tracking
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);
  const [selectedBoardName, setSelectedBoardName] = useState(pin.boardName || 'Profile');
  const [selectedColorSwatch, setSelectedColorSwatch] = useState<string | null>(null);

  // Likes state
  const [likeCount, setLikeCount] = useState(pin.metrics.likes || 192);
  const [isLiked, setIsLiked] = useState(false);

  // New comment input
  const [commentText, setCommentText] = useState('');
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(false);
  const [likedCommentIds, setLikedCommentIds] = useState<string[]>([]);

  const currentIndex = allPins.findIndex((p) => p.id === pin.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allPins.length - 1;

  const navigatePrev = () => {
    if (hasPrev) {
      onSelectPin(allPins[currentIndex - 1]);
      setActiveMediaIndex(0);
    }
  };

  const navigateNext = () => {
    if (hasNext) {
      onSelectPin(allPins[currentIndex + 1]);
      setActiveMediaIndex(0);
    }
  };

  // Keyboard navigation: Arrow Left/Up = Prev, Arrow Right/Down = Next, Esc = Close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        navigatePrev();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        navigateNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allPins]);

  // Touch swipe handling (Swipe Left or Up advances to Next!)
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setIsSwiping(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartPos.x;
    const deltaY = touch.clientY - touchStartPos.y;
    setIsSwiping(false);
    setTouchStartPos(null);

    const minSwipeDistance = 45;

    // Swipe Left or Up => Next Photo/Video
    if (deltaX < -minSwipeDistance || deltaY < -minSwipeDistance) {
      navigateNext();
    }
    // Swipe Right or Down => Previous Photo/Video
    else if (deltaX > minSwipeDistance || deltaY > minSwipeDistance) {
      navigatePrev();
    }
  };

  // Like toggle
  const handleToggleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  // Add Comment submit
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: PinCommentItem = {
      id: `comm-${Date.now()}`,
      authorName: 'Ibrahim Danjuma (You)',
      authorHandle: '@ibrahim_d',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      content: commentText.trim(),
      createdAt: 'Just now',
      likes: 1,
      isLiked: true,
      critiqueTag: 'Community Note'
    };

    onAddComment(pin.id, newComment);
    setCommentText('');
  };

  const isSaved = savedPinIds.includes(pin.id);

  // Swatches for skin tone range / color palette (mirrors the screenshot's "More in your skin tone range")
  const defaultSwatches = ['#F5D1C4', '#E6A88C', '#BD7454', '#793F29', '#3D1C0F'];
  const paletteSwatches = pin.colorPalette && pin.colorPalette.length > 0 ? pin.colorPalette : defaultSwatches;

  // Multi-media urls if present
  const mediaList = pin.multiMediaUrls && pin.multiMediaUrls.length > 0 ? pin.multiMediaUrls : [pin.mediaUrl];
  const activeMediaUrl = mediaList[activeMediaIndex] || pin.mediaUrl;

  // Filter related pins
  const relatedPins = allPins
    .filter((p) => p.id !== pin.id && (p.category === pin.category || p.boardName === pin.boardName))
    .slice(0, 10);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex flex-col justify-start items-center p-2 sm:p-4 md:p-6"
      onClick={onClose}
    >
      {/* Top Floating Gesture Bar */}
      <div
        className="w-full max-w-6xl mb-3 flex items-center justify-between text-xs text-white/90 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 backdrop-blur-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-700 font-bold transition"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        <div className="hidden sm:flex items-center gap-3 text-slate-300 font-medium">
          <span className="flex items-center gap-1 text-purple-300">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Swipe Left or Up for Next Photo/Video</span>
          </span>
          <span className="text-slate-600 font-bold">•</span>
          <span>{currentIndex + 1} of {allPins.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={navigatePrev}
            disabled={!hasPrev}
            className={`p-1.5 rounded-full border border-slate-700 transition ${
              hasPrev ? 'bg-slate-800 hover:bg-purple-600 text-white' : 'opacity-40 cursor-not-allowed text-slate-500'
            }`}
            title="Previous (Swipe Right / Down)"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={navigateNext}
            disabled={!hasNext}
            className={`p-1.5 rounded-full border border-slate-700 transition ${
              hasNext ? 'bg-slate-800 hover:bg-purple-600 text-white' : 'opacity-40 cursor-not-allowed text-slate-500'
            }`}
            title="Next (Swipe Left / Up)"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-red-600 text-white transition ml-1"
            title="Close"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Pinterest-Style Pin Canvas Container */}
      <div
        className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ================= TOP PIN NAVBAR ================= */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white z-20">
          {/* Left Actions: Back Arrow */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition"
              title="Return to feed"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-black uppercase tracking-wider text-purple-700 block">
                {pin.categoryLabel || 'SOVEREIGN TRIBUT'}
              </span>
              <span className="text-[11px] text-slate-600 font-semibold">
                Board: <strong>{pin.boardName}</strong>
              </span>
            </div>
          </div>

          {/* Right Header Controls (Exactly matching screenshot) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Like Counter Button */}
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition border ${
                isLiked
                  ? 'bg-rose-50 border-rose-400 text-rose-950'
                  : 'bg-white border-rose-400 text-rose-950 hover:bg-slate-50'
              }font-black`}
              title="Like this design"
            >
              <span className="text-base leading-none">{isLiked ? '❤️' : '🤍'}</span>
              <span>{likeCount}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-2 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-800 transition"
              title="Discuss & Comments"
            >
              <ChatBubbleIcon className="w-5 h-5 text-slate-700" />
            </button>

            {/* Share to Earn Button */}
            <button
              onClick={(e) => onSharePin(pin, e)}
              className="p-2 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-800 transition"
              title="Share & Earn Buy Commission"
            >
              <ShareIcon className="w-5 h-5 text-slate-700" />
            </button>

            {/* Options Dropdown (...) */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-800 transition"
                title="More Options"
              >
                <DotsHorizontalIcon className="w-5 h-5 text-slate-700" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-300 shadow-xl py-2 z-30 text-xs">
                  <button
                    onClick={() => {
                      onOpenDownloadModal(pin);
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 text-purple-700" />
                    Download High-Res / Spec
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText?.(window.location.href);
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <ShareIcon className="w-4 h-4 text-slate-600" />
                    Copy Design Link
                  </button>
                  <button
                    onClick={() => {
                      if (pin.promptRecipe) {
                        navigator.clipboard?.writeText?.(pin.promptRecipe);
                      }
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <SparklesIcon className="w-4 h-4 text-emerald-600" />
                    Copy AI Prompt Recipe
                  </button>
                </div>
              )}
            </div>

            {/* Profile / Board Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowBoardDropdown(!showBoardDropdown)}
                className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-bold text-slate-950 bg-slate-100 hover:bg-slate-200 transition border border-slate-400 font-black"
              >
                <span className="truncate max-w-[90px]">{selectedBoardName}</span>
                <ChevronDownIcon className="w-3.5 h-3.5 text-slate-600" />
              </button>

              {showBoardDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-300 shadow-xl p-2 z-30 text-xs space-y-1">
                  <div className="text-[10px] font-black uppercase text-slate-700 px-3 py-1">Save to Board:</div>
                  {userBoards.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setSelectedBoardName(b.name);
                        setShowBoardDropdown(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left font-bold text-slate-800 hover:bg-purple-50 hover:text-purple-950 flex items-center justify-between"
                    >
                      <span className="truncate">{b.name}</span>
                      <span className="text-[10px] text-slate-700 font-medium">{b.pinCount} pins</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vibrant Red "Save" Button */}
            <button
              onClick={(e) => onToggleSavePin(pin, e)}
              className={`px-5 py-2 rounded-full font-black text-xs transition shadow-md ${
                isSaved
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
              }`}
            >
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* ================= MAIN CONTENT SPLIT (Left Media, Middle Details/Comments, Right/Bottom Related) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 min-h-[550px]">
          {/* ================= LEFT COLUMN: HERO MEDIA PREVIEW (lg:col-span-6) ================= */}
          <div className="lg:col-span-6 bg-slate-950 relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
            {/* Visual media container with aspect ratio handling */}
            <div className="relative max-h-[680px] w-full flex items-center justify-center">
              {pin.videoUrl ? (
                <video
                  src={pin.videoUrl}
                  controls
                  autoPlay
                  loop
                  className="max-h-[640px] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
                />
              ) : (
                <img
                  src={activeMediaUrl}
                  alt={pin.altText || pin.title}
                  className={`max-h-[640px] w-auto max-w-full rounded-2xl object-contain shadow-2xl transition-all duration-300 ${
                    isFullscreen ? 'scale-110' : ''
                  }`}
                />
              )}

              {/* Bottom Right Floating Media Controls */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                {/* Visual Search / Lens button */}
                <button
                  onClick={() => alert(`Guardian AI Visual Lens searching for similar aesthetics to: ${pin.title}`)}
                  className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-700/80 shadow-lg transition"
                  title="Visual Lens Search"
                >
                  <SearchIcon className="w-4 h-4 text-white" />
                </button>

                {/* Fullscreen Expand button */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-700/80 shadow-lg transition"
                  title="Toggle Zoom / Fullscreen"
                >
                  <ArrowsPointingOutIcon className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Left & Right floating carousel arrows if multi-image */}
              {mediaList.length > 1 && (
                <>
                  <button type="button" aria-label="Previous"
                    onClick={() => setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-sm border border-slate-700 transition"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <button type="button" aria-label="Next"
                    onClick={() => setActiveMediaIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-sm border border-slate-700 transition"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-4 left-4 flex gap-1.5">
                    {mediaList.map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === activeMediaIndex ? 'bg-white w-5' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Swipe Navigation Hints Bar at Bottom of Media */}
            <div className="w-full mt-3 flex items-center justify-between text-[11px] text-slate-300 font-semibold px-2">
              <span className="flex items-center gap-1 text-slate-300">
                <span>← Previous</span>
              </span>
              <span className="text-purple-300 font-bold animate-pulse">
                Swipe Left or Up for Next Design
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <span>Next →</span>
              </span>
            </div>
          </div>

          {/* ================= MIDDLE/RIGHT COLUMN: CREATOR INFO, DETAILS, COMMENTS (lg:col-span-6) ================= */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-white overflow-y-auto max-h-[720px] space-y-6">
            <div className="space-y-6">
              {/* Creator Profile Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={pin.author.avatar}
                    alt={pin.author.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 shadow-sm"
                  />
                  <div>
                    <h3 className="text-sm font-black text-slate-900 leading-tight">
                      {pin.author.name}
                    </h3>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-xs font-bold text-slate-700">{pin.author.handle}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-bold border border-emerald-400  font-black">
                        {pin.author.domainReputation}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Followed ${pin.author.name} on FingerMobile Tribut`)}
                  className="py-1.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-950 font-bold text-xs transition border border-slate-400 font-black"
                >
                  Follow
                </button>
              </div>

              {/* Title & Description (Matching "Flyyy Silver Fox! / Nice shape up") */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {pin.title}
                </h1>

                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">Description</span>
                  <p className="text-sm text-slate-800 leading-relaxed font-normal">
                    {pin.description}
                  </p>
                </div>

                {pin.promptRecipe && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 mt-2">
                    <div className="flex items-center justify-between text-[11px] font-black text-purple-950 uppercase">
                      <span className="flex items-center gap-1.5">
                        <SparklesIcon className="w-3.5 h-3.5 text-purple-700" />
                        Prompt Recipe / AI Lighting
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText?.(pin.promptRecipe || '');
                          alert('Prompt copied!');
                        }}
                        className="text-purple-700 hover:underline"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      "{pin.promptRecipe}"
                    </p>
                  </div>
                )}
              </div>

              {/* Shoppable Product Card if present */}
              {pin.shopping?.isShoppable && (
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-black uppercase tracking-wider text-purple-950">
                      {pin.shopping.storeEngine} Verified Commercial Sync
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 text-[10px] font-bold border border-emerald-400">
                      In Stock
                    </span>
                  </div>

                  <div className="text-sm font-black text-slate-900">
                    {pin.shopping.productName}
                  </div>

                  <div className="flex justify-between items-baseline pt-1">
                    <div className="space-x-2">
                      <span className="text-lg font-black text-slate-900">
                        ₦{pin.shopping.priceNgn.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-indigo-700">
                        {pin.shopping.priceFic} FIC
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-purple-900">
                      Buy & Share Earn: {pin.shopping.buyAndShareCommissionPercent}%
                    </span>
                  </div>

                  <button
                    onClick={() => onCheckoutPin(pin)}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBagIcon className="w-4 h-4" />
                    Instant Checkout via {pin.shopping.storeEngine}
                  </button>
                </div>
              )}

              {/* Guardian AI Algorithmic Score & UGC Curation Origin Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs font-black text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <ShieldIcon className="w-4 h-4 text-emerald-600" />
                    <span>Guardian AI Curation Rank:</span>
                    {pin.guardianAiRank && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black">
                        #{pin.guardianAiRank} Overall
                      </span>
                    )}
                  </div>
                  <strong className="text-purple-700 text-sm font-black">
                    {pin.pillars.overallGuardianScore} / 100
                  </strong>
                </div>

                {pin.ugcSource && (
                  <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200 text-[11px] text-purple-950 flex items-center justify-between font-semibold">
                    <span>
                      Curated from: <strong>{pin.ugcSource.platformOrigin}</strong>
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded font-black border border-emerald-300">
                      Viral Decay Immunity Active
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <div>Domain Quality: <strong className="text-slate-900">{pin.pillars.domainQualityScore}%</strong></div>
                  <div>Pin Usage Saves: <strong className="text-slate-900">{pin.metrics.saves.toLocaleString()}</strong></div>
                  <div>Prioritized Downloads: <strong className="text-slate-900">{(pin.metrics.downloads || 420).toLocaleString()}</strong></div>
                  <div>SEO Relevance: <strong className="text-slate-900">{pin.pillars.topicRelevanceSeoScore}%</strong></div>
                  <div>Outbound Clicks: <strong className="text-slate-900">{pin.metrics.outboundClicks.toLocaleString()}</strong></div>
                  <div>Evergreen Shelf-Life: <strong className="text-slate-900">{pin.metrics.shelfLifeDays} days retention</strong></div>
                </div>
              </div>

              {/* ================= EXPANDABLE COMMENTS & DESIGN DISCUSSIONS SECTION ================= */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="w-full flex items-center justify-between text-left py-1 text-slate-900 hover:text-purple-700 transition"
                >
                  <span className="text-base font-black text-slate-900">
                    {pin.comments?.length || 14} Comments & Design Notes
                  </span>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-slate-600 transition-transform duration-200 ${
                      showComments ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showComments && (
                  <div className="space-y-3 pt-1">
                    {/* Comments List */}
                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                      {pin.comments && pin.comments.length > 0 ? (
                        pin.comments.map((comm) => (
                          <div key={comm.id} className="flex items-start gap-2.5 text-xs">
                            <img
                              src={comm.authorAvatar}
                              alt={comm.authorName}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-slate-200"
                            />
                            <div className="flex-1 bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900">{comm.authorName}</span>
                                <span className="text-[10px] text-slate-700 font-medium">{comm.createdAt}</span>
                              </div>
                              <p className="text-slate-800 text-xs leading-relaxed font-normal">
                                {comm.content}
                              </p>
                              {comm.critiqueTag && (
                                <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-950 border border-purple-200">
                                  {comm.critiqueTag}
                                </span>
                              )}
                              <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-slate-600">
                                <button
                                  type="button"
                                  aria-label={`Reply to ${comm.authorName || 'this comment'}`}
                                  onClick={() => setCommentText(`@${comm.authorName} `)}
                                  className="hover:text-purple-700 transition-colors"
                                >Reply</button>
                                <span>•</span>
                                <button
                                  type="button"
                                  aria-label={`Like this comment (${comm.likes} likes)`}
                                  onClick={() => setLikedCommentIds((prev) => prev.includes(comm.id) ? prev.filter(x => x !== comm.id) : [...prev, comm.id])}
                                  className="hover:text-rose-600 transition-colors"
                                >❤️ {comm.likes + (likedCommentIds.includes(comm.id) ? 1 : 0)}</button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-slate-600 py-2">
                          No design notes yet. Be the first to discuss this pin!
                        </div>
                      )}
                    </div>

                    {/* Add a Comment Input (Matching the Screenshot's footer with Emoji, GIF, and Media) */}
                    <form onSubmit={handleCommentSubmit} className="pt-2">
                      <div className="relative flex items-center bg-slate-50 rounded-full border border-slate-400 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-purple-200 p-1 text-slate-950 font-black">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add a comment or design critique..."
                          className="flex-1 pl-4 pr-24 py-2 bg-white text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500"
                        />

                        {/* Input Accessories */}
                        <div className="flex items-center gap-1.5 pr-2">
                          <button
                            type="button"
                            onClick={() => setActiveEmojiPicker(!activeEmojiPicker)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-200 transition"
                            title="Insert Emoji"
                          >
                            <EmojiHappyIcon className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCommentText((prev) => prev + ' [Design Spec Review] ')}
                            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-200 transition text-[10px] font-black"
                            title="Add Critique Tag"
                          >
                            GIF
                          </button>
                          <button
                            type="button"
                            onClick={() => alert('Attach design asset screenshot')}
                            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-200 transition"
                            title="Attach Photo"
                          >
                            <PhotoIcon className="w-4 h-4" />
                          </button>

                          <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                              commentText.trim()
                                ? 'bg-purple-600 hover:bg-purple-500 text-white'
                                : 'bg-slate-200 text-slate-500 font-bold cursor-not-allowed'
                            }`}
                          >
                            Post
                          </button>
                        </div>
                      </div>

                      {/* Quick Emoji Bar */}
                      {activeEmojiPicker && (
                        <div className="flex gap-2 p-2 mt-2 bg-white rounded-xl border border-slate-200 shadow-sm text-base">
                          {['🔥', '✨', '👏', '💈', '💯', '🎨', '👌'].map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setCommentText((prev) => prev + emoji);
                                setActiveEmojiPicker(false);
                              }}
                              className="p-1 hover:scale-125 transition"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions: Download Asset Package */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-2">
              <button
                onClick={() => onOpenDownloadModal(pin)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
              >
                <ArrowDownTrayIcon className="w-4 h-4 text-purple-300" />
                Download Design Asset Pack (4K + Spec)
              </button>

              <button
                onClick={(e) => onSharePin(pin, e)}
                className="py-2.5 px-4 rounded-xl border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold text-xs transition flex items-center gap-1.5"
              >
                <ShareIcon className="w-4 h-4 text-purple-700" />
                Buy & Share ({pin.shopping ? `${pin.shopping.buyAndShareCommissionPercent}%` : '5%'})
              </button>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM SECTION: "MORE IN THIS PALETTE / SKIN TONE RANGE" & RELATED PINS ================= */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-200 space-y-6">
          {/* Palette Swatches Bar (Mirrors the screenshot's "More in your skin tone range") */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SwatchIcon className="w-4 h-4 text-purple-700" />
                <h4 className="text-sm font-black text-slate-900">
                  More in your skin tone range & color palette
                </h4>
              </div>
              <span className="text-xs text-slate-600 font-semibold">
                Click a swatch to filter matching pins
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {paletteSwatches.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColorSwatch(selectedColorSwatch === color ? null : color)}
                  className={`w-16 h-8 rounded-lg shadow-sm border transition-all transform hover:scale-105 flex items-center justify-center ${
                    selectedColorSwatch === color
                      ? 'ring-2 ring-purple-600 ring-offset-2 scale-105 border-white'
                      : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Color: ${color}`}
                >
                  <span className="text-[10px] font-bold text-slate-700 drop-shadow-md">
                    {color}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Related Tribut Pins (Clean visual cards as requested) */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900">
              Related Pins from "{pin.boardName}" & Similar Aesthetics
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {relatedPins.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectPin(rel)}
                  className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200"
                >
                  <img
                    src={rel.mediaUrl}
                    alt={rel.altText || rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {/* Clean by default: information only shown when clicked, subtle hover preview */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                    <span className="text-xs font-black text-white line-clamp-1">{rel.title}</span>
                    <span className="text-[10px] text-slate-300">{rel.author.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TributPinDetailModal;
