import { useNavigate} from 'react-router-dom';
import React, { useState } from 'react';



import { useAuth } from '../../../contexts/AuthContext';
import { useHallmark } from '../../../contexts/HallmarkContext';
import { useGem } from '../../../contexts/GemContext';
import { useGroup } from '../../../contexts/GroupContext';
import type { CommunitySummary } from '../../../types';
import type { Hallmark, Gem, Group } from '../../../types';

const CommunityManagementPage: React.FC = () => {
  const { member } = useAuth();
  const navigate = useNavigate();
  const { hallmarks } = useHallmark();
  const { gems } = useGem();
  const { groups } = useGroup();
  const [activeTab, setActiveTab] = useState<'hallmarks' | 'gems' | 'groups'>(
    'hallmarks',
  );

  const memberHallmarks: CommunitySummary[] = hallmarks
    .filter((h: Hallmark) => h.owner?.id === member?.id)
    .map((h: Hallmark) => ({
      id: h.id,
      name: h.name,
      type: 'Hallmark',
      memberCount: (h.members || []).length,
      postCount: (h.posts || []).length
    }));

  const memberGems: CommunitySummary[] = gems
    .filter((g: Gem) => g.owner?.id === member?.id)
    .map((g: Gem) => ({
      id: g.id,
      name: g.name,
      type: 'Gem',
      memberCount: (g.members || []).length,
      postCount: (g.posts || []).length
    }));

  const memberGroups: CommunitySummary[] = groups
    .filter((g: Group) => g.owner?.id === member?.id)
    .map((g: Group) => ({
      id: g.id,
      name: g.name,
      type: 'Group',
      memberCount: (g.members || []).length,
      postCount: (g.posts || []).length
    }));

  const dataMap = {
    hallmarks: memberHallmarks,
    gems: memberGems,
    groups: memberGroups
  };

  const activeData = dataMap[activeTab];

  const TabButton: React.FC<{
    tab: 'hallmarks' | 'gems' | 'groups';
    label: string;
  }> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`py-2 px-4 font-semibold text-sm rounded-t-lg transition-colors ${
        activeTab === tab
          ? 'bg-white border-t border-l border-r border-slate-300 text-slate-900 shadow-sm'
          : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
      }`}
    >
      {label} ({dataMap[tab].length})
    </button>
  );

  const CommunityCard: React.FC<{ community: CommunitySummary }> = ({
    community
  }) => {
    const managePathMap: Record<string, string> = {
      Hallmark: `/hallmark/manage/${community.id}`,
      Gem: `/gems/manage/${community.id}`,
      Group: `/groups/manage/${community.id}`
    };

    const managePath = managePathMap[community.type];

    return (
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-300 flex justify-between items-center shadow-sm hover:border-slate-400 transition-colors">
        <div>
          <p className="font-bold text-slate-900 lg:text-base">
            {community.name}
          </p>
          <p className="text-xs text-slate-700 lg:text-sm mt-0.5">
            {(community.memberCount || 0).toLocaleString()} Members &middot;{' '}
            {community.postCount} Posts
          </p>
        </div>
        <button
          onClick={() => navigate(managePath)}
          className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm transition-colors"
        >
          Manage
        </button>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Community Management</h1>
      <div className="flex gap-2 border-b border-slate-300">
        <TabButton tab="hallmarks" label="My Hallmarks" />
        <TabButton tab="gems" label="My Gems" />
        <TabButton tab="groups" label="My Groups" />
      </div>
      <div className="bg-white p-6 rounded-b-xl rounded-r-xl shadow-sm border-b border-l border-r border-slate-300">
        {activeData.length > 0 ? (
          <div className="space-y-3">
            {activeData.map((item) => (
              <CommunityCard key={item.id} community={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-700 py-10 font-medium">
            You haven&apos;t created any communities of this type yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default CommunityManagementPage;
