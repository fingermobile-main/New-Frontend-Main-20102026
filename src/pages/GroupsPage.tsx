/*
 * FingerMobile Protocol™ - Groups Page Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import MainLayout from '../components/layout/MainLayout';
import { SearchIcon, LockClosedIcon, GlobeAltIcon, UsersIcon, ChatIcon, CalendarIcon, DotsVerticalIcon } from '../components/icons';
import groupsService, { Group } from '../services/groupsService';

interface CreateGroupForm {
  name: string;
  description?: string;
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

  // Infinite scroll state for discover tab
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [discoverItems, setDiscoverItems] = useState<Group[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login state
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [discoverGroups, setDiscoverGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const joinRequests = [
    { id: 'req1', groupId: '1', groupName: 'Tech Innovators', userName: 'John Doe', timestamp: '2 hours ago' },
    { id: 'req2', groupId: '1', groupName: 'Tech Innovators', userName: 'Jane Smith', timestamp: '1 day ago' },
    { id: 'req3', groupId: '2', groupName: 'Art Enthusiasts', userName: 'Robert Lee', timestamp: '3 days ago' }
  ];

  // Check if user is logged in (implement your own logic)
  useEffect(() => {
    const checkLoginStatus = () => {
      // Check if user is logged in by checking localStorage, cookies, or auth tokens
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const user = localStorage.getItem('user') || sessionStorage.getItem('user');
      setIsLoggedIn(!!token || !!user);
    };

    checkLoginStatus();

    // Listen for auth changes
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Simulate loading more groups for infinite scroll
  const loadMoreItems = useCallback(async () => {
    if (isLoggedIn || !hasMore || isLoadingMore) return;

    setIsLoadingMore(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real implementation, this would fetch more groups from the API
    // For now, we'll create some mock groups to simulate more content
    const newItems: Group[] = Array.from({ length: 3 }, (_, i) => ({
      id: `discover-group-${page}-${i}`,
      name: `Additional Group ${page}.${i + 1}`,
      description: `Description for additional group ${page}.${i + 1}`,
      members: Math.floor(Math.random() * 500) + 50,
      online: Math.floor(Math.random() * 100),
      privacy: ['public', 'private', 'secret'][Math.floor(Math.random() * 3)] as 'public' | 'private' | 'secret',
      category: ['Technology', 'Arts', 'Health', 'Business', 'Gaming', 'Travel', 'Food'][Math.floor(Math.random() * 7)],
      avatarUrl: `/groups/group-${page}-${i}.jpg`,
      isJoined: false,
      lastActivity: `${Math.floor(Math.random() * 12) + 1} hours ago`,
      owner: `Owner ${page}.${i + 1}`
    }));

    setDiscoverItems(prev => [...prev, ...newItems]);
    setPage(prev => prev + 1);

    // Stop loading more if we've reached a certain threshold or user has logged in
    if (page >= 10) { // Increased limit
      setHasMore(false);
    }

    setIsLoadingMore(false);
  }, [hasMore, isLoadingMore, isLoggedIn, page]);

  // Handle infinite scroll with Intersection Observer
  useEffect(() => {
    if (isLoggedIn || activeTab !== 'discover') {
      // Stop infinite scroll when user logs in or when not on discover tab
      setHasMore(false);
      return;
    }

    if (sentinelRef.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMoreItems();
          }
        },
        { threshold: 1.0 }
      );

      observer.current.observe(sentinelRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadMoreItems, hasMore, isLoggedIn, activeTab]);

  // Fetch groups from backend
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await groupsService.getAllGroups({ page: 1, limit: 20, search: searchTerm });

        if (response.success) {
          setGroups(response.data);
          setMyGroups(response.data.filter(g => g.isJoined));
          setDiscoverGroups(response.data);
        } else {
          setError(response.message || 'Failed to load groups');
          showToast(response.message || 'Failed to load groups', 'error');
        }
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError('Failed to load groups');
        showToast('Failed to load groups', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [showToast, searchTerm]);

  // Filter discover groups based on search term and include infinite scroll items
  const filteredDiscoverGroups = [...discoverGroups, ...discoverItems]
    .filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      group.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((group, index, self) =>
      index === self.findIndex(g => g.id === group.id) // Remove duplicates
    ); // Combine initial and infinite scroll items

  const handleJoinGroup = async (groupId: string) => {
    try {
      const response = await groupsService.joinGroup(groupId);

      if (response.success) {
        showToast('Successfully joined the group!', 'success');

        // Update the group in the list to reflect the join status
        setDiscoverGroups(prev =>
          prev.map(group =>
            group.id === groupId ? {...group, isJoined: true} : group
          )
        );

        if (activeTab === 'discover') {
          setDiscoverItems(prev =>
            prev.map(group =>
              group.id === groupId ? {...group, isJoined: true} : group
            )
          );
        }
      } else {
        showToast(response.message || 'Failed to join group', 'error');
      }
    } catch (error) {
      console.error('Error joining group:', error);
      showToast('Failed to join group', 'error');
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      const response = await groupsService.leaveGroup(groupId);

      if (response.success) {
        showToast('Successfully left the group!', 'success');

        // Update the group in the list to reflect the leave status
        setDiscoverGroups(prev =>
          prev.map(group =>
            group.id === groupId ? {...group, isJoined: false} : group
          )
        );

        if (activeTab === 'discover') {
          setDiscoverItems(prev =>
            prev.map(group =>
              group.id === groupId ? {...group, isJoined: false} : group
            )
          );
        }
      } else {
        showToast(response.message || 'Failed to leave group', 'error');
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      showToast('Failed to leave group', 'error');
    }
  };

  const handleCreateGroup = async () => {
    if (!createGroupForm.name.trim()) {
      showToast('Group name is required', 'error');
      return;
    }

    try {
      const response = await groupsService.createGroup(createGroupForm);

      if (response.success && response.data) {
        const newGroup = response.data;
        showToast('Group created successfully!', 'success');

        // Update the groups list
        setGroups(prev => [...prev, newGroup]);
        setMyGroups(prev => [...prev, newGroup]);

        setCreateGroupForm({
          name: '',
          description: '',
          category: 'general',
          privacy: 'public',
          isModerated: true
        });
      } else {
        showToast(response.message || 'Failed to create group', 'error');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      showToast('Failed to create group', 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateGroupForm(prev => ({ ...prev, [name]: value }));
  };

  const getPrivacyIcon = (privacy: 'public' | 'private' | 'secret') => {
    switch (privacy) {
    case 'public':
      return <GlobeAltIcon className="w-4 h-4 text-green-500" />;
    case 'private':
      return <LockClosedIcon className="w-4 h-4 text-yellow-500" />;
    case 'secret':
      return <LockClosedIcon className="w-4 h-4 text-red-500" />;
    default:
      return <GlobeAltIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderDiscoverTab = () => (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="space-y-4">
        {filteredDiscoverGroups.map((group) => (
          <div key={group.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-semibold">
                  {group.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{group.name}</h3>
                  <p className="text-sm text-gray-400">{group.description}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <UsersIcon className="w-3 h-3 mr-1" />
                    {group.members} members • {group.online} online
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  {getPrivacyIcon(group.privacy)}
                  <span className="text-xs text-gray-400">{group.category}</span>
                </div>
                {group.isJoined ? (
                  <button
                    onClick={() => handleLeaveGroup(group.id)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                  >
                    Joined
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoinGroup(group.id)}
                    className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors"
                  >
                    Join
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Sentinel element for infinite scroll */}
        <div ref={sentinelRef} style={{ height: '20px' }} />

        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )}

        {!hasMore && filteredDiscoverGroups.length > 0 && (
          <div className="text-center py-4 text-gray-500">
            You've reached the end of the groups list.
          </div>
        )}

        {filteredDiscoverGroups.length === 0 && !isLoadingMore && (
          <div className="text-center py-8 text-gray-500">
            No groups found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );

  const renderMyGroupsTab = () => (
    <div className="space-y-4">
      {myGroups.map((group) => (
        <div key={group.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-semibold">
                {group.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-white">{group.name}</h3>
                <p className="text-sm text-gray-400">{group.description}</p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <UsersIcon className="w-3 h-3 mr-1" />
                  {group.members} members • {group.online} online
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-2">
                {getPrivacyIcon(group.privacy)}
                <span className="text-xs text-gray-400">{group.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-gray-400 hover:text-white">
                  <ChatIcon className="w-5 h-5" />
                </button>
                <button className="p-1 text-gray-400 hover:text-white">
                  <CalendarIcon className="w-5 h-5" />
                </button>
                <button className="p-1 text-gray-400 hover:text-white">
                  <DotsVerticalIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRequestsTab = () => (
    <div className="space-y-4">
      {joinRequests.map((request) => (
        <div key={request.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">{request.userName}</h3>
              <p className="text-sm text-gray-400">Requested to join {request.groupName}</p>
              <p className="text-xs text-gray-500">{request.timestamp}</p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
                Approve
              </button>
              <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors">
                Decline
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <MainLayout pageTitle="Groups">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-2">Groups</h1>
            <p className="text-indigo-100">Connect with people who share your interests</p>
          </div>
        </div>

        <div className="mt-6 bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('my-groups')}
                className={`flex-1 py-4 px-1 text-center font-medium text-sm ${
                  activeTab === 'my-groups'
                    ? 'border-b-2 border-orange-500 text-orange-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                My Groups
              </button>
              <button
                onClick={() => setActiveTab('discover')}
                className={`flex-1 py-4 px-1 text-center font-medium text-sm ${
                  activeTab === 'discover'
                    ? 'border-b-2 border-orange-500 text-orange-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Discover
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex-1 py-4 px-1 text-center font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-b-2 border-orange-500 text-orange-500'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Requests {joinRequests.length > 0 && (
                  <span className="ml-1 bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
                    {joinRequests.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'my-groups' && renderMyGroupsTab()}
            {activeTab === 'discover' && renderDiscoverTab()}
            {activeTab === 'requests' && renderRequestsTab()}
          </div>
        </div>

        <div className="mt-6 bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-white mb-4">Create New Group</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Group Name</label>
              <input
                type="text"
                name="name"
                value={createGroupForm.name}
                onChange={handleInputChange}
                placeholder="Enter group name"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={createGroupForm.description}
                onChange={handleInputChange}
                placeholder="Describe your group"
                rows={3}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={createGroupForm.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="general">General</option>
                  <option value="technology">Technology</option>
                  <option value="arts">Arts</option>
                  <option value="health">Health</option>
                  <option value="business">Business</option>
                  <option value="gaming">Gaming</option>
                  <option value="travel">Travel</option>
                  <option value="food">Food</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Privacy</label>
                <select
                  name="privacy"
                  value={createGroupForm.privacy}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="secret">Secret</option>
                </select>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="moderated"
                name="isModerated"
                checked={createGroupForm.isModerated}
                onChange={(e) => setCreateGroupForm(prev => ({ ...prev, isModerated: e.target.checked }))}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="moderated" className="ml-2 block text-sm text-gray-300">
                Enable moderation
              </label>
            </div>
            <button
              onClick={handleCreateGroup}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02]"
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GroupsPage;
