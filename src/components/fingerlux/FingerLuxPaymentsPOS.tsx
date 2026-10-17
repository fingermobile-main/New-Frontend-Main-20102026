import React, { useState } from 'react';
import type {
  FingerLuxBooking,
  InvoiceRecord,
  POSTransaction
} from '../../types/fingerLuxScheduling';
import { FORTY_PLUS_CURRENCIES } from '../../constants/fingerLuxSchedulingData';
import {
  CheckIcon,
  ArrowTrendingUpIcon
} from '../../icons';

interface FingerLuxPaymentsPOSProps {
  bookings: FingerLuxBooking[];
  selectedCurrency: string;
  formatPrice: (amountInFic: number) => string;
  onProcessPOSTransaction: (tx: POSTransaction) => void;
  onIssueInvoice: (inv: InvoiceRecord) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const FingerLuxPaymentsPOS: React.FC<FingerLuxPaymentsPOSProps> = ({
  bookings,
  selectedCurrency,
  formatPrice,
  onProcessPOSTransaction,
  onIssueInvoice,
  showToast
}) => {
  const [activePaymentSubTab, setActivePaymentSubTab] = useState<'pos_terminal' | 'invoicing' | 'accounting_sync'>('pos_terminal');

  // POS State
  const [posMethod, setPosMethod] = useState<'tap_to_pay' | 'card_reader' | 'pos_terminal'>('tap_to_pay');
  const [posAmount, setPosAmount] = useState<number>(1200);
  const [customerRef, setCustomerRef] = useState<string>('Walk-in VIP Suite Guest');
  const [isProcessingNFC, setIsProcessingNFC] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<POSTransaction | null>(null);

  // Invoicing State
  const [invoiceClientName, setInvoiceClientName] = useState('');
  const [invoiceClientEmail, setInvoiceClientEmail] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState<number>(2500);
  const [invoiceBookingCode, setInvoiceBookingCode] = useState('FLX-8042');
  const [issuedInvoices, setIssuedInvoices] = useState<InvoiceRecord[]>([
    {
      id: 'inv-1',
      invoiceNumber: 'INV-FLX-90142',
      bookingCode: 'FLX-8041',
      clientName: 'Sir Reginald Vance',
      clientEmail: 'reginald.vance@sovereign.co.uk',
      amount: 1200,
      currency: 'FIC',
      status: 'paid',
      dueDate: new Date().toISOString().split('T')[0],
      paymentLink: 'https://fingerlux.protocol/pay/inv-90142',
      createdAt: '2 days ago'
    },
    {
      id: 'inv-2',
      invoiceNumber: 'INV-FLX-90143',
      bookingCode: 'FLX-8042',
      clientName: 'Countess Vivian Chen',
      clientEmail: 'vivian.chen@chenholdings.sg',
      amount: 1750,
      currency: 'FIC',
      status: 'unpaid',
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      paymentLink: 'https://fingerlux.protocol/pay/inv-90143',
      createdAt: 'Yesterday'
    }
  ]);

  // QuickBooks / Xero Sync State
  const [isSyncingLedger, setIsSyncingLedger] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Today at 09:42 AM');

  // Trigger NFC Tap to Pay
  const handleTriggerTapToPay = async () => {
    setIsProcessingNFC(true);
    try {
      await new Promise((r) => setTimeout(r, 1400));
      const tx: POSTransaction = {
        id: `pos-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        amount: posAmount,
        currency: selectedCurrency,
        method: posMethod,
        terminalId: 'FLX-NFC-TERMINAL-01',
        authCode: `AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
        receiptNumber: `RCP-${Math.floor(10000000 + Math.random() * 90000000)}`,
        customerRef,
        status: 'approved'
      };

      setLastReceipt(tx);
      onProcessPOSTransaction(tx);
      showToast(`Payment of ${formatPrice(posAmount)} approved via ${posMethod.replace('_', ' ').toUpperCase()}!`, 'success');
    } finally {
      setIsProcessingNFC(false);
    }
  };

  // Generate Invoice
  const handleCreateInvoice = () => {
    if (!invoiceClientName.trim()) {
      showToast('Please enter client name for invoice', 'error');
      return;
    }

    const newInv: InvoiceRecord = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-FLX-${Math.floor(10000 + Math.random() * 90000)}`,
      bookingCode: invoiceBookingCode || 'FLX-CUSTOM',
      clientName: invoiceClientName,
      clientEmail: invoiceClientEmail || 'client@protocol.com',
      amount: invoiceAmount,
      currency: selectedCurrency,
      status: 'unpaid',
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      paymentLink: `https://fingerlux.protocol/pay/inv-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: 'Just now'
    };

    setIssuedInvoices([newInv, ...issuedInvoices]);
    onIssueInvoice(newInv);
    setInvoiceClientName('');
    setInvoiceClientEmail('');
    showToast(`Invoice ${newInv.invoiceNumber} created with shareable payment link!`, 'success');
  };

