import React, { useState, useEffect } from 'react';
import {
  GiftIcon,
  SparklesIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import apiService from '../../services/apiService';
import { useAppContext } from '../../contexts/AppContext';

interface MemberRecipient {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

interface GiftTier {
  id: string;
  name: string;
  icon: string;
  priceFic: number;
  description: string;
  effect: 'confetti' | 'neon' | 'fireworks' | 'spark';
  gradient: string;
}

const GIFT_TIERS: GiftTier[] = [
  {
    id: 'rose',
    name: 'Lush Red Rose',
    icon: '🌹',
    priceFic: 5,
    description: 'A classic token of appreciation & creative spark',
    effect: 'spark',
    gradient: 'from-rose-500 to-pink-600'
  },
  {
    id: 'frequency',
    name: 'Binaural Beatwave Spark',
    icon: '⚡',
    priceFic: 25,
    description: 'Empowers audio & video creators with high resonance',
    effect: 'neon',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 'diamond',
    name: 'Diamond Hallmark',
    icon: '💎',
    priceFic: 50,
    description: 'Verifiable on-chain hallmark of excellence',
    effect: 'fireworks',
    gradient: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'rocket',
    name: 'Viral Rocket Boost',
    icon: '🚀',
    priceFic: 100,
    description: 'Boosts creator content across newsfeed & publicitee',
    effect: 'confetti',
    gradient: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'crown',
    name: 'Royal Sovereign Crown',
    icon: '👑',
    priceFic: 250,
    description: 'Elite recognition for top network builders',
    effect: 'fireworks',
    gradient: 'from-amber-400 to-yellow-600'
  }
];

const AdvancedGiftingEngine: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [recipients, setRecipients] = useState<MemberRecipient[]>([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('');
  const [selectedGift, setSelectedGift] = useState<GiftTier>(GIFT_TIERS[0]);
  const [customAmount, setCustomAmount] = useState<number>(GIFT_TIERS[0].priceFic);
  const [giftNote, setGiftNote] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastReceipt, setLastReceipt] = useState<{
    txId: string;
    recipientName: string;
    amount: number;
    giftName: string;
    timestamp: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchRecipients = async () => {
      try {
        const res = await apiService.get('/members');
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const list = res.data.map((m: any, idx: number) => ({
            id: String(m.id || idx + 1),
            name: m.fullName || m.username || `Creator #${idx + 1}`,
            username: m.username || `creator_${idx + 1}`,
            avatarUrl: m.avatarUrl,
            isVerified: Boolean(m.isVerified)
          }));
          setRecipients(list);
          setSelectedRecipientId(list[0].id);
        } else if (isMounted) {
          // Fallback recipients
          const defaults = [
            { id: '4', name: 'Super Moderator', username: 'moderator', isVerified: true },
            { id: '1', name: 'Alex Johnson', username: 'alex_j', isVerified: true },
            { id: '2', name: 'BeatwaveNG Official', username: 'beatwave', isVerified: true }
          ];
          setRecipients(defaults);
          setSelectedRecipientId(defaults[0].id);
        }
      } catch {
        if (isMounted) {
          const defaults = [
            { id: '4', name: 'Super Moderator', username: 'moderator', isVerified: true },
            { id: '1', name: 'Alex Johnson', username: 'alex_j', isVerified: true }
          ];
          setRecipients(defaults);
          setSelectedRecipientId(defaults[0].id);
        }
      }
    };
    fetchRecipients();
    return () => { isMounted = false; };
  }, []);

  const handleSelectTier = (tier: GiftTier) => {
    setSelectedGift(tier);
    setCustomAmount(tier.priceFic);
  };

  const handleSendGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipientId) {
      showToast('Please select a recipient', 'error');
      return;
    }
    if (customAmount <= 0) {
      showToast('Please enter a valid gift amount', 'error');
      return;
    }
    if (customAmount > ficBalance) {
      showToast('Insufficient FIC balance in wallet', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const recipient = recipients.find(r => r.id === selectedRecipientId);
      const note = giftNote.trim()
        ? `[${selectedGift.name}] ${giftNote.trim()}`
        : `Sent you a ${selectedGift.name}!`;

      await apiService.post('/wallet/transfer', {
        recipientId: selectedRecipientId,
        amount: customAmount,
        currency: 'FIC',
        note: isAnonymous ? `(Anonymous) ${note}` : note
      });

      const receipt = {
        txId: `TX-GIFT-${Date.now().toString(36).toUpperCase()}`,
        recipientName: recipient?.name || 'Creator',
        amount: customAmount,
        giftName: selectedGift.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setLastReceipt(receipt);
      setGiftNote('');
      showToast(`Successfully sent ${selectedGift.name} to ${recipient?.name || 'Creator'}!`, 'success');
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to dispatch gift';
      showToast(errMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
              <GiftIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Interactive Gifting Console</h2>
              <p className="text-xs text-purple-100 mt-0.5">
                Real-time protocol micro-transfers with animated effects &amp; instant settlement
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-xs font-semibold">
            <BoltIcon className="w-4 h-4 text-amber-300" />
            <span>Instant Finality</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSendGift} className="p-6 space-y-6">
        {/* Recipient Picker */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
            <UserGroupIcon className="w-4 h-4 text-purple-600" />
            Select Recipient
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recipients.map((recipient) => {
              const isSelected = selectedRecipientId === recipient.id;
              return (
                <button
                  type="button"
                  key={recipient.id}
                  onClick={() => setSelectedRecipientId(recipient.id)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-2 ring-purple-400'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {recipient.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate flex items-center gap-1">
                      {recipient.name}
                      {recipient.isVerified && (
                        <CheckCircleIcon className="w-4 h-4 text-blue-500 inline flex-shrink-0" />
                      )}
                    </p>
                    <p className="text-xs text-gray-500 truncate">@{recipient.username}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gift Catalog */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 text-pink-600" />
            Choose Virtual Gift
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {GIFT_TIERS.map((tier) => {
              const isSelected = selectedGift.id === tier.id;
              return (
                <button
                  type="button"
                  key={tier.id}
                  onClick={() => handleSelectTier(tier)}
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                    isSelected
                      ? 'border-pink-600 bg-pink-50/70 shadow-md ring-2 ring-pink-400 scale-[1.02]'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-3xl mb-2">{tier.icon}</span>
                  <p className="text-xs font-bold text-gray-900 mb-1 leading-tight">{tier.name}</p>
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-800">
                    {tier.priceFic} FIC
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gift Customization & Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CurrencyDollarIcon className="w-4 h-4 text-emerald-600" />
              Gift Value (FIC)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="0.5"
                value={customAmount}
                onChange={(e) => setCustomAmount(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full pl-4 pr-16 py-2.5 border border-gray-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 border-slate-300 bg-white placeholder:text-slate-400 font-mono"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-700">FIC</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Wallet Balance: <span className="font-semibold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Personalized Note / Shouting
            </label>
            <input
              type="text"
              value={giftNote}
              onChange={(e) => setGiftNote(e.target.value)}
              placeholder="e.g. Loved your latest beat session on FingerMobile!"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Privacy Toggle & Dispatch */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-600">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded border-gray-300 text-slate-900 focus:ring-purple-500 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
            />
            <span>Send as Anonymous Admirer / Supporter</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-bold rounded-xl shadow-md hover:opacity-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Dispatching Gift...</span>
            ) : (
              <>
                <GiftIcon className="w-5 h-5" />
                <span>Send {selectedGift.name} ({customAmount} FIC)</span>
              </>
            )}
          </button>
        </div>

        {/* Receipt Callout */}
        {lastReceipt && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 animate-in fade-in">
            <CheckCircleIcon className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <p className="font-bold text-emerald-900 text-sm">Gift Successfully Dispatched!</p>
              <p className="text-emerald-700 mt-0.5">
                Sent <strong>{lastReceipt.amount} FIC</strong> ({lastReceipt.giftName}) to <strong>{lastReceipt.recipientName}</strong> at {lastReceipt.timestamp}.
              </p>
              <p className="font-mono text-emerald-600 text-[10px] mt-1">Receipt ID: {lastReceipt.txId}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdvancedGiftingEngine;
