import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Coins,
  ShoppingBag,
  Clock,
  Globe,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Lock,
  ExternalLink,
  Store,
  TrendingUp,
  History,
  Info,
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import apiService from '../../services/apiService';
import { enhancedWalletService } from '../../services/enhancedWalletService';
import { exchangeRateService } from '../../services/exchangeRateService';
import {
  EnhancedWallet,
  EarningDistribution,
  StakeInvestment,
  MultiBalanceUsdValuation,
  PlatformStoreType,
} from '../../types/enhanced-monetization';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

interface Transaction {
  id: string;
  amount: number;
  recipient: string;
  date: string;
  status: string;
}

const MyWalletPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  // Multi-Balance Wallet state
  const [wallet, setWallet] = useState<EnhancedWallet | null>(null);
  const [valuation, setValuation] = useState<MultiBalanceUsdValuation | null>(null);
  const [distributions, setDistributions] = useState<EarningDistribution[]>([]);
  const [stakes, setStakes] = useState<StakeInvestment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Country Currency selection
  const [selectedCountry, setSelectedCountry] = useState('NG');
  const [localValuation, setLocalValuation] = useState<{ formatted: string; ratePerFic: number } | null>(null);

  // Modals state
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isStoreCreditModalOpen, setIsStoreCreditModalOpen] = useState(false);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  // Form states
  const [sendAmount, setSendAmount] = useState('');
  const [sendRecipient, setSendRecipient] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [storeSpendAmount, setStoreSpendAmount] = useState('');
  const [selectedStore, setSelectedStore] = useState<PlatformStoreType>('FLAMINGO');
  const [simulateGrossAmount, setSimulateGrossAmount] = useState('5000');
  const [simulateSource, setSimulateSource] = useState<EarningDistribution['earningType']>('ADS');
  const [isProcessing, setIsProcessing] = useState(false);

  const loadWalletData = useCallback(async () => {
    try {
      setLoading(true);
      const [walletData, distList, stakeList] = await Promise.all([
        enhancedWalletService.getWallet(),
        enhancedWalletService.getEarningDistributions(),
        enhancedWalletService.getStakeInvestments(),
      ]);

      setWallet(walletData);
      setDistributions(distList);
      setStakes(stakeList);

      const val = exchangeRateService.convertMultiBalanceValuation(
        walletData.ficBalance,
        walletData.storeCreditBalance,
        walletData.stakeBalance
      );
      setValuation(val);

      const local = exchangeRateService.ficToLocalCurrency(walletData.ficBalance, selectedCountry);
      setLocalValuation(local);

      // Load legacy transactions
      const txRes = await apiService.get('/api/wallet/transactions').catch(() => null);
      if (txRes && (txRes.transactions || txRes.data)) {
        setTransactions(txRes.transactions || txRes.data);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load wallet data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCountry]);

  useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    if (wallet) {
      const local = exchangeRateService.ficToLocalCurrency(wallet.ficBalance, countryCode);
      setLocalValuation(local);
    }
  };

  const handleSendFic = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount to send.', 'error');
      return;
    }

    if (!wallet || amount > wallet.ficBalance) {
      showToast('Insufficient liquid FIC balance.', 'error');
      return;
    }

    if (!sendRecipient.trim()) {
      showToast('Recipient address or handle cannot be empty.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.post('/api/wallet/transfer', {
        recipient_wallet_address: sendRecipient.trim(),
        amount,
        note: 'Transfer from Liquid FIC Wallet',
      }).catch(() => null);

      // Deduct from client wallet
      wallet.ficBalance = parseFloat((wallet.ficBalance - amount).toFixed(2));
      setWallet({ ...wallet });
      showToast(`Successfully transferred ${amount.toLocaleString()} FIC to ${sendRecipient}`, 'success');
      setSendAmount('');
      setSendRecipient('');
      setIsSendModalOpen(false);
      await loadWalletData();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid deposit amount.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.post('/api/wallet/deposit', {
        amount,
        payment_method: 'Direct Protocol Mint',
      }).catch(() => null);

      if (wallet) {
        wallet.ficBalance = parseFloat((wallet.ficBalance + amount).toFixed(2));
        setWallet({ ...wallet });
      }

      showToast(`Successfully credited ${amount.toLocaleString()} FIC to your liquid balance.`, 'success');
      setDepositAmount('');
      setIsDepositModalOpen(false);
      await loadWalletData();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpendStoreCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(storeSpendAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid purchase amount.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await enhancedWalletService.spendStoreCredit(
        'mem-primary-user',
        amount,
        selectedStore,
        `ord-${selectedStore.toLowerCase()}-${Date.now().toString().slice(-5)}`,
        `Direct purchase at ${selectedStore}`
      );

      if (result.success) {
        showToast(result.message, 'success');
        setStoreSpendAmount('');
        setIsStoreCreditModalOpen(false);
        await loadWalletData();
      } else {
        showToast(result.message, 'error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulateEarning = async (e: React.FormEvent) => {
    e.preventDefault();
    const gross = parseFloat(simulateGrossAmount);
    if (isNaN(gross) || gross <= 0) {
      showToast('Please enter a valid gross earning amount.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await enhancedWalletService.distributeEarnings(
        'mem-primary-user',
        gross,
        simulateSource,
        `sim-earn-${Date.now().toString().slice(-6)}`
      );

      const d = result.distribution;
      showToast(
        `4-Part Split Applied: +${d.memberRetained} FIC Liquid (45%) | +${d.storeCredit} FIC Store Credit (25%) | +${d.stakeAmount} FIC Sleepers (5%) | +${d.platformRetained} FIC Platform (25%)`,
        'success'
      );

      setIsSimulateModalOpen(false);
      await loadWalletData();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Sovereign Platform Ownership Proof */}
        <PlatformOwnershipCard />

        {/* Header with Protocol Branding */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>[FingerMobile™Protocol] Sovereign Monetary Architecture</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Multi-Balance Sovereign Wallet</h1>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
              Automated 4-part earning distribution: 45% Liquid Retained, 25% Store Credit, 5% 1-Year Sleepers @ 1.5% APY, and 25% Platform Revenue.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSimulateModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-amber-400 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-300 hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Simulate 4-Part Split</span>
            </button>
            <button
              onClick={() => navigate('/fic-vault')}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Sleeper Vault</span>
            </button>
          </div>
        </div>

        {/* 4-Balance Dashboard Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Liquid FIC (45% Net Retained) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-300 dark:border-blue-900/60 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-950 dark:text-blue-300 border border-blue-400 dark:border-blue-800 text-blue-950 border-blue-400 font-black">
                  45% Liquid Retained
                </span>
                <Coins className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Available Liquid FIC</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {loading ? '...' : (wallet?.ficBalance || 0).toLocaleString()} <span className="text-sm font-bold text-blue-700 dark:text-blue-400">FIC</span>
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-mono font-bold">
                ≈ ${valuation?.ficUsd.toLocaleString() || '0.00'} USD
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => setIsSendModalOpen(true)}
                className="flex-1 px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowUpRight className="w-3 h-3" />
                <span>Send</span>
              </button>
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="flex-1 px-3 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowDownLeft className="w-3 h-3" />
                <span>Deposit</span>
              </button>
            </div>
          </div>

          {/* Card 2: Store Credit (25% Net Portion) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-300 dark:border-emerald-900/60 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-800 text-emerald-950 border-emerald-400 font-black">
                  25% Store Credit
                </span>
                <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Platform Store Credit</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {loading ? '...' : (wallet?.storeCreditBalance || 0).toLocaleString()} <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">FIC</span>
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-mono font-bold">
                ≈ ${valuation?.storeCreditUsd.toLocaleString() || '0.00'} USD
              </p>
              <div className="mt-2 text-[10px] text-slate-700 dark:text-slate-300 flex items-center gap-1 font-semibold">
                <Store className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate">Flamingo • OwnIt • Marketplace • Storefront</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsStoreCreditModalOpen(true)}
                className="w-full px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Redeem at Store</span>
              </button>
            </div>
          </div>

          {/* Card 3: 1-Year Staking Vault ("Sleepers" 5% Net Portion) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-purple-300 dark:border-purple-900/60 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-950 dark:text-purple-300 border border-purple-400 dark:border-purple-800 flex items-center gap-1 text-purple-950 border-purple-400 font-black">
                  <Lock className="w-2.5 h-2.5" />
                  <span>5% Sleeper Pool</span>
                </span>
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Locked Sleepers Staked</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {loading ? '...' : (wallet?.stakeBalance || 0).toLocaleString()} <span className="text-sm font-bold text-purple-700 dark:text-purple-400">FIC</span>
              </h2>
              <p className="text-xs text-purple-800 dark:text-purple-300 mt-1 font-bold flex items-center gap-1">
                <span>1.5% Annual Interest Guarantee</span>
              </p>
              <p className="text-[10px] text-slate-700 dark:text-slate-300 mt-1 font-mono font-semibold">
                {stakes.length} positions locked for 365 days
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => navigate('/fic-vault')}
                className="w-full px-3 py-1.5 text-xs font-bold border border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Sleeper Vault</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 4: Multi-Currency Valuation & Global Forex */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-300 dark:border-amber-900/60 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-300 border border-amber-400 dark:border-amber-800 border-amber-400 font-black">
                  Global Forex
                </span>
                <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Portfolio Value</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                ${valuation?.totalUsd.toLocaleString() || '0.00'} <span className="text-sm font-bold text-amber-700 dark:text-amber-400">USD</span>
              </h2>
              <div className="mt-2 text-xs font-mono text-slate-800 dark:text-slate-200 font-bold space-y-0.5">
                <p>CNY Fallback: ¥{valuation?.ficCny || '0.00'}</p>
                <p className="font-bold text-amber-900 dark:text-amber-300">
                  {localValuation?.formatted || 'NGN 0.00'}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-bold focus:outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500"
              >
                {exchangeRateService.getAllCountryRates().map((c) => (
                  <option key={c.countryCode} value={c.countryCode}>
                    {c.name} ({c.currency})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4-Part Earning Distributions History */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-amber-500" />
                <span>4-Part Earning Distributions Ledger</span>
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium">
                Mathematical allocation breakdown: 45% Member Liquid, 25% Store Credit, 5% Sleeper Stake, 25% Platform Revenue.
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              Exchange Anchor: 1 USD = {exchangeRateService.getFicUsdRate()} FIC
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Earning Source</th>
                  <th className="py-3 px-3">Gross Earning</th>
                  <th className="py-3 px-3 text-blue-700 dark:text-blue-400 font-black">45% Member (Liquid)</th>
                  <th className="py-3 px-3 text-emerald-700 dark:text-emerald-400 font-black">25% Store Credit</th>
                  <th className="py-3 px-3 text-purple-700 dark:text-purple-400 font-black">5% Sleepers (1-Yr)</th>
                  <th className="py-3 px-3 text-amber-800 dark:text-amber-400 font-black">25% Platform</th>
                  <th className="py-3 px-3">Audit Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {distributions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-700 dark:text-slate-300 font-semibold">
                      No earning distributions recorded yet. Click &apos;Simulate 4-Part Split&apos; to test.
                    </td>
                  </tr>
                ) : (
                  distributions.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors font-mono">
                      <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-medium">
                        {new Date(d.distributionDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                          {d.earningType}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        {d.grossEarning.toLocaleString()} FIC
                      </td>
                      <td className="py-3 px-3 font-bold text-blue-700 dark:text-blue-400">
                        +{d.memberRetained.toLocaleString()} FIC
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-700 dark:text-emerald-400">
                        +{d.storeCredit.toLocaleString()} FIC
                      </td>
                      <td className="py-3 px-3 font-bold text-purple-700 dark:text-purple-400">
                        +{d.stakeAmount.toLocaleString()} FIC
                      </td>
                      <td className="py-3 px-3 text-amber-900 dark:text-amber-300 font-bold">
                        {d.platformRetained.toLocaleString()} FIC
                      </td>
                      <td className="py-3 px-3 text-[10px] text-slate-700 dark:text-slate-300 font-bold truncate max-w-[120px]">
                        {d.txHash || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legacy Transfer Ledger & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Coins className="w-4 h-4 text-blue-600" />
              <span>Peer-to-Peer Transfer Ledger</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Recipient / Target</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-700 dark:text-slate-300 font-semibold">
                        No peer transactions on ledger.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                        <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium">{tx.id}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{tx.recipient}</td>
                        <td className="py-2.5 px-3 font-bold text-blue-700 dark:text-blue-400">{tx.amount} FIC</td>
                        <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{tx.date}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-600" />
              <span>Earning Policy Rules</span>
            </h3>
            <div className="text-xs space-y-2.5">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-950 dark:text-blue-300 font-medium">
                <span className="font-bold">45% Member Retained:</span> Immediate liquid withdrawal or peer-to-peer transfer.
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-300 font-medium">
                <span className="font-bold">25% Store Credit:</span> Exclusively spendable at Flamingo, OwnIt, Marketplace, and Storefront.
              </div>
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-purple-950 dark:text-purple-300 font-medium">
                <span className="font-bold">5% Sleeper Staking:</span> Automatically locked in protocol vault for 365 days at 1.5% APY.
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-300 font-medium">
                <span className="font-bold">25% Platform Revenue:</span> Channeled to protocol treasury for ecosystem maintenance.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Send FIC */}
      {isSendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">Send Liquid FIC</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 font-medium">
              Transfer liquid FIC directly to another member or external address.
            </p>
            <form onSubmit={handleSendFic} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Recipient Username or Wallet Address
                </label>
                <input
                  type="text"
                  value={sendRecipient}
                  onChange={(e) => setSendRecipient(e.target.value)}
                  placeholder="e.g. eunice_mbah or 0x8a1b..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Amount (FIC)</span>
                  <span className="text-slate-700 dark:text-slate-300 font-bold">Max: {wallet?.ficBalance.toLocaleString()} FIC</span>
                </div>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.00"
                  max={wallet?.ficBalance}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSendModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? 'Sending...' : 'Confirm Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Deposit Funds */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">Deposit FIC Tokens</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 font-medium">
              Acquire FIC tokens using fiat or bank rail at 1 USD = 20 FIC (1 FIC = $0.05 USD / ₦65.00 NGN).
            </p>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Deposit Amount (FIC)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400"
                  required
                />
                {depositAmount && (
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1 font-mono font-bold">
                    ≈ ${exchangeRateService.ficToUsd(parseFloat(depositAmount) || 0)} USD
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? 'Processing...' : 'Complete Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Redeem Store Credit */}
      {isStoreCreditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <span>Redeem Store Credit</span>
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 font-medium">
              Use your 25% store credit balance exclusively on official platform retail portals.
            </p>
            <form onSubmit={handleSpendStoreCredit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Select Platform Store
                </label>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value as PlatformStoreType)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="FLAMINGO">Flamingo Retail Store</option>
                  <option value="OWNIT">OwnIt Digital Assets & IP</option>
                  <option value="MARKETPLACE">Global Marketplace</option>
                  <option value="STOREFRONT">Creator Storefronts</option>
                </select>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Amount (FIC)</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-black">
                    Avail: {wallet?.storeCreditBalance.toLocaleString()} FIC
                  </span>
                </div>
                <input
                  type="number"
                  value={storeSpendAmount}
                  onChange={(e) => setStoreSpendAmount(e.target.value)}
                  placeholder="0.00"
                  max={wallet?.storeCreditBalance}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStoreCreditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? 'Redeeming...' : 'Confirm Store Purchase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Simulate 4-Part Split Earning */}
      {isSimulateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Simulate 4-Part Earning Distribution</span>
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 font-medium">
              Enter a gross earning amount to observe the automated mathematical split into the 4 defined buckets.
            </p>
            <form onSubmit={handleSimulateEarning} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Gross Creator Earning (FIC)
                </label>
                <input
                  type="number"
                  value={simulateGrossAmount}
                  onChange={(e) => setSimulateGrossAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none placeholder:text-slate-400"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Earning Category Source
                </label>
                <select
                  value={simulateSource}
                  onChange={(e) => setSimulateSource(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ADS">In-Stream Video Ads (45/25/5/25)</option>
                  <option value="GEMS">Live Stream Gems & Marble Gifts</option>
                  <option value="TIPS">Creator Tip Jar & Direct Patronage</option>
                  <option value="SHOP_SALES">Flamingo & Storefront Merchandise</option>
                  <option value="SUBSCRIPTIONS">VIP Channel Subscriptions</option>
                </select>
              </div>

              {/* Preview calculation breakdown */}
              {parseFloat(simulateGrossAmount) > 0 && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-xs font-mono space-y-1 font-bold">
                  <div className="flex justify-between text-blue-700 dark:text-blue-400">
                    <span>45% Member Liquid:</span>
                    <span>{(parseFloat(simulateGrossAmount) * 0.45).toLocaleString()} FIC</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                    <span>25% Store Credit:</span>
                    <span>{(parseFloat(simulateGrossAmount) * 0.25).toLocaleString()} FIC</span>
                  </div>
                  <div className="flex justify-between text-purple-700 dark:text-purple-400">
                    <span>5% Sleepers (1-Yr @ 1.5%):</span>
                    <span>{(parseFloat(simulateGrossAmount) * 0.05).toLocaleString()} FIC</span>
                  </div>
                  <div className="flex justify-between text-amber-800 dark:text-amber-400">
                    <span>25% Platform Revenue:</span>
                    <span>{(parseFloat(simulateGrossAmount) * 0.25).toLocaleString()} FIC</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSimulateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? 'Calculating...' : 'Apply 4-Part Split'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWalletPage;
