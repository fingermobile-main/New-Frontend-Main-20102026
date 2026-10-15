import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  RotateCw,
  Clock,
  Pin,
  TrendingUp,
  Eye,
  MousePointerClick,
  Share2,
  Trash2,
  Edit3,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Video,
  Image as ImageIcon,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Star,
  Monitor,
  Smartphone,
  Save,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import widgetService, {
  WidgetEntity,
  RailRotationState,
} from '../../services/widgetService';
import CanaryAdsWidget from '../widgets/CanaryAdsWidget';
import RotationalWidgetCard from '../widgets/RotationalWidgetCard';

export const MasterWidgetConsole: React.FC = () => {
  const [widgets, setWidgets] = useState<WidgetEntity[]>([]);
  const [rotationState, setRotationState] = useState<RailRotationState>(() =>
    widgetService.getRotationState()
  );
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'creator' | 'table' | 'feedback'>('matrix');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Widget Creator Form State
  const [creatorForm, setCreatorForm] = useState<Partial<WidgetEntity>>({
    name: '',
    slug: '',
    title: '',
    subtitle: '',
    description: '',
    category: 'Advertising',
    type: 'rotational',
    isPermanent: false,
    displayLocation: 'right_column_dynamic',
    rotationIntervalMinutes: 120,
    rotationPriority: 1,
    primaryImageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
    primaryVideoUrl: '',
    videoPosterUrl: '',
    images: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80'],
    videos: [],
    actionUrl: '/canary-ads',
    ctaText: 'Explore Now',
    secondaryActionUrl: '',
    secondaryCtaText: '',
    badgeText: 'FEATURED SPOTLIGHT',
    accentColor: '#059669',
    badgeStyle: 'emerald',
    edgeStyle: 'glassmorphism',
    status: 'active',
  });

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);

  const loadData = () => {
    setWidgets(widgetService.getAllWidgets());
    setRotationState(widgetService.getRotationState());
  };

  useEffect(() => {
    loadData();
    const unsub = widgetService.subscribe(() => {
      loadData();
    });
    const ticker = setInterval(() => {
      setRotationState(widgetService.getRotationState());
    }, 1000);
    return () => {
      unsub();
      clearInterval(ticker);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleForceRotate = () => {
    widgetService.forceRotation();
    showToast('2-Hour auto-rotation triggered! Next set of widgets now active in the Right Rail.');
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    widgetService.updateWidget(id, { status: nextStatus as any });
    showToast(`Widget status changed to ${nextStatus.toUpperCase()}`);
  };

  const handleDelete = (id: string, name: string, isPermanent: boolean) => {
    if (isPermanent) {
      alert('Canary Ads Widget is permanently anchored to the bottom right column and cannot be deleted.');
      return;
    }
    if (window.confirm(`Are you sure you want to remove "${name}" from the widgets database table?`)) {
      widgetService.deleteWidget(id);
      showToast(`Widget "${name}" removed from database.`);
    }
  };

  const handleStartEdit = (w: WidgetEntity) => {
    setEditingWidgetId(w.id);
    setCreatorForm({ ...w });
    setActiveSubTab('creator');
  };

  const handleSaveWidget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorForm.name || !creatorForm.title || !creatorForm.actionUrl) {
      alert('Please fill out the Name, Title, and Action URL fields.');
      return;
    }

    if (editingWidgetId) {
      widgetService.updateWidget(editingWidgetId, creatorForm);
      showToast(`Widget "${creatorForm.name}" updated successfully in the Database Table!`);
      setEditingWidgetId(null);
    } else {
      widgetService.createWidget(creatorForm);
      showToast(`New widget "${creatorForm.name}" published to the Database Table & Live Rail!`);
    }

    // Reset Form
    setCreatorForm({
      name: '',
      slug: '',
      title: '',
      subtitle: '',
      description: '',
      category: 'Advertising',
      type: 'rotational',
      isPermanent: false,
      displayLocation: 'right_column_dynamic',
      rotationIntervalMinutes: 120,
      rotationPriority: 1,
      primaryImageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
      primaryVideoUrl: '',
      videoPosterUrl: '',
      images: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80'],
      videos: [],
      actionUrl: '/canary-ads',
      ctaText: 'Explore Now',
      secondaryActionUrl: '',
      secondaryCtaText: '',
      badgeText: 'FEATURED SPOTLIGHT',
      accentColor: '#059669',
      badgeStyle: 'emerald',
      edgeStyle: 'glassmorphism',
      status: 'active',
    });
    setActiveSubTab('matrix');
  };

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  // Aggregated KPIs
  const totalImpressions = widgets.reduce((a, w) => a + (w.impressions || 0), 0);
  const totalClicks = widgets.reduce((a, w) => a + (w.clicks || 0), 0);
  const totalConversions = widgets.reduce((a, w) => a + (w.conversions || 0), 0);
  const platformCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
  const permanentCount = widgets.filter((w) => w.isPermanent).length;
  const rotationalCount = widgets.filter((w) => !w.isPermanent).length;

  const filteredWidgets = widgets.filter((w) => {
    const matchSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'all' || w.category === selectedCategory;
    const matchType =
      selectedType === 'all' ||
      (selectedType === 'permanent' && w.isPermanent) ||
      (selectedType === 'rotational' && !w.isPermanent);
    return matchSearch && matchCat && matchType;
  });

  const categories = ['all', ...Array.from(new Set(widgets.map((w) => w.category)))];

  // Temporary mock widget entity for live preview in Widget Creator
  const previewWidgetEntity: WidgetEntity = {
    id: editingWidgetId || 'preview-mock-id',
    name: creatorForm.name || 'Sample Widget Name',
    slug: creatorForm.slug || 'sample-widget',
    type: creatorForm.type || 'rotational',
    title: creatorForm.title || 'Dynamic Protocol Widget',
    subtitle: creatorForm.subtitle || 'High Impact Feature Preview',
    description:
      creatorForm.description ||
      'This preview displays the interactive layout, high-contrast typography, media canvas, and live CTAs.',
    category: creatorForm.category || 'General',
    isPermanent: Boolean(creatorForm.isPermanent),
    displayLocation: creatorForm.isPermanent ? 'bottom_right_column' : 'right_column_dynamic',
    rotationIntervalMinutes: creatorForm.rotationIntervalMinutes || 120,
    rotationPriority: creatorForm.rotationPriority || 1,
    images: creatorForm.images || [],
    videos: creatorForm.videos || [],
    primaryImageUrl: creatorForm.primaryImageUrl,
    primaryVideoUrl: creatorForm.primaryVideoUrl,
    videoPosterUrl: creatorForm.videoPosterUrl,
    actionUrl: creatorForm.actionUrl || '/',
    ctaText: creatorForm.ctaText || 'Explore Now',
    secondaryActionUrl: creatorForm.secondaryActionUrl,
    secondaryCtaText: creatorForm.secondaryCtaText,
    badgeText: creatorForm.badgeText || 'PREVIEW',
    accentColor: creatorForm.accentColor || '#059669',
    badgeStyle: creatorForm.badgeStyle || 'emerald',
    edgeStyle: creatorForm.edgeStyle || 'glassmorphism',
    status: creatorForm.status || 'active',
    clicks: 1420,
    impressions: 21500,
    conversions: 240,
    shares: 80,
    avgEngagementSeconds: 28.0,
  };

  return (
    <div id="master-widget-console" className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================================= */}
      {/* HEADER & EXECUTIVE TELEMETRY                                           */}
      {/* ======================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 text-white border border-slate-700 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-700/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Core Master Subsystem
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Pin className="w-2.5 h-2.5" /> Permanent + 2h Rotations
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-emerald-400" />
              Widgets & Rails Master Dashboard Console
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Centralized command center for managing the FingerMobile right-rail ecosystem. Controls the permanent Canary Ads column slot, 2-hour dynamic rotational pool, analytics telemetry, and edge-type widget visual studio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleForceRotate}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 border border-emerald-400"
            >
              <RotateCw className="w-4 h-4" />
              <span>Simulate 2H Rotation</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingWidgetId(null);
                setActiveSubTab('creator');
              }}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Launch Widget Creator</span>
            </button>
          </div>
        </div>

        {/* Real-Time KPIs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Widgets</span>
            <div className="text-xl font-black font-mono text-white mt-1">{widgets.length}</div>
            <span className="text-[10px] text-emerald-400 mt-0.5 block">{permanentCount} Perm • {rotationalCount} Rotational</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">2H Countdown</span>
            <div className="text-xl font-black font-mono text-amber-400 mt-1">
              {formatCountdown(rotationState.remainingSeconds)}
            </div>
            <span className="text-[10px] text-slate-300 mt-0.5 block">Cycle #{rotationState.currentStep}</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Impressions</span>
            <div className="text-xl font-black font-mono text-white mt-1">
              {totalImpressions.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400 mt-0.5 block">+18.4% this week</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Clicks</span>
            <div className="text-xl font-black font-mono text-white mt-1">
              {totalClicks.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400 mt-0.5 block">CTR: {platformCtr}%</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Conversions</span>
            <div className="text-xl font-black font-mono text-white mt-1">
              {totalConversions.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-300 mt-0.5 block">Action completions</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rotation Pool</span>
            <div className="text-xl font-black font-mono text-sky-400 mt-1">
              {rotationState.poolSize} Active
            </div>
            <span className="text-[10px] text-slate-300 mt-0.5 block">3 per 2h window</span>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* NAVIGATION TABS                                                         */}
      {/* ======================================================================= */}
      <div className="flex border-b border-slate-300 gap-2 overflow-x-auto pb-1">
        {[
          { id: 'matrix', label: 'Live Rails & Rotational Matrix', icon: Layers },
          { id: 'creator', label: editingWidgetId ? 'Edit Widget Studio' : 'Professional Edge "Widget Creator"', icon: Plus },
          { id: 'table', label: 'Widgets Database Table Explorer', icon: Filter },
          { id: 'feedback', label: 'Feedback & Analytics Hub', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================================= */}
      {/* SUBTAB 1: LIVE RAILS & ROTATIONAL MATRIX                                */}
      {/* ======================================================================= */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-6">
          {/* Permanent Bottom-Right Anchor Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-400 text-amber-950 flex items-center justify-center shrink-0">
                <Pin className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  Permanent Anchor Policy: "Canary ads Widget"
                </h4>
                <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                  As configured, the Canary Ads Widget is permanently mounted at the bottom of the right column and does not rotate out. All other dynamic widgets cycle automatically every 2 hours through the active rotational pool.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-950 border border-amber-400">
                STATUS: PINNED PERMANENT
              </span>
            </div>
          </div>

          {/* Current Live Rail Simulation Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Active 2-Hour Rotating Widgets */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-700" />
                    Currently Active in Right Rail (2h Rotation Window)
                  </h3>
                  <p className="text-xs text-slate-700">
                    Showing top 3 active rotational widgets for Cycle #{rotationState.currentStep}. Auto-rotates next in{' '}
                    <span className="font-mono font-bold text-slate-900">
                      {formatCountdown(rotationState.remainingSeconds)}
                    </span>
                    .
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleForceRotate}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-800 hover:bg-slate-100 border border-slate-300 transition shadow-xs flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5 text-slate-600" />
                  <span>Cycle Queue</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {widgetService.getActiveRotationalWidgets(3).map((w, index) => (
                  <div key={w.id} className="relative">
                    <div className="absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold text-[10px] flex items-center justify-center border-2 border-white shadow-xs">
                      #{index + 1}
                    </div>
                    <RotationalWidgetCard widget={w} />
                  </div>
                ))}
              </div>

              {/* Next In Line Queue Preview */}
              <div className="p-4 rounded-2xl bg-white border border-slate-300 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Rotational Queue Standby (Next Cycles)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {widgetService.getRotationalPool().map((w, i) => (
                    <span
                      key={w.id}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: w.accentColor }} />
                      {w.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Permanent Canary Ads Anchor Preview */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Pin className="w-5 h-5 text-amber-700" />
                  Bottom Column Anchor
                </h3>
                <p className="text-xs text-slate-700">
                  Permanent non-rotating anchor slot.
                </p>
              </div>

              <CanaryAdsWidget />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* SUBTAB 2: PROFESSIONAL EDGE "WIDGET CREATOR" STUDIO                      */}
      {/* ======================================================================= */}
      {activeSubTab === 'creator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Editor Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-300 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-950 border border-emerald-400">
                  Edge Type Visual Studio
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {editingWidgetId ? 'Edit Widget Properties' : 'Create New Protocol Widget'}
                </h3>
                <p className="text-xs text-slate-700">
                  Configures time, date, image galleries, video embeds, 2-hour rotation schedule, and telemetry tracking.
                </p>
              </div>

              {editingWidgetId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingWidgetId(null);
                    setCreatorForm({
                      name: '',
                      slug: '',
                      title: '',
                      subtitle: '',
                      description: '',
                      category: 'Advertising',
                      type: 'rotational',
                      isPermanent: false,
                      displayLocation: 'right_column_dynamic',
                      rotationIntervalMinutes: 120,
                      rotationPriority: 1,
                      primaryImageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
                      actionUrl: '/canary-ads',
                      ctaText: 'Explore Now',
                      badgeText: 'FEATURED SPOTLIGHT',
                      accentColor: '#059669',
                      badgeStyle: 'emerald',
                      edgeStyle: 'glassmorphism',
                      status: 'active',
                    });
                  }}
                  className="text-xs text-slate-700 hover:text-slate-900 underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveWidget} className="space-y-5">
              {/* Identity & Taxonomy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Widget Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={creatorForm.name}
                    onChange={(e) =>
                      setCreatorForm({
                        ...creatorForm,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      })
                    }
                    placeholder="e.g. Loansqr Widget, FingerLux, etc."
                    className="w-full text-xs font-bold text-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Unique Slug Identifier
                  </label>
                  <input
                    type="text"
                    value={creatorForm.slug}
                    onChange={(e) => setCreatorForm({ ...creatorForm, slug: e.target.value })}
                    placeholder="e.g. loansqr, fingerlux"
                    className="w-full text-xs font-mono text-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Headline Title <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={creatorForm.title}
                    onChange={(e) => setCreatorForm({ ...creatorForm, title: e.target.value })}
                    placeholder="e.g. Loansqr™ Instant Nano-Liquidity"
                    className="w-full text-xs font-bold text-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={creatorForm.subtitle}
                    onChange={(e) => setCreatorForm({ ...creatorForm, subtitle: e.target.value })}
                    placeholder="e.g. Collateralized Micro-Loans"
                    className="w-full text-xs text-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Card Narrative & Description
                </label>
                <textarea
                  rows={2}
                  value={creatorForm.description}
                  onChange={(e) => setCreatorForm({ ...creatorForm, description: e.target.value })}
                  placeholder="Comprehensive description of the service, product, or tool..."
                  className="w-full text-xs text-slate-900 p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Placement & Rotation Rules */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  Placement & 2-Hour Auto-Rotation Policy
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Placement Style
                    </label>
                    <select
                      value={creatorForm.isPermanent ? 'permanent' : 'rotational'}
                      onChange={(e) => {
                        const isPerm = e.target.value === 'permanent';
                        setCreatorForm({
                          ...creatorForm,
                          isPermanent: isPerm,
                          displayLocation: isPerm ? 'bottom_right_column' : 'right_column_dynamic',
                        });
                      }}
                      className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="rotational">2-Hour Auto-Rotating (Dynamic Rail)</option>
                      <option value="permanent">Permanent Pinned (Bottom Right Column)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Rotation Interval (Minutes)
                    </label>
                    <input
                      type="number"
                      disabled={creatorForm.isPermanent}
                      value={creatorForm.rotationIntervalMinutes || 120}
                      onChange={(e) =>
                        setCreatorForm({ ...creatorForm, rotationIntervalMinutes: Number(e.target.value) })
                      }
                      className="w-full text-xs font-mono font-bold text-slate-900 px-3 py-2 rounded-xl border border-slate-300 bg-white disabled:bg-slate-200"
                    />
                    <span className="text-[10px] text-slate-700">120 minutes = 2 hours automatic swap</span>
                  </div>
                </div>
              </div>

              {/* Rich Media Assets: Image & Video URLs */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-sky-700" />
                  Media Engine (Images & Videos)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Primary Banner Image URL
                    </label>
                    <input
                      type="text"
                      value={creatorForm.primaryImageUrl}
                      onChange={(e) => setCreatorForm({ ...creatorForm, primaryImageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full text-xs text-slate-900 px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Video Stream URL (MP4 / WebM / HLS)
                    </label>
                    <input
                      type="text"
                      value={creatorForm.primaryVideoUrl}
                      onChange={(e) => setCreatorForm({ ...creatorForm, primaryVideoUrl: e.target.value })}
                      placeholder="https://commondatastorage.googleapis.com/...mp4"
                      className="w-full text-xs text-slate-900 px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* CTAs and Deep Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Primary Action Link <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={creatorForm.actionUrl}
                    onChange={(e) => setCreatorForm({ ...creatorForm, actionUrl: e.target.value })}
                    placeholder="/loansqr or https://..."
                    className="w-full text-xs font-mono text-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Primary CTA Text
                  </label>
                  <input
                    type="text"
                    value={creatorForm.ctaText}
                    onChange={(e) => setCreatorForm({ ...creatorForm, ctaText: e.target.value })}
                    placeholder="e.g. Calculate Loan, Explore Now"
                    className="w-full text-xs font-bold text-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              {/* Accent & Badge Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={creatorForm.badgeText}
                    onChange={(e) => setCreatorForm({ ...creatorForm, badgeText: e.target.value })}
                    placeholder="e.g. VIP SUITE, INSTANT 60S"
                    className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Accent Color Hex
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={creatorForm.accentColor || '#059669'}
                      onChange={(e) => setCreatorForm({ ...creatorForm, accentColor: e.target.value })}
                      className="w-9 h-9 p-0.5 rounded-xl border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={creatorForm.accentColor}
                      onChange={(e) => setCreatorForm({ ...creatorForm, accentColor: e.target.value })}
                      className="w-full text-xs font-mono font-bold text-slate-900 px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={creatorForm.category}
                    onChange={(e) => setCreatorForm({ ...creatorForm, category: e.target.value })}
                    placeholder="Fintech, Luxury, Advertising"
                    className="w-full text-xs font-bold text-slate-900 px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('matrix')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingWidgetId ? 'Save Changes' : 'Publish to Database Table & Live Rail'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Real-Time Device Simulator Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-emerald-700" />
                  Live Edge Visualizer
                </h4>
                <p className="text-[11px] text-slate-700">Real-time simulation in right-rail format.</p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-300">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition ${
                    previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                  title="Desktop Rail View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition ${
                    previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                  title="Mobile Drawer View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated Chassis Frame */}
            <div
              className={`mx-auto rounded-3xl bg-slate-100 border-4 border-slate-300 p-4 shadow-xl transition-all ${
                previewDevice === 'desktop' ? 'w-full max-w-sm' : 'w-[290px]'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-500 mb-2 flex items-center justify-between pb-1 border-b border-slate-300">
                <span>RIGHT COLUMN RAIL</span>
                <span>{creatorForm.isPermanent ? 'PINNED (PERMANENT)' : '2H ROTATIONAL'}</span>
              </div>

              {creatorForm.isPermanent ? (
                <CanaryAdsWidget customWidget={previewWidgetEntity} />
              ) : (
                <RotationalWidgetCard widget={previewWidgetEntity} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* SUBTAB 3: DATABASE TABLE EXPLORER                                       */}
      {/* ======================================================================= */}
      {activeSubTab === 'table' && (
        <div className="bg-white rounded-3xl border border-slate-300 p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Widgets Database Table Records ({filteredWidgets.length})
              </h3>
              <p className="text-xs text-slate-700">
                Connected to <span className="font-mono font-bold">widgets</span> schema with verified fields for time, date, images, videos, clicks, and analytics.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, title, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs font-bold text-slate-900 px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    Category: {c}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-xs font-bold text-slate-900 px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="all">Type: All</option>
                <option value="permanent">Permanent Only</option>
                <option value="rotational">2H Rotational Only</option>
              </select>
            </div>
          </div>

          {/* Interactive Data Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-300">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-800 font-black border-b border-slate-300 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Widget Identity</th>
                  <th className="py-3 px-4">Type & Placement</th>
                  <th className="py-3 px-4">Rotation Policy</th>
                  <th className="py-3 px-4">Media Assets</th>
                  <th className="py-3 px-4">Clicks (CTR)</th>
                  <th className="py-3 px-4">Impressions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredWidgets.map((w) => {
                  const ctr =
                    w.impressions > 0
                      ? ((w.clicks / w.impressions) * 100).toFixed(2)
                      : '0.00';
                  return (
                    <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                            style={{ backgroundColor: w.accentColor || '#059669' }}
                          >
                            <span className="font-mono text-xs font-black">
                              {w.name.substring(0, 1)}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {w.name}
                              {w.isPermanent && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-100 text-amber-950 border border-amber-400">
                                  PINNED
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-700 font-mono">
                              {w.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800">{w.category}</span>
                        <span className="block text-[10px] text-slate-700 font-mono">
                          {w.displayLocation}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {w.isPermanent ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-400">
                            Permanent (0m)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                            2 Hours ({w.rotationIntervalMinutes}m)
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-[11px] text-slate-700">
                          <span className="flex items-center gap-0.5">
                            <ImageIcon className="w-3 h-3 text-slate-500" />
                            {w.images?.length || (w.primaryImageUrl ? 1 : 0)}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Video className="w-3 h-3 text-slate-500" />
                            {w.videos?.length || (w.primaryVideoUrl ? 1 : 0)}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900">
                          {w.clicks.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold">
                          {ctr}% CTR
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {w.impressions.toLocaleString()}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(w.id, w.status)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                            w.status === 'active'
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                              : 'bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                        >
                          {w.status.toUpperCase()}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(w)}
                            className="p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition"
                            title="Edit Widget"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {!w.isPermanent && (
                            <button
                              type="button"
                              onClick={() => handleDelete(w.id, w.name, w.isPermanent)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Widget"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* SUBTAB 4: FEEDBACK & ANALYTICS HUB                                      */}
      {/* ======================================================================= */}
      {activeSubTab === 'feedback' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feedback Scores Overview */}
          <div className="bg-white rounded-3xl border border-slate-300 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              Community Sentiment & Ratings
            </h3>
            <p className="text-xs text-slate-700">
              Aggregated from verified user clicks, interactions, and direct review submissions.
            </p>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
              <div className="text-2xl font-black font-mono text-emerald-950">96.4%</div>
              <p className="text-xs font-bold text-emerald-900">
                Positive Feedback Rating across all right-rail units
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-800">
                <span>Positive Sentiment</span>
                <span className="font-mono font-bold text-emerald-700">890 ratings</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full w-[96%]" />
              </div>

              <div className="flex items-center justify-between text-slate-800 pt-2">
                <span>Neutral Sentiment</span>
                <span className="font-mono font-bold text-amber-700">28 ratings</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full w-[3%]" />
              </div>

              <div className="flex items-center justify-between text-slate-800 pt-2">
                <span>Negative Sentiment</span>
                <span className="font-mono font-bold text-rose-700">6 ratings</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-rose-500 h-2 rounded-full w-[1%]" />
              </div>
            </div>
          </div>

          {/* User Feedback Comments Stream */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-300 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-slate-700" />
              Recent Feedback Logs & Comments
            </h3>
            <p className="text-xs text-slate-700">
              Direct telemetry feedback recorded per widget impression and click event.
            </p>

            <div className="space-y-3">
              {[
                {
                  widget: 'Canary Ads Widget',
                  user: '@sovereign_lead',
                  comment: 'Exceptional bottom-column permanence. Conversions increased by 42% on campaign launch.',
                  rating: 5,
                  time: '12m ago',
                },
                {
                  widget: 'Loansqr Widget',
                  user: '@fintech_trader',
                  comment: 'Nano-liquidity calculator is instant and super clear. Disbursed directly to wallet.',
                  rating: 5,
                  time: '34m ago',
                },
                {
                  widget: 'FingerLux Widget',
                  user: '@vip_collector',
                  comment: 'Luxury gem auction preview is gorgeous. Flawless 4K asset resolution.',
                  rating: 5,
                  time: '1h ago',
                },
                {
                  widget: 'SuperVI Widget',
                  user: '@node_validator',
                  comment: 'Live consensus telemetry verifies zero-knowledge proofs cleanly without lag.',
                  rating: 5,
                  time: '2h ago',
                },
              ].map((log, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-slate-900">{log.widget}</span>
                      <span className="text-[10px] text-slate-600 font-mono">{log.user}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(log.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3 h-3 fill-amber-500" />
                      ))}
                      <span className="text-[10px] text-slate-500 ml-1">{log.time}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    "{log.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterWidgetConsole;
