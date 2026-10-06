import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { CreditCardIcon, HeartIcon, ArrowUpIcon, ArrowDownIcon } from '../icons';
import { api } from '../services/api';

interface LendsqrItem {
  id: string;
  name: string;
  title: string;
  description: string;
  interestRate: number;
  maxAmount: number;
  loanTermDays: number;
  current: number;
  goal: number;
  imageUrl: string;
  likesCount: number;
  hasLiked?: boolean;
  score?: number;
  creator?: {
    name: string;
    avatarUrl?: string;
  };
}

const LendsqrPage: React.FC = () => {
  const { ficBalance = 0, showToast, user, member } = useAppContext();
  const [projects, setProjects] = useState<LendsqrItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Application Modal
  const [selectedProduct, setSelectedProduct] = useState<LendsqrItem | null>(null);
  const [applyAmount, setApplyAmount] = useState<string>('1000');
  const [applyPurpose, setApplyPurpose] = useState<string>('Protocol Node Infrastructure');
  const [applyDuration, setApplyDuration] = useState<number>(6);
  const [isApplying, setIsApplying] = useState<boolean>(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get<any>('/lendsqr/products');
      const items = res.data?.data || res.data?.products || (Array.isArray(res.data) ? res.data : []);
      const mapped = items.map((p: any) => ({
        ...p,
        id: String(p.id),
        title: p.title || p.name,
        creator: {
          name: 'FingerMobile Financial Cooperative',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        },
        hasLiked: false,
        score: 0
      }));
      setProjects(mapped);
    } catch (err: any) {
      showToast('Failed to load credit products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onLike = (id: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const nextLiked = !p.hasLiked;
        showToast(nextLiked ? 'Added to favorites' : 'Removed from favorites', 'success');
        return {
          ...p,
          hasLiked: nextLiked,
          likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1
        };
      }
      return p;
    }));
  };

  const onVote = (id: string, type: 'up' | 'down') => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const delta = type === 'up' ? 1 : -1;
        showToast(`Vote recorded: ${type.toUpperCase()}`, 'success');
        return {
          ...p,
          score: (p.score || 0) + delta
        };
      }
      return p;
    }));
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setIsApplying(true);
    try {
      const res = await api.post('/lendsq/applications', {
        userId: user?.id || member?.id || 1,
        amount: parseFloat(applyAmount),
        purpose: applyPurpose,
        durationMonths: applyDuration
      });

      if (res.data?.success) {
        showToast(`Application for ${selectedProduct.title} submitted successfully!`, 'success');
        setSelectedProduct(null);
      } else {
        showToast(res.data?.message || 'Failed to submit loan application', 'error');
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to submit application', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <CreditCardIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Lendsqr Credit & Crowdfunding
              </h1>
              <p className="text-gray-600">
                Transparent micro-financing, institutional credit lines, and community crowdfunding
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 mb-8 gap-4">
          <span className="text-lg font-semibold text-gray-900">
            Available FIC Balance: <span className="text-indigo-600 font-bold">{ficBalance.toLocaleString()} FIC</span>
          </span>
          <button
            onClick={() => {
              if (projects.length > 0) setSelectedProduct(projects[0]);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-sm transition"
          >
            Apply for Credit
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500 text-sm">
            Loading live credit products from database...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 text-gray-500">
            No active credit products available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const progress = Math.min(100, (project.current / project.goal) * 100);
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col border border-gray-200"
                >
                  <div className="relative">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => onLike(project.id)}
                        className={`p-2.5 bg-white rounded-full shadow hover:bg-gray-50 transition ${project.hasLiked ? 'text-red-600' : 'text-gray-400'}`}
                      >
                        <HeartIcon className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-900 truncate">
                        {project.title}
                      </h3>
                      <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md whitespace-nowrap">
                        {project.interestRate}% APR
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-2">
                      {project.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                        <span>Funded: {project.current.toLocaleString()} FIC</span>
                        <span>Capacity: {project.goal.toLocaleString()} FIC</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {project.likesCount} platform endorsements • {project.loanTermDays} days term
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedProduct(project)}
                        className="flex-1 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Apply Now
                      </button>
                      <button
                        onClick={() => onVote(project.id, 'up')}
                        className="p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                        title="Upvote product"
                      >
                        <ArrowUpIcon className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="text-xs font-semibold text-gray-600 min-w-[16px] text-center">
                        {project.score || 0}
                      </span>
                      <button
                        onClick={() => onVote(project.id, 'down')}
                        className="p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                        title="Downvote product"
                      >
                        <ArrowDownIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Application Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">
                  Apply for {selectedProduct.title}
                </h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Requested Amount (Max: {selectedProduct.maxAmount} FIC)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max={selectedProduct.maxAmount}
                    required
                    value={applyAmount}
                    onChange={(e) => setApplyAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Tenure Duration (Months)
                  </label>
                  <select
                    value={applyDuration}
                    onChange={(e) => setApplyDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months</option>
                    <option value={24}>24 Months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Purpose of Capital
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={applyPurpose}
                    onChange={(e) => setApplyPurpose(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Interest Rate:</span>
                    <span className="font-semibold text-gray-900">{selectedProduct.interestRate}% APR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Term Days:</span>
                    <span className="font-semibold text-gray-900">{selectedProduct.loanTermDays} days</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50"
                  >
                    {isApplying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  );
};

export default LendsqrPage;
