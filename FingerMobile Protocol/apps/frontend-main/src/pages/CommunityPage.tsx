import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Flag,
  Eye,
  EyeOff,
  Lock,
  Globe,
  Settings,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  UserPlus,
  TrendingUp,
  Activity,
  BarChart3,
  Ban,
  Shield,
  MessageCircle,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  PinIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

interface CommunityGroup {
  id: number;
  name: string;
  description: string;
  creatorId: number;
  creatorName: string;
  memberCount: number;
  postCount: number;
  privacy: 'public' | 'private' | 'restricted';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

interface ForumThread {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  groupId: number;
  groupName: string;
  replyCount: number;
  viewCount: number;
  isPinned: boolean;
  isLocked: boolean;
  lastReplyAt: string;
  createdAt: string;
  updatedAt: string;
}

interface CommunityInteraction {
  id: number;
  userId: number;
  userName: string;
  type: 'post' | 'comment' | 'reaction' | 'share';
  content: string;
  targetId: number;
  targetType: 'group' | 'thread' | 'post';
  timestamp: string;
  status: 'active' | 'deleted';
}

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'groups' | 'threads' | 'interactions' | 'moderation' | 'analytics'>('groups');
  const [communityGroups, setCommunityGroups] = useState<CommunityGroup[]>([]);
  const [forumThreads, setForumThreads] = useState<ForumThread[]>([]);
  const [interactions, setInteractions] = useState<CommunityInteraction[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<CommunityGroup[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<ForumThread[]>([]);
  const [filteredInteractions, setFilteredInteractions] = useState<CommunityInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrivacy, setFilterPrivacy] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [communityStats, setCommunityStats] = useState<any>(null);
  const [moderationData, setModerationData] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    privacy: 'public' as 'public' | 'private' | 'restricted'
  });

  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const history = { push: (path: string) => navigate(path), replace: (path: string) => navigate(path, { replace: true }) };

  // Simulate loading community data
  useEffect(() => {
    const fetchCommunityData = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        const mockGroups: CommunityGroup[] = [
          {
            id: 1,
            name: 'Developer Community',
            description: 'A place for developers to share ideas and solutions',
            creatorId: 1,
            creatorName: 'John Doe',
            memberCount: 1250,
            postCount: 3420,
            privacy: 'public',
            status: 'active',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-10-09T10:30:00Z'
          },
          {
            id: 2,
            name: 'Design Enthusiasts',
            description: 'Discuss design trends and techniques',
            creatorId: 2,
            creatorName: 'Jane Smith',
            memberCount: 890,
            postCount: 2100,
            privacy: 'public',
            status: 'active',
            createdAt: '2024-02-20T14:20:00Z',
            updatedAt: '2024-10-08T15:45:00Z'
          },
          {
            id: 3,
            name: 'Project Collaboration',
            description: 'Find collaborators for your projects',
            creatorId: 3,
            creatorName: 'Bob Johnson',
            memberCount: 420,
            postCount: 980,
            privacy: 'private',
            status: 'active',
            createdAt: '2024-03-10T09:15:00Z',
            updatedAt: '2024-10-07T11:30:00Z'
          },
          {
            id: 4,
            name: 'Photography Club',
            description: 'Share your photography tips and work',
            creatorId: 4,
            creatorName: 'Alice Williams',
            memberCount: 650,
            postCount: 1800,
            privacy: 'public',
            status: 'suspended',
            createdAt: '2024-04-05T16:45:00Z',
            updatedAt: '2024-10-06T12:20:00Z'
          }
        ];

        const mockThreads: ForumThread[] = [
          {
            id: 1,
            title: 'Best practices for React development',
            content: 'What are your favorite React patterns?',
            authorId: 1,
            authorName: 'John Doe',
            groupId: 1,
            groupName: 'Developer Community',
            replyCount: 24,
            viewCount: 1250,
            isPinned: true,
            isLocked: false,
            lastReplyAt: '2024-10-09T10:30:00Z',
            createdAt: '2024-10-01T08:15:00Z',
            updatedAt: '2024-10-09T10:30:00Z'
          },
          {
            id: 2,
            title: 'UI/UX design trends for 2024',
            content: 'Share your thoughts on the latest trends',
            authorId: 2,
            authorName: 'Jane Smith',
            groupId: 2,
            groupName: 'Design Enthusiasts',
            replyCount: 18,
            viewCount: 890,
            isPinned: false,
            isLocked: false,
            lastReplyAt: '2024-10-09T09:45:00Z',
            createdAt: '2024-10-05T14:20:00Z',
            updatedAt: '2024-10-09T09:45:00Z'
          },
          {
            id: 3,
            title: 'Looking for a Vue.js developer',
            content: 'Need help with a Vue project',
            authorId: 3,
            authorName: 'Bob Johnson',
            groupId: 3,
            groupName: 'Project Collaboration',
            replyCount: 7,
            viewCount: 210,
            isPinned: false,
            isLocked: false,
            lastReplyAt: '2024-10-08T16:30:00Z',
            createdAt: '2024-10-07T11:45:00Z',
            updatedAt: '2024-10-08T16:30:00Z'
          }
        ];

        const mockInteractions: CommunityInteraction[] = [
          {
            id: 1,
            userId: 1,
            userName: 'John Doe',
            type: 'post',
            content: 'Just launched my new project!',
            targetId: 1,
            targetType: 'thread',
            timestamp: '2024-10-09T10:30:00Z',
            status: 'active'
          },
          {
            id: 2,
            userId: 2,
            userName: 'Jane Smith',
            type: 'comment',
            content: 'Great idea, thanks for sharing!',
            targetId: 1,
            targetType: 'thread',
            timestamp: '2024-10-09T09:45:00Z',
            status: 'active'
          },
          {
            id: 3,
            userId: 3,
            userName: 'Bob Johnson',
            type: 'reaction',
            content: 'liked',
            targetId: 1,
            targetType: 'thread',
            timestamp: '2024-10-09T08:30:00Z',
            status: 'active'
          }
        ];

        const mockStats = {
          totalGroups: 42,
          totalMembers: 15250,
          totalThreads: 32400,
          totalReplies: 125000,
          newGroupsThisMonth: 8,
          newMembersThisMonth: 1250,
          activeUsersToday: 2450,
          engagementRate: 68.5
        };

        const mockModeration = {
          totalReports: 125,
          pendingReports: 8,
          resolvedReports: 117,
          activeWarnings: 15,
          suspendedAccounts: 3,
          flaggedContent: 24
        };

        setCommunityGroups(mockGroups);
        setForumThreads(mockThreads);
        setInteractions(mockInteractions);
        setFilteredGroups(mockGroups);
        setFilteredThreads(mockThreads);
        setFilteredInteractions(mockInteractions);
        setCommunityStats(mockStats);
        setModerationData(mockModeration);
        setLoading(false);
      }, 1000);
    };

    fetchCommunityData();
  }, []);

  // Filter data based on active tab and filters
  useEffect(() => {
    if (activeTab === 'groups') {
      let result = communityGroups;

      if (searchTerm) {
        result = result.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterPrivacy !== 'all') {
        result = result.filter(item => item.privacy === filterPrivacy);
      }

      if (filterStatus !== 'all') {
        result = result.filter(item => item.status === filterStatus);
      }

      setFilteredGroups(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'threads') {
      let result = forumThreads;

      if (searchTerm) {
        result = result.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredThreads(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'interactions') {
      let result = interactions;

      if (searchTerm) {
        result = result.filter(item =>
          item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.userName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredInteractions(result);
      setCurrentPage(1); // Reset to first page when filtering
    }
  }, [searchTerm, filterPrivacy, filterStatus, activeTab, communityGroups, forumThreads, interactions]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  let currentItems: any[] = [];
  let totalPages = 0;

  if (activeTab === 'groups') {
    currentItems = filteredGroups.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  } else if (activeTab === 'threads') {
    currentItems = filteredThreads.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredThreads.length / itemsPerPage);
  } else if (activeTab === 'interactions') {
    currentItems = filteredInteractions.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredInteractions.length / itemsPerPage);
  }

  const handleCreateGroup = async () => {
    try {
      // In a real implementation, this would call the API to create a group
      console.log('Creating group:', newGroup);
      setShowCreateModal(false);
      // Reset form
      setNewGroup({
        name: '',
        description: '',
        privacy: 'public'
      });
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleSuspendGroup = async (groupId: number) => {
    try {
      // In a real implementation, this would call the API to suspend a group
      console.log('Suspending group:', groupId);
      setCommunityGroups(communityGroups.map(group =>
        group.id === groupId ? {...group, status: 'suspended'} : group
      ));
      setFilteredGroups(filteredGroups.map(group =>
        group.id === groupId ? {...group, status: 'suspended'} : group
      ));
    } catch (error) {
      console.error('Error suspending group:', error);
    }
  };

  const handleActivateGroup = async (groupId: number) => {
    try {
      // In a real implementation, this would call the API to activate a group
      console.log('Activating group:', groupId);
      setCommunityGroups(communityGroups.map(group =>
        group.id === groupId ? {...group, status: 'active'} : group
      ));
      setFilteredGroups(filteredGroups.map(group =>
        group.id === groupId ? {...group, status: 'active'} : group
      ));
    } catch (error) {
      console.error('Error activating group:', error);
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public': return <Globe className="h-4 w-4 text-green-500" />;
      case 'private': return <Lock className="h-4 w-4 text-blue-500" />;
      case 'restricted': return <Shield className="h-4 w-4 text-yellow-500" />;
      default: return <Globe className="h-4 w-4 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'post': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'comment': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'reaction': return 'bg-purple-100 text-purple-950 border border-purple-400 font-bold';
      case 'share': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow border-b border-slate-200">
        <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-3">
            <div className="flex items-center">
              <Users className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 ml-3">Community Management</h1>
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
              <button
                className="min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center shadow-sm active:scale-95 transition-all"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Group
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
        {/* Stats Overview */}
        {communityStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Groups</p>
                  <p className="text-2xl font-semibold text-gray-900">{communityStats.totalGroups}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-semibold text-gray-900">{communityStats.totalMembers.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Threads</p>
                  <p className="text-2xl font-semibold text-gray-900">{communityStats.totalThreads.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">{communityStats.engagementRate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-slate-300 mb-6 overflow-x-auto">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max pb-1">
            <button
              onClick={() => setActiveTab('groups')}
              className={`${
                activeTab === 'groups'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-black text-xs sm:text-sm flex items-center min-h-[44px]`}
            >
              <Users className="h-4 w-4 mr-2" />
              Groups
            </button>
            <button
              onClick={() => setActiveTab('threads')}
              className={`${
                activeTab === 'threads'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-black text-xs sm:text-sm flex items-center min-h-[44px]`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Threads
            </button>
            <button
              onClick={() => setActiveTab('interactions')}
              className={`${
                activeTab === 'interactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-black text-xs sm:text-sm flex items-center min-h-[44px]`}
            >
              <Activity className="h-4 w-4 mr-2" />
              Interactions
            </button>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`${
                activeTab === 'moderation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-black text-xs sm:text-sm flex items-center min-h-[44px]`}
            >
              <Shield className="h-4 w-4 mr-2" />
              Moderation
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-black text-xs sm:text-sm flex items-center min-h-[44px]`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </button>
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-700" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder:text-slate-400 focus:outline-none focus:placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 focus:ring-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {activeTab === 'groups' && (
              <>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
                  value={filterPrivacy}
                  onChange={(e) => setFilterPrivacy(e.target.value)}
                >
                  <option value="all">All Privacy Levels</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="restricted">Restricted</option>
                </select>

                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </>
            )}

            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">
                {activeTab === 'groups' ? `${filteredGroups.length} groups` :
                 activeTab === 'threads' ? `${filteredThreads.length} threads` :
                 `${filteredInteractions.length} interactions`}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Community Groups Tab */}
            {activeTab === 'groups' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Group
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Creator
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Members
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Posts
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Privacy
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-slate-800">
                            No community groups found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as CommunityGroup[]).map((group) => (
                          <tr key={group.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{group.name}</div>
                              <div className="text-sm text-slate-700 truncate max-w-xs">{group.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{group.creatorName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {group.memberCount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {group.postCount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              <div className="flex items-center">
                                {getPrivacyIcon(group.privacy)}
                                <span className="ml-1 capitalize">{group.privacy}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(group.status)}`}>
                                {group.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  aria-label={`View group ${group.name} details`}
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/community/groups/${group.id}/details`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                {group.status === 'active' ? (
                                  <button
                                    type="button"
                                    aria-label={`Suspend group ${group.name}`}
                                    className="text-red-600 hover:text-red-900"
                                    onClick={() => handleSuspendGroup(group.id)}
                                  >
                                    <Ban className="h-4 w-4" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    aria-label={`Activate group ${group.name}`}
                                    className="text-green-600 hover:text-green-900"
                                    onClick={() => handleActivateGroup(group.id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                )}
                                <div className="relative">
                                  <button
                                    type="button"
                                    aria-label={`More options for group ${group.name}`}
                                    onClick={() => showToast(`Actions for group: ${group.name}`, 'info')}
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/community/groups/${group.id}/members`)}
                                    >
                                      Manage Members
                                    </button>
                                    <button
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/community/groups/${group.id}/posts`)}
                                    >
                                      View Posts
                                    </button>
                                    <button
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/community/groups/${group.id}/reports`)}
                                    >
                                      View Reports
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Forum Threads Tab */}
            {activeTab === 'threads' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Thread
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Author
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Group
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Replies
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Views
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Last Reply
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-slate-800">
                            No forum threads found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as ForumThread[]).map((thread) => (
                          <tr key={thread.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900 flex items-center">
                                {thread.isPinned && <PinIcon className="h-4 w-4 text-yellow-500 mr-1" />}
                                {thread.title}
                              </div>
                              <div className="text-sm text-slate-700 truncate max-w-xs">{thread.content}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{thread.authorName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {thread.groupName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {thread.replyCount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {thread.viewCount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {new Date(thread.lastReplyAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  aria-label={`View thread ${thread.title}`}
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/community/threads/${thread.id}/view`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <div className="relative">
                                  <button
                                    type="button"
                                    aria-label={`More options for thread ${thread.title}`}
                                    onClick={() => showToast(`Actions for thread: ${thread.title}`, 'info')}
                                    className="text-gray-600 hover:text-gray-900"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/community/threads/${thread.id}/moderate`)}
                                    >
                                      Moderate Thread
                                    </button>
                                    <button
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => thread.isPinned ?
                                        console.log('Unpin thread', thread.id) :
                                        console.log('Pin thread', thread.id)
                                      }
                                    >
                                      {thread.isPinned ? 'Unpin Thread' : 'Pin Thread'}
                                    </button>
                                    <button
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => thread.isLocked ?
                                        console.log('Unlock thread', thread.id) :
                                        console.log('Lock thread', thread.id)
                                      }
                                    >
                                      {thread.isLocked ? 'Unlock Thread' : 'Lock Thread'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Interactions Tab */}
            {activeTab === 'interactions' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Content
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Target
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-slate-800">
                            No interactions found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as CommunityInteraction[]).map((interaction) => (
                          <tr key={interaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{interaction.userName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(interaction.type)}`}>
                                {interaction.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-800 max-w-xs truncate">
                              {interaction.content}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {interaction.targetType} #{interaction.targetId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {new Date(interaction.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${interaction.status === 'active' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' : 'bg-red-100 text-green-950 border border-green-400 font-bold'}font-black`}>
                                {interaction.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  className="text-blue-600 hover:text-blue-900"
                                  aria-label={`View interaction #${interaction.id} details`}
                                  title="View details"
                                  onClick={() => history.push(`/dashboard/community/interactions/${interaction.id}/details`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-900"
                                  aria-label={`Delete interaction #${interaction.id}`}
                                  title="Delete interaction"
                                  onClick={() => {
                                    setInteractions(prev => prev.filter(i => i.id !== interaction.id));
                                  }}
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => showToast(`Actions for interaction #${interaction.id}`, 'info')}
                                    className="text-gray-600 hover:text-gray-900"
                                    aria-label={`More actions for interaction #${interaction.id}`}
                                    title="More actions"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/community/interactions/${interaction.id}/moderate`)}
                                    >
                                      Moderate Content
                                    </button>
                                    <button
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/community/interactions/${interaction.id}/user-profile`)}
                                    >
                                      View User Profile
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Moderation Tab */}
            {activeTab === 'moderation' && moderationData && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-red-100">
                        <Flag className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Reports</p>
                        <p className="text-2xl font-semibold text-gray-900">{moderationData.totalReports}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-yellow-100">
                        <MessageSquare className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                        <p className="text-2xl font-semibold text-gray-900">{moderationData.pendingReports}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-green-100">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Resolved Reports</p>
                        <p className="text-2xl font-semibold text-gray-900">{moderationData.resolvedReports}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Moderation Actions</h3>
                    <div className="space-y-3">
                      {moderationData.moderationActions?.map((action: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-sm text-gray-600 capitalize">{action.action.replace(/_/g, ' ')}</span>
                          <span className="text-sm font-medium">{action.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Violations</h3>
                    <div className="space-y-3">
                      {moderationData.topViolations?.map((violation: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-sm text-gray-600">{violation.violation}</span>
                          <span className="text-sm font-medium">{violation.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Reports</h3>
                  <div className="h-64 flex items-center justify-center">
                    <Flag className="h-16 w-16 text-slate-700" />
                    <p className="ml-4 text-slate-700">Recent reports list would appear here</p>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && communityStats && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Growth Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">New Groups (This Month)</span>
                        <span className="font-medium">{communityStats.newGroupsThisMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">New Members (This Month)</span>
                        <span className="font-medium">{communityStats.newMembersThisMonth.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Users (Today)</span>
                        <span className="font-medium">{communityStats.activeUsersToday.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Growth Rate</span>
                        <span className="font-medium">12.3%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Popular Groups</h3>
                    <div className="space-y-3">
                      {communityStats.popularGroups?.map((group: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-sm text-gray-600 truncate">{group.name}</span>
                          <span className="font-medium">{group.memberCount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Activity</h3>
                    <div className="h-32 flex items-end space-x-1">
                      {communityStats.weeklyActivity?.map((day: any, index: number) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div
                            className="w-full bg-blue-500 rounded-t"
                            style={{ height: `${(day.posts / Math.max(...communityStats.weeklyActivity.map((d: any) => d.posts))) * 100}%` }}
                          ></div>
                          <span className="text-xs mt-1">{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement Overview</h3>
                    <div className="h-32 flex items-center justify-center">
                      <BarChart3 className="h-12 w-12 text-slate-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Community Insights</h3>
                  <div className="h-64 flex items-center justify-center">
                    <TrendingUp className="h-16 w-16 text-slate-700" />
                    <p className="ml-4 text-slate-700">Community insights visualization would appear here</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {['groups', 'threads', 'interactions'].includes(activeTab) && totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-300 sm:px-6 mt-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-slate-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? 'bg-gray-100 text-slate-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastItem, (activeTab === 'groups' ? filteredGroups : activeTab === 'threads' ? filteredThreads : filteredInteractions).length)}</span> of{' '}
                  <span className="font-medium">{(activeTab === 'groups' ? filteredGroups : activeTab === 'threads' ? filteredThreads : filteredInteractions).length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-1" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-slate-700' : 'text-slate-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      type="button"
                      aria-label={`Go to page ${i + 1}`}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-slate-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-slate-700' : 'text-slate-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Community Group</h3>
                <button
                  type="button"
                  aria-label="Close modal"
                  className="text-slate-700 hover:text-gray-700"
                  onClick={() => setShowCreateModal(false)}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleCreateGroup(); }}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Group Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="privacy">
                    Privacy Setting
                  </label>
                  <select
                    id="privacy"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                    value={newGroup.privacy}
                    onChange={(e) => setNewGroup({...newGroup, privacy: e.target.value as any})}
                  >
                    <option value="public">Public - Anyone can join</option>
                    <option value="private">Private - Approval required</option>
                    <option value="restricted">Restricted - Invite only</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 focus:outline-none"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="min-h-[44px] px-4 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none shadow-sm active:scale-95"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Floating Sovereign Mobile Navigation Quick Dock */}
      <div
        data-testid="community-management-mobile-dock"
        className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden"
      >
        <button
          type="button"
          onClick={() => setActiveTab('groups')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-transform active:scale-95 ${
            activeTab === 'groups' ? 'text-blue-400' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Groups</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('threads')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-transform active:scale-95 ${
            activeTab === 'threads' ? 'text-blue-400' : 'text-slate-300 hover:text-white'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Threads</span>
        </button>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-emerald-400 active:scale-95 transition-transform"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">New</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] transition-transform active:scale-95 ${
            activeTab === 'analytics' ? 'text-blue-400' : 'text-slate-300 hover:text-white'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Stats</span>
        </button>
      </div>
    </div>
  );
};

export default CommunityPage;
