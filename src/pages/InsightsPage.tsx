import React, { useEffect, useState } from 'react';
import { useAppContext } from "../contexts/AppContext";
import MainLayout from '../components/layout/MainLayout';
import { useCommunity } from '../contexts/CommunityContext';
import { getCommunityPages } from '../services/communityPageService';
import { CommunityPage } from '../types/communityPage';

const InsightsPage: React.FC = () => {
  const { member: currentMember, showToast } = useAppContext();
  const { posts } = useCommunity();
  const [communities, setCommunities] = useState<CommunityPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const pages = await getCommunityPages();
        // Filter pages where the current member is the owner
        const myPages = pages.filter(page => page.ownerId === currentMember?.id || page.ownerId === 'member1'); // fallback for demo
        setCommunities(myPages);
      } catch (error) {
        console.error('Error fetching insights:', error);
        showToast('Failed to load insights data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentMember, showToast]);

  // Aggregate statistics
  const aggregateStats = communities.reduce((acc, community) => {
    return {
      totalPosts: acc.totalPosts + (community.statistics?.postsCount || 0),
      totalLikes: acc.totalLikes + (community.statistics?.likesCount || 0),
      totalComments: acc.totalComments + (community.statistics?.commentsCount || 0),
      totalShares: acc.totalShares + (community.statistics?.sharesCount || 0),
      totalMembers: acc.totalMembers + (community.memberCount || 0)
    };
  }, { totalPosts: 0, totalLikes: 0, totalComments: 0, totalShares: 0, totalMembers: 0 });

  const engagementRate = aggregateStats.totalMembers > 0 
    ? ((aggregateStats.totalLikes + aggregateStats.totalComments) / aggregateStats.totalMembers * 100).toFixed(1) + '%'
    : '0%';

  return (
    <MainLayout pageTitle="Insights">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your performance across all communities</p>
          </div>
          <button 
            onClick={() => showToast('Report generated!', 'success')}
            className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Export Report
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Reach</h3>
                <p className="text-2xl font-bold text-gray-900">{aggregateStats.totalMembers.toLocaleString()}</p>
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <span>↑ 12%</span>
                  <span className="text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Content Posts</h3>
                <p className="text-2xl font-bold text-gray-900">{aggregateStats.totalPosts.toLocaleString()}</p>
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <span>↑ 5%</span>
                  <span className="text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Engagement</h3>
                <p className="text-2xl font-bold text-gray-900">{(aggregateStats.totalLikes + aggregateStats.totalComments).toLocaleString()}</p>
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <span>↑ 8%</span>
                  <span className="text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Engagement Rate</h3>
                <p className="text-2xl font-bold text-gray-900">{engagementRate}</p>
                <div className="mt-2 flex items-center text-sm text-red-600">
                  <span>↓ 0.2%</span>
                  <span className="text-gray-400 ml-1">vs last month</span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-4">Community Performance</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Community</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {communities.map((community) => (
                    <tr key={community.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-brand-blue flex-shrink-0 flex items-center justify-center text-white font-bold">
                            {community.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{community.name}</div>
                            <div className="text-sm text-gray-500 capitalize">{community.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {community.memberCount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {community.statistics?.postsCount.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {((community.statistics?.likesCount || 0) + (community.statistics?.commentsCount || 0)).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Growing
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default InsightsPage;