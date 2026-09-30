import React from 'react';

const TrendingTopicsWidget: React.FC = () => {
  const topics = [
    { tag: '#Blockchain', posts: '12.5K' },
    { tag: '#Web3', posts: '8.2K' },
    { tag: '#FingerMobile', posts: '5.1K' },
    { tag: '#DeFi', posts: '3.4K' },
    { tag: '#NFTs', posts: '2.1K' },
  ];

  return (
    <div className="glass rounded-2xl p-5 border border-white/40 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
      <h3 className="text-sm font-bold text-gray-900 mb-3">Trending Topics</h3>
      <div className="space-y-3">
        {topics.map((topic, index) => (
          <div key={index} className="flex justify-between items-center cursor-pointer group">
            <span className="text-sm font-medium text-gray-700 group-hover:text-brand-blue transition-colors">
              {topic.tag}
            </span>
            <span className="text-xs text-gray-500">
              {topic.posts} posts
            </span>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full text-center text-sm text-brand-blue font-medium hover:underline">
        Show More
      </button>
    </div>
  );
};

export default TrendingTopicsWidget;
