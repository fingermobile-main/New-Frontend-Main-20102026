import React from 'react';
import { ChartBarIcon, MembersIcon, EyeIcon } from '../../../components/icons';
import { PlatformOwnershipCard } from '../../../components/ownership/PlatformOwnershipCard';

// Mock data for charts
const monthlyViewsData = [
  { name: 'Jan', views: 4000 },
  { name: 'Feb', views: 3000 },
  { name: 'Mar', views: 5000 },
  { name: 'Apr', views: 4500 },
  { name: 'May', views: 6000 },
  { name: 'Jun', views: 5500 }
];

const engagementData = [
  { type: 'Likes', value: 12500, color: 'bg-rose-500' },
  { type: 'Comments', value: 3200, color: 'bg-blue-600' },
  { type: 'Shares', value: 1800, color: 'bg-emerald-600' }
];

const BarChart: React.FC<{ data: { name: string; views: number }[] }> = ({
  data
}) => {
  const maxViews = Math.max(...data.map((d) => d.views));
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 h-64 flex items-end justify-around gap-2">
      {data.map((item) => (
        <div
          key={item.name}
          className="flex-1 flex flex-col items-center justify-end h-full"
        >
          <div
            className="w-full bg-blue-600 rounded-t-md hover:bg-blue-700 transition-colors cursor-pointer"
            style={{ height: `${(item.views / maxViews) * 100}%` }}
            title={`${item.views.toLocaleString()} views`}
          ></div>
          <span className="text-xs font-bold text-slate-800 mt-2">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

const DoughnutChart: React.FC<{
  data: { type: string; value: number; color: string }[];
}> = ({ data }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="transparent"
            strokeWidth="3"
            className="stroke-current text-slate-200"
          />
          {
            data.reduce(
              (acc, seg) => {
                const percentage = (seg.value / total) * 100;
                const Component = (
                  <circle
                    key={seg.type}
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    strokeWidth="3.5"
                    strokeDasharray={`${percentage} ${100 - percentage}`}
                    strokeDashoffset={-acc.offset}
                    className={`stroke-current ${seg.color.replace('bg-', 'text-')}`}
                  />
                );
                acc.offset += percentage;
                acc.components.push(Component);
                return acc;
              },
              { offset: 0, components: [] as React.ReactNode[] },
            ).components
          }
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-slate-900">{total.toLocaleString()}</span>
          <span className="text-xs text-slate-700 font-bold uppercase tracking-wider">Total</span>
        </div>
      </div>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.type} className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${item.color}`}></div>
            <div>
              <p className="font-bold text-sm text-slate-900">{item.type}</p>
              <p className="text-xs text-slate-700 font-semibold font-mono">
                {item.value.toLocaleString()} interactions
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalyticsOverviewPage: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Analytics Overview</h1>
          <p className="text-sm font-semibold text-slate-700 mt-1">Holistic view of traffic volume, engagement velocity, and creator follower growth</p>
        </div>
      </div>

      <PlatformOwnershipCard />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-300">
          <div className="flex items-center gap-3 mb-2">
            <EyeIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Total Views</h3>
          </div>
          <p className="text-4xl font-black text-slate-900 mt-2">1.2M</p>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 px-2 py-0.5 rounded-full inline-block mt-3">
            +15% last 30 days
          </span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-300">
          <div className="flex items-center gap-3 mb-2">
            <MembersIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Followers Gained</h3>
          </div>
          <p className="text-4xl font-black text-slate-900 mt-2">5,832</p>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 px-2 py-0.5 rounded-full inline-block mt-3">
            +8% last 30 days
          </span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-300">
          <div className="flex items-center gap-3 mb-2">
            <ChartBarIcon className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Engagement Rate</h3>
          </div>
          <p className="text-4xl font-black text-slate-900 mt-2">4.7%</p>
          <span className="text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded-full inline-block mt-3">
            Normal Baseline (4.9%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-300">
          <h3 className="text-xl font-black text-slate-900 mb-4">Monthly Post Views</h3>
          <BarChart data={monthlyViewsData} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-300">
          <h3 className="text-xl font-black text-slate-900 mb-4">Engagement Breakdown</h3>
          <DoughnutChart data={engagementData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverviewPage;
