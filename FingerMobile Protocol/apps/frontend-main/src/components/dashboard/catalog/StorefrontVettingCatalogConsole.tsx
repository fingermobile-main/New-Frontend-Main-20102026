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
  Image as ImageIcon,
  CheckSquare,
  Square
} from 'lucide-react';
import { api } from '../../../services/api';
import { CatalogProduct } from './GeneralProductCatalogConsole';

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
                  <th className="py-3 px-4">Merchant Item & Photos</th>
                  <th className="py-3 px-4">Merchant & Storage Quota</th>
                  <th className="py-3 px-4">Category & Type</th>
                  <th className="py-3 px-4">Storefront Price</th>
                  <th className="py-3 px-4">Stock Units</th>
                  <th className="py-3 px-4">Vetting Status</th>
                  <th className="py-3 px-4 text-right">Moderation & Censorship</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200'}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                        />
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
                      <button
                        onClick={() => {
                          setSelectedProductForVetting(item);
                          setVettingNotes(item.vetting_notes || '');
                          setCensorBlurMedia(item.censorship_flags?.blurred || false);
                          setAgeRestricted(item.censorship_flags?.age_restricted || false);
                        }}
                        className="min-h-[44px] px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer"
                      >
                        Vet & Moderate
                      </button>
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

            {/* Decision Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleApplyVetting('reject')}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition"
              >
                Reject Listing
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleApplyVetting('censor')}
                  className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 rounded-xl text-xs font-bold transition"
                >
                  Apply Censorship
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyVetting('approve')}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  Approve for Storefronts
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorefrontVettingCatalogConsole;
