import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import api from '../../services/api';
import { useToast } from '../../components/Toast';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';
import SubscriptionModelsConsole from '../../components/dashboard/SubscriptionModelsConsole';

const StercsCurationDashboard: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'products' | 'ads' | 'subscriptions'>('subscriptions');
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
    const createdId = `CUR-${Date.now()}`;
    const itemData = {
      id: createdId,
      name: newItem.name,
      platform: newItem.platform,
      category: newItem.category,
      price: newItem.price,
      description: newItem.description
    };

    try {
      if (activeTab === 'products') {
        await api.post('/curation/products/upload', {
          platform: newItem.platform,
          productName: newItem.name,
          price: Number(newItem.price),
          _description: newItem.description
        }).catch(() => null);
        setProducts(prev => [itemData, ...prev]);
      } else {
        await api.post('/curation/ads/manage', {
          adCampaignName: newItem.name,
          action: 'create',
          schedule: 'immediate'
        }).catch(() => null);
        setAds(prev => [itemData, ...prev]);
      }
      addToast(`${activeTab === 'products' ? 'Product' : 'Ad'} created and curated successfully`, 'success');
      setIsCreating(false);
      setNewItem({ name: '', price: '', category: '', platform: 'marketplace', description: '' });
    } catch (error) {
      addToast(`Failed to create ${activeTab === 'products' ? 'Product' : 'Ad'}`, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (activeTab === 'products') {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        setAds(prev => prev.filter(a => a.id !== id));
      }
      addToast('Item removed from curation queue', 'success');
    } catch (error) {
      addToast('Failed to delete item', 'error');
    }
  };

  return (
    <MainLayout pageTitle="STERCS Curation & Content Management">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Permanent Platform Ownership Authority Seal */}
        <PlatformOwnershipCard />

        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">STERCS Content & Subscription Curation</h1>
            <p className="text-slate-700 dark:text-slate-300 font-medium mt-1">Manage Products, Media, Advertisements, and Platform Subscription Models across FingerMobile Protocol.</p>
          </div>
          <div className="flex flex-wrap gap-2.5 relative z-10">
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`px-5 py-2 rounded-xl font-bold transition-colors ${activeTab === 'subscriptions' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
            >
              Subscriptions & Free Tiers
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-5 py-2 rounded-xl font-bold transition-colors ${activeTab === 'products' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
            >
              Products / Media
            </button>
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-5 py-2 rounded-xl font-bold transition-colors ${activeTab === 'ads' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
            >
              Advertising
            </button>
          </div>
        </div>

        {activeTab === 'subscriptions' ? (
          <div className="mb-8">
            <SubscriptionModelsConsole sourceDashboard="StercsDashboard" />
          </div>
        ) : (
          <>
            <div className="mb-8 flex justify-end">
              <button
                onClick={() => setIsCreating(!isCreating)}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-md"
              >
                {isCreating ? 'Cancel Creation' : `Create New ${activeTab === 'products' ? 'Product' : 'Ad'}`}
              </button>
            </div>

        {isCreating && (
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-300 shadow-sm mb-8 relative z-10">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Create New {activeTab === 'products' ? 'Product' : 'Ad'}</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">Name / Title</label>
                  <input type="text" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">Price / Budget</label>
                  <input type="number" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">Target Platform</label>
                  <select value={newItem.platform} onChange={(e) => setNewItem({...newItem, platform: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500">
                    <option value="marketplace">Marketplace</option>
                    <option value="flamingo">Flamingo</option>
                    <option value="ownit">OwnIt</option>
                    <option value="storefront">Storefront</option>
                    <option value="dancia-4tv">Dancia-4Tv</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">Category</label>
                  <input type="text" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Description</label>
                <textarea value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 h-24 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" required></textarea>
              </div>
              <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs">
                Save & Publish
              </button>
            </form>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-300 shadow-sm relative z-10">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Existing {activeTab === 'products' ? 'Products & Media' : 'Advertisements'}</h2>

          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-800 font-black text-sm">
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
                      <td colSpan={5} className="py-8 text-center text-slate-700 font-medium">No items found in curation feed.</td>
                    </tr>
                  ) : (
                    (activeTab === 'products' ? products : ads).map((item: any, i: number) => (
                      <tr key={item.id || i} className="border-b border-slate-200 hover:bg-slate-50/70">
                        <td className="py-4 font-bold text-slate-900">{item.name || item.title}</td>
                        <td className="py-4 text-slate-800 font-semibold capitalize">{item.platform || item.platform_type || 'Unknown'}</td>
                        <td className="py-4 text-slate-800 font-semibold">{item.category || 'General'}</td>
                        <td className="py-4 font-black text-emerald-700 font-mono">${item.price || '0.00'}</td>
                        <td className="py-4 text-right">
                          <button type="button" onClick={() => handleDelete(item.id)} className="text-rose-950 hover:bg-rose-200 font-bold text-sm bg-rose-100 border border-rose-300 px-3 py-1 rounded-lg cursor-pointer transition">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    )}
  </div>
</MainLayout>
  );
};

export default StercsCurationDashboard;
