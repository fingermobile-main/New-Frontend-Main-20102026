import React from 'react';

const UnifiedDashboardPage: React.FC = () => {
  // Mock data for app tiles
  const appTiles = [
    {
      id: 1,
      title: 'Social',
      subtitle: 'Feed · DMs · groups',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      badge: '12 unread',
      badgeColor: 'text-orange-500',
      bgColor: 'bg-orange-500/15',
      borderColor: 'hover:border-orange-500/50'
    },
    {
      id: 2,
      title: 'Commerce',
      subtitle: 'Storefronts · marketplace',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <circle cx="6" cy="6" r="3"></circle>
          <circle cx="6" cy="18" r="3"></circle>
          <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"></path>
        </svg>
      ),
      badge: '₦1.4M',
      badgeColor: 'text-yellow-500',
      bgColor: 'bg-yellow-500/15',
      borderColor: 'hover:border-yellow-500/50'
    },
    {
      id: 3,
      title: 'Finance',
      subtitle: 'Wallet · payouts · gems',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M19 7v10c0 5.555-4.029 8-9 8S1 19.444 1 14V7"></path>
          <path d="M12 10c-2.666 0-5.333 1-5 3 .333 2 2.667 6 5 6 2.333 0 4.667-4 5-6 .333-2-2.333-3-5-3z"></path>
        </svg>
      ),
      badge: '₦3.9M',
      badgeColor: 'text-orange-500',
      bgColor: 'bg-orange-500/15',
      borderColor: 'hover:border-orange-500/50'
    },
    {
      id: 4,
      title: 'Learning',
      subtitle: 'Courses · progress',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M22 10v3a2 2 0 0 1-2 2h-3.5l-1 1H15l-1-1H6l-1 1H4.5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h15a2 2 0 0 1 2 2Z"></path>
          <path d="M12 2v3"></path>
          <path d="m7 5 1 1.5L9 5"></path>
          <path d="m17 5-1 1.5L15 5"></path>
        </svg>
      ),
      badge: '8',
      badgeColor: 'text-yellow-500',
      bgColor: 'bg-yellow-500/15',
      borderColor: 'hover:border-yellow-500/50'
    }
  ];

  // Mock data for recent activity
  const recentActivity = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      ),
      text: 'Amara liked your post',
      time: '2m',
      category: 'SOCIAL',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/15'
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <circle cx="8" cy="8" r="6"></circle>
          <path d="M18.09 12.58a6 6 0 0 0-8-8"></path>
          <path d="M18 14v.01"></path>
          <path d="M18 18v.01"></path>
          <path d="M18 8v.01"></path>
        </svg>
      ),
      text: 'New order · Ring #03',
      time: '1h',
      amount: '₦128k',
      category: '₦128k',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/15'
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d="M12 22s7-4 7-10V5l-7-3-7 3v7c0 6 7 10 7 10z"></path>
        </svg>
      ),
      text: 'Payout processed',
      time: '3h',
      amount: '₦2.4M',
      category: '₦2.4M',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/15'
    }
  ];

  // Mock data for balance
  const balanceData = {
    total: '₦6.3M',
    settled: 'settled · all apps',
    breakdown: [
      { label: 'Storefront', amount: '₦1.4M' },
      { label: 'Gems earned', amount: '₦880k' },
      { label: 'Tips', amount: '₦132k' }
    ]
  };

  return (
    <div className="flex w-full">
      {/* Left Unified Rail */}
      <aside className="col-left hidden md:flex sticky top-16 self-start h-[calc(100vh-64px)] flex-col px-3 py-4 border-r border-gray-700 bg-gray-900">
        <div className="px-3 mb-4 font-bold text-[14px]">
          <span className="text-orange-500">Finger</span>Mobile
        </div>
        <div className="text-[9px] tracking-widest text-gray-400 mb-2 px-3">UNIFIED .SYS</div>
        <div className="space-y-1 text-[12.5px]">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-orange-500/15 text-orange-500 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <rect width="7" height="7" x="3" y="3" rx="1"></rect>
              <rect width="7" height="7" x="14" y="3" rx="1"></rect>
              <rect width="7" height="7" x="14" y="14" rx="1"></rect>
              <rect width="7" height="7" x="3" y="14" rx="1"></rect>
            </svg>
            Hub
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v4"></path>
              <path d="M12 16h.01"></path>
            </svg>
            Storefront
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M19 7v10c0 5.555-4.029 8-9 8S1 19.444 1 14V7"></path>
              <path d="M12 10c-2.666 0-5.333 1-5 3 .333 2 2.667 6 5 6 2.333 0 4.667-4 5-6 .333-2-2.333-3-5-3z"></path>
            </svg>
            Wallet
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Community
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M17 14l-5 5-5-5"></path>
            </svg>
            Content
          </div>
        </div>
        <div className="mt-auto flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold">Unified</p>
            <p className="text-[8px] text-gray-400">all apps</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="col-center min-h-screen border-r border-gray-700">
        <div className="px-4 md:px-6 py-6 max-w-[1020px] mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-[20px] font-bold">Unified Dashboard</h1>
              <p className="text-[10px] text-gray-400">aggregate · social · commerce · finance · learning</p>
            </div>
            <span className="text-[10px] text-orange-500 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              sync'd
            </span>
          </div>

          {/* App Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {appTiles.map(tile => (
              <div 
                key={tile.id} 
                className={`bg-gray-800 border border-gray-700 rounded-2xl p-4 cursor-pointer ${tile.borderColor}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`grid w-9 h-9 place-items-center rounded-xl ${tile.bgColor} ${tile.badgeColor}`}>
                    {tile.icon}
                  </span>
                  <span className={`text-[8px] ${tile.badgeColor}`}>{tile.badge}</span>
                </div>
                <p className="text-[13px] font-semibold mt-3">{tile.title}</p>
                <p className="text-[11px] text-gray-400">{tile.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Activity and Balance Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 bg-gray-800 border border-gray-700 rounded-2xl p-4">
              <h3 className="text-[13px] font-bold mb-3">Recent activity</h3>
              <div className="space-y-3">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <span className={`grid w-8 h-8 place-items-center rounded-lg ${activity.bgColor} ${activity.color}`}>
                      {activity.icon}
                    </span>
                    <p className="text-[12px] flex-1">
                      {activity.text}<br/>
                      <span className="text-[8px] text-gray-400">{activity.time}</span>
                    </p>
                    <span className={`text-[8px] ${activity.color}`}>
                      {activity.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
              <h3 className="text-[13px] font-bold mb-2">Balance</h3>
              <p className="text-[26px] font-bold font-sans">{balanceData.total}</p>
              <p className="text-[9px] text-gray-400">{balanceData.settled}</p>
              <div className="mt-3 space-y-2 text-[11px]">
                {balanceData.breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-400">{item.label}</span>
                    <b>{item.amount}</b>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full py-2 rounded-lg bg-orange-500 text-gray-900 text-[11px] font-bold">
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UnifiedDashboardPage;