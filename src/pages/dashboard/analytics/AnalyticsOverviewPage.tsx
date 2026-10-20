import React, {} from 'react';
import { ChartBarIcon, MembersIcon, EyeIcon } from '../../../components/icons';

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
  { type: 'Likes', value: 12500, color: 'bg-red-500' },
  { type: 'Comments', value: 3200, color: 'bg-blue-500' },
  { type: 'Shares', value: 1800, color: 'bg-green-500' }
];

const BarChart: React.FC<{ data: { name: string; views: number }[] }> = ({
  data
}) => {
  const maxViews = Math.max(...data.map((d) => d.views));
  return (
    <div className="bg-gray-50 p-4 rounded-lg h-64 flex items-end justify-around gap-2">
      {data.map((item) => (
        <div
          key={item.name}
          className="flex-1 flex flex-col items-center justify-end h-full"
        >
          <div
            className="w-full bg-brand-blue rounded-t-md hover:bg-blue-700 transition-colors"
            style={{ height: `${(item.views / maxViews) * 100}%` }}
            title={`${item.views.toLocaleString()} views`}
          ></div>
          <span className="text-xs font-semibold mt-2">{item.name}</span>
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
            className="stroke-current text-gray-200"
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
          <span className="text-2xl font-bold">{total.toLocaleString()}</span>
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Total</span>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
            <div>
              <p className="font-semibold text-sm">{item.type}</p>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {item.value.toLocaleString()}
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <EyeIcon className="w-6 h-6 text-slate-700" />
            <h3 className="font-bold text-lg">Total Views</h3>
          </div>
          <p className="text-4xl font-bold">1.2M</p>
          <p className="text-sm text-green-600 font-semibold">
            +15% last 30 days
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <MembersIcon className="w-6 h-6 text-slate-700" />
            <h3 className="font-bold text-lg">Followers Gained</h3>
          </div>
          <p className="text-4xl font-bold">5,832</p>
          <p className="text-sm text-green-600 font-semibold">
            +8% last 30 days
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <ChartBarIcon className="w-6 h-6 text-slate-700" />
            <h3 className="font-bold text-lg">Engagement Rate</h3>
          </div>
          <p className="text-4xl font-bold">4.7%</p>
          <p className="text-sm text-red-600 font-semibold">
            -0.2% last 30 days
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-4">Monthly Post Views</h3>
          <BarChart data={monthlyViewsData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-4">Engagement Breakdown</h3>
          <DoughnutChart data={engagementData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverviewPage;
