import React, { useState, useId, useEffect } from 'react';
import axios from 'axios';
import { XIcon } from '../icons';

export interface CreateHallmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommunityCreated?: (community: any) => void;
  activeCount?: number;
  maxAllowed?: number;
}

export type HallmarkTier = 'individual' | 'brand' | 'company';

export interface HallmarkFormData {
  tier: HallmarkTier;
  pageName: string;
  category: string;
  description: string;
  websiteUrl: string;
  idType: string;
  idNumber: string;
  companyRegNumber: string;
  guarantors: string[];
  managers: string[];
  moderators: string[];
  termsAgreed: boolean;
  refundableAgreed: boolean;
}

const TIER_DETAILS = {
  individual: {
    title: 'Individual Creator / Figure',
    capacity: 'Up to 250,000 Members',
    badge: 'Standard Hallmark',
    cost: '₦5,000.00 (3-Month Refundable Verification Deposit)',
    isRefundable: true,
    amountNgn: 5000,
    requiredDocs: '1-Year Valid Govt ID (Driver’s License / Int’l Passport / NIN / Green Card)',
    guarantorsNeeded: 0,
    managersNeeded: 0,
    moderatorsNeeded: 0,
    features: [
      'Public page visibility & Google Search indexing',
      'Unlimited follower scale up to 250,000',
      'Access to FingerMobile Insights & Business Tools',
      'Earn 5% Ad Revenue Commission upon hitting 250k members'
    ]
  },
  brand: {
    title: 'Brand / Content Creator',
    capacity: 'Up to 2,000,000 Members',
    badge: 'Pro Brand Hallmark',
    cost: '₦25,000.00 / Quarter (Non-Refundable Subscription)',
    isRefundable: false,
    amountNgn: 25000,
    requiredDocs: '1-Year Valid Govt ID + Government Registered Business/CAC Documents',
    guarantorsNeeded: 1,
    managersNeeded: 1,
    moderatorsNeeded: 1,
    features: [
      'Scale up to 2,000,000 followers with tier priority feed',
      '1 Appointed Page Manager + 1 Platform Badge Moderator',
      'Advanced Brand Ads manager & multi-channel scheduling',
      'Priority Hallmark verification queue & verification crest'
    ]
  },
  company: {
    title: 'Company / Organization',
    capacity: 'Up to 5,000,000 Members',
    badge: 'Enterprise Hallmark',
    cost: '₦75,000.00 / Quarter (Non-Refundable Subscription)',
    isRefundable: false,
    amountNgn: 75000,
    requiredDocs: '1-Year Valid Govt ID + Certificate of Incorporation + Tax ID',
    guarantorsNeeded: 4,
    managersNeeded: 2,
    moderatorsNeeded: 3,
    features: [
      'Massive 5,000,000 follower broadcast capacity',
      '4 Corporate Guarantors + 2 Dedicated Managers + 3 Moderators',
      'Enterprise Analytics, Custom CTA buttons, and Webhooks',
      'Verified corporate crest and platform brand endorsement'
    ]
  }
};

const GENERIC_WORDS = new Set([
  'fashion', 'coffee', 'music', 'tech', 'news', 'crypto', 'football',
  'sports', 'shopping', 'store', 'video', 'games', 'food', 'lifestyle',
  'new york', 'london', 'lagos', 'abuja', 'paris', 'tokyo', 'africa'
]);

const MISLEADING_TERMS = ['official', 'verified', 'support', 'admin', 'moderator', 'staff', 'fingermobile'];
const META_REFERENCES = ['whatsapp', 'facebook', 'messenger', 'instagram', 'meta', 'twitter', 'tiktok'];

