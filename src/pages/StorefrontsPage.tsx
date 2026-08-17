import React, { useState } from 'react';


import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from "../contexts/AppContext";
import { useWeb3 } from '../contexts/Web3Context';
import EnhancedFilterBar from '../components/shared/EnhancedFilterBar';
import { StoreIcon, UserCircleIcon, HeartIcon, StarIcon, ShoppingBagIcon, GiftIcon, LinkIcon, ArrowRightIcon } from '../icons';

const StorefrontsPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const { balance } = useWeb3();

  const [filters, setFilters] = useState({
    query: '',
    category: 'all',
    sortBy: 'popular'
  });



  // Mock data for storefronts
  const storefronts = [
    {
      id: 1,
      name: 'Alex Johnson Music',
      owner: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Music',
      description: 'Original beats, samples, and music production resources',
      rating: 4.8,
      reviews: 1240,
      products: 42,
      followers: 15420
    },
    {
      id: 2,
      name: 'Digital Art Collective',
      owner: 'PixelArtist',
      avatar: 'https://images.unsplash.com/photo-1543857778-c4a1a569e7bd?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      coverImage: 'https://images.unsplash.com/photo-1543857778-c4a1a569e7bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Art',
      description: 'High-quality digital art assets for creators and designers',
      rating: 4.6,
      reviews: 890,
      products: 28,
      followers: 8920
    },
    {
      id: 3,
      name: 'Photography Pro',
      owner: 'ShutterMaster',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Photography',
      description: 'Professional photography presets and editing tutorials',
      rating: 4.9,
      reviews: 2100,
      products: 15,
      followers: 24500
    },
    {
      id: 4,
      name: 'Fitness Gurus',
      owner: 'FitLife',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      coverImage: 'https://images.unsplash.com/photo-1534367507877-0edd93bd013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Fitness',
      description: 'Workout plans and nutrition guides for all fitness levels',
      rating: 4.7,
      reviews: 1750,
      products: 32,
      followers: 18900
    }
  ];

  const [filteredStorefronts, setFilteredStorefronts] = useState(storefronts);

  // Assuming the type definition for FilterOptions includes optional values
  interface FilterOptions {
    query?: string;
    category?: string;
    sortBy?: string;
  }

  const applyFilters = (newFilters: FilterOptions) => {
    // Ensure all filter values are properly defaulted to prevent type errors
    setFilters({
      query: newFilters.query || '',
      category: newFilters.category || 'all',
      sortBy: newFilters.sortBy || 'popular'
    });
    
    let result = [...storefronts];
    
    // Apply search filter
    if (newFilters.query) {
      const query = newFilters.query.toLowerCase();
      result = result.filter(store => 
        store.name.toLowerCase().includes(query) || 
        store.description.toLowerCase().includes(query) ||
        store.owner.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (newFilters.category && newFilters.category !== 'all') {
      result = result.filter(store => 
        store.category.toLowerCase().includes(newFilters.category!.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (newFilters.sortBy) {
      case 'popular':
        result.sort((a, b) => b.followers - a.followers);
        break;
      case 'newest':
        // Assuming newer stores come last in our mock data
        result.sort((a, b) => a.id - b.id);
        break;
      case 'highest-rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    setFilteredStorefronts(result);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    // Ensure undefined values are converted to empty strings or defaults
    setFilters({
      query: newFilters.query ?? "",
      category: newFilters.category ?? "",
      sortBy: newFilters.sortBy ?? ""
    });
  };

  const categories = ['All', ...new Set(storefronts.map(s => s.category))];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl">
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
              filterOptions={{
                categories,
                sortByOptions: [
                  { value: 'popular', label: 'Most Popular' },
                  { value: 'highest-rated', label: 'Highest Rated' },
                  { value: 'newest', label: 'Newest' },
                  { value: 'products', label: 'Most Products' }
                ],
                searchPlaceholder: "Search storefronts..."
              }}
              onFiltersChange={applyFilters}
            />

            {filteredStorefronts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-bold text-gray-900">No storefronts found</h3>
                <p className="mt-2 text-gray-600">Try adjusting your filters to find what you&apos;re looking for.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
                {filteredStorefronts.map((storefront) => (
                  <div key={storefront.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="relative">
                      <img 
                        src={storefront.coverImage} 
                        alt={storefront.name} 
                        className="w-full h-48 object-cover"
                       />
                      <div className="absolute top-4 left-4">
                        <img 
                          src={storefront.avatar} 
                          alt={storefront.owner} 
                          className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                         />
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{storefront.name}</h3>
                          <p className="text-gray-600">by {storefront.owner}</p>
                        </div>
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 text-sm font-semibold rounded-full">
                          {storefront.category}
                        </span>
                      </div>
                      <p className="mt-3 text-gray-600">{storefront.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <StarIcon className="h-5 w-5 text-yellow-400" />
                          <span className="ml-1 text-gray-600">{storefront.rating}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-gray-600">{storefront.reviews} reviews</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between text-sm text-gray-500">
                        <span>{storefront.products} products</span>
                        <span>{storefront.followers.toLocaleString()} followers</span>
                      </div>
                      <div className="mt-6 flex gap-2">
                        <button 
                          className="flex-1 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none"
                        >
                          <div className="flex items-center justify-center">
                            <GiftIcon className="h-4 w-4 mr-2" />
                            Send Gift
                          </div>
                        </button>
                        <button 
                          className="flex-1 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none"
                        >
                          <div className="flex items-center justify-center">
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Paylink
                          </div>
                        </button>
                      </div>
                      <button className="mt-4 w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none flex items-center justify-center">
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
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-indigo-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Trending Storefronts</h2>
              <div className="space-y-3">
                {storefronts.slice(0, 3).map((store) => (
                  <div key={store.id} className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors">
                    <img 
                      src={store.avatar} 
                      alt={store.owner} 
                      className="w-10 h-10 rounded-full mr-3"
                     />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{store.name}</p>
                      <p className="text-xs text-gray-500">{store.followers.toLocaleString()} followers</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Creator Benefits</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Earn FIC tokens from sales</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Access to marketing tools</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Promote to our community</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StorefrontsPage;