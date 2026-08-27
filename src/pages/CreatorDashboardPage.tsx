import React from 'react';

const CreatorDashboardPage: React.FC = () => {
  // Mock data for the creator dashboard
  const topContent = [
    {
      id: 1,
      title: "FingerWars ranked patch 🔥",
      type: "POST",
      time: "2h",
      metric: "1.2M",
      metricLabel: "reach",
      trend: "up",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&q=50"
    },
    {
      id: 2,
      title: "Storefront launch day 🛍️",
      type: "POST",
      time: "5h",
      metric: "₦880k",
      metricLabel: "revenue",
      trend: "neutral",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&q=50"
    },
    {
      id: 3,
      title: "Gems unboxing 💎",
      type: "SHORTS",
      time: "1d",
      metric: "640k",
      metricLabel: "views",
      trend: "up",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=50"
    }
  ];

  // Follower data
  const followerData = {
    total: "128,420",
    mutual: "128k",
    percentage: 72
  };

  return (
    <div className="flex w-full">
      {/* Left Creator Rail */}
      <aside className="col-left hidden md:flex sticky top-16 self-start h-[calc(100vh-64px)] flex-col px-3 py-4 border-r border-gray-700 bg-gray-900">
        <div className="px-3 mb-4 font-bold text-[14px]">
          <span className="text-orange-500">Finger</span>Mobile
        </div>
        <div className="text-[9px] tracking-widest text-gray-400 mb-2 px-3">CREATOR OS</div>
        <div className="space-y-1 text-[12.5px]">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-orange-500/15 text-orange-500 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Home
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M3 3v18h18"></path>
              <path d="m19 9-5 5-4-4-3 3"></path>
            </svg>
            Analytics
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <line x1="12" x2="12" y1="2" y2="22"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Payouts
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            Content
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M5.5 13.5A2.5 2.5 0 0 1 8 11h12a2.5 2.5 0 0 1 2.5 2.5v5a2.5 2.5 0 0 1-2.5 2.5H8a2.5 2.5 0 0 1-2.5-2.5v-5z"></path>
              <path d="M12 6V3a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v3"></path>
              <path d="M16 6V3a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v3"></path>
              <path d="M3 11h4"></path>
              <path d="M3 15h4"></path>
              <path d="M3 19h4"></path>
            </svg>
            Editor
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M6 3v12a6 6 0 0 0 12 0V3"></path>
              <path d="M6 21v-6a3 3 0 0 1 6 0v6"></path>
              <path d="M18 21v-6a3 3 0 0 0-6 0v6"></path>
            </svg>
            Gems
          </div>
        </div>
        <div className="mt-auto flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700">
          <img src="https://i.pravatar.cc/40?img=12" className="w-8 h-8 rounded-full" alt="Creator" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold truncate">Kemi Demo</p>
            <p className="text-[8px] text-orange-500">CREATOR</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="col-center min-h-screen border-r border-gray-700">
        <div className="px-4 md:px-6 py-6 max-w-[960px] mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h1 className="text-[20px] font-bold">@kemifo Studio</h1>
              <p className="text-[10px] text-gray-400">creator dashboard · unified</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-orange-500 text-gray-900 text-[11px] font-bold flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                New post
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-700 text-[11px] font-semibold">
                Export
              </button>
            </div>
          </div>

          {/* Earnings and Reach Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div className="bg-gradient-to-tr from-gray-800 to-yellow-500/10 border border-gray-700 rounded-2xl p-4">
              <p className="text-[9px] text-gray-400">MONTHLY EARNINGS</p>
              <p className="text-[26px] font-bold font-sans leading-tight">
                ₦ 2.4M <span className="text-[12px] text-yellow-500 font-mono">▲ 18%</span>
              </p>
              <p className="text-[11px] text-gray-400">Gems · storefront · tips</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
              <p className="text-[9px] text-gray-400">REACH</p>
              <p className="text-[26px] font-bold font-sans leading-tight">18.9M</p>
              <p className="text-[11px] text-gray-400">128k followers · +2.1k this wk</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
              <p className="text-[9px] text-gray-400">ENGAGEMENT</p>
              <p className="text-[26px] font-bold font-sans leading-tight">
                8.6<span className="text-[14px] text-gray-400">%</span>
              </p>
              <p className="text-[11px] text-gray-400">vs platform avg 4.1%</p>
            </div>
          </div>

          {/* Top Content Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden mb-5">
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-700">
              <h3 className="text-[13px] font-bold">Top content</h3>
              <div className="flex gap-2 text-[9px] text-gray-400">
                <span className="px-2 py-0.5 rounded bg-gray-700">7d</span>
                <span className="px-2 py-0.5 rounded bg-gray-700">30d</span>
              </div>
            </div>
            <div className="divide-y divide-gray-700">
              {topContent.map(content => (
                <div key={content.id} className="flex items-center gap-3 p-3.5">
                  <img src={content.image} className="w-12 h-12 rounded-lg object-cover" alt={content.title} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-semibold truncate">{content.title}</p>
                    <p className="text-[8px] text-gray-400">{content.type} · {content.time}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[12px] font-bold ${
                      content.trend === 'up' ? 'text-orange-500' : 
                      content.trend === 'down' ? 'text-red-500' : 'text-gray-300'
                    }`}>
                      {content.metric} {content.trend === 'up' && '↑'}
                    </p>
                    <p className="text-[8px] text-gray-400">{content.metricLabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Follower Net and Fan-Out Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
              <p className="text-[9px] text-gray-400 mb-1">FOLLOWER NET</p>
              <p className="text-[13px] font-semibold mb-2">{followerData.total} followers</p>
              <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                <span>Mutual</span>
                <span>{followerData.mutual}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-700">
                <div 
                  className="h-full rounded-full bg-orange-500" 
                  style={{ width: `${followerData.percentage}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
              <p className="text-[9px] text-gray-400 mb-1">FAN-OUT MODE</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-1 rounded bg-orange-500/15 text-orange-500">push</span>
                <span className="text-[10px] text-gray-400">your posts → Redis caches</span>
              </div>
              <button className="mt-3 text-[9px] text-orange-500">view fan-out health</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatorDashboardPage;