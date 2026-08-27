import React, { useState } from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';

const VideosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
  
  // Mock data for videos
  const videos = [
    {
      id: 1,
      title: "FingerWars grand finals highlights 🏆",
      creator: "@tundewho",
      views: "1.2M",
      duration: "12:42",
      thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=60",
      creatorAvatar: "https://i.pravatar.cc/40?img=15"
    },
    {
      id: 2,
      title: "5 storefront tips to triple sales",
      creator: "@amara",
      views: "880k",
      duration: "8:10",
      thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=60",
      creatorAvatar: "https://i.pravatar.cc/40?img=32"
    },
    {
      id: 3,
      title: "Unboxing the FingerLux collection",
      creator: "@cnw",
      views: "640k",
      duration: "5:33",
      thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&q=60",
      creatorAvatar: "https://i.pravatar.cc/40?img=5"
    },
    {
      id: 4,
      title: "Building the future of decentralized social networks",
      creator: "@techguru",
      views: "420k",
      duration: "18:22",
      thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=60",
      creatorAvatar: "https://i.pravatar.cc/40?img=7"
    },
    {
      id: 5,
      title: "How to monetize your content effectively",
      creator: "@creatorpro",
      views: "310k",
      duration: "14:05",
      thumbnail: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=500&q=60",
      creatorAvatar: "https://i.pravatar.cc/40?img=9"
    },
    {
      id: 6,
      title: "Behind the scenes: FingerMobile launch",
      creator: "@teamfinger",
      views: "1.8M",
      duration: "9:47",
      thumbnail: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=500&q=60",
      creatorAvatar: "https://i.pravatar.cc/40?img=12"
    }
  ];

  return (
    <div className="flex w-full">
      {/* Left Sidebar - Filters and Navigation */}
      <aside className="col-left hidden md:flex flex-col w-1/5 p-4 space-y-6">
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="font-bold text-lg mb-3">Videos</h2>
          <nav className="space-y-1">
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'foryou' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('foryou')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              For You
            </button>
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'following' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('following')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              </svg>
              Following
            </button>
          </nav>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-2">Categories</h3>
          <div className="space-y-2">
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Technology</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Gaming</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Music</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Education</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Lifestyle</button>
          </div>
        </div>
      </aside>

      {/* Main Content - Videos Feed */}
      <main className="col-center w-3/5 p-4">
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Videos</h1>
            <div className="flex gap-2">
              <button 
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  activeTab === 'foryou' 
                    ? 'bg-gray-700 text-gray-100' 
                    : 'bg-gray-700 text-gray-400'
                }`}
                onClick={() => setActiveTab('foryou')}
              >
                For you
              </button>
              <button 
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  activeTab === 'following' 
                    ? 'bg-gray-700 text-gray-100' 
                    : 'bg-gray-700 text-gray-400'
                }`}
                onClick={() => setActiveTab('following')}
              >
                Following
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(video => (
            <div key={video.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
              <div className="relative h-44">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover"
                />
                <span className="text-[9px] absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-white">
                  {video.duration}
                </span>
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-orange-500 text-gray-900 text-[9px] font-bold">
                  <PlayIcon className="h-3 w-3 inline mr-1" />
                  Play
                </span>
              </div>
              <div className="p-3">
                <div className="flex gap-2">
                  <img 
                    src={video.creatorAvatar} 
                    alt={video.creator} 
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-[12.5px] font-semibold line-clamp-2">{video.title}</p>
                    <p className="text-[9px] text-gray-400">{video.creator} · {video.views} views</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar - Video Suggestions */}
      <aside className="col-right hidden lg:flex flex-col w-1/5 p-4 space-y-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Recommended Channels</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <img 
                src="https://i.pravatar.cc/40?img=15" 
                alt="Channel" 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="text-sm font-semibold">TechGuru</p>
                <p className="text-xs text-gray-400">1.2M subscribers</p>
              </div>
              <button className="ml-auto text-xs bg-orange-500 text-gray-900 px-2 py-1 rounded">
                Subscribe
              </button>
            </div>
            <div className="flex items-center">
              <img 
                src="https://i.pravatar.cc/40?img=32" 
                alt="Channel" 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="text-sm font-semibold">GameOn</p>
                <p className="text-xs text-gray-400">850K subscribers</p>
              </div>
              <button className="ml-auto text-xs bg-orange-500 text-gray-900 px-2 py-1 rounded">
                Subscribe
              </button>
            </div>
            <div className="flex items-center">
              <img 
                src="https://i.pravatar.cc/40?img=5" 
                alt="Channel" 
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="text-sm font-semibold">CreatorPro</p>
                <p className="text-xs text-gray-400">620K subscribers</p>
              </div>
              <button className="ml-auto text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                Subscribed
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Trending Videos</h3>
          <div className="space-y-3">
            <div className="flex">
              <img 
                src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&q=60" 
                alt="Trending video" 
                className="w-16 h-16 rounded object-cover mr-2"
              />
              <div>
                <p className="text-xs font-semibold line-clamp-2">FingerWars championship finals</p>
                <p className="text-xs text-gray-400">1.8M views</p>
              </div>
            </div>
            <div className="flex">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=60" 
                alt="Trending video" 
                className="w-16 h-16 rounded object-cover mr-2"
              />
              <div>
                <p className="text-xs font-semibold line-clamp-2">New marketplace features</p>
                <p className="text-xs text-gray-400">980K views</p>
              </div>
            </div>
            <div className="flex">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&q=60" 
                alt="Trending video" 
                className="w-16 h-16 rounded object-cover mr-2"
              />
              <div>
                <p className="text-xs font-semibold line-clamp-2">FingerLux unboxing</p>
                <p className="text-xs text-gray-400">750K views</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default VideosPage;