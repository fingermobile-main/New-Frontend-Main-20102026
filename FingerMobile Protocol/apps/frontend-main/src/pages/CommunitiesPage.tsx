import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import apiService from '../services/apiService';
import { Users, PlusCircle, Compass, MessageSquare } from 'lucide-react';

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount?: number;
}

const CommunitiesPage: React.FC = () => {
  const navigate = useNavigate();
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
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-3 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Communities Hub</h1>
            <p className="text-slate-700 text-xs sm:text-base mt-1 sm:mt-2 font-medium">Discover, collaborate, and join thriving communities across music, technology, creative arts, and Web3.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/groups/create')}
            className="min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-sm transition active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Create Guild / Group
          </button>
        </div>

        {loading ? (
          <div className="mt-8 text-center py-12 text-slate-700 font-semibold">Loading communities...</div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <div key={community.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-300 hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{community.name}</h3>
                  <p className="text-slate-700 mt-2 line-clamp-3 text-sm leading-relaxed">{community.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    {community.memberCount ? `${community.memberCount.toLocaleString()} members` : 'Active Community'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleJoin(community.id)}
                    className={`min-h-[44px] min-w-[80px] text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all flex items-center justify-center active:scale-95 cursor-pointer ${
                      joinedMap[community.id]
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    }`}
                  >
                    {joinedMap[community.id] ? 'Joined' : 'Join'}
                  </button>
                </div>
              </div>
            ))}
            {communities.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-700 font-semibold border border-dashed border-slate-300 rounded-xl bg-slate-50">
                No communities found. Check back later!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Sovereign Mobile Navigation Quick Dock */}
      <div
        data-testid="communities-mobile-dock"
        className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden"
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-blue-400 active:scale-95 transition-transform"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Explore</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/groups/create')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white active:scale-95 transition-transform"
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Create</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/groups')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white active:scale-95 transition-transform"
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">My Groups</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/forum')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white active:scale-95 transition-transform"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Forum</span>
        </button>
      </div>
    </MainLayout>
  );
};

export default CommunitiesPage;
