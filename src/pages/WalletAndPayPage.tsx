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
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-3.5 rounded-2xl shadow-sm border border-emerald-500">
              <CreditCardIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Wallet & Pay
              </h1>
              <p className="text-sm font-medium text-slate-700 mt-0.5">
                Manage your sovereign FingerCoin balance, payouts, and payment links
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-300">
              <h2 className="text-xl font-black mb-4 text-slate-900">Balance Overview</h2>
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CurrencyNairaIcon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl font-mono font-black text-slate-900">
                    {ficBalance.toLocaleString()} <span className="text-xl font-bold text-slate-700">FIC</span>
                  </p>
                  <p className="text-xs text-emerald-800 font-bold mt-1">
                    ≈ ₦{(ficBalance * 100).toLocaleString()} Sovereign Reserve Value
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-slate-200">
                <button
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                  onClick={() => openModal('top-up')}
                >
                  Fund Wallet
                </button>
                <button
                  className="px-6 py-3 border-2 border-slate-300 text-slate-800 hover:bg-slate-50 font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                  onClick={() => openModal('withdraw')}
                >
                  Withdraw
                </button>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-300">
              <h2 className="text-xl font-black mb-4 text-slate-900">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  className="flex items-center p-5 border border-slate-300 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm text-left bg-white cursor-pointer"
                  onClick={onOpenGiftModal}
                >
                  <div className="p-3 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl mr-4">
                    <GiftIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">Send Gift Card</h3>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">Send FIC to platform peers</p>
                  </div>
                </button>
                <button
                  className="flex items-center p-5 border border-slate-300 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm text-left bg-white cursor-pointer"
                  onClick={onOpenPaylinkModal}
                >
                  <div className="p-3 bg-blue-100 text-blue-800 border border-blue-300 rounded-xl mr-4">
                    <LinkIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">Create Paylink</h3>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">Request payment via shareable link</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-300 shadow-sm">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-emerald-700 mr-2" />
                Active FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-mono font-black text-slate-900">{ficBalance.toFixed(2)} FIC</span>
                <button
                  onClick={() => openModal('top-up')}
                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-300">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Wallet Controls</h2>
              <div className="space-y-2.5">
                <button
                  onClick={() => openModal('top-up')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-900 font-bold rounded-xl transition-colors flex items-center cursor-pointer text-sm"
                >
                  <ArrowUpIcon className="h-5 w-5 text-emerald-700 mr-3" />
                  Top Up Funds
                </button>
                <button
                  onClick={() => openModal('withdraw')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-900 font-bold rounded-xl transition-colors flex items-center cursor-pointer text-sm"
                >
                  <ArrowDownIcon className="h-5 w-5 text-emerald-700 mr-3" />
                  Withdraw Funds
                </button>
                <button
                  onClick={onOpenPaylinkModal}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-900 font-bold rounded-xl transition-colors flex items-center cursor-pointer text-sm"
                >
                  <PaylinkIcon className="h-5 w-5 text-blue-700 mr-3" />
                  Create Instant Paylink
                </button>
              </div>
            </div>

            <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-300 shadow-sm">
              <h3 className="font-black text-slate-900 mb-3 text-sm uppercase tracking-wider">Settlement & Security Tips</h3>
              <ul className="space-y-2.5 text-xs text-slate-800 font-medium">
                <li className="flex items-start">
                  <span className="text-amber-700 font-black mr-2">✓</span>
                  <span>Always verify recipient sovereign tag before transfer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-700 font-black mr-2">✓</span>
                  <span>FIC transactions are validated cryptographically</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-700 font-black mr-2">✓</span>
                  <span>Direct NUBAN payouts settle within 5 minutes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Gift Modal */}
        {showGiftModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-300">
              <h3 className="text-xl font-black text-slate-900 mb-1">Send Gift Card</h3>
              <p className="text-xs font-semibold text-slate-700 mb-5">
                Available Balance: <span className="font-mono font-black text-slate-900">{ficBalance.toLocaleString()} FIC</span>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Amount (FIC)
                  </label>
                  <input
                    type="number"
                    value={giftAmount}
                    onChange={(e) => setGiftAmount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 font-bold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 font-mono"
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-3">
                  <button
                    className="px-4 py-2.5 text-slate-700 hover:text-slate-900 font-bold border border-slate-300 bg-white hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-sm"
                    onClick={() => setShowGiftModal(false)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50 cursor-pointer text-sm"
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
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-300">
              <h3 className="text-xl font-black text-slate-900 mb-1">Create Paylink</h3>
              <p className="text-xs font-semibold text-slate-700 mb-5">
                Available Balance: <span className="font-mono font-black text-slate-900">{ficBalance.toLocaleString()} FIC</span>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Amount (FIC)
                  </label>
                  <input
                    type="number"
                    value={paylinkAmount}
                    onChange={(e) => setPaylinkAmount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 font-bold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 font-mono"
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <input
                    type="text"
                    value={paylinkDescription}
                    onChange={(e) => setPaylinkDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 font-bold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                    placeholder="Enter description (optional)"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-3">
                  <button
                    className="px-4 py-2.5 text-slate-700 hover:text-slate-900 font-bold border border-slate-300 bg-white hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-sm"
                    onClick={() => setShowPaylinkModal(false)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50 cursor-pointer text-sm"
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
