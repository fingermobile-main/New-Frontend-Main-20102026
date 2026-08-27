import React, { useState, useEffect } from 'react';
import { useForumPosts } from '../hooks/useForumPosts';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  PlusCircleIcon, 
  ChatBubbleLeftRightIcon, 
  BellAlertIcon, 
  VideoCameraIcon, 
  UserCircleIcon, 
  Cog6ToothIcon, 
  Squares2X2Icon,
  ShoppingBagIcon,
  PuzzlePieceIcon as Gamepad2Icon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  ArrowDownTrayIcon,
  PaperAirplaneIcon,
  ArrowPathIcon as RefreshIcon,
  PhotoIcon,
  VideoCameraIcon as VideoCameraSolidIcon,
  MicrophoneIcon,
  EllipsisHorizontalIcon,
  BellAlertIcon as BellIconSolid,
  PlusIcon,
  FireIcon,
  GiftIcon,
  UserGroupIcon,
  RadioIcon,
  ChatBubbleLeftIcon as ChatBubbleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, ChatBubbleLeftIcon as MessageCircleIcon } from '@heroicons/react/24/solid';

const HomePage: React.FC = () => {
  const { forumPosts, loading, error, refreshData } = useForumPosts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    refreshData();
  }, []);

  // Mock data for stories
  const stories = [
    { id: 1, user: 'Create Story', isOwn: true },
    { id: 2, user: 'Chijioke', avatar: 'https://i.pravatar.cc/80?img=5' },
    { id: 3, user: 'Amara', avatar: 'https://i.pravatar.cc/80?img=32' },
    { id: 4, user: 'Tunde', avatar: 'https://i.pravatar.cc/80?img=47' },
    { id: 5, user: 'Bella', avatar: 'https://i.pravatar.cc/80?img=12' },
  ];

  // Mock data for suggested follows
  const suggestedFollows = [
    { id: 1, name: 'Bella E.', handle: '@bellae' },
    { id: 2, name: 'Shorts Creator', handle: '@shortz' },
    { id: 3, name: 'Financials', handle: '@ficvault' },
  ];

  // Mock data for trending topics
  const trendingTopics = [
    { tag: '#FingerWars', category: 'Games', posts: '1.2m' },
    { tag: '#GemsDrop', category: 'Entertainment', posts: '' },
    { tag: '#Hallmark', category: 'Life', posts: '' },
    { tag: '#FingerLux', category: 'Luxury', posts: '' },
  ];

  // Toggle like for a post
  const toggleLike = (postId: string) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Left Sidebar (20% on desktop) */}
      <aside className="hidden md:flex flex-col w-1/5 p-3 py-4 border-r border-gray-700 bg-gray-900 sticky top-0 h-screen">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 px-3 mb-6">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500 text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
            </svg>
          </span>
          <span className="font-bold text-lg">
            Finger<span className="text-orange-500">Mobile</span><br/>
            <span className="text-xs text-gray-400">FEED.PROTOCOL</span>
          </span>
        </a>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold bg-gray-800 text-orange-500">
            <HomeIcon className="h-5 w-5 text-orange-500" />
            Home
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            Discover
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M17.5 17.5 16 16"></path>
              <circle cx="12" cy="10" r="3"></circle>
              <path d="M17.932 21.583A20 20 0 0 1 16 16l-2.5-2.5"></path>
              <path d="M2 12h2a8 8 0 0 0 8 8"></path>
              <path d="M9.828 9.172a4 4 0 0 1 5.656 0"></path>
            </svg>
            Shorts
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-100">
            <UserGroupIcon className="h-5 w-5" />
            Groups
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-100">
            <RadioIcon className="h-5 w-5" />
            Live
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-100">
            <ChatBubbleIcon className="h-5 w-5" />
            Messages
            <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-500">3</span>
          </a>
          <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-100">
            <BellAlertIcon className="h-5 w-5" />
            Notifications
            <span className="ml-auto w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          </a>
        </nav>

        {/* More Apps */}
        <div className="mt-4 px-3 pt-4 border-t border-gray-700">
          <p className="text-xs tracking-widest text-gray-400 mb-2">● MORE · APPS</p>
          <div className="flex flex-col gap-1 text-[13px]">
            <a href="/marketplace" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800">
              <ShoppingBagIcon className="h-4 w-4" />
              Marketplace
            </a>
            <a href="/fingerwars" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800">
              <Gamepad2Icon className="h-4 w-4" />
              FingerWars
            </a>
            <a href="/gems" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M6 3v12a6 6 0 0 0 12 0V3"></path>
                <path d="M6 21v-6a3 3 0 0 1 6 0v6"></path>
                <path d="M18 21v-6a3 3 0 0 0-6 0v6"></path>
              </svg>
              Gems
            </a>
            <a href="/wallet" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"></path>
                <path d="M12 11h6"></path>
                <path d="M15 8v7"></path>
                <path d="M5 18H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2Z"></path>
              </svg>
              Wallet
            </a>
          </div>
        </div>

        {/* User Profile */}
        <div className="mt-auto flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700">
          <div className="relative">
            <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-gray-800 animate-pulse"></span>
            <img src="https://i.pravatar.cc/72?img=12" className="w-9 h-9 rounded-full object-cover" alt="User" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-semibold truncate">Kemi Afolabi</p>
            <p className="text-xs text-gray-400 truncate">@kemifo · 4.2k</p>
          </div>
          <EllipsisHorizontalIcon className="h-4 w-4 text-gray-400" />
        </div>
      </aside>

      {/* Main Feed Content (60% on desktop, 75% on tablet) */}
      <main className="flex-1 md:w-3/5 lg:w-2/3 min-h-screen border-r border-gray-700 flex flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 border-b border-gray-700 bg-gray-900/90 backdrop-blur justify-between">
          <button onClick={() => setMobileMenuOpen(true)}>
            <Bars3Icon className="h-6 w-6 text-gray-100" />
          </button>
          <span className="font-bold text-[15px]">Finger<span className="text-orange-500">Mobile</span></span>
          <div className="flex-1"></div>
          <button>
            <BellAlertIcon className="h-5 w-5 text-gray-400" />
          </button>
          <button>
            <PlusIcon className="h-6 w-6 text-gray-400" />
          </button>
        </header>

        {/* Desktop header */}
        <header className="hidden md:flex sticky top-0 z-30 items-center gap-4 px-6 py-4 border-b border-gray-700 bg-gray-900/90 backdrop-blur justify-between">
          <div>
            <h1 className="text-[20px] font-bold">Home Feed</h1>
            <p className="text-xs text-gray-400 mt-1">⚡ TTFB 312ms · GET /feed?pageSize=20&cursor=…</p>
          </div>
          <div className="relative w-64">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input 
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-[13px] outline-none focus:border-orange-500" 
              placeholder="Search FingerMobile…" 
            />
          </div>
        </header>

        {/* Feed Stream */}
        <div className="flex-1 px-4 md:px-6 py-4 md:py-6 space-y-4 max-w-[640px] mx-auto w-full">
          {/* Composer */}
          <section className="block bg-gray-800 border border-gray-700 rounded-2xl p-3.5">
            <div className="flex items-start gap-3">
              <img src="https://i.pravatar.cc/80?img=12" className="w-10 h-10 rounded-full object-cover" alt="User" />
              <div className="flex-1">
                <p className="text-[13px] text-gray-400 leading-tight">What's on your mind?</p>
                <div className="mt-2.5 flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-gray-700 text-orange-500">
                    <PhotoIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-700 text-orange-500">
                    <VideoCameraSolidIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-700 text-orange-500">
                    <MicrophoneIcon className="h-5 w-5" />
                  </button>
                  <div className="flex-1"></div>
                  <button className="px-4 py-2 rounded-xl bg-orange-500 text-gray-900 text-[13px] font-bold hover:opacity-90">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Story Pills */}
          <section className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <span className="w-16 h-16 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-orange-500">
                <PlusIcon className="h-5 w-5" />
              </span>
              <span className="text-[10.5px] text-gray-400">Create</span>
            </div>
            {stories.slice(1).map(story => (
              <div key={story.id} className="flex flex-col items-center gap-1.5 shrink-0">
                <span className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-orange-500 via-yellow-500 to-orange-500">
                  <img src={story.avatar} className="w-full h-full rounded-full object-cover border-2 border-gray-800" alt={story.user} />
                </span>
                <span className="text-[10.5px] text-gray-100">{story.user}</span>
              </div>
            ))}
          </section>

          {/* Sample Posts - In a real app, these would come from the API */}
          <article className="block bg-gray-800 border border-gray-700 rounded-2xl p-3.5 animate-fadeIn">
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/100?img=32" className="w-11 h-11 rounded-xl object-cover" alt="User" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[14px] font-bold truncate">Amara Okafor</p>
                  <span className="text-xs px-1.5 py-0.5 rounded-md bg-orange-500/15 text-orange-500 border border-orange-500/20">VERIFIED</span>
                </div>
                <p className="text-xs text-gray-400">@amara · 12m · ⚡ push</p>
              </div>
              <EllipsisHorizontalIcon className="h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-3 text-[13.5px] leading-relaxed">🔥 The new <b>FingerWars</b> patch dropped — ranked mode is LIVE now. Who's climbing tonight? P.S. don't sleep on the marketplace drop. 💎🎮</p>
            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&q=70" className="mt-3 w-full aspect-video object-cover rounded-xl" alt="Post content" />
            <div className="mt-3.5 flex items-center gap-5 text-gray-400">
              <button 
                onClick={() => toggleLike('post1')}
                className="flex items-center gap-1.5 hover:text-orange-500"
              >
                {likedPosts['post1'] ? (
                  <HeartIconSolid className="h-[18px] w-[18px] text-orange-500" />
                ) : (
                  <HeartIcon className="h-[18px] w-[18px]" />
                )}
                <span className="text-[11px]">12.4k</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-gray-100">
                <ChatBubbleLeftRightIcon className="h-[18px] w-[18px]" />
                <span className="text-[11px]">328</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-orange-500">
                <RefreshIcon className="h-[18px] w-[18px]" />
                <span className="text-[11px]">961</span>
              </button>
              <div className="flex-1"></div>
              <button>
                <PaperAirplaneIcon className="h-[18px] w-[18px] hover:text-orange-500" />
              </button>
            </div>
          </article>

          <article className="block bg-gray-800 border border-gray-700 rounded-2xl p-3.5 animate-fadeIn">
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/100?img=5" className="w-11 h-11 rounded-xl object-cover" alt="User" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[14px] font-bold truncate">Chijioke N.</p>
                  <span className="text-xs px-1.5 py-0.5 rounded-md bg-yellow-500/15 text-yellow-500 border border-yellow-500/20">CREATOR</span>
                </div>
                <p className="text-xs text-gray-400">@cnw · 4h · ⚡ push</p>
              </div>
              <EllipsisHorizontalIcon className="h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-3 text-[13.5px] leading-relaxed">Just closed my first storefront sale on the #Marketplace 🥳. Two clicks to payout. The whole-line MVP is feeling fast.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=70" className="aspect-square object-cover rounded-lg" alt="Post content" />
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=70" className="aspect-square object-cover rounded-lg" alt="Post content" />
            </div>
            <div className="mt-3.5 flex items-center gap-5 text-gray-400">
              <button 
                onClick={() => toggleLike('post2')}
                className="flex items-center gap-1.5 hover:text-orange-500"
              >
                {likedPosts['post2'] ? (
                  <HeartIconSolid className="h-[18px] w-[18px] text-orange-500" />
                ) : (
                  <HeartIcon className="h-[18px] w-[18px]" />
                )}
                <span className="text-[11px]">8.1k</span>
              </button>
              <button className="flex items-center gap-1.5">
                <ChatBubbleLeftRightIcon className="h-[18px] w-[18px]" />
                <span className="text-[11px]">214</span>
              </button>
              <button className="flex items-center gap-1.5">
                <RefreshIcon className="h-[18px] w-[18px]" />
                <span className="text-[11px]">512</span>
              </button>
              <div className="flex-1"></div>
              <button>
                <PaperAirplaneIcon className="h-[18px] w-[18px]" />
              </button>
            </div>
          </article>

          {/* Load more button */}
          <button className="w-full py-3 rounded-xl border border-dashed border-gray-700 text-[13px] text-gray-400 hover:border-orange-500 hover:text-orange-500 transition">
            ⏳ next cursor · load more (pageSize=20)
          </button>

          {/* Footer telemetry */}
          <div className="text-center py-4">
            <p className="text-xs text-gray-400"><span className="text-orange-500">●</span> reach tail · LCP 428ms · cursor=MTQ1ODMxMj...</p>
          </div>
        </div>
      </main>

      {/* Right Sidebar (20% on desktop) */}
      <aside className="hidden lg:flex flex-col py-4 px-4 gap-4 overflow-y-auto w-1/5 bg-gray-900">
        {/* Search card */}
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input 
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-[13px] outline-none focus:border-orange-500" 
            placeholder="Search FingerMobile…" 
          />
        </div>

        {/* Suggested follows */}
        <section className="bg-gray-800 border border-gray-700 rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-[13px] font-bold">Suggested to follow</h3>
            <RefreshIcon className="h-3.5 w-3.5 text-gray-400" />
          </div>
          {suggestedFollows.map(user => (
            <div key={user.id} className="flex items-center gap-2.5 py-2">
              <img src={`https://i.pravatar.cc/72?img=${user.id}`} className="w-9 h-9 rounded-full" alt={user.name} />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold truncate">{user.name}</p>
                <p className="text-xs text-gray-400">{user.handle}</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-orange-500/15 text-orange-500 text-[11px] font-bold hover:bg-orange-500 hover:text-gray-900">
                Follow
              </button>
            </div>
          ))}
          <button className="w-full mt-2 text-left text-[12px] font-semibold text-orange-500">Show more</button>
        </section>

        {/* Trending */}
        <section className="bg-gray-800 border border-gray-700 rounded-2xl p-3.5">
          <h3 className="text-[13px] font-bold mb-2.5">Trending now</h3>
          <div className="space-y-2.5">
            {trendingTopics.map((topic, index) => (
              <a key={index} href="#" className="block">
                <p className="text-[11px] text-gray-400">{topic.category}{topic.posts && ` · ${topic.posts}`}</p>
                <p className="text-[13px] font-semibold">{topic.tag}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Creator spot */}
        <section className="bg-gradient-to-tr from-gray-800 to-orange-500/15 border border-gray-700 rounded-2xl p-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] font-bold">Live now</h3>
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          </div>
          <div className="mt-2 rounded-xl overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=60" className="w-full h-24 object-cover" alt="Live stream" />
            <span className="absolute top-1.5 left-1.5 text-[9px] px-1.5 py-0.5 rounded bg-black/60 text-orange-500">● LIVE</span>
          </div>
          <button className="mt-2 w-full py-2 rounded-lg bg-orange-500 text-gray-900 text-[12px] font-bold">Watch now</button>
        </section>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur border-t border-gray-700 flex items-center justify-around h-16">
        <a href="/" className="flex flex-col items-center gap-0.5 text-orange-500">
          <HomeIcon className="h-5 w-5" />
          <span className="text-[9px] font-semibold">Home</span>
        </a>
        <a href="/discover" className="flex flex-col items-center gap-0.5 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span className="text-[9px]">Discover</span>
        </a>
        <button className="-mt-5">
          <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500 text-gray-900 shadow-lg">
            <PlusIcon className="h-6 w-6" />
          </span>
        </button>
        <a href="/messages" className="flex flex-col items-center gap-0.5 text-gray-400">
          <MessageCircleIcon className="h-5 w-5" />
          <span className="text-[9px]">Mail</span>
        </a>
        <a href="/profile" className="flex flex-col items-center gap-0.5 text-gray-400">
          <img src="https://i.pravatar.cc/40?img=12" className="w-5 h-5 rounded-full" alt="User" />
          <span className="text-[9px]">Me</span>
        </a>
      </nav>

      {/* Mobile drawer overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <aside className="fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-gray-900 border-r border-gray-700 p-4 md:hidden flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <span className="font-bold text-[16px]">Finger<span className="text-orange-500">Mobile</span></span>
            <button onClick={() => setMobileMenuOpen(false)}>
              <XMarkIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-800 text-gray-100 text-[14px] font-semibold">
              <HomeIcon className="h-5 w-5 text-orange-500" />
              Home
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 text-[14px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              Discover
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 text-[14px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M17.5 17.5 16 16"></path>
                <circle cx="12" cy="10" r="3"></circle>
                <path d="M17.932 21.583A20 20 0 0 1 16 16l-2.5-2.5"></path>
                <path d="M2 12h2a8 8 0 0 0 8 8"></path>
                <path d="M9.828 9.172a4 4 0 0 1 5.656 0"></path>
              </svg>
              Shorts
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 text-[14px]">
              <UserGroupIcon className="h-5 w-5" />
              Groups
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 text-[14px]">
              <ChatBubbleIcon className="h-5 w-5" />
              Messages
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 text-[14px]">
              <BellIconSolid className="h-5 w-5" />
              Notifications
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 text-[14px]">
              <RadioIcon className="h-5 w-5" />
              Live
            </a>
          </nav>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs tracking-widest text-gray-400 mb-1">APPS</p>
            <a href="/marketplace" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 text-[13px]">
              <ShoppingBagIcon className="h-4 w-4" />
              Marketplace
            </a>
            <a href="/fingerwars" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 text-[13px]">
              <Gamepad2Icon className="h-4 w-4" />
              FingerWars
            </a>
            <a href="/gems" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 text-[13px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M6 3v12a6 6 0 0 0 12 0V3"></path>
                <path d="M6 21v-6a3 3 0 0 1 6 0v6"></path>
                <path d="M18 21v-6a3 3 0 0 0-6 0v6"></path>
              </svg>
              Gems
            </a>
          </div>
          <div className="mt-auto flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gray-800">
            <img src="https://i.pravatar.cc/48?img=12" className="w-8 h-8 rounded-full" alt="User" />
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold truncate">Kemi Demo</p>
              <p className="text-xs text-gray-400">@kemifo</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-400">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="9" y1="12" y2="12"></line>
            </svg>
          </div>
        </aside>
      )}
    </div>
  );
};

export default HomePage;