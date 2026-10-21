/**
 * FingerMobile Protocol™ - FingerLux Scheduling Initial Data & Currency Configuration
 * Copyright © 2026 Mbah Israel Obinna. All rights reserved.
 */

import type {
  FingerLuxService,
  StaffMember,
  BookableResource,
  LocationSite,
  FingerLuxBooking,
  BlockedTimeSlot,
  WaitlistEntry,
  DigitalProgramOrMembership,
  ClientProfile
} from '../types/fingerLuxScheduling';

export interface CurrencyConfigItem {
  code: string;
  symbol: string;
  rate: number; // relative to USD/FIC (1 USD = 1 FIC base)
  label: string;
  flag: string;
}

export const FORTY_PLUS_CURRENCIES: Record<string, CurrencyConfigItem> = {
  FIC: { code: 'FIC', symbol: 'FIC', rate: 1, label: 'FingerMobile Protocol Token', flag: '💎' },
  USD: { code: 'USD', symbol: '$', rate: 1.0, label: 'United States Dollar', flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'Eurozone Euro', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, label: 'British Pound Sterling', flag: '🇬🇧' },
  NGN: { code: 'NGN', symbol: '₦', rate: 1520.0, label: 'Nigerian Naira', flag: '🇳🇬' },
  JPY: { code: 'JPY', symbol: '¥', rate: 154.5, label: 'Japanese Yen', flag: '🇯🇵' },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 1.38, label: 'Canadian Dollar', flag: '🇨🇦' },
  AUD: { code: 'AUD', symbol: 'A$', rate: 1.54, label: 'Australian Dollar', flag: '🇦🇺' },
  CHF: { code: 'CHF', symbol: 'CHF', rate: 0.89, label: 'Swiss Franc', flag: '🇨🇭' },
  AED: { code: 'AED', symbol: 'AED', rate: 3.67, label: 'United Arab Emirates Dirham', flag: '🇦🇪' },
  SGD: { code: 'SGD', symbol: 'S$', rate: 1.35, label: 'Singapore Dollar', flag: '🇸🇬' },
  CNY: { code: 'CNY', symbol: 'CN¥', rate: 7.24, label: 'Chinese Yuan', flag: '🇨🇳' },
  INR: { code: 'INR', symbol: '₹', rate: 83.4, label: 'Indian Rupee', flag: '🇮🇳' },
  ZAR: { code: 'ZAR', symbol: 'R', rate: 18.6, label: 'South African Rand', flag: '🇿🇦' },
  BRL: { code: 'BRL', symbol: 'R$', rate: 5.45, label: 'Brazilian Real', flag: '🇧🇷' },
  HKD: { code: 'HK', symbol: 'HK$', rate: 7.82, label: 'Hong Kong Dollar', flag: '🇭🇰' },
  SEK: { code: 'SEK', symbol: 'kr', rate: 10.6, label: 'Swedish Krona', flag: '🇸🇪' },
  NZD: { code: 'NZD', symbol: 'NZ$', rate: 1.66, label: 'New Zealand Dollar', flag: '🇳🇿' },
  KRW: { code: 'KRW', symbol: '₩', rate: 1370.0, label: 'South Korean Won', flag: '🇰🇷' },
  MXN: { code: 'MXN', symbol: 'Mex$', rate: 18.1, label: 'Mexican Peso', flag: '🇲🇽' },
  SAR: { code: 'SAR', symbol: 'SAR', rate: 3.75, label: 'Saudi Riyal', flag: '🇸🇦' },
  QAR: { code: 'QAR', symbol: 'QAR', rate: 3.64, label: 'Qatari Riyal', flag: '🇶🇦' },
  KWD: { code: 'KWD', symbol: 'KD', rate: 0.31, label: 'Kuwaiti Dinar', flag: '🇰🇼' },
  TRY: { code: 'TRY', symbol: '₺', rate: 32.8, label: 'Turkish Lira', flag: '🇹🇷' },
  ILS: { code: 'ILS', symbol: '₪', rate: 3.72, label: 'Israeli New Shekel', flag: '🇮🇱' },
  PLN: { code: 'PLN', symbol: 'zł', rate: 4.02, label: 'Polish Złoty', flag: '🇵🇱' },
  NOK: { code: 'NOK', symbol: 'kr', rate: 10.75, label: 'Norwegian Krone', flag: '🇳🇴' },
  DKK: { code: 'DKK', symbol: 'kr', rate: 6.89, label: 'Danish Krone', flag: '🇩🇰' },
  THB: { code: 'THB', symbol: '฿', rate: 36.7, label: 'Thai Baht', flag: '🇹🇭' },
  IDR: { code: 'IDR', symbol: 'Rp', rate: 16250.0, label: 'Indonesian Rupiah', flag: '🇮🇩' },
  MYR: { code: 'MYR', symbol: 'RM', rate: 4.71, label: 'Malaysian Ringgit', flag: '🇲🇾' },
  PHP: { code: 'PHP', symbol: '₱', rate: 58.7, label: 'Philippine Peso', flag: '🇵🇭' },
  VND: { code: 'VND', symbol: '₫', rate: 25400.0, label: 'Vietnamese Dong', flag: '🇻🇳' },
  CZK: { code: 'CZK', symbol: 'Kč', rate: 23.1, label: 'Czech Koruna', flag: '🇨🇿' },
  HUF: { code: 'HUF', symbol: 'Ft', rate: 365.0, label: 'Hungarian Forint', flag: '🇭🇺' },
  CLP: { code: 'CLP', symbol: 'CLP$', rate: 935.0, label: 'Chilean Peso', flag: '🇨🇱' },
  COP: { code: 'COP', symbol: 'COL$', rate: 4100.0, label: 'Colombian Peso', flag: '🇨🇴' },
  EGP: { code: 'EGP', symbol: 'E£', rate: 47.9, label: 'Egyptian Pound', flag: '🇪🇬' },
  KES: { code: 'KES', symbol: 'KSh', rate: 129.5, label: 'Kenyan Shilling', flag: '🇰🇪' },
  GHS: { code: 'GHS', symbol: 'GH₵', rate: 15.2, label: 'Ghanaian Cedi', flag: '🇬🇭' },
  BTC: { code: 'BTC', symbol: '₿', rate: 0.000015, label: 'Bitcoin (Layer 1)', flag: '🪙' },
  ETH: { code: 'ETH', symbol: 'Ξ', rate: 0.00029, label: 'Ethereum (PoS)', flag: '⟠' },
  SOL: { code: 'SOL', symbol: 'SOL', rate: 0.0068, label: 'Solana Network', flag: '🟣' }
};

