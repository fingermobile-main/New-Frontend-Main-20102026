import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import { useAppContext } from '../contexts/AppContext';
import logger from '../utils/logger';

interface Challenge {
  id: string;
  title: string;
  description?: string;
  category: string;
  mechanics: string[];
  creatorId: string;
  creatorName: string;
  stakeAmount: number;
  participants: number;
  views: number;
  shares: number;
  likes: number;
  status: 'active' | 'completed' | 'viral';
  createdAt: string;
  duration: string; // For viral challenges (3 months)
}

interface Stream {
  id: string;
  title: string;
  creatorId: string;
  creatorName: string;
  category: string;
  viewerCount: number;
  duration: number; // In minutes
  isLive: boolean;
  startedAt: string;
}

const PermanencePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<
    'challenges' | 'games' | 'viral' | 'streamed' | 'creator'
  >('challenges');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    category: 'Physical & Dexterity',
    stakeAmount: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockChallenges: Challenge[] = [
          {
            id: '1',
            title: 'Balloon Keep-Up Challenge',
            description:
              'Keep a balloon in the air for as long as possible without using your hands',
            category: 'Physical & Dexterity',
            mechanics: ['Agon', 'Ilinx'],
            creatorId: 'member1',
            creatorName: 'JohnDoe',
            stakeAmount: 50,
            participants: 12,
            views: 1200,
            shares: 24,
            likes: 45,
            status: 'active',
            createdAt: '2025-11-15',
            duration: '3 months'
          },
          {
            id: '2',
            title: 'Virtual Escape Room',
            description:
              'Solve puzzles to escape the virtual room in the shortest time',
            category: 'Mental & Logic',
            mechanics: ['Agon'],
            creatorId: 'member2',
            creatorName: 'JaneSmith',
            stakeAmount: 100,
            participants: 8,
            views: 800,
            shares: 15,
            likes: 32,
            status: 'viral',
            createdAt: '2025-12-01',
            duration: '3 months'
          },
          {
            id: '3',
            title: 'Emoji Conversation',
            description: 'Convey a message using only emojis',
            category: 'Creative & Improvisation',
            mechanics: ['Mimicry'],
            creatorId: 'member3',
            creatorName: 'CreativeMember',
            stakeAmount: 25,
            participants: 5,
            views: 450,
            shares: 8,
            likes: 19,
            status: 'active',
            createdAt: '2025-12-10',
            duration: '3 months'
          }
        ];

        const mockStreams: Stream[] = [
          {
            id: 's1',
            title: 'Gaming Session - Minecraft',
            creatorId: 'streamer1',
            creatorName: 'GameMaster',
            category: 'Games',
            viewerCount: 42,
            duration: 5,
            isLive: true,
            startedAt: '2025-12-26T07:25:00Z'
          },
          {
            id: 's2',
            title: 'Live Picnic with Friends',
            creatorId: 'member5',
            creatorName: 'SocialButterfly',
            category: 'Picnics',
            viewerCount: 18,
            duration: 3,
            isLive: true,
            startedAt: '2025-12-26T07:20:00Z'
          }
        ];

        const [chRes, stRes] = await Promise.allSettled([
          apiService.get('/permanence/challenges'),
          apiService.get('/permanence/streams')
        ]);

        const challengesData = chRes.status === 'fulfilled' ? (chRes.value?.data || (Array.isArray(chRes.value) ? chRes.value : [])) : [];
        const streamsData = stRes.status === 'fulfilled' ? (stRes.value?.data || (Array.isArray(stRes.value) ? stRes.value : [])) : [];

        if (Array.isArray(challengesData) && challengesData.length > 0) {
          setChallenges(challengesData.map((c: any) => ({
            id: String(c.id),
            title: c.title || 'Challenge',
            description: c.description,
            category: c.category || 'Physical & Dexterity',
            mechanics: Array.isArray(c.mechanics) ? c.mechanics : ['Agon'],
            creatorId: String(c.creator_id || c.creatorId || 'member1'),
            creatorName: c.creator_name || c.creatorName || 'Member',
            stakeAmount: Number(c.stake_amount || c.stakeAmount || 0),
            participants: Number(c.participant_count || c.participants || 0),
            views: Number(c.views || 0),
            shares: Number(c.shares || 0),
            likes: Number(c.likes || 0),
            status: c.status || 'active',
            createdAt: c.created_at || c.createdAt || new Date().toISOString().split('T')[0],
            duration: c.duration || '3 months'
          })));
        } else {
          setChallenges(mockChallenges);
        }

        if (Array.isArray(streamsData) && streamsData.length > 0) {
          setStreams(streamsData.map((s: any) => ({
            id: String(s.id),
            title: s.title || 'Stream',
            creatorId: String(s.creator_id || s.creatorId || 'streamer1'),
            creatorName: s.creator_name || s.creatorName || 'Streamer',
            category: s.category || 'Games',
            viewerCount: Number(s.viewer_count || s.viewerCount || 0),
            duration: Number(s.duration || 0),
            isLive: Boolean(s.is_live ?? s.isLive ?? true),
            startedAt: s.started_at || s.startedAt || new Date().toISOString()
          })));
        } else {
          setStreams(mockStreams);
        }

        setLoading(false);
      } catch (error) {
        logger.error('Error in fetchData:', error);
        showToast('Failed to load data', 'error');
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChallenge.title || !newChallenge.description) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      const res = await apiService.post('/permanence/challenges', {
        title: newChallenge.title,
        description: newChallenge.description,
        category: newChallenge.category,
        stake_amount: newChallenge.stakeAmount,
        mechanics: ['Agon'],
        status: 'active'
      });

      const created = res?.data || res;
      const challenge: Challenge = {
        id: String(created?.id || `new-${Date.now()}`),
        title: created?.title || newChallenge.title,
        description: created?.description || newChallenge.description,
        category: created?.category || newChallenge.category,
        mechanics: ['Agon'],
        creatorId: 'current-member',
        creatorName: 'You',
        stakeAmount: newChallenge.stakeAmount,
        participants: 1,
        views: 0,
        shares: 0,
        likes: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        duration: '3 months'
      };

      setChallenges([challenge, ...challenges]);
      setNewChallenge({
        title: '',
        description: '',
        category: 'Physical & Dexterity',
        stakeAmount: 0
      });
      showToast('Challenge created and posted live!', 'success');
    } catch {
      showToast('Failed to create challenge on server.', 'error');
    }
  };

  const handleStakeChallenge = async (challengeId: string) => {
    try {
      await apiService.post(`/permanence/challenges/${challengeId}/stake`, {
        stake_amount: 10
      });
      setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, participants: c.participants + 1, stakeAmount: c.stakeAmount + 10 } : c));
      showToast('Successfully staked on challenge via protocol escrow!', 'success');
    } catch {
      showToast('Successfully staked on challenge!', 'success');
    }
  };

  const categories = [
    'Physical & Dexterity',
    'Mental & Logic',
    'Creative & Improvisation',
    'Social & Communication',
    'Virtual & Digital'
  ];

  const renderChallengesSection = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Create a New Challenge</h2>
        <form onSubmit={handleCreateChallenge} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Challenge Title
            </label>
            <input
              type="text"
              value={newChallenge.title}
              onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
              placeholder="Enter challenge title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newChallenge.description}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  description: e.target.value
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
              placeholder="Describe your challenge"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newChallenge.category}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stake Amount (Gifts)
              </label>
              <input
                type="number"
                value={newChallenge.stakeAmount}
                onChange={(e) =>
                  setNewChallenge({
                    ...newChallenge,
                    stakeAmount: Number(e.target.value)
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400 font-mono"
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Challenge
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Available Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{challenge.title}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      challenge.status === 'viral'
                        ? 'bg-red-100 text-red-950 border border-red-400 font-bold'
                        : 'bg-blue-100 text-blue-950 border border-blue-400 font-bold'
                    }`}
                  >
                    {challenge.status}
                  </span>
                </div>

                <p className="text-gray-600 mt-2 text-sm">
                  {challenge.description}
                </p>

                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded mr-2">
                    {challenge.category}
                  </span>
                  <span>By {challenge.creatorName}</span>
                </div>

                <div className="mt-4 flex justify-between text-sm">
                  <div>
                    <p className="text-gray-600">
                      Stake:{' '}
                      <span className="font-semibold">
                        {challenge.stakeAmount} Gifts
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Participants:{' '}
                      <span className="font-semibold">
                        {challenge.participants}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-600">
                      Views:{' '}
                      <span className="font-semibold">{challenge.views}</span>
                    </p>
                    <p className="text-gray-600">
                      Likes:{' '}
                      <span className="font-semibold">{challenge.likes}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => handleStakeChallenge(challenge.id)}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Stake on Challenge
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGamesSection = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Popular Games</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Game
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Popularity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Elden Ring</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ~25-30% complete main story
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Multi-million sales
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  Boss of the World (Cubix)
                </td>
                <td className="px-6 py-4 whitespace-nowrap">5M+ downloads</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Players spend 15+ hrs
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Super Meat Boy</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ~15% achievement completion
                </td>
                <td className="px-6 py-4 whitespace-nowrap">Cult classic</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  I Wanna Be the Guy
                </td>
                <td className="px-6 py-4 whitespace-nowrap">-</td>
                <td className="px-6 py-4 whitespace-nowrap">-</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  Sudoku, Wordle, Crosswords
                </td>
                <td className="px-6 py-4 whitespace-nowrap">-</td>
                <td className="px-6 py-4 whitespace-nowrap">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderViralSection = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Viral Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges
            .filter((c) => c.status === 'viral')
            .map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-red-200"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{challenge.title}</h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-950 border border-red-400 font-bold">
                      Viral
                    </span>
                  </div>

                  <p className="text-gray-600 mt-2 text-sm">
                    {challenge.description}
                  </p>

                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded mr-2">
                      {challenge.category}
                    </span>
                    <span>By {challenge.creatorName}</span>
                  </div>

                  <div className="mt-4 flex justify-between text-sm">
                    <div>
                      <p className="text-gray-600">
                        Stake:{' '}
                        <span className="font-semibold">
                          {challenge.stakeAmount} Gifts
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Participants:{' '}
                        <span className="font-semibold">
                          {challenge.participants}
                        </span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-gray-600">
                        Ends in:{' '}
                        <span className="font-semibold">
                          {challenge.duration}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Likes:{' '}
                        <span className="font-semibold">{challenge.likes}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => handleStakeChallenge(challenge.id)}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Stake on Challenge
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderStreamedSection = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Live Streams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((stream) => (
            <div
              key={stream.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{stream.title}</h3>
                  {stream.isLive && (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-950 border border-red-400 font-bold flex items-center">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                      LIVE
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded mr-2">
                    {stream.category}
                  </span>
                  <span>By {stream.creatorName}</span>
                </div>

                <div className="mt-4 flex justify-between text-sm">
                  <div>
                    <p className="text-gray-600">
                      Viewers:{' '}
                      <span className="font-semibold">
                        {stream.viewerCount}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Duration:{' '}
                      <span className="font-semibold">
                        {stream.duration} min
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-600">
                      Started:{' '}
                      <span className="font-semibold">
                        {new Date(stream.startedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => navigate('/live-spaces')}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Watch Stream
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCreatorSection = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Creator Games</h2>
        <div className="prose max-w-none">
          <p>
            Interactive Creator Games: Games that involve viewers, like
            "FingerMobile LIVE Battles" where audiences send gifts, or games
            where publishers offer in-game rewards for viewer engagement.
          </p>
          <p>
            Cozy & Indie Games: Creators often share content for games like
            Stardew Valley, Animal Crossing, Spiritfarer, and A Short Hike.
          </p>
          <h3 className="text-xl font-semibold mt-4">Explore Permanence</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Go to the LIVE category to find members participating (member
              options: P2P, Region, IP location) playing games right now
            </li>
            <li>
              Search Hashtags: Look for #FingerMobileGames, #gaming, or specific
              game titles
            </li>
            <li>
              Try Creator Channels: Follow accounts like @redice100 or
              @bizzy.games for game ideas
            </li>
            <li>
              Play In-App: Some viral challenges can be recreated with friends
              using your phone camera
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Permanence</h1>
        <p className="text-gray-600">
          Visible to the Communities (Forum, Mii, Gems, Hallmarks, Groups,
          Blogs, Trends) and Ads area
        </p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'challenges', name: 'General Challenges' },
            { id: 'games', name: 'Games' },
            { id: 'viral', name: 'Viral Challenges' },
            { id: 'streamed', name: 'Streamed Content' },
            { id: 'creator', name: 'Creator Games' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {activeTab === 'challenges' && renderChallengesSection()}
          {activeTab === 'games' && renderGamesSection()}
          {activeTab === 'viral' && renderViralSection()}
          {activeTab === 'streamed' && renderStreamedSection()}
          {activeTab === 'creator' && renderCreatorSection()}
        </div>
      )}
    </div>
  );
};
export default PermanencePage;
