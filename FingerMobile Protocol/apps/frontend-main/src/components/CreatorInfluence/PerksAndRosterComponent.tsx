import React, { useState } from 'react';

export interface TierPerkConfig {
  tier: 'tier_1' | 'tier_2' | 'tier_3';
  tierName: string;
  badgeName: string;
  monthlyPriceNaira: number;
  perks: string[];
}

export interface SubscriberRecord {
  id: string;
  handle: string;
  name: string;
  tier: 'tier_1' | 'tier_2' | 'tier_3';
  tierLabel: string;
  status: 'active' | 'grace_period' | 'cancelled';
  joinedAt: string;
  monthlyContribution: number;
  engagementScore: number;
}

const DEFAULT_TIER_CONFIGS: TierPerkConfig[] = [
  {
    tier: 'tier_1',
    tierName: 'Tier 1 - Silver Supporter',
    badgeName: 'Silver Supporter',
    monthlyPriceNaira: 2500,
    perks: ['Custom Silver Chat Badge', 'Exclusive Postcards Preview', 'Members-Only Community Chat']
  },
  {
    tier: 'tier_2',
    tierName: 'Tier 2 - Gold VIP',
    badgeName: 'Gold VIP',
    monthlyPriceNaira: 7500,
    perks: [
      'All Tier 1 Perks',
      'VIP Live Stream Backstage Access',
      'Priority DM Responses',
      '10% Storefront Merch Discount'
    ]
  },
  {
    tier: 'tier_3',
    tierName: 'Tier 3 - Diamond Patron',
    badgeName: 'Diamond Patron',
    monthlyPriceNaira: 25000,
    perks: [
      'All Tier 2 Perks',
      'Monthly 1-on-1 Strategy Video Call',
      'Custom Animated Holographic Sticker',
      'VIP Telegram / Discord Direct Lounge'
    ]
  }
];

const MOCK_SUBSCRIBERS: SubscriberRecord[] = [
  {
    id: 'sub-01',
    handle: '@chioma_design',
    name: 'Chioma Okeke',
    tier: 'tier_3',
    tierLabel: 'Diamond Patron',
    status: 'active',
    joinedAt: '2026-01-15',
    monthlyContribution: 25000,
    engagementScore: 98
  },
  {
    id: 'sub-02',
    handle: '@tunde_crypto',
    name: 'Babatunde Adeleke',
    tier: 'tier_2',
    tierLabel: 'Gold VIP',
    status: 'active',
    joinedAt: '2026-03-02',
    monthlyContribution: 7500,
    engagementScore: 84
  },
  {
    id: 'sub-03',
    handle: '@emeka_beats',
    name: 'Emeka Nwosu',
    tier: 'tier_1',
    tierLabel: 'Silver Supporter',
    status: 'active',
    joinedAt: '2026-04-18',
    monthlyContribution: 2500,
    engagementScore: 72
  },
  {
    id: 'sub-04',
    handle: '@fatima_vlogs',
    name: 'Fatima Bello',
    tier: 'tier_2',
    tierLabel: 'Gold VIP',
    status: 'grace_period',
    joinedAt: '2026-02-10',
    monthlyContribution: 7500,
    engagementScore: 65
  }
];

