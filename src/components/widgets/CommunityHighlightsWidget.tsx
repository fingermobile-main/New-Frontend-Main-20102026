import React from 'react';

const CommunityHighlightsWidget: React.FC = () => {
  const communities = [
    { name: 'Tech Innovators', members: '14.2K', icon: '💻' },
    { name: 'Crypto Traders', members: '8.9K', icon: '📈' },
    { name: 'Startup Founders', members: '5.6K', icon: '🚀' },
  ];

  return (
    <div className="glass rounded-2xl p-5 border border-white/40 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
      <h3 className="text-sm font-bold text-gray-900 mb-3">Community Highlights</h3>
      <div className="space-y-4">
        {communities.map((comm, index) => (
          <div key={index} className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg border text-gray-950 border-gray-400 font-black">
                {comm.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-brand-blue transition-colors">
                  {comm.name}
                </p>
                <p className="text-xs text-gray-500">{comm.members} members</p>
              </div>
            </div>
            <button className="text-brand-blue hover:bg-blue-50 px-2 py-1 rounded-md text-xs font-medium transition-colors border border-transparent hover:border-blue-100">
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityHighlightsWidget;
