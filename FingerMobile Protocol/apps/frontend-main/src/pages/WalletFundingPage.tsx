import React, { useState } from 'react';
import apiService from '../services/apiService';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';
import { GiftIcon, PaylinkIcon, CurrencyNairaIcon, UserCircleIcon, ArrowRightIcon } from '../icons';
import { DEDICATED_TREASURY_RAIL } from '../constants/platformOwnership';

const WalletFundingPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();

  // Nigerian banks integration options
  const banks = [
    {
      id: 'alternative',
      name: 'Alternative Bank',
      icon: '🏛️',
      dedicatedRail: true,
      accountNumber: DEDICATED_TREASURY_RAIL.accountNumber,
      accountName: DEDICATED_TREASURY_RAIL.accountName,
      badge: 'Dedicated Protocol Treasury Rail'
    },
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
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 p-3.5 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border border-blue-500">
            <CurrencyNairaIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Fund Your Wallet</h1>
          <p className="mt-2 text-sm font-medium text-slate-700 leading-relaxed">
            Deposit funds directly into your Sovereign Infinite Coin (FIC) balance through verified Nigerian commercial banking rails and dedicated treasury accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bank Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-300 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

              <div className="p-6 md:p-8">
                <h2 className="text-xl font-black text-slate-900 mb-6">
                  Select Payment Method & Banking Rail
                </h2>

                <form onSubmit={handleFundWallet} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Amount (FIC)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount to fund"
                        className="w-full px-4 py-3 pl-12 border border-slate-300 rounded-xl bg-white text-slate-900 font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 font-mono"
                        required
                      />
                      <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2">
                        <CurrencyNairaIcon className="h-5 w-5 text-slate-600" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold mt-1.5">
                      1 FIC = ₦100.00 • Guaranteed 1:1 Instant Mint
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                      Select Deposit Gateway Bank
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {banks.map((bank) => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBank(bank.id)}
                          className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                            selectedBank === bank.id
                              ? 'border-2 border-blue-600 bg-blue-50/80 shadow-sm ring-1 ring-blue-500/30'
                              : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 shadow-xs'
                          }`}
                        >
                          <span className="text-2xl mb-1.5">{bank.icon}</span>
                          <span className="text-xs font-bold text-slate-900 text-center">
                            {bank.name}
                          </span>
                        </button>
                      ))}
                    </div>

                    {selectedBank === 'alternative' && (
                      <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs text-amber-950 font-mono space-y-2 shadow-xs">
                        <div className="flex justify-between items-center text-amber-950 font-black">
                          <span>{DEDICATED_TREASURY_RAIL.railTitle}</span>
                          <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full font-black border border-amber-400">
                            {DEDICATED_TREASURY_RAIL.licenseStatus}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-black pt-1">
                          <span className="text-slate-800">Account Number:</span>
                          <span className="text-base text-amber-950 tracking-wider font-mono font-black">{DEDICATED_TREASURY_RAIL.accountNumber}</span>
                        </div>
                        <div className="text-[11px] text-amber-900 font-bold">
                          <span>Account Name: </span>
                          <span className="font-mono font-black text-slate-900">{DEDICATED_TREASURY_RAIL.accountName}</span>
                        </div>
                        <p className="text-[10px] text-slate-700 font-sans pt-1.5 border-t border-amber-200 font-medium">
                          Payments confirmed by Treasury Staff and verified by Executive Protocol CFO.
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !amount}
                    className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer text-sm"
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
                        Processing Mint...
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
            <div className="bg-white rounded-3xl p-6 border border-slate-300 shadow-sm">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-blue-700 mr-2" />
                Your Active Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-mono font-black text-slate-900">{ficBalance.toFixed(2)} FIC</span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-950 px-2.5 py-1 rounded-full border border-emerald-400 font-black">
                  Active
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-300">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Quick Financial Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={onOpenGiftModal}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-300 hover:bg-slate-50 transition-colors bg-white shadow-xs text-left cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="p-2.5 bg-purple-100 border border-purple-300 rounded-xl text-purple-800 mr-3.5">
                      <GiftIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">Send Gift Card</p>
                      <p className="text-xs text-slate-700 font-medium">
                        Share FIC vouchers with peers
                      </p>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-slate-600" />
                </button>

                <button
                  onClick={onOpenPaylinkModal}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-300 hover:bg-slate-50 transition-colors bg-white shadow-xs text-left cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="p-2.5 bg-blue-100 border border-blue-300 rounded-xl text-blue-800 mr-3.5">
                      <PaylinkIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">Create Paylink</p>
                      <p className="text-xs text-slate-700 font-medium">
                        Generate instant payment link
                      </p>
                    </div>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-300 shadow-sm">
              <h3 className="font-black text-slate-900 mb-2 text-sm uppercase tracking-wider">About Sovereign FIC</h3>
              <p className="text-xs text-slate-700 font-medium mb-4 leading-relaxed">
                Infinite Coin (FIC) is the official utility currency of the FingerMobile Protocol ecosystem.
              </p>
              <ul className="space-y-2 text-xs text-slate-800 font-medium">
                <li className="flex items-start">
                  <span className="text-amber-700 font-black mr-2">•</span>
                  <span>Cryptographically verified on-ledger settlement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-700 font-black mr-2">•</span>
                  <span>Zero gas fees for intra-protocol transfers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-700 font-black mr-2">•</span>
                  <span>Direct convertibility to Nigerian Naira</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-300">
            <h3 className="text-xl font-black text-slate-900 mb-1">Send Gift Card</h3>
            <p className="text-xs font-semibold text-slate-700 mb-4">
              Your Available Balance: <span className="font-mono font-black text-slate-900">{ficBalance.toLocaleString()} FIC</span>
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
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 font-bold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-slate-400 font-mono"
                  placeholder="Enter amount"
                  min="0"
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
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50 cursor-pointer text-sm"
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
            <h3 className="text-xl font-black text-slate-900 mb-1">
              Create Paylink
            </h3>
            <p className="text-xs font-semibold text-slate-700 mb-4">
              Generate an instant payment link for peers
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
    </MainLayout>
  );
};

export default WalletFundingPage;
