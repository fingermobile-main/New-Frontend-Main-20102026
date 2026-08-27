import React, { useState } from 'react';
import { Search, TrendingUp, Users, Globe, Heart, MessageCircle, Share2 } from 'lucide-react';

const DiscoveryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trending' | 'nearby' | 'communities' | 'people'>('trending');
  
  // Mock data for trending posts
  const trendingPosts = [
    {
      id: 1,
      user: 'TechGuru',
      username: '@techguru',
      content: 'Just launched my new startup! Building the future of decentralized social networks.',
      likes: 245,
      comments: 32,
      shares: 12,
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 2,
      user: 'DesignMaster',
      username: '@designmaster',
      content: 'Exploring new UI patterns for mobile-first experiences. What do you think?',
      likes: 189,
      comments: 24,
      shares: 8,
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: 3,
      user: 'StartupFounder',
      username: '@startupfounder',
      content: 'Lessons learned from failing twice before finding product-market fit.',
      likes: 312,
      comments: 45,
      shares: 21,
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  ];
  
  // Mock data for communities
  const communities = [
    {
      id: 1,
      name: 'Tech Innovators',
      members: '12.4k',
      description: 'Discussing the latest in tech and innovation',
      joined: true
    },
    {
      id: 2,
      name: 'Design Thinkers',
      members: '8.7k',
      description: 'UI/UX discussions and inspiration',
      joined: false
    },
    {
      id: 3,
      name: 'Startup Founders',
      members: '5.2k',
      description: 'Sharing experiences and advice',
      joined: false
    }
  ];
  
  // Mock data for people
  const people = [
    {
      id: 1,
      name: 'Alex Johnson',
      username: '@alexj',
      bio: 'Product designer at TechCorp',
      followers: '2.4k',
      verified: true
    },
    {
      id: 2,
      name: 'Maria Garcia',
      username: '@mariag',
      bio: 'Frontend developer and open source contributor',
      followers: '1.8k',
      verified: false
    },
    {
      id: 3,
      name: 'Samuel Chen',
      username: '@samc',
      bio: 'Startup founder and investor',
      followers: '3.1k',
      verified: true
    }
  ];

  return (
    <div className="flex w-full">
      {/* Left Sidebar - Filters and Navigation */}
      <aside className="col-left hidden md:flex flex-col w-1/5 p-4 space-y-6">
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="font-bold text-lg mb-3">Discovery</h2>
          <nav className="space-y-1">
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'trending' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('trending')}
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Trending
            </button>
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'nearby' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('nearby')}
            >
              <Globe className="h-5 w-5 mr-2" />
              Nearby
            </button>
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'communities' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('communities')}
            >
              <Users className="h-5 w-5 mr-2" />
              Communities
            </button>
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'people' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('people')}
            >
              <Users className="h-5 w-5 mr-2" />
              People
            </button>
          </nav>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-2">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-gray-700 rounded text-xs">#technology</span>
            <span className="px-2 py-1 bg-gray-700 rounded text-xs">#startup</span>
            <span className="px-2 py-1 bg-gray-700 rounded text-xs">#design</span>
            <span className="px-2 py-1 bg-gray-700 rounded text-xs">#innovation</span>
          </div>
        </div>
      </aside>

      {/* Main Content - Discovery Feed */}
      <main className="col-center w-3/5 p-4">
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search people, topics, communities..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 text-sm outline-none focus:border-orange-500"
            />
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === 'trending' && (
            <>
              <h2 className="text-xl font-bold flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                Trending Now
              </h2>
              {trendingPosts.map(post => (
                <div key={post.id} className="bg-gray-800 rounded-xl p-4">
                  <div className="flex items-start">
                    <img 
                      src={post.avatar} 
                      alt={post.user} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-bold">{post.user}</h3>
                        {post.username && (
                          <span className="text-gray-400 text-sm ml-2">{post.username}</span>
                        )}
                      </div>
                      <p className="text-gray-300 mt-2">{post.content}</p>
                      <div className="flex items-center mt-3 space-x-4 text-gray-400">
                        <button className="flex items-center space-x-1 hover:text-orange-500">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-500">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-green-500">
                          <Share2 className="h-4 w-4" />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          
          {activeTab === 'communities' && (
            <>
              <h2 className="text-xl font-bold flex items-center">
                <Users className="h-5 w-5 mr-2 text-orange-500" />
                Popular Communities
              </h2>
              {communities.map(community => (
                <div key={community.id} className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{community.name}</h3>
                    <p className="text-gray-400 text-sm">{community.members} members</p>
                    <p className="text-gray-300 text-sm mt-1">{community.description}</p>
                  </div>
                  <button 
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      community.joined 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-orange-500 text-gray-900'
                    }`}
                  >
                    {community.joined ? 'Joined' : 'Join'}
                  </button>
                </div>
              ))}
            </>
          )}
          
          {activeTab === 'people' && (
            <>
              <h2 className="text-xl font-bold flex items-center">
                <Users className="h-5 w-5 mr-2 text-orange-500" />
                Suggested People
              </h2>
              {people.map(person => (
                <div key={person.id} className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={`https://i.pravatar.cc/150?img=${person.id}`} 
                      alt={person.name} 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-bold">{person.name}</h3>
                        {person.verified && (
                          <span className="ml-2 text-blue-500">✓</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{person.username}</p>
                      <p className="text-gray-300 text-sm">{person.bio}</p>
                      <p className="text-gray-400 text-xs mt-1">{person.followers} followers</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-orange-500 text-gray-900 text-sm font-semibold">
                    Follow
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </main>

      {/* Right Sidebar - Suggestions */}
      <aside className="col-right hidden lg:flex flex-col w-1/5 p-4 space-y-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Trending Topics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-orange-500">#Web3</span>
              <span className="text-gray-400 text-xs">2.4k posts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-orange-500">#AI</span>
              <span className="text-gray-400 text-xs">1.8k posts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-orange-500">#Blockchain</span>
              <span className="text-gray-400 text-xs">1.2k posts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-orange-500">#Design</span>
              <span className="text-gray-400 text-xs">987 posts</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Who to Follow</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src="https://i.pravatar.cc/150?img=4" 
                  alt="User" 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <p className="text-sm font-semibold">Jane Cooper</p>
                  <p className="text-xs text-gray-400">@janec</p>
                </div>
              </div>
              <button className="text-xs bg-orange-500 text-gray-900 px-2 py-1 rounded">
                Follow
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src="https://i.pravatar.cc/150?img=5" 
                  alt="User" 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <p className="text-sm font-semibold">John Doe</p>
                  <p className="text-xs text-gray-400">@johnd</p>
                </div>
              </div>
              <button className="text-xs bg-orange-500 text-gray-900 px-2 py-1 rounded">
                Follow
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src="https://i.pravatar.cc/150?img=6" 
                  alt="User" 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <p className="text-sm font-semibold">Sarah Smith</p>
                  <p className="text-xs text-gray-400">@sarahs</p>
                </div>
              </div>
              <button className="text-xs bg-orange-500 text-gray-900 px-2 py-1 rounded">
                Follow
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default DiscoveryPage;