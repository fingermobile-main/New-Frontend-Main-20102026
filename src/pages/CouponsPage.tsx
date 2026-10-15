import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Tag,
  Gift,
  CheckCircle2,
  Clock,
  Sparkles,
  Copy,
  PlusCircle,
  Percent,
  Search,
  Filter,
  ShieldCheck,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

export interface CouponItem {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'all' | 'storefront' | 'gallery' | 'academy' | 'beatwave' | 'subscriptions';
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount: number;
  max_discount_amount?: number;
  valid_until: string;
  is_claimed?: boolean;
  is_redeemed?: boolean;
  merchantName?: string;
}

const DEFAULT_COUPONS: CouponItem[] = [
  {
    id: 'coup-01',
    code: 'FINGER2026',
    title: 'Protocol Sovereign Welcome Credit',
    description: 'Enjoy 100 FIC platform credit on your first storefront checkout, photo licensing, or course enrollment.',
    category: 'storefront',
    discount_type: 'fixed',
    discount_value: 100,
    minimum_order_amount: 150,
    valid_until: '2026-12-31',
    merchantName: 'FingerMobile Protocol Foundation'
  },
  {
    id: 'coup-02',
    code: 'CREATOR50',
    title: 'E-Learning Sovereign Academy Rebate',
    description: 'Get 50% discount on all Master Academic Programs and certification exams.',
    category: 'academy',
    discount_type: 'percentage',
    discount_value: 50,
    minimum_order_amount: 50,
    max_discount_amount: 200,
    valid_until: '2026-11-30',
    merchantName: 'FingerMobile Sovereign Academy'
  },
  {
    id: 'coup-03',
    code: 'BEATWAVE20',
    title: 'BeatwaveNG VIP Audio Stems Pass',
    description: '20 FIC instant rebate on 24-bit FLAC master audio track stems and multitrack downloads.',
    category: 'beatwave',
    discount_type: 'fixed',
    discount_value: 20,
    minimum_order_amount: 40,
    valid_until: '2026-12-15',
    merchantName: 'Beatwave NG Studio'
  },
  {
    id: 'coup-04',
    code: 'GALLERY30',
    title: 'High-Res Photo Licensing Early Bird',
    description: '30% rebate on commercial synchronization and billboard print master RAW files.',
    category: 'gallery',
    discount_type: 'percentage',
    discount_value: 30,
    minimum_order_amount: 50,
    valid_until: '2026-11-15',
    merchantName: 'Lumina Gallery Exhibition'
  },
  {
    id: 'coup-05',
    code: 'SOVEREIGNVIP',
    title: 'Annual VIP Membership Fee Waiver',
    description: 'Save 250 FIC on Sovereign Level 5 Protocol Verification and lifetime badge authentication.',
    category: 'subscriptions',
    discount_type: 'fixed',
    discount_value: 250,
    minimum_order_amount: 500,
    valid_until: '2026-12-31',
    merchantName: 'FingerMobile Governance Council'
  }
];

const CouponsPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { member } = useAuth();
  const { ficBalance, showToast } = useAppContext();

  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'available' | 'claimed' | 'create'>('available');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [coupons, setCoupons] = useState<CouponItem[]>(DEFAULT_COUPONS);
  const [claimedCoupons, setClaimedCoupons] = useState<CouponItem[]>([
    {
      id: 'coup-claimed-01',
      code: 'EARLYADOPTER',
      title: 'Genesis Member 25 FIC Credit',
      description: 'Permanent fee waiver voucher for initial storefront launch.',
      category: 'storefront',
      discount_type: 'fixed',
      discount_value: 25,
      minimum_order_amount: 50,
      valid_until: '2026-12-31',
      is_claimed: true,
      merchantName: 'FingerMobile Protocol'
    }
  ]);

  // Merchant creation form state
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [newDiscountVal, setNewDiscountVal] = useState('20');
  const [newMinOrder, setNewMinOrder] = useState('50');
  const [newCategory, setNewCategory] = useState<'storefront' | 'gallery' | 'academy' | 'beatwave' | 'subscriptions'>('storefront');

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
      return matchesCategory;
    });
  }, [coupons, categoryFilter]);

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) {
      showToast?.('Please enter a voucher code', 'warning');
      return;
    }

    const matched = coupons.find(
      (c) => c.code.toLowerCase() === promoCodeInput.trim().toLowerCase()
    );

    if (matched) {
      if (!claimedCoupons.some((c) => c.id === matched.id)) {
        setClaimedCoupons([ { ...matched, is_claimed: true }, ...claimedCoupons ]);
      }
      showToast?.(`Voucher "${matched.code}" activated! ${matched.discount_type === 'percentage' ? `${matched.discount_value}% OFF` : `${matched.discount_value} FIC Credit`} applied.`, 'success');
    } else {
      showToast?.(`Promotional code "${promoCodeInput.toUpperCase()}" registered to your account!`, 'success');
    }

    setPromoCodeInput('');
  };

  const handleClaim = (coupon: CouponItem) => {
    setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
    setClaimedCoupons((prev) => [{ ...coupon, is_claimed: true }, ...prev]);
    showToast?.(`Coupon "${coupon.code}" claimed into your voucher wallet!`, 'success');
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast?.(`Coupon Code "${code}" copied to clipboard!`, 'info');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newTitle.trim()) {
      showToast?.('Code and title are required', 'warning');
      return;
    }

    const created: CouponItem = {
      id: `coup-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      title: newTitle.trim(),
      description: newDesc.trim() || 'Merchant promotional discount voucher.',
      category: newCategory,
      discount_type: newDiscountType,
      discount_value: parseFloat(newDiscountVal) || 10,
      minimum_order_amount: parseFloat(newMinOrder) || 20,
      valid_until: '2026-12-31',
      merchantName: (member as any)?.name || 'Sovereign Merchant'
    };

    setCoupons([created, ...coupons]);
    setActiveTab('available');
    setNewCode('');
    setNewTitle('');
    setNewDesc('');
    showToast?.(`Merchant coupon "${created.code}" published to protocol!`, 'success');
  };

  return (
    <MainLayout pageTitle="Coupons & Promotional Vouchers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. HERO BANNER: Strict Contrast Hierarchy */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-400 text-orange-950 text-xs font-black uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-orange-600" />
                <span>Protocol Rewards &amp; Checkout Rebates</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Sovereign Coupons &amp; Promo Vouchers
              </h1>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                Unlock platform fee waivers, storefront checkout rebates, and partner discounts across E-Learning, Beatwave audio, and Gallery master licenses.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-300 text-center w-full sm:w-auto">
              <span className="block text-[11px] font-bold text-orange-950 uppercase">Active FIC Vault</span>
              <span className="text-2xl font-black text-slate-900">{ficBalance.toLocaleString()} FIC</span>
            </div>
          </div>

          {/* Quick Redemption Input: Strict Core Standard */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <form onSubmit={handleRedeemCode} className="max-w-2xl flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  placeholder="Enter promo code (e.g. FINGER2026, CREATOR50)..."
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl bg-white border border-slate-300 text-slate-900 font-bold placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs font-mono uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all whitespace-nowrap"
              >
                Apply Voucher
              </button>
            </form>
          </div>
        </div>

        {/* 2. TABS & CATEGORIES */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-300 pb-2">
          <div className="flex items-center gap-2">
            {[
              { id: 'available', label: `Available Vouchers (${coupons.length})` },
              { id: 'claimed', label: `My Wallet Vouchers (${claimedCoupons.length})` },
              { id: 'create', label: 'Issue Merchant Coupon' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-800 hover:text-slate-900 border-slate-300 hover:border-slate-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'available' && (
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'storefront', label: 'Storefront' },
                { id: 'academy', label: 'Academy' },
                { id: 'beatwave', label: 'Beatwave' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'subscriptions', label: 'Passes' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryFilter(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    categoryFilter === c.id
                      ? 'bg-orange-100 border-orange-400 text-orange-950 font-black'
                      : 'bg-white border-slate-300 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. AVAILABLE VOUCHERS GRID */}
        {activeTab === 'available' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white rounded-3xl border border-slate-300 hover:border-slate-400 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-100 border border-orange-400 text-orange-950 font-black text-[11px] uppercase tracking-wider">
                      <Percent className="w-3.5 h-3.5 text-orange-600" />
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}% DISCOUNT`
                        : `${coupon.discount_value} FIC REBATE`}
                    </span>

                    <span className="text-[10px] font-bold text-slate-700 uppercase">
                      Exp: {coupon.valid_until}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-snug">
                      {coupon.title}
                    </h3>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed mt-1">
                      {coupon.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-300 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500 uppercase">Promo Code</span>
                      <strong className="text-sm font-mono font-black text-slate-900 tracking-wider">
                        {coupon.code}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(coupon.code)}
                      className="p-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
                      title="Copy Code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span>Min Order: {coupon.minimum_order_amount} FIC</span>
                    <span className="text-orange-600">{coupon.merchantName}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleClaim(coupon)}
                    className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all"
                  >
                    Claim Voucher
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. CLAIMED VOUCHERS */}
        {activeTab === 'claimed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {claimedCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white rounded-3xl border border-slate-300 p-6 flex flex-col justify-between shadow-sm space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 border border-emerald-400 text-emerald-950 font-black text-[10px] uppercase">
                      <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                      Claimed in Wallet
                    </span>
                    <span className="text-[10px] font-bold text-slate-700">
                      Valid to: {coupon.valid_until}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900">{coupon.title}</h3>
                  <p className="text-xs text-slate-700 font-medium">{coupon.description}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-300 flex items-center justify-between">
                  <span className="font-mono font-black text-sm text-slate-900">{coupon.code}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(coupon.code)}
                    className="px-3 py-1 text-xs font-bold rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-100"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. ISSUE MERCHANT COUPON TAB */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 max-w-2xl mx-auto shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Issue Storefront Promo Voucher</h2>
              <p className="text-xs text-slate-700 font-medium mt-1">
                Create promotional discount vouchers for your digital goods, artwork, or consultation services.
              </p>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Coupon Code (Uppercase) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SUMMER25"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Applicable Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="storefront">Storefront Products</option>
                    <option value="gallery">Photo Licensing</option>
                    <option value="academy">Academy Courses</option>
                    <option value="beatwave">Beatwave Audio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Voucher Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Flash 25% Off Store Merchandise"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Terms &amp; Description
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Applicable on all digital downloads and merchandise..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={newDiscountType}
                    onChange={(e) => setNewDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed FIC (🪙)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    value={newDiscountVal}
                    onChange={(e) => setNewDiscountVal(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Min Order (FIC)
                  </label>
                  <input
                    type="number"
                    value={newMinOrder}
                    onChange={(e) => setNewMinOrder(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('available')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase"
                >
                  Publish Promo Code
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default CouponsPage;
