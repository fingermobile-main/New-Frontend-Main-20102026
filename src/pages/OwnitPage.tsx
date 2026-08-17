import React, { useState, useEffect, useContext } from 'react';

/*
 * FingerMobile Protocol™ - Ownit Marketplace Page Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import { ApiService } from '../services/apiService';

import { MarketplaceContext } from '../contexts/MarketplaceContext';
import { AppContext } from "../contexts/AppContext";
import { Product, Member } from '../types';
import apiService from '../services/apiService';
import ProductCard from '../components/ProductCard';
import {
  OwnitIcon,
  SearchIcon,
  FilterIcon,
  SortIcon,
  CartIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
  GiftIcon,
  LinkIcon
} from '../icons';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';


// Types for enhanced OwnIt features
type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  productCount: number;
};

type MarketplaceFilters = {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy:
    | "newest"
    | "price_asc"
    | "price_desc"
    | "rating_desc"
    | "popular"
    | "ownit_exclusive";
  vendor: string;
  tags: string[];
};

type MarketplaceAnalytics = {
  totalProducts: number;
  ownitExclusive: number;
  totalRevenue: number;
  avgRating: number;
  trendingCategories: Category[];
  featuredProducts: Product[];
};

type OwnitList = {
  id: string;
  name: string;
  description?: string;
  products: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

type OwnitTransaction = {
  id: string;
  productId: string;
  type: "purchase" | "gift" | "trade" | "tokenization";
  amount: number;
  currency: string;
  timestamp: string;
  status: "completed" | "pending" | "failed" | "refunded";
};

type OwnitProfile = {
  id: string;
  memberId: string;
  displayName: string;
  bio?: string;
  avatar: string;
  coverImage?: string;
  isVerified: boolean;
  followerCount: number;
  followingCount: number;
  ownitListCount: number;
  totalOwnitValue: number;
  joinDate: string;
};

const OwnitPage: React.FC = () => {
  const { member } = useAuth();
  const marketplaceContext = useContext(MarketplaceContext);
  const appContext = useContext(AppContext);
  
  // Add null checks with fallback values
  const handleAddToCart = marketplaceContext?.handleAddToCart || (() => {});
  const ficBalance = appContext?.ficBalance || 0;
  const showToast = appContext?.showToast || (() => {});
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "marketplace" | "my-lists" | "transactions" | "profile" | "analytics"
  >("marketplace");
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [giftAmount, setGiftAmount] = useState("");
  const [paylinkAmount, setPaylinkAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [filters, setFilters] = useState<MarketplaceFilters>({
    query: "",
    category: "all",
    minPrice: 0,
    maxPrice: 10000,
    sortBy: "newest",
    vendor: "",
    tags: []
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<MarketplaceAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(true);
  const [ownitLists, setOwnitLists] = useState<OwnitList[]>([]);
  const [loadingLists, setLoadingLists] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<OwnitTransaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);
  const [ownitProfile, setOwnitProfile] = useState<OwnitProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all OwnIt data
  useEffect(() => {
    const fetchOwnitData = async () => {
      try {
        setLoadingProducts(true);
        setLoadingCategories(true);
        setLoadingAnalytics(true);
        setLoadingLists(true);
        setLoadingTransactions(true);
        setLoadingProfile(true);
        setError(null);

        // Fetch products
        const productsResponse = await ApiService.get<any>("/marketplace/products");
        setProducts(productsResponse);

        // Fetch categories
        const categoriesResponse =
          await ApiService.get<any>("/marketplace/categories");
        setCategories(categoriesResponse);

        // Fetch analytics
        const analyticsResponse = await ApiService.get<any>("/marketplace/analytics");
        setAnalytics(analyticsResponse);

        // Fetch member-specific data if logged in
        if (member) {
          // Fetch member's ownit lists
          const listsResponse = await ApiService.get<any>("/marketplace/lists");
          setOwnitLists(listsResponse);

          // Fetch member's transactions
          const transactionsResponse = await ApiService.get<OwnitTransaction[]>(
            "/marketplace/transactions",
          );
          setTransactions(transactionsResponse);

          // Fetch member's profile
          const profileResponse = await ApiService.get<any>("/marketplace/profile");
          setOwnitProfile(profileResponse);
        }
      } catch (err) {
        console.error("Error fetching OwnIt data:", err);
        setError("Failed to fetch OwnIt data.");
        showToast("Failed to fetch OwnIt data.", "error");
      } finally {
        setLoadingProducts(false);
        setLoadingCategories(false);
        setLoadingAnalytics(false);
        setLoadingLists(false);
        setLoadingTransactions(false);
        setLoadingProfile(false);
      }
    };

    fetchOwnitData();
  }, [member, showToast]);

  // Apply filters to products
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (filters.query) {
      const query = filters.query.toLowerCase();
      result = result.filter(
        (product: Product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.tags?.some((tag: string) => tag.toLowerCase().includes(query)),
      );
    }

    // Apply category filter
    if (filters.category !== "all" && filters.category !== "") {
      result = result.filter(
        (product) => product.category === filters.category,
      );
    }

    // Apply price filter
    result = result.filter(
      (product) =>
        product.price >= filters.minPrice && product.price <= filters.maxPrice,
    );

    // Apply vendor filter
    if (filters.vendor) {
      result = result.filter((product) => product.sellerId === filters.vendor);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating_desc":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popular":
        result.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
        break;
      case "ownit_exclusive":
        // Filter for ownit exclusive products
        result = result.filter((product) => product.ownitExclusive || false);
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime(),
        );
        break;
    }

    setFilteredProducts(result);
  }, [filters, products]);

  const onLike = async (productId: string) => {
    try {
      // Optimistically update UI
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                isLiked: !p.isLiked,
                likesCount: (p.likesCount || 0) + (p.isLiked ? -1 : 1)
              }
            : p,
        ),
      );

      // Update in database
      await ApiService.request(`/ownit/products/${productId}/like`, {
        method: "POST"
      });
      showToast("Product liked successfully");
    } catch (error) {
      // Revert UI if API fails
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                isLiked: !p.isLiked,
                likesCount: (p.likesCount || 0) + (p.isLiked ? -1 : 1)
              }
            : p,
        ),
      );
      showToast("Failed to like product", "error");
    }
  };

  const onAddComment = async (productId: string, comment: string) => {
    try {
      // In a real app, this would add to the database
      showToast("Comment added successfully");
    } catch (error) {
      showToast("Failed to add comment", "error");
    }
  };

  const onOpenGiftModal = (product: Product) => {
    if (ficBalance <= 0) {
      showToast("Insufficient FIC balance", "error");
      return;
    }

    setSelectedProduct(product);
    setGiftAmount(product.price.toString());
    setShowGiftModal(true);
  };

  const onOpenPaylinkModal = (product: Product) => {
    setSelectedProduct(product);
    setPaylinkAmount(product.price.toString());
    setShowPaylinkModal(true);
  };

  const onOpenPurchaseModal = (product: Product) => {
    if (ficBalance < product.price) {
      showToast("Insufficient FIC balance", "error");
      return;
    }

    setSelectedProduct(product);
    setPurchaseAmount(product.price.toString());
    setShowPurchaseModal(true);
  };

  const onVote = async (productId: string, vote: "up" | "down") => {
    try {
      // In a real app, this would add to the database
      showToast(`Vote ${vote} recorded successfully`);
    } catch (error) {
      showToast("Failed to record vote", "error");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await ApiService.request(`/ownit/products/${productId}`, {
        method: "DELETE"
      });
      setProducts(products.filter((p) => p.id !== productId));
      showToast("Product deleted successfully");
    } catch (error) {
      showToast("Failed to delete product", "error");
    }
  };

  const handleTokenizeProduct = async (productId: string) => {
    try {
      // In a real app, this would tokenize the product on the blockchain
      showToast("Product tokenized successfully");
    } catch (error) {
      showToast("Failed to tokenize product", "error");
    }
  };

  const handleAiAssist = async (productId: string) => {
    try {
      // In a real app, this would call AI services
      showToast("AI assistance requested successfully");
    } catch (error) {
      showToast("Failed to request AI assistance", "error");
    }
  };

  // Handle adding to an ownit list
  const handleAddToOwnitList = async (productId: string, listId: string) => {
    try {
      await ApiService.request(`/ownit/lists/${listId}/products`, {
        method: "POST",
        body: JSON.stringify({ productId })
      });

      showToast("Added to OwnIt list");
    } catch (error) {
      showToast("Failed to add to list", "error");
    }
  };

  // Render marketplace
  const renderMarketplace = () => {
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">OwnIt Marketplace</h1>
            <p className="text-lg mb-6">
              Discover and own unique digital assets
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={filters.query}
                  onChange={(e) => setFilters({ ...filters, query: e.target.value })
                  }
                  placeholder="Search products, categories, or creators..."
                  className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
              <button className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex overflow-x-auto pb-2 space-x-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setFilters({ ...filters, category: category.slug })
              }
              className={`flex-shrink-0 px-4 py-2 rounded-full whitespace-nowrap ${
                filters.category === category.slug
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name} ({category.productCount})
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loadingProducts ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-600">Error: {error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="font-semibold text-lg">No products found.</p>
            <p className="text-sm mt-2">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={() =>
                setFilters({
                  query: "",
                  category: "all",
                  minPrice: 0,
                  maxPrice: 10000,
                  sortBy: "newest",
                  vendor: "",
                  tags: []
                })
              }
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() =>
                  handleAddToCart ? handleAddToCart(product, 1) : undefined
                }
                onLike={() => onLike(product.id)}
                onComment={(comment: string) => onAddComment(product.id, comment)}
                onGift={() => onOpenGiftModal(product)}
                onPaylink={() => onOpenPaylinkModal(product)}
                onVote={(vote: "up" | "down") => onVote(product.id, vote)}
                onDelete={() => handleDeleteProduct(product.id)}
                onTokenize={() => handleTokenizeProduct(product.id)}
                onAiAssist={() => handleAiAssist(product.id)}
                onPurchase={() => onOpenPurchaseModal(product)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render my lists
  const renderMyLists = () => {
    if (loadingLists) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My OwnIt Lists</h2>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
            Create New List
          </button>
        </div>

        {ownitLists.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="font-semibold text-lg">
              You don't have any lists yet.
            </p>
            <p className="text-sm mt-2">
              Create your first list to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownitLists.map((list) => (
              <div
                key={list.id}
                className="bg-white rounded-lg shadow p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{list.name}</h3>
                  <button className="text-gray-400 hover:text-gray-600" aria-label="Button"><svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                      ></path>
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-4">{list.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {list.products.length} items
                  </span>
                  <span
                    className={`text-sm ${list.isPublic ? "text-green-600" : "text-gray-500"}`}
                  >
                    {list.isPublic ? "Public" : "Private"}
                  </span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm">
                    View
                  </button>
                  <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render transactions
  const renderTransactions = () => {
    if (loadingTransactions) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          My Transactions
        </h2>

        {transactions.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="font-semibold text-lg">No transactions yet.</p>
            <p className="text-sm mt-2">
              Start purchasing items to see your transaction history.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Product Name
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {transaction.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.amount} {transaction.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : transaction.status === "failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // Render profile
  const renderProfile = () => {
    if (loadingProfile) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          My OwnIt Profile
        </h2>

        {ownitProfile ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center">
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src={ownitProfile.avatar}
                  alt={ownitProfile.displayName}
                 />
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {ownitProfile.displayName}
                  </h3>
                  <p className="text-sm text-gray-500">{ownitProfile.bio}</p>
                </div>
              </div>

              <div className="mt-4 flex space-x-6">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-gray-900">
                    {ownitProfile.followerCount}
                  </span>
                  <span className="ml-1">Followers</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-gray-900">
                    {ownitProfile.followingCount}
                  </span>
                  <span className="ml-1">Following</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-gray-900">
                    {ownitProfile.ownitListCount}
                  </span>
                  <span className="ml-1">Lists</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-gray-900">
                    ${ownitProfile.totalOwnitValue}
                  </span>
                  <span className="ml-1">Total Value</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Join Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(ownitProfile.joinDate).toLocaleDateString()}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Verification
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {ownitProfile.isVerified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Not Verified
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <p className="font-semibold text-lg">Profile not available</p>
            <p className="text-sm mt-2">Please log in to view your profile.</p>
          </div>
        )}
      </div>
    );
  };

  // Render analytics
  const renderAnalytics = () => {
    if (loadingAnalytics || !analytics) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">OwnIt Analytics</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <span className="text-2xl">🛍️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold">{analytics.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <span className="text-2xl">🔒</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  OwnIt Exclusive
                </p>
                <p className="text-2xl font-bold">{analytics.ownitExclusive}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold">
                  ${analytics.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {analytics.avgRating.toFixed(1)} ⭐
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Featured Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.featuredProducts.slice(0, 6).map((product) => (
              <div key={product.id} className="border rounded-lg p-4 flex">
                <img
                  src={product.imageUrl || "/placeholder-product.jpg"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded mr-4"
                 />
                <div className="flex-1">
                  <h4 className="font-medium truncate">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="font-bold text-blue-600">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Categories */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Trending Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.trendingCategories.slice(0, 6).map((category) => (
              <div
                key={category.id}
                className="border rounded-lg p-4 text-center"
              >
                <div className="text-2xl mb-2">{category.icon || "📦"}</div>
                <h4 className="font-medium">{category.name}</h4>
                <p className="text-sm text-gray-500">
                  {category.productCount} products
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <OwnitIcon className="h-10 w-10 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">
            OwnIt Marketplace
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            FIC Balance:{" "}
            <span className="font-bold text-blue-600">{ficBalance}</span>
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("marketplace")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "marketplace"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab("my-lists")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "my-lists"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            My Lists
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "transactions"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "profile"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "analytics"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "marketplace" && renderMarketplace()}
      {activeTab === "my-lists" && renderMyLists()}
      {activeTab === "transactions" && renderTransactions()}
      {activeTab === "profile" && renderProfile()}
      {activeTab === "analytics" && renderAnalytics()}

      {/* Gift Modal */}
      {showGiftModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Gift Product</h3>
            <div className="flex items-center mb-4">
              <img
                src={selectedProduct.imageUrl || "/placeholder-product.jpg"}
                alt={selectedProduct.name}
                className="w-16 h-16 object-cover rounded mr-4"
               />
              <div>
                <p className="font-medium">{selectedProduct.name}</p>
                <p className="text-gray-500">${selectedProduct.price}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (FIC)
              </label>
              <input
                type="number"
                value={giftAmount}
                onChange={(e) => setGiftAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowGiftModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Process gift
                  showToast("Gift sent successfully");
                  setShowGiftModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send Gift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paylink Modal */}
      {showPaylinkModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Paylink</h3>
            <div className="flex items-center mb-4">
              <img
                src={selectedProduct.imageUrl || "/placeholder-product.jpg"}
                alt={selectedProduct.name}
                className="w-16 h-16 object-cover rounded mr-4"
               />
              <div>
                <p className="font-medium">{selectedProduct.name}</p>
                <p className="text-gray-500">${selectedProduct.price}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (FIC)
              </label>
              <input
                type="number"
                value={paylinkAmount}
                onChange={(e) => setPaylinkAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPaylinkModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Process paylink creation
                  showToast("Paylink created successfully");
                  setShowPaylinkModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Paylink
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Purchase Product</h3>
            <div className="flex items-center mb-4">
              <img
                src={selectedProduct.imageUrl || "/placeholder-product.jpg"}
                alt={selectedProduct.name}
                className="w-16 h-16 object-cover rounded mr-4"
               />
              <div>
                <p className="font-medium">{selectedProduct.name}</p>
                <p className="text-gray-500">${selectedProduct.price}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (FIC)
              </label>
              <input
                type="number"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Process purchase
                  showToast("Purchase completed successfully");
                  setShowPurchaseModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnitPage;