import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';
import { GiftIcon, LinkIcon } from '../../components/icons';

const FicVaultPage: React.FC = () => {
  const { ficBalance = 0, showToast } = useAppContext() || {};
  const [vaultBalance, setVaultBalance] = useState(0);
  const [interestRate, setInterestRate] = useState(5.0);
  const [estimatedEarnings, setEstimatedEarnings] = useState(0);
  const [vaultActivity, setVaultActivity] = useState<Array<{
    id: number;
    date: string;
    type: string;
    amount: number;
    description: string;
  }>>([]);

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [giftAmount, setGiftAmount] = useState('');
  const [paylinkAmount, setPaylinkAmount] = useState('');

  const loadVaultData = useCallback(async () => {
    try {
      const [statusRes, historyRes] = await Promise.all([
        apiService.get<any>('/api/fic-vault').catch(() => null),
        apiService.get<any>('/api/fic-vault/history').catch(() => null)
      ]);

      if (statusRes?.data) {
        const bal = Number(statusRes.data.balance || 0);
        const apy = Number(statusRes.data.apy || 5.0);
        setVaultBalance(bal);
        setInterestRate(apy);
        setEstimatedEarnings(bal * (apy / 100));
      }

      if (historyRes?.data && Array.isArray(historyRes.data)) {
        setVaultActivity(historyRes.data.map((tx: any, idx: number) => ({
          id: tx.id || idx + 1,
          date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Recent',
          type: (tx.transactionType || 'deposit').toLowerCase(),
          amount: Number(tx.amount || 0),
          description: tx.reference || (tx.transactionType === 'DEPOSIT' ? 'Deposit to Vault' : 'Withdrawal from Vault')
        })));
      }
    } catch (err) {
      console.error('Failed to load FIC Vault data:', err);
    }
  }, []);

  useEffect(() => {
    loadVaultData();
  }, [loadVaultData]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast?.('Please enter a valid amount', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await apiService.post<any>('/api/fic-vault/deposit', { amount });
      if (res?.success) {
        showToast?.(`Successfully deposited ${amount} FIC to your vault`, 'success');
        setDepositAmount('');
        await loadVaultData();
      } else {
        showToast?.(res?.message || 'Deposit failed', 'error');
      }
    } catch (error: any) {
      showToast?.(error?.response?.data?.message || error?.message || 'Failed to process deposit', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast?.('Please enter a valid amount', 'error');
      return;
    }

    if (amount > vaultBalance) {
      showToast?.('Insufficient vault balance', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await apiService.post<any>('/api/fic-vault/withdraw', { amount });
      if (res?.success) {
        showToast?.(`Successfully withdrawn ${amount} FIC from your vault`, 'success');
        setWithdrawAmount('');
        await loadVaultData();
      } else {
        showToast?.(res?.message || 'Withdrawal failed', 'error');
      }
    } catch (error: any) {
      showToast?.(error?.response?.data?.message || error?.message || 'Failed to process withdrawal', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const onOpenGiftModal = () => {
    if (vaultBalance <= 0) {
      showToast?.('No FIC available in vault to send gift', 'error');
      return;
    }
    setShowGiftModal(true);
  };

  const onOpenPaylinkModal = () => {
    if (vaultBalance <= 0) {
      showToast?.('No FIC available in vault to create paylink', 'error');
      return;
    }
    setShowPaylinkModal(true);
  };

  const handleSendGift = async () => {
    const amount = parseFloat(giftAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast?.('Please enter a valid amount', 'error');
      return;
    }

    if (amount > vaultBalance) {
      showToast?.('Insufficient vault balance', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.post('/api/giftcards', {
        amount,
        recipientEmail: 'recipient@fingermobile.com',
        message: 'Gift from FIC Vault'
      });
      showToast?.('Gift card created and sent successfully', 'success');
      setGiftAmount('');
      setShowGiftModal(false);
    } catch (error: any) {
      showToast?.(error?.response?.data?.message || error?.message || 'Failed to send gift', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreatePaylink = async () => {
    const amount = parseFloat(paylinkAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast?.('Please enter a valid amount', 'error');
      return;
    }

    if (amount > vaultBalance) {
      showToast?.('Insufficient vault balance', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.post('/api/paylinks', {
        amount,
        title: 'Payment Request from FIC Vault'
      });
      showToast?.('Paylink created successfully', 'success');
      setPaylinkAmount('');
      setShowPaylinkModal(false);
    } catch (error: any) {
      showToast?.(error?.response?.data?.message || error?.message || 'Failed to create paylink', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">FIC Vault</h1>
          <p className="text-gray-600 mt-2">
            Securely store your FIC tokens and earn interest
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-80">Vault Balance</p>
                  <h2 className="text-4xl font-bold mt-1">
                    {vaultBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}{' '}
                    FIC
                  </h2>
                  <p className="mt-2 opacity-90">
                    Earn {interestRate}% annual interest
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onOpenGiftModal}
                    className="bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 flex items-center gap-2 transition-colors"
                  >
                    <GiftIcon className="w-5 h-5" />
                    Gift
                  </button>
                  <button
                    onClick={onOpenPaylinkModal}
                    className="bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 flex items-center gap-2 transition-colors"
                  >
                    <LinkIcon className="w-5 h-5" />
                    Paylink
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-sm opacity-80">Estimated Earnings</p>
                  <p className="text-xl font-bold">
                    {estimatedEarnings.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}{' '}
                    FIC
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Interest Rate</p>
                  <p className="text-xl font-bold">{interestRate}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold mb-4">Vault Activity</h3>
              {vaultActivity.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="mt-2 text-gray-500">No vault activity yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vaultActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === 'deposit'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          {activity.type === 'deposit' ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-500">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`font-semibold ${
                          activity.type === 'deposit'
                            ? 'text-green-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {activity.type === 'deposit' ? '+' : ''}
                        {activity.amount} FIC
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold mb-4">Deposit to Vault</h3>
              <form onSubmit={handleDeposit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (FIC)
                    </label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Available: {ficBalance.toLocaleString()} FIC
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full py-2 rounded-lg font-semibold text-white transition-colors ${
                      isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isProcessing ? 'Processing...' : 'Deposit'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold mb-4">Withdraw from Vault</h3>
              <form onSubmit={handleWithdraw}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (FIC)
                    </label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Available: {vaultBalance.toLocaleString()} FIC
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full py-2 rounded-lg font-semibold text-white transition-colors ${
                      isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {isProcessing ? 'Processing...' : 'Withdraw'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-500 mr-2 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h4 className="font-semibold text-yellow-800">
                    Vault Benefits
                  </h4>
                  <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside space-y-1">
                    <li>Earn {interestRate}% annual interest on your FIC</li>
                    <li>Secure storage with bank-level encryption</li>
                    <li>Flexible deposits and withdrawals</li>
                    <li>Compounded interest paid monthly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Gift FIC from Vault</h3>
            <p className="text-gray-600 mb-4">
              Vault Balance: {vaultBalance.toLocaleString()} FIC
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (FIC)
                </label>
                <input
                  type="number"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowGiftModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendGift}
                  disabled={isProcessing}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isProcessing ? 'Sending...' : 'Send Gift'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paylink Modal */}
      {showPaylinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              Create Paylink from Vault
            </h3>
            <p className="text-gray-600 mb-4">
              Vault Balance: {vaultBalance.toLocaleString()} FIC
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (FIC)
                </label>
                <input
                  type="number"
                  value={paylinkAmount}
                  onChange={(e) => setPaylinkAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowPaylinkModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePaylink}
                  disabled={isProcessing}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
                    isProcessing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isProcessing ? 'Creating...' : 'Create Paylink'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FicVaultPage;