export const validateHallmarkName = (name: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const trimmed = name.trim();

  if (trimmed.length <= 3) {
    errors.push('Name must be longer than 3 characters.');
  }

  // Spacing: single spacing only
  if (/\s{2,}/.test(trimmed)) {
    errors.push('Name cannot have extra or irregular spaces between words.');
  }

  // Capitalization check: no ALL-CAPS unless short acronym <= 4 chars
  const words = trimmed.split(/\s+/);
  if (words.length > 1 && trimmed === trimmed.toUpperCase()) {
    errors.push('All-caps are prohibited unless an established short acronym.');
  } else if (trimmed.length > 4 && trimmed === trimmed.toUpperCase()) {
    errors.push('Name cannot be all capital letters. Use grammatically correct title case or lowercase.');
  }

  // Punctuation & Symbols: no emojis, hashtags, slogans, punctuation (:, ;, !, ?, [], ()), no consecutive non-alphanumeric, no TM or (R)
  if (/[™®:;!?#[\](){}<>@$%^&*+=_~`|\\]/.test(trimmed)) {
    errors.push('Punctuation, emojis, slogans, brackets, and trademark symbols (™ or ®) are prohibited.');
  }

  // No URLs or web links
  if (/(\.com|\.org|\.net|\.ng|\.io|https?:\/\/|www\.)/i.test(trimmed)) {
    errors.push('Names cannot be formatted as web links or email addresses.');
  }

  // No generic words
  const lower = trimmed.toLowerCase();
  if (GENERIC_WORDS.has(lower)) {
    errors.push(`"${trimmed}" is too generic. Names cannot consist solely of generic terms or locations.`);
  }

  // No misleading terms
  for (const term of MISLEADING_TERMS) {
    if (new RegExp(`\\b${term}\\b`, 'i').test(trimmed)) {
      errors.push(`Name cannot include misleading words like "${term}" which imply special endorsement.`);
    }
  }

  // No meta references
  for (const meta of META_REFERENCES) {
    if (new RegExp(`\\b${meta}\\b`, 'i').test(trimmed)) {
      errors.push(`Name cannot contain external network names like "${meta}".`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const CreateHallmarkModal: React.FC<CreateHallmarkModalProps> = ({
  isOpen,
  onClose,
  onCommunityCreated,
  activeCount = 0,
  maxAllowed = 2
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedTier, setSelectedTier] = useState<HallmarkTier>('individual');
  const [pageName, setPageName] = useState('');
  const [category, setCategory] = useState('Technology & Innovation');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [idType, setIdType] = useState('NIN');
  const [idNumber, setIdNumber] = useState('');
  const [companyRegNumber, setCompanyRegNumber] = useState('');
  
  // Appointed members state
  const [guarantors, setGuarantors] = useState<string[]>(['']);
  const [managers, setManagers] = useState<string[]>(['']);
  const [moderators, setModerators] = useState<string[]>(['']);

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const resetForm = () => {
    setStep(1);
    setSelectedTier('individual');
    setPageName('');
    setCategory('Technology & Innovation');
    setDescription('');
    setWebsiteUrl('');
    setIdType('NIN');
    setIdNumber('');
    setCompanyRegNumber('');
    setGuarantors(['']);
    setManagers(['']);
    setModerators(['']);
    setTermsAgreed(false);
    setIsSubmitting(false);
    setReferenceId('');
    setSubmitError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const nameValidation = validateHallmarkName(pageName);
  const tierConfig = TIER_DETAILS[selectedTier];

  if (!isOpen) return null;

  const handleNextFromStep1 = () => {
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    if (!nameValidation.isValid) return;
    if (!description.trim()) return;
    setStep(3);
  };

  const handleNextFromStep3 = () => {
    if (!idNumber.trim()) return;
    if (selectedTier !== 'individual' && !companyRegNumber.trim()) return;
    setStep(4);
  };

  const handleSubmitApplication = async () => {
    if (!termsAgreed) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await axios.post('http://localhost:3001/api/hallmarks', {
        name: pageName.trim(),
        description: description.trim(),
        tier: selectedTier,
        category,
        websiteUrl,
        idType,
        idNumber,
        companyRegNumber
      });

      const serverData = response.data?.data;
      const newRef = serverData?.reference_token || ('HM-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-2026');
      setReferenceId(newRef);

      const createdPayload = {
        id: serverData?.id || Date.now(),
        name: pageName.trim(),
        description: description.trim(),
        tier: selectedTier,
        category,
        members: 1,
        badgesAwarded: 0,
        featured: selectedTier !== 'individual',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
        referenceId: newRef
      };

      if (onCommunityCreated) {
        onCommunityCreated(createdPayload);
      }

      setStep(5);
    } catch (err: any) {
      console.error('Error creating hallmark:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to submit application. Maximum 2 pages allowed per profile.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-300 dark:border-gray-800 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:to-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏛️</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create a HallMarks™ Page</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ff6b00] border border-orange-400 text-orange-950 font-black">
                Official Entity Account
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
              Public account for businesses, creators, brands, and organizations to scale unlimited audiences.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-slate-700 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step Breadcrumb */}
        <div className="px-6 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-b border-slate-300 dark:border-gray-800 flex items-center justify-between text-xs font-medium">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-[#ff6b00] font-bold' : 'text-slate-700'}`}>
            <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[11px] border text-gray-950 border-gray-400 font-black">1</span>
            <span>Tier Selection</span>
          </div>
          <span className="text-slate-700">›</span>
          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-[#ff6b00] font-bold' : 'text-slate-700'}`}>
            <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[11px] border text-gray-950 border-gray-400 font-black">2</span>
            <span>Naming & Policy</span>
          </div>
          <span className="text-slate-700">›</span>
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-[#ff6b00] font-bold' : 'text-slate-700'}`}>
            <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[11px] border text-gray-950 border-gray-400 font-black">3</span>
            <span>Verification & Roles</span>
          </div>
          <span className="text-slate-700">›</span>
          <div className={`flex items-center gap-1.5 ${step === 4 ? 'text-[#ff6b00] font-bold' : 'text-slate-700'}`}>
            <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[11px] border text-gray-950 border-gray-400 font-black">4</span>
            <span>Subscription & Submit</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">

          {/* STEP 1: Tier Selection */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 text-xs text-amber-800 dark:text-amber-300">
                <p className="font-bold mb-1">📌 Important Platform HallMarks Rules:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Only verified, badge-carrying members can create a HallMarks Page.</li>
                  <li>Members can only register a <strong>maximum of Two (2) HallMarks Pages</strong> per personal profile, verified phone, or email.</li>
                  <li>Page closure requires a <strong>30-day notification period</strong> to all members to settle liability & spurious reporting.</li>
                  <li>Owner must have been active with <strong>20–30 personal Live UGC</strong> at least once every 2 months.</li>
                  <li><strong>250,000 Milestone Bonus:</strong> Hitting 250k members awards Digital Proof-of-Achievement & <strong>5% Ad Revenue Commission</strong>!</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['individual', 'brand', 'company'] as HallmarkTier[]).map((tierKey) => {
                  const item = TIER_DETAILS[tierKey];
                  const isSelected = selectedTier === tierKey;
                  return (
                    <div
                      key={tierKey}
                      onClick={() => setSelectedTier(tierKey)}
                      className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#ff6b00] bg-orange-50/60 dark:bg-orange-950/20 ring-2 ring-[#ff6b00]/30'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#ff6b00]">
                            {tierKey === 'individual' ? 'Tier 1' : tierKey === 'brand' ? 'Tier 2' : 'Tier 3'}
                          </span>
                          {isSelected && <span className="text-[#ff6b00] text-sm font-bold">✓ Selected</span>}
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">{item.title}</h3>
                        <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 mb-2">👥 {item.capacity}</p>
                        <div className="text-xs text-gray-800 dark:text-gray-200 font-semibold mb-3 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                          💳 {item.cost}
                        </div>
                        <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                          {item.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-green-500 mr-1.5 font-bold">✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-gray-700/60 text-[10px] text-slate-700">
                        {item.guarantorsNeeded > 0 && `• Requires ${item.guarantorsNeeded} Guarantor(s)\n`}
                        {item.managersNeeded > 0 && `• Requires ${item.managersNeeded} Manager(s)\n`}
                        {item.moderatorsNeeded > 0 && `• Requires ${item.moderatorsNeeded} Moderator(s)`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Naming & Policy Verification */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-3.5 text-xs text-blue-900 dark:text-blue-300">
                <span className="font-bold">📜 Strict HallMarks Naming Rules:</span>
                <p className="mt-1">
                  Use title case or all lowercase. No ALL-CAPS. No generic terms (e.g. &quot;Fashion&quot; or &quot;New York&quot;). No misleading words (&quot;Official&quot;, &quot;Verified&quot;). No Meta names (&quot;WhatsApp&quot;). Must match legal brand or use &quot;Subbrand by ParentCompany&quot;.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Proposed HallMarks Page Name *
                </label>
                <input
                  type="text"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  placeholder="e.g. Sterling Creative Studio, or Apex Media by GlobalTech"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 text-slate-900 dark:text-white  font-bold border-slate-300 placeholder:text-slate-400${
                    pageName && !nameValidation.isValid
                      ? 'border-red-400 focus:ring-red-400'
                      : pageName && nameValidation.isValid
                      ? 'border-green-400 focus:ring-green-400'
                      : 'border-gray-300 dark:border-gray-700 focus:ring-orange-500'
                  }`}
                />
                
                {/* Validation Feedback */}
                {pageName && (
                  <div className="mt-2 text-xs">
                    {nameValidation.isValid ? (
                      <p className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                        <span>✓</span> Page name strictly satisfies FingerMobile Naming Policies!
                      </p>
                    ) : (
                      <ul className="text-red-600 dark:text-red-400 space-y-0.5 list-disc ml-4">
                        {nameValidation.errors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Industry Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Technology & Innovation">Technology & Innovation</option>
                    <option value="Arts, Culture & Entertainment">Arts, Culture & Entertainment</option>
                    <option value="Business, Finance & Commerce">Business, Finance & Commerce</option>
                    <option value="Media, Publishing & News">Media, Publishing & News</option>
                    <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                    <option value="Public Organization & Non-Profit">Public Organization & Non-Profit</option>
                    <option value="Education & Research">Education & Research</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Official Website / Online Presence
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourbrand.com (Must match branding)"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                  Public Page Description & Mission *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the purpose of this HallMarks page, public mission, and community updates schedule..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Verification & Role Appointments */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl p-3.5 text-xs text-purple-900 dark:text-purple-300">
                <span className="font-bold">🛡️ Regulatory Compliance for {tierConfig.title}:</span>
                <p className="mt-1">{tierConfig.requiredDocs}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    1-Year Valid Means of Identification *
                  </label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="NIN">National Identity Card / Slip (NIN)</option>
                    <option value="PASSPORT">International Passport</option>
                    <option value="DRIVERS_LICENSE">Driver&apos;s License (1-Year+ Validity)</option>
                    <option value="GREEN_CARD">Permanent Residence / Green Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    ID Document / License Number *
                  </label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Enter ID number for verification"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {selectedTier !== 'individual' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Corporate / CAC Registration Number (RC Number) *
                  </label>
                  <input
                    type="text"
                    value={companyRegNumber}
                    onChange={(e) => setCompanyRegNumber(e.target.value)}
                    placeholder="e.g. RC-1849204 or BN-938201"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              )}

              {/* Required Appointments for Brand & Company */}
              {tierConfig.guarantorsNeeded > 0 && (
                <div className="border-t border-slate-200 dark:border-gray-800 pt-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Appointed Platform Roles ({tierConfig.guarantorsNeeded} Guarantor, {tierConfig.managersNeeded} Manager, {tierConfig.moderatorsNeeded} Moderator)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Guarantor FingerMobile ID(s)
                      </label>
                      <input
                        type="text"
                        value={guarantors[0] || ''}
                        onChange={(e) => setGuarantors([e.target.value])}
                        placeholder="@guarantor_handle"
                        className="w-full px-3 py-2 rounded-lg border text-xs bg-white dark:bg-gray-800 text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Page Manager ID(s)
                      </label>
                      <input
                        type="text"
                        value={managers[0] || ''}
                        onChange={(e) => setManagers([e.target.value])}
                        placeholder="@manager_handle"
                        className="w-full px-3 py-2 rounded-lg border text-xs bg-white dark:bg-gray-800 text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Badge Holder / Moderator ID
                      </label>
                      <input
                        type="text"
                        value={moderators[0] || ''}
                        onChange={(e) => setModerators([e.target.value])}
                        placeholder="@badge_moderator"
                        className="w-full px-3 py-2 rounded-lg border text-xs bg-white dark:bg-gray-800 text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Subscription Payment & Submission */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-purple-500/10 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ff6b00]">Order Summary</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    {tierConfig.title}
                  </span>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                  ₦{tierConfig.amountNgn.toLocaleString()}.00k
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {tierConfig.isRefundable
                    ? '3 Months Refundable Identity Deposit (Returned once verified and compliant)'
                    : 'Quarterly Dedicated Entity Subscription Payment'}
                </p>
              </div>

              <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-xs text-gray-700 dark:text-gray-300">
                <p className="font-bold text-gray-900 dark:text-white">Review Before Submitting:</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-slate-700">HallMarks Page:</span> <strong>{pageName}</strong></div>
                  <div><span className="text-slate-700">Category:</span> <strong>{category}</strong></div>
                  <div><span className="text-slate-700">Audience Scale:</span> <strong>{tierConfig.capacity}</strong></div>
                  <div><span className="text-slate-700">Means of ID:</span> <strong>{idType} ({idNumber})</strong></div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-[#ff6b00] focus:ring-[#ff6b00] text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                  />
                  <span>
                    I confirm that I have an active FingerMobile profile with required 20–30 Live UGC, acknowledge that approval takes 3–4 weeks (or review request after 15 days), and agree to the 30-day member closure notice.
                  </span>
                </label>
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300">
                  <div className="font-bold mb-0.5">⚠️ Submission Failed</div>
                  <p>{submitError}</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Success & Confirmation */}
          {step === 5 && (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 text-green-950 dark:text-green-300 flex items-center justify-center text-3xl mx-auto shadow-md border border-green-400 font-black">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                HallMarks™ Application Submitted!
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                Your HallMarks page application for <strong>&quot;{pageName}&quot;</strong> has been logged with the FingerMobile Protocol Community Council.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl max-w-sm mx-auto text-xs space-y-1.5 border border-slate-300 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-slate-700">Reference Token:</span>
                  <span className="font-mono font-bold text-[#ff6b00]">{referenceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Standard Review:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">3–4 Weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Review Request:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Available after 15 days</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold text-xs shadow-md transition"
                >
                  Return to Hallmarks Hub
                </button>
                {activeCount < (maxAllowed || 2) && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs transition"
                  >
                    + Create Another Page ({activeCount + 1}/{maxAllowed || 2})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        {step < 5 && (
          <div className="px-6 py-3.5 border-t border-slate-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/80 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                ← Back
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-gray-700 transition"
              >
                Cancel
              </button>

              {step === 1 && (
                <button
                  type="button"
                  onClick={handleNextFromStep1}
                  className="px-6 py-2.5 rounded-xl bg-[#ff6b00] hover:bg-[#e05e00] text-white text-xs font-bold transition shadow-sm"
                >
                  Next: Naming & Policies →
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={handleNextFromStep2}
                  disabled={!nameValidation.isValid || !description.trim()}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                    nameValidation.isValid && description.trim()
                      ? 'bg-[#ff6b00] hover:bg-[#e05e00] text-white'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next: Verification & Roles →
                </button>
              )}

              {step === 3 && (
                <button
                  type="button"
                  onClick={handleNextFromStep3}
                  disabled={!idNumber.trim() || (selectedTier !== 'individual' && !companyRegNumber.trim())}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                    idNumber.trim() && (selectedTier === 'individual' || companyRegNumber.trim())
                      ? 'bg-[#ff6b00] hover:bg-[#e05e00] text-white'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next: Subscription Payment →
                </button>
              )}

              {step === 4 && (
                <button
                  type="button"
                  onClick={handleSubmitApplication}
                  disabled={!termsAgreed || isSubmitting}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                    termsAgreed && !isSubmitting
                      ? 'bg-[#ff6b00] hover:bg-[#e05e00] text-white'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Processing Payment...' : `Confirm & Pay ₦${tierConfig.amountNgn.toLocaleString()} →`}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CreateHallmarkModal;
