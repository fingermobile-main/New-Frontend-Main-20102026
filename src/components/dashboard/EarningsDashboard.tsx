import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
// Removed unused paymentAPI import
import { DollarSign as FiDollarSign, TrendingUp as FiTrendingUp, Calendar as FiCalendar, Clock as FiClock } from 'lucide-react';

const EarningsDashboard: React.FC = () => {
  const { member } = useAppContext(); // Using the correct property name
  const [earningsData, setEarningsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    fetchEarningsData();
  }, [timeRange]);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch actual earnings data
      // For now, we'll simulate with mock data
      const mockData = {
        totalEarnings: 12450.75,
        monthlyEarnings: 3200.50,
        weeklyEarnings: 850.25,
        dailyEarnings: 120.75,
        projectedEarnings: 4200.00,
        growthRate: 12.5,
        breakdown: {
          subscriptions: 4500.25,
          commissions: 3200.50,
          adRevenue: 2800.75,
          premiumFeatures: 1950.25
        },
        recentTransactions: [
          { id: 'txn-1', date: '2026-07-15', amount: 150.00, type: 'commission', description: 'Monthly subscription' },
          { id: 'txn-2', date: '2026-07-14', amount: 75.50, type: 'ad-revenue', description: 'Ad impressions' },
          { id: 'txn-3', date: '2026-07-13', amount: 200.00, type: 'premium', description: 'Premium feature usage' },
        ]
      };
      setEarningsData(mockData);
    } catch (error) {
      console.error('Error fetching earnings data:', error);
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

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Earnings Dashboard</h2>
        <div className="flex space-x-2">
          {(['week', 'month', 'quarter', 'year'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg mr-4">
              <FiDollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-800">${earningsData.totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg mr-4">
              <FiTrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Monthly Earnings</p>
              <p className="text-2xl font-bold text-gray-800">${earningsData.monthlyEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 rounded-lg mr-4">
              <FiCalendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Projected Earnings</p>
              <p className="text-2xl font-bold text-gray-800">${earningsData.projectedEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-5 rounded-xl border border-yellow-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500 rounded-lg mr-4">
              <FiClock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-800">+{earningsData.growthRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-5 rounded-xl border border-slate-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Earnings Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(earningsData.breakdown as Record<string, number>).map(([key, value]: [string, number]) => (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-gray-900 font-medium">${value.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(value / earningsData.totalEarnings) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl border border-slate-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {earningsData.recentTransactions.map((txn: any) => (
                  <tr key={txn.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{txn.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{txn.description}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">${txn.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${txn.type === 'commission' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' :
                    txn.type === 'ad-revenue' ? 'bg-blue-100 text-blue-950 border border-blue-400 font-bold' :
                      'bg-purple-100 text-purple-950 border border-purple-400 font-bold'}`}>
                        {txn.type.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-300 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Earnings Projection</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">Earnings chart visualization would appear here</p>
        </div>
      </div>
    </div>
  );
};

export default EarningsDashboard;
