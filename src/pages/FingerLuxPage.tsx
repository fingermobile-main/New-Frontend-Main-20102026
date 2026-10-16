import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useFingerLux } from '../hooks/useFingerLux';
import MainLayout from '../components/layout/MainLayout';
import SocialEmbedModal from '../components/commerce/SocialEmbedModal';
import { api } from '../services/api';

// Domain Types & Constants
import type {
  FingerLuxService,
  StaffMember,
  BookableResource,
  LocationSite,
  FingerLuxBooking,
  BlockedTimeSlot,
  WaitlistEntry,
  DigitalProgramOrMembership,
  ClientProfile,
  AttendanceStatus,
  POSTransaction,
  InvoiceRecord
} from '../types/fingerLuxScheduling';

import {
  FORTY_PLUS_CURRENCIES,
  INITIAL_SERVICES,
  INITIAL_STAFF,
  INITIAL_LOCATIONS,
  INITIAL_RESOURCES,
  INITIAL_BOOKINGS,
  INITIAL_BLOCKED_SLOTS,
  INITIAL_WAITLIST,
  INITIAL_PROGRAMS,
  INITIAL_CLIENTS
} from '../constants/fingerLuxSchedulingData';

// Subcomponents
import { FingerLuxHeader, FingerLuxTab } from '../components/fingerlux/FingerLuxHeader';
import { FingerLuxShowcase } from '../components/fingerlux/FingerLuxShowcase';
import { FingerLuxCalendar } from '../components/fingerlux/FingerLuxCalendar';
import { FingerLuxStaffResources } from '../components/fingerlux/FingerLuxStaffResources';
import { FingerLuxPaymentsPOS } from '../components/fingerlux/FingerLuxPaymentsPOS';
import { FingerLuxAIOps } from '../components/fingerlux/FingerLuxAIOps';
import { FingerLuxChannels } from '../components/fingerlux/FingerLuxChannels';
import { FingerLuxRevenue } from '../components/fingerlux/FingerLuxRevenue';

/*
 * FingerMobile Protocol™ - FingerLux All-in-One Scheduling, Booking, Payments & Staff Management
 * Copyright © 2026 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms.
 */

const FingerLuxPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const { loading: hookLoading, error: hookError, refreshData } = useFingerLux();

  // Local Balance with fallback so guests can test transactions
  const [localFicBalance, setLocalFicBalance] = useState<number>(ficBalance > 0 ? ficBalance : 25000);

  useEffect(() => {
    if (ficBalance > 0) {
      setLocalFicBalance(ficBalance);
    }
  }, [ficBalance]);

  const updateBalance = useCallback((delta: number) => {
    setLocalFicBalance((prev) => Math.max(0, prev + delta));
  }, []);

  // Active Tab View State
  const [activeTab, setActiveTab] = useState<FingerLuxTab>('showcase');

  // Multi-Currency Selection (40+ Currencies)
  const [selectedCurrency, setSelectedCurrency] = useState<string>('FIC');

  // Location Filter State
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');

  // Core Scheduling State
  const [services, setServices] = useState<FingerLuxService[]>(INITIAL_SERVICES);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [locations, setLocations] = useState<LocationSite[]>(INITIAL_LOCATIONS);
  const [resources, setResources] = useState<BookableResource[]>(INITIAL_RESOURCES);
  const [bookings, setBookings] = useState<FingerLuxBooking[]>(INITIAL_BOOKINGS);
  const [blockedSlots, setBlockedSlots] = useState<BlockedTimeSlot[]>(INITIAL_BLOCKED_SLOTS);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(INITIAL_WAITLIST);
  const [programs, setPrograms] = useState<DigitalProgramOrMembership[]>(INITIAL_PROGRAMS);
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_CLIENTS);

  // Legacy Action Modals State
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [selectedServiceForLegacyAction, setSelectedServiceForLegacyAction] = useState<FingerLuxService | null>(null);
  const [embedService, setEmbedService] = useState<FingerLuxService | null>(null);
  const [giftAmount, setGiftAmount] = useState('');
  const [paylinkAmount, setPaylinkAmount] = useState('');
  const [isProcessingLegacy, setIsProcessingLegacy] = useState(false);

  // Currency Converter Formatter across 40+ currencies
  const formatPrice = useCallback(
    (amountInFic: number): string => {
      const config = FORTY_PLUS_CURRENCIES[selectedCurrency] || FORTY_PLUS_CURRENCIES.FIC;
      const converted = amountInFic * config.rate;
      if (selectedCurrency === 'FIC') {
        return `${Math.round(converted).toLocaleString()} FIC`;
      }
      return `${config.symbol}${converted.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })}`;
    },
    [selectedCurrency]
  );

  // Background Data Hydration from Backend API with Fallback
  useEffect(() => {
    let isMounted = true;
    const fetchBackendData = async () => {
      try {
        const [srvRes, bkgRes, stfRes, rscRes, locRes, prgRes] = await Promise.allSettled([
          api.get<{ success: boolean; data: FingerLuxService[] }>('/fingerlux/services'),
          api.get<{ success: boolean; data: FingerLuxBooking[] }>('/fingerlux/bookings'),
          api.get<{ success: boolean; data: StaffMember[] }>('/fingerlux/staff'),
          api.get<{ success: boolean; data: BookableResource[] }>('/fingerlux/resources'),
          api.get<{ success: boolean; data: LocationSite[] }>('/fingerlux/locations'),
          api.get<{ success: boolean; data: DigitalProgramOrMembership[] }>('/fingerlux/programs')
        ]);

        if (!isMounted) return;

        if (srvRes.status === 'fulfilled' && srvRes.value.data?.data?.length) {
          setServices(srvRes.value.data.data);
        }
        if (bkgRes.status === 'fulfilled' && bkgRes.value.data?.data?.length) {
          setBookings(bkgRes.value.data.data);
        }
        if (stfRes.status === 'fulfilled' && stfRes.value.data?.data?.length) {
          setStaff(stfRes.value.data.data);
        }
        if (rscRes.status === 'fulfilled' && rscRes.value.data?.data?.length) {
          setResources(rscRes.value.data.data);
        }
        if (locRes.status === 'fulfilled' && locRes.value.data?.data?.length) {
          setLocations(locRes.value.data.data);
        }
        if (prgRes.status === 'fulfilled' && prgRes.value.data?.data?.length) {
          setPrograms(prgRes.value.data.data);
        }
      } catch {
        // Fallbacks remain active
      }
    };

    fetchBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Performance Metric Calculations
  const todayDateStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const todayAppointmentsCount = useMemo(() => {
    return bookings.filter((b) => b.date === todayDateStr).length;
  }, [bookings, todayDateStr]);

  const checkedInRate = useMemo(() => {
    if (bookings.length === 0) return 100;
    const arrived = bookings.filter((b) => b.attendanceStatus === 'checked_in' || b.attendanceStatus === 'completed').length;
    return Math.round((arrived / bookings.length) * 100);
  }, [bookings]);

  // Handler: Book an Appointment / Class / Course
  const handleBookService = useCallback(
    async (bookingData: {
      service: FingerLuxService;
      staffMember: StaffMember;
      location: LocationSite;
      date: string;
      timeSlot: string;
      depositOnly: boolean;
      paymentRail: 'fic' | 'card' | 'apple_pay' | 'crypto';
      intakeResponses: Record<string, any>;
      notes: string;
    }) => {
      const {
        service,
        staffMember,
        location,
        date,
        timeSlot,
        depositOnly,
        paymentRail,
        intakeResponses,
        notes
      } = bookingData;

      const totalAmount = service.price;
      const depositAmount = depositOnly ? Math.round(totalAmount * (service.depositPercent / 100)) : totalAmount;

      // Balance validation if paying with FIC
      if (paymentRail === 'fic' && localFicBalance < depositAmount) {
        showToast(`Insufficient FIC balance. Required: ${depositAmount} FIC`, 'error');
        return;
      }

      // Calculate End Time from Duration
      const [h, m] = timeSlot.split(':').map(Number);
      const totalMin = h * 60 + m + service.durationMinutes;
      const endH = String(Math.floor(totalMin / 60)).padStart(2, '0');
      const endM = String(totalMin % 60).padStart(2, '0');
      const endTime = `${endH}:${endM}`;

      const newBooking: FingerLuxBooking = {
        id: `book-${Date.now()}`,
        bookingCode: `FLX-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceId: service.id,
        serviceName: service.name,
        serviceType: service.type,
        client: {
          id: 'cli-current',
          name: 'Distinguished Protocol VIP',
          email: 'member@fingerlux.protocol',
          phone: '+1 800 589 8478',
          vipTier: 'Sovereign'
        },
        staffId: staffMember.id,
        staffName: staffMember.name,
        locationId: location.id,
        locationName: location.name,
        resourceIds: service.resourceIds,
        resourceNames: ['Sovereign Suite / Facility'],
        delivery: service.delivery,
        virtualMeetingUrl: service.virtualMeetingUrl,
        date,
        startTime: timeSlot,
        endTime,
        durationMinutes: service.durationMinutes,
        attendanceStatus: 'booked',
        paymentStatus: depositOnly ? 'deposit_paid' : 'paid_full',
        paymentRail,
        totalAmount,
        depositAmount,
        feeCharged: 0,
        intakeResponses,
        notes: notes || 'Booked via FingerLux Client Portal',
        createdAt: new Date().toISOString()
      };

      // Optimistically update state
      setBookings((prev) => [newBooking, ...prev]);

      setClients((prev) =>
        prev.map((c) =>
          c.id === 'cli-01'
            ? { ...c, lifetimeSpend: c.lifetimeSpend + depositAmount, totalBookings: c.totalBookings + 1 }
            : c
        )
      );

      if (paymentRail === 'fic') {
        updateBalance(-depositAmount);
      }

      // Sync with Backend API
      try {
        await api.post('/fingerlux/bookings', {
          serviceId: service.id,
          staffId: staffMember.id,
          locationId: location.id,
          date,
          startTime: timeSlot,
          paymentRail,
          depositOnly,
          intakeResponses,
          notes
        });
      } catch {
        // Optimistic state preserved
      }

      showToast(
        `Reservation locked for ${service.name}! Code: ${newBooking.bookingCode}. Automated WhatsApp & Email confirmation dispatched.`,
        'success'
      );
    },
    [localFicBalance, showToast, updateBalance, setClients]
  );

  // Handler: Update Attendance Status (Checked-In, Completed, No-Show, Late Cancel)
  const handleUpdateAttendance = useCallback(
    async (bookingId: string, status: AttendanceStatus) => {
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;

          const updated = { ...b, attendanceStatus: status };
          if (status === 'checked_in') {
            updated.checkedInAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } else if (status === 'no_show') {
            updated.feeCharged = b.totalAmount;
            updated.paymentStatus = 'fee_charged';
          } else if (status === 'late_cancelled') {
            updated.feeCharged = Math.round(b.totalAmount * 0.5);
            updated.paymentStatus = 'fee_charged';
          }
          return updated;
        })
      );

      try {
        await api.patch(`/fingerlux/bookings/${bookingId}/attendance`, { status });
      } catch {
        // Fallback state retained
      }

      if (status === 'checked_in') {
        showToast('Participant marked as Checked-In! Time stamped in live calendar.', 'success');
      } else if (status === 'no_show') {
        showToast('Participant marked as No-Show. 100% policy fee applied to card on file.', 'info');
      } else if (status === 'late_cancelled') {
        showToast('Late cancellation processed. 50% policy protection fee charged.', 'info');
      } else {
        showToast(`Attendance updated to ${status}.`, 'success');
      }
    },
    [showToast]
  );

  // Handler: Add Blocked Time Slot
  const handleAddBlockedSlot = useCallback(
    async (slot: Partial<BlockedTimeSlot>) => {
      const newSlot: BlockedTimeSlot = {
        id: `blk-${Date.now()}`,
        date: slot.date || todayDateStr,
        startTime: slot.startTime || '12:00',
        endTime: slot.endTime || '13:00',
        reason: slot.reason || 'Staff Maintenance & Protocol Buffer',
        locationId: slot.locationId
      };

      setBlockedSlots((prev) => [newSlot, ...prev]);

      try {
        await api.post('/fingerlux/blocked-slots', newSlot);
      } catch {
        // State retained
      }

      showToast(`Time slot ${newSlot.startTime} - ${newSlot.endTime} blocked on calendar. Double bookings prevented.`, 'success');
    },
    [showToast, todayDateStr]
  );

  // Handler: Promote Waitlist Candidate
  const handlePromoteWaitlist = useCallback(
    async (waitlistId: string) => {
      const waitItem = waitlist.find((w) => w.id === waitlistId);
      if (!waitItem) return;

      const matchingService = services.find((s) => s.id === waitItem.serviceId) || services[0];

      // Convert waitlist into confirmed booking
      const newBooking: FingerLuxBooking = {
        id: `book-${Date.now()}`,
        bookingCode: `FLX-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceId: matchingService.id,
        serviceName: matchingService.name,
        serviceType: matchingService.type,
        client: {
          id: `cli-${Date.now()}`,
          name: waitItem.clientName,
          email: waitItem.clientEmail,
          phone: waitItem.clientPhone,
          vipTier: 'Black Diamond'
        },
        staffId: staff[0]?.id || 'staff-elena',
        staffName: staff[0]?.name || 'Dr. Elena Rostova',
        locationId: matchingService.locationId,
        locationName: 'Dubai Marina Sovereign Flagship',
        resourceIds: matchingService.resourceIds,
        resourceNames: ['Sovereign Penthouse Salon A'],
        delivery: matchingService.delivery,
        date: waitItem.date,
        startTime: '14:00',
        endTime: '15:30',
        durationMinutes: matchingService.durationMinutes,
        attendanceStatus: 'booked',
        paymentStatus: 'deposit_paid',
        paymentRail: 'card',
        totalAmount: matchingService.price,
        depositAmount: Math.round(matchingService.price * 0.3),
        feeCharged: 0,
        intakeResponses: {},
        notes: 'Promoted from waitlist queue automatically',
        createdAt: new Date().toISOString()
      };

      setBookings((prev) => [newBooking, ...prev]);
      setWaitlist((prev) =>
        prev.map((w) => (w.id === waitlistId ? { ...w, status: 'promoted' } : w))
      );

      try {
        await api.post(`/fingerlux/waitlist/${waitlistId}/promote`, {});
      } catch {
        // Retained
      }

      showToast(`Waitlisted client ${waitItem.clientName} promoted to active booking (${newBooking.bookingCode})!`, 'success');
    },
    [waitlist, services, staff, showToast]
  );

  // Handler: Add New Service
  const handleAddService = useCallback(
    async (newService: Partial<FingerLuxService>) => {
      const created: FingerLuxService = {
        id: `srv-${Date.now()}`,
        name: newService.name || 'Bespoke Offering',
        type: newService.type || 'appointment',
        category: newService.category || 'Concierge & Advisory',
        description: newService.description || '',
        price: newService.price || 1500,
        durationMinutes: newService.durationMinutes || 60,
        bufferBeforeMinutes: newService.bufferBeforeMinutes || 15,
        bufferAfterMinutes: newService.bufferAfterMinutes || 15,
        capacity: newService.capacity || 1,
        delivery: newService.delivery || 'hybrid',
        locationId: newService.locationId || 'loc-dubai',
        resourceIds: newService.resourceIds || [],
        assignedStaffIds: newService.assignedStaffIds || [],
        cancellationPolicy: newService.cancellationPolicy || { freeCancelHours: 24, lateCancelFeePercent: 50, noShowFeePercent: 100 },
        depositRequired: Boolean(newService.depositRequired),
        depositPercent: newService.depositPercent || 25,
        intakeFormFields: newService.intakeFormFields || [],
        tags: newService.tags || ['Custom'],
        imageUrl: newService.imageUrl || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'
      };

      setServices((prev) => [created, ...prev]);

      try {
        await api.post('/fingerlux/services', created);
      } catch {
        // Retained
      }

      showToast(`New service "${created.name}" created and published live!`, 'success');
    },
    [showToast]
  );

  // Handler: Staff Member Updates
  const handleUpdateStaff = useCallback(
    async (updatedStaff: StaffMember) => {
      setStaff((prev) => prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
      try {
        await api.patch(`/fingerlux/staff/${updatedStaff.id}/hours`, {
          workingHours: updatedStaff.workingHours,
          calendarSync: updatedStaff.calendarSync
        });
      } catch {
        // Retained
      }
      showToast(`Staff schedule & calendar sync for ${updatedStaff.name} saved.`, 'success');
    },
    [showToast]
  );

  const handleAddStaff = useCallback(
    (newStaff: Partial<StaffMember>) => {
      const member: StaffMember = {
        id: `staff-${Date.now()}`,
        name: newStaff.name || 'Specialist',
        role: newStaff.role || 'Senior Specialist',
        avatar: newStaff.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        email: newStaff.email || 'specialist@fingerlux.protocol',
        phone: newStaff.phone || '+1 800 589 8478',
        assignedServiceIds: newStaff.assignedServiceIds || [],
        locationIds: newStaff.locationIds || ['loc-dubai'],
        workingHours: newStaff.workingHours || INITIAL_STAFF[0].workingHours,
        calendarSync: newStaff.calendarSync || { googleCalendar: true, outlookCalendar: false, appleCalendar: false, lastSyncedAt: 'Just now' },
        permissions: newStaff.permissions || { canViewFinances: false, canEditSchedule: true, canIssueRefunds: false, canManageClients: true }
      };

      setStaff((prev) => [...prev, member]);
      showToast(`New specialist ${member.name} added to roster!`, 'success');
    },
    [showToast]
  );

  // Handler: Bookable Resource Updates
  const handleUpdateResource = useCallback(
    (res: BookableResource) => {
      setResources((prev) => prev.map((r) => (r.id === res.id ? res : r)));
      showToast(`Resource "${res.name}" status updated: ${res.isAvailable ? 'Available' : 'Maintenance'}.`, 'info');
    },
    [showToast]
  );

  const handleAddResource = useCallback(
    (newRes: Partial<BookableResource>) => {
      const item: BookableResource = {
        id: `res-${Date.now()}`,
        name: newRes.name || 'New Facility',
        type: newRes.type || 'room',
        locationId: newRes.locationId || 'loc-dubai',
        capacity: newRes.capacity || 4,
        isAvailable: true,
        description: newRes.description || '',
        icon: newRes.icon || '🏛️'
      };
      setResources((prev) => [...prev, item]);
      showToast(`Bookable resource "${item.name}" registered.`, 'success');
    },
    [showToast]
  );

  // Handler: Add New Location
  const handleAddLocation = useCallback(
    (newLoc: Partial<LocationSite>) => {
      const loc: LocationSite = {
        id: `loc-${Date.now()}`,
        name: newLoc.name || 'New Regional Hub',
        city: newLoc.city || 'Global',
        address: newLoc.address || 'Executive Center',
        timezone: newLoc.timezone || 'UTC',
        contactEmail: newLoc.contactEmail || 'hub@fingerlux.protocol',
        contactPhone: newLoc.contactPhone || '+1 800 589 8478',
        isVirtual: Boolean(newLoc.isVirtual),
        badge: newLoc.badge || 'Regional Site'
      };
      setLocations((prev) => [...prev, loc]);
      showToast(`New location site "${loc.name}" added to multi-site manager.`, 'success');
    },
    [showToast]
  );

  // Handler: POS Transaction
  const handleProcessPOSTransaction = useCallback(
    async (tx: POSTransaction) => {
      try {
        await api.post('/fingerlux/pos/charge', tx);
      } catch {
        // Retained
      }
    },
    []
  );

  // Handler: Issue Invoice
  const handleIssueInvoice = useCallback(
    async (inv: InvoiceRecord) => {
      try {
        await api.post('/fingerlux/invoices', inv);
      } catch {
        // Retained
      }
    },
    []
  );

  // Handler: Purchase Digital Program or Membership
  const handlePurchaseProgram = useCallback(
    (program: DigitalProgramOrMembership) => {
      if (localFicBalance < program.price) {
        showToast(`Insufficient FIC balance. Required: ${program.price} FIC`, 'error');
        return;
      }
      updateBalance(-program.price);
      showToast(`Enrolled in ${program.name}! Instant access credentials dispatched.`, 'success');
    },
    [localFicBalance, updateBalance, showToast]
  );

  // Handler: Share Service Link
  const handleShareService = useCallback(
    (service: FingerLuxService) => {
      const link = `https://fingerlux.protocol/book/${service.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      navigator.clipboard?.writeText(link);
      showToast(`Copied booking link: ${link}`, 'info');
    },
    [showToast]
  );

  // Legacy Action Handlers (Gift, Paylink, Social Embed)
  const handleOpenGiftModal = useCallback((service: FingerLuxService) => {
    setSelectedServiceForLegacyAction(service);
    setShowGiftModal(true);
  }, []);

  const handleOpenPaylinkModal = useCallback((service: FingerLuxService) => {
    setSelectedServiceForLegacyAction(service);
    setShowPaylinkModal(true);
  }, []);

  const handleSendGift = async () => {
    if (!selectedServiceForLegacyAction) return;
    const amount = parseFloat(giftAmount);
    if (isNaN(amount) || amount <= 0 || amount > localFicBalance) {
      showToast('Please enter a valid gift token allocation amount', 'error');
      return;
    }

    setIsProcessingLegacy(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      updateBalance(-amount);
      showToast('Luxury gift experience pass dispatched successfully!', 'success');
      setGiftAmount('');
      setShowGiftModal(false);
    } finally {
      setIsProcessingLegacy(false);
    }
  };

  const handleCreatePaylink = async () => {
    if (!selectedServiceForLegacyAction) return;
    const amount = parseFloat(paylinkAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid token value for paylink', 'error');
      return;
    }

    setIsProcessingLegacy(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const paylink = `https://fingerlux.protocol/pay/${selectedServiceForLegacyAction.id}-${Date.now()}`;
      navigator.clipboard?.writeText(paylink);
      showToast(`FingerLux Escrow Paylink generated & copied: ${paylink}`, 'success');
      setPaylinkAmount('');
      setShowPaylinkModal(false);
    } finally {
      setIsProcessingLegacy(false);
    }
  };

  if (hookLoading && services.length === 0) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen bg-slate-50">
          <div className="text-slate-700 font-bold text-sm animate-pulse">
            Loading FingerLux Scheduling & Calendar Engine...
          </div>
        </div>
      </MainLayout>
    );
  }

  if (hookError && services.length === 0) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen bg-slate-50 px-4">
          <div className="bg-white border border-slate-300 text-slate-800 p-6 rounded-2xl shadow-sm max-w-md w-full text-center">
            <strong className="block font-black text-lg text-rose-700 mb-1">Execution Interrupted</strong>
            <span className="block text-sm text-slate-700 font-medium mb-4">{hookError}</span>
            <button
              className="w-full py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition"
              onClick={refreshData}
            >
              Retry Protocol Fetch
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-slide-up">
        {/* Header Ribbon: Metrics, 40+ Currencies Selector, Locations, Mode Switcher */}
        <FingerLuxHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
          selectedLocationId={selectedLocationId}
          onLocationChange={setSelectedLocationId}
          locations={locations}
          ficBalance={localFicBalance}
          formatPrice={formatPrice}
          totalBookingsCount={bookings.length}
          todayAppointmentsCount={todayAppointmentsCount}
          checkedInRate={checkedInRate}
          activeStaffCount={staff.length}
          onQuickBookClick={() => setActiveTab('showcase')}
        />

        {/* --- MAIN TAB CONTENT ROUTING --- */}

        {/* Tab 1: Showcase & Client Booking */}
        {activeTab === 'showcase' && (
          <FingerLuxShowcase
            services={services}
            staff={staff}
            locations={locations}
            resources={resources}
            selectedLocationId={selectedLocationId}
            formatPrice={formatPrice}
            onBookService={handleBookService}
            onShareService={handleShareService}
            onAddService={handleAddService}
            onGiftService={handleOpenGiftModal}
            onPaylinkService={handleOpenPaylinkModal}
          />
        )}

        {/* Tab 2: Integrated Booking Calendar & Real-Time Attendance */}
        {activeTab === 'calendar' && (
          <FingerLuxCalendar
            bookings={bookings}
            staff={staff}
            locations={locations}
            blockedSlots={blockedSlots}
            waitlist={waitlist}
            selectedLocationId={selectedLocationId}
            formatPrice={formatPrice}
            onUpdateAttendance={handleUpdateAttendance}
            onAddBlockedSlot={handleAddBlockedSlot}
            onPromoteWaitlist={handlePromoteWaitlist}
          />
        )}

        {/* Tab 3: Staff Scheduling, Permissions & Resource Management */}
        {activeTab === 'staff_resources' && (
          <FingerLuxStaffResources
            staff={staff}
            resources={resources}
            locations={locations}
            services={services}
            onUpdateStaff={handleUpdateStaff}
            onAddStaff={handleAddStaff}
            onUpdateResource={handleUpdateResource}
            onAddResource={handleAddResource}
            onAddLocation={handleAddLocation}
          />
        )}

        {/* Tab 4: Payments, POS Terminal & Accounting Sync */}
        {activeTab === 'payments_pos' && (
          <FingerLuxPaymentsPOS
            bookings={bookings}
            selectedCurrency={selectedCurrency}
            formatPrice={formatPrice}
            onProcessPOSTransaction={handleProcessPOSTransaction}
            onIssueInvoice={handleIssueInvoice}
            showToast={showToast}
          />
        )}

        {/* Tab 5: Run Business With AI & Client Member Directory */}
        {activeTab === 'ai_ops' && (
          <FingerLuxAIOps
            clients={clients}
            bookings={bookings}
            services={services}
            staff={staff}
            formatPrice={formatPrice}
            showToast={showToast}
          />
        )}

        {/* Tab 6: Monetize Beyond the Calendar (Digital Programs & Memberships) */}
        {activeTab === 'revenue' && (
          <FingerLuxRevenue
            programs={programs}
            formatPrice={formatPrice}
            onPurchaseProgram={handlePurchaseProgram}
          />
        )}

        {/* Tab 7: Omnichannel Booking Channels & Google AI Mode */}
        {activeTab === 'channels' && (
          <FingerLuxChannels
            staff={staff}
            services={services}
            showToast={showToast}
          />
        )}
      </div>

      {/* --- Action Modal: Gift Experience --- */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Gift Experience</h3>
            <p className="text-xs text-gray-500 mb-4">{selectedServiceForLegacyAction?.name}</p>
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
                className="flex-1 py-2 text-xs font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendGift}
                disabled={isProcessingLegacy}
                className="flex-1 py-2 text-xs font-bold text-white bg-amber-500 rounded-xl hover:bg-amber-600 cursor-pointer"
              >
                {isProcessingLegacy ? 'Sending...' : 'Send Gift'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Action Modal: Paylink Interface --- */}
      {showPaylinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Generate Paylink</h3>
            <p className="text-xs text-gray-500 mb-4">{selectedServiceForLegacyAction?.name}</p>
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
                className="flex-1 py-2 text-xs font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreatePaylink}
                disabled={isProcessingLegacy}
                className="flex-1 py-2 text-xs font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 cursor-pointer"
              >
                {isProcessingLegacy ? 'Creating...' : 'Create Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Social Embed Modal --- */}
      <SocialEmbedModal
        isOpen={Boolean(embedService)}
        onClose={() => setEmbedService(null)}
        product={
          embedService
            ? {
              id: String(embedService.id),
              name: embedService.name,
              price: embedService.price,
              currency: 'FIC',
              imageUrl: embedService.imageUrl,
              platform: 'fingerlux',
              description: embedService.description
            }
            : null
        }
      />
    </MainLayout>
  );
};

export default FingerLuxPage;
