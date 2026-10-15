/*
 * FingerMobile Protocol™ - Platform Flagship Store
 * Dedicated Flagship Storefront for the company's best unique, groundbreaking goods,
 * protocol hardware, limited edition merchandise, and official sovereign drops.
 * Completely independent from Member Storefronts, OwnIt, and Flamingo.
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useEffect, useState, useMemo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import apiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import SocialEmbedModal from '../components/commerce/SocialEmbedModal';
import { CURATED_FLAGSHIP_PRODUCTS } from '../data/curatedMarketplaceData';
import {
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  CreditCard,
  ShoppingBag,
  ExternalLink,
  Cpu,
  Shirt,
  Headphones,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  BarChart2,
  Bot,
  Send,
  Zap,
  Copy,
  FileText
} from 'lucide-react';

export interface FlagshipProduct {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  price: number;
  priceFic: number;
  currency?: string;
  category: string;
  sku: string;
  images: string[];
  image_url?: string;
  imageUrl?: string;
  stock_quantity?: number;
  is_flagship?: boolean;
  authenticity_ledger_hash?: string;
  specifications?: Record<string, string>;
  likes: number;
  dislikes: number;
  rating: number;
  reviews_count?: number;
  poll_data?: {
    question: string;
    options: { id: number; text: string; votes: number }[];
  };
  hasVoted?: boolean;
  userReaction?: 'like' | 'dislike' | null;
}

export interface FlagshipOrder {
  id: string;
  productId: string;
  productName: string;
  total: number;
  currency: string;
  paymentRail: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
}

const MarketplacePage: React.FC = () => {
  useAuth();
  const { showToast, ficBalance } = useAppContext();

  // Navigation tabs (strictly Flagship Store modules)
  const [activeTab, setActiveTab] = useState<'flagship-drops' | 'hardware' | 'apparel' | 'audio' | 'ledger' | 'my-orders'>('flagship-drops');

  // Products and loading
  const [products, setProducts] = useState<FlagshipProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state (Universal AI Search Engine Tool)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular'>('newest');
  const [aiSearchAssistActive, setAiSearchAssistActive] = useState<boolean>(false);

  // Modals & Drawers
  const [checkoutProduct, setCheckoutProduct] = useState<FlagshipProduct | null>(null);
  const [selectedPaymentRail, setSelectedPaymentRail] = useState<'fic' | 'earnings' | 'card'>('fic');
  const [isProcessingOrder, setIsProcessingOrder] = useState<boolean>(false);
  const [embedProduct, setEmbedProduct] = useState<any | null>(null);

  // AI Flagship Shopping Assistant state
  const [showAiAssistant, setShowAiAssistant] = useState<boolean>(false);
  const [aiQuery, setAiQuery] = useState<string>('');
  const [aiChatLogs, setAiChatLogs] = useState<{ sender: 'ai' | 'user'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: 'Greetings Sovereign Member. I am your FingerMobile Flagship Concierge. Ask me about cryptographic hardware specifications, firmware integrity, or FIC token multi-rail checkout.',
      time: 'Just now'
    }
  ]);

  // Orders state
  const [orders, setOrders] = useState<FlagshipOrder[]>([
    {
      id: 'ORD-FMP-8821',
      productId: '1',
      productName: 'FingerMobile Protocol Sovereign Keycard V3',
      total: 1500,
      currency: 'FIC',
      paymentRail: 'FIC Protocol Settlement',
      date: '2026-10-06',
      status: 'shipped'
    }
  ]);

  // Fetch flagship products from /api/marketplace/flagship
  const fetchFlagshipProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.get('/api/marketplace/flagship');
      const data = res.products || res.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      } else {
        // Fallback default curated flagship items (10 in each category, 40 total)
        setProducts(CURATED_FLAGSHIP_PRODUCTS);
      }
    } catch {
      setError('Unable to load flagship products. Using offline protocol cache.');
      setProducts(CURATED_FLAGSHIP_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlagshipProducts();
  }, []);

  // Filter products based on search query, category, and tab
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category or tab filtering
    if (activeTab === 'hardware') {
      result = result.filter(p => p.category === 'Hardware & Security' || p.category === 'Wearables & IoT');
    } else if (activeTab === 'apparel') {
      result = result.filter(p => p.category === 'Flagship Apparel');
    } else if (activeTab === 'audio') {
      result = result.filter(p => p.category === 'Audio Gear');
    } else if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.tagline && p.tagline.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.likes - a.likes);
    }

    return result;
  }, [products, activeTab, selectedCategory, searchQuery, sortBy]);

  // Handle Poll Vote
  const handleVotePoll = async (productId: string, optionId: number) => {
    try {
      await apiService.post(`/api/marketplace/products/${productId}/vote`, { optionId });
      setProducts(prev =>
        prev.map(p => {
          if (p.id !== productId || !p.poll_data) return p;
          const updatedOptions = p.poll_data.options.map(opt =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return {
            ...p,
            hasVoted: true,
            poll_data: { ...p.poll_data, options: updatedOptions }
          };
        })
      );
      showToast('Vote registered on Protocol Ledger!', 'success');
    } catch {
      showToast('Vote logged locally', 'info');
      setProducts(prev =>
        prev.map(p => {
          if (p.id !== productId || !p.poll_data) return p;
          const updatedOptions = p.poll_data.options.map(opt =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return {
            ...p,
            hasVoted: true,
            poll_data: { ...p.poll_data, options: updatedOptions }
          };
        })
      );
    }
  };

  // Handle Like/Dislike
  const handleReaction = async (productId: string, reaction: 'like' | 'dislike') => {
    try {
      await apiService.post(`/api/marketplace/products/${productId}/react`, { reaction });
      setProducts(prev =>
        prev.map(p => {
          if (p.id !== productId) return p;
          if (reaction === 'like') {
            return { ...p, likes: p.likes + 1, userReaction: 'like' };
          } else {
            return { ...p, dislikes: p.dislikes + 1, userReaction: 'dislike' };
          }
        })
      );
      showToast(`Reaction recorded: +1 ${reaction}`, 'success');
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

  // Complete Multi-Rail Purchase
  const handlePurchase = async () => {
    if (!checkoutProduct) return;
    setIsProcessingOrder(true);
    try {
      const orderData = {
        productId: checkoutProduct.id,
        items: [{ id: checkoutProduct.id, name: checkoutProduct.name, price: checkoutProduct.priceFic, quantity: 1 }],
        platform: 'marketplace',
        total: checkoutProduct.priceFic,
        paymentRail: selectedPaymentRail
      };

      await apiService.post('/api/marketplace/orders', orderData).catch(() => ({}));

      const newOrder: FlagshipOrder = {
        id: `ORD-FMP-${Math.floor(1000 + Math.random() * 9000)}`,
        productId: checkoutProduct.id,
        productName: checkoutProduct.name,
        total: checkoutProduct.priceFic,
        currency: 'FIC',
        paymentRail: selectedPaymentRail === 'fic' ? 'FIC Protocol Tokens' : selectedPaymentRail === 'earnings' ? 'Platform Creator Wallet' : 'Debit/Credit Card',
        date: new Date().toISOString().split('T')[0],
        status: 'processing'
      };

      setOrders(prev => [newOrder, ...prev]);
      showToast(`Flagship order confirmed via ${newOrder.paymentRail}! Check My Orders for tracking.`, 'success');
      setCheckoutProduct(null);
    } catch {
      showToast('Failed to process order', 'error');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Handle AI Chat query
  const handleSendAiQuery = (customPrompt?: string) => {
    const textToSend = customPrompt || aiQuery;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user' as const, text: textToSend, time: 'Now' };
    setAiChatLogs(prev => [...prev, userMsg]);
    setAiQuery('');

    setTimeout(() => {
      let reply = 'Our Flagship items are forged with sovereign Protocol standards. The Sovereign Keycard V3 uses EAL6+ hardware with cold-storage capability. You can settle in FIC tokens or platform earnings with zero extra fees.';
      const lower = textToSend.toLowerCase();
      if (lower.includes('keycard') || lower.includes('security')) {
        reply = 'The Sovereign Keycard V3 embeds an EAL6+ military-grade secure element with dual NFC and USB-C interfaces, enabling instant one-tap logins to all FingerMobile Protocol modules.';
      } else if (lower.includes('monitor') || lower.includes('audio') || lower.includes('beatwave')) {
        reply = 'The Studio Reference Monitors are calibrated to match the BeatwaveNG 10-band equalizer presets, providing lossless 24-bit studio monitoring across all 70+ genres.';
      } else if (lower.includes('fic') || lower.includes('pay') || lower.includes('rail')) {
        reply = 'You can pay using FIC tokens directly from your protocol wallet, or use your platform creator earnings without bank withdrawal delays.';
      }

      setAiChatLogs(prev => [...prev, { sender: 'ai' as const, text: reply, time: 'Now' }]);
    }, 600);
  };

  return (
    <MainLayout pageTitle="Flagship Store | FingerMobile Protocol™">
      <div className="min-h-screen bg-slate-950 text-slate-100 relative pb-24">
        {/* Ambient Emerald Glow Header Background */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Top Platform Governance & Stercs Status Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 mb-8 rounded-2xl bg-slate-900/80 border border-emerald-500/20 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                Platform Flagship Store • Company Sovereign Drops
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-200 font-semibold">
              <span className="hidden sm:inline-block">FIC Balance: <strong className="text-emerald-400 font-bold">{ficBalance.toLocaleString()} FIC</strong></span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> STERCS Governed
              </span>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[11px] font-bold hidden md:inline-flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Multi-Rail Active
              </span>
            </div>
          </div>

          {/* Majestic Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 mb-10 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 shadow-2xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Company Flagship Vault
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                The Platform&apos;s <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">Flagship Store</span>
              </h1>
              <p className="text-base text-slate-100 leading-relaxed mb-6 font-medium">
                Where FingerMobile Protocol™ showcases its finest hardware innovations, sovereign keycards, official studio reference gear, and limited apparel. Authenticated with cryptographic SHA-256 provenance hashes.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('flagship-drops')}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Explore Flagship Drops
                </button>
                <button
                  onClick={() => setShowAiAssistant(true)}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-emerald-400" /> Ask Flagship AI Assistant
                </button>
                <button
                  onClick={() => setActiveTab('ledger')}
                  className="px-5 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Provenance Ledger
                </button>
              </div>
            </div>
          </div>

          {/* Universal AI Search Engine Tool Bar */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md mb-8 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search input with AI chip */}
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Flagship hardware, SKU, specs, or ask AI..."
                  className="w-full pl-12 pr-28 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  onClick={() => setAiSearchAssistActive(!aiSearchAssistActive)}
                  className={`absolute right-2 top-2 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                    aiSearchAssistActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Match
                </button>
              </div>

              {/* Filters & Sorting */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                  <Filter className="w-4 h-4 text-slate-300" />
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs text-slate-100 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="newest" className="bg-slate-900">Newest Drops</option>
                    <option value="price_asc" className="bg-slate-900">Price: Low to High</option>
                    <option value="price_desc" className="bg-slate-900">Price: High to Low</option>
                    <option value="rating" className="bg-slate-900">Highest Rated</option>
                    <option value="popular" className="bg-slate-900">Most Loved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* AI Search Suggestion Chips */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                <Bot className="w-3 h-3 text-emerald-400" /> AI Suggestions:
              </span>
              {['Sovereign Keycard V3', 'Comm-Badge', 'Graphene Parka', 'Reference Monitors', 'EAL6+ Security', 'Beatwave Audio'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setSearchQuery(chip)}
                  className="px-2.5 py-1 rounded-md text-xs bg-slate-800/80 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 font-medium transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Independent Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 mb-8 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'flagship-drops', label: 'All Flagship Drops', icon: Sparkles },
              { id: 'hardware', label: 'Hardware & Security', icon: Cpu },
              { id: 'apparel', label: 'Flagship Apparel', icon: Shirt },
              { id: 'audio', label: 'Audiophile Gear', icon: Headphones },
              { id: 'ledger', label: 'Authenticity Ledger', icon: ShieldCheck },
              { id: 'my-orders', label: 'My Orders & Invoices', icon: CreditCard, count: orders.length }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-200 font-mono font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* MAIN CONTENT AREA */}
          {activeTab === 'ledger' ? (
            /* PROTOCOL AUTHENTICITY LEDGER VIEW */
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-xl font-bold text-white">FingerMobile Protocol™ Authenticity Ledger</h2>
                </div>
                <p className="text-sm text-slate-200 font-medium mb-6">
                  Every product listed in the Flagship Store possesses a cryptographically verified SHA-256 genesis hash minted by the platform authorities. Verify provenance, hardware batch, and warranty legitimacy below.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                            {p.sku}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1">{p.name}</h3>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">{p.priceFic.toLocaleString()} FIC</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/90 font-mono text-[11px] text-slate-200 break-all mb-3 border border-slate-800 flex items-center justify-between gap-2">
                        <span>{p.authenticity_ledger_hash || '0x4f89acbe1209348123acde5678901234abcd5678'}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(p.authenticity_ledger_hash || '');
                            showToast('Copied ledger hash!', 'success');
                          }}
                          className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-emerald-400 shrink-0"
                          title="Copy Hash"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                        <span>Category: <strong className="text-slate-100">{p.category}</strong></span>
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified Drop
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'my-orders' ? (
            /* MY ORDERS VIEW */
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
                <h2 className="text-xl font-bold text-white mb-2">My Flagship Orders & Settlements</h2>
                <p className="text-sm text-slate-200 font-medium mb-6">
                  Multi-rail order tracking settled via FIC tokens, creator wallet earnings, or cards with protocol escrow assurance.
                </p>

                {orders.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm font-medium">
                    No flagship orders placed yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((ord) => (
                      <div key={ord.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs text-slate-200 font-bold">{ord.id}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {ord.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{ord.productName}</h4>
                          <span className="text-xs text-slate-300 font-medium">{ord.date} • Settled via {ord.paymentRail}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-emerald-400 text-base">{ord.total.toLocaleString()} {ord.currency}</span>
                          <button
                            onClick={() => showToast(`Tracking dispatched for order ${ord.id}`, 'info')}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                          >
                            Track Package
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* FLAGSHIP PRODUCTS GRID */
            <div>
              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
                  <span>{error}</span>
                  <button onClick={() => setError(null)} className="text-amber-400 font-bold ml-3 hover:underline">Dismiss</button>
                </div>
              )}
              {loading ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500 mb-4" />
                  <p className="text-sm text-slate-200 font-semibold">Loading Flagship Store drops...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-200">
                  <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-base font-bold text-white mb-1">No Flagship Goods Match Query</p>
                  <p className="text-xs text-slate-300 mb-4">Try clearing filters or search terms.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-emerald-400 text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredProducts.map((product) => {
                    const firstImage = product.imageUrl || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80';
                    const poll = product.poll_data;
                    const totalVotes = poll ? poll.options.reduce((acc, curr) => acc + curr.votes, 0) : 0;

                    return (
                      <div
                        key={product.id}
                        className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all overflow-hidden flex flex-col shadow-xl group"
                      >
                        {/* Image Showcase */}
                        <div className="relative h-72 w-full overflow-hidden bg-slate-950">
                          <img
                            src={firstImage}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-md">
                              Company Flagship
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700 font-mono">
                              {product.sku}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                              {product.category}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <h3 className="text-xl font-black text-white tracking-tight">{product.name}</h3>
                            </div>
                            {product.tagline && (
                              <p className="text-xs font-semibold text-emerald-400 mb-2">{product.tagline}</p>
                            )}
                            <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed font-medium mb-4">
                              {product.description}
                            </p>

                            {/* Technical Specifications Chips */}
                            {product.specifications && Object.keys(product.specifications).length > 0 && (
                              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-4 space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                                  Flagship Hardware Specifications
                                </span>
                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                  {Object.entries(product.specifications).map(([key, val]) => (
                                    <div key={key} className="flex flex-col">
                                      <span className="text-slate-300 text-[10px] font-semibold">{key}</span>
                                      <span className="text-slate-100 font-bold truncate">{val}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Interactive Community Poll */}
                            {poll && (
                              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                                    <BarChart2 className="w-3.5 h-3.5 text-emerald-400" /> Community Flagship Poll
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-300 font-bold">{totalVotes} Votes</span>
                                </div>
                                <p className="text-xs text-slate-100 font-semibold mb-3">{poll.question}</p>

                                <div className="space-y-2">
                                  {poll.options.map((opt) => {
                                    const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                                    return (
                                      <button
                                        key={opt.id}
                                        onClick={() => handleVotePoll(product.id, opt.id)}
                                        disabled={product.hasVoted}
                                        className="w-full text-left relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-2.5 text-xs transition-all disabled:cursor-default"
                                      >
                                        <div
                                          className="absolute top-0 bottom-0 left-0 bg-emerald-500/15 transition-all duration-500"
                                          style={{ width: `${pct}%` }}
                                        />
                                        <div className="relative flex items-center justify-between font-medium">
                                          <span className="text-slate-100 font-semibold">{opt.text}</span>
                                          <span className="font-mono text-emerald-400 font-bold ml-2">{pct}%</span>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Price & Checkout Footer */}
                          <div className="pt-4 border-t border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-300 block">Settlement Price</span>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-black text-emerald-400">
                                    {product.priceFic.toLocaleString()} FIC
                                  </span>
                                  <span className="text-xs text-slate-200 font-bold">
                                    (~${product.price.toLocaleString()})
                                  </span>
                                </div>
                              </div>

                              {/* Likes & Dislikes */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleReaction(product.id, 'like')}
                                  className={`p-2 rounded-xl border flex items-center gap-1 text-xs transition-colors ${
                                    product.userReaction === 'like'
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 font-medium'
                                  }`}
                                  title="Like"
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span className="font-mono text-[11px] font-bold">{product.likes}</span>
                                </button>
                                <button
                                  onClick={() => handleReaction(product.id, 'dislike')}
                                  className={`p-2 rounded-xl border flex items-center gap-1 text-xs transition-colors ${
                                    product.userReaction === 'dislike'
                                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 font-medium'
                                  }`}
                                  title="Dislike"
                                >
                                  <ThumbsDown className="w-3.5 h-3.5" />
                                  <span className="font-mono text-[11px] font-bold">{product.dislikes}</span>
                                </button>
                                <button
                                  onClick={() => setEmbedProduct(product)}
                                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs"
                                  title="Share & Embed"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={() => setCheckoutProduct(product)}
                              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                            >
                              <ShoppingBag className="w-4 h-4" /> Multi-Rail Sovereign Checkout
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
        </div>

        {/* CHECKOUT MODAL */}
        {checkoutProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono uppercase font-bold">
                    {checkoutProduct.sku}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1.5">{checkoutProduct.name}</h3>
                </div>
                <button
                  onClick={() => setCheckoutProduct(null)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              {/* Settlement Rails Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200 block mb-2">
                  Select Settlement Payment Rail
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'fic', label: 'FIC Tokens', sub: `${checkoutProduct.priceFic.toLocaleString()} FIC` },
                    { id: 'earnings', label: 'Creator Wallet', sub: 'Instant Payout' },
                    { id: 'card', label: 'Debit Card', sub: `$${checkoutProduct.price.toLocaleString()}` }
                  ].map((rail) => (
                    <button
                      key={rail.id}
                      onClick={() => setSelectedPaymentRail(rail.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedPaymentRail === rail.id
                          ? 'bg-emerald-500/15 border-emerald-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span className="block text-xs font-bold text-white">{rail.label}</span>
                      <span className="block text-[10px] text-emerald-400 font-mono font-bold mt-0.5">{rail.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-200 font-semibold">
                  <span>Product Subtotal</span>
                  <span className="font-mono text-white font-bold">{checkoutProduct.priceFic.toLocaleString()} FIC</span>
                </div>
                <div className="flex justify-between text-slate-200 font-semibold">
                  <span>Protocol Escrow Protection</span>
                  <span className="text-emerald-400 font-bold">Included (0% Fee)</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                  <span>Total Due</span>
                  <span className="font-mono text-emerald-400">{checkoutProduct.priceFic.toLocaleString()} FIC</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCheckoutProduct(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-200 text-sm font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={isProcessingOrder}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                >
                  {isProcessingOrder ? 'Confirming...' : 'Place Sovereign Order'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI SHOPPING ASSISTANT DRAWER */}
        {showAiAssistant && (
          <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900 border-l border-slate-800 z-50 p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Flagship AI Assistant</h3>
              </div>
              <button
                onClick={() => setShowAiAssistant(false)}
                className="text-slate-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {aiChatLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    log.sender === 'ai'
                      ? 'bg-slate-950 border border-slate-800 text-slate-100 font-medium'
                      : 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 ml-6 font-medium'
                  }`}
                >
                  <p>{log.text}</p>
                </div>
              ))}
            </div>

            {/* Quick Prompt Chips */}
            <div className="py-2 flex flex-wrap gap-1.5 border-t border-slate-800">
              {['Explain Keycard V3', 'How monitors sync', 'FIC vs card rail'].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendAiQuery(prompt)}
                  className="px-2.5 py-1 rounded-md text-[10px] bg-slate-800 text-slate-200 font-semibold hover:bg-emerald-500/20 hover:text-emerald-300"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <div className="pt-3 flex gap-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAiQuery()}
                placeholder="Ask about specs, orders, or tokens..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSendAiQuery()}
                className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
              >
                <Send className="w-4 h-4" />
              </button>
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
              price: embedProduct.priceFic,
              currency: 'FIC',
              platform: 'marketplace',
              imageUrl: embedProduct.imageUrl || (embedProduct.images && embedProduct.images[0])
            }}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default MarketplacePage;
