import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const PhotosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'albums'>('all');
  
  // Mock data for photos
  const photos = [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=60",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=60",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=60",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=60",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=60",
    "https://images.unsplash.com/photo-1524758870432-af57e54afa26?w=400&q=60",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=60",
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&q=60",
    "https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=400&q=60",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=60",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=60",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=60"
  ];

  return (
    <div className="flex w-full">
      {/* Left Sidebar - Filters and Navigation */}
      <aside className="col-left hidden md:flex flex-col w-1/5 p-4 space-y-6">
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="font-bold text-lg mb-3">Photos</h2>
          <nav className="space-y-1">
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'all' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('all')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <path d="M21 15l-5-5L5 21"></path>
              </svg>
              All Photos
            </button>
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'albums' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('albums')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                <path d="M2 3h20"></path>
                <path d="M4 3v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3"></path>
                <path d="M12 10 4 3h16Z"></path>
              </svg>
              Albums
            </button>
          </nav>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-2">Albums</h3>
          <div className="space-y-2">
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Vacation 2023</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Work Events</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Family</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Friends</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Nature</button>
          </div>
        </div>
      </aside>

      {/* Main Content - Photos Grid */}
      <main className="col-center w-3/5 p-4">
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Photos</h1>
            <button className="px-3 py-1.5 rounded-lg bg-orange-500 text-gray-900 text-sm font-bold flex items-center">
              <PlusIcon className="h-4 w-4 mr-1" />
              Upload
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 text-sm">
            <button 
              className={`px-2.5 py-1.5 rounded-lg font-semibold ${
                activeTab === 'all' 
                  ? 'bg-orange-500/15 text-orange-500' 
                  : 'bg-gray-700 text-gray-400'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button 
              className={`px-2.5 py-1.5 rounded-lg font-semibold ${
                activeTab === 'albums' 
                  ? 'bg-orange-500/15 text-orange-500' 
                  : 'bg-gray-700 text-gray-400'
              }`}
              onClick={() => setActiveTab('albums')}
            >
              Albums
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {photos.map((photo, index) => (
            <div key={index} className="aspect-square rounded-xl overflow-hidden relative">
              <img 
                src={photo} 
                alt={`${index + 1}`} // Fixed: Removed redundant "Photo" from alt text
                className="w-full h-full object-cover"
              />
              {index % 5 === 0 && ( // Add a video indicator to every 5th photo
                <div className="absolute inset-0 grid place-items-center bg-black/50 text-orange-500 font-bold">
                  ▶ Video
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar - Photo Actions */}
      <aside className="col-right hidden lg:flex flex-col w-1/5 p-4 space-y-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Photo Tools</h3>
          <div className="space-y-2">
            <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"></path>
                <path d="M12 8v4l2 2"></path>
              </svg>
              Memories
            </button>
            <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                <path d="M12 22s7-4 7-10V5l-7-3-7 3v7c0 6 7 10 7 10z"></path>
              </svg>
              Favorites
            </button>
            <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                <path d="M12 22V12l4-4"></path>
                <path d="M3 21a9 9 0 0 1 14-8.4"></path>
              </svg>
              Recycle Bin
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Storage</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Used</span>
              <span>2.4 GB</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>65% of 4 GB</span>
              <span>1.6 GB free</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default PhotosPage;