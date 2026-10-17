import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import {
  SparklesIcon,
  BookmarkIcon,
  ShoppingBagIcon,
  EyeIcon,
  PlusIcon,
  XMarkIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  ChatBubbleIcon,
  ArrowDownTrayIcon,
  SwatchIcon,
  GridIcon
} from '../icons';
import { Trash2, Layers, UploadCloud } from 'lucide-react';

import {
  TRIBUT_PINS_DATA,
  TributPinItem,
  USER_PROJECT_BOARDS,
  UserProjectBoard,
  TRIBUT_ECOSYSTEM_STATS,
  TRIBUT_DISPLAY_STYLES,
  TributDisplayStyle,
  PinCommentItem
} from '../data/tributData';

import TributPinDetailModal from '../components/tribut/TributPinDetailModal';
import TributDisplayStyleRenderer from '../components/tribut/TributDisplayStyleRenderer';
import MemberTributProjectsModal from '../components/tribut/MemberTributProjectsModal';
import TributCreatorUploadModal from '../components/tribut/TributCreatorUploadModal';
import TributDownloadModal from '../components/tribut/TributDownloadModal';
import TributDiscussionsTab from '../components/tribut/TributDiscussionsTab';

type TributViewTab = 'smart-feed' | 'search-feed' | 'my-boards' | 'discussions' | 'monetization';

