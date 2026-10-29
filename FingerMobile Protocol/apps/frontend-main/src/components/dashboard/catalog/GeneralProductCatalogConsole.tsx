import React, { useState, useEffect, useCallback } from 'react';
import CommerceMediaPicker, { CommerceMediaValue } from '../../common/CommerceMediaPicker';
import {
  Package,
  Plus,
  Search,
  RefreshCw,
  ShoppingBag,
  Flame,
  Gem,
  Store,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Image,
  Video,
  X,
  Sliders,
  Play,
  CheckSquare,
  Square,
  EyeOff,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { api } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserRoleTier, PRIMARY_ADMIN_EMAILS } from '../../../services/platformRbac';

const getStockDotColor = (qty: number) => {
  if (qty > 10) return 'bg-emerald-500';
  if (qty > 0) return 'bg-amber-500';
  return 'bg-rose-500';
};

const getVettingBadgeStyle = (status: string) => {
  if (status === 'approved') return 'bg-emerald-100 text-emerald-950 border border-emerald-400';
  if (status === 'pending_vetting') return 'bg-amber-100 text-amber-950 border border-amber-400';
  return 'bg-rose-100 text-rose-950 border border-rose-400';
};

export interface CatalogProduct {
  id: string;
  sku: string;
  name: string;
  subtitle?: string;
  description?: string;
  category: string;
  goods_type: 'physical' | 'digital' | 'service';
  price_fic: number;
  price_fiat: number;
  currency: string;
  stock_quantity: number;
  images: string[];
  video_urls: string[];
  specifications: Record<string, any>;
  service_details: Record<string, any>;
  status: 'active' | 'draft' | 'out_of_stock' | 'archived' | 'suspended';
  curated_stores: string[]; // 'marketplace' | 'flamingo' | 'ownit' | 'storefront'
  store_scheduling: Record<string, any>;
  vetting_status: 'approved' | 'pending_vetting' | 'censored' | 'rejected';
  vetting_notes?: string;
  censorship_flags?: Record<string, any>;
  merchant_id?: string;
  merchant_name?: string;
  merchant_email?: string;
  storefront_id?: string;
  storefront_name?: string;
  storefront_tier?: string;
  storage_used_bytes?: number;
  storage_total_bytes?: number;
  created_at: string;
  updated_at: string;
}

interface CatalogStats {
  total_items: string;
  marketplace_count: string;
  flamingo_count: string;
  ownit_count: string;
  storefront_count: string;
  pending_vetting_count: string;
}

