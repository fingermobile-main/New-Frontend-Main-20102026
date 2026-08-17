import { Link} from 'react-router-dom';
import React, { useState, useCallback } from 'react';


import { useAppContext } from "../contexts/AppContext";
import { useFingerLux } from '../hooks/useFingerLux';
import type { BookingCategory } from '../types';
import { FingerLuxIcon, GiftIcon, LinkIcon, UserCircleIcon, ArrowRightIcon } from '../icons';
import MainLayout from '../components/layout/MainLayout';

// --- Domain Interface Mappings ---
interface FingerLuxCategory extends BookingCategory {
  price?: number;
  image?: string;
  features?: string[];
}

// --- Subcomponent: Decoupled Luxury Booking Card ---
interface BookingCardProps {
  category: FingerLuxCategory;
  isProcessing: boolean;
  onBook: (category: FingerLuxCategory) => void;
  onOpenGift: (category: FingerLuxCategory) => void;
  onOpenPaylink: (category: FingerLuxCategory) => void;
}

const BookingCard: React.FC<BookingCardProps> = React.memo(({ 
  category, 
  isProcessing, 
  onBook, 
  onOpenGift, 
  onOpenPaylink 
}) => {
  const handleBookClick = useCallback(() => onBook(category), [category, onBook]);
  const handleGiftClick = useCallback(() => onOpenGift(category), [category, onOpenGift]);
  const handlePaylinkClick = useCallback(() => onOpenPaylink(category), [category, onOpenPaylink]);

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 to-indigo-950 text-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border border-indigo-800/40">
      <div
        className="h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${category.image || ''})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-950/40 to-transparent"></div>
        {category.icon && ( // Check if icon exists before using it
          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
            <span className="text-xl leading-none block">{category.icon}</span>
          </div>
        )}
      </div>
      
      <div className="p-6 relative">
        <div className="flex justify-between items-start gap-4 mb-3">
          <div>
            <h3 className="text-xl font-bold tracking-tight mb-1">{category.name || 'Unnamed Category'}</h3> {/* Handle potentially missing name */}
            <p className="text-sm text-indigo-200/70 line-clamp-2">{category.description || 'No description available'}</p> {/* Handle potentially missing description */}
          </div>
          <span className="text-xl font-extrabold shrink-0 text-amber-400">
            {category.price ?? 1000} <span className="text-xs font-semibold tracking-wider text-indigo-300">FIC</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 min-h-[24px]">
          {category.features?.map((feature, idx) => (
            <span key={idx} className="text-xs bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md text-indigo-200">
              {feature}
            </span>
          ))}
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleBookClick}
            disabled={isProcessing}
            className="flex-1 py-2.5 bg-white text-indigo-950 font-bold text-sm rounded-xl hover:bg-indigo-50 transition duration-150 disabled:opacity-50 shadow-sm"
          >
            {isProcessing ? "Processing..." : "Book Now"}
          </button>
          
          <button
            onClick={handleGiftClick}
            className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl hover:bg-amber-500 hover:text-white transition duration-150"
            title="Send as Gift"
          >
            <GiftIcon className="w-5 h-5" />
          </button>
          
          <button
            onClick={handlePaylinkClick}
            className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-white transition duration-150"
            title="Create Paylink"
          >
            <LinkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
});

