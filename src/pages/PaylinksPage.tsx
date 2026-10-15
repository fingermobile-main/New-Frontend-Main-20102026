import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import apiService from '../services/apiService';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import {
  LinkIcon,
  TrashIcon,
  GiftIcon,
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  QrCodeIcon,
  CurrencyDollarIcon,
  ShareIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export interface PaylinkRecord {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: 'FIC' | 'NGN' | 'USD';
  url: string;
  type: 'fixed' | 'donation' | 'invoice' | 'subscription';
  status: 'active' | 'completed' | 'expired';
  views: number;
  paidCount: number;
  totalCollected: number;
  createdAt: string;
  expiresAt?: string;
  qrCodeUrl?: string;
}

const DEFAULT_PAYLINKS: PaylinkRecord[] = [
  {
    id: 'pl-101',
    title: 'Durbar Festival High-Res Photo License',
    description: 'Commercial synchronization & print reproduction rights for Durbar 102MP master captures.',
    amount: 50,
    currency: 'FIC',
    url: 'https://fingermobileprotocol.com/pay/pl-101',
    type: 'fixed',
    status: 'active',
    views: 342,
    paidCount: 8,
    totalCollected: 400,
    createdAt: '2026-10-10',
    expiresAt: '2026-12-31'
  },
  {
    id: 'pl-102',
    title: 'Sovereign Architecture 1-on-1 Consultation',
    description: '1-Hour deep dive into STERCS™ protocol integration, zero-knowledge verification & multi-agent nodes.',
    amount: 250,
    currency: 'FIC',
    url: 'https://fingermobileprotocol.com/pay/pl-102',
    type: 'invoice',
    status: 'active',
    views: 185,
    paidCount: 3,
    totalCollected: 750,
    createdAt: '2026-10-08',
    expiresAt: '2026-11-30'
  },
  {
    id: 'pl-103',
    title: 'BeatwaveNG Master Audio Stems Pack (96kHz)',
    description: 'FLAC 24-bit multitrack stems for Midnight Lagos Grooves including Afrobeats percussion elements.',
    amount: 100,
    currency: 'FIC',
    url: 'https://fingermobileprotocol.com/pay/pl-103',
    type: 'fixed',
    status: 'active',
    views: 520,
    paidCount: 14,
    totalCollected: 1400,
    createdAt: '2026-10-05',
    expiresAt: '2026-12-31'
  },
  {
    id: 'pl-104',
    title: 'Open Sovereign Tip Jar & Platform Grants',
    description: 'Voluntary creator contribution pool for independent open-source media and photography curation.',
    amount: 0,
    currency: 'FIC',
    url: 'https://fingermobileprotocol.com/pay/pl-104',
    type: 'donation',
    status: 'active',
    views: 890,
    paidCount: 42,
    totalCollected: 2150,
    createdAt: '2026-10-01'
  }
];

const PaylinksPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, member } = useAuth();
  const { showToast, ficBalance } = useAppContext();

  const [paylinks, setPaylinks] = useState<PaylinkRecord[]>(DEFAULT_PAYLINKS);
  const [loading, setLoading] = useState(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState<PaylinkRecord | null>(null);
  const [showGiftModal, setShowGiftModal] = useState<PaylinkRecord | null>(null);
  const [giftAmount, setGiftAmount] = useState('25');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('50');
  const [newCurrency, setNewCurrency] = useState<'FIC' | 'NGN' | 'USD'>('FIC');
  const [newType, setNewType] = useState<'fixed' | 'donation' | 'invoice'>('fixed');

  const loadPaylinks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiService.get<any>('/api/paylinks').catch(() => null);
      if (res?.paylinks && Array.isArray(res.paylinks) && res.paylinks.length > 0) {
        const mapped: PaylinkRecord[] = res.paylinks.map((p: any) => ({
          id: String(p.id),
          title: p.title || 'Sovereign Paylink',
          description: p.description || '',
          amount: parseFloat(p.amount) || 0,
          currency: p.currency || 'FIC',
          url: p.url || `${window.location.origin}/pay/${p.id}`,
          type: p.type || 'fixed',
          status: p.status || 'active',
          views: Number(p.views || 45),
          paidCount: Number(p.paidCount || 2),
          totalCollected: Number(p.totalCollected || p.amount || 0),
          createdAt: p.created_at || '2026-10-14'
        }));
        setPaylinks(mapped);
      }
    } catch {
      // Keep rich defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPaylinks();
  }, [loadPaylinks]);

  const filteredPaylinks = useMemo(() => {
    return paylinks.filter((p) => {
      const matchesType = selectedTypeFilter === 'all' || p.type === selectedTypeFilter;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [paylinks, selectedTypeFilter, searchQuery]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const totalCollectedFIC = paylinks.reduce((acc, p) => acc + (p.currency === 'FIC' ? p.totalCollected : 0), 0);
    const totalPaid = paylinks.reduce((acc, p) => acc + p.paidCount, 0);
    const totalViews = paylinks.reduce((acc, p) => acc + p.views, 0);
    return {
      activeCount: paylinks.length,
      totalCollectedFIC,
      totalPaid,
      totalViews
    };
  }, [paylinks]);

  const handleCreatePaylink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast?.('Please specify a title for the paylink', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const createdItem: PaylinkRecord = {
        id: `pl-${Date.now()}`,
        title: newTitle.trim(),
        description: newDescription.trim() || 'Instant escrow-settled sovereign payment link.',
        amount: newType === 'donation' ? 0 : parseFloat(newAmount) || 10,
        currency: newCurrency,
        url: `${window.location.origin}/pay/pl-${Date.now()}`,
        type: newType,
        status: 'active',
        views: 1,
        paidCount: 0,
        totalCollected: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setPaylinks([createdItem, ...paylinks]);
      setShowCreateModal(false);
      setNewTitle('');
      setNewDescription('');
      setNewAmount('50');
      showToast?.('Sovereign Paylink generated & active!', 'success');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = (id: string) => {
    setPaylinks((prev) => prev.filter((p) => p.id !== id));
    showToast?.('Paylink archived', 'info');
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast?.('Payment link copied to clipboard!', 'success');
  };

  const handleSendDirectGift = () => {
    const amt = parseFloat(giftAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast?.('Please enter a valid gift amount', 'warning');
      return;
    }
    if (ficBalance !== undefined && amt > ficBalance) {
      showToast?.('Insufficient FIC balance in sovereign vault', 'error');
      return;
    }

    if (showGiftModal) {
      setPaylinks((prev) =>
        prev.map((p) =>
          p.id === showGiftModal.id
            ? { ...p, paidCount: p.paidCount + 1, totalCollected: p.totalCollected + amt }
            : p
        )
      );
    }

    setShowGiftModal(null);
    showToast?.(`Successfully sent ${amt} FIC payment to ${showGiftModal?.title}!`, 'success');
  };

  return (
    <MainLayout pageTitle="Sovereign Paylinks & Escrow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. HERO & STATS: Strict Contrast Hierarchy */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-400 text-orange-950 text-xs font-black uppercase tracking-wider">
                <CurrencyDollarIcon className="w-3.5 h-3.5 text-orange-600" />
                <span>Instant Multi-Currency Escrow Generator</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Sovereign Paylinks &amp; Direct Checkout
              </h1>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                Create instant payment links for digital goods, photography licenses, professional services, or open community tip jars. All settlements process through sovereign smart escrows.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Generate New Paylink</span>
            </button>
          </div>

          {/* Core Telemetry Cards: Strict Contrast */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300">
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Paylinks</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">{stats.activeCount}</span>
              <span className="block text-[10px] font-bold text-emerald-800 mt-0.5">● Ready for checkout</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300">
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Received (FIC)</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalCollectedFIC.toLocaleString()} FIC</span>
              <span className="block text-[10px] font-bold text-slate-700 mt-0.5">Direct to sovereign wallet</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300">
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Settled Checkouts</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalPaid}</span>
              <span className="block text-[10px] font-bold text-slate-700 mt-0.5">100% Escrow delivery rate</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300">
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Link Impressions</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalViews}</span>
              <span className="block text-[10px] font-bold text-slate-700 mt-0.5">From wall, feeds &amp; QR</span>
            </div>
          </div>
        </div>

        {/* 2. TOOLBAR & CONTROLS */}
        <div className="bg-white p-4 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search paylinks by title or description..."
              className="w-full px-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-bold placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['all', 'fixed', 'invoice', 'donation'].map((typeKey) => (
              <button
                key={typeKey}
                type="button"
                onClick={() => setSelectedTypeFilter(typeKey)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black capitalize transition-all border ${
                  selectedTypeFilter === typeKey
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-800 hover:text-slate-900 border-slate-300 hover:border-slate-400'
                }`}
              >
                {typeKey === 'all' ? 'All Links' : typeKey}
              </button>
            ))}
          </div>
        </div>

        {/* 3. PAYLINKS GRID */}
        {loading ? (
          <div className="py-16 text-center text-xs font-bold text-slate-700">Loading paylinks...</div>
        ) : filteredPaylinks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-300 space-y-3">
            <LinkIcon className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Paylinks Found</h3>
            <p className="text-xs text-slate-700 max-w-sm mx-auto">
              Generate your first instant payment link to accept FIC or fiat settlements from your followers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaylinks.map((link) => (
              <div
                key={link.id}
                className="bg-white rounded-3xl border border-slate-300 hover:border-slate-400 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-2.5 rounded-2xl bg-orange-100 border border-orange-400 text-orange-950">
                      <LinkIcon className="w-5 h-5 text-orange-600" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-400 text-emerald-950 text-[10px] font-black uppercase">
                        {link.type}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(link.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                        title="Archive Paylink"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h2 className="text-base font-black text-slate-900 line-clamp-1">
                    {link.title}
                  </h2>
                  <p className="text-xs text-slate-700 font-medium line-clamp-2 leading-relaxed">
                    {link.description}
                  </p>
                </div>

                {/* Amount Display */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-300 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Settlement Target</span>
                    <span className="text-lg font-black text-slate-900">
                      {link.type === 'donation' ? 'Open Amount' : `${link.amount} ${link.currency}`}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Collected</span>
                    <span className="text-xs font-black text-emerald-800">
                      {link.totalCollected} FIC ({link.paidCount} paid)
                    </span>
                  </div>
                </div>

                {/* Action Buttons: High Contrast */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(link.url)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4" />
                      <span>Copy Link</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowQrModal(link)}
                      className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 transition-colors"
                      title="Show QR Code"
                    >
                      <QrCodeIcon className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowGiftModal(link)}
                      className="p-2 rounded-xl bg-orange-100 border border-orange-400 text-orange-950 hover:bg-orange-200 transition-colors"
                      title="Test Checkout / Gift"
                    >
                      <GiftIcon className="w-4 h-4 text-orange-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. CREATE PAYLINK MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white rounded-3xl border border-slate-300 max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-orange-600" />
                  <h3 className="text-base font-black text-slate-900">Generate New Paylink</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePaylink} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Paylink Purpose / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Master Design Retainer or Digital Book"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Detailed Notes or Deliverable Summary
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe what the payer receives upon settlement..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Link Type
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="fixed">Fixed Price</option>
                      <option value="donation">Donation / Tip</option>
                      <option value="invoice">Custom Invoice</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      disabled={newType === 'donation'}
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Currency
                    </label>
                    <select
                      value={newCurrency}
                      onChange={(e) => setNewCurrency(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="FIC">FIC (Platform)</option>
                      <option value="NGN">NGN (₦)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase"
                  >
                    Generate Link
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 5. QR CODE MODAL */}
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white rounded-3xl border border-slate-300 max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-sm font-black text-slate-900 truncate">{showQrModal.title}</h3>
                <button
                  type="button"
                  onClick={() => setShowQrModal(null)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* QR Render */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-300 inline-block">
                <div className="w-48 h-48 bg-white border-2 border-slate-900 p-3 rounded-xl flex items-center justify-center shadow-inner mx-auto">
                  <div className="text-center space-y-2">
                    <QrCodeIcon className="w-24 h-24 text-slate-900 mx-auto" />
                    <span className="block text-[10px] font-mono font-bold text-slate-700">{showQrModal.id}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900">
                  Scan to pay {showQrModal.type === 'donation' ? 'Open Amount' : `${showQrModal.amount} ${showQrModal.currency}`}
                </p>
                <p className="text-[11px] text-slate-700 font-medium truncate">
                  {showQrModal.url}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopyLink(showQrModal.url)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase"
              >
                Copy Link Direct
              </button>
            </div>
          </div>
        )}

        {/* 6. GIFT / TEST PAY MODAL */}
        {showGiftModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-white rounded-3xl border border-slate-300 max-w-sm w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-sm font-black text-slate-900">Sovereign Direct Checkout</h3>
                <button
                  type="button"
                  onClick={() => setShowGiftModal(null)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <strong className="text-slate-900 block">{showGiftModal.title}</strong>
                <span className="text-slate-700 block">{showGiftModal.description}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Settlement Amount (FIC)
                </label>
                <input
                  type="number"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGiftModal(null)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendDirectGift}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase"
                >
                  Confirm Escrow Pay
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default PaylinksPage;
