import React from 'react';

const AdminDashboardPage: React.FC = () => {
  // Mock data for the admin dashboard
  const kpiData = [
    { title: 'MAU', value: '48.2M', change: '+8.4% WoW', chart: [40, 55, 48, 70, 62, 88] },
    { title: 'POSTS / HR', value: '3.1M', change: '+12%', chart: [50, 42, 65, 60, 80, 92] },
    { title: 'FEED LATENCY', value: '312ms', change: 'p50 ✓ <500', chart: [80, 70, 58, 42, 38, 30] },
    { title: 'FAN-OUT Q', value: '98.7%', change: 'SQS healthy', chart: [70, 75, 68, 82, 78, 98] }
  ];

  const trafficData = [35, 50, 44, 62, 58, 80, 72, 95, 85];
  const memberData = [
    { id: 1, name: 'Amara Okafor', username: '@amara', role: 'CREATOR', followers: '1.2M', status: 'active', avatar: 'https://i.pravatar.cc/50?img=32' },
    { id: 2, name: 'Mod Bot', username: '@sys', role: 'SERVICE', followers: '—', status: 'active', avatar: 'https://i.pravatar.cc/50?img=68' }
  ];

  // Function to render sparkline chart
  const renderSparkline = (data: number[]) => {
    return (
      <div className="flex items-end gap-1 h-8 mt-2">
        {data.map((value, index) => (
          <div 
            key={index} 
            className={`w-full rounded-t ${index % 2 === 0 ? 'bg-yellow-500' : 'bg-orange-500'}`}
            style={{ height: `${value}%` }}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex w-full">
      {/* Left Admin Rail */}
      <aside className="col-left hidden md:flex sticky top-16 self-start h-[calc(100vh-64px)] flex-col px-3 py-4 border-r border-gray-700 bg-gray-900">
        <div className="px-3 mb-4 font-bold text-[14px]">
          <span className="text-orange-500">Finger</span>Mobile
        </div>
        <div className="text-[9px] tracking-widest text-gray-400 mb-2 px-3">SUPER-ADMIN</div>
        <div className="space-y-1 text-[12.5px]">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-orange-500/15 text-orange-500 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <rect width="7" height="9" x="3" y="3" rx="1"></rect>
              <rect width="7" height="5" x="14" y="3" rx="1"></rect>
              <rect width="7" height="9" x="14" y="12" rx="1"></rect>
              <rect width="7" height="5" x="3" y="16" rx="1"></rect>
            </svg>
            Overview
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Members
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            RBAC
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            Events
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
              <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
              <path d="M3 12A9 3 0 0 0 21 12"></path>
            </svg>
            DB Integ
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="15"></line>
              <line x1="15" y1="9" x2="9" y2="15"></line>
            </svg>
            Feature toggles
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
            System status
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M12 22s7-4 7-10V5l-7-3-7 3v7c0 6 7 10 7 10z"></path>
            </svg>
            Moderation
          </div>
        </div>
        <div className="mt-auto flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700">
          <img src="https://i.pravatar.cc/40?img=60" className="w-8 h-8 rounded-full" alt="Admin" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold truncate">Root A.</p>
            <p className="text-[8px] text-yellow-500">SUPER-ADMIN</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="col-center min-h-screen border-r border-gray-700">
        <div className="px-4 md:px-6 py-6 max-w-[980px] mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-[20px] font-bold">Operations Overview</h1>
              <p className="text-[10px] text-gray-400">admin · unified telemetry · 500ms p50 feed</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-orange-500 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                all systems go
              </span>
              <button className="px-3 py-1.5 rounded-lg bg-orange-500 text-gray-900 text-[11px] font-bold flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" x2="12" y1="15" y2="3"></line>
                </svg>
                Report
              </button>
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {kpiData.map((kpi, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 rounded-2xl p-3.5">
                <p className="text-[9px] text-gray-400">{kpi.title}</p>
                <p className="text-[26px] font-bold font-sans leading-tight">{kpi.value}</p>
                <p className="text-[9px] text-orange-500">{kpi.change}</p>
                {renderSparkline(kpi.chart)}
              </div>
            ))}
          </div>

          {/* Traffic Chart and Consistency Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div className="md:col-span-2 bg-gray-800 border border-gray-700 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold">Feed traffic</h3>
                <span className="text-[9px] text-gray-400">GET /feed · realtime</span>
              </div>
              <div className="flex items-end gap-1 h-28">
                {trafficData.map((height, index) => (
                  <div 
                    key={index} 
                    className={`flex-1 rounded-t ${index >= 5 ? 'bg-yellow-500' : 'bg-orange-500'}`} 
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between mt-1 text-[8px] text-gray-400">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>now</span>
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
              <h3 className="text-[13px] font-bold mb-2">Consistency</h3>
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-gray-400">Push-model</span>
                  <b className="text-orange-500">instant</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pull (viral)</span>
                  <b className="text-yellow-500">on-demand</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">DynamoDB</span>
                  <b>98.7%</b>
                </div>
              </div>
              <div className="mt-3 text-[8px] text-gray-400">eventual ● consistent</div>
            </div>
          </div>

          {/* Member Management Table */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-700">
              <h3 className="text-[13px] font-bold">Member management</h3>
              <button className="text-[10px] text-orange-500">view all</button>
            </div>
            <table className="w-full text-left text-[12px]">
              <thead className="text-[9px] text-gray-400">
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-2 font-medium">USER</th>
                  <th className="px-4 py-2 font-medium">ROLE</th>
                  <th className="px-4 py-2 font-medium">FOLLOWERS</th>
                  <th className="px-4 py-2 font-medium">STATUS</th>
                  <th className="px-4 py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {memberData.map(member => (
                  <tr key={member.id} className="border-b border-gray-700 hover:bg-gray-850">
                    <td className="px-4 py-2.5 flex items-center gap-2.5">
                      <img src={member.avatar} className="w-8 h-8 rounded-full" alt={member.name} />
                      <div>
                        <p className="text-[12px] font-semibold">{member.name}</p>
                        <p className="text-[8px] text-gray-400">{member.username}</p>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[9px] px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-500">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">{member.followers}</td>
                    <td className="px-4 py-2.5 text-orange-500">{member.status}</td>
                    <td className="px-4 py-2.5">
                      <button className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="19" cy="12" r="1"></circle>
                          <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;