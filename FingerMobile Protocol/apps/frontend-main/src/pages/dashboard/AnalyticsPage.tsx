import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('30d');

  // Dynamic telemetry data based on selected time range
  const userGrowthData = [
    { month: 'Jan', users: 400 },
    { month: 'Feb', users: 600 },
    { month: 'Mar', users: 800 },
    { month: 'Apr', users: 1200 },
    { month: 'May', users: 1600 },
    { month: 'Jun', users: 2000 }
  ];

  const engagementData = [
    { name: 'Disputes & Claims', value: 420 },
    { name: 'Escrow Settlements', value: 780 },
    { name: 'Franchise Orders', value: 640 },
    { name: 'Peer Transfers', value: 1120 }
  ];

  const activities = [
    {
      id: 1,
      title: 'Merchant Gateway Staked',
      detail: 'Lagos Island Node #42 staked 25,000 FMG tokens for liquidity validation',
      time: '12 mins ago',
      badge: 'STAKING',
      badgeColor: 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold'
    },
    {
      id: 2,
      title: 'Smart Settlement Dispatched',
      detail: 'Batch payout #PY-9042 successfully executed across 48 verified sub-accounts',
      time: '34 mins ago',
      badge: 'SETTLEMENT',
      badgeColor: 'bg-blue-100 text-blue-950 border border-blue-400 font-bold'
    },
    {
      id: 3,
      title: 'Hallmark Credential Issued',
      detail: 'Accredited franchise license minted on-chain for Hub #09 (Port Harcourt)',
      time: '1 hour ago',
      badge: 'COMPLIANCE',
      badgeColor: 'bg-purple-100 text-purple-950 border border-purple-400 font-bold'
    },
    {
      id: 4,
      title: 'Escrow Resolution Finalized',
      detail: 'Automated arbiter consensus released locked funds for dispute #DP-8120',
      time: '2 hours ago',
      badge: 'RESOLUTION',
      badgeColor: 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold'
    }
  ];

  const COLORS = ['#2563eb', '#059669', '#d97706', '#7c3aed'];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onMenuToggle={() => {}} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 space-y-6"
      >
        <PlatformOwnershipCard />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-300 pb-5">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics & Protocol Telemetry</h1>
            <p className="text-slate-700 font-semibold mt-1">
              Real-time settlement throughput, operational nodes, and transactional velocity metrics
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-300 shadow-sm">
            {(['24h', '7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                type="button"
                aria-label={`Filter time range ${range}`}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-slate-300 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">Total Protocol Volume</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">₦184.2M</div>
              <p className="text-xs font-bold text-emerald-800 mt-1 flex items-center gap-1">
                <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-950 font-black">+24.5%</span>
                vs previous cycle
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-300 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">Active Validator Nodes</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.036-.687-.101-1.004A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">1,480 Nodes</div>
              <p className="text-xs font-bold text-emerald-800 mt-1 flex items-center gap-1">
                <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-950 font-black">99.98%</span>
                consensus uptime
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-300 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">Settled Transactions</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">42,891</div>
              <p className="text-xs font-bold text-emerald-800 mt-1 flex items-center gap-1">
                <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-950 font-black">+18.2%</span>
                in {timeRange}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-300 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">Avg Settlement Latency</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-slate-900">1.28s</div>
              <p className="text-xs font-bold text-emerald-800 mt-1 flex items-center gap-1">
                <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-950 font-black">-140ms</span>
                optimistic finality
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-slate-300 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg font-black text-slate-900">Protocol Adoption & Throughput</CardTitle>
              <p className="text-xs font-semibold text-slate-700">Aggregated node execution and account onboarding</p>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={userGrowthData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }} />
                  <YAxis tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.75rem', fontWeight: 600 }}
                  />
                  <Legend wrapperStyle={{ fontWeight: 600, color: '#1e293b' }} />
                  <Bar dataKey="users" fill="#2563eb" name="Monthly Users" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-slate-300 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg font-black text-slate-900">Transaction Mix by Type</CardTitle>
              <p className="text-xs font-semibold text-slate-700">Dispute settlements, franchise orders, and transfer distribution</p>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={95}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.75rem', fontWeight: 600 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-300 shadow-sm bg-white">
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-slate-900">Live Protocol Event Telemetry</CardTitle>
                <p className="text-xs font-semibold text-slate-700">Stream of on-chain validations, staking checkpoints, and settlements</p>
              </div>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                LIVE
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start md:items-center justify-between p-4 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors bg-white gap-4"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 font-black mt-0.5 md:mt-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900">{act.title}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${act.badgeColor}`}>
                          {act.badge}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">{act.detail}</p>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-600 whitespace-nowrap">{act.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Footer />
    </div>
  );
};

export default AnalyticsPage;
