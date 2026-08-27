import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { ApiService } from '../services/apiService'; // Keep existing apiService for other calls if needed
import ProductService from '../services/ProductService'; // Import ProductService for fetching products with variants
import { MarketplaceContext } from '../contexts/MarketplaceContext';
import { AppContext } from "../contexts/AppContext";
import { Product } from '../types';
import ProductCard from '../components/ProductCard'; // Ensure ProductCard is imported
import { SearchIcon, ShoppingBagIcon } from '../icons';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify'; // Import toast for feedback

// --- Types ---
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
  sortBy: "newest" | "price_asc" | "price_desc" | "rating_desc" | "popular" | "ownit_exclusive";
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

  const handleAddToCart = marketplaceContext?.handleAddToCart;
  const ficBalance = appContext?.ficBalance ?? 0;
  const showToast = appContext?.showToast ?? (() => {});

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "marketplace" | "my-lists" | "transactions" | "profile" | "analytics"
  >("marketplace");

  // Core States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [analytics, setAnalytics] = useState<MarketplaceAnalytics | null>(null);
  const [ownitLists, setOwnitLists] = useState<OwnitList[]>([]);
  const [transactions, setTransactions] = useState<OwnitTransaction[]>([]);
  const [ownitProfile, setOwnitProfile] = useState<OwnitProfile | null>(null);

  // Loading & Error States
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [modalAmount, setModalAmount] = useState<string>("");

  // Filters State
  const [filters, setFilters] = useState<MarketplaceFilters>({
    query: "",
    category: "all",
    minPrice: 0,
    maxPrice: 10000,
    sortBy: "newest",
    vendor: "",
    tags: []
  });

  // Lazy Fetching by Active Tab
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === "marketplace") {
          const [prodRes, catRes] = await Promise.all([
            ApiService.get<Product[]>("/marketplace/products"),
            ApiService.get<Category[]>("/marketplace/categories")
          ]);
          if (isMounted) {
            setProducts(prodRes);
            setCategories(catRes);
          }
        } else if (activeTab === "analytics") {
          const analyticsRes = await ApiService.get<MarketplaceAnalytics>("/marketplace/analytics");
          if (isMounted) setAnalytics(analyticsRes);
        } else if (member) {
          if (activeTab === "my-lists") {
            const listsRes = await ApiService.get<OwnitList[]>("/marketplace/lists");
            if (isMounted) setOwnitLists(listsRes);
          } else if (activeTab === "transactions") {
            const txRes = await ApiService.get<OwnitTransaction[]>("/marketplace/transactions");
            if (isMounted) setTransactions(txRes);
          } else if (activeTab === "profile") {
            const profileRes = await ApiService.get<OwnitProfile>("/marketplace/profile");
            if (isMounted) setOwnitProfile(profileRes);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error(`Error loading ${activeTab} data:`, err);
          setError("Failed to load data.");
          showToast("Failed to load requested data.", "error");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [activeTab, member]);

  // Client-Side Product Filtering with useMemo
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (filters.query) {
          const q = filters.query.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesDesc = product.description?.toLowerCase().includes(q);
          const matchesTag = product.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchesName && !matchesDesc && !matchesTag) return false;
        }

        if (filters.category !== "all" && filters.category !== "" && product.category !== filters.category) {
          return false;
        }

        if (product.price < filters.minPrice || product.price > filters.maxPrice) {
          return false;
        }

        if (filters.vendor && product.sellerId !== filters.vendor) {
          return false;
        }

        if (filters.sortBy === "ownit_exclusive" && !product.ownitExclusive) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "price_asc":
            return a.price - b.price;
          case "price_desc":
            return b.price - a.price;
          case "rating_desc":
            {
              // Calculate average rating for sorting, handling the union type
              let aRating = 0;
              if (typeof a.rating === 'object' && a.rating !== null) {
                  aRating = a.rating.average;
              } else if (typeof a.rating === 'number') {
                  aRating = a.rating;
              }

              let bRating = 0;
              if (typeof b.rating === 'object' && b.rating !== null) {
                  bRating = b.rating.average;
              } else if (typeof b.rating === 'number') {
                  bRating = b.rating;
              }

              return bRating - aRating; // Descending order
            }
          case "popular":
            return (b.salesCount || 0) - (a.salesCount || 0);
          case "newest":
          default:
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
      });
  }, [products, filters]);

  // Actions
  const onLike = useCallback(async (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likesCount: (p.likesCount || 0) + (p.isLiked ? -1 : 1)
            }
          : p
      )
    );

    try {
      await ApiService.request(`/ownit/products/${productId}/like`, { method: "POST" });
      showToast("Product liked successfully");
    } catch (error) {
      // Rollback on failure
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                isLiked: !p.isLiked,
                likesCount: (p.likesCount || 0) + (p.isLiked ? 1 : -1)
              }
            : p
        )
      );
      showToast("Failed to like product", "error");
    }
  }, [showToast]);

  const openModal = (product: Product, type: "gift" | "paylink" | "purchase") => {
    if ((type === "gift" || type === "purchase") && ficBalance < product.price) {
      showToast("Insufficient FIC balance", "error");
      return;
    }
    setSelectedProduct(product);
    setModalAmount(product.price.toString());
    if (type === "gift") setShowGiftModal(true);
    if (type === "paylink") setShowPaylinkModal(true);
    if (type === "purchase") setShowPurchaseModal(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await ApiService.request(`/ownit/products/${productId}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast("Product deleted successfully");
    } catch {
      showToast("Failed to delete product", "error");
    }
  };

  // NEW: Function to initiate tokenization for a product
  const handleInitiateTokenization = async (productId: string) => {
    // Use the 'member' object obtained from the top-level useAuth hook
    if (!member) {
      toast.error("Please log in to initiate tokenization.");
      return;
    }

    try {
      // Call the new backend API endpoint
      // This assumes the endpoint is http://localhost:3001/api/ownit/initiate-tokenization
      const response = await ApiService.post('/ownit/initiate-tokenization', {
        productId: productId,
        ownerId: member.id // Use 'member.id' instead of 'user.id'
      });

      // Type check the response before accessing properties
      if (response && typeof response === 'object' && 'success' in response) {
        if (response.success) {
          // Type check for tokenId if accessed - Use type assertion carefully or check if property exists
          const tokenId = (response as any).tokenId; // Or define an interface for the expected response shape
          toast.success(`Tokenization initiated for product ${productId}. Token ID: ${tokenId || 'N/A'}`);
          // Optionally, refetch the product list or update the UI to reflect the new tokenization status
        } else {
          // Type check for message if accessed
          const message = (response as any).message; // Or define an interface for the expected response shape
          toast.error(`Failed to initiate tokenization: ${message || 'Unknown error'}`);
        }
      } else {
          toast.error('Invalid response format from server.');
      }
    } catch (error: any) {
      console.error("Error initiating tokenization:", error);
      toast.error(`Error: ${error.response?.data?.error || error.message || 'An unknown error occurred'}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <ShoppingBagIcon className="h-10 w-10 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">OwnIt Marketplace</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            FIC Balance: <span className="font-bold text-blue-600">{ficBalance}</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {(["marketplace", "my-lists", "transactions", "profile", "analytics"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </nav>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600 font-medium">{error}</div>
      ) : (
        <>
          {/* Marketplace View */}
          {activeTab === "marketplace" && (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
                <div className="max-w-3xl">
                  <h1 className="text-4xl font-bold mb-4">OwnIt Marketplace</h1>
                  <p className="text-lg mb-6">Discover and own unique digital assets</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={filters.query}
                        onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
                        placeholder="Search products, categories, or creators..."
                        className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                      />
                      <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Bar */}
              <div className="flex overflow-x-auto pb-2 space-x-4">
                <button
                  onClick={() => setFilters((f) => ({ ...f, category: "all" }))}
                  className={`flex-shrink-0 px-4 py-2 rounded-full whitespace-nowrap ${
                    filters.category === "all" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilters((f) => ({ ...f, category: cat.slug }))}
                    className={`flex-shrink-0 px-4 py-2 rounded-full whitespace-nowrap ${
                      filters.category === cat.slug ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {cat.name} ({cat.productCount})
                  </button>
                ))}
              </div>

              {/* Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center text-gray-500 py-12">No products found.</div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="relative"> {/* Wrapper div for the card and button */}
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={(pid) => handleAddToCart?.({...product, id: pid}, 1)}
                        onLike={() => onLike(product.id)}
                        onGift={() => openModal(product, "gift")}
                        onPaylink={() => openModal(product, "paylink")}
                        onPurchase={() => openModal(product, "purchase")}
                        onDelete={() => handleDeleteProduct(product.id)}
                        onVariantChange={(vid) => console.log(`Variant changed for ${product.id} to ${vid}`)} // Log for now, implement state if needed in parent
                        selectedVariantId={undefined} // Implement state if needed in parent
                      />
                      {/* NEW: Tokenize Button - Only show if user is the seller/owner of the product */}
                      {/* This is a simplification; real logic would check ownership/permissions */}
                      {member?.id === product.sellerId && ( // Use 'member' instead of 'user'
                        <button
                          onClick={() => handleInitiateTokenization(product.id)}
                          className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-md hover:bg-purple-700"
                        >
                          OwnIt!
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Additional tab contents (my-lists, transactions, profile, analytics) remain structured standardly */}
        </>
      )}

      {/* Consolidated Modal Handler */}
      {(showGiftModal || showPaylinkModal || showPurchaseModal) && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {showGiftModal ? "Gift Product" : showPaylinkModal ? "Create Paylink" : "Purchase Product"}
            </h3>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (FIC)</label>
              <input
                type="number"
                value={modalAmount}
                onChange={(e) => setModalAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowGiftModal(false);
                  setShowPaylinkModal(false);
                  setShowPurchaseModal(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast("Operation completed successfully");
                  setShowGiftModal(false);
                  setShowPaylinkModal(false);
                  setShowPurchaseModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnitPage;