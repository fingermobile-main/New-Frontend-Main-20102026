/**
 * FingerMobile Protocol™ - FingerLux Scheduling, Bookings, Staff & Payments Types
 * Copyright © 2026 Mbah Israel Obinna. All rights reserved.
 */

export type ServiceType = 'appointment' | 'class' | 'course';
export type ServiceDelivery = 'in_person' | 'online' | 'hybrid';
export type AttendanceStatus = 'booked' | 'checked_in' | 'completed' | 'no_show' | 'late_cancelled';
export type PaymentStatus = 'paid_full' | 'deposit_paid' | 'pending' | 'refunded' | 'fee_charged';
export type PaymentRail = 'fic' | 'card' | 'pos_tap' | 'bluetooth_reader' | 'apple_pay' | 'crypto';
export type StaffRole = 'Master Concierge' | 'Senior Specialist' | 'Lead Instructor' | 'Front Desk Manager';

export interface CancellationPolicy {
  freeCancelHours: number; // e.g. 24
  lateCancelFeePercent: number; // e.g. 50%
  noShowFeePercent: number; // e.g. 100%
  policyNotes?: string;
}

export interface IntakeFormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface FingerLuxService {
  id: string;
  name: string;
  type: ServiceType;
  category: string;
  description: string;
  price: number; // in FIC or base currency
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  capacity: number; // 1 for appointment, >1 for class
  delivery: ServiceDelivery;
  locationId: string;
  resourceIds: string[];
  assignedStaffIds: string[];
  cancellationPolicy: CancellationPolicy;
  depositRequired: boolean;
  depositPercent: number;
  intakeFormFields: IntakeFormField[];
  tags: string[];
  imageUrl: string;
  scheduleDates?: string[]; // for multi-session courses: list of session dates/times
  virtualMeetingUrl?: string; // Zoom or Google Meet URL template
}

export interface WorkingHoursDay {
  start: string; // e.g. "09:00"
  end: string; // e.g. "18:00"
  isWorking: boolean;
}

export interface StaffPermissions {
  canViewFinances: boolean;
  canEditSchedule: boolean;
  canIssueRefunds: boolean;
  canManageClients: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  avatar: string;
  email: string;
  phone: string;
  assignedServiceIds: string[];
  locationIds: string[];
  workingHours: Record<string, WorkingHoursDay>; // 'Monday', 'Tuesday', ...
  calendarSync: {
    googleCalendar: boolean;
    outlookCalendar: boolean;
    appleCalendar: boolean;
    lastSyncedAt: string;
  };
  permissions: StaffPermissions;
}

export interface BookableResource {
  id: string;
  name: string;
  type: 'room' | 'equipment' | 'vehicle';
  locationId: string;
  capacity: number;
  isAvailable: boolean;
  description: string;
  icon: string;
}

export interface LocationSite {
  id: string;
  name: string;
  city: string;
  address: string;
  timezone: string;
  contactEmail: string;
  contactPhone: string;
  isVirtual: boolean;
  badge?: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  vipTier: 'Sovereign' | 'Black Diamond' | 'Platinum' | 'Gold';
  totalBookings: number;
  lifetimeSpend: number;
  notes?: string;
  tags: string[];
  avatar: string;
}

export interface FingerLuxBooking {
  id: string;
  bookingCode: string; // e.g. FLX-8042
  serviceId: string;
  serviceName: string;
  serviceType: ServiceType;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    vipTier: string;
    notes?: string;
  };
  staffId: string;
  staffName: string;
  locationId: string;
  locationName: string;
  resourceIds: string[];
  resourceNames: string[];
  delivery: ServiceDelivery;
  virtualMeetingUrl?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  attendanceStatus: AttendanceStatus;
  checkedInAt?: string;
  paymentStatus: PaymentStatus;
  paymentRail: PaymentRail;
  totalAmount: number;
  depositAmount: number;
  feeCharged: number;
  intakeResponses: Record<string, any>;
  notes: string;
  createdAt: string;
}

export interface BlockedTimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  staffId?: string;
  staffName?: string;
  locationId?: string;
  resourceId?: string;
}

export interface WaitlistEntry {
  id: string;
  serviceId: string;
  serviceName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  preferredTime: string;
  status: 'waiting' | 'notified' | 'promoted';
  addedAt: string;
}

export interface DigitalProgramOrMembership {
  id: string;
  name: string;
  type: 'membership' | 'digital_program' | 'product';
  description: string;
  price: number;
  interval?: 'monthly' | 'yearly' | 'one_time';
  perks: string[];
  thumbnail: string;
  activeSubscribers?: number;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  bookingCode: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  currency: string;
  status: 'paid' | 'unpaid' | 'overdue';
  dueDate: string;
  paymentLink: string;
  createdAt: string;
}

export interface POSTransaction {
  id: string;
  timestamp: string;
  amount: number;
  currency: string;
  method: 'tap_to_pay' | 'card_reader' | 'pos_terminal';
  terminalId: string;
  authCode: string;
  receiptNumber: string;
  customerRef?: string;
  status: 'approved' | 'declined' | 'settled';
}
