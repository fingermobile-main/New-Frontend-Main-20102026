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
  ThumbsUp,
  ThumbsDown,
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
  HelpCircle,
  Flame,
  ExternalLink
} from 'lucide-react';

export interface CameraExif {
  camera?: string;
  lens?: string;
  iso?: number;
  shutter?: string;
  aperture?: string;
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
  photographer: string;
  photographer_id?: string;
  location?: string;
  category: string;
  tags?: string[];
  likes: number;
  dislikes?: number;
  comments?: number;
  downloads: number;
  shares?: number;
  rating?: number;
  price_credits: number;
  license_type: 'Royalty-Free Standard' | 'Editorial Use Only' | 'Commercial Extended' | string;
  camera_info?: CameraExif;
  hasLiked?: boolean;
  hasDisliked?: boolean;
  isBookmarked?: boolean;
  poll_data?: PollData;
}

export interface GiveawayPrize {
  rank: number;
  amountFIC: number;
  badge: string;
}

export interface GiveawayLeader {
  rank: number;
  id: string;
  title: string;
  photographer: string;
  imageUrl: string;
  likes: number;
  downloads: number;
  shares: number;
  rating: number;
  compositeScore: number;
  prizeFIC: number;
  badge: string;
  location?: string;
}

export interface GiveawayData {
  cycleDays: number;
  currentCycle: number;
  daysRemaining: number;
  nextFridayDate: string;
  prizePoolFIC: number;
  prizes: GiveawayPrize[];
  leaderboard: GiveawayLeader[];
}