export const TributPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();

  // Navigation State
  const [activeTab, setActiveTab] = useState<TributViewTab>('smart-feed');

  // Pins & Board State
  const [pinsList, setPinsList] = useState<TributPinItem[]>(TRIBUT_PINS_DATA);
  const [userBoards, setUserBoards] = useState<UserProjectBoard[]>(USER_PROJECT_BOARDS);
  const [savedPinIds, setSavedPinIds] = useState<string[]>(['pin-silver-fox', 'pin-diptych-01', 'pin-01', 'pin-02', 'pin-04']);

  // Batch Selection & Deletion State
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBatchDeleting, setIsBatchDeleting] = useState<boolean>(false);

  // ================= 2-HOUR DISPLAY STYLE ROTATION & MEMBER SETTINGS =================
  const get2HourRotationStyle = (): TributDisplayStyle => {
    const twoHoursMs = 2 * 60 * 60 * 1000;
    const index = Math.floor(Date.now() / twoHoursMs) % TRIBUT_DISPLAY_STYLES.length;
    return TRIBUT_DISPLAY_STYLES[index].id;
  };

  const [autoRotateEvery2Hours, setAutoRotateEvery2Hours] = useState<boolean>(() => {
    const saved = localStorage.getItem('fm_tribut_auto_rotate') || localStorage.getItem('fm_gallery_auto_rotate');
    return saved !== null ? saved === 'true' : true;
  });

  const [displayStyle, setDisplayStyle] = useState<TributDisplayStyle>(() => {
    const saved = localStorage.getItem('fm_tribut_display_style') || localStorage.getItem('fm_gallery_display_style');
    if (saved) return saved as TributDisplayStyle;
    return get2HourRotationStyle();
  });

  const [showStyleMenu, setShowStyleMenu] = useState<boolean>(false);

  // Time remaining until next 2-hour rotation
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const updateTimeRemaining = () => {
      const twoHoursMs = 2 * 60 * 60 * 1000;
      const msIntoCurrentWindow = Date.now() % twoHoursMs;
      const msRemaining = twoHoursMs - msIntoCurrentWindow;
      const hours = Math.floor(msRemaining / (60 * 60 * 1000));
      const minutes = Math.floor((msRemaining % (60 * 60 * 1000)) / (60 * 1000));
      setTimeRemaining(`${hours}h ${minutes}m`);
    };

    updateTimeRemaining();
    const timer = setInterval(updateTimeRemaining, 30000);
    return () => clearInterval(timer);
  }, []);

  // Update display style automatically if auto-rotate is enabled
  useEffect(() => {
    if (!autoRotateEvery2Hours) return;
    const current = get2HourRotationStyle();
    setDisplayStyle(current);

    const interval = setInterval(() => {
      setDisplayStyle(get2HourRotationStyle());
    }, 60000);

    return () => clearInterval(interval);
  }, [autoRotateEvery2Hours]);

  const handleSelectDisplayStyle = (styleId: TributDisplayStyle) => {
    setDisplayStyle(styleId);
    setAutoRotateEvery2Hours(false);
    localStorage.setItem('fm_tribut_display_style', styleId);
    localStorage.setItem('fm_tribut_auto_rotate', 'false');
    setShowStyleMenu(false);
    const chosen = TRIBUT_DISPLAY_STYLES.find((s) => s.id === styleId);
    showToast(`Display style locked to: ${chosen?.label || styleId}`, 'info');
  };

  const handleToggleAutoRotate = () => {
    const nextVal = !autoRotateEvery2Hours;
    setAutoRotateEvery2Hours(nextVal);
    localStorage.setItem('fm_tribut_auto_rotate', String(nextVal));
    if (nextVal) {
      const current = get2HourRotationStyle();
      setDisplayStyle(current);
      showToast('Auto-rotation every 2 hours enabled!', 'success');
    } else {
      showToast('Auto-rotation paused. Manual display mode locked.', 'info');
    }
  };

  // Batch Selection Handlers
  const handleToggleSelect = (id: string, e?: React.MouseEvent) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredPins.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPins.map((p) => p.id));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} selected item(s) from Tribut? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    setIsBatchDeleting(true);
    try {
      const res = await fetch('/api/tribut/pins/batch', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });

      if (res.ok) {
        showToast(`Successfully deleted ${selectedIds.length} item(s) from Tribut`, 'success');
      } else {
        showToast('Items marked as deleted in local session', 'info');
      }
    } catch (err) {
      showToast('Items deleted locally (network notice)', 'info');
    } finally {
      setPinsList((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
      setIsSelectMode(false);
      setIsBatchDeleting(false);
    }
  };

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyShoppable, setOnlyShoppable] = useState<boolean>(false);
  const [onlyPromoted, setOnlyPromoted] = useState<boolean>(false);
  const [selectedStoreEngine, setSelectedStoreEngine] = useState<string>('all');

  // ================= GUARDIAN AI UGC SORTING & CURATION (Line 5 of Business Model) =================
  type UgcSortOrder = 'composite' | 'saves-downloads' | 'shelf-life' | 'quality' | 'commercial' | 'recent';
  const [ugcSortOrder, setUgcSortOrder] = useState<UgcSortOrder>('composite');
  const [ugcSourceFilter, setUgcSourceFilter] = useState<string>('all');

  // Modals & Drawers
  const [activePinDetail, setActivePinDetail] = useState<TributPinItem | null>(null);
  const [selectedMember, setSelectedMember] = useState<TributPinItem['author'] | null>(null);
  const [showPillarsModal, setShowPillarsModal] = useState<boolean>(false);
  const [showUploadPinModal, setShowUploadPinModal] = useState<boolean>(false);
  const [showSaveToBoardModal, setShowSaveToBoardModal] = useState<TributPinItem | null>(null);
  const [selectedBoardIdToSave, setSelectedBoardIdToSave] = useState<string>('brd-01');
  const [downloadTargetPin, setDownloadTargetPin] = useState<TributPinItem | null>(null);
  const [downloadTargetBoard, setDownloadTargetBoard] = useState<UserProjectBoard | null>(null);

  // Close modals on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePinDetail(null);
        setSelectedMember(null);
        setShowPillarsModal(false);
        setShowSaveToBoardModal(null);
        setShowUploadPinModal(false);
        setDownloadTargetPin(null);
        setDownloadTargetBoard(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories = [
    { id: 'all', label: 'All Smart Feeds' },
    { id: 'fashion', label: 'Fashion & Styling' },
    { id: 'architecture', label: 'Architecture & Living' },
    { id: 'tech', label: 'Tech & Sovereign Gear' },
    { id: 'art', label: 'Afrofuturist Art' },
    { id: 'culinary', label: 'Culinary & Nutrition' },
    { id: 'wellness', label: 'Wellness Apothecary' }
  ];

  // Filtering & Sorting Logic based on Guardian AI 5 Measures
  const filteredPins = pinsList
    .filter((pin) => {
      const matchesCategory = selectedCategory === 'all' || pin.category === selectedCategory;
      const matchesSearch =
        pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        pin.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesShoppable = !onlyShoppable || (pin.shopping && pin.shopping.isShoppable);
      const matchesPromoted = !onlyPromoted || (pin.promoted && pin.promoted.isPromoted);
      const matchesStore =
        selectedStoreEngine === 'all' ||
        (pin.shopping && pin.shopping.storeEngine === selectedStoreEngine);
      const matchesSource =
        ugcSourceFilter === 'all' ||
        (pin.ugcSource && pin.ugcSource.platformOrigin === ugcSourceFilter);

      return matchesCategory && matchesSearch && matchesShoppable && matchesPromoted && matchesStore && matchesSource;
    })
    .sort((a, b) => {
      if (ugcSortOrder === 'composite') {
        return (b.pillars.overallGuardianScore || 0) - (a.pillars.overallGuardianScore || 0);
      }
      if (ugcSortOrder === 'saves-downloads') {
        const aUsage = (a.metrics.saves || 0) + (a.metrics.downloads || 0);
        const bUsage = (b.metrics.saves || 0) + (b.metrics.downloads || 0);
        return bUsage - aUsage;
      }
      if (ugcSortOrder === 'shelf-life') {
        return (b.metrics.shelfLifeDays || 0) - (a.metrics.shelfLifeDays || 0);
      }
      if (ugcSortOrder === 'quality') {
        return (b.pillars.domainQualityScore || 0) - (a.pillars.domainQualityScore || 0);
      }
      if (ugcSortOrder === 'commercial') {
        return (b.metrics.outboundClicks || 0) - (a.metrics.outboundClicks || 0);
      }
      if (ugcSortOrder === 'recent') {
        return (b.metrics.likes || 0) - (a.metrics.likes || 0);
      }
      return 0;
    });

  // Handle Save (Pin Use)
  const handleToggleSavePin = (pin: TributPinItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isSaved = savedPinIds.includes(pin.id);

    if (isSaved) {
      setSavedPinIds(savedPinIds.filter((id) => id !== pin.id));
      setPinsList((prev) =>
        prev.map((p) => (p.id === pin.id ? { ...p, metrics: { ...p.metrics, saves: p.metrics.saves - 1 } } : p))
      );
      showToast(`Removed "${pin.title}" from saved ideas.`, 'info');
    } else {
      setShowSaveToBoardModal(pin);
    }
  };

  const confirmSaveToBoard = () => {
    if (!showSaveToBoardModal) return;
    const pin = showSaveToBoardModal;
    setSavedPinIds([...savedPinIds, pin.id]);
    setPinsList((prev) =>
      prev.map((p) => (p.id === pin.id ? { ...p, metrics: { ...p.metrics, saves: p.metrics.saves + 1 } } : p))
    );
    setUserBoards((prev) =>
      prev.map((b) => (b.id === selectedBoardIdToSave ? { ...b, pinCount: b.pinCount + 1 } : b))
    );
    setShowSaveToBoardModal(null);
    showToast('Saved to project board! Long shelf-life engagement signal recorded.', 'success');
  };

  // Handle Share to Earn
  const handleShareToEarn = (pin: TributPinItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareLink = `http://localhost:3000/tribut?pin=${pin.id}&ref=FM-MEMBER-0842`;
    navigator.clipboard?.writeText?.(shareLink);
    const comm = pin.shopping ? `${pin.shopping.buyAndShareCommissionPercent}%` : '5%';
    showToast(
      `Buy & Share link copied! You will earn ${comm} commission on every purchase made via your pin link.`,
      'success'
    );
  };

  // Handle Outbound Checkout
  const handleOutboundCheckout = (pin: TributPinItem) => {
    if (!pin.shopping) return;
    showToast(
      `Initiating instant checkout via ${pin.shopping.storeEngine} gateway for "${pin.shopping.productName}".`,
      'info'
    );
  };

  // Member Click Trigger (example: click on a member to see the member's Tribut and Projects)
  const handleMemberClick = (author: TributPinItem['author'], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedMember(author);
  };

  // Add Comment on Pin
  const handleAddComment = (pinId: string, comment: PinCommentItem) => {
    setPinsList((prev) =>
      prev.map((p) =>
        p.id === pinId
          ? {
            ...p,
            comments: [comment, ...(p.comments || [])],
            commentsCount: (p.commentsCount || 0) + 1
          }
          : p
      )
    );
    if (activePinDetail && activePinDetail.id === pinId) {
      setActivePinDetail((prev) =>
        prev
          ? {
            ...prev,
            comments: [comment, ...(prev.comments || [])],
            commentsCount: (prev.commentsCount || 0) + 1
          }
          : null
      );
    }
    showToast('Design critique note posted successfully!', 'success');
  };

  // Publish Pin handler
  const handlePublishCreatedPin = (newPin: TributPinItem) => {
    setPinsList([newPin, ...pinsList]);
    setShowUploadPinModal(false);
    showToast('Design Pin published! Guardian AI vision indexing complete.', 'success');
  };

  const currentStyleMeta = TRIBUT_DISPLAY_STYLES.find((s) => s.id === displayStyle) || TRIBUT_DISPLAY_STYLES[0];

  return (
    <MainLayout pageTitle="Tribut">
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* ==================== 1. GUARDIAN AI MISSION HERO BANNER ==================== */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white shadow-2xl border border-slate-800 p-8 sm:p-10">
            <div className="absolute -right-24 -top-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
                  <SparklesIcon className="w-4 h-4 text-purple-300" />
                  Guardian AI Curation Engine • 5 Algorithmic Pillars • Buy & Share System
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  FingerMobile <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300">Sovereign Tribut</span> & Smart Feed
                </h1>

                <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
                  Where digital inspiration meets commercial transactions. The <strong className="text-white font-bold">Guardian AI</strong> curates the highest-ranking user-generated content, organizing media into multi-style collage displays, collaborative design critique discussions, and shoppable product cards.
                </p>

                {/* Algorithmic Pillars & Creator Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowPillarsModal(true)}
                    className="px-4 py-2 rounded-xl bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/60 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
                  >
                    <InformationCircleIcon className="w-4 h-4 text-purple-300" />
                    How Guardian AI Ranks (5 Core Pillars)
                  </button>

                  <button
                    onClick={() => setShowUploadPinModal(true)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-purple-600/30"
                  >
                    <UploadCloud className="w-4 h-4" />
                    Upload Media from Device
                  </button>

                  <button
                    onClick={() => {
                      setIsSelectMode(!isSelectMode);
                      if (isSelectMode) setSelectedIds([]);
                    }}
                    className={`px-4 py-2 rounded-xl border text-xs font-black transition flex items-center gap-1.5 shadow-sm ${
                      isSelectMode
                        ? 'bg-amber-400 border-amber-500 text-slate-950 font-black ring-2 ring-amber-300'
                        : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-600 text-white'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-amber-300" />
                    {isSelectMode ? 'Exit Batch Mode' : 'Batch Select & Multi-Delete'}
                  </button>

                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Shopping Engine Synced (MarketPlace, Storefront, OwnIt, Flamingo)</span>
                  </div>
                </div>
              </div>

              {/* Ecosystem KPI Card */}
              <div className="w-full lg:w-80 flex-shrink-0 bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-xl space-y-4">
                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-300">
                  <span>Commercial Conversion</span>
                  <span className="text-emerald-400 font-bold">4.8% Purchase Intent</span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-300 font-medium">Member Buy & Share Rewards Paid</div>
                  <div className="text-2xl font-black text-white">₦48,500,000</div>
                  <div className="text-[11px] text-purple-300 font-semibold">Shared with active pin curators</div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-700/80">
                  <div>
                    <span className="block text-slate-300 font-medium">Indexed Pins</span>
                    <strong className="text-white text-sm font-bold">{TRIBUT_ECOSYSTEM_STATS.guardianVisionIndexCount}</strong>
                  </div>
                  <div>
                    <span className="block text-slate-300 font-medium">FIC Wallet</span>
                    <strong className="text-indigo-400 text-sm font-bold">{ficBalance} FIC</strong>
                  </div>
                </div>

                <button
                  onClick={() => setShowUploadPinModal(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload Media from Device
                </button>
              </div>
            </div>
          </div>

          {/* ==================== 2. DISPLAY STYLE & 2-HOUR ROTATION TOOLBAR ==================== */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-950">
                <GridIcon className="w-5 h-5 text-purple-800" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-purple-700 tracking-wider">
                    Tribut Display Mode:
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {currentStyleMeta.label}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-950 font-bold border border-purple-400 border-purple-400 font-black">
                    {currentStyleMeta.layoutCount}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-normal">
                  {currentStyleMeta.description}
                </p>
              </div>
            </div>

            {/* Rotation Countdown & Manual Override Selector */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className={`w-2 h-2 rounded-full ${autoRotateEvery2Hours ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                <span>
                  {autoRotateEvery2Hours ? `Auto-rotates in: ${timeRemaining}` : 'Manual Style Locked'}
                </span>
                <button
                  onClick={handleToggleAutoRotate}
                  className="ml-1 text-[11px] font-bold text-purple-700 hover:underline"
                >
                  {autoRotateEvery2Hours ? '(Pause)' : '(Auto)'}
                </button>
              </div>

              {/* Style Dropdown Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowStyleMenu(!showStyleMenu)}
                  className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
                >
                  <SwatchIcon className="w-4 h-4 text-purple-300" />
                  <span>Change Display Style (11 Modes)</span>
                  <span>▾</span>
                </button>

                {showStyleMenu && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-300 shadow-2xl p-3 z-30 max-h-96 overflow-y-auto space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                      <span className="font-black text-slate-900">Choose Display Style</span>
                      <button
                        onClick={handleToggleAutoRotate}
                        className={`text-[10px] font-black px-2 py-0.5 rounded ${
                          autoRotateEvery2Hours
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {autoRotateEvery2Hours ? '✓ 2-Hr Auto-Rotate Active' : 'Enable 2-Hr Auto-Rotate'}
                      </button>
                    </div>

                    {TRIBUT_DISPLAY_STYLES.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => handleSelectDisplayStyle(st.id)}
                        className={`w-full text-left p-2.5 rounded-xl transition flex flex-col gap-0.5 ${
                          displayStyle === st.id
                            ? 'bg-purple-50 text-purple-950 font-bold border border-purple-300'
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{st.label}</span>
                          <span className="text-[10px] text-slate-500">{st.layoutCount}</span>
                        </div>
                        <span className="text-[11px] text-slate-600 line-clamp-1">{st.description}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ==================== 3. PRIMARY VIEW SWITCHER TABS ==================== */}
          <div className="border-b border-slate-200 bg-white rounded-2xl shadow-sm p-2 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('smart-feed')}
              className={`flex items-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'smart-feed'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <SparklesIcon className="w-5 h-5" />
              <span>1. The Tribut Smart Feed</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'smart-feed' ? 'bg-purple-700 text-white' : 'bg-slate-200 text-slate-800'}`}>
                {filteredPins.length} Pins
              </span>
            </button>

            <button
              onClick={() => setActiveTab('search-feed')}
              className={`flex items-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'search-feed'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              <span>2. Personalized Search Feed (Sidebar)</span>
            </button>

            <button
              onClick={() => setActiveTab('my-boards')}
              className={`flex items-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'my-boards'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookmarkIcon className="w-5 h-5" />
              <span>3. Project Planning Boards</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'my-boards' ? 'bg-purple-700 text-white' : 'bg-slate-200 text-slate-800'}`}>
                {userBoards.length} Boards
              </span>
            </button>

            <button
              onClick={() => setActiveTab('discussions')}
              className={`flex items-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'discussions'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ChatBubbleIcon className="w-5 h-5" />
              <span>4. Design Discussions & Critiques</span>
            </button>

            <button
              onClick={() => setActiveTab('monetization')}
              className={`flex items-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'monetization'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShoppingBagIcon className="w-5 h-5" />
              <span>5. Buy & Share Profit Earning System</span>
            </button>
          </div>

          {/* ==================== TAB 1: SMART FEED (Photos/Videos cards clean by default) ==================== */}
          {(activeTab === 'smart-feed' || activeTab === 'search-feed') && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* SIDEBAR: Personalized Search Feed & Filter Engine */}
              <div className={`space-y-6 ${activeTab === 'search-feed' ? 'lg:col-span-4' : 'lg:col-span-1'}`}>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6">
                  {/* Search Query Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                      Guardian AI Search Engine
                    </label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search pins, creators, prompts, tags..."
                        className="w-full pl-9 pr-3 py-2 text-xs text-slate-900 font-bold border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Commercial Filters */}
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                      Commercial Shopping Filters
                    </span>

                    <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onlyShoppable}
                        onChange={(e) => setOnlyShoppable(e.target.checked)}
                        className="w-4 h-4 text-slate-900 rounded focus:ring-purple-500 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                      />
                      <span>Shoppable Pins Only (Live Checkout)</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onlyPromoted}
                        onChange={(e) => setOnlyPromoted(e.target.checked)}
                        className="w-4 h-4 text-slate-900 rounded focus:ring-purple-500 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                      />
                      <span>Promoted Canary Ads Only</span>
                    </label>
                  </div>

                  {/* Store Engine Dropdown */}
                  <div className="space-y-2 pt-3 border-t border-slate-200">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                      Storefront Engine
                    </label>
                    <select
                      value={selectedStoreEngine}
                      onChange={(e) => setSelectedStoreEngine(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All E-Commerce Gateways</option>
                      <option value="MarketPlace">MarketPlace</option>
                      <option value="Storefront">Storefront</option>
                      <option value="OwnIt">OwnIt</option>
                      <option value="Flamingo">Flamingo</option>
                      <option value="ShopifyPartner">Shopify Partner</option>
                    </select>
                  </div>

                  {/* Buy and Share Widget */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-purple-950">
                      <ShoppingBagIcon className="w-4 h-4 text-purple-700" />
                      <span>Buy & Share Profit System</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-snug">
                      Earn up to <strong>15% commission</strong> when other members purchase items through your shared board pins.
                    </p>
                  </div>
                </div>

                {/* Quick Project Boards in Sidebar */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Your Project Boards
                    </span>
                    <button
                      onClick={() => setActiveTab('my-boards')}
                      className="text-[11px] font-bold text-purple-700 hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-2">
                    {userBoards.slice(0, 3).map((brd) => (
                      <div
                        key={brd.id}
                        onClick={() => {
                          setActiveTab('my-boards');
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200 cursor-pointer"
                      >
                        <img
                          src={brd.coverImage}
                          alt={brd.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{brd.name}</h4>
                          <span className="text-[11px] text-slate-500 font-semibold">{brd.pinCount} saved pins</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MAIN CONTENT: Smart Feed Rendered with active Display Style */}
              <div className={`${activeTab === 'search-feed' ? 'hidden' : 'lg:col-span-3'} space-y-6`}>
                {/* ================= GUARDIAN AI UGC CURATION & MULTI-MEASURE SORTING BAR ================= */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/90 via-slate-900 to-indigo-950 text-white shadow-md border border-purple-700/50 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-wider text-purple-300">
                          The Guardian AI Omnipresent UGC Curation Engine
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed max-w-2xl">
                        Curates the <strong>highest-ranking by all measures of the best UGC</strong> from all over the platform across all members' posts, organizing media into high-intent project feeds with multi-year shelf-life retention.
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-end gap-1 flex-shrink-0 text-right">
                      <span className="text-[11px] font-bold text-purple-200">
                        {TRIBUT_ECOSYSTEM_STATS.guardianVisionIndexCount}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-400/40">
                        Viral Decay Immunity Active
                      </span>
                    </div>
                  </div>

                  {/* Multi-Measure Sorting & Cross-Platform Ingest Filter Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-purple-800/80 items-center text-xs">
                    {/* Sort Order Selector (All Measures) */}
                    <div className="sm:col-span-7 flex items-center gap-2">
                      <span className="font-bold text-slate-700 text-[11px] whitespace-nowrap">
                        Rank Order:
                      </span>
                      <select
                        value={ugcSortOrder}
                        onChange={(e) => setUgcSortOrder(e.target.value as any)}
                        className="w-full py-1.5 px-3 rounded-xl bg-slate-800 text-white font-bold border border-purple-500/60 text-xs focus:ring-2 focus:ring-purple-400"
                      >
                        <option value="composite">⚡ Guardian AI Composite Score (Highest Ranked by All Measures)</option>
                        <option value="saves-downloads">📌 Pin Usage (Most Saves & Prioritized Downloads)</option>
                        <option value="shelf-life">⏳ Longest Shelf-Life (Evergreen Multi-Month Retention)</option>
                        <option value="quality">🏆 Domain Quality & Consistency Streak</option>
                        <option value="commercial">🛍️ Purchase Intent & Outbound Clicks (Buy & Share)</option>
                        <option value="recent">✨ Fresh UGC Ingestion from Member Posts</option>
                      </select>
                    </div>

                    {/* UGC Platform Origin Filter */}
                    <div className="sm:col-span-5 flex items-center gap-2">
                      <span className="font-bold text-slate-700 text-[11px] whitespace-nowrap">
                        Origin:
                      </span>
                      <select
                        value={ugcSourceFilter}
                        onChange={(e) => setUgcSourceFilter(e.target.value)}
                        className="w-full py-1.5 px-3 rounded-xl bg-slate-800 text-white font-bold border border-purple-500/60 text-xs focus:ring-2 focus:ring-purple-400"
                      >
                        <option value="all">All Platform UGC Sources</option>
                        <option value="Member Post">Member Wall Posts</option>
                        <option value="Forum Design Showcase">Forum Design Showcase</option>
                        <option value="MarketPlace Lookbook">MarketPlace Lookbooks</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Category Pills Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        selectedCategory === cat.id
                          ? 'bg-slate-900 text-white shadow'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Clean Cards Display Renderer with multi-select and hardware link */}
                <TributDisplayStyleRenderer
                  style={displayStyle}
                  pins={filteredPins}
                  savedPinIds={savedPinIds}
                  isSelectMode={isSelectMode}
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                  onPinClick={(pin) => setActivePinDetail(pin)}
                  onMemberClick={handleMemberClick}
                  onToggleSavePin={handleToggleSavePin}
                />
              </div>
            </div>
          )}

          {/* ==================== TAB 3: USER PROJECT PLANNING BOARDS & DOWNLOADS ==================== */}
          {activeTab === 'my-boards' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Project Planning Boards & Saves</h2>
                  <p className="text-xs text-slate-700 mt-1">
                    Users use Tribut to plan projects, ideate spaces, and curate shopping lists with long-term retention. Download prioritized project boards with complete prompt recipes and CAD specs.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (userBoards[0]) setDownloadTargetBoard(userBoards[0]);
                    }}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 text-purple-700" />
                    Download Board Bundle
                  </button>

                  <button
                    onClick={() => {
                      const newBoard: UserProjectBoard = {
                        id: `brd-${Date.now()}`,
                        name: `New Project Moodboard #${userBoards.length + 1}`,
                        pinCount: 0,
                        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
                        purpose: 'Project Planning',
                        isPrivate: false
                      };
                      setUserBoards([...userBoards, newBoard]);
                      showToast('New project board created!', 'success');
                    }}
                    className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Create Project Board
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {userBoards.map((board) => (
                  <div
                    key={board.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all group flex flex-col"
                  >
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={board.coverImage}
                        alt={board.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase">
                        {board.purpose}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{board.name}</h3>
                        <span className="text-xs text-slate-600 font-semibold">{board.pinCount} Curated Pins</span>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setActiveTab('smart-feed');
                            showToast(`Filtering feed by board: ${board.name}`, 'info');
                          }}
                          className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-900 text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <EyeIcon className="w-4 h-4 text-slate-600" />
                          Explore Board Pins
                        </button>

                        <button
                          onClick={() => setDownloadTargetBoard(board)}
                          className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-purple-100 text-purple-950 text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <ArrowDownTrayIcon className="w-3.5 h-3.5 text-purple-700" />
                          Download Prioritized Board (.JSON)
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 4: DESIGN DISCUSSIONS & CRITIQUES ==================== */}
          {activeTab === 'discussions' && (
            <TributDiscussionsTab
              allPins={pinsList}
              onSelectPin={(pin) => setActivePinDetail(pin)}
              onMemberClick={handleMemberClick}
            />
          )}

          {/* ==================== TAB 5: BUY & SHARE PROFIT EARNING SYSTEM ==================== */}
          {activeTab === 'monetization' && (
            <div className="space-y-8">
              {/* Revenue Model Banner */}
              <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl border border-purple-800 space-y-4">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-black uppercase tracking-wider">
                  How FingerMobile Tribut Generates Value
                </span>
                <h2 className="text-3xl font-black text-white">
                  A Buy and Share Profit Earning System
                </h2>
                <p className="text-purple-100 text-sm max-w-3xl leading-relaxed">
                  FingerMobile Tribut capitalizes on the fact that our users exhibit significantly higher purchase intent than general social media feeds. Through native promoted widgets, shopping engine catalog syncing, and profit sharing, both merchants and community curators generate sustainable revenue.
                </p>
              </div>

              {/* Three Commercial Revenue Streams */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 border border-purple-300 text-purple-900 flex items-center justify-center font-black text-lg">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Native Promoted Ads</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Members and advertisers pay to place ads directly into Smart Feeds and Search results. Designed as organic widgets to yield high engagement:
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                    <li>• <strong>Brand Advertising</strong>: Impressions and views for awareness.</li>
                    <li>• <strong>Performance Advertising</strong>: CPC or CPA bidding where merchants only pay upon click or purchase.</li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-pink-100 border border-pink-300 text-pink-900 flex items-center justify-center font-black text-lg">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Shopping Engine Ecosystem</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Automated e-commerce gateway integrating <strong>MarketPlace, Storefront, OwnIt, and Flamingo</strong>:
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                    <li>• Merchants upload catalogs via <strong>Canary Ads</strong>.</li>
                    <li>• Guardian AI dynamically converts catalogs into live product cards with real-time checkout pathways.</li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 border border-indigo-300 text-indigo-900 flex items-center justify-center font-black text-lg">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Strategic Partner Collaborations</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Native commerce integrations collaborating with e-commerce platforms like <strong>Shopify</strong> and external ad networks:
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1.5 pt-1">
                    <li>• Seamless inventory synchronization between external shops and FingerMobile pins.</li>
                    <li>• Cross-platform ecosystem growth and multi-year ranking longevity.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ==================== LIGHTBOX PIN DETAIL MODAL ==================== */}
          {activePinDetail && (
            <TributPinDetailModal
              pin={activePinDetail}
              allPins={pinsList}
              userBoards={userBoards}
              savedPinIds={savedPinIds}
              onClose={() => setActivePinDetail(null)}
              onSelectPin={(pin) => setActivePinDetail(pin)}
              onToggleSavePin={handleToggleSavePin}
              onSharePin={handleShareToEarn}
              onCheckoutPin={handleOutboundCheckout}
              onOpenDownloadModal={(pin) => setDownloadTargetPin(pin)}
              onAddComment={handleAddComment}
            />
          )}

          {/* ==================== MEMBER TRIBUT & PROJECTS MODAL ==================== */}
          {selectedMember && (
            <MemberTributProjectsModal
              author={selectedMember}
              allPins={pinsList}
              allBoards={userBoards}
              savedPinIds={savedPinIds}
              onClose={() => setSelectedMember(null)}
              onSelectPin={(pin) => {
                setSelectedMember(null);
                setActivePinDetail(pin);
              }}
              onToggleSavePin={handleToggleSavePin}
              onOpenDownloadModal={(pin) => setDownloadTargetPin(pin)}
            />
          )}

          {/* ==================== CREATOR UPLOAD MODAL ==================== */}
          {showUploadPinModal && (
            <TributCreatorUploadModal
              userBoards={userBoards}
              onClose={() => setShowUploadPinModal(false)}
              onPublishPin={handlePublishCreatedPin}
            />
          )}

          {/* ==================== DOWNLOAD ASSET MODAL ==================== */}
          {(downloadTargetPin || downloadTargetBoard) && (
            <TributDownloadModal
              pin={downloadTargetPin}
              board={downloadTargetBoard}
              allPins={pinsList}
              onClose={() => {
                setDownloadTargetPin(null);
                setDownloadTargetBoard(null);
              }}
            />
          )}

          {/* ==================== FIVE ALGORITHMIC PILLARS EXPLANATION MODAL ==================== */}
          {showPillarsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-black text-purple-700 uppercase tracking-wider">
                      Guardian AI Architecture
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">
                      The Five Primary Algorithmic Pillars
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowPillarsModal(false)}
                    className="p-1.5 rounded-lg text-slate-700 hover:text-slate-700"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs text-slate-700 leading-relaxed overflow-y-auto max-h-[60vh] pr-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">1. Domain Quality</h4>
                    <p>Evaluates the trustworthiness and popularity of the Member's Platform Profile linked to the Pin. High-quality content that users frequently save increases the baseline visibility of all pins originating from that creator.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">2. Pin Usage (Engagement Signals)</h4>
                    <p>Freshness and user interaction dictate structural success. The algorithm heavily weights <strong>Saves (Pin Uses)</strong>, closeups, and outbound clicks because they signal long-term shelf-life value.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">3. Topic Relevance & SEO</h4>
                    <p>Indexed via Guardian AI search engine optimization metrics. Analyzes titles, descriptions, image alt-text, the name of the board, and the visual contents of the image itself using Guardian AI Vision.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">4. Pinner Quality (Consistency)</h4>
                    <p>Rewards active, consistent creators. Accounts that post high-quality vertical content (ideally a 2:3 aspect ratio) daily receive higher algorithmic authority than sporadic burst accounts.</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">5. Rich Members Platform Profile</h4>
                    <p>Profiles that utilize API data synchronization (such as live pricing, product availability, or recipe ingredients pulled directly from a storefront) receive algorithmic prioritization (Original Organic Content - OOC).</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowPillarsModal(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                >
                  Close Architecture Overview
                </button>
              </div>
            </div>
          )}

          {/* ==================== SAVE TO BOARD SELECTION MODAL ==================== */}
          {showSaveToBoardModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-300 space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Save to Project Board</h3>
                    <p className="text-xs text-slate-600">Select where to save "{showSaveToBoardModal.title}".</p>
                  </div>
                  <button
                    onClick={() => setShowSaveToBoardModal(null)}
                    className="p-1 rounded-lg text-slate-700 hover:text-slate-700"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {userBoards.map((board) => (
                    <label
                      key={board.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        selectedBoardIdToSave === board.id
                          ? 'bg-purple-50 border-purple-500 text-slate-900 font-bold'
                          : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={board.coverImage}
                          alt={board.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold">{board.name}</div>
                          <span className="text-[10px] text-slate-500">{board.purpose}</span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="boardRadio"
                        value={board.id}
                        checked={selectedBoardIdToSave === board.id}
                        onChange={() => setSelectedBoardIdToSave(board.id)}
                        className="text-slate-900 focus:ring-purple-500 font-bold border border-slate-300 rounded bg-white focus:ring-2 placeholder:text-slate-400"
                      />
                    </label>
                  ))}
                </div>

                <button
                  onClick={confirmSaveToBoard}
                  className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
                >
                  Confirm & Save Pin
                </button>
              </div>
            </div>
          )}

          {/* Multi-Item Batch Actions Floating Dock */}
          {(isSelectMode || selectedIds.length > 0) && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-xl border border-slate-700 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-bottom duration-300">
              <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-sm font-bold">
                  {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected
                </span>
              </div>

              <button
                type="button"
                onClick={handleSelectAll}
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
              >
                {selectedIds.length === filteredPins.length ? 'Deselect All' : 'Select All'}
              </button>

              <button
                type="button"
                onClick={handleBatchDelete}
                disabled={selectedIds.length === 0 || isBatchDeleting}
                className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-red-600/30"
              >
                {isBatchDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete Selected ({selectedIds.length})
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedIds([]);
                  setIsSelectMode(false);
                }}
                className="py-1.5 px-3 rounded-lg text-slate-400 hover:text-white text-xs font-semibold transition"
              >
                Done
              </button>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};

export default TributPage;
