import React, { useState, useEffect } from 'react';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon, HomeIcon, UserIcon, PaperAirplaneIcon as FiSend } from '@heroicons/react/24/outline';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import { Hash, MessageSquare, Calendar, TrendingUp, Eye } from 'lucide-react';
import { useTrends } from '../hooks/useTrends';
import { usePosts } from '../hooks/usePosts';
import { Post } from '../types';

const TrendsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trending' | 'hashtags' | 'topics' | 'news' | 'following'>('trending'); // Added 'following' to the union type
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { trends, loading: trendsLoading } = useTrends(activeTab);
  const { fetchPosts } = usePosts();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    };

    fetchData();
  }, [fetchPosts]);

  return (
    <div className="flex w-full">
      {/* Left Sidebar - Trending Topics */}
      <aside className="col-left hidden md:flex flex-col w-1/5 p-4 space-y-6">
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="font-bold text-lg mb-3">Trending Now</h2>
          <nav className="space-y-1">
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'trending' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('trending')}
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Trending Posts
            </button>
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'hashtags' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('hashtags')}
            >
              <Hash className="h-5 w-5 mr-2" />
              Hashtags
            </button>
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'topics' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('topics')}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Topics
            </button>
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'news' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('news')}
            >
              <Calendar className="h-5 w-5 mr-2" />
              News
            </button>
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'following' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('following')}
            >
              <UserIcon className="h-5 w-5 mr-2" />
              Following
            </button>
          </nav>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Trending Hashtags</h3>
          <div className="space-y-3">
            {trends.slice(0, 5).map((item, index) => (
              <div key={index} className="hover:bg-gray-700/50 p-2 rounded-lg cursor-pointer">
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">#{index + 1}</span>
                  <span className="font-semibold">{item.tag}</span>
                </div>
                <div className="text-sm text-gray-400 ml-6">{item.posts} posts · {item.change}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content - Trends Feed */}
      <main className="col-center w-3/5 p-4">
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
              Trending Now
            </h1>
            <div className="flex space-x-2">
              <button className={`px-3 py-1 rounded-lg text-sm ${
                activeTab === 'trending' ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-700 text-gray-300'
              }`}>
                For You
              </button>
              <button className={`px-3 py-1 rounded-lg text-sm ${
                activeTab === 'following' ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-700 text-gray-300'
              }`}>
                Following
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'trending' && (
          <div className="space-y-4">
            {trends.map(post => (
              <div key={post.id} className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center text-gray-400 text-sm mb-2">
                  <TrendingUp className="h-4 w-4 text-orange-500 mr-1" />
                  Trending · {post.engagement} engagements · {post.change}
                </div>
                
                <div className="flex items-start">
                  <img 
                    src={post.avatar} 
                    alt={post.user} 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-bold">{post.user}</h3>
                      <span className="text-gray-400 text-sm ml-2">{post.username}</span>
                      <span className="text-gray-500 text-sm ml-2">· {post.time}</span>
                    </div>
                    <p className="text-gray-300 mt-1">{post.content}</p>
                    <div className="flex items-center mt-3 space-x-4 text-gray-400">
                      <button className="flex items-center space-x-1 hover:text-orange-500">
                        <HeartIcon className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-blue-500">
                        <ChatBubbleLeftIcon className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-green-500">
                        <ShareIcon className="h-4 w-4" />
                        <span>{post.shares}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-purple-500">
                        <Eye className="h-4 w-4" />
                        <span>{Math.floor((post.likes || 0) * 2.5)}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'hashtags' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Trending Hashtags</h2>
            <div className="space-y-3">
              {trends.map((hashtag, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700/50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-2">#{index + 1}</span>
                        <span className="font-bold text-lg">{hashtag.tag}</span>
                      </div>
                      <div className="text-gray-400 text-sm mt-1">{hashtag.posts} posts</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-500 text-sm font-semibold">{hashtag.change}</div>
                      <div className="text-gray-400 text-xs">today</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'topics' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Trending Topics</h2>
            <div className="space-y-3">
              {trends.map((topic, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700/50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-lg">{topic.topic}</div>
                      <div className="text-gray-400 text-sm mt-1">{topic.posts} posts</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-500 text-sm font-semibold">{topic.change}</div>
                      <div className="text-gray-400 text-xs">today</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Right Sidebar - Trending Details */}
      <aside className="col-right hidden lg:flex flex-col w-1/5 p-4 space-y-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Trending in Technology</h3>
          <div className="space-y-3">
            <div className="hover:bg-gray-700/50 p-2 rounded-lg cursor-pointer">
              <div className="font-semibold">#Web3</div>
              <div className="text-gray-400 text-sm">124.2k posts</div>
            </div>
            <div className="hover:bg-gray-700/50 p-2 rounded-lg cursor-pointer">
              <div className="font-semibold">#AI</div>
              <div className="text-gray-400 text-sm">89.7k posts</div>
            </div>
            <div className="hover:bg-gray-700/50 p-2 rounded-lg cursor-pointer">
              <div className="font-semibold">#Blockchain</div>
              <div className="text-gray-400 text-sm">76.3k posts</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Trending in Nigeria</h3>
          <div className="space-y-3">
            <div className="hover:bg-gray-700/50 p-2 rounded-lg cursor-pointer">
              <div className="font-semibold">#NigeriaTech</div>
              <div className="text-gray-400 text-sm">28.3k posts</div>
            </div>
            <div className="hover:bg-gray-700/50 p-2 rounded-lg cursor-pointer">
              <div className="font-semibold">#LagosInnovation</div>
              <div className="text-gray-400 text-sm">15.7k posts</div>
            </div>
            <div className="hover:bg-gray-700/50 p-2 rounded-lg cursor-pointer">
              <div className="font-semibold">#NaijaStartups</div>
              <div className="text-gray-400 text-sm">12.4k posts</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Who to Follow</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src="https://i.pravatar.cc/150?img=5" 
                  alt="User" 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <p className="text-sm font-semibold">TechGuru</p>
                  <p className="text-xs text-gray-400">@techguru</p>
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
                  <p className="text-sm font-semibold">FutureThinker</p>
                  <p className="text-xs text-gray-400">@futurethinker</p>
                </div>
              </div>
              <button className="text-xs bg-orange-500 text-gray-900 px-2 py-1 rounded">
                Follow
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src="https://i.pravatar.cc/150?img=7" 
                  alt="User" 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <p className="text-sm font-semibold">InnovationHub</p>
                  <p className="text-xs text-gray-400">@innovationhub</p>
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

export default TrendsPage;