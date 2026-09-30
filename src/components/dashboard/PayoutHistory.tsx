import React, { useState, useEffect } from 'react';
import { paymentAPI } from '../../services/paymentAPI';
import { FiDollarSign, FiCalendar, FiDownload, FiInfo, FiFilter } from 'react-icons/fi';

const PayoutHistory: React.FC = () => {
  const [payoutHistory, setPayoutHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

  useEffect(() => {
    fetchPayoutHistory();
  }, []);

  const fetchPayoutHistory = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would call paymentAPI.getPayoutHistory()
      // For now, we'll use mock data
      const mockData = [
        { id: 'payout-1', date: '2026-07-15', amount: 1250.75, status: 'completed', method: 'Bank Transfer', reference: 'REF-123456789', description: 'Monthly earnings' },
        { id: 'payout-2', date: '2026-06-15', amount: 980.50, status: 'completed', method: 'PayPal', reference: 'REF-987654321', description: 'Commission payout' },
        { id: 'payout-3', date: '2026-05-15', amount: 1420.00, status: 'processing', method: 'Bank Transfer', reference: 'REF-456789123', description: 'Quarterly bonus' },
        { id: 'payout-4', date: '2026-04-15', amount: 750.25, status: 'failed', method: 'Bank Transfer', reference: 'REF-321654987', description: 'Ad revenue' },
        { id: 'payout-5', date: '2026-03-15', amount: 2100.00, status: 'completed', method: 'Stripe', reference: 'REF-654123789', description: 'Premium feature revenue' },
      ];
      setPayoutHistory(mockData);
    } catch (error) {
      console.error('Error fetching payout history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayouts = payoutHistory.filter(payout => {
    const statusMatch = filterStatus === 'all' || payout.status === filterStatus;
    const dateMatch = !filterDate || payout.date.startsWith(filterDate);
    return statusMatch && dateMatch;
  });

  const totalPayouts = filteredPayouts.reduce((sum, payout) => sum + payout.amount, 0);

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
        <h2 className="text-2xl font-bold text-gray-800">Payout History</h2>
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <FiDownload className="mr-2" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg mr-4">
              <FiDollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Payouts</p>
              <p className="text-2xl font-bold text-gray-800">${totalPayouts.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg mr-4">
              <FiCalendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-gray-800">
                {payoutHistory.filter(p => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-5 rounded-xl border border-yellow-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500 rounded-lg mr-4">
              <FiInfo className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pending/Processing</p>
              <p className="text-2xl font-bold text-gray-800">
                {payoutHistory.filter(p => p.status === 'processing').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center">
          <FiFilter className="mr-2 text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="flex items-center">
          <FiCalendar className="mr-2 text-gray-500" />
          <input
            type="month"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayouts.map((payout) => (
              <tr key={payout.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payout.reference}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{payout.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.method}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${payout.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${payout.status === 'completed' ? 'bg-green-100 text-green-800' :
                payout.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  payout.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'}`}>
                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPayouts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No payout history found for the selected filters</p>
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Payout Information</h3>
        <p className="text-gray-600 mb-4">
          Payouts are processed automatically based on your earnings and payout schedule.
          Standard processing time is 3-5 business days for bank transfers and 1-2 business days for PayPal.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Minimum Payout</h4>
            <p className="text-gray-600">$100</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Payout Schedule</h4>
            <p className="text-gray-600">Monthly on 15th</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Supported Methods</h4>
            <p className="text-gray-600">Bank, PayPal, Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutHistory;
