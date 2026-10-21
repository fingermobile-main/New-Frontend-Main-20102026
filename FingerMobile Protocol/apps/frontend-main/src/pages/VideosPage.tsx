import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { GiftIcon, LinkIcon, PlayIcon, UserCircleIcon, HeartIcon, ShareIcon, BookmarkIcon, DotsHorizontalIcon, SearchIcon, FilterIcon } from '../icons';

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
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3.5 rounded-2xl shadow-md text-white">
              <PlayIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400 text-xs font-black uppercase mb-1">
                Video Commons &bull; Dancia &amp; UGC Hub
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Videos Gallery</h1>
              <p className="text-slate-700 font-medium mt-1">Discover, stream, and support creators across sovereign channels with micro-tipping</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-slate-300">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input
                    type="text"
                    placeholder="Search videos or creators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white text-slate-900 pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none border border-slate-300 font-bold placeholder:text-slate-400"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-white text-slate-900 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none border border-slate-300 font-bold"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button className="p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 border border-slate-300">
                    <FilterIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-300 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {video.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-slate-900 text-lg mb-2 line-clamp-2 h-14">{video.title}</h3>

                    <div className="flex items-center mb-3">
                      <div className="bg-slate-200 border border-slate-300 rounded-full w-8 h-8 flex items-center justify-center text-xs font-black text-slate-700">
                        {video.creator.name.charAt(0)}
                      </div>
                      <span className="ml-2 text-sm font-bold text-slate-800">{video.creator.name}</span>
                    </div>

                    <div className="flex justify-between text-sm text-slate-700 font-medium mb-4">
                      <span>{video.views.toLocaleString()} views</span>
                      <span>{video.uploadDate}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center text-slate-700 hover:text-red-500 font-bold text-xs">
                          <HeartIcon className="w-5 h-5 mr-1" />
                          <span>{video.likes}</span>
                        </button>
                        <button className="text-slate-700 hover:text-blue-500">
                          <ShareIcon className="w-5 h-5" />
                        </button>
                        <button className="text-slate-700 hover:text-yellow-500">
                          <BookmarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                      <button className="text-slate-700 hover:text-slate-900">
                        <DotsHorizontalIcon className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => onOpenGiftModal(video)}
                        className="flex-1 flex items-center justify-center py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold rounded-xl hover:from-purple-800 hover:to-indigo-800 transition-colors shadow-sm"
                      >
                        <GiftIcon className="w-4 h-4 mr-2" /> Gift
                      </button>
                      <button
                        onClick={() => onOpenPaylinkModal(video)}
                        className="flex-1 flex items-center justify-center py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-colors shadow-sm"
                      >
                        <LinkIcon className="w-4 h-4 mr-2" /> Pay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-blue-700 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-slate-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm font-bold bg-blue-600 text-white px-3.5 py-2 rounded-xl hover:bg-blue-700 shadow-sm transition-colors">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-300">
              <h2 className="text-lg font-black text-slate-900 mb-4">Trending Categories</h2>
              <div className="space-y-2.5">
                {categories.slice(1, 6).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
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

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Creator Benefits</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="text-amber-500 mr-2">✓</span>
                  Earn FIC tokens
                </li>
                <li className="flex items-center">
                  <span className="text-amber-500 mr-2">✓</span>
                  Monetize content
                </li>
                <li className="flex items-center">
                  <span className="text-amber-500 mr-2">✓</span>
                  Engage with fans
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-2">Send Gift to Creator</h3>
            <p className="text-sm text-slate-700 mb-4">
              Video: {selectedVideo?.title}
            </p>
            <p className="text-gray-600 mb-4">
              Your Balance: {ficBalance.toLocaleString()} FIC
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (FIC)
                </label>
                <input
                  type="number"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                  placeholder="Enter amount"
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200"
                  onClick={() => setShowGiftModal(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-2">
              Create Paylink for Video
            </h3>
            <p className="text-sm text-slate-700 mb-4">
              Video: {selectedVideo?.title}
            </p>
            <p className="text-gray-600 mb-4">
              Your Balance: {ficBalance.toLocaleString()} FIC
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (FIC)
                </label>
                <input
                  type="number"
                  value={paylinkAmount}
                  onChange={(e) => setPaylinkAmount(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={paylinkDescription}
                  onChange={(e) => setPaylinkDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  placeholder="Enter description (optional)"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200"
                  onClick={() => setShowPaylinkModal(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600"
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
    </MainLayout>
  );
};

export default VideosPage;
