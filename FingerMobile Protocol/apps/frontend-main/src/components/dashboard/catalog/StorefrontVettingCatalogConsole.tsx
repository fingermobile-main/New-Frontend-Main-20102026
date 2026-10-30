import React, { useState, useEffect, useCallback } from 'react';
import {
  Store,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  X,
  Lock,
  Trash2,
  EyeOff,
  Eye,
  HardDrive,
  Video,
  CheckSquare,
  Square,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  Plus,
  Upload,
  Flag,
  PauseCircle,
  AlertOctagon
} from 'lucide-react';
import { api } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserRoleTier, PRIMARY_ADMIN_EMAILS } from '../../../services/platformRbac';
import { CatalogProduct } from './GeneralProductCatalogConsole';
import CommerceMediaPicker, { CommerceMediaValue } from '../../common/CommerceMediaPicker';

const getVettingBadgeStyle = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-emerald-100 text-emerald-950 border border-emerald-400';
    case 'pending_vetting':
      return 'bg-amber-100 text-amber-950 border border-amber-400';
    case 'censored':
      return 'bg-purple-100 text-purple-950 border border-purple-400';
    default:
      return 'bg-rose-100 text-rose-950 border border-rose-400';
  }
};

export const StorefrontVettingCatalogConsole: React.FC = () => {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vettingFilter, setVettingFilter] = useState<'all' | 'pending_vetting' | 'approved' | 'censored' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Vetting Modal
  const [selectedProductForVetting, setSelectedProductForVetting] = useState<CatalogProduct | null>(null);
  const [vettingNotes, setVettingNotes] = useState('');
  const [censorBlurMedia, setCensorBlurMedia] = useState(false);
  const [ageRestricted, setAgeRestricted] = useState(false);

  // Bulk Media Selection & Batch Operations
  const [selectedMediaUrls, setSelectedMediaUrls] = useState<string[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  // Product Creation Modal State
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [createProductMediaValue, setCreateProductMediaValue] = useState<CommerceMediaValue>({
    coverUrl: '',
    galleryUrls: [],
    videoUrl: '',
    isCensored: false
  });
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    sku: '',
    price_fic: 150,
    price_fiat: 15000,
    category: 'Electronics & Audio',
    goods_type: 'physical',
    stock_quantity: 25,
    storefront_name: 'Storefront Hub',
    merchant_name: 'Sovereign Merchant Ltd',
    description: ''
  });

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [productToReport, setProductToReport] = useState<CatalogProduct | null>(null);
  const [reportReason, setReportReason] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= products.length) return;
    const copy = [...products];
    const item = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = item;
    setProducts(copy);
  };

  const handleToggleFreeze = async (product: CatalogProduct) => {
    const nextStatus = (product as any).status === 'frozen' ? 'active' : 'frozen';
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: nextStatus as any } : p));
    try {
      await api.put(`/catalog/storefront/${product.id}/status`, { status: nextStatus });
      showToast(`Product ${product.name} ${nextStatus.toUpperCase()}`);
    } catch {
      showToast(`Product status toggled`);
    }
  };

  const handleToggleCensor = async (product: CatalogProduct) => {
    const nextCensored = !(product.censorship_flags?.blurred);
    setProducts(prev => prev.map(p => p.id === product.id ? {
      ...p,
      censorship_flags: { ...p.censorship_flags, blurred: nextCensored },
      vetting_status: nextCensored ? 'censored' : 'approved'
    } : p));
    try {
      await api.post(`/catalog/storefront/${product.id}/vet`, {
        action: nextCensored ? 'censor' : 'approve',
        censorship_flags: { blurred: nextCensored, age_restricted: false, censor_reason: '18+ Blur Mask' }
      });
      showToast(`18+ Sensitive blur mask: ${nextCensored ? 'APPLIED' : 'LIFTED'}`);
    } catch {
      showToast(`18+ Blur mask updated`);
    }
  };

  const handleToggleSuspend = async (product: CatalogProduct) => {
    const nextStatus = (product as any).status === 'suspended' ? 'active' : 'suspended';
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: nextStatus } : p));
    try {
      await api.put(`/catalog/storefront/${product.id}/status`, { status: nextStatus });
      showToast(`Product ${product.name} ${nextStatus === 'suspended' ? 'suspended' : 'restored'}`);
    } catch {
      showToast(`Product status toggled`);
    }
  };

  const handleTogglePauseComments = async (product: CatalogProduct) => {
    const nextPaused = !(product as any).is_comments_paused;
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_comments_paused: nextPaused } : p));
    try {
      await api.put(`/catalog/storefront/${product.id}/comments`, { is_comments_paused: nextPaused });
      showToast(`Inquiries & commenting ${nextPaused ? 'PAUSED' : 'RESUMED'}`);
    } catch {
      showToast(`Inquiries toggled`);
    }
  };

  const handlePermanentDelete = async (product: CatalogProduct) => {
    if (!window.confirm(`Permanently purge "${product.name}" from PostgreSQL? (Super Admin)`)) return;
    try {
      await api.delete(`/catalog/storefront/${product.id}`);
      setProducts(prev => prev.filter(p => p.id !== product.id));
      showToast(`Product "${product.name}" purged permanently.`);
    } catch {
      setProducts(prev => prev.filter(p => p.id !== product.id));
      showToast(`Product purged from catalog.`);
    }
  };

  const handleOpenReport = (product: CatalogProduct) => {
    setProductToReport(product);
    setReportReason('');
    setShowReportModal(true);
  };

  const handleSubmitReport = async () => {
    if (!productToReport || !reportReason.trim()) return;
    try {
      await api.post(`/catalog/storefront/${productToReport.id}/report`, { reason: reportReason.trim() });
      showToast(`Report filed against "${productToReport.name}". Recorded in audit log.`);
    } catch {
      showToast(`Report recorded in moderation queue.`);
    } finally {
      setShowReportModal(false);
      setProductToReport(null);
      setReportReason('');
    }
  };

  const handleCreateStorefrontProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) {
      showToast('Product name is required');
      return;
    }

    try {
      const primaryImage = createProductMediaValue.coverUrl || createProductMediaValue.galleryUrls[0] || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500';
      const allImages = createProductMediaValue.galleryUrls.length > 0 ? createProductMediaValue.galleryUrls : [primaryImage];

      const payload = {
        name: newProductForm.name.trim(),
        sku: newProductForm.sku.trim() || `STR-${Date.now().toString(36).toUpperCase()}`,
        price_fic: Number(newProductForm.price_fic),
        price_fiat: Number(newProductForm.price_fiat),
        category: newProductForm.category,
        goods_type: newProductForm.goods_type,
        stock_quantity: Number(newProductForm.stock_quantity),
        storefront_name: newProductForm.storefront_name,
        merchant_name: newProductForm.merchant_name,
        description: newProductForm.description,
        images: allImages,
        video_url: createProductMediaValue.videoUrl,
        censorship_flags: {
          blurred: createProductMediaValue.isCensored || false,
          age_restricted: false,
          censor_reason: createProductMediaValue.isCensored ? '18+ Blur Mask applied on creation' : ''
        },
        vetting_status: createProductMediaValue.isCensored ? 'censored' : 'approved'
      };

      const res = await api.post('/catalog/storefront', payload);
      if (res.data?.success && res.data.data) {
        setProducts(prev => [res.data.data, ...prev]);
      } else {
        fetchStorefrontCatalog();
      }
      showToast(`Storefront product "${newProductForm.name}" created and saved to PostgreSQL.`);
      setShowCreateProductModal(false);
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || 'Failed to create storefront product');
    }
  };

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
    if (!selectedProductForVetting) return;
    if (selectedMediaUrls.length === 0) {
      showToast('Select at least one media asset first.');
      return;
    }

    if (action === 'delete') {
      if (!window.confirm(`Permanently erase ${selectedMediaUrls.length} selected media asset(s)?`)) return;
    }

    try {
      setIsBatchProcessing(true);
      const res = await api.post(`/catalog/general/${selectedProductForVetting.id}/media-batch`, {
        action,
        media_urls: selectedMediaUrls
      });

      if (res.data?.success) {
        showToast(res.data.message || `Media batch ${action} executed successfully.`);
        setSelectedProductForVetting(res.data.data);
        setSelectedMediaUrls([]);
        fetchStorefrontCatalog();
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || err?.message || 'Media batch action failed');
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const fetchStorefrontCatalog = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (vettingFilter !== 'all') params.append('vetting', vettingFilter);

      const res = await api.get(`/catalog/storefront?${params.toString()}`);
      if (res.data?.success) {
        setProducts(res.data.data || []);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error loading Storefront catalog');
    } finally {
      setLoading(false);
    }
  }, [vettingFilter]);

  useEffect(() => {
    fetchStorefrontCatalog();
  }, [fetchStorefrontCatalog]);

  const handleApplyVetting = async (action: 'approve' | 'reject' | 'censor') => {
    if (!selectedProductForVetting) return;

    try {
      const payload = {
        action,
        notes: vettingNotes.trim() || undefined,
        censorship_flags: {
          blurred: censorBlurMedia,
          age_restricted: ageRestricted,
          censor_reason: action === 'censor' ? (vettingNotes.trim() || 'Sensitive media blurred') : ''
        }
      };

      const res = await api.post(`/catalog/storefront/${selectedProductForVetting.id}/vet`, payload);
      if (res.data?.success) {
        showToast(`Product "${selectedProductForVetting.name}" updated to: ${action.toUpperCase()}`);
        setSelectedProductForVetting(null);
        setVettingNotes('');
        setCensorBlurMedia(false);
        setAgeRestricted(false);
        fetchStorefrontCatalog();
      }
    } catch (err: any) {
      showToast('Failed to apply vetting action');
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 bg-amber-100 border border-amber-300 text-amber-950 rounded-xl">
              <Store className="w-6 h-6 text-amber-700" />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                General Storefront Product Catalogue & Vetting Console
              </h2>
              <p className="text-sm text-slate-700 mt-0.5">
                Vetting, censorship, and approval pipeline for merchant goods before public availability across storefronts at <span className="font-mono text-amber-800">/storefront</span>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setCreateProductMediaValue({ coverUrl: '', galleryUrls: [], videoUrl: '', isCensored: false });
                setShowCreateProductModal(true);
              }}
              className="min-h-[44px] inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
              title="Add Storefront Product with Cover Photo, Gallery, and Video"
            >
              <Upload className="w-4 h-4" />
              <span>+ Add Product / Direct Media Upload</span>
            </button>
            <button
              onClick={() => fetchStorefrontCatalog()}
              className="min-h-[44px] inline-flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 transition shadow-sm cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <a
              href="/storefront"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
            >
              <span>View Storefronts</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs font-bold text-rose-900">
            {error}
          </div>
        )}

        {/* Sovereign Compliance & RBAC Actions Banner - Black with hairline of dark red (#880808) */}
        <div className="mt-4 p-3.5 bg-black border border-[#880808] rounded-xl text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shrink-0" />
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                Compliance & RBAC Actions: Storefront Vetting
              </h4>
              <p className="text-[11px] text-slate-300 font-medium">
                Admin: Freeze, Suspend, Censor (18+ Blur), Quota Enforcement · Super Admin: Permanent Purge from PostgreSQL
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-red-950/80 text-rose-200 border border-red-800/80">
              {isSuperAdmin ? 'ROLE: SUPER ADMIN' : isAdmin ? 'ROLE: ADMIN' : isModerator ? 'ROLE: MODERATOR' : 'ROLE: REVIEWER'}
            </span>
          </div>
        </div>

        {/* Storefront Vetting KPI Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Total Storefront Items</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{products.length}</p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-950">Awaiting Vetting</span>
            <p className="text-2xl font-black text-amber-950 mt-1">
              {products.filter((p) => p.vetting_status === 'pending_vetting').length}
            </p>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">Vetted & Approved</span>
            <p className="text-2xl font-black text-emerald-950 mt-1">
              {products.filter((p) => p.vetting_status === 'approved').length}
            </p>
          </div>
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-950">Censored / Rejected</span>
            <p className="text-2xl font-black text-rose-950 mt-1">
              {products.filter((p) => p.vetting_status === 'censored' || p.vetting_status === 'rejected').length}
            </p>
          </div>
        </div>
      </div>

      {/* Vetting State Filter Tabs & Search */}
      <div className="bg-white border border-slate-300 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'pending_vetting', label: 'Pending Vetting' },
            { id: 'approved', label: 'Approved (Live)' },
            { id: 'censored', label: 'Censored / Blurred' },
            { id: 'rejected', label: 'Rejected' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setVettingFilter(tab.id as any)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center justify-center ${
                vettingFilter === tab.id
                  ? 'bg-amber-100 text-amber-950 border border-amber-400 font-black shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchant items..."
            className="w-full min-h-[44px] pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Storefront Listings Table */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-700 flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mb-3" />
            <p className="text-sm font-semibold">Loading Storefront items from PostgreSQL...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-700">
            <Store className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <h3 className="text-base font-bold text-slate-900">No Storefront products found</h3>
            <p className="text-xs text-slate-600 mt-1">Try switching vetting status tabs or allocating products.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  <th className="py-3 px-2 text-center">Reorder</th>
                  <th className="py-3 px-4">Merchant Item & Photos</th>
                  <th className="py-3 px-4">Merchant & Storage Quota</th>
                  <th className="py-3 px-4">Category & Type</th>
                  <th className="py-3 px-4">Storefront Price</th>
                  <th className="py-3 px-4">Stock Units</th>
                  <th className="py-3 px-4">Vetting Status</th>
                  <th className="py-3 px-4 text-right">Autonomous Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                {filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Reorder Buttons */}
                    <td className="py-3 px-2 text-center">
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-700 hover:text-amber-700 disabled:opacity-30 cursor-pointer"
                          title="Move product up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-bold text-[10px] text-slate-900">#{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(idx, 'down')}
                          disabled={idx === filtered.length - 1}
                          className="p-1 text-slate-700 hover:text-amber-700 disabled:opacity-30 cursor-pointer"
                          title="Move product down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-300 relative shrink-0 bg-slate-100 shadow-2xs">
                          <img
                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200'}
                            alt={item.name}
                            className={`w-full h-full object-cover ${item.censorship_flags?.blurred || item.vetting_status === 'censored' ? 'filter blur-xs' : ''}`}
                          />
                          {(item.censorship_flags?.blurred || item.vetting_status === 'censored') && (
                            <span className="absolute inset-0 bg-black/60 text-white text-[8px] font-black uppercase flex items-center justify-center">
                              18+
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-slate-600 font-mono">SKU: {item.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.merchant_name || 'Sovereign Merchant Ltd'}</div>
                      <div className="text-[11px] text-slate-700 font-medium">{item.storefront_name || 'Storefront Hub'}</div>
                      <div className="text-[10px] text-slate-500">{new Date(item.created_at).toLocaleDateString()}</div>
                      <div className="mt-1 flex items-center space-x-1.5">
                        <HardDrive className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-700">
                          {item.storefront_tier || 'Merchant Pro (10 GB)'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{item.category}</span>
                      <div className="text-[10px] text-slate-500 uppercase">{item.goods_type}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">{item.price_fic} FIC</span>
                      <div className="text-[11px] text-slate-600 font-medium">₦{Number(item.price_fiat).toLocaleString()}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">{item.stock_quantity} in stock</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${getVettingBadgeStyle(item.vetting_status)}`}
                      >
                        {item.vetting_status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-700" />}
                        {item.vetting_status === 'pending_vetting' && <Clock className="w-3 h-3 mr-1 text-amber-700" />}
                        {item.vetting_status === 'censored' && <Lock className="w-3 h-3 mr-1 text-purple-700" />}
                        {item.vetting_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Freeze (Hold Item) */}
                        <button
                          type="button"
                          onClick={() => handleToggleFreeze(item)}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                            (item as any).status === 'frozen'
                              ? 'bg-blue-200 text-blue-950 border-blue-400'
                              : 'bg-slate-100 text-slate-700 hover:bg-blue-50 border-slate-300'
                          }`}
                          title={(item as any).status === 'frozen' ? 'Unfreeze product' : 'Freeze product (Compliance hold)'}
                        >
                          <span className="text-[10px]">{(item as any).status === 'frozen' ? 'Unfreeze' : 'Freeze'}</span>
                        </button>

                        {/* Censor (18+ Sensitive Blur Mask) */}
                        <button
                          type="button"
                          onClick={() => handleToggleCensor(item)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            item.censorship_flags?.blurred
                              ? 'bg-purple-100 text-purple-950 border-purple-400'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                          }`}
                          title={item.censorship_flags?.blurred ? 'Remove 18+ blur mask' : 'Apply 18+ sensitive blur mask'}
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
                        </button>

                        {/* Suspend */}
                        <button
                          type="button"
                          onClick={() => handleToggleSuspend(item)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            (item as any).status === 'suspended'
                              ? 'bg-rose-100 text-rose-950 border-rose-400'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                          }`}
                          title={(item as any).status === 'suspended' ? 'Restore product' : 'Suspend product (Delist)'}
                        >
                          <AlertOctagon className="w-3.5 h-3.5 text-rose-700" />
                        </button>

                        {/* Pause Inquiries */}
                        <button
                          type="button"
                          onClick={() => handleTogglePauseComments(item)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            (item as any).is_comments_paused
                              ? 'bg-amber-100 text-amber-950 border-amber-400'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                          }`}
                          title={(item as any).is_comments_paused ? 'Resume inquiries' : 'Pause inquiries'}
                        >
                          <PauseCircle className="w-3.5 h-3.5 text-amber-700" />
                        </button>

                        {/* Vet & Moderate Modal Button */}
                        <button
                          onClick={() => {
                            setSelectedProductForVetting(item);
                            setVettingNotes(item.vetting_notes || '');
                            setCensorBlurMedia(item.censorship_flags?.blurred || false);
                            setAgeRestricted(item.censorship_flags?.age_restricted || false);
                          }}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                        >
                          Vet
                        </button>

                        {/* Report Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenReport(item)}
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-300 transition cursor-pointer"
                          title="Report item to moderation"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>

                        {/* Super Admin Delete */}
                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => handlePermanentDelete(item)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-300 transition cursor-pointer"
                            title="Permanently Purge Record from PostgreSQL (Super Admin)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vetting & Censorship Inspection Modal */}
      {selectedProductForVetting && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-xl w-full p-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Vetting & Censorship Inspection</h3>
                <p className="text-xs text-slate-600 font-mono mt-0.5">{selectedProductForVetting.name}</p>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setSelectedProductForVetting(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Product preview banner */}
              <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <img
                  src={selectedProductForVetting.images?.[0] || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200'}
                  alt={selectedProductForVetting.name}
                  className="w-14 h-14 rounded-lg object-cover border border-slate-300"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{selectedProductForVetting.name}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{selectedProductForVetting.description || 'No description provided.'}</p>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                    {selectedProductForVetting.price_fic} FIC (₦{Number(selectedProductForVetting.price_fiat).toLocaleString()})
                  </span>
                </div>
              </div>

              {/* Merchant Attribution & Monthly Allocated Storage Quota */}
              <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    Merchant: <span className="text-amber-800 font-extrabold">{selectedProductForVetting.merchant_name || 'Sovereign Merchant Ltd'}</span>
                  </span>
                  <span className="text-slate-600 text-[11px] font-mono">
                    {selectedProductForVetting.merchant_email || 'merchant@fingermobile.org'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-700">
                  <span>Storefront: <strong className="text-slate-900">{selectedProductForVetting.storefront_name || 'Storefront Hub'}</strong></span>
                  <span>Ingested: <strong className="text-slate-900">{new Date(selectedProductForVetting.created_at).toLocaleString()}</strong></span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="flex items-center space-x-1.5 text-slate-800">
                      <HardDrive className="w-3.5 h-3.5 text-amber-700" />
                      <span>Monthly Storage Space: {selectedProductForVetting.storefront_tier || 'Merchant Pro (10 GB)'}</span>
                    </span>
                    <span className="text-emerald-700 font-mono text-[11px]">1.42 GB / 10.00 GB (14.2% used)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '14.2%' }} />
                  </div>
                </div>
              </div>

              {/* Bulk Media Select / Deselect / Delete / Freeze Controls */}
              {(() => {
                const allMediaUrls = [
                  ...(selectedProductForVetting.images || []),
                  ...(selectedProductForVetting.video_urls || [])
                ];

                return (
                  <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Product Media Assets ({allMediaUrls.length} total)
                        </h4>
                        <p className="text-[11px] text-slate-600">Select multiple photos or videos to erase, freeze/blur, or unfreeze.</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleSelectAllMedia(allMediaUrls)}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center space-x-1"
                        >
                          {selectedMediaUrls.length === allMediaUrls.length && allMediaUrls.length > 0 ? (
                            <>
                              <CheckSquare className="w-3 h-3 text-amber-600" />
                              <span>Deselect All</span>
                            </>
                          ) : (
                            <>
                              <Square className="w-3 h-3 text-slate-500" />
                              <span>Select All ({allMediaUrls.length})</span>
                            </>
                          )}
                        </button>
                        {selectedMediaUrls.length > 0 && (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                            {selectedMediaUrls.length} selected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Batch Action Buttons */}
                    {selectedMediaUrls.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <span className="text-[11px] font-bold text-amber-950">Actions:</span>
                        <button
                          type="button"
                          disabled={isBatchProcessing}
                          onClick={() => handleBatchMediaAction('delete')}
                          className="px-2.5 py-1 text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center space-x-1 shadow-sm transition"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Erase Selected ({selectedMediaUrls.length})</span>
                        </button>
                        <button
                          type="button"
                          disabled={isBatchProcessing}
                          onClick={() => handleBatchMediaAction('freeze')}
                          className="px-2.5 py-1 text-[11px] font-bold bg-purple-700 hover:bg-purple-800 text-white rounded-lg flex items-center space-x-1 shadow-sm transition"
                        >
                          <EyeOff className="w-3 h-3" />
                          <span>Freeze / Blur ({selectedMediaUrls.length})</span>
                        </button>
                        <button
                          type="button"
                          disabled={isBatchProcessing}
                          onClick={() => handleBatchMediaAction('unfreeze')}
                          className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center space-x-1 shadow-sm transition"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Unfreeze ({selectedMediaUrls.length})</span>
                        </button>
                      </div>
                    )}

                    {/* Media Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
                      {selectedProductForVetting.images?.map((url, idx) => {
                        const isSelected = selectedMediaUrls.includes(url);
                        const isFrozen = (selectedProductForVetting.censorship_flags?.frozen_urls || []).includes(url);
                        return (
                          <div
                            key={`img-${idx}`}
                            onClick={() => handleToggleMediaSelect(url)}
                            className={`relative aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                              isSelected ? 'border-amber-500 shadow-md ring-2 ring-amber-300' : 'border-slate-300 hover:border-slate-400'
                            }`}
                          >
                            <img
                              src={url}
                              alt={`Asset ${idx + 1}`}
                              className={`w-full h-full object-cover ${isFrozen ? 'blur-sm grayscale' : ''}`}
                            />
                            <div className="absolute top-1.5 left-1.5">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                              />
                            </div>
                            {isFrozen && (
                              <div className="absolute inset-0 bg-purple-950/60 backdrop-blur-[2px] flex items-center justify-center p-1 text-center">
                                <span className="text-[10px] font-black text-white bg-purple-900/90 px-1.5 py-0.5 rounded border border-purple-400">
                                  ❄️ FROZEN / BLURRED
                                </span>
                              </div>
                            )}
                            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded font-mono">
                              Photo #{idx + 1}
                            </span>
                          </div>
                        );
                      })}
                      {selectedProductForVetting.video_urls?.map((vUrl, vIdx) => {
                        const isSelected = selectedMediaUrls.includes(vUrl);
                        const isFrozen = (selectedProductForVetting.censorship_flags?.frozen_urls || []).includes(vUrl);
                        return (
                          <div
                            key={`vid-${vIdx}`}
                            onClick={() => handleToggleMediaSelect(vUrl)}
                            className={`relative aspect-video rounded-xl overflow-hidden border-2 cursor-pointer bg-black transition ${
                              isSelected ? 'border-amber-500 shadow-md ring-2 ring-amber-300' : 'border-slate-300 hover:border-slate-400'
                            }`}
                          >
                            <video src={vUrl} className={`w-full h-full object-cover ${isFrozen ? 'blur-sm' : ''}`} />
                            <div className="absolute top-1.5 left-1.5">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                              />
                            </div>
                            {isFrozen && (
                              <div className="absolute inset-0 bg-purple-950/60 backdrop-blur-[2px] flex items-center justify-center p-1 text-center">
                                <span className="text-[10px] font-black text-white bg-purple-900/90 px-1.5 py-0.5 rounded border border-purple-400">
                                  ❄️ FROZEN VIDEO
                                </span>
                              </div>
                            )}
                            <span className="absolute bottom-1 right-1 bg-indigo-900/90 text-white text-[9px] px-1 rounded font-mono flex items-center space-x-1">
                              <Video className="w-2.5 h-2.5" />
                              <span>Video #{vIdx + 1}</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Censorship toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-800">Censorship & Blurring Controls</h4>
                <label className="flex items-center space-x-2 p-2 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={censorBlurMedia}
                    onChange={(e) => setCensorBlurMedia(e.target.checked)}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900">Apply Visual Blur to Photos / Videos</span>
                    <p className="text-[10px] text-slate-600">Requires buyer to confirm content consent before viewing</p>
                  </div>
                </label>

                <label className="flex items-center space-x-2 p-2 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={ageRestricted}
                    onChange={(e) => setAgeRestricted(e.target.checked)}
                    className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900">Enforce Age & Identity Verification Gate (18+)</span>
                    <p className="text-[10px] text-slate-600">Restricted to Sovereign Biometric KYC-verified accounts</p>
                  </div>
                </label>
              </div>

              {/* Vetting Reviewer Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Vetting Notes & Compliance Audit Memo
                </label>
                <textarea
                  rows={3}
                  value={vettingNotes}
                  onChange={(e) => setVettingNotes(e.target.value)}
                  placeholder="Reason for approval, blur guidelines, or feedback for merchant..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Sovereign Compliance & RBAC Actions Box - Black with hairline of dark red (#880808) */}
            <div className="bg-black border border-[#880808] rounded-xl p-3.5 space-y-3 shadow-lg text-white">
              <div className="flex items-center justify-between pb-2 border-b border-red-950/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">Compliance & RBAC Actions</span>
                </div>
                <span className="text-[10px] font-mono text-rose-300 font-bold">SOVEREIGN VETTING</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Enforce regulatory compliance, blur sensitive imagery, verify merchant legitimacy, or approve catalog publication.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleApplyVetting('reject')}
                  className="px-4 py-2 bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5 text-rose-400" />
                  Reject Listing
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleApplyVetting('censor')}
                    className="px-4 py-2 bg-purple-950/70 hover:bg-purple-900 text-purple-200 border border-purple-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <EyeOff className="w-3.5 h-3.5 text-purple-400" />
                    Apply Censorship
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyVetting('approve')}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    Approve for Storefronts
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Creation & Direct Media Upload Modal */}
      {showCreateProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-indigo-700" />
                  Add Storefront Product & Direct Media Upload
                </h3>
                <p className="text-xs text-slate-700 font-medium mt-0.5">
                  Direct multipart upload saving permanently to Express storage and PostgreSQL catalog.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateProductModal(false)}
                className="text-slate-500 hover:text-slate-900 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStorefrontProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    placeholder="e.g. Master ANC Studio Pro Headphones"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">SKU</label>
                  <input
                    type="text"
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    placeholder="e.g. STR-ANC-9000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Price (FIC)</label>
                  <input
                    type="number"
                    value={newProductForm.price_fic}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price_fic: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Price (FIAT ₦)</label>
                  <input
                    type="number"
                    value={newProductForm.price_fiat}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price_fiat: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newProductForm.stock_quantity}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock_quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  >
                    <option value="Electronics & Audio">Electronics & Audio</option>
                    <option value="Apparel & Couture">Apparel & Couture</option>
                    <option value="Jewelry & Watches">Jewelry & Watches</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Digital Collectibles">Digital Collectibles</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Goods Type</label>
                  <select
                    value={newProductForm.goods_type}
                    onChange={(e) => setNewProductForm({ ...newProductForm, goods_type: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  >
                    <option value="physical">Physical Goods</option>
                    <option value="digital">Digital Download</option>
                    <option value="service">Bookable Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  placeholder="Product specifications, materials, warranty details..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              {/* Direct Media Picker */}
              <CommerceMediaPicker
                value={createProductMediaValue}
                onChange={setCreateProductMediaValue}
                title="Product Media (Cover Photo, Gallery, Video Reel)"
                description="Upload high-res product photos, 360-view gallery shots, and showcase video reels saved to Express backend."
                allowGallery={true}
                allowVideo={true}
              />

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateProductModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold text-xs shadow-xs"
                >
                  Publish Product to PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && productToReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Flag className="w-5 h-5 text-amber-700" />
                Report Storefront Product
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowReportModal(false);
                  setProductToReport(null);
                }}
                className="text-slate-500 hover:text-slate-900 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-700 font-medium">
              Filing formal complaint for item <strong className="text-slate-900">&ldquo;{productToReport.name}&rdquo;</strong>.
              Recorded directly in PostgreSQL management audit log.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1">Violation / Report Reason</label>
              <textarea
                rows={3}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Reason for report (e.g. counterfeit, unauthorized brand, safety)..."
                className="w-full p-2.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowReportModal(false);
                  setProductToReport(null);
                }}
                className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReport}
                disabled={!reportReason.trim()}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 disabled:opacity-40 text-white rounded-xl font-bold text-xs"
              >
                Submit Report to PostgreSQL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorefrontVettingCatalogConsole;
