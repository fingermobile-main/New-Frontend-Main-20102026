import React from 'react';

const GalleryPage: React.FC = () => {
  // Mock data for gallery categories
  const galleryItems = [
    {
      id: 1,
      title: "My Uploads",
      count: "128 items",
      icon: "image",
      color: "from-orange-500/40 to-yellow-500/30"
    },
    {
      id: 2,
      title: "Videos",
      count: "42 items",
      icon: "clapperboard",
      color: "from-orange-500/20 to-orange-500/20"
    },
    {
      id: 3,
      title: "Starred",
      count: "25 items",
      icon: "star",
      color: "from-yellow-500/20 to-yellow-500/20"
    },
    {
      id: 4,
      title: "Archive",
      count: "83 items",
      icon: "folder",
      color: "from-gray-600/20 to-gray-600/20"
    },
    {
      id: 5,
      title: "Favorites",
      count: "56 items",
      icon: "heart",
      color: "from-red-500/20 to-red-500/20"
    },
    {
      id: 6,
      title: "Screenshots",
      count: "91 items",
      icon: "monitor",
      color: "from-blue-500/20 to-blue-500/20"
    },
    {
      id: 7,
      title: "Documents",
      count: "34 items",
      icon: "file-text",
      color: "from-purple-500/20 to-purple-500/20"
    },
    {
      id: 8,
      title: "GIFs",
      count: "18 items",
      icon: "gif",
      color: "from-green-500/20 to-green-500/20"
    }
  ];

  // Function to get Lucide icon based on name
  const getLucideIcon = (iconName: string) => {
    switch(iconName) {
      case 'image':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <path d="M21 15l-5-5L5 21"></path>
          </svg>
        );
      case 'clapperboard':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400">
            <path d="M4 3h16a2 2 0 0 1 2 2v3H2V5a2 2 0 0 1 2-2"></path>
            <path d="M2 12h20"></path>
            <path d="M7 12v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-5"></path>
            <path d="M12 12v5"></path>
          </svg>
        );
      case 'star':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        );
      case 'folder':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
          </svg>
        );
      case 'heart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"></path>
          </svg>
        );
      case 'monitor':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400">
            <rect width="20" height="14" x="2" y="3" rx="2"></rect>
            <path d="M8 21h8"></path>
            <path d="M12 17v4"></path>
          </svg>
        );
      case 'file-text':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
            <path d="M10 9H8"></path>
          </svg>
        );
      case 'gif':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400">
            <path d="M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2"></path>
            <path d="M12 14h.01"></path>
            <path d="M16 14h.01"></path>
            <path d="M8 14h.01"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <path d="M21 15l-5-5L5 21"></path>
          </svg>
        );
    }
  };

  return (
    <div className="flex w-full">
      {/* Left Sidebar - Gallery Navigation */}
      <aside className="col-left hidden md:flex flex-col w-1/5 p-4 space-y-6">
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="font-bold text-lg mb-3">Gallery</h2>
          <nav className="space-y-1">
            <button className="flex items-center w-full p-2 rounded-lg text-left hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <path d="M21 15l-5-5L5 21"></path>
              </svg>
              All Photos
            </button>
            <button className="flex items-center w-full p-2 rounded-lg text-left hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              </svg>
              Albums
            </button>
            <button className="flex items-center w-full p-2 rounded-lg text-left hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5"></path>
                <path d="M21 12H9l-6 6h18Z"></path>
                <path d="M15 22v-4"></path>
              </svg>
              Shared
            </button>
          </nav>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-2">Smart Albums</h3>
          <div className="space-y-2">
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Favorites</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Screenshots</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Selfies</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">Documents</button>
            <button className="block w-full text-left p-2 rounded-lg hover:bg-gray-700">GIFs</button>
          </div>
        </div>
      </aside>

      {/* Main Content - Gallery Grid */}
      <main className="col-center w-3/5 p-4">
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <h1 className="text-xl font-bold">Gallery</h1>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {galleryItems.map(item => (
            <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
              <div className={`h-28 bg-gradient-to-tr ${item.color} grid place-items-center`}>
                {getLucideIcon(item.icon)}
              </div>
              <div className="p-3">
                <p className="text-[12px] font-semibold">{item.title}</p>
                <p className="text-[9px] text-gray-400">{item.count}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar - Gallery Info */}
      <aside className="col-right hidden lg:flex flex-col w-1/5 p-4 space-y-4">
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
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Gallery Settings</h3>
          <div className="space-y-2 text-sm">
            <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 1.7l-1.4 7a2 2 0 0 0 2 2.3h5.6a2 2 0 0 0 2-2.3l-1.4-7a2 2 0 0 0-2-1.7z"></path>
                <path d="M8 21a5 5 0 1 0 8 0"></path>
              </svg>
              Backup
            </button>
            <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                <path d="M12 22s7-4 7-10V5l-7-3-7 3v7c0 6 7 10 7 10z"></path>
              </svg>
              Sync
            </button>
            <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 1.7l-1.4 7a2 2 0 0 0 2 2.3h5.6a2 2 0 0 0 2-2.3l-1.4-7a2 2 0 0 0-2-1.7z"></path>
                <path d="M8 21a5 5 0 1 0 8 0"></path>
              </svg>
              Import
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Recently Added</h3>
          <div className="grid grid-cols-3 gap-2">
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&q=60" 
              alt="Recent item 1" 
              className="w-full h-16 object-cover rounded"
            />
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150&q=60" 
              alt="Recent item 2" 
              className="w-full h-16 object-cover rounded"
            />
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=60" 
              alt="Recent item 3" 
              className="w-full h-16 object-cover rounded"
            />
            <img 
              src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&q=60" 
              alt="Recent item 4" 
              className="w-full h-16 object-cover rounded"
            />
            <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&q=60" 
              alt="Recent item 5" 
              className="w-full h-16 object-cover rounded"
            />
            <img 
              src="https://images.unsplash.com/photo-1524758870432-af57e54afa26?w=150&q=60" 
              alt="Recent item 6" 
              className="w-full h-16 object-cover rounded"
            />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default GalleryPage;