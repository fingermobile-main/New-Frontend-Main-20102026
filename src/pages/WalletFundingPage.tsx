import React, { useState } from 'react';
import apiService from '../services/apiService';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';
import { GiftIcon, PaylinkIcon, CurrencyNairaIcon, UserCircleIcon, ArrowRightIcon } from '../icons';

const WalletFundingPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();

  // Nigerian banks integration options
  const banks = [
    { id: 'zenith', name: 'Zenith Bank', icon: '🏦' },
    { id: 'gtb', name: 'Guaranty Trust Bank', icon: '🏦' },
    { id: 'uba', name: 'United Bank for Africa', icon: '🏦' },
    { id: 'fidelity', name: 'Fidelity Bank', icon: '🏦' },
    { id: 'access', name: 'Access Bank', icon: '🏦' },
    { id: 'fcmb', name: 'First City Monument Bank', icon: '🏦' },
    { id: 'ecobank', name: 'Ecobank', icon: '🏦' },
    { id: 'providus', name: 'Providus Bank', icon: '🏦' },
    { id: 'opay', name: 'Opay', icon: '📱' },
    { id: 'moniepoint', name: 'Moniepoint', icon: '💳' }
  ];

  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [giftAmount, setGiftAmount] = useState('');
  const [paylinkAmount, setPaylinkAmount] = useState('');
  const [paylinkDescription, setPaylinkDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState(banks[0].id);

  const onOpenGiftModal = () => {
    if (ficBalance <= 0) {
      showToast(
        'Your FIC balance is 0. Please fund your wallet to send a gift.',
        'error'
      );
      return;
    }
    setShowGiftModal(true);
  };

  const onOpenPaylinkModal = () => {
    if (ficBalance <= 0) {
      showToast(
        'Your FIC balance is 0. Please fund your wallet to create a paylink.',
        'error'
      );
      return;
    }
    setShowPaylinkModal(true);
  };

  const handleSendGift = async () => {
    if (!giftAmount || parseFloat(giftAmount) <= 0) {
      showToast('Please enter a valid gift amount.', 'error');
      return;
    }

    if (parseFloat(giftAmount) > ficBalance) {
      showToast('Insufficient FIC balance to send this gift.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.post('/api/giftcards', {
        amount: parseFloat(giftAmount),
        currency: 'FIC',
        description: 'Gift Card generated from Wallet Funding'
      });
      showToast(`Successfully sent a gift of ${giftAmount} FIC!`, 'success');
      setGiftAmount('');
      setShowGiftModal(false);
    } catch (error) {
      showToast('Failed to send gift. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreatePaylink = async () => {
    if (!paylinkAmount || parseFloat(paylinkAmount) <= 0) {
      showToast('Please enter a valid paylink amount.', 'error');
      return;
    }

    if (parseFloat(paylinkAmount) > ficBalance) {
      showToast('Insufficient FIC balance to create this paylink.', 'error');
      return;
    }

    if (!paylinkDescription.trim()) {
      showToast('Please add a description for the paylink.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.post('/api/paylinks', {
        title: paylinkDescription.trim(),
        amount: parseFloat(paylinkAmount),
        currency: 'FIC'
      });
      showToast(`Successfully created a paylink for ${paylinkAmount} FIC!`, 'success');
      setPaylinkAmount('');
      setPaylinkDescription('');
      setShowPaylinkModal(false);
    } catch (error) {
      showToast('Failed to create paylink. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFundWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const bankName = banks.find((b) => b.id === selectedBank)?.name || 'Bank Transfer';
      await apiService.post('/api/wallet/deposit', {
        amount: parseFloat(amount),
        payment_method: bankName
      });
      showToast(
        `Successfully funded ${amount} FIC through ${bankName}`,
        'success'
      );
      setAmount('');
    } catch (error) {
      showToast('Funding failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 p-3 w-16 h-16 rounded-full flex items-center justify-center">
            <CurrencyNairaIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Fund Your Wallet</h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Add funds to your Infinite Coin (FIC) wallet using any of the supported Nigerian banks
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bank Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

              <div className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Select Payment Method
                </h2>

                <form onSubmit={handleFundWallet}>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                      Amount (FIC)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <CurrencyNairaIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                      Select Bank
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {banks.map((bank) => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBank(bank.id)}
                          className={`p-4 border rounded-xl flex flex-col items-center justify-center ${
                            selectedBank === bank.id
                              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-2xl mb-2">{bank.icon}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {bank.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !amount}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span>
                        Fund Wallet with {amount || 0} FIC <ArrowRightIcon className="h-4 w-4 ml-2 inline" />
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Quick Actions and Balance */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-indigo-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <button
                  onClick={onOpenGiftModal}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors bg-gradient-to-r from-purple-50 to-indigo-50"
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white mr-4">
                      <GiftIcon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900">Send Gift</p>
                      <p className="text-xs text-gray-500">
                        Share FIC with friends
                      </p>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </button>

                <button
                  onClick={onOpenPaylinkModal}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors bg-gradient-to-r from-blue-50 to-cyan-50"
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg text-white mr-4">
                      <PaylinkIcon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-900">Paylink</p>
                      <p className="text-xs text-gray-500">
                        Create a payment link
                      </p>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">About FIC</h3>
              <p className="text-sm text-gray-600 mb-4">
                Infinite Coin (FIC) is the official currency of the FingerMobile Protocol ecosystem.
              </p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>Secure blockchain-backed transactions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>Low transaction fees</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>Instant transfers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-2">Send Gift to Friend</h3>
            <p className="text-sm text-gray-500 mb-4">
              Share FIC with someone special
            </p>
            <p className="text-gray-600 mb-4">
              Your Balance: {ficBalance.toLocaleString()} FIC
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
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter amount"
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200"
                  onClick={() => setShowGiftModal(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700"
                  onClick={handleSendGift}
                  disabled={isProcessing}
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
            <h3 className="text-xl font-semibold mb-2">
              Create Paylink
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Generate a payment link for others to send you FIC
            </p>
            <p className="text-gray-600 mb-4">
              Your Balance: {ficBalance.toLocaleString()} FIC
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
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={paylinkDescription}
                  onChange={(e) => setPaylinkDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter description (optional)"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-200"
                  onClick={() => setShowPaylinkModal(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600"
                  onClick={handleCreatePaylink}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Creating...' : 'Create Paylink'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default WalletFundingPage;
