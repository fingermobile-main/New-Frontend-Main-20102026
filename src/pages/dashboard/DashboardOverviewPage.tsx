import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import StatCard from '../../components/StatCard';
import useDashboardData from '../../hooks/useDashboardData';

const DashboardOverviewPage: React.FC = () => {
  const { showToast } = useAppContext();
  const { data, loading, error } = useDashboardData();

  if (loading) return <div>Loading dashboard data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No dashboard data available.</div>;

  const {
    recentActivity,
    newMembers,
    totalMembers,
    activePosts,
    totalRevenue
  } = data;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Members"
          value={totalMembers.toLocaleString()}
          subtitle="+5.2%"
          icon="👥"
        />
        <StatCard
          title="Active Posts"
          value={activePosts.toLocaleString()}
          subtitle="+2.1%"
          icon="📝"
        />
        <StatCard
          title="Total Revenue (FIC)"
          value={totalRevenue.toLocaleString()}
          subtitle="-1.8%"
          icon="💰"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {data.recentActivity.map((post) => (
              <div key={post.id} className="text-sm">
                <p>
                  <span className="font-semibold">{post.author.name}</span>{" "}
                  created a new post: "{post.title || "Untitled Post"}"
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(post.timestamp || Date.now()).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">New Members</h2>
          <div className="space-y-4">
            {data.newMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-10 h-10 rounded-full"
                 />
                <div>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-gray-500">@{member.membername}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
