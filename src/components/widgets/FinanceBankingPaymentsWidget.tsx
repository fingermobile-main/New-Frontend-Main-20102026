import React, { useState } from 'react';
import {
  Building2,
  Copy,
  CheckCircle,
  ShieldCheck,
  ArrowDownLeft,
  ArrowUpRight,
  Globe,
  FileText,
  AlertCircle,
  Send,
  Lock
} from 'lucide-react';

export type FinancialPurpose =
  | 'All Purposes'
  | 'Salary & Compensation'
  | 'Franchise & Business Offices'
  | 'Moderators & Governance'
  | 'Royalties & Licensing'
  | 'Grants & NYSC Awards'
  | 'Loans & Credit Lines'
  | 'Storefront & Merchant Payouts'
  | 'FingerMobile MarketPlace'
  | 'OwnIt Digital Assets'
  | 'Flamingo Haute Couture'
  | 'Charge Backs & Disputes'
  | 'Financial Sundries & Faucets';

interface CurrencyRailConfig {
  id: string;
  currency: 'NGN' | 'USD' | 'GBP' | 'EUR';
  label: string;
  symbol: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  branchAddress: string;
  swiftCode: string;
  secondarySwift?: string;
  iban?: string;
  correspondentBank?: {
    name: string;
    address: string;
    swiftCode: string;
    accountNumber: string;
  };
  beneficiaryDetails?: {
    name: string;
    accountNumber: string;
  };
}

export const DIRECT_PAY_RAILS: CurrencyRailConfig[] = [
  {
    id: 'rail_ngn',
    currency: 'NGN',
    label: 'Nigerian Naira (NGN)',
    symbol: '₦',
    accountNumber: '2004515736',
    accountName: 'FingerMobile Protocol Communication Company',
    bankName: 'First City Monument Bank (FCMB)',
    branchAddress: 'Adeola Hopewell, Victoria Island, Lagos, Nigeria',
    swiftCode: 'FCMBNGLA',
    secondarySwift: 'FCMBNGLAWEB'
  },
  {
    id: 'rail_usd',
    currency: 'USD',
    label: 'United States Dollar (USD)',
    symbol: '$',
    accountNumber: '2005377173',
    accountName: 'FingerMobile Protocol Communication',
    bankName: 'First City Monument Bank Ltd',
    branchAddress: 'Adeola Hopewell, Victoria Island, Lagos, Nigeria',
    swiftCode: 'FCMBNGLAXXX',
    secondarySwift: 'FCMBNGLA',
    correspondentBank: {
      name: 'CITIBANK, New York, USA',
      address: '399 Park Avenue, New York, NY10043, U.S.A.',
      swiftCode: 'CITIUS33XXX',
      accountNumber: '36887918'
    },
    beneficiaryDetails: {
      name: 'FingerMobile Protocol Communication',
      accountNumber: '2005377173'
    }
  },
  {
    id: 'rail_gbp',
    currency: 'GBP',
    label: 'Great British Pound (GBP)',
    symbol: '£',
    accountNumber: '2005377269',
    accountName: 'FingerMobile Protocol Communication',
    bankName: 'First City Monument Bank Ltd',
    branchAddress: 'Adeola Hopewell, Victoria Island, Lagos, Nigeria',
    swiftCode: 'FCMBNGLAXXX',
    secondarySwift: 'FCMBNGLA',
    iban: 'GB08CITI18500811871706',
    correspondentBank: {
      name: 'CITIBANK, London, UK',
      address: 'Citigroup Centre, Canada Square, Canary Wharf, London E14 5LB, United Kingdom',
      swiftCode: 'CITIGB2LXXX',
      accountNumber: '11871706'
    },
    beneficiaryDetails: {
      name: 'FingerMobile Protocol Communication',
      accountNumber: '2005377269'
    }
  },
  {
    id: 'rail_eur',
    currency: 'EUR',
    label: 'European Euro (EUR)',
    symbol: '€',
    accountNumber: '2005377283',
    accountName: 'FingerMobile Protocol Communication',
    bankName: 'First City Monument Bank Ltd',
    branchAddress: 'Adeola Hopewell, Victoria Island, Lagos, Nigeria',
    swiftCode: 'FCMBNGLA',
    secondarySwift: 'FCMBNGLAWEB',
    beneficiaryDetails: {
      name: 'FingerMobile Protocol Communication',
      accountNumber: '2005377283'
    }
  }
];

export const PERMITTED_PURPOSES: FinancialPurpose[] = [
  'All Purposes',
  'Salary & Compensation',
  'Franchise & Business Offices',
  'Moderators & Governance',
  'Royalties & Licensing',
  'Grants & NYSC Awards',
  'Loans & Credit Lines',
  'Storefront & Merchant Payouts',
  'FingerMobile MarketPlace',
  'OwnIt Digital Assets',
  'Flamingo Haute Couture',
  'Charge Backs & Disputes',
  'Financial Sundries & Faucets'
];

