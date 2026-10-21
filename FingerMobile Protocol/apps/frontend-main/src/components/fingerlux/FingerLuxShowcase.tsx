import React, { useState, useMemo } from 'react';
import type {
  FingerLuxService,
  StaffMember,
  LocationSite,
  BookableResource,
  ServiceType,
  ServiceDelivery
} from '../../types/fingerLuxScheduling';
import {
  ClockIcon,
  VideoCameraIcon,
  CheckIcon,
  ShareIcon,
  PlusIcon
} from '../../icons';

interface FingerLuxShowcaseProps {
  services: FingerLuxService[];
  staff: StaffMember[];
  locations: LocationSite[];
  resources: BookableResource[];
  selectedLocationId: string;
  formatPrice: (amountInFic: number) => string;
  onBookService: (bookingData: {
    service: FingerLuxService;
    staffMember: StaffMember;
    location: LocationSite;
    date: string;
    timeSlot: string;
    depositOnly: boolean;
    paymentRail: 'fic' | 'card' | 'apple_pay' | 'crypto';
    intakeResponses: Record<string, any>;
    notes: string;
  }) => void;
  onShareService: (service: FingerLuxService) => void;
  onAddService: (newService: Partial<FingerLuxService>) => void;
  onGiftService?: (service: FingerLuxService) => void;
  onPaylinkService?: (service: FingerLuxService) => void;
}

