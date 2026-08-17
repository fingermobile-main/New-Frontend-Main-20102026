import React, { useEffect, useState } from 'react';
/*
 * FingerMobile Protocol™ - Marketplace Page Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import { ApiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import MainLayout from '../components/layout/MainLayout';
import PageHeader from '../components/PageHeader';
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
  sortBy: "newest" | "price_asc" | "price_desc" | "rating_desc" | "popular";
  platform: "all" | "ownit" | "flamingo" | "storefront";
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
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  currency: string;
  date: string;
  buyerId: string;
};

type UnifiedTransaction = {
  id: string;
  type: "purchase" | "gift" | "trade" | "refund";
  platform: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: "completed" | "pending" | "failed" | "refunded";
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
    | "marketplace"
    | "ownit"
    | "flamingo"
    | "storefront"
    | "orders"
    | "analytics"
    | "transactions"
    | "create"
  >("marketplace");
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    query: "",
    category: "all",
    minPrice: 0,
    maxPrice: 10000,
    sortBy: "newest",
    platform: "all"
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<MarketplaceAnalytics | null>(null);
  const [orders, setOrders] = useState<UnifiedOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<UnifiedTransaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);
  
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
          const productsResponse = await ApiService.request<{ data?: ApiProductResponse[] }>(
            "/marketplace/unified-products",
          );
          const apiProducts = productsResponse?.data || [];
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
          // Fallback mock data
          setProducts([
            {
              id: '1',
              name: 'Sample Product 1',
              description: 'A great product for testing',
              price: 29.99,
              currency: 'USD',
              images: ['https://via.placeholder.com/300'],
              category: 'electronics',
              imageUrl: 'https://via.placeholder.com/300',
              rating: 4.5,
              sellerId: 'seller1',
              stock: 10,
              platform: 'storefront',
            },
            {
              id: '2',
              name: 'Sample Product 2',
              description: 'Another test product',
              price: 49.99,
              currency: 'USD',
              images: ['https://via.placeholder.com/300'],
              category: 'clothing',
              imageUrl: 'https://via.placeholder.com/300',
              rating: 4.0,
              sellerId: 'seller2',
              stock: 5,
              platform: 'ownit',
            },
            {
              id: '3',
              name: 'Sample Product 3',
              description: 'Third test product',
              price: 19.99,
              currency: 'USD',
              images: ['https://via.placeholder.com/300'],
              category: 'books',
              imageUrl: 'https://via.placeholder.com/300',
              rating: 5.0,
              sellerId: 'seller3',
              stock: 20,
              platform: 'flamingo',
            }
          ]);
        }

        // Fetch analytics
        try {
          const analyticsResponse =
            await ApiService.request<{ data?: MarketplaceAnalytics }>(
              "/marketplace/analytics",
            );
          setAnalytics(analyticsResponse?.data || null);
        } catch {
          setAnalytics(null);
        }

        // Fetch member-specific data if logged in
        if (user) {
          try {
            const ordersResponse = await ApiService.request<{ data?: UnifiedOrder[] }>(
              "/marketplace/unified-orders",
            );
            setOrders(ordersResponse?.data || []);
          } catch {
            setOrders([]);
          }

          try {
            const transactionsResponse = await ApiService.request<{ data?: UnifiedTransaction[] }>(
              "/marketplace/transactions"
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
          p.name.toLowerCase().includes(filters.query.toLowerCase()) ||
          p.description.toLowerCase().includes(filters.query.toLowerCase()),
      );
    }

    if (filters.category !== "all") {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    filtered = filtered.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice,
    );

    if (filters.platform !== "all") {
      filtered = filtered.filter((p) => (p.platform || 'marketplace') === filters.platform);
    }

    switch (filters.sortBy) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating_desc":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popular":
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
      await ApiService.post("/marketplace/products", {
        ...newProduct,
        sellerId: user?.id
      });

      addToast("Product created successfully!", "success");
      
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: '',
        platform: 'storefront',
        imageUrl: ''
      });
      
      const productsResponse = await ApiService.request<Product[]>(
        "/marketplace/unified-products",
      );
      setProducts(productsResponse || []);
    } catch {
      addToast("Error creating product", "error");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Marketplace"
          description="Discover amazing products across multiple platforms"
        />

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              {
                id: "marketplace",
                label: "All Products",
                icon: <ShoppingBagIcon className="w-5 h-5" />
              },
              {
                id: "ownit",
                label: "Ownit",
                icon: <CubeIcon className="w-5 h-5" />
              },
              {
                id: "flamingo",
                label: "Flamingo",
                icon: <UserGroupIcon className="w-5 h-5" />
              },
              {
                id: "storefront",
                label: "Storefront",
                icon: <StorefrontIcon className="w-5 h-5" />
              },
              {
                id: "orders",
                label: "Orders",
                icon: <OrdersIcon className="w-5 h-5" />
              },
              {
                id: "analytics",
                label: "Analytics",
                icon: <ChartBarIcon className="w-5 h-5" />
              },
              {
                id: "transactions",
                label: "Transactions",
                icon: <CurrencyDollarIcon className="w-5 h-5" />
              },
              {
                id: "create",
                label: "Create",
                icon: <CreditCardIcon className="w-5 h-5" />
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filters Section - Only shown on marketplace tab */}
        {activeTab === "marketplace" && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  id="search-input"
                  type="text"
                  value={filters.query}
                  onChange={(e) => handleFilterChange("query", e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category-select"
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="min-price-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    id="min-price-input"
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", Number(e.target.value))
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="max-price-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    id="max-price-input"
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", Number(e.target.value))
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="sort-by-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  id="sort-by-select"
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleFilterChange("sortBy", e.target.value as MarketplaceFilters["sortBy"])
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
        {activeTab === "analytics" && analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="rounded-md bg-blue-50 p-3">
                  <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Products
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {analytics.totalProducts}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="rounded-md bg-green-50 p-3">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${analytics.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="rounded-md bg-yellow-50 p-3">
                  <OrdersIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {analytics.totalOrders}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="rounded-md bg-purple-50 p-3">
                  <StarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Avg. Rating
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {analytics.avgRating.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Creation Form */}
        {activeTab === "create" && (
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
        {(activeTab === "marketplace" ||
          activeTab === "ownit" ||
          activeTab === "flamingo" ||
          activeTab === "storefront") && (
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
                  {activeTab === "marketplace" 
                    ? "Start exploring or create your first product!"
                    : `No ${activeTab} products available yet.`}
                </p>
                {user && (
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab("create")}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Create Product
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(activeTab === "marketplace"
                  ? filteredProducts
                  : filteredProducts.filter((p) => (p.platform || 'marketplace') === activeTab)
                ).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders List */}
        {activeTab === "orders" && (
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
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "processing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
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
        {activeTab === "transactions" && (
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
                              transaction.type === "purchase" ||
                              transaction.type === "gift"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {transaction.type === "purchase" ||
                            transaction.type === "gift"
                              ? "-"
                              : "+"}
                            ${transaction.amount}
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : transaction.status === "refunded"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
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
    </MainLayout>
  );
};

export default MarketplacePage;