import React from 'react';
import { useState } from 'react';
import { useAppContext } from "../contexts/AppContext";
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { logError } from '../utils/errorLogger';
import MainLayout from '../components/layout/MainLayout';
import { useHaptic } from '../contexts/HapticFeedbackContext';
import { useCommunity } from '../contexts/CommunityContext';
import { useCommunityGroups } from '../hooks/useCommunityGroups';
import { PlusIcon, SearchIcon, LockClosedIcon, GlobeAltIcon, UsersIcon, ChatAlt2Icon, CalendarIcon, ClockIcon } from '../icons';
import AnimatedAvatar from '../components/AnimatedAvatar';

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  online: number;
  privacy: 'public' | 'private' | 'secret';
  category: string;
  avatarUrl: string;
  isJoined: boolean;
  lastActivity: string;
  owner: string;
  joinRequests?: number;
}

interface CreateGroupForm {
  name: string;
  description: string;
  category: string;
  privacy: 'public' | 'private' | 'secret';
  isModerated: boolean;
}

const GroupsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'my-groups' | 'discover' | 'requests'>('my-groups');
  const [searchTerm, setSearchTerm] = useState('');
  const [createGroupForm, setCreateGroupForm] = useState<CreateGroupForm>({
    name: '',
    description: '',
    category: 'general',
    privacy: 'public',
    isModerated: true
  });

  const myGroups: Group[] = [
    {
      id: '1',
      name: 'Tech Innovators',
      description: 'Discussing the latest tech trends and innovations',
      members: 124,
      online: 32,
      privacy: 'public',
      category: 'Technology',
      avatarUrl: '/groups/tech.jpg',
      isJoined: true,
      lastActivity: '2 hours ago',
      owner: 'Alex Johnson',
      joinRequests: 3
    },
    {
      id: '2',
      name: 'Art Enthusiasts',
      description: 'Sharing and discussing contemporary art',
      members: 87,
      online: 15,
      privacy: 'private',
      category: 'Arts',
      avatarUrl: '/groups/art.jpg',
      isJoined: true,
      lastActivity: '1 day ago',
      owner: 'Sarah Williams',
      joinRequests: 1
    },
    {
      id: '3',
      name: 'Fitness Motivation',
      description: 'Staying fit and healthy together',
      members: 210,
      online: 45,
      privacy: 'public',
      category: 'Health',
      avatarUrl: '/groups/fitness.jpg',
      isJoined: true,
      lastActivity: '30 minutes ago',
      owner: 'Michael Chen',
      joinRequests: 0
    }
  ];

  const discoverGroups: Group[] = [
    {
      id: '4',
      name: 'Startup Founders',
      description: 'For entrepreneurs building their ventures',
      members: 342,
      online: 67,
      privacy: 'public',
      category: 'Business',
      avatarUrl: '/groups/startups.jpg',
      isJoined: false,
      lastActivity: 'Just now',
      owner: 'David Wilson'
    },
    {
      id: '5',
      name: 'Photography Masters',
      description: 'Capturing life through the lens',
      members: 189,
      online: 28,
      privacy: 'public',
      category: 'Photography',
      avatarUrl: '/groups/photo.jpg',
      isJoined: false,
      lastActivity: '4 hours ago',
      owner: 'Emma Rodriguez'
    },
    {
      id: '6',
      name: 'Book Club',
      description: 'Reading and reviewing the best books',
      members: 76,
      online: 12,
      privacy: 'private',
      category: 'Literature',
      avatarUrl: '/groups/books.jpg',
      isJoined: false,
      lastActivity: '2 days ago',
      owner: 'Olivia Parker'
    }
  ];

  const joinRequests = [
    { id: 'req1', groupId: '1', groupName: 'Tech Innovators', userName: 'John Doe', timestamp: '2 hours ago' },
    { id: 'req2', groupId: '1', groupName: 'Tech Innovators', userName: 'Jane Smith', timestamp: '1 day ago' },
    { id: 'req3', groupId: '2', groupName: 'Art Enthusiasts', userName: 'Robert Lee', timestamp: '3 days ago' }
  ];

  const filteredDiscoverGroups = discoverGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinGroup = (groupId: string) => {
    showToast('Successfully joined the group!', 'success');
    // In a real app, this would update the group state
  };

  const handleCreateGroup = () => {
    // Implement group creation logic
    showToast('Group created successfully!', 'success');
    setCreateGroupForm({
      name: '',
      description: '',
      category: 'general',
      privacy: 'public',
      isModerated: true
    });
  };

  const getPrivacyLabel = (privacy: string) => {
    switch(privacy) {
      case 'public': return 'Public';
      case 'private': return 'Private';
      case 'secret': return 'Secret';
      default: return privacy;
    }
  };

  const getPrivacyColor = (privacy: string) => {
    switch(privacy) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'private': return 'bg-yellow-100 text-yellow-800';
      case 'secret': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <MainLayout pageTitle="Groups">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-5">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg">
                <UsersIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">Groups</h1>
                <p className="text-blue-100">
                  Join communities and connect with like-minded people
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('my-groups')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my-groups'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Groups
              </button>
              <button
                onClick={() => setActiveTab('discover')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'discover'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Discover
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Requests
                {joinRequests.length > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {joinRequests.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {activeTab === 'my-groups' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Your Groups</h2>
                <span className="text-sm text-gray-500">{myGroups.length} groups</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myGroups.map((group) => (
                  <div key={group.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <AnimatedAvatar
                          staticUrl={group.avatarUrl}
                          animatedUrl={group.avatarUrl}
                          altText={group.name}
                          className="w-16 h-16 rounded-lg"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-baseline justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrivacyColor(group.privacy)}`}>
                            {getPrivacyLabel(group.privacy)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{group.description}</p>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <UsersIcon className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="text-gray-500">{group.members} members • {group.online} online</span>
                        </div>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <ClockIcon className="h-3 w-3 mr-1 text-gray-400" />
                          <span>Active {group.lastActivity}</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Owner: {group.owner}
                        </div>
                        
                        {group.joinRequests && group.joinRequests > 0 && (
                          <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {group.joinRequests} join requests
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                        Leave
                      </button>
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                        Visit Group
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'discover' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Discover Groups</h2>
                <span className="text-sm text-gray-500">{filteredDiscoverGroups.length} groups found</span>
              </div>
              
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search groups by name, description, or category..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDiscoverGroups.map((group) => (
                  <div key={group.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <AnimatedAvatar
                          staticUrl={group.avatarUrl}
                          animatedUrl={group.avatarUrl}
                          altText={group.name}
                          className="w-16 h-16 rounded-lg"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-baseline justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrivacyColor(group.privacy)}`}>
                            {getPrivacyLabel(group.privacy)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{group.description}</p>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <UsersIcon className="h-4 w-4 mr-1 text-gray-400" />
                          <span className="text-gray-500">{group.members} members • {group.online} online</span>
                        </div>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <ClockIcon className="h-3 w-3 mr-1 text-gray-400" />
                          <span>Active {group.lastActivity}</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Owner: {group.owner}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => handleJoinGroup(group.id)}
                        className={`w-full px-3 py-1 ${
                          group.isJoined ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                        } text-sm rounded-lg transition-colors`}
                        disabled={group.isJoined}
                      >
                        {group.isJoined ? 'Joined' : 'Join Group'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Join Requests</h2>
              {joinRequests.length > 0 ? (
                <div className="bg-white shadow overflow-hidden rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {joinRequests.map((request) => (
                      <li key={request.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">{request.userName}</div>
                          <div className="text-sm text-gray-500">{request.groupName}</div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="text-sm text-gray-500">{request.timestamp}</div>
                          <div className="flex space-x-3">
                            <button className="text-sm font-medium text-green-600 hover:text-green-900">
                              Approve
                            </button>
                            <button className="text-sm font-medium text-red-600 hover:text-red-900">
                              Decline
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-12">
                  <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No join requests</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are currently no join requests for your groups.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Group</h2>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter group name"
                    value={createGroupForm.name}
                    onChange={(e) => setCreateGroupForm({...createGroupForm, name: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select 
                    value={createGroupForm.category}
                    onChange={(e) => setCreateGroupForm({...createGroupForm, category: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General</option>
                    <option value="technology">Technology</option>
                    <option value="arts">Arts & Creativity</option>
                    <option value="business">Business & Entrepreneurship</option>
                    <option value="health">Health & Wellness</option>
                    <option value="education">Education</option>
                    <option value="sports">Sports & Recreation</option>
                    <option value="entertainment">Entertainment</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your group"
                    value={createGroupForm.description}
                    onChange={(e) => setCreateGroupForm({...createGroupForm, description: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Privacy Setting
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        name="privacy" 
                        className="text-blue-600" 
                        checked={createGroupForm.privacy === 'public'}
                        onChange={() => setCreateGroupForm({...createGroupForm, privacy: 'public'})}
                        defaultChecked 
                      />
                      <span className="ml-2">Public</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        name="privacy" 
                        className="text-blue-600"
                        checked={createGroupForm.privacy === 'private'}
                        onChange={() => setCreateGroupForm({...createGroupForm, privacy: 'private'})}
                      />
                      <span className="ml-2">Private</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        name="privacy" 
                        className="text-blue-600"
                        checked={createGroupForm.privacy === 'secret'}
                        onChange={() => setCreateGroupForm({...createGroupForm, privacy: 'secret'})}
                      />
                      <span className="ml-2">Secret</span>
                    </label>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="moderated"
                      checked={createGroupForm.isModerated}
                      onChange={(e) => setCreateGroupForm({...createGroupForm, isModerated: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor="moderated" className="ml-2 block text-sm text-gray-700">
                      Moderate group (approve join requests)
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button 
                  onClick={handleCreateGroup}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GroupsPage;