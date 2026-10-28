import React, { useState, useEffect } from 'react';
import {
  Video,
  Radio,
  Users,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Settings,
  Play,
  Pause,
  Square,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  Camera,
  Clock,
  MapPin,
  Heart,
  Gift,
  Mic,
  Volume2,
  ChevronLeft,
  ChevronRight,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

interface Stream {
  id: number;
  title: string;
  description: string;
  userId: number;
  userName: string;
  viewerCount: number;
  startTime: string;
  endTime?: string;
  status: 'live' | 'ended' | 'scheduled' | 'paused';
  streamKey: string;
  streamUrl: string;
  thumbnailUrl?: string;
  category: string;
  isPublic: boolean;
  isRecorded: boolean;
  recordingUrl?: string;
  viewersPeak: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

interface StreamViewer {
  id: number;
  streamId: number;
  userId: number;
  userName: string;
  joinedAt: string;
  leftAt?: string;
  watchDuration: number;
  ip: string;
  userAgent?: string;
  country?: string;
  city?: string;
}

interface StreamInteraction {
  id: number;
  streamId: number;
  userId: number;
  userName: string;
  type: 'chat' | 'like' | 'follow' | 'subscribe' | 'tip';
  content?: string;
  timestamp: string;
  isDeleted: boolean;
}

const LiveStreamingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'streams' | 'viewers' | 'interactions' | 'analytics' | 'settings'>('streams');
  const [streams, setStreams] = useState<Stream[]>([]);
  const [viewers, setViewers] = useState<StreamViewer[]>([]);
  const [interactions, setInteractions] = useState<StreamInteraction[]>([]);
  const [filteredStreams, setFilteredStreams] = useState<Stream[]>([]);
  const [filteredViewers, setFilteredViewers] = useState<StreamViewer[]>([]);
  const [filteredInteractions, setFilteredInteractions] = useState<StreamInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [streamingStats, setStreamingStats] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStream, setNewStream] = useState({
    title: '',
    description: '',
    category: 'general',
    isPublic: true
  });

  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const history = { push: (path: string) => navigate(path), replace: (path: string) => navigate(path, { replace: true }) };

  // Simulate loading streaming data
  useEffect(() => {
    const fetchStreamingData = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        const mockStreams: Stream[] = [
          {
            id: 1,
            title: 'Gaming Session #1',
            description: 'Playing the latest action game',
            userId: 1,
            userName: 'GamerPro',
            viewerCount: 1250,
            startTime: '2024-10-09T10:00:00Z',
            status: 'live',
            streamKey: 'sk_1234567890',
            streamUrl: 'rtmp://server.com/live/stream1',
            thumbnailUrl: 'https://example.com/thumb1.jpg',
            category: 'gaming',
            isPublic: true,
            isRecorded: false,
            viewersPeak: 1500,
            duration: 3600,
            createdAt: '2024-10-09T09:30:00Z',
            updatedAt: '2024-10-09T10:00:00Z'
          },
          {
            id: 2,
            title: 'Music Concert Live',
            description: 'Live concert from local band',
            userId: 2,
            userName: 'MusicLover',
            viewerCount: 0,
            startTime: '2024-10-09T09:00:00Z',
            endTime: '2024-10-09T10:30:00Z',
            status: 'ended',
            streamKey: 'sk_0987654321',
            streamUrl: 'rtmp://server.com/live/stream2',
            thumbnailUrl: 'https://example.com/thumb2.jpg',
            category: 'music',
            isPublic: true,
            isRecorded: true,
            recordingUrl: 'https://example.com/recording2.mp4',
            viewersPeak: 1200,
            duration: 5400,
            createdAt: '2024-10-09T08:30:00Z',
            updatedAt: '2024-10-09T10:30:00Z'
          },
          {
            id: 3,
            title: 'Scheduled Tech Talk',
            description: 'Discussion about latest tech trends',
            userId: 3,
            userName: 'TechExpert',
            viewerCount: 0,
            startTime: '2024-10-10T14:00:00Z',
            status: 'scheduled',
            streamKey: 'sk_5678901234',
            streamUrl: 'rtmp://server.com/live/stream3',
            thumbnailUrl: 'https://example.com/thumb3.jpg',
            category: 'education',
            isPublic: true,
            isRecorded: false,
            viewersPeak: 0,
            duration: 0,
            createdAt: '2024-10-08T15:00:00Z',
            updatedAt: '2024-10-08T15:00:00Z'
          },
          {
            id: 4,
            title: 'Cooking Show',
            description: 'Making a delicious meal live',
            userId: 4,
            userName: 'ChefMaster',
            viewerCount: 450,
            startTime: '2024-10-09T11:30:00Z',
            status: 'live',
            streamKey: 'sk_1122334455',
            streamUrl: 'rtmp://server.com/live/stream4',
            thumbnailUrl: 'https://example.com/thumb4.jpg',
            category: 'cooking',
            isPublic: true,
            isRecorded: false,
            viewersPeak: 650,
            duration: 1800,
            createdAt: '2024-10-09T11:00:00Z',
            updatedAt: '2024-10-09T11:30:00Z'
          }
        ];

        const mockViewers: StreamViewer[] = [
          {
            id: 1,
            streamId: 1,
            userId: 101,
            userName: 'ViewerOne',
            joinedAt: '2024-10-09T10:05:00Z',
            leftAt: '2024-10-09T10:25:00Z',
            watchDuration: 1200,
            ip: '192.168.1.100',
            userAgent: 'Mozilla/5.0...',
            country: 'US',
            city: 'New York'
          },
          {
            id: 2,
            streamId: 1,
            userId: 102,
            userName: 'ViewerTwo',
            joinedAt: '2024-10-09T10:10:00Z',
            leftAt: '2024-10-09T10:30:00Z',
            watchDuration: 1200,
            ip: '192.168.1.101',
            userAgent: 'Mozilla/5.0...',
            country: 'CA',
            city: 'Toronto'
          },
          {
            id: 3,
            streamId: 2,
            userId: 103,
            userName: 'ViewerThree',
            joinedAt: '2024-10-09T09:15:00Z',
            leftAt: '2024-10-09T10:25:00Z',
            watchDuration: 3600,
            ip: '192.168.1.102',
            userAgent: 'Mozilla/5.0...',
            country: 'UK',
            city: 'London'
          }
        ];

        const mockInteractions: StreamInteraction[] = [
          {
            id: 1,
            streamId: 1,
            userId: 101,
            userName: 'ViewerOne',
            type: 'chat',
            content: 'Great stream so far!',
            timestamp: '2024-10-09T10:15:00Z',
            isDeleted: false
          },
          {
            id: 2,
            streamId: 1,
            userId: 102,
            userName: 'ViewerTwo',
            type: 'like',
            timestamp: '2024-10-09T10:20:00Z',
            isDeleted: false
          },
          {
            id: 3,
            streamId: 1,
            userId: 103,
            userName: 'ViewerThree',
            type: 'follow',
            timestamp: '2024-10-09T10:25:00Z',
            isDeleted: false
          },
          {
            id: 4,
            streamId: 2,
            userId: 104,
            userName: 'ViewerFour',
            type: 'tip',
            content: '$5.00',
            timestamp: '2024-10-09T09:45:00Z',
            isDeleted: false
          }
        ];

        const mockStats = {
          totalStreams: 125,
          liveStreams: 3,
          totalViewers: 4500,
          concurrentViewers: 1250,
          avgWatchTime: 1800,
          totalWatchTime: 2250000,
          engagementMetrics: {
            avgChatMessages: 45,
            avgLikesPerStream: 120,
            avgTipsPerStream: 15,
            avgTipAmount: 3.50
          }
        };

        setStreams(mockStreams);
        setViewers(mockViewers);
        setInteractions(mockInteractions);
        setFilteredStreams(mockStreams);
        setFilteredViewers(mockViewers);
        setFilteredInteractions(mockInteractions);
        setStreamingStats(mockStats);
        setLoading(false);
      }, 1000);
    };

    fetchStreamingData();
  }, []);

  // Filter data based on active tab and filters
  useEffect(() => {
    if (activeTab === 'streams') {
      let result = streams;

      if (searchTerm) {
        result = result.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.userName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterStatus !== 'all') {
        result = result.filter(item => item.status === filterStatus);
      }

      if (filterCategory !== 'all') {
        result = result.filter(item => item.category === filterCategory);
      }

      setFilteredStreams(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'viewers') {
      let result = viewers;

      if (searchTerm) {
        result = result.filter(item =>
          item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.country?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredViewers(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'interactions') {
      let result = interactions;

      if (searchTerm) {
        result = result.filter(item =>
          item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredInteractions(result);
      setCurrentPage(1); // Reset to first page when filtering
    }
  }, [searchTerm, filterStatus, filterCategory, activeTab, streams, viewers, interactions]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  let currentItems: any[] = [];
  let totalPages = 0;

  if (activeTab === 'streams') {
    currentItems = filteredStreams.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredStreams.length / itemsPerPage);
  } else if (activeTab === 'viewers') {
    currentItems = filteredViewers.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredViewers.length / itemsPerPage);
  } else if (activeTab === 'interactions') {
    currentItems = filteredInteractions.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredInteractions.length / itemsPerPage);
  }

  const handleCreateStream = async () => {
    try {
      // In a real implementation, this would call the API to create a stream
      console.log('Creating stream:', newStream);
      setShowCreateModal(false);
      // Reset form
      setNewStream({
        title: '',
        description: '',
        category: 'general',
        isPublic: true
      });
    } catch (error) {
      console.error('Error creating stream:', error);
    }
  };

  const handleStartStream = async (streamId: number) => {
    try {
      // In a real implementation, this would call the API to start a stream
      console.log('Starting stream:', streamId);
      setStreams(streams.map(stream =>
        stream.id === streamId ? {...stream, status: 'live', startTime: new Date().toISOString()} : stream
      ));
      setFilteredStreams(filteredStreams.map(stream =>
        stream.id === streamId ? {...stream, status: 'live', startTime: new Date().toISOString()} : stream
      ));
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const handleEndStream = async (streamId: number) => {
    try {
      // In a real implementation, this would call the API to end a stream
      console.log('Ending stream:', streamId);
      setStreams(streams.map(stream =>
        stream.id === streamId ? {...stream, status: 'ended', endTime: new Date().toISOString()} : stream
      ));
      setFilteredStreams(filteredStreams.map(stream =>
        stream.id === streamId ? {...stream, status: 'ended', endTime: new Date().toISOString()} : stream
      ));
    } catch (error) {
      console.error('Error ending stream:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      case 'ended': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'paused': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'chat': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'like': return 'bg-pink-100 text-pink-800';
      case 'follow': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'subscribe': return 'bg-purple-100 text-purple-950 border border-purple-400 font-bold';
      case 'tip': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'gaming': return 'bg-purple-100 text-purple-950 border border-purple-400 font-bold';
      case 'music': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'education': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'cooking': return 'bg-orange-100 text-orange-800';
      case 'entertainment': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'sports': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-gray-50 pb-28 md:pb-12">
      {/* Header */}
      <header className="bg-white shadow-xs border-b border-slate-200">
        <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 sm:py-6">
            <div className="flex items-center">
              <Video className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500 shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 ml-2.5 sm:ml-3">Live Streaming Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="w-full sm:w-auto min-h-[44px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center active:scale-95 transition"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Stream
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Overview */}
        {streamingStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/80 p-3.5 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 rounded-xl bg-red-100 shrink-0">
                  <Radio className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <div className="ml-2.5 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Live Streams</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{streamingStats.liveStreams}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/80 p-3.5 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 rounded-xl bg-blue-100 shrink-0">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="ml-2.5 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Viewers</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{streamingStats.concurrentViewers.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/80 p-3.5 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 rounded-xl bg-green-100 shrink-0">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="ml-2.5 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Watch Time</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{Math.round(streamingStats.avgWatchTime / 60)}m</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/80 p-3.5 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 rounded-xl bg-purple-100 shrink-0">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div className="ml-2.5 sm:ml-4 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Likes/Stream</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{streamingStats.engagementMetrics.avgLikesPerStream}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-slate-300 mb-6">
          <nav className="-mb-px flex space-x-2 sm:space-x-8 overflow-x-auto scrollbar-none pb-1 flex-nowrap">
            <button
              onClick={() => setActiveTab('streams')}
              className={`${
                activeTab === 'streams'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } min-h-[44px] shrink-0 whitespace-nowrap py-3 sm:py-4 px-2.5 sm:px-1 border-b-2 font-bold text-xs sm:text-sm flex items-center active:scale-95 transition`}
            >
              <Video className="h-4 w-4 mr-1.5 sm:mr-2 shrink-0" />
              Streams
            </button>
            <button
              onClick={() => setActiveTab('viewers')}
              className={`${
                activeTab === 'viewers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } min-h-[44px] shrink-0 whitespace-nowrap py-3 sm:py-4 px-2.5 sm:px-1 border-b-2 font-bold text-xs sm:text-sm flex items-center active:scale-95 transition`}
            >
              <Users className="h-4 w-4 mr-1.5 sm:mr-2 shrink-0" />
              Viewers
            </button>
            <button
              onClick={() => setActiveTab('interactions')}
              className={`${
                activeTab === 'interactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } min-h-[44px] shrink-0 whitespace-nowrap py-3 sm:py-4 px-2.5 sm:px-1 border-b-2 font-bold text-xs sm:text-sm flex items-center active:scale-95 transition`}
            >
              <MessageSquare className="h-4 w-4 mr-1.5 sm:mr-2 shrink-0" />
              Interactions
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } min-h-[44px] shrink-0 whitespace-nowrap py-3 sm:py-4 px-2.5 sm:px-1 border-b-2 font-bold text-xs sm:text-sm flex items-center active:scale-95 transition`}
            >
              <BarChart3 className="h-4 w-4 mr-1.5 sm:mr-2 shrink-0" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } min-h-[44px] shrink-0 whitespace-nowrap py-3 sm:py-4 px-2.5 sm:px-1 border-b-2 font-bold text-xs sm:text-sm flex items-center active:scale-95 transition`}
            >
              <Settings className="h-4 w-4 mr-1.5 sm:mr-2 shrink-0" />
              Settings
            </button>
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="block w-full min-h-[44px] pl-10 pr-3 py-2 border border-slate-300 rounded-xl leading-5 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {activeTab === 'streams' && (
              <>
                <select
                  className="block w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 font-bold bg-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="live">Live</option>
                  <option value="ended">Ended</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="paused">Paused</option>
                </select>

                <select
                  className="block w-full min-h-[44px] px-3 py-2 border border-slate-300 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 font-bold bg-white"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="gaming">Gaming</option>
                  <option value="music">Music</option>
                  <option value="education">Education</option>
                  <option value="cooking">Cooking</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="sports">Sports</option>
                  <option value="general">General</option>
                </select>
              </>
            )}

            <div className="flex items-center">
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                {activeTab === 'streams' ? `${filteredStreams.length} streams` :
                 activeTab === 'viewers' ? `${filteredViewers.length} viewers` :
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
            {/* Streams Tab */}
            {activeTab === 'streams' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Stream
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Streamer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Viewers
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Duration
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
                            No streams found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as Stream[]).map((stream) => (
                          <tr key={stream.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                {stream.thumbnailUrl ? (
                                  <img
                                    className="h-10 w-10 rounded-md object-cover"
                                    src={stream.thumbnailUrl}
                                    alt={stream.title}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                    <Video className="h-5 w-5 text-slate-700" />
                                  </div>
                                )}
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{stream.title}</div>
                                  <div className="text-sm text-slate-700 truncate max-w-xs">{stream.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{stream.userName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {stream.status === 'live' ? (
                                <div className="flex items-center">
                                  <span className="text-red-600 font-bold">{stream.viewerCount}</span>
                                  <span className="ml-1">• LIVE</span>
                                </div>
                              ) : (
                                <span>{stream.viewerCount}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(stream.category)}`}>
                                {stream.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(stream.status)}`}>
                                {stream.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {stream.duration ? `${Math.floor(stream.duration / 60)}m` : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-1.5">
                                {stream.status === 'live' ? (
                                  <button
                                    type="button"
                                    aria-label={`End live stream ${stream.title}`}
                                    className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-red-600 hover:text-red-900 hover:bg-red-50 active:scale-95 transition"
                                    onClick={() => handleEndStream(stream.id)}
                                  >
                                    <Square className="h-4 w-4" />
                                  </button>
                                ) : stream.status === 'scheduled' ? (
                                  <button
                                    type="button"
                                    aria-label={`Start scheduled stream ${stream.title}`}
                                    className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-green-600 hover:text-green-900 hover:bg-green-50 active:scale-95 transition"
                                    onClick={() => handleStartStream(stream.id)}
                                  >
                                    <Play className="h-4 w-4" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    aria-label={`Start stream ${stream.title}`}
                                    className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-green-600 hover:text-green-900 hover:bg-green-50 active:scale-95 transition"
                                    onClick={() => handleStartStream(stream.id)}
                                  >
                                    <Play className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  aria-label={`View stream ${stream.title} details`}
                                  className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-50 active:scale-95 transition"
                                  onClick={() => history.push(`/dashboard/streaming/streams/${stream.id}/details`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <div className="relative">
                                  <button
                                    type="button"
                                    aria-label={`More options for stream ${stream.title}`}
                                    onClick={() => showToast(`Actions for stream: ${stream.title}`, 'info')}
                                    className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-95 transition"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/streaming/streams/${stream.id}/edit`)}
                                    >
                                      Edit Stream
                                    </button>
                                    <button
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/streaming/streams/${stream.id}/viewers`)}
                                    >
                                      View Viewers
                                    </button>
                                    <button
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => stream.recordingUrl ?
                                        window.open(stream.recordingUrl, '_blank') :
                                        console.log('No recording available')
                                      }
                                    >
                                      {stream.recordingUrl ? 'View Recording' : 'No Recording'}
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

            {/* Viewers Tab */}
            {activeTab === 'viewers' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Viewer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Stream
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Join Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Watch Duration
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Location
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-slate-800">
                            No viewers found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as StreamViewer[]).map((viewer) => (
                          <tr key={viewer.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{viewer.userName}</div>
                              <div className="text-sm text-slate-700">{viewer.ip}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              Stream #{viewer.streamId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {new Date(viewer.joinedAt).toLocaleTimeString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {Math.floor(viewer.watchDuration / 60)}m
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {viewer.city}, {viewer.country}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-1.5">
                                <button
                                  type="button"
                                  aria-label={`View viewer ${viewer.userName} details`}
                                  className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-50 active:scale-95 transition"
                                  onClick={() => history.push(`/dashboard/streaming/viewers/${viewer.id}/details`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <div className="relative">
                                  <button
                                    type="button"
                                    aria-label={`More options for viewer ${viewer.userName}`}
                                    onClick={() => showToast(`Actions for viewer: ${viewer.userName}`, 'info')}
                                    className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:scale-95 transition"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/streaming/viewers/${viewer.id}/profile`)}
                                    >
                                      View Profile
                                    </button>
                                    <button
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/streaming/viewers/${viewer.id}/history`)}
                                    >
                                      View History
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
                          Stream
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Content
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-slate-800">
                            No interactions found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as StreamInteraction[]).map((interaction) => (
                          <tr key={interaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{interaction.userName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              Stream #{interaction.streamId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(interaction.type)}`}>
                                {interaction.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-800 max-w-xs truncate">
                              {interaction.content || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                              {new Date(interaction.timestamp).toLocaleTimeString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  aria-label={`View interaction #${interaction.id} details`}
                                  className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg flex items-center justify-center text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition"
                                  onClick={() => history.push(`/dashboard/streaming/interactions/${interaction.id}/details`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <div className="relative">
                                  <button
                                    type="button"
                                    aria-label={`More options for interaction #${interaction.id}`}
                                    onClick={() => showToast(`Actions for interaction #${interaction.id}`, 'info')}
                                    className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button
                                      className="block px-4 py-2 text-sm text-slate-800 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/streaming/interactions/${interaction.id}/moderate`)}
                                    >
                                      Moderate
                                    </button>
                                    <button
                                      className="block px-4 py-2 text-sm text-slate-800 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/streaming/interactions/${interaction.id}/user-profile`)}
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

            {/* Analytics Tab */}
            {activeTab === 'analytics' && streamingStats && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Streaming Overview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Streams</span>
                        <span className="font-medium">{streamingStats.totalStreams}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Live Streams</span>
                        <span className="font-medium">{streamingStats.liveStreams}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Viewers</span>
                        <span className="font-medium">{streamingStats.totalViewers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg. Watch Time</span>
                        <span className="font-medium">{Math.round(streamingStats.avgWatchTime / 60)} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Engagement Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg. Chat Messages</span>
                        <span className="font-medium">{streamingStats.engagementMetrics.avgChatMessages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg. Likes/Stream</span>
                        <span className="font-medium">{streamingStats.engagementMetrics.avgLikesPerStream}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg. Tips/Stream</span>
                        <span className="font-medium">{streamingStats.engagementMetrics.avgTipsPerStream}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg. Tip Amount</span>
                        <span className="font-medium">${streamingStats.engagementMetrics.avgTipAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Streamers</h3>
                    <div className="space-y-3">
                      {[
                        { id: 1, name: 'GamerPro', viewers: 1250, streams: 45 },
                        { id: 2, name: 'MusicLover', viewers: 850, streams: 32 },
                        { id: 3, name: 'TechExpert', viewers: 650, streams: 28 }
                      ].map((streamer, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-sm text-gray-600 truncate">{streamer.name}</span>
                          <span className="font-medium">{streamer.viewers} viewers</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Gaming', percentage: 45 },
                        { name: 'Music', percentage: 25 },
                        { name: 'Education', percentage: 15 },
                        { name: 'Entertainment', percentage: 15 }
                      ].map((category, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-sm text-gray-600">{category.name}</span>
                          <span className="font-medium">{category.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Trend</h3>
                  <div className="h-64 flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-slate-700" />
                    <p className="ml-4 text-slate-700">Weekly streaming trend visualization would appear here</p>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Streaming Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Quality Settings</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Resolution</span>
                          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2">
                            <option>1080p</option>
                            <option>720p</option>
                            <option>480p</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Frame Rate</span>
                          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2">
                            <option>60 fps</option>
                            <option>30 fps</option>
                            <option>15 fps</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Bitrate</span>
                          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2">
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Moderation Settings</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Auto-moderation</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border text-gray-950 border-gray-400 font-black"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Block Offensive Language</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border text-gray-950 border-gray-400 font-black"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Enable Recording</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 border text-gray-950 border-gray-400 font-black"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">RTMP Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Server URL</label>
                      <input
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                        defaultValue="rtmp://your-server.com/live"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stream Key Format</label>
                      <input
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                        defaultValue="{username}-{streamid}"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {['streams', 'viewers', 'interactions'].includes(activeTab) && totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-300 sm:px-6 mt-6 rounded-xl shadow-sm">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center justify-center px-4 py-2 min-h-[44px] min-w-[44px] border border-slate-300 text-sm font-bold rounded-lg transition ${
                  currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-800 hover:bg-slate-50 active:scale-95'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center justify-center px-4 py-2 min-h-[44px] min-w-[44px] border border-slate-300 text-sm font-bold rounded-lg transition ${
                  currentPage === totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-800 hover:bg-slate-50 active:scale-95'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Showing <span className="font-bold text-slate-900">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-bold text-slate-900">{Math.min(indexOfLastItem, (activeTab === 'streams' ? filteredStreams : activeTab === 'viewers' ? filteredViewers : filteredInteractions).length)}</span> of{' '}
                  <span className="font-bold text-slate-900">{(activeTab === 'streams' ? filteredStreams : activeTab === 'viewers' ? filteredViewers : filteredInteractions).length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center justify-center px-3 py-2 min-h-[44px] min-w-[44px] rounded-l-lg border border-slate-300 bg-white text-sm font-medium transition ${
                      currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50'
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
                      className={`relative inline-flex items-center justify-center px-4 py-2 min-h-[44px] min-w-[44px] border text-sm font-bold transition ${
                        currentPage === i + 1
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-700'
                          : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center justify-center px-3 py-2 min-h-[44px] min-w-[44px] rounded-r-lg border border-slate-300 bg-white text-sm font-medium transition ${
                      currentPage === totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50'
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

      {/* Create Stream Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto p-5 sm:p-6 border border-slate-300 w-full max-w-lg shadow-2xl rounded-2xl bg-white animate-in fade-in zoom-in duration-200">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Create New Stream</h3>
                <button
                  type="button"
                  aria-label="Close modal"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                  onClick={() => setShowCreateModal(false)}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleCreateStream(); }}>
                <div className="mb-4">
                  <label className="block text-slate-900 text-sm font-bold mb-2" htmlFor="stream-title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="stream-title"
                    className="shadow appearance-none border rounded-xl w-full py-3 px-3.5 min-h-[44px] text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newStream.title}
                    onChange={(e) => setNewStream({...newStream, title: e.target.value})}
                    placeholder="Enter broadcast title..."
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-slate-900 text-sm font-bold mb-2" htmlFor="stream-description">
                    Description
                  </label>
                  <textarea
                    id="stream-description"
                    rows={3}
                    className="shadow appearance-none border rounded-xl w-full py-3 px-3.5 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newStream.description}
                    onChange={(e) => setNewStream({...newStream, description: e.target.value})}
                    placeholder="Describe your stream..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-slate-900 text-sm font-bold mb-2" htmlFor="stream-category">
                    Category
                  </label>
                  <select
                    id="stream-category"
                    className="shadow appearance-none border rounded-xl w-full py-3 px-3.5 min-h-[44px] text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                    value={newStream.category}
                    onChange={(e) => setNewStream({...newStream, category: e.target.value})}
                  >
                    <option value="gaming">Gaming</option>
                    <option value="music">Music</option>
                    <option value="education">Education</option>
                    <option value="cooking">Cooking</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="sports">Sports</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div className="mb-6 flex items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    id="stream-public"
                    type="checkbox"
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded font-bold cursor-pointer"
                    checked={newStream.isPublic}
                    onChange={(e) => setNewStream({...newStream, isPublic: e.target.checked})}
                  />
                  <label htmlFor="stream-public" className="ml-3 block text-sm font-bold text-slate-900 cursor-pointer">
                    Make this stream public & sovereignly broadcasted
                  </label>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-5 py-3 min-h-[44px] text-sm font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 active:scale-95 transition"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 min-h-[44px] text-sm font-bold text-white bg-gradient-to-r from-red-600 to-indigo-600 rounded-xl hover:opacity-95 shadow-lg shadow-indigo-600/20 active:scale-95 transition"
                  >
                    Create Stream
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div
        data-testid="live-streaming-mobile-dock"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl px-4 py-2 pb-safe"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            type="button"
            onClick={() => { setActiveTab('streams'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-xl transition ${
              activeTab === 'streams' ? 'text-red-600 font-bold bg-red-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Video className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] leading-tight">Streams</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('viewers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-xl transition ${
              activeTab === 'viewers' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] leading-tight">Viewers</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('interactions'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-xl transition ${
              activeTab === 'interactions' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] leading-tight">Chat</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('analytics'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-xl transition ${
              activeTab === 'analytics' ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] leading-tight">Stats</span>
          </button>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-3 py-1 rounded-xl bg-gradient-to-r from-red-600 to-indigo-600 text-white font-bold shadow-md shadow-red-500/20 active:scale-95 transition"
          >
            <Radio className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] leading-tight">Go Live</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamingPage;
