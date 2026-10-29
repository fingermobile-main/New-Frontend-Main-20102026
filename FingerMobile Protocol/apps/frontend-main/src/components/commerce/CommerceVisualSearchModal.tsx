/*
 * FingerMobile Protocol™ - Unified Commerce Visual Image Search Modal
 * Multimodal AI Visual Catalog Matching across:
 * - MarketPlace (Flagship Hardware & Protocol)
 * - OwnIt (Rare Luxury, Horology & Fine Jewelry)
 * - Flamingo (Sensual Lounge, Intimate Wellness & Silk)
 * - Storefronts (Vendor Boutiques & Creator Merchants)
 * - FingerLux (VIP Concierge & Ultra-Luxury Hospitality)
 *
 * Strictly adheres to WCAG AAA text contrast standards (AGENTS.md).
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  UploadCloud,
  Search,
  X,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Tag,
  CheckCircle2,
  SlidersHorizontal,
  RefreshCw,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';

export interface VisualSearchResultItem {
  id: string;
  raw_id?: string | number;
  name: string;
  title?: string;
  store: string;
  store_key: 'marketplace' | 'ownit' | 'flamingo' | 'storefront' | 'fingerlux';
  store_badge_color: string;
  category: string;
  price: number;
  price_fic: number;
  price_usd: number;
  currency: string;
  image_url: string;
  images?: string[];
  in_stock: boolean;
  stock_quantity?: number;
  rating: number;
  visual_similarity_score: number;
  matched_visual_tags: string[];
  deep_link: string;
  description?: string;
}

export interface CommerceVisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStore?: 'all' | 'marketplace' | 'ownit' | 'flamingo' | 'storefront' | 'fingerlux';
  onSelectProduct?: (product: VisualSearchResultItem) => void;
}

const STORE_TABS = [
  { id: 'all', label: 'All Stores', icon: ShoppingBag, color: '#0F172A' },
  { id: 'marketplace', label: 'MarketPlace', icon: Tag, color: '#2563EB' },
  { id: 'ownit', label: 'OwnIt', icon: Star, color: '#D97706' },
  { id: 'flamingo', label: 'Flamingo', icon: Sparkles, color: '#E11D48' },
  { id: 'storefront', label: 'Storefronts', icon: ShoppingBag, color: '#059669' },
  { id: 'fingerlux', label: 'FingerLux', icon: ShieldCheck, color: '#7C3AED' }
] as const;

const SAMPLE_INSPIRATIONS = [
  {
    label: 'Hardware Vault',
    store: 'marketplace',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    tags: ['HSM', 'Titanium', 'Cold Vault']
  },
  {
    label: 'Haute Horlogerie',
    store: 'ownit',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    tags: ['Tourbillon', 'Gold', 'Watch']
  },
  {
    label: 'Pink Diamond Ring',
    store: 'ownit',
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    tags: ['22.4ct', 'Gemstone', 'Fine Jewelry']
  },
  {
    label: 'Silk Lounge Set',
    store: 'flamingo',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    tags: ['Mulberry Silk', 'Robes', 'Flamingo']
  },
  {
    label: 'Artisan Espresso',
    store: 'storefront',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    tags: ['Roast 1KG', 'Specialty', 'Boutique']
  }
];

export const CommerceVisualSearchModal: React.FC<CommerceVisualSearchModalProps> = ({
  isOpen,
  onClose,
  initialStore = 'all',
  onSelectProduct
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Search Parameters
  const [selectedStore, setSelectedStore] = useState<string>(initialStore);
  const [queryKeyword, setQueryKeyword] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'similarity' | 'price_asc' | 'price_desc' | 'rating'>('similarity');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Active Query Image & Results State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [pastedUrlInput, setPastedUrlInput] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<VisualSearchResultItem[]>([]);
  const [queryProfile, setQueryProfile] = useState<{
    dominant_color?: string;
    color_name?: string;
    color_family?: string;
    visual_tags?: string[];
    detected_category?: string;
  } | null>(null);
  const [storesSummary, setStoresSummary] = useState<Record<string, number>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset initial store when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedStore(initialStore);
    }
  }, [isOpen, initialStore]);

  // Execute Visual Search via Backend API
  const executeVisualSearch = useCallback(
    async (file?: File | null, remoteUrl?: string | null) => {
      const activeFile = file !== undefined ? file : selectedFile;
      const activeUrl = remoteUrl !== undefined ? remoteUrl : previewImageUrl;

      if (!activeFile && !activeUrl) {
        setErrorMessage('Please upload a product photo, snap an image, or select a sample.');
        return;
      }

      setIsSearching(true);
      setErrorMessage(null);

      try {
        let responseData: any = null;

        if (activeFile) {
          const formData = new FormData();
          formData.append('image', activeFile);
          formData.append('store', selectedStore);
          formData.append('q', queryKeyword);
          if (minPrice) formData.append('minPrice', minPrice);
          if (maxPrice) formData.append('maxPrice', maxPrice);
          if (inStockOnly) formData.append('inStock', 'true');
          formData.append('sortBy', sortBy);

          const res = await fetch('/api/search/image', {
            method: 'POST',
            body: formData
          });
          responseData = await res.json();
        } else if (activeUrl) {
          const res = await fetch('/api/search/visual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageUrl: activeUrl,
              store: selectedStore,
              q: queryKeyword,
              minPrice: minPrice ? Number(minPrice) : 0,
              maxPrice: maxPrice ? Number(maxPrice) : null,
              inStock: inStockOnly,
              sortBy
            })
          });
          responseData = await res.json();
        }

        if (responseData && responseData.success) {
          setSearchResults(responseData.results || []);
          setStoresSummary(responseData.stores_summary || {});
          if (responseData.query_image) {
            setQueryProfile({
              dominant_color: responseData.query_image.dominant_color,
              color_name: responseData.query_image.color_name,
              color_family: responseData.query_image.color_family,
              visual_tags: responseData.query_image.visual_tags,
              detected_category: responseData.query_image.detected_category
            });
            if (responseData.query_image.url && !activeFile) {
              setPreviewImageUrl(responseData.query_image.url);
            }
          }
        } else {
          setErrorMessage(responseData?.error || 'Visual search could not complete.');
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Network communication error during visual search.');
      } finally {
        setIsSearching(false);
      }
    },
    [selectedFile, previewImageUrl, selectedStore, queryKeyword, minPrice, maxPrice, inStockOnly, sortBy]
  );

  // Trigger search when store tab, sort, or stock toggle changes with an active image
  useEffect(() => {
    if (previewImageUrl || selectedFile) {
      executeVisualSearch();
    }
  }, [selectedStore, sortBy, inStockOnly]);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewImageUrl(objectUrl);
      executeVisualSearch(file, null);
    }
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewImageUrl(objectUrl);
      executeVisualSearch(file, null);
    }
  };

  // Select a pre-configured sample inspiration
  const handleSelectSample = (sample: (typeof SAMPLE_INSPIRATIONS)[0]) => {
    setSelectedFile(null);
    setPreviewImageUrl(sample.url);
    setSelectedStore('all');
    executeVisualSearch(null, sample.url);
  };

  // Paste URL search trigger
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedUrlInput.trim()) return;
    setSelectedFile(null);
    setPreviewImageUrl(pastedUrlInput.trim());
    executeVisualSearch(null, pastedUrlInput.trim());
  };

  // Clear Query Image
  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewImageUrl(null);
    setPastedUrlInput('');
    setSearchResults([]);
    setQueryProfile(null);
    setErrorMessage(null);
  };

  // Handle Product Card Click
  const handleProductClick = (product: VisualSearchResultItem) => {
    if (onSelectProduct) {
      onSelectProduct(product);
      onClose();
      return;
    }
    onClose();
    navigate(product.deep_link);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="visual-search-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-300 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 via-slate-100 to-indigo-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="visual-search-title" className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Visual Commerce Search
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 text-[10px] font-black uppercase tracking-wider">
                  AI Match
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Upload or snap any product to match similar items across all Sovereign stores.
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store Tabs Switcher */}
        <div className="flex items-center px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto no-scrollbar gap-1 pt-2">
          {STORE_TABS.map((tab) => {
            const isActive = selectedStore === tab.id;
            const count = storesSummary[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStore(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'border-emerald-600 text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                {count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Top Section: Upload Area or Active Image Preview */}
          {!previewImageUrl ? (
            <div className="space-y-4">
              {/* Drag & Drop Upload Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-3xl p-6 sm:p-8 text-center bg-slate-50/70 dark:bg-slate-900/40 hover:bg-emerald-50/20 transition-all cursor-pointer group space-y-3"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    Drop a product photo here or{' '}
                    <span className="text-emerald-700 dark:text-emerald-400 underline decoration-2">browse files</span>
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
                    Supports PNG, JPG, WEBP, AVIF up to 25MB • Automated visual feature extraction
                  </p>
                </div>

                {/* Quick Capture Options */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 shadow-2xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-600" /> Take Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 shadow-2xs"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-600" /> Choose Gallery
                  </button>
                </div>
              </div>

              {/* Paste Image URL Form */}
              <form onSubmit={handleUrlSubmit} className="flex gap-2">
                <input
                  type="url"
                  value={pastedUrlInput}
                  onChange={(e) => setPastedUrlInput(e.target.value)}
                  placeholder="Or paste an image web link (https://...)..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!pastedUrlInput.trim() || isSearching}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" /> Search Link
                </button>
              </form>

              {/* Sample Inspiration Chips */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                  Try Sample Product Inspiration:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_INSPIRATIONS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:border-emerald-400 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5 transition"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{sample.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Active Query Image & Granular Refinements */
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Active Image Thumbnail & Metadata */}
                <div className="flex items-center space-x-3.5">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-900 shadow-md flex-shrink-0">
                    <img src={previewImageUrl} alt="Query reference" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={handleClearImage}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                        Visual Query Reference
                      </span>
                      {queryProfile?.color_name && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-bold text-slate-900 dark:text-slate-200">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: queryProfile.dominant_color || '#1E293B' }}
                          />
                          {queryProfile.color_name}
                        </span>
                      )}
                    </div>
                    {queryProfile?.detected_category && (
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        Category:{' '}
                        <span className="font-bold text-slate-900 dark:text-white">
                          {queryProfile.detected_category}
                        </span>
                      </p>
                    )}
                    {/* Visual Tags */}
                    {queryProfile?.visual_tags && queryProfile.visual_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {queryProfile.visual_tags.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Change Photo or Filters Toggle */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1 shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-600" /> Change Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition ${
                      showFilters
                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                  </button>
                </div>
              </div>

              {/* Granular Search Keyword Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={queryKeyword}
                    onChange={(e) => setQueryKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && executeVisualSearch()}
                    placeholder="Add granular criteria (e.g. titanium, 4K, Mulberry silk, size L)..."
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => executeVisualSearch()}
                  disabled={isSearching}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  <span>Match</span>
                </button>
              </div>

              {/* Expanded Granular Filters Tray */}
              {showFilters && (
                <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
                  {/* Min / Max Price */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Price Range (FIC)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-950"
                      />
                      <span className="text-slate-400 text-xs">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-950"
                      />
                    </div>
                  </div>

                  {/* Sort Selection */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Sort Results By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-950"
                    >
                      <option value="similarity">Highest Visual Match</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="rating">Top Customer Rating</option>
                    </select>
                  </div>

                  {/* In-stock Only Toggle */}
                  <div className="flex items-center justify-start sm:justify-end pt-5">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        In-Stock Only
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs font-bold flex items-center justify-between">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Results Header */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Matched Catalog Items
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold">
                {searchResults.length} items
              </span>
            </div>

            {isSearching && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Scanning store databases...
              </span>
            )}
          </div>

          {/* Products Grid */}
          {isSearching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div
                  key={n}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 space-y-2.5 animate-pulse"
                >
                  <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((product) => {
                const isVeryHighMatch = product.visual_similarity_score >= 80;
                return (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="group bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-emerald-500 rounded-2xl p-3 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Image Thumbnail with Visual Match Badge */}
                      <div className="relative w-full aspect-square bg-slate-950 rounded-xl overflow-hidden mb-2.5">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Similarity Pill */}
                        <div
                          className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black font-mono shadow-md flex items-center gap-1 ${
                            isVeryHighMatch
                              ? 'bg-emerald-500 text-white border border-emerald-300'
                              : 'bg-black/75 text-amber-300 border border-amber-400/40'
                          }`}
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{product.visual_similarity_score}% Match</span>
                        </div>

                        {/* Store Origin Badge */}
                        <div
                          className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow"
                          style={{ backgroundColor: product.store_badge_color }}
                        >
                          {product.store}
                        </div>
                      </div>

                      {/* Title & Category */}
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-slate-700 dark:text-slate-400 font-bold mt-0.5 truncate">
                        {product.category}
                      </p>

                      {/* Matched Visual Tags */}
                      {product.matched_visual_tags && product.matched_visual_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {product.matched_visual_tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                              ✓ {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price, Rating & CTA */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                          {product.price_fic} FIC
                        </div>
                        {product.price_usd && (
                          <div className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">
                            ≈ ${product.price_usd.toLocaleString()}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product);
                        }}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-800 dark:text-slate-200 transition cursor-pointer"
                        title="View product details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-black text-slate-900 dark:text-white">
                No visual matches found with current filters
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-400 max-w-md mx-auto">
                Try switching the store selector to &quot;All Stores&quot;, clearing granular text filters, or selecting a different sample image.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs">
          <span className="text-slate-700 dark:text-slate-400 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            FingerMobile Cross-Store Image Search Engine v2.0
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommerceVisualSearchModal;