export const GeneralProductCatalogConsole: React.FC = () => {
  const { user } = useAuth();
  const userEmail = (user?.email || '').toLowerCase().trim();
  const roleTier = getUserRoleTier(user as any);

  const isSuperAdmin =
    PRIMARY_ADMIN_EMAILS.includes(userEmail) ||
    roleTier === 'PRIMARY_SUPER_ADMIN' ||
    user?.role === 'super_admin' ||
    user?.role === 'founder';

  const isAdmin =
    isSuperAdmin ||
    user?.role === 'admin' ||
    user?.role === 'administrator';

  const isModerator =
    isAdmin ||
    user?.role === 'moderator' ||
    user?.role === 'sentinel' ||
    user?.role === 'curator';

  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [stats, setStats] = useState<CatalogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProductForCuration, setSelectedProductForCuration] = useState<CatalogProduct | null>(null);
  const [selectedProductForRestock, setSelectedProductForRestock] = useState<CatalogProduct | null>(null);
  const [previewMediaModalProduct, setPreviewMediaModalProduct] = useState<CatalogProduct | null>(null);

  // Restock form
  const [restockAmount, setRestockAmount] = useState('50');

  // New Product Form
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    subtitle: '',
    description: '',
    category: 'Hardware & Security',
    goods_type: 'physical' as 'physical' | 'digital' | 'service',
    price_fic: '150',
    price_fiat: '75000',
    stock_quantity: '50',
    imagesText: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    videosText: '',
    curated_stores: ['marketplace', 'storefront'] as string[],
    status: 'active' as 'active' | 'draft' | 'out_of_stock'
  });

  // Media Picker state for Add Product
  const [mediaPickerValue, setMediaPickerValue] = useState<CommerceMediaValue>({
    coverUrl: '',
    galleryUrls: [],
    videoUrl: '',
    isCensored: false
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Bulk Media Selection & Batch Operations
  const [selectedMediaUrls, setSelectedMediaUrls] = useState<string[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  const handleToggleMediaSelect = (url: string) => {
    setSelectedMediaUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const handleSelectAllMedia = (allUrls: string[]) => {
    if (selectedMediaUrls.length === allUrls.length) {
      setSelectedMediaUrls([]);
    } else {
      setSelectedMediaUrls([...allUrls]);
    }
  };

  const handleBatchMediaAction = async (action: 'delete' | 'freeze' | 'unfreeze') => {
    if (!previewMediaModalProduct) return;
    if (selectedMediaUrls.length === 0) {
      showToast('Select at least one media asset first.');
      return;
    }

    if (action === 'delete') {
      if (!window.confirm(`Permanently erase ${selectedMediaUrls.length} selected media asset(s)?`)) return;
    }

    try {
      setIsBatchProcessing(true);
      const res = await api.post(`/catalog/general/${previewMediaModalProduct.id}/media-batch`, {
        action,
        media_urls: selectedMediaUrls
      });

      if (res.data?.success) {
        showToast(res.data.message || `Media batch ${action} executed successfully.`);
        setPreviewMediaModalProduct(res.data.data);
        setSelectedMediaUrls([]);
        fetchCatalog();
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || 'Media batch action failed');
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const fetchCatalog = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (typeFilter !== 'all') params.append('goods_type', typeFilter);
      if (storeFilter !== 'all') params.append('store', storeFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const res = await api.get(`/catalog/general?${params.toString()}`);
      if (res.data?.success) {
        setProducts(res.data.data || []);
        if (res.data.stats) setStats(res.data.stats);
      } else {
        setError('Failed to fetch general catalogue.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error fetching catalogue data');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryFilter, typeFilter, storeFilter, statusFilter]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please provide a product title');
      return;
    }

    try {
      const pickerImages = [
        ...(mediaPickerValue.coverUrl ? [mediaPickerValue.coverUrl] : []),
        ...mediaPickerValue.galleryUrls
      ].filter(Boolean);

      const fallbackImages = formData.imagesText
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const images = pickerImages.length > 0 ? pickerImages : fallbackImages;

      const video_urls = mediaPickerValue.videoUrl
        ? [mediaPickerValue.videoUrl]
        : formData.videosText
            .split('\n')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

      const payload = {
        sku: formData.sku.trim() || undefined,
        name: formData.name.trim(),
        subtitle: formData.subtitle.trim(),
        description: formData.description.trim(),
        category: formData.category,
        goods_type: formData.goods_type,
        price_fic: parseFloat(formData.price_fic) || 0,
        price_fiat: parseFloat(formData.price_fiat) || 0,
        stock_quantity: parseInt(formData.stock_quantity, 10) || 0,
        images,
        video_urls,
        curated_stores: formData.curated_stores,
        status: mediaPickerValue.isCensored ? 'draft' : formData.status
      };

      const res = await api.post('/catalog/general', payload);
      if (res.data?.success) {
        showToast(`Product "${formData.name}" ingested into General Catalogue!`);
        setIsCreateModalOpen(false);
        setMediaPickerValue({ coverUrl: '', galleryUrls: [], videoUrl: '', isCensored: false });
        setFormData({
          sku: '',
          name: '',
          subtitle: '',
          description: '',
          category: 'Hardware & Security',
          goods_type: 'physical',
          price_fic: '150',
          price_fiat: '75000',
          stock_quantity: '50',
          imagesText: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
          videosText: '',
          curated_stores: ['marketplace', 'storefront'],
          status: 'active'
        });
        fetchCatalog();
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to create product');
    }
  };

  const handleToggleStoreCuration = async (storeKey: string) => {
    if (!selectedProductForCuration) return;
    const current = selectedProductForCuration.curated_stores || [];
    const exists = current.includes(storeKey);
    const updated = exists ? current.filter((s) => s !== storeKey) : [...current, storeKey];

    try {
      const res = await api.post(`/catalog/general/${selectedProductForCuration.id}/curate`, {
        curated_stores: updated
      });
      if (res.data?.success) {
        setSelectedProductForCuration(res.data.data);
        showToast(`Updated store curation for ${selectedProductForCuration.name}`);
        fetchCatalog();
      }
    } catch (err: any) {
      showToast('Error updating store curation');
    }
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForRestock) return;
    const qty = parseInt(restockAmount, 10);
    if (isNaN(qty) || qty <= 0) {
      showToast('Enter a valid restock quantity');
      return;
    }

    try {
      const res = await api.post(`/catalog/general/${selectedProductForRestock.id}/restock`, {
        quantity: qty
      });
      if (res.data?.success) {
        showToast(`Successfully restocked ${qty} units for ${selectedProductForRestock.name}`);
        setSelectedProductForRestock(null);
        fetchCatalog();
      }
    } catch (err: any) {
      showToast('Error restocking product');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the General Product Catalogue?`)) {
      return;
    }

    try {
      const res = await api.delete(`/catalog/general/${id}`);
      if (res.data?.success) {
        showToast(`Product "${name}" deleted from catalogue`);
        fetchCatalog();
      }
    } catch (err: any) {
      showToast('Error deleting product');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Console Header & KPI Cards */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-3">
              <span className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl">
                <Package className="w-6 h-6 text-emerald-700" />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  General Product Catalogue Console
                </h2>
                <p className="text-sm text-slate-700 mt-0.5">
                  Universal master inventory, rich media repository (multi-photos, videos), and cross-channel store syndication engine.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => fetchCatalog()}
              className="min-h-[44px] inline-flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 transition shadow-sm cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Live DB</span>
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="min-h-[44px] inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ingest Product / Service</span>
            </button>
          </div>
        </div>

        {/* Real-time Cross-Store Counters */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 pt-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total In Catalogue</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.total_items || products.length}</p>
            <span className="text-xs text-slate-500 font-medium">All Goods & Services</span>
          </div>
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">Marketplace</span>
            <p className="text-2xl font-black text-indigo-950 mt-1">{stats?.marketplace_count || 0}</p>
            <span className="text-xs text-indigo-800 font-medium">Curated for Public</span>
          </div>
          <div className="p-4 bg-pink-50 border border-pink-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-950">Flamingo VIP</span>
            <p className="text-2xl font-black text-pink-950 mt-1">{stats?.flamingo_count || 0}</p>
            <span className="text-xs text-pink-800 font-medium">Luxury & Fashion Tier</span>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-950">OwnIt Installments</span>
            <p className="text-2xl font-black text-purple-950 mt-1">{stats?.ownit_count || 0}</p>
            <span className="text-xs text-purple-800 font-medium">1-of-1 & Rent-to-Own</span>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-950">Storefronts</span>
            <p className="text-2xl font-black text-amber-950 mt-1">{stats?.storefront_count || 0}</p>
            <span className="text-xs text-amber-800 font-medium">Merchant Available</span>
          </div>
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-950">Pending Vetting</span>
            <p className="text-2xl font-black text-rose-950 mt-1">{stats?.pending_vetting_count || 0}</p>
            <span className="text-xs text-rose-800 font-medium">Awaiting Inspection</span>
          </div>
        </div>

        {/* Sovereign Compliance & RBAC Actions Banner - Black with hairline of dark red (#880808) */}
        <div className="mt-4 p-3.5 bg-black border border-[#880808] rounded-xl text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shrink-0" />
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                Compliance & RBAC Actions: Master Product & Inventory Engine
              </h4>
              <p className="text-[11px] text-slate-300 font-medium">
                Admin: Freeze, Suspend, Censor (18+ Blur), Pause Syndication · Super Admin: Permanent Purge from PostgreSQL
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-red-950/80 text-rose-200 border border-red-800/80">
              {isSuperAdmin ? 'ROLE: SUPER ADMIN' : isAdmin ? 'ROLE: ADMIN' : isModerator ? 'ROLE: MODERATOR' : 'ROLE: REVIEWER'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Query Matrix */}
      <div className="bg-white border border-slate-300 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, SKU, or specs..."
            className="w-full min-h-[44px] pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="min-h-[44px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Categories</option>
            <option value="Hardware & Security">Hardware & Security</option>
            <option value="Luxury Fashion">Luxury Fashion</option>
            <option value="Fine Art & Sculptures">Fine Art & Sculptures</option>
            <option value="Professional Services">Professional Services</option>
            <option value="Merchant Goods">Merchant Goods</option>
          </select>

          {/* Goods Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="min-h-[44px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Goods Types</option>
            <option value="physical">Physical Goods</option>
            <option value="digital">Digital Assets</option>
            <option value="service">Services & Consults</option>
          </select>

          {/* Store Channel Filter */}
          <select
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
            className="min-h-[44px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Stores</option>
            <option value="marketplace">Marketplace Active</option>
            <option value="flamingo">Flamingo Active</option>
            <option value="ownit">OwnIt Active</option>
            <option value="storefront">Storefront Active</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-h-[44px] px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-700 flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
            <p className="text-sm font-semibold">Loading live catalogue from PostgreSQL...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-700 bg-rose-50">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-rose-600" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-700">
            <Package className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <h3 className="text-base font-bold text-slate-900">No catalogue items found</h3>
            <p className="text-xs text-slate-600 mt-1">Adjust your search parameters or ingest a new product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  <th className="py-3 px-4">Item & Media Assets</th>
                  <th className="py-3 px-4">Type & Category</th>
                  <th className="py-3 px-4">Sovereign Pricing</th>
                  <th className="py-3 px-4">Stock Level</th>
                  <th className="py-3 px-4">Curated Store Allocations</th>
                  <th className="py-3 px-4">Vetting Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                {products.map((item) => {
                  const imageCount = item.images?.length || 0;
                  const videoCount = item.video_urls?.length || 0;
                  const primaryImg = item.images?.[0] || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Item Details and Media Badges */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div
                            onClick={() => setPreviewMediaModalProduct(item)}
                            className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-300 bg-slate-100 flex-shrink-0 cursor-pointer group"
                            title="Click to view media gallery & video demo"
                          >
                            <img src={primaryImg} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                            {videoCount > 0 && (
                              <span className="absolute bottom-1 right-1 bg-black/75 text-white p-0.5 rounded text-[9px] flex items-center">
                                <Play className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{item.name}</div>
                            <div className="text-[11px] text-slate-600 font-mono mt-0.5 flex items-center space-x-2">
                              <span>SKU: {item.sku}</span>
                              <span className="text-slate-400">•</span>
                              <span className="inline-flex items-center text-slate-600">
                                <Image className="w-3 h-3 mr-1 text-slate-500" /> {imageCount}
                              </span>
                              {videoCount > 0 && (
                                <span className="inline-flex items-center text-indigo-700 font-bold">
                                  <Video className="w-3 h-3 mr-1 text-indigo-600" /> {videoCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type & Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 bg-slate-100 text-slate-800 border border-slate-300">
                          {item.goods_type}
                        </span>
                        <div className="text-xs text-slate-700 font-medium">{item.category}</div>
                      </td>

                      {/* Sovereign Pricing */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">{item.price_fic} FIC</div>
                        <div className="text-[11px] text-slate-600 font-medium">₦{Number(item.price_fiat).toLocaleString()}</div>
                      </td>

                      {/* Stock Level */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${getStockDotColor(item.stock_quantity)}`} />
                          <span className="font-bold text-slate-900">{item.stock_quantity} units</span>
                        </div>
                        <button
                          onClick={() => setSelectedProductForRestock(item)}
                          className="mt-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline"
                        >
                          + Restock
                        </button>
                      </td>

                      {/* Curated Store Presence */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                          {item.curated_stores?.includes('marketplace') && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-950 border border-indigo-300 flex items-center space-x-1">
                              <ShoppingBag className="w-2.5 h-2.5 mr-0.5 text-indigo-700" />
                              <span>Marketplace</span>
                            </span>
                          )}
                          {item.curated_stores?.includes('flamingo') && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-950 border border-pink-300 flex items-center space-x-1">
                              <Flame className="w-2.5 h-2.5 mr-0.5 text-pink-700" />
                              <span>Flamingo VIP</span>
                            </span>
                          )}
                          {item.curated_stores?.includes('ownit') && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-950 border border-purple-300 flex items-center space-x-1">
                              <Gem className="w-2.5 h-2.5 mr-0.5 text-purple-700" />
                              <span>OwnIt</span>
                            </span>
                          )}
                          {item.curated_stores?.includes('storefront') && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300 flex items-center space-x-1">
                              <Store className="w-2.5 h-2.5 mr-0.5 text-amber-700" />
                              <span>Storefront</span>
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedProductForCuration(item)}
                          className="mt-1.5 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center space-x-1"
                        >
                          <Sliders className="w-3 h-3 mr-0.5" />
                          <span>Curate Stores</span>
                        </button>
                      </td>

                      {/* Vetting Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${getVettingBadgeStyle(item.vetting_status)}`}
                        >
                          {item.vetting_status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-700" />}
                          {item.vetting_status === 'pending_vetting' && <Clock className="w-3 h-3 mr-1 text-amber-700" />}
                          {item.vetting_status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedProductForCuration(item)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300 transition"
                            title="Curate store allocation & scheduling"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(item.id, item.name)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition"
                            title="Remove from General Catalogue"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal 1: Ingest New Product / Service */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Ingest New Product or Service</h3>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sovereign Biometric NFC Keycard"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Custom SKU (Optional)</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Auto-generated if blank (e.g. FMP-PHY-8821)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. EAL6+ Cryptographic Access Enclave"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed specs, materials, capabilities..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Goods Classification</label>
                  <select
                    value={formData.goods_type}
                    onChange={(e) => setFormData({ ...formData, goods_type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="physical">Physical Goods</option>
                    <option value="digital">Digital Assets</option>
                    <option value="service">Professional Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Price (FIC)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price_fic}
                    onChange={(e) => setFormData({ ...formData, price_fic: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Price Fiat (NGN)</label>
                  <input
                    type="number"
                    value={formData.price_fiat}
                    onChange={(e) => setFormData({ ...formData, price_fiat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Sovereign Commerce Media Picker (Direct Uploads for Cover, Multi-Angle Gallery & Video) */}
              <CommerceMediaPicker
                value={mediaPickerValue}
                onChange={setMediaPickerValue}
                title="Product Media & Showcase Assets"
                description="Upload product cover photo, multi-angle gallery photos, and showcase video reel saving directly to Express storage."
                allowGallery={true}
                allowVideo={true}
                maxGalleryImages={8}
              />

              {/* Initial Store Allocation */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Initial Store Channel Allocations (Select stores to publish to)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                  {[
                    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, color: 'text-indigo-600' },
                    { id: 'flamingo', label: 'Flamingo VIP', icon: Flame, color: 'text-pink-600' },
                    { id: 'ownit', label: 'OwnIt Installment', icon: Gem, color: 'text-purple-600' },
                    { id: 'storefront', label: 'Storefront', icon: Store, color: 'text-amber-600' }
                  ].map((store) => {
                    const isChecked = formData.curated_stores.includes(store.id);
                    return (
                      <label
                        key={store.id}
                        className={`flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer transition ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-400 text-slate-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, curated_stores: [...formData.curated_stores, store.id] });
                            } else {
                              setFormData({
                                ...formData,
                                curated_stores: formData.curated_stores.filter((s) => s !== store.id)
                              });
                            }
                          }}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <store.icon className={`w-4 h-4 ${store.color}`} />
                        <span className="text-xs">{store.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  Save & Ingest Into PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Curate Store Allocation & Scheduling */}
      {selectedProductForCuration && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Curate Store Channels</h3>
                <p className="text-xs text-slate-600 font-mono mt-0.5">{selectedProductForCuration.name}</p>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setSelectedProductForCuration(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-700">
                Select or remove stores where this product is actively published. Products can be made available only in specific stores or at certain times:
              </p>

              {[
                { id: 'marketplace', name: 'Open Marketplace', desc: 'Sovereign public trading, hardware keycards, flagship listings', icon: ShoppingBag },
                { id: 'flamingo', name: 'Flamingo Luxury & Fashion', desc: 'High-end contemporary fashion, VIP verification, bespoke kaftans', icon: Flame },
                { id: 'ownit', name: 'OwnIt Rent-to-Own & 1-of-1', desc: 'Cryptographic bronze assets, numbered fine art, installment schedules', icon: Gem },
                { id: 'storefront', name: 'Merchant Storefronts', desc: 'Independent merchant storefront catalogs (subject to admin vetting)', icon: Store }
              ].map((channel) => {
                const isSelected = selectedProductForCuration.curated_stores?.includes(channel.id);
                return (
                  <div
                    key={channel.id}
                    onClick={() => handleToggleStoreCuration(channel.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-400'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <channel.icon className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{channel.name}</div>
                        <div className="text-[11px] text-slate-600">{channel.desc}</div>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        isSelected ? 'bg-emerald-100 text-emerald-950 border border-emerald-400' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isSelected ? 'Active in Store' : 'Not Present'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedProductForCuration(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Restock Inventory */}
      {selectedProductForRestock && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Restock Product Units</h3>
              <button aria-label="Close" type="button" onClick={() => setSelectedProductForRestock(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="pt-4 space-y-4">
              <div>
                <span className="text-xs text-slate-600 font-medium">Product</span>
                <p className="text-xs font-bold text-slate-900">{selectedProductForRestock.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Current Stock: {selectedProductForRestock.stock_quantity} units</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Add Units to Inventory</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['25', '50', '100'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRestockAmount(preset)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                        restockAmount === preset
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-black'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedProductForRestock(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Media Gallery & Demo Video Preview */}
      {previewMediaModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Media Assets & Video Showcases</h3>
                <p className="text-xs text-slate-600 font-mono mt-0.5">{previewMediaModalProduct.name}</p>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setPreviewMediaModalProduct(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-6">
              {(() => {
                const allMediaUrls = [
                  ...(previewMediaModalProduct.images || []),
                  ...(previewMediaModalProduct.video_urls || [])
                ];

                return (
                  <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                      <div>
                        <span className="text-xs font-bold text-slate-900">
                          Bulk Media Management ({allMediaUrls.length} total)
                        </span>
                        <p className="text-[11px] text-slate-600">Select photos & videos to bulk erase, freeze/blur, or unfreeze.</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleSelectAllMedia(allMediaUrls)}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center space-x-1"
                        >
                          {selectedMediaUrls.length === allMediaUrls.length && allMediaUrls.length > 0 ? (
                            <>
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Deselect All</span>
                            </>
                          ) : (
                            <>
                              <Square className="w-3.5 h-3.5 text-slate-500" />
                              <span>Select All ({allMediaUrls.length})</span>
                            </>
                          )}
                        </button>
                        {selectedMediaUrls.length > 0 && (
                          <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                            {selectedMediaUrls.length} selected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Sovereign Batch Action Toolbar - Black with hairline of dark red (#880808) */}
                    {selectedMediaUrls.length > 0 && (
                      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-black border border-[#880808] text-white rounded-xl shadow-lg">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                          <span className="text-xs font-black uppercase tracking-wider text-white">Compliance & RBAC Actions:</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={isBatchProcessing}
                            onClick={() => handleBatchMediaAction('delete')}
                            className="px-2.5 py-1 text-[11px] font-bold bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-800 rounded-lg flex items-center space-x-1 shadow-sm transition"
                          >
                            <Trash2 className="w-3 h-3 text-rose-400" />
                            <span>Erase Selected ({selectedMediaUrls.length})</span>
                          </button>
                          <button
                            type="button"
                            disabled={isBatchProcessing}
                            onClick={() => handleBatchMediaAction('freeze')}
                            className="px-2.5 py-1 text-[11px] font-bold bg-purple-950/70 hover:bg-purple-900 text-purple-200 border border-purple-800 rounded-lg flex items-center space-x-1 shadow-sm transition"
                          >
                            <EyeOff className="w-3 h-3 text-purple-400" />
                            <span>Freeze / Blur ({selectedMediaUrls.length})</span>
                          </button>
                          <button
                            type="button"
                            disabled={isBatchProcessing}
                            onClick={() => handleBatchMediaAction('unfreeze')}
                            className="px-2.5 py-1 text-[11px] font-bold bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500 rounded-lg flex items-center space-x-1 shadow-sm transition"
                          >
                            <Eye className="w-3 h-3 text-white" />
                            <span>Unfreeze ({selectedMediaUrls.length})</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Image Gallery */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center space-x-1.5">
                  <Image className="w-3.5 h-3.5 text-slate-600" />
                  <span>Multi-Angle Photos ({previewMediaModalProduct.images?.length || 0})</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {previewMediaModalProduct.images?.map((url, idx) => {
                    const isSelected = selectedMediaUrls.includes(url);
                    const isFrozen = (previewMediaModalProduct.censorship_flags?.frozen_urls || []).includes(url);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleMediaSelect(url)}
                        className={`relative aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                          isSelected ? 'border-emerald-500 shadow-md ring-2 ring-emerald-300' : 'border-slate-300 hover:border-slate-400'
                        } bg-slate-100`}
                      >
                        <img
                          src={url}
                          alt={`Angle ${idx + 1}`}
                          className={`w-full h-full object-cover ${isFrozen ? 'blur-sm grayscale' : ''}`}
                        />
                        <div className="absolute top-1.5 left-1.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                        </div>
                        {isFrozen && (
                          <div className="absolute inset-0 bg-purple-950/60 backdrop-blur-[2px] flex items-center justify-center p-1 text-center">
                            <span className="text-[10px] font-black text-white bg-purple-900/90 px-1.5 py-0.5 rounded border border-purple-400">
                              ❄️ FROZEN / BLURRED
                            </span>
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                          Angle #{idx + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Video Showcases */}
              {previewMediaModalProduct.video_urls?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center space-x-1.5">
                    <Video className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Product Demonstration & 4K Showcase Videos</span>
                  </h4>
                  <div className="space-y-3">
                    {previewMediaModalProduct.video_urls.map((vUrl, vIdx) => {
                      const isSelected = selectedMediaUrls.includes(vUrl);
                      const isFrozen = (previewMediaModalProduct.censorship_flags?.frozen_urls || []).includes(vUrl);
                      return (
                        <div
                          key={vIdx}
                          onClick={() => handleToggleMediaSelect(vUrl)}
                          className={`relative rounded-xl overflow-hidden border-2 cursor-pointer bg-black transition ${
                            isSelected ? 'border-emerald-500 shadow-md ring-2 ring-emerald-300' : 'border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          <div className="absolute top-2 left-2 z-10">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                          </div>
                          {isFrozen && (
                            <div className="absolute inset-0 z-10 bg-purple-950/60 backdrop-blur-[2px] flex items-center justify-center p-1 text-center">
                              <span className="text-[11px] font-black text-white bg-purple-900/90 px-2 py-1 rounded border border-purple-400">
                                ❄️ FROZEN VIDEO
                              </span>
                            </div>
                          )}
                          <video controls className={`w-full max-h-64 object-contain ${isFrozen ? 'blur-sm' : ''}`}>
                            <source src={vUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => {
                  setPreviewMediaModalProduct(null);
                  setSelectedMediaUrls([]);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralProductCatalogConsole;
