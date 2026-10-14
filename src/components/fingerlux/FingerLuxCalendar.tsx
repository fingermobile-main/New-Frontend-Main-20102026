import React, { useState, useMemo } from 'react';
import type {
  FingerLuxBooking,
  StaffMember,
  LocationSite,
  BlockedTimeSlot,
  WaitlistEntry,
  AttendanceStatus
} from '../../types/fingerLuxScheduling';
import {
  CalendarIcon,
  ClockIcon,
  CheckIcon,
  XIcon,
  PlusIcon
} from '../../icons';

interface FingerLuxCalendarProps {
  bookings: FingerLuxBooking[];
  staff: StaffMember[];
  locations: LocationSite[];
  blockedSlots: BlockedTimeSlot[];
  waitlist: WaitlistEntry[];
  selectedLocationId: string;
  formatPrice: (amountInFic: number) => string;
  onUpdateAttendance: (bookingId: string, status: AttendanceStatus) => void;
  onAddBlockedSlot: (slot: Partial<BlockedTimeSlot>) => void;
  onPromoteWaitlist: (waitlistId: string) => void;
}

export const FingerLuxCalendar: React.FC<FingerLuxCalendarProps> = ({
  bookings,
  staff,
  locations,
  blockedSlots,
  waitlist,
  selectedLocationId,
  formatPrice,
  onUpdateAttendance,
  onAddBlockedSlot,
  onPromoteWaitlist
}) => {
  // Calendar View Filter States
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [currentDateStr, setCurrentDateStr] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Modals
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [blockStartTime, setBlockStartTime] = useState('12:00');
  const [blockEndTime, setBlockEndTime] = useState('13:30');
  const [blockLocationId, setBlockLocationId] = useState('loc-dubai');

  // Selected Booking Details Modal
  const [inspectedBooking, setInspectedBooking] = useState<FingerLuxBooking | null>(null);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (selectedLocationId !== 'all' && b.locationId !== selectedLocationId && b.delivery !== 'online') return false;
      if (selectedStaffFilter !== 'all' && b.staffId !== selectedStaffFilter) return false;
      if (selectedStatusFilter !== 'all' && b.attendanceStatus !== selectedStatusFilter) return false;
      if (viewMode === 'day' && b.date !== currentDateStr) return false;
      return true;
    });
  }, [bookings, selectedLocationId, selectedStaffFilter, selectedStatusFilter, viewMode, currentDateStr]);

  // Attendance Status Helpers
  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'checked_in':
        return {
          label: 'Checked In',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-500 animate-pulse'
        };
      case 'booked':
        return {
          label: 'Booked & Confirmed',
          color: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          dot: 'bg-indigo-500'
        };
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-violet-100 text-violet-900 border-violet-300',
          dot: 'bg-violet-500'
        };
      case 'no_show':
        return {
          label: 'No-Show (Fee Charged)',
          color: 'bg-rose-100 text-rose-900 border-rose-300',
          dot: 'bg-rose-500'
        };
      case 'late_cancelled':
        return {
          label: 'Late Cancelled (50% Fee)',
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-500'
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          dot: 'bg-gray-400'
        };
    }
  };

  const handleCreateBlock = () => {
    if (!blockReason.trim()) return;
    onAddBlockedSlot({
      date: currentDateStr,
      startTime: blockStartTime,
      endTime: blockEndTime,
      reason: blockReason,
      locationId: blockLocationId
    });
    setBlockReason('');
    setShowBlockModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Controls & Filter Header */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: View Mode & Date Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-2xl">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                  viewMode === mode
                    ? 'bg-white text-indigo-950 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode} View
              </button>
            ))}
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-800">
            <CalendarIcon className="w-4 h-4 text-indigo-600" />
            <input
              type="date"
              value={currentDateStr}
              onChange={(e) => setCurrentDateStr(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={() => setCurrentDateStr(new Date().toISOString().split('T')[0])}
            className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Today
          </button>
        </div>

        {/* Right: Staff Filter, Status Filter & Block Time Slot */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Staff Filter */}
          <select
            value={selectedStaffFilter}
            onChange={(e) => setSelectedStaffFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs font-bold px-3 py-2 rounded-xl text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Specialists</option>
            {staff.map((sm) => (
              <option key={sm.id} value={sm.id}>
                {sm.name} ({sm.role})
              </option>
            ))}
          </select>

          {/* Attendance Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs font-bold px-3 py-2 rounded-xl text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="checked_in">Checked In</option>
            <option value="booked">Booked</option>
            <option value="completed">Completed</option>
            <option value="no_show">No-Show</option>
            <option value="late_cancelled">Late Cancelled</option>
          </select>

          {/* Block Time Slot CTA */}
          <button
            type="button"
            onClick={() => setShowBlockModal(true)}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Block Time Slot</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar Timeline + Sidebars (Waitlist & Policy Shield) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Calendar Timeline & Cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Blocked Slots Banner if any */}
          {blockedSlots.length > 0 && (
            <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-900 block mb-2">
                🔒 Blocked Time Slots & Maintenance Buffers (Double-Booking Protected)
              </span>
              <div className="space-y-1.5">
                {blockedSlots.map((blk) => (
                  <div
                    key={blk.id}
                    className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-rose-100 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span className="font-bold text-gray-800">{blk.reason}</span>
                    </div>
                    <span className="text-gray-500 font-semibold">
                      {blk.date} • {blk.startTime} - {blk.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings Timeline List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <span>📅</span>
                <span>
                  {viewMode === 'day' ? `Appointments for ${currentDateStr}` : 'Scheduled Bookings Matrix'}
                </span>
              </h2>
              <span className="text-xs font-semibold text-gray-500">
                {filteredBookings.length} Active Sessions
              </span>
            </div>

            {filteredBookings.map((b) => {
              const badge = getStatusBadge(b.attendanceStatus);
              const assignedStaff = staff.find((st) => st.id === b.staffId);

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Time Block & Client Details */}
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="bg-slate-900 text-white rounded-2xl p-3 text-center shrink-0 w-24">
                      <span className="text-xs font-black block text-amber-400">{b.startTime}</span>
                      <span className="text-[10px] text-gray-400 block">to {b.endTime}</span>
                      <span className="text-[9px] font-bold text-indigo-300 block mt-1 uppercase">
                        {b.durationMinutes}m
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono font-bold text-gray-400">{b.bookingCode}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${badge.color}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                          <span>{badge.label}</span>
                        </span>
                        {b.delivery === 'online' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            📹 Zoom Bridge
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-black text-gray-900 truncate">{b.serviceName}</h3>

                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 flex-wrap">
                        <span className="font-bold text-gray-800 flex items-center gap-1">
                          <span>👤</span> {b.client.name} ({b.client.vipTier})
                        </span>
                        <span>•</span>
                        <span>Specialist: {assignedStaff?.name || b.staffName}</span>
                        <span>•</span>
                        <span className="truncate">{b.locationName}</span>
                      </div>

                      {b.checkedInAt && (
                        <div className="text-[10px] text-emerald-600 font-bold mt-1">
                          ✓ Check-in timestamp verified: {b.checkedInAt}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Payment Info & Live Attendance Action Buttons */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <div className="text-right">
                      <span className="text-sm font-black text-gray-900 block">
                        {formatPrice(b.totalAmount)}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">
                        {b.paymentStatus === 'paid_full' ? 'Paid in Full' : b.paymentStatus === 'deposit_paid' ? `Deposit (${formatPrice(b.depositAmount)})` : b.paymentStatus}
                      </span>
                    </div>

                    {/* Attendance Status Buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {b.attendanceStatus !== 'checked_in' && b.attendanceStatus !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => onUpdateAttendance(b.id, 'checked_in')}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                          title="Check in attendee in real-time"
                        >
                          <CheckIcon className="w-3.5 h-3.5" />
                          <span>Check In</span>
                        </button>
                      )}

                      {b.attendanceStatus === 'checked_in' && (
                        <button
                          type="button"
                          onClick={() => onUpdateAttendance(b.id, 'completed')}
                          className="px-2.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                          title="Mark session as completed"
                        >
                          <CheckIcon className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                      )}

                      {b.attendanceStatus === 'booked' && (
                        <>
                          <button
                            type="button"
                            onClick={() => onUpdateAttendance(b.id, 'no_show')}
                            className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer"
                            title="Mark as no-show and charge policy fee"
                          >
                            No-Show
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateAttendance(b.id, 'late_cancelled')}
                            className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold transition cursor-pointer"
                            title="Charge late cancellation fee"
                          >
                            Late Cancel
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => setInspectedBooking(b)}
                        className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredBookings.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-xs">
                <div className="text-3xl mb-2">🏖️</div>
                <h3 className="text-sm font-black text-gray-800">No Appointments for this Period</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Calendar is free of bookings. You can block time slots or accept incoming bookings.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Live Waitlists & Cancellation Policy Protection */}
        <div className="space-y-6">
          {/* Waitlist Queue Card */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <span>📋</span> Live Waitlist Queue ({waitlist.length})
              </h3>
              <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                Auto-Notify
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mb-4">
              When slots open up from cancellations, promote waitlisted clients with 1-click.
            </p>

            <div className="space-y-2.5">
              {waitlist.map((w) => (
                <div
                  key={w.id}
                  className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-black text-gray-900">{w.clientName}</div>
                      <div className="text-[10px] text-gray-500">{w.clientEmail}</div>
                    </div>
                    <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      {w.status}
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold text-indigo-900 truncate">
                    {w.serviceName}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Prefers: {w.preferredTime}</span>
                    <span>{w.addedAt}</span>
                  </div>

                  {w.status === 'waiting' && (
                    <button
                      type="button"
                      onClick={() => onPromoteWaitlist(w.id)}
                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Promote to Confirmed Booking
                    </button>
                  )}
                </div>
              ))}

              {waitlist.length === 0 && (
                <div className="text-center py-6 text-xs text-gray-400">
                  Waitlist queue is currently empty.
                </div>
              )}
            </div>
          </div>

          {/* Cancellation & No-Show Protection Policy Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-5 border border-indigo-900/50 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span>🛡️</span> Policy Shield Protection
              </span>
              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                Active 24/7
              </span>
            </div>

            <p className="text-xs text-indigo-200/80 leading-relaxed">
              Rules defined to protect staff time and automatically charge fees for late cancellations and no-shows.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                <span className="text-gray-300">Free Cancellation:</span>
                <span className="font-bold text-white">Up to 24 Hours Prior</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                <span className="text-gray-300">Late Cancellation Fee:</span>
                <span className="font-bold text-amber-300">50% of Booking Total</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                <span className="text-gray-300">No-Show Penalty Fee:</span>
                <span className="font-bold text-rose-300">100% (Card on File)</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-gray-300">Buffer Protection:</span>
                <span className="font-bold text-emerald-300">15m Clean & Prep Time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modal: Block Specific Time Slot --- */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <span>🔒</span> Block Time Slot
              </h3>
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 my-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Reason for Blocking</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Penthouse Sanitization, Staff Training"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={blockStartTime}
                    onChange={(e) => setBlockStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={blockEndTime}
                    onChange={(e) => setBlockEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Facility / Location</label>
                <select
                  value={blockLocationId}
                  onChange={(e) => setBlockLocationId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none"
                >
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateBlock}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
              >
                Lock Time Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal: Booking Inspection Details --- */}
      {inspectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-400">
                  {inspectedBooking.bookingCode}
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-0.5">
                  {inspectedBooking.serviceName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedBooking(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 my-4 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-bold">Client:</span>
                <span className="font-black text-gray-900">
                  {inspectedBooking.client.name} ({inspectedBooking.client.email})
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-bold">Specialist Handler:</span>
                <span className="font-black text-gray-900">{inspectedBooking.staffName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-bold">Location & Facility:</span>
                <span className="font-black text-gray-900">{inspectedBooking.locationName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-bold">Date & Time:</span>
                <span className="font-black text-indigo-600">
                  {inspectedBooking.date} • {inspectedBooking.startTime} - {inspectedBooking.endTime}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-bold">Total Amount:</span>
                <span className="font-black text-gray-900">
                  {formatPrice(inspectedBooking.totalAmount)}
                </span>
              </div>

              {inspectedBooking.virtualMeetingUrl && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="font-bold text-blue-900 block mb-1">Encrypted Meeting Link</span>
                  <a
                    href={inspectedBooking.virtualMeetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline font-semibold truncate block"
                  >
                    {inspectedBooking.virtualMeetingUrl}
                  </a>
                </div>
              )}

              {inspectedBooking.notes && (
                <div className="p-3 rounded-xl bg-gray-50 text-gray-700">
                  <span className="font-bold text-gray-500 block mb-0.5">Booking Notes:</span>
                  <span>{inspectedBooking.notes}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setInspectedBooking(null)}
                className="px-5 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
