import React, { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import {
  MemberGroupIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  BookOpenIcon,
  UserPlusIcon,
  MusicalNoteIcon,
  FilmIcon,
  AcademicCapIcon,
  ShareIcon
} from '../icons';
import MainLayout from '../components/layout/MainLayout';
import CuratedDiscovery from '../components/CuratedDiscovery';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCommunityPosts } from '../hooks/useCommunityPosts';

interface DiscoveryItem {
  id: string;
  title: string;
  description?: string;
  type: 'member' | 'group' | 'content' | 'location';
  avatar: string;
  category: string;
  mutualConnections?: number;
  location?: string;
  followers?: number;
}

// --- Subcomponent: Decoupled Discovery Item Card ---
interface DiscoveryItemCardProps {
  item: DiscoveryItem;
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  onAction: (id: string, type: string) => void;
}

const DiscoveryItemCard: React.FC<DiscoveryItemCardProps> = React.memo(({ item, onAction }) => {
  const handleAction = useCallback(() => onAction(item.id, item.type), [item.id, item.type, onAction]);

  const renderIcon = useCallback((type: string) => {
    switch (type) {
    case 'member':
      return <MemberGroupIcon className="h-5 w-5 text-gray-500" />;
    case 'group':
      return <MemberGroupIcon className="h-5 w-5 text-gray-500" />;
    case 'location':
      return <MapPinIcon className="h-5 w-5 text-gray-500" />;
    case 'content':
      return <BookOpenIcon className="h-5 w-5 text-gray-500" />;
    default:
      return <MemberGroupIcon className="h-5 w-5 text-gray-500" />;
    }
  }, []);

  const getActionButton = useCallback(() => {
    switch (item.type) {
    case 'member':
      return (
        <button
          onClick={handleAction}
          className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg"
        >
          <UserPlusIcon className="h-4 w-4 mr-1" />
            Connect
        </button>
      );
    case 'group':
      return (
        <button
          onClick={handleAction}
          className="flex items-center text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg"
        >
            Join
        </button>
      );
    case 'content':
    case 'location':
      return (
        <button
          onClick={handleAction}
          className="flex items-center text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-lg"
        >
            Follow
        </button>
      );
    default:
      return null;
    }
  }, [item.type, handleAction]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
      <div className="flex items-start">
        <img
          src={item.avatar}
          alt={item.title}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-4 flex-1">
          <div className="flex items-center">
            <h3 className="font-bold text-gray-900">
              {item.title}
            </h3>
            {renderIcon(item.type)}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {item.description}
          </p>
          <div className="flex items-center mt-2 text-xs text-slate-700">
            <span className="bg-blue-100 text-blue-950 border border-blue-400 font-bold px-2 py-0.5 rounded-full font-black">
              {item.category}
            </span>
            {item.mutualConnections && (
              <span className="ml-2">
                • {item.mutualConnections} mutual connections
              </span>
            )}
            {item.location && (
              <span className="ml-2 flex items-center">
                <MapPinIcon className="h-3 w-3 mr-1" /> {item.location}
              </span>
            )}
            {item.followers && (
              <span className="ml-2">
                • {item.followers.toLocaleString()} followers
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          {getActionButton()}
        </div>
      </div>
    </div>
  );
});

DiscoveryItemCard.displayName = 'DiscoveryItemCard';

const DiscoveryPage: React.FC = () => {
  // eslint-disable-next-line no-unused-vars
  const { ficBalance, openModal, showToast, handleAiAssist: _handleAiAssist } = useAppContext();
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const { posts: _posts, loading, error: _error, refreshPosts: _refreshPosts } = useCommunityPosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [discoveryItems, setDiscoveryItems] = useState<DiscoveryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for discovery items
  useEffect(() => {
    const mockItems: DiscoveryItem[] = [
      {
        id: '1',
        title: 'Tech Innovators Community',
        description: 'A group for discussing the latest in technology',
        type: 'group',
        avatar: 'https://placehold.co/40x40/4F46E5/FFFFFF?text=TC',
        category: 'Technology',
        mutualConnections: 12
      },
      {
        id: '2',
        title: 'Sarah Johnson',
        description: 'Digital marketing specialist with 5+ years experience',
        type: 'member',
        avatar: 'https://placehold.co/40x40/EC4899/FFFFFF?text=SJ',
        category: 'Marketing',
        mutualConnections: 5
      },
      {
        id: '3',
        title: 'Lagos, Nigeria',
        description: 'Discover content from your location',
        type: 'location',
        avatar: 'https://placehold.co/40x40/10B981/FFFFFF?text=LA',
        category: 'Location',
        followers: 2450
      },
      {
        id: '4',
        title: 'New Music Release: Midnight Dreams',
        description: 'Latest album from Luna Eclipse',
        type: 'content',
        avatar: 'https://placehold.co/40x40/8B5CF6/FFFFFF?text=MD',
        category: 'Music',
        followers: 15000
      },
      {
        id: '5',
        title: 'Dr. Michael Chen',
        description: 'AI researcher and educator',
        type: 'member',
        avatar: 'https://placehold.co/40x40/F59E0B/FFFFFF?text=MC',
        category: 'Education',
        mutualConnections: 8
      },
      {
        id: '6',
        title: 'Indie Film Festival',
        description: 'Discover independent films from emerging filmmakers',
        type: 'content',
        avatar: 'https://placehold.co/40x40/EF4444/FFFFFF?text=IF',
        category: 'Film',
        followers: 8900
      }
    ];

    setDiscoveryItems(mockItems);
    setIsLoading(false);
  }, []);

  const filteredItems = discoveryItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleItemAction = useCallback((id: string, type: string) => {
    switch (type) {
    case 'member':
      showToast('Connection request sent!');
      break;
    case 'group':
      showToast('Successfully joined!');
      break;
    case 'content':
    case 'location':
      showToast('You are now following this content!');
      break;
    }
  }, [showToast]);

  if (loading || isLoading) {
    return (
      <MainLayout pageTitle="Discovery">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Discovery">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Discover
          </h1>
          <p className="text-gray-600 mt-2">
            Find new people, groups, and content based on your interests
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for people, groups, or content..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-bold border-slate-300 placeholder:text-slate-400" />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'all', label: 'All', icon: MemberGroupIcon },
              { id: 'people', label: 'People', icon: MemberGroupIcon },
              { id: 'groups', label: 'Groups', icon: MemberGroupIcon },
              { id: 'content', label: 'Content', icon: BookOpenIcon },
              { id: 'music', label: 'Music', icon: MusicalNoteIcon },
              { id: 'movies', label: 'Movies', icon: FilmIcon },
              { id: 'education', label: 'Education', icon: AcademicCapIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discovery Items */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Suggested for you
              </h2>
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <DiscoveryItemCard
                    key={item.id}
                    item={item}
                    onAction={handleItemAction}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar with CuratedDiscovery */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Discover More
              </h2>
              <CuratedDiscovery />
            </div>

            {/* FIC Balance Card */}
            <div className="mt-6 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Your FIC Balance</h3>
                  <p className="text-2xl font-bold">
                    {ficBalance.toFixed(2)} FIC
                  </p>
                </div>
                <ShareIcon className="h-12 w-12 opacity-80" />
              </div>
              <button
                onClick={() => openModal('gift', {})}
                className="mt-4 w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Share with Community
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DiscoveryPage;
