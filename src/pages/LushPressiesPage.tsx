import React from 'react';
import { useRef } from 'react';
import { 
  MemberIcon, 
  HeartIcon, 
  GiftIcon, 
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  CogIcon,
  MagnifyingGlassIcon
} from '../icons';

interface MemberProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  interests: string[];
  isVerified: boolean;
  compatibilityScore?: number;
}

interface Gift {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
} // Added missing closing brace for interface

interface Conversation {
  id: string;
  memberId: string;
  membername: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
} // Added missing closing brace for interface

const LushPressiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'discover' | 'gifts' | 'messages' | 'analytics' | 'settings'>('discover');
  const [profiles, setProfiles] = React.useState<MemberProfile[]>([]);
  const [gifts, setGifts] = React.useState<Gift[]>([]);
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [loading, setLoading] = React.useState(true);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      // Mock profiles data
      const mockProfiles: MemberProfile[] = [
        {
          id: '1',
          name: 'Alex Johnson',
          age: 28,
          location: 'New York, NY',
          interests: ['Music', 'Travel', 'Photography'],
          isVerified: true,
          compatibilityScore: 92
        },
        {
          id: '2',
          name: 'Taylor Swift',
          age: 33,
          location: 'Los Angeles, CA',
          interests: ['Music', 'Cooking', 'Hiking'],
          isVerified: true,
          compatibilityScore: 87
        },
        {
          id: '3',
          name: 'Jordan Smith',
          age: 31,
          location: 'Chicago, IL',
          interests: ['Art', 'Movies', 'Dancing'],
          isVerified: false,
          compatibilityScore: 78
        }
      ]; // Added missing semicolon

      // Mock gifts data
      const mockGifts: Gift[] = [
        {
          id: '1',
          name: 'Red Roses',
          price: 15,
          imageUrl: 'https://example.com/rose.jpg',
          category: 'Romance'
        },
        {
          id: '2',
          name: 'Chocolate Box',
          price: 25,
          imageUrl: 'https://example.com/chocolate.jpg',
          category: 'Sweet'
        },
        {
          id: '3',
          name: 'Jewelry Set',
          price: 100,
          imageUrl: 'https://example.com/jewelry.jpg',
          category: 'Luxury'
        }
      ]; // Added missing semicolon

      // Mock conversations data
      const mockConversations: Conversation[] = [
        {
          id: '1',
          memberId: '1',
          membername: 'Alex Johnson',
          lastMessage: 'Thanks for the lovely gift! Would you like to go out sometime?',
          timestamp: '2 hours ago',
          unread: true
        },
        {
          id: '2',
          memberId: '2',
          membername: 'Taylor Swift',
          lastMessage: 'Hey there! I saw your profile and thought we might have some things in common.',
          timestamp: '1 day ago',
          unread: false
        }
      ]; // Added missing semicolon

      setProfiles(mockProfiles);
      setGifts(mockGifts);
      setConversations(mockConversations);
      setLoading(false);
    }, 1000);
  
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const renderDiscoverTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Discover Matches</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search matches..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <MemberIcon className="h-16 w-16 text-gray-400" />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{profile.name}, {profile.age}</h3>
                    <p className="text-sm text-gray-500">{profile.location}</p>
                  </div>
                  {profile.isVerified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                </div>
                
                <div className="mt-2 flex flex-wrap gap-1">
                  {profile.interests.slice(0, 3).map((interest, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {interest}
                    </span>
                  ))}
                </div>
                
                {profile.compatibilityScore && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm">
                      <span>Compatibility</span>
                      <span className="font-medium">{profile.compatibilityScore}%</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-brand-blue h-2 rounded-full" 
                        style={{ width: `${profile.compatibilityScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-brand-blue text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700">
                    Send Gift
                  </button>
                  <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <HeartIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGiftsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Virtual Gift Shop</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gifts.map((gift) => (
            <div key={gift.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gray-200 h-40 flex items-center justify-center">
                <GiftIcon className="h-12 w-12 text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{gift.name}</h3>
                <p className="text-sm text-gray-500">{gift.category}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-lg font-bold text-brand-blue">${gift.price}</span>
                  <button className="text-sm bg-brand-blue text-white py-1 px-3 rounded hover:bg-blue-700">
                    Send
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMessagesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
          <div className="border border-gray-200 rounded-lg">
            <ul className="divide-y divide-gray-200">
              {conversations.map((conversation) => (
                <li key={conversation.id} className="cursor-pointer hover:bg-gray-50">
                  <div className="px-4 py-4 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-gray-200 rounded-full h-12 w-12 flex items-center justify-center">
                        <MemberIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{conversation.membername}</p>
                        <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                        {conversation.unread && (
                          <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-brand-blue text-white text-xs">
                            1
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <MemberIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900">1,248</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <HeartIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Likes Received</p>
              <p className="text-2xl font-bold text-gray-900">342</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Messages Sent</p>
              <p className="text-2xl font-bold text-gray-900">87</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Match Statistics</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <ChartBarIcon className="h-16 w-16 text-gray-400" />
          <span className="ml-4 text-gray-500">Match analytics chart would appear here</span>
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Visibility</label>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md">
              <option>Everyone</option>
              <option>Only Matches</option>
              <option>Only People I Like</option>
              <option>Nobody</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Notification Preferences</label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  id="messages"
                  name="messages"
                  type="checkbox"
                  className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="messages" className="ml-3 block text-sm text-gray-700">
                  Messages
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="matches"
                  name="matches"
                  type="checkbox"
                  className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="matches" className="ml-3 block text-sm text-gray-700">
                  New Matches
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="gifts"
                  name="gifts"
                  type="checkbox"
                  className="h-4 w-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="gifts" className="ml-3 block text-sm text-gray-700">
                  Gift Received
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900">Free</h3>
                <p className="text-sm text-gray-500 mt-1">Basic features</p>
                <button className="mt-3 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm font-medium">
                  Current Plan
                </button>
              </div>
              
              <div className="border border-brand-blue rounded-lg p-4">
                <h3 className="font-medium text-gray-900">Premium</h3>
                <p className="text-sm text-gray-500 mt-1">$9.99/month</p>
                <button className="mt-3 w-full bg-brand-blue text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700">
                  Upgrade
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900">VIP</h3>
                <p className="text-sm text-gray-500 mt-1">$24.99/month</p>
                <button className="mt-3 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm font-medium">
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lush Pressies</h1>
          <p className="mt-2 text-gray-600">Find your perfect match through meaningful gift exchanges</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('discover')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'discover'
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MemberIcon className="h-5 w-5 inline mr-2" />
                Discover
              </button>
              <button
                onClick={() => setActiveTab('gifts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'gifts'
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <GiftIcon className="h-5 w-5 inline mr-2" />
                Gifts
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-2" />
                Messages
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ChartBarIcon className="h-5 w-5 inline mr-2" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-brand-blue text-brand-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CogIcon className="h-5 w-5 inline mr-2" />
                Settings
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'discover' && renderDiscoverTab()}
            {activeTab === 'gifts' && renderGiftsTab()}
            {activeTab === 'messages' && renderMessagesTab()}
            {activeTab === 'analytics' && renderAnalyticsTab()}
            {activeTab === 'settings' && renderSettingsTab()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LushPressiesPage;
