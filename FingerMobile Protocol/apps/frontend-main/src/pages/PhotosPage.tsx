import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Camera,
  Heart,
  Download,
  Share2,
  Sparkles,
  Search,
  Filter,
  Eye,
  SlidersHorizontal,
  PlusCircle,
  X,
  CheckCircle2,
  Shield,
  Layers,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';

export interface PhotoExhibitionItem {
  id: string;
  url: string;
  title: string;
  photographer: string;
  avatar: string;
  category: string;
  location: string;
  camera: string;
  lens: string;
  settings: string;
  resolution: string;
  licenseTier: 'Commercial' | 'Editorial' | 'NFT Sovereign' | 'Public Domain';
  likes: number;
  views: number;
  downloads: number;
  tags: string[];
  date: string;
  aspectRatio: 'square' | 'portrait' | 'landscape';
  featured?: boolean;
}

const PHOTO_CATEGORIES = [
  'All Visuals',
  'Urban & Architectural',
  'African Heritage & Culture',
  'Wildlife & Nature',
  'Fashion & Editorial',
  'Studio Portraiture',
  'Drone & Aerial',
  'Nightscapes & Astrophotography',
  'Macro & Textures'
];

const CURATED_PHOTOS: PhotoExhibitionItem[] = [
  {
    id: 'ph-01',
    title: 'Lekki Toll Twilight & Sovereign Velocity',
    photographer: 'Tobi Bakare',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    category: 'Urban & Architectural',
    location: 'Lekki-Ikoyi Link Bridge, Lagos',
    camera: 'Sony Alpha 7R V',
    lens: 'FE 24-70mm f/2.8 GM II',
    settings: '1/4s • f/8.0 • ISO 100',
    resolution: '9504 x 6336 (61 MP RAW)',
    licenseTier: 'Commercial',
    likes: 842,
    views: 4520,
    downloads: 310,
    tags: ['Lagos', 'Night', 'Architecture', 'Urban'],
    date: '2026-10-12',
    aspectRatio: 'landscape',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200',
    featured: true
  },
  {
    id: 'ph-02',
    title: 'Equestrian Dignity of the Northern Durbar',
    photographer: 'Fatima Al-Hassan',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    category: 'African Heritage & Culture',
    location: 'Kano Emirate Grounds, Nigeria',
    camera: 'Fujifilm GFX 100 II',
    lens: 'GF 110mm f/2 R LM WR',
    settings: '1/1000s • f/2.8 • ISO 200',
    resolution: '11648 x 8736 (102 MP Medium Format)',
    licenseTier: 'NFT Sovereign',
    likes: 1240,
    views: 6890,
    downloads: 540,
    tags: ['Durbar', 'Royalty', 'Heritage', 'Culture'],
    date: '2026-10-10',
    aspectRatio: 'portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200',
    featured: true
  },
  {
    id: 'ph-03',
    title: 'Sahara Dune Harmonies at First Light',
    photographer: 'Chidi Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    category: 'Wildlife & Nature',
    location: 'Grand Erg Occidental, Sahara',
    camera: 'Hasselblad X2D 100C',
    lens: 'XCD 55mm f/2.5 V',
    settings: '1/250s • f/5.6 • ISO 64',
    resolution: '11656 x 8742 (100 MP)',
    licenseTier: 'Commercial',
    likes: 915,
    views: 5210,
    downloads: 420,
    tags: ['Sahara', 'Desert', 'GoldenHour', 'Minimalism'],
    date: '2026-10-08',
    aspectRatio: 'landscape',
    url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200'
  },
  {
    id: 'ph-04',
    title: 'Neo-African Haute Couture: Adire Matrix',
    photographer: 'Zainab Danladi',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200',
    category: 'Fashion & Editorial',
    location: 'Victoria Island Studio A, Lagos',
    camera: 'Canon EOS R5 Mark II',
    lens: 'RF 85mm f/1.2L USM DS',
    settings: '1/160s • f/1.4 • ISO 100',
    resolution: '8192 x 5464 (45 MP)',
    licenseTier: 'Commercial',
    likes: 1480,
    views: 8940,
    downloads: 690,
    tags: ['Fashion', 'Adire', 'Textiles', 'Editorial'],
    date: '2026-10-07',
    aspectRatio: 'portrait',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200',
    featured: true
  },
  {
    id: 'ph-05',
    title: 'Afrobeats Cultural Pulse & Pyro Euphoria',
    photographer: 'Emeka Nwosu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    category: 'Urban & Architectural',
    location: 'Tafawa Balewa Square, Lagos',
    camera: 'Nikon Z8',
    lens: 'NIKKOR Z 70-200mm f/2.8 VR S',
    settings: '1/500s • f/2.8 • ISO 1600',
    resolution: '8256 x 5504 (45.7 MP)',
    licenseTier: 'Editorial',
    likes: 730,
    views: 4120,
    downloads: 280,
    tags: ['Afrobeats', 'Festival', 'Crowd', 'Music'],
    date: '2026-10-06',
    aspectRatio: 'landscape',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200'
  },
  {
    id: 'ph-06',
    title: 'Serengeti Migration: The Crossing Tide',
    photographer: 'Amina Bello',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    category: 'Wildlife & Nature',
    location: 'Mara River Basin, Serengeti',
    camera: 'Sony Alpha 1',
    lens: 'FE 400mm f/2.8 GM OSS',
    settings: '1/2000s • f/3.2 • ISO 400',
    resolution: '8640 x 5760 (50 MP)',
    licenseTier: 'Commercial',
    likes: 1650,
    views: 9400,
    downloads: 810,
    tags: ['Serengeti', 'Wildlife', 'Migration', 'Nature'],
    date: '2026-10-05',
    aspectRatio: 'landscape',
    url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200'
  },
  {
    id: 'ph-07',
    title: 'Cyberpunk Marina: Coastal Monorail Vista',
    photographer: 'Kenji Sato & Sovereign Labs',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    category: 'Drone & Aerial',
    location: 'Eko Atlantic City, Lagos',
    camera: 'DJI Inspire 3 (Zenmuse X9-8K Air)',
    lens: 'DL 24mm F2.8 LS ASPH',
    settings: '1/800s • f/4.0 • ISO 200',
    resolution: '8192 x 4320 (8K CinemaDNG)',
    licenseTier: 'NFT Sovereign',
    likes: 1890,
    views: 11200,
    downloads: 940,
    tags: ['Drone', 'Aerial', 'EkoAtlantic', '8K'],
    date: '2026-10-04',
    aspectRatio: 'landscape',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200'
  },
  {
    id: 'ph-08',
    title: 'Sovereign Elder of the Ancient Bini Guilds',
    photographer: 'Osaze Egharevba',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
    category: 'Studio Portraiture',
    location: 'Igun Street Bronze Foundry, Benin City',
    camera: 'Leica S3 Medium Format',
    lens: 'Summarit-S 70mm f/2.5 ASPH CS',
    settings: '1/125s • f/4.0 • ISO 100',
    resolution: '9600 x 6400 (64 MP)',
    licenseTier: 'NFT Sovereign',
    likes: 2150,
    views: 13400,
    downloads: 1120,
    tags: ['Benin', 'Bronze', 'Portrait', 'History'],
    date: '2026-10-02',
    aspectRatio: 'portrait',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200'
  }
];

const PhotosPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { member } = useAuth();

  const [photos, setPhotos] = useState<PhotoExhibitionItem[]>(CURATED_PHOTOS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Visuals');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [licenseFilter, setLicenseFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'trending' | 'likes' | 'views' | 'downloads' | 'newest'>('trending');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoExhibitionItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [likedPhotoIds, setLikedPhotoIds] = useState<Record<string, boolean>>({});

  // New photo form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Urban & Architectural');
  const [newLocation, setNewLocation] = useState('');
  const [newCamera, setNewCamera] = useState('');
  const [newLicense, setNewLicense] = useState<'Commercial' | 'Editorial' | 'NFT Sovereign'>('Commercial');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Filtered & Sorted Photos
  const filteredPhotos = useMemo(() => {
    return photos
      .filter((p) => {
        const matchesCategory = selectedCategory === 'All Visuals' || p.category === selectedCategory;
        const matchesSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.photographer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesLicense = licenseFilter === 'all' || p.licenseTier === licenseFilter;
        return matchesCategory && matchesSearch && matchesLicense;
      })
      .sort((a, b) => {
        if (sortBy === 'likes') return b.likes - a.likes;
        if (sortBy === 'views') return b.views - a.views;
        if (sortBy === 'downloads') return b.downloads - a.downloads;
        if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
        return b.likes * 2 + b.views - (a.likes * 2 + a.views); // trending composite
      });
  }, [photos, selectedCategory, searchQuery, licenseFilter, sortBy]);

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPhotoIds((prev) => {
      const isLiked = !!prev[id];
      const next = { ...prev, [id]: !isLiked };
      setPhotos((current) =>
        current.map((p) => (p.id === id ? { ...p, likes: p.likes + (isLiked ? -1 : 1) } : p))
      );
      showToast?.(isLiked ? 'Removed from your favorites' : 'Saved to favorites ❤️', 'info');
      return next;
    });
  };

  const handleDownloadMaster = (photo: PhotoExhibitionItem) => {
    setPhotos((current) =>
      current.map((p) => (p.id === photo.id ? { ...p, downloads: p.downloads + 1 } : p))
    );
    showToast?.(`Master Asset Download Started: ${photo.title} (${photo.resolution})`, 'success');
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast?.('Please enter a photo title', 'warning');
      return;
    }

    const created: PhotoExhibitionItem = {
      id: `ph-${Date.now()}`,
      title: newTitle.trim(),
      photographer: (member as any)?.name || (member as any)?.displayName || (member as any)?.username || 'Sovereign Creator',
      avatar: (member as any)?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      category: newCategory,
      location: newLocation.trim() || 'Lagos, Nigeria',
      camera: newCamera.trim() || 'Sony Alpha 7R V',
      lens: 'FE 24-70mm f/2.8 GM',
      settings: '1/250s • f/4.0 • ISO 100',
      resolution: '8192 x 5464 (Ultra 4K RAW)',
      licenseTier: newLicense,
      likes: 1,
      views: 12,
      downloads: 0,
      tags: ['New', 'Exhibition', newCategory.split(' ')[0]],
      date: new Date().toISOString().split('T')[0],
      aspectRatio: 'landscape',
      url: newImageUrl.trim() || 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200'
    };

    setPhotos([created, ...photos]);
    setShowUploadModal(false);
    setNewTitle('');
    setNewLocation('');
    setNewCamera('');
    setNewImageUrl('');
    showToast?.('Photograph curated & published to exhibition!', 'success');
  };

  return (
    <MainLayout pageTitle="Photos & Visual Art Studio">
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-28 md:pb-12 max-w-full overflow-x-hidden text-slate-900">
        
        {/* 1. HERO BANNER: Strict Contrast Hierarchy */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-400 text-orange-950 text-xs font-black uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5 text-orange-600" />
                <span>Ultra-HD Master Visual Studio</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Community Photography &amp; Master Visuals
              </h1>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                Sovereign, ultra-high resolution captures from premier creators worldwide. Explore 4K/8K RAW master assets, license original rights, and inspect complete camera EXIF telemetry.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Upload Photograph</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/photocredits')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all"
              >
                <Shield className="w-4 h-4 text-slate-700" />
                <span>Photo Credits Market</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. CATEGORY HORIZONTAL PILL SCROLLER */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
          {PHOTO_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-800 hover:text-slate-900 border-slate-300 hover:border-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3. SEARCH & CONTROLS TOOLBAR */}
        <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, photographer, location, camera gear, or tags..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-600" />
              <label htmlFor="license-filter-select" className="text-xs font-bold text-slate-800">License:</label>
              <select
                id="license-filter-select"
                value={licenseFilter}
                onChange={(e) => setLicenseFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
              >
                <option value="all">All Rights Tiers</option>
                <option value="Commercial">Commercial Sync</option>
                <option value="Editorial">Editorial Press</option>
                <option value="NFT Sovereign">NFT Sovereign</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
              <label htmlFor="sort-by-select" className="text-xs font-bold text-slate-800">Sort:</label>
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
              >
                <option value="trending">Trending Pulse</option>
                <option value="likes">Most Appreciated</option>
                <option value="views">Most Viewed</option>
                <option value="downloads">Most Downloaded</option>
                <option value="newest">Recently Captured</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. PHOTO GALLERY GRID */}
        {filteredPhotos.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-300 space-y-3">
            <Camera className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Visual Captures Found</h3>
            <p className="text-xs text-slate-700 max-w-sm mx-auto">
              No photographs matching &ldquo;{searchQuery}&rdquo; in this category. Try adjusting your query or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => {
              const isLiked = !!likedPhotoIds[photo.id];

              return (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group bg-white rounded-2xl border border-slate-300 hover:border-slate-400 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Right Floating Badge */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-[10px] font-black text-white border border-white/20">
                        {photo.licenseTier}
                      </span>
                    </div>

                    {/* Hover Floating Actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => handleToggleLike(photo.id, e)}
                          className={`p-2 rounded-xl backdrop-blur-xs transition-colors ${
                            isLiked
                              ? 'bg-rose-500 text-white'
                              : 'bg-black/50 text-white hover:bg-rose-600'
                          }`}
                          title={isLiked ? 'Unlike' : 'Like'}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-mono font-bold text-orange-300 truncate">
                          {photo.camera}
                        </p>
                        <p className="text-xs font-extrabold text-white line-clamp-1">
                          {photo.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Metadata Footer: Strict Text Contrast Hierarchy */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-sm font-black text-slate-900 truncate" title={photo.title}>
                          {photo.title}
                        </h2>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <MapPin className="w-3 h-3 text-slate-600 shrink-0" />
                        <span className="truncate">{photo.location}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={photo.avatar}
                          alt={photo.photographer}
                          className="w-6 h-6 rounded-full object-cover border border-slate-300"
                        />
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {photo.photographer}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
                        <span className="flex items-center gap-0.5">
                          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                          {photo.likes}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Eye className="w-3.5 h-3.5 text-slate-600" />
                          {photo.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. PHOTO DETAIL LIGHTBOX & EXIF TELEMETRY MODAL */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-300 max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
              
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPhoto.avatar}
                    alt={selectedPhoto.photographer}
                    className="w-10 h-10 rounded-full object-cover border-2 border-orange-500"
                  />
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      {selectedPhoto.title}
                    </h2>
                    <p className="text-xs text-slate-700 font-medium">
                      Captured by <strong className="text-slate-900">{selectedPhoto.photographer}</strong> • {selectedPhoto.location}
                    </p>
                  </div>
                </div>

                <button aria-label="Close"
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 space-y-6">
                {/* Large Preview Image */}
                <div className="rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-300 max-h-[60vh]">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.title}
                    className="max-h-[60vh] w-auto object-contain"
                  />
                </div>

                {/* Technical EXIF & Camera Specs Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-300">
                  <div>
                    <span className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Camera Body</span>
                    <span className="text-xs font-black text-slate-900">{selectedPhoto.camera}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Lens Optics</span>
                    <span className="text-xs font-black text-slate-900">{selectedPhoto.lens}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Exposure Telemetry</span>
                    <span className="text-xs font-black text-slate-900">{selectedPhoto.settings}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Full Master Dimensions</span>
                    <span className="text-xs font-black text-slate-900">{selectedPhoto.resolution}</span>
                  </div>
                </div>

                {/* License & Rights Accordion */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-orange-50 border border-orange-300">
                  <div className="space-y-1">
                    <span className="inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded bg-orange-200 text-orange-950 border border-orange-400">
                      License Tier: {selectedPhoto.licenseTier}
                    </span>
                    <p className="text-xs text-slate-800 font-medium">
                      Commercial synchronization, editorial publishing &amp; high-res billboard reproduction enabled.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleDownloadMaster(selectedPhoto)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Master Asset</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showToast?.('Direct photo link copied to clipboard!', 'info');
                      }}
                      className="p-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="Share Visual"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. UPLOAD MODAL */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white rounded-3xl border border-slate-300 max-w-lg w-full p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-black text-slate-900">Curate New Photograph</h2>
                </div>
                <button aria-label="Close"
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label htmlFor="photo-title-input" className="block text-xs font-bold text-slate-800 mb-1">
                    Photo Title *
                  </label>
                  <input
                    id="photo-title-input"
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Dawn Mist Over Zuma Rock"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="category-select" className="block text-xs font-bold text-slate-800 mb-1">
                      Category
                    </label>
                    <select
                      id="category-select"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {PHOTO_CATEGORIES.filter((c) => c !== 'All Visuals').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="license-select" className="block text-xs font-bold text-slate-800 mb-1">
                      License Tier
                    </label>
                    <select
                      id="license-select"
                      value={newLicense}
                      onChange={(e) => setNewLicense(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Commercial">Commercial Sync</option>
                      <option value="Editorial">Editorial Only</option>
                      <option value="NFT Sovereign">NFT Sovereign</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="location-input" className="block text-xs font-bold text-slate-800 mb-1">
                    Location &amp; Country
                  </label>
                  <input
                    id="location-input"
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Niger State, Nigeria"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="camera-specs-input" className="block text-xs font-bold text-slate-800 mb-1">
                    Camera &amp; Lens Specs
                  </label>
                  <input
                    id="camera-specs-input"
                    type="text"
                    value={newCamera}
                    onChange={(e) => setNewCamera(e.target.value)}
                    placeholder="e.g. Sony Alpha 7R V • 24-70mm GM II"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="image-url-input" className="block text-xs font-bold text-slate-800 mb-1">
                    Image Direct URL (or Unsplash 4K Asset)
                  </label>
                  <input
                    id="image-url-input"
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider shadow-sm"
                  >
                    Publish to Exhibition
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 md:hidden">
          <div className="flex items-center justify-around gap-2 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setSelectedCategory('All Visuals')}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'All Visuals'
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Camera className="w-5 h-5 mb-0.5" />
              <span>All</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('Urban & Architectural')}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'Urban & Architectural'
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Layers className="w-5 h-5 mb-0.5" />
              <span>Urban</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('African Heritage & Culture')}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'African Heritage & Culture'
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-5 h-5 mb-0.5" />
              <span>Culture</span>
            </button>
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-orange-600 hover:text-orange-800 transition-all"
            >
              <PlusCircle className="w-5 h-5 mb-0.5" />
              <span>Upload</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PhotosPage;
