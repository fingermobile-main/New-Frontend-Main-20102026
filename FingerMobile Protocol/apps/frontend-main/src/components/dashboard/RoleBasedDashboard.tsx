/*
 * FingerMobile Protocol™ - Role-Based Community (RBC) User Dashboard
 * Front-facing UI for Onboarded Members, Qualified Creators, Merchants & Ambassadors
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userProfileSyncService from '../../services/UserProfileSyncService';
import {
  ShieldCheck,
  Sparkles,
  Gift,
  ShoppingBag,
  Music,
  Users,
  Award,
  Wallet,
  TrendingUp,
  Eye,
  CheckCircle,
  Clock,
  ArrowUpRight,
  PlusCircle,
  FileText,
  MessageSquare,
  Lock,
  ChevronRight,
  Coins,
  CreditCard,
  Edit3,
  Trash2,
  PieChart,
  RefreshCw,
  X,
  Check,
  AlertTriangle,
  ArrowRight,
  Layers,
  Save,
  UserCheck,
  DollarSign,
  Percent
} from 'lucide-react';
import api from '../../services/api';

export type RBCRole = 'member' | 'creator' | 'merchant' | 'ambassador';

interface RoleBasedDashboardProps {
  userId?: string;
  initialRole?: RBCRole;
}

export const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({
  initialRole = 'member'
}) => {
  const [activeRole, setActiveRole] = useState<RBCRole>(initialRole);
  const [profile, setProfile] = useState(() => userProfileSyncService.getProfile());

  // Modals & Feedback State
  const [isUpdateDetailsOpen, setIsUpdateDetailsOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isSpendModalOpen, setIsSpendModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit details form state
  const [editName, setEditName] = useState(profile.name);
  const [editUsername, setEditUsername] = useState(profile.username);
  const [editHeadline, setEditHeadline] = useState(profile.headline);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editLocation, setEditLocation] = useState(profile.location);
  const [editPinNumber, setEditPinNumber] = useState(profile.pinNumber);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);

  // StoreCredit Algorithm simulator state
  const [splitSimInput, setSplitSimInput] = useState<number>(1000);
  const [spendMerchant, setSpendMerchant] = useState('Marketplace Storefront');
  const [spendDescription, setSpendDescription] = useState('Digital Artwork & Sound Stem Pack');
  const [spendAmount, setSpendAmount] = useState<number>(50);
  const [isProcessingSpend, setIsProcessingSpend] = useState(false);

  // Delete account confirmation
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // StoreCredit Transactions Ledger State
  const [transactions, setTransactions] = useState([
    {
      id: 'tx-sc-101',
      type: 'EARNING_SPLIT',
      label: '25% Store Credit Split (Creator Royalties)',
      amount: 250.00,
      balanceAfter: 450.00,
      date: '2026-10-13 14:20',
      status: 'Settled'
    },
    {
      id: 'tx-sc-102',
      type: 'SPEND',
      label: 'Marketplace Purchase: Beatwave Stems Vol. 4',
      amount: -45.00,
      balanceAfter: 200.00,
      date: '2026-10-12 11:05',
      status: 'Completed'
    },
    {
      id: 'tx-sc-103',
      type: 'PROMO_GRANT',
      label: 'Onboarding Welcome Store Credit Grant',
      amount: 100.00,
      balanceAfter: 245.00,
      date: '2026-10-10 09:30',
      status: 'Settled'
    },
    {
      id: 'tx-sc-104',
      type: 'REFUND',
      label: 'Escrow Store Credit Refund: Unfulfilled Order #882',
      amount: 50.00,
      balanceAfter: 145.00,
      date: '2026-10-09 16:45',
      status: 'Refunded'
    }
  ]);

  useEffect(() => {
    const unsub = userProfileSyncService.subscribe((updated) => setProfile(updated));
    return unsub;
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open Update Account Details Modal
  const handleOpenUpdateModal = () => {
    setEditName(profile.name);
    setEditUsername(profile.username);
    setEditHeadline(profile.headline);
    setEditEmail(profile.email);
    setEditPhone(profile.phone);
    setEditLocation(profile.location);
    setEditPinNumber(profile.pinNumber);
    setEditAvatar(profile.avatar);
    setIsUpdateDetailsOpen(true);
  };

  // Save Account Details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = userProfileSyncService.updateProfile({
      name: editName.trim(),
      username: editUsername.trim().toLowerCase(),
      headline: editHeadline.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      location: editLocation.trim(),
      pinNumber: editPinNumber.trim(),
      avatar: editAvatar.trim()
    });
    setProfile(updated);
    showToast('Member account details & profile updated successfully.');
    setIsUpdateDetailsOpen(false);

    try {
      await api.put(`/admin/members/${profile.username}`, {
        name: editName.trim(),
        username: editUsername.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim()
      });
    } catch {
      // Backend sync fallback
    }
  };

  // Execute Spend Store Credit
  const handleExecuteSpend = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentBalance = profile.storeCreditBalance ?? 450;
    const amountToSpend = Math.max(0, Number(spendAmount) || 0);

    if (amountToSpend <= 0) {
      showToast('Please enter a valid amount to spend.');
      return;
    }
    if (amountToSpend > currentBalance) {
      showToast(`Insufficient Store Credit balance ($${currentBalance.toFixed(2)} available).`);
      return;
    }

    setIsProcessingSpend(true);
    try {
      userProfileSyncService.spendStoreCredit(amountToSpend, spendDescription, spendMerchant);
      const newBal = Number((currentBalance - amountToSpend).toFixed(2));
      setTransactions(prev => [
        {
          id: `tx-sc-${Date.now()}`,
          type: 'SPEND',
          label: `${spendMerchant}: ${spendDescription}`,
          amount: -amountToSpend,
          balanceAfter: newBal,
          date: 'Just now',
          status: 'Completed'
        },
        ...prev
      ]);

      await api.post('/enhanced-wallet/store-credit/spend', {
        amount: amountToSpend,
        merchant: spendMerchant,
        itemDescription: spendDescription
      }).catch(() => {});

      showToast(`Spent $${amountToSpend.toFixed(2)} Store Credit successfully at ${spendMerchant}!`);
      setIsSpendModalOpen(false);
    } catch {
      showToast('Failed to process Store Credit transaction.');
    } finally {
      setIsProcessingSpend(false);
    }
  };

  // Claim Promotional $50 Store Credit
  const handleGrantPromoCredit = () => {
    const updated = userProfileSyncService.grantStoreCredit(50, 'Member Community Promotional Grant');
    const newBal = updated.storeCreditBalance ?? 500;
    setTransactions(prev => [
      {
        id: `tx-sc-${Date.now()}`,
        type: 'PROMO_GRANT',
        label: 'Community Loyalty Promotional Grant ($50.00 USD)',
        amount: 50.00,
        balanceAfter: newBal,
        date: 'Just now',
        status: 'Settled'
      },
      ...prev
    ]);
    showToast('Granted $50.00 Store Credit to your sovereign wallet!');
  };

  // Delete Member Account Confirmation
  const handleConfirmDeleteAccount = async () => {
    if (profile.username === 'israel_protocol') {
      showToast('Security Policy Violation: Root SuperAdmin founder account cannot be deleted.');
      setIsDeleteAccountOpen(false);
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/admin/members/${profile.username}?permanent=true`).catch(() => {});
      userProfileSyncService.deleteAccount();
      showToast('Member account deleted and data purged successfully.');
      setIsDeleteAccountOpen(false);
    } catch {
      showToast('Failed to delete account.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* 1. ONBOARDING WELCOME & SOVEREIGN STATUS BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-zinc-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                alt={profile.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-orange-500/80 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full ring-2 ring-slate-950 text-white">
                <CheckCircle className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Welcome to FingerMobile, {profile.name}!
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Qualified Sovereign Onboarded
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
                @{profile.username} • Protocol Identity Active • Sovereign Enclave verified across all 6 platform clusters.
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs flex-wrap font-mono">
                <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                  PIN: #{profile.pinNumber || '749822'}
                </span>
                <span className="text-slate-300 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-lg">
                  LushPressies Quota: <strong className="text-orange-400">{profile.pinQuotaRemaining ?? 48}</strong> / {profile.pinQuotaMax ?? 50}
                </span>
                <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold">
                  <CreditCard className="w-3.5 h-3.5" />
                  Store Credit: ${(profile.storeCreditBalance ?? 450).toFixed(2)} USD
                </span>
                <span className="text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  {profile.ficBalance ?? 1250} Liquid FIC
                </span>
              </div>

              {/* Member Account Actions: Update Details & Delete Account */}
              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={handleOpenUpdateModal}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                  Update Account Details
                </button>
                <button
                  type="button"
                  onClick={() => setIsSpendModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Spend Store Credit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmText('');
                    setIsDeleteAccountOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Quick Onboarding Milestones */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl min-w-[260px] space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
              Onboarding Milestones
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Profile & Demographic</span>
                <span className="font-bold">100%</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Sovereign PIN Enclave</span>
                <span className="font-bold">Active</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400">
                <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> StoreCredit Enclave</span>
                <span className="font-bold">${(profile.storeCreditBalance ?? 450).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-amber-400">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> CES Score Calibration</span>
                <span className="font-bold">88/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST ALERT */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </span>
          <button aria-label="Close" type="button" onClick={() => setToastMessage(null)} className="text-slate-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1.5 STORECREDIT ENCLAVE & 4-PART EARNING DISTRIBUTION ENGINE */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  Member StoreCredit Algorithm & Sovereign Earning Enclave
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                    Authoritative Cluster 2 Engine
                  </span>
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  Automated 4-part cryptographic distribution across Liquid FIC, Store Credit, Sleeper Staking, and Platform Revenue.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsSpendModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
            >
              <ShoppingBag className="w-4 h-4" />
              Spend Store Credit
            </button>
            <button
              type="button"
              onClick={handleGrantPromoCredit}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Gift className="w-4 h-4 text-pink-400" />
              Claim $50 Promo Grant
            </button>
          </div>
        </div>

        {/* 4-Part Earning Architecture Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: 45% Liquid FIC */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <span className="font-bold text-orange-400">45% Liquid FIC</span>
              <Coins className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-xl font-black text-white">
              {profile.ficBalance ?? 1250} FIC
            </div>
            <div className="text-[11px] text-slate-300 font-medium">
              Directly spendable or withdrawable. Retained by member immediately.
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full w-[45%]" />
            </div>
          </div>

          {/* Card 2: 25% Store Credit */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/30 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <span className="font-bold text-emerald-400">25% Store Credit</span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-emerald-400">
              ${(profile.storeCreditBalance ?? 450).toFixed(2)} USD
            </div>
            <div className="text-[11px] text-slate-300 font-medium">
              Dedicated store credit for marketplace goods, sound stems, & gifts.
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[25%]" />
            </div>
          </div>

          {/* Card 3: 5% Sleeper Stake */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <span className="font-bold text-sky-400">5% 1-Year Sleeper Stake</span>
              <TrendingUp className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-xl font-black text-white">
              $90.00 USD
            </div>
            <div className="text-[11px] text-slate-300 font-medium">
              Compounding yield at 1.5% APY. Matures annually to sovereign vault.
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full w-[5%]" />
            </div>
          </div>

          {/* Card 4: 25% Platform Revenue */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <span className="font-bold text-purple-400">25% Platform Operations</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-black text-white">
              Protocol Fund
            </div>
            <div className="text-[11px] text-slate-300 font-medium">
              Subsidizes zero gas fees, node verification, and Guardian AI security.
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-[25%]" />
            </div>
          </div>
        </div>

        {/* Interactive Earning Split Simulator */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-400" />
                Live Earning Split Calculator & Simulator
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                Simulate how any gross earning (e.g. content sale, royalty, or tip) is algorithmically split.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200">Simulate Amount ($):</span>
              <input
                type="number"
                min="10"
                step="10"
                value={splitSimInput}
                onChange={e => setSplitSimInput(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-28 px-3 py-1.5 text-xs font-mono font-bold bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-orange-500/20">
              <span className="text-[10px] text-slate-200 font-bold block font-sans">Liquid FIC (45%)</span>
              <span className="text-sm font-bold text-orange-400">${(splitSimInput * 0.45).toFixed(2)}</span>
              <span className="text-[10px] text-slate-300 font-medium block">{(splitSimInput * 0.45 * 2).toFixed(0)} FIC Tokens</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30">
              <span className="text-[10px] text-slate-200 font-bold block font-sans">Store Credit (25%)</span>
              <span className="text-sm font-bold text-emerald-400">${(splitSimInput * 0.25).toFixed(2)}</span>
              <span className="text-[10px] text-slate-300 font-medium block">Marketplace Ready</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-500/20">
              <span className="text-[10px] text-slate-200 font-bold block font-sans">1-Yr Stake (5%)</span>
              <span className="text-sm font-bold text-sky-400">${(splitSimInput * 0.05).toFixed(2)}</span>
              <span className="text-[10px] text-slate-300 font-medium block">+1.5% APY Growth</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/20">
              <span className="text-[10px] text-slate-200 font-bold block font-sans">Platform Revenue (25%)</span>
              <span className="text-sm font-bold text-purple-400">${(splitSimInput * 0.25).toFixed(2)}</span>
              <span className="text-[10px] text-slate-300 font-medium block">Node Operations</span>
            </div>
          </div>
        </div>

        {/* Store Credit Transactions History Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Store Credit Ledger & Recent Activity
            </h3>
            <span className="text-[11px] font-mono text-slate-300">
              Total Recorded Transactions: {transactions.length}
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950/60">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-300 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Transaction / Purpose</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4 text-right">Amount ($)</th>
                  <th className="py-2.5 px-4 text-right">Balance After</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-xs">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-900/50 transition">
                    <td className="py-3 px-4 font-sans font-medium text-white">
                      {tx.label}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === 'SPEND'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : tx.type === 'EARNING_SPLIT'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-bold ${
                      tx.amount < 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {tx.amount < 0 ? `-$${Math.abs(tx.amount).toFixed(2)}` : `+$${tx.amount.toFixed(2)}`}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-200 font-bold">
                      ${tx.balanceAfter.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300 font-medium text-[11px]">
                      {tx.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. RBC ROLE-BASED NAVIGATION TABS */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            Role-Based Community (RBC) Dashboards
          </h2>
          <p className="text-xs text-slate-300 font-medium">
            Switch between qualified roles to see what each member tier sees and interacts with.
          </p>
        </div>

        {/* Role Switcher Pill Bar */}
        <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveRole('member')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeRole === 'member'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/20'
                : 'text-slate-300 font-medium hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Qualified Member
          </button>
          <button
            type="button"
            onClick={() => setActiveRole('creator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeRole === 'creator'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20'
                : 'text-slate-300 font-medium hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Verified Creator
          </button>
          <button
            type="button"
            onClick={() => setActiveRole('merchant')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeRole === 'merchant'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20'
                : 'text-slate-300 font-medium hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Merchant / Storefront
          </button>
          <button
            type="button"
            onClick={() => setActiveRole('ambassador')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeRole === 'ambassador'
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-600/20'
                : 'text-slate-300 font-medium hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Ambassador / Moderator
          </button>
        </div>
      </div>

      {/* 3. DYNAMIC ROLE DASHBOARD PANELS */}

      {/* --- PANEL A: QUALIFIED MEMBER VIEW --- */}
      {activeRole === 'member' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-300 font-bold text-xs mb-2">
                <span>Gifts Sent & Received</span>
                <Gift className="w-4 h-4 text-pink-400" />
              </div>
              <div className="text-2xl font-black text-white">34 Pressies</div>
              <span className="text-[11px] text-emerald-400 font-medium">9 Escrow Gifts Cleared</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-300 font-bold text-xs mb-2">
                <span>Hallmarks Joined</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">4 Enclaves</div>
              <span className="text-[11px] text-slate-300 font-medium">Max capacity 250,000 members</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-300 font-bold text-xs mb-2">
                <span>Forum Discussions</span>
                <MessageSquare className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white">128 Replies</div>
              <span className="text-[11px] text-emerald-400 font-medium">+14 upvotes today</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-300 font-bold text-xs mb-2">
                <span>Privacy & Presence</span>
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">Stealth Level 1</div>
              <span className="text-[11px] text-sky-400 font-medium">Biometric Passkey Enabled</span>
            </div>
          </div>

          {/* Action Clicks & Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center justify-between">
                <span>Featured Community Streams & Hallmark Feeds</span>
                <Link to="/forum" className="text-xs text-orange-400 hover:underline flex items-center gap-1">
                  View All Forums <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                      Technology & Protocol
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">
                      NexusGNN Embeddings: How Graph Neural Networks power sovereign content matching
                    </h4>
                    <p className="text-xs text-slate-300 font-medium mt-1">
                      Started by @israel_protocol • 42 comments • 18 LushPressies gifted
                    </p>
                  </div>
                  <Link to="/forum" className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shrink-0">
                    Join Thread
                  </Link>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      Beatwave Sounds
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">
                      Afro-Futurism Audio Stems & Sovereign Music Drop Session 04
                    </h4>
                    <p className="text-xs text-slate-300 font-medium mt-1">
                      Started by @beatwave_creator • 92 listeners • 320 Gems tipped
                    </p>
                  </div>
                  <Link to="/beatwave" className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shrink-0">
                    Listen Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Click Affordances */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">What You Can Click & Do</h3>
              <div className="space-y-2.5">
                <Link
                  to="/gems"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-all text-xs font-bold text-white group"
                >
                  <span className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-pink-400" />
                    Mint / Gift a LushPin
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white" />
                </Link>

                <Link
                  to="/forum"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-all text-xs font-bold text-white group"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    Start New Forum Discussion
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white" />
                </Link>

                <Link
                  to="/storefront"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-all text-xs font-bold text-white group"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    Explore Marketplace Storefronts
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white" />
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-all text-xs font-bold text-white group"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-sky-400" />
                    Manage Biometrics & Devices
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PANEL B: VERIFIED CREATOR VIEW --- */}
      {activeRole === 'creator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-300 font-bold text-xs mb-2">
                <span>Total Impressions</span>
                <Eye className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">142.8K</div>
              <span className="text-[11px] text-emerald-400 font-medium">+24% this week</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-300 font-bold text-xs mb-2">
                <span>Beatwave Royalties</span>
                <Music className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-white">$1,840.50</div>
              <span className="text-[11px] text-purple-400 font-medium">8 active licensed stems</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-300 font-bold text-xs mb-2">
                <span>Regional Tier</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">Tier 2 Regional</div>
              <span className="text-[11px] text-slate-300 font-medium">Next: Tier 1 Global (Uncapped)</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-300 font-bold text-xs mb-2">
                <span>Fan Engagement</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">8.6% Rate</div>
              <span className="text-[11px] text-emerald-400 font-medium">Top 5% on platform</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Creator Studio Tools</h3>
              <p className="text-xs text-slate-300 font-medium">Manage UGC videos, mint custom fan pins, and export royalty invoices.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link to="/beatwave" className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5">
                <Music className="w-4 h-4" /> Upload Stem Track
              </Link>
              <Link to="/ugc" className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Open UGC Canvas
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* --- PANEL C: MERCHANT / STOREFRONT VIEW --- */}
      {activeRole === 'merchant' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-300 font-bold text-xs mb-2">
                <span>Gross Merchandise Value</span>
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">$14,280</div>
              <span className="text-[11px] text-emerald-400 font-medium">18 orders pending fulfillment</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-300 font-bold text-xs mb-2">
                <span>Escrow Vault Balance</span>
                <Wallet className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">$3,450.00</div>
              <span className="text-[11px] text-slate-300 font-medium">Releasing in 48 hours</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-300 font-bold text-xs mb-2">
                <span>PayLinks Generated</span>
                <FileText className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white">48 Active</div>
              <span className="text-[11px] text-sky-400 font-medium">Multi-currency & Crypto enabled</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-300 font-bold text-xs mb-2">
                <span>Dispute & Fraud Rate</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">0.02%</div>
              <span className="text-[11px] text-emerald-400 font-medium">Guarded by STERCS fraud engine</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Storefront Actions</h3>
              <p className="text-xs text-slate-300 font-medium">Publish products, generate instant PayLinks, and configure shipping zones.</p>
            </div>
            <Link to="/storefront" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4" /> Add New Product
            </Link>
          </div>
        </div>
      )}

      {/* --- PANEL D: AMBASSADOR / MODERATOR VIEW --- */}
      {activeRole === 'ambassador' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-300 font-bold text-xs mb-2">
                <span>Flagged Queue</span>
                <FileText className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl font-black text-white">4 Items</div>
              <span className="text-[11px] text-amber-400 font-medium">Requires human arbitration</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-300 font-bold text-xs mb-2">
                <span>Hallmark Enclave Health</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white">99.4% Clean</div>
              <span className="text-[11px] text-emerald-400 font-medium">AI auto-censorship active</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-300 font-bold text-xs mb-2">
                <span>CES Score Average</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white">92.1</div>
              <span className="text-[11px] text-emerald-400 font-medium">High community trust</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-slate-300 font-bold text-xs mb-2">
                <span>Audit Logs Signed</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">1,420</div>
              <span className="text-[11px] text-slate-300 font-medium">WORM cryptographic verification</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: UPDATE MEMBER ACCOUNT DETAILS & DEMOGRAPHIC INFORMATION */}
      {isUpdateDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-800 shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">Update Member Account Details</h3>
                  <p className="text-[11px] text-slate-300 font-medium">
                    Sovereign Identity Demographic & Protocol Information
                  </p>
                </div>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setIsUpdateDetailsOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-200">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200">Username</label>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={e => setEditUsername(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-200">Headline / Bio</label>
                  <input
                    type="text"
                    value={editHeadline}
                    onChange={e => setEditHeadline(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200">Location / Region</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={e => setEditLocation(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200">Sovereign 6-Digit PIN</label>
                  <input
                    type="password"
                    maxLength={6}
                    value={editPinNumber}
                    onChange={e => setEditPinNumber(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono tracking-widest focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-200">Avatar Image URL</label>
                  <input
                    type="url"
                    value={editAvatar}
                    onChange={e => setEditAvatar(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUpdateDetailsOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DELETE MEMBER ACCOUNT DETAILS & INFORMATION */}
      {isDeleteAccountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full border border-rose-900/60 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-rose-950/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">Delete Member Account</h3>
                  <p className="text-[11px] text-slate-300 font-medium">Permanent account & data purge</p>
                </div>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setIsDeleteAccountOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {profile.username === 'israel_protocol' ? (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-sm text-amber-400">
                    <ShieldCheck className="w-4 h-4" /> Root SuperAdmin Protection Active
                  </div>
                  <p>
                    Irrevocable Root SuperAdmin founder account (@israel_protocol) is the protocol genesis root. It cannot be deleted or purged by policy.
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsDeleteAccountOpen(false)}
                      className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                    >
                      Acknowledge Protection
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="font-bold text-white">{profile.name}</div>
                    <div className="text-slate-300 font-medium font-mono">@{profile.username} &bull; {profile.email}</div>
                    <div className="text-slate-300 font-medium text-[11px]">
                      Store Credit: <span className="font-bold text-emerald-400">${(profile.storeCreditBalance ?? 450).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl text-xs text-rose-300 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Permanent Data Purge:</strong> Deleting your account will immediately revoke all biometric passkeys, liquidate sovereign enclaves, and permanently remove profile records.
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Type <span className="text-rose-400 font-mono font-black">{profile.username}</span> to confirm:
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={e => setDeleteConfirmText(e.target.value)}
                      placeholder={profile.username}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsDeleteAccountOpen(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={deleteConfirmText !== profile.username || isDeleting}
                      onClick={handleConfirmDeleteAccount}
                      className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {isDeleting ? 'Deleting...' : 'Permanently Delete My Account'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SPEND STORE CREDIT MODAL */}
      {isSpendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full border border-emerald-500/30 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-emerald-950/30">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">Spend Store Credit</h3>
                  <p className="text-[11px] text-slate-300 font-medium">Marketplace & Storefront purchasing</p>
                </div>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setIsSpendModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteSpend} className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-300 block">Available Store Credit</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    ${(profile.storeCreditBalance ?? 450).toFixed(2)} USD
                  </span>
                </div>
                <CreditCard className="w-6 h-6 text-emerald-500/50" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200">Merchant / Storefront Name</label>
                <input
                  type="text"
                  required
                  value={spendMerchant}
                  onChange={e => setSpendMerchant(e.target.value)}
                  placeholder="e.g. Beatwave Sounds Storefront"
                  className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200">Item / Service Description</label>
                <input
                  type="text"
                  required
                  value={spendDescription}
                  onChange={e => setSpendDescription(e.target.value)}
                  placeholder="e.g. Afrobeat Drum Kit & Master Track License"
                  className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200">Amount to Spend ($ USD)</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3.5 top-2 text-xs font-bold text-emerald-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={profile.storeCreditBalance ?? 450}
                    value={spendAmount}
                    onChange={e => setSpendAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-300 font-medium mt-1">
                  <span>Balance after spend: ${Math.max(0, (profile.storeCreditBalance ?? 450) - spendAmount).toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => setSpendAmount(profile.storeCreditBalance ?? 450)}
                    className="text-emerald-400 hover:underline font-bold"
                  >
                    Use Max
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSpendModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingSpend || spendAmount <= 0 || spendAmount > (profile.storeCreditBalance ?? 450)}
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  {isProcessingSpend ? 'Processing...' : `Confirm Spend ($${spendAmount.toFixed(2)})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleBasedDashboard;
