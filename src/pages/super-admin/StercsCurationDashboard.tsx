import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import api from '../../services/api';
import { useToast } from '../../components/Toast';

const StercsCurationDashboard: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'products' | 'ads'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // New item form state
  const [isCreating, setIsCreating] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: '', platform: 'marketplace', description: '' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        // Hitting the real endpoints (we'll fetch general items via a GET endpoint later, but for now we simulate fetching)
        const res = await api.get('/products').catch(() => ({ data: [] })); // Assume general product feed
        setProducts(res.data.products || res.data || []);
      } else {
        const res = await api.get('/ads').catch(() => ({ data: [] }));
        setAds(res.data.ads || res.data || []);
      }
    } catch (error) {
      addToast(`Failed to load ${activeTab}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'products') {
        await api.post('/superadmin/curation/product', { action: 'create', platform: newItem.platform, productData: newItem });
      } else {
        await api.post('/superadmin/curation/ads', { action: 'create', adData: newItem });
      }
      addToast(`${activeTab === 'products' ? 'Product' : 'Ad'} created successfully`, 'success');
      setIsCreating(false);
      fetchData();
    } catch (error) {
      addToast(`Failed to create ${activeTab === 'products' ? 'Product' : 'Ad'}`, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (activeTab === 'products') {
        await api.post('/superadmin/curation/product', { action: 'delete', platform: 'marketplace', productId: id });
      } else {
        await api.post('/superadmin/curation/ads', { action: 'delete', adId: id });
      }
      addToast('Item deleted successfully', 'success');
      fetchData();
    } catch (error) {
      addToast('Failed to delete item', 'error');
    }
  };

  return (
    <MainLayout pageTitle="STERCS Curation & Content Management">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">STERCS Content Curation</h1>
            <p className="text-slate-500 font-medium mt-1">Manage Products, Media, and Ads across Marketplace, Flamingo, OwnIt, and Dancia-4Tv.</p>
          </div>
          <div className="flex gap-4 relative z-10">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-xl font-bold transition-colors ${activeTab === 'products' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Products / Media
            </button>
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-6 py-2 rounded-xl font-bold transition-colors ${activeTab === 'ads' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Advertising
            </button>
          </div>
        </div>

        <div className="mb-8 flex justify-end">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-md"
          >
            {isCreating ? 'Cancel Creation' : `Create New ${activeTab === 'products' ? 'Product' : 'Ad'}`}
          </button>
        </div>

        {isCreating && (
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/60 shadow-sm mb-8 relative z-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Create New {activeTab === 'products' ? 'Product' : 'Ad'}</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Name / Title</label>
                  <input type="text" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Price / Budget</label>
                  <input type="number" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Target Platform</label>
                  <select value={newItem.platform} onChange={(e) => setNewItem({...newItem, platform: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                    <option value="marketplace">Marketplace</option>
                    <option value="flamingo">Flamingo</option>
                    <option value="ownit">OwnIt</option>
                    <option value="storefront">Storefront</option>
                    <option value="dancia-4tv">Dancia-4Tv</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                  <input type="text" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 h-24" required></textarea>
              </div>
              <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors">
                Save & Publish
              </button>
            </form>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/60 shadow-sm relative z-10">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Existing {activeTab === 'products' ? 'Products & Media' : 'Advertisements'}</h2>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-sm">
                    <th className="pb-3 font-bold">Name</th>
                    <th className="pb-3 font-bold">Platform</th>
                    <th className="pb-3 font-bold">Category</th>
                    <th className="pb-3 font-bold">Price</th>
                    <th className="pb-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === 'products' ? products : ads).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">No items found.</td>
                    </tr>
                  ) : (
                    (activeTab === 'products' ? products : ads).map((item: any, i: number) => (
                      <tr key={item.id || i} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 font-bold text-slate-900">{item.name || item.title}</td>
                        <td className="py-4 text-slate-600 capitalize">{item.platform || item.platform_type || 'Unknown'}</td>
                        <td className="py-4 text-slate-600">{item.category || 'General'}</td>
                        <td className="py-4 font-bold text-emerald-600">${item.price || '0.00'}</td>
                        <td className="py-4 text-right">
                          <button onClick={() => handleDelete(item.id)} className="text-rose-500 hover:text-rose-700 font-bold text-sm bg-rose-50 px-3 py-1 rounded-lg">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StercsCurationDashboard;
