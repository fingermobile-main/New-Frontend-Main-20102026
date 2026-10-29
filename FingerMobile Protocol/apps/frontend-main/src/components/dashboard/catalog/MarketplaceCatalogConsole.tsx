import React, { useState, useEffect, useCallback } from 'react';
import {
  ShoppingBag,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  Lock,
  Unlock,
  EyeOff,
  Eye,
  PauseCircle,
  PlayCircle,
  ShieldAlert,
  AlertOctagon,
  ArrowUp,
  ArrowDown,
  Flag
} from 'lucide-react';
import { api } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserRoleTier, PRIMARY_ADMIN_EMAILS } from '../../../services/platformRbac';
import { CommerceMediaPicker, CommerceMediaValue } from '../../common/CommerceMediaPicker';
import { CatalogProduct } from './GeneralProductCatalogConsole';

export const MarketplaceCatalogConsole: React.FC = () => {
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
    (Array.isArray((user as any)?.roles) && (user as any).roles.includes('moderator')) ||
    (Array.isArray((user as any)?.permissions) && (user as any).permissions.includes('moderate'));

  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Ingestion Modal with CommerceMediaPicker
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProductData, setNewProductData] = useState({
    name: '',
    subtitle: '',
    description: '',
    category: 'Hardware & Electronics',
    goods_type: 'physical',
    price_fic: '25.0',
    price_fiat: '15000',
    stock_quantity: '50',
    sku: ''
  });
  const [mediaPickerValue, setMediaPickerValue] = useState<CommerceMediaValue>({
    coverUrl: '',
    galleryUrls: [],
    videoUrl: '',
    isCensored: false
  });

  // Permanent Delete & Report Modals
  const [productToDelete, setProductToDelete] = useState<CatalogProduct | null>(null);
  const [productToReport, setProductToReport] = useState<CatalogProduct | null>(null);
  const [reportReason, setReportReason] = useState<string>('');

  // Quick restock modal
  const [selectedProductForRestock, setSelectedProductForRestock] = useState<CatalogProduct | null>(null);
  const [restockAmount, setRestockAmount] = useState('50');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchMarketplaceCatalog = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/catalog/marketplace');
      if (res.data?.success) {
        setProducts(res.data.data || []);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error loading marketplace catalog');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketplaceCatalog();
  }, [fetchMarketplaceCatalog]);

  const handleCreateMarketplaceProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductData.name.trim()) {
      showToast('Please enter a product title');
      return;
    }

    try {
      setIsSubmitting(true);
      const images = [
        ...(mediaPickerValue.coverUrl ? [mediaPickerValue.coverUrl] : []),
        ...mediaPickerValue.galleryUrls
      ].filter(Boolean);

      const video_urls = mediaPickerValue.videoUrl ? [mediaPickerValue.videoUrl] : [];

      const payload = {
        name: newProductData.name.trim(),
        subtitle: newProductData.subtitle.trim(),
        description: newProductData.description.trim(),
        category: newProductData.category,
        goods_type: newProductData.goods_type,
        price_fic: parseFloat(newProductData.price_fic) || 10,
        price_fiat: parseFloat(newProductData.price_fiat) || 5000,
        stock_quantity: parseInt(newProductData.stock_quantity, 10) || 10,
        images,
        video_urls,
        curated_stores: ['marketplace'],
        status: 'active',
        vetting_status: 'approved',
        censorship_flags: {
          is_blurred: mediaPickerValue.isCensored || false
        }
      };

      const res = await api.post('/catalog/general', payload);
      if (res.data?.success) {
        showToast(`"${newProductData.name}" added to Marketplace catalog.`);
        setIsAddModalOpen(false);
        setNewProductData({
          name: '',
          subtitle: '',
          description: '',
          category: 'Hardware & Electronics',
          goods_type: 'physical',
          price_fic: '25.0',
          price_fiat: '15000',
          stock_quantity: '50',
          sku: ''
        });
        setMediaPickerValue({ coverUrl: '', galleryUrls: [], videoUrl: '', isCensored: false });
        fetchMarketplaceCatalog();
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to add marketplace product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFreeze = async (prod: CatalogProduct) => {
    const isFrozen = Boolean((prod.censorship_flags as any)?.is_frozen);
    try {
      const nextFlags = {
        ...(prod.censorship_flags || {}),
        is_frozen: !isFrozen
      };
      const res = await api.put(`/catalog/general/${prod.id}`, { censorship_flags: nextFlags });
      if (res.data?.success) {
        showToast(isFrozen ? `Unfroze "${prod.name}"` : `Froze "${prod.name}": interactions locked`);
        fetchMarketplaceCatalog();
      }
    } catch {
      showToast('Failed to update freeze status');
    }
  };

  const handleToggleCensor = async (prod: CatalogProduct) => {
    const isBlurred = Boolean((prod.censorship_flags as any)?.is_blurred);
    try {
      const nextFlags = {
        ...(prod.censorship_flags || {}),
        is_blurred: !isBlurred
      };
      const res = await api.put(`/catalog/general/${prod.id}`, { censorship_flags: nextFlags });
      if (res.data?.success) {
        showToast(isBlurred ? `Uncensored "${prod.name}"` : `Censored "${prod.name}" (18+ blur applied)`);
        fetchMarketplaceCatalog();
      }
    } catch {
      showToast('Failed to update censor status');
    }
  };

  const handleToggleSuspend = async (prod: CatalogProduct) => {
    const nextStatus = prod.status === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await api.put(`/catalog/general/${prod.id}`, { status: nextStatus });
      if (res.data?.success) {
        showToast(nextStatus === 'suspended' ? `Suspended "${prod.name}" (taken offline)` : `Restored "${prod.name}" to active`);
        fetchMarketplaceCatalog();
      }
    } catch {
      showToast('Failed to toggle suspend status');
    }
  };

  const handleTogglePauseComments = async (prod: CatalogProduct) => {
    const isPaused = Boolean((prod.censorship_flags as any)?.is_comments_paused);
    try {
      const nextFlags = {
        ...(prod.censorship_flags || {}),
        is_comments_paused: !isPaused
      };
      const res = await api.put(`/catalog/general/${prod.id}`, { censorship_flags: nextFlags });
      if (res.data?.success) {
        showToast(isPaused ? `Resumed comments on "${prod.name}"` : `Paused comments on "${prod.name}"`);
        fetchMarketplaceCatalog();
      }
    } catch {
      showToast('Failed to toggle comments status');
    }
  };

  const handlePermanentDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await api.delete(`/catalog/general/${productToDelete.id}`);
      if (res.data?.success) {
        showToast(`Permanently deleted "${productToDelete.name}" from PostgreSQL`);
        setProductToDelete(null);
        fetchMarketplaceCatalog();
      }
    } catch {
      showToast('Failed to delete product');
    }
  };

  const handleRemoveFromMarketplace = async (id: string, name: string) => {
    if (!window.confirm(`Withdraw "${name}" from the active Marketplace?`)) return;
    try {
      const prod = products.find((p) => p.id === id);
      if (!prod) return;
      const updatedStores = (prod.curated_stores || []).filter((s) => s !== 'marketplace');
      const res = await api.post(`/catalog/general/${id}/curate`, { curated_stores: updatedStores });
      if (res.data?.success) {
        showToast(`"${name}" withdrawn from Marketplace.`);
        fetchMarketplaceCatalog();
      }
    } catch (_err: any) {
      showToast('Error removing product from marketplace');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= products.length) return;

    const newProds = [...products];
    const [moved] = newProds.splice(index, 1);
    newProds.splice(targetIdx, 0, moved);
    setProducts(newProds);
    showToast(`Moved "${moved.name}" ${direction}`);

    try {
      await api.put(`/catalog/general/${moved.id}`, {
        specifications: {
          ...(moved.specifications || {}),
          display_order: targetIdx
        }
      });
    } catch {
      // optimistic state retained
    }
  };

  const submitReport = async () => {
    if (!productToReport || !reportReason.trim()) return;
    try {
      const nextFlags = {
        ...(productToReport.censorship_flags || {}),
        is_reported: true,
        report_reason: reportReason.trim(),
        reported_at: new Date().toISOString()
      };
      await api.put(`/catalog/general/${productToReport.id}`, { censorship_flags: nextFlags });
      showToast(`Filed report for "${productToReport.name}"`);
      setProductToReport(null);
      setReportReason('');
      fetchMarketplaceCatalog();
    } catch {
      showToast('Failed to file report');
    }
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForRestock) return;
    const qty = parseInt(restockAmount, 10);
    try {
      const res = await api.post(`/catalog/general/${selectedProductForRestock.id}/restock`, { quantity: qty });
      if (res.data?.success) {
        showToast(`Restocked ${qty} units for ${selectedProductForRestock.name}`);
        setSelectedProductForRestock(null);
        fetchMarketplaceCatalog();
      }
    } catch (_err: any) {
      showToast('Error restocking product');
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
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 bg-indigo-100 border border-indigo-300 text-indigo-950 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-indigo-700" />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Marketplace Product Catalogue Console</h2>
              <p className="text-sm text-slate-700 mt-0.5">
                Micro-manage items actively curated for the sovereign public Marketplace at <span className="font-mono text-indigo-800">/marketplace</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Marketplace Product</span>
              </button>
            )}
            <button
              onClick={() => fetchMarketplaceCatalog()}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 transition shadow-sm cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <a
              href="/marketplace"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <span>View Live Marketplace</span>
              <ExternalLink className="w-3.5 h-3.5" />
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
                Compliance & RBAC Actions: Marketplace Catalog
              </h4>
              <p className="text-[11px] text-slate-300 font-medium">
                Admin: Freeze, Suspend, Censor (18+ Blur), Pause Inquiries · Super Admin: Permanent Purge from PostgreSQL
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-red-950/80 text-rose-200 border border-red-800/80">
              {isSuperAdmin ? 'ROLE: SUPER ADMIN' : isAdmin ? 'ROLE: ADMIN' : 'ROLE: MODERATOR'}
            </span>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Active Listings</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{products.length}</p>
          </div>
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">Flagship Hardware</span>
            <p className="text-2xl font-black text-indigo-950 mt-1">
              {products.filter((p) => p.category.includes('Hardware')).length}
            </p>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">Total Stock Available</span>
            <p className="text-2xl font-black text-emerald-950 mt-1">
              {products.reduce((acc, curr) => acc + (curr.stock_quantity || 0), 0)} units
            </p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-950">Avg Unit Price</span>
            <p className="text-2xl font-black text-amber-950 mt-1">
              {products.length > 0
                ? (products.reduce((acc, c) => acc + Number(c.price_fic), 0) / products.length).toFixed(0)
                : 0}{' '}
              FIC
            </p>
          </div>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="bg-white border border-slate-300 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Marketplace catalogue items..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Marketplace Listings Table */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-700 flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
            <p className="text-sm font-semibold">Loading Marketplace items from PostgreSQL...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-700">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <h3 className="text-base font-bold text-slate-900">No items curated for Marketplace</h3>
            <p className="text-xs text-slate-600 mt-1">
              Go to the General Product Catalogue to select and allocate products for Marketplace.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  <th className="py-3 px-3 text-center w-16">Move</th>
                  <th className="py-3 px-4">Marketplace Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">FIC Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status & Compliance</th>
                  <th className="py-3 px-4 text-right">Micro-Management (RBAC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                {filtered.map((item, index) => {
                  const isFrozen = Boolean((item.censorship_flags as any)?.is_frozen);
                  const isCensored = Boolean((item.censorship_flags as any)?.is_blurred);
                  const isCommentsPaused = Boolean((item.censorship_flags as any)?.is_comments_paused);
                  const isSuspended = item.status === 'suspended';
                  const isReported = Boolean((item.censorship_flags as any)?.is_reported);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Move Order */}
                      <td className="py-3 px-2 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveOrder(index, 'up')}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-300 transition cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] font-mono font-bold text-slate-600">#{index + 1}</span>
                          <button
                            type="button"
                            disabled={index === filtered.length - 1}
                            onClick={() => handleMoveOrder(index, 'down')}
                            className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-300 transition cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-300 shrink-0">
                            <img
                              src={item.images?.[0] || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200'}
                              alt={item.name}
                              className={`w-full h-full object-cover ${isCensored ? 'filter blur-xs' : ''}`}
                            />
                            {isCensored && (
                              <div className="absolute inset-0 bg-purple-950/60 flex items-center justify-center">
                                <span className="text-[8px] font-black text-white uppercase tracking-wider px-1 bg-purple-900 rounded">18+</span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                              <span>{item.name}</span>
                              {isCommentsPaused && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-950 border border-amber-300">
                                  Paused
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-600 font-mono">SKU: {item.sku || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{item.category}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{item.price_fic} FIC</span>
                        <div className="text-[11px] text-slate-600 font-medium">₦{Number(item.price_fiat).toLocaleString()}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{item.stock_quantity} in stock</span>
                        <div>
                          <button
                            onClick={() => setSelectedProductForRestock(item)}
                            className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
                          >
                            + Restock
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isSuspended
                              ? 'bg-rose-100 text-rose-950 border-rose-400'
                              : isFrozen
                              ? 'bg-blue-100 text-blue-950 border-blue-400'
                              : isCensored
                              ? 'bg-purple-100 text-purple-950 border-purple-400'
                              : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isSuspended ? 'bg-rose-600' : isFrozen ? 'bg-blue-600' : isCensored ? 'bg-purple-600' : 'bg-emerald-600'
                            }`} />
                            {isSuspended ? 'SUSPENDED' : isFrozen ? 'FROZEN' : isCensored ? 'CENSORED' : 'ACTIVE'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* Freeze / Unfreeze Button */}
                          {isModerator && (
                            <button
                              onClick={() => handleToggleFreeze(item)}
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                isFrozen
                                  ? 'bg-blue-100 text-blue-950 border-blue-400 hover:bg-blue-200'
                                  : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                              }`}
                              title={isFrozen ? 'Unfreeze Interactions' : 'Freeze Interactions'}
                            >
                              {isFrozen ? <Unlock className="w-3.5 h-3.5 text-blue-800" /> : <Lock className="w-3.5 h-3.5 text-slate-700" />}
                            </button>
                          )}

                          {/* Censor / Uncensor (18+ Mask) */}
                          {isModerator && (
                            <button
                              onClick={() => handleToggleCensor(item)}
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                isCensored
                                  ? 'bg-purple-100 text-purple-950 border-purple-400 hover:bg-purple-200'
                                  : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                              }`}
                              title={isCensored ? 'Uncensor Product (Lift 18+ mask)' : 'Censor Product (Apply 18+ blur mask)'}
                            >
                              {isCensored ? <Eye className="w-3.5 h-3.5 text-purple-800" /> : <EyeOff className="w-3.5 h-3.5 text-slate-700" />}
                            </button>
                          )}

                          {/* Pause Commenting / Inquiries */}
                          {isModerator && (
                            <button
                              onClick={() => handleTogglePauseComments(item)}
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                isCommentsPaused
                                  ? 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200'
                                  : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                              }`}
                              title={isCommentsPaused ? 'Resume Inquiries' : 'Pause Inquiries'}
                            >
                              {isCommentsPaused ? <PlayCircle className="w-3.5 h-3.5 text-amber-800" /> : <PauseCircle className="w-3.5 h-3.5 text-slate-700" />}
                            </button>
                          )}

                          {/* Suspend / Restore (Delist) */}
                          {isModerator && (
                            <button
                              onClick={() => handleToggleSuspend(item)}
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                isSuspended
                                  ? 'bg-rose-100 text-rose-950 border-rose-400 hover:bg-rose-200'
                                  : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                              }`}
                              title={isSuspended ? 'Restore to Active Marketplace' : 'Suspend from Marketplace'}
                            >
                              <AlertOctagon className={`w-3.5 h-3.5 ${isSuspended ? 'text-rose-800' : 'text-slate-700'}`} />
                            </button>
                          )}

                          {/* Report */}
                          <button
                            type="button"
                            onClick={() => setProductToReport(item)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isReported
                                ? 'bg-red-100 text-red-950 border-red-400 hover:bg-red-200'
                                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                            }`}
                            title="File Regulatory Report"
                          >
                            <Flag className={`w-3.5 h-3.5 ${isReported ? 'text-red-700' : 'text-slate-700'}`} />
                          </button>

                          {/* Withdraw Button */}
                          <button
                            onClick={() => handleRemoveFromMarketplace(item.id, item.name)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300 text-xs font-bold transition cursor-pointer"
                            title="Withdraw from Marketplace shelf"
                          >
                            Withdraw
                          </button>

                          {/* Super Admin Permanent Purge */}
                          {isSuperAdmin && (
                            <button
                              onClick={() => setProductToDelete(item)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-300 transition cursor-pointer"
                              title="Permanently Purge Record (Super Admin)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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

      {/* Add Marketplace Product Modal with Universal CommerceMediaPicker */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-indigo-900">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Add Product to Marketplace</h3>
              </div>
              <button aria-label="Close" type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMarketplaceProduct} className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={newProductData.name}
                    onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                    placeholder="e.g. Sovereign Satellite Terminal"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Subtitle / Edition</label>
                  <input
                    type="text"
                    value={newProductData.subtitle}
                    onChange={(e) => setNewProductData({ ...newProductData, subtitle: e.target.value })}
                    placeholder="e.g. Military Grade 4K Hardware"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                  <select
                    value={newProductData.category}
                    onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Hardware & Electronics">Hardware & Electronics</option>
                    <option value="Sovereign Telecom & Data">Sovereign Telecom & Data</option>
                    <option value="Apparel & Protocol Merch">Apparel & Protocol Merch</option>
                    <option value="Art & Collectibles">Art & Collectibles</option>
                    <option value="Digital Goods & Licenses">Digital Goods & Licenses</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProductData.stock_quantity}
                    onChange={(e) => setNewProductData({ ...newProductData, stock_quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Price (FIC Token)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={newProductData.price_fic}
                    onChange={(e) => setNewProductData({ ...newProductData, price_fic: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Fiat Equivalent (₦ NGN)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProductData.price_fiat}
                    onChange={(e) => setNewProductData({ ...newProductData, price_fiat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProductData.description}
                  onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
                  placeholder="Detailed specifications, warranty terms, and shipping details..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Universal Media Picker */}
              <CommerceMediaPicker
                value={mediaPickerValue}
                onChange={setMediaPickerValue}
                title="Marketplace Media & Showcase Reel"
                description="Upload cover photo, multi-angle product gallery, and promotional video clips directly to PostgreSQL storage."
                allowGallery={true}
                allowVideo={true}
                maxGalleryImages={8}
              />

              {/* Sovereign Compliance & RBAC Actions Box - Black with hairline of dark red */}
              <div className="bg-black border border-[#880808] rounded-xl p-3.5 space-y-2 shadow-lg text-white">
                <div className="flex items-center justify-between border-b border-red-950/60 pb-1.5">
                  <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    Compliance & RBAC Actions
                  </div>
                  <span className="text-[9px] font-mono text-red-300 font-bold bg-red-950/80 px-2 py-0.5 rounded-full border border-red-800/60">
                    MARKETPLACE POLICY
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">
                  Products added here are immediately registered in PostgreSQL, cataloged for the public marketplace, and subjected to autonomous sentiment and fraud telemetry.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
                >
                  {isSubmitting ? 'Publishing to PostgreSQL...' : 'Publish to Marketplace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Super Admin Permanent Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-red-300 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-3">
            <div className="flex items-center gap-2.5 text-red-600">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h4 className="font-black text-base text-slate-900">Delete Product from Database?</h4>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              As a Sovereign Super Admin, you are about to permanently purge <strong className="text-slate-900">{productToDelete.name}</strong> from the database. This action is irreversible.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePermanentDelete}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {selectedProductForRestock && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Restock Marketplace Units</h3>
              <button aria-label="Close" type="button" onClick={() => setSelectedProductForRestock(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRestockSubmit} className="pt-4 space-y-4">
              <div>
                <span className="text-xs text-slate-600 font-medium">Product</span>
                <p className="text-xs font-bold text-slate-900">{selectedProductForRestock.name}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
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
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Regulatory Report Dialog */}
      {productToReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Flag className="w-5 h-5 text-red-600" />
                <h4 className="font-black text-sm text-slate-900">File Compliance & Regulatory Report</h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProductToReport(null);
                  setReportReason('');
                }}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              Reporting product: <strong className="text-slate-900">{productToReport.name}</strong> ({productToReport.sku})
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Violation or Regulatory Justification *
              </label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="State specific policy violation, trademark issue, prohibited physical goods, or false specs..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-500 bg-white"
              />
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setProductToReport(null);
                  setReportReason('');
                }}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!reportReason.trim()}
                onClick={submitReport}
                className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 rounded-xl shadow transition cursor-pointer"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceCatalogConsole;