export const INITIAL_LOCATIONS: LocationSite[] = [
  {
    id: 'loc-dubai',
    name: 'Dubai Marina Sovereign Flagship',
    city: 'Dubai, UAE',
    address: 'Level 54, Sovereign Tower, Dubai Marina Walk',
    timezone: 'Asia/Dubai (UTC+4)',
    contactEmail: 'dubai@fingerlux.protocol',
    contactPhone: '+971 4 800 5899',
    isVirtual: false,
    badge: 'Middle East HQ'
  },
  {
    id: 'loc-london',
    name: 'London Mayfair Protocol Club',
    city: 'London, UK',
    address: '34 Berkeley Square, Mayfair, London W1J 5AW',
    timezone: 'Europe/London (UTC+1)',
    contactEmail: 'london@fingerlux.protocol',
    contactPhone: '+44 20 7946 0912',
    isVirtual: false,
    badge: 'European HQ'
  },
  {
    id: 'loc-lagos',
    name: 'Lagos Victoria Island Haven',
    city: 'Lagos, Nigeria',
    address: 'Plot 12 Ozumba Mbadiwe Avenue, Victoria Island',
    timezone: 'Africa/Lagos (UTC+1)',
    contactEmail: 'lagos@fingerlux.protocol',
    contactPhone: '+234 1 800 3464',
    isVirtual: false,
    badge: 'West Africa Hub'
  },
  {
    id: 'loc-nyc',
    name: 'New York 5th Avenue Sovereign Salon',
    city: 'New York, USA',
    address: '740 5th Avenue, Penthouse Level, Manhattan, NY 10019',
    timezone: 'America/New_York (UTC-4)',
    contactEmail: 'nyc@fingerlux.protocol',
    contactPhone: '+1 212 555 0198',
    isVirtual: false,
    badge: 'Americas Hub'
  },
  {
    id: 'loc-virtual',
    name: 'Virtual Global Metaverse & Video Bridge',
    city: 'Global Encrypted Hub',
    address: 'Encrypted Ka-Band Zoom / Google Meet Sovereign Tunnel',
    timezone: 'Universal (UTC)',
    contactEmail: 'virtual@fingerlux.protocol',
    contactPhone: '+1 800 589 8478',
    isVirtual: true,
    badge: 'Worldwide 24/7'
  }
];

export const INITIAL_RESOURCES: BookableResource[] = [
  {
    id: 'res-penthouse-salon',
    name: 'Sovereign Penthouse Salon A',
    type: 'room',
    locationId: 'loc-dubai',
    capacity: 10,
    isAvailable: true,
    description: 'Private 360° panoramic skyline lounge with biometric privacy airlock and sound dampening',
    icon: '🏙️'
  },
  {
    id: 'res-ocean-spa',
    name: 'Oceanfront Hydro-Spa Pavilion',
    type: 'room',
    locationId: 'loc-lagos',
    capacity: 4,
    isAvailable: true,
    description: 'Private hydrotherapy pool, cedarwood sauna, and ocean-breeze rejuvenation terrace',
    icon: '🌊'
  },
  {
    id: 'res-mayfair-boardroom',
    name: 'High Council Sovereign Boardroom',
    type: 'room',
    locationId: 'loc-london',
    capacity: 20,
    isAvailable: true,
    description: 'Bespoke walnut table, 8K multi-camera telepresence suite, and encrypted voting terminals',
    icon: '🏛️'
  },
  {
    id: 'res-maybach-escort',
    name: 'Armored Mercedes-Maybach S680 Escort Unit',
    type: 'vehicle',
    locationId: 'loc-dubai',
    capacity: 3,
    isAvailable: true,
    description: 'VR9 ballistic rated chassis, champagne cellar, and protocol chauffeur escort',
    icon: '🚘'
  },
  {
    id: 'res-studio-rig',
    name: 'Ka-Band 4K Broadcast & Streaming Rig',
    type: 'equipment',
    locationId: 'loc-virtual',
    capacity: 8,
    isAvailable: true,
    description: 'Dual Sony FX6 cinema cameras, telemetry audio processing, and zero-latency satellite link',
    icon: '🎥'
  },
  {
    id: 'res-horology-bench',
    name: 'Master Horology Calibration Bench',
    type: 'equipment',
    locationId: 'loc-nyc',
    capacity: 2,
    isAvailable: true,
    description: 'Anti-magnetic clean room bench with Witschi electronic timing machines and stereomicroscope',
    icon: '⏱️'
  }
];

