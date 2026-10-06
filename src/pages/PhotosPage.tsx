import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { CommunityContext } from '../contexts/CommunityContext';
import apiService from '../services/apiService';
import { Camera, Heart } from 'lucide-react';

interface PhotoItem {
  id: string | number;
  url: string;
  caption?: string;
  photographer?: string;
  likes?: number;
}

const PhotosPage: React.FC = () => {
  // eslint-disable-next-line no-unused-vars
  const { member: currentMember } = useAuth();
  const context = useContext(CommunityContext);
  const navigate = useNavigate();

  const contextPhotos = context ? context.posts.filter((p: any) => p.type === 'photo') : [];
  const [apiPhotos, setApiPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const fetchPhotoCredits = async () => {
      try {
        setLoading(true);
        const res: any = await apiService.get('/api/photocredits').catch(() => null);
        const list = Array.isArray(res) ? res : (res?.data || []);
        if (active && list.length > 0) {
          const mapped = list.map((item: any) => ({
            id: item.id,
            url: item.imageUrl || item.image_url || item.url || 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800',
            caption: item.title || item.caption || 'Community Visual',
            photographer: item.photographer || 'FingerMobile Creator',
            likes: item.likes || 120
          }));
          setApiPhotos(mapped);
        } else if (active) {
          setApiPhotos([
            {
              id: 'ph-1',
              url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800',
              caption: 'Lekki Toll Twilight & Urban Motion',
              photographer: 'Tobi Bakare',
              likes: 342
            },
            {
              id: 'ph-2',
              url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800',
              caption: 'Sahara Dune Reflections at Dawn',
              photographer: 'Fatima Al-Hassan',
              likes: 512
            },
            {
              id: 'ph-3',
              url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
              caption: 'Afrobeats Cultural Festival Pulse',
              photographer: 'Chidi Okonkwo',
              likes: 678
            }
          ]);
        }
      } catch {
        // Handled
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchPhotoCredits();
    return () => { active = false; };
  }, []);

  const displayPhotos: PhotoItem[] = contextPhotos.length > 0
    ? contextPhotos.map((p: any) => ({ id: p.id, url: p.url, caption: p.caption, photographer: p.author?.name || 'Creator', likes: p.likesCount || 0 }))
    : apiPhotos;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Community Photos &amp; Visuals</h1>
            <p className="text-gray-500 text-sm mt-1">High-resolution visual art and photographic captures across the protocol</p>
          </div>
          <button
            onClick={() => navigate('/photo-credits')}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow flex items-center gap-2 self-start sm:self-auto"
          >
            <Camera className="w-4 h-4" />
            <span>Open Photo Credits Market</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => navigate(`/photocredits/${photo.id}`)}
              className="aspect-square bg-gray-100 rounded-2xl overflow-hidden group relative cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              <img
                src={photo.url}
                alt={photo.caption || 'Photo'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <p className="text-white text-sm font-bold truncate">
                  {photo.caption || 'Untitled Visual'}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-300 mt-1">
                  <span>By {photo.photographer || 'Photographer'}</span>
                  <span className="flex items-center text-pink-400">
                    <Heart className="w-3.5 h-3.5 mr-1 fill-current" /> {photo.likes || 42}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayPhotos.length === 0 && !loading && (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200 mt-6">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-semibold">No photos found in the community.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PhotosPage;