export const FingerLuxShowcase: React.FC<FingerLuxShowcaseProps> = ({
  services,
  staff,
  locations,
  resources,
  selectedLocationId,
  formatPrice,
  onBookService,
  onShareService,
  onAddService,
  onGiftService,
  onPaylinkService
}) => {
  // Filters State
  const [selectedType, setSelectedType] = useState<'all' | ServiceType>('all');
  const [selectedDelivery, setSelectedDelivery] = useState<'all' | ServiceDelivery>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Modal State
  const [bookingModalService, setBookingModalService] = useState<FingerLuxService | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00');
  const [depositOnly, setDepositOnly] = useState<boolean>(false);
  const [paymentRail, setPaymentRail] = useState<'fic' | 'card' | 'apple_pay' | 'crypto'>('fic');
  const [intakeResponses, setIntakeResponses] = useState<Record<string, any>>({});
  const [bookingNotes, setBookingNotes] = useState<string>('');

  // New Service Modal & AI Suggestion State
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceType, setNewServiceType] = useState<ServiceType>('appointment');
  const [newServiceCategory, setNewServiceCategory] = useState('Concierge & Advisory');
  const [newServicePrice, setNewServicePrice] = useState(1500);
  const [newServiceDuration, setNewServiceDuration] = useState(60);
  const [newServiceBuffer, setNewServiceBuffer] = useState(15);
  const [newServiceDelivery, setNewServiceDelivery] = useState<ServiceDelivery>('hybrid');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceFreeCancelHours, setNewServiceFreeCancelHours] = useState(24);
  const [newServiceLateCancelFee, setNewServiceLateCancelFee] = useState(50);

  // Available Time Slots Mock Matrix
  const AVAILABLE_SLOTS = ['09:30', '11:00', '13:30', '15:00', '16:30', '18:00'];

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      if (selectedType !== 'all' && s.type !== selectedType) return false;
      if (selectedDelivery !== 'all' && s.delivery !== selectedDelivery && s.delivery !== 'hybrid') return false;
      if (selectedLocationId !== 'all' && s.locationId !== selectedLocationId && s.delivery !== 'online') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [services, selectedType, selectedDelivery, selectedLocationId, searchQuery]);

  const openBookingModal = (service: FingerLuxService) => {
    setBookingModalService(service);
    setSelectedStaffId(service.assignedStaffIds[0] || staff[0]?.id || '');
    setDepositOnly(service.depositRequired);
    setIntakeResponses({});
    setBookingNotes('');
  };

  const handleConfirmBooking = () => {
    if (!bookingModalService) return;
    const assignedStaff = staff.find((st) => st.id === selectedStaffId) || staff[0];
    const assignedLoc = locations.find((l) => l.id === bookingModalService.locationId) || locations[0];

    onBookService({
      service: bookingModalService,
      staffMember: assignedStaff,
      location: assignedLoc,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      depositOnly,
      paymentRail,
      intakeResponses,
      notes: bookingNotes
    });

    setBookingModalService(null);
  };

  // AI-generated Service Setup Assistant
  const handleAIGenerateService = async () => {
    setIsGeneratingAI(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setNewServiceName('Sovereign Protocol Restoration & VIP Telepresence Advisory');
      setNewServiceDesc('Executive confidential session focusing on cross-border protocol arrangements, armored escort coordination, and high-frequency digital asset vaulting.');
      setNewServicePrice(2200);
      setNewServiceDuration(90);
      setNewServiceBuffer(20);
      setNewServiceDelivery('hybrid');
      setNewServiceCategory('Concierge & Advisory');
      setNewServiceFreeCancelHours(24);
      setNewServiceLateCancelFee(50);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSaveNewService = () => {
    if (!newServiceName.trim()) return;
    onAddService({
      name: newServiceName,
      type: newServiceType,
      category: newServiceCategory,
      price: newServicePrice,
      durationMinutes: newServiceDuration,
      bufferBeforeMinutes: newServiceBuffer,
      bufferAfterMinutes: newServiceBuffer,
      capacity: newServiceType === 'appointment' ? 1 : 12,
      delivery: newServiceDelivery,
      locationId: locations[0]?.id || 'loc-dubai',
      description: newServiceDesc || 'Bespoke FingerLux offering configured via AI suggestions.',
      cancellationPolicy: {
        freeCancelHours: newServiceFreeCancelHours,
        lateCancelFeePercent: newServiceLateCancelFee,
        noShowFeePercent: 100
      },
      depositRequired: true,
      depositPercent: 25,
      tags: ['New', 'AI Configured'],
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
      assignedStaffIds: [staff[0]?.id || 'staff-elena'],
      resourceIds: [resources[0]?.id || 'res-penthouse-salon'],
      intakeFormFields: [
        { id: 'q1', label: 'Specific Requirements', type: 'text', required: false, placeholder: 'Any preferences' }
      ]
    });
    setShowAddServiceModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Service Type Switcher */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Services', icon: '✦' },
            { id: 'appointment', label: '1-on-1 Appointments', icon: '👤' },
            { id: 'class', label: 'Group Classes', icon: '👥' },
            { id: 'course', label: 'Multi-Session Courses', icon: '🎓' }
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedType(type.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                selectedType === type.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Delivery Mode & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Delivery Filter */}
          <select
            value={selectedDelivery}
            onChange={(e) => setSelectedDelivery(e.target.value as any)}
            className="bg-white border border-slate-300 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Any Delivery (Online & Physical)</option>
            <option value="in_person">In-Person Only (Suites/Rooms)</option>
            <option value="online">Online Only (Zoom/Google Meet)</option>
          </select>

          {/* Search Box */}
          <input
            type="text"
            placeholder="Search offerings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 px-3 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-36 sm:w-48"
          />

          {/* Add Service Button */}
          <button
            type="button"
            onClick={() => setShowAddServiceModal(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const assignedStaffMembers = staff.filter((st) => service.assignedStaffIds.includes(st.id));
          const locationMatch = locations.find((l) => l.id === service.locationId);

          return (
            <div
              key={service.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Hero Thumbnail & Badges */}
                <div
                  className="h-52 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${service.imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                  {/* Service Type Tag */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-300 border border-amber-300/30">
                      {service.type === 'appointment' ? '1-on-1 Private' : service.type === 'class' ? 'Group Class' : 'Course Series'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-300/30 flex items-center gap-1">
                      {service.delivery === 'online' ? (
                        <>
                          <VideoCameraIcon className="w-3 h-3 inline" /> Online Zoom
                        </>
                      ) : service.delivery === 'in_person' ? (
                        <>
                          <span>📍</span> Physical Suite
                        </>
                      ) : (
                        <>
                          <span>⚡</span> Hybrid
                        </>
                      )}
                    </span>
                  </div>

                  {/* Buffer & Capacity Badges */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[11px] text-white/90">
                    <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {service.durationMinutes} mins
                      {service.bufferAfterMinutes > 0 && ` (+${service.bufferAfterMinutes}m buffer)`}
                    </span>
                    {service.type !== 'appointment' && (
                      <span className="bg-amber-500/80 backdrop-blur-md text-indigo-950 px-2 py-0.5 rounded-md font-black">
                        Capacity: {service.capacity} seats
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block">
                        {service.category}
                      </span>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                        {service.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium line-clamp-2 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Multi-Session Course Highlights */}
                  {service.scheduleDates && service.scheduleDates.length > 0 && (
                    <div className="mb-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl p-2.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-950 block mb-1">
                        Curriculum Schedule ({service.scheduleDates.length} Sessions)
                      </span>
                      <ul className="text-[11px] text-indigo-900 font-semibold space-y-0.5 list-disc list-inside">
                        {service.scheduleDates.slice(0, 2).map((sd, i) => (
                          <li key={i} className="truncate">{sd}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Staff Specialists on Service */}
                  <div className="flex items-center justify-between text-xs text-slate-700 pt-3 border-t border-slate-200 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-700 uppercase">Staff:</span>
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {assignedStaffMembers.map((sm) => (
                          <img
                            key={sm.id}
                            src={sm.avatar}
                            alt={sm.name}
                            title={`${sm.name} (${sm.role})`}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 truncate max-w-[130px]">
                      {locationMatch?.city || 'Global'}
                    </span>
                  </div>

                  {/* Policy & Deposit Information */}
                  <div className="flex items-center justify-between text-[10px] font-semibold">
                    <span className="text-slate-700 font-bold">
                      Free cancel: {service.cancellationPolicy.freeCancelHours}h
                    </span>
                    {service.depositRequired ? (
                      <span className="text-amber-950 font-black bg-amber-100 border border-amber-400 px-2 py-0.5 rounded">
                        {service.depositPercent}% Deposit Required
                      </span>
                    ) : (
                      <span className="text-emerald-950 font-black bg-emerald-100 border border-emerald-400 px-2 py-0.5 rounded">
                        Full Payment
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer: Pricing & Action Buttons */}
              <div className="p-5 pt-0">
                <div className="flex items-center justify-between mb-3 pt-3 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-700 font-black block uppercase tracking-wider">
                      Session Rate
                    </span>
                    <span className="text-xl font-black text-slate-900 block">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-700 font-black block">Protocol Rate</span>
                    <span className="text-xs font-black text-indigo-700 block">
                      {service.price.toLocaleString()} FIC
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openBookingModal(service)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-indigo-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Book Now
                  </button>
                  {onGiftService && (
                    <button
                      type="button"
                      onClick={() => onGiftService(service)}
                      className="p-2.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-950 text-slate-800 border border-slate-300 rounded-xl transition cursor-pointer"
                      title="Send as VIP gift pass"
                    >
                      🎁
                    </button>
                  )}
                  {onPaylinkService && (
                    <button
                      type="button"
                      onClick={() => onPaylinkService(service)}
                      className="p-2.5 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-950 text-slate-800 border border-slate-300 rounded-xl transition cursor-pointer"
                      title="Generate direct paylink"
                    >
                      🔗
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onShareService(service)}
                    className="p-2.5 bg-slate-100 hover:bg-indigo-100 hover:text-indigo-950 text-slate-800 border border-slate-300 rounded-xl transition cursor-pointer"
                    title="Share instant booking link"
                  >
                    <ShareIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-4xl mb-2">🔍</div>
          <h3 className="text-base font-black text-slate-900">No Services Match Filter</h3>
          <p className="text-xs text-slate-700 font-medium mt-1 max-w-sm mx-auto">
            Try adjusting your search query, service type, or location filter.
          </p>
        </div>
      )}

      {/* --- Interactive Booking Drawer / Modal --- */}
      {bookingModalService && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-300 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-400">
                  {bookingModalService.type === 'appointment' ? 'Private Appointment' : 'Class Enrollment'}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {bookingModalService.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalService(null)}
                className="text-slate-500 hover:text-slate-900 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Service Summary Overview */}
            <div className="py-4 border-b border-slate-200 flex items-center gap-4">
              <img
                src={bookingModalService.imageUrl}
                alt={bookingModalService.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-300"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <span>⏱️ {bookingModalService.durationMinutes} mins</span>
                  <span>•</span>
                  <span>Buffer: +{bookingModalService.bufferAfterMinutes}m</span>
                </div>
                <div className="text-sm font-black text-indigo-700 mt-0.5">
                  {formatPrice(bookingModalService.price)} ({bookingModalService.price.toLocaleString()} FIC)
                </div>
                <div className="text-[11px] text-slate-700 font-medium truncate mt-0.5">
                  Policy: Free cancel up to {bookingModalService.cancellationPolicy.freeCancelHours}h
                </div>
              </div>
            </div>

            {/* Step 1: Staff Specialist Selector */}
            <div className="my-4">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                Select Staff Specialist
              </label>
              <div className="grid grid-cols-2 gap-2">
                {staff
                  .filter((st) => bookingModalService.assignedStaffIds.includes(st.id))
                  .map((sm) => {
                    const isSelected = selectedStaffId === sm.id;
                    return (
                      <div
                        key={sm.id}
                        onClick={() => setSelectedStaffId(sm.id)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/80 shadow-xs'
                            : 'border-slate-300 hover:border-slate-400 bg-white'
                        }`}
                      >
                        <img
                          src={sm.avatar}
                          alt={sm.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">{sm.name}</div>
                          <div className="text-[10px] text-slate-600 font-medium truncate">{sm.role}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Step 2: Date & Available Time Slot */}
            <div className="my-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Select Date & Time Slot
                </label>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                  ✓ Double-booking auto-protected
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="col-span-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <div className="col-span-2 flex flex-wrap gap-1.5">
                  {AVAILABLE_SLOTS.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Client Intake Form */}
            {bookingModalService.intakeFormFields.length > 0 && (
              <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                  Client Intake Questionnaire
                </span>
                {bookingModalService.intakeFormFields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-800 block">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        value={intakeResponses[field.id] || ''}
                        onChange={(e) =>
                          setIntakeResponses({ ...intakeResponses, [field.id]: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select an option...</option>
                        {field.options?.map((opt, i) => (
                          <option key={i} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        rows={2}
                        placeholder={field.placeholder || 'Enter notes...'}
                        value={intakeResponses[field.id] || ''}
                        onChange={(e) =>
                          setIntakeResponses({ ...intakeResponses, [field.id]: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder={field.placeholder || 'Enter detail...'}
                        value={intakeResponses[field.id] || ''}
                        onChange={(e) =>
                          setIntakeResponses({ ...intakeResponses, [field.id]: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Payment Terms & Rail */}
            <div className="my-4 p-4 rounded-2xl bg-indigo-950 text-white space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-indigo-200">Payment Option:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDepositOnly(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      !depositOnly ? 'bg-amber-400 text-indigo-950 font-black' : 'bg-white/10 text-white'
                    }`}
                  >
                    Full Payment ({formatPrice(bookingModalService.price)})
                  </button>
                  {bookingModalService.depositRequired && (
                    <button
                      type="button"
                      onClick={() => setDepositOnly(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        depositOnly ? 'bg-amber-400 text-indigo-950 font-black' : 'bg-white/10 text-white'
                      }`}
                    >
                      {bookingModalService.depositPercent}% Deposit (
                      {formatPrice(bookingModalService.price * (bookingModalService.depositPercent / 100))})
                    </button>
                  )}
                </div>
              </div>

              {/* Payment Rail Select */}
              <div className="pt-2 border-t border-indigo-800 flex justify-between items-center text-xs">
                <span className="text-indigo-200">Settlement Method:</span>
                <div className="flex gap-1.5">
                  {[
                    { id: 'fic', label: 'FIC Token' },
                    { id: 'card', label: 'Credit Card' },
                    { id: 'apple_pay', label: 'Apple Pay' },
                    { id: 'crypto', label: 'Crypto' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setPaymentRail(r.id as any)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${
                        paymentRail === r.id ? 'bg-white text-indigo-950 font-black' : 'bg-white/10 text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Actions */}
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setBookingModalService(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-indigo-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <CheckIcon className="w-4 h-4" />
                <span>Confirm & Lock Appointment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Add Service & AI Suggestions Modal --- */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-300 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>⚙️</span> Service Setup & Customization
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  Define cancellation policies, buffer times & intake questions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddServiceModal(false)}
                className="text-slate-500 hover:text-slate-900 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* AI Assistant Generator Trigger */}
            <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                  <span>✨</span> AI Service Setup Assistant
                </span>
                <p className="text-[11px] text-indigo-200 mt-0.5">
                  Generate optimal service description, pricing & buffer times.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAIGenerateService}
                disabled={isGeneratingAI}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-indigo-950 text-xs font-black rounded-xl transition cursor-pointer whitespace-nowrap shadow-xs"
              >
                {isGeneratingAI ? 'Generating...' : 'Ask AI Suggestions'}
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5 max-h-96 overflow-y-auto p-1">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Service Name</label>
                <input
                  type="text"
                  placeholder="e.g. Master Horology Calibration"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Service Type</label>
                  <select
                    value={newServiceType}
                    onChange={(e) => setNewServiceType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="appointment">1-on-1 Appointment</option>
                    <option value="class">Group Class</option>
                    <option value="course">Multi-Session Course</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Delivery</label>
                  <select
                    value={newServiceDelivery}
                    onChange={(e) => setNewServiceDelivery(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="hybrid">Hybrid (Online & Physical)</option>
                    <option value="in_person">In-Person Only</option>
                    <option value="online">Online (Zoom/Meet)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Price (FIC)</label>
                  <input
                    type="number"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Buffer (Min)</label>
                  <input
                    type="number"
                    value={newServiceBuffer}
                    onChange={(e) => setNewServiceBuffer(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Free Cancel Window</label>
                  <select
                    value={newServiceFreeCancelHours}
                    onChange={(e) => setNewServiceFreeCancelHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={12}>12 Hours Prior</option>
                    <option value={24}>24 Hours Prior</option>
                    <option value={48}>48 Hours Prior</option>
                    <option value={72}>72 Hours Prior</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Late Cancel Fee</label>
                  <select
                    value={newServiceLateCancelFee}
                    onChange={(e) => setNewServiceLateCancelFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={30}>30% Fee</option>
                    <option value={50}>50% Fee</option>
                    <option value={100}>100% Fee (Non-Refundable)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Service Description</label>
                <textarea
                  rows={3}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Detailed description of the luxury session..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAddServiceModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewService}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer"
              >
                Create Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
