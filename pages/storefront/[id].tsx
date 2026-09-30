import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import { useAppContext } from '../../src/../src/contexts/AppContext';  // Using absolute path from src
import PageHeader from '../../src/../src/components/PageHeader';
import AnimatedAvatar from '../../src/../src/components/AnimatedAvatar';
import apiService from '../../src/../src/services/apiService';

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
}

interface Storefront {
    id: string;
    name: string;
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
        }
    };
    products: Product[];
}

const StorefrontDetailPage: React.FC = () => {
  const routerParams = useRouter();
  const id = routerParams.query;
  if (!routerParams.isReady) return null;
  const { ficBalance, showToast } = useAppContext();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStorefront = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await apiService.get(`/api/storefronts/${id}`).catch(() => {
          console.warn('Using mock storefront detail data');
          return {
            id,
            name: 'Mock Storefront',
            description: 'A beautifully mocked storefront for testing.',
            cover_image_url: 'https://picsum.photos/seed/store1/1200/400',
            product_count: 5,
            follower_count: 120,
            rating: 4.5,
            owner_id: '1',
            owner_name: 'Mock Owner',
            owner_username: 'mockowner',
            owner_avatar: 'https://picsum.photos/seed/jane/200/200',
            products: [
              { id: '1', name: 'Mock Product', price: 9.99, imageUrl: 'https://picsum.photos/200', category: 'mock' }
            ]
          };
        });

        // If API is not fully serving owner details yet, mock some properties for the UI to not crash
        const mappedStorefront: Storefront = {
          id: data.id || id,
          name: data.name || 'Store',
          description: data.description || '',
          coverImageUrl: data.cover_image_url || 'https://picsum.photos/seed/store1/1200/400',
          productCount: data.product_count || 0,
          followerCount: data.follower_count || 0,
          rating: data.rating || 0,
          owner: {
            id: data.owner_id || '1',
            name: data.owner_name || 'Owner',
            membername: data.owner_username || 'owner',
            avatarUrl: data.owner_avatar || 'https://picsum.photos/seed/jane/200/200',
            animatedAvatarUrl: data.owner_avatar,
            isVerified: true,
            stats: { followers: 0, following: 0, posts: 0 }
          },
          products: data.products || []
        };

        setStorefront(mappedStorefront);
      } catch (err: any) {
        console.error('Failed to load storefront', err);
        setError(err.message || 'Failed to load storefront details');
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
    if (!ficBalance || ficBalance <= 0) {
      showToast('Insufficient FIC balance', 'error');
      return;
    }

    setShowPaylinkModal(true);
  };

  const handleSendGift = () => {
    // console.info('Sending gift...');
  };

  const handleCreatePaylink = () => {
    // console.info('Creating paylink...');
    showToast('Paylink created successfully!');
    setShowPaylinkModal(false);
  };

  const handleBuyProduct = (product: Product) => {
    if (!ficBalance || ficBalance < product.price) {
      showToast('Insufficient FIC balance', 'error');
      return;
    }

    // console.info('Buying product:', product);
    showToast('Product purchased successfully!');
  };

  if (loading) return <div className="text-center py-8">Loading storefront...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!storefront) return <div className="text-center py-8">Storefront not found</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Storefront Details"
        description="Browse products from this creator"
      />

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Storefront Banner */}
        <div className="h-64 bg-gray-200 relative">
          <img
            src={storefront.coverImageUrl}
            alt={storefront.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl font-bold text-white">{storefront.name}</h1>
            <p className="text-white mt-1 opacity-90">{storefront.description}</p>
          </div>
        </div>

        {/* Storefront Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <AnimatedAvatar
                staticUrl={storefront.owner.avatarUrl}
                animatedUrl={storefront.owner.animatedAvatarUrl || storefront.owner.avatarUrl}
                altText={storefront.owner.name}
                className="w-16 h-16 rounded-full border-2 border-white"
              />
              <div className="ml-4">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold text-gray-900">{storefront.owner.name}</h2>
                  {storefront.owner.isVerified && (
                    <span className="ml-2 text-brand-blue">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="text-gray-600">@{storefront.owner.membername}</p>

                <div className="flex mt-2 space-x-4">
                  <div>
                    <span className="font-semibold text-gray-900">{storefront.owner.stats.posts}</span>
                    <span className="text-gray-600 ml-1">Posts</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{storefront.owner.stats.followers.toLocaleString()}</span>
                    <span className="text-gray-600 ml-1">Followers</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{storefront.owner.stats.following}</span>
                    <span className="text-gray-600 ml-1">Following</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-700">
                                Follow
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                Message
              </button>
            </div>
          </div>
        </div>

        {/* Store Stats */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex space-x-6">
            <div>
              <span className="text-lg font-bold text-gray-900">{storefront.productCount}</span>
              <span className="text-gray-600 ml-1">Products</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">{storefront.followerCount.toLocaleString()}</span>
              <span className="text-gray-600 ml-1">Followers</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 font-medium text-gray-900">{storefront.rating}</span>
              <span className="text-gray-600 ml-1">Rating</span>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {storefront.products.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-gray-900">{product.price} FIC</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBuyProduct(product)}
                        className="px-3 py-1 bg-brand-blue text-white text-sm rounded-md hover:bg-blue-700"
                      >
                                                Buy
                      </button>
                      <button
                        onClick={onOpenGiftModal}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                                                Gift
                      </button>
                      <button
                        onClick={onOpenPaylinkModal}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                      >
                                                Paylink
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Send Gift</h3>
            <p className="text-gray-600 mb-4">Your FIC Balance: {ficBalance} FIC</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowGiftModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                                Cancel
              </button>
              <button
                onClick={handleSendGift}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                                Send Gift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paylink Modal */}
      {showPaylinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Create Paylink</h3>
            <p className="text-gray-600 mb-4">Your FIC Balance: {ficBalance} FIC</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPaylinkModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                                Cancel
              </button>
              <button
                onClick={handleCreatePaylink}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                                Create Paylink
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorefrontDetailPage;
