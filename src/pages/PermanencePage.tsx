import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  mechanics: string[];
  creatorId: string;
  creatorName: string;
  stakeAmount: number;
  participants: number;
  views: number;
  shares: number;
  likes: number;
  status: "active" | "completed" | "viral";
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
  const [activeTab, setActiveTab] = React.useState<
    "challenges" | "games" | "viral" | "streamed" | "creator"
  >("challenges");
  const [challenges, setChallenges] = React.useState<Challenge[]>([]);
  const [streams, setStreams] = React.useState<Stream[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [newChallenge, setNewChallenge] = React.useState({
    title: "",
    description: "",
    category: "Physical & Dexterity",
    stakeAmount: 0
  });

  React.useEffect(() => {
    // Simulate loading data
    const fetchData = async () => {
      try {
        // Mock data for challenges
        const mockChallenges: Challenge[] = [
          {
            id: "1",
            title: "Balloon Keep-Up Challenge",
            description:
              "Keep a balloon in the air for as long as possible without using your hands",
            category: "Physical & Dexterity",
            mechanics: ["Agon", "Ilinx"],
            creatorId: "member1",
            creatorName: "JohnDoe",
            stakeAmount: 50,
            participants: 12,
            views: 1200,
            shares: 24,
            likes: 45,
            status: "active",
            createdAt: "2025-11-15",
            duration: "3 months"
          },

          {
            id: "2",
            title: "Virtual Escape Room",
            description:
              "Solve puzzles to escape the virtual room in the shortest time",
            category: "Mental & Logic",
            mechanics: ["Agon"],
            creatorId: "member2",
            creatorName: "JaneSmith",
            stakeAmount: 100,
            participants: 8,
            views: 800,
            shares: 15,
            likes: 32,
            status: "viral",
            createdAt: "2025-12-01",
            duration: "3 months"
          },

          {
            id: "3",
            title: "Emoji Conversation",
            description: "Convey a message using only emojis",
            category: "Creative & Improvisation",
            mechanics: ["Mimicry"],
            creatorId: "member3",
            creatorName: "CreativeMember",
            stakeAmount: 25,
            participants: 5,
            views: 450,
            shares: 8,
            likes: 19,
            status: "active",
            createdAt: "2025-12-10",
            duration: "3 months"
          }
        ];

        // Mock data for streams
        const mockStreams: Stream[] = [
          {
            id: "s1",
            title: "Gaming Session - Minecraft",
            creatorId: "streamer1",
            creatorName: "GameMaster",
            category: "Games",
            viewerCount: 42,
            duration: 5,
            isLive: true,
            startedAt: "2025-12-26T07:25:00Z"
          },
          {
            id: "s2",
            title: "Live Picnic with Friends",
            creatorId: "member5",
            creatorName: "SocialButterfly",
            category: "Picnics",
            viewerCount: 18,
            duration: 3,
            isLive: true,
            startedAt: "2025-12-26T07:20:00Z"
          }
        ];

        setChallenges(mockChallenges);
        setStreams(mockStreams);
        setLoading(false);
      } catch (error) {
        console.error("Error in fetchData:", error);
        showToast("Failed to load data", "error");
        setLoading(false);
      }
    }; // Close fetchData function

    fetchData();
  }, []);

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChallenge.title || !newChallenge.description) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    // In a real app, this would be an API call
    const challenge: Challenge = {
      id: `new-${Date.now()}`,
      title: newChallenge.title,
      description: newChallenge.description,
      category: newChallenge.category,
      mechanics: ["Agon"],
      creatorId: "current-member",
      creatorName: "CurrentMember",
      stakeAmount: newChallenge.stakeAmount,
      participants: 0,
      views: 0,
      shares: 0,
      likes: 0,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      duration: "3 months"
    };

    setChallenges([challenge, ...challenges]);
    setNewChallenge({
      title: "",
      description: "",
      category: "Physical & Dexterity",
      stakeAmount: 0
    });
    showToast("Challenge created successfully!", "success");
  };

  const handleStakeChallenge = (challengeId: string) => {
    // In a real app, this would be an API call
    showToast("Successfully staked on challenge!", "success");
  };

  const categories = [
    "Physical & Dexterity",
    "Mental & Logic",
    "Creative & Improvisation",
    "Social & Communication",
    "Virtual & Digital"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      challenge.status === "viral"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
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
                      Stake:{" "}
                      <span className="font-semibold">
                        {challenge.stakeAmount} Gifts
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Participants:{" "}
                      <span className="font-semibold">
                        {challenge.participants}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-600">
                      Views:{" "}
                      <span className="font-semibold">{challenge.views}</span>
                    </p>
                    <p className="text-gray-600">
                      Likes:{" "}
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
            .filter((c) => c.status === "viral")
            .map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-red-200"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{challenge.title}</h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
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
                        Stake:{" "}
                        <span className="font-semibold">
                          {challenge.stakeAmount} Gifts
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Participants:{" "}
                        <span className="font-semibold">
                          {challenge.participants}
                        </span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-gray-600">
                        Ends in:{" "}
                        <span className="font-semibold">
                          {challenge.duration}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Likes:{" "}
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
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 flex items-center">
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
                      Viewers:{" "}
                      <span className="font-semibold">
                        {stream.viewerCount}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Duration:{" "}
                      <span className="font-semibold">
                        {stream.duration} min
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-600">
                      Started:{" "}
                      <span className="font-semibold">
                        {new Date(stream.startedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
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
            { id: "challenges", name: "General Challenges" },
            { id: "games", name: "Games" },
            { id: "viral", name: "Viral Challenges" },
            { id: "streamed", name: "Streamed Content" },
            { id: "creator", name: "Creator Games" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
          {activeTab === "challenges" && renderChallengesSection()}
          {activeTab === "games" && renderGamesSection()}
          {activeTab === "viral" && renderViralSection()}
          {activeTab === "streamed" && renderStreamedSection()}
          {activeTab === "creator" && renderCreatorSection()}
        </div>
      )}
    </div>
  );
};
export default PermanencePage;
