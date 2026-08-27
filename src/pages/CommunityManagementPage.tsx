import React, { useState } from 'react';
import { Users, Settings, BarChart3, Shield, MessageSquare, Calendar, Bell, AlertTriangle, Eye, EyeOff } from 'lucide-react';

const CommunityManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'moderation' | 'analytics'>('overview');
  
  // Mock data for community stats
  const communityStats = {
    totalMembers: 12423,
    newMembers: 42,
    postsToday: 87,
    activeNow: 321,
    growth: '+12.4%'
  };
  
  // Mock data for members
  const members = [
    { id: 1, name: 'Alex Johnson', username: '@alexj', role: 'Admin', status: 'Active', joined: '2023-01-15' },
    { id: 2, name: 'Maria Garcia', username: '@mariag', role: 'Moderator', status: 'Active', joined: '2023-02-20' },
    { id: 3, name: 'Samuel Chen', username: '@samc', role: 'Member', status: 'Active', joined: '2023-03-10' },
    { id: 4, name: 'Emma Wilson', username: '@emmaw', role: 'Member', status: 'Inactive', joined: '2023-04-05' },
    { id: 5, name: 'David Kim', username: '@davidk', role: 'Member', status: 'Active', joined: '2023-05-12' }
  ];
  
  // Mock data for pending approvals
  const pendingApprovals = [
    { id: 1, name: 'James Smith', username: '@jamess', reason: 'Requested to join', date: '2023-08-15' },
    { id: 2, name: 'Olivia Brown', username: '@oliviab', reason: 'Requested to join', date: '2023-08-16' },
    { id: 3, name: 'William Davis', username: '@williamd', reason: 'Requested to join', date: '2023-08-17' }
  ];
  
  // Mock data for reported content
  const reportedContent = [
    { id: 1, type: 'Post', reporter: 'User123', reason: 'Spam', status: 'Pending', date: '2023-08-15' },
    { id: 2, type: 'Comment', reporter: 'User456', reason: 'Harassment', status: 'Reviewed', date: '2023-08-16' },
    { id: 3, type: 'User', reporter: 'User789', reason: 'Impersonation', status: 'Pending', date: '2023-08-17' }
  ];

  return (
    <div className="flex w-full">
      {/* Left Sidebar - Management Navigation */}
      <aside className="col-left hidden md:flex flex-col w-1/5 p-4 space-y-6">
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="font-bold text-lg mb-3">Manage Community</h2>
          <nav className="space-y-1">
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'overview' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Overview
            </button>
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'members' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('members')}
            >
              <Users className="h-5 w-5 mr-2" />
              Members
            </button>
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'moderation' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('moderation')}
            >
              <Shield className="h-5 w-5 mr-2" />
              Moderation
            </button>
            <button 
              className={`flex items-center w-full p-2 rounded-lg text-left ${
                activeTab === 'analytics' ? 'bg-orange-500/20 text-orange-500' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Analytics
            </button>
          </nav>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700">
              <Settings className="h-4 w-4 mr-2" />
              Community Settings
            </button>
            <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700">
              <Bell className="h-4 w-4 mr-2" />
              Announcements
            </button>
            <button className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Event
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content - Management Dashboard */}
      <main className="col-center w-3/5 p-4">
        {/* Page Header */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Tech Innovators Management</h1>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-semibold">
                View Community
              </button>
              <button className="px-4 py-2 bg-orange-500 text-gray-900 rounded-lg text-sm font-semibold">
                Save Changes
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-sm">Total Members</div>
              <div className="text-2xl font-bold">{communityStats.totalMembers.toLocaleString()}</div>
              <div className="text-green-500 text-xs mt-1">↑ {communityStats.growth}</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-sm">New Today</div>
              <div className="text-2xl font-bold">{communityStats.newMembers}</div>
              <div className="text-gray-400 text-xs mt-1">+5 from yesterday</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-sm">Posts Today</div>
              <div className="text-2xl font-bold">{communityStats.postsToday}</div>
              <div className="text-gray-400 text-xs mt-1">+12 from yesterday</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="text-gray-400 text-sm">Active Now</div>
              <div className="text-2xl font-bold">{communityStats.activeNow}</div>
              <div className="text-gray-400 text-xs mt-1">Peak: 450 at 2PM</div>
            </div>
          </div>
        )}
        
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="font-bold mb-3">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-orange-500/20 p-2 rounded-lg mr-3">
                      <Users className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold">New member joined</p>
                      <p className="text-sm text-gray-400">Alex Johnson joined 2 hours ago</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">2h ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold">New post created</p>
                      <p className="text-sm text-gray-400">Maria Garcia posted about AI trends</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">4h ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-green-500/20 p-2 rounded-lg mr-3">
                      <Shield className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Content moderated</p>
                      <p className="text-sm text-gray-400">Removed inappropriate comment</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">6h ago</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="font-bold mb-3">Pending Approvals</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Reason</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingApprovals.map(approval => (
                      <tr key={approval.id} className="border-t border-gray-700">
                        <td className="py-3">
                          <div className="font-semibold">{approval.name}</div>
                          <div className="text-gray-400 text-sm">{approval.username}</div>
                        </td>
                        <td className="py-3 text-gray-300">{approval.reason}</td>
                        <td className="py-3 text-gray-400 text-sm">{approval.date}</td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs">
                              Approve
                            </button>
                            <button className="px-2 py-1 bg-red-500/20 text-red-500 rounded text-xs">
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">Community Members</h2>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Search members..." 
                    className="px-3 py-2 bg-gray-700 rounded-lg text-sm"
                  />
                  <select className="px-3 py-2 bg-gray-700 rounded-lg text-sm">
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>Moderator</option>
                    <option>Member</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Role</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Joined</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(member => (
                      <tr key={member.id} className="border-t border-gray-700">
                        <td className="py-3">
                          <div className="font-semibold">{member.name}</div>
                          <div className="text-gray-400 text-sm">{member.username}</div>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            member.role === 'Admin' ? 'bg-red-500/20 text-red-500' :
                            member.role === 'Moderator' ? 'bg-blue-500/20 text-blue-500' :
                            'bg-gray-500/20 text-gray-500'
                          }`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            member.status === 'Active' ? 'bg-green-500/20 text-green-500' :
                            'bg-gray-500/20 text-gray-500'
                          }`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-400 text-sm">{member.joined}</td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button className="p-1 bg-gray-700 rounded text-xs">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1 bg-gray-700 rounded text-xs">
                              Edit
                            </button>
                            <button className="p-1 bg-red-500/20 text-red-500 rounded text-xs">
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'moderation' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="font-bold mb-3">Reported Content</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm">
                      <th className="pb-2">Type</th>
                      <th className="pb-2">Reporter</th>
                      <th className="pb-2">Reason</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportedContent.map(report => (
                      <tr key={report.id} className="border-t border-gray-700">
                        <td className="py-3 capitalize">{report.type}</td>
                        <td className="py-3">{report.reporter}</td>
                        <td className="py-3 text-gray-300">{report.reason}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            report.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-green-500/20 text-green-500'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-400 text-sm">{report.date}</td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button className="px-2 py-1 bg-orange-500/20 text-orange-500 rounded text-xs">
                              Review
                            </button>
                            <button className="px-2 py-1 bg-gray-700 rounded text-xs">
                              Dismiss
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="font-bold mb-3">Moderation Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    <h3 className="font-semibold">Auto-Moderation</h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">Automatically detect and handle flagged content</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
                
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-semibold">Ban System</h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">Manage temporary and permanent bans</p>
                  <button className="px-3 py-1 bg-gray-700 rounded text-sm">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="font-bold mb-4">Community Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Member Growth (Last 30 Days)</h3>
                  <div className="bg-gray-700/50 rounded-lg p-4 h-64 flex items-end justify-between">
                    {[40, 65, 50, 75, 90, 80, 100, 95, 110, 120, 115, 130].map((height, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-6 bg-orange-500 rounded-t" 
                          style={{ height: `${height}px` }}
                        ></div>
                        <span className="text-xs mt-2 text-gray-400">{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Engagement Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Posts per Day</span>
                        <span>87 avg</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Comments per Post</span>
                        <span>4.2 avg</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Retention Rate</span>
                        <span>78%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Active Members</span>
                        <span>2,456</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Right Sidebar - Quick Stats */}
      <aside className="col-right hidden lg:flex flex-col w-1/5 p-4 space-y-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Community Health</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Positive Interactions</span>
                <span>84%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Rule Violations</span>
                <span>3%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '3%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Response Time</span>
                <span>2h avg</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-4">
          <h3 className="font-bold mb-3">Moderator Queue</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Pending Reports</span>
              <span className="bg-orange-500 text-gray-900 px-2 py-1 rounded text-xs">12</span>
            </div>
            <div className="flex justify-between">
              <span>New Members</span>
              <span className="bg-blue-500 text-gray-900 px-2 py-1 rounded text-xs">5</span>
            </div>
            <div className="flex justify-between">
              <span>Content Reviews</span>
              <span className="bg-purple-500 text-gray-900 px-2 py-1 rounded text-xs">8</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CommunityManagementPage;