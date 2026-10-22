import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CommunityHighlightsWidget: React.FC = () => {
  const [joined, setJoined] = useState<Record<string, boolean>>({});
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
          <div key={index} className="flex items-center justify-between group">
            <Link to="/communities" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg border text-gray-950 border-gray-400 font-black">
                {comm.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-brand-blue transition-colors">
                  {comm.name}
                </p>
                <p className="text-xs text-slate-700 font-medium">{comm.members} members</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setJoined(prev => ({ ...prev, [comm.name]: !prev[comm.name] }))}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors border ${
                joined[comm.name]
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'text-brand-blue hover:bg-blue-50 border-transparent hover:border-blue-100'
              }`}
            >
              {joined[comm.name] ? 'Joined' : 'Join'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityHighlightsWidget;
