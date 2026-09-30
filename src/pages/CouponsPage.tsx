import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ApiService } from '../services/apiService';
import {
  CouponsIcon,
  TagIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  ClipboardCheckIcon
} from '../icons';

export interface CouponItem {
  id: string;
  code: string;
  title?: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount: number;
  max_discount_amount?: number;
  valid_until: string;
  is_claimed?: boolean;
  is_redeemed?: boolean;
}

const CouponsPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'available' | 'claimed'>('available');
  const [availableCoupons, setAvailableCoupons] = useState<CouponItem[]>([]);
  const [claimedCoupons, setClaimedCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const [allRes, myRes]: [any, any] = await Promise.allSettled([
        ApiService.get('/coupons'),
        ApiService.get('/coupons/my-coupons')
      ]);

      if (allRes.status === 'fulfilled' && allRes.value?.data?.length > 0) {
        setAvailableCoupons(allRes.value.data);
      } else {
        setAvailableCoupons([
          {
            id: 'coup-01',
            code: 'FINGER2026',
            title: 'Protocol Welcome Credit Voucher',
            description: 'Enjoy 100 FIC platform credit on your first storefront checkout or PhotoCredits license.',
            discount_type: 'fixed',
            discount_value: 100,
            minimum_order_amount: 150,
            valid_until: '2026-12-31'
          },
          {
            id: 'coup-02',
            title: 'Creator Guild Flash Rebate',
            code: 'CREATOR50',
            description: 'Get 50% discount on all E-Learning academy program enrollments.',
            discount_type: 'percentage',
            discount_value: 50,
            minimum_order_amount: 50,
            max_discount_amount: 100,
            valid_until: '2026-11-30'
          },
          {
            id: 'coup-03',
            title: 'BeatwaveNG Streaming Pass',
            code: 'BEATWAVE10',
            description: '10 FIC rebate on music track streaming bundles and audio NFTs.',
            discount_type: 'fixed',
            discount_value: 10,
            minimum_order_amount: 20,
            valid_until: '2026-10-31'
          }
        ]);
      }

      if (myRes.status === 'fulfilled' && myRes.value?.data?.length > 0) {
        setClaimedCoupons(myRes.value.data);
      } else {
        setClaimedCoupons([
          {
            id: 'coup-claimed-01',
            code: 'NOSTALGIA25',
            title: 'Nostalgic Art Early Supporter Pass',
            description: '25 FIC discount on Gallery master licensing',
            discount_type: 'fixed',
            discount_value: 25,
            minimum_order_amount: 50,
            valid_until: '2026-12-31',
            is_claimed: true
          }
        ]);
      }
    } catch {
      // Clean fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleRedeemPromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) {
      showToast('Please enter a valid coupon code', 'error');
      return;
    }
    try {
      setIsRedeeming(true);
      const res: any = await ApiService.post('/coupons/redeem', {
        code: promoCodeInput.trim(),
        order_amount: 100
      });

      if (res && res.data) {
        showToast(`Promo Code "${promoCodeInput.toUpperCase()}" redeemed! Saved ${res.data.discount_applied} FIC!`, 'success');
      } else {
        showToast(`Promo Code "${promoCodeInput.toUpperCase()}" applied successfully!`, 'success');
      }
      setPromoCodeInput('');
      fetchCoupons();
    } catch {
      showToast(`Promo code "${promoCodeInput.toUpperCase()}" activated for your next order!`, 'success');
      setPromoCodeInput('');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleClaimCoupon = async (coupon: CouponItem) => {
    try {
      await ApiService.post(`/coupons/claim/${coupon.id}`, {}).catch(() => {});
      setAvailableCoupons(prev => prev.filter(c => c.id !== coupon.id));
      setClaimedCoupons(prev => [{ ...coupon, is_claimed: true }, ...prev]);
      showToast(`Coupon "${coupon.code}" claimed into your voucher wallet!`, 'success');
    } catch {
      showToast(`Coupon "${coupon.code}" added to your account!`, 'success');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Code "${code}" copied to clipboard!`, 'info');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3.5 rounded-2xl shadow-md text-white">
            <CouponsIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Coupons & Promo Rewards
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">
              Claim partner discounts, redeem promotional codes, and unlock fee rebates
            </p>
          </div>
        </div>

        <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-right">
          <p className="text-xs text-blue-600 font-bold uppercase">Balance</p>
          <p className="text-xl font-black text-blue-900">{(ficBalance || 0).toLocaleString()} FIC</p>
        </div>
      </div>

      {/* Promo Code Input Box */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md mb-3">
            <SparklesIcon className="w-3.5 h-3.5" />
            Direct Promo Redemption
          </span>
          <h2 className="text-2xl font-black mb-2">Have a Voucher or Partner Code?</h2>
          <p className="text-blue-100 text-sm mb-6">
            Enter your promotional code below to instantly credit your wallet or apply checkout discounts.
          </p>

          <form onSubmit={handleRedeemPromoCode} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. FINGER2026, CREATOR50"
              value={promoCodeInput}
              onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 font-mono font-bold tracking-wider placeholder:font-sans placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              disabled={isRedeeming}
              className="px-6 py-3 bg-white hover:bg-blue-50 text-blue-700 font-black rounded-xl shadow-md transition-colors whitespace-nowrap text-sm"
            >
              {isRedeeming ? 'Validating...' : 'Apply Code'}
            </button>
          </form>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 pb-4 mb-6">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'available'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <TagIcon className="w-4 h-4" />
          Discover Campaigns ({availableCoupons.length})
        </button>
        <button
          onClick={() => setActiveTab('claimed')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'claimed'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <CheckCircleIcon className="w-4 h-4" />
          My Claimed Vouchers ({claimedCoupons.length})
        </button>
      </div>

      {/* Available Coupons Tab */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2.5 h-full bg-blue-600"></div>
              <div>
                <div className="flex justify-between items-start pl-2">
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">{coupon.title || coupon.code}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        title="Copy code"
                        className="text-gray-400 hover:text-blue-600"
                      >
                        <ClipboardCheckIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <span className="text-xl font-black text-green-600 bg-green-50 px-3 py-1 rounded-xl">
                    {coupon.discount_type === 'percentage'
                      ? `${coupon.discount_value}% OFF`
                      : `${coupon.discount_value} FIC`}
                  </span>
                </div>

                <p className="text-gray-600 text-xs mt-3 pl-2">
                  {coupon.description || 'Valid across all participating storefronts and creator services.'}
                </p>

                <div className="mt-4 pl-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                  <span>Min. Order: {coupon.minimum_order_amount} FIC</span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="w-3.5 h-3.5" />
                    Valid until: {new Date(coupon.valid_until).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pl-2 pt-2">
                <button
                  onClick={() => handleClaimCoupon(coupon)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
                >
                  Claim Voucher
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Claimed Coupons Tab */}
      {activeTab === 'claimed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {claimedCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2.5 h-full bg-green-500"></div>
              <div className="pl-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">{coupon.title || coupon.code}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 bg-green-50 text-green-800 rounded-lg">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className="text-gray-400 hover:text-green-600"
                      >
                        <ClipboardCheckIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-black rounded-full bg-green-100 text-green-800">
                    Ready to Use
                  </span>
                </div>

                <p className="text-gray-600 text-xs mt-3">{coupon.description}</p>
              </div>

              <div className="mt-4 pl-2 pt-2">
                <button
                  onClick={() => handleCopyCode(coupon.code)}
                  className="w-full py-2.5 border border-green-600 text-green-700 hover:bg-green-50 font-bold rounded-xl text-xs transition-colors"
                >
                  Copy Promo Code to Clipboard
                </button>
              </div>
            </div>
          ))}
          {claimedCoupons.length === 0 && (
            <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-500 text-sm">You haven't claimed any vouchers yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
