import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Music,
  Tv,
  Video,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Edit3,
  Play,
  Pause,
  Volume2,
  Upload,
  ExternalLink,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  Tag,
  Sparkles,
  Layers,
  ChevronDown,
  Image as ImageIcon,
  ShieldAlert,
  Film,
  Globe,
  CheckCircle
} from 'lucide-react';
import {
  MediaStreamingServiceKey,
  MediaStreamingConsoleItem,
  MediaStreamingServiceOverview,
  SpawnedMediaConsole
} from '../../types/mediaStreamingConsole';
import mediaStreamingConsoleService from '../../services/mediaStreamingConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';
import { useAppContext } from '../../contexts/AppContext';
import { useBeatwaveNG } from '../../contexts/BeatwaveNGContext';

// Core VOD Monetization Models for Dancia-4Tv
export const VOD_MONETIZATION_MODELS = [
  { value: 'SVOD', label: 'SVOD (Subscription Video on Demand - Unlimited tier access)', desc: 'Recurring subscription access (Netflix model)' },
  { value: 'TVOD', label: 'TVOD (Transactional Video on Demand - Pay-per-view / Rental in FIC)', desc: 'Pay per rental or purchase in FIC (iTunes/Apple TV model)' },
  { value: 'AVOD', label: 'AVOD (Ad-Supported Video on Demand - Free with Canary Ads)', desc: 'Free-to-watch monetized via sovereign Canary Ads (YouTube/Tubi model)' },
  { value: 'Hybrid', label: 'Hybrid (Base Subscription + Transactional Premium Releases)', desc: 'Tier subscription with optional TVOD early-window releases' }
];

// Digital Broadcast Media Content Acquisition & Distribution Licensors
export const VOD_ACQUISITION_LICENSORS = [
  { value: 'FilmOne Entertainment', label: 'FilmOne Entertainment (West African Theatrical & SVOD Rights)' },
  { value: 'iROKOtv', label: 'iROKOtv (Nollywood Digital VOD & Film Catalog)' },
  { value: 'Africa Magic (MultiChoice)', label: 'Africa Magic MultiChoice (Regional DTH, Cable & OTT Broadcast)' },
  { value: 'Tribe Nation Studios', label: 'Tribe Nation Studios (Motion Picture Production & Acquisition)' },
  { value: 'Virtual Media Network Limited', label: 'Virtual Media Network (AI-Driven Content Creation & Distribution)' },
  { value: 'View Africa Television (VATV)', label: 'View Africa Television VATV (DTH, IPTV & OTT Global Channels)' },
  { value: 'Globecast', label: 'Globecast (Global Satellite/IP Fiber Transport & Cloud Playout)' },
  { value: 'BBC Studios', label: 'BBC Studios (Commercial Production & Multi-Channel Distribution)' },
  { value: 'Sony Pictures / NBCUniversal / Disney', label: 'Sony Pictures / NBCUniversal / Disney (Multinational Conglomerate Syndicate)' },
  { value: 'Sovereign Independent', label: 'Sovereign Independent Creator (Direct Decentralized Protocol Ingest)' }
];

// Standard Age Compliance Ratings
export const CONTENT_RATINGS = [
  { value: 'G', label: 'G (General Audiences)' },
  { value: 'PG', label: 'PG (Parental Guidance Suggested)' },
  { value: 'PG-13', label: 'PG-13 (Parents Strongly Cautioned)' },
  { value: '16+', label: '16+ (Mature Teens & Young Adults)' },
  { value: '18+', label: '18+ Mature (Restricted / Adult Themes)' },
  { value: 'Restricted', label: 'Restricted (Compliance Review Required)' }
];

// Curated platform genres for each streaming microservice
export const SERVICE_GENRES: Record<MediaStreamingServiceKey, string[]> = {
  beatwaveng: [
    'Afrobeats',
    'Amapiano',
    'Afro-Fusion',
    'Highlife',
    'Fuji & Apala',
    'Gospel & Spiritual',
    'Hip-Hop & Rap',
    'R&B & Neo-Soul',
    'Electronic & Afro-House',
    'Reggae & Dancehall',
    'Jazz & Afro-Jazz',
    'Classical & Instrumental',
    'Traditional & Folk',
    'Spoken Word & Podcast',
    'Alté & Indie'
  ],
  dancia4tv: [
    'Music Videos',
    'Live Concerts & Festivals',
    'Dance Battles & Choreography',
    'Documentary & Culture',
    'Creative Studio & Behind The Scenes',
    'Film & Short Cinema',
    'Comedy & Skits',
    'News & Interviews',
    'Masterclasses & Tutorials',
    'Temporal Drops & Premiere Specials'
  ],
  videobox: [
    'Cinematic 4K Showcase',
    'Short Films & Animation',
    'Drone & Nature Scapes',
    'VR & 360 Immersion',
    'Tech & Coding Walkthroughs',
    'Luxury & Automotive',
    'Experimental Visuals'
  ]
};

// 3 Media & Streaming Microservices Definitions
export const MEDIA_STREAMING_SERVICES: {
  key: MediaStreamingServiceKey;
  name: string;
  route: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  defaultCategory: string;
}[] = [
  {
    key: 'beatwaveng',
    name: 'BeatwaveNG Audio',
    route: '/beatwaveng',
    category: 'Audio & Music Stems',
    icon: Music,
    description: 'Master track uploads, audio stems, BPM tempo quantizing, key detection, and royalty licensing.',
    defaultCategory: 'Afrobeats'
  },
  {
    key: 'dancia4tv',
    name: 'Dancia-4Tv Video',
    route: '/dancia4tv',
    category: 'Broadcast & HLS',
    icon: Tv,
    description: '24/7 Live broadcast channels, EPG program guides, ultra-low latency streams, and VOD showcase.',
    defaultCategory: 'Live Broadcast'
  },
  {
    key: 'videobox',
    name: 'VideoBox Showcases',
    route: '/videobox',
    category: 'Video Reels & Duets',
    icon: Video,
    description: 'Creator reels, viral video showcases, vertical short-form embeds, and cinematic trailers.',
    defaultCategory: 'Gaming Showcase'
  }
];

