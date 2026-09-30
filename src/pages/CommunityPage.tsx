import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useSuperViAuth } from '../contexts/SuperViAuthContext';
import api from '../services/api';

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
  const [activeTab, setActiveTab] = useState<'my' | 'discover'>('my');

  useEffect(() => {
    let mounted = true;
    const fetchCommunities = async () => {
      try {
        const res = await api.get('/communities');
        const raw = res.data?.data || res.data?.communities || (Array.isArray(res.data) ? res.data : []);
        if (mounted && Array.isArray(raw) && raw.length > 0) {
          setCommunities(raw.map((c: any, index: number) => ({
            id: String(c.id),
            name: c.name,
            description: c.description,
            memberCount: c.members_count || 100,
            isJoined: index % 2 === 0,
            category: c.category || 'General'
          })));
          return;
        }
      } catch (err) {
        console.warn('Failed to load communities, using default list:', err);
      }
      if (mounted) {
        setCommunities([
          { id: '1', name: 'Tech Innovators', description: 'Community for technology enthusiasts and innovators', memberCount: 1250, isJoined: true, category: 'Technology' },
          { id: '2', name: 'Creative Minds', description: 'Artists, designers, and creative professionals', memberCount: 850, isJoined: true, category: 'Arts' },
          { id: '3', name: 'Business Network', description: 'Entrepreneurs and business leaders', memberCount: 2100, isJoined: false, category: 'Business' },
          { id: '4', name: 'Health & Wellness', description: 'Promoting healthy lifestyles and wellbeing', memberCount: 750, isJoined: false, category: 'Health' }
        ]);
      }
    };
    fetchCommunities();
    return () => { mounted = false; };
  }, []);

  const joinCommunity = async (id: string) => {
    try {
      await api.post(`/communities/${id}/join`);
    } catch (err) {
      console.warn('Failed to persist join community:', err);
    }
    setCommunities(
      communities.map((comm) =>
        comm.id === id
          ? { ...comm, isJoined: true, memberCount: comm.memberCount + 1 }
          : comm,
      ),
    );
  };

  const leaveCommunity = async (id: string) => {
    try {
      await api.post(`/communities/${id}/leave`);
    } catch (err) {
      console.warn('Failed to persist leave community:', err);
    }
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
    activeTab === 'my'
      ? communities.filter((comm) => comm.isJoined)
      : communities.filter((comm) => !comm.isJoined);

  return (
    <MainLayout pageTitle="Community">
      <div className="min-h-screen bg-white">
        <div className="max-w-[1920px] mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Communities</h1>
            <p className="text-gray-600 mt-2">Connect, share, and grow with like-minded individuals</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block lg:col-span-3 space-y-6">
              <div className="sticky top-20 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Navigation</h3>
                  <ul className="space-y-3">
                    <li><button className="w-full text-left font-medium text-blue-600 hover:underline">All Communities</button></li>
                    <li><button className="w-full text-left text-gray-600 hover:text-blue-600">My Groups</button></li>
                    <li><button className="w-full text-left text-gray-600 hover:text-blue-600">Events</button></li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Your Stats</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Communities Joined</span>
                      <span className="font-bold text-gray-900">{communities.filter(c => c.isJoined).length}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Posts Created</span>
                      <span className="font-bold text-gray-900">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Connections</span>
                      <span className="font-bold text-gray-900">48</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex space-x-4 mb-6 border-b border-gray-200">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'my'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('my')}
                >
            My Communities ({communities.filter((c) => c.isJoined).length})
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'discover'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('discover')}
                >
            Discover Communities ({communities.filter((c) => !c.isJoined).length})
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Right Sidebar */}
            <div className="hidden lg:block lg:col-span-3 space-y-6">
              <div className="sticky top-20 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Trending Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {['#React', '#Design', '#Startup', '#Health', '#AI', '#WebDev'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-blue-100 hover:text-blue-600 cursor-pointer transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="font-bold text-gray-900 mb-2">Create a Community</h3>
                  <p className="text-sm text-gray-600 mb-4">Can't find what you're looking for? Start your own space!</p>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                  Create New
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </MainLayout>
  );
};

export default CommunityPage;
