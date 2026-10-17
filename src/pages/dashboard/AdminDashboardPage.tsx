import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import {
  ChartBarIcon,
  MembersIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '../../components/icons';
import { useAuth } from '../../contexts/AuthContext';
import { adminOperationsService } from '../../services/adminOperationsService';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [ficBalance, setFicBalance] = useState(0);
  const [stats, setStats] = useState([
    {
      title: 'Total Members',
      value: '12,482',
      change: '+12.5%',
      color: 'blue'
    },
    {
      title: 'Revenue (FIC)',
      value: '1,240,500',
      change: '+8.3%',
      color: 'green'
    },
    {
      title: 'Content Posts',
      value: '42,680',
      change: '+5.7%',
      color: 'purple'
    },
    {
      title: 'Active Sessions',
      value: '3,240',
      change: '+3.2%',
      color: 'yellow'
    }
  ]);

  React.useEffect(() => {
    adminOperationsService.getDashboardStats().then(data => {
      if (data) {
        setStats([
          {
            title: 'Total Members',
            value: data.totalUsers.toLocaleString(),
            change: '+12.5%',
            color: 'blue'
          },
          {
            title: 'Transactions Recorded',
            value: data.totalTransactions.toLocaleString(),
            change: '+8.3%',
            color: 'green'
          },
          {
            title: 'Moderation Items',
            value: `${data.pendingModeration} Pending`,
            change: `${data.totalModeration} total`,
            color: 'purple'
          },
          {
            title: 'Active Sessions',
            value: data.activeSessions.toLocaleString(),
            change: `${data.systemUptime}% uptime`,
            color: 'yellow'
          }
        ]);
      }
    }).catch(() => {});
  }, []);

  const recentActivity = [
    {
      id: 1,
      member: 'Alex Johnson',
      action: 'Created new post',
      time: '2 min ago'
    },
    {
      id: 2,
      member: 'Sam Wilson',
      action: 'Purchased premium plan',
      time: '15 min ago'
    },
    {
      id: 3,
      member: 'Taylor Swift',
      action: 'Uploaded new video',
      time: '1 hour ago'
    },
    {
      id: 4,
      member: 'John Doe',
      action: 'Reported inappropriate content',
      time: '2 hours ago'
    }
  ];

  const memberRoles = [
    { id: 1, name: 'Super Admin', permissions: 33, members: 1 },
    { id: 2, name: 'Admin', permissions: 28, members: 5 },
    { id: 3, name: 'Finance', permissions: 12, members: 3 },
    { id: 4, name: 'Moderator', permissions: 15, members: 12 },
    { id: 5, name: 'Support', permissions: 8, members: 8 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Admin Dashboard</h1>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            Manage platform settings, members, and monitor activity
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xs border border-slate-300 p-6"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">{stat.title}</p>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                <p className="ml-2 text-xs font-bold text-emerald-800">
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-300 overflow-hidden">
          <div className="border-b border-slate-300 bg-slate-50/50">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'members', label: 'Member Management' },
                { id: 'roles', label: 'Roles & Permissions' },
                { id: 'activity', label: 'Activity Log' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-bold text-sm transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-700 hover:text-slate-900 hover:border-slate-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-black text-slate-900 mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between py-3 px-4 border border-slate-200 rounded-xl bg-slate-50/50"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {activity.member}
                            </p>
                            <p className="text-xs font-semibold text-slate-700 mt-0.5">
                              {activity.action}
                            </p>
                          </div>
                          <p className="text-xs font-bold text-slate-600">
                            {activity.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 mb-4">
                      Platform Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl">
                        <span className="text-sm font-bold text-slate-900">
                          API Services
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 font-black">
                          Operational
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl">
                        <span className="text-sm font-bold text-slate-900">
                          Database
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 font-black">
                          Operational
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3.5 bg-amber-50 border border-amber-300 rounded-xl">
                        <span className="text-sm font-bold text-slate-900">
                          Media Processing
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-400 font-black">
                          Degraded
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl">
                        <span className="text-sm font-bold text-slate-900">
                          Wallet System
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 font-black">
                          Operational
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Member Management Tab */}
            {activeTab === 'members' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-slate-900">
                    Member Management
                  </h3>
                  <button className="px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-xs cursor-pointer text-sm">
                    Add New Member
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-300 rounded-2xl shadow-xs">
                  <table className="min-w-full divide-y divide-slate-300">
                    <thead className="bg-slate-50 border-b border-slate-300">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                        >
                          Member
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                        >
                          Role
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                        >
                          Last Active
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full border border-slate-300 object-cover"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-slate-900">
                                Alex Johnson
                              </div>
                              <div className="text-xs font-semibold text-slate-700">
                                alex@example.com
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-slate-800">Admin</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-black">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-700">
                          2 hours ago
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold space-x-3">
                          <button
                            type="button"
                            className="text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-red-700 hover:text-red-900 hover:underline cursor-pointer"
                          >
                            Suspend
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Roles & Permissions Tab */}
            {activeTab === 'roles' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-slate-900">
                    Roles & Permissions
                  </h3>
                  <button className="px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-xs cursor-pointer text-sm">
                    Add New Role
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {memberRoles.map((role) => (
                    <div
                      key={role.id}
                      className="bg-white border border-slate-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900">
                            {role.name}
                          </h4>
                          <p className="text-xs font-semibold text-slate-700 mt-1">
                            {role.members} members
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-950 border border-blue-400 font-black">
                          {role.permissions} permissions
                        </span>
                      </div>
                      <div className="mt-4">
                        <button className="text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer">
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Log Tab */}
            {activeTab === 'activity' && (
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-4">
                  Activity Log
                </h3>
                <div className="bg-white rounded-2xl border border-slate-300 p-5 shadow-xs">
                  <div className="flow-root">
                    <ul className="divide-y divide-slate-200">
                      <li className="py-3.5">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-xs">
                              AJ
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900">
                              Alex Johnson
                            </p>
                            <p className="text-xs font-semibold text-slate-700 mt-0.5">
                              Created new post in Forum category
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-600">2 min ago</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
