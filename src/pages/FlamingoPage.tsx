import React from 'react';
import { useAppContext } from "../contexts/AppContext";
import { MarketplaceContext } from '../contexts/MarketplaceContext';
import ProductCard from '../components/ProductCard';
import SubscriptionGate from '../components/shared/SubscriptionGate';
import {
  FlamingoIcon,
  GiftIcon,
  LinkIcon,
  SearchIcon,
  FilterIcon,
  SortIcon,
  CartIcon,
  HeartIcon,
  ShareIcon,
  StarIcon
} from '../icons';
import EnhancedFilterBar from '../components/shared/EnhancedFilterBar';
import type { Product } from '../types';
import apiService from '../services/apiService';
import { 
  flamingoService, 
  FlamingoCategory, 
  FlamingoOutfit, 
  FlamingoSizeRecommendation, 
  FlamingoMeasurements, 
  FlamingoBrandSizing 
} from '../services/flamingoService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

// --- Domain Interface Schema Definitions ---
type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  productCount: number;
};

type Vendor = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalSales: number;
  isVerified: boolean;
};

type MarketplaceFilters = {
  query: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: "newest" | "price_asc" | "price_desc" | "rating_desc" | "popular";
  vendor: string;
  tags: string[];
};

type MarketplaceAnalytics = {
  totalProducts: number;
  totalVendors: number;
  totalRevenue: number;
  avgRating: number;
  trendingCategories: Category[];
  featuredProducts: Product[];
};

type WishListItem = {
  id: string;
  productId: string;
  addedAt: string;
};

type RecentView = {
  id: string;
  productId: string;
  viewedAt: string;
};

type Paylink = {
  id: string;
  productId: string;
  amount: number;
  creatorId: string;
  createdAt: string;
  uses: number;
  isActive: boolean;
};

interface AgeVerificationState {
  isVerified: boolean;
  showAgeGate: boolean;
  birthDate: string | null;
}

// --- Subcomponent: Age Verification Gate ---
interface AgeGateProps {
  onVerify: (birthDate: string) => void;
}

const AgeGate: React.FC<AgeGateProps> = React.memo(({ onVerify }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onVerify(formData.get('birthDate') as string);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <FlamingoIcon className="w-16 h-16 mx-auto mb-4 text-pink-500" />
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Age Verification Required</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            This store contains adult content. You must be 19 years or older to enter.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="birthDate" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              required
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-sm font-medium"
            />
          </div>
          
          <div className="mb-6 bg-gray-50 border border-gray-100 p-4 rounded-xl text-xs text-gray-600 space-y-2">
            <p className="font-bold text-gray-700">By entering, you confirm that:</p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>You are 19 years of age or older</li>
              <li>You agree to our platform criteria policies</li>
              <li>All shipments will be discreetly packaged</li>
            </ul>
          </div>
          
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700 shadow-sm transition-colors"
          >
            Verify Age & Enter
          </button>
        </form>
      </div>
    </div>
  );
});
AgeGate.displayName = 'AgeGate';

// --- Subcomponent: Body Measurement Form ---
interface MeasurementFormProps {
  onSave: (data: Partial<FlamingoMeasurements>) => void;
  onCancel: () => void;
}

