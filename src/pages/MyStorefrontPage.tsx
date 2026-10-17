import React, { useEffect, useState, useCallback } from 'react';

import { useAppContext } from '../contexts/AppContext';
import apiService from '../services/apiService';
import SocialEmbedModal from '../components/commerce/SocialEmbedModal';

const MyStorefrontPage: React.FC = () => {
  const { showToast } = useAppContext();

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  // Storage and Social Embed state
  const [embedModalProduct, setEmbedModalProduct] = useState<any | null>(null);
  const [storageTier, setStorageTier] = useState<'individual' | 'business'>('individual');
  const [usedStorageMB] = useState<number>(184);
  const [renewalPlan, setRenewalPlan] = useState<'monthly' | 'quarterly' | 'biannual' | 'yearly'>('monthly');
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

  // New state for dynamic data
  const [storefrontData, setStorefrontData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  // Fetch dynamic data from API
  const fetchStorefrontData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [storefrontRes, productsRes, analyticsRes] = await Promise.all([
        apiService.get('/api/storefront').catch(() => ({ storefronts: [] })),
        apiService.get('/api/storefront/products').catch(() => ({ products: [] })),
        apiService.get('/api/storefront/stats').catch(() => ({ stats: {} }))
      ]);

      const stores = storefrontRes.storefronts || (Array.isArray(storefrontRes.data) ? storefrontRes.data : [storefrontRes]);
      const currentStore = stores[0] || {
        id: 'primary',
        name: 'My Storefront',
        coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        status: 'Active',
        description: 'Verified FingerMobile protocol merchant.',
        category: 'Fashion & Tech'
      };

      setStorefrontData(currentStore);
      setEditForm({ name: currentStore.name || '', description: currentStore.description || '' });
      setProducts(productsRes.products || productsRes.data || (Array.isArray(productsRes) ? productsRes : []));
      setAnalytics(analyticsRes.stats || analyticsRes.data || { totalRevenue: 0, totalOrders: 0, views: 0 });
    } catch {
      setError('Failed to load storefront data');
      showToast('Failed to load storefront data');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const handleSaveStorefront = async () => {
    if (!storefrontData?.id) return;
    try {
      await apiService.put(`/api/storefront/${storefrontData.id}`, editForm);
      setStorefrontData((prev: any) => ({ ...prev, ...editForm }));
      setIsEditing(false);
      showToast('Storefront updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update storefront', 'error');
    }
  };

  useEffect(() => {
    fetchStorefrontData();
  }, [fetchStorefrontData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Storefront</h1>
          <p className="text-gray-600">
            Manage your storefront and track your sales performance
          </p>
        </div>

        {/* Storefront Header */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden mb-8 h-64 flex items-center justify-center">
            <p className="text-slate-700">Loading storefront data...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden mb-8 h-64 flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden mb-8">
              <div className="relative">
                <img
                  src={storefrontData.coverImage}
                  alt="Storefront cover"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => {
                    if (isEditing) {
                      handleSaveStorefront();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 flex items-center shadow-sm"
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  {isEditing ? 'Save Changes' : 'Edit Storefront'}
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center">
                <img
                  src={storefrontData.avatar}
                  alt={storefrontData.name}
                  className="w-20 h-20 rounded-full border-4 border-white -mt-12"
                />
                <div className="ml-4 flex-1">
                  {isEditing ? (
                    <div className="space-y-3 mt-2">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="text-2xl font-bold text-slate-900 border border-blue-400 rounded px-2 py-1 w-full border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                        placeholder="Store Name"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="text-slate-900 border border-blue-400 rounded px-2 py-1 w-full text-sm font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                        placeholder="Store Description"
                        rows={2}
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {storefrontData.name}
                      </h2>
                      <p className="text-gray-600">{storefrontData.description}</p>
                    </>
                  )}
                  <div className="flex items-center mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-950 border border-blue-400 font-bold font-black">
                      {storefrontData.category || 'General'}
                    </span>
                    <span className="ml-2 text-sm text-slate-700">
                      {storefrontData.followers || '1,240'} followers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-slate-300 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('storage')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'storage'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Storage & Quota Plan
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Storage Tab */}
        {activeTab === 'storage' && (
          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-indigo-500/30 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full">
                    Storefront Storage Quota Matrix
                  </span>
                  <h2 className="text-2xl font-black mt-2">
                    {storageTier === 'individual' ? 'Individual Store Tier (600MB)' : 'Business Store Tier (1500MB)'}
                  </h2>
                  <p className="text-xs text-slate-700 mt-1 max-w-xl">
                    Allocated storage for product high-res images, lookbooks, 3D glTF media, and previews.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow transition shrink-0"
                >
                  {storageTier === 'individual' ? 'Upgrade to Business (1500MB)' : 'Manage Subscription'}
                </button>
              </div>

              {/* Storage Meter Visual Gauge */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-700 font-medium">
                    Used: <strong className="text-white">{usedStorageMB} MB</strong> of {storageTier === 'individual' ? 600 : 1500} MB
                  </span>
                  <span className="font-extrabold text-blue-300">
                    {((usedStorageMB / (storageTier === 'individual' ? 600 : 1500)) * 100).toFixed(1)}% Used
                  </span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      (usedStorageMB / (storageTier === 'individual' ? 600 : 1500)) > 0.9
                        ? 'bg-red-500'
                        : (usedStorageMB / (storageTier === 'individual' ? 600 : 1500)) > 0.7
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, (usedStorageMB / (storageTier === 'individual' ? 600 : 1500)) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-700 mt-2">
                  Remaining capacity: {(storageTier === 'individual' ? 600 : 1500) - usedStorageMB} MB available.
                </p>
              </div>
            </div>

            {/* Renewal Pricing Schedule */}
            <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Storefront Renewal Schedule</h3>
              <p className="text-xs text-slate-700 mb-6">Select your preferred subscription renewal cadence for uninterrupted hosting.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: 'monthly', title: 'Monthly', price: '$2', period: 'every month', badge: 'Standard' },
                  { id: 'quarterly', title: 'Quarterly', price: '$5', period: 'every 3 months', badge: 'Popular' },
                  { id: 'biannual', title: 'Bi-Annually', price: '$10', period: 'every 6 months', badge: 'Save 17%' },
                  { id: 'yearly', title: 'Yearly', price: '$18', period: 'every 12 months', badge: 'Best Value (Save 25%)' }
                ].map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => setRenewalPlan(plan.id as any)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                      renewalPlan === plan.id
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm text-gray-900">{plan.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400 font-bold font-black">
                          {plan.badge}
                        </span>
                      </div>
                      <p className="text-2xl font-black text-gray-900">{plan.price}</p>
                      <p className="text-xs text-slate-700">{plan.period}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenewalPlan(plan.id as any);
                        showToast(`Renewed ${plan.title} storefront subscription at ${plan.price}!`, 'success');
                      }}
                      className={`w-full mt-4 py-2 text-xs font-bold rounded-lg transition ${
                        renewalPlan === plan.id
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {renewalPlan === plan.id ? 'Active Plan' : 'Select Plan'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Protocol Commission Notice */}
            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-3">
              <span className="text-xl">ℹ️</span>
              <div>
                <strong className="block font-bold mb-0.5">3% Net Sales Automated Protocol Commission</strong>
                <p className="text-blue-800 leading-relaxed text-[11px]">
                  All orders processed through your Storefront are subject to an automated 3% network escrow fee upon customer settlement. The remaining 97% is directly credited to your sovereign creator payout balance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && analytics && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
                <p className="text-sm font-medium text-slate-700">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analytics.totalSales || 10}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
                <p className="text-sm font-medium text-slate-700">
                  Gross Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(analytics.totalRevenue || 500).toLocaleString()} FIC
                </p>
              </div>
              <div className="bg-amber-50/50 rounded-xl shadow-sm border border-amber-200 p-6">
                <p className="text-sm font-medium text-amber-700">Protocol Fee (3%)</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">
                  -{((analytics.totalRevenue || 500) * 0.03).toFixed(2)} FIC
                </p>
              </div>
              <div className="bg-emerald-50/50 rounded-xl shadow-sm border border-emerald-200 p-6">
                <p className="text-sm font-medium text-emerald-700">
                  Net Creator Payout (97%)
                </p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {((analytics.totalRevenue || 500) * 0.97).toFixed(2)} FIC
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Top Products
                </h3>
                <div className="space-y-4">
                  {products.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-slate-700">
                          {product.sales} sales
                        </p>
                      </div>
                      <div className="inline-flex items-center text-sm font-medium text-gray-900">
                        {product.revenue?.toLocaleString()} FIC
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Recent Orders
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Taylor Swift
                      </p>
                      <p className="text-sm text-slate-700">
                        Summer Vibes Beat Pack
                      </p>
                    </div>
                    <div className="text-sm text-slate-700">2 hours ago</div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        DJ Pulse
                      </p>
                      <p className="text-sm text-slate-700">
                        Hip Hop Starter Kit
                      </p>
                    </div>
                    <div className="text-sm text-slate-700">5 hours ago</div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Music Producer Pro
                      </p>
                      <p className="text-sm text-slate-700">
                        Music Production Course
                      </p>
                    </div>
                    <div className="text-sm text-slate-700">1 day ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">My Products</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center" aria-label="Button"><svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
                Add Product
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                    >
                      Sales
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                    >
                      Revenue
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-slate-700">
                          {product.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.status === 'published'
                              ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                              : 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
                          }`}
                        >
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.price?.toFixed(2)} FIC
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                        {product.sales}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.revenue?.toLocaleString()} FIC
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.status === 'published'
                              ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                              : 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => setEmbedModalProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3 font-semibold"
                        >
                          Embed
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Store Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Sales Overview
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-slate-700">Sales chart visualization</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Traffic Sources
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-slate-700">Traffic sources chart</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Customer Demographics
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-slate-700">Demographics chart</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="border border-slate-300 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-700">
                    Conversion Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {analytics.conversionRate}%
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    ↑ 12% from last month
                  </p>
                </div>
                <div className="border border-slate-300 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-700">
                    Avg. Order Value
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    45.87 FIC
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    ↑ 5% from last month
                  </p>
                </div>
                <div className="border border-slate-300 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-700">
                    Customer Retention
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">68%</p>
                  <p className="text-sm text-red-600 mt-1">
                    ↓ 3% from last month
                  </p>
                </div>
                <div className="border border-slate-300 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-700">
                    Page Views
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {analytics.totalViews?.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    ↑ 18% from last month
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Order History</h2>

            <div className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                    >
                      Order
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                    >
                      Items
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #ORD-001
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Taylor Swift
                      </div>
                      <div className="text-sm text-slate-700">
                        taylor@example.com
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Summer Vibes Beat Pack
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      49.99 FIC
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      Jun 15, 2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-950 border border-green-400 font-bold">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #ORD-002
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        DJ Pulse
                      </div>
                      <div className="text-sm text-slate-700">
                        dj@example.com
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Hip Hop Starter Kit
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      29.99 FIC
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      Jun 14, 2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-950 border border-green-400 font-bold">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #ORD-003
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Music Producer Pro
                      </div>
                      <div className="text-sm text-slate-700">
                        producer@example.com
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Music Production Course
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      99.99 FIC
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      Jun 12, 2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-950 border border-amber-400 font-bold font-black">
                        Processing
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && storefrontData && (
          <div>
            <h2 className="text-xl font-bold mb-6">Storefront Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-300 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Store Information
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      defaultValue={storefrontData.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      defaultValue={storefrontData.description}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      defaultValue={storefrontData.category}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
                    >
                      <option>Music</option>
                      <option>Art</option>
                      <option>Photography</option>
                      <option>Business</option>
                      <option>Design</option>
                      <option>Writing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Social Links
                    </label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-800">
                          Website
                        </label>
                        <input
                          type="text"
                          defaultValue={storefrontData.socialLinks?.website}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-800">
                          Twitter
                        </label>
                        <input
                          type="text"
                          defaultValue={storefrontData.socialLinks?.twitter}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-800">
                          Instagram
                        </label>
                        <input
                          type="text"
                          defaultValue={storefrontData.socialLinks?.instagram}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Store Appearance
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Image
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-slate-500"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                            <span>Upload a file</span>
                            <input type="file" className="sr-only text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-700">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Image
                    </label>
                    <div className="mt-1 flex items-center">
                      <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        <svg
                          className="h-full w-full text-slate-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                      <button
                        type="button"
                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Storage Tier Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
              <h3 className="text-lg font-black text-gray-900 mb-1">Upgrade Storefront Quota</h3>
              <p className="text-xs text-slate-700 mb-4">Expand your digital asset hosting on FingerMobile Protocol</p>

              <div className="space-y-3 mb-6">
                <div
                  onClick={() => setStorageTier('individual')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    storageTier === 'individual' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-900">Individual Store Tier</span>
                    <span className="text-xs font-black text-blue-600">$5 Setup</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">600MB storage quota • Standard bandwidth</p>
                </div>

                <div
                  onClick={() => setStorageTier('business')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    storageTier === 'business' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-gray-900">Business Store Tier</span>
                    <span className="text-xs font-black text-blue-600">$20 Setup</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">1500MB storage quota • Priority media CDN • Custom domain</p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if (storefrontData?.id) {
                        await apiService.put(`/api/storefront/${storefrontData.id}`, {
                          subscription_tier: storageTier === 'business' ? 'pro' : 'basic'
                        });
                      }
                      await apiService.post('/api/subscriptions', {
                        tier: storageTier === 'business' ? 'pro' : 'basic',
                        duration_months: renewalPlan === 'yearly' ? 12 : renewalPlan === 'biannual' ? 6 : renewalPlan === 'quarterly' ? 3 : 1
                      }).catch(() => {});
                      showToast(`Storefront tier upgraded to ${storageTier === 'business' ? 'Business (1500MB)' : 'Individual (600MB)'}!`, 'success');
                    } catch (err: any) {
                      showToast(err.message || 'Failed to upgrade tier', 'error');
                    } finally {
                      setShowUpgradeModal(false);
                    }
                  }}
                  className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow transition"
                >
                  Confirm Upgrade
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Social Embed Modal */}
        <SocialEmbedModal
          isOpen={Boolean(embedModalProduct)}
          onClose={() => setEmbedModalProduct(null)}
          product={
            embedModalProduct
              ? {
                id: String(embedModalProduct.id),
                name: embedModalProduct.name,
                price: embedModalProduct.price,
                currency: 'USD',
                imageUrl: embedModalProduct.imageUrl || (embedModalProduct.images ? embedModalProduct.images[0] : undefined),
                platform: 'storefront',
                description: embedModalProduct.description
              }
              : null
          }
        />
      </div>
    </div>
  );
};

export default MyStorefrontPage;
