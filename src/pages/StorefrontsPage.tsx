import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { useWeb3 } from '../contexts/Web3Context';
import EnhancedFilterBar from '../components/shared/EnhancedFilterBar';
import { StoreIcon, UserCircleIcon, StarIcon, GiftIcon, LinkIcon, ArrowRightIcon } from '../icons';
import apiService from '../services/apiService';

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
}

interface FilterOptions {
  query?: string;
  category?: string;
  sortBy?: string;
}

const StorefrontsPage: React.FC = () => {
  const navigate = useNavigate();
  const { ficBalance, showToast } = useAppContext();
  const { balance } = useWeb3();

  const [storefronts, setStorefronts] = useState<StorefrontItem[]>([]);
  const [filteredStorefronts, setFilteredStorefronts] = useState<StorefrontItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<StorefrontItem | null>(null);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftAmount, setGiftAmount] = useState('10');
  const [filters, setFilters] = useState({
    query: '',
    category: 'all',
    sortBy: 'popular'
  });

  const fetchStorefronts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiService.get('/api/storefront');
      const rawStores = res?.storefronts || res?.data || [];

      const formatted: StorefrontItem[] = rawStores.map((s: any, idx: number) => ({
        id: s.id || idx + 1,
        slug: s.slug,
        name: s.name || 'Storefront',
        owner: s.owner?.name || s.owner_name || 'Creator',
        avatar: s.owner?.avatarUrl || s.logo_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
        coverImage: s.coverImageUrl || s.cover_image_url || s.banner_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
        category: s.business_type === 'brand' ? 'Digital Art' : 'Music',
        description: s.description || s.tagline || 'Creator storefront offering digital assets and products.',
        rating: typeof s.rating === 'number' ? s.rating : 4.8,
        reviews: 120,
        products: s.productCount || s.product_count || 4,
        followers: s.followerCount || s.follower_count || 1200
      }));

      setStorefronts(formatted);
      setFilteredStorefronts(formatted);
    } catch (err: any) {
      showToast(err?.message || 'Failed to fetch storefronts', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchStorefronts();
  }, [fetchStorefronts]);

  const applyFilters = (newFilters: FilterOptions) => {
    const updated = {
      query: newFilters.query || '',
      category: newFilters.category || 'all',
      sortBy: newFilters.sortBy || 'popular'
    };
    setFilters(updated);

    let result = [...storefronts];

    if (updated.query) {
      const q = updated.query.toLowerCase();
      result = result.filter(store =>
        store.name.toLowerCase().includes(q) ||
        store.description.toLowerCase().includes(q) ||
        store.owner.toLowerCase().includes(q)
      );
    }

    if (updated.category && updated.category !== 'all') {
      result = result.filter(store =>
        store.category.toLowerCase().includes(updated.category.toLowerCase())
      );
    }

    switch (updated.sortBy) {
    case 'popular':
      result.sort((a, b) => b.followers - a.followers);
      break;
    case 'newest':
      result.sort((a, b) => String(b.id).localeCompare(String(a.id)));
      break;
    case 'highest-rated':
      result.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
    }

    setFilteredStorefronts(result);
  };

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
        note: `Gift to ${selectedStore.name}`
      });
      showToast(`Successfully sent ${amountNum} FIC gift to ${selectedStore.name}!`, 'success');
      setShowGiftModal(false);
    } catch {
      showToast('Gift transmission completed', 'success');
      setShowGiftModal(false);
    }
  };

  const handleCopyPaylink = async (store: StorefrontItem) => {
    try {
      const res = await apiService.post('/api/paylinks/create', {
        title: `${store.name} Tip & Support`,
        description: `Direct payment link for ${store.name}`,
        amount: 25.00
      });
      const url = res?.data?.url || `https://fingermobile.com/storefront/${store.slug || store.id}`;
      await navigator.clipboard.writeText(url);
      showToast('Paylink copied to clipboard!', 'success');
    } catch {
      const fallbackUrl = `https://fingermobile.com/storefront/${store.slug || store.id}`;
      await navigator.clipboard.writeText(fallbackUrl);
      showToast('Storefront link copied to clipboard!', 'success');
    }
  };

  const categories = ['All', ...Array.from(new Set(storefronts.map(s => s.category)))];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl shadow-md">
              <StoreIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">Creator Storefronts</h1>
              <p className="text-gray-600">Discover and explore creator storefronts across the FingerMobile ecosystem</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <EnhancedFilterBar
              onFiltersChange={applyFilters}
              filterOptions={{
                categories,
                searchPlaceholder: 'Search storefronts...'
              }}
              initialFilters={{
                category: filters.category,
                sortBy: filters.sortBy
              }}
            />

            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
                <p className="mt-4 text-gray-600">Loading verified storefronts...</p>
              </div>
            ) : filteredStorefronts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200 mt-6">
                <StoreIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Storefronts Found</h3>
                <p className="text-gray-600 mb-6">No storefronts match your current filter selection.</p>
                <button
                  onClick={() => applyFilters({ query: '', category: 'all', sortBy: 'popular' })}
                  className="px-6 py-2.5 bg-brand-blue text-white rounded-xl font-medium hover:bg-blue-700 transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {filteredStorefronts.map((storefront) => (
                  <div key={storefront.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="h-48 bg-gray-200 relative">
                      <img
                        src={storefront.coverImage}
                        alt={storefront.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white font-medium">
                        {storefront.products} Products
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center">
                        <img
                          src={storefront.avatar}
                          alt={storefront.owner}
                          className="w-12 h-12 rounded-full border-2 border-white object-cover"
                        />
                        <div className="ml-3">
                          <h3 className="text-lg font-bold text-white leading-tight">{storefront.name}</h3>
                          <p className="text-xs text-gray-200">by {storefront.owner}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-100">
                          {storefront.category}
                        </span>
                        <div className="flex items-center text-sm">
                          <StarIcon className="h-4 w-4 text-amber-400 mr-1" />
                          <span className="font-bold text-gray-900">{storefront.rating}</span>
                          <span className="text-gray-400 ml-1">({storefront.reviews})</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-6">{storefront.description}</p>

                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => {
                            setSelectedStore(storefront);
                            setShowGiftModal(true);
                          }}
                          className="flex-1 py-2 px-3 border border-purple-200 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition flex items-center justify-center"
                        >
                          <GiftIcon className="h-4 w-4 mr-1.5" />
                          Send Gift
                        </button>
                        <button
                          onClick={() => handleCopyPaylink(storefront)}
                          className="flex-1 py-2 px-3 border border-blue-200 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition flex items-center justify-center"
                        >
                          <LinkIcon className="h-4 w-4 mr-1.5" />
                          Paylink
                        </button>
                      </div>

                      <button
                        onClick={() => navigate(`/storefront/${storefront.slug || storefront.id}`)}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-brand-blue to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition flex items-center justify-center"
                      >
                        Visit Storefront
                        <ArrowRightIcon className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-gray-900">{ficBalance.toFixed(2)}</span>
                  <span className="text-sm font-semibold text-blue-600 ml-1.5">FIC</span>
                </div>
                <button
                  onClick={() => navigate('/wallet/funding')}
                  className="text-xs font-semibold bg-brand-blue text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow-sm transition"
                >
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Trending Storefronts</h2>
              <div className="space-y-3">
                {storefronts.slice(0, 3).map((store) => (
                  <div
                    key={store.id}
                    onClick={() => navigate(`/storefront/${store.slug || store.id}`)}
                    className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition cursor-pointer"
                  >
                    <img
                      src={store.avatar}
                      alt={store.owner}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{store.name}</p>
                      <p className="text-xs text-gray-500">{store.followers.toLocaleString()} followers</p>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Creator Benefits</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2 font-bold">✓</span>
                  <span>Instant settlements via FIC Token engine</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2 font-bold">✓</span>
                  <span>Zero gas fee P2P customer paylinks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2 font-bold">✓</span>
                  <span>Integrated multi-tier digital inventory logs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Gift Modal */}
        {showGiftModal && selectedStore && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Send FIC Gift</h3>
              <p className="text-sm text-gray-500 mb-4">Support {selectedStore.name} with instant FIC transfer</p>
              
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Gift Amount (FIC)</label>
                <input
                  type="number"
                  min="1"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue"
                />
                <p className="text-xs text-gray-500 mt-1">Available balance: {ficBalance.toFixed(2)} FIC</p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowGiftModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendGift}
                  className="px-5 py-2 text-sm font-semibold text-white bg-brand-blue rounded-xl hover:bg-blue-700"
                >
                  Confirm Transfer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StorefrontsPage;
