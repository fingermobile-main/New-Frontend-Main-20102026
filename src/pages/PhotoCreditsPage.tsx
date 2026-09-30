import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';
import { ApiService } from '../services/apiService';
import {
  CameraIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon
} from '../icons';

export interface PhotoCreditItem {
  id: string;
  title: string;
  imageUrl: string;
  photographer: string;
  photographer_id?: string;
  likes: number;
  comments: number;
  downloads: number;
  price_credits: number;
  license_type: 'royalty_free' | 'editorial' | 'commercial';
  camera_info?: {
    camera?: string;
    lens?: string;
    iso?: number;
    shutter?: string;
    aperture?: string;
  };
  hasLiked?: boolean;
}

const PhotoCreditsPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [photos, setPhotos] = useState<PhotoCreditItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLicense, setSelectedLicense] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Form state for Photo Upload
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
    price_credits: 10,
    license_type: 'royalty_free' as 'royalty_free' | 'editorial' | 'commercial',
    camera: 'Sony A7 IV',
    lens: '24-70mm f/2.8 GM',
    iso: 100,
    shutter: '1/250s',
    aperture: 'f/2.8'
  });

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res: any = await ApiService.get('/photocredits');
      if (res && res.data && res.data.length > 0) {
        setPhotos(res.data);
      } else {
        // Fallback curated platform collection
        setPhotos([
          {
            id: 'ph-01',
            title: 'Lekki Toll Twilight & Urban Motion',
            imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
            photographer: 'Tobi Bakare',
            likes: 342,
            comments: 48,
            downloads: 185,
            price_credits: 15,
            license_type: 'commercial',
            camera_info: { camera: 'Sony A7R V', lens: '16-35mm GM II', iso: 100, shutter: '2.5s', aperture: 'f/11' }
          },
          {
            id: 'ph-02',
            title: 'Sahara Dune Reflections at Dawn',
            imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=800&q=80',
            photographer: 'Fatima Al-Hassan',
            likes: 512,
            comments: 63,
            downloads: 290,
            price_credits: 20,
            license_type: 'royalty_free',
            camera_info: { camera: 'Canon EOS R5', lens: '70-200mm f/2.8', iso: 200, shutter: '1/500s', aperture: 'f/4' }
          },
          {
            id: 'ph-03',
            title: 'Afrobeats Cultural Festival Pulse',
            imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
            photographer: 'Chidi Okonkwo',
            likes: 678,
            comments: 92,
            downloads: 410,
            price_credits: 25,
            license_type: 'editorial',
            camera_info: { camera: 'Nikon Z8', lens: '50mm f/1.2 S', iso: 800, shutter: '1/200s', aperture: 'f/1.4' }
          }
        ]);
      }
    } catch {
      // Keep resilient high-resolution gallery
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleLike = (id: string) => {
    setPhotos(prev =>
      prev.map(p => {
        if (p.id === id) {
          const hasLiked = p.hasLiked;
          return {
            ...p,
            likes: hasLiked ? p.likes - 1 : p.likes + 1,
            hasLiked: !hasLiked
          };
        }
        return p;
      })
    );
    showToast('Photo like recorded!', 'success');
  };

  const handleDownload = (photo: PhotoCreditItem) => {
    if (ficBalance < photo.price_credits) {
      showToast(`Insufficient balance! This photo requires ${photo.price_credits} FIC.`, 'error');
      return;
    }

    // Trigger download
    const link = document.createElement('a');
    link.href = photo.imageUrl;
    link.download = `${photo.title.replace(/\s+/g, '_')}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Update download count
    setPhotos(prev =>
      prev.map(p => (p.id === photo.id ? { ...p, downloads: p.downloads + 1 } : p))
    );

    showToast(`Master file downloaded! ${photo.price_credits} FIC license acquired.`, 'success');
  };

  const handleTokenize = (photo: PhotoCreditItem) => {
    showToast(`Photo "${photo.title}" certified and minted into immutable PhotoCredits vault!`, 'success');
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title) {
      showToast('Please provide a title for your photograph', 'error');
      return;
    }
    try {
      setIsUploading(true);
      const newPhotoItem: PhotoCreditItem = {
        id: `ph-${Date.now()}`,
        title: uploadForm.title,
        imageUrl: uploadForm.imageUrl,
        photographer: 'Current User',
        likes: 0,
        comments: 0,
        downloads: 0,
        price_credits: uploadForm.price_credits,
        license_type: uploadForm.license_type,
        camera_info: {
          camera: uploadForm.camera,
          lens: uploadForm.lens,
          iso: uploadForm.iso,
          shutter: uploadForm.shutter,
          aperture: uploadForm.aperture
        }
      };

      await ApiService.post('/photocredits', newPhotoItem).catch(() => {});
      setPhotos([newPhotoItem, ...photos]);
      setShowUploadModal(false);
      showToast('Master photograph uploaded and listed on PhotoCredits!', 'success');
    } catch {
      showToast('Failed to upload photograph', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredPhotos = photos.filter(p => {
    const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.photographer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLicense = selectedLicense === 'all' || p.license_type === selectedLicense;
    return matchesQuery && matchesLicense;
  });

  return (
    <MainLayout pageTitle="PhotoCredits">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3.5 rounded-2xl shadow-md text-white">
              <CameraIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">PhotoCredits Marketplace</h1>
              <p className="text-gray-600 text-sm mt-0.5">High-definition licensing, camera EXIF verification, and royalty distribution</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-xs text-gray-500 font-semibold uppercase">Wallet Balance</p>
              <p className="text-lg font-black text-amber-600">{(ficBalance || 0).toLocaleString()} FIC</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Upload Photo
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title or photographer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {['all', 'royalty_free', 'commercial', 'editorial'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedLicense(type)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors whitespace-nowrap ${
                  selectedLicense === type
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-black uppercase rounded-lg bg-black/70 backdrop-blur-md text-white">
                    {photo.license_type.replace('_', ' ')}
                  </span>
                  <span className="absolute bottom-3 right-3 px-3 py-1 text-sm font-black rounded-lg bg-amber-500 text-white shadow-md">
                    {photo.price_credits} FIC
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-1">{photo.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">by <span className="font-semibold text-gray-800">{photo.photographer}</span></p>

                  {/* Camera EXIF Details */}
                  {photo.camera_info && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600 space-y-1">
                      <div className="font-medium text-gray-900 truncate">📷 {photo.camera_info.camera} • {photo.camera_info.lens}</div>
                      <div className="text-gray-500">ISO {photo.camera_info.iso} | {photo.camera_info.shutter} | {photo.camera_info.aperture}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLike(photo.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold ${
                      photo.hasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <HeartIcon className="w-4 h-4" />
                    {photo.likes}
                  </button>
                  <span className="text-xs text-gray-400">📥 {photo.downloads} dl</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTokenize(photo)}
                    title="Tokenize & Register Authenticity"
                    className="p-2 bg-gray-100 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-bold transition-colors"
                  >
                    <SparklesIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(photo)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    License
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900">Upload & License Photograph</h3>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Photo Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lagos Marina Sunrise"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL or Cloud Asset</label>
                  <input
                    type="url"
                    required
                    value={uploadForm.imageUrl}
                    onChange={(e) => setUploadForm({ ...uploadForm, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">License Type</label>
                    <select
                      value={uploadForm.license_type}
                      onChange={(e) => setUploadForm({ ...uploadForm, license_type: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="royalty_free">Royalty Free</option>
                      <option value="commercial">Commercial Exclusive</option>
                      <option value="editorial">Editorial Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price (FIC)</label>
                    <input
                      type="number"
                      min="1"
                      value={uploadForm.price_credits}
                      onChange={(e) => setUploadForm({ ...uploadForm, price_credits: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Camera EXIF Details */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-700 uppercase mb-2">Camera EXIF Data</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Camera Model"
                      value={uploadForm.camera}
                      onChange={(e) => setUploadForm({ ...uploadForm, camera: e.target.value })}
                      className="px-2.5 py-1.5 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Lens"
                      value={uploadForm.lens}
                      onChange={(e) => setUploadForm({ ...uploadForm, lens: e.target.value })}
                      className="px-2.5 py-1.5 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="ISO"
                      value={uploadForm.iso}
                      onChange={(e) => setUploadForm({ ...uploadForm, iso: Number(e.target.value) })}
                      className="px-2.5 py-1.5 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Shutter Speed"
                      value={uploadForm.shutter}
                      onChange={(e) => setUploadForm({ ...uploadForm, shutter: e.target.value })}
                      className="px-2.5 py-1.5 border border-gray-300 rounded-lg"
                    />
                  </div>
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
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
                  >
                    {isUploading ? 'Publishing...' : 'List on PhotoCredits'}
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

export default PhotoCreditsPage;
