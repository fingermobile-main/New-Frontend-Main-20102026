import React, { useState, useCallback, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useFingerLux } from '../hooks/useFingerLux';
import type { BookingCategory } from '../types';
import { FingerLuxIcon, GiftIcon, LinkIcon, UserCircleIcon, ArrowRightIcon, ShareIcon } from '../icons';
import MainLayout from '../components/layout/MainLayout';
import SocialEmbedModal from '../components/commerce/SocialEmbedModal';

/*
 * FingerMobile Protocol™ - FingerLux Luxury Rentals & Hospitality Module
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms.
 */

// --- Domain Interface Mappings ---
export interface FingerLuxCategory extends BookingCategory {
  price?: number;
  image?: string;
  features?: string[];
  pmsStatus?: string;
}

export type LuxCurrency = 'FIC' | 'USD' | 'EUR' | 'GBP' | 'NGN';

const CURRENCY_CONFIG: Record<LuxCurrency, { rate: number; symbol: string; label: string }> = {
  FIC: { rate: 1, symbol: 'FIC', label: 'FIC Token' },
  USD: { rate: 1, symbol: '$', label: 'USD ($)' },
  EUR: { rate: 0.92, symbol: '€', label: 'EUR (€)' },
  GBP: { rate: 0.79, symbol: '£', label: 'GBP (£)' },
  NGN: { rate: 1500, symbol: '₦', label: 'NGN (₦)' }
};

export interface AddOnOption {
  id: string;
  name: string;
  description: string;
  priceInFic: number;
  icon: string;
}

const LUXURY_ADDONS: AddOnOption[] = [
  {
    id: 'shuttle',
    name: 'VIP Chauffeur Airport Shuttle',
    description: 'Armored Maybach or Rolls-Royce airport terminal transfer with protocol escort',
    priceInFic: 350,
    icon: '🚘'
  },
  {
    id: 'spa',
    name: 'Private Spa & Wellness Rejuvenation',
    description: 'Private 3-hour hydrotherapy, custom aromatherapy & master restorative massage',
    priceInFic: 200,
    icon: '✨'
  },
  {
    id: 'suite_upgrade',
    name: 'Executive Panoramic Suite Upgrade',
    description: 'Guaranteed top-floor skyline / direct oceanfront panorama with private terrace',
    priceInFic: 500,
    icon: '🌆'
  },
  {
    id: 'butler',
    name: '24/7 Dedicated Butler & Protocol Security',
    description: 'Personalized private butler service and licensed security detail',
    priceInFic: 400,
    icon: '🛡️'
  }
];

const CURATED_LUXURY_FALLBACKS: FingerLuxCategory[] = [
  {
    id: 'sovereign-penthouse',
    name: 'The Sovereign Presidential Penthouse',
    description: 'Two-story private rooftop enclave with 360° skyline panoramic views, private helipad landing clearance, and glass infinity pool.',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    features: ['Skyline Infinity Pool', '24/7 Butler Service', 'Helipad Access', 'Michelin In-Suite Dining'],
    pmsStatus: 'Opera PMS Synced • 1 Suite Available'
  },
  {
    id: 'rolls-royce-phantom',
    name: 'Rolls-Royce Phantom VIII Extended',
    description: 'Handcrafted bespoke luxury limousine featuring Starlight Headliner, rear entertainment theater, and armored glass chassis.',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80',
    features: ['Chauffeur Included', 'Starlight Headliner', 'Champagne Cooler', 'Armored Chassis'],
    pmsStatus: 'Fleet PMS Live • Instant Dispatch'
  },
  {
    id: 'azure-ocean-villa',
    name: 'The Azure Oceanfront Villa & Beach',
    description: 'Secluded beachfront compound with private white-sand beach access, deep-water yacht mooring dock, and infinity horizon terrace.',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80',
    features: ['Private Beach Access', 'Yacht Mooring Dock', 'Private Master Chef', 'Open-Air Spa Pavilion'],
    pmsStatus: 'Amadeus CRS Live • Available for Check-in'
  },
  {
    id: 'gulfstream-charter',
    name: 'Gulfstream G650ER Global Charter',
    description: 'Ultra-long-range intercontinental private jet charter connecting global financial and luxury capitals with zero-stop clearance.',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&auto=format&fit=crop&q=80',
    features: ['Intercontinental Range', 'Private Master Bed', 'Ka-band Satcom Wi-Fi', 'VIP Airport Fast-track'],
    pmsStatus: 'Aviation CRS Synced • Runway Ready'
  }
];

