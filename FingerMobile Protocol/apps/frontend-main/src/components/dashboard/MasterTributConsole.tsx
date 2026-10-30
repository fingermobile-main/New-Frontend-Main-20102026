import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  SparklesIcon,
  PhotoIcon,
  PlayIcon,
  PauseIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  ArrowPathIcon,
  TrashIcon,
  PencilSquareIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  ShieldCheckIcon,
  SwatchIcon,
  EyeSlashIcon,
  EyeIcon,
  FlagIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  LockClosedIcon,
  LockOpenIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  FolderIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import {
  TributConsolePin,
  TributConsoleOverview,
  TributMediaUploadItem,
  CreateTributPinPayload
} from '../../types/tributConsole';
import { tributConsoleService } from '../../services/tributConsoleService';
import { luminaGalleryConsoleService } from '../../services/luminaGalleryConsoleService';
import { LuminaGalleryItem } from '../../types/luminaGalleryConsole';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

type ActiveTab = 'pins' | 'collectibles' | 'uploads' | 'boards';

export const MasterTributConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pins');
  const [overview, setOverview] = useState<TributConsoleOverview | null>(null);
  const [pins, setPins] = useState<TributConsolePin[]>([]);
  const [collectibles, setCollectibles] = useState<LuminaGalleryItem[]>([]);
  const [uploads, setUploads] = useState<TributMediaUploadItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Batch Selection
  const [selectedPinIds, setSelectedPinIds] = useState<string[]>([]);
  const [isBatchDeleting, setIsBatchDeleting] = useState<boolean>(false);

  // Modals
  const [isAddPinModalOpen, setIsAddPinModalOpen] = useState<boolean>(false);
  const [isEditPinModalOpen, setIsEditPinModalOpen] = useState<boolean>(false);
  const [isMediaPackModalOpen, setIsMediaPackModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [activePin, setActivePin] = useState<TributConsolePin | null>(null);
  const [reportReason, setReportReason] = useState<string>('Inappropriate content / copyright infringement');

  // Form State for Pin Creation & Edit
  const [formTitle, setFormTitle] = useState<string>('');
  const [formCaption, setFormCaption] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('architecture');
  const [formBoardName, setFormBoardName] = useState<string>('Smart Home Lagos 2026');
  const [formPriority, setFormPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [formImageUrl, setFormImageUrl] = useState<string>('');
  const [formCoverImageUrl, setFormCoverImageUrl] = useState<string>('');
  const [formVideoUrl, setFormVideoUrl] = useState<string>('');
  const [formAspectRatio, setFormAspectRatio] = useState<string>('2:3');
  const [formTags, setFormTags] = useState<string>('architecture, minimal, lagos');
  const [formShoppable, setFormShoppable] = useState<boolean>(false);
  const [formProductName, setFormProductName] = useState<string>('');
  const [formPriceNgn, setFormPriceNgn] = useState<number>(45000);
  const [formPriceFic, setFormPriceFic] = useState<number>(450);
  const [formCommissionPct, setFormCommissionPct] = useState<number>(5);

  // Dedicated Media Upload Pack State (1. Images, 2. Cover Photo, 3. Videos)
  const [packImages, setPackImages] = useState<File[]>([]);
  const [packCover, setPackCover] = useState<File | null>(null);
  const [packVideo, setPackVideo] = useState<File | null>(null);
  const [packDeviceType, setPackDeviceType] = useState<string>('desktop');
  const [packDevicePlatform, setPackDevicePlatform] = useState<string>('macOS');
  const [packUploading, setPackUploading] = useState<boolean>(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputImagesRef = useRef<HTMLInputElement>(null);
  const fileInputCoverRef = useRef<HTMLInputElement>(null);
  const fileInputVideoRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, voice?: AfricanVoiceLine) => {
    setToastMessage(msg);
    if (voice) {
      audioEngine.playVoiceLine(voice);
    }
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [overviewData, pinsData] = await Promise.all([
        tributConsoleService.getOverview(),
        tributConsoleService.getPins({
          category: selectedCategory === 'ALL' ? undefined : selectedCategory,
          status: selectedStatus === 'ALL' ? undefined : selectedStatus,
          priority: selectedPriority === 'ALL' ? undefined : selectedPriority,
          search: searchQuery.trim() || undefined
        })
      ]);
      setOverview(overviewData);
      setPins(pinsData);

      if (activeTab === 'collectibles') {
        const items = await luminaGalleryConsoleService.getItems();
        setCollectibles(items);
      } else if (activeTab === 'uploads') {
        const u = await tributConsoleService.getUploads();
        setUploads(u);
      }
    } catch {
      showToast('Error syncing Tribut console with PostgreSQL', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, selectedPriority, searchQuery, activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Micro-Management: Freeze / Vault
  const handleToggleFreeze = async (pin: TributConsolePin) => {
    try {
      const updated = await tributConsoleService.toggleFreeze(pin.id);
      setPins(prev => prev.map(p => (p.id === pin.id ? updated : p)));
      if (updated.status === 'frozen') {
        showToast(`Pin "${updated.title}" frozen & vaulted from public feed!`, 'wahala');
      } else {
        showToast(`Pin "${updated.title}" restored to active smart feed!`, 'sweet');
      }
      loadData();
    } catch {
      showToast('Failed to switch pin freeze status', 'see_gobe');
    }
  };

  // Micro-Management: Censor / Visual Shield
  const handleToggleCensor = async (pin: TributConsolePin) => {
    try {
      const updated = await tributConsoleService.toggleCensor(pin.id);
      setPins(prev => prev.map(p => (p.id === pin.id ? updated : p)));
      if (updated.is_censored) {
        showToast(`Pin "${updated.title}" censored with Guardian AI visual shield!`, 'wahala');
      } else {
        showToast(`Pin "${updated.title}" uncensored & visual shield cleared!`, 'sweet');
      }
      loadData();
    } catch {
      showToast('Failed to toggle censor status', 'see_gobe');
    }
  };

  // Micro-Management: Suspend Pin
  const handleToggleSuspend = async (pin: TributConsolePin) => {
    try {
      const updated = await tributConsoleService.toggleSuspend(pin.id);
      setPins(prev => prev.map(p => (p.id === pin.id ? updated : p)));
      if (updated.status === 'suspended') {
        showToast(`Pin "${updated.title}" suspended from platform operations!`, 'wahala');
      } else {
        showToast(`Pin "${updated.title}" reactivated successfully!`, 'great_combo');
      }
      loadData();
    } catch {
      showToast('Failed to toggle suspend status', 'see_gobe');
    }
  };

  // Micro-Management: Pause Commenting
  const handleTogglePauseComments = async (pin: TributConsolePin) => {
    try {
      const updated = await tributConsoleService.togglePauseComments(pin.id);
      setPins(prev => prev.map(p => (p.id === pin.id ? updated : p)));
      if (updated.comments_paused) {
        showToast(`Discussions paused & locked for "${updated.title}"`, 'wahala');
      } else {
        showToast(`Discussions unlocked & resumed for "${updated.title}"`, 'sweet');
      }
    } catch {
      showToast('Failed to toggle comment lock state', 'see_gobe');
    }
  };

  // Micro-Management: Report Pin
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePin) return;
    try {
      const updated = await tributConsoleService.reportPin(activePin.id, reportReason);
      setPins(prev => prev.map(p => (p.id === activePin.id ? updated : p)));
      setIsReportModalOpen(false);
      setActivePin(null);
      showToast(`Moderation report logged! Total flags: ${updated.report_count}`, 'owo_ni_koko');
    } catch {
      showToast('Failed to record report', 'see_gobe');
    }
  };

  // Micro-Management: Move Up / Move Down Resequencing
  const handleReorder = async (currentIndex: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= pins.length) return;

    const sourcePin = pins[currentIndex];
    const targetPin = pins[targetIndex];

    try {
      const reordered = await tributConsoleService.reorderPins(sourcePin.id, targetPin.id);
      setPins(reordered);
      showToast('Tribut pins priority resequenced in PostgreSQL!', 'gbaski');
    } catch {
      showToast('Failed to reorder pins in database', 'wahala');
    }
  };

  // Micro-Management: Single Delete
  const handleDelete = async (pin: TributConsolePin) => {
    if (!window.confirm(`Are you sure you want to delete Tribut pin "${pin.title}"?`)) return;
    try {
      await tributConsoleService.deletePin(pin.id);
      setPins(prev => prev.filter(p => p.id !== pin.id));
      showToast(`Pin "${pin.title}" deleted from database!`, 'owo_ni_koko');
      loadData();
    } catch {
      showToast('Failed to delete pin', 'see_gobe');
    }
  };

  // Micro-Management: Batch Multi-Delete
  const handleBatchDelete = async () => {
    if (selectedPinIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to batch delete ${selectedPinIds.length} selected pin(s)?`)) return;

    try {
      setIsBatchDeleting(true);
      await tributConsoleService.batchDeletePins(selectedPinIds);
      setPins(prev => prev.filter(p => !selectedPinIds.includes(p.id)));
      setSelectedPinIds([]);
      showToast(`Batch deletion complete: ${selectedPinIds.length} items expunged!`, 'owo_ni_koko');
      loadData();
    } catch {
      showToast('Failed to batch delete items', 'see_gobe');
    } finally {
      setIsBatchDeleting(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedPinIds.length === pins.length) {
      setSelectedPinIds([]);
    } else {
      setSelectedPinIds(pins.map(p => p.id));
    }
  };

  const handleToggleSelectPin = (id: string) => {
    setSelectedPinIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  // Edit Pin Handler
  const handleOpenEdit = (pin: TributConsolePin) => {
    setActivePin(pin);
    setFormTitle(pin.title);
    setFormCaption(pin.caption || '');
    setFormCategory(pin.category);
    setFormBoardName(pin.board_name);
    setFormPriority(pin.priority as 'high' | 'medium' | 'low');
    setFormImageUrl(pin.image_url);
    setFormCoverImageUrl(pin.cover_image_url || '');
    setFormVideoUrl(pin.video_url || '');
    setFormAspectRatio(pin.aspect_ratio || '2:3');
    setFormTags((pin.tags || []).join(', '));
    setFormShoppable(Boolean(pin.shopping_metadata?.isShoppable));
    setFormProductName(pin.shopping_metadata?.productName || '');
    setFormPriceNgn(pin.shopping_metadata?.priceNgn || 45000);
    setFormPriceFic(pin.shopping_metadata?.priceFic || 450);
    setFormCommissionPct(pin.shopping_metadata?.buyAndShareCommissionPercent || 5);
    setIsEditPinModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePin) return;

    try {
      const payload: Partial<CreateTributPinPayload> = {
        title: formTitle,
        description: formCaption,
        category: formCategory,
        boardName: formBoardName,
        priority: formPriority,
        coverImageUrl: formCoverImageUrl,
        mediaUrl: formImageUrl,
        videoUrl: formVideoUrl,
        tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
        shoppingMetadata: {
          isShoppable: formShoppable,
          productName: formProductName,
          priceNgn: formPriceNgn,
          priceFic: formPriceFic,
          buyAndShareCommissionPercent: formCommissionPct
        }
      };

      const updated = await tributConsoleService.updatePin(activePin.id, payload);
      setPins(prev => prev.map(p => (p.id === activePin.id ? updated : p)));
      setIsEditPinModalOpen(false);
      setActivePin(null);
      showToast(`Pin "${updated.title}" saved to PostgreSQL!`, 'sweet');
      loadData();
    } catch {
      showToast('Failed to update pin', 'wahala');
    }
  };

  // Create Pin Handler
  const handleCreatePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formImageUrl) {
      showToast('Title and Media URL are required', 'wahala');
      return;
    }

    try {
      const payload: CreateTributPinPayload = {
        title: formTitle,
        description: formCaption,
        category: formCategory,
        boardName: formBoardName,
        aspectRatio: formAspectRatio,
        mediaUrl: formImageUrl,
        coverImageUrl: formCoverImageUrl,
        videoUrl: formVideoUrl,
        priority: formPriority,
        tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
        shoppingMetadata: {
          isShoppable: formShoppable,
          productName: formProductName,
          priceNgn: formPriceNgn,
          priceFic: formPriceFic,
          buyAndShareCommissionPercent: formCommissionPct
        },
        deviceType: packDeviceType,
        devicePlatform: packDevicePlatform,
        isPinnedToTribut: true
      };

      const created = await tributConsoleService.createPin(payload);
      setPins(prev => [created, ...prev]);
      setIsAddPinModalOpen(false);
      resetPinForm();
      showToast(`Pin "${created.title}" published & indexed in PostgreSQL!`, 'blessings');
      loadData();
    } catch {
      showToast('Failed to create pin in database', 'see_gobe');
    }
  };

  // Dedicated Media Upload Pack (1. Images, 2. Cover Photo, 3. Videos)
  const handleUploadPackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (packImages.length === 0 && !packCover && !packVideo) {
      showToast('Please select at least one media file to upload', 'wahala');
      return;
    }

    try {
      setPackUploading(true);
      const res = await tributConsoleService.uploadMediaPack(
        {
          images: packImages,
          cover: packCover,
          video: packVideo
        },
        {
          deviceType: packDeviceType,
          devicePlatform: packDevicePlatform,
          deviceName: 'Hardware Upload Terminal'
        }
      );

      // Auto populate into creation form if fields were empty
      if (res.images.length > 0 && !formImageUrl) {
        setFormImageUrl(res.images[0]);
      }
      if (res.cover && !formCoverImageUrl) {
        setFormCoverImageUrl(res.cover);
      }
      if (res.videos.length > 0 && !formVideoUrl) {
        setFormVideoUrl(res.videos[0]);
      }

      setIsMediaPackModalOpen(false);
      setPackImages([]);
      setPackCover(null);
      setPackVideo(null);
      showToast('Media pack uploaded direct to Express backend & PostgreSQL!', 'great_combo');
      loadData();
    } catch {
      showToast('Failed to process multipart upload', 'see_gobe');
    } finally {
      setPackUploading(false);
    }
  };

  const resetPinForm = () => {
    setFormTitle('');
    setFormCaption('');
    setFormCategory('architecture');
    setFormBoardName('Smart Home Lagos 2026');
    setFormPriority('high');
    setFormImageUrl('');
    setFormCoverImageUrl('');
    setFormVideoUrl('');
    setFormAspectRatio('2:3');
    setFormTags('architecture, minimal, lagos');
    setFormShoppable(false);
    setFormProductName('');
    setFormPriceNgn(45000);
    setFormPriceFic(450);
    setFormCommissionPct(5);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen text-slate-900">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-400 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 transition-all animate-bounce">
          <SparklesIcon className="w-5 h-5 text-amber-400 animate-spin" />
          <span className="text-sm font-bold text-slate-100">{toastMessage}</span>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-100 border border-amber-300 rounded-2xl">
            <Squares2X2Icon className="w-8 h-8 text-amber-900" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Tribut Sovereign Pin & Showcase Management Console
              </h1>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
                POSTGRES PERSISTENCE V4.2
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-700 mt-1">
              Granular micro-management: Freeze, censor, suspend, pause commenting, priority resequencing, and direct media upload pack.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            onClick={() => {
              showToast('Syncing all Tribut catalog items with PostgreSQL...', 'blessings');
              loadData();
            }}
            className="flex-1 lg:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>

          <button
            onClick={() => setIsMediaPackModalOpen(true)}
            className="flex-1 lg:flex-none px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition"
          >
            <ArrowUpTrayIcon className="w-4 h-4 text-indigo-800" />
            <span>Upload Media Pack</span>
          </button>

          <button
            onClick={() => {
              resetPinForm();
              setIsAddPinModalOpen(true);
            }}
            className="flex-1 lg:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition"
          >
            <PlusIcon className="w-4 h-4 text-white" />
            <span>Create Tribut Pin</span>
          </button>
        </div>
      </div>

      {/* Overview Analytics Bar */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Total Vault Pins</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{overview.summary.total_pins}</span>
            <span className="text-xs font-semibold text-emerald-800 mt-1 block">Active: {overview.summary.active_pins}</span>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Vaulted / Frozen</span>
            <span className="text-2xl font-black text-amber-900 mt-1 block">{overview.summary.frozen_pins}</span>
            <span className="text-xs font-semibold text-slate-700 mt-1 block">Quarantined Feed</span>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Censored / Shielded</span>
            <span className="text-2xl font-black text-rose-900 mt-1 block">{overview.summary.censored_pins}</span>
            <span className="text-xs font-semibold text-rose-800 mt-1 block">Guardian AI Filter</span>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Comments Paused</span>
            <span className="text-2xl font-black text-purple-900 mt-1 block">{overview.summary.comments_paused_pins}</span>
            <span className="text-xs font-semibold text-slate-700 mt-1 block">Discussions Locked</span>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Project Boards</span>
            <span className="text-2xl font-black text-blue-900 mt-1 block">{overview.totalBoards}</span>
            <span className="text-xs font-semibold text-slate-700 mt-1 block">Curated Portfolios</span>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Hardware Uploads</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{overview.totalUploads}</span>
            <span className="text-xs font-semibold text-emerald-800 mt-1 block">Device Camera Stream</span>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="bg-white border border-slate-300 rounded-xl p-1.5 shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('pins')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'pins'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-800 hover:bg-slate-100'
          }`}
        >
          <PhotoIcon className="w-4 h-4" />
          <span>Tribut Pins & Design Feed ({pins.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('collectibles')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'collectibles'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-800 hover:bg-slate-100'
          }`}
        >
          <SwatchIcon className="w-4 h-4" />
          <span>Cultural Provenance Collectibles ({collectibles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('uploads')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'uploads'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-800 hover:bg-slate-100'
          }`}
        >
          <ComputerDesktopIcon className="w-4 h-4" />
          <span>Hardware Device Media Uploads ({uploads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('boards')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'boards'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-800 hover:bg-slate-100'
          }`}
        >
          <FolderIcon className="w-4 h-4" />
          <span>Project Planning Boards</span>
        </button>
      </div>

      {/* Tab 1: Tribut Pins Catalog & Micro-Management */}
      {activeTab === 'pins' && (
        <div className="space-y-4">
          {/* Filter, Search & Batch Bar */}
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-800 uppercase">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="ALL">All Disciplines ({overview?.summary.total_pins || pins.length})</option>
                  <option value="architecture">Architecture</option>
                  <option value="fashion">Fashion & Textiles</option>
                  <option value="interior">Interior Design</option>
                  <option value="tech">Tech & Hardware</option>
                  <option value="art">Ancestral Art</option>
                  <option value="wellness">Botanicals & Wellness</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-800 uppercase">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="active">Active Published</option>
                  <option value="frozen">Frozen / Vaulted</option>
                  <option value="censored">Censored / Shielded</option>
                  <option value="suspended">Suspended</option>
                  <option value="comments_paused">Comments Paused</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-800 uppercase">Priority:</span>
                <select
                  value={selectedPriority}
                  onChange={e => setSelectedPriority(e.target.value)}
                  className="text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>

            {/* Search Input & Batch Action */}
            <div className="flex items-center space-x-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-72">
                <MagnifyingGlassIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search pins, author, board..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {selectedPinIds.length > 0 && (
                <button
                  onClick={handleBatchDelete}
                  disabled={isBatchDeleting}
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
                >
                  <TrashIcon className="w-4 h-4 text-white" />
                  <span>Delete ({selectedPinIds.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Pins Main Table */}
          <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={pins.length > 0 && selectedPinIds.length === pins.length}
                  onChange={handleSelectAll}
                  aria-label="Select all pins"
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <h2 className="text-base font-black text-slate-900">
                  Tribut Creative Pins Catalog ({pins.length})
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
                100% PostgreSQL Persistence
              </span>
            </div>

            {pins.length === 0 ? (
              <div className="p-12 text-center">
                <PhotoIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No Tribut pins match your filters</h3>
                <p className="text-xs text-slate-700 mt-1">Adjust filters or create a new pin to seed the feed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/75 border-b border-slate-300 text-xs font-black text-slate-900 uppercase tracking-wider">
                      <th className="py-3 px-3 w-10 text-center">Select</th>
                      <th className="py-3 px-3 w-20">Order</th>
                      <th className="py-3 px-4">Pin Preview</th>
                      <th className="py-3 px-4">Title & Details</th>
                      <th className="py-3 px-4">Category & Board</th>
                      <th className="py-3 px-4 text-center">Moderation & State</th>
                      <th className="py-3 px-4 text-center">Guardian Score</th>
                      <th className="py-3 px-4 text-center">Granular Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {pins.map((pin, idx) => (
                      <tr key={pin.id} className="hover:bg-slate-50/80 transition">
                        {/* Checkbox */}
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedPinIds.includes(pin.id)}
                            onChange={() => handleToggleSelectPin(pin.id)}
                            aria-label={`Select ${pin.title}`}
                            className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                          />
                        </td>

                        {/* Order & Resequencing */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <span className="text-xs font-extrabold text-slate-800 w-6 text-center">
                              #{pin.display_order || idx + 1}
                            </span>
                            <div className="flex flex-col space-y-0.5">
                              <button
                                onClick={() => handleReorder(idx, 'UP')}
                                disabled={idx === 0}
                                title="Move Up"
                                aria-label={`Move ${pin.title} Up`}
                                className={`p-1 rounded hover:bg-slate-200 text-slate-800 ${
                                  idx === 0 ? 'opacity-30 cursor-not-allowed' : ''
                                }`}
                              >
                                <ArrowUpIcon className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleReorder(idx, 'DOWN')}
                                disabled={idx === pins.length - 1}
                                title="Move Down"
                                aria-label={`Move ${pin.title} Down`}
                                className={`p-1 rounded hover:bg-slate-200 text-slate-800 ${
                                  idx === pins.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                                }`}
                              >
                                <ArrowDownIcon className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Pin Preview Image */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="relative w-14 h-20 rounded-lg overflow-hidden border border-slate-300 bg-slate-100 flex-shrink-0">
                            <img
                              src={pin.image_url}
                              alt={pin.title}
                              className={`w-full h-full object-cover ${pin.is_censored ? 'blur-md' : ''}`}
                            />
                            {pin.is_censored && (
                              <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                                <EyeSlashIcon className="w-4 h-4 text-rose-400" />
                              </div>
                            )}
                            {pin.video_url && (
                              <div className="absolute bottom-1 right-1 bg-black/75 rounded p-0.5">
                                <VideoCameraIcon className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Title & Details */}
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-extrabold text-slate-900 leading-snug">{pin.title}</div>
                          <p className="text-xs font-medium text-slate-700 line-clamp-2 mt-0.5">
                            {pin.caption || 'No caption provided.'}
                          </p>
                          <div className="text-[11px] font-semibold text-slate-600 mt-1 flex items-center space-x-2">
                            <span>Author: <strong className="text-slate-800">{pin.uploader_name}</strong></span>
                            <span>•</span>
                            <span className="font-mono">{pin.uploader_handle}</span>
                          </div>
                        </td>

                        {/* Category & Board */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-950 border border-blue-400 block w-max">
                            {pin.category}
                          </span>
                          <span className="text-xs font-semibold text-slate-700 block mt-1">
                            {pin.board_name}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">
                            Priority: <span className="text-slate-800">{pin.priority}</span>
                          </span>
                        </td>

                        {/* Moderation Badges */}
                        <td className="py-3 px-4 whitespace-nowrap text-center">
                          <div className="flex flex-col items-center space-y-1">
                            {/* Freeze badge */}
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                                pin.status === 'frozen'
                                  ? 'bg-amber-100 text-amber-950 border border-amber-400'
                                  : 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                              }`}
                            >
                              {pin.status === 'frozen' ? 'Vaulted / Frozen' : 'Live Published'}
                            </span>

                            {/* Censor badge */}
                            {pin.is_censored && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-950 border border-rose-400">
                                Censored
                              </span>
                            )}

                            {/* Comments Paused badge */}
                            {pin.comments_paused && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-950 border border-purple-400">
                                Comments Locked
                              </span>
                            )}

                            {/* Suspended badge */}
                            {pin.status === 'suspended' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-red-100 text-red-950 border border-red-500">
                                Suspended
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Guardian Score */}
                        <td className="py-3 px-4 whitespace-nowrap text-center">
                          <span className="font-mono font-black text-emerald-800 text-sm">
                            {pin.guardian_quality_score || 96.5}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 block">AI Verified</span>
                        </td>

                        {/* Granular Micro-Management Action Bar */}
                        <td className="py-3 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-1">
                            {/* 1. Freeze / Unfreeze */}
                            <button
                              onClick={() => handleToggleFreeze(pin)}
                              title={pin.status === 'frozen' ? 'Unfreeze (Restore to Public Feed)' : 'Freeze (Vault from Public Feed)'}
                              aria-label={`Toggle Freeze for ${pin.title}`}
                              className={`p-1.5 rounded-lg border transition ${
                                pin.status === 'frozen'
                                  ? 'border-emerald-400 bg-emerald-50 hover:bg-emerald-100 text-emerald-950'
                                  : 'border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-950'
                              }`}
                            >
                              {pin.status === 'frozen' ? (
                                <PlayIcon className="w-4 h-4 text-emerald-800" />
                              ) : (
                                <PauseIcon className="w-4 h-4 text-amber-800" />
                              )}
                            </button>

                            {/* 2. Censor / Uncensor */}
                            <button
                              onClick={() => handleToggleCensor(pin)}
                              title={pin.is_censored ? 'Remove Visual Censor' : 'Apply Visual Censor Shield'}
                              aria-label={`Toggle Censor for ${pin.title}`}
                              className={`p-1.5 rounded-lg border transition ${
                                pin.is_censored
                                  ? 'border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-950'
                                  : 'border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-950'
                              }`}
                            >
                              {pin.is_censored ? (
                                <EyeIcon className="w-4 h-4 text-blue-800" />
                              ) : (
                                <EyeSlashIcon className="w-4 h-4 text-rose-800" />
                              )}
                            </button>

                            {/* 3. Suspend / Unsuspend */}
                            <button
                              onClick={() => handleToggleSuspend(pin)}
                              title={pin.status === 'suspended' ? 'Reactivate Pin' : 'Suspend Pin'}
                              aria-label={`Toggle Suspend for ${pin.title}`}
                              className={`p-1.5 rounded-lg border transition ${
                                pin.status === 'suspended'
                                  ? 'border-emerald-400 bg-emerald-50 hover:bg-emerald-100 text-emerald-950'
                                  : 'border-slate-300 hover:bg-slate-100 text-slate-800'
                              }`}
                            >
                              <NoSymbolIcon className="w-4 h-4 text-slate-700" />
                            </button>

                            {/* 4. Pause Commenting */}
                            <button
                              onClick={() => handleTogglePauseComments(pin)}
                              title={pin.comments_paused ? 'Unlock / Resume Commenting' : 'Pause / Lock Commenting'}
                              aria-label={`Toggle Comments for ${pin.title}`}
                              className={`p-1.5 rounded-lg border transition ${
                                pin.comments_paused
                                  ? 'border-purple-400 bg-purple-50 hover:bg-purple-100 text-purple-950'
                                  : 'border-slate-300 hover:bg-slate-100 text-slate-800'
                              }`}
                            >
                              {pin.comments_paused ? (
                                <LockClosedIcon className="w-4 h-4 text-purple-800" />
                              ) : (
                                <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4 text-slate-700" />
                              )}
                            </button>

                            {/* 5. Report Pin */}
                            <button
                              onClick={() => {
                                setActivePin(pin);
                                setIsReportModalOpen(true);
                              }}
                              title={`Report Pin (Flags: ${pin.report_count || 0})`}
                              aria-label={`Report ${pin.title}`}
                              className="p-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 transition"
                            >
                              <FlagIcon className="w-4 h-4 text-amber-800" />
                            </button>

                            {/* 6. Edit Pin */}
                            <button
                              onClick={() => handleOpenEdit(pin)}
                              title="Edit Pin Metadata & Shopping"
                              aria-label={`Edit ${pin.title}`}
                              className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-800 transition"
                            >
                              <PencilSquareIcon className="w-4 h-4 text-slate-700" />
                            </button>

                            {/* 7. Delete Pin */}
                            <button
                              onClick={() => handleDelete(pin)}
                              title="Delete Pin from PostgreSQL"
                              aria-label={`Delete ${pin.title}`}
                              className="p-1.5 rounded-lg border border-rose-300 hover:bg-rose-100 text-rose-800 transition"
                            >
                              <TrashIcon className="w-4 h-4 text-rose-800" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Lumina Cultural Collectibles */}
      {activeTab === 'collectibles' && (
        <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Sovereign Cultural Provenance & Royal Regalia Collectibles
              </h2>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                Cultural artifacts, royal regalia 3D tokens, and floor price valuation in sovereign FIC.
              </p>
            </div>
            <a
              href="/admin/lumina-gallery"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Open Full Lumina Console
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collectibles.map(c => (
              <div key={c.id} className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900">{c.code}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    c.status === 'active'
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                      : 'bg-rose-100 text-rose-950 border border-rose-400'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900">{c.name}</h3>
                <p className="text-xs text-slate-700 line-clamp-2">{c.description}</p>
                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200">
                  <span className="font-bold text-slate-800">Floor: {c.floor_price_fic} FIC</span>
                  <span className="font-bold text-purple-900">Royalty: {c.royalty_pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Hardware Device Media Uploads */}
      {activeTab === 'uploads' && (
        <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Direct Hardware Device Media Ingestion Stream ({uploads.length})
              </h2>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                Raw photos, cover captures, and video clips uploaded directly from Phones, Laptops, and Desktops.
              </p>
            </div>
            <button
              onClick={() => setIsMediaPackModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center space-x-1.5"
            >
              <ArrowUpTrayIcon className="w-4 h-4 text-white" />
              <span>Upload New Media</span>
            </button>
          </div>

          {uploads.length === 0 ? (
            <div className="p-8 text-center">
              <ComputerDesktopIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">No hardware media uploads logged yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {uploads.map(u => (
                <div key={u.id} className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-2">
                  <div className="h-32 bg-slate-200 rounded-lg overflow-hidden border border-slate-300">
                    <img src={u.file_url} alt={u.original_name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">{u.original_name}</div>
                  <div className="text-[11px] font-semibold text-slate-600">
                    Device: {u.device_type} ({u.device_platform})
                  </div>
                  <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 bg-blue-100 text-blue-950 border border-blue-400 rounded-full">
                    {u.media_type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Project Boards */}
      {activeTab === 'boards' && (
        <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Tribut Member Project Boards & Collaborative Portfolios
              </h2>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                Architectural layout collections, seasonal runway boards, and collaborative mood boards.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {overview?.categories.map(c => (
              <div key={c.category} className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2">
                <div className="flex items-center space-x-2">
                  <FolderIcon className="w-5 h-5 text-amber-800" />
                  <h3 className="font-extrabold text-slate-900 capitalize">{c.category}</h3>
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  Total Pins Cataloged: <strong className="text-slate-900">{c.count}</strong>
                </p>
                <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-950 border border-emerald-400 rounded-full">
                  100% Crawl Ready
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Dedicated Media Upload Pack (1. Images, 2. Cover Photo, 3. Videos) */}
      {isMediaPackModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-100 border border-indigo-300 rounded-xl">
                  <ArrowUpTrayIcon className="w-5 h-5 text-indigo-900" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Direct Hardware Media Upload Pack
                  </h3>
                  <p className="text-xs font-semibold text-slate-700">
                    Upload product/goods/service assets: 1. Images, 2. Cover photo, 3. Videos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMediaPackModalOpen(false)}
                className="p-1 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadPackSubmit} className="space-y-4">
              {/* 1. Primary Images Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 block flex items-center space-x-1">
                  <PhotoIcon className="w-4 h-4 text-slate-700" />
                  <span>1. Showcase Images (Multiple Files Supported)</span>
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputImagesRef}
                  onChange={e => {
                    if (e.target.files) {
                      setPackImages(Array.from(e.target.files));
                    }
                  }}
                  className="block w-full text-xs font-bold text-slate-900 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 bg-white border border-slate-300 rounded-xl p-2"
                />
                {packImages.length > 0 && (
                  <p className="text-[11px] font-bold text-emerald-800">
                    ✓ {packImages.length} image(s) selected
                  </p>
                )}
              </div>

              {/* 2. Cover Photo Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 block flex items-center space-x-1">
                  <Squares2X2Icon className="w-4 h-4 text-slate-700" />
                  <span>2. Dedicated Cover Photo</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputCoverRef}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setPackCover(e.target.files[0]);
                    }
                  }}
                  className="block w-full text-xs font-bold text-slate-900 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 bg-white border border-slate-300 rounded-xl p-2"
                />
                {packCover && (
                  <p className="text-[11px] font-bold text-emerald-800">
                    ✓ Cover photo: {packCover.name}
                  </p>
                )}
              </div>

              {/* 3. Videos Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 block flex items-center space-x-1">
                  <VideoCameraIcon className="w-4 h-4 text-slate-700" />
                  <span>3. Video Clip(s) (MP4, WebM)</span>
                </label>
                <input
                  type="file"
                  accept="video/*"
                  ref={fileInputVideoRef}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setPackVideo(e.target.files[0]);
                    }
                  }}
                  className="block w-full text-xs font-bold text-slate-900 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-700 bg-white border border-slate-300 rounded-xl p-2"
                />
                {packVideo && (
                  <p className="text-[11px] font-bold text-emerald-800">
                    ✓ Video selected: {packVideo.name}
                  </p>
                )}
              </div>

              {/* Hardware Device Telemetry */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Device Form Factor</label>
                  <select
                    value={packDeviceType}
                    onChange={e => setPackDeviceType(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl p-2"
                  >
                    <option value="desktop">Desktop / Workstation</option>
                    <option value="mobile">Mobile Phone (Camera Sensor)</option>
                    <option value="tablet">iPad / Tablet</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Operating Platform</label>
                  <select
                    value={packDevicePlatform}
                    onChange={e => setPackDevicePlatform(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl p-2"
                  >
                    <option value="macOS">Apple macOS</option>
                    <option value="iOS">Apple iOS</option>
                    <option value="Android">Google Android</option>
                    <option value="Windows">Microsoft Windows</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsMediaPackModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={packUploading}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shadow-sm"
                >
                  <ArrowUpTrayIcon className={`w-4 h-4 ${packUploading ? 'animate-bounce' : ''}`} />
                  <span>{packUploading ? 'Uploading to PostgreSQL...' : 'Upload Media Pack'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Pin / Edit Pin */}
      {(isAddPinModalOpen || isEditPinModalOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {isEditPinModalOpen ? `Edit Tribut Pin: ${activePin?.title}` : 'Create New Tribut Showcase Pin'}
              </h3>
              <button
                onClick={() => {
                  setIsAddPinModalOpen(false);
                  setIsEditPinModalOpen(false);
                }}
                className="p-1 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isEditPinModalOpen ? handleEditSubmit : handleCreatePinSubmit}
              className="space-y-3.5 max-h-[75vh] overflow-y-auto pr-2"
            >
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Pin Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asymmetric Aso-Oke Evening Gown"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Caption & Design Notes</label>
                <textarea
                  rows={2}
                  placeholder="Design description, textiles, bio-climatic architectural notes..."
                  value={formCaption}
                  onChange={e => setFormCaption(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl p-2.5"
                  >
                    <option value="architecture">Architecture</option>
                    <option value="fashion">Fashion & Textiles</option>
                    <option value="interior">Interior Design</option>
                    <option value="tech">Tech & Hardware</option>
                    <option value="art">Ancestral Art</option>
                    <option value="wellness">Botanicals & Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Priority Ranking</label>
                  <select
                    value={formPriority}
                    onChange={e => setFormPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl p-2.5"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Project Board Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Smart Home Lagos 2026"
                    value={formBoardName}
                    onChange={e => setFormBoardName(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Aspect Ratio</label>
                  <select
                    value={formAspectRatio}
                    onChange={e => setFormAspectRatio(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl p-2.5"
                  >
                    <option value="2:3">2:3 (Standard Vertical Pin)</option>
                    <option value="3:4">3:4 (Portrait)</option>
                    <option value="1:1">1:1 (Square)</option>
                  </select>
                </div>
              </div>

              {/* Media URLs */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Media Assets</span>
                  <button
                    type="button"
                    onClick={() => setIsMediaPackModalOpen(true)}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline flex items-center space-x-1"
                  >
                    <ArrowUpTrayIcon className="w-3.5 h-3.5" />
                    <span>Upload via Device Picker</span>
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Image URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://... or /uploads/tribut/..."
                    value={formImageUrl}
                    onChange={e => setFormImageUrl(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl p-2.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Cover Photo URL</label>
                    <input
                      type="text"
                      placeholder="Optional cover photo..."
                      value={formCoverImageUrl}
                      onChange={e => setFormCoverImageUrl(e.target.value)}
                      className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl p-2.5"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Video Stream URL</label>
                    <input
                      type="text"
                      placeholder="Optional video URL..."
                      value={formVideoUrl}
                      onChange={e => setFormVideoUrl(e.target.value)}
                      className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl p-2.5"
                    />
                  </div>
                </div>
              </div>

              {/* Shopping Engine Integration */}
              <div className="space-y-2 pt-2 border-t border-slate-200 bg-slate-50 p-3 rounded-xl border">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formShoppable}
                      onChange={e => setFormShoppable(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                    />
                    <span className="text-xs font-black text-slate-900">
                      Enable Shopping Engine & Buy-and-Share Commissions
                    </span>
                  </label>
                </div>

                {formShoppable && (
                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    <div className="col-span-3">
                      <label className="text-xs font-semibold text-slate-700 block mb-0.5">Product Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Artisan Handwoven Silk Kimono"
                        value={formProductName}
                        onChange={e => setFormProductName(e.target.value)}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-0.5">Price (NGN)</label>
                      <input
                        type="number"
                        value={formPriceNgn}
                        onChange={e => setFormPriceNgn(Number(e.target.value))}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-0.5">Price (FIC)</label>
                      <input
                        type="number"
                        value={formPriceFic}
                        onChange={e => setFormPriceFic(Number(e.target.value))}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg p-2"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-0.5">Commission %</label>
                      <input
                        type="number"
                        value={formCommissionPct}
                        onChange={e => setFormCommissionPct(Number(e.target.value))}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg p-2"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddPinModalOpen(false);
                    setIsEditPinModalOpen(false);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {isEditPinModalOpen ? 'Save Changes' : 'Publish to PostgreSQL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Report Pin Reason */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <FlagIcon className="w-5 h-5 text-amber-800" />
                <h3 className="text-base font-black text-slate-900">Report & Moderate Pin</h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-semibold text-slate-700">
              Pin: <strong className="text-slate-900">{activePin?.title}</strong>
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Reason for Flagging</label>
                <select
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl p-2.5"
                >
                  <option value="Inappropriate content / copyright infringement">Copyright Infringement</option>
                  <option value="Explicit / Adult Content">Explicit or Sensitive Content</option>
                  <option value="Misleading / Spam / Fraudulent Merchant">Spam or Misleading Merchant</option>
                  <option value="Low Quality / Corrupted Media">Low Quality or Corrupted Media</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterTributConsole;
