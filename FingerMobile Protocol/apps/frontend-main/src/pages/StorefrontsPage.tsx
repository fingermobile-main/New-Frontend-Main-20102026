import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import {
  Store,
  Star,
  Gift,
  Link as LinkIcon,
  ArrowRight,
  Percent,
  PlusCircle,
  Search,
  CheckCircle2,
  Sparkles,
  DollarSign,
  TrendingUp,
  Zap,
  ShoppingBag,
  Clock
} from 'lucide-react';
import apiService from '../services/apiService';
import { CURATED_STOREFRONTS } from '../data/curatedStorefrontData';

interface StorefrontItem {
  id: string | number;
  slug?: string;
  name: string;
  owner: string;
  avatar: string;
  coverImage: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  products: number;
  followers: number;
  tier: 'free' | 'growth' | 'pro' | 'enterprise';
  feeBps: number;
  isVerified: boolean;
}

const TIER_RATES = [
  {
    tier: 'free',
    name: 'Free Merchant',
    fee: '5.0%',
    feeBps: 500,
    holdDays: 14,
    description: 'Perfect for casual sellers and starter hobbyists with zero upfront monthly commitments.',
    features: ['Basic Storefront URL', 'Standard Settlement (14-day hold)', 'Community Directory Listing', 'Standard Analytics']
  },
  {
    tier: 'growth',
    name: 'Growth Merchant',
    fee: '3.5%',
    feeBps: 350,
    holdDays: 10,
    description: 'For rising independent creators and boutiques looking to scale their product turnover.',
    features: ['Custom Brand Banner', 'Accelerated Settlement (10-day hold)', 'Priority Search Ranking', 'Paylink QR Generator']
  },
  {
    tier: 'pro',
    name: 'Professional Merchant',
    fee: '2.0%',
    feeBps: 200,
    holdDays: 7,
    description: 'For established brands, studios, and merchandisers wanting high margin preservation.',
    features: ['Verified Gold Merchant Badge', 'Fast Settlement (7-day hold)', 'Wholesale & Discount Codes', 'Dancia-4Tv Livestream Integration']
  },
  {
    tier: 'enterprise',
    name: 'Enterprise / Sovereign',
    fee: '0.75%',
    feeBps: 75,
    holdDays: 3,
    description: 'High-volume international merchants, labels, and sovereign franchise operators.',
    features: ['Platinum Sovereign Badge', 'Ultra-Fast 3-Day Escrow Release', 'Dedicated Account Executive', 'Custom Domain Routing & API']
  }
];

