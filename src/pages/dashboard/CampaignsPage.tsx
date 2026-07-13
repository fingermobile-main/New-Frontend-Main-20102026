import React from 'react';
import { useAppContext } from '../../contexts/AppContext';

import { NavLink } from "react-router-dom";

import { MOCK_CAMPAIGNS } from '../../constants';
import type { Campaign } from '../../types';

const CampaignsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [campaigns] = React.useState<Campaign[]>(MOCK_CAMPAIGNS);

  // Form state for creating a new campaign
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [couponValue, setCouponValue] = React.useState("");

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a simulation, in a real app this would hit an API
    showToast(`Campaign "${title}" created successfully!`, "success");
    // Reset form
    setTitle("");
    setDescription("");
    setCouponValue("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Create Form */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
          <h2 className="text-xl font-bold mb-4">Create New Campaign</h2>
          <form onSubmit={handleCreateCampaign} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Campaign Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Coupon Value (FIC)
              </label>
              <input
                type="number"
                value={couponValue}
                onChange={(e) => setCouponValue(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 font-semibold bg-brand-blue text-white rounded-lg hover:bg-blue-700"
            >
              Launch Campaign
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Campaign List */}
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Campaign Management</h1>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white p-4 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{campaign.title}</p>
                  <p className="text-xs text-gray-500">
                    Expires: {campaign.expiryDate}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${campaign.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {campaign.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {campaign.description}
              </p>
              <div className="mt-3 border-t pt-3 flex justify-between items-center text-sm">
                <p>
                  <strong>Reward:</strong>{" "}
                  {campaign.couponValue.toLocaleString()} FIC
                </p>
                <NavLink
                  to={`/dashboard/campaigns/${campaign.id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  View Analytics
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;
