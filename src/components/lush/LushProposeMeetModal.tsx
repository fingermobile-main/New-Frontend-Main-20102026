import React, { useState } from 'react';
import {
  XMarkIcon,
  SparklesIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  CheckBadgeIcon,
  BuildingLibraryIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

export interface EncoreMember {
  id: string;
  name: string;
  username: string;
  avatar: string;
  rating: number; // 3.0 to 5.0 stars
  reviewsCount: number;
  isAvailable: boolean; // true = available now, false = unavailable / on expedition
  currentStatusNote?: string;
  characteristics: string[];
  highscores: {
    affinity: number; // e.g. 96%
    trust: number;    // e.g. 980
    charm: number;    // e.g. 94%
    etiquette: number;// e.g. 99%
  };
  headline: string;
  location: string;
  loveLanguage: string;
  matchingIntent: string;
  bio: string;
  verificationLevel: number;
  preferredVenues?: string[];
  pastExpeditions?: string[];
}

interface LushProposeMeetModalProps {
  isOpen: boolean;
  member: EncoreMember | null;
  onClose: () => void;
  onSuccess: (proposalDetails: any) => void;
}

export type MeetCategory =
  | 'diner'
  | 'lunch'
  | 'coffee_tea'
  | 'gallery_picnic'
  | 'event'
  | 'fingerlux_expedition';

interface MeetOption {
  id: MeetCategory;
  title: string;
  emoji: string;
  tagline: string;
  badge: string;
  suggestedEscrow: number; // in FIC / Lush Coins
}

const MEET_OPTIONS: MeetOption[] = [
  {
    id: 'diner',
    title: 'Fine Dining & Private Dinner',
    emoji: '🍷',
    tagline: 'Michelin-starred reservation, private tasting menu or sunset terrace dinner',
    badge: 'Gastronomy',
    suggestedEscrow: 250,
  },
  {
    id: 'lunch',
    title: 'Chic Lunch Date',
    emoji: '🥗',
    tagline: 'Scenic garden bistro, oceanfront terrace or vibrant organic culinary lounge',
    badge: 'Daytime Rendezvous',
    suggestedEscrow: 150,
  },
  {
    id: 'coffee_tea',
    title: 'Artisan Coffee or Tea Date',
    emoji: '🍵',
    tagline: 'Ceremonial matcha, private salon high tea or single-origin espresso talk',
    badge: 'Gentle Spark',
    suggestedEscrow: 80,
  },
  {
    id: 'gallery_picnic',
    title: 'Home, Picnic or Art Gallery Visitation',
    emoji: '🎨',
    tagline: 'VIP gallery vernissage, private sculpture park stroll or champagne botanic picnic',
    badge: 'Aesthetic Culture',
    suggestedEscrow: 200,
  },
  {
    id: 'event',
    title: 'FingerLux Gala or Premier Event',
    emoji: '🎟️',
    tagline: 'Orchestral soirée, fashion week front row, polo cup or private rooftop performance',
    badge: 'Society & Arts',
    suggestedEscrow: 450,
  },
  {
    id: 'fingerlux_expedition',
    title: 'FingerLux Trip, Getaway or Expedition',
    emoji: '✈️',
    tagline: 'Private catamaran cruise, Alpine chalet escape, Safari lodge or Kyoto retreat',
    badge: 'FingerLux Luxury Protocol',
    suggestedEscrow: 1200,
  },
];

export const LushProposeMeetModal: React.FC<LushProposeMeetModalProps> = ({
  isOpen,
  member,
  onClose,
  onSuccess,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MeetCategory>('gallery_picnic');
  const [proposedDate, setProposedDate] = useState('2026-10-15');
  const [proposedTime, setProposedTime] = useState('18:30');
  const [destinationCity, setDestinationCity] = useState(member?.location || 'Lagos & Paris');
  const [customVenue, setCustomVenue] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [includeFingerLuxConcierge, setIncludeFingerLuxConcierge] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen || !member) return null;

  const currentOption = MEET_OPTIONS.find((o) => o.id === selectedCategory) || MEET_OPTIONS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      memberId: member.id,
      memberName: member.name,
      category: selectedCategory,
      title: currentOption.title,
      date: proposedDate,
      time: proposedTime,
      destinationCity,
      customVenue: customVenue.trim() || currentOption.tagline,
      message: personalMessage,
      fingerLuxConcierge: includeFingerLuxConcierge,
      escrowAmount: currentOption.suggestedEscrow,
      timestamp: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => {
        onSuccess(payload);
        setIsSent(false);
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-emerald-200/90 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto relative p-5 sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
              <SparklesIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Propose Date, Meet or Expedition
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-400    font-black">
                  FingerLux™ Protocol
                </span>
              </div>
              <p className="text-xs text-slate-700">
                To Encore Member <strong className="text-gray-900">{member.name}</strong> (@{member.username}) · Rating: ⭐ {member.rating.toFixed(1)}/5.0
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

        {/* Member Status Advisory */}
        {!member.isAvailable && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
            <span className="text-lg">⏳</span>
            <div>
              <p className="font-bold">Member is currently on a FingerLux Expedition / Private Retreat</p>
              <p className="text-amber-700 text-[11px]">
                {member.currentStatusNote || 'Away on an expedition. You can still lock an advance reservation or propose future itinerary dates!'}
              </p>
            </div>
          </div>
        )}

        {isSent ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold flex items-center justify-center text-3xl shadow-inner font-black">
              ✨
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Proposal Dispatched via FingerLux!
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Your formal invitation and escrow reservation have been delivered to {member.name}'s private sovereign mailbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* 1. Category Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                Select Meet & Date Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MEET_OPTIONS.map((opt) => {
                  const isSelected = selectedCategory === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedCategory(opt.id)}
                      className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/30'
                          : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50/70'
                      }`}
                    >
                      <span className="text-2xl mt-0.5">{opt.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900 truncate">
                            {opt.title}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                            {opt.suggestedEscrow} FIC
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 mt-0.5 line-clamp-2 leading-tight">
                          {opt.tagline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Destination & Venue Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <MapPinIcon className="w-3.5 h-3.5 text-emerald-600" />
                  City / Region
                </label>
                <input
                  type="text"
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  placeholder="e.g. Lagos, Paris, London, Kyoto"
                  className="w-full bg-white text-slate-900 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-600 outline-hidden font-bold border-slate-300 placeholder:text-slate-400 focus:ring-2"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <BuildingLibraryIcon className="w-3.5 h-3.5 text-emerald-600" />
                  Specific Venue or Gallery Name (Optional)
                </label>
                <input
                  type="text"
                  value={customVenue}
                  onChange={(e) => setCustomVenue(e.target.value)}
                  placeholder="e.g. Musée d'Orsay, Private Rooftop Terrace"
                  className="w-full bg-white text-slate-900 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-600 outline-hidden font-bold border-slate-300 placeholder:text-slate-400 focus:ring-2"
                />
              </div>
            </div>

            {/* 3. Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <CalendarDaysIcon className="w-3.5 h-3.5 text-emerald-600" />
                  Proposed Date
                </label>
                <input
                  type="date"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="w-full bg-white text-slate-900 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-600 outline-hidden font-bold border-slate-300 placeholder:text-slate-400 focus:ring-2"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <ClockIcon className="w-3.5 h-3.5 text-emerald-600" />
                  Time / Window
                </label>
                <input
                  type="time"
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                  className="w-full bg-white text-slate-900 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-600 outline-hidden font-bold border-slate-300 placeholder:text-slate-400 focus:ring-2"
                  required
                />
              </div>
            </div>

            {/* 4. Personal Invitation Message */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Personalized Invitation Note
              </label>
              <textarea
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder={`Dear ${member.name}, I would be delighted to host you for a curated ${currentOption.title.toLowerCase()}...`}
                rows={3}
                className="w-full bg-white text-slate-900 border border-gray-300 rounded-xl p-3 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-600 outline-hidden resize-none font-bold border-slate-300 placeholder:text-slate-400 focus:ring-2"
              />
            </div>

            {/* 5. FingerLux Concierge Services */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckBadgeIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900">FingerLux White-Glove Concierge</p>
                  <p className="text-[11px] text-gray-500">
                    Includes private chauffeur coordination, priority table reservation & protocol security.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeFingerLuxConcierge}
                onChange={(e) => setIncludeFingerLuxConcierge(e.target.checked)}
                className="w-4 h-4 text-slate-900 rounded-sm border-gray-300 focus:ring-emerald-500 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div className="text-xs text-slate-700">
                Escrow Deposit: <strong className="text-emerald-800">{currentOption.suggestedEscrow} FIC</strong> (Refundable if declined)
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Invitation'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LushProposeMeetModal;