BookingCard.displayName = "BookingCard";

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
  
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FingerLuxCategory | null>(null);
  const [giftAmount, setGiftAmount] = useState("");
  const [paylinkAmount, setPaylinkAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBookNow = useCallback(async (category: FingerLuxCategory) => {
    const price = category.price ?? 1000;
    if (ficBalance < price) {
      showToast(`Insufficient FIC balance. Required: ${price} FIC`, "error");
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast(`Successfully booked ${category.name || 'Service'}`, "success"); // Handle potentially missing name
    } catch {
      showToast("Failed to process booking", "error");
    } finally {
      setIsProcessing(false);
    }
  }, [ficBalance, showToast]);

  const onOpenGiftModal = useCallback((category: BookingCategory) => {
    if (ficBalance <= 0) {
      showToast("Insufficient FIC balance", "error");
      return;
    }
    // Convert BookingCategory to FingerLuxCategory by adding optional fields
    const fingerLuxCategory = {
      ...category,
      price: (category as any)?.price,
      image: (category as any)?.image,
      features: (category as any)?.features
    } as FingerLuxCategory;
    setSelectedCategory(fingerLuxCategory);
    setShowGiftModal(true);
  }, [ficBalance, showToast]);

  const onOpenPaylinkModal = useCallback((category: BookingCategory) => {
    if (ficBalance <= 0) {
      showToast("Insufficient FIC balance", "error");
      return;
    }
    // Convert BookingCategory to FingerLuxCategory by adding optional fields
    const fingerLuxCategory = {
      ...category,
      price: (category as any)?.price,
      image: (category as any)?.image,
      features: (category as any)?.features
    } as FingerLuxCategory;
    setSelectedCategory(fingerLuxCategory);
    setShowPaylinkModal(true);
  }, [ficBalance, showToast]);

  const handleSendGift = async () => {
    if (!selectedCategory) return;
    const amount = parseFloat(giftAmount);
    if (isNaN(amount) || amount <= 0 || amount > ficBalance) {
      showToast("Please enter a valid allocation amount", "error");
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast("Gift dispatch link generated successfully", "success");
      setGiftAmount("");
      setShowGiftModal(false);
    } catch {
      showToast("Failed to process asset transfer", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreatePaylink = async () => {
    if (!selectedCategory) return;
    const amount = parseFloat(paylinkAmount);
    if (isNaN(amount) || amount <= 0 || amount > ficBalance) {
      showToast("Please enter a valid checkout token value", "error");
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast("Paylink connection established", "success");
      setPaylinkAmount("");
      setShowPaylinkModal(false);
    } catch {
      showToast("Failed to secure validation handshake", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="text-gray-500 font-medium text-sm animate-pulse">Loading structural data profiles...</div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-md">
              <FingerLuxIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">FingerLux</h1>
              <p className="text-gray-500 text-sm mt-0.5">Rent luxury items and signature tier environments</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Luxury Rentals Catalogue</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCategories.map((category) => {
                // Convert BookingCategory to FingerLuxCategory by adding optional fields
                const fingerLuxCategory = {
                  ...category,
                  price: (category as any)?.price,
                  image: (category as any)?.image,
                  features: (category as any)?.features
                } as FingerLuxCategory;
                return (
                  <BookingCard 
                    key={category.id} 
                    category={fingerLuxCategory} 
                    isProcessing={isProcessing}
                    onBook={handleBookNow}
                    onOpenGift={onOpenGiftModal}
                    onOpenPaylink={onOpenPaylinkModal}
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-indigo-500 mr-2" />
                Your Identity Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-xs bg-indigo-600 text-white font-bold px-3 py-2 rounded-xl hover:bg-indigo-700 shadow-sm transition duration-150">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {["Rent an Item", "List an Item", "My Bookings"].map((label, index) => (
                  <button key={index} className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-indigo-50/50 text-gray-800 hover:text-indigo-900 font-medium text-sm rounded-xl transition duration-150 border border-transparent hover:border-indigo-100/40">
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-amber-900 tracking-wide mb-3">Premium Benefits Tier</h2>
              <ul className="space-y-2 text-xs font-medium text-amber-800">
                {["Priority Booking Clearance", "Exclusive Global Vault Access", "Dedicated Concierge Network Handler"].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-amber-500">✦</span> {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Transactions Context Breakdown Block */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Recent Bookings Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fingerLuxBookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="bg-gray-50 border border-gray-100 rounded-xl w-14 h-14 shrink-0 flex items-center justify-center text-lg">
                  📦
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
              <p className="font-extrabold text-lg text-gray-900">{ficBalance.toFixed(2)} FIC</p>
            </div>
          </div>

          <div className="flex w-full sm:w-auto gap-3">
            <button className="flex-1 sm:flex-initial px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition duration-150 shadow-sm flex items-center justify-center gap-2">
              Explore More
              <ArrowRightIcon className="h-4 w-4" />
            </button>
            <button className="flex-1 sm:flex-initial px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition duration-150 shadow-sm">
              List an Item
            </button>
          </div>
        </div>
      </div>

      {/* --- Action Modal Interface Fallbacks --- */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Gift {selectedCategory?.name || 'Service'}</h3> {/* Handle potentially missing name */}
            <input 
              type="number" 
              value={giftAmount} 
              onChange={(e) => setGiftAmount(e.target.value)}
              placeholder="Amount in FIC"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl mb-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowGiftModal(false)} className="flex-1 py-2 text-sm font-semibold text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100">Cancel</button>
              <button onClick={handleSendGift} className="flex-1 py-2 text-sm font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600">Send Gift</button>
            </div>
          </div>
        </div>
      )}

      {showPaylinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Generate Paylink</h3>
            <input 
              type="number" 
              value={paylinkAmount} 
              onChange={(e) => setPaylinkAmount(e.target.value)}
              placeholder="Request Price in FIC"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl mb-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowPaylinkModal(false)} className="flex-1 py-2 text-sm font-semibold text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100">Cancel</button>
              <button onClick={handleCreatePaylink} className="flex-1 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600">Create Link</button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default FingerLuxPage;