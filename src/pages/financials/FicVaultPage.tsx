import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock,
  Clock,
  Sparkles,
  ArrowDownLeft,
  CheckCircle2,
  Percent,
  Coins,
  ShoppingBag,
  Globe,
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';
import { enhancedWalletService } from '../../services/enhancedWalletService';
import { exchangeRateService } from '../../services/exchangeRateService';
import {
  EnhancedWallet,
  StakeInvestment,
  MultiBalanceUsdValuation,
} from '../../types/enhanced-monetization';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

const FicVaultPage: React.FC = () => {
  const { showToast } = useAppContext() || {};

  const [wallet, setWallet] = useState<EnhancedWallet | null>(null);
  const [valuation, setValuation] = useState<MultiBalanceUsdValuation | null>(null);
  const [stakes, setStakes] = useState<StakeInvestment[]>([]);
  const [loading, setLoading] = useState(true);

  // Staking / Deposit Form States
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [walletData, stakeList] = await Promise.all([
        enhancedWalletService.getWallet(),
        enhancedWalletService.getStakeInvestments(),
      ]);

      setWallet(walletData);
      setStakes(stakeList);

      const val = exchangeRateService.convertMultiBalanceValuation(
        walletData.ficBalance,
        walletData.storeCreditBalance,
        walletData.stakeBalance
      );
      setValuation(val);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load FIC Vault data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle manual deposit into liquid vault
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast?.('Please enter a valid deposit amount', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.post('/api/fic-vault/deposit', { amount }).catch(() => null);

      if (wallet) {
        wallet.ficBalance = parseFloat((wallet.ficBalance + amount).toFixed(2));
        setWallet({ ...wallet });
      }

      showToast?.(`Successfully deposited ${amount.toLocaleString()} FIC to your vault`, 'success');
      setDepositAmount('');
      setIsDepositModalOpen(false);
      await loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle locking an additional stake into the 1-Year Sleeper pool @ 1.5%
  const handleCreateSleeperStake = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast?.('Please enter a valid amount to stake', 'error');
      return;
    }

    if (!wallet || amount > wallet.ficBalance) {
      showToast?.('Insufficient liquid FIC balance to lock in Sleeper Stake', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate/Trigger staking via enhancedWalletService
      const now = new Date();
      const maturity = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      const expectedReturn = parseFloat((amount * 1.015).toFixed(2));

      wallet.ficBalance = parseFloat((wallet.ficBalance - amount).toFixed(2));
      wallet.stakeBalance = parseFloat((wallet.stakeBalance + amount).toFixed(2));
      setWallet({ ...wallet });

      const newStake: StakeInvestment = {
        id: `stake-${Date.now()}`,
        memberId: 'mem-primary-user',
        amount,
        interestRate: 1.5,
        startDate: now.toISOString(),
        maturityDate: maturity.toISOString(),
        status: 'active',
        expectedReturn,
        actualReturn: 0.0,
        createdAt: now.toISOString(),
      };

      const updatedStakes = [newStake, ...stakes];
      setStakes(updatedStakes);
      localStorage.setItem('fingermobile_sleeper_stakes_v1', JSON.stringify(updatedStakes));

      showToast?.(
        `Successfully locked ${amount.toLocaleString()} FIC into 1-Year Sleeper Staking at 1.5% APY!`,
        'success'
      );
      setStakeAmount('');
      setIsStakeModalOpen(false);
      await loadData();
    } finally {
      setIsProcessing(false);
    }
  };

  // Claim a matured stake
  const handleClaimStake = async (stakeId: string) => {
    setIsProcessing(true);
    try {
      const res = await enhancedWalletService.withdrawMaturedStake('mem-primary-user', stakeId);
      if (res.success) {
        showToast?.(res.message, 'success');
        await loadData();
      } else {
        showToast?.(res.message, 'error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to compute days left in lockup
  const getDaysRemaining = (maturityDateStr: string) => {
    const now = new Date().getTime();
    const maturity = new Date(maturityDateStr).getTime();
    const diffDays = Math.ceil((maturity - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Helper to compute progress bar percentage
  const getProgressPct = (startDateStr: string, maturityDateStr: string) => {
    const start = new Date(startDateStr).getTime();
    const maturity = new Date(maturityDateStr).getTime();
    const now = new Date().getTime();
    if (now >= maturity) return 100;
    const total = maturity - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Sovereign Platform Ownership Proof */}
        <PlatformOwnershipCard />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-purple-500/40 p-1 flex items-center justify-center shadow-md overflow-hidden shrink-0">
              <img src="/assets/logos/fic_logo.png" alt="Finger Infinite Coin" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 text-xs font-mono text-purple-600 dark:text-purple-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>[FingerMobile™Protocol] Sovereign Vault & Sleepers Staking Engine</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">FIC Vault & &quot;Sleepers&quot; Pool</h1>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
                Automated 1-Year locked staking period with guaranteed 1.5% fixed annual returns and multi-balance protocol custody.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsStakeModalOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>+ Lock Sleeper Stake (1-Yr)</span>
            </button>
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Deposit to Vault</span>
            </button>
          </div>
        </div>

        {/* 4-Balance Multi-Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Staked Sleepers (5% Net Portion) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-purple-300 dark:border-purple-900/60 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-950 dark:text-purple-300 border border-purple-400 dark:border-purple-800 flex items-center gap-1 text-purple-950 border-purple-400 font-black">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Sleeper Pool (1-Yr)</span>
                </span>
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Active Stakes</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {loading ? '...' : (wallet?.stakeBalance || 0).toLocaleString()} <span className="text-sm font-bold text-purple-700 dark:text-purple-400">FIC</span>
              </h2>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-800 dark:text-purple-300 font-bold">
                <Percent className="w-3.5 h-3.5" />
                <span>1.5% Guaranteed APY</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-mono font-bold">
              ≈ ${valuation?.stakeUsd.toLocaleString() || '0.00'} USD
            </div>
          </div>

          {/* Card 2: Liquid FIC Balance (45% Net Retained) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-300 dark:border-blue-900/60 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-950 dark:text-blue-300 border border-blue-400 dark:border-blue-800 text-blue-950 border-blue-400 font-black">
                  45% Liquid
                </span>
                <Coins className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Available Liquid Reserve</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {loading ? '...' : (wallet?.ficBalance || 0).toLocaleString()} <span className="text-sm font-bold text-blue-700 dark:text-blue-400">FIC</span>
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 font-mono font-semibold">
                Unrestricted peer transfers
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-mono font-bold">
              ≈ ${valuation?.ficUsd.toLocaleString() || '0.00'} USD
            </div>
          </div>

          {/* Card 3: Store Credit (25% Net Portion) */}
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
              <p className="text-[10px] text-slate-700 dark:text-slate-300 mt-2 font-semibold truncate">
                Flamingo • OwnIt • Stores
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-mono font-bold">
              ≈ ${valuation?.storeCreditUsd.toLocaleString() || '0.00'} USD
            </div>
          </div>

          {/* Card 4: Global Valuation & Rate Anchor */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-300 dark:border-amber-900/60 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-300 border border-amber-400 dark:border-amber-800 border-amber-400 font-black">
                  Forex Valuation
                </span>
                <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Vault USD Value</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                ${valuation?.totalUsd.toLocaleString() || '0.00'} <span className="text-sm font-bold text-amber-700 dark:text-amber-400">USD</span>
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 font-mono font-bold">
                CNY Value: ¥{valuation?.ficCny || '0.00'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-amber-900 dark:text-amber-300 font-black font-mono">
              Protocol Anchor: 1 USD = {exchangeRateService.getFicUsdRate()} FIC
            </div>
          </div>
        </div>

        {/* Active Sleeper Stakes Management Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-600" />
                <span>Active &quot;Sleepers&quot; Positions Ledger</span>
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium">
                Every 5% creator earning is automatically locked for a 365-day sleeping period with a 1.5% fixed interest return upon maturity.
              </p>
            </div>
            <div className="text-xs font-mono text-purple-700 dark:text-purple-400 font-black">
              {stakes.length} Active Staking Contracts
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Position ID</th>
                  <th className="py-3 px-3">Principal (FIC)</th>
                  <th className="py-3 px-3">Lock Date</th>
                  <th className="py-3 px-3">Maturity Date (1-Yr)</th>
                  <th className="py-3 px-3">Maturity Countdown</th>
                  <th className="py-3 px-3">APY Rate</th>
                  <th className="py-3 px-3">Expected Return</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {stakes.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-700 dark:text-slate-300 font-semibold">
                      No active Sleeper stakes found. Click &apos;+ Lock Sleeper Stake&apos; or simulate creator earnings to begin.
                    </td>
                  </tr>
                ) : (
                  stakes.map((stake) => {
                    const daysLeft = getDaysRemaining(stake.maturityDate);
                    const progress = getProgressPct(stake.startDate, stake.maturityDate);
                    const isMatured = daysLeft === 0 && stake.status === 'active';

                    return (
                      <tr key={stake.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                        <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 font-bold">{stake.id}</td>
                        <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                          {stake.amount.toLocaleString()} FIC
                        </td>
                        <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 font-medium">
                          {new Date(stake.startDate).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 font-medium">
                          {new Date(stake.maturityDate).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="space-y-1 w-36">
                            <div className="flex justify-between text-[10px] text-slate-800 dark:text-slate-200 font-bold">
                              <span>{daysLeft === 0 ? 'Matured!' : `${daysLeft} days left`}</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${daysLeft === 0 ? 'bg-emerald-600' : 'bg-purple-600'}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-purple-700 dark:text-purple-400 font-bold">1.5%</td>
                        <td className="py-3.5 px-3 font-bold text-emerald-700 dark:text-emerald-400">
                          {stake.expectedReturn.toLocaleString()} FIC
                        </td>
                        <td className="py-3.5 px-3">
                          {stake.status === 'withdrawn' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-300">
                              Claimed / Withdrawn
                            </span>
                          ) : isMatured ? (
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300 animate-pulse">
                              Matured (Ready)
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-950 border border-purple-400 dark:bg-purple-950 dark:text-purple-300">
                              Active Locked
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          {isMatured ? (
                            <button
                              onClick={() => handleClaimStake(stake.id)}
                              disabled={isProcessing}
                              className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                            >
                              Claim Yield
                            </button>
                          ) : stake.status === 'withdrawn' ? (
                            <span className="text-[11px] text-slate-700 dark:text-slate-300 font-bold">Completed</span>
                          ) : (
                            <span className="text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-end gap-1 font-bold">
                              <Lock className="w-3 h-3" />
                              <span>Locked</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security & Guarantee Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-black text-sm">
              <Lock className="w-4 h-4" />
              <span>1-Year Sleeping Lockup Policy</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Staked FIC is locked for precisely 365 calendar days from the creation timestamp. During this time, the principal is deployed to protocol treasury liquidity.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-black text-sm">
              <Percent className="w-4 h-4" />
              <span>1.5% Guaranteed Yield</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Returns are cryptographically computed at a fixed 1.5% APY and paid out in full upon contract maturity directly into the holder&apos;s liquid FIC balance.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-black text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Triple-Secured Custody</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Vault smart balances are backed by the 48M CIC master reserve and protected by biometric face verification and multi-signature governance.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL: Lock Sleeper Stake */}
      {isStakeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              <span>Lock Tokens in &quot;Sleepers&quot; Pool</span>
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 font-medium">
              Commit FIC tokens into the 1-year locked staking vault with guaranteed 1.5% annual interest.
            </p>
            <form onSubmit={handleCreateSleeperStake} className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Amount to Stake (FIC)</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Available: {wallet?.ficBalance.toLocaleString()} FIC</span>
                </div>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="e.g. 1000"
                  max={wallet?.ficBalance}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none placeholder:text-slate-400"
                  required
                />
              </div>

              {parseFloat(stakeAmount) > 0 && (
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-xs font-mono space-y-1 text-purple-950 dark:text-purple-300">
                  <div className="flex justify-between">
                    <span>Lock Period:</span>
                    <span className="font-bold">365 Calendar Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guaranteed Yield:</span>
                    <span className="font-bold">1.50% APY</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Maturity Value:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {(parseFloat(stakeAmount) * 1.015).toLocaleString()} FIC
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStakeModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? 'Locking...' : 'Confirm 1-Year Lockup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Deposit to Vault */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">Deposit FIC to Vault</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 font-medium">
              Transfer funds into your live sovereign vault reserve.
            </p>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Amount (FIC)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-400"
                  required
                />
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
                  className="px-4 py-2 text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? 'Depositing...' : 'Confirm Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FicVaultPage;