const StorefrontsPage: React.FC = () => {
  const navigate = useNavigate();
  const { ficBalance, showToast } = useAppContext();

  const [activeTab, setActiveTab] = useState<'discover' | 'calculator' | 'register'>('discover');
  const [storefronts, setStorefronts] = useState<StorefrontItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<StorefrontItem | null>(null);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftAmount, setGiftAmount] = useState('15');

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');
  const [sortBy, setSortBy] = useState('popular');

  // Calculator State
  const [monthlyVolume, setMonthlyVolume] = useState<number>(500000); // ₦500,000 or ~5,000 FIC

  // Registration Form State
  const [storeName, setStoreName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [storeCategory, setStoreCategory] = useState('Music & Audio');
  const [storeBusinessType, setStoreBusinessType] = useState('brand');
  const [storeTagline, setStoreTagline] = useState('');
  const [storeTier, setStoreTier] = useState<'free' | 'growth' | 'pro' | 'enterprise'>('pro');
  const [isRegistering, setIsRegistering] = useState(false);

  const fetchStorefronts = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await apiService.get('/api/storefront');
      const rawStores = res?.storefronts || res?.data || [];

      const formatted: StorefrontItem[] = rawStores.map((s: any, idx: number) => ({
        id: s.id || idx + 1,
        slug: s.slug || `store-${idx + 1}`,
        name: s.name || 'Storefront',
        owner: s.owner?.name || s.owner_name || 'Creator',
        avatar: s.owner?.avatarUrl || s.logo_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
        coverImage: s.coverImageUrl || s.cover_image_url || s.banner_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
        category: s.business_type === 'brand' ? 'Digital Art' : (s.category || 'Music & Audio'),
        description: s.description || s.tagline || 'Creator storefront offering master audio stems, 4K video drops, and licensed merchandise.',
        rating: 4.8 + ((idx % 3) * 0.1),
        reviews: 24 + (idx * 17),
        products: 8 + (idx * 4),
        followers: 1200 + (idx * 450),
        tier: (['pro', 'growth', 'enterprise', 'free'][idx % 4] as any) || 'pro',
        feeBps: [200, 350, 75, 500][idx % 4] || 200,
        isVerified: true
      }));

      // Merge with curated rich defaults if needed
      const merged = formatted.length >= 6 ? formatted : [...formatted, ...CURATED_STOREFRONTS.filter(c => !formatted.some(f => f.name === c.name))];
      setStorefronts(merged);
    } catch {
      setStorefronts(CURATED_STOREFRONTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStorefronts();
  }, [fetchStorefronts]);

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    storefronts.forEach(s => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [storefronts]);

  const filteredStorefronts = useMemo(() => {
    return storefronts
      .filter((store) => {
        const matchesCategory = selectedCategory === 'All' || store.category === selectedCategory;
        const matchesTier = selectedTier === 'All' || store.tier === selectedTier.toLowerCase();
        const matchesSearch =
          store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesTier && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'highest-rated') return b.rating - a.rating;
        if (sortBy === 'products') return b.products - a.products;
        return b.followers - a.followers;
      });
  }, [storefronts, selectedCategory, selectedTier, searchQuery, sortBy]);

  const handleSendGift = async () => {
    if (!selectedStore) return;
    const amountNum = parseFloat(giftAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Please enter a valid gift amount', 'error');
      return;
    }

    try {
      await apiService.post('/api/wallet/transfer', {
        amount: amountNum,
        recipientId: String(selectedStore.id),
        note: `Direct tip to ${selectedStore.name}`
      });
      showToast(`Transferred ${amountNum} FIC gift to ${selectedStore.name}!`, 'success');
      setShowGiftModal(false);
    } catch {
      showToast(`Unable to transfer the gift to ${selectedStore.name}. Please try again.`, 'error');
    }
  };

  const handleCopyPaylink = async (store: StorefrontItem) => {
    const url = `https://fingermobileprotocol.com/storefront/${store.slug || store.id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast(`Direct paylink copied for ${store.name}!`, 'success');
    } catch {
      showToast(`Direct paylink: ${url}`, 'info');
    }
  };

  const handleCreateStorefront = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !storeSlug) {
      showToast('Please enter a storefront name and URL slug', 'error');
      return;
    }
    setIsRegistering(true);
    try {
      await apiService.post('/api/storefront', {
        name: storeName,
        slug: storeSlug,
        business_type: storeBusinessType,
        category: storeCategory,
        tagline: storeTagline,
        subscription_tier: storeTier,
        currency: 'FIC'
      });
      showToast(`Storefront "${storeName}" launched successfully on ${storeTier.toUpperCase()} tier!`, 'success');
      setActiveTab('discover');
      setStoreName('');
      setStoreSlug('');
      setStoreTagline('');
      fetchStorefronts();
    } catch {
      showToast(`Unable to create storefront "${storeName}". Please try again.`, 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <MainLayout pageTitle="Creator Storefronts & Merchant Gateway">
      <div className="min-h-screen bg-[#F5F9F6] text-slate-900 py-6 sm:py-8 px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
        <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6 sm:space-y-8">
          {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/40 shadow-sm text-amber-600 flex-shrink-0">
                <Store className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                    Creator Storefronts & Merchant Gateway
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-400">
                    Verified Sovereign Rails
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-3xl font-medium leading-relaxed">
                  Decentralized digital commerce engine for artists, brands, and audio producers. Sell stems, apparel, digital tickets, and physical merchandise with instant FIC token settlement and low commission rails.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm border border-amber-400/60 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                Launch Storefront
              </button>
            </div>
          </div>

          {/* Metric KPI Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm">
              <div className="flex items-center justify-between text-slate-700 mb-1">
                <span className="text-xs font-bold">Active Stores</span>
                <ShoppingBag className="w-4 h-4 text-slate-600" />
              </div>
              <p className="text-xl font-mono font-black text-slate-900">{storefronts.length} Verified</p>
              <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">● 100% On-Chain Escrow</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm">
              <div className="flex items-center justify-between text-slate-700 mb-1">
                <span className="text-xs font-bold">Settlement Speed</span>
                <Clock className="w-4 h-4 text-slate-600" />
              </div>
              <p className="text-xl font-mono font-black text-slate-900">3 - 7 Days</p>
              <p className="text-[11px] text-slate-700 font-medium mt-0.5">Automated release via smart contracts</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm">
              <div className="flex items-center justify-between text-slate-700 mb-1">
                <span className="text-xs font-bold">Commission Floor</span>
                <TrendingUp className="w-4 h-4 text-slate-600" />
              </div>
              <p className="text-xl font-mono font-black text-emerald-800">0.75% Enterprise</p>
              <p className="text-[11px] text-slate-700 font-medium mt-0.5">Save up to 85% vs traditional carts</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm">
              <div className="flex items-center justify-between text-slate-700 mb-1">
                <span className="text-xs font-bold">Your Wallet Balance</span>
                <Zap className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-xl font-mono font-black text-slate-900">{ficBalance.toLocaleString()} FIC</p>
              <p className="text-[11px] text-slate-700 font-medium mt-0.5">Available for instant P2P checkout</p>
            </div>
          </div>

          {/* Navigation Mode Tabs */}
          <div className="flex items-center gap-3 border-b border-slate-300 pb-3 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('discover')}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm shrink-0 ${
                activeTab === 'discover'
                  ? 'bg-slate-900 text-white border border-slate-900'
                  : 'bg-white text-slate-800 hover:text-slate-900 border border-slate-300'
              }`}
            >
              <Store className="w-4 h-4" />
              Discover Storefronts ({storefronts.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm shrink-0 ${
                activeTab === 'calculator'
                  ? 'bg-slate-900 text-white border border-slate-900'
                  : 'bg-white text-slate-800 hover:text-slate-900 border border-slate-300'
              }`}
            >
              <Percent className="w-4 h-4" />
              Commission Economics & Calculator
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm shrink-0 ${
                activeTab === 'register'
                  ? 'bg-slate-900 text-white border border-slate-900'
                  : 'bg-white text-slate-800 hover:text-slate-900 border border-slate-300'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Open a Storefront
            </button>
          </div>

          {/* TAB 1: DISCOVER */}
          {activeTab === 'discover' && (
            <div className="space-y-6">
              {/* Filter & Search Bar */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  {/* Category Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                          selectedCategory === cat
                            ? 'bg-slate-900 text-white border border-slate-900'
                            : 'bg-slate-100 text-slate-800 hover:text-slate-900 border border-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Tier Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Tier:</span>
                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      {['All', 'Enterprise', 'Pro', 'Growth', 'Free'].map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setSelectedTier(tier)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                            selectedTier === tier
                              ? 'bg-amber-400 text-slate-950 font-black border border-amber-500'
                              : 'bg-slate-100 text-slate-700 border border-slate-300 hover:text-slate-900'
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-200">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="storefront-search-input"
                      type="text"
                      placeholder="Search store name, creator, product catalog..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full min-h-[44px] pl-9 pr-4 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:border-amber-400 border focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-bold text-slate-700">Sort by:</span>
                    <select
                      id="storefront-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="min-h-[44px] px-3 py-2 bg-white border-2 border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-amber-400 border focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="popular">Most Followers</option>
                      <option value="highest-rated">Highest Rated</option>
                      <option value="products">Most Products</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Storefronts Grid */}
              {loading ? (
                <div className="py-20 text-center text-slate-700 font-bold bg-white rounded-2xl border border-slate-300">
                  Loading verified sovereign storefronts...
                </div>
              ) : filteredStorefronts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStorefronts.map((store) => (
                    <div
                      key={store.id}
                      className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-400 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Cover Banner */}
                        <div className="h-44 bg-slate-900 relative overflow-hidden">
                          <img
                            src={store.coverImage}
                            alt={store.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-900/90 backdrop-blur-md text-amber-300 border border-slate-700">
                              {store.products} Products
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                              {store.tier}
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-4 flex items-center gap-3">
                            <img
                              src={store.avatar}
                              alt={store.owner}
                              className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-lg"
                            />
                            <div>
                              <h3 className="font-black text-white text-base leading-tight truncate max-w-[200px] drop-shadow-sm">
                                {store.name}
                              </h3>
                              <p className="text-xs text-slate-200 font-semibold flex items-center gap-1 drop-shadow-sm">
                                by {store.owner}
                                {store.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-300 inline" />}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-950 font-black border border-amber-300">
                              {store.category}
                            </span>
                            <div className="flex items-center gap-1 text-slate-900 font-bold">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span>{store.rating.toFixed(1)}</span>
                              <span className="text-slate-700 font-semibold">({store.reviews})</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed font-medium">
                            {store.description}
                          </p>

                          <div className="flex items-center justify-between text-xs text-slate-700 pt-1 font-semibold border-t border-slate-100">
                            <span>{store.followers.toLocaleString()} subscribers</span>
                            <span className="font-mono text-emerald-800 font-bold">Fee: {(store.feeBps / 100).toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-5 pt-0 space-y-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStore(store);
                              setShowGiftModal(true);
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold text-xs border border-purple-300 flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Gift className="w-3.5 h-3.5 text-purple-700" />
                            Tip FIC
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyPaylink(store)}
                            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 flex items-center justify-center gap-1.5 transition-all"
                            aria-label={`Copy paylink for ${store.name}`}
                          >
                            <LinkIcon className="w-3.5 h-3.5 text-slate-600" />
                            Paylink
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate(`/storefront/${store.slug || store.id}`)}
                          className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm border border-amber-400/60 transition-all hover:scale-[1.01]"
                        >
                          Visit Storefront
                          <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-white rounded-2xl border border-slate-300 shadow-sm space-y-3">
                  <Store className="w-12 h-12 text-slate-600 mx-auto" />
                  <h3 className="text-lg font-black text-slate-900">No Storefronts Found</h3>
                  <p className="text-xs text-slate-700 font-medium">No stores match your search or filter criteria.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CALCULATOR & ECONOMICS */}
          {activeTab === 'calculator' && (
            <div className="space-y-8">
              {/* Interactive Volume Slider */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-300 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-amber-600" />
                      Monthly Sales Volume Simulator
                    </h3>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">
                      Estimate net merchant payout and platform commission across each tier in Nigerian Naira (₦) and FIC Tokens.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-mono font-black text-slate-900">
                      ₦{monthlyVolume.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-700 font-bold block mt-0.5">
                      ≈ {(monthlyVolume / 100).toLocaleString()} FIC Tokens
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min="50000"
                    max="10000000"
                    step="50000"
                    value={monthlyVolume}
                    onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-white rounded-lg text-slate-900 font-bold border border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />

                  <div className="flex justify-between text-[11px] text-slate-700 font-mono font-bold">
                    <span>₦50,000 (Starter)</span>
                    <span>₦2,500,000 (Growth)</span>
                    <span>₦5,000,000 (Pro)</span>
                    <span>₦10,000,000+ (Enterprise)</span>
                  </div>
                </div>
              </div>

              {/* Tiers Grid Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {TIER_RATES.map((t) => {
                  const commissionAmount = Math.round((monthlyVolume * t.feeBps) / 10000);
                  const netTakeHome = monthlyVolume - commissionAmount;
                  const isHighlighted = t.tier === 'pro';

                  return (
                    <div
                      key={t.tier}
                      className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                        isHighlighted
                          ? 'bg-amber-50/50 border-2 border-amber-400 shadow-md ring-1 ring-amber-400/30'
                          : 'bg-white border-slate-300 shadow-sm'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-black text-slate-900 text-base">{t.name}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-amber-100 text-amber-950 border border-amber-300">
                            {t.fee} FEE
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 font-medium mb-4 leading-relaxed">{t.description}</p>

                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 mb-4">
                          <p className="text-[11px] text-slate-700 font-bold">Net Merchant Payout:</p>
                          <p className="text-lg font-mono font-black text-emerald-800">
                            ₦{netTakeHome.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-slate-700 font-semibold font-mono">
                            Fee: ₦{commissionAmount.toLocaleString()} • {t.holdDays}d Escrow
                          </p>
                        </div>

                        <div className="space-y-2 mb-6">
                          <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Perks Included:</p>
                          {t.features.map((f, i) => (
                            <div key={i} className="text-xs text-slate-800 font-semibold flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setStoreTier(t.tier as any);
                          setActiveTab('register');
                        }}
                        className={`w-full py-2.5 px-4 rounded-xl font-black text-xs transition-all ${
                          isHighlighted
                            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm border border-amber-400'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300'
                        }`}
                      >
                        Choose {t.name}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: REGISTER STOREFRONT */}
          {activeTab === 'register' && (
            <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-slate-300 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/40 text-amber-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Open Your FingerMobile Storefront</h3>
                  <p className="text-xs text-slate-700 font-medium">Deploy a sovereign digital storefront with zero hosting fees</p>
                </div>
              </div>

              <form onSubmit={handleCreateStorefront} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Storefront Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lagos Vintage Stems"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-sm text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:border-amber-400 border focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Storefront URL Slug</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 bg-slate-100 border-2 border-r-0 border-slate-300 rounded-l-xl text-xs text-slate-700 font-bold">
                      fingermobileprotocol.com/storefront/
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="lagos-vintage-stems"
                      value={storeSlug}
                      onChange={(e) => setStoreSlug(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-white border-2 border-slate-300 rounded-r-xl text-sm text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:border-amber-400 border focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Primary Category</label>
                    <select
                      value={storeCategory}
                      onChange={(e) => setStoreCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-sm text-slate-900 font-bold focus:outline-none focus:border-amber-400 border focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Music & Audio">Music & Master Stems</option>
                      <option value="Merchandise & Fashion">Fashion & Merchandise</option>
                      <option value="Digital Art & Photos">Digital Art & Photography</option>
                      <option value="Tech & Electronics">Tech & Gadgets</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Business Type</label>
                    <select
                      value={storeBusinessType}
                      onChange={(e) => setStoreBusinessType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-sm text-slate-900 font-bold focus:outline-none focus:border-amber-400 border focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="individual">Solo Creator / Artist</option>
                      <option value="boutique">Independent Boutique</option>
                      <option value="brand">Registered Brand</option>
                      <option value="dropshipper">Print on Demand / Dropship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Mastered Afro-Fusion Sounds & Stems"
                    value={storeTagline}
                    onChange={(e) => setStoreTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-sm text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:border-amber-400 border focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Select Commission Tier</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {TIER_RATES.map((t) => (
                      <button
                        key={t.tier}
                        type="button"
                        onClick={() => setStoreTier(t.tier as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          storeTier === t.tier
                            ? 'bg-amber-400 text-slate-950 border-2 border-amber-500 font-black shadow-sm'
                            : 'bg-white text-slate-800 border-2 border-slate-300 hover:border-slate-400 font-bold'
                        }`}
                      >
                        <p className="text-xs capitalize">{t.tier}</p>
                        <p className="text-sm font-mono font-extrabold mt-0.5">{t.fee}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab('discover')}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 border border-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-sm border border-amber-400/60 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isRegistering ? 'Launching Storefront...' : 'Launch Storefront'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Send FIC Gift Modal */}
          {showGiftModal && selectedStore && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white border border-slate-300 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">Send Instant FIC Tip</h3>
                  <p className="text-xs text-slate-700 font-medium">Direct P2P token transfer to {selectedStore.name}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Gift Amount (FIC)</label>
                  <input
                    type="number"
                    min="1"
                    value={giftAmount}
                    onChange={(e) => setGiftAmount(e.target.value)}
                    className="w-full px-4 py-2 bg-white border-2 border-slate-300 rounded-xl text-slate-900 font-mono font-bold text-sm focus:outline-none focus:border-amber-400 border focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                  <p className="text-xs text-amber-600 mt-1.5 font-mono font-bold">
                    Available Vault: {ficBalance.toLocaleString()} FIC
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowGiftModal(false)}
                    className="min-h-[44px] px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 rounded-xl hover:bg-slate-200 border border-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendGift}
                    className="min-h-[44px] px-5 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-sm border border-amber-400/60"
                  >
                    Send Tip
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sovereign Mobile Navigation Quick Dock */}
          <div className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 transition-colors ${
                activeTab === 'discover' ? 'text-amber-400' : 'text-slate-300 hover:text-white'
              }`}
              title="Stores"
            >
              <Store className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">Stores</span>
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 transition-colors ${
                activeTab === 'calculator' ? 'text-amber-400' : 'text-slate-300 hover:text-white'
              }`}
              title="Fees"
            >
              <Percent className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">Economics</span>
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 transition-colors ${
                activeTab === 'register' ? 'text-amber-400' : 'text-slate-300 hover:text-white'
              }`}
              title="Launch"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">Launch</span>
            </button>
            <button
              onClick={() => navigate('/products')}
              className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
              title="Products"
            >
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <span className="text-[10px] font-semibold mt-0.5">Products</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StorefrontsPage;
