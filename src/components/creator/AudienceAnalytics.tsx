import React, { useEffect, useState } from 'react';
interface AudienceAnalyticsProps {
  creatorId: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

const AudienceAnalytics: React.FC<AudienceAnalyticsProps> = ({
  creatorId,
  timeRange = '30d'
}) => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [creatorId, timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockData = {
        totalFollowers: 12543,
        followerGrowth: 8.5,
        demographics: {
          age: { '18-24': 35, '25-34': 40, '35-44': 15, '45+': 10 },
          gender: { male: 45, female: 52, other: 3 },
          topCountries: [
            { country: 'United States', percentage: 42 },
            { country: 'United Kingdom', percentage: 18 },
            { country: 'Canada', percentage: 12 },
            { country: 'Australia', percentage: 8 },
            { country: 'Germany', percentage: 6 }
          ]
        },
        engagement: {
          averageLikes: 234,
          averageComments: 45,
          averageShares: 23,
          engagementRate: 4.2
        },
        activeTimes: {
          peak: '7:00 PM - 9:00 PM',
          bestDays: ['Tuesday', 'Wednesday', 'Thursday']
        }
      };
      setAnalytics(mockData);
    } catch (err) {
      console.error('Failed to load audience analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Failed to load audience analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Audience Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => {/* handle change */}}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Followers</p>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalFollowers.toLocaleString()}</p>
          <p className={`text-sm mt-2 ${analytics.followerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {analytics.followerGrowth >= 0 ? '↑' : '↓'} {Math.abs(analytics.followerGrowth)}% this period
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
          <p className="text-3xl font-bold text-blue-600">{analytics.engagement.engagementRate}%</p>
          <p className="text-sm text-gray-500 mt-2">Avg. across all posts</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Avg. Likes</p>
          <p className="text-3xl font-bold text-purple-600">{analytics.engagement.averageLikes}</p>
          <p className="text-sm text-gray-500 mt-2">Per post</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Avg. Comments</p>
          <p className="text-3xl font-bold text-orange-600">{analytics.engagement.averageComments}</p>
          <p className="text-sm text-gray-500 mt-2">Per post</p>
        </div>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Age Distribution</h3>
          <div className="space-y-3">
            {Object.entries(analytics.demographics.age).map(([ageGroup, percentage]) => (
              <div key={ageGroup}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{ageGroup}</span>
                  <span className="font-medium">{Number(percentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Number(percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Gender Distribution</h3>
          <div className="space-y-3">
            {Object.entries(analytics.demographics.gender).map(([gender, percentage]) => (
              <div key={gender}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 capitalize">{gender}</span>
                  <span className="font-medium">{Number(percentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      gender === 'male' ? 'bg-blue-500' :
                        gender === 'female' ? 'bg-pink-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Countries */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Top Countries</h3>
        <div className="space-y-3">
          {analytics.demographics.topCountries.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 w-6">#{idx + 1}</span>
                <span className="text-gray-900">{item.country}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${Number(item.percentage)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-12 text-right">{Number(item.percentage)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Times to Post */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-purple-900 mb-3">📅 Best Times to Post</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-purple-700 mb-1">Peak Hours</p>
            <p className="text-lg font-bold text-purple-900">{analytics.activeTimes.peak}</p>
          </div>
          <div>
            <p className="text-sm text-purple-700 mb-1">Best Days</p>
            <div className="flex gap-2 flex-wrap">
              {analytics.activeTimes.bestDays.map((day: string) => (
                <span key={day} className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-sm font-medium">
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Key Insights</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Your audience is most active in the evening (7-9 PM)</li>
          <li>• Tuesday through Thursday show highest engagement rates</li>
          <li>• Primary demographic: 25-34 age group (40% of followers)</li>
          <li>• Strong presence in English-speaking countries (80% combined)</li>
        </ul>
      </div>
    </div>
  );
};

export default AudienceAnalytics;
