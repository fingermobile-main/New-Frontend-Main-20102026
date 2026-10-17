/*
 * FingerMobile Protocol™ - Universal Asset & Merchandise Catalogue
 * Multi-Category Digital Assets, Creator Merchandise & Creative Licensing
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useMemo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import {
  CatalogueIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  TagIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  MusicalNoteIcon,
  PhotoIcon,
  VideoCameraIcon,
  CubeIcon,
  HeartIcon
} from '../icons';

export interface CatalogueAsset {
  id: string;
  title: string;
  category: 'photography' | 'audio' | 'merchandise' | 'video_vfx' | '3d_avatar';
  description: string;
  previewUrl: string;
  audioPreviewUrl?: string;
  creator: {
    id: string;
    name: string;
    handle: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  priceFic: number;
  priceNgn: number;
  licenseType: 'Royalty-Free' | 'Editorial' | 'Commercial Exclusive' | 'Physical Good';
  rating: number;
  reviewsCount: number;
  downloadsCount: number;
  tags: string[];
  specs: {
    format: string;
    resolutionOrDuration: string;
    fileSize: string;
  };
}

const DEFAULT_CATALOGUE_ASSETS: CatalogueAsset[] = [
  {
    id: 'cat-001',
    title: 'Neon Monolith - Eko Atlantic Cyber Dawn',
    category: 'photography',
    description: 'Ultra high-definition architectural shot of Eko Atlantic skyline during early dawn mist.',
    previewUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=900&q=80',
    creator: {
      id: 'cr-01',
      name: 'Tunde Afolabi',
      handle: 'tafolabi_lens',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    },
    priceFic: 45,
    priceNgn: 45000,
    licenseType: 'Commercial Exclusive',
    rating: 4.9,
    reviewsCount: 38,
    downloadsCount: 142,
    tags: ['lagos', 'architecture', 'cyberpunk', 'dawn'],
    specs: {
      format: 'RAW + TIFF + JPEG',
      resolutionOrDuration: '8256 x 5504 (45.4 MP)',
      fileSize: '74.2 MB'
    }
  },
  {
    id: 'cat-002',
    title: 'Afro-Futurism Master Drum Pack Vol. 3',
    category: 'audio',
    description: 'Authentic West African talking drums, log drums, and syncopated percussion stems tuned for BeatwaveNG.',
    previewUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
    audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    creator: {
      id: 'cr-02',
      name: 'Kofi Mensah Sound',
      handle: 'kofisoundlabs',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    },
    priceFic: 60,
    priceNgn: 60000,
    licenseType: 'Royalty-Free',
    rating: 5.0,
    reviewsCount: 92,
    downloadsCount: 420,
    tags: ['afrobeats', 'drums', 'stems', 'samples'],
    specs: {
      format: '24-bit 48kHz WAV Stems',
      resolutionOrDuration: '128 Audio Loops (112 BPM)',
      fileSize: '480 MB'
    }
  },
  {
    id: 'cat-003',
    title: 'FingerMobile Protocol™ Heavyweight Cyber Hoodie',
    category: 'merchandise',
    description: 'Limited edition 450GSM organic cotton hoodie featuring embroidered cryptographic NFC authentication tag.',
    previewUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80',
    creator: {
      id: 'cr-03',
      name: 'FingerMobile Apparel Lab',
      handle: 'fm_merch_official',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    },
    priceFic: 85,
    priceNgn: 85000,
    licenseType: 'Physical Good',
    rating: 4.8,
    reviewsCount: 57,
    downloadsCount: 89,
    tags: ['streetwear', 'apparel', 'hoodie', 'limited'],
    specs: {
      format: 'Physical Merchandise (S / M / L / XL / XXL)',
      resolutionOrDuration: 'Worldwide DHL Express Shipping',
      fileSize: 'Weight: 850g'
    }
  },
  {
    id: 'cat-004',
    title: 'Dancia-4Tv Broadcast Lower-Thirds & Transition Pack',
    category: 'video_vfx',
    description: 'Dynamic 4K motion graphics templates, glitch stingers, and title cards engineered for livestreams.',
    previewUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=80',
    creator: {
      id: 'cr-04',
      name: 'Amina Bello Visuals',
      handle: 'aminavfx',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    },
    priceFic: 35,
    priceNgn: 35000,
    licenseType: 'Royalty-Free',
    rating: 4.9,
    reviewsCount: 24,
    downloadsCount: 165,
    tags: ['broadcast', 'vfx', 'motion', 'livestream'],
    specs: {
      format: 'ProRes 4444 + Alpha Channel',
      resolutionOrDuration: '3840 x 2160 (60 FPS)',
      fileSize: '1.2 GB'
    }
  },
  {
    id: 'cat-005',
    title: 'Mii™ Holographic Avatar Cyber Samurai Armor',
    category: '3d_avatar',
    description: 'Interactive wearable 3D mesh with glowing shader rigs for Meta terminal and metaverse avatar spaces.',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
    creator: {
      id: 'cr-05',
      name: 'Chidi Okeke 3D Studio',
      handle: 'chidi_meta3d',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    },
    priceFic: 50,
    priceNgn: 50000,
    licenseType: 'Royalty-Free',
    rating: 4.7,
    reviewsCount: 31,
    downloadsCount: 210,
    tags: ['metaverse', '3d', 'mii', 'avatar'],
    specs: {
      format: 'GLTF 2.0 + FBX + OBJ',
      resolutionOrDuration: 'Rigged & Skin Weighted',
      fileSize: '34.8 MB'
    }
  },
  {
    id: 'cat-006',
    title: 'Lekki Toll Gate - Golden Hour Monologue',
    category: 'photography',
    description: 'Award-winning documentary photograph captured on medium-format digital sensor with rich tonal dynamic range.',
    previewUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=900&q=80',
    creator: {
      id: 'cr-01',
      name: 'Tunde Afolabi',
      handle: 'tafolabi_lens',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    },
    priceFic: 40,
    priceNgn: 40000,
    licenseType: 'Editorial',
    rating: 4.9,
    reviewsCount: 46,
    downloadsCount: 198,
    tags: ['lagos', 'documentary', 'goldenhour', 'street'],
    specs: {
      format: 'Lossless DNG + High-Res JPEG',
      resolutionOrDuration: '7360 x 4912 (36.1 MP)',
      fileSize: '62.4 MB'
    }
  }
];

const CataloguePage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLicense, setSelectedLicense] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'downloads' | 'rating'>('featured');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Modals & Interaction State
  const [selectedAsset, setSelectedAsset] = useState<CatalogueAsset | null>(null);
  const [purchasingAsset, setPurchasingAsset] = useState<CatalogueAsset | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [purchaseSuccessLicense, setPurchaseSuccessLicense] = useState<{
    assetTitle: string;
    hash: string;
    tier: string;
  } | null>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
      showToast('Removed from favorites', 'info');
    } else {
      setFavorites([...favorites, id]);
      showToast('Saved to your catalogue favorites', 'success');
    }
  };

  const handlePlayAudio = (asset: CatalogueAsset, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!asset.audioPreviewUrl) return;

    if (playingAudioId === asset.id) {
      audioElement?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const audio = new Audio(asset.audioPreviewUrl);
      audio.play().catch(() => {});
      audio.onended = () => setPlayingAudioId(null);
      setAudioElement(audio);
      setPlayingAudioId(asset.id);
    }
  };

  const handlePurchase = async (asset: CatalogueAsset) => {
    if (ficBalance < asset.priceFic) {
      showToast(`Insufficient balance! You need ${asset.priceFic} FIC. Current balance: ${ficBalance.toFixed(2)} FIC`, 'error');
      return;
    }

    try {
      setIsProcessingPurchase(true);
      // Simulate cryptographic settlement & license issuance
      await new Promise((res) => setTimeout(res, 900));

      const generatedHash = `0xLIC_${Math.random().toString(36).substring(2, 10).toUpperCase()}_${Date.now().toString(36).toUpperCase()}`;
      setPurchaseSuccessLicense({
        assetTitle: asset.title,
        hash: generatedHash,
        tier: asset.licenseType
      });
      setPurchasingAsset(null);
      showToast(`License secured for "${asset.title}"! Download ready in Vault.`, 'success');
    } catch {
      showToast('Transaction settlement failed. Please try again.', 'error');
    } finally {
      setIsProcessingPurchase(false);
    }
  };

  // Filtered and Sorted Assets
  const filteredAssets = useMemo(() => {
    return DEFAULT_CATALOGUE_ASSETS.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesLicense = selectedLicense === 'all' || item.licenseType === selectedLicense;

      return matchesSearch && matchesCategory && matchesLicense;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.priceFic - b.priceFic;
      if (sortBy === 'price_high') return b.priceFic - a.priceFic;
      if (sortBy === 'downloads') return b.downloadsCount - a.downloadsCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [searchTerm, selectedCategory, selectedLicense, sortBy]);

  return (
    <MainLayout pageTitle="Catalogue">
      <div className="min-h-screen bg-slate-50 text-gray-900 pb-16">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/40">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
                <CatalogueIcon className="w-4 h-4 text-indigo-400" />
                Universal Creator Marketplace & Licensing
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Creative Asset Catalogue
              </h1>
              <p className="mt-2 text-indigo-200 text-sm max-w-2xl">
                Browse, license, and acquire verified photography, production beats, VFX elements, 3D wearables, and limited physical merchandise from global FingerMobile creators.
              </p>
            </div>

            {/* Quick Balance Badge */}
            <div className="bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/15 flex items-center gap-4">
              <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
                <CurrencyDollarIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-indigo-200 font-semibold uppercase tracking-wider">Available Balance</p>
                <p className="text-xl font-black text-amber-300">{ficBalance.toLocaleString()} FIC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar & Filter Deck */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-300/80 p-5 space-y-4">
            {/* Search Input and Sort Selector */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <MagnifyingGlassIcon className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by title, creator, stem, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="downloads">Most Downloaded</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-200">
              {[
                { id: 'all', label: 'All Catalogues', icon: TagIcon },
                { id: 'photography', label: 'Stock Photos', icon: PhotoIcon },
                { id: 'audio', label: 'Audio & Beats', icon: MusicalNoteIcon },
                { id: 'merchandise', label: 'Merchandise', icon: ShoppingBagIcon },
                { id: 'video_vfx', label: 'Video VFX', icon: VideoCameraIcon },
                { id: '3d_avatar', label: '3D & Wearables', icon: CubeIcon }
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}

              {/* License Filter */}
              <div className="ml-auto flex items-center gap-2 pl-4">
                <span className="text-xs text-slate-700 font-semibold uppercase">License:</span>
                <select
                  value={selectedLicense}
                  onChange={(e) => setSelectedLicense(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none font-bold focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Licenses</option>
                  <option value="Royalty-Free">Royalty-Free</option>
                  <option value="Commercial Exclusive">Commercial Exclusive</option>
                  <option value="Editorial">Editorial</option>
                  <option value="Physical Good">Physical Goods</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-indigo-600" />
              Available Creations ({filteredAssets.length})
            </h2>
            <span className="text-xs text-slate-700 font-semibold">
              80% Creator Revenue Share Standard Guarantee
            </span>
          </div>

          {filteredAssets.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-300 shadow-sm">
              <CatalogueIcon className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">No assets match your search</h3>
              <p className="text-xs text-slate-700 mt-1">Try resetting the category filter or searching for another keyword.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLicense('all');
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => {
                const isFavorite = favorites.includes(asset.id);
                const isPlaying = playingAudioId === asset.id;

                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className="bg-white rounded-2xl border border-slate-300 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Media Thumbnail Container */}
                      <div className="relative h-56 bg-slate-100 overflow-hidden">
                        <img
                          src={asset.previewUrl}
                          alt={asset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                            {asset.category.replace('_', ' ')}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600/90 backdrop-blur-md text-white">
                            {asset.licenseType}
                          </span>
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => toggleFavorite(asset.id, e)}
                          title="Save to favorites"
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                            isFavorite
                              ? 'bg-rose-500 text-white'
                              : 'bg-black/40 text-white hover:bg-black/70'
                          }`}
                        >
                          <HeartIcon className="w-4 h-4 fill-current" />
                        </button>

                        {/* Audio Play/Pause Trigger if Audio */}
                        {asset.category === 'audio' && asset.audioPreviewUrl && (
                          <button
                            onClick={(e) => handlePlayAudio(asset, e)}
                            className="absolute bottom-3 left-3 p-3 rounded-full bg-amber-500 text-slate-900 shadow-lg hover:scale-110 transition-transform flex items-center gap-2 font-black text-xs"
                          >
                            {isPlaying ? (
                              <>
                                <PauseIcon className="w-4 h-4" />
                                <span>Pause Preview</span>
                              </>
                            ) : (
                              <>
                                <PlayIcon className="w-4 h-4" />
                                <span>Listen Stem</span>
                              </>
                            )}
                          </button>
                        )}

                        {/* Price Badge on Bottom Right */}
                        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/20 text-right">
                          <span className="text-sm font-black text-amber-300">{asset.priceFic} FIC</span>
                          <span className="text-[10px] text-gray-300 block">₦{asset.priceNgn.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {asset.title}
                        </h3>
                        <p className="text-xs text-slate-700 mt-1.5 line-clamp-2">
                          {asset.description}
                        </p>

                        {/* Creator Info */}
                        <div className="mt-4 flex items-center gap-3 pt-3 border-t border-slate-200">
                          <img
                            src={asset.creator.avatarUrl}
                            alt={asset.creator.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-300"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-800 truncate flex items-center gap-1">
                              {asset.creator.name}
                              {asset.creator.isVerified && (
                                <CheckCircleIcon className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                              )}
                            </p>
                            <p className="text-[10px] text-slate-700">@{asset.creator.handle}</p>
                          </div>
                          <div className="ml-auto text-right">
                            <span className="text-xs font-bold text-amber-500">★ {asset.rating}</span>
                            <span className="text-[10px] text-slate-700 block">{asset.downloadsCount} uses</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="p-5 pt-0 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAsset(asset);
                        }}
                        className="flex-1 py-2.5 border border-slate-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-colors"
                      >
                        Inspect Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPurchasingAsset(asset);
                        }}
                        className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                      >
                        <ShoppingBagIcon className="w-4 h-4" />
                        License ({asset.priceFic} FIC)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal 1: Asset Inspection Details */}
        {selectedAsset && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                <div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-indigo-50 text-indigo-700">
                    {selectedAsset.category.replace('_', ' ')}
                  </span>
                  <h3 className="text-xl font-black text-gray-900 mt-1">{selectedAsset.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="p-1 rounded-full text-slate-700 hover:text-gray-600 hover:bg-gray-100"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div className="rounded-2xl overflow-hidden border border-gray-200 max-h-72 bg-slate-900 flex items-center justify-center">
                  <img
                    src={selectedAsset.previewUrl}
                    alt={selectedAsset.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-700">Master Format</span>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">{selectedAsset.specs.format}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-700">Resolution / Specs</span>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">{selectedAsset.specs.resolutionOrDuration}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-700">Package Size</span>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">{selectedAsset.specs.fileSize}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">Description</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedAsset.description}</p>
                </div>

                {/* Creator Attribution Box */}
                <div className="flex items-center justify-between p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedAsset.creator.avatarUrl}
                      alt={selectedAsset.creator.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <h5 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                        {selectedAsset.creator.name}
                        {selectedAsset.creator.isVerified && (
                          <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                        )}
                      </h5>
                      <p className="text-xs text-slate-700">@{selectedAsset.creator.handle}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-white text-indigo-700 rounded-xl text-xs font-bold shadow-sm border border-indigo-200">
                    80% Royalty Creator
                  </span>
                </div>

                {/* Pricing & Checkout Modal Trigger */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div>
                    <span className="text-xs text-slate-700 block font-semibold">Total License Fee</span>
                    <span className="text-2xl font-black text-gray-900">{selectedAsset.priceFic} FIC</span>
                    <span className="text-xs text-slate-700 ml-2">(₦{selectedAsset.priceNgn.toLocaleString()})</span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedAsset(null)}
                      className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        const target = selectedAsset;
                        setSelectedAsset(null);
                        setPurchasingAsset(target);
                      }}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
                    >
                      <ShoppingBagIcon className="w-4 h-4" />
                      Acquire License
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Purchase & License Acquisition */}
        {purchasingAsset && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-300 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-black text-gray-900">Secure Creative License</h3>
                </div>
                <button
                  onClick={() => setPurchasingAsset(null)}
                  className="text-slate-700 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-700 uppercase font-bold">Selected Item</p>
                  <p className="text-base font-black text-gray-900 mt-0.5">{purchasingAsset.title}</p>
                  <p className="text-xs text-indigo-600 font-semibold mt-1">
                    License Scope: {purchasingAsset.licenseType} (Single Organization)
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Creator Net Payout (80%)</span>
                    <span className="font-semibold text-gray-900">{(purchasingAsset.priceFic * 0.8).toFixed(1)} FIC</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Protocol Infrastructure (20%)</span>
                    <span className="font-semibold text-gray-900">{(purchasingAsset.priceFic * 0.2).toFixed(1)} FIC</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-gray-900 border-t border-slate-300 pt-2">
                    <span>Total Deduction</span>
                    <span className="text-indigo-600">{purchasingAsset.priceFic} FIC</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                  <span>Current FIC Wallet Balance:</span>
                  <span className="font-bold">{ficBalance.toFixed(2)} FIC</span>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setPurchasingAsset(null)}
                    disabled={isProcessingPurchase}
                    className="flex-1 py-3 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePurchase(purchasingAsset)}
                    disabled={isProcessingPurchase}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
                  >
                    {isProcessingPurchase ? (
                      <span>Verifying On-Chain...</span>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>Confirm & Download</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal 3: Cryptographic License Hash & Download Certificate */}
        {purchaseSuccessLicense && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-300 animate-in fade-in zoom-in-95 text-center">
              <div className="w-14 h-14 bg-green-100 text-green-950 border border-green-400 font-bold rounded-full flex items-center justify-center mx-auto mb-4 font-black">
                <CheckCircleIcon className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-black text-gray-900">License Certified!</h3>
              <p className="text-xs text-slate-700 mt-1">
                Your cryptographic rights for &quot;{purchaseSuccessLicense.assetTitle}&quot; have been minted.
              </p>

              <div className="my-5 p-4 bg-slate-900 rounded-2xl text-left font-mono text-xs text-emerald-400 space-y-1 overflow-x-auto">
                <p className="text-gray-400 text-[10px]">CRYPTOGRAPHIC RIGHTS CERTIFICATE</p>
                <p>CERT_HASH: {purchaseSuccessLicense.hash}</p>
                <p>TIER: {purchaseSuccessLicense.tier}</p>
                <p>TIMESTAMP: {new Date().toISOString()}</p>
                <p className="text-emerald-300">STATUS: VERIFIED_ON_LEDGER</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setPurchaseSuccessLicense(null);
                    showToast('Initiating secure asset package download...', 'success');
                  }}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl text-sm shadow-md shadow-green-600/30 flex items-center justify-center gap-2"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Download Full Asset Package
                </button>
                <button
                  onClick={() => setPurchaseSuccessLicense(null)}
                  className="w-full py-2.5 border border-slate-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CataloguePage;
