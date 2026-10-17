import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { advertisingService, AdCampaignItem } from '../../services/advertisingService';
import PartnerHouseWidget from '../../components/dashboard/PartnerHouseWidget';
import LoadingSpinner from '../../components/LoadingSpinner';
import { MegaphoneIcon, PlusIcon, SparklesIcon } from '../../icons';

const DashboardAdvertisingPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [campaigns, setCampaigns] = useState<AdCampaignItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleToggleStatus = async (camp: AdCampaignItem) => {
    const nextStatus = camp.status === 'active' ? 'paused' : 'active';
    try {
      await advertisingService.updateCampaignStatus(camp.id, nextStatus);
      setCampaigns((prev) =>
        prev.map((c) => (c.id === camp.id ? { ...c, status: nextStatus } : c))
      );
      showToast(`Campaign ${nextStatus === 'active' ? 'activated' : 'paused'} successfully!`, 'success');
    } catch (err: any) {
      showToast('Failed to update campaign status', 'error');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Advertising Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage active campaigns, monitor budgets, and configure ad networks</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/canary-ad-maker')}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-105 text-slate-950 font-bold rounded-xl shadow-sm text-sm flex items-center gap-2"
          >
            <SparklesIcon className="w-4 h-4" /> Canary Studio
          </button>
          <button
            onClick={() => navigate('/campaigns')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm text-sm flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" /> Launch Campaign
          </button>
        </div>
      </div>

      <div className="mb-8">
        <PartnerHouseWidget />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MegaphoneIcon className="w-5 h-5 text-indigo-600" /> All Platform Campaigns
          </h2>
          <button
            onClick={() => fetchCampaigns()}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Refresh List
          </button>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <p className="font-semibold text-base">No advertising campaigns running</p>
            <p className="text-sm mt-1">Create a campaign to start delivering ads across FingerMobile channels.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider">Campaign</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider">Format</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider">Targeting</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider">Budget</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider">Status</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider">End Date</th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((campaign) => {
                  const targeting = campaign.targeting || {};
                  return (
                    <tr
                      key={campaign.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4">
                        <p className="text-sm font-bold text-slate-900">{campaign.title || campaign.name}</p>
                        <p className="text-xs font-mono text-slate-700">{campaign.id}</p>
                      </td>
                      <td className="p-4 text-xs font-medium text-slate-600 uppercase">
                        {campaign.campaign_type || campaign.type || 'Display'}
                      </td>
                      <td className="p-4 text-xs text-slate-600">
                        <p><strong>Geo:</strong> {targeting.geo || 'Global'}</p>
                        <p><strong>Age:</strong> {targeting.age || 'All Ages'}</p>
                        {Array.isArray(targeting.interests) && targeting.interests.length > 0 && (
                          <p><strong>Interests:</strong> {targeting.interests.join(', ')}</p>
                        )}
                      </td>
                      <td className="p-4 text-sm font-semibold text-slate-800">
                        {campaign.budget ? `${campaign.budget} FIC` : `${campaign.total_budget || 0} FIC`}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            campaign.status === 'active'
                              ? 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold'
                              : campaign.status === 'paused'
                                ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
                                : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-500">
                        {campaign.endDate
                          ? new Date(campaign.endDate).toLocaleDateString()
                          : campaign.expiryDate
                            ? new Date(campaign.expiryDate).toLocaleDateString()
                            : 'Ongoing'}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => navigate(`/campaigns/${campaign.id}`)}
                          className="px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleToggleStatus(campaign)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                            campaign.status === 'active'
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {campaign.status === 'active' ? 'Pause' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardAdvertisingPage;
