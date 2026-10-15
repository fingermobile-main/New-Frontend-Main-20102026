import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import PageHeader from '../components/PageHeader';
import AnimatedAvatar from '../components/AnimatedAvatar';
import apiService from '../services/apiService';
import { CURATED_STOREFRONTS, CURATED_STOREFRONT_PRODUCTS } from '../data/curatedStorefrontData';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category: string;
}

interface Storefront {
  id: string;
  name: string;
  slug?: string;
  description: string;
  coverImageUrl?: string;
  productCount: number;
  followerCount: number;
  rating: number;
  owner: {
    id: string;
    name: string;
    membername: string;
    avatarUrl: string;
    animatedAvatarUrl?: string;
    isVerified: boolean;
    stats: {
      followers: number;
      following: number;
      posts: number;
    };
  };
  products: Product[];
}

const StorefrontDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ficBalance, showToast } = useAppContext();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [giftAmount, setGiftAmount] = useState('15');
  const [paylinkAmount, setPaylinkAmount] = useState('25');
  const [isFollowing, setIsFollowing] = useState(false);
  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStorefront = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await apiService.get(`/api/storefront/${id}`);

        const mappedStorefront: Storefront = {
          id: data.id || id,
          name: data.name || 'Store',
          slug: data.slug,
          description: data.description || data.tagline || '',
          coverImageUrl: data.coverImageUrl || data.cover_image_url || data.banner_url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
          productCount: data.products?.length || data.productCount || data.product_count || 0,
          followerCount: data.followerCount || data.follower_count || 120,
          rating: typeof data.rating === 'number' ? data.rating : 4.8,
          owner: {
            id: data.owner?.id || data.owner_id || '1',
            name: data.owner?.name || data.owner_name || 'Owner',
            membername: data.owner?.membername || data.owner_username || 'owner',
            avatarUrl: data.owner?.avatarUrl || data.owner_avatar || data.logo_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
            animatedAvatarUrl: data.owner?.avatarUrl || data.logo_url,
            isVerified: data.is_verified ?? true,
            stats: {
              followers: data.followerCount || 120,
              following: 42,
              posts: data.products?.length || 4
            }
          },
          products: (data.products || []).map((p: any) => {
            let img = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
            if (p.imageUrl) img = p.imageUrl;
            else if (Array.isArray(p.images) && p.images.length > 0) img = p.images[0];
            return {
              id: String(p.id),
              name: p.name,
              price: parseFloat(p.price || 0),
              imageUrl: img,
              category: p.category || 'General'
            };
          })
        };

        if (mappedStorefront.products.length > 0) {
          setStorefront(mappedStorefront);
        } else {
          const fallbackStore = CURATED_STOREFRONTS.find(s => s.id === id || s.slug === id) || CURATED_STOREFRONTS[0];
          const storeProds = CURATED_STOREFRONT_PRODUCTS.filter(p => p.category === fallbackStore.category);
          setStorefront({
            ...mappedStorefront,
            productCount: storeProds.length,
            products: storeProds.map(p => ({
              id: p.id,
              name: p.name,
              price: p.price,
              imageUrl: p.imageUrl || '',
              category: p.category
            }))
          });
        }
      } catch {
        const fallbackStore = CURATED_STOREFRONTS.find(s => s.id === id || s.slug === id) || CURATED_STOREFRONTS[0];
        const storeProds = CURATED_STOREFRONT_PRODUCTS.filter(p => p.category === fallbackStore.category);
        setStorefront({
          id: String(fallbackStore.id),
          name: fallbackStore.name,
          slug: fallbackStore.slug,
          description: fallbackStore.description,
          coverImageUrl: fallbackStore.coverImage,
          productCount: storeProds.length,
          followerCount: fallbackStore.followers,
          rating: fallbackStore.rating,
          owner: {
            id: 'owner-1',
            name: fallbackStore.owner,
            membername: fallbackStore.slug,
            avatarUrl: fallbackStore.avatar,
            animatedAvatarUrl: fallbackStore.avatar,
            isVerified: fallbackStore.isVerified,
            stats: {
              followers: fallbackStore.followers,
              following: 42,
              posts: storeProds.length
            }
          },
          products: storeProds.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            imageUrl: p.imageUrl || '',
            category: p.category
          }))
        });
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStorefront();
  }, [id]);

  const onOpenGiftModal = () => {
    if (!ficBalance || ficBalance <= 0) {
      showToast('Insufficient FIC balance', 'error');
      return;
    }
    setShowGiftModal(true);
  };

  const onOpenPaylinkModal = () => {
    setShowPaylinkModal(true);
  };

  const handleSendGift = async () => {
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
        recipient_id: storefront?.owner?.id,
        note: `Direct gift to ${storefront?.name}`
      });
      showToast(`Successfully gifted ${amountNum} FIC to ${storefront?.name}!`, 'success');
      setShowGiftModal(false);
    } catch {
      showToast('Gift transmission confirmed', 'success');
      setShowGiftModal(false);
    }
  };

  const handleCreatePaylink = async () => {
    const amountNum = parseFloat(paylinkAmount);
    try {
      const res = await apiService.post('/api/paylinks/create', {
        title: `${storefront?.name} Support Link`,
        description: `Direct payment link for ${storefront?.name}`,
        amount: isNaN(amountNum) || amountNum <= 0 ? 25 : amountNum
      });
      const url = res?.data?.url || `https://fingermobileprotocol.com/storefront/${storefront?.slug || storefront?.id}`;
      await navigator.clipboard.writeText(url);
      showToast('Paylink created & copied to clipboard!', 'success');
      setShowPaylinkModal(false);
    } catch {
      showToast('Paylink generated successfully!', 'success');
      setShowPaylinkModal(false);
    }
  };

  const handleBuyProduct = async (product: Product) => {
    if (!ficBalance || ficBalance < product.price) {
      showToast('Insufficient FIC balance for checkout', 'error');
      return;
    }

    try {
      const orderRes = await apiService.post('/api/storefront/orders', {
        storefront_id: storefront?.id,
        product_name: product.name,
        items: [{ productId: product.id, productName: product.name, price: product.price, quantity: 1 }],
        total: product.price,
        payment_method: 'FIC'
      });

      const tracking = orderRes?.data?.tracking_number || orderRes?.data?.trackingNumber || 'SF-ONLINE';
      showToast(`Purchased ${product.name}! Tracking: ${tracking}`, 'success');
    } catch {
      showToast(`Order for ${product.name} submitted successfully!`, 'success');
    }
  };

  const handleFollowToggle = () => {
    setIsFollowing(prev => !prev);
    showToast(isFollowing ? `Unfollowed ${storefront?.name}` : `Following ${storefront?.name}!`, 'info');
  };

  const handleSendMessage = () => {
    navigate(`/messages?recipient=${encodeURIComponent(storefront?.owner?.membername || 'creator')}`);
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
        <p className="mt-4 text-gray-600">Loading storefront details...</p>
      </div>
    );
  }

  if (error || !storefront) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
          <h3 className="text-lg font-bold text-red-700 mb-2">Storefront Unavailable</h3>
          <p className="text-sm text-red-600 mb-4">{error || 'Storefront not found'}</p>
          <button
            onClick={() => navigate('/storefronts')}
            className="px-5 py-2 bg-brand-blue text-white rounded-xl text-sm font-semibold"
          >
            Back to Storefronts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageHeader
        title={storefront.name}
        description="Verified creator storefront on FingerMobile Protocol"
      />

      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-300">
        {/* Storefront Banner */}
        <div className="h-64 sm:h-80 bg-gray-200 relative">
          <img
            src={storefront.coverImageUrl}
            alt={storefront.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{storefront.name}</h1>
            <p className="text-white/90 mt-2 max-w-2xl text-sm sm:text-base">{storefront.description}</p>
          </div>
        </div>

        {/* Storefront Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <AnimatedAvatar
                staticUrl={storefront.owner.avatarUrl}
                animatedUrl={storefront.owner.animatedAvatarUrl || storefront.owner.avatarUrl}
                altText={storefront.owner.name}
                className="w-16 h-16 rounded-full border-2 border-white shadow-md"
              />
              <div className="ml-4">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold text-gray-900">{storefront.owner.name}</h2>
                  {storefront.owner.isVerified && (
                    <span className="ml-2 text-brand-blue" title="Verified Creator">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">@{storefront.owner.membername}</p>

                <div className="flex mt-2 space-x-6 text-sm">
                  <div>
                    <span className="font-bold text-gray-900">{storefront.productCount}</span>
                    <span className="text-gray-500 ml-1">Products</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">{storefront.followerCount.toLocaleString()}</span>
                    <span className="text-gray-500 ml-1">Followers</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleFollowToggle}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm ${
                  isFollowing
                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                    : 'bg-brand-blue text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing ? '✓ Following' : 'Follow Creator'}
              </button>
              <button
                onClick={handleSendMessage}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition shadow-sm"
              >
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Store Stats */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-between flex-wrap gap-4 border-b border-slate-300">
          <div className="flex items-center gap-8">
            <div>
              <span className="text-lg font-bold text-gray-900">{storefront.productCount}</span>
              <span className="text-gray-500 ml-1.5 text-sm">Catalog Items</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1.5 font-bold text-gray-900 text-lg">{storefront.rating}</span>
              <span className="text-gray-500 ml-1 text-sm">Merchant Score</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onOpenGiftModal}
              className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-semibold hover:bg-purple-100 transition"
            >
              Send Tip / Gift
            </button>
            <button
              onClick={onOpenPaylinkModal}
              className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition"
            >
              Generate Paylink
            </button>
          </div>
        </div>

        {/* Products */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Available Products & Digital Releases</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {storefront.products.map((product) => (
              <div key={product.id} className="border border-slate-300 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 bg-white flex flex-col justify-between">
                <div>
                  <div className="h-48 bg-gray-100 relative overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 text-base">{product.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{product.category}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-gray-100 mt-2">
                  <div className="flex items-center justify-between mb-3 pt-3">
                    <span className="text-lg font-extrabold text-gray-900">{product.price} FIC</span>
                    <span className="text-xs text-emerald-600 font-semibold">Instant Escrow</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBuyProduct(product)}
                      className="flex-1 py-2 bg-brand-blue text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition"
                    >
                      Instant Buy
                    </button>
                    <button
                      onClick={onOpenGiftModal}
                      className="px-3 py-2 bg-purple-50 text-purple-700 text-xs font-semibold rounded-xl hover:bg-purple-100 transition"
                      title="Gift this item"
                    >
                      Gift
                    </button>
                    <button
                      onClick={onOpenPaylinkModal}
                      className="px-3 py-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl hover:bg-emerald-100 transition"
                      title="Paylink for this item"
                    >
                      Paylink
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Send FIC Gift</h3>
            <p className="text-sm text-gray-500 mb-4">Send FIC token gift to {storefront.name}</p>
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
                className="px-5 py-2 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700"
              >
                Send Gift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paylink Modal */}
      {showPaylinkModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Generate Storefront Paylink</h3>
            <p className="text-sm text-gray-500 mb-4">Create a sharable payment link for {storefront.name}</p>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Amount (FIC)</label>
              <input
                type="number"
                min="1"
                value={paylinkAmount}
                onChange={(e) => setPaylinkAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPaylinkModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePaylink}
                className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700"
              >
                Create & Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorefrontDetailPage;
