import React from 'react';
import { useNavigate } from "react-router-dom";
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
  const [activeTab, setActiveTab] = React.useState<"hallmarks" | "gems" | "groups">(
    "hallmarks",
  );

  const memberHallmarks: CommunitySummary[] = hallmarks
    .filter((h: Hallmark) => h.owner?.id === member?.id)
    .map((h: Hallmark) => ({
      id: h.id,
      name: h.name,
      type: "Hallmark",
      memberCount: (h.members || []).length,
      postCount: (h.posts || []).length
    }));

  const memberGems: CommunitySummary[] = gems
    .filter((g: Gem) => g.owner?.id === member?.id)
    .map((g: Gem) => ({
      id: g.id,
      name: g.name,
      type: "Gem",
      memberCount: (g.members || []).length,
      postCount: (g.posts || []).length
    }));

  const memberGroups: CommunitySummary[] = groups
    .filter((g: Group) => g.owner?.id === member?.id)
    .map((g: Group) => ({
      id: g.id,
      name: g.name,
      type: "Group",
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
    tab: "hallmarks" | "gems" | "groups";
    label: string;
  }> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`py-2 px-4 font-semibold text-sm rounded-t-lg ${activeTab === tab ? "bg-white border border-b-0" : "bg-gray-100"}`}
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
      <div className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center">
        <div>
          <p className="font-bold text-gray-800 lg:text-base">
            {community.name}
          </p>
          <p className="text-xs text-gray-500 lg:text-sm">
            {(community.memberCount || 0).toLocaleString()} Members &middot;{" "}
            {community.postCount} Posts
          </p>
        </div>
        <button
          onClick={() => navigate(managePath)}
          className="px-3 py-1 text-xs font-semibold bg-brand-blue text-white rounded-full"
        >
          Manage
        </button>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Community Management</h1>
      <div className="flex gap-2 border-b">
        <TabButton tab="hallmarks" label="My Hallmarks" />
        <TabButton tab="gems" label="My Gems" />
        <TabButton tab="groups" label="My Groups" />
      </div>
      <div className="bg-white p-6 rounded-b-xl rounded-r-xl shadow-md">
        {activeData.length > 0 ? (
          <div className="space-y-3">
            {activeData.map((item) => (
              <CommunityCard key={item.id} community={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            You haven&apos;t created any communities of this type yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default CommunityManagementPage;
