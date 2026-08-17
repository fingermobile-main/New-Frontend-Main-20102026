import { Link} from 'react-router-dom';
import React, {} from 'react';


interface Community {
  id: number;
  name: string;
  description?: string;
  memberCount: string;
  icon: string;
  isJoined: boolean;
}

const CommunitiesSection: React.FC = () => {
  const communities: Community[] = [
    {
      id: 1,
      name: "Tech Enthusiasts",
      description: "A community for tech professionals to discuss the latest innovations",
      memberCount: "12.5K",
      icon: "💻",
      isJoined: true
    },
    {
      id: 2,
      name: "Design Masters",
      description: "Where designers share inspiration and best practices",
      memberCount: "8.3K",
      icon: "🎨",
      isJoined: false
    },
    {
      id: 3,
      name: "Marketing Pros",
      description: "Experts sharing marketing strategies and insights",
      memberCount: "15.2K",
      icon: "📢",
      isJoined: true
    },
    {
      id: 4,
      name: "Entrepreneur Network",
      description: "Connecting startup founders and business leaders",
      memberCount: "22.1K",
      icon: "🚀",
      isJoined: false
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-fm-card p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-fm-gray-900">Communities</h3>
        <Link to="/communities/discover" className="text-sm text-fm-orange hover:underline">
          See all
        </Link>
      </div>
      
      <div className="space-y-4">
        {communities.map(community => (
          <div key={community.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-fm-orange bg-opacity-10 flex items-center justify-center text-xl">
                {community.icon}
              </div>
              <div>
                <h4 className="font-semibold text-fm-gray-900">{community.name}</h4>
                <p className="text-xs text-fm-gray-500 line-clamp-1">{community.description}</p>
                <p className="text-xs text-fm-gray-400">{community.memberCount} members</p>
              </div>
            </div>
            
            {community.isJoined ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Joined
              </span>
            ) : (
              <button className="text-xs bg-fm-gray-100 text-fm-gray-700 px-3 py-1.5 rounded-full hover:bg-fm-orange hover:text-white transition-colors">
                Join
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link to="/communities/create" className="flex items-center justify-center text-fm-orange hover:underline text-sm font-medium">
          <span className="mr-1">+</span> Create a new community
        </Link>
      </div>
    </div>
  );
};

export default CommunitiesSection;