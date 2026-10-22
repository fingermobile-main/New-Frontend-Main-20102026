import React, { useState, useEffect, useCallback } from 'react';
import {
  Gem,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';
import { api } from '../../../services/api';
import { CatalogProduct } from './GeneralProductCatalogConsole';

export const OwnitCatalogConsole: React.FC = () => {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [selectedProductForRestock, setSelectedProductForRestock] = useState<CatalogProduct | null>(null);
  const [restockAmount, setRestockAmount] = useState('1');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchOwnitCatalog = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/catalog/ownit');
      if (res.data?.success) {
        setProducts(res.data.data || []);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Error loading OwnIt catalog');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwnitCatalog();
  }, [fetchOwnitCatalog]);

  const handleRemoveFromOwnit = async (id: string, name: string) => {
    if (!window.confirm(`Withdraw "${name}" from OwnIt installments & 1-of-1 tier?`)) return;
    try {
      const prod = products.find((p) => p.id === id);
      if (!prod) return;
      const updatedStores = (prod.curated_stores || []).filter((s) => s !== 'ownit');
      const res = await api.post(`/catalog/general/${id}/curate`, { curated_stores: updatedStores });
      if (res.data?.success) {
        showToast(`"${name}" withdrawn from OwnIt.`);
        fetchOwnitCatalog();
      }
    } catch (err: any) {
      showToast('Error removing product from OwnIt');
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
        fetchOwnitCatalog();
      }
    } catch (err: any) {
      showToast('Error restocking product');
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-purple-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 bg-purple-100 border border-purple-300 text-purple-950 rounded-xl">
              <Gem className="w-6 h-6 text-purple-700" />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">OwnIt Product Catalogue Console</h2>
              <p className="text-sm text-slate-700 mt-0.5">
                Micro-manage 1-of-1 fine art, rent-to-own luxury assets, cryptographic SHA256 authenticity chains, and installment schedules for <span className="font-mono text-purple-800">/ownit</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => fetchOwnitCatalog()}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 transition shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <a
              href="/ownit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <span>View Live OwnIt</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs font-bold text-rose-900">
            {error}
          </div>
        )}

        {/* OwnIt Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-950">Active 1-of-1 Assets</span>
            <p className="text-2xl font-black text-purple-950 mt-1">{products.length}</p>
          </div>
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-950">SHA256 Ledger Provenance</span>
            <p className="text-2xl font-black text-indigo-950 mt-1">100% Cryptographic</p>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-950">Gross Catalogue Value</span>
            <p className="text-2xl font-black text-emerald-950 mt-1">
              {products.reduce((acc, curr) => acc + Number(curr.price_fic), 0).toLocaleString()} FIC
            </p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Installment Tiers</span>
            <p className="text-2xl font-black text-slate-900 mt-1">3, 6, 12 Months</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-300 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search OwnIt assets or certificate numbers..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Listings */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-700 flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-3" />
            <p className="text-sm font-semibold">Loading OwnIt catalogue from PostgreSQL...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-700">
            <Gem className="w-12 h-12 mx-auto mb-3 text-purple-400" />
            <h3 className="text-base font-bold text-slate-900">No assets curated for OwnIt</h3>
            <p className="text-xs text-slate-600 mt-1">
              Allocate fine art, numbered physical sculptures, or layaway assets from the General Product Catalogue.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  <th className="py-3 px-4">Asset Title & Media</th>
                  <th className="py-3 px-4">Ledger & Cert #</th>
                  <th className="py-3 px-4">Ownership Price</th>
                  <th className="py-3 px-4">Installment Schedule</th>
                  <th className="py-3 px-4">Units Available</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-800">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200'}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-slate-600 font-mono">Edition: 1-of-1 Sovereign Bronze</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-purple-900 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-[11px]">
                        {item.specifications?.cert_number || 'OWN-CERT-7701'}
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono mt-1 truncate max-w-[120px]">
                        {item.specifications?.hash || '0x8f9c42b109...'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">{item.price_fic} FIC</span>
                      <div className="text-[11px] text-slate-600 font-medium">₦{Number(item.price_fiat).toLocaleString()}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-300">
                        <Calendar className="w-3 h-3 mr-1 text-emerald-700" />
                        12 Months @ 320 FIC/mo
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">{item.stock_quantity} available</span>
                      <div>
                        <button
                          onClick={() => setSelectedProductForRestock(item)}
                          className="text-[11px] font-bold text-purple-700 hover:text-purple-900 underline"
                        >
                          + Restock
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleRemoveFromOwnit(item.id, item.name)}
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 text-xs font-bold transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Restock Modal */}
      {selectedProductForRestock && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Restock OwnIt Units</h3>
              <button type="button" onClick={() => setSelectedProductForRestock(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRestockSubmit} className="pt-4 space-y-4">
              <div>
                <span className="text-xs text-slate-600 font-medium">Asset</span>
                <p className="text-xs font-bold text-slate-900">{selectedProductForRestock.name}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Additional Units</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500"
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
                <button type="submit" className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow">
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnitCatalogConsole;