const DEFAULT_HOURS = {
  Monday: { start: '09:00', end: '19:00', isWorking: true },
  Tuesday: { start: '09:00', end: '19:00', isWorking: true },
  Wednesday: { start: '09:00', end: '19:00', isWorking: true },
  Thursday: { start: '09:00', end: '19:00', isWorking: true },
  Friday: { start: '09:00', end: '20:00', isWorking: true },
  Saturday: { start: '10:00', end: '18:00', isWorking: true },
  Sunday: { start: '11:00', end: '16:00', isWorking: false }
};

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-elena',
    name: 'Dr. Elena Rostova',
    role: 'Master Concierge',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    email: 'elena.rostova@fingerlux.protocol',
    phone: '+971 50 123 4567',
    assignedServiceIds: ['srv-concierge-consult', 'srv-rejuvenation-therapy', 'srv-sovereign-diplomacy'],
    locationIds: ['loc-dubai', 'loc-virtual'],
    workingHours: DEFAULT_HOURS,
    calendarSync: {
      googleCalendar: true,
      outlookCalendar: true,
      appleCalendar: false,
      lastSyncedAt: '2 mins ago'
    },
    permissions: {
      canViewFinances: true,
      canEditSchedule: true,
      canIssueRefunds: true,
      canManageClients: true
    }
  },
  {
    id: 'staff-marcus',
    name: 'Marcus Sterling',
    role: 'Senior Specialist',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    email: 'marcus.sterling@fingerlux.protocol',
    phone: '+44 7700 900123',
    assignedServiceIds: ['srv-horology-fitting', 'srv-gemology-appraisal'],
    locationIds: ['loc-london', 'loc-nyc'],
    workingHours: DEFAULT_HOURS,
    calendarSync: {
      googleCalendar: true,
      outlookCalendar: false,
      appleCalendar: true,
      lastSyncedAt: 'Just now'
    },
    permissions: {
      canViewFinances: false,
      canEditSchedule: true,
      canIssueRefunds: false,
      canManageClients: true
    }
  },
  {
    id: 'staff-aisha',
    name: 'Aisha Al-Mansoor',
    role: 'Lead Instructor',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    email: 'aisha.almansoor@fingerlux.protocol',
    phone: '+971 52 987 6543',
    assignedServiceIds: ['srv-yacht-masterclass', 'srv-aviation-residency', 'srv-protocol-wealth'],
    locationIds: ['loc-dubai', 'loc-virtual'],
    workingHours: DEFAULT_HOURS,
    calendarSync: {
      googleCalendar: true,
      outlookCalendar: true,
      appleCalendar: true,
      lastSyncedAt: '5 mins ago'
    },
    permissions: {
      canViewFinances: true,
      canEditSchedule: true,
      canIssueRefunds: false,
      canManageClients: true
    }
  },
  {
    id: 'staff-kofi',
    name: 'Kofi Mensah',
    role: 'Senior Specialist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    email: 'kofi.mensah@fingerlux.protocol',
    phone: '+234 803 111 2233',
    assignedServiceIds: ['srv-rejuvenation-therapy', 'srv-mindfulness-soundbath'],
    locationIds: ['loc-lagos', 'loc-virtual'],
    workingHours: DEFAULT_HOURS,
    calendarSync: {
      googleCalendar: false,
      outlookCalendar: true,
      appleCalendar: false,
      lastSyncedAt: '12 mins ago'
    },
    permissions: {
      canViewFinances: false,
      canEditSchedule: true,
      canIssueRefunds: false,
      canManageClients: true
    }
  },
  {
    id: 'staff-charlotte',
    name: 'Charlotte Dubois',
    role: 'Front Desk Manager',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    email: 'charlotte.dubois@fingerlux.protocol',
    phone: '+1 212 555 7788',
    assignedServiceIds: ['srv-concierge-consult'],
    locationIds: ['loc-nyc', 'loc-london'],
    workingHours: DEFAULT_HOURS,
    calendarSync: {
      googleCalendar: true,
      outlookCalendar: false,
      appleCalendar: false,
      lastSyncedAt: '1 hour ago'
    },
    permissions: {
      canViewFinances: true,
      canEditSchedule: true,
      canIssueRefunds: true,
      canManageClients: true
    }
  }
];

