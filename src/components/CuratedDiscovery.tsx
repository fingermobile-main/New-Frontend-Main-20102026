import React, { useState, useEffect } from 'react';

interface DiscoveryItem {
  id: string;
  type: 'member' | 'topic' | 'hashtag' | 'trend';
  title: string;
  description?: string;
  imageUrl?: string;
  followers?: number;
  posts?: number;
}

interface CuratedDiscoveryProps {
  items?: DiscoveryItem[];
  limit?: number;
}

const CuratedDiscovery: React.FC<CuratedDiscoveryProps> = ({
  items: propItems,
  limit = 5
}) => {
  const [items, setItems] = React.useState<DiscoveryItem[]>(propItems || []);

  // Mock data if no items provided
  React.useEffect(() => {
    if (!propItems || propItems.length === 0) {
      setItems([
        {
          id: '1',
          type: 'member',
          title: 'Tech Innovators',
          description: 'Community of technology enthusiasts and developers',
          followers: 12450
        },
        {
          id: '2',
          type: 'topic',
          title: '#WebDevelopment',
          description: 'Latest trends in web development',
          posts: 8934
        },
        {
          id: '3',
          type: 'hashtag',
          title: '#AI',
          description: 'Artificial Intelligence discussions',
          posts: 15678
        },
        {
          id: '4',
          type: 'trend',
          title: 'Remote Work Culture',
          description: 'Trending topic this week',
          posts: 5432
        },
        {
          id: '5',
          type: 'member',
          title: 'Creative Designers',
          description: 'UI/UX designers and creative professionals',
          followers: 9876
        }
      ]);
    }
  }, [propItems]);

  const getIcon = (type: string) => {
    switch (type) {
    case 'member': return '👥';
    case 'topic': return '💬';
    case 'hashtag': return '#️⃣';
    case 'trend': return '📈';
    default: return '✨';
    }
  };

  const getSubtitle = (item: DiscoveryItem) => {
    if (item.followers !== undefined) {
      return `${item.followers.toLocaleString()} followers`;
    }
    if (item.posts !== undefined) {
      return `${item.posts.toLocaleString()} posts`;
    }
    return item.description || '';
  };

  return (
    <div className="space-y-3">
      {items.slice(0, limit).map((item) => (
        <div
          key={item.id}
          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
        >
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-xl">
            {getIcon(item.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {item.title}
            </h4>
            <p className="text-xs text-slate-700 font-medium mt-0.5">
              {getSubtitle(item)}
            </p>
          </div>
        </div>
      ))}

      <button className="w-full mt-4 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
        View All Discoveries →
      </button>
    </div>
  );
};

export default CuratedDiscovery;
