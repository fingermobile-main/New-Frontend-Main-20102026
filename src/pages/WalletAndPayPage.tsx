import React, { useState } from 'react';
import apiService from '../services/apiService';
import MainLayout from '../components/layout/MainLayout';
import {
  GiftIcon,
  PaylinkIcon,
  CurrencyNairaIcon,
  UserCircleIcon,
  CreditCardIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  LinkIcon
} from '../icons';
import PageHeader from '../components/PageHeader';
import { useAppContext } from '../contexts/AppContext';

const WalletAndPayPage: React.FC = () => {
  const { ficBalance, openModal, showToast } = useAppContext();

  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [giftAmount, setGiftAmount] = useState('');
  const [paylinkAmount, setPaylinkAmount] = useState('');
  const [paylinkDescription, setPaylinkDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const onOpenGiftModal = () => {
    if (ficBalance <= 0) {
      showToast('Insufficient FIC balance to send gift', 'error');
      return;
    }
    setShowGiftModal(true);
  };

  const onOpenPaylinkModal = () => {
    if (ficBalance <= 0) {
      showToast('Insufficient FIC balance to create paylink', 'error');
      return;
    }
    setShowPaylinkModal(true);
  };

  const handleSendGift = async () => {
    const amount = parseFloat(giftAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (amount > ficBalance) {
      showToast('Insufficient FIC balance', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.post('/api/giftcards', {
        amount,
        currency: 'FIC',
        description: 'Gift Card via WalletAndPay'
      });
      showToast(`Successfully created and sent gift card for ${amount} FIC!`, 'success');
      setGiftAmount('');
      setShowGiftModal(false);
    } catch (error) {
      showToast('Failed to send gift. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreatePaylink = async () => {
    const amount = parseFloat(paylinkAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (amount > ficBalance) {
      showToast('Insufficient FIC balance', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.post('/api/paylinks', {
        title: paylinkDescription.trim() || 'Payment Link',
        amount,
        currency: 'FIC'
      });
      showToast(`Successfully generated paylink for ${amount} FIC!`, 'success');
      setPaylinkAmount('');
      setPaylinkDescription('');
      setShowPaylinkModal(false);
    } catch (error) {
      showToast('Failed to create paylink. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl">
              <CreditCardIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Wallet & Pay
              </h1>
              <p className="text-gray-600">
                Manage your FingerCoin balance and payments
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Balance Overview</h2>
              <div className="flex items-center gap-4">
                <CurrencyNairaIcon className="w-8 h-8 text-green-600" />
                <p className="text-3xl font-bold text-gray-900">
                  {ficBalance.toLocaleString()} FIC
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700"
                  onClick={() => openModal('top-up')}
                >
                  Fund Wallet
                </button>
                <button
                  className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
                  onClick={() => openModal('withdraw')}
                >
                  Withdraw
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl mt-6 border border-gray-100">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  className="flex items-center p-5 border border-gray-200 rounded-xl hover:bg-green-50 transition-colors"
                  onClick={onOpenGiftModal}
                >
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <GiftIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Send Gift</h3>
                    <p className="text-sm text-gray-600">Send FIC to others</p>
                  </div>
                </button>
                <button
                  className="flex items-center p-5 border border-gray-200 rounded-xl hover:bg-blue-50 transition-colors"
                  onClick={onOpenPaylinkModal}
                >
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <LinkIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Create Paylink</h3>
                    <p className="text-sm text-gray-600">Request payment</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1.5 rounded-lg hover:from-green-700 hover:to-emerald-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Wallet Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-green-50 hover:to-emerald-50 transition-colors flex items-center">
                  <ArrowUpIcon className="h-5 w-5 text-green-600 mr-3" />
                  Top Up
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-green-50 hover:to-emerald-50 transition-colors flex items-center">
                  <ArrowDownIcon className="h-5 w-5 text-green-600 mr-3" />
                  Withdraw
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-green-50 hover:to-emerald-50 transition-colors flex items-center">
                  <PaylinkIcon className="h-5 w-5 text-green-600 mr-3" />
                  Create Paylink
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Payment Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Always verify recipient before sending</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Check your balance before transactions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Keep your wallet secure</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Gift Modal */}
        {showGiftModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Send Gift</h3>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
                    onClick={() => setShowGiftModal(false)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700"
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
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Create Paylink</h3>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter description (optional)"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
                    onClick={() => setShowPaylinkModal(false)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700"
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
      </div>
    </MainLayout>
  );
};

export default WalletAndPayPage;