export const MasterStreamingMediaConsole: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const beatwave = useBeatwaveNG();

  // Active Service State
  const [activeService, setActiveService] = useState<MediaStreamingServiceKey>('beatwaveng');
  const [items, setItems] = useState<MediaStreamingConsoleItem[]>([]);
  const [overview, setOverview] = useState<Record<MediaStreamingServiceKey, MediaStreamingServiceOverview> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Preview Player State
  const [playingItemId, setPlayingItemId] = useState<number | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MediaStreamingConsoleItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isSpawnerModalOpen, setIsSpawnerModalOpen] = useState<boolean>(false);

  // Media Master Upload State
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Album Cover / Cover Art / LP Sleeve Upload State
  const [coverUploadProgress, setCoverUploadProgress] = useState<number>(0);
  const [isUploadingCover, setIsUploadingCover] = useState<boolean>(false);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  // Spawner Form State
  const [spawnName, setSpawnName] = useState<string>('');
  const [spawnDescription, setSpawnDescription] = useState<string>('');
  const [spawnedConsoles, setSpawnedConsoles] = useState<SpawnedMediaConsole[]>([]);

  // VoD Ingest Engine State for Dancia-4Tv
  const [vodIngestMode, setVodIngestMode] = useState<'upload' | 'pull'>('upload');
  const [pullStreamUrl, setPullStreamUrl] = useState<string>('');
  const [pullTitle, setPullTitle] = useState<string>('');
  const [pullLicensor, setPullLicensor] = useState<string>('FilmOne Entertainment');
  const [pullVodModel, setPullVodModel] = useState<string>('SVOD');
  const [pullGenre, setPullGenre] = useState<string>('Film & Short Cinema');
  const [pullRating, setPullRating] = useState<string>('PG-13');
  const [pullCensored, setPullCensored] = useState<boolean>(false);
  const [isPulling, setIsPulling] = useState<boolean>(false);

  // Item Form State
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    category: string;
    subcategory: string;
    description: string;
    media_url: string;
    media_type: 'audio' | 'video' | 'stream' | 'stem';
    thumbnail_url: string;
    duration_seconds: number;
    bpm: number;
    musical_key: string;
    stream_latency_mode: 'ultra_low' | 'standard' | 'dvr';
    resolution: string;
    fic_bounty: number;
    license_fee_fic: number;
    tags: string;
    voice_prompt: string;
    creator_name: string;
    status: 'active' | 'frozen' | 'draft' | 'archived' | 'censored' | 'suspended';
    vod_model: string;
    acquisition_source: string;
    external_pull_url: string;
    content_rating: string;
  }>({
    title: '',
    slug: '',
    category: 'Afrobeats',
    subcategory: 'Master Track',
    description: '',
    media_url: '',
    media_type: 'audio',
    thumbnail_url: '',
    duration_seconds: 180,
    bpm: 120,
    musical_key: 'C Major',
    stream_latency_mode: 'standard',
    resolution: '1080p',
    fic_bounty: 100,
    license_fee_fic: 10,
    tags: 'Afrobeats, Audio, Stem',
    voice_prompt: 'owo_ni_koko',
    creator_name: 'Master Studio',
    status: 'active',
    vod_model: 'SVOD',
    acquisition_source: 'FilmOne Entertainment',
    external_pull_url: '',
    content_rating: 'PG-13'
  });

  // Load Overview Data
  const loadOverview = useCallback(async () => {
    try {
      const data = await mediaStreamingConsoleService.getOverview();
      setOverview(data);
    } catch (_err) {
      // Error handled silently
    }
  }, []);

  // Load Items for Active Service
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const { items: fetchedItems } = await mediaStreamingConsoleService.getServiceItems(activeService, {
        search: searchTerm,
        status: statusFilter,
        category: categoryFilter,
        limit: 100
      });
      setItems(fetchedItems);
    } catch (_err) {
      showToast('Error loading media items', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeService, searchTerm, statusFilter, categoryFilter, showToast]);

  // Load Spawned Consoles
  const loadSpawned = useCallback(async () => {
    try {
      const list = await mediaStreamingConsoleService.getSpawnedConsoles();
      setSpawnedConsoles(list);
    } catch (_err) {
      // Error handled silently
    }
  }, []);

  useEffect(() => {
    loadOverview();
    loadItems();
    loadSpawned();
  }, [loadOverview, loadItems, loadSpawned]);

  // Stop audio preview & reset category filter when changing service
  useEffect(() => {
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current.currentTime = 0;
      setPlayingItemId(null);
    }
    setCategoryFilter('ALL');
  }, [activeService]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
    };
  }, []);

  // Toggle Audio Preview
  const handleToggleAudio = (item: MediaStreamingConsoleItem) => {
    if (playingItemId === item.id) {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current.currentTime = 0;
      }
      setPlayingItemId(null);
    } else {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current.currentTime = 0;
      }

      if (!item.media_url || !item.media_url.trim()) {
        showToast('No audio or media file source attached to this record', 'error');
        return;
      }

      const rawUrl = item.media_url.trim();
      const audio = new Audio(rawUrl);
      audioPreviewRef.current = audio;

      audio.play().then(() => {
        showToast(`Playing audio preview: ${item.title}`, 'info');
      }).catch((playErr: any) => {
        showToast(`Unable to play audio directly (${playErr?.message || 'Check media file or server connection'})`, 'info');
        setPlayingItemId(null);
      });

      audio.onended = () => {
        setPlayingItemId(null);
      };
      setPlayingItemId(item.id);
    }
  };

  // Toggle Freeze Handler
  const handleToggleFreeze = async (id: number) => {
    try {
      const updated = await mediaStreamingConsoleService.toggleFreeze(activeService, id);
      setItems(prev => prev.map(item => item.id === id ? updated : item));
      loadOverview();
      audioEngine.playVoiceLine('wahala');
      showToast(`Item #${id} is now ${updated.status.toUpperCase()}`, 'info');
    } catch (_err) {
      showToast('Error toggling freeze state', 'error');
    }
  };

  // Toggle Censor Handler (18+ Sensitive Content Mask)
  const handleToggleCensor = async (item: MediaStreamingConsoleItem) => {
    try {
      const nextStatus = item.status === 'censored' ? 'active' : 'censored';
      const updated = await mediaStreamingConsoleService.updateItem(activeService, item.id, {
        status: nextStatus as any
      });
      setItems(prev => prev.map(i => i.id === item.id ? updated : i));
      loadOverview();
      audioEngine.playVoiceLine('wahala');
      showToast(
        nextStatus === 'censored'
          ? `Item #${item.id} (${item.title}) has been CENSORED with 18+ sensitive mask.`
          : `Censorship lifted on Item #${item.id} (${item.title}): Now ACTIVE.`,
        nextStatus === 'censored' ? 'warning' : 'success'
      );
    } catch (_err) {
      showToast('Error toggling censorship status', 'error');
    }
  };

  // Ingest External VoD Stream (Movie Platforms & Curation Engines)
  const handleIngestExternalStream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pullStreamUrl.trim()) {
      showToast('External stream URL is required', 'error');
      return;
    }
    if (!pullTitle.trim()) {
      showToast('Stream title is required', 'error');
      return;
    }

    setIsPulling(true);
    try {
      const isHls = /\.m3u8/i.test(pullStreamUrl);
      const created = await mediaStreamingConsoleService.createItem(activeService, {
        title: pullTitle.trim(),
        slug: pullTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: pullGenre,
        subcategory: `${pullVodModel} Syndication`,
        description: `External VoD content curated and acquired from ${pullLicensor}. Monetization model: ${pullVodModel}.`,
        media_url: pullStreamUrl.trim(),
        media_type: isHls ? 'stream' : 'video',
        thumbnail_url: formData.thumbnail_url || '/assets/branding/fingermobile/drawer-splash-logo.webp',
        duration_seconds: 7200,
        stream_latency_mode: 'standard',
        resolution: '4K UHD',
        status: pullCensored ? 'censored' : 'active',
        fic_bounty: 250,
        license_fee_fic: 25,
        creator_name: pullLicensor,
        tags: [pullVodModel, pullLicensor.split(' ')[0], 'VOD', 'Syndication'],
        metadata: {
          vod_model: pullVodModel,
          acquisition_source: pullLicensor,
          external_pull_url: pullStreamUrl.trim(),
          content_rating: pullRating
        }
      });

      setItems(prev => [...prev, created]);
      loadOverview();
      audioEngine.playVoiceLine('blessings');
      showToast(`Ingested "${created.title}" from ${pullLicensor} into Dancia-4Tv (${pullVodModel})!`, 'success');
      setIsUploadModalOpen(false);
      setPullStreamUrl('');
      setPullTitle('');
    } catch (_err) {
      showToast('Failed to ingest external stream', 'error');
    } finally {
      setIsPulling(false);
    }
  };

  // Move Item Up / Down (Reorder)
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Recalculate display_order sequential values
    const updatedOrders = newItems.map((item, idx) => ({
      id: item.id,
      display_order: idx + 1
    }));

    setItems(newItems.map((item, idx) => ({ ...item, display_order: idx + 1 })));

    try {
      await mediaStreamingConsoleService.reorderItems(activeService, updatedOrders);
      audioEngine.playVoiceLine('sweet');
      showToast('New arrangement pushed to PostgreSQL live!', 'success');
    } catch (_err) {
      showToast('Failed to save arrangement order', 'error');
      loadItems();
    }
  };

  // Delete Item Handler
  const handleDeleteItem = async (id: number, title: string) => {
    if (!window.confirm(`Permanently delete "${title}" from ${activeService}?`)) return;

    try {
      await mediaStreamingConsoleService.deleteItem(activeService, id);
      setItems(prev => prev.filter(item => item.id !== id));
      loadOverview();
      showToast(`Deleted ${title}`, 'success');
    } catch (_err) {
      showToast('Error deleting item', 'error');
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    const currentMeta = MEDIA_STREAMING_SERVICES.find(s => s.key === activeService);
    const availableGenres = SERVICE_GENRES[activeService] || ['General'];
    setEditingItem(null);
    setFormData({
      title: '',
      slug: '',
      category: availableGenres[0] || (currentMeta ? currentMeta.defaultCategory : 'General'),
      subcategory: activeService === 'beatwaveng' ? 'Master Track' : activeService === 'dancia4tv' ? 'Broadcast' : 'Showcase',
      description: '',
      media_url: '',
      media_type: activeService === 'beatwaveng' ? 'audio' : activeService === 'dancia4tv' ? 'stream' : 'video',
      thumbnail_url: '',
      duration_seconds: activeService === 'beatwaveng' ? 210 : activeService === 'dancia4tv' ? 0 : 90,
      bpm: activeService === 'beatwaveng' ? 124 : 120,
      musical_key: 'F# Minor',
      stream_latency_mode: activeService === 'dancia4tv' ? 'ultra_low' : 'standard',
      resolution: activeService === 'dancia4tv' ? '4K UHD' : '1080p',
      fic_bounty: 200,
      license_fee_fic: 15,
      tags: `${activeService}, media, master`,
      voice_prompt: 'owo_ni_koko',
      creator_name: 'Master Sound Studio',
      status: 'active',
      vod_model: 'SVOD',
      acquisition_source: 'FilmOne Entertainment',
      external_pull_url: '',
      content_rating: 'PG-13'
    });
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: MediaStreamingConsoleItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      category: item.category,
      subcategory: item.subcategory || '',
      description: item.description,
      media_url: item.media_url,
      media_type: item.media_type,
      thumbnail_url: item.thumbnail_url || '',
      duration_seconds: item.duration_seconds || 0,
      bpm: item.bpm || 120,
      musical_key: item.musical_key || 'C Major',
      stream_latency_mode: item.stream_latency_mode || 'standard',
      resolution: item.resolution || '1080p',
      fic_bounty: Number(item.fic_bounty) || 0,
      license_fee_fic: Number(item.license_fee_fic) || 0,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
      voice_prompt: item.voice_prompt || 'owo_ni_koko',
      creator_name: item.creator_name || 'Master Studio',
      status: item.status || 'active',
      vod_model: item.metadata?.vod_model || 'SVOD',
      acquisition_source: item.metadata?.acquisition_source || 'FilmOne Entertainment',
      external_pull_url: item.metadata?.external_pull_url || '',
      content_rating: item.metadata?.content_rating || 'PG-13'
    });
    setIsEditModalOpen(true);
  };

  // Save (Create or Update) Item Handler
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    const payload: Partial<MediaStreamingConsoleItem> = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      category: formData.category,
      subcategory: formData.subcategory,
      description: formData.description,
      media_url: formData.media_url.trim() || '/audio/african/small-combo.mp3',
      media_type: formData.media_type,
      thumbnail_url: formData.thumbnail_url.trim(),
      duration_seconds: Number(formData.duration_seconds) || 0,
      bpm: Number(formData.bpm) || 120,
      musical_key: formData.musical_key,
      stream_latency_mode: formData.stream_latency_mode,
      resolution: formData.resolution,
      status: formData.status,
      fic_bounty: Number(formData.fic_bounty) || 0,
      license_fee_fic: Number(formData.license_fee_fic) || 0,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      voice_prompt: formData.voice_prompt,
      creator_name: formData.creator_name.trim() || 'Master Studio',
      metadata: {
        ...(editingItem?.metadata || {}),
        vod_model: formData.vod_model,
        acquisition_source: formData.acquisition_source,
        external_pull_url: formData.external_pull_url.trim(),
        content_rating: formData.content_rating
      }
    };

    try {
      if (editingItem) {
        const updated = await mediaStreamingConsoleService.updateItem(activeService, editingItem.id, payload);
        setItems(prev => prev.map(item => item.id === editingItem.id ? updated : item));
        showToast(`Item #${editingItem.id} updated live in PostgreSQL!`, 'success');
      } else {
        const created = await mediaStreamingConsoleService.createItem(activeService, payload);
        setItems(prev => [...prev, created]);
        showToast(`Published "${created.title}" live!`, 'success');
      }
      loadOverview();
      setIsEditModalOpen(false);
      audioEngine.playVoiceLine('blessings');
    } catch (_err) {
      showToast('Error saving item to database', 'error');
    }
  };

  // File Upload Handler (Multipart / Form-Data direct to Express)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res = await mediaStreamingConsoleService.uploadMedia(file, (percent) => {
        setUploadProgress(percent);
      });

      setFormData(prev => ({
        ...prev,
        media_url: res.url,
        title: prev.title || file.name.replace(/\.[^/.]+$/, "")
      }));

      audioEngine.playVoiceLine('owo_ni_koko');
      showToast(`Uploaded ${file.name} directly to Express storage (${res.url})`, 'success');
      setIsUploadModalOpen(false);
    } catch (_err) {
      showToast('Media upload failed', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Album Cover / Cover Art (Record Sleeve / LP Jacket) Upload Handler
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    setCoverUploadProgress(0);

    try {
      const res = await mediaStreamingConsoleService.uploadMedia(file, (percent) => {
        setCoverUploadProgress(percent);
      });

      setFormData(prev => ({
        ...prev,
        thumbnail_url: res.url
      }));

      audioEngine.playVoiceLine('sweet');
      showToast(`Album Cover Art / Record Sleeve uploaded (${file.name})`, 'success');
    } catch (_err) {
      showToast('Album cover upload failed', 'error');
    } finally {
      setIsUploadingCover(false);
      setCoverUploadProgress(0);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  // One-Click Console Spawner Handler
  const handleSpawnConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnName.trim()) {
      showToast('Console name is required', 'error');
      return;
    }

    try {
      const spawned = await mediaStreamingConsoleService.spawnConsole({
        console_name: spawnName.trim(),
        service_key: activeService,
        description: spawnDescription.trim(),
        config: {
          generatedAt: new Date().toISOString(),
          parentService: activeService
        }
      });
      setSpawnedConsoles(prev => [spawned, ...prev]);
      setIsSpawnerModalOpen(false);
      setSpawnName('');
      setSpawnDescription('');
      audioEngine.playVoiceLine('colossal_combo');
      showToast(`One-Click Console "${spawned.console_name}" spawned successfully!`, 'success');
    } catch (_err) {
      showToast('Error spawning new console', 'error');
    }
  };

  const currentServiceMeta = MEDIA_STREAMING_SERVICES.find(s => s.key === activeService)!;
  const currentOverview = overview ? overview[activeService] : null;

  return (
    <div className="w-full bg-slate-50 min-h-screen p-4 sm:p-6 space-y-6">
      {/* 1. Header & Sovereign Authority Strip */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-950 border border-purple-400">
              Autonomous Control Plane
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
              PostgreSQL Port 5433 Live Sync
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <currentServiceMeta.icon className="w-7 h-7 text-indigo-700" />
            Media & Streaming Autonomous Consoles
          </h1>
          <p className="text-sm font-bold text-slate-700 mt-1">
            Total micromanagement of BeatwaveNG master audio, Dancia-4Tv broadcast channels, and VideoBox showcases.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => audioEngine.playVoiceLine('small_combo')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
            title="Test African commentary audio FX"
          >
            <Volume2 className="w-4 h-4 text-slate-700" />
            Test Voice FX
          </button>
          <button
            onClick={() => setIsSpawnerModalOpen(true)}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            1-Click Console Spawner
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Publish New Item
          </button>
        </div>
      </div>

      {/* 2. Microservice Navigation Strip (BeatwaveNG, Dancia-4Tv, VideoBox) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MEDIA_STREAMING_SERVICES.map((srv) => {
          const srvStats = overview ? overview[srv.key] : null;
          const isSelected = activeService === srv.key;
          const SrvIcon = srv.icon;

          return (
            <button
              key={srv.key}
              onClick={() => {
                setActiveService(srv.key);
                setSearchTerm('');
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
              }}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg border ${
                    isSelected ? 'bg-indigo-100 text-indigo-950 border-indigo-300' : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}>
                    <SrvIcon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    srvStats && srvStats.frozenItems > 0
                      ? 'bg-amber-100 text-amber-950 border-amber-400'
                      : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                  }`}>
                    {srvStats ? `${srvStats.activeItems} Active` : 'Syncing'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{srv.name}</h3>
                <p className="text-xs font-bold text-slate-700 line-clamp-2 mt-1">{srv.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">{srv.category}</span>
                <span className="text-indigo-700 font-mono">
                  {srvStats ? `${srvStats.totalItems} Items` : '0'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Operational Overview KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Catalog SKUs</div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            {currentOverview?.totalItems || items.length}
          </div>
          <div className="text-[11px] font-bold text-emerald-700 mt-1">Live in PostgreSQL</div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Broadcasts</div>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
            {currentOverview?.activeItems || items.filter(i => i.status === 'active').length}
          </div>
          <div className="text-[11px] font-bold text-slate-700 mt-1">Serving clients</div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Frozen / DefCon</div>
          <div className="text-2xl font-black text-amber-700 mt-1 font-mono">
            {currentOverview?.frozenItems || items.filter(i => i.status === 'frozen').length}
          </div>
          <div className="text-[11px] font-bold text-slate-700 mt-1">Instant killswitch</div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {activeService === 'beatwaveng' ? 'Avg BPM Tempo' : 'FIC Bounty Pool'}
          </div>
          <div className="text-2xl font-black text-indigo-700 mt-1 font-mono">
            {activeService === 'beatwaveng' 
              ? `${currentOverview?.avgBpm || 120} BPM`
              : `${currentOverview?.totalBountyFic || 0} FIC`
            }
          </div>
          <div className="text-[11px] font-bold text-slate-700 mt-1">
            {activeService === 'beatwaveng' ? 'Beat quantize engine' : 'Earned by community'}
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs col-span-2 sm:col-span-1">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Direct Public Screen</div>
          <button
            onClick={() => navigate(currentServiceMeta.route)}
            className="w-full mt-2 py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-colors"
          >
            Launch {currentServiceMeta.name}
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Filter, Search & Reorder Action Bar */}
      <div className="bg-white border border-slate-300 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-700 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${currentServiceMeta.name}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-900 border border-slate-300 rounded-xl bg-white outline-none focus:border-indigo-600"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-slate-700" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl text-xs outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="frozen">Frozen Only</option>
              <option value="censored">Censored (18+) Only</option>
              <option value="suspended">Suspended Only</option>
              <option value="draft">Draft Only</option>
            </select>
          </div>

          {/* Platform Genre Filter with Dropdown Arrow */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Tag className="w-4 h-4 text-slate-700" />
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-2 pr-7 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl text-xs outline-none appearance-none cursor-pointer"
              >
                <option value="ALL">All Genres</option>
                {(SERVICE_GENRES[activeService] || []).map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Reload Button */}
          <button
            onClick={() => {
              loadOverview();
              loadItems();
            }}
            className="p-2 border border-slate-300 rounded-xl hover:bg-slate-100 text-slate-700"
            title="Reload items from PostgreSQL"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Priority Reordering Notice */}
        <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-700" />
          <span>Arrangement Priority: Use ▲ / ▼ buttons to move items up/down in real time.</span>
        </div>
      </div>

      {/* 5. Autonomous Media Items Table */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-700 border-t-transparent rounded-full mx-auto mb-3" />
            <div className="text-sm font-bold text-slate-800">Streaming live records from PostgreSQL...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-amber-700 mx-auto" />
            <div className="text-base font-black text-slate-900">No media items cataloged yet</div>
            <p className="text-xs font-bold text-slate-700 max-w-sm mx-auto">
              Publish a new track, stem session, or broadcast channel to populate this console.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Publish First Item
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-900 font-black">
                <tr>
                  <th className="py-3 px-3 w-16 text-center">Order</th>
                  <th className="py-3 px-3">Title & Creator</th>
                  <th className="py-3 px-3">Category & Specs</th>
                  <th className="py-3 px-3">Audio / Video Specs</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Bounty / License</th>
                  <th className="py-3 px-3 text-right">Autonomous Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Reorder Buttons (Up / Down) */}
                    <td className="py-3 px-2 text-center">
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        <button
                          onClick={() => handleMoveOrder(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-slate-700 hover:text-indigo-700 disabled:opacity-30 disabled:hover:text-slate-700"
                          title="Move feature up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-black text-slate-900 text-[11px]">
                          #{item.display_order}
                        </span>
                        <button
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={index === items.length - 1}
                          className="p-1 text-slate-700 hover:text-indigo-700 disabled:opacity-30 disabled:hover:text-slate-700"
                          title="Move feature down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Title, Creator, Album Cover & Media Preview */}
                    <td className="py-3 px-3">
                      <div className="flex items-start gap-3">
                        {/* Album Cover / LP Jacket Thumbnail */}
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-300 shrink-0 bg-slate-100 group shadow-xs">
                          {item.thumbnail_url ? (
                            <img
                              src={item.thumbnail_url}
                              alt={item.title}
                              className={`w-full h-full object-cover ${item.status === 'censored' ? 'filter blur-xs' : ''}`}
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-700">
                              <Music className="w-5 h-5" />
                            </div>
                          )}
                          {item.status === 'censored' && (
                            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-2xs flex items-center justify-center text-[8px] font-black text-amber-300 border border-amber-500/50">
                              18+ CENSOR
                            </div>
                          )}
                          <button
                            onClick={() => handleToggleAudio(item)}
                            className={`absolute inset-0 flex items-center justify-center bg-slate-900/50 text-white transition-opacity ${
                              playingItemId === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}
                            title={playingItemId === item.id ? 'Pause Preview' : 'Play Preview'}
                          >
                            {playingItemId === item.id ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5 ml-0.5" />
                            )}
                          </button>
                        </div>

                        {/* Dedicated Play Preview Button */}
                        <button
                          onClick={() => handleToggleAudio(item)}
                          className={`p-2 rounded-xl border mt-0.5 transition-colors shrink-0 ${
                            playingItemId === item.id
                              ? 'bg-indigo-600 text-white border-indigo-700 animate-pulse'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                          }`}
                          title={playingItemId === item.id ? 'Pause Preview' : 'Play Preview'}
                        >
                          {playingItemId === item.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <div className="font-black text-slate-900 text-sm leading-snug truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] font-bold text-slate-700 mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span>By {item.creator_name}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-600">/{item.slug}</span>
                          </div>
                          {item.description && (
                            <p className="text-[11px] font-medium text-slate-700 line-clamp-1 mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category & Subcategory */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.category}</div>
                      <div className="text-[11px] font-bold text-slate-700">{item.subcategory || 'General'}</div>
                      <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300 uppercase">
                        {item.media_type}
                      </span>
                    </td>

                    {/* Audio / Video Specs (BPM, Key, Resolution, Latency) */}
                    <td className="py-3 px-3">
                      {activeService === 'beatwaveng' ? (
                        <div className="space-y-0.5 font-mono text-[11px]">
                          <div className="font-black text-indigo-900">{item.bpm} BPM</div>
                          <div className="font-bold text-slate-700">{item.musical_key || 'C Major'}</div>
                          <div className="text-slate-600 font-medium">{item.duration_seconds}s • {item.resolution}</div>
                        </div>
                      ) : (
                        <div className="space-y-1 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-950 border border-purple-400">
                              {item.metadata?.vod_model || 'SVOD'}
                            </span>
                            <span className="font-black text-indigo-900">{item.resolution || '4K UHD'}</span>
                          </div>
                          <div className="font-bold text-slate-800 text-[10px] truncate max-w-[140px]" title={item.metadata?.acquisition_source || item.creator_name}>
                            🏛️ {item.metadata?.acquisition_source || item.creator_name}
                          </div>
                          <div className="text-slate-600 text-[10px] font-bold">
                            Rating: {item.metadata?.content_rating || 'PG-13'} • {item.duration_seconds > 0 ? `${item.duration_seconds}s` : 'Live Stream'}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                        item.status === 'active'
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                          : item.status === 'frozen'
                          ? 'bg-blue-100 text-blue-950 border-blue-400'
                          : item.status === 'censored'
                          ? 'bg-amber-100 text-amber-950 border-amber-400 font-extrabold'
                          : item.status === 'suspended'
                          ? 'bg-rose-100 text-rose-950 border-rose-400 font-extrabold'
                          : 'bg-slate-100 text-slate-900 border-slate-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'active'
                            ? 'bg-emerald-600'
                            : item.status === 'frozen'
                            ? 'bg-blue-600'
                            : item.status === 'censored'
                            ? 'bg-amber-600'
                            : item.status === 'suspended'
                            ? 'bg-rose-600'
                            : 'bg-slate-500'
                        }`} />
                        {item.status === 'censored' ? 'CENSORED (18+)' : item.status.toUpperCase()}
                      </span>
                    </td>

                    {/* Bounty & License Fee */}
                    <td className="py-3 px-3 font-mono">
                      <div className="font-black text-emerald-800 text-xs">
                        +{item.fic_bounty} FIC
                      </div>
                      <div className="text-[11px] font-bold text-slate-700">
                        Fee: {item.license_fee_fic} FIC
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Beatwave Studio Player Direct Trigger */}
                        {activeService === 'beatwaveng' && (
                          <button
                            onClick={() => {
                              beatwave.playTrack({
                                id: String(item.id),
                                title: item.title,
                                artist: item.creator_name,
                                album: item.category || 'Beatwave Showcase',
                                duration: item.duration_seconds || 180,
                                url: item.media_url,
                                coverArt: item.thumbnail_url || '/images/beatwave-album.png',
                                bpm: item.bpm || 120,
                                key: item.musical_key || 'C Major'
                              });
                              showToast(`Loaded "${item.title}" into Beatwave Studio Player`, 'success');
                            }}
                            className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-300"
                            title="Play in Sovereign Beatwave Player (DAW Equalizer & Stems)"
                          >
                            <Music className="w-3.5 h-3.5 text-indigo-700" />
                          </button>
                        )}

                        {/* African Voice Line Shoutout Trigger */}
                        <button
                          onClick={() => audioEngine.playVoiceLine((item.voice_prompt as AfricanVoiceLine) || 'owo_ni_koko')}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300"
                          title={`Voice Line FX Shoutout: ${item.voice_prompt}`}
                        >
                          <Volume2 className="w-3.5 h-3.5 text-purple-700" />
                        </button>

                        {/* Granular Censor / Uncensor Toggle */}
                        <button
                          onClick={() => handleToggleCensor(item)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            item.status === 'censored'
                              ? 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200'
                              : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                          }`}
                          title={item.status === 'censored' ? 'Uncensor Item (Lift 18+ mask)' : 'Censor Item (Apply 18+ sensitive mask)'}
                        >
                          <ShieldAlert className={`w-3.5 h-3.5 ${item.status === 'censored' ? 'text-amber-800' : 'text-slate-700'}`} />
                        </button>

                        {/* Freeze / Unfreeze */}
                        <button
                          onClick={() => handleToggleFreeze(item.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                            item.status === 'frozen'
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                              : 'bg-blue-100 text-blue-950 border-blue-400 hover:bg-blue-200'
                          }`}
                          title={item.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
                        >
                          {item.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300"
                          title="Edit Media Item"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteItem(item.id, item.title)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-300"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* 6. Spawned Media Consoles Strip */}
      {spawnedConsoles.length > 0 && (
        <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-xs">
          <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-700" />
            Dynamically Spawned Operational Sub-Consoles ({spawnedConsoles.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {spawnedConsoles.map(sp => (
              <div key={sp.id} className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-purple-950">{sp.console_name}</div>
                  <div className="text-[10px] font-mono font-bold text-purple-700">{sp.service_key} • /{sp.slug}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-950 border border-purple-300 rounded-full">
                  LIVE
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Create / Edit Media Item */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-lg font-black text-slate-900">
                {editingItem ? `Edit Item #${editingItem.id}` : `Publish New ${currentServiceMeta.name} Item`}
              </h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                    placeholder="e.g. Afrobeats Master Session"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Vanity Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none font-mono"
                    placeholder="e.g. afrobeats-master-session"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-900 block mb-1 flex items-center justify-between">
                    <span>Platform Genre *</span>
                    <span className="text-[10px] text-indigo-700 font-mono font-bold uppercase">{currentServiceMeta.name}</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2.5 pr-8 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500"
                    >
                      {(SERVICE_GENRES[activeService] || ['General']).map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                    placeholder="e.g. Stem Session"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Media Type</label>
                  <select
                    value={formData.media_type}
                    onChange={(e) => setFormData({ ...formData, media_type: e.target.value as any })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  >
                    <option value="audio">Audio Master</option>
                    <option value="stem">Audio Stem</option>
                    <option value="video">VOD Video</option>
                    <option value="stream">Live HLS Stream</option>
                  </select>
                </div>
              </div>

              {/* Album Cover / Cover Art / LP Record Sleeve Upload Section */}
              <div className="bg-slate-50 border border-slate-300 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-black text-slate-900 text-xs block">
                      {activeService === 'beatwaveng'
                        ? 'Album Cover / Cover Art (Record Sleeve / LP Jacket)'
                        : 'Cover Art / Video Poster & Thumbnail'}
                    </label>
                    <p className="text-[11px] font-medium text-slate-700">
                      {activeService === 'beatwaveng'
                        ? 'Graphic design artwork, record sleeve, or physical vinyl LP packaging (JPEG, PNG, WebP).'
                        : 'Official video poster, broadcast artwork banner, or high-res thumbnail.'}
                    </p>
                  </div>
                  {formData.thumbnail_url && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, thumbnail_url: '' })}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700"
                    >
                      Remove Cover
                    </button>
                  )}
                </div>

                <div className="flex items-start gap-3 pt-1">
                  {/* Thumbnail / Sleeve Image Preview Box */}
                  <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 bg-white overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs">
                    {formData.thumbnail_url ? (
                      <img
                        src={formData.thumbnail_url}
                        alt="Album Cover Art"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-center p-1">
                        <ImageIcon className="w-5 h-5 text-slate-400 mx-auto" />
                        <span className="text-[9px] font-bold text-slate-500 block leading-tight mt-0.5">No Cover</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Trigger & URL fallback */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors">
                        <Upload className="w-3.5 h-3.5 text-indigo-700" />
                        <span>
                          {isUploadingCover
                            ? `Uploading Cover (${coverUploadProgress}%)`
                            : 'Upload Cover Image / LP Sleeve'}
                        </span>
                        <input
                          ref={coverInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                          onChange={handleCoverUpload}
                          disabled={isUploadingCover}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] font-medium text-slate-600">or enter image URL:</span>
                    </div>
                    <input
                      type="text"
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                      className="w-full p-2 font-mono text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                      placeholder="e.g. /uploads/images/album-cover.jpg or https://..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  placeholder="Operational notes, artist credits, broadcast frequency..."
                />
              </div>

              {/* Direct Media File Uploader Trigger */}
              <div>
                <label className="font-bold text-slate-900 block mb-1">Media Resource URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.media_url}
                    onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                    className="flex-1 p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none font-mono"
                    placeholder="e.g. /uploads/media/master.mp3 or https://stream..."
                  />
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-3.5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    Upload File
                  </button>
                </div>
              </div>

              {/* Specs Grid (BPM, Key, Duration, Latency, Resolution) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">BPM Tempo</label>
                  <input
                    type="number"
                    value={formData.bpm}
                    onChange={(e) => setFormData({ ...formData, bpm: parseInt(e.target.value, 10) || 120 })}
                    className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Musical Key</label>
                  <input
                    type="text"
                    value={formData.musical_key}
                    onChange={(e) => setFormData({ ...formData, musical_key: e.target.value })}
                    className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Duration (s)</label>
                  <input
                    type="number"
                    value={formData.duration_seconds}
                    onChange={(e) => setFormData({ ...formData, duration_seconds: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Latency Mode</label>
                  <select
                    value={formData.stream_latency_mode}
                    onChange={(e) => setFormData({ ...formData, stream_latency_mode: e.target.value as any })}
                    className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                  >
                    <option value="ultra_low">Ultra Low (&lt;1s)</option>
                    <option value="standard">Standard HLS</option>
                    <option value="dvr">DVR Window</option>
                  </select>
                </div>
              </div>

              {/* Financials & Voice Prompt */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">FIC Bounty Reward</label>
                  <input
                    type="number"
                    value={formData.fic_bounty}
                    onChange={(e) => setFormData({ ...formData, fic_bounty: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">License Fee (FIC)</label>
                  <input
                    type="number"
                    value={formData.license_fee_fic}
                    onChange={(e) => setFormData({ ...formData, license_fee_fic: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">African Voice Prompt</label>
                  <select
                    value={formData.voice_prompt}
                    onChange={(e) => setFormData({ ...formData, voice_prompt: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  >
                    <option value="owo_ni_koko">Owo Ni Koko (Wealth Voice)</option>
                    <option value="colossal_combo">Colossal Combo (Triumph Voice)</option>
                    <option value="blessings">Blessings Blessings (Abundance)</option>
                    <option value="sweet">Sweet (Praise Voice)</option>
                    <option value="stunning">Stunning (Aesthetic Voice)</option>
                    <option value="madt_o">Madt O (Shock/Excitement)</option>
                    <option value="wahala">Wahala Dey (Warning/Freeze)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  placeholder="Afrobeats, Master, STEM, 128BPM"
                />
              </div>

              {/* VoD Monetization, Licensor & Compliance Settings for Dancia-4Tv */}
              {activeService === 'dancia4tv' && (
                <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black text-indigo-950 uppercase tracking-wide">
                    <Tv className="w-4 h-4 text-indigo-700" />
                    Dancia-4Tv VoD Distribution & Broadcast Curation
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-900 block mb-1">Core VOD Monetization Model</label>
                      <select
                        value={formData.vod_model}
                        onChange={(e) => setFormData({ ...formData, vod_model: e.target.value })}
                        className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                      >
                        {VOD_MONETIZATION_MODELS.map(m => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-900 block mb-1">Content Acquisition Licensor</label>
                      <select
                        value={formData.acquisition_source}
                        onChange={(e) => setFormData({ ...formData, acquisition_source: e.target.value })}
                        className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                      >
                        {VOD_ACQUISITION_LICENSORS.map(lic => (
                          <option key={lic.value} value={lic.value}>{lic.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-900 block mb-1">Content Rating & Age Maturity</label>
                      <select
                        value={formData.content_rating}
                        onChange={(e) => setFormData({ ...formData, content_rating: e.target.value })}
                        className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                      >
                        {CONTENT_RATINGS.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-900 block mb-1">Broadcast / Lifecycle Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                      >
                        <option value="active">Active (On Air / Published)</option>
                        <option value="censored">Censored (18+ Sensitive Mask)</option>
                        <option value="frozen">Frozen (Compliance Quarantine)</option>
                        <option value="suspended">Suspended (Offline)</option>
                        <option value="draft">Draft (Private Preview)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-900 block mb-1">External VoD Stream Pull URL (HLS .m3u8 / MP4 CDN)</label>
                    <input
                      type="url"
                      value={formData.external_pull_url}
                      onChange={(e) => setFormData({ ...formData, external_pull_url: e.target.value })}
                      placeholder="https://cdn.example.com/vod/stream.m3u8"
                      className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold"
                >
                  {editingItem ? 'Save Changes' : 'Publish Live to PostgreSQL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Multipart Direct File Uploader & VoD Ingestion Engine (Real Express Backend) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                {activeService === 'dancia4tv' ? (
                  <>
                    <Tv className="w-5 h-5 text-indigo-700" />
                    Dancia-4Tv VoD Distribution & Acquisition Engine
                  </>
                ) : activeService === 'beatwaveng' ? (
                  <>
                    <Music className="w-5 h-5 text-purple-700" />
                    BeatwaveNG Audio Master & Album Art Studio
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-indigo-700" />
                    Upload Media Asset to Express Backend
                  </>
                )}
              </h2>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Dancia-4Tv Mode Switcher: Direct VoD Upload vs Movie Curation Engine Stream Pull */}
            {activeService === 'dancia4tv' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-300 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setVodIngestMode('upload')}
                    className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                      vodIngestMode === 'upload'
                        ? 'bg-white text-indigo-900 shadow-xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-700" />
                    Direct VoD Video Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setVodIngestMode('pull')}
                    className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
                      vodIngestMode === 'pull'
                        ? 'bg-white text-indigo-900 shadow-xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-indigo-700" />
                    Curated Engine / Stream Pull
                  </button>
                </div>

                {/* Sub-Mode A: Direct Multipart VoD Upload */}
                {vodIngestMode === 'upload' && (
                  <div className="space-y-4">
                    <p className="text-xs font-medium text-slate-700">
                      Upload broadcast video masters (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-900 font-bold">.mp4, .webm, .mov, .mkv</code>) and official poster art directly to Express backend storage.
                    </p>

                    {/* Direct Video File Dropzone */}
                    <div className="border-2 border-dashed border-indigo-300 bg-indigo-50/40 rounded-2xl p-4 text-center space-y-2 hover:border-indigo-600 transition-colors">
                      <Film className="w-7 h-7 text-indigo-700 mx-auto" />
                      <div className="text-xs font-black text-slate-900">
                        VoD Video Master File (.mp4, .mov, .webm, .mkv)
                      </div>
                      <p className="text-[11px] font-medium text-slate-600">
                        High-definition 1080p / 4K UHD video encoding with multi-audio track support.
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="text-xs font-bold text-slate-700 cursor-pointer block mx-auto"
                      />
                    </div>

                    {/* Video Poster Art / LP Jacket Dropzone */}
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-3.5 text-center space-y-2 hover:border-purple-600 transition-colors">
                      <ImageIcon className="w-6 h-6 text-purple-700 mx-auto" />
                      <div className="text-xs font-black text-slate-900">
                        Official Video Poster / Cover Art (Graphic Design / Thumbnail)
                      </div>
                      <p className="text-[11px] font-medium text-slate-600">
                        Broadcast billboard, key art thumbnail, or VoD title poster (JPEG, PNG, WebP).
                      </p>
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                        onChange={handleCoverUpload}
                        disabled={isUploadingCover}
                        className="text-xs font-bold text-slate-700 cursor-pointer block mx-auto"
                      />
                    </div>

                    {/* Metadata Dropdowns for Direct Video */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div>
                        <label className="font-bold text-slate-900 block mb-1">Core VOD Model</label>
                        <select
                          value={formData.vod_model}
                          onChange={(e) => setFormData({ ...formData, vod_model: e.target.value })}
                          className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                        >
                          {VOD_MONETIZATION_MODELS.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-900 block mb-1">Acquisition Licensor</label>
                        <select
                          value={formData.acquisition_source}
                          onChange={(e) => setFormData({ ...formData, acquisition_source: e.target.value })}
                          className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                        >
                          {VOD_ACQUISITION_LICENSORS.map(lic => (
                            <option key={lic.value} value={lic.value}>{lic.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-900 block mb-1">Curated Dancia-4Tv Genre</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                        >
                          {(SERVICE_GENRES.dancia4tv || []).map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-900 block mb-1">Content Rating</label>
                        <select
                          value={formData.content_rating}
                          onChange={(e) => setFormData({ ...formData, content_rating: e.target.value })}
                          className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                        >
                          {CONTENT_RATINGS.map(r => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-Mode B: Curated VoD Stream Pull (Movie Engines, OTT CDN, Globecast, BBC, iROKOtv, FilmOne) */}
                {vodIngestMode === 'pull' && (
                  <form onSubmit={handleIngestExternalStream} className="space-y-3.5 text-xs">
                    <p className="text-xs font-medium text-slate-700">
                      Curate and pull licensed video content across global distribution networks, OTT satellite/fiber playout feeds, and video syndication engines.
                    </p>

                    <div>
                      <label className="font-bold text-slate-900 block mb-1">Video / Movie Title *</label>
                      <input
                        type="text"
                        required
                        value={pullTitle}
                        onChange={(e) => setPullTitle(e.target.value)}
                        placeholder="e.g. The Wedding Party, King of Boys, Anikulapo..."
                        className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-900 block mb-1">External VoD Stream / Playout URL *</label>
                      <input
                        type="url"
                        required
                        value={pullStreamUrl}
                        onChange={(e) => setPullStreamUrl(e.target.value)}
                        placeholder="https://ott.broadcaster.com/live/stream.m3u8 or https://cdn.movie.com/video.mp4"
                        className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none font-mono"
                      />
                      <span className="text-[11px] font-medium text-slate-600 block mt-1">
                        Supports HLS playlists (.m3u8), MP4 CDN streams, IPTV/OTT feeds, or Globecast / BBC Studios / FilmOne / iROKOtv IP fiber streams.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div>
                        <label className="font-bold text-slate-900 block mb-1">Content Acquisition Partner</label>
                        <select
                          value={pullLicensor}
                          onChange={(e) => setPullLicensor(e.target.value)}
                          className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                        >
                          {VOD_ACQUISITION_LICENSORS.map(lic => (
                            <option key={lic.value} value={lic.value}>{lic.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-900 block mb-1">Core VOD Model</label>
                        <select
                          value={pullVodModel}
                          onChange={(e) => setPullVodModel(e.target.value)}
                          className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                        >
                          {VOD_MONETIZATION_MODELS.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-900 block mb-1">Curated Genre</label>
                        <select
                          value={pullGenre}
                          onChange={(e) => setPullGenre(e.target.value)}
                          className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                        >
                          {(SERVICE_GENRES.dancia4tv || []).map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-900 block mb-1">Content Rating</label>
                        <select
                          value={pullRating}
                          onChange={(e) => setPullRating(e.target.value)}
                          className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                        >
                          {CONTENT_RATINGS.map(r => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                      <input
                        type="checkbox"
                        id="censorTogglePull"
                        checked={pullCensored}
                        onChange={(e) => setPullCensored(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                      />
                      <label htmlFor="censorTogglePull" className="font-bold text-slate-900 text-xs cursor-pointer flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-amber-700" />
                        Apply Content Censorship (18+ Sensitive mask on public catalog)
                      </label>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsUploadModalOpen(false)}
                        className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isPulling}
                        className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {isPulling ? 'Ingesting Stream...' : 'Validate & Ingest VoD Stream to Dancia-4Tv'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* BeatwaveNG Dedicated Audio & Album Art Console */}
            {activeService === 'beatwaveng' && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-700">
                  Direct multipart audio stems and album cover artwork saving permanently to Express backend storage (<code className="font-mono bg-slate-100 p-1 rounded">/uploads/media/</code>).
                </p>

                {/* Option 1: Audio Master Track / Stem Archive */}
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center space-y-2 hover:border-indigo-600 transition-colors">
                  <Upload className="w-6 h-6 text-indigo-700 mx-auto" />
                  <div className="text-xs font-black text-slate-900">
                    Audio Master Track / Stem File (.mp3, .wav, .flac, .m4a)
                  </div>
                  <p className="text-[11px] font-medium text-slate-600">
                    Lossless 24-bit 96kHz acoustic master or multi-track STEM package.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="text-xs font-bold text-slate-700 cursor-pointer block mx-auto"
                  />
                </div>

                {/* Option 2: Album Cover / Record Sleeve / LP Jacket */}
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center space-y-2 hover:border-purple-600 transition-colors">
                  <ImageIcon className="w-6 h-6 text-purple-700 mx-auto" />
                  <div className="text-xs font-black text-slate-900">
                    Album Cover / Cover Art (Record Sleeve / LP Jacket)
                  </div>
                  <p className="text-[11px] font-medium text-slate-600">
                    Graphic design album art or physical packaging for vinyl records (JPEG, PNG, WebP).
                  </p>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                    onChange={handleCoverUpload}
                    disabled={isUploadingCover}
                    className="text-xs font-bold text-slate-700 cursor-pointer block mx-auto"
                  />
                </div>

                {/* Genre Selector for BeatwaveNG */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label className="font-bold text-slate-900 block mb-1 text-xs">Curated BeatwaveNG Genre</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none text-xs"
                  >
                    {(SERVICE_GENRES.beatwaveng || []).map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Other Services Default Upload */}
            {activeService !== 'dancia4tv' && activeService !== 'beatwaveng' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center space-y-2 hover:border-indigo-600 transition-colors">
                  <Upload className="w-6 h-6 text-indigo-700 mx-auto" />
                  <div className="text-xs font-black text-slate-900">
                    Media Master File (.mp4, .mov, .mp3, .wav)
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*,video/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="text-xs font-bold text-slate-700 cursor-pointer block mx-auto"
                  />
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center space-y-2 hover:border-purple-600 transition-colors">
                  <ImageIcon className="w-6 h-6 text-purple-700 mx-auto" />
                  <div className="text-xs font-black text-slate-900">
                    Cover Image / Artwork Thumbnail
                  </div>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={isUploadingCover}
                    className="text-xs font-bold text-slate-700 cursor-pointer block mx-auto"
                  />
                </div>
              </div>
            )}

            {/* Upload Progress Indicator */}
            {(isUploading || isUploadingCover) && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{isUploading ? 'Uploading Media...' : 'Uploading Cover Art...'}</span>
                  <span>{isUploading ? uploadProgress : coverUploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-700 h-2 transition-all duration-200"
                    style={{ width: `${isUploading ? uploadProgress : coverUploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: One-Click Console Spawner */}
      {isSpawnerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-700" />
                1-Click Meta-Console Generator
              </h2>
              <button
                type="button"
                onClick={() => setIsSpawnerModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-bold text-slate-700">
              Instantly scaffold a dedicated, schema-aware management console registered into PostgreSQL.
            </p>

            <form onSubmit={handleSpawnConsole} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-900 block mb-1">New Console Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Amapiano Studio Stems"
                  value={spawnName}
                  onChange={(e) => setSpawnName(e.target.value)}
                  className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Target Service</label>
                <input
                  type="text"
                  readOnly
                  value={currentServiceMeta.name}
                  className="w-full p-2.5 font-bold text-slate-700 bg-slate-100 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Operational Description</label>
                <textarea
                  rows={2}
                  placeholder="Console scope, permitted curators, live stem routing..."
                  value={spawnDescription}
                  onChange={(e) => setSpawnDescription(e.target.value)}
                  className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnerModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-xs"
                >
                  Spawn Console
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterStreamingMediaConsole;
