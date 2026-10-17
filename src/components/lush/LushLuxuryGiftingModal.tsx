import React, { useState } from 'react';
import {
  XMarkIcon,
  SparklesIcon,
  GiftIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { EncoreMember } from './LushProposeMeetModal';

interface LushLuxuryGiftingModalProps {
  isOpen: boolean;
  member: EncoreMember | null;
  onClose: () => void;
  onGiftSent: (giftDetails: any) => void;
}

export interface LuxuryStoreItem {
  id: string;
  store: 'ownit' | 'flamingo';
  title: string;
  price: number; // in FIC / Lush Coins
  rarity: '1-of-1 Bespoke' | 'Ultra Rare' | 'Museum Grade' | 'Haute Couture' | 'Imperial Reserve';
  image: string;
  tagline: string;
  authenticationBadge: string;
  deliveryMethod: 'White-Glove Physical Courier' | 'Encrypted Sovereign NFT Vault' | 'Direct Private Vault Transfer';
}

const LUXURY_GIFTS: LuxuryStoreItem[] = [
  // OwnIt Store
  {
    id: 'ownit_01',
    store: 'ownit',
    title: 'Patek Philippe Celestial Platinum Horology',
    price: 4800,
    rarity: 'Ultra Rare',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    tagline: 'Mechanical star chart timepiece with platinum fold-over clasp and certified provenance.',
    authenticationBadge: 'OwnIt Vault Certified #PP-8492',
    deliveryMethod: 'White-Glove Physical Courier',
  },
  {
    id: 'ownit_02',
    store: 'ownit',
    title: 'Hermès Himalayan Niloticus Crocodile Birkin 30',
    price: 5400,
    rarity: '1-of-1 Bespoke',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
    tagline: 'Grade 1 white & smoky grey gradient matte crocodile with 18k white gold diamond hardware.',
    authenticationBadge: 'OwnIt Heritage Guarantee',
    deliveryMethod: 'White-Glove Physical Courier',
  },
  {
    id: 'ownit_03',
    store: 'ownit',
    title: 'Savoy 18k White Gold Diamond Tennis Choker (22ct)',
    price: 3600,
    rarity: 'Museum Grade',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
    tagline: 'Flawless D-Color, VVS1 clarity round brilliant diamonds set in handcrafted platinum prongs.',
    authenticationBadge: 'GIA & OwnIt Vault Authenticated',
    deliveryMethod: 'White-Glove Physical Courier',
  },
  {
    id: 'ownit_04',
    store: 'ownit',
    title: 'Rolls-Royce Spectre Bespoke Chauffeur 7-Day Pass',
    price: 2200,
    rarity: 'Haute Couture',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600',
    tagline: 'Unlimited dedicated electric luxury chauffeur transit across Lagos, London, Paris or Dubai.',
    authenticationBadge: 'OwnIt Mobility Protocol',
    deliveryMethod: 'Direct Private Vault Transfer',
  },
  // Flamingo Store
  {
    id: 'flamingo_01',
    store: 'flamingo',
    title: 'Flamingo 24k Gold Leaf Sculpted Phoenix & Flamingo',
    price: 2900,
    rarity: '1-of-1 Bespoke',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600',
    tagline: 'Hand-hammered bronze layered in 24-karat gold leaf by Parisian master sculptors.',
    authenticationBadge: 'Flamingo Atelier Seal #FL-902',
    deliveryMethod: 'White-Glove Physical Courier',
  },
  {
    id: 'flamingo_02',
    store: 'flamingo',
    title: 'Dom Pérignon 1996 P2 Plénitude Vintage Reserve Hamper',
    price: 1450,
    rarity: 'Imperial Reserve',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600',
    tagline: 'Dual magnum coffret paired with handblown Lehmann Grand Champagne flutes and Beluga caviar.',
    authenticationBadge: 'Flamingo Cellar Vault Reserve',
    deliveryMethod: 'White-Glove Physical Courier',
  },
  {
    id: 'flamingo_03',
    store: 'flamingo',
    title: 'Baccarat Harcourt 1841 Decanter with Rare Aged Cognac',
    price: 1850,
    rarity: 'Museum Grade',
    image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600',
    tagline: 'Iconic hexagonal cut crystal decanter harboring a 70-year single-cask Grande Champagne cognac.',
    authenticationBadge: 'Baccarat & Flamingo Authenticated',
    deliveryMethod: 'White-Glove Physical Courier',
  },
  {
    id: 'flamingo_04',
    store: 'flamingo',
    title: 'Flamingo Imperial Silk & Pure Cashmere Evening Robe',
    price: 980,
    rarity: 'Haute Couture',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600',
    tagline: '6A-grade mulberry silk lining enveloped in Grade-A Mongolian cashmere with personalized embroidery.',
    authenticationBadge: 'Flamingo Couture Registry',
    deliveryMethod: 'White-Glove Physical Courier',
  },
];

export const LushLuxuryGiftingModal: React.FC<LushLuxuryGiftingModalProps> = ({
  isOpen,
  member,
  onClose,
  onGiftSent,
}) => {
  const [activeStoreTab, setActiveStoreTab] = useState<'all' | 'ownit' | 'flamingo'>('all');
  const [selectedItem, setSelectedItem] = useState<LuxuryStoreItem>(LUXURY_GIFTS[0]);
  const [customEngravingNote, setCustomEngravingNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !member) return null;

  const filteredItems = LUXURY_GIFTS.filter((item) => {
    if (activeStoreTab === 'all') return true;
    return item.store === activeStoreTab;
  });

  const handleSendGift = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const payload = {
      memberId: member.id,
      memberName: member.name,
      gift: selectedItem,
      customNote: customEngravingNote,
      escrowCost: selectedItem.price,
      sentAt: new Date().toISOString(),
      storeType: selectedItem.store,
    };

    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      setTimeout(() => {
        onGiftSent(payload);
        setIsSuccess(false);
        onClose();
      }, 1600);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-amber-200/90 shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto relative p-5 sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <GiftIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Exclusive Luxury Gifting · OwnIt™ & Flamingo™
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400    font-black">
                  Subscription VIP Unlocked
                </span>
              </div>
              <p className="text-xs text-slate-700">
                To Encore Member <strong className="text-gray-900">{member.name}</strong> · Rated ⭐ {member.rating.toFixed(1)}/5.0
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-slate-700 hover:text-gray-700 transition"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Subscription Benefit Callout Banner */}
        <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 via-rose-50 to-emerald-50 border border-amber-200/80 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <SparklesIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-bold text-amber-900">
                Access Granted from Lush Pressies Subscription:
              </span>{' '}
              <span className="text-gray-700">
                Direct cross-store VIP checkout enabled across OwnIt™ Vault and Flamingo™ Store with zero extra surcharge.
              </span>
            </div>
          </div>
          <CheckBadgeIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 ml-2" />
        </div>

        {isSuccess ? (
          <div className="py-14 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center text-3xl shadow-lg">
              💎
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Luxury Gift Dispatched & Escrow Sealed!
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              <strong>{selectedItem.title}</strong> has been transferred into {member.name}'s luxury vault with certificate{' '}
              <span className="font-mono text-emerald-700">{selectedItem.authenticationBadge}</span>.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Filter & Gift Catalog (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Store Filter Tabs */}
              <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveStoreTab('all')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition ${
                    activeStoreTab === 'all'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Curations ({LUXURY_GIFTS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStoreTab('ownit')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                    activeStoreTab === 'ownit'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🏛️ OwnIt™ Vault</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStoreTab('flamingo')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                    activeStoreTab === 'flamingo'
                      ? 'bg-white text-rose-800 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>🦩 Flamingo™ Store</span>
                </button>
              </div>

              {/* Gift Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {filteredItems.map((gift) => {
                  const isSelected = selectedItem.id === gift.id;
                  return (
                    <div
                      key={gift.id}
                      onClick={() => setSelectedItem(gift)}
                      className={`group cursor-pointer rounded-2xl border p-2.5 transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-400/40 shadow-xs'
                          : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50/70'
                      }`}
                    >
                      <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2">
                        <img
                          src={gift.image}
                          alt={gift.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                        />
                        <span
                          className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                            gift.store === 'ownit'
                              ? 'bg-emerald-900/85 text-emerald-200 backdrop-blur-xs'
                              : 'bg-rose-900/85 text-rose-200 backdrop-blur-xs'
                          }`}
                        >
                          {gift.store === 'ownit' ? 'OwnIt™ Vault' : 'Flamingo™'}
                        </span>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/75 text-amber-300 backdrop-blur-xs">
                          {gift.price} FIC
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-0.5">
                          <span className="font-extrabold text-amber-700">{gift.rarity}</span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                          {gift.title}
                        </h4>
                        <p className="text-[11px] text-slate-700 line-clamp-2 mt-0.5 leading-snug">
                          {gift.tagline}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Selected Gift Inspector & Engraving Form (5 cols) */}
            <div className="lg:col-span-5 bg-[#F5F9F6] border border-emerald-200/80 rounded-2xl p-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Gift Specifier
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedItem.store === 'ownit'
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold'
                        : 'bg-rose-100 text-emerald-950'
                    }font-black`}
                  >
                    {selectedItem.store === 'ownit' ? 'OwnIt™ Sovereign Store' : 'Flamingo™ Haute Boutique'}
                  </span>
                </div>

                <div className="flex gap-3 items-center">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-16 h-16 rounded-xl object-cover border border-emerald-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-gray-900 truncate">
                      {selectedItem.title}
                    </p>
                    <p className="text-sm font-black text-amber-600">
                      {selectedItem.price.toLocaleString()} FIC
                    </p>
                    <p className="text-[10px] text-emerald-700 font-semibold truncate flex items-center gap-1">
                      <ShieldCheckIcon className="w-3.5 h-3.5" />
                      {selectedItem.authenticationBadge}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-white border border-emerald-100 rounded-xl space-y-1 text-[11px] text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-slate-700">Tier / Rarity:</span>
                    <strong className="text-gray-900">{selectedItem.rarity}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700">Delivery Method:</span>
                    <strong className="text-gray-900">{selectedItem.deliveryMethod}</strong>
                  </div>
                </div>

                {/* Personalized Engraving Note */}
                <form onSubmit={handleSendGift} id="giftForm" className="space-y-2">
                  <label className="block text-xs font-bold text-gray-800">
                    Personalized Engraving / Dedication Note
                  </label>
                  <textarea
                    value={customEngravingNote}
                    onChange={(e) => setCustomEngravingNote(e.target.value)}
                    placeholder={`Dear ${member.name}, I wanted to gift you this exceptional piece from ${
                      selectedItem.store === 'ownit' ? 'OwnIt' : 'Flamingo'
                    } in honor of your remarkable rating and grace...`}
                    rows={4}
                    className="w-full bg-white text-slate-900 border border-gray-300 rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-600 outline-hidden resize-none shadow-2xs font-bold border-slate-300 placeholder:text-slate-400 focus:ring-2"
                  />
                </form>
              </div>

              <div className="pt-3 border-t border-emerald-200/60 mt-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase">Total Escrow</span>
                  <p className="text-sm font-black text-gray-900">{selectedItem.price} FIC</p>
                </div>
                <button
                  type="submit"
                  form="giftForm"
                  disabled={isSending}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 shadow-md flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <SparklesIcon className="w-4 h-4" />
                  <span>{isSending ? 'Sealing...' : 'Send Luxury Gift'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LushLuxuryGiftingModal;