export const INITIAL_SERVICES: FingerLuxService[] = [
  {
    id: 'srv-concierge-consult',
    name: 'Private Sovereign Concierge & Lifestyle Consultation',
    type: 'appointment',
    category: 'Concierge & Advisory',
    description: '1-on-1 private confidential session to map global mobility, asset vaulting, VIP travel clearances, and private security protocols.',
    price: 1200,
    durationMinutes: 60,
    bufferBeforeMinutes: 15,
    bufferAfterMinutes: 15,
    capacity: 1,
    delivery: 'hybrid',
    locationId: 'loc-dubai',
    resourceIds: ['res-penthouse-salon'],
    assignedStaffIds: ['staff-elena', 'staff-charlotte'],
    cancellationPolicy: {
      freeCancelHours: 24,
      lateCancelFeePercent: 50,
      noShowFeePercent: 100,
      policyNotes: 'Cancellations within 24h incur 50% fee. No-shows incur 100% reservation rate.'
    },
    depositRequired: true,
    depositPercent: 20,
    intakeFormFields: [
      { id: 'f1', label: 'Primary Consultation Objective', type: 'select', required: true, options: ['Global Mobility & Visas', 'Ultra-Luxury Rental', 'Private Aviation & Yachting', 'Vault & High Horology'] },
      { id: 'f2', label: 'Preferred Contact Method', type: 'select', required: true, options: ['WhatsApp Encrypted', 'Signal Protocol', 'Direct Protocol Call', 'In-Person Penthouse'] },
      { id: 'f3', label: 'Dietary & Hospitality Preferences', type: 'text', required: false, placeholder: 'e.g., San Pellegrino, Dom Pérignon, specific dietary guidelines' }
    ],
    tags: ['Private', 'VIP 1-on-1', 'Bespoke'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    virtualMeetingUrl: 'https://meet.google.com/flx-sovereign-consult'
  },
  {
    id: 'srv-horology-fitting',
    name: 'Haute Horology & Master Vault Fitting',
    type: 'appointment',
    category: 'Luxury Goods & Fitting',
    description: 'Bespoke micro-calibration and private inspection of celestial tourbillons, rare Patek Philippe pieces, and custom diamond settings in secure clean room.',
    price: 2500,
    durationMinutes: 90,
    bufferBeforeMinutes: 30,
    bufferAfterMinutes: 30,
    capacity: 1,
    delivery: 'in_person',
    locationId: 'loc-london',
    resourceIds: ['res-mayfair-boardroom', 'res-horology-bench'],
    assignedStaffIds: ['staff-marcus'],
    cancellationPolicy: {
      freeCancelHours: 48,
      lateCancelFeePercent: 60,
      noShowFeePercent: 100,
      policyNotes: 'Strict 48h notice required due to vault security clearance protocols.'
    },
    depositRequired: true,
    depositPercent: 30,
    intakeFormFields: [
      { id: 'h1', label: 'Wrist Measurement / Sizing Preference', type: 'text', required: true, placeholder: 'e.g. 175mm wrist circumference, custom deployant clasp' },
      { id: 'h2', label: 'Specific Complication Interest', type: 'select', required: true, options: ['Multi-Axis Tourbillon', 'Minute Repeater', 'Perpetual Calendar', 'Celestial Star Chart'] }
    ],
    tags: ['Horology', 'Vault Clearance', 'White Glove'],
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv-rejuvenation-therapy',
    name: 'Executive Cellular Rejuvenation & Hydro-Spa',
    type: 'appointment',
    category: 'Wellness & Spa',
    description: 'Three-stage cellular rejuvenation including contrast hydrotherapy, restorative deep tissue massage, hyperbaric oxygen recovery, and customized aromatherapy.',
    price: 1800,
    durationMinutes: 120,
    bufferBeforeMinutes: 30,
    bufferAfterMinutes: 30,
    capacity: 1,
    delivery: 'in_person',
    locationId: 'loc-lagos',
    resourceIds: ['res-ocean-spa'],
    assignedStaffIds: ['staff-kofi', 'staff-elena'],
    cancellationPolicy: {
      freeCancelHours: 24,
      lateCancelFeePercent: 50,
      noShowFeePercent: 100
    },
    depositRequired: true,
    depositPercent: 25,
    intakeFormFields: [
      { id: 'w1', label: 'Any Health Considerations or Allergies', type: 'textarea', required: false, placeholder: 'e.g., lavender sensitivity, recent cardiovascular exertion' },
      { id: 'w2', label: 'Target Focus Area', type: 'select', required: true, options: ['Full Body Recovery', 'Jet-Lag Detoxification', 'Deep Tissue Tension Relief'] }
    ],
    tags: ['Wellness', 'Hydrotherapy', 'Rejuvenation'],
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv-protocol-wealth',
    name: 'Cross-Border Sovereign Wealth & Asset Structuring',
    type: 'appointment',
    category: 'Advisory & Legal',
    description: 'Direct consultation on multi-jurisdictional family office structures, crypto-fiat dual gateways, and tokenized real estate escrow mechanisms.',
    price: 3200,
    durationMinutes: 60,
    bufferBeforeMinutes: 15,
    bufferAfterMinutes: 15,
    capacity: 1,
    delivery: 'online',
    locationId: 'loc-virtual',
    resourceIds: ['res-studio-rig'],
    assignedStaffIds: ['staff-aisha'],
    cancellationPolicy: {
      freeCancelHours: 12,
      lateCancelFeePercent: 40,
      noShowFeePercent: 80
    },
    depositRequired: false,
    depositPercent: 0,
    intakeFormFields: [
      { id: 'l1', label: 'Primary Jurisdiction of Concern', type: 'text', required: true, placeholder: 'e.g. UAE DIFC, Switzerland, Singapore, Delaware' },
      { id: 'l2', label: 'Entity Type', type: 'select', required: true, options: ['Single Family Office', 'Multi-Jurisdiction DAO', 'Ultra-High-Net-Worth Trust'] }
    ],
    tags: ['Advisory', 'Virtual Zoom', 'Sovereignty'],
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80',
    virtualMeetingUrl: 'https://zoom.us/j/flx-wealth-sovereign'
  },
  {
    id: 'srv-yacht-masterclass',
    name: 'Elite Superyacht Coastal Command & Protocol Class',
    type: 'class',
    category: 'Maritime & Aviation',
    description: 'Group cohort seminar for owners and charter principals covering Mediterranean and Caribbean anchorages, crew command, and deep-sea satellite protocol comms.',
    price: 1500,
    durationMinutes: 120,
    bufferBeforeMinutes: 20,
    bufferAfterMinutes: 20,
    capacity: 12,
    delivery: 'hybrid',
    locationId: 'loc-dubai',
    resourceIds: ['res-penthouse-salon'],
    assignedStaffIds: ['staff-aisha'],
    cancellationPolicy: {
      freeCancelHours: 48,
      lateCancelFeePercent: 50,
      noShowFeePercent: 100
    },
    depositRequired: true,
    depositPercent: 50,
    intakeFormFields: [
      { id: 'y1', label: 'Yacht Size Classification', type: 'select', required: true, options: ['40m - 60m Mega Yacht', '60m - 90m Superyacht', '90m+ Giga Yacht', 'Prospective Charterer'] }
    ],
    tags: ['Group Class', 'Superyacht', 'Live Class'],
    imageUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?w=800&auto=format&fit=crop&q=80',
    virtualMeetingUrl: 'https://meet.google.com/flx-yacht-masterclass'
  },
  {
    id: 'srv-gemology-appraisal',
    name: 'Rare Diamonds & Gemological Investment Workshop',
    type: 'class',
    category: 'Luxury Goods & Fitting',
    description: 'Hands-on connoisseur class evaluating Fancy Vivid colored diamonds, untreated Kashmir sapphires, and auction-grade investment portfolio gems.',
    price: 950,
    durationMinutes: 90,
    bufferBeforeMinutes: 15,
    bufferAfterMinutes: 15,
    capacity: 15,
    delivery: 'in_person',
    locationId: 'loc-london',
    resourceIds: ['res-mayfair-boardroom'],
    assignedStaffIds: ['staff-marcus'],
    cancellationPolicy: {
      freeCancelHours: 24,
      lateCancelFeePercent: 50,
      noShowFeePercent: 100
    },
    depositRequired: false,
    depositPercent: 0,
    intakeFormFields: [
      { id: 'g1', label: 'Investment Horizon Preference', type: 'select', required: true, options: ['Short-Term Appreciation', 'Generational Wealth Preservation', 'Collector Showcase'] }
    ],
    tags: ['Group Class', 'Gemology', 'Hands-on'],
    imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv-mindfulness-soundbath',
    name: 'Sound Wave Rejuvenation & Tibetan Bowl Meditation',
    type: 'class',
    category: 'Wellness & Spa',
    description: 'Sunset acoustic frequency immersion utilizing 432Hz crystal alchemy bowls, gong baths, and oceanfront guided breathwork.',
    price: 450,
    durationMinutes: 60,
    bufferBeforeMinutes: 15,
    bufferAfterMinutes: 15,
    capacity: 20,
    delivery: 'in_person',
    locationId: 'loc-lagos',
    resourceIds: ['res-ocean-spa'],
    assignedStaffIds: ['staff-kofi'],
    cancellationPolicy: {
      freeCancelHours: 12,
      lateCancelFeePercent: 30,
      noShowFeePercent: 100
    },
    depositRequired: false,
    depositPercent: 0,
    intakeFormFields: [],
    tags: ['Group Class', 'Soundbath', 'Sunset Session'],
    imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'srv-aviation-residency',
    name: '4-Week Private Aviation Command & Protocol Fleet Mastery',
    type: 'course',
    category: 'Maritime & Aviation',
    description: 'Multi-session executive certification on fractional ownership, slot priority at restricted global airports, sovereign flight clearance, and in-flight security.',
    price: 8500,
    durationMinutes: 180,
    bufferBeforeMinutes: 30,
    bufferAfterMinutes: 30,
    capacity: 8,
    delivery: 'hybrid',
    locationId: 'loc-dubai',
    resourceIds: ['res-penthouse-salon', 'res-studio-rig'],
    assignedStaffIds: ['staff-aisha'],
    cancellationPolicy: {
      freeCancelHours: 72,
      lateCancelFeePercent: 50,
      noShowFeePercent: 100,
      policyNotes: 'Full curriculum enrolment. 72h notice required for refund.'
    },
    depositRequired: true,
    depositPercent: 40,
    intakeFormFields: [
      { id: 'a1', label: 'Primary Private Jet Types Utilized', type: 'text', required: true, placeholder: 'e.g., Gulfstream G650ER, Bombardier Global 7500, Citation X' },
      { id: 'a2', label: 'Preferred Course Delivery Mode', type: 'select', required: true, options: ['Live Dubai Penthouse Attendance', 'Encrypted 4K Telepresence Stream'] }
    ],
    tags: ['4-Week Course', 'Multi-Session', 'Aviation Mastery'],
    imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&auto=format&fit=crop&q=80',
    scheduleDates: [
      'Week 1: Intercontinental Range & Slot Clearances',
      'Week 2: Fractional Ownership vs Wet Charter Economics',
      'Week 3: In-Flight VIP Security & Diplomatic Pouch Protocols',
      'Week 4: Ka-band Satcom & Flight Deck Crew Governance'
    ],
    virtualMeetingUrl: 'https://meet.google.com/flx-aviation-course'
  },
  {
    id: 'srv-sovereign-diplomacy',
    name: '6-Week Sovereign Protocol & Diplomatic Etiquette Residency',
    type: 'course',
    category: 'Advisory & Legal',
    description: 'Six comprehensive masterclasses in international statecraft etiquette, bilateral delegation hosting, security details, and high-stakes dining protocol.',
    price: 6200,
    durationMinutes: 120,
    bufferBeforeMinutes: 20,
    bufferAfterMinutes: 20,
    capacity: 10,
    delivery: 'online',
    locationId: 'loc-virtual',
    resourceIds: ['res-studio-rig'],
    assignedStaffIds: ['staff-elena'],
    cancellationPolicy: {
      freeCancelHours: 72,
      lateCancelFeePercent: 50,
      noShowFeePercent: 100
    },
    depositRequired: true,
    depositPercent: 30,
    intakeFormFields: [
      { id: 'd1', label: 'Institutional Affiliation', type: 'text', required: true, placeholder: 'e.g. Sovereign Wealth Fund, Diplomatic Mission, Family Office' }
    ],
    tags: ['6-Week Course', 'Diplomacy', 'Executive Certification'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    scheduleDates: [
      'Session 1: Order of Precedence & Flag Protocol',
      'Session 2: State Banquet & Formal Dining Etiquette',
      'Session 3: Bilateral Treaty & Sovereign Accord Signings',
      'Session 4: Close Protection Escort Harmonization',
      'Session 5: Cultural Nuances Across MENA, Asia & Europe',
      'Session 6: Crisis Communication & Diplomatic Immunity'
    ],
    virtualMeetingUrl: 'https://zoom.us/j/flx-diplomacy-residency'
  }
];

export const INITIAL_BOOKINGS: FingerLuxBooking[] = [
  {
    id: 'book-001',
    bookingCode: 'FLX-8041',
    serviceId: 'srv-concierge-consult',
    serviceName: 'Private Sovereign Concierge & Lifestyle Consultation',
    serviceType: 'appointment',
    client: {
      id: 'cli-01',
      name: 'Sir Reginald Vance',
      email: 'reginald.vance@sovereign.co.uk',
      phone: '+44 7911 123456',
      vipTier: 'Sovereign',
      notes: 'Prefers sparkling mineral water and physical briefing folder.'
    },
    staffId: 'staff-elena',
    staffName: 'Dr. Elena Rostova',
    locationId: 'loc-dubai',
    locationName: 'Dubai Marina Sovereign Flagship',
    resourceIds: ['res-penthouse-salon'],
    resourceNames: ['Sovereign Penthouse Salon A'],
    delivery: 'in_person',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    durationMinutes: 60,
    attendanceStatus: 'checked_in',
    checkedInAt: '09:54 AM',
    paymentStatus: 'paid_full',
    paymentRail: 'fic',
    totalAmount: 1200,
    depositAmount: 1200,
    feeCharged: 0,
    intakeResponses: {
      f1: 'Ultra-Luxury Rental',
      f2: 'In-Person Penthouse'
    },
    notes: 'Escort arriving via Maybach terminal transfer.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'book-002',
    bookingCode: 'FLX-8042',
    serviceId: 'srv-horology-fitting',
    serviceName: 'Haute Horology & Master Vault Fitting',
    serviceType: 'appointment',
    client: {
      id: 'cli-02',
      name: 'Countess Vivian Chen',
      email: 'vivian.chen@chenholdings.sg',
      phone: '+65 9123 4567',
      vipTier: 'Black Diamond',
      notes: 'Inspecting Celestial Tourbillon Chronometer.'
    },
    staffId: 'staff-marcus',
    staffName: 'Marcus Sterling',
    locationId: 'loc-london',
    locationName: 'London Mayfair Protocol Club',
    resourceIds: ['res-mayfair-boardroom', 'res-horology-bench'],
    resourceNames: ['High Council Sovereign Boardroom', 'Master Horology Calibration Bench'],
    delivery: 'in_person',
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '15:30',
    durationMinutes: 90,
    attendanceStatus: 'booked',
    paymentStatus: 'deposit_paid',
    paymentRail: 'card',
    totalAmount: 2500,
    depositAmount: 750,
    feeCharged: 0,
    intakeResponses: {
      h1: '165mm wrist, bespoke platinum deployment',
      h2: 'Multi-Axis Tourbillon'
    },
    notes: 'Balance of 1,750 FIC to be settled at completion.',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'book-003',
    bookingCode: 'FLX-8043',
    serviceId: 'srv-protocol-wealth',
    serviceName: 'Cross-Border Sovereign Wealth & Asset Structuring',
    serviceType: 'appointment',
    client: {
      id: 'cli-03',
      name: 'Prince Tariq Al-Hassan',
      email: 'tariq.hassan@al-hassan.ae',
      phone: '+971 50 999 8888',
      vipTier: 'Sovereign',
      notes: 'Virtual advisory on tokenized real estate SPVs.'
    },
    staffId: 'staff-aisha',
    staffName: 'Aisha Al-Mansoor',
    locationId: 'loc-virtual',
    locationName: 'Virtual Global Metaverse & Video Bridge',
    resourceIds: ['res-studio-rig'],
    resourceNames: ['Ka-Band 4K Broadcast & Streaming Rig'],
    delivery: 'online',
    virtualMeetingUrl: 'https://zoom.us/j/flx-wealth-sovereign',
    date: new Date().toISOString().split('T')[0],
    startTime: '16:30',
    endTime: '17:30',
    durationMinutes: 60,
    attendanceStatus: 'booked',
    paymentStatus: 'paid_full',
    paymentRail: 'apple_pay',
    totalAmount: 3200,
    depositAmount: 3200,
    feeCharged: 0,
    intakeResponses: {
      l1: 'UAE DIFC & Zurich',
      l2: 'Single Family Office'
    },
    notes: 'Encrypted Ka-Band Zoom Bridge generated.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'book-004',
    bookingCode: 'FLX-8044',
    serviceId: 'srv-rejuvenation-therapy',
    serviceName: 'Executive Cellular Rejuvenation & Hydro-Spa',
    serviceType: 'appointment',
    client: {
      id: 'cli-04',
      name: 'Lady Genevieve Moreau',
      email: 'genevieve@moreau-luxury.fr',
      phone: '+33 6 12 34 56 78',
      vipTier: 'Platinum',
      notes: 'Oceanfront pavilion session.'
    },
    staffId: 'staff-kofi',
    staffName: 'Kofi Mensah',
    locationId: 'loc-lagos',
    locationName: 'Lagos Victoria Island Haven',
    resourceIds: ['res-ocean-spa'],
    resourceNames: ['Oceanfront Hydro-Spa Pavilion'],
    delivery: 'in_person',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    startTime: '11:00',
    endTime: '13:00',
    durationMinutes: 120,
    attendanceStatus: 'completed',
    checkedInAt: '10:52 AM',
    paymentStatus: 'paid_full',
    paymentRail: 'pos_tap',
    totalAmount: 1800,
    depositAmount: 450,
    feeCharged: 0,
    intakeResponses: {
      w1: 'No allergies',
      w2: 'Jet-Lag Detoxification'
    },
    notes: 'Settled remaining balance via Tap to Pay at check-out.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'book-005',
    bookingCode: 'FLX-8045',
    serviceId: 'srv-concierge-consult',
    serviceName: 'Private Sovereign Concierge & Lifestyle Consultation',
    serviceType: 'appointment',
    client: {
      id: 'cli-05',
      name: 'David K. Sterling',
      email: 'david@sterlingcapital.com',
      phone: '+1 212 908 1234',
      vipTier: 'Gold',
      notes: 'Missed session without notice.'
    },
    staffId: 'staff-charlotte',
    staffName: 'Charlotte Dubois',
    locationId: 'loc-nyc',
    locationName: 'New York 5th Avenue Sovereign Salon',
    resourceIds: ['res-penthouse-salon'],
    resourceNames: ['Sovereign Penthouse Salon A'],
    delivery: 'in_person',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    startTime: '15:00',
    endTime: '16:00',
    durationMinutes: 60,
    attendanceStatus: 'no_show',
    paymentStatus: 'fee_charged',
    paymentRail: 'card',
    totalAmount: 1200,
    depositAmount: 240,
    feeCharged: 1200,
    intakeResponses: {},
    notes: 'No-show fee 100% processed automatically per cancellation policy.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

export const INITIAL_BLOCKED_SLOTS: BlockedTimeSlot[] = [
  {
    id: 'blk-001',
    date: new Date().toISOString().split('T')[0],
    startTime: '12:00',
    endTime: '13:00',
    reason: 'Sovereign Penthouse Sanitization & Protocol Airlock Sterilization',
    locationId: 'loc-dubai',
    resourceId: 'res-penthouse-salon'
  },
  {
    id: 'blk-002',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '09:00',
    reason: 'Daily Master Staff Operations Briefing & Calendar Synchronization',
    locationId: 'loc-london'
  },
  {
    id: 'blk-003',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: '13:00',
    endTime: '14:30',
    reason: 'VIP Diplomatic Security Sweep & Armored Fleet Inspection',
    locationId: 'loc-dubai',
    resourceId: 'res-maybach-escort'
  }
];

export const INITIAL_WAITLIST: WaitlistEntry[] = [
  {
    id: 'wait-01',
    serviceId: 'srv-horology-fitting',
    serviceName: 'Haute Horology & Master Vault Fitting',
    clientName: 'Alexander Von Berg',
    clientEmail: 'alex@vonberg-estate.de',
    clientPhone: '+49 171 2345678',
    date: new Date().toISOString().split('T')[0],
    preferredTime: '14:00 - 16:00',
    status: 'waiting',
    addedAt: '1 hour ago'
  },
  {
    id: 'wait-02',
    serviceId: 'srv-aviation-residency',
    serviceName: '4-Week Private Aviation Command & Protocol Fleet Mastery',
    clientName: 'Princess Laila Bint Saud',
    clientEmail: 'laila@saud-holdings.sa',
    clientPhone: '+966 50 111 2222',
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    preferredTime: 'Any weekend slot',
    status: 'waiting',
    addedAt: 'Yesterday'
  }
];

export const INITIAL_PROGRAMS: DigitalProgramOrMembership[] = [
  {
    id: 'prog-01',
    name: 'FingerLux Black Card Sovereign VIP Membership',
    type: 'membership',
    description: 'All-inclusive monthly protocol privileges: guaranteed zero-wait penthouse reservations, complimentary armored chauffeur transfers, and 24/7 dedicated handler.',
    price: 5000,
    interval: 'monthly',
    perks: [
      'Guaranteed VIP Booking Clearance in 4 Global Metropolises',
      'Unlimited 24/7 Butler & Protocol Security Detail Inclusion',
      'Direct Private Aviation Runway Escort Privileges',
      'Zero-Fee Cancellations up to 2 Hours Prior to Sessions'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80',
    activeSubscribers: 142
  },
  {
    id: 'prog-02',
    name: 'Sovereign Wealth & Vault Protocol Video Masterclass',
    type: 'digital_program',
    description: '12-part self-paced masterclass covering sovereign digital asset custody, non-custodial bullion vaulting, and luxury asset collateralization.',
    price: 1200,
    interval: 'one_time',
    perks: [
      '12 Ultra-HD Video Modules with Dr. Elena Rostova',
      'Downloadable Legal Charter Templates & Trust Deeds',
      'Quarterly Live Q&A Telepresence Sessions',
      'Verified On-Chain Completion Credential (Sovereign Certificate)'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80',
    activeSubscribers: 489
  },
  {
    id: 'prog-03',
    name: 'Signature Hydro-Spa Aromatherapy & Wellness Kit',
    type: 'product',
    description: 'Handcrafted restorative botanical collection formulated in Grasse, France for private spa clients, featuring sovereign cedarwood, neroli, and gold leaf infusions.',
    price: 650,
    interval: 'one_time',
    perks: [
      '500ml Restorative Cellular Bath Oil with 24K Gold Flakes',
      'Hand-Poured Soy Wax Acoustic Candle (80hr burn)',
      'Silk Eye Mask with Micro-Aromatherapy Capsules',
      'Personalized Protocol Courier Packaging with Wax Seal'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80',
    activeSubscribers: 310
  }
];

export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: 'cli-01',
    name: 'Sir Reginald Vance',
    email: 'reginald.vance@sovereign.co.uk',
    phone: '+44 7911 123456',
    vipTier: 'Sovereign',
    totalBookings: 18,
    lifetimeSpend: 42500,
    notes: 'Member of Sovereign Club since 2024. Regularly books Dubai and London suites.',
    tags: ['Private Jet', 'Superyacht', 'VIP Handshake'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'cli-02',
    name: 'Countess Vivian Chen',
    email: 'vivian.chen@chenholdings.sg',
    phone: '+65 9123 4567',
    vipTier: 'Black Diamond',
    totalBookings: 11,
    lifetimeSpend: 28900,
    notes: 'Horology collector. Owns three tourbillon pieces calibrated at FingerLux.',
    tags: ['Horology', 'Rare Jewels', 'Singapore HQ'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'cli-03',
    name: 'Prince Tariq Al-Hassan',
    email: 'tariq.hassan@al-hassan.ae',
    phone: '+971 50 999 8888',
    vipTier: 'Sovereign',
    totalBookings: 24,
    lifetimeSpend: 68400,
    notes: 'Frequent user of Armored Mercedes-Maybach escort and sovereign advisory.',
    tags: ['Royal Protocol', 'Armored Escort', 'Family Office'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
  }
];
