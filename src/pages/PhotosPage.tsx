import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { CommunityContext } from '../contexts/CommunityContext';

const PhotosPage: React.FC = () => {
  const { member: currentMember } = useAuth();
  const context = React.useContext(CommunityContext);
  const photos = context ? context.posts.filter((p: any) => p.type === 'photo') : [];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Photos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo: any) => (
            <div key={photo.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden group relative">
              <img 
                src={photo.url} 
                alt={photo.caption || 'Photo'} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
               />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-sm font-medium px-4 text-center">
                  {photo.caption || 'No caption'}
                </p>
              </div>
            </div>
          ))}
        </div>
        {photos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No photos found in the community.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PhotosPage;