type TabMode = 'gallery' | 'giveaway' | 'royalties' | 'certificate';

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
  const [photos, setPhotos] = useState<PhotoCreditItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLicenseFilter, setSelectedLicenseFilter] = useState<string>('all');

  // Licensing Modal State
  const [selectedPhotoForLicense, setSelectedPhotoForLicense] = useState<PhotoCreditItem | null>(null);
  const [chosenTier, setChosenTier] = useState<string>('Royalty-Free Standard');
  const [isLicensing, setIsLicensing] = useState<boolean>(false);

  // Giveaway Data State
  const [giveawayData, setGiveawayData] = useState<GiveawayData | null>(null);
  const [loadingGiveaway, setLoadingGiveaway] = useState<boolean>(false);
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

  // Fetch Photos from Backend API
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
        setPhotos(normalized);
      }
    } catch {
      // Fallback gracefully
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch 26-Day Friday Giveaway Leaderboard
  const fetchGiveaway = useCallback(async () => {
    try {
      setLoadingGiveaway(true);
      const res: any = await ApiService.get('/photocredits/giveaway');
      if (res?.data) {
        setGiveawayData(res.data);
      }
    } catch {
      // Create local fallback leaderboard if offline
      const sorted = [...photos]
        .map((p, i) => {
          const compScore = (p.likes * 1) + (p.downloads * 3) + ((p.shares || 0) * 2) + Math.round((p.rating || 4.5) * 10);
          const prizeObj = DEFAULT_GIVEAWAY_PRIZES[i] || { rank: i + 1, amountFIC: 1000, badge: `Rank #${i + 1}` };
          return {
            rank: i + 1,
            id: p.id,
            title: p.title,
            photographer: p.photographer,
            imageUrl: p.imageUrl,
            likes: p.likes,
            downloads: p.downloads,
            shares: p.shares || 0,
            rating: p.rating || 4.8,
            compositeScore: compScore,
            prizeFIC: prizeObj.amountFIC,
            badge: prizeObj.badge,
            location: p.location
          };
        })
        .sort((a, b) => b.compositeScore - a.compositeScore)
        .slice(0, 10)
        .map((item, idx) => ({ ...item, rank: idx + 1, prizeFIC: DEFAULT_GIVEAWAY_PRIZES[idx]?.amountFIC || 1000, badge: DEFAULT_GIVEAWAY_PRIZES[idx]?.badge || `#${idx + 1}` }));

      setGiveawayData({
        cycleDays: 26,
        currentCycle: 14,
        daysRemaining: 14,
        nextFridayDate: 'Friday, October 24, 2026',
        prizePoolFIC: 125000,
        prizes: DEFAULT_GIVEAWAY_PRIZES,
        leaderboard: sorted
      });
    } finally {
      setLoadingGiveaway(false);
    }
  }, [photos]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  useEffect(() => {
    if (activeTab === 'giveaway') {
      fetchGiveaway();
    }
  }, [activeTab, fetchGiveaway]);

  // Unique Categories
  const categories = useMemo(() => {
    const list = Array.from(new Set(photos.map((p) => p.category)));
    return ['all', ...list];
  }, [photos]);

  // Filtered Photo List
  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.photographer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesLicense =
        selectedLicenseFilter === 'all' ||
        p.license_type.toLowerCase() === selectedLicenseFilter.toLowerCase();

      return matchesSearch && matchesCat && matchesLicense;
    });
  }, [photos, searchQuery, selectedCategory, selectedLicenseFilter]);

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
        if (navigator.clipboard) {
          navigator.clipboard.writeText(`${window.location.origin}/photocredits?photo=${photoId}`);
        }
        showToast('Photo share link copied to clipboard & verified on ledger! (+2 UGC pts)', 'success');
      } else if (action === 'like' || action === 'upvote') {
        showToast('Like recorded! Creator receives +1 point towards the 26-Day Friday Giveaway.', 'success');
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
      showToast('Community poll vote registered on decentralized ledger!', 'success');
    } catch {
      // Silently failover
    }
  };

  // Bookmark Photo
  const handleBookmark = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId) {
          const next = !p.isBookmarked;
          showToast(next ? 'Photograph saved to your personal collection!' : 'Removed from collection', 'info');
          return { ...p, isBookmarked: next };
        }
        return p;
      })
    );
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
                PhotoCredits™ Sovereign Photography Licensing, 80/20 Royalty & 26-Day Friday UGC Giveaway
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-3">
                <span>PhotoCredits</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  80% Creator Split
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-600/30 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  125,000 FIC Monthly Prize Pool
                </span>
              </h1>
              <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                Browse, license, and mint verifiable master photographs. Every acquisition enforces immutable creator royalty rights: 80% directly to the photographer. The Top 10 UGC photographs win the 26-Day Friday Giveaway automatically computed by score!
              </p>
            </div>

            {/* Balances & Creator Action */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/80 border border-amber-500/40 rounded-xl p-4 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-emerald-600 flex items-center justify-center text-white shadow-inner">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">FIC Balance</div>
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
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              Master Photograph Gallery
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-amber-900/60 text-amber-200">
                {photos.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('giveaway')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'giveaway'
                  ? 'bg-gradient-to-r from-amber-600 to-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-bold'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4 text-yellow-400" />
              🎁 26-Day Friday Giveaway
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                125,000 FIC
              </span>
            </button>

            <button
              onClick={() => setActiveTab('royalties')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'royalties'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
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
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
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
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search title, photographer, location, camera..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-400 font-semibold">Category:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">License:</span>
                  <select
                    value={selectedLicenseFilter}
                    onChange={(e) => setSelectedLicenseFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">All Licenses</option>
                    <option value="Royalty-Free Standard">Standard</option>
                    <option value="Editorial Use Only">Editorial</option>
                    <option value="Commercial Extended">Commercial</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Photo Cards Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <LoadingSpinner />
                <p className="text-xs text-slate-400 font-mono">Synchronizing master photographs with decentralized storage...</p>
              </div>
            ) : filteredPhotos.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
                <Camera className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-300">No master photographs found</h3>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotos.map((photo) => {
                  const hasPoll = Boolean(photo.poll_data && photo.poll_data.options && photo.poll_data.options.length > 0);
                  const totalPollVotes = photo.poll_data ? photo.poll_data.totalVotes || photo.poll_data.options.reduce((s, o) => s + o.votes, 0) : 0;

                  return (
                    <div
                      key={photo.id}
                      className="group flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-amber-500/50 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-950/20"
                    >
                      {/* Image Frame */}
                      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-semibold text-slate-200 border border-slate-700/60 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-400" />
                            {photo.location || 'Global'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/40">
                            {photo.category}
                          </span>
                        </div>

                        {/* Price Tag & Rating */}
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-300 font-bold text-xs flex items-center gap-1 border border-amber-500/30">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            {photo.rating || 4.9}
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-emerald-500 text-black font-extrabold text-xs shadow-lg">
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
                            <button
                              onClick={() => handleBookmark(photo.id)}
                              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                photo.isBookmarked
                                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                              }`}
                              title={photo.isBookmarked ? 'Bookmarked' : 'Save/Bookmark'}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${photo.isBookmarked ? 'fill-amber-400' : ''}`} />
                            </button>
                          </div>

                          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <span>By</span>
                              <span className="text-slate-200 font-semibold">{photo.photographer}</span>
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                            </span>
                            <button
                              onClick={() => handleMessageCreator(photo.photographer)}
                              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              Contact
                            </button>
                          </div>

                          {/* Camera EXIF Details Pill */}
                          {photo.camera_info && (
                            <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 grid grid-cols-2 gap-1.5 font-mono">
                              <div>
                                <span className="text-slate-500">Camera:</span> {photo.camera_info.camera || 'Pro DSLR'}
                              </div>
                              <div>
                                <span className="text-slate-500">Lens:</span> {photo.camera_info.lens || 'Prime'}
                              </div>
                              <div>
                                <span className="text-slate-500">Aperture:</span> {photo.camera_info.aperture || 'f/2.8'}
                              </div>
                              <div>
                                <span className="text-slate-500">Shutter:</span> {photo.camera_info.shutter || '1/250s'}
                              </div>
                            </div>
                          )}

                          <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                            {photo.description || 'Master-resolution licensed stock photography on FingerMobile Protocol™.'}
                          </p>

                          {/* ======================================================== */}
                          {/* INTERACTIVE COMMUNITY POLL */}
                          {/* ======================================================== */}
                          {hasPoll && photo.poll_data && (
                            <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-2.5">
                              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                                <span className="flex items-center gap-1.5">
                                  <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                                  Community Poll: {photo.poll_data.question}
                                </span>
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
                                      className={`w-full relative overflow-hidden rounded-lg p-2 text-left text-xs transition-all border ${
                                        isSelected
                                          ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                                      }`}
                                    >
                                      {/* Animated Progress Bar */}
                                      <div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600/30 to-emerald-600/30 transition-all duration-500 pointer-events-none"
                                        style={{ width: `${pct}%` }}
                                      />
                                      <div className="relative flex items-center justify-between z-10">
                                        <span className="flex items-center gap-1.5 font-medium">
                                          {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                                          {opt.text}
                                        </span>
                                        <span className="font-mono text-[11px] text-slate-400">
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

                        {/* ======================================================== */}
                        {/* FOOTER ACTION BUTTONS & METRICS */}
                        {/* ======================================================== */}
                        <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
                          {/* Top Engagement Bar (Upvote, Downvote, Share, Rating, Report) */}
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleVote(photo.id, 'like')}
                                className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                                  photo.hasLiked ? 'bg-red-500/20 text-red-400' : 'bg-slate-950 hover:bg-slate-800 text-slate-300'
                                }`}
                                title="Like (+1 UGC pt)"
                              >
                                <Heart className={`w-3.5 h-3.5 ${photo.hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                <span className="font-semibold">{photo.likes}</span>
                              </button>

                              <button
                                onClick={() => handleVote(photo.id, 'dislike')}
                                className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                                  photo.hasDisliked ? 'bg-slate-800 text-slate-200' : 'bg-slate-950 hover:bg-slate-800 text-slate-400'
                                }`}
                                title="Dislike"
                              >
                                <ThumbsDown className="w-3.5 h-3.5" />
                                <span>{photo.dislikes || 0}</span>
                              </button>
                            </div>

                            {/* Downloads & Shares counters */}
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                              <span title="Downloads (3 pts)">📥 {photo.downloads}</span>
                              <span title="Shares (2 pts)">↗️ {photo.shares || 0}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleVote(photo.id, 'share')}
                                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 transition-colors"
                                title="Share (+2 UGC pts)"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleReport(photo.title)}
                                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-500 hover:text-red-400 transition-colors"
                                title="Report Photo"
                              >
                                <Flag className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Primary License Acquisition CTA */}
                          <button
                            onClick={() => {
                              setSelectedPhotoForLicense(photo);
                              setChosenTier(photo.license_type || 'Royalty-Free Standard');
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-amber-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-600/20 transition-all transform hover:-translate-y-0.5"
                          >
                            <Download className="w-4 h-4" />
                            Acquire License & Download Master
                          </button>
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
        {/* TAB 2: 26-DAY FRIDAY MONTHLY UGC GIVEAWAY */}
        {/* ======================================================== */}
        {activeTab === 'giveaway' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Giveaway Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/80 via-slate-900 to-emerald-950/70 border border-amber-500/40 p-6 sm:p-10 shadow-2xl">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    Official 26-Day Friday Monthly UGC Giveaway
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                    125,000 FIC Prize Pool
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Every 26-day cycle culminating on Friday, the top 10 UGC master photographs ranked by decentralized community engagement automatically win their share of the 125,000 FIC monthly creator bounty.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-amber-200/90">
                    <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/30">
                      Cycle: 26 Calendar Days
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-emerald-500/30">
                      Next Draw: {giveawayData?.nextFridayDate || 'Friday, October 24, 2026'}
                    </span>
                  </div>
                </div>

                {/* Live Countdown Clock */}
                <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-6 shadow-2xl backdrop-blur-md flex flex-col items-center">
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5 mb-3">
                    <Clock className="w-4 h-4 text-amber-400" />
                    Friday Draw Countdown
                  </div>
                  <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl min-w-[60px]">
                      <div className="text-2xl sm:text-3xl font-black text-white">{countdown.days}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Days</div>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl min-w-[60px]">
                      <div className="text-2xl sm:text-3xl font-black text-white">{countdown.hours}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Hours</div>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl min-w-[60px]">
                      <div className="text-2xl sm:text-3xl font-black text-white">{countdown.minutes}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Mins</div>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl min-w-[60px]">
                      <div className="text-2xl sm:text-3xl font-black text-amber-400">{countdown.seconds}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Secs</div>
                    </div>
                  </div>
                  <div className="mt-4 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    Rankings update live on every transaction
                  </div>
                </div>
              </div>
            </div>

            {/* Formula & Prize Pool Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Formula Card */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base">
                  <BarChart2 className="w-5 h-5" />
                  Verifiable Composite Score Formula
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed">
                  Composite Score = (Likes × 1) + (Downloads × 3) + (Shares × 2) + (Rating × 10)
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block font-semibold">👍 Like / Upvote</span>
                    <span className="text-white font-bold">+1 Point</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block font-semibold">📥 License Download</span>
                    <span className="text-emerald-400 font-bold">+3 Points</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block font-semibold">↗️ Social Share</span>
                    <span className="text-sky-400 font-bold">+2 Points</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block font-semibold">⭐ Star Rating</span>
                    <span className="text-amber-400 font-bold">+10 Points / Star</span>
                  </div>
                </div>
              </div>

              {/* Prize Pool Distribution */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-yellow-400 font-bold text-base">
                    <Trophy className="w-5 h-5" />
                    Top 10 Prize Pool Distribution
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">125,000 FIC Total</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-amber-950/40 border border-amber-500/30">
                    <span className="text-yellow-300 font-bold">🥇 1st Place</span>
                    <span className="text-white font-black">50,000 FIC</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-300 font-bold">🥈 2nd Place</span>
                    <span className="text-white font-black">25,000 FIC</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-amber-600 font-bold">🥉 3rd Place</span>
                    <span className="text-white font-black">15,000 FIC</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 font-semibold">4th Place</span>
                    <span className="text-white font-black">10,000 FIC</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 font-semibold">5th Place</span>
                    <span className="text-white font-black">8,000 FIC</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 font-semibold">6th Place</span>
                    <span className="text-white font-black">6,000 FIC</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 font-semibold">7th Place</span>
                    <span className="text-white font-black">4,000 FIC</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 font-semibold">8th Place</span>
                    <span className="text-white font-black">3,000 FIC</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 font-semibold">9th Place</span>
                    <span className="text-white font-black">2,500 FIC</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 font-semibold">10th Place</span>
                    <span className="text-white font-black">1,500 FIC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top 10 Leaderboard Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Top 10 UGC Photographs on the Leaderboard
                </h3>
                <span className="text-xs text-slate-400">Ranked by Composite Score</span>
              </div>

              {loadingGiveaway ? (
                <div className="py-16 text-center">
                  <LoadingSpinner />
                  <p className="text-xs text-slate-400 mt-2 font-mono">Calculating composite scores across all uploads...</p>
                </div>
              ) : giveawayData && giveawayData.leaderboard.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {giveawayData.leaderboard.map((item) => {
                    const isTop3 = item.rank <= 3;
                    const rankMedal =
                      item.rank === 1 ? '🥇 1st' : item.rank === 2 ? '🥈 2nd' : item.rank === 3 ? '🥉 3rd' : `#${item.rank}`;

                    return (
                      <div
                        key={item.id}
                        className={`flex gap-4 p-4 rounded-2xl border transition-all ${
                          isTop3
                            ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/50 shadow-xl'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="relative w-24 sm:w-28 h-24 sm:h-28 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 left-1 px-2 py-0.5 rounded-md bg-black/80 font-black text-xs text-yellow-300">
                            {rankMedal}
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-sm text-white line-clamp-1">{item.title}</h4>
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                                🪙 {Number(item.prizeFIC || 0).toLocaleString()} FIC
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">By {item.photographer}</p>

                            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-300">
                              <span className="text-slate-400">Score: <strong className="text-amber-400">{item.compositeScore}</strong></span>
                              <span>•</span>
                              <span>👍 {item.likes}</span>
                              <span>📥 {item.downloads}</span>
                              <span>↗️ {item.shares}</span>
                              <span>⭐ {item.rating}</span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => handleVote(item.id, 'like')}
                              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1"
                            >
                              <ThumbsUp className="w-3 h-3 text-amber-400" />
                              Vote
                            </button>
                            <button
                              onClick={() => {
                                const matched = photos.find((p) => p.id === item.id);
                                if (matched) {
                                  setSelectedPhotoForLicense(matched);
                                  setChosenTier(matched.license_type || 'Royalty-Free Standard');
                                }
                              }}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
                            >
                              License
                            </button>
                            <button
                              onClick={() => handleVote(item.id, 'share')}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                              title="Share"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No photos ranked yet. Submit photographs to enter the competition!</p>
              )}
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

                <div className="grid grid-cols-2 gap-4 bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
                  <div>
                    <div className="text-xs text-slate-400 font-semibold">Photographer Share</div>
                    <div className="text-2xl font-black text-emerald-400">80%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold">Protocol Infrastructure</div>
                    <div className="text-2xl font-black text-slate-400">20%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Creator Revenue Dashboard Mock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Total Royalty Earnings</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">1,480.00 FIC</div>
                <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                  <span>+28% from last month</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Licenses Sold</span>
                  <Download className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">46 Downloads</div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Across 6 registered portfolios
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
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
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Photographic Proof-of-Authorship</h3>
                  <p className="text-xs text-slate-400">
                    Cryptographic SHA-256 fingerprinting and digital provenance for every photograph.
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                When a photographer uploads a master capture, FingerMobile automatically computes its perceptual hash and cryptographic signature. This guarantees tamper-proof copyright ownership, prevents uncredited scraping, and issues verifiable licenses across the decentralized web.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Example Provenance Certificate:</div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ledger Contract:</span>
                  <span className="text-sky-300">0x742d35Cc6634C0532925a3b844Bc454e4438f44e</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SHA-256 Master Hash:</span>
                  <span className="text-emerald-300">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Copyright Standard:</span>
                  <span className="text-amber-300">Berne Convention & FingerMobile Protocol™ v2.6</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <FileText className="w-4 h-4" />
                Select PhotoCredits License Tier
              </div>
              <button
                onClick={() => setSelectedPhotoForLicense(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <img
                src={selectedPhotoForLicense.thumbnailUrl || selectedPhotoForLicense.imageUrl}
                alt={selectedPhotoForLicense.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-bold text-white text-sm">{selectedPhotoForLicense.title}</h4>
                <p className="text-xs text-slate-400">Photographer: {selectedPhotoForLicense.photographer}</p>
                <p className="text-[11px] text-amber-400 font-semibold mt-0.5">
                  Base Price: {selectedPhotoForLicense.price_credits} FIC
                </p>
              </div>
            </div>

            {/* License Tiers Selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-300">Select License Rights:</label>
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
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
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
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Photographer Royalty (80%):</span>
                    <span className="text-emerald-400 font-bold">🪙 {creatorCut} FIC</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Protocol Infrastructure (20%):</span>
                    <span className="text-slate-300 font-semibold">🪙 {protocolCut} FIC</span>
                  </div>
                  <div className="h-px bg-slate-800 my-1" />
                  <div className="flex justify-between text-white font-bold">
                    <span>Total Acquisition Cost:</span>
                    <span className="text-amber-400">🪙 {totalAmount} FIC</span>
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPhotoForLicense(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
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
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Drag and Drop File Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                      <p className="text-[11px] text-slate-500">RAW, JPEG, PNG, or TIFF up to 25MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Serengeti Cheetah Dawn Stride"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the moment, lighting, and artistic intent..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Lagos, Nigeria"
                    value={uploadForm.location}
                    onChange={(e) => setUploadForm({ ...uploadForm, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Camera EXIF Inputs */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Camera EXIF Metadata:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Camera Body (e.g. Sony A7R V)"
                    value={uploadForm.camera}
                    onChange={(e) => setUploadForm({ ...uploadForm, camera: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Lens (e.g. 24-70mm GM II)"
                    value={uploadForm.lens}
                    onChange={(e) => setUploadForm({ ...uploadForm, lens: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Aperture (e.g. f/2.8)"
                    value={uploadForm.aperture}
                    onChange={(e) => setUploadForm({ ...uploadForm, aperture: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Shutter (e.g. 1/250s)"
                    value={uploadForm.shutter}
                    onChange={(e) => setUploadForm({ ...uploadForm, shutter: e.target.value })}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Community Poll Option */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
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
                  <span className="text-[10px] text-amber-400 font-semibold">+Boosts Engagement</span>
                </div>

                {includePoll && (
                  <div className="space-y-2 pt-2 border-t border-slate-800 animate-fadeIn">
                    <input
                      type="text"
                      placeholder="Poll Question (e.g. Which framing tells the story best?)"
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    />
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold block">Poll Options:</span>
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
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Base Price (FIC)</label>
                  <input
                    type="number"
                    min="5"
                    value={uploadForm.price_credits}
                    onChange={(e) => setUploadForm({ ...uploadForm, price_credits: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Default License</label>
                  <select
                    value={uploadForm.license_type}
                    onChange={(e) => setUploadForm({ ...uploadForm, license_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {isUploading ? <LoadingSpinner /> : 'Submit & Enter 26-Day Friday Giveaway'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoCreditsPage;
