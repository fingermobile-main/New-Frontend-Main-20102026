import React, { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { API_BASE_URL } from '../services/api';
import {
  MemberGroupIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  BookOpenIcon,
  UserPlusIcon,
  MusicalNoteIcon,
  FilmIcon,
  AcademicCapIcon,
  SparklesIcon,
  CheckIcon,
  ClockIcon
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
  status?: 'none' | 'pending' | 'connected';
}

// --- Subcomponent: Decoupled Discovery Item Card ---
interface DiscoveryItemCardProps {
  item: DiscoveryItem;
  // eslint-disable-next-line no-unused-vars
  onAction: (id: string, type: string) => void;
}

const DiscoveryItemCard: React.FC<DiscoveryItemCardProps> = React.memo(({ item, onAction }) => {
  const handleAction = useCallback(() => onAction(item.id, item.type), [item.id, item.type, onAction]);

  const renderIcon = useCallback((type: string) => {
    switch (type) {
    case 'member':
      return <MemberGroupIcon className="h-5 w-5 text-slate-600" />;
    case 'group':
      return <MemberGroupIcon className="h-5 w-5 text-slate-600" />;
    case 'location':
      return <MapPinIcon className="h-5 w-5 text-slate-600" />;
    case 'content':
      return <BookOpenIcon className="h-5 w-5 text-slate-600" />;
    default:
      return <MemberGroupIcon className="h-5 w-5 text-slate-600" />;
    }
  }, []);

  const getActionButton = useCallback(() => {
    switch (item.type) {
    case 'member':
      if (item.status === 'connected') {
        return (
          <span className="flex items-center text-xs bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold px-3 py-1.5 rounded-lg shadow-xs">
            <CheckIcon className="h-4 w-4 mr-1 text-emerald-700" />
            Connected
          </span>
        );
      }
      if (item.status === 'pending') {
        return (
          <button
            onClick={handleAction}
            className="flex items-center text-xs bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-bold px-3 py-1.5 rounded-lg transition"
            title="Click to cancel pending invitation"
          >
            <ClockIcon className="h-4 w-4 mr-1 text-amber-700" />
            Pending (Cancel)
          </button>
        );
      }
      return (
        <button
          onClick={handleAction}
          className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs transition"
        >
          <UserPlusIcon className="h-4 w-4 mr-1" />
          Connect
        </button>
      );
    case 'group':
      if (item.status === 'connected') {
        return (
          <button
            onClick={handleAction}
            className="flex items-center text-sm bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold px-3 py-1.5 rounded-lg"
          >
            <CheckIcon className="h-4 w-4 mr-1 text-emerald-700" />
            Joined
          </button>
        );
      }
      return (
        <button
          onClick={handleAction}
          className="flex items-center text-sm bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
        >
          Join
        </button>
      );
    case 'content':
    case 'location':
      if (item.status === 'connected') {
        return (
          <button
            onClick={handleAction}
            className="flex items-center text-sm bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold px-3 py-1.5 rounded-lg"
          >
            <CheckIcon className="h-4 w-4 mr-1 text-emerald-700" />
            Following
          </button>
        );
      }
      return (
        <button
          onClick={handleAction}
          className="flex items-center text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 px-3 py-1.5 rounded-lg transition"
        >
          Follow
        </button>
      );
    default:
      return null;
    }
  }, [item.type, item.status, handleAction]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-300">
      <div className="flex items-start">
        <img
          src={item.avatar}
          alt={item.title}
          className="w-12 h-12 rounded-full object-cover border border-slate-200"
        />
        <div className="ml-4 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900">
              {item.title}
            </h3>
            {renderIcon(item.type)}
          </div>
          <p className="text-sm text-slate-700 mt-1">
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
  const { openModal: _openModal, showToast, handleAiAssist: _handleAiAssist } = useAppContext();
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

  const filteredItems = discoveryItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'people') return item.type === 'member';
    if (activeTab === 'groups') return item.type === 'group';
    if (activeTab === 'content') return item.type === 'content' || item.type === 'location';
    if (activeTab === 'music') return item.category.toLowerCase() === 'music';
    if (activeTab === 'movies') return item.category.toLowerCase() === 'film' || item.category.toLowerCase() === 'movies';
    if (activeTab === 'education') return item.category.toLowerCase() === 'education';

    return true;
  });

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleItemAction = useCallback(async (id: string, type: string) => {
    switch (type) {
    case 'member': {
      const item = discoveryItems.find((i) => i.id === id);
      const isCurrentlyPending = item?.status === 'pending';
      const action = isCurrentlyPending ? 'remove' : 'request';

      try {
        await fetch(`${API_BASE_URL}/v1/profiles/${id}/friend-request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action })
        });
      } catch {
        // Optimistic local state preserved
      }

      setDiscoveryItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, status: isCurrentlyPending ? 'none' : 'pending' }
            : i
        )
      );

      if (isCurrentlyPending) {
        showToast('Connection request cancelled.', 'info');
      } else {
        showToast('Connection request sent!', 'success');
      }
      break;
    }
    case 'group': {
      setDiscoveryItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, status: i.status === 'connected' ? 'none' : 'connected' }
            : i
        )
      );
      showToast('Group membership updated!', 'success');
      break;
    }
    case 'content':
    case 'location': {
      setDiscoveryItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, status: i.status === 'connected' ? 'none' : 'connected' }
            : i
        )
      );
      showToast('Following preferences updated!', 'success');
      break;
    }
    }
  }, [discoveryItems, showToast]);

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
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28 md:pb-12 w-full max-w-full overflow-x-hidden text-slate-900">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Discovery Hub
          </h1>
          <p className="text-slate-700 font-medium mt-2">
            Find new people, groups, and content based on your interests across FingerMobile
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-600" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for people, groups, or content..."
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-bold placeholder:text-slate-400" />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-slate-300">
          <nav className="flex space-x-6 sm:space-x-8 overflow-x-auto pb-1" aria-label="Tabs">
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
                className={`flex items-center py-3 px-2 border-b-2 font-bold text-sm sm:text-base whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
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
              <h2 className="text-xl font-black text-slate-900 mb-4">
                Suggested for you
              </h2>
              <div className="space-y-4">
                {filteredItems.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 border border-slate-300 text-center">
                    <p className="text-slate-700 font-semibold">No discovery items found matching your filter.</p>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <DiscoveryItemCard
                      key={item.id}
                      item={item}
                      onAction={handleItemAction}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right sidebar with CuratedDiscovery */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-300">
              <h2 className="text-lg font-black text-slate-900 mb-4">
                Discover More
              </h2>
              <CuratedDiscovery />
            </div>
          </div>
        </div>
        {/* SOVEREIGN MOBILE NAVIGATION QUICK DOCK */}
        <nav
          aria-label="Discovery Quick Navigation"
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-3 py-2 sm:hidden flex items-center justify-around shadow-lg"
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-xs font-bold transition-colors ${
              activeTab === 'all' ? 'text-blue-600' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <SparklesIcon className="w-5 h-5 mb-0.5" />
            <span>All</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('people');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-xs font-bold transition-colors ${
              activeTab === 'people' ? 'text-blue-600' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <MemberGroupIcon className="w-5 h-5 mb-0.5" />
            <span>People</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('groups');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-xs font-bold transition-colors ${
              activeTab === 'groups' ? 'text-blue-600' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <UserPlusIcon className="w-5 h-5 mb-0.5" />
            <span>Groups</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('content');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-xs font-bold transition-colors ${
              activeTab === 'content' ? 'text-blue-600' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <BookOpenIcon className="w-5 h-5 mb-0.5" />
            <span>Content</span>
          </button>
        </nav>

      </div>
    </MainLayout>
  );
};

export default DiscoveryPage;
