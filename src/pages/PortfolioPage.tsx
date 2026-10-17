/*
 * FingerMobile Protocol™ - Creator Portfolio & Showcase
 * Comprehensive Creator Portfolio, Creative Works, Licensing & Commission Hub
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import {
  CheckCircleIcon,
  SparklesIcon,
  PhotoIcon,
  MusicalNoteIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  GlobeAltIcon,
  MapPinIcon,
  HeartIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon
} from '../icons';

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  client: string;
  completionDate: string;
  thumbnailUrl: string;
  description: string;
  metrics: string;
  tags: string[];
}

interface AudioWork {
  id: string;
  title: string;
  bpm: number;
  genre: string;
  audioUrl: string;
  duration: string;
  playsCount: number;
  licensePriceFic: number;
}

interface PhotoWork {
  id: string;
  title: string;
  imageUrl: string;
  camera: string;
  lens: string;
  exif: string;
  views: number;
  likes: number;
}

interface ClientReview {
  id: string;
  clientName: string;
  clientRole: string;
  avatarUrl: string;
  rating: number;
  comment: string;
  date: string;
}

const SAMPLE_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-01',
    title: 'Eko Atlantic Architectural Documentary Campaign',
    category: 'Commercial Photography',
    client: 'Metropolitan Urban Group',
    completionDate: 'August 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
    description: 'Commissioned aerial and ground architectural series capturing the sustainable urbanization of coastal Lagos.',
    metrics: 'Featured across 14 media publications & billboards',
    tags: ['Architecture', 'Urban', 'Commercial', 'Print']
  },
  {
    id: 'proj-02',
    title: 'Afrobeats Fusion Sound Identity & Broadcast Stems',
    category: 'Audio Direction',
    client: 'Dancia-4Tv Network',
    completionDate: 'July 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    description: 'Custom acoustic rhythm packaging and signature sonic branding for live cultural broadcasts.',
    metrics: 'Over 2.4M broadcast impressions across 8 countries',
    tags: ['Afrobeats', 'Soundtrack', 'Broadcast', 'BeatwaveNG']
  },
  {
    id: 'proj-03',
    title: 'NFC Authenticated Streetwear Capsule Art',
    category: 'Brand Merchandise',
    client: 'Lagos Syndicate Studios',
    completionDate: 'June 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    description: 'Visual identity and limited edition apparel graphics embedded with physical on-chain smart tags.',
    metrics: 'Sold out 500 units in under 48 hours on Storefronts',
    tags: ['Fashion', 'Merch', 'Web3', 'NFC']
  }
];

const SAMPLE_PHOTOS: PhotoWork[] = [
  {
    id: 'ph-01',
    title: 'Neon Harbor Reverie',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    camera: 'Sony A7R V',
    lens: 'FE 24-70mm f/2.8 GM II',
    exif: '1/250s · f/4.0 · ISO 100',
    views: 4890,
    likes: 312
  },
  {
    id: 'ph-02',
    title: 'Kinetic Movement & African Contemporary Dance',
    imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80',
    camera: 'Fujifilm GFX 100 II',
    lens: 'GF 110mm f/2 R LM WR',
    exif: '1/1000s · f/2.0 · ISO 400',
    views: 6120,
    likes: 480
  },
  {
    id: 'ph-03',
    title: 'Golden Hour Monologue at Lekki Pier',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
    camera: 'Leica SL2-S',
    lens: 'Summilux-SL 50mm f/1.4',
    exif: '1/500s · f/1.4 · ISO 50',
    views: 3450,
    likes: 275
  },
  {
    id: 'ph-04',
    title: 'Metropolitan High-Rise Geometry',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    camera: 'Sony A7R V',
    lens: 'FE 16-35mm f/2.8 GM II',
    exif: '1/160s · f/8.0 · ISO 100',
    views: 5200,
    likes: 390
  }
];

const SAMPLE_AUDIO: AudioWork[] = [
  {
    id: 'au-01',
    title: 'Sunset Amapiano Groove (Sync Master)',
    bpm: 114,
    genre: 'Amapiano / Afrobeats',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '3:24',
    playsCount: 14200,
    licensePriceFic: 40
  },
  {
    id: 'au-02',
    title: 'Sub-Saharan Ambient Modular Odyssey',
    bpm: 96,
    genre: 'Electronic Ambient',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '4:15',
    playsCount: 9800,
    licensePriceFic: 35
  }
];

const SAMPLE_REVIEWS: ClientReview[] = [
  {
    id: 'rev-01',
    clientName: 'Emeka Nwosu',
    clientRole: 'Creative Director at Vanguard Media',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Exceptional visual sensitivity and lightning-fast delivery. The PhotoCredits licensing workflow was completely seamless.',
    date: '2 weeks ago'
  },
  {
    id: 'rev-02',
    clientName: 'Sophia Adeleke',
    clientRole: 'Executive Producer, SoundAfrik',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'The stems provided were master-grade and mixed perfectly for our Dancia-4Tv live broadcast sequence. Highly recommended!',
    date: '1 month ago'
  }
];

const PortfolioPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const { ficBalance, showToast } = useAppContext();

  const [activeTab, setActiveTab] = useState<'projects' | 'photos' | 'audio' | 'reviews'>('projects');
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [likedPhotoIds, setLikedPhotoIds] = useState<string[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  // Commission Form State
  const [commissionForm, setCommissionForm] = useState({
    projectType: 'Commercial Photography',
    scopeDescription: '',
    budgetFic: 150,
    timeline: '2 weeks'
  });
  const [isSubmittingCommission, setIsSubmittingCommission] = useState(false);

  const creatorProfile = {
    id: memberId || 'cr-lead',
    name: 'Tunde Afolabi',
    handle: 'tafolabi_lens',
    title: 'Lead Visual Artist & Sound Architect',
    bio: 'Documenting the vibrant architecture, acoustic grooves, and sovereign Web3 creative economies across Africa and the global diaspora.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80',
    location: 'Lagos & London',
    website: 'https://tundeafolabi.art',
    isVerified: true,
    rating: 4.95,
    followersCount: 4820,
    totalWorks: 84,
    lifetimeRoyaltiesFic: 12450,
    responseTime: '< 2 hours',
    isOpenForCommissions: true
  };

  const handleToggleAudio = (audio: AudioWork) => {
    if (playingAudioId === audio.id) {
      audioElement?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const player = new Audio(audio.audioUrl);
      player.play().catch(() => {});
      player.onended = () => setPlayingAudioId(null);
      setAudioElement(player);
      setPlayingAudioId(audio.id);
    }
  };

  const handleToggleLikePhoto = (photoId: string) => {
    if (likedPhotoIds.includes(photoId)) {
      setLikedPhotoIds(likedPhotoIds.filter((id) => id !== photoId));
      showToast('Removed like', 'info');
    } else {
      setLikedPhotoIds([...likedPhotoIds, photoId]);
      showToast('Liked creation! +1 FIC tipping badge earned', 'success');
    }
  };

  const handleCommissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commissionForm.scopeDescription) {
      showToast('Please describe your commission project scope', 'error');
      return;
    }
    if (ficBalance < commissionForm.budgetFic) {
      showToast(`Insufficient balance for commission deposit! Required: ${commissionForm.budgetFic} FIC`, 'error');
      return;
    }

    try {
      setIsSubmittingCommission(true);
      await new Promise((res) => setTimeout(res, 800));
      setIsCommissionModalOpen(false);
      showToast(`Commission proposal submitted to ${creatorProfile.name}! Escrow secured.`, 'success');
    } catch {
      showToast('Failed to submit commission proposal', 'error');
    } finally {
      setIsSubmittingCommission(false);
    }
  };

  return (
    <MainLayout pageTitle={`Portfolio - ${creatorProfile.name}`}>
      <div className="min-h-screen bg-slate-50 text-gray-900 pb-16">
        {/* Creator Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={creatorProfile.bannerUrl}
            alt="Creator Banner"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>

        {/* Profile Card & Stats Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-300/80 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {/* Avatar & Bio */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative">
                  <img
                    src={creatorProfile.avatarUrl}
                    alt={creatorProfile.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  {creatorProfile.isVerified && (
                    <div className="absolute bottom-1 right-1 bg-blue-600 text-white p-1 rounded-full shadow-md">
                      <CheckCircleIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                      {creatorProfile.name}
                    </h1>
                    {creatorProfile.isOpenForCommissions && (
                      <span className="px-3 py-1 bg-green-100 text-green-950 border border-green-400 font-bold text-xs  rounded-full   font-black">
                        ● Open for Commissions
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-indigo-600 mt-0.5">
                    @{creatorProfile.handle} · {creatorProfile.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-2 max-w-2xl leading-relaxed">
                    {creatorProfile.bio}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-700 flex-wrap">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPinIcon className="w-3.5 h-3.5 text-slate-700" />
                      {creatorProfile.location}
                    </span>
                    <a
                      href={creatorProfile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 font-medium text-indigo-600 hover:underline"
                    >
                      <GlobeAltIcon className="w-3.5 h-3.5" />
                      {creatorProfile.website.replace('https://', '')}
                    </a>
                    <span className="flex items-center gap-1 font-semibold text-amber-500">
                      ★ {creatorProfile.rating} (50+ Reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={() => {
                    setIsFollowing(!isFollowing);
                    showToast(isFollowing ? 'Unfollowed creator' : `Following ${creatorProfile.name}`, 'info');
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isFollowing
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                  }`}
                >
                  {isFollowing ? 'Following' : '+ Follow'}
                </button>
                <button
                  onClick={() => setIsCommissionModalOpen(true)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <BriefcaseIcon className="w-4 h-4" />
                  Commission Work
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Followers</span>
                <p className="text-lg font-black text-gray-900 mt-0.5">{creatorProfile.followersCount.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Creative Assets</span>
                <p className="text-lg font-black text-gray-900 mt-0.5">{creatorProfile.totalWorks} Works</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Lifetime Volume</span>
                <p className="text-lg font-black text-indigo-600 mt-0.5">{creatorProfile.lifetimeRoyaltiesFic.toLocaleString()} FIC</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Response Speed</span>
                <p className="text-lg font-black text-emerald-600 mt-0.5">{creatorProfile.responseTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Deck */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex border-b border-slate-300 gap-6">
            <button
              onClick={() => setActiveTab('projects')}
              className={`pb-3.5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'projects'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-700 hover:text-gray-800'
              }`}
            >
              <BriefcaseIcon className="w-4 h-4" />
              Featured Projects ({SAMPLE_PROJECTS.length})
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`pb-3.5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'photos'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-700 hover:text-gray-800'
              }`}
            >
              <PhotoIcon className="w-4 h-4" />
              Photo Gallery ({SAMPLE_PHOTOS.length})
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`pb-3.5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'audio'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-700 hover:text-gray-800'
              }`}
            >
              <MusicalNoteIcon className="w-4 h-4" />
              Audio & Beats ({SAMPLE_AUDIO.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3.5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'reviews'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-700 hover:text-gray-800'
              }`}
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              Client Reviews ({SAMPLE_REVIEWS.length})
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Tab 1: Featured Projects */}
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SAMPLE_PROJECTS.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-52 bg-slate-900 overflow-hidden">
                      <img
                        src={proj.thumbnailUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-black/70 backdrop-blur-md text-white">
                        {proj.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <span className="text-[10px] text-slate-700 uppercase font-semibold">Client: {proj.client} · {proj.completionDate}</span>
                      <h3 className="font-bold text-gray-900 text-base mt-1 leading-snug">{proj.title}</h3>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">{proj.description}</p>

                      <div className="mt-4 p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        <span className="text-xs font-bold text-indigo-900">{proj.metrics}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200">
                      {proj.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-semibold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Photos Gallery */}
          {activeTab === 'photos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SAMPLE_PHOTOS.map((ph) => {
                const isLiked = likedPhotoIds.includes(ph.id);
                return (
                  <div key={ph.id} className="bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                    <div className="relative h-60 bg-slate-100 overflow-hidden">
                      <img
                        src={ph.imageUrl}
                        alt={ph.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <button
                        onClick={() => handleToggleLikePhoto(ph.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                          isLiked ? 'bg-rose-500 text-white' : 'bg-black/40 text-white hover:bg-black/70'
                        }`}
                      >
                        <HeartIcon className="w-4 h-4 fill-current" />
                      </button>

                      <div className="absolute bottom-3 left-3 right-3 text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs font-black truncate">{ph.camera}</p>
                        <p className="text-[10px] text-gray-200 font-mono">{ph.exif}</p>
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="font-bold text-sm text-gray-900 truncate">{ph.title}</h4>
                      <div className="flex justify-between items-center text-[10px] text-slate-700 mt-2 pt-2 border-t border-slate-200">
                        <span>Lens: {ph.lens}</span>
                        <span>{ph.likes + (isLiked ? 1 : 0)} Likes</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 3: Audio & Beats */}
          {activeTab === 'audio' && (
            <div className="space-y-4 max-w-4xl">
              {SAMPLE_AUDIO.map((au) => {
                const isPlaying = playingAudioId === au.id;
                return (
                  <div
                    key={au.id}
                    className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleToggleAudio(au)}
                        className={`p-3.5 rounded-2xl transition-transform hover:scale-105 ${
                          isPlaying
                            ? 'bg-amber-500 text-slate-900'
                            : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        }`}
                      >
                        {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                      </button>

                      <div>
                        <h4 className="font-black text-gray-900 text-base">{au.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-700 mt-0.5">
                          <span className="font-bold text-indigo-600">{au.genre}</span>
                          <span>·</span>
                          <span>{au.bpm} BPM</span>
                          <span>·</span>
                          <span>{au.duration}</span>
                          <span>·</span>
                          <span>{au.playsCount.toLocaleString()} plays</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                      <div className="text-right">
                        <span className="text-sm font-black text-gray-900">{au.licensePriceFic} FIC</span>
                        <span className="text-[10px] text-slate-700 block">Beatwave Sync Rights</span>
                      </div>
                      <button
                        onClick={() => showToast(`Sync license opened for ${au.title}`, 'info')}
                        className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors"
                      >
                        License Beat
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
              {SAMPLE_REVIEWS.map((rev) => (
                <div key={rev.id} className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.avatarUrl}
                        alt={rev.clientName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-300"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{rev.clientName}</h4>
                        <p className="text-[10px] text-slate-700">{rev.clientRole}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-700">{rev.date}</span>
                  </div>

                  <div className="flex text-amber-400 mb-2">
                    {[...Array(rev.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed italic">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Commission Modal */}
        {isCommissionModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-300 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <BriefcaseIcon className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-black text-gray-900">Commission {creatorProfile.name}</h3>
                </div>
                <button
                  onClick={() => setIsCommissionModalOpen(false)}
                  className="text-slate-700 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCommissionSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Commission Category</label>
                  <select
                    value={commissionForm.projectType}
                    onChange={(e) => setCommissionForm({ ...commissionForm, projectType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none text-slate-900 font-bold"
                  >
                    <option value="Commercial Photography">Commercial Photography / Studio Shoot</option>
                    <option value="Audio Sync Production">Audio Sync Production / Beatwave Beat</option>
                    <option value="Apparel & Brand Design">Apparel & Merch Artwork</option>
                    <option value="Video & VFX Direction">Video & VFX Direction for Dancia-4Tv</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Project Brief & Deliverables</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your creative requirements, deliverables, and vision..."
                    value={commissionForm.scopeDescription}
                    onChange={(e) => setCommissionForm({ ...commissionForm, scopeDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none text-slate-900 font-bold placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Budget (FIC)</label>
                    <div className="relative">
                      <CurrencyDollarIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="number"
                        min="25"
                        value={commissionForm.budgetFic}
                        onChange={(e) => setCommissionForm({ ...commissionForm, budgetFic: Number(e.target.value) })}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold text-slate-900 placeholder:text-slate-400 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Timeline Deadline</label>
                    <div className="relative">
                      <CalendarIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={commissionForm.timeline}
                        onChange={(e) => setCommissionForm({ ...commissionForm, timeline: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none text-slate-900 font-bold placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex justify-between items-center">
                  <span>Available Balance: <strong>{ficBalance.toFixed(2)} FIC</strong></span>
                  <span className="font-semibold text-indigo-700">Protected Escrow Guarantee</span>
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsCommissionModalOpen(false)}
                    className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingCommission}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5"
                  >
                    {isSubmittingCommission ? (
                      'Securing Escrow...'
                    ) : (
                      <>
                        <ArrowRightIcon className="w-4 h-4" />
                        Submit Proposal
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PortfolioPage;
