import React, { useEffect, useState } from 'react';
import { storefrontService } from '../../services/storefrontService';

interface AnalyticsChartProps {
  storeId: string;
  metric?: 'revenue' | 'orders' | 'visitors' | 'conversion_rate';
  timeRange?: '7d' | '30d' | '90d';
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  storeId,
  metric = 'revenue',
  timeRange = '7d'
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [storeId, metric, timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Calculate date range
      const endDate = new Date();
      const days = parseInt(timeRange.replace('d', ''));
      const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));

      const analyticsData = await storefrontService.getDailyAnalytics(storeId, {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      });

      setData(analyticsData || []);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMetricValue = (item: any) => {
    switch (metric) {
    case 'revenue':
      return item.total_revenue || 0;
    case 'orders':
      return item.total_orders || 0;
    case 'visitors':
      return item.unique_visitors || 0;
    case 'conversion_rate':
      return item.conversion_rate || 0;
    default:
      return 0;
    }
  };

  const formatMetricValue = (value: number) => {
    switch (metric) {
    case 'revenue':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    case 'conversion_rate':
      return `${(value * 100).toFixed(2)}%`;
    default:
      return value.toLocaleString();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const calculateStats = () => {
    if (data.length === 0) return { total: 0, average: 0, peak: 0, growth: 0 };

    const values = data.map(item => getMetricValue(item));
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const peak = Math.max(...values);

    // Calculate growth (comparing last half vs first half)
    const midPoint = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, midPoint).reduce((sum, val) => sum + val, 0);
    const secondHalf = values.slice(midPoint).reduce((sum, val) => sum + val, 0);
    const growth = firstHalf !== 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;

    return { total, average, peak, growth };
  };

  const stats = calculateStats();
  const maxValue = Math.max(...data.map(item => getMetricValue(item)), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadAnalytics}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{formatMetricValue(stats.total)}</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Average</p>
          <p className="text-2xl font-bold text-blue-600">{formatMetricValue(stats.average)}</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Peak</p>
          <p className="text-2xl font-bold text-purple-600">{formatMetricValue(stats.peak)}</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Growth</p>
          <p className={`text-2xl font-bold ${stats.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.growth >= 0 ? '↑' : '↓'} {Math.abs(stats.growth).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-slate-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4 capitalize">
          {metric.replace('_', ' ')} Over Time
        </h3>

        {data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No data available for this period</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((item, idx) => {
              const value = getMetricValue(item);
              const percentage = (value / maxValue) * 100;

              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-20 text-xs text-gray-600 text-right">
                    {formatDate(item.date)}
                  </div>

                  <div className="flex-1 relative">
                    <div
                      className={`h-8 rounded transition-all ${
                        metric === 'revenue' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                          metric === 'orders' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                            metric === 'visitors' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                              'bg-gradient-to-r from-orange-400 to-orange-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-xs font-semibold">
                      {formatMetricValue(value)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded ${
            metric === 'revenue' ? 'bg-green-500' :
              metric === 'orders' ? 'bg-blue-500' :
                metric === 'visitors' ? 'bg-purple-500' :
                  'bg-orange-500'
          }`} />
          <span>{metric.replace('_', ' ').charAt(0).toUpperCase() + metric.replace('_', ' ').slice(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
