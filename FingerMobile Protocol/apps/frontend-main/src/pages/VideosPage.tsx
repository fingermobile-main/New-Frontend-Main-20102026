import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { GiftIcon, LinkIcon, PlayIcon, UserCircleIcon, HeartIcon, ShareIcon, BookmarkIcon, DotsHorizontalIcon, SearchIcon, FilterIcon } from '../icons';
import { Compass, Flame, Layers, Award, Sparkles, Upload } from 'lucide-react';

interface VideoType {
  id: string;
  [key: string]: any;
}

const VideosPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();

  // Mock videos data
  const mockVideos = [
    {
      id: '1',
      title: 'Travel Vlog: Exploring Mountains',
      duration: '12:45',
      views: 1240,
      creator: { name: 'Travel Adventures', avatar: '' },
      thumbnail: 'https://placehold.co/400x225?text=Mountain+Travel',
      uploadDate: '2 days ago',
      likes: 120,
      category: 'Travel'
    },
    {
      id: '2',
      title: 'Cooking Tutorial: Authentic Pasta Recipe',
      duration: '8:22',
      views: 890,
      creator: { name: 'Chef Delights', avatar: '' },
      thumbnail: 'https://placehold.co/400x225?text=Pasta+Cooking',
      uploadDate: '1 week ago',
      likes: 85,
      category: 'Food'
    },
    {
      id: '3',
      title: 'Tech Review: Latest Smartphone Unboxing',
      duration: '15:30',
      views: 2100,
      creator: { name: 'Tech Gurus', avatar: '' },
      thumbnail: 'https://placehold.co/400x225?text=Smartphone+Review',
      uploadDate: '3 days ago',
      likes: 210,
      category: 'Technology'
    },
    {
      id: '4',
      title: 'Fitness Routine: Morning Workout Session',
      duration: '18:15',
      views: 1560,
      creator: { name: 'FitLife Pro', avatar: '' },
      thumbnail: 'https://placehold.co/400x225?text=Morning+Workout',
      uploadDate: '5 days ago',
      likes: 175,
      category: 'Fitness'
    },
    {
      id: '5',
      title: 'Music Performance: Live Acoustic Session',
      duration: '7:40',
      views: 920,
      creator: { name: 'Acoustic Vibes', avatar: '' },
      thumbnail: 'https://placehold.co/400x225?text=Live+Music',
      uploadDate: '4 days ago',
      likes: 95,
      category: 'Music'
    },
    {
      id: '6',
      title: 'Gaming: Adventure Quest Epic Finale',
      duration: '22:10',
      views: 3400,
      creator: { name: 'Game Masters', avatar: '' },
      thumbnail: 'https://placehold.co/400x225?text=Gaming+Finale',
      uploadDate: '1 day ago',
      likes: 420,
      category: 'Gaming'
    }
  ];

  const [videosList, setVideosList] = useState<VideoType[]>([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState<boolean>(true);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [giftAmount, setGiftAmount] = useState('');
  const [paylinkAmount, setPaylinkAmount] = useState('');
  const [paylinkDescription, setPaylinkDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Travel', 'Food', 'Technology', 'Fitness', 'Music', 'Gaming', 'Afrobeat', 'General'];

  useEffect(() => {
    let mounted = true;
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res: any = await apiService.get('/api/dancia/videos').catch(() => null);
        const list = Array.isArray(res) ? res : (res?.videos || res?.data || []);
        if (mounted && list && list.length > 0) {
          const mapped = list.map((v: any, idx: number) => ({
            id: v.videoID || v.id || String(idx + 1),
            title: v.title || 'Featured Video',
            duration: typeof v.length === 'number' ? `${Math.floor(v.length / 60)}:${String(v.length % 60).padStart(2, '0')}` : (v.duration || '5:00'),
            views: v.views || v.engagementScore || 1200,
            creator: { name: v.uploaderID || v.creator?.name || 'Dancia Creator', avatar: '' },
            thumbnail: v.thumbnailURL || v.thumbnail || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
            uploadDate: v.uploadDate ? new Date(v.uploadDate).toLocaleDateString() : 'Recent',
            likes: v.likeCount || v.likes || 150,
            category: v.genre || v.category || 'General',
            streamURL: v.streamURL || ''
          }));
          setVideosList(mapped);
        } else if (mounted) {
          setVideosList(mockVideos);
        }
      } catch (err) {
        if (mounted) setVideosList(mockVideos);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchVideos();
    return () => { mounted = false; };
  }, []);

  const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({});
  const [bookmarkedVideos, setBookmarkedVideos] = useState<Record<string, boolean>>({});

  const handleLike = (videoId: string) => {
    setLikedVideos(prev => {
      const isLiked = !prev[videoId];
      showToast(isLiked ? 'Added to liked videos' : 'Removed from liked videos', 'info');
      return { ...prev, [videoId]: isLiked };
    });
  };

  const handleBookmark = (videoId: string) => {
    setBookmarkedVideos(prev => {
      const isSaved = !prev[videoId];
      showToast(isSaved ? 'Video saved to your library' : 'Video removed from saved', 'info');
      return { ...prev, [videoId]: isSaved };
    });
  };

  const handleShare = async (video: any) => {
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Video link copied to clipboard', 'success');
      }
    } catch {
      showToast('Share link ready', 'info');
    }
  };

  const activeVideos = videosList.length > 0 ? videosList : mockVideos;

  const filteredVideos = activeVideos.filter(video => {
    const creatorName = video.creator?.name || '';
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          creatorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || video.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const onOpenGiftModal = (video: VideoType) => {
    if (ficBalance <= 0) {
      showToast('Insufficient FIC balance to send gift', 'error');
      return;
    }
    setSelectedVideo(video);
    setShowGiftModal(true);
  };

  const onOpenPaylinkModal = (video: VideoType) => {
    if (ficBalance <= 0) {
      showToast('Insufficient FIC balance to create paylink', 'error');
      return;
    }
    setSelectedVideo(video);
    setShowPaylinkModal(true);
  };

  const handleSendGift = async () => {
    if (!selectedVideo) return;
    const amount = parseFloat(giftAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (amount > ficBalance) {
      showToast('Insufficient FIC balance', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.post('/api/wallet/transfer', {
        recipientId: 4,
        amount,
        description: `Gift tip for video: ${selectedVideo.title}`
      }).catch(async () => {
        return await apiService.post('/api/live-stream/tip', {
          streamId: 1,
          amount
        });
      });

      showToast(`Successfully sent ${amount} FIC gift to creator!`, 'success');
      setGiftAmount('');
      setShowGiftModal(false);
      setSelectedVideo(null);
    } catch (error) {
      showToast('Failed to send gift. Please check connection.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreatePaylink = async () => {
    if (!selectedVideo) return;
    const amount = parseFloat(paylinkAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (amount > ficBalance) {
      showToast('Insufficient FIC balance', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const res: any = await apiService.post('/api/paylinks', {
        title: `Supporter Paylink: ${selectedVideo.title}`,
        amount,
        description: paylinkDescription || `Supporter paylink for ${selectedVideo.title}`,
        currency: 'FIC'
      });
      const linkId = res?.data?.id || res?.id || 'live-link';
      showToast(`Paylink #${linkId} created successfully!`, 'success');
      setPaylinkAmount('');
      setPaylinkDescription('');
      setShowPaylinkModal(false);
      setSelectedVideo(null);
    } catch (error) {
      showToast('Failed to create paylink', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 overflow-x-hidden pb-28 md:pb-12">
        <div className="bg-white rounded-2xl p-5 sm:p-8 border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 sm:p-3.5 rounded-2xl shadow-md text-white shrink-0">
              <PlayIcon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="ml-3 sm:ml-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400 text-[11px] font-black uppercase mb-1">
                Video Commons &bull; Dancia &amp; UGC Hub
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">Videos Gallery</h1>
              <p className="text-slate-700 text-xs sm:text-base font-medium mt-0.5">Discover, stream, and support creators across sovereign channels with micro-tipping</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/upload"
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition shadow-sm active:scale-95"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Video
            </Link>
          </div>
        </div>

        {/* Mobile quick category tabs scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:hidden">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl font-black text-xs whitespace-nowrap transition-all border shrink-0 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-slate-300">
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search videos or creators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full min-h-[44px] bg-white text-slate-900 pl-11 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none border border-slate-300 font-bold placeholder:text-slate-400 text-sm sm:text-base"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="min-h-[44px] flex-1 md:flex-none bg-white text-slate-900 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none border border-slate-300 font-bold text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    aria-label="Filter videos by category"
                    onClick={() => showToast(`Filtered by ${selectedCategory}`, 'info')}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 border border-slate-300 active:scale-95 transition"
                  >
                    <FilterIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-300 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 sm:h-52 object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded font-mono font-bold">
                        {video.duration}
                      </div>
                      <div className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">
                        {video.category}
                      </div>
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="font-black text-slate-900 text-base sm:text-lg mb-2 line-clamp-2 min-h-[3rem]">{video.title}</h3>

                      <div className="flex items-center mb-3">
                        <div className="bg-slate-200 border border-slate-300 rounded-full w-8 h-8 flex items-center justify-center text-xs font-black text-slate-800 shrink-0">
                          {video.creator.name.charAt(0)}
                        </div>
                        <span className="ml-2 text-sm font-bold text-slate-800 truncate">{video.creator.name}</span>
                      </div>

                      <div className="flex justify-between text-xs sm:text-sm text-slate-700 font-semibold mb-4">
                        <span>{video.views.toLocaleString()} views</span>
                        <span>{video.uploadDate}</span>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <button
                            type="button"
                            aria-label={`Like video ${video.title}`}
                            onClick={() => handleLike(video.id)}
                            className={`min-h-[44px] min-w-[44px] flex items-center justify-center font-black text-xs transition-colors rounded-xl hover:bg-slate-100 ${
                              likedVideos[video.id] ? 'text-red-600' : 'text-slate-700 hover:text-red-500'
                            }`}
                          >
                            <HeartIcon className="w-5 h-5 mr-1" />
                            <span>{video.likes + (likedVideos[video.id] ? 1 : 0)}</span>
                          </button>
                          <button
                            type="button"
                            aria-label={`Share video ${video.title}`}
                            onClick={() => handleShare(video)}
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 hover:text-blue-600 transition-colors rounded-xl hover:bg-slate-100"
                          >
                            <ShareIcon className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Bookmark video ${video.title}`}
                            onClick={() => handleBookmark(video.id)}
                            className={`min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors rounded-xl hover:bg-slate-100 ${
                              bookmarkedVideos[video.id] ? 'text-amber-600' : 'text-slate-700 hover:text-amber-500'
                            }`}
                          >
                            <BookmarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label="More video options"
                          onClick={() => showToast(`Options for ${video.title}`, 'info')}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-100"
                        >
                          <DotsHorizontalIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 pt-0">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onOpenGiftModal(video)}
                        className="flex-1 min-h-[44px] flex items-center justify-center px-3 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold text-sm rounded-xl hover:from-purple-800 hover:to-indigo-800 transition-all shadow-sm active:scale-95"
                      >
                        <GiftIcon className="w-4 h-4 mr-1.5" /> Gift
                      </button>
                      <button
                        onClick={() => onOpenPaylinkModal(video)}
                        className="flex-1 min-h-[44px] flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-sm rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-sm active:scale-95"
                      >
                        <LinkIcon className="w-4 h-4 mr-1.5" /> Pay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-slate-300">
              <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4">Trending Categories</h2>
              <div className="space-y-2">
                {categories.slice(1, 6).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full min-h-[44px] text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 sm:p-6 border border-amber-200 shadow-sm">
              <h2 className="text-base sm:text-lg font-black text-slate-900 mb-2">Creator Benefits</h2>
              <ul className="space-y-2 text-sm text-slate-800 font-semibold">
                <li className="flex items-center">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  Earn FIC micro-tokens directly
                </li>
                <li className="flex items-center">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  Monetize exclusive content
                </li>
                <li className="flex items-center">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  Instant supporter paylinks
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full border border-slate-300 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-1">Send Gift to Creator</h3>
            <p className="text-xs sm:text-sm text-slate-700 font-bold mb-2 truncate">
              Video: {selectedVideo?.title}
            </p>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl mb-4 text-xs font-bold text-blue-950">
              Your Available Balance: {ficBalance.toLocaleString()} FIC
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1.5">
                  Amount (FIC)
                </label>
                <input
                  type="number"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  className="w-full min-h-[44px] px-4 py-2 border rounded-xl text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono text-base"
                  placeholder="Enter amount (e.g. 10)"
                  min="0"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="min-h-[44px] px-4 py-2 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition active:scale-95"
                  onClick={() => setShowGiftModal(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="min-h-[44px] px-5 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold rounded-xl hover:from-purple-800 hover:to-indigo-800 transition shadow-sm active:scale-95"
                  onClick={handleSendGift}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Sending...' : 'Send Gift'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paylink Modal */}
      {showPaylinkModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full border border-slate-300 shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-1">
              Create Paylink for Video
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 font-bold mb-2 truncate">
              Video: {selectedVideo?.title}
            </p>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl mb-4 text-xs font-bold text-blue-950">
              Your Available Balance: {ficBalance.toLocaleString()} FIC
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1.5">
                  Amount (FIC)
                </label>
                <input
                  type="number"
                  value={paylinkAmount}
                  onChange={(e) => setPaylinkAmount(e.target.value)}
                  className="w-full min-h-[44px] px-4 py-2 border rounded-xl text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono text-base"
                  placeholder="Enter amount (e.g. 25)"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={paylinkDescription}
                  onChange={(e) => setPaylinkDescription(e.target.value)}
                  className="w-full min-h-[44px] px-4 py-2 border rounded-xl text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 text-sm"
                  placeholder="Enter description (optional)"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="min-h-[44px] px-4 py-2 text-slate-700 font-bold rounded-xl hover:bg-slate-100 transition active:scale-95"
                  onClick={() => setShowPaylinkModal(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="min-h-[44px] px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition shadow-sm active:scale-95"
                  onClick={handleCreatePaylink}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Creating...' : 'Create Paylink'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Sovereign Mobile Navigation Quick Dock */}
      <div
        data-testid="videos-mobile-dock"
        className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden"
      >
        <button
          onClick={() => setSelectedCategory('All')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded-xl text-[10px] font-black transition-colors ${
            selectedCategory === 'All' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Feed</span>
        </button>

        <button
          onClick={() => setSelectedCategory('Gaming')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded-xl text-[10px] font-black transition-colors ${
            selectedCategory === 'Gaming' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-5 h-5 mb-0.5" />
          <span>Hot</span>
        </button>

        <button
          onClick={() => {
            const firstVideo = filteredVideos[0] || mockVideos[0];
            if (firstVideo) onOpenGiftModal(firstVideo);
          }}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded-xl text-[10px] font-black text-purple-400 hover:text-purple-300 transition-colors"
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span>Tip</span>
        </button>

        <Link
          to="/upload"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-[10px] font-black text-white shadow-md active:scale-95 transition"
        >
          <Upload className="w-5 h-5 mb-0.5" />
          <span>Upload</span>
        </Link>
      </div>
    </MainLayout>
  );
};

export default VideosPage;
