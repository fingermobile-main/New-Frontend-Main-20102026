import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { advertisingService, AdCampaignItem } from '../../services/advertisingService';
import LoadingSpinner from '../../components/LoadingSpinner';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

const DashboardCampaignsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [campaigns, setCampaigns] = useState<AdCampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for creating a new campaign
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [couponValue, setCouponValue] = useState('50');

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

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please provide a campaign title', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const reward = Number(couponValue) || 50;
      await advertisingService.createCampaign({
        title,
        description,
        campaign_type: 'coupon',
        coupon_value: reward,
        total_budget: reward * 10,
        currency: 'FIC'
      });
      showToast(`Campaign "${title}" created and activated successfully!`, 'success');
      setTitle('');
      setDescription('');
      setCouponValue('50');
      await fetchCampaigns();
    } catch (err: any) {
      showToast(err?.message || 'Failed to create campaign', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 overflow-x-hidden text-slate-900 pb-28 md:pb-12">
      <PlatformOwnershipCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-300 sticky top-24">
            <h2 className="text-xl font-black text-slate-900 mb-1">Create New Campaign</h2>
            <p className="text-xs text-slate-700 font-medium mb-4">Launch an incentive or rewards campaign for the FingerMobile network.</p>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. VIP Member Rewards"
                  className="w-full mt-1.5 px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-bold placeholder:text-slate-400"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Description / Terms
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Brief explanation of campaign incentives and rules..."
                  className="w-full mt-1.5 px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-bold placeholder:text-slate-400"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Coupon / Reward Value (FIC)
                </label>
                <input
                  type="number"
                  min="1"
                  value={couponValue}
                  onChange={(e) => setCouponValue(e.target.value)}
                  className="w-full mt-1.5 px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-bold placeholder:text-slate-400 font-mono"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 text-sm cursor-pointer"
              >
                {isSubmitting ? 'Creating Campaign...' : 'Launch Campaign'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Campaign List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Campaign Management</h1>
              <p className="text-xs text-slate-700 font-medium mt-0.5">Active and historical promotional campaigns</p>
            </div>
            <button
              onClick={() => fetchCampaigns()}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Refresh List
            </button>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <LoadingSpinner />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-300 text-center shadow-sm">
              <p className="font-black text-base text-slate-900">No campaigns launched yet</p>
              <p className="text-xs mt-1 text-slate-700 font-medium">Use the form on the left to launch your first promotional reward campaign.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="bg-white p-5 rounded-2xl border border-slate-300 hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-black text-slate-900 text-base">{campaign.title || campaign.name}</p>
                      <p className="text-xs text-slate-700 mt-0.5 font-mono font-bold">
                        ID: {campaign.id} • Type: {campaign.campaign_type || campaign.type || 'Standard'}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-full border ${
                        campaign.status === 'active'
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                          : campaign.status === 'paused'
                            ? 'bg-amber-100 text-amber-950 border-amber-400'
                            : 'bg-slate-100 text-slate-900 border-slate-300'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 font-medium mt-2.5 line-clamp-2">
                    {campaign.description || 'No description provided.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-4 text-slate-700 font-medium">
                      <p>
                        <strong className="text-slate-900 font-bold">Budget:</strong> {campaign.budget ? `${campaign.budget} FIC` : `${campaign.total_budget || 0} FIC`}
                      </p>
                      <p>
                        <strong className="text-slate-900 font-bold">Spent:</strong> {campaign.spent ? `${campaign.spent} FIC` : '0 FIC'}
                      </p>
                    </div>
                    <NavLink
                      to={`/dashboard/campaigns/${campaign.id}`}
                      className="text-blue-600 hover:text-blue-800 font-black hover:underline inline-flex items-center gap-1"
                    >
                      View Analytics &rarr;
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE NAVIGATION QUICK DOCK */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around z-30 shadow-lg">
        <button
          type="button"
          onClick={() => {
            const el = document.querySelector('input[type="text"]');
            if (el) (el as HTMLElement).focus();
          }}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 transition-colors"
        >
          <span className="text-base font-extrabold leading-none mb-0.5">+</span>
          <span>Create</span>
        </button>
        <button
          type="button"
          onClick={() => fetchCampaigns()}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <span className="text-base font-extrabold leading-none mb-0.5">⚡</span>
          <span>Refresh</span>
        </button>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <span className="text-base font-black leading-none mb-0.5">↑</span>
          <span>Top</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardCampaignsPage;