  // Trigger Accounting Sync
  const handleSyncAccounting = async () => {
    setIsSyncingLedger(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setLastSyncTime('Just now');
      showToast('QuickBooks & Xero ledgers synchronized! 152 transactions reconciled across 40+ currencies.', 'success');
    } finally {
      setIsSyncingLedger(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'pos_terminal', label: 'In-Person POS & Tap to Pay', icon: '📱' },
            { id: 'invoicing', label: 'Invoices & Deposit Collection', icon: '🧾' },
            { id: 'accounting_sync', label: 'QuickBooks / Xero & 40+ Currencies', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePaymentSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                activePaymentSubTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-slate-900">Settlement Gateway: PCI-DSS Level 1 & Protocol Vault</span>
        </div>
      </div>

      {/* --- SUB-TAB 1: IN-PERSON POS & TAP TO PAY SIMULATOR --- */}
      {activePaymentSubTab === 'pos_terminal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Terminal Simulator */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>💳</span> FingerLux In-Person Payment Terminal
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  Accept payments in-person using Tap to Pay, Bluetooth card readers or POS terminals.
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-950 px-2.5 py-1 rounded-full border border-emerald-400">
                Live Terminal
              </span>
            </div>

            {/* Terminal Mode Selector */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'tap_to_pay', label: 'Tap to Pay (NFC)', sub: 'iPhone / Android Touch', icon: '📲' },
                { id: 'card_reader', label: 'Bluetooth Reader', sub: 'EMV Chip & PIN Unit', icon: '💳' },
                { id: 'pos_terminal', label: 'Handheld POS', sub: 'All-in-One Register', icon: '📟' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPosMethod(m.id as any)}
                  className={`p-3.5 rounded-2xl border text-center transition cursor-pointer ${
                    posMethod === m.id
                      ? 'border-indigo-600 bg-indigo-50/80 font-black text-indigo-950 shadow-xs'
                      : 'border-slate-300 bg-white hover:border-slate-400 text-slate-800'
                  }`}
                >
                  <span className="text-2xl block mb-1">{m.icon}</span>
                  <span className="text-xs font-bold block">{m.label}</span>
                  <span className="text-[10px] text-slate-700 font-semibold block">{m.sub}</span>
                </button>
              ))}
            </div>

            {/* Amount Selection & Input */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                Charge Amount ({selectedCurrency})
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={posAmount}
                  onChange={(e) => setPosAmount(Number(e.target.value))}
                  className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-xl font-black text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none font-bold placeholder:text-slate-400 font-mono"
                />
                <span className="text-sm font-bold text-slate-700">
                  ≈ {formatPrice(posAmount)}
                </span>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2">
                {[500, 1200, 1800, 2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPosAmount(amt)}
                    className="px-3 py-1 bg-white border border-slate-300 hover:border-indigo-500 rounded-xl text-xs font-bold text-slate-900 transition cursor-pointer"
                  >
                    {amt.toLocaleString()} FIC
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-900 block mt-2 mb-1">
                  Customer / Room Reference
                </label>
                <input
                  type="text"
                  value={customerRef}
                  onChange={(e) => setCustomerRef(e.target.value)}
                  placeholder="e.g. Penthouse Suite 5401 - Sir Reginald Vance"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Interactive Tap to Pay Surface / Action Trigger */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white text-center space-y-4 border border-indigo-900/60 shadow-lg relative overflow-hidden">
              {isProcessingNFC && (
                <div className="absolute inset-0 bg-indigo-900/80 backdrop-blur-xs flex flex-col items-center justify-center space-y-2 z-10 animate-fade-in">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin"></div>
                  <span className="text-sm font-black text-amber-300">
                    Contactless Handshake Synchronizing...
                  </span>
                  <span className="text-[11px] text-indigo-200">Processing secure EMV cryptogram</span>
                </div>
              )}

              <div className="mx-auto w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-3xl mb-2 animate-pulse">
                📶
              </div>

              <div>
                <h4 className="text-xl font-black text-white">
                  Hold Phone or Card Here to Pay
                </h4>
                <p className="text-xs text-indigo-200/90 mt-1 max-w-sm mx-auto font-medium">
                  Supports Apple Pay, Google Pay, Contactless Visa/Mastercard/Amex, and Protocol NFC Keycards.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTriggerTapToPay}
                  disabled={isProcessingNFC}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-indigo-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition transform hover:scale-105 cursor-pointer"
                >
                  ⚡ Simulate Contactless Tap ({formatPrice(posAmount)})
                </button>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Bluetooth Reader Status & Live Receipt */}
          <div className="space-y-6">
            {/* Bluetooth Reader Status Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span>📡</span> Card Reader Hardware
                </span>
                <span className="text-[10px] font-black text-emerald-950 bg-emerald-100 border border-emerald-400 px-2 py-0.5 rounded-full">
                  Connected
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-700 font-bold">Device:</span>
                  <span className="font-black text-slate-900">FingerLux Reader B1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700 font-bold">Battery:</span>
                  <span className="font-bold text-emerald-700">🔋 94% Charged</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700 font-bold">Firmware:</span>
                  <span className="font-bold text-slate-900">v3.4.1 (Latest)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700 font-bold">Terminal ID:</span>
                  <span className="font-mono font-bold text-slate-900">FLX-NFC-TERMINAL-01</span>
                </div>
              </div>
            </div>

            {/* Digital Receipt Card if transaction was processed */}
            {lastReceipt && (
              <div className="bg-white rounded-3xl p-5 border-2 border-emerald-500/50 shadow-md space-y-3 animate-slide-up">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                  <span className="font-black text-emerald-700 flex items-center gap-1">
                    <CheckIcon className="w-4 h-4" /> Approved
                  </span>
                  <span className="text-[10px] text-slate-700 font-semibold">{lastReceipt.timestamp}</span>
                </div>

                <div className="text-center py-2">
                  <div className="text-[10px] uppercase font-bold text-slate-700">Amount Settled</div>
                  <div className="text-2xl font-black text-slate-900">
                    {formatPrice(lastReceipt.amount)}
                  </div>
                  <div className="text-[11px] font-bold text-indigo-700">
                    {lastReceipt.amount.toLocaleString()} FIC
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] bg-slate-50 border border-slate-200 p-3 rounded-2xl text-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-700 font-bold">Receipt No:</span>
                    <span className="font-mono font-bold text-slate-900">{lastReceipt.receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700 font-bold">Auth Code:</span>
                    <span className="font-mono font-bold text-slate-900">{lastReceipt.authCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700 font-bold">Client Ref:</span>
                    <span className="font-bold text-slate-900 truncate max-w-[130px]">{lastReceipt.customerRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700 font-bold">Settlement:</span>
                    <span className="font-bold text-emerald-700">Instant Protocol Escrow</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast(`Digital receipt ${lastReceipt.receiptNumber} dispatched to client via SMS & Email.`, 'success')}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Send Digital Receipt (SMS / Email)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SUB-TAB 2: INVOICING & DEPOSIT COLLECTION --- */}
      {subTabWrapper(activePaymentSubTab, 'invoicing', (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoice Creator Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Issue Client Invoice & Payment Link</h3>
              <p className="text-xs text-slate-700 font-medium">
                Collect deposits, store cards on file or generate shareable payment links.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-900 block mb-1">Client Name</label>
                <input
                  type="text"
                  placeholder="e.g. Countess Vivian Chen"
                  value={invoiceClientName}
                  onChange={(e) => setInvoiceClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Client Email</label>
                <input
                  type="email"
                  placeholder="client@chenholdings.sg"
                  value={invoiceClientEmail}
                  onChange={(e) => setInvoiceClientEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Amount (FIC)</label>
                  <input
                    type="number"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Booking Code</label>
                  <input
                    type="text"
                    value={invoiceBookingCode}
                    onChange={(e) => setInvoiceBookingCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreateInvoice}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-xs"
            >
              Issue Invoice & Generate Link
            </button>
          </div>

          {/* Invoices List */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-slate-900">
                Issued Invoices & Shareable Payment Links ({issuedInvoices.length})
              </h3>
              <span className="text-xs text-slate-700 font-bold">Zero-fee settlement</span>
            </div>

            <div className="divide-y divide-slate-200">
              {issuedInvoices.map((inv) => (
                <div key={inv.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{inv.invoiceNumber}</span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                            : 'bg-amber-100 text-emerald-950 border-emerald-400'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">{inv.clientName}</div>
                    <div className="text-[11px] text-slate-700 font-medium">Due: {inv.dueDate} • Booking: {inv.bookingCode}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-slate-900 block">
                      {formatPrice(inv.amount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(inv.paymentLink);
                        showToast(`Copied payment link: ${inv.paymentLink}`, 'info');
                      }}
                      className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 transition cursor-pointer"
                    >
                      Copy Pay Link ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* --- SUB-TAB 3: ACCOUNTING SYNC & 40+ CURRENCIES --- */}
      {subTabWrapper(activePaymentSubTab, 'accounting_sync', (
        <div className="space-y-6">
          {/* Accounting Sync Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border border-indigo-900 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📊</span>
                <h3 className="text-lg font-black text-white">QuickBooks & Xero Real-Time Ledger Synchronization</h3>
              </div>
              <p className="text-xs text-indigo-200/90 mt-1 max-w-xl font-medium">
                Automatically reconcile deposits, appointments, and late fees into double-entry accounting ledgers.
                Synchronized: {lastSyncTime}.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSyncAccounting}
              disabled={isSyncingLedger}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-indigo-950 font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shrink-0 shadow-xs flex items-center gap-2"
            >
              <span>{isSyncingLedger ? 'Syncing Ledgers...' : 'Sync Ledgers Now'}</span>
              <ArrowTrendingUpIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Top 40+ Currencies Live Exchange Rates Grid */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Multi-Currency Matrix (40+ Currencies Supported)
              </h3>
              <p className="text-xs text-slate-700 font-medium">
                Clients can book and pay in their native currency. All rates update dynamically against protocol vault reserves.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-1">
              {Object.values(FORTY_PLUS_CURRENCIES).map((c) => (
                <div
                  key={c.code}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{c.flag}</span>
                    <span className="text-xs font-black text-slate-900">{c.code}</span>
                  </div>
                  <div className="text-[11px] font-bold text-indigo-700">
                    {c.symbol} {c.rate.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-700 font-semibold truncate">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper for conditional rendering
function subTabWrapper(current: string, target: string, element: React.ReactNode) {
  return current === target ? element : null;
}
