import React, { useState, useEffect, useRef } from 'react';
// Add useRef import
import { useAppContext } from '../../contexts/AppContext';

interface WalletInfo {
  fic_balance: number;
  reserved_balance: number;
}

interface Earning {
  id: string;
  contentTitle: string;
  contentType: string;
  amount: number;
  currency: string;
  date: string;
  status: 'paid' | 'pending' | 'processing';
}

interface WithdrawalMethod {
  id: string;
  name: string;
  type: 'bank' | 'paypal' | 'crypto';
  details: string;
}

const UGCMonetizationPanel = () => {
  const { showToast } = useAppContext();

  const [activeTab, setActiveTab] = React.useState<'earnings' | 'withdraw'>('earnings');
  const [formData, setFormData] = React.useState({
    amount: '',
    method: ''
  });
  const [walletInfo, setWalletInfo] = React.useState<WalletInfo | null>(null);

  // Cross-environment compatible timer setup using ReturnType<typeof setTimeout>
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mock earnings data
  const earnings: Earning[] = [
    {
      id: '1',
      contentTitle: 'Summer Vacation Photos',
      contentType: 'Image',
      amount: 12.5,
      currency: 'FIC',
      date: '2023-06-15',
      status: 'paid'
    },
    {
      id: '2',
      contentTitle: 'New Music Release',
      contentType: 'Audio',
      amount: 25.0,
      currency: 'FIC',
      date: '2023-06-18',
      status: 'pending'
    },
    {
      id: '3',
      contentTitle: 'Trending Video',
      contentType: 'Video',
      amount: 50.0,
      currency: 'FIC',
      date: '2023-06-20',
      status: 'processing'
    }
  ];

  // Mock withdrawal methods
  const withdrawalMethods: WithdrawalMethod[] = [
    {
      id: '1',
      name: 'Bank Account',
      type: 'bank',
      details: '****1234'
    },
    {
      id: '2',
      name: 'PayPal',
      type: 'paypal',
      details: 'user@example.com'
    },
    {
      id: '3',
      name: 'Crypto Wallet',
      type: 'crypto',
      details: '0x...abcd'
    }
  ];

  const handleWithdraw = () => {
    if (!formData.amount || !formData.method) {
      showToast('Please enter amount and select method', 'error');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (walletInfo && amount > walletInfo.fic_balance) {
      showToast('Insufficient balance', 'error');
      return;
    }

    // Simulate withdrawal processing
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      showToast(`Withdrawal of ${amount} ${formData.method} initiated`, 'success');
      setFormData({ amount: '', method: '' });
    }, 1000);
  };

  // Load wallet info on mount and clean up timers to prevent memory leaks
  React.useEffect(() => {
    const fetchWalletInfo = () => {
      setWalletInfo({
        fic_balance: 1250.75,
        reserved_balance: 250.00
      });
    };

    fetchWalletInfo();

    // Clean up active timers on component unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">UGC Monetization</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Balance</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {walletInfo ? `${walletInfo.fic_balance.toFixed(2)} FIC` : 'Loading...'}
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Reserved Balance</h3>
          <p className="text-3xl font-bold text-emerald-600">
            {walletInfo ? `${walletInfo.reserved_balance.toFixed(2)} FIC` : 'Loading...'}
          </p>
        </div>
      </div>

      <div className="border-b border-slate-300 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('earnings')}
            className={`${
              activeTab === 'earnings'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Earnings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('withdraw')}
            className={`${
              activeTab === 'withdraw'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Withdraw
          </button>
        </nav>
      </div>

      {activeTab === 'earnings' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {earnings.map((earning) => (
                <tr key={earning.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{earning.contentTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{earning.contentType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{earning.amount} {earning.currency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {earning.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        earning.status === 'paid'
                          ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                          : earning.status === 'pending'
                            ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
                            : 'bg-blue-100 text-blue-950 border border-blue-400 font-bold'
                      }`}
                    >
                      {earning.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'withdraw' && (
        <div className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (FIC)
            </label>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400 font-mono"
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
              Withdrawal Method
            </label>
            <select
              id="method"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
            >
              <option value="">Select method</option>
              {withdrawalMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name} ({method.details})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleWithdraw}
            disabled={!formData.amount || !formData.method}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Initiate Withdrawal
          </button>
        </div>
      )}
    </div>
  );
};

export default UGCMonetizationPanel;
