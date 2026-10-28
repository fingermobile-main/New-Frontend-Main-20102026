import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  GiftIcon,
  SparklesIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  LockClosedIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import LushPlushiesCatalog, {
  LushGiftProduct,
} from '../components/LushPlushiesCatalog';
import AdvancedGiftingEngine from '../components/gifting/AdvancedGiftingEngine';
import { useAppContext } from '../contexts/AppContext';

export const GiftsShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const matchId = searchParams.get('matchId');

  const { ficBalance } = useAppContext();

  const [activeTab, setActiveTab] = useState<'plushies' | 'virtual'>(
    'plushies'
  );
  const [selectedProduct, setSelectedProduct] =
    useState<LushGiftProduct | null>(null);
  const [giftNote, setGiftNote] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleSelectGift = (product: LushGiftProduct) => {
    setSelectedProduct(product);
  };

  const handleConfirmSendGift = () => {
    if (!selectedProduct) return;
    setShowSuccessModal(true);
    showToast(
      `🎁 ${selectedProduct.product_name} locked in Escrow for Match #${
        matchId || 'Active'
      }!`
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F9F6] text-gray-900 pb-28 md:pb-16 w-full max-w-full overflow-x-hidden text-slate-900">
      {/* Top Ambient Ribbon */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-[#DC582A]" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-gray-900/95 text-white border border-emerald-400 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md">
          <SparklesIcon className="w-5 h-5 text-emerald-400 animate-spin" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation & Breadcrumbs Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/lush-pressies')}
              className="p-2 rounded-xl text-gray-600 hover:text-emerald-800 hover:bg-emerald-50 transition border border-slate-300"
              title="Return to Lush-Pressies Feed"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Lush Luxury Gift Shop
                </h1>
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold px-2.5 py-0.5 rounded-full   font-black">
                  Escrow Protected
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-0.5">
                Luxury plushies, bespoke gifts & sovereign virtual sparks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl px-3 py-1.5 text-right">
              <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold block">
                FIC Balance
              </span>
              <span className="text-sm font-black text-gray-900 font-mono">
                {typeof ficBalance === 'number'
                  ? ficBalance.toFixed(2)
                  : '2,850.00'}{' '}
                FIC
              </span>
            </div>
            <button
              onClick={() => navigate('/wallet')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs transition"
            >
              Add Funds
            </button>
          </div>
        </div>

        {/* Match Context Banner if matchId is present in URL */}
        {matchId && (
          <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-emerald-700/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 text-2xl shadow-inner">
                🎁
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold">
                    Curating a Gift for Match #{matchId}
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                    Active Bond
                  </span>
                </div>
                <p className="text-xs text-emerald-200/90 mt-0.5">
                  Gifts are held safely in Sovereign Escrow until mutual 8-digit
                  PIN release.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/messages?matchId=${matchId}`)}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-slate-700 text-xs font-semibold transition"
              >
                Chat with Match
              </button>
            </div>
          </div>
        )}

        {/* Channel Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('plushies')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'plushies'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/70'
            }`}
          >
            <GiftIcon className="w-4 h-4 text-[#DC582A]" />
            <span>Lush Plushies & Luxury Goods</span>
          </button>

          <button
            onClick={() => setActiveTab('virtual')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'virtual'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/70'
            }`}
          >
            <SparklesIcon className="w-4 h-4 text-amber-500" />
            <span>Virtual Sparks & Effects</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'plushies' ? (
          <div className="bg-white rounded-3xl border border-emerald-100 p-4 sm:p-6 shadow-xs">
            <LushPlushiesCatalog
              userId="usr_lush_001"
              onGiftSelect={handleSelectGift}
            />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-emerald-100 p-4 sm:p-6 shadow-xs">
            <AdvancedGiftingEngine />
          </div>
        )}
      </main>

      {/* Gift Confirmation Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-emerald-200 shadow-2xl max-w-lg w-full p-5 sm:p-6 relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <GiftIcon className="w-5 h-5 text-[#DC582A]" />
                <h3 className="text-base font-bold text-gray-900">
                  Confirm Gift Exchange
                </h3>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-full text-slate-700 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-4 items-center bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200/80">
              <img
                src={
                  selectedProduct.product_image ||
                  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200'
                }
                alt={selectedProduct.product_name}
                className="w-20 h-20 rounded-xl object-cover border border-emerald-200"
              />
              <div className="flex-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                  {selectedProduct.product_category}
                </span>
                <h4 className="text-sm font-bold text-gray-900">
                  {selectedProduct.product_name}
                </h4>
                <p className="text-xs font-black text-[#DC582A] mt-0.5">
                  {selectedProduct.product_price_in_fic ||
                    selectedProduct.product_price}{' '}
                  FIC
                </p>
                <p className="text-[11px] text-slate-700 mt-0.5">
                  Collection: {selectedProduct.product_subcategory || 'Lush Vault'}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                Personal Thoughtful Note (Optional):
              </label>
              <textarea
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                rows={2}
                placeholder="A small luxury token in celebration of our mutual bond..."
                className="w-full text-xs p-3 border border-gray-300 rounded-xl text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden resize-none font-bold border-slate-300 bg-white placeholder:text-slate-400 focus:ring-2"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
              <LockClosedIcon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Sovereign Escrow Guarantee:</strong> Payment is securely
                held in vault escrow and only released to the vendor upon
                confirmed delivery.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSendGift}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
              >
                <ShieldCheckIcon className="w-4 h-4" />
                <span>Send with Escrow Protection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-emerald-200 shadow-2xl max-w-md w-full p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold mx-auto flex items-center justify-center font-black">
              <CheckBadgeIcon className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-black text-gray-900">
              Gift Successfully Initiated!
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your gift <strong>"{selectedProduct.product_name}"</strong> has
              been packaged and funded into Sovereign Escrow. Recipient will
              receive an instant notification.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 font-semibold border border-emerald-200">
              Escrow ID: ESC_{Date.now().toString().slice(-8)} · Status:
              Awaiting Delivery
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setSelectedProduct(null);
                  navigate('/lush-pressies');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
              >
                Back to Feed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Gifts Shop Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-3 py-2 flex items-center justify-around gap-2 shadow-lg"
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab('plushies');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'plushies' ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GiftIcon className="w-5 h-5 mb-0.5" />
          <span>Plushies</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('virtual');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'virtual' ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <SparklesIcon className="w-5 h-5 mb-0.5" />
          <span>Virtual</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/lush-pressies')}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeftIcon className="w-5 h-5 mb-0.5" />
          <span>Feed</span>
        </button>
      </nav>
    </div>
  );
};

export default GiftsShopPage;