interface WidgetProps {
  initialCurrency?: 'NGN' | 'USD' | 'GBP' | 'EUR';
  compactMode?: boolean;
  // eslint-disable-next-line no-unused-vars
  onInitiatePayout?: (payload: any) => void;
}

export const FinanceBankingPaymentsWidget: React.FC<WidgetProps> = ({
  initialCurrency = 'NGN',
  compactMode = false,
  onInitiatePayout
}) => {
  const [activeCurrency, setActiveCurrency] = useState<'NGN' | 'USD' | 'GBP' | 'EUR'>(initialCurrency);
  const [activeMode, setActiveMode] = useState<'receive' | 'payout'>('receive');
  const [selectedPurpose, setSelectedPurpose] = useState<FinancialPurpose>('All Purposes');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form State for Payout
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutBeneficiary, setPayoutBeneficiary] = useState('');
  const [payoutBankName, setPayoutBankName] = useState('');
  const [payoutAccountNo, setPayoutAccountNo] = useState('');
  const [payoutReference, setPayoutReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  const selectedRail = DIRECT_PAY_RAILS.find((r) => r.currency === activeCurrency) || DIRECT_PAY_RAILS[0];

  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleSubmitPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutAmount || !payoutAccountNo) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setPayoutSuccessMsg(`Payout request of ${selectedRail.symbol}${payoutAmount} queued for verification.`);
      if (onInitiatePayout) {
        onInitiatePayout({
          currency: activeCurrency,
          amount: parseFloat(payoutAmount),
          purpose: selectedPurpose,
          beneficiary: payoutBeneficiary,
          bank: payoutBankName,
          accountNumber: payoutAccountNo,
          reference: payoutReference || `FMP-${Date.now()}`
        });
      }
      setTimeout(() => setPayoutSuccessMsg(null), 5000);
    }, 1200);
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden transition-all duration-300 ${compactMode ? 'p-1' : ''}`}>
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white border-b border-slate-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  FingerMobile Direct Pay
                </span>
                <span className="text-xs text-slate-300 font-medium">Sovereign Treasury Rails</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Finance, Banking, Payments & Earnings Console
              </h2>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex rounded-xl bg-slate-800/80 p-1 border border-slate-700">
            <button
              onClick={() => setActiveMode('receive')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'receive'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Receive / Inflow</span>
            </button>
            <button
              onClick={() => setActiveMode('payout')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeMode === 'payout'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Payout / Outflow</span>
            </button>
          </div>
        </div>

        {/* Currency Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-700/60">
          {DIRECT_PAY_RAILS.map((rail) => (
            <button
              key={rail.currency}
              onClick={() => setActiveCurrency(rail.currency)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                activeCurrency === rail.currency
                  ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 shadow-sm'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-black">
                {rail.symbol}
              </span>
              <span>{rail.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Permitted Purpose Banner */}
      <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="text-xs font-bold text-slate-900">Permitted Operational Purpose:</span>
          <select
            value={selectedPurpose}
            onChange={(e) => setSelectedPurpose(e.target.value as FinancialPurpose)}
            className="text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {PERMITTED_PURPOSES.map((purpose) => (
              <option key={purpose} value={purpose}>
                {purpose}
              </option>
            ))}
          </select>
        </div>
        <div className="text-[11px] font-semibold text-slate-700 flex items-center space-x-1.5">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>FCMB Adeola Hopewell VI Lagos • Swift: FCMBNGLA / FCMBNGLAWEB</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        {activeMode === 'receive' ? (
          <div className="space-y-6">
            {/* Primary Account Callout Card */}
            <div className="bg-gradient-to-br from-emerald-50 via-white to-slate-50 rounded-2xl p-6 border-2 border-emerald-200/80 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>Beneficiary Account Name</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    {selectedRail.accountName}
                  </h3>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">
                    {selectedRail.bankName} • {selectedRail.branchAddress}
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-300 p-4 shadow-sm min-w-[280px]">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {selectedRail.currency} Account Number
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
                      {selectedRail.accountNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(selectedRail.accountNumber, 'accountNumber')}
                      className="p-2 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all border border-emerald-200"
                      title="Copy Account Number"
                    >
                      {copiedKey === 'accountNumber' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Wire Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-700 uppercase">Primary SWIFT Code</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-black text-slate-900 font-mono">{selectedRail.swiftCode}</span>
                    <button
                      onClick={() => handleCopy(selectedRail.swiftCode, 'swiftCode')}
                      className="text-slate-500 hover:text-emerald-700"
                    >
                      {copiedKey === 'swiftCode' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-700 uppercase">Secondary SWIFT / WEB</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-black text-slate-900 font-mono">
                      {selectedRail.secondarySwift || 'FCMBNGLAWEB'}
                    </span>
                    <button
                      onClick={() => handleCopy(selectedRail.secondarySwift || 'FCMBNGLAWEB', 'secSwift')}
                      className="text-slate-500 hover:text-emerald-700"
                    >
                      {copiedKey === 'secSwift' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {selectedRail.iban && (
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-bold text-slate-700 uppercase">IBAN (International)</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-black text-slate-900 font-mono truncate mr-2" title={selectedRail.iban}>
                        {selectedRail.iban}
                      </span>
                      <button
                        onClick={() => handleCopy(selectedRail.iban!, 'iban')}
                        className="text-slate-500 hover:text-emerald-700"
                      >
                        {copiedKey === 'iban' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-700 uppercase">Settlement Speed</div>
                  <div className="mt-1 flex items-center space-x-1.5 text-xs font-black text-emerald-900">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Instant NIP / Same-Day RTGS</span>
                  </div>
                </div>
              </div>

              {/* Correspondent Bank Card (USD & GBP) */}
              {selectedRail.correspondentBank && (
                <div className="mt-4 p-4 rounded-xl bg-slate-100/90 border border-slate-300">
                  <div className="flex items-center space-x-2 text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                    <Globe className="w-4 h-4 text-emerald-700" />
                    <span>International Correspondent Bank Routing (Required for FX Inflow)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-600 font-semibold block">Correspondent Bank:</span>
                      <span className="font-bold text-slate-900">{selectedRail.correspondentBank.name}</span>
                      <p className="text-[11px] text-slate-700">{selectedRail.correspondentBank.address}</p>
                    </div>
                    <div>
                      <span className="text-slate-600 font-semibold block">Correspondent SWIFT:</span>
                      <div className="flex items-center space-x-1">
                        <span className="font-mono font-bold text-slate-900">{selectedRail.correspondentBank.swiftCode}</span>
                        <button
                          onClick={() => handleCopy(selectedRail.correspondentBank!.swiftCode, 'corrSwift')}
                          className="text-slate-500 hover:text-emerald-700"
                        >
                          {copiedKey === 'corrSwift' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 font-semibold block">FCMB Account with Correspondent:</span>
                      <div className="flex items-center space-x-1">
                        <span className="font-mono font-bold text-slate-900">{selectedRail.correspondentBank.accountNumber}</span>
                        <button
                          onClick={() => handleCopy(selectedRail.correspondentBank!.accountNumber, 'corrAcc')}
                          className="text-slate-500 hover:text-emerald-700"
                        >
                          {copiedKey === 'corrAcc' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Permitted Purpose Tag Matrix */}
            <div className="border border-slate-300 rounded-xl p-5 bg-white">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Authorized Financial Faucets & Direct Pay Channels</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {PERMITTED_PURPOSES.filter((p) => p !== 'All Purposes').map((purpose) => (
                  <span
                    key={purpose}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 hover:border-emerald-400 hover:text-emerald-900 transition-all cursor-default"
                  >
                    ✓ {purpose}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Payout / Outflow Mode */
          <form onSubmit={handleSubmitPayout} className="space-y-5">
            {payoutSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>{payoutSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Payout Purpose / Category
                </label>
                <select
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value as FinancialPurpose)}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {PERMITTED_PURPOSES.filter((p) => p !== 'All Purposes').map((purpose) => (
                    <option key={purpose} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Disbursement Amount ({selectedRail.currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold">{selectedRail.symbol}</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Beneficiary Legal Name / Franchise
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Obinna Mbah / Lagos Hub"
                  value={payoutBeneficiary}
                  onChange={(e) => setPayoutBeneficiary(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Beneficiary Receiving Bank
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. First City Monument Bank"
                  value={payoutBankName}
                  onChange={(e) => setPayoutBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Account Number / IBAN
                </label>
                <input
                  type="text"
                  required
                  placeholder="10-digit NUBAN or IBAN"
                  value={payoutAccountNo}
                  onChange={(e) => setPayoutAccountNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-xl font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Payment Reference / Memo
                </label>
                <input
                  type="text"
                  placeholder="e.g. FMP-DIV-2026-001"
                  value={payoutReference}
                  onChange={(e) => setPayoutReference(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-xl font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-700 flex items-center space-x-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Protected by WORM Double-Entry Ledger & Multi-Factor Verification</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Routing Disbursement...' : 'Authorize Disbursement Request'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Regulatory & Privacy Note */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-300 text-[11px] text-slate-700 space-y-1">
          <div className="font-bold text-slate-900 flex items-center space-x-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-700" />
            <span>Compliance, Anti-Money Laundering (AML) & Privacy Disclosures:</span>
          </div>
          <p>
            All inflows and outflows are cleared through First City Monument Bank Ltd (FCMB) and correspondent Citibank rails in accordance with Central Bank of Nigeria (CBN), Financial Action Task Force (FATF), and international SWIFT regulatory frameworks. Payouts are reconciled directly against verified platform identity ledgers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinanceBankingPaymentsWidget;
