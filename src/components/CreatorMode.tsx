import React, { useEffect, useState } from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { useMonetization } from '../contexts/MonetizationContext';

const CreatorMode: React.FC = () => {
  const profile = useProfile();
  const monetization = useMonetization();
  const [isCreatorMode, setIsCreatorMode] = useState<boolean>(false);
  const [topVoiceBadges, setTopVoiceBadges] = useState<string[]>([]);
  const [collaborativeArticles, setCollaborativeArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching user's creator status
    const fetchCreatorStatus = async () => {
      try {
        setLoading(true);
        // In a real app, this would come from an API
        const creatorStatus = profile.profile?.role === 'creator' || profile.profile?.currentPlan === 'creator';
        setIsCreatorMode(creatorStatus || false);

        // Fetch top voice badges
        const badges = ['Thought Leader', 'Industry Expert', 'Innovation Pioneer'];
        setTopVoiceBadges(badges);

        // Fetch collaborative articles
        const articles = [
          { id: '1', title: 'The Future of Social Media', contributors: 5, status: 'active' },
          { id: '2', title: 'Building Authentic Communities', contributors: 3, status: 'draft' },
          { id: '3', title: 'Monetization Strategies', contributors: 7, status: 'published' }
        ];
        setCollaborativeArticles(articles);
      } catch (err) {
        setError('Failed to load creator mode data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorStatus();
  }, [profile]);

  const toggleCreatorMode = async () => {
    try {
      setLoading(true);

      // In a real app, this would update the user's profile
      if (profile.profile) {
        await profile.updateProfile({
          ...profile.profile,
          currentPlan: isCreatorMode ? 'standard' : 'creator',
          role: isCreatorMode ? 'user' : 'creator'
        });

        setIsCreatorMode(!isCreatorMode);
      }
    } catch (err) {
      setError('Failed to update creator mode');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Creator Mode</h1>

      <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Activate Creator Mode</h2>
            <p className="text-gray-600 mt-2">
              Enhance your analytics and gain access to collaborative articles that can earn you a "Top Voice" badge.
            </p>
          </div>
          <button
            onClick={toggleCreatorMode}
            className={`px-6 py-3 rounded-md text-slate-700 font-medium ${
              isCreatorMode
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isCreatorMode ? 'Disable Creator Mode' : 'Enable Creator Mode'}
          </button>
        </div>

        {isCreatorMode && (
          <div className="mt-4 p-4 bg-white rounded border border-green-200">
            <p className="text-green-700 font-medium">Creator Mode is Active!</p>
            <p className="text-gray-600 mt-1">You now have access to enhanced analytics and collaborative features.</p>
          </div>
        )}
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Top Voice Badges</h2>

        {topVoiceBadges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topVoiceBadges.map((badge, index) => (
              <div key={index} className="flex flex-col items-center p-6 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg border border-yellow-200">
                <div className="bg-yellow-200 rounded-full p-3 mb-3 border text-yellow-950 border-yellow-400 font-black">
                  <svg className="w-8 h-8 text-yellow-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">{badge}</h3>
                <p className="text-sm text-gray-600 mt-1">Earned by contributing expertise</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-gray-50 rounded-lg border border-slate-300 text-center">
            <p className="text-gray-600">No badges earned yet. Participate in collaborative articles to earn your first Top Voice badge!</p>
          </div>
        )}
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Collaborative Articles</h2>

        {collaborativeArticles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                    Contributors
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {collaborativeArticles.map((article) => (
                  <tr key={article.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-700">{article.contributors} contributors</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                          : article.status === 'draft'
                            ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
                            : 'bg-blue-100 text-blue-950 border border-blue-400 font-bold'
                      }`}>
                        {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-indigo-600 hover:text-indigo-900">Contribute</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 bg-gray-50 rounded-lg border border-slate-300 text-center">
            <p className="text-gray-600">No collaborative articles available. Join one to start contributing!</p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Boost Your Creator Journey</h2>
        <p className="text-gray-600 mb-4">
          As a creator, you have access to exclusive tools and resources to grow your audience and monetize your content effectively.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded border border-slate-300">
            <h3 className="font-medium text-gray-800">Analytics Dashboard</h3>
            <p className="text-sm text-gray-600 mt-1">Detailed insights on your content performance</p>
          </div>
          <div className="p-4 bg-white rounded border border-slate-300">
            <h3 className="font-medium text-gray-800">Monetization Tools</h3>
            <p className="text-sm text-gray-600 mt-1">Ways to earn from your content</p>
          </div>
          <div className="p-4 bg-white rounded border border-slate-300">
            <h3 className="font-medium text-gray-800">Collaboration Hub</h3>
            <p className="text-sm text-gray-600 mt-1">Connect with other creators</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorMode;
