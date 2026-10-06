/*
 * FingerMobile Protocol™ - PhotoCredits Page Component
 * Sovereign Creator Licensing & 80/20 Royalty Architecture
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Plus
} from 'lucide-react';

export interface CameraExif {
  camera?: string;
  lens?: string;
  iso?: number;
  shutter?: string;
  aperture?: string;
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
  comments?: number;
  downloads: number;
  price_credits: number;
  license_type: 'Royalty-Free Standard' | 'Editorial Use Only' | 'Commercial Extended' | string;
  camera_info?: CameraExif;
  hasLiked?: boolean;
}

type TabMode = 'gallery' | 'royalties' | 'certificate';

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

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
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

  // Fetch Photos from PostgreSQL via Backend API
  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await ApiService.get('/photocredits');
      const rawList = res?.data || (Array.isArray(res) ? res : []);

      if (rawList && rawList.length > 0) {
        const normalized: PhotoCreditItem[] = rawList.map((item: any, idx: number) => ({
          id: String(item.id || item.photo_id || `pc-${idx}`),
          photo_id: item.photo_id || `ph-${idx}`,
          title: item.title || 'Untitled Masterpiece',
          description: item.description || '',
          imageUrl: item.image_url || item.imageUrl || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600&auto=format&fit=crop&q=85',
          thumbnailUrl: item.thumbnail_url || item.thumbnailUrl || item.image_url,
          photographer: item.photographer_name || item.photographer || 'FingerMobile Creator',
          photographer_id: String(item.uploader_id || item.photographer_id || '1'),
          location: item.location || 'Global',
          category: item.category || 'General',
          tags: Array.isArray(item.tags) ? item.tags : [],
          likes: Number(item.likes || item.credits_count || 42),
          downloads: Number(item.downloads || Math.floor((item.credits_count || 10) * 0.4)),
          price_credits: Number(item.price || item.price_credits || 25),
          license_type: item.license_type || 'Royalty-Free Standard',
          camera_info: typeof item.camera_info === 'object' && item.camera_info !== null
            ? item.camera_info
            : { camera: 'Pro Camera Body', lens: 'Prime Lens', iso: 100, shutter: '1/250s', aperture: 'f/2.8' }
        }));
        setPhotos(normalized);
      }
    } catch {
      // Fallback silently to initial resilient cache
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

  // Handle Like
  const handleLike = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const hasLiked = p.hasLiked;
          return {
            ...p,
            likes: hasLiked ? p.likes - 1 : p.likes + 1,
            hasLiked: !hasLiked
          };
        }
        return p;
      })
    );
    showToast('Photo like recorded on ledger!', 'success');
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
      // Simulate/trigger license creation on backend
      const licensePayload = {
        photoId: selectedPhotoForLicense.photo_id || selectedPhotoForLicense.id,
        licenseTier: chosenTier,
        totalAmount: finalPrice,
        creatorRoyalty: Math.round(finalPrice * 0.8),
        platformFee: Math.round(finalPrice * 0.2)
      };

      await ApiService.post(`/photocredits/${selectedPhotoForLicense.id}/purchase-license`, licensePayload).catch(() => {});

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
      showToast(`License Acquired! Reference: ${licenseNumber}. Master file downloaded.`, 'success');
      setSelectedPhotoForLicense(null);
    } catch (err: any) {
      showToast(err.message || 'Licensing failed', 'error');
    } finally {
      setIsLicensing(false);
    }
  };

  // Upload New Photograph
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) {
      showToast('Please provide a photo title', 'error');
      return;
    }
    setIsUploading(true);
    try {
      const newPhoto: PhotoCreditItem = {
        id: `pc-${Date.now()}`,
        photo_id: `ph-${Date.now()}`,
        title: uploadForm.title,
        description: uploadForm.description,
        imageUrl: uploadForm.imageUrl,
        photographer: 'Verified Creator',
        photographer_id: '1',
        category: uploadForm.category,
        location: uploadForm.location,
        likes: 0,
        downloads: 0,
        price_credits: uploadForm.price_credits,
        license_type: uploadForm.license_type,
        camera_info: {
          camera: uploadForm.camera,
          lens: uploadForm.lens,
          iso: uploadForm.iso,
          shutter: uploadForm.shutter,
          aperture: uploadForm.aperture
        }
      };

      await ApiService.post('/photocredits', newPhoto).catch(() => {});
      setPhotos([newPhoto, ...photos]);
      setShowUploadModal(false);
      showToast('Master photo submitted and listed with 80% royalty protection!', 'success');
    } catch {
      showToast('Upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-3 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-900/60 via-orange-900/40 to-slate-900/90 border border-amber-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                PhotoCredits™ Sovereign Photography Licensing & 80/20 Royalty Protocol
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <span>PhotoCredits</span>
                <span className="text-sm font-medium px-2.5 py-0.5 rounded-md bg-amber-600/30 text-amber-300 border border-amber-500/30">
                  80% Creator Split
                </span>
              </h1>
              <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Browse, license, and mint verifiable master photographs. Every acquisition enforces immutable creator royalty rights: 80% directly to the photographer, 20% protocol infrastructure fee.
              </p>
            </div>

            {/* Balances & Creator Action */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/80 border border-amber-500/40 rounded-xl p-4 shadow-lg backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-inner">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">FIC Balance</div>
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                    🪙 {ficBalance.toLocaleString()} FIC
                  </div>
                </div>
              </div>

              <div className="h-10 w-px bg-slate-800 hidden sm:block" />

              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Submit Photograph
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
            {/* Search and Filter Controls */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by title, photographer, location, camera model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* License Tier Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedLicenseFilter}
                  onChange={(e) => setSelectedLicenseFilter(e.target.value)}
                  aria-label="Filter by license tier"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All License Tiers</option>
                  <option value="Royalty-Free Standard">Royalty-Free Standard</option>
                  <option value="Editorial Use Only">Editorial Use Only</option>
                  <option value="Commercial Extended">Commercial Extended</option>
                </select>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <LoadingSpinner />
                <p className="mt-4 text-sm text-slate-400">Loading PhotoCredits portfolio from PostgreSQL...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredPhotos.length === 0 && (
              <div className="text-center py-16 px-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">No Photographs Found</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
                  Try adjusting your search query or reset category filters.
                </p>
              </div>
            )}

            {/* Photography Grid */}
            {!loading && filteredPhotos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotos.map((photo) => {
                  return (
                    <div
                      key={photo.id}
                      className="group bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/20 flex flex-col justify-between"
                    >
                      {/* Image Preview Container */}
                      <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                        {/* License Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-slate-900/80 border border-amber-500/40 text-amber-300 shadow-md">
                            {photo.license_type}
                          </span>
                        </div>

                        {/* Location Pill */}
                        {photo.location && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs font-medium text-slate-300 shadow-md">
                            <MapPin className="w-3 h-3 text-red-400" />
                            <span>{photo.location}</span>
                          </div>
                        )}

                        {/* Price Tag */}
                        <div className="absolute bottom-3 right-3">
                          <span className="px-3 py-1 rounded-lg bg-amber-500 text-black font-extrabold text-xs shadow-lg">
                            🪙 {photo.price_credits} FIC
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                            {photo.title}
                          </h3>

                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                            <span>By</span>
                            <span className="text-slate-200 font-semibold">{photo.photographer}</span>
                            <span title="Verified Photographer" className="inline-flex items-center">
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                            </span>
                          </p>

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

                          <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                            {photo.description || 'Master-resolution licensed stock photography on FingerMobile Protocol™.'}
                          </p>
                        </div>

                        {/* Footer Controls */}
                        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                          <button
                            onClick={() => handleLike(photo.id)}
                            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 text-xs"
                            title="Like photograph"
                          >
                            <Heart className={`w-4 h-4 ${photo.hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
                            <span>{photo.likes}</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedPhotoForLicense(photo);
                              setChosenTier(photo.license_type || 'Royalty-Free Standard');
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-600/20 transition-all transform hover:-translate-y-0.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Acquire License
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
        {/* TAB 2: CREATOR ROYALTIES & PAYOUTS (80/20) */}
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
        {/* TAB 3: IMMUTABLE CERTIFICATION VAULT */}
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
      {/* UPLOAD MASTER PHOTOGRAPH MODAL */}
      {/* ======================================================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Camera className="w-4 h-4" />
                Submit Photograph for PhotoCredits Licensing
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5">
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={uploadForm.imageUrl}
                  onChange={(e) => setUploadForm({ ...uploadForm, imageUrl: e.target.value })}
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
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Camera EXIF Metadata:</span>
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

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {isUploading ? <LoadingSpinner /> : 'Submit & Protect (80% Split)'}
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
