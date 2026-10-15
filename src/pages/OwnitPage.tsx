/*
 * FingerMobile Protocol™ - OwnIt Celebrity Red-Carpet Luxury Mall
 * A Celebrity Red-Carpet Shopping Mall for Everything Luxury
 * Curated 4K Imagery & Video Trailers, Branded Shopfronts, Celebrity Stalls,
 * Shops within Shops, Pavilions, and Cryptographic SHA-256 Provenance Certificates.
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import { CURATED_LUXURY_PRODUCTS, LuxuryProduct } from '../data/luxuryProducts';
import SocialEmbedModal from '../components/commerce/SocialEmbedModal';
import {
  Crown,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  Play,
  Film,
  Award,
  Lock,
  ExternalLink,
  ChevronRight,
  Eye,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  BarChart2,
  Copy,
  Zap,
  Bot,
  Send,
  Building,
  Store,
  Gem,
  Watch,
  Car,
  Compass
} from 'lucide-react';

export interface OwnItStore {
  id: string;
  name: string;
  slug: string;
  store_type: 'celebrity_stall' | 'branded_shopfront' | 'shop_within_shop' | 'redcarpet_pavilion' | 'haute_atelier';
  curator_name?: string;
  brand_tier?: string;
  pavilion_location?: string;
  cover_4k_url?: string;
  video_trailer_4k_url?: string;
  description: string;
  authenticity_pledge?: string;
  is_verified?: boolean;
  rating?: number;
}

export interface OwnItProduct {
  id: string;
  store_id?: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  priceFic: number;
  price_usd?: number;
  price_fic?: number;
  media_4k_urls?: string[];
  imageUrl?: string;
  images?: string[];
  video_showcase_url?: string;
  authenticity_cert_number: string;
  cryptographic_sha256: string;
  provenance_history?: { year: number; event: string; entity: string }[];
  serial_number?: string;
  rarity_level?: string;
  celebrity_endorsement?: string;
  stock?: number;
  likes: number;
  dislikes: number;
  rating: number;
  poll_data?: {
    question: string;
    options: { id: number; text: string; votes: number }[];
  };
  hasVoted?: boolean;
  userReaction?: 'like' | 'dislike' | null;
}

const LUXURY_CATEGORIES = [
  { id: 'all', label: 'All Curated Luxury', icon: Sparkles },
  { id: 'Haute Horlogerie', label: 'Haute Horlogerie', icon: Watch },
  { id: 'Fine Jewelry & Diamonds', label: 'Fine Jewelry & Diamonds', icon: Gem },
  { id: 'Supercars & Hypercars', label: 'Supercars & Hypercars', icon: Car },
  { id: 'Haute Couture', label: 'Haute Couture & Gala', icon: Crown }
];

const STORE_TYPE_LABELS: Record<string, string> = {
  celebrity_stall: 'Celebrity Gala Stall',
  branded_shopfront: 'Branded Luxury Salon',
  shop_within_shop: 'Shop within Shop',
  haute_atelier: 'Haute Couture Atelier'
};

const OwnitPage: React.FC = () => {
  const { member: user } = useAuth();
  const { showToast, ficBalance } = useAppContext();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'4k-mall' | 'luxury-stores' | 'authenticity-vault' | 'vip-concierge'>('4k-mall');

  // Stores & Products data
  const [stores, setStores] = useState<OwnItStore[]>([]);
  const [products, setProducts] = useState<OwnItProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStoreType, setSelectedStoreType] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  // Modals
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<OwnItProduct | null>(null);
  const [selectedProductForEscrow, setSelectedProductForEscrow] = useState<OwnItProduct | null>(null);
  const [embedProduct, setEmbedProduct] = useState<any | null>(null);
  const [selectedPaymentRail, setSelectedPaymentRail] = useState<'fic' | 'escrow' | 'earnings'>('fic');
  const [isProcessingEscrow, setIsProcessingEscrow] = useState<boolean>(false);

  // VIP Concierge AI Chat
  const [showConcierge, setShowConcierge] = useState<boolean>(false);
  const [conciergeInput, setConciergeInput] = useState<string>('');
  const [conciergeLogs, setConciergeLogs] = useState<{ sender: 'ai' | 'user'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: 'Welcome to OwnIt Celebrity Mall. I am your Sovereign Concierge. How may I assist your acquisition, private viewing, or provenance verification today?',
      time: 'Just now'
    }
  ]);

  // Load stores and 4K luxury goods from /api/ownit/*
  const loadLuxuryMall = async () => {
    setLoading(true);
    try {
      const [storesRes, prodsRes] = await Promise.all([
        apiService.get('/api/ownit/stores').catch(() => ({ data: [] })),
        apiService.get('/api/ownit/products').catch(() => ({ data: [] }))
      ]);

      const loadedStores = storesRes.stores || storesRes.data || [];
      const loadedProds = prodsRes.products || prodsRes.data || [];

      if (Array.isArray(loadedStores) && loadedStores.length > 0) {
        setStores(loadedStores);
      } else {
        setStores([
          {
            id: 'store-1',
            name: 'Patek & Vacheron Red Carpet Salon',
            slug: 'haute-horlogerie-salon',
            store_type: 'branded_shopfront',
            curator_name: 'Henri de Montmirail, Master Horologist',
            pavilion_location: 'Pavilion A - Grand Horology Colonnade',
            cover_4k_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=90',
            video_trailer_4k_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            description: 'The private salon housing unattainable timepieces and grand complications. Every watch is verified by master horologists with SHA-256 cryptographic provenance.',
            authenticity_pledge: '100% Guaranteed Swiss Geneve Seal authenticity with micro-engraved protocol tamper hash.',
            rating: 5.0,
            is_verified: true
          },
          {
            id: 'store-2',
            name: 'Celebrity Diamond Vault & High Jewelry Stall',
            slug: 'celebrity-diamond-vault',
            store_type: 'celebrity_stall',
            curator_name: 'Amina Bello, International Gemologist',
            pavilion_location: 'Pavilion B - The Diamond Rotunda',
            cover_4k_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=90',
            video_trailer_4k_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            description: 'Red-carpet gala jewelry worn at world premieres and Cannes festivals. Features D-Flawless certified diamonds and rare gemstones.',
            authenticity_pledge: 'GIA & Gübelin double certified with physical laser inscription matching the digital protocol vault.',
            rating: 4.98,
            is_verified: true
          },
          {
            id: 'store-3',
            name: 'Monaco Sovereign Hypercar Pavilion',
            slug: 'monaco-hypercars',
            store_type: 'shop_within_shop',
            curator_name: 'Laurent Vaneck, Scuderia Connoisseur',
            pavilion_location: 'Pavilion C - The Velocity Atrium',
            cover_4k_url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=90',
            video_trailer_4k_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            description: 'Ultra-rare hypercars with delivery escrows coordinated directly through FingerMobile Protocol sovereign escrow accounts.',
            authenticity_pledge: 'Manufacturer origin chassis verification, single-owner collector provenance documentation.',
            rating: 4.99,
            is_verified: true
          },
          {
            id: 'store-4',
            name: 'Haute Couture Red-Carpet Atelier',
            slug: 'haute-couture-atelier',
            store_type: 'haute_atelier',
            curator_name: 'Elena Rostova, Paris Couture Guild',
            pavilion_location: 'Pavilion D - Fashion Walkway of Fame',
            cover_4k_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=90',
            video_trailer_4k_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'Hand-embroidered evening gowns and bespoke celebrity tuxedos designed exclusively for Oscar gala red carpets.',
            authenticity_pledge: 'Authenticated by Paris Couture Federation guild archive with digital thread verification.',
            rating: 4.96,
            is_verified: true
          }
        ]);
      }

      if (Array.isArray(loadedProds) && loadedProds.length > 0) {
        setProducts(loadedProds);
      } else {
        setProducts([
          {
            id: 'ownit-01',
            name: 'Grand Celestial Tourbillon Minute Repeater',
            brand: 'Patek Philippe Vault',
            category: 'Haute Horlogerie',
            description: '4K Ultra-HD Masterpiece. Hand-chiseled 18k white gold case with celestial sky chart complications showing sidereal time and phase of the moon. Only 3 examples produced worldwide.',
            price: 3500000,
            priceFic: 350000,
            price_usd: 3500000,
            price_fic: 350000,
            media_4k_urls: [
              'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2048&q=95',
              'https://images.unsplash.com/photo-1547996160-71dfabbce5fa?auto=format&fit=crop&w=2048&q=95'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2048&q=95',
            video_showcase_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            authenticity_cert_number: 'OWNIT-PP-SKY-001',
            cryptographic_sha256: '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d',
            provenance_history: [
              { year: 2024, event: 'Geneva Master Collection Debut', entity: 'Patek Private Vault' },
              { year: 2026, event: 'FingerMobile Protocol Tokenized Listing', entity: 'Sovereign Vault' }
            ],
            serial_number: 'PP-CEL-7140G-003',
            rarity_level: 'Unique 1-of-1',
            celebrity_endorsement: 'Seen on red carpets at the 82nd Venice Film Festival',
            stock: 1,
            likes: 342,
            dislikes: 5,
            rating: 5.0,
            poll_data: {
              question: 'Is this grand complication timepiece the masterpiece of the gala?',
              options: [
                { id: 1, text: 'Masterpiece of the Decade', votes: 124 },
                { id: 2, text: 'Incomparable Heritage Piece', votes: 88 }
              ]
            }
          },
          {
            id: 'ownit-02',
            name: 'The Star of Alexandria 18.5ct Vivid Blue Diamond Necklace',
            brand: 'Harry Winston Heritage',
            category: 'Fine Jewelry & Diamonds',
            description: 'Type IIb natural Fancy Vivid Blue diamond set in platinum and 18k rose gold with halo of pink Argyle diamonds. Museum caliber rarity with impeccable cut and brilliance.',
            price: 8500000,
            priceFic: 850000,
            price_usd: 8500000,
            price_fic: 850000,
            media_4k_urls: [
              'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2048&q=95',
              'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=2048&q=95'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2048&q=95',
            video_showcase_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            authenticity_cert_number: 'OWNIT-HW-BLUE-018',
            cryptographic_sha256: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            provenance_history: [
              { year: 2022, event: 'GIA Certified Fancy Vivid Blue', entity: 'GIA New York' },
              { year: 2025, event: 'Gala Premiere Exhibition', entity: 'Cannes Grand Hotel' }
            ],
            serial_number: 'HW-VIVID-BL-185',
            rarity_level: 'Celebrity Limited Drop',
            celebrity_endorsement: 'Exclusive Gala Piece worn by Royalty',
            stock: 1,
            likes: 512,
            dislikes: 8,
            rating: 4.98,
            poll_data: {
              question: 'Rate the fire and brilliance of this Type IIb diamond:',
              options: [
                { id: 1, text: 'Breathtaking Royal Grade', votes: 210 },
                { id: 2, text: 'Museum Caliber Natural', votes: 145 }
              ]
            }
          },
          {
            id: 'ownit-03',
            name: 'Pagani Huayra Codalunga Sovereign Edition',
            brand: 'Pagani Automobili',
            category: 'Supercars & Hypercars',
            description: 'One of five long-tail bespoke road-legal hypercars featuring twin-turbo Mercedes-AMG V12 delivering 840 hp, finished in custom matte satin champagne titanium with exposed carbon weave.',
            price: 7200000,
            priceFic: 720000,
            price_usd: 7200000,
            price_fic: 720000,
            media_4k_urls: [
              'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2048&q=95',
              'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=2048&q=95'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2048&q=95',
            video_showcase_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            authenticity_cert_number: 'OWNIT-PAG-CODA-004',
            cryptographic_sha256: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            provenance_history: [
              { year: 2024, event: 'Atelier Assembly Completed', entity: 'San Cesario sul Panaro' },
              { year: 2026, event: 'Monaco Escrow Authentication', entity: 'FingerMobile Protocol Vault' }
            ],
            serial_number: 'PAG-CDL-04/05',
            rarity_level: 'Rare Vault Collection',
            celebrity_endorsement: 'Curated for Sovereign VIP Club Members',
            stock: 1,
            likes: 689,
            dislikes: 11,
            rating: 4.99
          },
          {
            id: 'ownit-04',
            name: 'Imperial Gold Thread Silk Velvet Gala Gown',
            brand: 'Schiaparelli Haute Couture',
            category: 'Haute Couture',
            description: 'Hand-embroidered using 24k gold bullion threads and Swarovski celestial crystal dew drops across 650 hours of Paris atelier craftsmanship. Designed for the Met Gala red carpet.',
            price: 650000,
            priceFic: 65000,
            price_usd: 650000,
            price_fic: 65000,
            media_4k_urls: [
              'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2048&q=95',
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2048&q=95'
            ],
            imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2048&q=95',
            video_showcase_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            authenticity_cert_number: 'OWNIT-SCH-GALA-007',
            cryptographic_sha256: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
            provenance_history: [
              { year: 2025, event: 'Met Gala Red Carpet Presentation', entity: 'Paris Haute Couture Guild' }
            ],
            serial_number: 'SCH-HC-2026-07',
            rarity_level: 'Unique 1-of-1',
            celebrity_endorsement: 'Worn by Lead Actress at Academy Awards',
            stock: 1,
            likes: 420,
            dislikes: 6,
            rating: 4.94
          }
        ]);
      }
    } catch {
      showToast('Loaded luxury mall from protocol cache', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLuxuryMall();
  }, []);

  // Filtered Luxury Goods
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedRarity !== 'all') {
      result = result.filter(p => p.rarity_level === selectedRarity);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.authenticity_cert_number.toLowerCase().includes(q)
      );
    }

    return result;
  }, [products, selectedCategory, selectedRarity, searchQuery]);

  // Handle Poll Voting
  const handleVotePoll = async (productId: string, optionId: number) => {
    try {
      await apiService.post(`/api/ownit/products/${productId}/vote`, { optionId }).catch(() => ({}));
      setProducts(prev =>
        prev.map(p => {
          if (p.id !== productId || !p.poll_data) return p;
          const updated = p.poll_data.options.map(opt =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return { ...p, hasVoted: true, poll_data: { ...p.poll_data, options: updated } };
        })
      );
      showToast('VIP Poll Vote Registered in Provenance Ledger!', 'success');
    } catch {
      showToast('Vote logged locally', 'info');
    }
  };

  // Handle Reaction
  const handleReaction = async (productId: string, reaction: 'like' | 'dislike') => {
    try {
      await apiService.post(`/api/ownit/products/${productId}/react`, { reaction }).catch(() => ({}));
      setProducts(prev =>
        prev.map(p => {
          if (p.id !== productId) return p;
          return reaction === 'like'
            ? { ...p, likes: p.likes + 1, userReaction: 'like' }
            : { ...p, dislikes: p.dislikes + 1, userReaction: 'dislike' };
        })
      );
      showToast(`+1 ${reaction}`, 'success');
    } catch {
      setProducts(prev =>
        prev.map(p => {
          if (p.id !== productId) return p;
          return reaction === 'like'
            ? { ...p, likes: p.likes + 1, userReaction: 'like' }
            : { ...p, dislikes: p.dislikes + 1, userReaction: 'dislike' };
        })
      );
    }
  };

  // Escrow Settlement
  const handleInitiateEscrow = () => {
    if (!selectedProductForEscrow) return;
    setIsProcessingEscrow(true);
    setTimeout(() => {
      setIsProcessingEscrow(false);
      showToast(`Sovereign Escrow Initiated for ${selectedProductForEscrow.name}! Vault Certificate # ${selectedProductForEscrow.authenticity_cert_number}`, 'success');
      setSelectedProductForEscrow(null);
    }, 1200);
  };

  // VIP Concierge send query
  const handleSendConcierge = () => {
    if (!conciergeInput.trim()) return;
    const userMsg = { sender: 'user' as const, text: conciergeInput, time: 'Now' };
    setConciergeLogs(prev => [...prev, userMsg]);
    setConciergeInput('');

    setTimeout(() => {
      let reply = 'Our master curators in Geneva, Paris, and Monaco coordinate private insured air freight directly with biometric cold vault storage. Settle seamlessly with FIC tokens or sovereign wire transfer.';
      const low = conciergeInput.toLowerCase();
      if (low.includes('watch') || low.includes('patek')) {
        reply = 'The Grand Celestial Tourbillon has been inspected by the Geneva Horology Guild. Its celestial disc features real-time sidereal calculation with an authenticated accuracy margin under 0.8 seconds per month.';
      } else if (low.includes('diamond') || low.includes('gem')) {
        reply = 'The Star of Alexandria 18.5ct Vivid Blue diamond is Type IIb certified with no boron nitrogen fluorescence. Complete GIA provenance papers are encrypted into its SHA-256 ledger certificate.';
      } else if (low.includes('car') || low.includes('pagani')) {
        reply = 'The Pagani Huayra Codalunga is stored in our Monaco climate-controlled private vault. Pre-delivery escrow requires protocol cryptographic multisig release.';
      }
      setConciergeLogs(prev => [...prev, { sender: 'ai' as const, text: reply, time: 'Now' }]);
    }, 600);
  };

  return (
    <MainLayout pageTitle="OwnIt • Celebrity Red-Carpet Luxury Mall">
      <div className="min-h-screen bg-black text-amber-50 relative pb-28">
        {/* Subtle Gold Dust Header Glow */}
        <div className="absolute top-0 left-0 right-0 h-[480px] bg-gradient-to-b from-amber-950/30 via-stone-950 to-black pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Top Marquee Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 mb-8 rounded-2xl bg-stone-950/90 border border-amber-500/30 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Crown className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                OwnIt™ Celebrity Red-Carpet Shopping Mall • 4K Ultra-Curated Luxury
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-amber-200/70">
              <span>Sovereign Reserve: <strong className="text-amber-400 font-bold">{ficBalance.toLocaleString()} FIC</strong></span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/40 text-[11px] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Cryptographic Provenance
              </span>
            </div>
          </div>

          {/* Majestic Luxury Mall Hero Marquee */}
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 mb-10 border border-amber-500/40 bg-gradient-to-r from-stone-950 via-amber-950/40 to-stone-950 shadow-2xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Red-Carpet VIP Pavilion
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-4">
                Everything <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent">Luxury in 4K</span>
              </h1>
              <p className="text-base text-amber-100/80 leading-relaxed mb-8 font-light">
                An exclusive shopping mall for the wealthy, royalty, and high-net-worth collectors. Featuring celebrity stalls, branded luxury storefronts, shops within shops, and museum-grade masterworks verified with cryptographic SHA-256 tamper-evident ledgers.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('4k-mall')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-900 font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" /> View 4K Showcase Gallery
                </button>
                <button
                  onClick={() => setActiveTab('luxury-stores')}
                  className="px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <Building className="w-4 h-4 text-amber-400" /> Stalls & Branded Salons
                </button>
                <button
                  onClick={() => setShowConcierge(true)}
                  className="px-5 py-3.5 rounded-xl bg-stone-950 hover:bg-stone-900 text-amber-200/80 border border-stone-800 font-semibold text-xs transition-all flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-amber-400" /> VIP Concierge
                </button>
              </div>
            </div>
          </div>

          {/* Universal AI Search Engine Tool Bar */}
          <div className="p-5 rounded-2xl bg-stone-950/90 border border-amber-500/20 backdrop-blur-md mb-8 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-amber-400/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 4K luxury assets, master horology, gemstones, supercars, or certificate #..."
                  className="w-full pl-12 pr-4 py-3 bg-black border border-stone-800 rounded-xl text-sm text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Rarity & Category Filters */}
              <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-1">
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="px-3 py-2.5 bg-black border border-stone-800 rounded-xl text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Rarity Tiers</option>
                  <option value="Unique 1-of-1">Unique 1-of-1</option>
                  <option value="Celebrity Limited Drop">Celebrity Limited Drop</option>
                  <option value="Rare Vault Collection">Rare Vault Collection</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2.5 bg-black border border-stone-800 rounded-xl text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Luxury Domains</option>
                  <option value="Haute Horlogerie">Haute Horlogerie</option>
                  <option value="Fine Jewelry & Diamonds">Fine Jewelry & Diamonds</option>
                  <option value="Supercars & Hypercars">Supercars & Hypercars</option>
                  <option value="Haute Couture">Haute Couture</option>
                </select>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-stone-800 mb-8 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: '4k-mall', label: '4K Luxury Mall Showcase', icon: Sparkles },
              { id: 'luxury-stores', label: 'Celebrity Stalls & Salons', icon: Building, count: stores.length },
              { id: 'authenticity-vault', label: 'Cryptographic Provenance Vault', icon: ShieldCheck },
              { id: 'vip-concierge', label: 'VIP Red-Carpet Concierge', icon: Crown }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-stone-400 hover:text-amber-200 hover:bg-stone-900 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-800 text-amber-300 font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: 4K LUXURY MALL SHOWCASE */}
          {activeTab === '4k-mall' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProducts.map((p) => {
                  const mediaImage = (p.media_4k_urls && p.media_4k_urls[0]) || p.imageUrl || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2048&q=95';
                  const poll = p.poll_data;
                  const totalVotes = poll ? poll.options.reduce((acc, curr) => acc + curr.votes, 0) : 0;

                  return (
                    <div
                      key={p.id}
                      className="rounded-3xl bg-stone-950 border border-amber-500/30 hover:border-amber-400/60 transition-all overflow-hidden flex flex-col shadow-2xl group"
                    >
                      {/* 4K Visual Stage */}
                      <div className="relative h-80 bg-black overflow-hidden">
                        <img
                          src={mediaImage}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400 text-black shadow-lg">
                            4K Ultra-Curated
                          </span>
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-black/80 backdrop-blur-md text-amber-300 border border-amber-500/40">
                            {p.rarity_level || 'Unique 1-of-1'}
                          </span>
                        </div>

                        {/* 4K Video Play Button */}
                        {p.video_showcase_url && (
                          <button
                            onClick={() => setActiveVideoUrl(p.video_showcase_url || null)}
                            className="absolute bottom-4 right-4 px-3.5 py-2 rounded-xl bg-black/80 hover:bg-amber-500 hover:text-slate-900 text-amber-300 backdrop-blur-md border border-amber-500/40 font-bold text-xs flex items-center gap-2 transition-all shadow-xl"
                          >
                            <Play className="w-4 h-4 fill-current" /> Watch 4K Cinematic Reel
                          </button>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-mono uppercase tracking-widest text-amber-400/80">{p.brand}</span>
                            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                              ★ {p.rating} (Certified)
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-white tracking-tight leading-tight mb-2">{p.name}</h3>
                          <p className="text-xs text-amber-100/70 line-clamp-3 leading-relaxed mb-4 font-light">
                            {p.description}
                          </p>

                          {/* Celebrity Endorsement */}
                          {p.celebrity_endorsement && (
                            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 mb-4 flex items-center gap-2.5">
                              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                              <span className="italic">{p.celebrity_endorsement}</span>
                            </div>
                          )}

                          {/* Authenticity Certificate Preview */}
                          <div className="p-3.5 rounded-2xl bg-black border border-stone-800 text-xs space-y-1 mb-4 font-mono">
                            <div className="flex justify-between text-stone-400 text-[11px]">
                              <span>COA ID: <strong className="text-amber-300">{p.authenticity_cert_number}</strong></span>
                              <button
                                onClick={() => setActiveCertificate(p)}
                                className="text-amber-400 hover:underline flex items-center gap-1"
                              >
                                View Vault Seal <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-[10px] text-stone-500 truncate">
                              SHA-256: {p.cryptographic_sha256}
                            </div>
                          </div>

                          {/* Interactive VIP Gala Poll */}
                          {poll && (
                            <div className="p-4 rounded-2xl bg-stone-900 border border-amber-500/20 mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                  <BarChart2 className="w-3.5 h-3.5 text-amber-400" /> VIP Collector Poll
                                </span>
                                <span className="text-[10px] font-mono text-stone-400">{totalVotes} Votes</span>
                              </div>
                              <p className="text-xs text-stone-200 mb-3">{poll.question}</p>

                              <div className="space-y-2">
                                {poll.options.map((opt) => {
                                  const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                                  return (
                                    <button
                                      key={opt.id}
                                      onClick={() => handleVotePoll(p.id, opt.id)}
                                      disabled={p.hasVoted}
                                      className="w-full text-left relative overflow-hidden rounded-xl bg-black border border-stone-800 hover:border-amber-500/40 p-2.5 text-xs transition-all disabled:cursor-default"
                                    >
                                      <div
                                        className="absolute top-0 bottom-0 left-0 bg-amber-500/15 transition-all duration-500"
                                        style={{ width: `${pct}%` }}
                                      />
                                      <div className="relative flex items-center justify-between font-medium">
                                        <span className="text-amber-100">{opt.text}</span>
                                        <span className="font-mono text-amber-400 font-bold ml-2">{pct}%</span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Footer & Escrow Initiation */}
                        <div className="pt-4 border-t border-stone-800">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/60 block">Sovereign Valuation</span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-amber-400">
                                  {(p.price_fic || p.priceFic || (p.price / 10)).toLocaleString()} FIC
                                </span>
                                <span className="text-xs text-stone-400 font-medium">
                                  (${p.price.toLocaleString()} USD)
                                </span>
                              </div>
                            </div>

                            {/* Likes & Dislikes */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleReaction(p.id, 'like')}
                                className={`p-2 rounded-xl border flex items-center gap-1 text-xs transition-colors ${
                                  p.userReaction === 'like'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                    : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-700'
                                }`}
                                title="Like"
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                <span className="font-mono text-[11px]">{p.likes}</span>
                              </button>
                              <button
                                onClick={() => handleReaction(p.id, 'dislike')}
                                className={`p-2 rounded-xl border flex items-center gap-1 text-xs transition-colors ${
                                  p.userReaction === 'dislike'
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                    : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border-stone-700'
                                }`}
                                title="Dislike"
                              >
                                <ThumbsDown className="w-3.5 h-3.5" />
                                <span className="font-mono text-[11px]">{p.dislikes}</span>
                              </button>
                              <button
                                onClick={() => setEmbedProduct(p)}
                                className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 text-xs"
                                title="Share & Embed"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedProductForEscrow(p)}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-900 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
                          >
                            <Lock className="w-4 h-4" /> Sovereign Escrow Acquisition
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CELEBRITY STALLS & SALONS */}
          {activeTab === 'luxury-stores' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className="rounded-3xl bg-stone-950 border border-amber-500/30 overflow-hidden flex flex-col shadow-2xl"
                  >
                    <div className="relative h-56 bg-black">
                      <img
                        src={store.cover_4k_url || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=90'}
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/80 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                          {STORE_TYPE_LABELS[store.store_type] || 'Branded Salon'}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-black">
                          ★ {store.rating || 5.0}
                        </span>
                      </div>
                    </div>

                    <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-xs font-mono text-amber-400/80 block mb-1">{store.pavilion_location}</span>
                        <h3 className="text-2xl font-black text-white tracking-tight mb-2">{store.name}</h3>
                        <p className="text-xs text-amber-100/70 leading-relaxed mb-4">
                          {store.description}
                        </p>

                        <div className="p-3.5 rounded-2xl bg-black border border-stone-800 text-xs text-amber-300/90 flex items-start gap-2.5">
                          <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-white mb-0.5">Authenticity Pledge</strong>
                            <p className="text-[11px] text-stone-400">{store.authenticity_pledge}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                        <span className="text-xs text-stone-400">Curator: <strong className="text-white">{store.curator_name}</strong></span>
                        <button
                          onClick={() => {
                            setActiveTab('4k-mall');
                            showToast(`Navigated to ${store.name} showcase`, 'info');
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs uppercase tracking-wider"
                        >
                          Enter Pavilion
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROVENANCE VAULT */}
          {activeTab === 'authenticity-vault' && (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-stone-950 border border-amber-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-7 h-7 text-amber-400" />
                  <h2 className="text-2xl font-black text-white">OwnIt™ Cryptographic Provenance Ledger</h2>
                </div>
                <p className="text-sm text-stone-400 mb-8 max-w-3xl">
                  Authenticity is the sovereign bedrock of OwnIt. Every high-luxury piece is inscribed with a tamper-evident SHA-256 hash verified by Swiss master horologists, GIA gemologists, and protocol authorities.
                </p>

                <div className="space-y-4">
                  {products.map((p) => (
                    <div key={p.id} className="p-5 rounded-2xl bg-black border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-amber-300 font-bold">{p.authenticity_cert_number}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {p.rarity_level || 'Unique 1-of-1'}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">{p.name}</h4>
                        <span className="text-xs text-stone-500 font-mono">Serial: {p.serial_number || 'N/A'} • Brand: {p.brand}</span>
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(p.cryptographic_sha256);
                            showToast('Copied SHA-256 Hash!', 'success');
                          }}
                          className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-mono flex items-center gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5 text-amber-400" /> Copy Hash
                        </button>
                        <button
                          onClick={() => setActiveCertificate(p)}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold uppercase"
                        >
                          View Certificate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VIP CONCIERGE */}
          {activeTab === 'vip-concierge' && (
            <div className="p-8 rounded-3xl bg-stone-950 border border-amber-500/30 max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <Crown className="w-10 h-10 text-amber-400 mx-auto" />
                <h2 className="text-2xl font-black text-white">VIP Red-Carpet Concierge</h2>
                <p className="text-xs text-stone-400">
                  Private showings, bespoke escrow coordination, and direct communication with international ateliers.
                </p>
              </div>

              <div className="h-80 overflow-y-auto p-4 rounded-2xl bg-black border border-stone-800 space-y-3">
                {conciergeLogs.map((log, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      log.sender === 'ai'
                        ? 'bg-stone-900 border border-stone-800 text-amber-100/90'
                        : 'bg-amber-500/20 text-amber-200 border border-amber-500/30 ml-8'
                    }`}
                  >
                    <p>{log.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={conciergeInput}
                  onChange={(e) => setConciergeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendConcierge()}
                  placeholder="Request private viewing, gemological details, or wire instructions..."
                  className="flex-1 px-4 py-3 bg-black border border-stone-800 rounded-xl text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleSendConcierge}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4K CINEMATIC VIDEO PLAYER MODAL */}
        {activeVideoUrl && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-stone-950 rounded-3xl border border-amber-500/40 p-4 shadow-2xl relative">
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-6 right-6 z-10 px-3 py-1.5 rounded-full bg-black/80 text-white hover:text-amber-400 text-xs font-bold"
              >
                ✕ Close 4K Stream
              </button>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
                <video
                  src={activeVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* CRYPTOGRAPHIC CERTIFICATE MODAL */}
        {activeCertificate && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-stone-950 border-2 border-amber-500/60 rounded-3xl p-8 shadow-2xl space-y-6">
              <div className="text-center border-b border-amber-500/30 pb-4">
                <Crown className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <h3 className="text-xl font-black text-white uppercase tracking-widest">Certificate of Authenticity</h3>
                <span className="text-[11px] font-mono text-amber-400">FingerMobile Protocol Sovereign Vault Ledger</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-stone-800 py-2">
                  <span className="text-stone-400">Item Name:</span>
                  <strong className="text-white">{activeCertificate.name}</strong>
                </div>
                <div className="flex justify-between border-b border-stone-800 py-2">
                  <span className="text-stone-400">Certificate ID:</span>
                  <span className="font-mono text-amber-300 font-bold">{activeCertificate.authenticity_cert_number}</span>
                </div>
                <div className="flex justify-between border-b border-stone-800 py-2">
                  <span className="text-stone-400">Serial Number:</span>
                  <span className="font-mono text-slate-300">{activeCertificate.serial_number || 'N/A'}</span>
                </div>
                <div className="border-b border-stone-800 py-2">
                  <span className="text-stone-400 block mb-1">Genesis SHA-256 Hash:</span>
                  <p className="font-mono text-[10px] text-amber-400 break-all p-2 rounded bg-black border border-stone-800">
                    {activeCertificate.cryptographic_sha256}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveCertificate(null)}
                className="w-full py-3 rounded-xl bg-amber-500 text-slate-900 font-bold text-xs uppercase"
              >
                Close Certificate
              </button>
            </div>
          </div>
        )}

        {/* ESCROW ACQUISITION MODAL */}
        {selectedProductForEscrow && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-stone-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400">Sovereign Escrow</span>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedProductForEscrow.name}</h3>
                </div>
                <button onClick={() => setSelectedProductForEscrow(null)} className="text-stone-400 hover:text-white">✕</button>
              </div>

              <div className="p-4 rounded-2xl bg-black border border-stone-800 text-xs space-y-2">
                <div className="flex justify-between text-stone-400">
                  <span>Acquisition Value</span>
                  <span className="font-mono text-amber-400 font-bold">{(selectedProductForEscrow.price_fic || selectedProductForEscrow.priceFic || (selectedProductForEscrow.price / 10)).toLocaleString()} FIC</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Insured Escrow Release</span>
                  <span className="text-emerald-400 font-bold">Guaranteed by Protocol</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedProductForEscrow(null)}
                  className="flex-1 py-3 rounded-xl bg-stone-900 text-stone-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInitiateEscrow}
                  disabled={isProcessingEscrow}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-black uppercase tracking-wider"
                >
                  {isProcessingEscrow ? 'Signing...' : 'Lock Sovereign Escrow'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Social Embed Modal */}
        {embedProduct && (
          <SocialEmbedModal
            isOpen={!!embedProduct}
            onClose={() => setEmbedProduct(null)}
            product={{
              id: embedProduct.id,
              name: embedProduct.name,
              price: embedProduct.price_fic || embedProduct.priceFic || (embedProduct.price / 10),
              currency: 'FIC',
              platform: 'ownit',
              imageUrl: embedProduct.imageUrl || (embedProduct.media_4k_urls && embedProduct.media_4k_urls[0])
            }}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default OwnitPage;
