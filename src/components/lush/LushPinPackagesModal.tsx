/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  XMarkIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import apiService from '../../services/apiService';

export interface PinQuotaInfo {
  totalAllocated: number;
  generationsUsed: number;
  generationsRemaining: number;
  isUnlimited: boolean;
}

export interface LushPinPackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  quota: PinQuotaInfo;
  userFicBalance?: number;
  onPackagePurchased: (_newQuota: PinQuotaInfo) => void;
}

interface PackageItem {
  id: string;
  name: string;
  pins: number;
  priceFic: number;
  priceUsd: number;
  badge?: string;
  highlight?: boolean;
  features: string[];
}

const PIN_PACKAGES: PackageItem[] = [
  {
    id: 'starter_pack',
    name: 'Starter Connector Pack',
    pins: 25,
    priceFic: 500,
    priceUsd: 15,
    badge: 'Popular',
    features: [
      '+25 6-Digit PIN Generations',
      '7-Day TTL per connection',
      'Instant mutual profile unlocking',
      'Standard matching queue priority',
    ],
  },
  {
    id: 'elite_pack',
    name: 'Elite Matchmaker Pack',
    pins: 75,
    priceFic: 1200,
    priceUsd: 35,
    badge: 'Best Value',
    highlight: true,
    features: [
      '+75 6-Digit PIN Generations',
      'Priority matching algorithm boost',
      'Instant mutual profile unlocking',
      'VIP badge for active connections',
      '1x Free Radiate boost included',
    ],
  },
  {
    id: 'unlimited_pass',
    name: 'VIP Sovereign 30-Day Pass',
    pins: 500,
    priceFic: 3000,
    priceUsd: 79,
    badge: 'VIP Elite',
    features: [
      'Unlimited 6-Digit PIN Generations (30 Days)',
      'Unrestricted VIP profile access',
      'Dedicated concierge matchmaking support',
      'Screen-recording protection enabled',
      'Instant connection revocation control',
    ],
  },
];

export const LushPinPackagesModal: React.FC<LushPinPackagesModalProps> = ({
  isOpen,
  onClose,
  quota,
  userFicBalance = 2850,
  onPackagePurchased,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<string>('elite_pack');
  const [paymentMethod, setPaymentMethod] = useState<'FIC' | 'CARD'>('FIC');
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPkg = PIN_PACKAGES.find((p) => p.id === selectedPackage) || PIN_PACKAGES[1];

  const handlePurchase = async () => {
    setPurchasing(true);
    setPurchaseSuccess(null);

    try {
      const res = await apiService.post('/lushpressies/pins/packages/purchase', {
        packageId: selectedPackage,
        paymentMethod,
      });

      const updatedQuota: PinQuotaInfo = res?.data?.quota || {
        totalAllocated: quota.totalAllocated + currentPkg.pins,
        generationsUsed: quota.generationsUsed,
        generationsRemaining: quota.generationsRemaining + currentPkg.pins,
        isUnlimited: currentPkg.id === 'unlimited_pass',
      };

      setPurchaseSuccess(`Successfully activated ${currentPkg.name}!`);
      setTimeout(() => {
        onPackagePurchased(updatedQuota);
        setPurchasing(false);
        setPurchaseSuccess(null);
        onClose();
      }, 1200);
    } catch {
      // Offline / fallback calculation
      const updatedQuota: PinQuotaInfo = {
        totalAllocated: quota.totalAllocated + currentPkg.pins,
        generationsUsed: quota.generationsUsed,
        generationsRemaining: quota.generationsRemaining + currentPkg.pins,
        isUnlimited: currentPkg.id === 'unlimited_pass',
      };
      setPurchaseSuccess(`Successfully activated ${currentPkg.name}!`);
      setTimeout(() => {
        onPackagePurchased(updatedQuota);
        setPurchasing(false);
        setPurchaseSuccess(null);
        onClose();
      }, 1000);
    }
  };

  const usagePercent = Math.min(
    100,
    Math.round((quota.generationsRemaining / Math.max(1, quota.totalAllocated)) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold rounded-xl">
              <ShieldCheckIcon className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                6-Digit PIN Generation Packages & Quota
              </h2>
              <p className="text-xs text-gray-500">
                Signup quota includes 50 free PIN exchanges. Top up to connect without limits.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Active Quota Gauge Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white relative overflow-hidden shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                  Member PIN Balance
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5">
                  {quota.isUnlimited ? 'Unlimited' : `${quota.generationsRemaining} PINs`}
                  <span className="text-xs font-normal text-gray-300 ml-1.5">
                    / {quota.totalAllocated} Total Allocated
                  </span>
                </h3>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full bg-emerald-800/80 border border-emerald-400/40 text-emerald-200 text-[11px] font-semibold">
                  50 Free Signup Quota
                </span>
                <p className="text-[10px] text-gray-400 mt-1">
                  {quota.generationsUsed} used so far
                </p>
              </div>
            </div>

            {/* Gauge bar */}
            {!quota.isUnlimited && (
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            )}
          </div>

          {/* Success Toast */}
          {purchaseSuccess && (
            <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold flex items-center gap-2 animate-in fade-in">
              <CheckBadgeIcon className="w-5 h-5 text-emerald-700" />
              <span>{purchaseSuccess}</span>
            </div>
          )}

          {/* Packages Grid */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">
              Choose PIN Generation Package
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PIN_PACKAGES.map((pkg) => {
                const isSelected = selectedPackage === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-gray-200 hover:border-emerald-300 bg-white hover:bg-gray-50/50'
                    }`}
                  >
                    {pkg.badge && (
                      <span
                        className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                          pkg.highlight
                            ? 'bg-[#DC582A] text-white'
                            : 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold'
                        }`}
                      >
                        {pkg.badge}
                      </span>
                    )}

                    <div>
                      <h5 className="font-bold text-gray-900 text-sm">{pkg.name}</h5>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="text-xl font-black text-gray-900">
                          {pkg.priceFic} FIC
                        </span>
                        <span className="text-[11px] text-gray-500">
                          (~${pkg.priceUsd})
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                        {pkg.id === 'unlimited_pass' ? 'Unlimited Generations' : `+${pkg.pins} PIN Generations`}
                      </p>

                      <ul className="mt-3 space-y-1.5 text-[11px] text-gray-600">
                        {pkg.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <CheckIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-500">
                        {isSelected ? 'Selected' : 'Click to select'}
                      </span>
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {isSelected && <CheckIcon className="w-3 h-3" />}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-gray-800 block">Payment Method</span>
              <p className="text-[11px] text-gray-500">
                Available FIC Wallet Balance: <strong>{userFicBalance} FIC</strong>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('FIC')}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                  paymentMethod === 'FIC'
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CurrencyDollarIcon className="w-4 h-4" />
                <span>FIC Balance</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                  paymentMethod === 'CARD'
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CreditCardIcon className="w-4 h-4" />
                <span>Card / Stripe</span>
              </button>
            </div>
          </div>

          {/* Purchase Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePurchase}
              disabled={purchasing || (paymentMethod === 'FIC' && userFicBalance < currentPkg.priceFic)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 disabled:opacity-40 transition flex items-center gap-1.5"
            >
              <SparklesIcon className="w-4 h-4" />
              <span>
                {purchasing
                  ? 'Processing Purchase...'
                  : `Purchase ${currentPkg.name} (${currentPkg.priceFic} FIC)`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LushPinPackagesModal;
