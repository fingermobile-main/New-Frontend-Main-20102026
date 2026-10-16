import React, { useState } from 'react';
import {
  FingerLuxIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  CheckIcon
} from '../../icons';
import { FORTY_PLUS_CURRENCIES, CurrencyConfigItem } from '../../constants/fingerLuxSchedulingData';
import type { LocationSite } from '../../types/fingerLuxScheduling';

export type FingerLuxTab =
  | 'showcase'
  | 'calendar'
  | 'staff_resources'
  | 'payments_pos'
  | 'ai_ops'
  | 'revenue'
  | 'channels';

interface FingerLuxHeaderProps {
  activeTab: FingerLuxTab;
  onTabChange: (tab: FingerLuxTab) => void;
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  selectedLocationId: string;
  onLocationChange: (locId: string) => void;
  locations: LocationSite[];
  ficBalance: number;
  formatPrice: (amountInFic: number) => string;
  totalBookingsCount: number;
  todayAppointmentsCount: number;
  checkedInRate: number;
  activeStaffCount: number;
  onQuickBookClick: () => void;
}

export const FingerLuxHeader: React.FC<FingerLuxHeaderProps> = ({
  activeTab,
  onTabChange,
  selectedCurrency,
  onCurrencyChange,
  selectedLocationId,
  onLocationChange,
  locations,
  ficBalance,
  formatPrice,
  totalBookingsCount,
  todayAppointmentsCount,
  checkedInRate,
  activeStaffCount,
  onQuickBookClick
}) => {
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');

  const currentCurrencyConfig: CurrencyConfigItem =
    FORTY_PLUS_CURRENCIES[selectedCurrency] || FORTY_PLUS_CURRENCIES.FIC;

  const filteredCurrencies = Object.values(FORTY_PLUS_CURRENCIES).filter(
    (c) =>
      c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
      c.label.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const TABS: Array<{ id: FingerLuxTab; label: string; icon: string; badge?: string }> = [
    { id: 'showcase', label: 'Services & Booking', icon: '🛎️' },
    { id: 'calendar', label: 'Calendar & Attendance', icon: '🗓️', badge: `${todayAppointmentsCount} Today` },
    { id: 'staff_resources', label: 'Staff & Resources', icon: '👥' },
    { id: 'payments_pos', label: 'Payments & POS', icon: '💳' },
    { id: 'ai_ops', label: 'AI Ops & Clients', icon: '🤖', badge: '24/7' },
    { id: 'revenue', label: 'Programs & Revenue', icon: '💎' },
    { id: 'channels', label: 'Omnichannel Links', icon: '🌐' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Identity Banner */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div className="flex items-center">
          <div className="bg-gradient-to-tr from-indigo-700 via-indigo-900 to-slate-950 p-3.5 rounded-2xl shadow-lg border border-indigo-700/50 relative group">
            <FingerLuxIcon className="h-9 w-9 text-amber-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div className="ml-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                FingerLux
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-400 shadow-xs">
                All-in-One Scheduling App
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-950 border border-indigo-300">
                Prestige Concierge
              </span>
            </div>
            <p className="text-slate-700 font-medium text-xs mt-1">
              Take bookings, get paid and manage staff with a scheduling app that handles it all — online & in-person.
            </p>
          </div>
        </div>

        {/* Global Controls: Location Filter, Currency Selector & Quick Book */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Location Selector */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-2xl border border-slate-300 shadow-xs">
            <span className="text-sm">📍</span>
            <select
              value={selectedLocationId}
              onChange={(e) => onLocationChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="all">All Locations (Global)</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} {loc.badge ? `(${loc.badge})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 40+ Currencies Selector */}
          <button
            type="button"
            onClick={() => setShowCurrencyModal(true)}
            className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-300 hover:border-indigo-500 shadow-xs transition group cursor-pointer"
            title="Switch from 40+ Currencies with live conversion"
          >
            <span className="text-base">{currentCurrencyConfig.flag}</span>
            <span className="text-xs font-black text-slate-900 group-hover:text-indigo-600">
              {currentCurrencyConfig.code} ({currentCurrencyConfig.symbol})
            </span>
            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded-md">
              40+ Currencies ▾
            </span>
          </button>

          {/* Quick Booking CTA */}
          <button
            type="button"
            onClick={onQuickBookClick}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-indigo-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>+</span> Book Appointment
          </button>
        </div>
      </div>

      {/* Real-Time Operational Performance Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider">Total Bookings</span>
            <CalendarIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{totalBookingsCount}</div>
            <div className="text-[10px] text-emerald-800 font-bold flex items-center gap-0.5 mt-0.5">
              <ArrowTrendingUpIcon className="w-3 h-3 inline text-emerald-600" /> +18% this month
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider">Today's Schedule</span>
            <ClockIcon className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xl font-black text-indigo-950">{todayAppointmentsCount} Sessions</div>
            <div className="text-[10px] text-slate-600 font-semibold mt-0.5">Zero double bookings</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider">Attendance Rate</span>
            <CheckIcon className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-700">{checkedInRate}%</div>
            <div className="text-[10px] text-slate-600 font-semibold mt-0.5">Checked-in on schedule</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider">Active Staff</span>
            <UsersIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{activeStaffCount} on Duty</div>
            <div className="text-[10px] text-indigo-700 font-bold mt-0.5">Calendars synchronized</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-700 mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider">Your Balance</span>
            <span className="text-xs">💎</span>
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 truncate">{ficBalance.toLocaleString()} FIC</div>
            <div className="text-[10px] text-indigo-700 font-bold mt-0.5 truncate">
              ≈ {formatPrice(ficBalance)}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl p-4 border border-indigo-900/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-300 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Financial Sync</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div>
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>QuickBooks & Xero</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
              ✓ 40+ Currencies Live
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-black transition whitespace-nowrap cursor-pointer relative ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-900 to-indigo-950 text-white shadow-md border border-indigo-800'
                  : 'text-slate-800 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
                    isActive
                      ? 'bg-amber-400 text-indigo-950'
                      : 'bg-indigo-100 text-indigo-950 border border-indigo-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      {/* 40+ Currencies Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative border border-slate-300 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>🌍</span> Select Settlement Currency
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  Choose from 40+ global fiat currencies & protocol tokens. Rates sync automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCurrencyModal(false)}
                className="text-slate-500 hover:text-slate-900 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="my-4">
              <input
                type="text"
                placeholder="Search currency by name or code (e.g. USD, EUR, NGN, AED)..."
                value={currencySearch}
                onChange={(e) => setCurrencySearch(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Currencies Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto p-1">
              {filteredCurrencies.map((cur) => {
                const isSelected = selectedCurrency === cur.code;
                return (
                  <button
                    key={cur.code}
                    type="button"
                    onClick={() => {
                      onCurrencyChange(cur.code);
                      setShowCurrencyModal(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/90 font-black text-indigo-950 shadow-xs border-2'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white text-slate-800'
                    }`}
                  >
                    <span className="text-xl">{cur.flag}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-black truncate text-slate-900">{cur.code} ({cur.symbol})</div>
                      <div className="text-[10px] text-slate-600 font-semibold truncate">{cur.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-700 font-semibold">
              <span>Syncs seamlessly with QuickBooks & Xero ledgers</span>
              <button
                type="button"
                onClick={() => setShowCurrencyModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
