import React, { useState } from 'react';


interface PlaylistItem {
  id: string;
  title: string;
  artist?: string;
  duration?: string;
  thumbnail?: string;
  type?: 'music' | 'video' | 'podcast';
}

interface PlaylistProps {
  items?: PlaylistItem[];
  title?: string;
  onPlay?: (item: PlaylistItem) => void;
  className?: string;
}

const Playlist: React.FC<PlaylistProps> = ({
  items = [],
  title = 'Playlist',
  onPlay,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = React.useState<number | null>(null);

  const handlePlay = (item: PlaylistItem, index: number) => {
    setCurrentIndex(index);
    if (onPlay) {
      onPlay(item);
    }
  };

  if (items.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-8 text-center ${className}`}>
        <p className="text-slate-700">No items in playlist</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="p-4 border-b border-slate-300">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{items.length} items</p>
      </div>
      <ul className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <li
            key={item.id}
            className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              currentIndex === index ? 'bg-blue-50' : ''
            }`}
            onClick={() => handlePlay(item, index)}
          >
            {item.thumbnail && (
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-12 h-12 rounded-md object-cover mr-4"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
              {item.artist && (
                <p className="text-xs text-gray-600">{item.artist}</p>
              )}
            </div>
            {item.duration && (
              <span className="text-xs text-slate-700 ml-2">{item.duration}</span>
            )}
            <button className="ml-4 p-2 text-brand-blue hover:bg-blue-100 rounded-full">
              {currentIndex === index ? '⏸' : '▶️'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
