import React from 'react';
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
import apiService from '../services/apiService';
import { Product, Member } from '../types';
import { 
  CartIcon as ShoppingBagIcon,
  StoreIcon as CubeIcon,
  CurrencyNairaIcon as CurrencyDollarIcon,
  FilterIcon as ChartBarIcon,
  MemberGroupIcon as UserGroupIcon,
  PaylinkIcon as GiftIcon,
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

const MarketplacePage: React.FC = () => {
  const { addToast } = useToast();
  const { member: user } = useAuth();
  const [activeTab, setActiveTab] = React.useState<
    | "marketplace"
    | "ownit"
    | "flamingo"
    | "storefront"
    | "orders"
    | "analytics"
    | "transactions"
    | "create"
  >("marketplace");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState<MarketplaceFilters>({
    query: "",
    category: "all",
    minPrice: 0,
    maxPrice: 10000,
    sortBy: "newest",
    platform: "all"
  });
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [analytics, setAnalytics] = React.useState<MarketplaceAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = React.useState<boolean>(true);
  const [orders, setOrders] = React.useState<UnifiedOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = React.useState<boolean>(true);
  const [transactions, setTransactions] = React.useState<UnifiedTransaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = React.useState<boolean>(true);
  const [showGiftModal, setShowGiftModal] = React.useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = React.useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = React.useState(false);
  const [showCreateProductModal, setShowCreateProductModal] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [giftAmount, setGiftAmount] = React.useState("");
  const [paylinkAmount, setPaylinkAmount] = React.useState("");
  const [purchaseAmount, setPurchaseAmount] = React.useState("");
  
  // Product creation state
  const [newProduct, setNewProduct] = React.useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    platform: 'storefront' as const,
    imageUrl: ''
  });

  // Fetch all unified marketplace data
  React.useEffect(() => {
    const fetchMarketplaceData = async () => {
      try {
        setLoadingProducts(true);
        setLoadingAnalytics(true);
        setLoadingOrders(true);
        setLoadingTransactions(true);
        setError(null);

        // Fetch unified products from all platforms
        try {
          const productsResponse = await ApiService.request<any>(
            "/marketplace/unified-products",
          );
          // API returns { success: true, data: [...], pagination: {...} }
          // Transform API response to match frontend Product interface
          const apiProducts = productsResponse?.data || [];
          const transformedProducts = apiProducts.map((product: any) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            currency: 'USD',
            images: product.image_url ? [product.image_url] : ['https://via.placeholder.com/300'],
            category: product.category || 'uncategorized',
            platform: product.platform_type?.toLowerCase() || 'marketplace', // Map platform_type to platform
            imageUrl: product.image_url || 'https://via.placeholder.com/300',
            rating: parseFloat(product.avg_rating) || 0,
            sellerId: product.creator_id?.toString() || 'unknown',
            sellerName: product.seller_name || 'Unknown Seller',
            stockQuantity: parseInt(product.stock_quantity) || 0,
            createdAt: product.created_at,
            updatedAt: product.updated_at
          }));
          setProducts(transformedProducts);
        } catch (productError) {
          console.warn('Failed to fetch products, using mock data:', productError);
          // Use mock data for development
          setProducts([
            {
              id: '1',
              name: 'Sample Product 1',
              description: 'A great product for testing',
              price: 29.99,
              currency: 'USD',
              images: ['https://via.placeholder.com/300'],
              category: 'electronics',
              platform: 'storefront',
              imageUrl: 'https://via.placeholder.com/300',
              rating: 4.5,
              sellerId: 'seller1'
            },
            {
              id: '2',
              name: 'Sample Product 2',
              description: 'Another test product',
              price: 49.99,
              currency: 'USD',
              images: ['https://via.placeholder.com/300'],
              category: 'clothing',
              platform: 'ownit',
              imageUrl: 'https://via.placeholder.com/300',
              rating: 4.0,
              sellerId: 'seller2'
            },
            {
              id: '3',
              name: 'Sample Product 3',
              description: 'Third test product',
              price: 19.99,
              currency: 'USD',
              images: ['https://via.placeholder.com/300'],
              category: 'books',
              platform: 'flamingo',
              imageUrl: 'https://via.placeholder.com/300',
              rating: 5.0,
              sellerId: 'seller3'
            }
          ]);
        }

        // Fetch analytics
        try {
          const analyticsResponse =
            await ApiService.request<any>(
              "/marketplace/analytics",
            );
          // API returns { success: true, data: {...} }
          setAnalytics(analyticsResponse?.data || null);
        } catch (analyticsError) {
          console.warn('Failed to fetch analytics:', analyticsError);
          setAnalytics(null);
        }

        // Fetch member-specific data if logged in
        if (user) {
          // Fetch member's unified orders
          try {
            const ordersResponse = await ApiService.request<any>(
              "/marketplace/unified-orders",
            );
            // API returns { success: true, data: [...], pagination: {...} }
            setOrders(ordersResponse?.data || []);
          } catch (ordersError) {
            console.warn('Failed to fetch orders:', ordersError);
            setOrders([]);
          }

          // Fetch member's transactions
          try {
            const transactionsResponse = await ApiService.request<
              any
            >("/marketplace/transactions");
            // API returns { success: true, data: [...], pagination: {...} }
            setTransactions(transactionsResponse?.data || []);
          } catch (transactionsError) {
            console.warn('Failed to fetch transactions:', transactionsError);
            setTransactions([]);
          }
        }

        setLoadingProducts(false);
        setLoadingAnalytics(false);
        setLoadingOrders(false);
        setLoadingTransactions(false);
      } catch (err) {
        console.error('Marketplace data fetch error:', err);
        setError('Failed to load marketplace data. Please try refreshing the page.');
        // Set all loading states to false even on error
        setLoadingProducts(false);
        setLoadingAnalytics(false);
        setLoadingOrders(false);
        setLoadingTransactions(false);
      }
    };

    // Add user to dependencies to ensure re-fetching when user auth state changes
    fetchMarketplaceData();
  }, [user]);

  // Apply filters when they change
  React.useEffect(() => {
    // Ensure products is always an array
    const productsArray = Array.isArray(products) ? products : [];
    let filtered = productsArray;

    // Apply text search
    if (filters.query) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(filters.query.toLowerCase()) ||
          p.description.toLowerCase().includes(filters.query.toLowerCase()),
      );
    }

    // Apply category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    // Apply price filters
    filtered = filtered.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice,
    );

    // Apply platform filter
    if (filters.platform !== "all") {
      filtered = filtered.filter((p) => p.platform === filters.platform);
    }

    // Apply sorting
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
        // Newest by default
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

  const handleOpenGiftModal = (amount: string) => {
    setGiftAmount(amount);
    setShowGiftModal(true);
  };

  const handleOpenPaylinkModal = (amount: string) => {
    setPaylinkAmount(amount);
    setShowPaylinkModal(true);
  };

  const handleOpenPurchaseModal = (product: Product) => {
    setSelectedProduct(product);
    setPurchaseAmount(product.price.toString());
    setShowPurchaseModal(true);
  };

  const handleGiftSubmit = async () => {
    try {
      // Implement gift functionality
      await ApiService.post("/transactions/gift", {
        recipientId: selectedProduct?.sellerId,
        amount: parseFloat(giftAmount),
        currency: "USD"
      });

      addToast("Gift sent successfully!", "success");
      setShowGiftModal(false);
      setGiftAmount("");
    } catch (error) {
      addToast("Error sending gift", "error");
    }
  };

  const handlePaylinkSubmit = async () => {
    try {
      // Implement paylink functionality
      await ApiService.post("/payments/create-paylink", {
        amount: parseFloat(paylinkAmount),
        description: "Paylink payment"
      });

      addToast("Paylink created successfully!", "success");
      setShowPaylinkModal(false);
      setPaylinkAmount("");
    } catch (error) {
      addToast("Error creating paylink", "error");
    }
  };

  const handlePurchaseSubmit = async () => {
    try {
      // Implement purchase functionality
      if (!selectedProduct) return;

      await ApiService.post("/marketplace/purchase", {
        productId: selectedProduct.id,
        quantity: 1,
        total: parseFloat(purchaseAmount)
      });

      addToast("Purchase completed successfully!", "success");
      setShowPurchaseModal(false);
      setSelectedProduct(null);
    } catch (error) {
      addToast("Error processing purchase", "error");
    }
  };

  const handleCreateProductSubmit = async () => {
    try {
      // Implement product creation functionality
      await ApiService.post("/marketplace/products", {
        ...newProduct,
        sellerId: user?.id
      });

      addToast("Product created successfully!", "success");
      setShowCreateProductModal(false);
      
      // Reset form
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: '',
        platform: 'storefront',
        imageUrl: ''
      });
      
      // Refetch products
      const productsResponse = await ApiService.request<Product[]>(
        "/marketplace/unified-products",
      );
      setProducts(productsResponse || []);
    } catch (error) {
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
                onClick={() => setActiveTab(tab.id as any)}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  value={filters.query}
                  onChange={(e) => handleFilterChange("query", e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", Number(e.target.value))
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleFilterChange("sortBy", e.target.value as any)
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

        {/* Content based on active tab */}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={newProduct.price || ''}
                  onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform
                </label>
                <select
                  value={newProduct.platform}
                  onChange={(e) => setNewProduct({...newProduct, platform: e.target.value as any})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="storefront">Storefront</option>
                  <option value="ownit">Ownit</option>
                  <option value="flamingo">Flamingo</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Describe your product"
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
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
                  : filteredProducts.filter((p) => p.platform === activeTab)
                ).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onGiftClick={() =>
                      handleOpenGiftModal(product.price.toString())
                    }
                    onPaylinkClick={() =>
                      handleOpenPaylinkModal(product.price.toString())
                    }
                    onBuyClick={() => handleOpenPurchaseModal(product)}
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