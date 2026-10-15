/*
 * FingerMobile Protocol™ - PhotoCredits Page Component
 * Sovereign Creator Licensing & 80/20 Royalty Architecture
 * 26-Day Friday Monthly UGC Giveaway & Interactive Polls Engine
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ApiService } from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Camera,
  Heart,
  Download,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  DollarSign,
  Award,
  MapPin,
  CheckCircle2,
  FileText,
  TrendingUp,
  Plus,
  Share2,
  Bookmark,
  MessageSquare,
  Flag,
  Star,
  Trophy,
  Clock,
  BarChart2,
  UploadCloud,
  Check,
  Flame,
  Play,
  Film,
  FolderHeart,
  Eye,
  LayoutGrid,
  Columns,
  List as ListIcon,
  Maximize2,
  Cpu,
  Layers,
  Folder,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { CURATED_PHOTOCREDITS_ITEMS, CuratedMediaItem } from '../data/curatedPhotoCredits';
import { FingerMobileVideoPlayerModal } from '../components/modals/FingerMobileVideoPlayerModal';
import { FingerMobileShareModal } from '../components/modals/FingerMobileShareModal';
import { PhotoCreditsCommentsModal } from '../components/modals/PhotoCreditsCommentsModal';
import { PhotoCreditAiQualityModal } from '../components/modals/PhotoCreditAiQualityModal';
import { PhotoCreditMosaicItem } from '../components/photocredits/PhotoCreditMosaicItem';

export interface CameraExif {
  camera?: string;
  lens?: string;
  iso?: number;
  shutter?: string;
  aperture?: string;
  focalLength?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollData {
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string | null;
}

export interface PhotoCreditItem {
  id: string;
  photo_id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  media_type?: 'image' | 'video';
  cohort?: string;
  photographer: string;
  photographer_id?: string;
  location?: string;
  category: string;
  tags?: string[];
  likes: number;
  dislikes?: number;
  comments?: number;
  saves?: number;
  downloads: number;
  shares?: number;
  rating?: number;
  aiScore?: number;
  price_credits: number;
  license_type: 'Royalty-Free Standard' | 'Editorial Use Only' | 'Commercial Extended' | string;
  camera_info?: CameraExif;
  hasLiked?: boolean;
  hasDisliked?: boolean;
  isBookmarked?: boolean;
  isSaved?: boolean;
  isFavorite?: boolean;
  poll_data?: PollData;
  age_group?: string;
  sex?: string;
  glitz_level?: 'Natural' | 'Semi-Glitz' | 'Glitz' | string;
  division?: string;
  core_focus?: string;
  temporal_data?: { capturedAt?: string; modifiedAt?: string; uploadedAt?: string };
  spatial_data?: { latitude?: number; longitude?: number; locationName?: string };
  media_technical?: { format?: string; dimensions?: string; megapixels?: string; aspectRatio?: string; fileSizeMb?: number; duration?: string; fps?: number; bitrate?: string };
}

export interface GiveawayPrize {
  rank: number;
  amountFIC: number;
  badge: string;
  perk?: string;
}

export interface GiveawayLeader {
  rank: number;
  id: string;
  title: string;
  photographer: string;
  imageUrl: string;
  videoUrl?: string;
  media_type?: 'image' | 'video';
  likes: number;
  saves?: number;
  comments?: number;
  downloads: number;
  shares: number;
  pollVotes?: number;
  rating: number;
  compositeScore: number;
  prizeFIC: number;
  badge: string;
  location?: string;
  hasPoll?: boolean;
}

export interface GiveawayData {
  cycleDays: number;
  currentCycle: number;
  daysRemaining: number;
  nextCycleDate: string;
  nextFridayDate?: string;
  prizePoolFIC: number;
  prizes: GiveawayPrize[];
  leaderboard: GiveawayLeader[];
}

type TabMode = 'gallery' | 'my-gallery' | 'giveaway' | 'royalties' | 'certificate';

const LICENSE_TIERS = [
  {
    tier: 'Royalty-Free Standard',
    multiplier: 1.0,
    badge: 'Standard',
    badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    description: 'Worldwide, perpetual non-exclusive license for digital media, websites, and social content.'
  },
  {
    tier: 'Editorial Use Only',
    multiplier: 1.25,
    badge: 'Editorial',
    badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40',
    description: 'News broadcasts, documentary, journals, and non-commercial educational publishing.'
  },
  {
    tier: 'Commercial Extended',
    multiplier: 2.0,
    badge: 'Commercial',
    badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    description: 'Unlimited print runs, packaging, outdoor advertising, merchandise, and global TV broadcast.'
  }
];

const DEFAULT_GIVEAWAY_PRIZES: GiveawayPrize[] = [
  { rank: 1, amountFIC: 50000, badge: '🥇 1st Place Champion' },
  { rank: 2, amountFIC: 25000, badge: '🥈 2nd Place Runner-Up' },
  { rank: 3, amountFIC: 15000, badge: '🥉 3rd Place Bronze' },
  { rank: 4, amountFIC: 10000, badge: '🏅 4th Place Finalist' },
  { rank: 5, amountFIC: 8000, badge: '🏅 5th Place Finalist' },
  { rank: 6, amountFIC: 6000, badge: '🎖️ 6th Place Honor' },
  { rank: 7, amountFIC: 4000, badge: '🎖️ 7th Place Honor' },
  { rank: 8, amountFIC: 3000, badge: '🎖️ 8th Place Honor' },
  { rank: 9, amountFIC: 2500, badge: '🎖️ 9th Place Honor' },
  { rank: 10, amountFIC: 1500, badge: '🎖️ 10th Place Honor' }
];

const PhotoCreditsPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();

  // Navigation & Filter State
  const [activeTab, setActiveTab] = useState<TabMode>('gallery');
  const [photos, setPhotos] = useState<PhotoCreditItem[]>(CURATED_PHOTOCREDITS_ITEMS as any);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCohortFilter, setSelectedCohortFilter] = useState<string>('all');
  const [selectedLicenseFilter, setSelectedLicenseFilter] = useState<string>('all');
  const [selectedVideoForPlay, setSelectedVideoForPlay] = useState<CuratedMediaItem | null>(null);

  // Saved Gallery & Bookmarks (persistent in localStorage)
  const [savedGalleryIds, setSavedGalleryIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('fm_photocredits_saved_gallery');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('fm_photocredits_bookmarked');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Display View, Sorting & Grouping
  const [displayMode, setDisplayMode] = useState<'grid' | 'mosaic' | 'list' | 'details'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'az' | 'za' | 'likes' | 'saves' | 'downloads' | 'aiScore' | 'yield'>('newest');
  const [groupBy, setGroupBy] = useState<'none' | 'folder' | 'name'>('none');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [selectedDetailPhotoId, setSelectedDetailPhotoId] = useState<string>('pc-ba-01');

  // Favorites (persistent in localStorage)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('fm_photocredits_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Autonomous AI Quality Modal State
  const [selectedItemForAiQuality, setSelectedItemForAiQuality] = useState<PhotoCreditItem | null>(null);

  // Advanced Pageant, Glitz & Demographic Filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [selectedAgeFilter, setSelectedAgeFilter] = useState<string>('all');
  const [selectedSexFilter, setSelectedSexFilter] = useState<string>('all');
  const [selectedGlitzFilter, setSelectedGlitzFilter] = useState<string>('all');
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>('all');
  const [selectedFocusFilter, setSelectedFocusFilter] = useState<string>('all');

  // Share & Comments Modals State
  const [selectedItemForShare, setSelectedItemForShare] = useState<PhotoCreditItem | null>(null);
  const [selectedItemForComments, setSelectedItemForComments] = useState<PhotoCreditItem | null>(null);

  // My Gallery Sub-filter
  const [gallerySubFilter, setGallerySubFilter] = useState<'all' | 'saved' | 'bookmarked' | 'favorites' | 'photos' | 'videos'>('all');

  // Giveaway 22-Day Category & Metric Filters
  const [giveawayCategoryFilter, setGiveawayCategoryFilter] = useState<'all' | 'photo' | 'video' | 'poll'>('all');
  const [giveawayMetricFilter, setGiveawayMetricFilter] = useState<'composite' | 'likes' | 'comments' | 'saves' | 'downloads' | 'pollVotes'>('composite');

  // Licensing Modal State
  const [selectedPhotoForLicense, setSelectedPhotoForLicense] = useState<PhotoCreditItem | null>(null);
  const [chosenTier, setChosenTier] = useState<string>('Royalty-Free Standard');
  const [isLicensing, setIsLicensing] = useState<boolean>(false);

  const [countdown, setCountdown] = useState({ days: 14, hours: 8, minutes: 24, seconds: 40 });

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Poll Creator in Upload Modal
  const [includePoll, setIncludePoll] = useState<boolean>(false);
  const [pollQuestion, setPollQuestion] = useState<string>('How does this composition make you feel?');
  const [pollOptions, setPollOptions] = useState<string[]>([
    'Breathtaking & Atmospheric',
    'Vibrant & High Energy',
    'Needs Tighter Framing',
    'Flawless Color Grade'
  ]);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1600&q=85',
    category: 'Architecture',
    location: 'Lagos, Nigeria',
    price_credits: 30,
    license_type: 'Royalty-Free Standard',
    camera: 'Sony A7R V',
    lens: 'FE 24-70mm f/2.8 GM II',
    iso: 100,
    shutter: '1/160s',
    aperture: 'f/8.0'
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Photos from Backend API (with curated fallback)
  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await ApiService.get('/photocredits');
      const rawList = res?.data || (Array.isArray(res) ? res : []);

      if (rawList && rawList.length > 0) {
        const normalized: PhotoCreditItem[] = rawList.map((item: any, idx: number) => {
          let parsedPoll = item.poll_data;
          if (typeof parsedPoll === 'string') {
            try {
              parsedPoll = JSON.parse(parsedPoll);
            } catch {
              parsedPoll = undefined;
            }
          }

          let imgUrl = item.image_url || item.imageUrl || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600&auto=format&fit=crop&q=85';
          if (imgUrl.startsWith('/uploads')) {
            imgUrl = `http://localhost:3001${imgUrl}`;
          }

          return {
            id: String(item.id || item.photo_id || `pc-${idx}`),
            photo_id: item.photo_id || `ph-${idx}`,
            title: item.title || 'Untitled Masterpiece',
            description: item.description || '',
            imageUrl: imgUrl,
            thumbnailUrl: item.thumbnail_url || item.thumbnailUrl || imgUrl,
            videoUrl: item.video_url || item.videoUrl,
            media_type: item.media_type || (item.video_url ? 'video' : 'image'),
            cohort: item.cohort,
            photographer: item.photographer_name || item.photographer || 'FingerMobile Creator',
            photographer_id: String(item.uploader_id || item.photographer_id || '1'),
            location: item.location || 'Global',
            category: item.category || 'General',
            tags: Array.isArray(item.tags) ? item.tags : [],
            likes: Number(item.likes || item.credits_count || 42),
            dislikes: Number(item.dislikes || 0),
            downloads: Number(item.downloads || Math.floor((item.credits_count || 10) * 0.4)),
            shares: Number(item.shares || 12),
            rating: Number(item.rating || 4.9),
            price_credits: Number(item.price || item.price_credits || 25),
            license_type: item.license_type || 'Royalty-Free Standard',
            camera_info: typeof item.camera_info === 'object' && item.camera_info !== null
              ? item.camera_info
              : { camera: 'Pro Camera Body', lens: 'Prime Lens', iso: 100, shutter: '1/250s', aperture: 'f/2.8' },
            poll_data: parsedPoll
          };
        });

        // Merge with curated items to ensure all 20 assets (15 photos + 5 videos) remain present
        const existingIds = new Set(normalized.map((n) => n.id));
        const combined = [
          ...normalized,
          ...CURATED_PHOTOCREDITS_ITEMS.filter((c) => !existingIds.has(c.id))
        ];
        setPhotos(combined as any);
      } else {
        setPhotos(CURATED_PHOTOCREDITS_ITEMS as any);
      }
    } catch {
      setPhotos(CURATED_PHOTOCREDITS_ITEMS as any);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Unique Categories
  const categories = useMemo(() => {
    const list = Array.from(new Set(photos.map((p) => p.category)));
    return ['all', ...list];
  }, [photos]);

  // Cohort Filters List
  const cohorts = [
    { id: 'all', label: 'All Curated Assets' },
    { id: 'Black American', label: 'Black American (30\'s)' },
    { id: 'American', label: 'American (30\'s)' },
    { id: 'Irish', label: 'Irish (30\'s)' },
    { id: 'Venezuelan', label: 'Venezuelan (30\'s)' },
    { id: 'Black African', label: 'Black African (20\'s)' },
    { id: 'Executive Leadership', label: 'Executive Leadership' },
    { id: 'videos', label: '▶ 4K Cinematic Videos (5)' }
  ];

  // Filtered & Sorted Photo List
  const filteredPhotos = useMemo(() => {
    const list = photos.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.photographer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.cohort || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'all' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesLicense =
        selectedLicenseFilter === 'all' ||
        p.license_type.toLowerCase() === selectedLicenseFilter.toLowerCase();

      const matchesCohort =
        selectedCohortFilter === 'all' ||
        (selectedCohortFilter === 'videos' && p.media_type === 'video') ||
        (p.cohort && p.cohort.toLowerCase().includes(selectedCohortFilter.toLowerCase()));

      // Advanced Pageant & Demographic Filters
      const matchesAge =
        selectedAgeFilter === 'all' ||
        (p.cohort && p.cohort.toLowerCase().includes(selectedAgeFilter.toLowerCase())) ||
        (p.age_group && p.age_group.toLowerCase().includes(selectedAgeFilter.toLowerCase()));

      const matchesSex =
        selectedSexFilter === 'all' ||
        (p.cohort && p.cohort.toLowerCase().includes(selectedSexFilter.toLowerCase())) ||
        (p.sex && p.sex.toLowerCase() === selectedSexFilter.toLowerCase());

      const matchesGlitz =
        selectedGlitzFilter === 'all' ||
        (p.glitz_level && p.glitz_level.toLowerCase() === selectedGlitzFilter.toLowerCase()) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(selectedGlitzFilter.toLowerCase()));

      const matchesDivision =
        selectedDivisionFilter === 'all' ||
        (p.division && p.division.toLowerCase() === selectedDivisionFilter.toLowerCase());

      const matchesFocus =
        selectedFocusFilter === 'all' ||
        (p.core_focus && p.core_focus.toLowerCase().includes(selectedFocusFilter.toLowerCase()));

      return (
        matchesSearch &&
        matchesCat &&
        matchesLicense &&
        matchesCohort &&
        matchesAge &&
        matchesSex &&
        matchesGlitz &&
        matchesDivision &&
        matchesFocus
      );
    });

    // Sorting Logic
    list.sort((a, b) => {
      if (sortBy === 'az') return a.title.localeCompare(b.title);
      if (sortBy === 'za') return b.title.localeCompare(a.title);
      if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
      if (sortBy === 'saves') {
        const aS = (a.saves || 0) + (savedGalleryIds.includes(a.id) ? 1 : 0);
        const bS = (b.saves || 0) + (savedGalleryIds.includes(b.id) ? 1 : 0);
        return bS - aS;
      }
      if (sortBy === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
      if (sortBy === 'aiScore') {
        const aScore = a.aiScore ?? Math.min(99, Math.round(((a.rating || 4.9) / 5) * 100));
        const bScore = b.aiScore ?? Math.min(99, Math.round(((b.rating || 4.9) / 5) * 100));
        return bScore - aScore;
      }
      if (sortBy === 'yield') {
        const aYield =
          (a.downloads || 0) * a.price_credits * 0.8 +
          ((a.likes || 0) * 5 +
            ((a.saves || 0) + (savedGalleryIds.includes(a.id) ? 1 : 0)) * 10 +
            (a.shares || 0) * 8 +
            (a.comments || 3) * 6) *
            0.05;
        const bYield =
          (b.downloads || 0) * b.price_credits * 0.8 +
          ((b.likes || 0) * 5 +
            ((b.saves || 0) + (savedGalleryIds.includes(b.id) ? 1 : 0)) * 10 +
            (b.shares || 0) * 8 +
            (b.comments || 3) * 6) *
            0.05;
        return bYield - aYield;
      }
      return 0; // 'newest' default
    });

    return list;
  }, [
    photos,
    searchQuery,
    selectedCategory,
    selectedLicenseFilter,
    selectedCohortFilter,
    selectedAgeFilter,
    selectedSexFilter,
    selectedGlitzFilter,
    selectedDivisionFilter,
    selectedFocusFilter,
    sortBy,
    savedGalleryIds
  ]);

  // Grouped Photos Partition (Folder/Collection vs Creator/Model)
  const groupedPhotos = useMemo(() => {
    if (groupBy === 'none') {
      return [{ key: 'all', label: 'All Curated Media Assets', items: filteredPhotos }];
    }
    const map = new Map<string, PhotoCreditItem[]>();
    filteredPhotos.forEach((photo) => {
      const key =
        groupBy === 'folder'
          ? (photo.category || 'General')
          : (photo.photographer || 'FingerMobile Studios');
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(photo);
    });
    return Array.from(map.entries()).map(([key, items]) => ({
      key,
      label: key,
      items
    }));
  }, [filteredPhotos, groupBy]);

  // Saved Gallery Photos List
  const savedPhotos = useMemo(() => {
    return photos.filter((p) => {
      const isSaved = savedGalleryIds.includes(p.id);
      const isBookmarked = bookmarkedIds.includes(p.id) || p.isBookmarked;
      const isFav = favoriteIds.includes(p.id) || p.isFavorite;
      if (!isSaved && !isBookmarked && !isFav) return false;

      if (gallerySubFilter === 'saved') return isSaved;
      if (gallerySubFilter === 'bookmarked') return isBookmarked;
      if (gallerySubFilter === 'favorites') return isFav;
      if (gallerySubFilter === 'photos') return p.media_type !== 'video';
      if (gallerySubFilter === 'videos') return p.media_type === 'video';
      return true;
    });
  }, [photos, savedGalleryIds, bookmarkedIds, favoriteIds, gallerySubFilter]);

  // Dynamic 22-Day Monthly Contest Leaderboard
  const computedLeaderboard = useMemo(() => {
    let list = [...photos];

    // Filter by Category
    if (giveawayCategoryFilter === 'photo') {
      list = list.filter((p) => p.media_type !== 'video');
    } else if (giveawayCategoryFilter === 'video') {
      list = list.filter((p) => p.media_type === 'video');
    } else if (giveawayCategoryFilter === 'poll') {
      list = list.filter((p) => !!p.poll_data);
    }

    // Sort by Metric
    list.sort((a, b) => {
      const aLikes = a.likes || 0;
      const bLikes = b.likes || 0;
      const aComments = a.comments || 3;
      const bComments = b.comments || 3;
      const aSaves = a.saves || (savedGalleryIds.includes(a.id) ? 1 : 0);
      const bSaves = b.saves || (savedGalleryIds.includes(b.id) ? 1 : 0);
      const aDownloads = a.downloads || 0;
      const bDownloads = b.downloads || 0;
      const aPoll = a.poll_data?.totalVotes || 0;
      const bPoll = b.poll_data?.totalVotes || 0;

      if (giveawayMetricFilter === 'likes') return bLikes - aLikes;
      if (giveawayMetricFilter === 'comments') return bComments - aComments;
      if (giveawayMetricFilter === 'saves') return bSaves - aSaves;
      if (giveawayMetricFilter === 'downloads') return bDownloads - aDownloads;
      if (giveawayMetricFilter === 'pollVotes') return bPoll - aPoll;

      const aScore = (aLikes * 5) + (aSaves * 10) + ((a.shares || 0) * 8) + (aComments * 6) + (aDownloads * 25) + (aPoll * 12);
      const bScore = (bLikes * 5) + (bSaves * 10) + ((b.shares || 0) * 8) + (bComments * 6) + (bDownloads * 25) + (bPoll * 12);
      return bScore - aScore;
    });

    return list.slice(0, 10).map((item, index) => {
      const rank = index + 1;
      const prize = DEFAULT_GIVEAWAY_PRIZES[index]?.amountFIC || Math.max(1500, 50000 - (index * 4500));
      const likes = item.likes || 0;
      const saves = item.saves || (savedGalleryIds.includes(item.id) ? 1 : 0);
      const shares = item.shares || 0;
      const comments = item.comments || 3;
      const downloads = item.downloads || 0;
      const pollVotes = item.poll_data?.totalVotes || 0;
      const compositeScore = (likes * 5) + (saves * 10) + (shares * 8) + (comments * 6) + (downloads * 25) + (pollVotes * 12);

      let badge = `#${rank} Finalist`;
      let perk = 'Protocol Leaderboard Inclusion';
      if (rank === 1) {
        if (giveawayCategoryFilter === 'video') {
          badge = '🥇 1st Place - Video of the Month';
          perk = 'Featured on PhotoCredits Video Widgets, Trends & FingerLux';
        } else if (giveawayCategoryFilter === 'poll') {
          badge = '🥇 1st Place - Community Poll of the Month';
          perk = 'Featured Community Poll Showcase on Trends & Master Banners';
        } else {
          badge = '🥇 1st Place - Face of the Month';
          perk = 'Official PhotoCredit Face of the Month, Rotating Widgets, FingerLux & Gift Card Branding';
        }
      } else if (rank === 2) {
        badge = '🥈 2nd Place Runner-Up';
        perk = 'Trends Widget Spotlight & Creator Bonus Pool';
      } else if (rank === 3) {
        badge = '🥉 3rd Place Bronze';
        perk = 'Platform Showcase Spotlight & Creator Bonus Pool';
      }

      return {
        rank,
        id: item.id,
        title: item.title,
        photographer: item.photographer,
        imageUrl: item.thumbnailUrl || item.imageUrl,
        videoUrl: item.videoUrl,
        media_type: item.media_type,
        likes,
        saves,
        shares,
        comments,
        downloads,
        pollVotes,
        rating: item.rating || 4.95,
        compositeScore,
        prizeFIC: prize,
        badge,
        perk,
        location: item.location,
        hasPoll: !!item.poll_data
      };
    });
  }, [photos, giveawayCategoryFilter, giveawayMetricFilter, savedGalleryIds]);

  // Handle Photo Engagement Votes (Like, Dislike, Upvote, Share, Rate)
  const handleVote = async (photoId: string, action: 'like' | 'dislike' | 'upvote' | 'downvote' | 'share' | 'rating', payload?: any) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id !== photoId) return p;
        if (action === 'like' || action === 'upvote') {
          const wasLiked = p.hasLiked;
          return {
            ...p,
            likes: wasLiked ? p.likes - 1 : p.likes + 1,
            hasLiked: !wasLiked,
            hasDisliked: false
          };
        }
        if (action === 'dislike' || action === 'downvote') {
          const wasDisliked = p.hasDisliked;
          return {
            ...p,
            dislikes: wasDisliked ? (p.dislikes || 1) - 1 : (p.dislikes || 0) + 1,
            hasDisliked: !wasDisliked,
            hasLiked: false
          };
        }
        if (action === 'share') {
          return { ...p, shares: (p.shares || 0) + 1 };
        }
        if (action === 'rating' && payload?.stars) {
          return { ...p, rating: payload.stars };
        }
        return p;
      })
    );

    try {
      await ApiService.post(`/photocredits/${photoId}/vote`, { action, payload });
      if (action === 'share') {
        const item = photos.find((p) => p.id === photoId);
        if (item) setSelectedItemForShare(item);
      } else if (action === 'like' || action === 'upvote') {
        showToast('Like recorded! Creator receives +5 Sovereign Monetization Points.', 'success');
      } else if (action === 'rating') {
        showToast(`Rated ${payload?.stars} stars! (+${payload?.stars * 10} UGC pts)`, 'success');
      }
    } catch {
      // Quiet failover
    }
  };

  // Handle Poll Voting on Photo Cards
  const handlePollVote = async (photoId: string, optionId: string) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id !== photoId || !p.poll_data) return p;
        const currentPoll = p.poll_data;
        if (currentPoll.userVotedOptionId === optionId) return p; // already voted for this option

        const updatedOptions = currentPoll.options.map((opt) => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          if (opt.id === currentPoll.userVotedOptionId) {
            return { ...opt, votes: Math.max(0, opt.votes - 1) };
          }
          return opt;
        });

        const newTotal = updatedOptions.reduce((acc, curr) => acc + curr.votes, 0);

        return {
          ...p,
          poll_data: {
            ...currentPoll,
            options: updatedOptions,
            totalVotes: newTotal,
            userVotedOptionId: optionId
          }
        };
      })
    );

    try {
      const pIndex = photos.find((p) => p.id === photoId)?.poll_data?.options.findIndex((o) => o.id === optionId) ?? 0;
      await ApiService.post(`/photocredits/${photoId}/poll`, { optionIndex: pIndex });
      showToast('Community poll vote registered on decentralized ledger! (+12 pts)', 'success');
    } catch {
      // Silently failover
    }
  };

  // Toggle Save to My Gallery
  const handleToggleSaveToGallery = (item: PhotoCreditItem) => {
    const isCurrentlySaved = savedGalleryIds.includes(item.id);
    let updated: string[];
    if (isCurrentlySaved) {
      updated = savedGalleryIds.filter((id) => id !== item.id);
      showToast(`Removed "${item.title}" from My Gallery`, 'info');
    } else {
      updated = [...savedGalleryIds, item.id];
      showToast(`Saved "${item.title}" to My Gallery! +10 Sovereign Monetization Points awarded to creator.`, 'success');
    }
    setSavedGalleryIds(updated);
    try {
      localStorage.setItem('fm_photocredits_saved_gallery', JSON.stringify(updated));
    } catch (e) {
      void e;
    }

    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === item.id) {
          const currentSaves = p.saves || 0;
          return {
            ...p,
            saves: isCurrentlySaved ? Math.max(0, currentSaves - 1) : currentSaves + 1
          };
        }
        return p;
      })
    );
  };

  // Toggle Bookmark
  const handleToggleBookmark = (item: PhotoCreditItem) => {
    const isCurrentlyBookmarked = bookmarkedIds.includes(item.id) || item.isBookmarked;
    let updated: string[];
    if (isCurrentlyBookmarked) {
      updated = bookmarkedIds.filter((id) => id !== item.id);
      showToast('Removed from Bookmarks', 'info');
    } else {
      updated = [...bookmarkedIds, item.id];
      showToast(`Bookmarked "${item.title}" in personal library!`, 'success');
    }
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('fm_photocredits_bookmarked', JSON.stringify(updated));
    } catch (e) {
      void e;
    }

    setPhotos((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, isBookmarked: !isCurrentlyBookmarked } : p))
    );
  };

  // Toggle Favorite
  const handleToggleFavorite = (item: PhotoCreditItem) => {
    const isCurrentlyFav = favoriteIds.includes(item.id) || item.isFavorite;
    let updated: string[];
    if (isCurrentlyFav) {
      updated = favoriteIds.filter((id) => id !== item.id);
      showToast(`Removed "${item.title}" from Favorites`, 'info');
    } else {
      updated = [...favoriteIds, item.id];
      showToast(`⭐ Added "${item.title}" to Favorites! +10 Sovereign Monetization Points.`, 'success');
    }
    setFavoriteIds(updated);
    try {
      localStorage.setItem('fm_photocredits_favorites', JSON.stringify(updated));
    } catch (e) {
      void e;
    }

    setPhotos((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, isFavorite: !isCurrentlyFav } : p))
    );
  };

  // Handle Share Success
  const handleShareSuccess = (platform: string, itemId: string) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === itemId) {
          return { ...p, shares: (p.shares || 0) + 1 };
        }
        return p;
      })
    );
    showToast(`Shared via ${platform}! +8 Sovereign Monetization Points awarded to creator.`, 'success');
  };

  // Handle Comment Added
  const handleCommentAdded = (itemId: string, commentText: string) => {
    void commentText;
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === itemId) {
          return { ...p, comments: (p.comments || 3) + 1 };
        }
        return p;
      })
    );
    showToast('Comment published! +6 Sovereign Monetization Points awarded to creator.', 'success');
  };

  // Message Photographer
  const handleMessageCreator = (photographer: string) => {
    showToast(`Direct sovereign communication channel opened with ${photographer}`, 'info');
  };

  // Report Photo
  const handleReport = (title: string) => {
    showToast(`Report filed for "${title}". FingerMobile moderator protocol notified.`, 'info');
  };

  // Calculate License Cost based on chosen tier
  const calculateTierPrice = (basePrice: number, tier: string) => {
    const matched = LICENSE_TIERS.find((t) => t.tier === tier);
    const mult = matched ? matched.multiplier : 1.0;
    return Math.round(basePrice * mult);
  };

  // Acquire License Action
  const handleAcquireLicense = async () => {
    if (!selectedPhotoForLicense) return;
    const finalPrice = calculateTierPrice(selectedPhotoForLicense.price_credits, chosenTier);

    if (ficBalance < finalPrice) {
      showToast(`Insufficient FIC balance! Requires ${finalPrice} FIC (Current: ${ficBalance} FIC).`, 'error');
      return;
    }

    setIsLicensing(true);
    try {
      const licensePayload = {
        photoId: selectedPhotoForLicense.photo_id || selectedPhotoForLicense.id,
        licenseTier: chosenTier,
        totalAmount: finalPrice,
        creatorRoyalty: Math.round(finalPrice * 0.8),
        platformFee: Math.round(finalPrice * 0.2)
      };

      await ApiService.post(`/photocredits/${selectedPhotoForLicense.id}/purchase-license`, licensePayload).catch(() => {});
      await ApiService.post(`/photocredits/${selectedPhotoForLicense.id}/vote`, { action: 'download' }).catch(() => {});

      // Trigger file download
      const link = document.createElement('a');
      link.href = selectedPhotoForLicense.imageUrl;
      link.download = `${selectedPhotoForLicense.title.replace(/\s+/g, '_')}_MASTER.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Increment download counter
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === selectedPhotoForLicense.id ? { ...p, downloads: p.downloads + 1 } : p
        )
      );

      const licenseNumber = `LIC-FMP-${Math.floor(100000 + Math.random() * 900000)}`;
      showToast(`License Acquired! Reference: ${licenseNumber}. Master file downloaded. (+3 UGC Giveaway pts)`, 'success');
      setSelectedPhotoForLicense(null);
    } catch (err: any) {
      showToast(err.message || 'Licensing failed', 'error');
    } finally {
      setIsLicensing(false);
    }
  };

  // Handle Real File Selection & Preview
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      if (!uploadForm.title) {
        setUploadForm((prev) => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        }));
      }
    }
  };

  // Upload New Photograph via Real File or URL
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) {
      showToast('Please provide a photo title', 'error');
      return;
    }
    if (!selectedFile && !uploadForm.imageUrl.trim()) {
      showToast('Please upload a photo file or provide an image URL', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('media', selectedFile);
      } else {
        formData.append('imageUrl', uploadForm.imageUrl);
      }

      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('category', uploadForm.category);
      formData.append('location', uploadForm.location);
      formData.append('price', String(uploadForm.price_credits));
      formData.append('licenseType', uploadForm.license_type);
      formData.append('camera', uploadForm.camera);
      formData.append('lens', uploadForm.lens);
      formData.append('iso', String(uploadForm.iso));
      formData.append('shutter', uploadForm.shutter);
      formData.append('aperture', uploadForm.aperture);

      // Attach Poll if configured
      if (includePoll && pollQuestion.trim() && pollOptions.length > 0) {
        const cleanOptions = pollOptions.filter((o) => o.trim().length > 0);
        if (cleanOptions.length >= 2) {
          const pollPayload: PollData = {
            question: pollQuestion.trim(),
            options: cleanOptions.map((text, idx) => ({
              id: `opt-${idx + 1}`,
              text: text.trim(),
              votes: 0
            })),
            totalVotes: 0,
            userVotedOptionId: null
          };
          formData.append('poll', JSON.stringify(pollPayload));
        }
      }

      // Send to Backend
      const res = await fetch('http://localhost:3001/api/photocredits/upload', {
        method: 'POST',
        body: formData
      });

      const responseData = await res.json();

      let createdImageUrl = previewUrl || uploadForm.imageUrl;
      if (responseData.data?.image_url) {
        createdImageUrl = responseData.data.image_url.startsWith('/uploads')
          ? `http://localhost:3001${responseData.data.image_url}`
          : responseData.data.image_url;
      }

      const createdItem: PhotoCreditItem = {
        id: String(responseData.data?.id || `pc-${Date.now()}`),
        photo_id: responseData.data?.photo_id || `ph-${Date.now()}`,
        title: uploadForm.title,
        description: uploadForm.description,
        imageUrl: createdImageUrl,
        thumbnailUrl: createdImageUrl,
        photographer: 'Verified Creator',
        photographer_id: '1',
        category: uploadForm.category,
        location: uploadForm.location,
        likes: 1,
        downloads: 0,
        shares: 0,
        rating: 5.0,
        price_credits: uploadForm.price_credits,
        license_type: uploadForm.license_type,
        camera_info: {
          camera: uploadForm.camera,
          lens: uploadForm.lens,
          iso: uploadForm.iso,
          shutter: uploadForm.shutter,
          aperture: uploadForm.aperture
        },
        poll_data: includePoll && pollQuestion.trim()
          ? {
            question: pollQuestion.trim(),
            options: pollOptions.filter((o) => o.trim().length > 0).map((text, idx) => ({
              id: `opt-${idx + 1}`,
              text: text.trim(),
              votes: 0
            })),
            totalVotes: 0
          }
          : undefined
      };

      setPhotos([createdItem, ...photos]);
      setShowUploadModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      showToast('Master photograph uploaded & registered for the 26-Day Friday Monthly Giveaway! (80% Royalty Protected)', 'success');
    } catch {
      showToast('Upload failed. Please check network connection.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-3 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/70 via-emerald-950/40 to-slate-900/90 border border-amber-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                PhotoCredits™ Sovereign Photography Licensing, 80/20 Creator Split & 22-Day Monthly Contest
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-3">
                <span>PhotoCredits</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  80% Creator Split
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-600/30 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  150,000 FIC Monthly Pool
                </span>
              </h1>
              <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                Browse, license, and syndicate sovereign media assets. Monetization is driven by community share voting, saves, shares, and comments. Every 22 days, top creators win bonus FIC, Face & Video of the Month, and appearances across Widgets, Trends, FingerLux, and Gift Card branding!
              </p>
            </div>

            {/* Balances & Creator Action */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/80 border border-amber-500/40 rounded-xl p-4 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-emerald-600 flex items-center justify-center text-white shadow-inner">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-slate-200 uppercase tracking-wider font-bold">FIC Balance</div>
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                    🪙 {(ficBalance ?? 0).toLocaleString()} FIC
                  </div>
                </div>
              </div>

              <div className="h-10 w-px bg-slate-800 hidden sm:block" />

              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Upload Photograph
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-amber-500/20">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'gallery'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white font-medium'
              }`}
            >
              <Camera className="w-4 h-4" />
              Master Photograph Gallery
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-amber-900/60 text-amber-200 font-bold">
                {photos.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('my-gallery')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'my-gallery'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-600/30 font-bold'
                  : 'bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white font-medium'
              }`}
            >
              <FolderHeart className="w-4 h-4 text-rose-400" />
              My Saved Gallery
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-rose-500/30 text-rose-300 border border-rose-400/30 font-bold">
                {savedGalleryIds.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('giveaway')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'giveaway'
                  ? 'bg-gradient-to-r from-amber-600 to-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold'
                  : 'bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white font-medium'
              }`}
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              🏆 22-Day Monthly Contest
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 font-bold">
                150,000 FIC Pool
              </span>
            </button>

            <button
              onClick={() => setActiveTab('royalties')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'royalties'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white font-medium'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Creator Royalties & Payouts (80/20)
            </button>

            <button
              onClick={() => setActiveTab('certificate')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'certificate'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:text-white font-medium'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              Immutable Certification Vault
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {/* ======================================================== */}
        {/* TAB 1: GALLERY & LICENSING */}
        {/* ======================================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            {/* Search and Filters Bar */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search model, demographic, location, camera..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-300" />
                    <span className="text-xs text-slate-200 font-bold">Category:</span>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-200 font-bold">License:</span>
                    <select
                      value={selectedLicenseFilter}
                      onChange={(e) => setSelectedLicenseFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="all">All Licenses</option>
                      <option value="Royalty-Free Standard">Standard</option>
                      <option value="Editorial Use Only">Editorial</option>
                      <option value="Commercial Extended">Commercial</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Demographic Cohort Quick Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-200 mr-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Filter by Demographic:
                </span>
                {cohorts.map((ch) => {
                  const isSelected = selectedCohortFilter === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedCohortFilter(ch.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 scale-105'
                          : 'bg-slate-950 border border-slate-700/80 text-slate-200 hover:text-white hover:border-slate-600'
                      }`}
                    >
                      {ch.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ======================================================== */}
            {/* DISPLAY, SORTING & GROUPING TOOLBAR */}
            {/* ======================================================== */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
              {/* Left: View Mode Segmented Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1 mr-1">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  Display:
                </span>
                <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                  <button
                    onClick={() => setDisplayMode('mosaic')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      displayMode === 'mosaic'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                    title="Masonry Mosaic visual gallery"
                  >
                    <Columns className="w-3.5 h-3.5" />
                    Mosaic
                  </button>

                  <button
                    onClick={() => setDisplayMode('grid')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      displayMode === 'grid'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                    title="Classic 3-column card grid with complete details"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Grid
                  </button>

                  <button
                    onClick={() => setDisplayMode('list')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      displayMode === 'list'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                    title="Social post-card feed stream"
                  >
                    <ListIcon className="w-3.5 h-3.5" />
                    List (Post-Card)
                  </button>

                  <button
                    onClick={() => setDisplayMode('details')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      displayMode === 'details'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                    title="High-resolution split inspection details"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    Details
                  </button>
                </div>
              </div>

              {/* Middle & Right: Sorting, Grouping & Advanced Filter Toggle */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Sorting A-Z, Z-A, etc. */}
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-xs font-bold text-slate-300">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-950 border border-slate-750 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="az">Sorting A-Z (Title)</option>
                    <option value="za">Sorting Z-A (Title)</option>
                    <option value="likes">Highest Likes (Votes)</option>
                    <option value="saves">Highest Saves (My Gallery)</option>
                    <option value="downloads">Highest Downloads</option>
                    <option value="aiScore">Highest AI Quality Score</option>
                    <option value="yield">Top Monetized (FIC Yield)</option>
                  </select>
                </div>

                {/* Grouping: None, Folder/Category, Name */}
                <div className="flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-xs font-bold text-slate-300">Group:</span>
                  <select
                    value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value as any)}
                    className="bg-slate-950 border border-slate-750 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="none">Do not Group</option>
                    <option value="folder">Group by Folder (Category)</option>
                    <option value="name">Group by Name (Alphabetical)</option>
                  </select>
                </div>

                {/* Advanced Filters Button */}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    showAdvancedFilters
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                      : 'bg-slate-950 text-slate-200 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Pageant & Quality Rules</span>
                  {(selectedAgeFilter !== 'all' ||
                    selectedSexFilter !== 'all' ||
                    selectedGlitzFilter !== 'all' ||
                    selectedDivisionFilter !== 'all' ||
                    selectedFocusFilter !== 'all') && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </button>
              </div>
            </div>

            {/* ADVANCED PAGEANT, GLITZ & DEMOGRAPHIC FILTERS DRAWER */}
            {showAdvancedFilters && (
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/40 shadow-xl space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Pageant Glitz Levels, Demographics & Competition Focus Standards
                  </div>
                  <button
                    onClick={() => {
                      setSelectedAgeFilter('all');
                      setSelectedSexFilter('all');
                      setSelectedGlitzFilter('all');
                      setSelectedDivisionFilter('all');
                      setSelectedFocusFilter('all');
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold underline"
                  >
                    Reset Advanced Filters
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
                  {/* 1. Age Filter */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Age Filter:</label>
                    <select
                      value={selectedAgeFilter}
                      onChange={(e) => setSelectedAgeFilter(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-xl px-2.5 py-2 text-slate-100 font-medium focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="all">All Ages</option>
                      <option value="20's">20’s Division</option>
                      <option value="30's">30’s Division</option>
                      <option value="40's">40’s Division</option>
                      <option value="50's">50’s Division</option>
                      <option value="60's">60’s Division</option>
                      <option value="70's">70’s Division</option>
                    </select>
                  </div>

                  {/* 2. Sex Filter */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Sex:</label>
                    <select
                      value={selectedSexFilter}
                      onChange={(e) => setSelectedSexFilter(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-xl px-2.5 py-2 text-slate-100 font-medium focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="all">All Genders</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  {/* 3. Competition Style & Glitz Level */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Glitz Level:</label>
                    <select
                      value={selectedGlitzFilter}
                      onChange={(e) => setSelectedGlitzFilter(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-xl px-2.5 py-2 text-slate-100 font-medium focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="all">All Glitz Levels</option>
                      <option value="Natural">Natural Pageants (Authentic / Clean)</option>
                      <option value="Semi-Glitz">Semi-Glitz (Moderate Styling / Runway)</option>
                      <option value="Glitz">Glitz Pageants (High Stage Glamour / Rhinestones)</option>
                    </select>
                  </div>

                  {/* 4. Demographic Division */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Pageant Division:</label>
                    <select
                      value={selectedDivisionFilter}
                      onChange={(e) => setSelectedDivisionFilter(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-xl px-2.5 py-2 text-slate-100 font-medium focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="all">All Divisions</option>
                      <option value="Little Miss">Little Miss / Pre-Teen / Teen</option>
                      <option value="Miss">Miss (Young Adult)</option>
                      <option value="Ms. / Mrs.">Ms. / Mrs. (Accomplished / Mature)</option>
                      <option value="Mister">Mister (Men / Fitness Showcases)</option>
                    </select>
                  </div>

                  {/* 5. Core Focus & Platform */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Core Focus & Platform:</label>
                    <select
                      value={selectedFocusFilter}
                      onChange={(e) => setSelectedFocusFilter(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-xl px-2.5 py-2 text-slate-100 font-medium focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="all">All Focus Types</option>
                      <option value="Service">Service & Intelligence (Miss America style)</option>
                      <option value="Glamour">Glamour & Fashion-Based (Runway / Wardrobe)</option>
                      <option value="Advocacy">Advocacy & International (Beauty with Purpose)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Media Items Stream or Empty State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <LoadingSpinner />
                <p className="text-xs text-slate-200 font-mono font-semibold">
                  Synchronizing master photographs with decentralized storage...
                </p>
              </div>
            ) : filteredPhotos.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
                <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">No media assets match current query</h3>
                <p className="text-xs text-slate-300 mt-1">Try resetting demographic cohort, glitz level, or keywords.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedCohortFilter('all');
                    setSelectedAgeFilter('all');
                    setSelectedSexFilter('all');
                    setSelectedGlitzFilter('all');
                    setSelectedDivisionFilter('all');
                    setSelectedFocusFilter('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : displayMode === 'details' ? (
              /* ======================================================== */
              /* DISPLAY MODE 4: HIGH-RES SPLIT DETAILS INSPECTION VIEW   */
              /* ======================================================== */
              (() => {
                const activePhoto =
                  filteredPhotos.find((p) => p.id === selectedDetailPhotoId) || filteredPhotos[0];
                const isVideo = activePhoto.media_type === 'video' || Boolean(activePhoto.videoUrl);
                const hasPoll = Boolean(
                  activePhoto.poll_data && activePhoto.poll_data.options && activePhoto.poll_data.options.length > 0
                );
                const totalPollVotes = activePhoto.poll_data
                  ? activePhoto.poll_data.totalVotes ||
                    activePhoto.poll_data.options.reduce((s, o) => s + o.votes, 0)
                  : 0;
                const aiScore =
                  activePhoto.aiScore ?? Math.min(99, Math.round(((activePhoto.rating || 4.9) / 5) * 100));

                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
                      {/* Left Side: Master Visual Canvas & Thumbnail Selector */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[420px] max-h-[580px] flex items-center justify-center group/stage">
                          <img
                            src={activePhoto.imageUrl}
                            alt={activePhoto.title}
                            className="w-full h-full object-contain max-h-[560px] transition-transform duration-300"
                          />

                          {/* 4K Video Play Overlay */}
                          {isVideo && (
                            <div
                              onClick={() => setSelectedVideoForPlay(activePhoto as any)}
                              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition cursor-pointer"
                            >
                              <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-2xl border-2 border-white/80 transform hover:scale-110 transition">
                                <Play className="w-7 h-7 ml-1 fill-white" />
                              </div>
                              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs uppercase shadow-md flex items-center gap-1.5">
                                <Film className="w-4 h-4" /> 4K UHD Video Master
                              </div>
                            </div>
                          )}

                          {/* Quick Bottom Status Bar */}
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                            <span className="px-3 py-1.5 rounded-xl bg-slate-950/90 text-white font-mono text-xs border border-slate-800 backdrop-blur-md">
                              {activePhoto.camera_info?.camera || 'Sony Alpha A7R V'} • 61 Megapixels
                            </span>
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-lg">
                              🪙 {activePhoto.price_credits} FIC
                            </span>
                          </div>
                        </div>

                        {/* Thumbnail Selector Strip */}
                        <div className="space-y-1.5">
                          <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-amber-400" />
                            Select Asset to Inspect ({filteredPhotos.length} Available):
                          </span>
                          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                            {filteredPhotos.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => setSelectedDetailPhotoId(item.id)}
                                className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                                  item.id === activePhoto.id
                                    ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/25'
                                    : 'border-slate-800 opacity-60 hover:opacity-100'
                                }`}
                              >
                                <img
                                  src={item.thumbnailUrl || item.imageUrl}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                                {item.media_type === 'video' && (
                                  <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-600 flex items-center justify-center">
                                    <Play className="w-2 h-2 text-white fill-white" />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Deep Metadata Inspection, AI Score & Licensing */}
                      <div className="lg:col-span-5 space-y-5">
                        {/* Title and Badges */}
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30">
                              {activePhoto.category}
                            </span>
                            {activePhoto.cohort && (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
                                {activePhoto.cohort}
                              </span>
                            )}
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                              {activePhoto.license_type}
                            </span>
                          </div>

                          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                            {activePhoto.title}
                          </h2>

                          <div className="flex items-center justify-between text-xs text-slate-300 mt-2 font-medium">
                            <span className="flex items-center gap-1">
                              <span>By</span>
                              <strong className="text-white">{activePhoto.photographer}</strong>
                              <ShieldCheck className="w-4 h-4 text-blue-400" />
                            </span>
                            <span className="flex items-center gap-1 text-slate-300">
                              <MapPin className="w-3.5 h-3.5 text-amber-400" />
                              {activePhoto.location || 'Global'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-200 mt-3 leading-relaxed font-medium">
                            {activePhoto.description ||
                              'High-fidelity sovereign photograph licensed on FingerMobile Protocol™.'}
                          </p>
                        </div>

                        {/* Autonomous AI Quality Score Pill & Inspector Button */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-emerald-950/40 border border-amber-500/40 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                                <Cpu className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                  Autonomous AI Quality Valuation
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                    {aiScore}/100 AI Score
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-300">
                                  MOS: {activePhoto.rating || 4.9} / 5.0 • Sharpness & Exposure Passed
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => setSelectedItemForAiQuality(activePhoto)}
                              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm transition transform hover:scale-105"
                            >
                              Inspect AI Breakdown
                            </button>
                          </div>
                        </div>

                        {/* Camera & Lens EXIF Specs Table */}
                        {activePhoto.camera_info && (
                          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                              <Camera className="w-3.5 h-3.5 text-amber-400" />
                              Camera & Lens Hardware Specs
                            </span>
                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                                <span className="text-slate-400 block text-[10px]">Body:</span>
                                <strong className="text-white text-xs">{activePhoto.camera_info.camera || 'Pro DSLR'}</strong>
                              </div>
                              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                                <span className="text-slate-400 block text-[10px]">Lens:</span>
                                <strong className="text-white text-xs">{activePhoto.camera_info.lens || '85mm f/1.4'}</strong>
                              </div>
                              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                                <span className="text-slate-400 block text-[10px]">Aperture:</span>
                                <strong className="text-white text-xs">{activePhoto.camera_info.aperture || 'f/1.4'}</strong>
                              </div>
                              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                                <span className="text-slate-400 block text-[10px]">Shutter Speed:</span>
                                <strong className="text-white text-xs">{activePhoto.camera_info.shutter || '1/250s'}</strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Interactive Community Poll */}
                        {hasPoll && activePhoto.poll_data && (
                          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2.5">
                            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                              <span className="flex items-center gap-1.5">
                                <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                                Community Poll: {activePhoto.poll_data.question}
                              </span>
                              <span className="text-[10px] text-slate-300 font-bold">{totalPollVotes} votes</span>
                            </div>

                            <div className="space-y-1.5">
                              {activePhoto.poll_data.options.map((opt) => {
                                const isSelected = activePhoto.poll_data?.userVotedOptionId === opt.id;
                                const pct =
                                  totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;

                                return (
                                  <button
                                    key={opt.id}
                                    onClick={() => handlePollVote(activePhoto.id, opt.id)}
                                    className={`w-full relative overflow-hidden rounded-lg p-2 text-left text-xs transition-all border ${
                                      isSelected
                                        ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                                        : 'border-slate-800 bg-slate-900/80 text-slate-100 hover:border-slate-700'
                                    }`}
                                  >
                                    <div
                                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600/30 to-emerald-600/30 transition-all duration-500 pointer-events-none"
                                      style={{ width: `${pct}%` }}
                                    />
                                    <div className="relative flex items-center justify-between z-10 font-medium">
                                      <span className="flex items-center gap-1.5">
                                        {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                                        {opt.text}
                                      </span>
                                      <span className="font-mono text-[11px] text-amber-300 font-bold">
                                        {pct}% ({opt.votes})
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Full Action Row (Like, Comment, Save, Bookmark, Favorite, Share) */}
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 text-[11px] font-mono">
                            <span className="text-amber-300 font-bold flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                              Yield: {(((activePhoto.downloads || 0) * activePhoto.price_credits * 0.8) + (((activePhoto.likes || 0) * 5 + ((activePhoto.saves || (savedGalleryIds.includes(activePhoto.id) ? 1 : 0)) * 10) + ((activePhoto.shares || 0) * 8) + ((activePhoto.comments || 3) * 6)) * 0.05)).toFixed(1)} FIC
                            </span>
                            <span className="text-slate-300 font-bold flex items-center gap-1">
                              <Flame className="w-3.5 h-3.5 text-orange-400" />
                              Index: {((activePhoto.likes || 0) * 5) + ((activePhoto.saves || (savedGalleryIds.includes(activePhoto.id) ? 1 : 0)) * 10) + ((activePhoto.shares || 0) * 8) + ((activePhoto.comments || 3) * 6) + ((activePhoto.downloads || 0) * 25) + ((activePhoto.poll_data?.totalVotes || 0) * 12)} pts
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-1 text-xs">
                            {/* Like / Vote */}
                            <button
                              onClick={() => handleVote(activePhoto.id, 'like')}
                              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 border font-bold ${
                                activePhoto.hasLiked
                                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                                  : 'bg-slate-900 text-slate-200 border-slate-800 hover:text-red-400'
                              }`}
                              title="Like / Vote (+5 pts)"
                            >
                              <Heart className={`w-3.5 h-3.5 ${activePhoto.hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                              <span>{activePhoto.likes}</span>
                            </button>

                            {/* Comment */}
                            <button
                              onClick={() => setSelectedItemForComments(activePhoto)}
                              className="px-3 py-2 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 hover:text-sky-300 transition flex items-center gap-1.5 font-bold"
                              title="Comments (+6 pts)"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                              <span>{activePhoto.comments || 3}</span>
                            </button>

                            {/* Save to My Gallery */}
                            <button
                              onClick={() => handleToggleSaveToGallery(activePhoto)}
                              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 border font-bold ${
                                savedGalleryIds.includes(activePhoto.id)
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  : 'bg-slate-900 text-slate-200 border-slate-800 hover:text-rose-300'
                              }`}
                              title={savedGalleryIds.includes(activePhoto.id) ? 'Saved in My Gallery' : 'Save to My Gallery (+10 pts)'}
                            >
                              <FolderHeart className={`w-3.5 h-3.5 ${savedGalleryIds.includes(activePhoto.id) ? 'fill-rose-400 text-rose-400' : ''}`} />
                              <span>{(activePhoto.saves || 0) + (savedGalleryIds.includes(activePhoto.id) ? 1 : 0)}</span>
                            </button>

                            {/* Bookmark */}
                            <button
                              onClick={() => handleToggleBookmark(activePhoto)}
                              className={`p-2 rounded-xl transition border ${
                                bookmarkedIds.includes(activePhoto.id) || activePhoto.isBookmarked
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-slate-900 text-slate-200 border-slate-800 hover:text-amber-400'
                              }`}
                              title="Bookmark"
                            >
                              <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(activePhoto.id) || activePhoto.isBookmarked ? 'fill-amber-400' : ''}`} />
                            </button>

                            {/* Favorite */}
                            <button
                              onClick={() => handleToggleFavorite(activePhoto)}
                              className={`p-2 rounded-xl transition border ${
                                favoriteIds.includes(activePhoto.id) || activePhoto.isFavorite
                                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                                  : 'bg-slate-900 text-slate-200 border-slate-800 hover:text-amber-400'
                              }`}
                              title="Add to Favorites"
                            >
                              <Star className={`w-4 h-4 ${favoriteIds.includes(activePhoto.id) || activePhoto.isFavorite ? 'fill-slate-950' : ''}`} />
                            </button>

                            {/* Share to FingerMobile & Social Media */}
                            <button
                              onClick={() => setSelectedItemForShare(activePhoto)}
                              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center gap-1.5 shadow-md transition"
                              title="Share to FingerMobile Platform & Social Networks (+8 pts)"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Share</span>
                            </button>
                          </div>

                          {/* Instant Licensing CTA */}
                          <button
                            onClick={() => {
                              setSelectedPhotoForLicense(activePhoto);
                              setChosenTier(activePhoto.license_type || 'Royalty-Free Standard');
                            }}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-amber-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Acquire {activePhoto.license_type || 'Standard'} License (80% Creator Royalty)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : displayMode === 'mosaic' ? (
              /* ======================================================== */
              /* DISPLAY MODE 1: MASONRY MOSAIC VISUAL WALL               */
              /* ======================================================== */
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {filteredPhotos.map((photo) => (
                  <PhotoCreditMosaicItem
                    key={photo.id}
                    item={photo}
                    isSaved={savedGalleryIds.includes(photo.id)}
                    isBookmarked={bookmarkedIds.includes(photo.id) || photo.isBookmarked}
                    isFavorite={favoriteIds.includes(photo.id) || photo.isFavorite}
                    onLike={() => handleVote(photo.id, 'like')}
                    onShare={() => setSelectedItemForShare(photo)}
                    onSave={() => handleToggleSaveToGallery(photo)}
                    onBookmark={() => handleToggleBookmark(photo)}
                    onToggleFavorite={() => handleToggleFavorite(photo)}
                    onInspectAi={() => setSelectedItemForAiQuality(photo)}
                    onPlayVideo={() => setSelectedVideoForPlay(photo as any)}
                    onSelect={() => {
                      setSelectedDetailPhotoId(photo.id);
                      setDisplayMode('details');
                    }}
                  />
                ))}
              </div>
            ) : displayMode === 'list' ? (
              /* ======================================================== */
              /* DISPLAY MODE 3: SOCIAL POST-CARD FEED STREAM             */
              /* ======================================================== */
              <div className="space-y-6 max-w-4xl mx-auto">
                {filteredPhotos.map((photo) => {
                  const isVideo = photo.media_type === 'video' || Boolean(photo.videoUrl);
                  const hasPoll = Boolean(
                    photo.poll_data && photo.poll_data.options && photo.poll_data.options.length > 0
                  );
                  const totalPollVotes = photo.poll_data
                    ? photo.poll_data.totalVotes ||
                      photo.poll_data.options.reduce((s, o) => s + o.votes, 0)
                    : 0;
                  const aiScore =
                    photo.aiScore ?? Math.min(99, Math.round(((photo.rating || 4.9) / 5) * 100));

                  return (
                    <div
                      key={photo.id}
                      className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden space-y-4"
                    >
                      {/* Post Card Header */}
                      <div className="px-6 pt-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                            {photo.photographer.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                              <span>{photo.photographer}</span>
                              <ShieldCheck className="w-4 h-4 text-blue-400" />
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-300 text-xs font-normal">{photo.location || 'Global'}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Master Asset ID: SHA-256 #{photo.id}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedItemForAiQuality(photo)}
                            className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 hover:bg-amber-500/30 transition"
                          >
                            <Cpu className="w-3.5 h-3.5 text-amber-400" />
                            {aiScore}% AI Quality
                          </button>
                          <span className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs">
                            🪙 {photo.price_credits} FIC
                          </span>
                        </div>
                      </div>

                      {/* Post Card Visual Canvas */}
                      <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {isVideo && (
                          <div
                            onClick={() => setSelectedVideoForPlay(photo as any)}
                            className="absolute inset-0 flex items-center justify-center bg-black/35 hover:bg-black/20 transition cursor-pointer"
                          >
                            <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-2xl border-2 border-white/80 hover:scale-110 transition">
                              <Play className="w-6 h-6 ml-1 fill-white" />
                            </div>
                            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-rose-600 text-white font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                              <Film className="w-3 h-3" /> 4K UHD Video
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Post Card Actions Bar */}
                      <div className="px-6 space-y-4">
                        <div className="flex items-center justify-between gap-1 text-xs">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleVote(photo.id, 'like')}
                              className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition ${
                                photo.hasLiked
                                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                                  : 'bg-slate-950 text-slate-200 border-slate-800 hover:text-red-400'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${photo.hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                              <span>{photo.likes}</span>
                            </button>

                            <button
                              onClick={() => setSelectedItemForComments(photo)}
                              className="px-3 py-1.5 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 hover:text-sky-300 font-bold flex items-center gap-1.5 transition"
                            >
                              <MessageSquare className="w-4 h-4 text-sky-400" />
                              <span>{photo.comments || 3}</span>
                            </button>

                            <button
                              onClick={() => handleToggleSaveToGallery(photo)}
                              className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition ${
                                savedGalleryIds.includes(photo.id)
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  : 'bg-slate-950 text-slate-200 border-slate-800 hover:text-rose-300'
                              }`}
                            >
                              <FolderHeart className={`w-4 h-4 ${savedGalleryIds.includes(photo.id) ? 'fill-rose-400 text-rose-400' : ''}`} />
                              <span>{(photo.saves || 0) + (savedGalleryIds.includes(photo.id) ? 1 : 0)}</span>
                            </button>

                            <button
                              onClick={() => handleToggleBookmark(photo)}
                              className={`p-2 rounded-xl border transition ${
                                bookmarkedIds.includes(photo.id) || photo.isBookmarked
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-slate-950 text-slate-200 border-slate-800 hover:text-amber-400'
                              }`}
                            >
                              <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(photo.id) || photo.isBookmarked ? 'fill-amber-400' : ''}`} />
                            </button>

                            <button
                              onClick={() => handleToggleFavorite(photo)}
                              className={`p-2 rounded-xl border transition ${
                                favoriteIds.includes(photo.id) || photo.isFavorite
                                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                                  : 'bg-slate-950 text-slate-200 border-slate-800 hover:text-amber-400'
                              }`}
                            >
                              <Star className={`w-4 h-4 ${favoriteIds.includes(photo.id) || photo.isFavorite ? 'fill-slate-950' : ''}`} />
                            </button>
                          </div>

                          <button
                            onClick={() => setSelectedItemForShare(photo)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md transition"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share</span>
                            <span className="font-mono text-[11px]">({photo.shares || 12})</span>
                          </button>
                        </div>

                        {/* Title & Caption */}
                        <div>
                          <h3 className="text-base font-extrabold text-white">{photo.title}</h3>
                          <p className="text-xs text-slate-300 leading-relaxed font-medium mt-1">
                            {photo.description || 'Master photograph licensed under sovereign royalty parameters.'}
                          </p>
                        </div>

                        {/* Interactive Poll */}
                        {hasPoll && photo.poll_data && (
                          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                              <span>📊 Community Poll: {photo.poll_data.question}</span>
                              <span className="text-[10px] text-slate-400">{totalPollVotes} votes</span>
                            </div>
                            <div className="space-y-1.5">
                              {photo.poll_data.options.map((opt) => {
                                const isSelected = photo.poll_data?.userVotedOptionId === opt.id;
                                const pct = totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
                                return (
                                  <button
                                    key={opt.id}
                                    onClick={() => handlePollVote(photo.id, opt.id)}
                                    className={`w-full relative overflow-hidden rounded-lg p-2 text-left text-xs transition border ${
                                      isSelected
                                        ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                                        : 'border-slate-800 bg-slate-900/80 text-slate-100 hover:border-slate-700'
                                    }`}
                                  >
                                    <div
                                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600/30 to-emerald-600/30 transition-all duration-500 pointer-events-none"
                                      style={{ width: `${pct}%` }}
                                    />
                                    <div className="relative flex items-center justify-between z-10 font-medium">
                                      <span>{opt.text}</span>
                                      <span className="font-mono text-amber-300 font-bold">{pct}%</span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Card Footer CTA Row */}
                        <div className="pb-5 pt-1 flex items-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedPhotoForLicense(photo);
                              setChosenTier(photo.license_type || 'Royalty-Free Standard');
                            }}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-amber-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Acquire License & Download Master (80% Creator Royalty)
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ======================================================== */
              <div className="space-y-8">
                {groupedPhotos.map((group) => {
                  const isCollapsed = Boolean(collapsedGroups[group.key]);
                  return (
                    <div key={group.key} className="space-y-4">
                      {groupBy !== 'none' && (
                        <div
                          onClick={() =>
                            setCollapsedGroups((prev) => ({
                              ...prev,
                              [group.key]: !prev[group.key]
                            }))
                          }
                          className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition select-none"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                              <Folder className="w-4 h-4" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                <span>{group.label}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                                  {group.items.length} items
                                </span>
                              </h3>
                              <p className="text-[11px] text-slate-400">
                                Grouped by {groupBy === 'folder' ? 'Folder / Collection' : 'Creator / Photographer'}
                              </p>
                            </div>
                          </div>
                          <div className="text-slate-400 hover:text-white">
                            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </div>
                      )}

                      {!isCollapsed && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {group.items.map((photo) => {
                            const hasPoll = Boolean(
                              photo.poll_data && photo.poll_data.options && photo.poll_data.options.length > 0
                            );
                            const totalPollVotes = photo.poll_data
                              ? photo.poll_data.totalVotes ||
                      photo.poll_data.options.reduce((s, o) => s + o.votes, 0)
                              : 0;
                            const isVideo = photo.media_type === 'video' || Boolean(photo.videoUrl);
                            const aiScore =
                    photo.aiScore ?? Math.min(99, Math.round(((photo.rating || 4.9) / 5) * 100));

                            return (
                              <div
                                key={photo.id}
                                className="group flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-950/20"
                              >
                                {/* Media Image/Video Canvas */}
                                <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                                  <img
                                    src={photo.imageUrl}
                                    alt={photo.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-black/40 pointer-events-none" />

                                  {/* Video Play Overlay */}
                                  {isVideo && (
                                    <div
                                      onClick={() => setSelectedVideoForPlay(photo as any)}
                                      className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 hover:bg-black/20 transition-colors cursor-pointer group/vid"
                                    >
                                      <div className="w-14 h-14 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl border-2 border-white/80 group-hover/vid:scale-110 transition-transform">
                                        <Play className="w-6 h-6 ml-1 fill-white" />
                                      </div>
                                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-rose-600 text-white font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                                        <Film className="w-3 h-3" /> 4K UHD Video
                                      </div>
                                    </div>
                                  )}

                                  {/* Top Badges */}
                                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                                    <span className="px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md text-[11px] font-bold text-slate-100 border border-slate-700 flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-amber-400" />
                                      {photo.location || 'Global'}
                                    </span>
                                    {photo.cohort && (
                                      <span className="px-2.5 py-1 rounded-full bg-indigo-950/90 backdrop-blur-md text-[10px] font-bold text-indigo-200 border border-indigo-500/40">
                                        {photo.cohort}
                                      </span>
                                    )}
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/40">
                                      {photo.category}
                                    </span>
                                  </div>

                                  {/* Top Right Quick Actions: AI Inspector & Favorite */}
                                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                                    <button
                                      onClick={() => setSelectedItemForAiQuality(photo)}
                                      className="px-2 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-amber-400/50 text-amber-300 hover:text-white transition shadow-sm flex items-center gap-1 text-[10px] font-bold"
                                      title="Inspect Autonomous AI Quality Breakdown (The Science & The Art)"
                                    >
                                      <Cpu className="w-3 h-3 text-amber-400" />
                                      <span>{aiScore}%</span>
                                    </button>

                                    <button
                                      onClick={() => handleToggleFavorite(photo)}
                                      className={`p-1.5 rounded-xl backdrop-blur-md border transition shadow-sm ${
                                        favoriteIds.includes(photo.id) || photo.isFavorite
                                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                                          : 'bg-slate-950/85 border-slate-700 text-slate-200 hover:text-amber-400'
                                      }`}
                                      title={favoriteIds.includes(photo.id) || photo.isFavorite ? 'In Favorites' : 'Add to Favorites'}
                                    >
                                      <Star className={`w-3.5 h-3.5 ${favoriteIds.includes(photo.id) || photo.isFavorite ? 'fill-slate-950' : ''}`} />
                                    </button>
                                  </div>

                                  {/* Price Tag & Rating */}
                                  <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                                    <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-amber-300 font-bold text-xs flex items-center gap-1 border border-amber-500/30">
                                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                      {photo.rating || 4.9}
                                    </span>
                                    <span className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs shadow-lg">
                            🪙 {photo.price_credits} FIC
                                    </span>
                                  </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-start justify-between gap-2">
                                      <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                                        {photo.title}
                                      </h3>
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          onClick={() => handleToggleSaveToGallery(photo)}
                                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                            savedGalleryIds.includes(photo.id)
                                              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-rose-300'
                                          }`}
                                          title={savedGalleryIds.includes(photo.id) ? 'Saved in My Gallery' : 'Save to My Gallery (+10 pts)'}
                                        >
                                          <FolderHeart className={`w-3.5 h-3.5 ${savedGalleryIds.includes(photo.id) ? 'fill-rose-400 text-rose-400' : ''}`} />
                                        </button>
                                        <button
                                          onClick={() => handleToggleBookmark(photo)}
                                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                            bookmarkedIds.includes(photo.id) || photo.isBookmarked
                                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                                          }`}
                                          title={bookmarkedIds.includes(photo.id) || photo.isBookmarked ? 'Bookmarked' : 'Bookmark in Library'}
                                        >
                                          <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(photo.id) || photo.isBookmarked ? 'fill-amber-400' : ''}`} />
                                        </button>
                                      </div>
                                    </div>

                                    <div className="text-xs text-slate-200 mt-1.5 flex items-center justify-between">
                                      <span className="flex items-center gap-1">
                                        <span className="text-slate-300">By</span>
                                        <span className="text-white font-bold">{photo.photographer}</span>
                                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                                      </span>
                                      <button
                                        onClick={() => handleMessageCreator(photo.photographer)}
                                        className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
                                      >
                                        <MessageSquare className="w-3 h-3" />
                              Contact
                                      </button>
                                    </div>

                                    {/* Camera EXIF Details Pill */}
                                    {photo.camera_info && (
                                      <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-200 grid grid-cols-2 gap-1.5 font-mono">
                                        <div>
                                          <span className="text-slate-300 font-semibold">Camera:</span>{' '}
                                          <span className="text-white font-bold">{photo.camera_info.camera || 'Pro DSLR'}</span>
                                        </div>
                                        <div>
                                          <span className="text-slate-300 font-semibold">Lens:</span>{' '}
                                          <span className="text-white font-bold">{photo.camera_info.lens || '85mm f/1.4'}</span>
                                        </div>
                                        <div>
                                          <span className="text-slate-300 font-semibold">Aperture:</span>{' '}
                                          <span className="text-white font-bold">{photo.camera_info.aperture || 'f/1.4'}</span>
                                        </div>
                                        <div>
                                          <span className="text-slate-300 font-semibold">Shutter:</span>{' '}
                                          <span className="text-white font-bold">{photo.camera_info.shutter || '1/250s'}</span>
                                        </div>
                                      </div>
                                    )}

                                    <p className="text-xs text-slate-100 mt-2.5 line-clamp-2 leading-relaxed font-medium">
                                      {photo.description || 'Master-resolution licensed stock media on FingerMobile Protocol™.'}
                                    </p>

                                    {/* INTERACTIVE COMMUNITY POLL */}
                                    {hasPoll && photo.poll_data && (
                                      <div className="mt-4 p-3.5 rounded-xl bg-slate-950/90 border border-amber-500/30 space-y-2.5">
                                        <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                                          <span className="flex items-center gap-1.5">
                                            <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                                  Community Poll: {photo.poll_data.question}
                                          </span>
                                          <span className="text-[10px] text-slate-200 font-bold">{totalPollVotes} votes</span>
                                        </div>

                                        <div className="space-y-1.5">
                                          {photo.poll_data.options.map((opt) => {
                                            const isSelected = photo.poll_data?.userVotedOptionId === opt.id;
                                            const pct = totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;

                                            return (
                                              <button
                                                key={opt.id}
                                                onClick={() => handlePollVote(photo.id, opt.id)}
                                                className={`w-full relative overflow-hidden rounded-lg p-2 text-left text-xs transition-all border ${
                                                  isSelected
                                                    ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                                                    : 'border-slate-800 bg-slate-900/80 text-slate-100 hover:border-slate-700 font-medium'
                                                }`}
                                              >
                                                <div
                                                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600/30 to-emerald-600/30 transition-all duration-500 pointer-events-none"
                                                  style={{ width: `${pct}%` }}
                                                />
                                                <div className="relative flex items-center justify-between z-10">
                                                  <span className="flex items-center gap-1.5 font-semibold text-slate-100">
                                                    {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                                                    {opt.text}
                                                  </span>
                                                  <span className="font-mono text-[11px] text-amber-300 font-bold">
                                                    {pct}% ({opt.votes})
                                                  </span>
                                                </div>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* FOOTER ACTION BUTTONS & MONETIZATION METRICS */}
                                  <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
                                    {/* Sovereign Yield & Monetization Index Badge */}
                                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/90 border border-amber-500/30 text-[11px] font-mono">
                                      <span className="text-amber-300 font-bold flex items-center gap-1" title="80% Direct Creator Royalty + Engagement Staking Yield">
                                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                              Yield: {(((photo.downloads || 0) * photo.price_credits * 0.8) + (((photo.likes || 0) * 5 + ((photo.saves || (savedGalleryIds.includes(photo.id) ? 1 : 0)) * 10) + ((photo.shares || 0) * 8) + ((photo.comments || 3) * 6)) * 0.05)).toFixed(1)} FIC
                                      </span>
                                      <span className="text-slate-300 font-bold flex items-center gap-1" title="Composite Monetization Index Points">
                                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                              Index: {((photo.likes || 0) * 5) + ((photo.saves || (savedGalleryIds.includes(photo.id) ? 1 : 0)) * 10) + ((photo.shares || 0) * 8) + ((photo.comments || 3) * 6) + ((photo.downloads || 0) * 25) + ((photo.poll_data?.totalVotes || 0) * 12)} pts
                                      </span>
                                    </div>

                                    {/* Full Engagement Actions Bar */}
                                    <div className="flex items-center justify-between gap-1 text-xs text-slate-200 font-semibold">
                                      {/* Like / Vote Button */}
                                      <button
                                        onClick={() => handleVote(photo.id, 'like')}
                                        className={`px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 border ${
                                          photo.hasLiked
                                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                            : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800'
                                        }`}
                                        title="Vote / Like (+5 Sovereign pts)"
                                      >
                                        <Heart className={`w-3.5 h-3.5 ${photo.hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                        <span className="font-bold">{photo.likes}</span>
                                      </button>

                                      {/* Comments Button */}
                                      <button
                                        onClick={() => setSelectedItemForComments(photo)}
                                        className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-sky-300 border border-slate-800 transition-colors flex items-center gap-1"
                                        title="Community Comments (+6 Sovereign pts)"
                                      >
                                        <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                                        <span className="font-bold">{photo.comments || 3}</span>
                                      </button>

                                      {/* Save to My Gallery Button */}
                                      <button
                                        onClick={() => handleToggleSaveToGallery(photo)}
                                        className={`px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 border ${
                                          savedGalleryIds.includes(photo.id)
                                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                            : 'bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-rose-300 border-slate-800'
                                        }`}
                                        title={savedGalleryIds.includes(photo.id) ? 'Saved in My Gallery' : 'Save to My Gallery (+10 Sovereign pts)'}
                                      >
                                        <FolderHeart className={`w-3.5 h-3.5 ${savedGalleryIds.includes(photo.id) ? 'fill-rose-400 text-rose-400' : 'text-rose-400'}`} />
                                        <span className="font-bold">{(photo.saves || 0) + (savedGalleryIds.includes(photo.id) ? 1 : 0)}</span>
                                      </button>

                                      {/* Share to FingerMobile & Social Media */}
                                      <button
                                        onClick={() => setSelectedItemForShare(photo)}
                                        className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center gap-1 shadow-sm"
                                        title="Share to FingerMobile & Social Networks (+8 Sovereign pts)"
                                      >
                                        <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                                        <span className="font-bold text-[11px]">Share</span>
                                        <span className="font-bold font-mono">({photo.shares || 12})</span>
                                      </button>

                                      {/* Report Media */}
                                      <button
                                        onClick={() => handleReport(photo.title)}
                                        className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
                                        title="Report Media"
                                      >
                                        <Flag className="w-3 h-3" />
                                      </button>
                                    </div>

                                    {/* CTA Row (Stream Video if Video + License Button) */}
                                    <div className="flex items-center gap-2">
                                      {isVideo && (
                                        <button
                                          onClick={() => setSelectedVideoForPlay(photo as any)}
                                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all"
                                        >
                                          <Play className="w-3.5 h-3.5 fill-white" />
                                Stream 4K Video
                                        </button>
                                      )}

                                      <button
                                        onClick={() => {
                                          setSelectedPhotoForLicense(photo);
                                          setChosenTier(photo.license_type || 'Royalty-Free Standard');
                                        }}
                                        className={`${
                                          isVideo ? 'flex-1' : 'w-full'
                                        } flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-amber-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-600/20 transition-all transform hover:-translate-y-0.5`}
                                      >
                                        <Download className="w-4 h-4" />
                                        {isVideo ? 'License Video' : 'Acquire License & Download Master'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: MY SAVED GALLERY & BOOKMARKS */}
        {/* ======================================================== */}
        {activeTab === 'my-gallery' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header / Sub-filter Bar */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-500/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-2 border border-rose-500/30">
                    <FolderHeart className="w-3.5 h-3.5" />
                    Sovereign Decentralized Vault
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">My Saved Gallery & Bookmarks</h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-medium">
                    Your personal curated collection of master photographs and 4K cinematic videos. Saving items directly boosts creator monetization and sovereign royalty index.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-rose-300 font-bold font-mono">
                    {savedGalleryIds.length} Saved in Gallery
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 font-bold font-mono">
                    {bookmarkedIds.length} Bookmarked
                  </span>
                </div>
              </div>

              {/* Sub-filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300 mr-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-rose-400" /> Filter Saved Assets:
                </span>
                {[
                  { id: 'all', label: `All Collection (${savedPhotos.length})` },
                  { id: 'saved', label: `Saved to Gallery Only (${savedGalleryIds.length})` },
                  { id: 'bookmarked', label: `Bookmarks Only (${bookmarkedIds.length})` },
                  { id: 'photos', label: '📷 Photos Only' },
                  { id: 'videos', label: '🎬 4K Videos Only' }
                ].map((f) => {
                  const isSelected = gallerySubFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setGallerySubFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Saved Items Grid or Empty State */}
            {savedPhotos.length === 0 ? (
              <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <FolderHeart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Your Saved Gallery is Currently Empty</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-medium">
                  Browse the Master Photograph Gallery and click <strong className="text-rose-400">"Save to My Gallery"</strong> or <strong className="text-amber-400">"Bookmark"</strong> on any photo or 4K video to curate your sovereign library and award creator royalties!
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-600/20 transition-all transform hover:scale-105"
                  >
                    Browse Master Gallery
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPhotos.map((photo) => {
                  const isVideo = photo.media_type === 'video' || !!photo.videoUrl;
                  const isSavedInGallery = savedGalleryIds.includes(photo.id);
                  const isItemBookmarked = bookmarkedIds.includes(photo.id) || photo.isBookmarked;

                  return (
                    <div
                      key={photo.id}
                      className="group flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10"
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                        <img
                          src={photo.thumbnailUrl || photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

                        {/* Top Chips */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                          {isVideo && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-600 text-white flex items-center gap-1 shadow-md">
                              <Film className="w-3 h-3" />
                              4K CINEMATIC
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/40">
                            {photo.category}
                          </span>
                        </div>

                        {/* Price & Rating */}
                        <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                          <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-amber-300 font-bold text-xs flex items-center gap-1 border border-amber-500/30">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {photo.rating || 4.9}
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs shadow-lg">
                            🪙 {photo.price_credits} FIC
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                              {photo.title}
                            </h3>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleToggleSaveToGallery(photo)}
                                className="p-1.5 rounded-lg border text-xs bg-rose-500/20 border-rose-500/50 text-rose-300"
                                title="Remove from My Gallery"
                              >
                                <FolderHeart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                              </button>
                              <button
                                onClick={() => handleToggleBookmark(photo)}
                                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                  isItemBookmarked
                                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                                }`}
                                title={isItemBookmarked ? 'Bookmarked' : 'Bookmark'}
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${isItemBookmarked ? 'fill-amber-400' : ''}`} />
                              </button>
                            </div>
                          </div>

                          <div className="text-xs text-slate-200 mt-1.5 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <span className="text-slate-300">By</span>
                              <span className="text-white font-bold">{photo.photographer}</span>
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                            </span>
                            <span className="text-[11px] text-slate-400">{photo.location}</span>
                          </div>

                          <p className="text-xs text-slate-100 mt-2.5 line-clamp-2 leading-relaxed font-medium">
                            {photo.description || 'Master-resolution licensed stock media on FingerMobile Protocol™.'}
                          </p>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
                          {/* Sovereign Yield & Monetization Index Badge */}
                          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-950/90 border border-amber-500/30 text-[11px] font-mono">
                            <span className="text-amber-300 font-bold flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                              Yield: {(((photo.downloads || 0) * photo.price_credits * 0.8) + (((photo.likes || 0) * 5 + ((photo.saves || (isSavedInGallery ? 1 : 0)) * 10) + ((photo.shares || 0) * 8) + ((photo.comments || 3) * 6)) * 0.05)).toFixed(1)} FIC
                            </span>
                            <span className="text-slate-300 font-bold flex items-center gap-1">
                              <Flame className="w-3.5 h-3.5 text-orange-400" />
                              Index: {((photo.likes || 0) * 5) + ((photo.saves || (isSavedInGallery ? 1 : 0)) * 10) + ((photo.shares || 0) * 8) + ((photo.comments || 3) * 6) + ((photo.downloads || 0) * 25) + ((photo.poll_data?.totalVotes || 0) * 12)} pts
                            </span>
                          </div>

                          {/* Quick Actions Row */}
                          <div className="flex items-center justify-between gap-1 text-xs text-slate-200 font-semibold">
                            <button
                              onClick={() => handleVote(photo.id, 'like')}
                              className={`px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 border ${
                                photo.hasLiked
                                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                  : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800'
                              }`}
                              title="Like / Vote"
                            >
                              <Heart className={`w-3.5 h-3.5 ${photo.hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                              <span className="font-bold">{photo.likes}</span>
                            </button>

                            <button
                              onClick={() => setSelectedItemForComments(photo)}
                              className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-sky-300 border border-slate-800 transition-colors flex items-center gap-1"
                              title="Comments"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                              <span className="font-bold">{photo.comments || 3}</span>
                            </button>

                            <button
                              onClick={() => setSelectedItemForShare(photo)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center gap-1"
                              title="Share"
                            >
                              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="font-bold text-[11px]">Share</span>
                            </button>

                            <button
                              onClick={() => handleToggleSaveToGallery(photo)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 transition-colors text-[11px] font-bold"
                              title="Remove from Saved Gallery"
                            >
                              Remove
                            </button>
                          </div>

                          {/* CTA Row */}
                          <div className="flex items-center gap-2">
                            {isVideo && (
                              <button
                                onClick={() => setSelectedVideoForPlay(photo as any)}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all"
                              >
                                <Play className="w-3.5 h-3.5 fill-white" />
                                Stream 4K
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setSelectedPhotoForLicense(photo);
                                setChosenTier(photo.license_type || 'Royalty-Free Standard');
                              }}
                              className={`${
                                isVideo ? 'flex-1' : 'w-full'
                              } flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-amber-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-600/20 transition-all`}
                            >
                              <Download className="w-4 h-4" />
                              License & Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: 22-DAY MONTHLY CREATOR CONTEST & MONETIZATION */}
        {/* ======================================================== */}
        {activeTab === 'giveaway' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Contest Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/80 via-slate-900 to-emerald-950/70 border border-amber-500/40 p-6 sm:p-10 shadow-2xl">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    Official 22-Day Monthly Creator Contest & Monetization Engine
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                    150,000 FIC Monthly Prize Pool
                  </h2>
                  <p className="text-slate-100 text-sm sm:text-base max-w-2xl leading-relaxed font-medium">
                    Every 22 days, top creators and models stand a chance to win bonus FIC and be crowned <strong className="text-amber-300">PhotoCredit Face or Video of the Month</strong>. Winners receive featured placement on PhotoCredit Widgets, Trends Widget & Trends Page, FingerLux luxury showcases, and official Coupon & Gift Card Branding Master Artwork!
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-amber-200 font-bold">
                    <span className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-amber-500/40">
                      Contest Cycle: Every 22 Days
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-emerald-300">
                      Next Draw: Thursday, November 5, 2026 (Day 22)
                    </span>
                  </div>
                </div>

                {/* Live 22-Day Countdown Clock */}
                <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md flex flex-col items-center">
                  <div className="text-xs text-slate-200 uppercase tracking-widest font-black flex items-center gap-1.5 mb-3">
                    <Clock className="w-4 h-4 text-amber-400" />
                    22-Day Contest Countdown
                  </div>
                  <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl min-w-[60px]">
                      <div className="text-2xl sm:text-3xl font-black text-white">{countdown.days}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-200">Days</div>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl min-w-[60px]">
                      <div className="text-2xl sm:text-3xl font-black text-white">{countdown.hours}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-200">Hours</div>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl min-w-[60px]">
                      <div className="text-2xl sm:text-3xl font-black text-white">{countdown.minutes}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-200">Mins</div>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl min-w-[60px]">
                      <div className="text-2xl sm:text-3xl font-black text-amber-400">{countdown.seconds}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-200">Secs</div>
                    </div>
                  </div>
                  <div className="mt-4 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    Monetization Index updates live on every vote & share
                  </div>
                </div>
              </div>
            </div>

            {/* Exclusive Perks Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div className="font-bold text-white text-sm">Face / Video of the Month</div>
                <p className="text-xs text-slate-300 font-medium">
                  Official protocol coronation, high-profile media accreditation, and master verified badge.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="font-bold text-white text-sm">PhotoCredit Widgets Spotlight</div>
                <p className="text-xs text-slate-300 font-medium">
                  Top placement across all ecosystem rotating widgets seen by thousands of daily users.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-sky-500/40 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="font-bold text-white text-sm">Trends & FingerLux Appearance</div>
                <p className="text-xs text-slate-300 font-medium">
                  Featured headliner on the FingerMobile Trends page and luxury curated FingerLux boutique.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/40 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="font-bold text-white text-sm">Coupon / Gift Card Branding</div>
                <p className="text-xs text-slate-300 font-medium">
                  Winning portrait minted as the official artwork backdrop for FingerMobile Coupon & Gift Card releases.
                </p>
              </div>
            </div>

            {/* Business Logic Formula & Score Card */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base">
                  <BarChart2 className="w-5 h-5" />
                  Primary Business Logic: Monetization & Composite Index Formula
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                  Every 22 Days Reset & Payout
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed font-bold">
                Monetization Index = (Likes × 5) + (Saves × 10) + (Shares × 8) + (Comments × 6) + (Downloads × 25) + (Poll Votes × 12)
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs text-slate-100">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-300 block font-bold text-[11px]">❤️ Share Voting / Like</span>
                  <span className="text-red-400 font-black text-sm">+5 pts</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-300 block font-bold text-[11px]">💾 Save to Gallery</span>
                  <span className="text-rose-400 font-black text-sm">+10 pts</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-300 block font-bold text-[11px]">↗️ Social / FM Share</span>
                  <span className="text-emerald-400 font-black text-sm">+8 pts</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-300 block font-bold text-[11px]">💬 Comments</span>
                  <span className="text-sky-400 font-black text-sm">+6 pts</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-300 block font-bold text-[11px]">📥 Downloads (80% Split)</span>
                  <span className="text-amber-400 font-black text-sm">+25 pts</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-300 block font-bold text-[11px]">📊 Polling Votes</span>
                  <span className="text-purple-400 font-black text-sm">+12 pts</span>
                </div>
              </div>
            </div>

            {/* Category & Metric Filters Control Bar */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              {/* Category Types Switcher */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Filter className="w-3.5 h-3.5 text-amber-400" /> Category Types:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'all', label: 'All Categories' },
                    { id: 'photo', label: '📷 Photo Category (Face of the Month)' },
                    { id: 'video', label: '🎬 Video Category (Video of the Month)' },
                    { id: 'poll', label: '📊 Community Polls Category' }
                  ].map((cat) => {
                    const isSelected = giveawayCategoryFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setGiveawayCategoryFilter(cat.id as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-600 to-emerald-600 text-white border-amber-400 shadow-md shadow-amber-600/30 font-extrabold'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Metric Types Switcher */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Dynamic Metric Leaderboards:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'composite', label: '⚡ Top Overall (Monetization Index)' },
                    { id: 'likes', label: '❤️ Highest Likes' },
                    { id: 'comments', label: '💬 Highest Comments' },
                    { id: 'saves', label: '💾 Highest Saves' },
                    { id: 'downloads', label: '📥 Highest Downloads' },
                    { id: 'pollVotes', label: '📊 Highest Poll Votes' }
                  ].map((m) => {
                    const isSelected = giveawayMetricFilter === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setGiveawayMetricFilter(m.id as any)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-slate-100 text-slate-950 border-white shadow-md font-black'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Dynamic Leaderboard Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Top Ranked Media Assets ({giveawayCategoryFilter.toUpperCase()} | {giveawayMetricFilter.toUpperCase()})
                </h3>
                <span className="text-xs text-slate-200 font-bold">
                  Showing Top 10 Contenders
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {computedLeaderboard.map((item) => {
                  const isTop3 = item.rank <= 3;
                  const rankMedal =
                    item.rank === 1 ? '🥇 1st Place' : item.rank === 2 ? '🥈 2nd Place' : item.rank === 3 ? '🥉 3rd Place' : `#${item.rank}`;

                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border transition-all ${
                        isTop3
                          ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/50 shadow-xl'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="relative w-full sm:w-32 h-36 sm:h-auto rounded-xl overflow-hidden bg-slate-950 shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/80 font-black text-xs text-yellow-300">
                          {rankMedal}
                        </div>
                        {item.media_type === 'video' && (
                          <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-rose-600 text-[10px] font-black text-white flex items-center gap-0.5">
                            <Film className="w-2.5 h-2.5" /> 4K Video
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-sm text-white line-clamp-1">{item.title}</h4>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                              🪙 {Number(item.prizeFIC || 0).toLocaleString()} FIC
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 font-semibold mt-0.5">By {item.photographer}</p>

                          {/* Guaranteed Perk Badge */}
                          <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="line-clamp-1">{item.perk}</span>
                          </div>

                          {/* Detailed Metrics Chips */}
                          <div className="mt-2.5 grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-[11px] font-mono text-slate-200 font-bold">
                            <div className="p-1 rounded bg-slate-950 border border-slate-800 text-center">
                              <span className="text-slate-400 block text-[9px]">Score</span>
                              <span className="text-amber-400 font-black">{item.compositeScore}</span>
                            </div>
                            <div className="p-1 rounded bg-slate-950 border border-slate-800 text-center">
                              <span className="text-slate-400 block text-[9px]">Likes</span>
                              <span>{item.likes}</span>
                            </div>
                            <div className="p-1 rounded bg-slate-950 border border-slate-800 text-center">
                              <span className="text-slate-400 block text-[9px]">Saves</span>
                              <span className="text-rose-400">{item.saves}</span>
                            </div>
                            <div className="p-1 rounded bg-slate-950 border border-slate-800 text-center">
                              <span className="text-slate-400 block text-[9px]">Comments</span>
                              <span className="text-sky-400">{item.comments}</span>
                            </div>
                            <div className="p-1 rounded bg-slate-950 border border-slate-800 text-center">
                              <span className="text-slate-400 block text-[9px]">Downloads</span>
                              <span className="text-emerald-400">{item.downloads}</span>
                            </div>
                          </div>
                        </div>

                        {/* Leaderboard Card Actions */}
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => handleVote(item.id, 'like')}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1"
                          >
                            <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                            Vote (+5)
                          </button>
                          <button
                            onClick={() => {
                              const matched = photos.find((p) => p.id === item.id);
                              if (matched) handleToggleSaveToGallery(matched);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-xs font-bold text-rose-300 border border-rose-500/40 transition-colors flex items-center gap-1"
                          >
                            <FolderHeart className="w-3 h-3 text-rose-400" />
                            Save (+10)
                          </button>
                          <button
                            onClick={() => {
                              const matched = photos.find((p) => p.id === item.id);
                              if (matched) setSelectedItemForShare(matched);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-xs font-bold text-emerald-300 border border-emerald-500/40 transition-colors flex items-center gap-1"
                          >
                            <Share2 className="w-3 h-3 text-emerald-400" />
                            Share (+8)
                          </button>
                          <button
                            onClick={() => {
                              const matched = photos.find((p) => p.id === item.id);
                              if (matched) {
                                setSelectedPhotoForLicense(matched);
                                setChosenTier(matched.license_type || 'Royalty-Free Standard');
                              }
                            }}
                            className="ml-auto px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
                          >
                            License
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CREATOR ROYALTIES & PAYOUTS (80/20) */}
        {/* ======================================================== */}
        {activeTab === 'royalties' && (
          <div className="space-y-6">
            {/* 80/20 Split Breakdown Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Guaranteed Sovereign Revenue Sharing
                  </div>
                  <h3 className="text-2xl font-black text-white">80% Creator Royalty Split</h3>
                  <p className="text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
                    Unlike legacy stock photo monopolies that pay creators under 15–20%, FingerMobile guarantees an inviolable 80% split directly to the verified photographer for every single license purchased.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-950/80 border border-slate-750 p-4 rounded-xl">
                  <div>
                    <div className="text-xs text-slate-200 font-bold uppercase tracking-wider">Photographer Share</div>
                    <div className="text-2xl font-black text-emerald-400">80%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-200 font-bold uppercase tracking-wider">Protocol Infrastructure</div>
                    <div className="text-2xl font-black text-slate-200">20%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Creator Revenue Dashboard Mock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-750 shadow-xl">
                <div className="flex items-center justify-between text-slate-200 text-xs font-bold mb-2">
                  <span>Total Royalty Earnings</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">1,480.00 FIC</div>
                <div className="text-[11px] text-emerald-300 font-bold mt-2 flex items-center gap-1">
                  <span>+28% from last month</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-750 shadow-xl">
                <div className="flex items-center justify-between text-slate-200 text-xs font-bold mb-2">
                  <span>Licenses Sold</span>
                  <Download className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">46 Downloads</div>
                <div className="text-[11px] text-slate-300 font-medium mt-2">
                  Across 6 registered portfolios
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-750 shadow-xl">
                <div className="flex items-center justify-between text-slate-200 text-xs font-bold mb-2">
                  <span>Available for Withdrawal</span>
                  <Award className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-300">840.00 FIC</div>
                <button
                  onClick={() => showToast('Instant withdrawal routed to sovereign wallet!', 'success')}
                  className="mt-3 w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Withdraw to Wallet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: IMMUTABLE CERTIFICATION VAULT */}
        {/* ======================================================== */}
        {activeTab === 'certificate' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-750 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Photographic Proof-of-Authorship</h3>
                  <p className="text-xs text-slate-200 font-medium">
                    Cryptographic SHA-256 fingerprinting and digital provenance for every photograph.
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed max-w-3xl font-medium">
                When a photographer uploads a master capture, FingerMobile automatically computes its perceptual hash and cryptographic signature. This guarantees tamper-proof copyright ownership, prevents uncredited scraping, and issues verifiable licenses across the decentralized web.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 space-y-2">
                <div className="text-amber-400 text-[10px] uppercase font-bold tracking-wider">Example Provenance Certificate:</div>
                <div className="flex justify-between">
                  <span className="text-slate-300 font-semibold">Ledger Contract:</span>
                  <span className="text-sky-300 font-mono font-bold">0x742d35Cc6634C0532925a3b844Bc454e4438f44e</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300 font-semibold">SHA-256 Master Hash:</span>
                  <span className="text-emerald-300 font-mono font-bold">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300 font-semibold">Copyright Standard:</span>
                  <span className="text-amber-300 font-bold">Berne Convention & FingerMobile Protocol™ v2.6</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* ACQUIRE LICENSE MODAL */}
      {/* ======================================================== */}
      {selectedPhotoForLicense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <FileText className="w-4 h-4" />
                Select PhotoCredits License Tier
              </div>
              <button
                onClick={() => setSelectedPhotoForLicense(null)}
                className="text-slate-200 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-950 border border-slate-750">
              <img
                src={selectedPhotoForLicense.thumbnailUrl || selectedPhotoForLicense.imageUrl}
                alt={selectedPhotoForLicense.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-bold text-white text-sm">{selectedPhotoForLicense.title}</h4>
                <p className="text-xs text-slate-200 font-medium">Photographer: {selectedPhotoForLicense.photographer}</p>
                <p className="text-[11px] text-amber-400 font-bold mt-0.5">
                  Base Price: {selectedPhotoForLicense.price_credits} FIC
                </p>
              </div>
            </div>

            {/* License Tiers Selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-100">Select License Rights:</label>
              {LICENSE_TIERS.map((tier) => {
                const calculatedPrice = calculateTierPrice(selectedPhotoForLicense.price_credits, tier.tier);
                const isSelected = chosenTier === tier.tier;

                return (
                  <div
                    key={tier.tier}
                    onClick={() => setChosenTier(tier.tier)}
                    className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500 shadow-md'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white flex items-center gap-2">
                        {tier.tier}
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                      </span>
                      <span className="font-extrabold text-amber-400 text-sm">
                        🪙 {calculatedPrice} FIC
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-200 font-medium mt-1 leading-relaxed">
                      {tier.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Revenue Split Indicator */}
            {(() => {
              const totalAmount = calculateTierPrice(selectedPhotoForLicense.price_credits, chosenTier);
              const creatorCut = Math.round(totalAmount * 0.8);
              const protocolCut = totalAmount - creatorCut;

              return (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-750 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-200 font-medium">
                    <span>Photographer Royalty (80%):</span>
                    <span className="text-emerald-400 font-bold">🪙 {creatorCut} FIC</span>
                  </div>
                  <div className="flex justify-between text-slate-200 font-medium">
                    <span>Protocol Infrastructure (20%):</span>
                    <span className="text-slate-200 font-semibold">🪙 {protocolCut} FIC</span>
                  </div>
                  <div className="h-px bg-slate-800 my-1" />
                  <div className="flex justify-between text-white font-bold">
                    <span>Total Acquisition Cost:</span>
                    <span className="text-amber-400 font-extrabold">🪙 {totalAmount} FIC</span>
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPhotoForLicense(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAcquireLicense}
                disabled={isLicensing}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isLicensing ? <LoadingSpinner /> : 'Acquire & Download Master'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* UPLOAD MASTER PHOTOGRAPH MODAL (WITH REAL FILE & POLLS) */}
      {/* ======================================================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Camera className="w-4 h-4" />
                Submit Photograph for PhotoCredits Licensing & UGC Giveaway
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="text-slate-200 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Drag and Drop File Dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-100 mb-1.5">
                  Master Photograph File *
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-2xl p-4 bg-slate-950/80 text-center transition-colors flex flex-col items-center justify-center min-h-[140px]"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900">
                      <img src={previewUrl} alt="Upload preview" className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/80 text-amber-400 text-xs rounded-lg font-bold">
                        Click to change image
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <UploadCloud className="w-8 h-8 text-amber-400 mx-auto" />
                      <p className="text-xs font-bold text-white">Click or drag & drop high-resolution image</p>
                      <p className="text-[11px] text-slate-200 font-medium">RAW, JPEG, PNG, or TIFF up to 25MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-100 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Serengeti Cheetah Dawn Stride"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-100 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the moment, lighting, and artistic intent..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-100 mb-1">Category</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    <option value="Architecture">Architecture</option>
                    <option value="Street & Urban">Street & Urban</option>
                    <option value="Nature & Landscape">Nature & Landscape</option>
                    <option value="Portraits & Fashion">Portraits & Fashion</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="Astrophotography">Astrophotography</option>
                    <option value="Afrobeats & Culture">Afrobeats & Culture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-100 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Lagos, Nigeria"
                    value={uploadForm.location}
                    onChange={(e) => setUploadForm({ ...uploadForm, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>
              </div>

              {/* Camera EXIF Inputs */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-750 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Camera EXIF Metadata:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Camera Body (e.g. Sony A7R V)"
                    value={uploadForm.camera}
                    onChange={(e) => setUploadForm({ ...uploadForm, camera: e.target.value })}
                    className="bg-slate-900 border border-slate-750 rounded-lg p-2 text-white placeholder:text-slate-500 text-xs font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Lens (e.g. 24-70mm GM II)"
                    value={uploadForm.lens}
                    onChange={(e) => setUploadForm({ ...uploadForm, lens: e.target.value })}
                    className="bg-slate-900 border border-slate-750 rounded-lg p-2 text-white placeholder:text-slate-500 text-xs font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Aperture (e.g. f/2.8)"
                    value={uploadForm.aperture}
                    onChange={(e) => setUploadForm({ ...uploadForm, aperture: e.target.value })}
                    className="bg-slate-900 border border-slate-750 rounded-lg p-2 text-white placeholder:text-slate-500 text-xs font-medium"
                  />
                  <input
                    type="text"
                    placeholder="Shutter (e.g. 1/250s)"
                    value={uploadForm.shutter}
                    onChange={(e) => setUploadForm({ ...uploadForm, shutter: e.target.value })}
                    className="bg-slate-900 border border-slate-750 rounded-lg p-2 text-white placeholder:text-slate-500 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Community Poll Option */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-750 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includePoll}
                      onChange={(e) => setIncludePoll(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
                    />
                    Include Community Poll on this Photograph?
                  </label>
                  <span className="text-[10px] text-amber-400 font-bold">+Boosts Engagement</span>
                </div>

                {includePoll && (
                  <div className="space-y-2 pt-2 border-t border-slate-800 animate-fadeIn">
                    <input
                      type="text"
                      placeholder="Poll Question (e.g. Which framing tells the story best?)"
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-lg p-2 text-xs text-white placeholder:text-slate-500 font-medium"
                    />
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-200 font-bold block">Poll Options:</span>
                      {pollOptions.map((opt, i) => (
                        <input
                          key={i}
                          type="text"
                          placeholder={`Option ${i + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...pollOptions];
                            newOpts[i] = e.target.value;
                            setPollOptions(newOpts);
                          }}
                          className="w-full bg-slate-900 border border-slate-750 rounded-lg p-2 text-xs text-white placeholder:text-slate-500 font-medium"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-100 mb-1">Base Price (FIC)</label>
                  <input
                    type="number"
                    min="5"
                    value={uploadForm.price_credits}
                    onChange={(e) => setUploadForm({ ...uploadForm, price_credits: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-100 mb-1">Default License</label>
                  <select
                    value={uploadForm.license_type}
                    onChange={(e) => setUploadForm({ ...uploadForm, license_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  >
                    <option value="Royalty-Free Standard">Royalty-Free Standard</option>
                    <option value="Editorial Use Only">Editorial Use Only</option>
                    <option value="Commercial Extended">Commercial Extended</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {isUploading ? <LoadingSpinner /> : 'Submit & Enter 22-Day Monthly Contest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4K Cinematic Video Streaming Player Modal */}
      <FingerMobileVideoPlayerModal
        isOpen={!!selectedVideoForPlay}
        onClose={() => setSelectedVideoForPlay(null)}
        videoItem={selectedVideoForPlay}
        onLicense={(item) => {
          setSelectedPhotoForLicense(item as any);
        }}
      />

      {/* Sovereign Share Modal (Social Networks, FingerMobile Syndication, OG Scraper & Link Inserter) */}
      {selectedItemForShare && (
        <FingerMobileShareModal
          isOpen={!!selectedItemForShare}
          onClose={() => setSelectedItemForShare(null)}
          mediaItem={selectedItemForShare}
          onShareSuccess={handleShareSuccess}
        />
      )}

      {/* Community Comments Modal (Threaded Comments & +6 Monetization Points) */}
      {selectedItemForComments && (
        <PhotoCreditsCommentsModal
          isOpen={!!selectedItemForComments}
          onClose={() => setSelectedItemForComments(null)}
          mediaItem={selectedItemForComments}
          commentsCount={selectedItemForComments.comments || 3}
          onAddComment={handleCommentAdded}
        />
      )}

      {/* Autonomous AI Quality & Technical Inspector Modal */}
      {selectedItemForAiQuality && (
        <PhotoCreditAiQualityModal
          isOpen={!!selectedItemForAiQuality}
          onClose={() => setSelectedItemForAiQuality(null)}
          item={selectedItemForAiQuality as any}
        />
      )}
    </div>
  );
};

export default PhotoCreditsPage;
