import React, { useEffect, useState } from 'react';
interface EarningsTrackerProps {
  creatorId: string;
  timeRange?: '7d' | '30d' | '90d' | '1y' | 'all';
}

const EarningsTracker: React.FC<EarningsTrackerProps> = ({
  creatorId,
  timeRange = '30d'
}) => {
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<any | null>(null);

  useEffect(() => {
    loadEarnings();
  }, [creatorId, timeRange]);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockData = {
        totalEarnings: 5432.50,
        currentMonth: 892.30,
        previousMonth: 756.80,
        growth: 17.9,
        breakdown: {
          adRevenue: 2345.60,
          subscriptions: 1876.40,
          tips: 654.20,
          sponsorships: 556.30
        },
        transactions: [
          { id: 1, type: 'ad_revenue', amount: 45.20, date: '2026-06-07', description: 'Daily ad revenue' },
          { id: 2, type: 'subscription', amount: 9.99, date: '2026-06-06', description: 'New subscriber' },
          { id: 3, type: 'tip', amount: 25.00, date: '2026-06-05', description: 'Tip from @user123' },
          { id: 4, type: 'sponsorship', amount: 500.00, date: '2026-06-04', description: 'Brand partnership' },
          { id: 5, type: 'ad_revenue', amount: 38.50, date: '2026-06-03', description: 'Daily ad revenue' }
        ],
        payoutHistory: [
          { id: 1, amount: 1200.00, date: '2026-05-01', status: 'completed', method: 'bank_transfer' },
          { id: 2, amount: 980.50, date: '2026-04-01', status: 'completed', method: 'bank_transfer' },
          { id: 3, amount: 1150.75, date: '2026-03-01', status: 'completed', method: 'paypal' }
        ],
        nextPayout: {
          estimatedAmount: 892.30,
          estimatedDate: '2026-07-01',
          threshold: 100.00,
          eligible: true
        }
      };
      setEarnings(mockData);
    } catch (err) {
      console.error('Failed to load earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!earnings) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Failed to load earnings data</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Earnings Tracker</h2>
        <select
          value={timeRange}
          onChange={(e) => {/* handle change */}}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 mb-1">Total Earnings</p>
          <p className="text-3xl font-bold text-green-900">{formatCurrency(earnings.totalEarnings)}</p>
          <p className="text-xs text-green-600 mt-2">All time</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">This Month</p>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(earnings.currentMonth)}</p>
          <p className={`text-sm mt-2 ${earnings.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {earnings.growth >= 0 ? '↑' : '↓'} {Math.abs(earnings.growth)}% vs last month
          </p>
        </div>

        <div className="bg-white border border-slate-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Last Month</p>
          <p className="text-3xl font-bold text-purple-600">{formatCurrency(earnings.previousMonth)}</p>
          <p className="text-xs text-slate-700 mt-2">Completed</p>
        </div>

        <div className="bg-white border border-slate-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Next Payout</p>
          <p className="text-3xl font-bold text-orange-600">{formatCurrency(earnings.nextPayout.estimatedAmount)}</p>
          <p className="text-xs text-slate-700 mt-2">
            {new Date(earnings.nextPayout.estimatedDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white border border-slate-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(earnings.breakdown).map(([source, amount]) => {
            const percentage = ((amount as number) / earnings.totalEarnings * 100).toFixed(1);
            const colors: Record<string, string> = {
              adRevenue: 'bg-blue-500',
              subscriptions: 'bg-purple-500',
              tips: 'bg-yellow-500',
              sponsorships: 'bg-green-500'
            };

            return (
              <div key={source}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 capitalize">{source.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-medium">{formatCurrency(amount as number)} ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${colors[source]} h-3 rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-slate-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {earnings.transactions.map((txn: any) => {
            const icons: Record<string, any> = {
              ad_revenue: '📺',
              subscription: '👤',
              tip: '💰',
              sponsorship: '🤝'
            };

            return (
              <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icons[txn.type]}</span>
                  <div>
                    <p className="font-medium text-gray-900">{txn.description}</p>
                    <p className="text-xs text-slate-700">
                      {new Date(txn.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-green-600">+{formatCurrency(txn.amount)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white border border-slate-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Payout History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-300">
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Date</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Amount</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Method</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {earnings.payoutHistory.map((payout: any) => (
                <tr key={payout.id} className="border-b border-slate-200">
                  <td className="py-3 px-3 text-sm">
                    {new Date(payout.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-sm font-medium">
                    {formatCurrency(payout.amount)}
                  </td>
                  <td className="py-3 px-3 text-sm capitalize">
                    {payout.method.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-1 bg-green-100 text-green-950 border border-green-400 font-bold rounded-full text-xs font-medium">
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Next Payout Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">💸</span>
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 mb-1">Next Payout Information</h4>
            <p className="text-sm text-green-800 mb-2">
              Estimated payout of {formatCurrency(earnings.nextPayout.estimatedAmount)} will be processed on{' '}
              {new Date(earnings.nextPayout.estimatedDate).toLocaleDateString()}
            </p>
            <div className="flex items-center gap-2 text-xs text-green-700">
              <span className="px-2 py-1 bg-green-200 rounded">Minimum: {formatCurrency(earnings.nextPayout.threshold)}</span>
              <span>•</span>
              <span className={earnings.nextPayout.eligible ? 'text-green-700' : 'text-orange-700'}>
                {earnings.nextPayout.eligible ? '✓ Eligible for payout' : '⏳ Below minimum threshold'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsTracker;
