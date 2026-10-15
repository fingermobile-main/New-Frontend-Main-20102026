import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { advertisingService, AdCampaignItem } from '../../services/advertisingService';
import LoadingSpinner from '../../components/LoadingSpinner';

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 sm:p-6 lg:p-8">
      {/* Left Column: Create Form */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Create New Campaign</h2>
          <p className="text-xs text-slate-500 mb-4">Launch an incentive or rewards campaign for the FingerMobile network.</p>

          <form onSubmit={handleCreateCampaign} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Campaign Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. VIP Member Rewards"
                className="w-full mt-1.5 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Description / Terms
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief explanation of campaign incentives and rules..."
                className="w-full mt-1.5 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Coupon / Reward Value (FIC)
              </label>
              <input
                type="number"
                min="1"
                value={couponValue}
                onChange={(e) => setCouponValue(e.target.value)}
                className="w-full mt-1.5 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all disabled:opacity-50 text-sm"
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
            <h1 className="text-2xl font-bold text-slate-900">Campaign Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">Active and historical promotional campaigns</p>
          </div>
          <button
            onClick={() => fetchCampaigns()}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
            <p className="font-semibold text-base">No campaigns found</p>
            <p className="text-sm mt-1">Use the form on the left to launch your first promotional campaign.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-bold text-slate-900 text-base">{campaign.title || campaign.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                      ID: {campaign.id} • Type: {campaign.campaign_type || campaign.type || 'Standard'}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                      campaign.status === 'active'
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold'
                        : campaign.status === 'paused'
                          ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
                          : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mt-2.5 line-clamp-2">
                  {campaign.description || 'No description provided.'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-4 text-slate-600">
                    <p>
                      <strong>Budget:</strong> {campaign.budget ? `${campaign.budget} FIC` : `${campaign.total_budget || 0} FIC`}
                    </p>
                    <p>
                      <strong>Spent:</strong> {campaign.spent ? `${campaign.spent} FIC` : '0 FIC'}
                    </p>
                  </div>
                  <NavLink
                    to={`/dashboard/campaigns/${campaign.id}`}
                    className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                  >
                    View Analytics →
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCampaignsPage;
