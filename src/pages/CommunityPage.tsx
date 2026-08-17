import React, { useEffect, useState } from 'react';
import { useSuperViAuth } from '../contexts/SuperViAuthContext';

interface Community {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  isJoined: boolean;
  category: string;
}

const CommunityPage: React.FC = () => {
  const { authState } = useSuperViAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [activeTab, setActiveTab] = useState<"my" | "discover">("my");

  useEffect(() => {
    // Simulate API call to fetch communities
    const mockCommunities: Community[] = [
      {
        id: "1",
        name: "Tech Innovators",
        description: "Community for technology enthusiasts and innovators",
        memberCount: 1250,
        isJoined: true,
        category: "Technology"
      },
      {
        id: "2",
        name: "Creative Minds",
        description: "Artists, designers, and creative professionals",
        memberCount: 850,
        isJoined: true,
        category: "Arts"
      },
      {
        id: "3",
        name: "Business Network",
        description: "Entrepreneurs and business leaders",
        memberCount: 2100,
        isJoined: false,
        category: "Business"
      },
      {
        id: "4",
        name: "Health & Wellness",
        description: "Promoting healthy lifestyles and wellbeing",
        memberCount: 750,
        isJoined: false,
        category: "Health"
      }
    ];
    setCommunities(mockCommunities);
  }, []);

  const joinCommunity = (id: string) => {
    setCommunities(
      communities.map((comm) =>
        comm.id === id
          ? { ...comm, isJoined: true, memberCount: comm.memberCount + 1 }
          : comm,
      ),
    );
  };

  const leaveCommunity = (id: string) => {
    setCommunities(
      communities.map((comm) =>
        comm.id === id && comm.isJoined
          ? {
              ...comm,
              isJoined: false,
              memberCount: Math.max(0, comm.memberCount - 1)
            }
          : comm,
      ),
    );
  };

  const filteredCommunities =
    activeTab === "my"
      ? communities.filter((comm) => comm.isJoined)
      : communities.filter((comm) => !comm.isJoined);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Communities</h1>
        
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "my"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("my")}
          >
            My Communities ({communities.filter((c) => c.isJoined).length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "discover"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("discover")}
          >
            Discover Communities ({communities.filter((c) => !c.isJoined).length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <div key={community.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900">{community.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {community.category}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{community.description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
                {community.memberCount.toLocaleString()} members
              </div>
              <div className="mt-4">
                {community.isJoined ? (
                  <button
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => leaveCommunity(community.id)}
                  >
                    Joined
                  </button>
                ) : (
                  <button
                    className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => joinCommunity(community.id)}
                  >
                    Join Community
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
