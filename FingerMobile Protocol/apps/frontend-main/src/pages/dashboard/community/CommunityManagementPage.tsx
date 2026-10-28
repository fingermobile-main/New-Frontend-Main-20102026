import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useHallmark } from '../../../contexts/HallmarkContext';
import { useGem } from '../../../contexts/GemContext';
import { useGroup } from '../../../contexts/GroupContext';
import PlatformOwnershipCard from '../../../components/dashboard/PlatformOwnershipCard';
import type { CommunitySummary } from '../../../types';
import type { Hallmark, Gem, Group } from '../../../types';
import {
  TrophyIcon,
  GemIcon,
  UserGroupIcon,
  PlusIcon
} from '../../../icons';

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
      className={`min-h-[44px] py-2.5 px-4 sm:px-5 font-bold text-xs sm:text-sm rounded-t-xl transition-colors cursor-pointer flex items-center justify-center whitespace-nowrap ${
        activeTab === tab
          ? 'bg-white border-t-2 border-l border-r border-t-blue-600 border-l-slate-300 border-r-slate-300 text-slate-900 shadow-sm'
          : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border-t border-transparent'
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
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 shadow-xs hover:border-slate-400 transition-colors">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-black text-slate-900 text-sm sm:text-base">
              {community.name}
            </p>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-950 border border-blue-400">
              {community.type}
            </span>
          </div>
          <p className="text-xs text-slate-700 font-medium sm:text-sm mt-1">
            {(community.memberCount || 0).toLocaleString()} Members &middot;{' '}
            {community.postCount} Posts
          </p>
        </div>
        <button
          onClick={() => navigate(managePath)}
          className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center"
        >
          Manage Console
        </button>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-3 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Community Management Console</h1>
          <p className="text-slate-700 font-medium text-xs sm:text-sm mt-1">
            Manage your sovereign Hallmarks (up to 250k members), Gems, and interest groups
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate('/hallmark/create')}
            className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm cursor-pointer transition-colors flex items-center justify-center"
          >
            + Create Hallmark
          </button>
          <button
            onClick={() => navigate('/hallmarks')}
            className="min-h-[44px] px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold rounded-lg shadow-sm cursor-pointer transition-colors flex items-center justify-center"
          >
            Explore Feeds
          </button>
        </div>
      </div>

      {/* Platform Ownership Card */}
      <PlatformOwnershipCard />

      {/* Tabs */}
      <div>
        <div className="flex gap-2 border-b border-slate-300 overflow-x-auto pb-0.5 no-scrollbar">
          <TabButton tab="hallmarks" label="My Hallmarks" />
          <TabButton tab="gems" label="My Gems" />
          <TabButton tab="groups" label="My Groups" />
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-b-xl rounded-r-xl shadow-sm border-b border-l border-r border-slate-300">
          {activeData.length > 0 ? (
            <div className="space-y-3">
              {activeData.map((item) => (
                <CommunityCard key={item.id} community={item} />
              ))}
            </div>
          ) : (
            <div className="py-12 px-4 text-center max-w-md mx-auto">
              <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-300 font-black text-xl">
                {activeTab === 'hallmarks' ? '🏅' : activeTab === 'gems' ? '💎' : '👥'}
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">
                No {activeTab === 'hallmarks' ? 'Hallmarks' : activeTab === 'gems' ? 'Gems' : 'Groups'} Created Yet
              </h3>
              <p className="text-sm text-slate-700 font-medium mb-6">
                {activeTab === 'hallmarks'
                  ? 'Launch your sovereign mega-community with 250k member capacity, badge issuing rights, and multi-sig vaults.'
                  : activeTab === 'gems'
                  ? 'Create curated merit badges and gem micro-communities to reward contributor excellence.'
                  : 'Establish specialized interest clusters and collaborative discussion circles.'}
              </p>
              <button
                onClick={() => {
                  if (activeTab === 'hallmarks') {
                    navigate('/hallmark/create');
                  } else {
                    navigate('/hallmarks');
                  }
                }}
                className="min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center justify-center"
              >
                {activeTab === 'hallmarks' ? 'Launch Your First Hallmark' : `Explore ${activeTab}`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden">
        <button
          onClick={() => setActiveTab('hallmarks')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 transition-colors ${
            activeTab === 'hallmarks' ? 'text-blue-400' : 'text-slate-300 hover:text-white'
          }`}
          title="Hallmarks"
        >
          <TrophyIcon className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Hallmarks</span>
        </button>
        <button
          onClick={() => setActiveTab('gems')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 transition-colors ${
            activeTab === 'gems' ? 'text-blue-400' : 'text-slate-300 hover:text-white'
          }`}
          title="Gems"
        >
          <GemIcon className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Gems</span>
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 transition-colors ${
            activeTab === 'groups' ? 'text-blue-400' : 'text-slate-300 hover:text-white'
          }`}
          title="Groups"
        >
          <UserGroupIcon className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Groups</span>
        </button>
        <button
          onClick={() => navigate('/hallmark/create')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
          title="Create"
        >
          <PlusIcon className="w-5 h-5 text-blue-400" />
          <span className="text-[10px] font-semibold mt-0.5">Create</span>
        </button>
      </div>
    </div>
  );
};

export default CommunityManagementPage;
