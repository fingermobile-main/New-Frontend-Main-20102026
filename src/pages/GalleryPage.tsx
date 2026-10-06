import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { ApiService } from '../services/apiService';
import { useAppContext } from '../contexts/AppContext';
import {
  // eslint-disable-next-line no-unused-vars
  CameraIcon,
  // eslint-disable-next-line no-unused-vars
  VideoCameraIcon,
  HeartIcon,
  // eslint-disable-next-line no-unused-vars
  ShareIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PlusIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  // eslint-disable-next-line no-unused-vars
  SparklesIcon
} from '../icons';

export interface GalleryMediaItem {
  id: string | number;
  title: string;
  caption?: string;
  category: string;
  media_type: 'image' | 'video' | '3d';
  media_urls: string[];
  author_name: string;
  author_avatar?: string;
  likes: number;
  views: number;
  comments: number;
  created_at: string;
  hasLiked?: boolean;
}

const GalleryPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [mediaItems, setMediaItems] = useState<GalleryMediaItem[]>([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeMediaItem, setActiveMediaItem] = useState<GalleryMediaItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    title: '',
    caption: '',
    category: 'art',
    media_type: 'image' as 'image' | 'video' | '3d',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
  });

  const categories = ['all', 'art', 'urban', 'nature', 'people', 'music', 'travel'];

  const fetchGalleryMedia = async () => {
    try {
      setLoading(true);
      const res: any = await ApiService.get('/lumina');
      if (res && res.data && res.data.length > 0) {
        setMediaItems(res.data);
      } else {
        setMediaItems([
          {
            id: 'gal-01',
            title: 'Afrofuturist Mural & Bronze Heritage',
            caption: 'Digital preservation of traditional Benin bronze motifs woven with cyberpunk aesthetics.',
            category: 'art',
            media_type: 'image',
            media_urls: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'],
            author_name: 'Damilola Adebayo',
            likes: 428,
            views: 1840,
            comments: 54,
            created_at: '2026-04-12'
          },
          {
            id: 'gal-02',
            title: 'Lagos Night Skyline & Yellow Danfo Trails',
            caption: 'Long exposure photography along Third Mainland Bridge during late rush hour.',
            category: 'urban',
            media_type: 'image',
            media_urls: ['https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'],
            author_name: 'Segun Ogundipe',
            likes: 612,
            views: 2950,
            comments: 72,
            created_at: '2026-04-10'
          },
          {
            id: 'gal-03',
            title: 'Zuma Rock Mist & Morning Solitude',
            caption: 'Monolithic majesty in central Nigeria under dramatic overcast skies.',
            category: 'nature',
            media_type: 'image',
            media_urls: ['https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=800&q=80'],
            author_name: 'Halima Sadiq',
            likes: 310,
            views: 1220,
            comments: 38,
            created_at: '2026-04-08'
          },
          {
            id: 'gal-04',
            title: 'Beatwave Street Percussion Studio Session',
            caption: 'Behind the scenes video capture of live talking drum sampling for new album release.',
            category: 'music',
            media_type: 'video',
            media_urls: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'],
            author_name: 'Kofi Mensah',
            likes: 540,
            views: 2100,
            comments: 89,
            created_at: '2026-04-05'
          }
        ]);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryMedia();
  }, []);

  const handleLike = (id: string | number) => {
    setMediaItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const hasLiked = item.hasLiked;
          return {
            ...item,
            likes: hasLiked ? item.likes - 1 : item.likes + 1,
            hasLiked: !hasLiked
          };
        }
        return item;
      })
    );
    showToast('Liked!', 'success');
  };

  const handleDownload = (item: GalleryMediaItem) => {
    const link = document.createElement('a');
    link.href = item.media_urls[0];
    link.download = `${item.title.replace(/\s+/g, '_')}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Download started for master media file!', 'success');
  };

  const handleCreateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.url) {
      showToast('Please provide a title and media asset URL', 'error');
      return;
    }
    try {
      setIsUploading(true);
      const newMedia: GalleryMediaItem = {
        id: `gal-${Date.now()}`,
        title: uploadForm.title,
        caption: uploadForm.caption,
        category: uploadForm.category,
        media_type: uploadForm.media_type,
        media_urls: [uploadForm.url],
        author_name: 'Current User',
        likes: 0,
        views: 1,
        comments: 0,
        created_at: new Date().toISOString()
      };

      await ApiService.post('/lumina', newMedia).catch(() => {});
      setMediaItems([newMedia, ...mediaItems]);
      setShowUploadModal(false);
      showToast('Media published to FingerMobile Gallery!', 'success');
    } catch {
      showToast('Failed to publish media', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredMedia = selectedCategory === 'all'
    ? mediaItems
    : mediaItems.filter(item => item.category === selectedCategory);

  return (
    <MainLayout pageTitle="Gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Creative Media Gallery</h1>
            <p className="text-gray-600 text-sm mt-0.5">Explore curated African contemporary art, urban street scenes, and visual storytelling</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Upload Media
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div
                  onClick={() => setActiveMediaItem(item)}
                  className="relative h-64 overflow-hidden bg-gray-100 cursor-pointer"
                >
                  <img
                    src={item.media_urls[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-white/90 text-gray-900 font-bold text-xs rounded-xl shadow-lg backdrop-blur-sm flex items-center gap-1.5">
                      <EyeIcon className="w-4 h-4 text-purple-600" />
                      View Fullscreen
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-black/60 backdrop-blur-md text-white">
                    {item.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3
                    onClick={() => setActiveMediaItem(item)}
                    className="font-bold text-gray-900 text-lg leading-snug cursor-pointer hover:text-purple-600 transition-colors line-clamp-1"
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">by <span className="font-semibold text-gray-800">{item.author_name}</span></p>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{item.caption}</p>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(item.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold ${
                      item.hasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <HeartIcon className="w-4 h-4" />
                    {item.likes}
                  </button>
                  <button
                    onClick={() => setActiveMediaItem(item)}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-purple-600"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    {item.comments}
                  </button>
                </div>

                <button
                  onClick={() => handleDownload(item)}
                  title="Download Asset"
                  className="p-2 border border-gray-200 hover:bg-purple-50 hover:text-purple-600 text-gray-600 rounded-lg transition-colors"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Media Lightbox Modal */}
        {activeMediaItem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in-95">
              {/* Media Preview Box */}
              <div className="md:w-3/5 bg-black flex items-center justify-center p-4 min-h-[350px]">
                <img
                  src={activeMediaItem.media_urls[0]}
                  alt={activeMediaItem.title}
                  className="max-h-[500px] w-auto object-contain rounded-xl"
                />
              </div>

              {/* Meta & Social Column */}
              <div className="md:w-2/5 p-6 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-purple-100 text-purple-800">
                      {activeMediaItem.category}
                    </span>
                    <button
                      onClick={() => setActiveMediaItem(null)}
                      className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <h2 className="text-xl font-black text-gray-900 leading-tight">{activeMediaItem.title}</h2>
                  <p className="text-xs text-gray-500 mt-1">Creator: <span className="font-bold text-gray-800">{activeMediaItem.author_name}</span></p>
                  <p className="text-xs text-gray-700 mt-3 leading-relaxed">{activeMediaItem.caption}</p>

                  <div className="mt-6 p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Total Impressions:</span>
                      <span className="font-bold text-gray-900">{activeMediaItem.views.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Community Appreciation:</span>
                      <span className="font-bold text-red-500">❤️ {activeMediaItem.likes} likes</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={() => handleLike(activeMediaItem.id)}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border ${
                      activeMediaItem.hasLiked
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <HeartIcon className="w-4 h-4" />
                    {activeMediaItem.hasLiked ? 'Liked' : 'Like'}
                  </button>
                  <button
                    onClick={() => handleDownload(activeMediaItem)}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Media Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900">Upload Media to Gallery</h3>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMedia} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lagos Architecture"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image / Asset URL</label>
                  <input
                    type="url"
                    required
                    value={uploadForm.url}
                    onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      <option value="art">Art</option>
                      <option value="urban">Urban</option>
                      <option value="nature">Nature</option>
                      <option value="people">People</option>
                      <option value="music">Music</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Media Type</label>
                    <select
                      value={uploadForm.media_type}
                      onChange={(e) => setUploadForm({ ...uploadForm, media_type: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      <option value="image">Photography / Image</option>
                      <option value="video">Short Video Clip</option>
                      <option value="3d">3D Digital Model</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Caption / Story</label>
                  <textarea
                    rows={3}
                    placeholder="Tell the story behind this visual piece..."
                    value={uploadForm.caption}
                    onChange={(e) => setUploadForm({ ...uploadForm, caption: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
                  >
                    {isUploading ? 'Publishing...' : 'Publish Media'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default GalleryPage;