// --- Subcomponent: Decoupled Luxury Booking Card ---
/* eslint-disable no-unused-vars */
interface BookingCardProps {
  category: FingerLuxCategory;
  isProcessing: boolean;
  currency: LuxCurrency;
  formatPrice: (amountInFic: number) => string;
  onBook: (category: FingerLuxCategory) => void;
  onOpenGift: (category: FingerLuxCategory) => void;
  onOpenPaylink: (category: FingerLuxCategory) => void;
  onEmbed: (category: FingerLuxCategory) => void;
}
/* eslint-enable no-unused-vars */

const BookingCard: React.FC<BookingCardProps> = React.memo(({
  category,
  isProcessing,
  formatPrice,
  onBook,
  onOpenGift,
  onOpenPaylink,
  onEmbed
}) => {
  const handleBookClick = useCallback(() => onBook(category), [category, onBook]);
  const handleGiftClick = useCallback(() => onOpenGift(category), [category, onOpenGift]);
  const handlePaylinkClick = useCallback(() => onOpenPaylink(category), [category, onOpenPaylink]);
  const handleEmbedClick = useCallback(() => onEmbed(category), [category, onEmbed]);

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 to-indigo-950 text-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border border-indigo-800/40 flex flex-col justify-between">
      <div>
        <div
          className="h-64 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${category.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/95 via-indigo-950/40 to-transparent"></div>

          {/* PMS / CRS Live Status Badge */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 border border-white/20 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{category.pmsStatus || 'PMS Synced • Verified Live'}</span>
          </div>

          {category.icon && (
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
              <span className="text-xl leading-none block">{category.icon}</span>
            </div>
          )}
        </div>

        <div className="p-6 relative">
          <div className="flex justify-between items-start gap-4 mb-3">
            <div>
              <h3 className="text-xl font-bold tracking-tight mb-1">{category.name || 'Signature Experience'}</h3>
              <p className="text-xs text-indigo-200/70 line-clamp-2 leading-relaxed">{category.description || 'Exclusive luxury reservation on FingerMobile Protocol.'}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xl font-extrabold text-amber-400 block">
                {formatPrice(category.price ?? 1000)}
              </span>
              <span className="text-[10px] text-indigo-300 block uppercase tracking-wider font-semibold">
                ≈ {(category.price ?? 1000).toLocaleString()} FIC
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[24px] mb-4">
            {category.features?.map((feature, idx) => (
              <span key={idx} className="text-[11px] bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md text-indigo-200">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <div className="flex gap-2">
          <button
            onClick={handleBookClick}
            disabled={isProcessing}
            className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-indigo-950 font-black text-xs uppercase tracking-wider rounded-xl transition duration-150 disabled:opacity-50 shadow-sm"
          >
            {isProcessing ? 'Processing...' : 'Book & Customize'}
          </button>

          <button
            onClick={handleEmbedClick}
            className="p-2.5 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition duration-150"
            title="Share & Embed across Protocol"
          >
            <ShareIcon className="w-5 h-5" />
          </button>

          <button
            onClick={handleGiftClick}
            className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl hover:bg-amber-500 hover:text-white transition duration-150"
            title="Send Experience as Gift"
          >
            <GiftIcon className="w-5 h-5" />
          </button>

          <button
            onClick={handlePaylinkClick}
            className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-white transition duration-150"
            title="Create Escrow Paylink"
          >
            <LinkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
});

BookingCard.displayName = 'BookingCard';

// --- Main Container Page Component ---
const FingerLuxPage: React.FC = () => {
  const {
    categories: filteredCategories,
    bookings: fingerLuxBookings,
    loading,
    error,
    refreshData
  } = useFingerLux();

  const { ficBalance, showToast } = useAppContext();

  // Multi-Currency Selection State
  const [selectedCurrency, setSelectedCurrency] = useState<LuxCurrency>('FIC');

  // Modals & Action States
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FingerLuxCategory | null>(null);
  const [embedCategory, setEmbedCategory] = useState<FingerLuxCategory | null>(null);

  // Dynamic Packaging States
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['shuttle']);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'fic' | 'wallet' | 'concierge'>('fic');

  const [giftAmount, setGiftAmount] = useState('');
  const [paylinkAmount, setPaylinkAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Currency Converter Formatter
  const formatPrice = useCallback((amountInFic: number): string => {
    const config = CURRENCY_CONFIG[selectedCurrency];
    const converted = amountInFic * config.rate;
    if (selectedCurrency === 'FIC') {
      return `${converted.toLocaleString()} FIC`;
    }
    return `${config.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }, [selectedCurrency]);

  // Combined Active Categories
  const activeCategories: FingerLuxCategory[] = useMemo(() => {
    if (filteredCategories && filteredCategories.length > 0) {
      return filteredCategories.map((cat, idx) => ({
        ...cat,
        price: (cat as any)?.price || (CURATED_LUXURY_FALLBACKS[idx % CURATED_LUXURY_FALLBACKS.length].price),
        image: (cat as any)?.image || (CURATED_LUXURY_FALLBACKS[idx % CURATED_LUXURY_FALLBACKS.length].image),
        features: (cat as any)?.features || (CURATED_LUXURY_FALLBACKS[idx % CURATED_LUXURY_FALLBACKS.length].features),
        pmsStatus: (cat as any)?.pmsStatus || 'Opera PMS Synced • Live'
      }));
    }
    return CURATED_LUXURY_FALLBACKS;
  }, [filteredCategories]);

  // Open Dynamic Packaging Drawer
  const handleOpenBooking = useCallback((category: FingerLuxCategory) => {
    setSelectedCategory(category);
    setShowBookingModal(true);
  }, []);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Grand Total Calculation
  const calculatedGrandTotalInFic = useMemo(() => {
    if (!selectedCategory) return 0;
    const base = selectedCategory.price ?? 1000;
    const addonsTotal = selectedAddons.reduce((acc, id) => {
      const match = LUXURY_ADDONS.find((a) => a.id === id);
      return acc + (match ? match.priceInFic : 0);
    }, 0);
    return base + addonsTotal;
  }, [selectedCategory, selectedAddons]);

  // Confirm Final Booking
  const handleConfirmReservation = async () => {
    if (!selectedCategory) return;
    if (selectedPaymentMethod === 'fic' && ficBalance < calculatedGrandTotalInFic) {
      showToast(`Insufficient FIC balance. Required: ${calculatedGrandTotalInFic} FIC`, 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast(`Successfully confirmed reservation for ${selectedCategory.name}! PMS itinerary dispatched.`, 'success');
      setShowBookingModal(false);
    } catch {
      showToast('Failed to process luxury booking', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const onOpenGiftModal = useCallback((category: FingerLuxCategory) => {
    setSelectedCategory(category);
    setShowGiftModal(true);
  }, []);

  const onOpenPaylinkModal = useCallback((category: FingerLuxCategory) => {
    setSelectedCategory(category);
    setShowPaylinkModal(true);
  }, []);

  const onOpenEmbedModal = useCallback((category: FingerLuxCategory) => {
    setEmbedCategory(category);
  }, []);

  const handleSendGift = async () => {
    if (!selectedCategory) return;
    const amount = parseFloat(giftAmount);
    if (isNaN(amount) || amount <= 0 || amount > ficBalance) {
      showToast('Please enter a valid allocation amount', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      showToast('Gift dispatch link generated successfully', 'success');
      setGiftAmount('');
      setShowGiftModal(false);
    } catch {
      showToast('Failed to process asset transfer', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreatePaylink = async () => {
    if (!selectedCategory) return;
    const amount = parseFloat(paylinkAmount);
    if (isNaN(amount) || amount <= 0 || amount > ficBalance) {
      showToast('Please enter a valid checkout token value', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      showToast('FingerLux Paylink connection established', 'success');
      setPaylinkAmount('');
      setShowPaylinkModal(false);
    } catch {
      showToast('Failed to secure validation handshake', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="text-gray-500 font-medium text-sm animate-pulse">Loading luxury profiles & PMS feeds...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen bg-gray-50 px-4">
          <div className="bg-white border border-gray-200 text-gray-800 p-6 rounded-2xl shadow-sm max-w-md w-full text-center" role="alert">
            <strong className="block font-bold text-lg text-red-600 mb-1">Execution Interrupted</strong>
            <span className="block text-sm text-gray-600 mb-4">{error}</span>
            <button
              className="w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-black transition duration-150"
              onClick={refreshData}
            >
              Retry Pipeline Fetch
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-up">
        {/* Header with Title and Multi-Currency Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-gray-100 gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-md">
              <FingerLuxIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">FingerLux</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                  Prestige Tier
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-0.5">
                Signature luxury hospitality, exotic rentals & private charters on FingerMobile Protocol™
              </p>
            </div>
          </div>

          {/* Multi-Currency Localization Selector */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2">Currency:</span>
            {(['FIC', 'USD', 'EUR', 'GBP', 'NGN'] as LuxCurrency[]).map((cur) => (
              <button
                key={cur}
                type="button"
                onClick={() => setSelectedCurrency(cur)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  selectedCurrency === cur
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>

        {/* PMS Live Status Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white border border-indigo-900/60 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-2">
                Real-Time PMS / Amadeus CRS Handshake Synchronized
              </p>
              <p className="text-[11px] text-indigo-200/70">
                Direct live inventory links with global luxury suites, private aviation hangars & armored motor pools.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-indigo-200">
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/10 font-medium">
              Dynamic Packaging Enabled
            </span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Luxury Rentals & Experiences</h2>
              <span className="text-xs font-semibold text-gray-500">{activeCategories.length} Curated Offerings</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeCategories.map((category) => (
                <BookingCard
                  key={category.id}
                  category={category}
                  isProcessing={isProcessing}
                  currency={selectedCurrency}
                  formatPrice={formatPrice}
                  onBook={handleOpenBooking}
                  onOpenGift={onOpenGiftModal}
                  onOpenPaylink={onOpenPaylinkModal}
                  onEmbed={onOpenEmbedModal}
                />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                <UserCircleIcon className="h-4 w-4 text-indigo-500 mr-2" />
                Your Identity Balance
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-black text-gray-900 block">{ficBalance.toFixed(2)} FIC</span>
                  <span className="text-xs font-bold text-gray-400 block mt-0.5">
                    ≈ {formatPrice(ficBalance)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Redirecting to Protocol FIC liquidity gateway...', 'info')}
                  className="text-xs bg-indigo-600 text-white font-bold px-3.5 py-2 rounded-xl hover:bg-indigo-700 shadow-sm transition duration-150"
                >
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { label: 'Browse Luxury Catalog', action: () => refreshData() },
                  { label: 'View PMS Itineraries', action: () => showToast('Opening PMS Reservation Desk...', 'info') },
                  { label: 'Request VIP Concierge', action: () => showToast('Connecting to 24/7 FingerLux Concierge...', 'success') }
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-indigo-50/50 text-gray-800 hover:text-indigo-900 font-bold text-xs rounded-xl transition duration-150 border border-transparent hover:border-indigo-100/40"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6">
              <h2 className="text-xs font-black text-amber-900 tracking-wider uppercase mb-3">Prestige Benefits Tier</h2>
              <ul className="space-y-2 text-xs font-semibold text-amber-800">
                {[
                  'Priority Booking & Zero-Wait Fast Track',
                  'Exclusive Global Vault & Penthouse Keys',
                  'Dedicated Protocol Concierge Handler',
                  '1-Click Cross-Module Social Embedding'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-amber-500">✦</span> {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Transactions Timeline */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Recent Bookings Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(fingerLuxBookings && fingerLuxBookings.length > 0 ? fingerLuxBookings.slice(0, 3) : [
              {
                id: 'lux-1',
                title: 'The Sovereign Presidential Penthouse',
                description: '3 Nights VIP stay with private chef and helipad clearance',
                booking_date: new Date().toISOString()
              },
              {
                id: 'lux-2',
                title: 'Rolls-Royce Phantom VIII Extended',
                description: 'Full day armored chauffeur dispatch for protocol summit',
                booking_date: new Date(Date.now() - 86400000 * 2).toISOString()
              }
            ]).map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-gray-50 border border-gray-100 rounded-xl w-14 h-14 shrink-0 flex items-center justify-center text-lg">
                  🏰
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{booking.title}</h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{booking.description}</p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">
                    {new Date(booking.booking_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <div className="bg-amber-100/70 p-2.5 rounded-xl mr-3 text-amber-700">
              <UserCircleIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Current FIC Profile Balance</p>
              <p className="font-extrabold text-lg text-gray-900">
                {ficBalance.toFixed(2)} FIC <span className="text-xs text-gray-400">({formatPrice(ficBalance)})</span>
              </p>
            </div>
          </div>

          <div className="flex w-full sm:w-auto gap-3">
            <button
              onClick={() => refreshData()}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition duration-150 shadow-sm flex items-center justify-center gap-2"
            >
              Explore More
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- Dynamic Packaging & Customization Drawer / Modal --- */}
      {showBookingModal && selectedCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative border border-gray-100 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                  Dynamic Packaging Suite
                </span>
                <h3 className="text-xl font-black text-gray-900 mt-1">{selectedCategory.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Base Item Context */}
            <div className="flex items-center gap-4 py-4 border-b border-gray-100">
              <img
                src={selectedCategory.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'}
                alt={selectedCategory.name}
                className="w-20 h-20 rounded-2xl object-cover border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 line-clamp-2">{selectedCategory.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs font-bold text-gray-700">Base Experience Rate:</span>
                  <span className="text-sm font-black text-indigo-600">
                    {formatPrice(selectedCategory.price ?? 1000)}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Packaging Add-ons Selection */}
            <div className="my-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-black uppercase tracking-wider text-gray-700">
                  Select Dynamic Add-Ons & Upgrades
                </label>
                <span className="text-[10px] text-gray-400">Customized Experiential Bundles</span>
              </div>

              <div className="space-y-2.5">
                {LUXURY_ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                        isChecked ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{addon.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900">{addon.name}</span>
                            <span className="text-xs font-black text-amber-600">+{formatPrice(addon.priceInFic)}</span>
                          </div>
                          <p className="text-[11px] text-gray-500">{addon.description}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAddon(addon.id)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Settlement Rail Selection */}
            <div className="mb-5 p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Settlement Payment Rail
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'fic', label: 'FIC Balance', sub: `${ficBalance.toFixed(0)} FIC` },
                  { id: 'wallet', label: 'Protocol Wallet', sub: 'Creator Balance' },
                  { id: 'concierge', label: 'VIP Concierge', sub: 'Amex / Card' }
                ].map((rail) => (
                  <button
                    key={rail.id}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(rail.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      selectedPaymentMethod === rail.id
                        ? 'border-indigo-600 bg-white font-black text-indigo-600 shadow-sm'
                        : 'border-gray-200 bg-white/60 text-gray-600'
                    }`}
                  >
                    <span className="text-xs block font-bold">{rail.label}</span>
                    <span className="text-[10px] text-gray-400 block">{rail.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="p-4 rounded-2xl bg-indigo-950 text-white mb-6">
              <div className="flex justify-between items-center text-xs text-indigo-200 mb-1">
                <span>Base Reservation:</span>
                <span>{formatPrice(selectedCategory.price ?? 1000)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-indigo-200 mb-2">
                <span>Selected Add-ons ({selectedAddons.length}):</span>
                <span>
                  +{formatPrice(
                    selectedAddons.reduce((acc, id) => {
                      const m = LUXURY_ADDONS.find((a) => a.id === id);
                      return acc + (m ? m.priceInFic : 0);
                    }, 0)
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-indigo-800 flex justify-between items-center">
                <span className="font-bold text-sm">Package Grand Total:</span>
                <span className="text-xl font-black text-amber-400">
                  {formatPrice(calculatedGrandTotalInFic)}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                disabled={isProcessing}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReservation}
                disabled={isProcessing}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-indigo-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2"
              >
                {isProcessing ? 'Locking PMS Reservation...' : `Confirm & Lock Package (${formatPrice(calculatedGrandTotalInFic)})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Action Modal: Gift Interface --- */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Gift Experience</h3>
            <p className="text-xs text-gray-500 mb-4">{selectedCategory?.name}</p>
            <input
              type="number"
              value={giftAmount}
              onChange={(e) => setGiftAmount(e.target.value)}
              placeholder="Amount in FIC"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl mb-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowGiftModal(false)}
                className="flex-1 py-2 text-xs font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendGift}
                className="flex-1 py-2 text-xs font-bold text-white bg-amber-500 rounded-xl hover:bg-amber-600"
              >
                Send Gift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Action Modal: Paylink Interface --- */}
      {showPaylinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Generate Paylink</h3>
            <p className="text-xs text-gray-500 mb-4">{selectedCategory?.name}</p>
            <input
              type="number"
              value={paylinkAmount}
              onChange={(e) => setPaylinkAmount(e.target.value)}
              placeholder="Request Price in FIC"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl mb-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPaylinkModal(false)}
                className="flex-1 py-2 text-xs font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreatePaylink}
                className="flex-1 py-2 text-xs font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600"
              >
                Create Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Social Embed Modal --- */}
      <SocialEmbedModal
        isOpen={Boolean(embedCategory)}
        onClose={() => setEmbedCategory(null)}
        product={
          embedCategory
            ? {
              id: String(embedCategory.id),
              name: embedCategory.name,
              price: embedCategory.price || 1000,
              currency: 'FIC',
              imageUrl: embedCategory.image,
              platform: 'fingerlux',
              description: embedCategory.description
            }
            : null
        }
      />
    </MainLayout>
  );
};

export default FingerLuxPage;
