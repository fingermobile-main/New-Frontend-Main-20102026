import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import {
  MegaphoneIcon,
  PlusIcon,
  ChartBarIcon,
  PlayIcon,
  PauseIcon,
  CogIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon
} from '../icons';
import { advertisingService, AdCampaignItem } from '../services/advertisingService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppContext } from '../contexts/AppContext';

const CampaignsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');
  const [campaigns, setCampaigns] = useState<AdCampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // New campaign modal fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [campaignType, setCampaignType] = useState('display');
  const [dailyBudget, setDailyBudget] = useState(50);
  const [totalBudget, setTotalBudget] = useState(500);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const list = await advertisingService.getCampaigns(true);
      setCampaigns(list);
    } catch (err: any) {
      showToast('Failed to load campaigns', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleToggleStatus = async (e: React.MouseEvent, camp: AdCampaignItem) => {
    e.stopPropagation();
    const nextStatus = camp.status === 'active' ? 'paused' : 'active';
    try {
      await advertisingService.updateCampaignStatus(camp.id, nextStatus);
      setCampaigns((prev) =>
        prev.map((c) => (c.id === camp.id ? { ...c, status: nextStatus } : c))
      );
      showToast(`Campaign ${nextStatus === 'active' ? 'activated' : 'paused'}`, 'success');
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Campaign title is required', 'error');
      return;
    }
    setCreating(true);
    try {
      const created = await advertisingService.createCampaign({
        title,
        description,
        campaign_type: campaignType,
        daily_budget: Number(dailyBudget),
        total_budget: Number(totalBudget),
        budget: Number(totalBudget),
        currency: 'FIC'
      });
      showToast('Campaign created successfully!', 'success');
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      await fetchCampaigns();
      if (created?.id) {
        navigate(`/campaigns/${created.id}`);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to create campaign', 'error');
    } finally {
      setCreating(false);
    }
  };

  const filteredCampaigns = campaigns.filter((camp) => {
    const matchesSearch =
      (camp.title || camp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (camp.campaign_type || camp.type || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ? true : camp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout pageTitle="Ad Campaigns">
      <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center border border-indigo-200 shadow-inner">
              <MegaphoneIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ad Campaigns</h1>
              <p className="text-slate-500 font-medium mt-1">Manage and track your advertising campaigns</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2 relative z-10"
          >
            <PlusIcon className="w-5 h-5" />
            Create Campaign
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <div className="relative w-full md:w-96">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium transition-all"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
                <AdjustmentsHorizontalIcon className="w-4 h-4" /> Filter:
              </span>
              {(['all', 'active', 'paused'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    statusFilter === filter
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <LoadingSpinner />
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <p className="font-semibold text-base">No campaigns found</p>
              <p className="text-sm mt-1">Try adjusting your search or create a new campaign above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-sm font-bold text-slate-500 uppercase tracking-wider">
                    <th className="pb-4 pl-4">Campaign</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Spent</th>
                    <th className="pb-4">Budget</th>
                    <th className="pb-4 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCampaigns.map((camp) => (
                    <tr
                      key={camp.id}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/campaigns/${camp.id}`)}
                    >
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ChartBarIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {camp.title || camp.name}
                            </p>
                            <p className="text-sm font-medium text-slate-500 capitalize">
                              {camp.campaign_type || camp.type || 'Standard Ad'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <button
                          onClick={(e) => handleToggleStatus(e, camp)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:opacity-80 ${
                            camp.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {camp.status === 'active' ? (
                            <PlayIcon className="w-3 h-3" />
                          ) : (
                            <PauseIcon className="w-3 h-3" />
                          )}
                          {camp.status}
                        </button>
                      </td>
                      <td className="py-4 font-bold text-slate-700">
                        {camp.spent ? `${camp.spent} FIC` : '0 FIC'}
                      </td>
                      <td className="py-4 font-bold text-slate-400">
                        {camp.budget ? `${camp.budget} FIC` : `${camp.total_budget || 0} FIC`}
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <button
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/campaigns/${camp.id}`);
                          }}
                          title="Campaign Settings & Analytics"
                        >
                          <CogIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Campaign Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Create New Campaign</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q4 Growth Push"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Campaign Type
                  </label>
                  <select
                    value={campaignType}
                    onChange={(e) => setCampaignType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="display">Display Ad</option>
                    <option value="video">Video Ad</option>
                    <option value="search">Search Ad</option>
                    <option value="marketplace">Marketplace Ad</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Daily Budget (FIC)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={dailyBudget}
                      onChange={(e) => setDailyBudget(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Total Budget (FIC)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Description / Goals
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of targeting goals..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-200 disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Create Campaign'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default CampaignsPage;
