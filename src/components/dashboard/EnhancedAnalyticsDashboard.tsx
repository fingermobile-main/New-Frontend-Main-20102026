import React, { useEffect, useState } from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon, UsersIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import analyticsEnhancedService, { CohortData, FunnelStep, RetentionPeriod } from '../../services/analyticsEnhancedService';

interface EnhancedAnalyticsDashboardProps {
  period?: 'daily' | 'weekly' | 'monthly';
}

const EnhancedAnalyticsDashboard: React.FC<EnhancedAnalyticsDashboardProps> = ({ period = 'monthly' }) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [cohortData, setCohortData] = useState<CohortData[]>([]);
  const [retentionData, setRetentionData] = useState<RetentionPeriod[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboard, cohort, retention] = await Promise.all([
        analyticsEnhancedService.getDashboardData({ period }),
        analyticsEnhancedService.getCohortAnalysis({ cohortDefinition: period === 'daily' ? 'weekly' : period }),
        analyticsEnhancedService.getRetentionMetrics({ period, limit: 6 })
      ]);

      setDashboardData(dashboard.data);
      setCohortData(cohort.data || []);
      setRetentionData(retention.data || []);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const latestRetention = retentionData[retentionData.length - 1];
  const avgRetentionRate = retentionData.length > 0
    ? (retentionData.reduce((sum, r) => sum + r.retention_rate, 0) / retentionData.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-4">
          <div className="flex items-center justify-between mb-2">
            <UsersIcon className="w-6 h-6 text-blue-500" />
            <span className="text-xs text-green-600 font-medium">
              {latestRetention ? `${latestRetention.new_users} new` : 'N/A'}
            </span>
          </div>
          <p className="text-sm text-gray-600">Active Users</p>
          <p className="text-2xl font-bold text-gray-900">
            {latestRetention?.active_users?.toLocaleString() || '0'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-4">
          <div className="flex items-center justify-between mb-2">
            <ArrowTrendingUpIcon className="w-6 h-6 text-purple-500" />
            <span className="text-xs text-green-600 font-medium">{avgRetentionRate}%</span>
          </div>
          <p className="text-sm text-gray-600">Avg Retention Rate</p>
          <p className="text-2xl font-bold text-gray-900">{avgRetentionRate}%</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-4">
          <div className="flex items-center justify-between mb-2">
            <ChartBarIcon className="w-6 h-6 text-green-500" />
            <span className="text-xs text-blue-600 font-medium">LTV</span>
          </div>
          <p className="text-sm text-gray-600">Lifetime Value</p>
          <p className="text-2xl font-bold text-gray-900">
            ${dashboardData?.lifetime_value?.data?.[0]?.ltv_per_user || '0.00'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-4">
          <div className="flex items-center justify-between mb-2">
            <CurrencyDollarIcon className="w-6 h-6 text-yellow-500" />
            <span className="text-xs text-red-600 font-medium">Churn</span>
          </div>
          <p className="text-sm text-gray-600">Monthly Churn</p>
          <p className="text-2xl font-bold text-gray-900">
            {dashboardData?.churn?.data?.[0]?.churned_count || 0}
          </p>
        </div>
      </div>

      {/* Retention Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">User Retention Trend</h3>
        {retentionData.length > 0 ? (
          <div className="space-y-3">
            {retentionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-24">{item.period}</span>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${Math.min(item.retention_rate, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right w-32">
                  <p className="text-sm font-semibold text-gray-900">{item.retention_rate}%</p>
                  <p className="text-xs text-gray-500">{item.active_users} active</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No retention data available</p>
        )}
      </div>

      {/* Cohort Analysis Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Cohort Analysis</h3>
        {cohortData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cohort</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week 1</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week 2</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week 3</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week 4</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cohortData.slice(0, 5).map((cohort, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{cohort.cohort_period}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{cohort.cohort_size}</td>
                    {cohort.retention_data.slice(0, 4).map((ret, retIdx) => (
                      <td key={retIdx} className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          ret.retention_rate >= 70 ? 'bg-green-100 text-green-950 border border-green-400 font-bold' :
                            ret.retention_rate >= 40 ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold' :
                              'bg-red-100 text-red-950 border border-red-400 font-bold'
                        }`}>
                          {ret.retention_rate.toFixed(1)}%
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No cohort data available</p>
        )}
      </div>

      {/* Churn Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Churn Insights</h3>
        {dashboardData?.churn?.data && dashboardData.churn.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Recent Churn</p>
              <p className="text-2xl font-bold text-red-600">
                {dashboardData.churn.data[0].churned_count} users
              </p>
              <p className="text-xs text-gray-500 mt-1">Last week</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Avg Inactivity</p>
              <p className="text-2xl font-bold text-orange-600">
                {dashboardData.churn.data[0].avg_days_inactive} days
              </p>
              <p className="text-xs text-gray-500 mt-1">Before churning</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Early Churn</p>
              <p className="text-2xl font-bold text-yellow-600">
                {dashboardData.churn.data[0].early_churn} users
              </p>
              <p className="text-xs text-gray-500 mt-1">&lt; 7 days after signup</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No churn data available</p>
        )}
      </div>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
