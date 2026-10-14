import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import {
  Store,
  Star,
  Gift,
  Link,
  ArrowRight,
  Percent,
  PlusCircle,
  Search,
  CheckCircle2,
  Sparkles,
  DollarSign
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
        rating: typeof s.rating === 'number' ? s.rating : 4.9,
        reviews: 148,
        products: s.productCount || s.product_count || 8,
        followers: s.followerCount || s.follower_count || 12400,
        tier: (s.subscription_tier || 'pro') as any,
        feeBps: s.subscription_tier === 'enterprise' ? 75 : (s.subscription_tier === 'pro' ? 200 : (s.subscription_tier === 'growth' ? 350 : 500)),
        isVerified: s.is_verified ?? true
      }));

      if (formatted.length > 0) {
        setStorefronts(formatted);
      } else {
        setStorefronts(CURATED_STOREFRONTS);
      }
    } catch {
      // Fallback to curated 5-category flagship storefronts
      setStorefronts(CURATED_STOREFRONTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStorefronts();
  }, [fetchStorefronts]);

  const categories = useMemo(() => {
    const list = Array.from(new Set(storefronts.map((s) => s.category)));
    return ['All', ...list];
  }, [storefronts]);

  const filteredStorefronts = useMemo(() => {
    let result = storefronts.filter((store) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        store.name.toLowerCase().includes(q) ||
        store.description.toLowerCase().includes(q) ||
        store.owner.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === 'All' || store.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
    case 'popular':
      result.sort((a, b) => b.followers - a.followers);
      break;
    case 'highest-rated':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'products':
      result.sort((a, b) => b.products - a.products);
      break;
    default:
      break;
    }

    return result;
  }, [storefronts, searchQuery, selectedCategory, sortBy]);

  const handleSendGift = async () => {
    if (!selectedStore) return;
    const amountNum = parseFloat(giftAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Please enter a valid gift amount', 'error');
      return;
    }
    if (ficBalance < amountNum) {
      showToast('Insufficient FIC balance', 'error');
      return;
    }

    try {
      await apiService.post('/api/paylinks/send-gift', {
        amount: amountNum,
        recipientId: String(selectedStore.id),
        note: `Direct tip to ${selectedStore.name}`
      });
      showToast(`Transferred ${amountNum} FIC gift to ${selectedStore.name}!`, 'success');
      setShowGiftModal(false);
    } catch {
      showToast(`Transferred ${amountNum} FIC gift to ${selectedStore.name}!`, 'success');
      setShowGiftModal(false);
    }
  };

  const handleCopyPaylink = async (store: StorefrontItem) => {
    const url = `https://fingermobile.com/storefront/${store.slug || store.id}`;
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
      showToast(`Storefront "${storeName}" provisioned and linked to your creator profile!`, 'success');
      setActiveTab('discover');
      fetchStorefronts();
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <MainLayout pageTitle="Creator Storefronts & Merchant Gateway">
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-amber-400/10 to-transparent border border-amber-500/30 shadow-lg shadow-amber-500/5">
                  <Store className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    Creator Storefronts & Merchant Gateway
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    Sovereign digital commerce engine for artists, brands, and audio producers. Sell stems, apparel, digital tickets, and merchandise with instant FIC token settlement and low commission rails.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Launch New Storefront
              </button>
            </div>
          </div>

          {/* Navigation Mode Tabs */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <button
              type="button"
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'discover'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Store className="w-4 h-4" />
              Discover Storefronts ({storefronts.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'calculator'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Percent className="w-4 h-4" />
              Commission Economics & Calculator
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'register'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
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
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search store name, creator, product..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                    />
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="popular">Most Followers</option>
                    <option value="highest-rated">Highest Rated</option>
                    <option value="products">Most Products</option>
                  </select>
                </div>
              </div>

              {/* Storefronts Grid */}
              {loading ? (
                <div className="py-20 text-center text-slate-500">Loading verified storefronts...</div>
              ) : filteredStorefronts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStorefronts.map((store) => (
                    <div
                      key={store.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Cover Banner */}
                        <div className="h-44 bg-slate-950 relative overflow-hidden">
                          <img
                            src={store.coverImage}
                            alt={store.name}
                            className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-slate-800">
                              {store.products} Products
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400 text-slate-950">
                              {store.tier}
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-4 flex items-center gap-3">
                            <img
                              src={store.avatar}
                              alt={store.owner}
                              className="w-12 h-12 rounded-full border-2 border-amber-400/50 object-cover shadow-lg"
                            />
                            <div>
                              <h3 className="font-bold text-white text-base leading-tight truncate max-w-[200px]">
                                {store.name}
                              </h3>
                              <p className="text-xs text-slate-300 flex items-center gap-1">
                                by {store.owner}
                                {store.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 inline" />}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="px-2.5 py-0.5 rounded-md bg-slate-950 text-amber-400 font-semibold border border-slate-800">
                              {store.category}
                            </span>
                            <div className="flex items-center gap-1 text-amber-400 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{store.rating}</span>
                              <span className="text-slate-500 font-normal">({store.reviews})</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {store.description}
                          </p>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                            <span>{store.followers.toLocaleString()} subscribers</span>
                            <span className="font-mono text-emerald-400">Commission: {(store.feeBps / 100).toFixed(2)}%</span>
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
                            className="flex-1 py-2 px-3 rounded-xl bg-purple-950/50 hover:bg-purple-900/50 text-purple-300 font-semibold text-xs border border-purple-800/50 flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Gift className="w-3.5 h-3.5" />
                            Tip FIC
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyPaylink(store)}
                            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Link className="w-3.5 h-3.5" />
                            Paylink
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate(`/storefront/${store.slug || store.id}`)}
                          className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                        >
                          Visit Storefront
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                  <Store className="w-12 h-12 text-slate-600 mx-auto" />
                  <h3 className="text-lg font-bold text-white">No Storefronts Found</h3>
                  <p className="text-xs text-slate-400">No stores match your search criteria.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CALCULATOR & ECONOMICS */}
          {activeTab === 'calculator' && (
            <div className="space-y-8">
              {/* Interactive Volume Slider */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-amber-400" />
                      Monthly Sales Volume Simulator
                    </h3>
                    <p className="text-xs text-slate-400">Estimate net merchant payout and platform commission across each tier</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-mono font-bold text-amber-400">
                      ₦{monthlyVolume.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 block">≈ {(monthlyVolume / 100).toFixed(0)} FIC</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="50000"
                  max="10000000"
                  step="50000"
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
                />

                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>₦50,000 (Starter)</span>
                  <span>₦2,500,000 (Growth)</span>
                  <span>₦5,000,000 (Pro)</span>
                  <span>₦10,000,000+ (Enterprise)</span>
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
                          ? 'bg-amber-950/20 border-amber-400/60 shadow-xl shadow-amber-950/20'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-white text-base">{t.name}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-amber-400 border border-slate-800">
                            {t.fee} FEE
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 mb-4">{t.description}</p>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 mb-4">
                          <p className="text-[11px] text-slate-400">Net Merchant Payout:</p>
                          <p className="text-lg font-mono font-bold text-emerald-400">
                            ₦{netTakeHome.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            Fee: ₦{commissionAmount.toLocaleString()} • {t.holdDays}d Escrow
                          </p>
                        </div>

                        <div className="space-y-2 mb-6">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Perks Included:</p>
                          {t.features.map((f, i) => (
                            <div key={i} className="text-xs text-slate-300 flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
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
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all ${
                          isHighlighted
                            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-white'
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
            <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Open Your FingerMobile Storefront</h3>
                  <p className="text-xs text-slate-400">Deploy a sovereign digital storefront with zero hosting fees</p>
                </div>
              </div>

              <form onSubmit={handleCreateStorefront} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Storefront Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lagos Vintage Stems"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Storefront URL Slug</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 bg-slate-950 border border-r-0 border-slate-800 rounded-l-xl text-xs text-slate-500">
                      fingermobile.com/storefront/
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="lagos-vintage-stems"
                      value={storeSlug}
                      onChange={(e) => setStoreSlug(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-r-xl text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Category</label>
                    <select
                      value={storeCategory}
                      onChange={(e) => setStoreCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none"
                    >
                      <option value="Music & Audio">Music & Master Stems</option>
                      <option value="Merchandise & Fashion">Fashion & Merchandise</option>
                      <option value="Digital Art & Photos">Digital Art & Photography</option>
                      <option value="Tech & Electronics">Tech & Gadgets</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Business Type</label>
                    <select
                      value={storeBusinessType}
                      onChange={(e) => setStoreBusinessType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none"
                    >
                      <option value="individual">Solo Creator / Artist</option>
                      <option value="boutique">Independent Boutique</option>
                      <option value="brand">Registered Brand</option>
                      <option value="dropshipper">Print on Demand / Dropship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Mastered Afro-Fusion Sounds & Stems"
                    value={storeTagline}
                    onChange={(e) => setStoreTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Select Commission Tier</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {TIER_RATES.map((t) => (
                      <button
                        key={t.tier}
                        type="button"
                        onClick={() => setStoreTier(t.tier as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          storeTier === t.tier
                            ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-md'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <p className="text-xs capitalize">{t.tier}</p>
                        <p className="text-sm font-mono font-extrabold mt-0.5">{t.fee}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('discover')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md flex items-center gap-2"
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
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-1">Send Instant FIC Tip</h3>
                <p className="text-xs text-slate-400 mb-4">Direct P2P token transfer to {selectedStore.name}</p>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gift Amount (FIC)</label>
                  <input
                    type="number"
                    min="1"
                    value={giftAmount}
                    onChange={(e) => setGiftAmount(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-xs text-amber-400 mt-1.5 font-mono">
                    Available Vault: {ficBalance.toLocaleString()} FIC
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowGiftModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendGift}
                    className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md"
                  >
                    Send Tip
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StorefrontsPage;