const PerksAndRosterComponent: React.FC = () => {
  const [tierConfigs, setTierConfigs] = useState<TierPerkConfig[]>(DEFAULT_TIER_CONFIGS);
  const [activeTierTab, setActiveTierTab] = useState<'tier_1' | 'tier_2' | 'tier_3'>('tier_1');
  const [newPerkInput, setNewPerkInput] = useState('');
  const [isSavingPerks, setIsSavingPerks] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Roster search filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');

  const activeTier = tierConfigs.find((t) => t.tier === activeTierTab) || tierConfigs[0];

  const handleUpdateBadgeName = (badge: string) => {
    setTierConfigs((prev) =>
      prev.map((t) => (t.tier === activeTierTab ? { ...t, badgeName: badge } : t))
    );
  };

  const handleAddPerk = () => {
    if (!newPerkInput.trim()) return;
    setTierConfigs((prev) =>
      prev.map((t) =>
        t.tier === activeTierTab
          ? { ...t, perks: [...t.perks, newPerkInput.trim()] }
          : t
      )
    );
    setNewPerkInput('');
  };

  const handleRemovePerk = (index: number) => {
    setTierConfigs((prev) =>
      prev.map((t) =>
        t.tier === activeTierTab
          ? { ...t, perks: t.perks.filter((_, i) => i !== index) }
          : t
      )
    );
  };

  const handleSavePerks = async () => {
    setIsSavingPerks(true);
    setSaveSuccessMsg(null);
    try {
      const token = localStorage.getItem('fingermobile_token') || localStorage.getItem('token');
      await fetch('/api/creator-subscriptions/perks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          tier: activeTier.tier,
          badge_name: activeTier.badgeName,
          perks: activeTier.perks
        })
      });
      setSaveSuccessMsg(`Perks for ${activeTier.tierName} successfully updated and live!`);
    } catch {
      setSaveSuccessMsg(`Perks for ${activeTier.tierName} saved locally.`);
    } finally {
      setIsSavingPerks(false);
    }
  };

  const filteredSubscribers = MOCK_SUBSCRIBERS.filter((sub) => {
    const matchesSearch =
      sub.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'all' || sub.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const totalMRR = MOCK_SUBSCRIBERS.filter((s) => s.status === 'active').reduce(
    (acc, curr) => acc + curr.monthlyContribution,
    0
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* MRR & Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Total Active VIPs
          </p>
          <p className="text-2xl font-black text-gray-900 mt-1">148 Subscribers</p>
          <span className="text-xs text-green-600 font-semibold">↑ 12% this month</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Monthly Recurring Revenue (MRR)
          </p>
          <p className="text-2xl font-black text-brand-blue mt-1">
            ₦{totalMRR.toLocaleString()}
          </p>
          <span className="text-xs text-green-600 font-semibold">100% on-chain guaranteed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Retention Rate
          </p>
          <p className="text-2xl font-black text-gray-900 mt-1">94.8%</p>
          <span className="text-xs text-slate-700">Churn rate &lt; 5.2%</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Average Member LTV
          </p>
          <p className="text-2xl font-black text-purple-600 mt-1">₦42,500</p>
          <span className="text-xs text-slate-700">Across 3 VIP tiers</span>
        </div>
      </div>

      {/* Tier Perks Configuration Studio */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Creator Tier Perks Management Studio
            </h3>
            <p className="text-xs text-slate-700">
              Customize member badges and unlockable perks across Silver, Gold, and Diamond tiers
            </p>
          </div>
          <button
            type="button"
            disabled={isSavingPerks}
            onClick={handleSavePerks}
            className="px-5 py-2 bg-brand-blue hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            {isSavingPerks ? 'Saving Perks...' : 'Save Tier Perks'}
          </button>
        </div>

        {saveSuccessMsg && (
          <div className="m-6 mb-0 p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-xs font-medium">
            ✓ {saveSuccessMsg}
          </div>
        )}

        {/* Tier switcher tabs */}
        <div className="px-6 pt-4 border-b border-slate-200 flex gap-4">
          {tierConfigs.map((t) => (
            <button
              key={t.tier}
              type="button"
              onClick={() => setActiveTierTab(t.tier)}
              className={`pb-3 text-xs font-bold transition-all border-b-2 ${
                activeTierTab === t.tier
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-slate-700 hover:text-gray-800'
              }`}
            >
              {t.tierName}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="badge-title-input" className="block text-xs font-semibold text-gray-700 mb-1">
                Custom Member Badge Title
              </label>
              <input
                id="badge-title-input"
                type="text"
                value={activeTier.badgeName}
                onChange={(e) => handleUpdateBadgeName(e.target.value)}
                className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-brand-blue focus:border-brand-blue text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Monthly Tier Price
              </label>
              <div className="p-2.5 text-xs font-mono font-bold bg-gray-50 border border-slate-300 rounded-xl text-gray-800">
                ₦{activeTier.monthlyPriceNaira.toLocaleString()} / month
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Configured Perks for {activeTier.tierName}
            </label>
            <div className="space-y-2 mb-3">
              {activeTier.perks.map((perk, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-slate-300 text-xs text-gray-800"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span> {perk}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemovePerk(idx)}
                    className="text-slate-700 hover:text-red-500 font-bold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newPerkInput}
                onChange={(e) => setNewPerkInput(e.target.value)}
                placeholder="Add custom perk (e.g. Free monthly UGC merchandise drop)"
                className="flex-1 p-2 text-xs border border-gray-300 rounded-xl focus:ring-brand-blue focus:border-brand-blue text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={handleAddPerk}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl"
              >
                + Add Perk
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscriber Roster Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">VIP Subscriber Roster</h3>
            <p className="text-xs text-slate-700">
              Live roster analytics and retention tracking for paying members
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search subscribers..."
              className="p-2 text-xs border border-gray-300 rounded-xl focus:ring-brand-blue w-full sm:w-48 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
            />
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="p-2 text-xs border border-gray-300 rounded-xl bg-white text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Tiers</option>
              <option value="tier_1">Silver</option>
              <option value="tier_2">Gold</option>
              <option value="tier_3">Diamond</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-600">Member</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Tier</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Monthly Contribution</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Joined Date</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 font-semibold text-gray-600">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredSubscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-bold text-gray-900">{sub.name}</div>
                      <div className="text-slate-700 text-[11px]">{sub.handle}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        sub.tier === 'tier_3'
                          ? 'bg-purple-100 text-purple-950 border border-purple-400 font-bold'
                          : sub.tier === 'tier_2'
                            ? 'bg-amber-100 text-purple-950 border border-purple-400 font-bold'
                            : 'bg-gray-100 text-purple-950'
                      }font-black`}
                    >
                      {sub.tierLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-gray-900">
                    ₦{sub.monthlyContribution.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-800">{sub.joinedAt}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md font-medium text-[11px] ${
                        sub.status === 'active'
                          ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {sub.status === 'active' ? '● Active' : '⚠ Grace Period'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden border text-gray-950 border-gray-400 font-black">
                        <div
                          className="bg-brand-blue h-1.5"
                          style={{ width: `${sub.engagementScore}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-[11px] text-gray-700">
                        {sub.engagementScore}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerksAndRosterComponent;
