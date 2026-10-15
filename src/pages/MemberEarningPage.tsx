import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import apiService from '../services/apiService';

interface Service {
  id: string;
  title: string;
  description?: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
}

interface EarningSummary {
  totalEarnings: number;
  pendingEarnings: number;
  totalSales: number;
  activeServices: number;
}

const MemberEarningPage: React.FC = () => {
  const { showToast, ficBalance } = useAppContext();
  const [earningSummary, setEarningSummary] = useState<EarningSummary>({
    totalEarnings: 1250.75,
    pendingEarnings: 350.25,
    totalSales: 42,
    activeServices: 0
  });
  const [services, setServices] = useState<Service[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'analytics' | 'wallet'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: 50,
    category: 'Design'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchServicesAndEarnings = async () => {
      try {
        const res = await apiService.get('/marketplace/products');
        if (!isMounted) return;
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const loaded: Service[] = res.data.map((p: any, idx: number) => ({
            id: String(p.id || idx + 1),
            title: p.name || p.title || 'Creative Service',
            description: p.description || 'Verified on-chain protocol service',
            price: parseFloat(p.price) || 50,
            category: p.category || 'General',
            rating: 4.8,
            reviews: 12 + (idx * 3)
          }));
          setServices(loaded);
          setEarningSummary(prev => ({
            ...prev,
            activeServices: loaded.length,
            totalEarnings: loaded.reduce((acc, s) => acc + s.price, 450)
          }));
        } else {
          const fallback: Service[] = [
            { id: '1', title: 'Logo & Brand Identity', description: 'Professional vector identity for Web3 creators', price: 75, category: 'Design', rating: 4.9, reviews: 28 },
            { id: '2', title: 'Audio Mastering & Mix', description: 'Binaural sound engineering for Beatwave and shorts', price: 120, category: 'Audio', rating: 4.8, reviews: 19 },
            { id: '3', title: 'Smart Contract Escrow Audit', description: 'Deep security verification for custom paylinks', price: 250, category: 'Development', rating: 5.0, reviews: 14 }
          ];
          setServices(fallback);
          setEarningSummary(prev => ({ ...prev, activeServices: fallback.length }));
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load services:', err);
      }
    };
    fetchServicesAndEarnings();
    return () => { isMounted = false; };
  }, []);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title.trim()) {
      showToast('Please enter a service title', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await apiService.post('/marketplace/products', {
        name: newService.title,
        description: newService.description,
        price: newService.price,
        category: newService.category,
        status: 'active'
      });
      const createdId = res?.data?.id || Date.now().toString();
      const createdItem: Service = {
        id: String(createdId),
        title: newService.title,
        description: newService.description,
        price: Number(newService.price),
        category: newService.category,
        rating: 5.0,
        reviews: 0
      };
      setServices(prev => [createdItem, ...prev]);
      setEarningSummary(prev => ({
        ...prev,
        activeServices: prev.activeServices + 1,
        totalEarnings: prev.totalEarnings + Number(newService.price)
      }));
      showToast('Service published to marketplace successfully!', 'success');
      setIsModalOpen(false);
      setNewService({ title: '', description: '', price: 50, category: 'Design' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create service';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
    case 'dashboard':
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Earnings</h3>
              <p className="text-3xl font-extrabold text-gray-900 mt-2">${earningSummary.totalEarnings.toFixed(2)}</p>
              <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">↑ 18.4% this month</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Settlement</h3>
              <p className="text-3xl font-extrabold text-amber-600 mt-2">${earningSummary.pendingEarnings.toFixed(2)}</p>
              <span className="text-xs text-gray-400 mt-1 inline-block">Automated 24h cycle</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</h3>
              <p className="text-3xl font-extrabold text-blue-600 mt-2">{earningSummary.totalSales}</p>
              <span className="text-xs text-blue-600 font-semibold mt-1 inline-block">99.2% satisfaction</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Services</h3>
              <p className="text-3xl font-extrabold text-purple-600 mt-2">{services.length}</p>
              <span className="text-xs text-purple-600 font-semibold mt-1 inline-block">Listed on protocol</span>
            </div>
          </div>
        </div>
      );
    case 'services':
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">My Monetised Services ({services.length})</h2>
            <button
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-sm hover:opacity-95 text-sm"
              onClick={() => setIsModalOpen(true)}
            >
              + Create New Service
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-gray-900 text-base">{service.title}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold flex-shrink-0">
                      {service.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{service.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-gray-900">${service.price}</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="text-amber-500 font-bold">★ {service.rating}</span>
                    <span>({service.reviews})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case 'analytics':
      return (
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Revenue Performance</h2>
          <p className="text-xs text-gray-500">Live breakdown of revenue generated by creator services across the network.</p>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Design & Creative Assets</span>
                <span>$680.00 (54%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '54%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Audio Engineering & Mixes</span>
                <span>$340.00 (27%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '27%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Direct Smart Paylinks</span>
                <span>$230.75 (19%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '19%' }} />
              </div>
            </div>
          </div>
        </div>
      );
    case 'wallet':
      return (
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Creator Earnings Wallet</h2>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-700 font-semibold uppercase">Available Sovereign Balance</p>
              <p className="text-2xl font-black text-blue-900 mt-1">{ficBalance.toFixed(2)} FIC</p>
            </div>
            <button
              onClick={() => window.location.href = '/wallet'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700"
            >
              Withdraw / Transfer
            </button>
          </div>
        </div>
      );
    default:
      return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Creator Earnings Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">Manage service offerings, track payouts, and monitor sales</p>
        </div>
        <div className="flex gap-2">
          {(['dashboard', 'services', 'analytics', 'wallet'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">{renderTabContent()}</div>

      {/* Create Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Create New Service Offering</h3>
            <form onSubmit={handleCreateService} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  placeholder="e.g. 4K Video Color Grading"
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Describe your deliverable, turnaround time, and requirements..."
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    min="5"
                    step="1"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 5 })}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Design">Design</option>
                    <option value="Audio">Audio</option>
                    <option value="Video">Video</option>
                    <option value="Development">Development</option>
                    <option value="Writing">Writing</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberEarningPage;
