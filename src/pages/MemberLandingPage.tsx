import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import { useMemberLandingData } from '../hooks/useMemberLandingData';

const MemberLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { member: currentMember } = useAuth();
  const { data, loading, error, refreshData } = useMemberLandingData(currentMember?.id);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-4 sm:p-6 lg:p-8 text-center text-gray-500">
          Loading member dashboard...
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-4 sm:p-6 lg:p-8 text-center text-red-500">
          Error loading member dashboard: {error} <button onClick={refreshData} className="ml-2 px-3 py-1 bg-red-500 text-white rounded">Retry</button>
        </div>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <div className="p-4 sm:p-6 lg:p-8 text-center text-gray-500">
          No member dashboard data available.
        </div>
      </MainLayout>
    );
  }

  const { walletBalance, notificationsCount, groupsCount, postsCount, forumCategories } = data;

  // Navigate to category feed
  const navigateToCategory = (slug: string) => {
    navigate(`/forum/${slug}`);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {currentMember?.name || 'Member'}!
          </h1>
          <p className="text-sm sm:text-base text-blue-100 md:text-lg">
            Ready to connect, create, and explore today?
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">{walletBalance.toFixed(2)}</div>
            <div className="text-sm sm:text-base text-gray-600">Wallet Balance</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">{notificationsCount}</div>
            <div className="text-sm sm:text-base text-gray-600">Notifications</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">{groupsCount}</div>
            <div className="text-sm sm:text-base text-gray-600">Groups</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-orange-600">{postsCount}</div>
            <div className="text-sm sm:text-base text-gray-600">Your Posts</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/create-post')}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Create Post</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">Share your thoughts with the community</p>
            <button className="text-blue-500 font-medium text-sm sm:text-base">Create Now</button>
          </div>
          
          <div 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/groups')}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Join Groups</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">Connect with like-minded people</p>
            <button className="text-blue-500 font-medium text-sm sm:text-base">Explore Groups</button>
          </div>
          
          <div 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/marketplace')}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Marketplace</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">Buy and sell with community members</p>
            <button className="text-blue-500 font-medium text-sm sm:text-base">Visit Marketplace</button>
          </div>
        </div>

        {/* Forum Categories */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Forum Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forumCategories.map((category) => (
              <div 
                key={category.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigateToCategory(category.slug)}
              >
                <h3 className="font-semibold text-base sm:text-lg mb-1">{category.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">{category.description}</p>
                <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                  <span>{category.postCount} posts</span>
                  <span>Rank: {category.rank}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MemberLandingPage;
