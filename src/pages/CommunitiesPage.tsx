import React, { useState } from 'react';
import { Users, Plus, Search, Star, MessageSquare, Calendar, MapPin } from 'lucide-react';

const CommunitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'featured'>('all');
  
  // Mock data for communities
  const communities = [
    {
      id: 1,
      name: 'Tech Innovators',
      members: '12.4k',
      description: 'Discussing the latest in tech and innovation',
      category: 'Technology',
      joined: true,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=60'
    },
    {
      id: 2,
      name: 'Design Thinkers',
      members: '8.7k',
      description: 'UI/UX discussions and inspiration',
      category: 'Design',
      joined: false,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=60'
    },
    {
      id: 3,
      name: 'Startup Founders',
      members: '5.2k',
      description: 'Sharing experiences and advice',
      category: 'Entrepreneurship',
      joined: false,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=60'
    },
    {
      id: 4,
      name: 'Digital Artists',
      members: '3.1k',
      description: 'Showcasing digital art and creative processes',
      category: 'Arts',
      joined: true,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=60'
    },
    {
      id: 5,
      name: 'Open Source Enthusiasts',
      members: '7.9k',
      description: 'Collaborating on open source projects',
      category: 'Technology',
      joined: false,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=800&q=60'
    },
    {
      id: 6,
      name: 'Remote Workers',
      members: '9.3k',
      description: 'Tips and experiences for remote work',
      category: 'Lifestyle',
      joined: true,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=60'
    }
  ];
  
  const myCommunities = communities.filter(comm => comm.joined);
  const featuredCommunities = communities.filter(comm => comm.featured);

  return (
    <div className="flex w-full">
      {/* Left Sidebar - Filters and Navigation */}
      <aside className="col-left hidden md:flex flex-col w-1/5 p-4 space-y-6">
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="font-bold text-lg mb-3">Communities</h2>
          <nav className="space-y-1">
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'all' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('all')}
            >
              <Users className="h-5 w-5 mr-2" />
              All Communities
            </button>
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'my' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('my')}
            >
              <Star className="h-5 w-5 mr-2" />
              My Communities
            </button>
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'featured' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('featured')}
            >
              <Star className="h-5 w-5 mr-2" />
              Featured
            </button>
          </nav>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-2">Categories</h3>
          <div className="space-y-2">
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Technology</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Design</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Arts</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Education</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Health</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Sports</button>
          </div>
        </div>
      </aside>

      {/* Main Content - Communities Feed */}
      <main className="col-center w-3/5 p-4">
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search communities..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 text-sm outline-none focus:border-orange-500"
              />
            </div>
            <button className="ml-4 flex items-center bg-orange-500 text-gray-900 px-4 py-2.5 rounded-lg text-sm font-semibold">
              <Plus className="h-4 w-4 mr-1" />
              Create
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            {activeTab === 'all' && 'All Communities'}
            {activeTab === 'my' && 'My Communities'}
            {activeTab === 'featured' && 'Featured Communities'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeTab === 'all' ? communities : 
              activeTab === 'my' ? myCommunities : 
              featuredCommunities).map(community => (
              <div key={community.id} className="bg-gray-800 rounded-xl overflow-hidden">
                <div className="relative">
                  <img 
                    src={community.coverImage} 
                    alt={community.name} 
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute bottom-3 right-3 bg-gray-900/80 text-white px-2 py-1 rounded-lg text-xs flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {community.members}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{community.name}</h3>
                      <p className="text-gray-400 text-sm">{community.category}</p>
                    </div>
                    <button className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      community.joined 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-orange-500 text-gray-900'
                    }`}>
                      {community.joined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                  <p className="text-gray-300 mt-2 text-sm">{community.description}</p>
                  <div className="flex items-center mt-3 text-gray-400 text-xs">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>24 active posts today</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Right Sidebar - Suggestions */}
      <aside className="col-right hidden lg:flex flex-col w-1/5 p-4 space-y-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Upcoming Events</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="bg-gray-700 p-2 rounded-lg mr-3">
                <Calendar className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">Tech Meetup</p>
                <p className="text-xs text-gray-400">Tomorrow at 6 PM</p>
                <p className="text-xs text-gray-400 flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-gray-700 p-2 rounded-lg mr-3">
                <Calendar className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">Design Workshop</p>
                <p className="text-xs text-gray-400">Oct 15, 2 PM</p>
                <p className="text-xs text-gray-400 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  Lagos
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Community Tips</h3>
          <ul className="text-xs text-gray-300 space-y-2">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Be respectful to all community members
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Share valuable insights and resources
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Report inappropriate content when needed
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default CommunitiesPage;