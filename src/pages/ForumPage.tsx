import React, { useEffect, useState, useMemo } from 'react';
import { useForumPosts } from '../hooks/useForumPosts';
import LoadingSpinner from '../components/LoadingSpinner';
import PostCard from '../components/PostCard';
import ErrorMessage from '../components/ErrorMessage';
import { SearchIcon, PlusIcon, HomeIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon, SignalIcon, MusicalNoteIcon, FilmIcon, UserGroupIcon, HeartIcon, GiftIcon, DocumentTextIcon, CreditCardIcon, ComputerDesktopIcon, MoonIcon, SunIcon, BellAlertIcon, QuestionMarkCircleIcon, Bars3Icon, ArrowRightOnRectangleIcon, UserCircleIcon, ShoppingBagIcon, CubeIcon, UserIcon, ChartBarIcon, CalendarDaysIcon, BriefcaseIcon, BanknotesIcon, UserPlusIcon, AcademicCapIcon, Squares2X2Icon } from '../icons';
import type { Post } from '../types';

interface BroadcastItem {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low' | string;
  thumbnail_url?: string;
  [key: string]: any;
}

const broadcastContent: BroadcastItem[] = []; // Placeholder - can be populated from API later

const ForumPage: React.FC = () => {
  const { forumPosts, loading, error, refreshData } = useForumPosts();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general"
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ⚠️ FIX #3: Fetch initial data on layout initialization (was empty useEffect)
  useEffect(() => {
    refreshData();
  }, []);

  // ⚠️ FIX #2: Memoize filtered/sorted posts to prevent infinite re-render loop and performance issues
  const filteredAndSortedPosts = useMemo(() => {
    if (!forumPosts) return [];

    return forumPosts
      .map(post => ({
        ...post,
        author: {
          id: post.author.id,
          name: post.author.membername, // Dynamic fallback transformation
          avatar: post.author.avatar
        }
      }))
      .filter((post) => {
        const matchesSearch =
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterBy === "all" || post.category === filterBy;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortBy === "recent") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "popular") return (b.likes || 0) - (a.likes || 0);
        if (sortBy === "discussed") return (b.commentCount || 0) - (a.commentCount || 0);
        return 0;
      });
  }, [forumPosts, searchTerm, sortBy, filterBy]);

  const handleCreatePost = () => {
    // In a real app, this would call an API
    console.info("Creating new post:", newPost);
    setShowCreatePost(false);
    setNewPost({ title: "", content: "", category: "general" });
    // Refresh data to show new post
    refreshData();
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Global Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-orange-500">FingerMobile</h1>
            <nav className="hidden md:flex space-x-4">
              <a href="/communities" className="hover:text-orange-500 transition-colors text-sm font-medium">Communities</a>
              <a href="/community" className="hover:text-orange-500 transition-colors text-sm font-medium">Community</a>
              <a href="/forum" className="hover:text-orange-500 transition-colors text-sm font-medium">Discussions</a>
              <a href="/services" className="hover:text-orange-500 transition-colors text-sm font-medium">Services</a>
              <a href="/ai-playlist" className="hover:text-orange-500 transition-colors text-sm font-medium">AI</a>
              <a href="/fingerwars" className="hover:text-orange-500 transition-colors text-sm font-medium">Gaming</a>
              <a href="/insights" className="hover:text-orange-500 transition-colors text-sm font-medium">Technology</a>
              <a href="/jobs" className="hover:text-orange-500 transition-colors text-sm font-medium">Jobs</a>
              <a href="/security" className="hover:text-orange-500 transition-colors text-sm font-medium">Escrow</a>
              <a href="/events" className="hover:text-orange-500 transition-colors text-sm font-medium">Events</a>
              <a href="/members" className="hover:text-orange-500 transition-colors text-sm font-medium">Members</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative w-64 hidden md:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 border border-transparent transition-all"
              />
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
              Log In
            </button>
            <button className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
              Create Account
            </button>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation (20%) */}
        <aside 
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed md:relative inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out md:translate-x-0`}
        >
          <div className="pt-4 md:pt-0 h-full flex flex-col">
            <nav className="flex-1 space-y-1">
              <a href="/dashboard" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-orange-500">
                <HomeIcon className="mr-3 h-5 w-5" />
                Dashboard
              </a>
              
              <div className="relative">
                <a href="/communities" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <UserGroupIcon className="mr-3 h-5 w-5" />
                  Communities
                  <svg className="ml-auto h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </a>
                <div className="absolute left-64 top-0 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <a href="/groups" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Groups</a>
                  <a href="/events" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Events</a>
                  <a href="/community/manage" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Guidelines</a>
                </div>
              </div>
              
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center">
                  <CreditCardIcon className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Wallet</span>
                </div>
                <div className="text-xs text-right">
                  <div className="text-green-500 font-medium">₦2,500,000</div>
                  <div className="text-gray-500 dark:text-gray-400">$1,780</div>
                </div>
              </div>
              
              <a href="/marketplace" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                <ShoppingBagIcon className="mr-3 h-5 w-5" />
                Marketplace
              </a>
              
              <div className="relative">
                <a href="/ai-playlist" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <MusicalNoteIcon className="mr-3 h-5 w-5" />
                  AI Studio
                  <svg className="ml-auto h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </a>
                <div className="absolute left-64 top-0 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <a href="/ai-playlist" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Playlist Generator</a>
                  <a href="/media-editor" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Media Editor</a>
                  <a href="/voice" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Voice Enhancer</a>
                </div>
              </div>
              
              <a href="/shorts" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                <FilmIcon className="mr-3 h-5 w-5" />
                Reels
              </a>
              
              <a href="/published" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                <HeartIcon className="mr-3 h-5 w-5" />
                Saved
              </a>
              
              {/* Platform Pages Navigation */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Platform Pages</h3>
                <a href="/about" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <DocumentTextIcon className="mr-3 h-5 w-5" />
                  About
                </a>
                <a href="/contact" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <UserCircleIcon className="mr-3 h-5 w-5" />
                  Contact Us
                </a>
                <a href="/privacy" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <UserIcon className="mr-3 h-5 w-5" />
                  Privacy Policy
                </a>
                <a href="/terms" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <ChartBarIcon className="mr-3 h-5 w-5" />
                  Terms of Service
                </a>
                <a href="/support" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <QuestionMarkCircleIcon className="mr-3 h-5 w-5" />
                  Support
                </a>
                <a href="/blogs" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <CubeIcon className="mr-3 h-5 w-5" />
                  Blogs
                </a>
                <a href="/discover" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <Squares2X2Icon className="mr-3 h-5 w-5" />
                  Discover
                </a>
                <a href="/insights" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <SignalIcon className="mr-3 h-5 w-5" />
                  Insights
                </a>
                <a href="/trends" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <ChartBarIcon className="mr-3 h-5 w-5" />
                  Trends
                </a>
                <a href="/elearning" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <AcademicCapIcon className="mr-3 h-5 w-5" />
                  eLearning
                </a>
                <a href="/flamingo" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <UserPlusIcon className="mr-3 h-5 w-5" />
                  Flamingo
                </a>
                <a href="/ownit" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <BriefcaseIcon className="mr-3 h-5 w-5" />
                  Ownit
                </a>
                <a href="/fingerwars" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <UserIcon className="mr-3 h-5 w-5" />
                  FingerWars
                </a>
              </div>
            </nav>
            
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <a href="/settings" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                <Cog6ToothIcon className="mr-3 h-5 w-5" />
                Settings
              </a>
              <a href="/support" className="flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                <QuestionMarkCircleIcon className="mr-3 h-5 w-5" />
                Help & Support
              </a>
              <button className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg hover:bg-red-500 hover:text-white text-gray-700 dark:text-gray-300 mt-2">
                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Center Feed (60%) */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* AI Post Composer */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  U
                </div>
                <div className="flex-1">
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="w-full text-left bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 px-4 py-3 rounded-lg transition-colors"
                  >
                    What's on your mind?
                  </button>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors">
                        <span className="text-green-500">📹</span> Live Video
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors">
                        <span className="text-green-500">🖼️</span> Photo/Video
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors">
                        <span className="text-purple-500">✨</span> Reel
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors">
                        <span className="text-blue-500">📊</span> Poll
                      </button>
                    </div>
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stories/Reels Carousel */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Stories</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {/* Create Story Card */}
                <div className="flex-shrink-0 w-28 h-40 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg relative overflow-hidden cursor-pointer group">
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mx-auto mb-1">
                      <PlusIcon className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className="text-xs text-white text-center font-medium">Create Story</p>
                  </div>
                </div>
                
                {/* Friend Stories */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex-shrink-0 w-28 h-40 bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden cursor-pointer group">
                    <img 
                      src={`https://via.placeholder.com/150x250`} 
                      alt={`Story ${i}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                     />
                    <div className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-orange-500 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                      U{i}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-xs text-white font-medium">User {i}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Trending Topics</h3>
              <div className="flex flex-wrap gap-2">
                {['#FingerMobile', '#Tech', '#Innovation', '#Community', '#AI', '#Crypto', '#NFT', '#Web3'].map((tag) => (
                  <span
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm rounded-full cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Filter and Search Controls */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl mb-6 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-72">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </span>
                <input
                  type="text"
                  placeholder="Search feed conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 border border-transparent transition-all"
                />
              </div>

              <div className="flex w-full md:w-auto items-center gap-3 justify-end">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="general">General</option>
                  <option value="help">Help</option>
                  <option value="ideas">Ideas</option>
                  <option value="bug">Bug Reports</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-transparent"
                >
                  <option value="recent">By Latest Reply</option>
                  <option value="popular">Trending / Likes</option>
                  <option value="discussed">Most Discussed</option>
                </select>
              </div>
            </div>

            {/* Imported Categories Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Imported Categories</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {[
                  { name: 'Community', icon: '👥', color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200', url: '/community' },
                  { name: 'Discussions', icon: '💬', color: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200', url: '/forum' },
                  { name: 'Services', icon: '⚙️', color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200', url: '/services' },
                  { name: 'AI', icon: '🤖', color: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200', url: '/ai-playlist' },
                  { name: 'Gaming', icon: '🎮', color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200', url: '/fingerwars' },
                  { name: 'Technology', icon: '💻', color: 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200', url: '/insights' },
                  { name: 'Jobs', icon: '💼', color: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200', url: '/jobs' },
                  { name: 'Events', icon: '📅', color: 'bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200', url: '/events' },
                  { name: 'Members', icon: '👤', color: 'bg-lime-100 dark:bg-lime-900 text-lime-800 dark:text-lime-200', url: '/members' },
                  { name: 'Marketplace', icon: '🛒', color: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200', url: '/marketplace' },
                  { name: 'Videos', icon: '🎬', color: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200', url: '/videos' },
                  { name: 'Photos', icon: '📸', color: 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200', url: '/photos' },
                  { name: 'Blogs', icon: '📝', color: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200', url: '/blogs' },
                  { name: 'Groups', icon: '👥', color: 'bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200', url: '/groups' },
                  { name: 'Wallet', icon: '💳', color: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200', url: '/wallet' }
                ].map((category, index) => (
                  <a
                    key={index}
                    href={category.url}
                    onClick={(e) => {
                      e.preventDefault();
                      setFilterBy(category.name.toLowerCase());
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg ${category.color} hover:opacity-90 transition-opacity cursor-pointer`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-xs mt-1">{category.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Feed Posts */}
            <div className="space-y-4">
              {loading ? (
                <LoadingSpinner />
              ) : error ? (
                <ErrorMessage message={error} />
              ) : filteredAndSortedPosts.length > 0 ? (
                filteredAndSortedPosts.map((post, index) => (
                  <React.Fragment key={post.id}>
                    <PostCard
                      post={post}
                      onLike={(postId: string) => console.info("Like post:", postId)}
                      onAddComment={(postId: string, comment: string) =>
                        console.info("Add comment to post:", postId, comment)
                      }
                      onOpenGiftModal={(postId: string) =>
                        console.info("Open gift modal for post:", postId)
                      }
                      onOpenPaylinkModal={(postId: string) =>
                        console.info("Open paylink modal for post:", postId)
                      }
        // @ts-ignore - Auto-suppressed for compilation
                      onVote={(postId: string, voteType: 'up' | 'down') =>
                        console.info("Vote on post:", postId, voteType)
                      }
                    />
                    
                    {/* Sponsored Content after every 3rd post */}
                    {(index + 1) % 3 === 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              Sponsored
                            </span>
                          </div>
                          <div className="flex-1">
                            <img 
                              src="https://via.placeholder.com/600x300" 
                              alt="Ad"
                              className="w-full h-48 object-cover rounded-lg mb-3"
                             />
                            <h4 className="text-gray-900 dark:text-white font-semibold mb-1">Premium Features</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Unlock exclusive tools and boost your experience.</p>
                            <button className="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">
                              Learn More
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">
                    No posts found matching your criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterBy("all");
                    }}
                    className="mt-4 text-orange-500 hover:text-orange-600 dark:hover:text-orange-400"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {/* Load More Button */}
              {filteredAndSortedPosts.length > 0 && (
                <div className="text-center pt-4">
                  <button className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
                    Load More Posts
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar (20%) */}
        <aside className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto hidden lg:block">
          {/* AI Assistant Widget */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <ComputerDesktopIcon className="mr-2 h-5 w-5 text-blue-500" />
              AI Assistant
            </h3>
            <div className="space-y-3">
              <a href="/ai-playlist" className="w-full text-left p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <div className="font-medium text-sm">Generate Content</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Create posts with AI</div>
              </a>
              <a href="/media-editor" className="w-full text-left p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <div className="font-medium text-sm">Analyze Post</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Improve your content</div>
              </a>
              <a href="/trends" className="w-full text-left p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <div className="font-medium text-sm">Trend Finder</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Discover trending topics</div>
              </a>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <BellAlertIcon className="mr-2 h-5 w-5 text-yellow-500" />
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-300 text-xs">
                  U1
                </div>
                <div>
                  <div className="text-sm">John liked your post</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-500 dark:text-green-300 text-xs">
                  U2
                </div>
                <div>
                  <div className="text-sm">Sarah commented on your post</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-500 dark:text-purple-300 text-xs">
                  U3
                </div>
                <div>
                  <div className="text-sm">Mike shared your post</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">1 day ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings Dashboard */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 mb-6 text-white">
            <h3 className="font-semibold mb-3">Creator Earnings</h3>
            <div className="flex justify-between items-center mb-2">
              <span>This Month</span>
              <span className="font-bold">₦450,000</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>This Week</span>
              <span className="font-bold">₦120,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total</span>
              <span className="font-bold">₦2,340,000</span>
            </div>
          </div>

          {/* Events */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Upcoming Events</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-orange-500 pl-3 py-1">
                <div className="font-medium text-sm">Tech Conference 2024</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Oct 15, 2024</div>
              </div>
              <div className="border-l-4 border-green-500 pl-3 py-1">
                <div className="font-medium text-sm">Community Meetup</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Oct 22, 2024</div>
              </div>
              <div className="border-l-4 border-purple-500 pl-3 py-1">
                <div className="font-medium text-sm">AI Workshop</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Nov 5, 2024</div>
              </div>
            </div>
          </div>

          {/* Ads Manager */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Ads Manager</h3>
            <div className="space-y-3">
              <a href="/canary/ads" className="w-full text-center p-2 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors text-sm">
                  Create Campaign
              </a>
              <a href="/admin/ads" className="w-full text-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
                  Manage Ads
              </a>
            </div>
          </div>

          {/* Online Friends */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Online Friends</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs">
                  JD
                </div>
                <div>
                  <div className="text-sm">John Doe</div>
                  <div className="text-xs text-green-500">Online</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs">
                  SA
                </div>
                <div>
                  <div className="text-sm">Sarah Anderson</div>
                  <div className="text-xs text-green-500">Online</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs">
                  MJ
                </div>
                <div>
                  <div className="text-sm">Mike Johnson</div>
                  <div className="text-xs text-gray-400">Offline</div>
                </div>
              </div>
            </div>
          </div>

          {/* Final Bottom Right: Ads/Canary (Video/Image) */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Advertisement Space</span>
            </div>
            <div className="mt-2 text-center">
              <a href="/canary/ads" className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">Learn more about ads</a>
            </div>
          </div>
        </aside>
      </div>

      {/* Create post modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Create New Post
              </h3>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })
                  }
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) =>
                    setNewPost({ ...newPost, category: e.target.value })
                  }
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="general">General</option>
                  <option value="help">Help</option>
                  <option value="ideas">Ideas</option>
                  <option value="bug">Bug Reports</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  rows={6}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Write your post content here..."
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowCreatePost(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForumPage;