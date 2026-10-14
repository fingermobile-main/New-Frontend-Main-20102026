/*
 * FingerMobile Protocol™ - Global Events, Summits & Cultural Gatherings
 * Physical Meetups, Dancia-4Tv Live Streaming, Tickets & RSVP Management
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useMemo, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { generateICSFile } from '../utils/ics';
import {
  CalendarIcon,
  GiftIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  MapPinIcon,
  VideoCameraIcon,
  ClockIcon,
  SparklesIcon,
  TagIcon
} from '../icons';

export interface PlatformEvent {
  id: string;
  title: string;
  category: 'Conferences' | 'Music & Concerts' | 'Workshops' | 'Esports & Gaming' | 'Virtual AMAs';
  isVirtual: boolean;
  streamPlatform?: string;
  location: string;
  startDate: string;
  endDate: string;
  timeString: string;
  ticketPriceFic: number;
  ticketPriceNgn: number;
  capacity: number;
  attendeesCount: number;
  imageUrl: string;
  description: string;
  organizer: {
    name: string;
    handle: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  isRsvpd?: boolean;
}

const DEFAULT_EVENTS: PlatformEvent[] = [
  {
    id: 'ev-01',
    title: 'FingerMobile Global Creator Summit 2026',
    category: 'Conferences',
    isVirtual: false,
    location: 'Eko Convention Centre, Victoria Island, Lagos',
    startDate: '2026-11-15T09:00:00Z',
    endDate: '2026-11-16T18:00:00Z',
    timeString: '9:00 AM – 6:00 PM WAT',
    ticketPriceFic: 25,
    ticketPriceNgn: 25000,
    capacity: 1500,
    attendeesCount: 940,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80',
    description: 'The flagship annual gathering of African and global creators, Web3 protocol architects, filmmakers, and digital artists.',
    organizer: {
      name: 'FingerMobile Foundation',
      handle: 'fm_foundation',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    }
  },
  {
    id: 'ev-02',
    title: 'Afrobeats Pulse Live & BeatwaveNG Stage',
    category: 'Music & Concerts',
    isVirtual: true,
    streamPlatform: 'Dancia-4Tv Live Transcode Stream',
    location: 'Virtual Metaverse Arena & Dancia-4Tv Channel 1',
    startDate: '2026-10-24T20:00:00Z',
    endDate: '2026-10-24T23:30:00Z',
    timeString: '8:00 PM – 11:30 PM WAT',
    ticketPriceFic: 15,
    ticketPriceNgn: 15000,
    capacity: 10000,
    attendeesCount: 4210,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
    description: 'Live interactive acoustic concert featuring top BeatwaveNG chart toppers with real-time FIC tipping and holographic Mii avatars.',
    organizer: {
      name: 'BeatwaveNG Records',
      handle: 'beatwave_live',
      avatarUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    }
  },
  {
    id: 'ev-03',
    title: 'Finger Wars Continental PvP Championship',
    category: 'Esports & Gaming',
    isVirtual: true,
    streamPlatform: 'Finger Wars Live PvP Lobby',
    location: 'Online Tournament Lobby & London Media Node',
    startDate: '2026-10-30T17:00:00Z',
    endDate: '2026-10-30T22:00:00Z',
    timeString: '5:00 PM – 10:00 PM UTC',
    ticketPriceFic: 10,
    ticketPriceNgn: 10000,
    capacity: 2500,
    attendeesCount: 1680,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
    description: 'Continental finals for the Finger Wars high-speed reaction and tactical gaming arena with 50,000 FIC prize pool.',
    organizer: {
      name: 'Game On League',
      handle: 'gameon_ops',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    }
  },
  {
    id: 'ev-04',
    title: 'Urban Street Lens: PhotoCredits Licensing Masterclass',
    category: 'Workshops',
    isVirtual: false,
    location: 'GraceLink Urban Hub, Victoria Island, Lagos',
    startDate: '2026-11-05T10:00:00Z',
    endDate: '2026-11-05T15:00:00Z',
    timeString: '10:00 AM – 3:00 PM WAT',
    ticketPriceFic: 0,
    ticketPriceNgn: 0,
    capacity: 120,
    attendeesCount: 95,
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80',
    description: 'Hands-on photography excursion covering high-res EXIF exposure, color grading, and commercial stock licensing on PhotoCredits.',
    organizer: {
      name: 'Tunde Afolabi',
      handle: 'tafolabi_lens',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    }
  },
  {
    id: 'ev-05',
    title: 'Sovereign Protocol Architecture & Micro-Services AMA',
    category: 'Virtual AMAs',
    isVirtual: true,
    streamPlatform: 'Dancia-4Tv Developer Stage',
    location: 'Interactive Dev Voice Room & Dancia-4Tv',
    startDate: '2026-10-20T19:00:00Z',
    endDate: '2026-10-20T20:30:00Z',
    timeString: '7:00 PM – 8:30 PM WAT',
    ticketPriceFic: 0,
    ticketPriceNgn: 0,
    capacity: 5000,
    attendeesCount: 1340,
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80',
    description: 'Open technical discussion with FingerMobile core maintainers on decentralized storage, sovereign identity, and smart settlements.',
    organizer: {
      name: 'Core Engineering Guild',
      handle: 'fm_engineers',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    }
  }
];

const EventsPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();

  // Search & Filters
  const [events, setEvents] = useState<PlatformEvent[]>(DEFAULT_EVENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [formatFilter, setFormatFilter] = useState<'all' | 'physical' | 'virtual'>('all');

  // Modals State
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<PlatformEvent | null>(null);
  const [ticketCheckoutEvent, setTicketCheckoutEvent] = useState<PlatformEvent | null>(null);
  const [giftTicketEvent, setGiftTicketEvent] = useState<PlatformEvent | null>(null);
  const [paylinkEvent, setPaylinkEvent] = useState<PlatformEvent | null>(null);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState('');
  const [paylinkDescription, setPaylinkDescription] = useState('');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  // Host Event Form
  const [hostForm, setHostForm] = useState({
    title: '',
    category: 'Conferences' as PlatformEvent['category'],
    isVirtual: false,
    location: '',
    streamPlatform: 'Dancia-4Tv Live Transcode Stream',
    startDate: '',
    timeString: '',
    ticketPriceFic: 10,
    capacity: 200,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80'
  });

  const handleAddToCalendar = useCallback((event: PlatformEvent) => {
    generateICSFile({
      title: event.title,
      description: event.description,
      location: event.location,
      start: new Date(event.startDate),
      end: new Date(event.endDate)
    });
    showToast(`Added "${event.title}" to calendar!`, 'success');
  }, [showToast]);

  const handleBuyTicket = async (event: PlatformEvent) => {
    if (event.ticketPriceFic > 0 && ficBalance < event.ticketPriceFic) {
      showToast(`Insufficient FIC balance! Required: ${event.ticketPriceFic} FIC`, 'error');
      return;
    }

    try {
      setIsProcessingCheckout(true);
      await new Promise((res) => setTimeout(res, 800));

      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id
            ? { ...e, isRsvpd: true, attendeesCount: e.attendeesCount + 1 }
            : e
        )
      );

      setTicketCheckoutEvent(null);
      showToast(`Ticket confirmed for "${event.title}"! Badge added to Passbook.`, 'success');
    } catch {
      showToast('Ticket transaction failed', 'error');
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const handleSendGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftRecipient || !giftTicketEvent) {
      showToast('Please specify recipient username', 'error');
      return;
    }
    if (giftTicketEvent.ticketPriceFic > 0 && ficBalance < giftTicketEvent.ticketPriceFic) {
      showToast('Insufficient FIC balance to gift this ticket', 'error');
      return;
    }

    showToast(`Gift ticket for "${giftTicketEvent.title}" transferred to @${giftRecipient}!`, 'success');
    setGiftTicketEvent(null);
    setGiftRecipient('');
  };

  const handleCreatePaylink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paylinkEvent) return;
    showToast(`Paylink generated: https://fingermobileprotocol.com/pay/event/${paylinkEvent.id}`, 'success');
    setPaylinkEvent(null);
    setPaylinkDescription('');
  };

  const handleHostEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostForm.title || !hostForm.location) {
      showToast('Please provide event title and location', 'error');
      return;
    }

    const newEvent: PlatformEvent = {
      id: `ev-${Date.now()}`,
      title: hostForm.title,
      category: hostForm.category,
      isVirtual: hostForm.isVirtual,
      streamPlatform: hostForm.isVirtual ? hostForm.streamPlatform : undefined,
      location: hostForm.location,
      startDate: hostForm.startDate ? new Date(hostForm.startDate).toISOString() : new Date().toISOString(),
      endDate: hostForm.startDate ? new Date(hostForm.startDate).toISOString() : new Date().toISOString(),
      timeString: hostForm.timeString || '10:00 AM – 2:00 PM WAT',
      ticketPriceFic: hostForm.ticketPriceFic,
      ticketPriceNgn: hostForm.ticketPriceFic * 1000,
      capacity: hostForm.capacity,
      attendeesCount: 1,
      imageUrl: hostForm.imageUrl,
      description: hostForm.description,
      organizer: {
        name: 'You (Organizer)',
        handle: 'you',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        isVerified: true
      },
      isRsvpd: true
    };

    setEvents([newEvent, ...events]);
    setIsHostModalOpen(false);
    showToast(`Event "${newEvent.title}" published to community calendar!`, 'success');
  };

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesSearch =
        ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.organizer.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || ev.category === selectedCategory;
      const matchesFormat =
        formatFilter === 'all' ||
        (formatFilter === 'virtual' && ev.isVirtual) ||
        (formatFilter === 'physical' && !ev.isVirtual);

      return matchesSearch && matchesCategory && matchesFormat;
    });
  }, [events, searchTerm, selectedCategory, formatFilter]);

  return (
    <MainLayout pageTitle="Community Events">
      <div className="min-h-screen bg-slate-50 text-gray-900 pb-16">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
                <CalendarIcon className="w-4 h-4 text-blue-400" />
                Community Events, Live Stages & Conferences
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Platform Events Calendar
              </h1>
              <p className="mt-2 text-blue-200 text-sm max-w-2xl">
                Attend flagship tech summits, live music streams on Dancia-4Tv, competitive gaming showdowns, and sovereign workshops worldwide.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsHostModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-sm font-bold shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-transform hover:scale-105"
              >
                <PlusIcon className="w-5 h-5" />
                Host Community Event
              </button>
            </div>
          </div>
        </div>

        {/* Toolbar & Filter Deck */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-5 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search events, venues, organizers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Venue:</span>
                {(['all', 'physical', 'virtual'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormatFilter(fmt)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                      formatFilter === fmt
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-gray-100">
              {['All', 'Conferences', 'Music & Concerts', 'Workshops', 'Esports & Gaming', 'Virtual AMAs'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Events Roster (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-blue-600" />
                  Upcoming Gatherings ({filteredEvents.length})
                </h2>
                <span className="text-xs text-gray-400 font-semibold">
                  Live Attendance & Dancia-4Tv Virtual Access
                </span>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm">
                  <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-gray-800">No events found</h3>
                  <p className="text-xs text-gray-500 mt-1">Try resetting the search filters or view all categories.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setFormatFilter('all');
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col md:flex-row group"
                    >
                      {/* Event Banner */}
                      <div className="md:w-72 h-48 md:h-auto relative bg-slate-900 flex-shrink-0 overflow-hidden">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:hidden"></div>

                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/20">
                            {event.category}
                          </span>
                          {event.isVirtual ? (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-600 text-white flex items-center gap-1 shadow-md">
                              <VideoCameraIcon className="w-3 h-3" />
                              Virtual Stream
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-md">
                              <MapPinIcon className="w-3 h-3" />
                              Physical Venue
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-3 md:hidden text-white font-black text-sm">
                          {event.ticketPriceFic === 0 ? 'FREE ADMISSION' : `${event.ticketPriceFic} FIC`}
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                                <ClockIcon className="w-3.5 h-3.5" />
                                {new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} · {event.timeString}
                              </span>
                              <h3 className="text-lg font-black text-gray-900 mt-1 leading-snug group-hover:text-blue-600 transition-colors">
                                {event.title}
                              </h3>
                            </div>

                            <div className="hidden md:block text-right flex-shrink-0">
                              <span className="text-base font-black text-gray-900 block">
                                {event.ticketPriceFic === 0 ? (
                                  <span className="text-emerald-600">FREE</span>
                                ) : (
                                  `${event.ticketPriceFic} FIC`
                                )}
                              </span>
                              {event.ticketPriceFic > 0 && (
                                <span className="text-[10px] text-gray-400">₦{event.ticketPriceNgn.toLocaleString()}</span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>

                          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                            <MapPinIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>

                          <div className="mt-3 flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <img
                                src={event.organizer.avatarUrl}
                                alt={event.organizer.name}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="text-xs font-semibold text-gray-700">By {event.organizer.name}</span>
                            </div>
                            <span className="font-bold text-gray-700">
                              {event.attendeesCount.toLocaleString()} / {event.capacity.toLocaleString()} RSVP&apos;d
                            </span>
                          </div>
                        </div>

                        {/* Actions Strip */}
                        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleAddToCalendar(event)}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                            title="Add to Google/Apple Calendar"
                          >
                            <CalendarIcon className="w-4 h-4" />
                            <span>Add .ICS</span>
                          </button>

                          <button
                            onClick={() => setGiftTicketEvent(event)}
                            className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <GiftIcon className="w-4 h-4" />
                            <span>Gift</span>
                          </button>

                          <button
                            onClick={() => setPaylinkEvent(event)}
                            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <LinkIcon className="w-4 h-4" />
                            <span>Paylink</span>
                          </button>

                          <div className="ml-auto flex items-center gap-2">
                            <button
                              onClick={() => setSelectedEventForDetails(event)}
                              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-colors"
                            >
                              Overview
                            </button>

                            <button
                              onClick={() => setTicketCheckoutEvent(event)}
                              className={`px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ${
                                event.isRsvpd
                                  ? 'bg-green-600 hover:bg-green-700 text-white'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
                              }`}
                            >
                              {event.isRsvpd ? (
                                <>
                                  <CheckCircleIcon className="w-4 h-4" />
                                  <span>RSVP Confirmed</span>
                                </>
                              ) : (
                                <>
                                  <TagIcon className="w-4 h-4" />
                                  <span>{event.ticketPriceFic === 0 ? 'RSVP Free' : 'Get Ticket'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* FIC Balance Widget */}
              <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl border border-blue-800/40">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1.5">
                    <UserCircleIcon className="w-4 h-4 text-blue-400" />
                    Event Passbook & Wallet
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-300">
                    Active Passes: 2
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-blue-300 block">Available FIC Balance</span>
                    <span className="text-2xl font-black text-white">{ficBalance.toFixed(2)} FIC</span>
                  </div>
                  <button
                    onClick={() => showToast('Redirecting to Instant Wallet Top-Up', 'info')}
                    className="px-4 py-2 bg-white text-blue-950 font-black rounded-xl text-xs shadow-md hover:bg-blue-50 transition-colors"
                  >
                    + Top Up
                  </button>
                </div>
              </div>

              {/* Dancia-4Tv Live Spotlight */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  <h3 className="font-black text-gray-900 text-sm">Dancia-4Tv Virtual Stage</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Join interactive concerts, global summits, and esports streams directly through our high-performance low-latency transcode channels.
                </p>
                <div className="mt-4 p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                    <VideoCameraIcon className="w-4 h-4 text-purple-600" />
                    <span>Next Live: Afrobeats Pulse</span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-md shadow-xs">
                    In 3 Days
                  </span>
                </div>
              </div>

              {/* Sovereign Host Invitation */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-6 border border-purple-100">
                <h3 className="font-black text-gray-900 text-base">Host on FingerMobile</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Sell tickets in FIC or Fiat, stream on Dancia-4Tv, and verify attendees with cryptographic QR passes.
                </p>
                <button
                  onClick={() => setIsHostModalOpen(true)}
                  className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Launch New Event
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal 1: Ticket Checkout & RSVP */}
        {ticketCheckoutEvent && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    Ticket Acquisition
                  </span>
                  <h3 className="text-lg font-black text-gray-900 mt-1">{ticketCheckoutEvent.title}</h3>
                </div>
                <button
                  onClick={() => setTicketCheckoutEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                  <p className="text-gray-500">Date: <strong>{ticketCheckoutEvent.timeString}</strong></p>
                  <p className="text-gray-500">Venue: <strong>{ticketCheckoutEvent.location}</strong></p>
                  <p className="text-gray-500">Organizer: <strong>{ticketCheckoutEvent.organizer.name}</strong></p>
                </div>

                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 flex justify-between items-center text-sm">
                  <span className="font-semibold text-blue-900">Ticket Price:</span>
                  <span className="font-black text-blue-950 text-base">
                    {ticketCheckoutEvent.ticketPriceFic === 0 ? 'FREE RSVP' : `${ticketCheckoutEvent.ticketPriceFic} FIC`}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-gray-500 px-1">
                  <span>Your FIC Balance:</span>
                  <span className="font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                </div>

                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setTicketCheckoutEvent(null)}
                    disabled={isProcessingCheckout}
                    className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleBuyTicket(ticketCheckoutEvent)}
                    disabled={isProcessingCheckout}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5"
                  >
                    {isProcessingCheckout ? (
                      'Confirming On-Chain...'
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        <span>Confirm Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Gift Ticket Modal */}
        {giftTicketEvent && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <GiftIcon className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-black text-gray-900">Gift Event Ticket</h3>
                </div>
                <button onClick={() => setGiftTicketEvent(null)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendGift} className="mt-5 space-y-4">
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-xs">
                  <p className="font-bold text-purple-950">{giftTicketEvent.title}</p>
                  <p className="text-purple-700 mt-0.5">Price: {giftTicketEvent.ticketPriceFic} FIC</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Recipient Membername</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. emeka_creator or kofi_beats"
                    value={giftRecipient}
                    onChange={(e) => setGiftRecipient(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setGiftTicketEvent(null)}
                    className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30"
                  >
                    Send Ticket Gift
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 3: Paylink Generator */}
        {paylinkEvent && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-lg font-black text-gray-900">Create Ticket Paylink</h3>
                </div>
                <button onClick={() => setPaylinkEvent(null)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePaylink} className="mt-5 space-y-4">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs">
                  <p className="font-bold text-emerald-950">{paylinkEvent.title}</p>
                  <p className="text-emerald-700 mt-0.5">Amount: {paylinkEvent.ticketPriceFic} FIC</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Paylink Note / Campaign</label>
                  <input
                    type="text"
                    placeholder="e.g. VIP Group Pass or Twitter Community Link"
                    value={paylinkDescription}
                    onChange={(e) => setPaylinkDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setPaylinkEvent(null)}
                    className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30"
                  >
                    Generate Paylink
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 4: Event Overview Details */}
        {selectedEventForDetails && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase">
                    {selectedEventForDetails.category}
                  </span>
                  <h3 className="text-xl font-black text-gray-900 mt-1">{selectedEventForDetails.title}</h3>
                </div>
                <button onClick={() => setSelectedEventForDetails(null)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-5">
                <div className="rounded-2xl overflow-hidden h-60 bg-slate-900">
                  <img
                    src={selectedEventForDetails.imageUrl}
                    alt={selectedEventForDetails.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedEventForDetails.description}
                </p>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date & Time:</span>
                    <span className="font-bold text-gray-900">{selectedEventForDetails.timeString}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Venue:</span>
                    <span className="font-bold text-gray-900">{selectedEventForDetails.location}</span>
                  </div>
                  {selectedEventForDetails.streamPlatform && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Livestream:</span>
                      <span className="font-bold text-purple-700">{selectedEventForDetails.streamPlatform}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Capacity / Registered:</span>
                    <span className="font-bold text-gray-900">
                      {selectedEventForDetails.attendeesCount} / {selectedEventForDetails.capacity} Attendees
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold">Admission</span>
                    <span className="text-xl font-black text-gray-900">
                      {selectedEventForDetails.ticketPriceFic === 0 ? 'FREE' : `${selectedEventForDetails.ticketPriceFic} FIC`}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const target = selectedEventForDetails;
                        setSelectedEventForDetails(null);
                        setTicketCheckoutEvent(target);
                      }}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30"
                    >
                      Acquire Pass
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal 5: Host New Event */}
        {isHostModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Host Community Event</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Publish your conference, live stage or virtual meetup</p>
                </div>
                <button onClick={() => setIsHostModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleHostEventSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Afrobeats Sync Masterclass 2026"
                    value={hostForm.title}
                    onChange={(e) => setHostForm({ ...hostForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                    <select
                      value={hostForm.category}
                      onChange={(e) => setHostForm({ ...hostForm, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="Conferences">Conferences</option>
                      <option value="Music & Concerts">Music & Concerts</option>
                      <option value="Workshops">Workshops</option>
                      <option value="Esports & Gaming">Esports & Gaming</option>
                      <option value="Virtual AMAs">Virtual AMAs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Format</label>
                    <div className="flex items-center gap-2 pt-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hostForm.isVirtual}
                          onChange={(e) => setHostForm({ ...hostForm, isVirtual: e.target.checked })}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <span>Virtual (Dancia-4Tv)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    {hostForm.isVirtual ? 'Stream Link / Room Name' : 'Physical Location / Address'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={hostForm.isVirtual ? 'e.g. Dancia-4Tv Virtual Stage Room A' : 'e.g. Landmark Centre, Water Corporation Drive, Victoria Island'}
                    value={hostForm.location}
                    onChange={(e) => setHostForm({ ...hostForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ticket Price (FIC)</label>
                    <input
                      type="number"
                      min="0"
                      value={hostForm.ticketPriceFic}
                      onChange={(e) => setHostForm({ ...hostForm, ticketPriceFic: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Total Capacity</label>
                    <input
                      type="number"
                      min="10"
                      value={hostForm.capacity}
                      onChange={(e) => setHostForm({ ...hostForm, capacity: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description & Outline</label>
                  <textarea
                    rows={3}
                    placeholder="Describe agenda, keynote speakers, and what attendees should expect..."
                    value={hostForm.description}
                    onChange={(e) => setHostForm({ ...hostForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsHostModalOpen(false)}
                    className="flex-1 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30"
                  >
                    Publish Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default EventsPage;