const MeasurementForm: React.FC<MeasurementFormProps> = React.memo(({ onSave, onCancel }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSave({
      height_cm: parseFloat(formData.get('height') as string),
      weight_kg: parseFloat(formData.get('weight') as string),
      chest_cm: parseFloat(formData.get('chest') as string),
      waist_cm: parseFloat(formData.get('waist') as string),
      hips_cm: parseFloat(formData.get('hips') as string),
      preferred_fit: formData.get('fit') as any
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Body Measurements Matrix</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="height" className="block text-xs font-semibold text-gray-500 mb-1">Height (cm)</label>
            <input id="height" type="number" step="any" name="height" required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label htmlFor="weight" className="block text-xs font-semibold text-gray-500 mb-1">Weight (kg)</label>
            <input id="weight" type="number" step="any" name="weight" required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label htmlFor="chest" className="block text-xs font-semibold text-gray-500 mb-1">Chest (cm)</label>
            <input id="chest" type="number" step="any" name="chest" required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label htmlFor="waist" className="block text-xs font-semibold text-gray-500 mb-1">Waist (cm)</label>
            <input id="waist" type="number" step="any" name="waist" required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label htmlFor="hips" className="block text-xs font-semibold text-gray-500 mb-1">Hips (cm)</label>
            <input id="hips" type="number" step="any" name="hips" required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label htmlFor="fit" className="block text-xs font-semibold text-gray-500 mb-1">Preferred Fit</label>
            <select id="fit" name="fit" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white">
              <option value="slim">Slim</option>
              <option value="regular">Regular</option>
              <option value="relaxed">Relaxed</option>
              <option value="oversized">Oversized</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="submit" className="flex-1 bg-pink-600 text-white py-2.5 rounded-xl font-bold hover:bg-pink-700 text-sm transition">
            Save Matrix
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold hover:bg-gray-200 text-sm transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
});
MeasurementForm.displayName = 'MeasurementForm';

// --- Subcomponent: Outfit Builder Modeler ---
interface OutfitBuilderProps {
  onCreate: (data: Partial<FlamingoOutfit>) => void;
  onCancel: () => void;
}

const OutfitBuilder: React.FC<OutfitBuilderProps> = React.memo(({ onCreate, onCancel }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onCreate({
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      occasion: formData.get('occasion') as any,
      season: formData.get('season') as any,
      style_tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
      is_public: formData.get('public') === 'on'
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Create New Custom Outfit</h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="outfitName" className="block text-xs font-semibold text-gray-500 mb-1">Outfit Name</label>
            <input id="outfitName" type="text" name="name" required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label htmlFor="outfitDescription" className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
            <textarea id="outfitDescription" name="description" rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="occasion" className="block text-xs font-semibold text-gray-500 mb-1">Occasion</label>
              <select id="occasion" name="occasion" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white">
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="party">Party</option>
                <option value="workout">Workout</option>
                <option value="date">Date Night</option>
              </select>
            </div>
            <div>
              <label htmlFor="season" className="block text-xs font-semibold text-gray-500 mb-1">Season</label>
              <select id="season" name="season" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white">
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
                <option value="winter">Winter</option>
                <option value="all_season">All Season</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="styleTags" className="block text-xs font-semibold text-gray-500 mb-1">Style Tags (comma-separated)</label>
            <input id="styleTags" type="text" name="tags" placeholder="e.g., elegant, sexy, romantic" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label className="flex items-center select-none">
              <input type="checkbox" name="public" className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500" />
              <span className="ml-2 text-xs font-bold text-gray-600">Make this outfit package public</span>
            </label>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="submit" className="flex-1 bg-pink-600 text-white py-2.5 rounded-xl font-bold hover:bg-pink-700 text-sm transition">
            Assemble Outfit
          </button>
          <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold hover:bg-gray-200 text-sm transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
});
OutfitBuilder.displayName = 'OutfitBuilder';

// --- Main Page Component Container ---
const FlamingoPage: React.FC = () => {
  const { showToast } = useAppContext();
  const { user } = useAuth();
  
  // Storage Matrices States
  const [products, setProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [, setVendors] = React.useState<Vendor[]>([]);
  const [, setAnalytics] = React.useState<MarketplaceAnalytics | null>(null);
  const [wishlist, setWishlist] = React.useState<WishListItem[]>([]);
  const [, setRecentViews] = React.useState<RecentView[]>([]);
  const [, setPaylinks] = React.useState<Paylink[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<string>('newest');
  const [showFilters, setShowFilters] = React.useState(false);
  const [cart, setCart] = React.useState<any[]>([]);
  const [activeTab, setActiveTab] = React.useState<'shop' | 'outfits' | 'measurements' | 'recommendations' | 'wishlist'>('shop');
  
  const [filters, setFilters] = React.useState<MarketplaceFilters>({
    query: '',
    category: 'all',
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'newest',
    vendor: 'all',
    tags: []
  });
  
  // Specific Flamingo Custom Domains
  const [, setFlamingoCategories] = React.useState<FlamingoCategory[]>([]);
  const [outfits, setOutfits] = React.useState<FlamingoOutfit[]>([]);
  const [measurements, setMeasurements] = React.useState<FlamingoMeasurements | null>(null);
  const [recommendations, setRecommendations] = React.useState<FlamingoSizeRecommendation[]>([]);
  const [, setBrandSizings] = React.useState<FlamingoBrandSizing[]>([]);
  
  const [ageVerification, setAgeVerification] = React.useState<AgeVerificationState>({
    isVerified: false,
    showAgeGate: true,
    birthDate: null
  });
  const [showMeasurementForm, setShowMeasurementForm] = React.useState(false);
  const [showOutfitBuilder, setShowOutfitBuilder] = React.useState(false);

  // Hydrate Flamingo Domain Elements
  const loadFlamingoData = React.useCallback(async (userId?: string) => {
    try {
      const cats = await flamingoService.getCategories();
      setFlamingoCategories(cats);
      
      if (userId) {
        const userOutfits = await flamingoService.getOutfits(userId);
        setOutfits(userOutfits);
        
        try {
          const userMeasurements = await flamingoService.getMeasurements(userId);
          setMeasurements(userMeasurements);
        } catch {
          console.info('No measurements found for authenticated runtime target.');
        }
        
        const recs = await flamingoService.getSizeRecommendations(userId);
        setRecommendations(recs);
      }
      
      const brands = await flamingoService.getBrandSizings();
      setBrandSizings(brands);
    } catch (error) {
      console.error('Error hydrating specific Flamingo services:', error);
    }
  }, []);

  const loadInitialData = React.useCallback(async () => {
    try {
      setLoading(true);
      
      const productsResponse = await apiService.get('/api/products?category=adult-wellness&limit=100');
      setProducts(productsResponse.data.products || []);
      
      const categoriesResponse = await apiService.get('/api/categories?type=store');
      setCategories(categoriesResponse.data.categories || []);
      
      const vendorsResponse = await apiService.get('/api/vendors?verified=true');
      setVendors(vendorsResponse.data.vendors || []);
      
      const analyticsResponse = await apiService.get('/api/marketplace/analytics');
      setAnalytics(analyticsResponse.data);
      
      if (user) {
        const wishlistResponse = await apiService.get(`/api/users/${user.id}/wishlist`);
        setWishlist(wishlistResponse.data.items || []);
        
        const recentViewsResponse = await apiService.get(`/api/users/${user.id}/recent-views`);
        setRecentViews(recentViewsResponse.data.views || []);
        
        const paylinksResponse = await apiService.get(`/api/users/${user.id}/paylinks`);
        setPaylinks(paylinksResponse.data.paylinks || []);
      }
      
      await loadFlamingoData(user?.id);
      showToast('Welcome to Flamingo - Your Sexual Wellness Store', 'success');
    } catch (error) {
      console.error('Error executing initial endpoint handshakes:', error);
      showToast('Failed to load store tracking registries.', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, loadFlamingoData, showToast]);

  // Compute Layout Filtration Blocks
  React.useEffect(() => {
    let result = [...products];
    
    if (filters.query) {
      const searchNormalized = filters.query.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchNormalized) ||
        p.description?.toLowerCase().includes(searchNormalized)
      );
    }
    
    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }
    
    result = result.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    
    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
        result.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        break;
    }
    
    setFilteredProducts(result);
  }, [filters, products]);

  const handleSearch = React.useCallback((query: string) => {
    setFilters(prev => ({ ...prev, query }));
    setSearchQuery(query);
  }, []);

  const handleCategoryChange = React.useCallback((category: string) => {
    setFilters(prev => ({ ...prev, category }));
    setSelectedCategory(category);
  }, []);

  const handleSortChange = React.useCallback((sort: string) => {
    setFilters(prev => ({ ...prev, sortBy: sort as any }));
    setSortBy(sort);
  }, []);

  const addToCart = React.useCallback((product: Product) => {
    setCart(prev => [...prev, { ...product, quantity: 1 }]);
    showToast(`${product.name} added to shopping cart`, 'success');
  }, [showToast]);

  const toggleWishlist = React.useCallback(async (productId: string) => {
    if (!user) {
      showToast('Please sign in to modify wishlist contexts.', 'warning');
      return;
    }
    
    try {
      const isInWishlist = wishlist.some(item => item.productId === productId);
      
      if (isInWishlist) {
        await apiService.delete(`/api/users/${user.id}/wishlist/${productId}`);
        setWishlist(prev => prev.filter(item => item.productId !== productId));
        showToast('Removed from wishlist container.', 'info');
      } else {
        await apiService.post(`/api/users/${user.id}/wishlist`, { productId });
        setWishlist(prev => [...prev, { id: Date.now().toString(), productId, addedAt: new Date().toISOString() }]);
        showToast('Added to wishlist portfolio.', 'success');
      }
    } catch (error) {
      console.error('Wishlist interaction processing failure:', error);
      showToast('Failed to modify item standing in wishlist.', 'error');
    }
  }, [user, wishlist, showToast]);

  const handleAgeVerification = React.useCallback((birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    if (age >= 19) {
      localStorage.setItem('flamingo_age_verified', 'true');
      setAgeVerification({ isVerified: true, showAgeGate: false, birthDate });
      showToast('Age verification certified successfully.', 'success');
    } else {
      showToast('Compliance lockout: Access denied for clients below 19.', 'error');
    }
  }, [showToast]);

  const saveMeasurements = async (measurementData: Partial<FlamingoMeasurements>) => {
    if (!user) {
      showToast('Please login to save measurements', 'warning');
      return;
    }
    
    try {
      const saved = await flamingoService.saveMeasurements(user.id, measurementData);
      setMeasurements(saved);
      setShowMeasurementForm(false);
      showToast('Measurements saved successfully', 'success');
      
      // Reload recommendations after saving measurements
      const recs = await flamingoService.getSizeRecommendations(user.id);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error saving measurements:', error);
      showToast('Failed to save measurements', 'error');
    }
  };

  const createOutfit = async (outfitData: Partial<FlamingoOutfit>) => {
    if (!user) {
      showToast('Please login to create outfits', 'warning');
      return;
    }
    
    try {
      const outfit = await flamingoService.createOutfit(outfitData);
      setOutfits(prev => [outfit, ...prev]);
      setShowOutfitBuilder(false);
      showToast('Outfit created successfully', 'success');
    } catch (error) {
      console.error('Error creating outfit:', error);
      showToast('Failed to create outfit', 'error');
    }
  };

  // Age Gate Component
  const AgeGate = () => (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <FlamingoIcon className="w-16 h-16 mx-auto mb-4 text-pink-500" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Age Verification Required</h2>
          <p className="text-gray-600">
            This store contains adult content. You must be 19 years or older to enter.
          </p>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleAgeVerification(formData.get('birthDate') as string);
        }}>
          <div className="mb-6">
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              required
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          
          <div className="mb-6 text-sm text-gray-600">
            <p className="mb-2">By entering, you confirm that:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>You are 19 years of age or older</li>
              <li>You agree to our privacy policy</li>
              <li>All shipments will be discreetly packaged</li>
            </ul>
          </div>
          
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            Verify Age & Enter
          </button>
        </form>
      </div>
    </div>
  );

  // Measurement Form Component
  const MeasurementForm = () => (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-bold mb-4">Body Measurements</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        saveMeasurements({
          height_cm: parseFloat(formData.get('height') as string),
          weight_kg: parseFloat(formData.get('weight') as string),
          chest_cm: parseFloat(formData.get('chest') as string),
          waist_cm: parseFloat(formData.get('waist') as string),
          hips_cm: parseFloat(formData.get('hips') as string),
          preferred_fit: formData.get('fit') as any
        });
      }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
            <input id="height" type="number" name="height" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <input id="weight" type="number" name="weight" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="chest" className="block text-sm font-medium text-gray-700 mb-1">Chest (cm)</label>
            <input id="chest" type="number" name="chest" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="waist" className="block text-sm font-medium text-gray-700 mb-1">Waist (cm)</label>
            <input id="waist" type="number" name="waist" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="hips" className="block text-sm font-medium text-gray-700 mb-1">Hips (cm)</label>
            <input id="hips" type="number" name="hips" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="fit" className="block text-sm font-medium text-gray-700 mb-1">Preferred Fit</label>
            <select id="fit" name="fit" className="w-full px-3 py-2 border rounded-lg">
              <option value="slim">Slim</option>
              <option value="regular">Regular</option>
              <option value="relaxed">Relaxed</option>
              <option value="oversized">Oversized</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="submit" className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700">
            Save Measurements
          </button>
          <button type="button" onClick={() => setShowMeasurementForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  // Outfit Builder Component
  const OutfitBuilder = () => (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-bold mb-4">Create Outfit</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        createOutfit({
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          occasion: formData.get('occasion') as any,
          season: formData.get('season') as any,
          style_tags: (formData.get('tags') as string).split(',').map(t => t.trim()),
          is_public: formData.get('public') === 'on'
        });
      }}>
        <div className="space-y-4">
          <div>
            <label htmlFor="outfitName" className="block text-sm font-medium text-gray-700 mb-1">Outfit Name</label>
            <input id="outfitName" type="text" name="name" required className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="outfitDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id="outfitDescription" name="description" rows={3} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="occasion" className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
              <select id="occasion" name="occasion" className="w-full px-3 py-2 border rounded-lg">
                <option value="casual">Casual</option>
                <option value="formal">Formal</option>
                <option value="party">Party</option>
                <option value="workout">Workout</option>
                <option value="date">Date Night</option>
              </select>
            </div>
            <div>
              <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-1">Season</label>
              <select id="season" name="season" className="w-full px-3 py-2 border rounded-lg">
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
                <option value="winter">Winter</option>
                <option value="all_season">All Season</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="styleTags" className="block text-sm font-medium text-gray-700 mb-1">Style Tags (comma-separated)</label>
            <input id="styleTags" type="text" name="tags" placeholder="e.g., elegant, sexy, romantic" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="flex items-center">
              <input type="checkbox" name="public" className="mr-2" />
              <span className="text-sm text-gray-700">Make this outfit public</span>
            </label>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button type="submit" className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700">
            Create Outfit
          </button>
          <button type="button" onClick={() => setShowOutfitBuilder(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  // Show age gate if not verified
  if (ageVerification.showAgeGate && !ageVerification.isVerified) {
    return <AgeGate />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <FlamingoIcon className="w-8 h-8 text-pink-600" />
              <h1 className="text-2xl font-bold text-gray-900">Flamingo</h1>
              <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">Wellness Store</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent w-64"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FilterIcon className="w-6 h-6 text-gray-600" />
              </button>
              
              <div className="relative">
                <CartIcon className="w-6 h-6 text-gray-600" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'shop', label: 'Shop', icon: CartIcon },
              { id: 'outfits', label: 'My Outfits', icon: HeartIcon },
              { id: 'measurements', label: 'Measurements', icon: StarIcon },
              { id: 'recommendations', label: 'Recommendations', icon: StarIcon },
              { id: 'wishlist', label: 'Wishlist', icon: HeartIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-pink-600 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Shop Tab */}
        {activeTab === 'shop' && (
          <div>
            {/* Filters Bar */}
            {showFilters && (
              <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="newest">Newest</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="rating_desc">Highest Rated</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => addToCart(product)}
                  onToggleWishlist={() => toggleWishlist(product.id)}
                  isInWishlist={wishlist.some(item => item.productId === product.id)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Outfits Tab */}
        {activeTab === 'outfits' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Outfits</h2>
              <button
                onClick={() => setShowOutfitBuilder(true)}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
              >
                Create New Outfit
              </button>
            </div>
            
            {showOutfitBuilder && <OutfitBuilder />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {outfits.map(outfit => (
                <div key={outfit.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Outfit Image</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{outfit.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{outfit.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">{outfit.occasion}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{outfit.season}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {outfits.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't created any outfits yet.</p>
                <button
                  onClick={() => setShowOutfitBuilder(true)}
                  className="mt-4 text-pink-600 hover:underline"
                >
                  Create your first outfit
                </button>
              </div>
            )}
          </div>
        )}

        {/* Measurements Tab */}
        {activeTab === 'measurements' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Body Measurements</h2>
              {!measurements && (
                <button
                  onClick={() => setShowMeasurementForm(true)}
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                >
                  Add Measurements
                </button>
              )}
            </div>
            
            {showMeasurementForm && <MeasurementForm />}
            
            {measurements ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Your Measurements</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Height</p>
                    <p className="text-xl font-bold">{measurements.height_cm} cm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="text-xl font-bold">{measurements.weight_kg} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Chest</p>
                    <p className="text-xl font-bold">{measurements.chest_cm} cm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Waist</p>
                    <p className="text-xl font-bold">{measurements.waist_cm} cm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hips</p>
                    <p className="text-xl font-bold">{measurements.hips_cm} cm</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Preferred Fit</p>
                    <p className="text-xl font-bold capitalize">{measurements.preferred_fit}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMeasurementForm(true)}
                  className="mt-6 text-pink-600 hover:underline"
                >
                  Update Measurements
                </button>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-500 mb-4">Add your body measurements to get personalized size recommendations.</p>
                <button
                  onClick={() => setShowMeasurementForm(true)}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Size Recommendations</h2>
            
            {!measurements && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  Add your body measurements to receive personalized size recommendations.
                  <button
                    onClick={() => setActiveTab('measurements')}
                    className="ml-2 text-yellow-900 underline"
                  >
                    Add measurements now
                  </button>
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              {recommendations.map(rec => (
                <div key={rec.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{rec.brand_name}</h3>
                      <p className="text-gray-600">Recommended Size: <span className="font-semibold text-pink-600">{rec.recommended_size}</span></p>
                      <p className="text-sm text-gray-500 mt-1">Confidence: {Math.round(rec.confidence_score * 100)}%</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          if (!user) return;
                          await flamingoService.submitFeedback(rec.id, 'perfect');
                          showToast('Feedback submitted', 'success');
                        }}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                      >
                        Perfect Fit
                      </button>
                      <button
                        onClick={async () => {
                          if (!user) return;
                          await flamingoService.submitFeedback(rec.id, 'too_small');
                          showToast('Feedback submitted', 'success');
                        }}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                      >
                        Too Small
                      </button>
                      <button
                        onClick={async () => {
                          if (!user) return;
                          await flamingoService.submitFeedback(rec.id, 'too_large');
                          showToast('Feedback submitted', 'success');
                        }}
                        className="px-3 py-1 bg-orange-100 text-orange-800 rounded text-sm hover:bg-orange-200"
                      >
                        Too Large
                      </button>
                    </div>
                  </div>
                  {rec.reasoning && (
                    <p className="text-sm text-gray-600 mt-3">{rec.reasoning}</p>
                  )}
                </div>
              ))}
            </div>
            
            {recommendations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No recommendations available yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map(item => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return null;
                
                return (
                  <ProductCard
                    key={item.id}
                    product={product}
                    onAddToCart={() => addToCart(product)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                    isInWishlist={true}
                  />
                );
              })}
            </div>
            
            {wishlist.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Your wishlist is empty.</p>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="mt-4 text-pink-600 hover:underline"
                >
                  Browse products
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Flamingo Wellness</h3>
              <p className="text-gray-400 text-sm">
                Your trusted destination for sexual wellness and self-care products.
                Discreet shipping, quality guaranteed.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Privacy & Compliance</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>✓ Age Verified (19+)</li>
                <li>✓ Discreet Packaging</li>
                <li>✓ Secure Payments</li>
                <li>✓ Privacy Protected</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Customer Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: support@flamingo.com</li>
                <li>Phone: 1-800-FLAMINGO</li>
                <li>Live Chat Available</li>
                <li>Mon-Fri: 9AM - 6PM EST</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 Flamingo Wellness Store. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FlamingoPage;
