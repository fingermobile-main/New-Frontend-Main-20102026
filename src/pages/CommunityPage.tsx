import React, { useState } from 'react';
import { Users, MessageSquare, Bell, Settings, MoreHorizontal, Heart, Share2, Send, Image, Smile, Calendar, MapPin } from 'lucide-react';

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'events' | 'settings'>('feed');
  
  // Mock data for the community
  const community = {
    name: 'Tech Innovators',
    members: '12.4k',
    description: 'Discussing the latest in tech and innovation. Join us to share ideas, projects, and insights about technology.',
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=60',
    avatar: 'https://i.pravatar.cc/150?img=7',
    isMember: true,
    isModerator: false
  };
  
  // Mock data for posts
  const posts = [
    {
      id: 1,
      user: 'Alex Johnson',
      username: '@alexj',
      content: 'Just released a new open-source project for decentralized identity verification. Would love feedback!',
      likes: 42,
      comments: 8,
      timestamp: '2 hours ago',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 2,
      user: 'Maria Garcia',
      username: '@mariag',
      content: 'Interesting article about the future of blockchain technology. What are your thoughts on this?',
      likes: 28,
      comments: 5,
      timestamp: '5 hours ago',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: 3,
      user: 'Samuel Chen',
      username: '@samc',
      content: 'Our Q3 roadmap for the platform is coming together nicely. Excited to share updates soon!',
      likes: 67,
      comments: 12,
      timestamp: '1 day ago',
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  ];
  
  // Mock data for members
  const members = [
    { id: 1, name: 'Alex Johnson', username: '@alexj', role: 'Admin', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Maria Garcia', username: '@mariag', role: 'Moderator', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Samuel Chen', username: '@samc', role: 'Member', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, name: 'Emma Wilson', username: '@emmaw', role: 'Member', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: 5, name: 'David Kim', username: '@davidk', role: 'Member', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 6, name: 'Sophia Lee', username: '@sophial', role: 'Member', avatar: 'https://i.pravatar.cc/150?img=6' }
  ];
  
  // Mock data for events
  const events = [
    {
      id: 1,
      title: 'Monthly Tech Meetup',
      date: 'Oct 15, 2023',
      time: '6:00 PM',
      location: 'Online',
      attendees: '42',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=60'
    },
    {
      id: 2,
      title: 'Hackathon: Future of Web3',
      date: 'Nov 5-6, 2023',
      time: 'All day',
      location: 'Lagos, Nigeria',
      attendees: '128',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=60'
    }
  ];

  return (
    <div className="flex w-full">
      {/* Left Sidebar - Community Info */}
      <aside className="col-left hidden md:flex flex-col w-1/5 p-4 space-y-6">
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-orange-500 to-purple-600"></div>
          <div className="p-4">
            <div className="flex justify-center -mt-10 mb-3">
              <img 
                src={community.avatar} 
                alt={community.name} 
                className="w-20 h-20 rounded-full border-4 border-gray-800"
              />
            </div>
            <h2 className="text-lg font-bold text-center">{community.name}</h2>
            <p className="text-gray-400 text-sm text-center mb-3">{community.members} members</p>
            <p className="text-gray-300 text-sm text-center mb-4">{community.description}</p>
            <div className="flex justify-center">
              {community.isMember ? (
                <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-semibold">
                  Joined
                </button>
              ) : (
                <button className="px-4 py-2 bg-orange-500 text-gray-900 rounded-lg text-sm font-semibold">
                  Join Community
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </button>
            <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700">
              <Settings className="h-4 w-4 mr-2" />
              Community Settings
            </button>
            <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Report Community
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content - Community Feed */}
      <main className="col-center w-3/5 p-4">
        {/* Community Header */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <div className="flex items-center">
            <img 
              src={community.avatar} 
              alt={community.name} 
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h1 className="text-xl font-bold">{community.name}</h1>
              <p className="text-gray-400">{community.members} members · {community.category}</p>
            </div>
            <div className="ml-auto flex space-x-2">
              {community.isModerator && (
                <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
                  <Settings className="h-5 w-5" />
                </button>
              )}
              <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-gray-800 rounded-xl p-1 mb-4 flex">
          <button 
            className={`flex-1 py-2 px-4 rounded-lg text-center ${
              activeTab === 'feed' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('feed')}
          >
            Feed
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-lg text-center ${
              activeTab === 'members' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('members')}
          >
            Members
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-lg text-center ${
              activeTab === 'events' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'feed' && (
          <div className="space-y-4">
            {/* Post Composer */}
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-start">
                <img 
                  src="https://i.pravatar.cc/150?img=8" 
                  alt="Your avatar" 
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-1">
                  <textarea 
                    placeholder="Share something with the community..."
                    className="w-full bg-gray-700 text-gray-100 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                  ></textarea>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-3 text-gray-400">
                      <button className="p-1 rounded hover:bg-gray-700">
                        <Image className="h-5 w-5" />
                      </button>
                      <button className="p-1 rounded hover:bg-gray-700">
                        <Smile className="h-5 w-5" />
                      </button>
                    </div>
                    <button className="px-4 py-2 bg-orange-500 text-gray-900 rounded-lg text-sm font-semibold">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Posts */}
            {posts.map(post => (
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
                      <span className="text-gray-400 text-sm ml-2">{post.username}</span>
                      <span className="text-gray-500 text-sm ml-2">· {post.timestamp}</span>
                    </div>
                    <p className="text-gray-300 mt-2">{post.content}</p>
                    <div className="flex items-center mt-3 space-x-4 text-gray-400">
                      <button className="flex items-center space-x-1 hover:text-orange-500">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-blue-500">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-green-500">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'members' && (
          <div>
            <h2 className="text-lg font-bold mb-4">Community Members ({members.length})</h2>
            <div className="space-y-3">
              {members.map(member => (
                <div key={member.id} className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-bold">{member.name}</h3>
                        <span className="text-gray-400 text-sm ml-2">{member.username}</span>
                      </div>
                      <p className="text-gray-400 text-sm">{member.role}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 text-sm">
                    Message
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'events' && (
          <div>
            <h2 className="text-lg font-bold mb-4">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map(event => (
                <div key={event.id} className="bg-gray-800 rounded-xl overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold">{event.title}</h3>
                    <div className="flex items-center text-gray-400 text-sm mt-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{event.date} · {event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm mt-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{event.attendees} attending</span>
                      </div>
                      <button className="px-3 py-1 rounded-lg bg-orange-500 text-gray-900 text-sm">
                        RSVP
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Right Sidebar - Community Activity */}
      <aside className="col-right hidden lg:flex flex-col w-1/5 p-4 space-y-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <img 
                src="https://i.pravatar.cc/150?img=9" 
                alt="User" 
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <p className="text-sm"><span className="font-semibold">New member</span> joined</p>
                <p className="text-xs text-gray-400">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <img 
                src="https://i.pravatar.cc/150?img=10" 
                alt="User" 
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <p className="text-sm"><span className="font-semibold">New post</span> shared</p>
                <p className="text-xs text-gray-400">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <img 
                src="https://i.pravatar.cc/150?img=11" 
                alt="User" 
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <p className="text-sm"><span className="font-semibold">Event</span> scheduled</p>
                <p className="text-xs text-gray-400">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Community Rules</h3>
          <ul className="text-xs text-gray-300 space-y-2">
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Be respectful to all community members
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              No spam or promotional content without permission
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Keep discussions relevant to the community topic
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-2">•</span>
              Report inappropriate content to moderators
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default CommunityPage;