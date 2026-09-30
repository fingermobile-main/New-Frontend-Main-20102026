import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
/*
 * FingerMobile Protocol™ - Marketplace Page Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import apiService from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import SocialEmbedModal from '../components/commerce/SocialEmbedModal';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import {
  CartIcon as ShoppingBagIcon,
  StoreIcon as CubeIcon,
  CurrencyNairaIcon as CurrencyDollarIcon,
  FilterIcon as ChartBarIcon,
  MemberGroupIcon as UserGroupIcon,
  BankIcon as CreditCardIcon,
  StoreIcon as StorefrontIcon,
  PolicyIcon as OrdersIcon,
  EmojiHappyIcon as StarIcon
} from '../icons';

// Types for enhanced marketplace features
type MarketplaceFilters = {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'rating_desc' | 'popular';
  platform: 'all' | 'ownit' | 'flamingo' | 'storefront';
};

type MarketplaceAnalytics = {
  totalProducts: number;
  totalRevenue: number;
  totalOrders: number;
  avgRating: number;
  trendingCategories: string[];
  featuredProducts: Product[];
};

type UnifiedOrder = {
  id: string;
  productId: string;
  platform: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  currency: string;
  date: string;
  buyerId: string;
};

type UnifiedTransaction = {
  id: string;
  type: 'purchase' | 'gift' | 'trade' | 'refund';
  platform: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
};

interface ApiProductResponse {
  id: string;
  name: string;
  description?: string;
  price: string;
  image_url?: string;
  category?: string;
  platform_type?: string;
  avg_rating?: string;
  creator_id?: string | number;
  seller_name?: string;
  stock_quantity?: string | number;
  created_at?: string;
  updated_at?: string;
}

const MarketplacePage: React.FC = () => {
  const { addToast } = useToast();
  const { member: user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    | 'marketplace'
    | 'ownit'
    | 'flamingo'
    | 'storefront'
    | 'orders'
    | 'analytics'
    | 'transactions'
    | 'create'
  >('marketplace');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    query: '',
    category: 'all',
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'newest',
    platform: 'all'
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<MarketplaceAnalytics | null>(null);
  const [orders, setOrders] = useState<UnifiedOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<UnifiedTransaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);

  // Social embed and checkout modal states
  const [embedProduct, setEmbedProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [selectedPaymentRail, setSelectedPaymentRail] = useState<'earnings' | 'fic' | 'card' | 'credits'>('earnings');
  const [isProcessingOrder, setIsProcessingOrder] = useState<boolean>(false);

  const handleCompletePurchase = async () => {
    if (!checkoutProduct) return;
    setIsProcessingOrder(true);
    try {
      const res = await apiService.post('/api/marketplace/orders', {
        productId: checkoutProduct.id,
        items: [{ id: checkoutProduct.id, name: checkoutProduct.name, price: checkoutProduct.price, quantity: 1 }],
        platform: checkoutProduct.platform || 'marketplace',
        total: checkoutProduct.price,
        paymentRail: selectedPaymentRail
      });

      const railLabels: Record<string, string> = {
        earnings: 'Platform Earnings Wallet',
        fic: 'FIC Protocol Tokens',
        card: 'Debit/Credit Card',
        credits: 'Platform Credits'
      };
      addToast(`Order placed successfully using ${railLabels[selectedPaymentRail]}!`, 'success');
      const newOrder: UnifiedOrder = {
        id: String(res.order?.id || res.data?.id || `ord_${Date.now()}`),
        productId: String(checkoutProduct.id),
        platform: checkoutProduct.platform || 'marketplace',
        status: 'processing',
        total: checkoutProduct.price,
        currency: checkoutProduct.currency || 'USD',
        date: new Date().toISOString().split('T')[0],
        buyerId: user?.id ? String(user.id) : 'guest'
      };
      setOrders(prev => [newOrder, ...prev]);
      setCheckoutProduct(null);
    } catch (err: any) {
      addToast(err.message || 'Failed to place order', 'error');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Product creation state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    platform: 'storefront' as const,
    imageUrl: ''
  });

  // Fetch all unified marketplace data
  useEffect(() => {
    const fetchMarketplaceData = async () => {
      try {
        setLoadingProducts(true);
        setLoadingOrders(true);
        setLoadingTransactions(true);
        setError(null);

        // Fetch unified products from all platforms
        try {
          const productsResponse = await apiService.request<{ data?: ApiProductResponse[] }>(
            '/marketplace/unified-products',
          );
          const apiProducts = (Array.isArray(productsResponse) ? productsResponse : productsResponse?.data) || [];
          const transformedProducts = apiProducts.map((product: ApiProductResponse) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            currency: 'USD',
            images: product.image_url ? [product.image_url] : ['https://via.placeholder.com/300'],
            category: product.category || 'uncategorized',
            platform: product.platform_type?.toLowerCase() || 'marketplace',
            imageUrl: product.image_url || 'https://via.placeholder.com/300',
            rating: parseFloat(product.avg_rating || '0') || 0,
            sellerId: product.creator_id?.toString() || 'unknown',
            sellerName: product.seller_name || 'Unknown Seller',
            stock: typeof product.stock_quantity === 'number' ? product.stock_quantity : parseInt(product.stock_quantity || '0', 10),
            salesCount: 0, // Default to 0 since not provided by API
            createdAt: product.created_at,
            updatedAt: product.updated_at,
            stockQuantity: typeof product.stock_quantity === 'number' ? product.stock_quantity : parseInt(product.stock_quantity || '0', 10)
          }));
          setProducts(transformedProducts);
        } catch {
          setProducts([]);
        }

        // Fetch analytics
        try {
          const analyticsResponse =
            await apiService.request<{ data?: MarketplaceAnalytics }>(
              '/marketplace/analytics',
            );
          setAnalytics(analyticsResponse?.data || null);
        } catch {
          setAnalytics(null);
        }

        // Fetch member-specific data if logged in
        if (user) {
          try {
            const ordersResponse = await apiService.request<{ data?: UnifiedOrder[] }>(
              '/marketplace/unified-orders',
            );
            setOrders(ordersResponse?.data || []);
          } catch {
            setOrders([]);
          }

          try {
            const transactionsResponse = await apiService.request<{ data?: UnifiedTransaction[] }>(
              '/marketplace/transactions'
            );
            setTransactions(transactionsResponse?.data || []);
          } catch {
            setTransactions([]);
          }
        }

        setLoadingProducts(false);
        setLoadingOrders(false);
        setLoadingTransactions(false);
      } catch {
        setError('Failed to load marketplace data. Please try refreshing the page.');
        setLoadingProducts(false);
        setLoadingOrders(false);
        setLoadingTransactions(false);
      }
    };

    fetchMarketplaceData();
  }, [user]);

  // Apply filters when they change
  useEffect(() => {
    const productsArray = Array.isArray(products) ? products : [];
    let filtered = productsArray;

    if (filters.query) {
      filtered = filtered.filter(
        (p) =>
          (p.name?.toLowerCase() || '').includes(filters.query.toLowerCase()) ||
          (p.description?.toLowerCase() || '').includes(filters.query.toLowerCase()),
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    filtered = filtered.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice,
    );

    if (filters.platform !== 'all') {
      filtered = filtered.filter((p) => (p.platform || 'marketplace') === filters.platform);
    }

    switch (filters.sortBy) {
    case 'price_asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating_desc':
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'popular':
      filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      break;
    default:
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime(),
      );
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleFilterChange = (
    key: keyof MarketplaceFilters,
    value: string | number,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCreateProductSubmit = async () => {
    try {
      await apiService.post('/marketplace/products', {
        ...newProduct,
        sellerId: user?.id
      });

      addToast('Product created successfully!', 'success');

      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: '',
        platform: 'storefront',
        imageUrl: ''
      });

      const productsResponse = await apiService.request<Product[]>(
        '/marketplace/unified-products',
      );
      setProducts(productsResponse || []);
    } catch {
      addToast('Error creating product', 'error');
    }
  };

  return (
    <MainLayout pageTitle="Marketplace">
      <div className="bg-gray-50 min-h-screen text-gray-900 relative">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-orange-100 to-white overflow-hidden -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20 space-y-4">
                <div className="glass p-6 rounded-2xl shadow-sm border border-white/40">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 mb-2">
                    Universal Protocol Access
                  </span>
                  <h3 className="font-bold text-gray-900 mb-2 gradient-text text-xl">Marketplace</h3>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                    FingerMobile Protocol™ decentralized universal commerce layer. Open to all registered members.
                  </p>
                  <div className="space-y-2 border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Platform Earnings:</span>
                      <span className="font-bold text-green-600">100% Eligible</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>FIC Token Settlement:</span>
                      <span className="font-bold text-blue-600">Supported</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Card / Gateways:</span>
                      <span className="font-bold text-indigo-600">Active</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Social 1-Click Embed:</span>
                      <span className="font-bold text-purple-600">Enabled</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                  <h4 className="text-xs font-bold text-orange-900 uppercase tracking-wider mb-1">
                    Multi-Rail Settlement
                  </h4>
                  <p className="text-[11px] text-orange-800 leading-relaxed">
                    Purchase items seamlessly using your creator wallet earnings, protocol FIC tokens, or debit cards without platform fees.
                  </p>
                </div>
              </div>
            </div>

            {/* Center Content */}
            <div className="lg:col-span-9">
              <div className="w-full">
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                      Protocol Commerce Hub
                    </span>
                    <span className="text-xs text-gray-400">• Universal Multi-Rail Settlement</span>
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
                    <span className="gradient-text">Discover</span> Amazing Products
                  </h1>
                  <p className="text-sm text-gray-600">
                    Explore digital merchandise, creator goods, memberships, and physical items with direct cross-module social embedding.
                  </p>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {[
                      {
                        id: 'marketplace',
                        label: 'All Products',
                        icon: <ShoppingBagIcon className="w-5 h-5" />
                      },
                      {
                        id: 'ownit',
                        label: 'Ownit',
                        icon: <CubeIcon className="w-5 h-5" />
                      },
                      {
                        id: 'flamingo',
                        label: 'Flamingo',
                        icon: <UserGroupIcon className="w-5 h-5" />
                      },
                      {
                        id: 'storefront',
                        label: 'Storefront',
                        icon: <StorefrontIcon className="w-5 h-5" />
                      },
                      {
                        id: 'orders',
                        label: 'Orders',
                        icon: <OrdersIcon className="w-5 h-5" />
                      },
                      {
                        id: 'analytics',
                        label: 'Analytics',
                        icon: <ChartBarIcon className="w-5 h-5" />
                      },
                      {
                        id: 'transactions',
                        label: 'Transactions',
                        icon: <CurrencyDollarIcon className="w-5 h-5" />
                      },
                      {
                        id: 'create',
                        label: 'Create',
                        icon: <CreditCardIcon className="w-5 h-5" />
                      }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Filters Section - Only shown on marketplace tab */}
                {activeTab === 'marketplace' && (
                  <div className="glass rounded-2xl shadow-sm border border-white/40 p-5 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                      <div>
                        <label htmlFor="search-input" className="block text-sm font-semibold text-gray-700 mb-2">
                  Search
                        </label>
                        <div className="relative">
                          <input
                            id="search-input"
                            type="text"
                            value={filters.query}
                            onChange={(e) => handleFilterChange('query', e.target.value)}
                            placeholder="Search products..."
                            className="w-full rounded-xl border-gray-200 bg-white/60 backdrop-blur-sm shadow-inner focus:border-orange-500 focus:ring-orange-500 transition-all pl-4 pr-10 py-2.5"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="category-select" className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                        </label>
                        <select
                          id="category-select"
                          value={filters.category}
                          onChange={(e) =>
                            handleFilterChange('category', e.target.value)
                          }
                          className="w-full rounded-xl border-gray-200 bg-white/60 backdrop-blur-sm shadow-inner focus:border-orange-500 focus:ring-orange-500 transition-all py-2.5"
                        >
                          <option value="all">All Categories</option>
                          <option value="electronics">Electronics</option>
                          <option value="clothing">Clothing</option>
                          <option value="home">Home & Garden</option>
                          <option value="books">Books</option>
                          <option value="beauty">Beauty</option>
                          <option value="sports">Sports</option>
                          <option value="toys">Toys</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="min-price-input" className="block text-sm font-semibold text-gray-700 mb-2">
                    Min Price
                          </label>
                          <input
                            id="min-price-input"
                            type="number"
                            value={filters.minPrice}
                            onChange={(e) =>
                              handleFilterChange('minPrice', Number(e.target.value))
                            }
                            className="w-full rounded-xl border-gray-200 bg-white/60 backdrop-blur-sm shadow-inner focus:border-orange-500 focus:ring-orange-500 transition-all py-2.5"
                          />
                        </div>

                        <div>
                          <label htmlFor="max-price-input" className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Price
                          </label>
                          <input
                            id="max-price-input"
                            type="number"
                            value={filters.maxPrice}
                            onChange={(e) =>
                              handleFilterChange('maxPrice', Number(e.target.value))
                            }
                            className="w-full rounded-xl border-gray-200 bg-white/60 backdrop-blur-sm shadow-inner focus:border-orange-500 focus:ring-orange-500 transition-all py-2.5"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="sort-by-select" className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort By
                        </label>
                        <select
                          id="sort-by-select"
                          value={filters.sortBy}
                          onChange={(e) =>
                            handleFilterChange('sortBy', e.target.value as MarketplaceFilters['sortBy'])
                          }
                          className="w-full rounded-xl border-gray-200 bg-white/60 backdrop-blur-sm shadow-inner focus:border-orange-500 focus:ring-orange-500 transition-all py-2.5"
                        >
                          <option value="newest">Newest First</option>
                          <option value="price_asc">Price: Low to High</option>
                          <option value="price_desc">Price: High to Low</option>
                          <option value="rating_desc">Top Rated</option>
                          <option value="popular">Most Popular</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analytics Dashboard */}
                {activeTab === 'analytics' && analytics && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="glass rounded-2xl p-6 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(253,89,0,0.1)] transition-all transform hover:-translate-y-1">
                      <div className="flex items-center">
                        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-3">
                          <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total Products
                          </p>
                          <p className="text-3xl font-bold text-gray-900 mt-1">
                            {analytics.totalProducts}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="glass rounded-2xl p-6 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(253,89,0,0.1)] transition-all transform hover:-translate-y-1">
                      <div className="flex items-center">
                        <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-3">
                          <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total Revenue
                          </p>
                          <p className="text-3xl font-bold text-gray-900 mt-1">
                    ${analytics.totalRevenue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="glass rounded-2xl p-6 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(253,89,0,0.1)] transition-all transform hover:-translate-y-1">
                      <div className="flex items-center">
                        <div className="rounded-xl bg-gradient-to-br from-yellow-50 to-orange-100 p-3">
                          <OrdersIcon className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total Orders
                          </p>
                          <p className="text-3xl font-bold text-gray-900 mt-1">
                            {analytics.totalOrders}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="glass rounded-2xl p-6 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(253,89,0,0.1)] transition-all transform hover:-translate-y-1">
                      <div className="flex items-center">
                        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-3">
                          <StarIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Rating
                          </p>
                          <p className="text-3xl font-bold text-gray-900 mt-1">
                            {analytics.avgRating.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Creation Form */}
                {activeTab === 'create' && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Product</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="create-product-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                        </label>
                        <input
                          id="create-product-name"
                          type="text"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Enter product name"
                        />
                      </div>

                      <div>
                        <label htmlFor="create-product-price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                        </label>
                        <input
                          id="create-product-price"
                          type="number"
                          value={newProduct.price || ''}
                          onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label htmlFor="create-product-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                        </label>
                        <select
                          id="create-product-category"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="">Select category</option>
                          <option value="electronics">Electronics</option>
                          <option value="clothing">Clothing</option>
                          <option value="home">Home & Garden</option>
                          <option value="books">Books</option>
                          <option value="beauty">Beauty</option>
                          <option value="sports">Sports</option>
                          <option value="toys">Toys</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="create-product-platform" className="block text-sm font-medium text-gray-700 mb-1">
                  Platform
                        </label>
                        <select
                          id="create-product-platform"
                          value={newProduct.platform}
                          onChange={(e) => setNewProduct({...newProduct, platform: e.target.value as typeof newProduct.platform})}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="storefront">Storefront</option>
                          <option value="ownit">Ownit</option>
                          <option value="flamingo">Flamingo</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="create-product-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                        </label>
                        <textarea
                          id="create-product-description"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          rows={4}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Describe your product"
                        ></textarea>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="create-product-image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                        </label>
                        <input
                          id="create-product-image"
                          type="text"
                          value={newProduct.imageUrl}
                          onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleCreateProductSubmit}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
                      >
                Create Product
                      </button>
                    </div>
                  </div>
                )}

                {/* Products List */}
                {(activeTab === 'marketplace' ||
          activeTab === 'ownit' ||
          activeTab === 'flamingo' ||
          activeTab === 'storefront') && (
                  <div>
                    {loadingProducts ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {activeTab === 'marketplace'
                            ? 'Start exploring or create your first product!'
                            : `No ${activeTab} products available yet.`}
                        </p>
                        {user && (
                          <div className="mt-6">
                            <button
                              onClick={() => setActiveTab('create')}
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                      Create Product
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {(activeTab === 'marketplace'
                          ? filteredProducts
                          : filteredProducts.filter((p) => (p.platform || 'marketplace') === activeTab)
                        ).map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onEmbedClick={(prod) => setEmbedProduct(prod)}
                            onAddToCart={() => setCheckoutProduct(product)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Orders List */}
                {activeTab === 'orders' && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loadingOrders ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {orders.length > 0 ? (
                          orders.map((order) => (
                            <li key={order.id} className="py-4 px-6 hover:bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">
                            Order #{order.id.substring(0, 8)}
                                  </p>
                                  <p className="text-sm text-gray-500">{order.date}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900">
                            ${order.total}
                                  </p>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      order.status === 'delivered'
                                        ? 'bg-green-100 text-green-800'
                                        : order.status === 'shipped'
                                          ? 'bg-blue-100 text-blue-800'
                                          : order.status === 'processing'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="py-12 text-center">
                            <p className="text-gray-500">No orders yet</p>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                )}

                {/* Transactions List */}
                {activeTab === 'transactions' && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loadingTransactions ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {transactions.length > 0 ? (
                          transactions.map((transaction) => (
                            <li
                              key={transaction.id}
                              className="py-4 px-6 hover:bg-gray-50"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">
                            Transaction #{transaction.id.substring(0, 8)}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {transaction.timestamp}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p
                                    className={`font-medium ${
                                      transaction.type === 'purchase' ||
                              transaction.type === 'gift'
                                        ? 'text-red-600'
                                        : 'text-green-600'
                                    }`}
                                  >
                                    {transaction.type === 'purchase' ||
                            transaction.type === 'gift'
                                      ? '-'
                                      : '+'}
                            ${transaction.amount}
                                  </p>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      transaction.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : transaction.status === 'pending'
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : transaction.status === 'refunded'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="py-12 text-center">
                            <p className="text-gray-500">No transactions yet</p>
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Trending Deals</h3>
                  {/* Additional right column content can go here */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Checkout & Multi-Rail Settlement Modal */}
        {checkoutProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 animate-slide-up">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700">
                    Protocol Settlement
                  </span>
                  <h3 className="text-lg font-black text-gray-900 mt-1">Complete Purchase</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCheckoutProduct(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Item Summary */}
              <div className="flex items-center gap-4 py-4 border-b border-gray-100">
                <img
                  src={checkoutProduct.imageUrl || (checkoutProduct.images ? checkoutProduct.images[0] : 'https://via.placeholder.com/100')}
                  alt={checkoutProduct.name}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{checkoutProduct.name}</h4>
                  <p className="text-xs text-gray-500 capitalize">{checkoutProduct.category || 'General'} • {checkoutProduct.platform || 'Marketplace'}</p>
                  <p className="text-base font-black text-indigo-600 mt-0.5">
                    ${checkoutProduct.price.toFixed(2)} {checkoutProduct.currency || 'USD'}
                  </p>
                </div>
              </div>

              {/* Payment Rail Options */}
              <div className="my-5">
                <label className="block text-xs font-black uppercase tracking-wider text-gray-600 mb-3">
                  Select Settlement Rail
                </label>
                <div className="space-y-2.5">
                  {/* Platform Earnings Option */}
                  <div
                    onClick={() => setSelectedPaymentRail('earnings')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                      selectedPaymentRail === 'earnings'
                        ? 'border-green-600 bg-green-50/40 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-black text-sm">
                        $
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">Platform Earnings Wallet</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-green-200 text-green-800">0% Fee</span>
                        </div>
                        <p className="text-[11px] text-gray-500">Available: $450.00 • Instant Settlement</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentRail"
                      checked={selectedPaymentRail === 'earnings'}
                      onChange={() => setSelectedPaymentRail('earnings')}
                      className="text-green-600 focus:ring-green-500"
                    />
                  </div>

                  {/* FIC Tokens Option */}
                  <div
                    onClick={() => setSelectedPaymentRail('fic')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                      selectedPaymentRail === 'fic'
                        ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xs">
                        FIC
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">FIC Protocol Tokens</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-200 text-blue-800">Decentralized</span>
                        </div>
                        <p className="text-[11px] text-gray-500">Available: 1,250 FIC (1 FIC ≈ $1.00 USD)</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentRail"
                      checked={selectedPaymentRail === 'fic'}
                      onChange={() => setSelectedPaymentRail('fic')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  {/* Debit / Credit Card */}
                  <div
                    onClick={() => setSelectedPaymentRail('card')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                      selectedPaymentRail === 'card'
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        💳
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-900">Debit / Credit Card (Fiat)</span>
                        <p className="text-[11px] text-gray-500">Stripe / Paystack • Visa, MasterCard, Verve</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentRail"
                      checked={selectedPaymentRail === 'card'}
                      onChange={() => setSelectedPaymentRail('card')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Protocol Settlement Guarantee */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600 mb-6 flex items-start gap-2">
                <span>🛡️</span>
                <span>Protected by FingerMobile Protocol™ Buyer & Seller Guarantee. Escrow released upon buyer confirmation.</span>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCheckoutProduct(null)}
                  disabled={isProcessingOrder}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCompletePurchase}
                  disabled={isProcessingOrder}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
                >
                  {isProcessingOrder ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Settling Order...</span>
                    </>
                  ) : (
                    <span>Confirm & Pay (${checkoutProduct.price.toFixed(2)})</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Social Embed Modal */}
        <SocialEmbedModal
          isOpen={Boolean(embedProduct)}
          onClose={() => setEmbedProduct(null)}
          product={
            embedProduct
              ? {
                id: String(embedProduct.id),
                name: embedProduct.name,
                price: embedProduct.price,
                currency: embedProduct.currency || 'USD',
                imageUrl: embedProduct.imageUrl || (embedProduct.images ? embedProduct.images[0] : undefined),
                platform: 'marketplace',
                description: embedProduct.description
              }
              : null
          }
        />
      </div>

    </MainLayout>
  );
};

export default MarketplacePage;
