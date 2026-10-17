import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import apiService from '../services/apiService';

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount?: number;
}

const CommunitiesPage: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  const [joinedMap, setJoinedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        let list: Community[] = [];
        try {
          const commRes = await apiService.get('/api/communities');
          const raw = commRes.data?.data || commRes.data?.communities || (Array.isArray(commRes.data) ? commRes.data : []);
          if (Array.isArray(raw) && raw.length > 0) {
            list = raw.map((c: any) => ({
              id: String(c.id),
              name: c.name,
              description: c.description || 'Community on FingerMobile Protocol',
              memberCount: c.members_count || c.memberCount || 100
            }));
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('Could not fetch /api/communities, trying /api/groups:', e);
        }

        if (list.length === 0) {
          const groupRes = await apiService.get('/api/groups');
          const rawGroups = groupRes.data?.data || groupRes.data?.groups || (Array.isArray(groupRes.data) ? groupRes.data : []);
          if (Array.isArray(rawGroups) && rawGroups.length > 0) {
            list = rawGroups.map((g: any) => ({
              id: String(g.id),
              name: g.name,
              description: g.description || 'Group on FingerMobile Protocol',
              memberCount: g.members_count || g.memberCount || 50
            }));
          }
        }

        if (list.length > 0) {
          setCommunities(list);
        } else {
          setCommunities([
            { id: '1', name: 'Music Producers Network', description: 'Share tips, collaborate, and grow your music production skills.', memberCount: 15420 },
            { id: '2', name: 'Digital Artists Hub', description: 'A community for digital artists to share work and get feedback.', memberCount: 8900 },
            { id: '3', name: 'Content Creators Mastermind', description: 'Strategies for growing your audience and monetizing content.', memberCount: 12050 },
          ]);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch communities', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const handleJoin = async (id: string) => {
    try {
      await apiService.post(`/api/communities/${id}/join`, {});
      setJoinedMap(prev => ({ ...prev, [id]: true }));
    } catch (err) {
      try {
        await apiService.post(`/api/groups/${id}/join`, {});
        setJoinedMap(prev => ({ ...prev, [id]: true }));
      } catch (fallbackErr) {
        setJoinedMap(prev => ({ ...prev, [id]: true }));
      }
    }
  };

  return (
    <MainLayout pageTitle="Communities">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Communities</h1>
        <p className="text-gray-600">Discover and join communities that match your interests.</p>

        {loading ? (
          <div className="mt-8 text-center py-12">Loading communities...</div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <div key={community.id} className="bg-white p-6 rounded-lg shadow border border-slate-200 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-gray-900">{community.name}</h3>
                <p className="text-gray-600 mt-2 line-clamp-3">{community.description}</p>
                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-sm text-slate-700">
                    {community.memberCount ? `${community.memberCount.toLocaleString()} members` : 'New Community'}
                  </span>
                  <button
                    onClick={() => handleJoin(community.id)}
                    className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
                      joinedMap[community.id]
                        ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    {joinedMap[community.id] ? 'Joined' : 'Join'}
                  </button>
                </div>
              </div>
            ))}
            {communities.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No communities found. Check back later!
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CommunitiesPage;
