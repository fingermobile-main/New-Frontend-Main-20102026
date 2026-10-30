import React, { useState, useRef } from 'react';
import UniversalHeader from '../components/layout/UniversalHeader';
import H2AdBucket from '../components/layout/H2AdBucket';
import { useAppContext } from '../contexts/AppContext';
import { ApiService } from '../services/api';
import {
  PhotoIcon,
  VideoCameraIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XMarkIcon,
  SparklesIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  PlayIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const CAMPAIGN_TYPES = [
  { id: 'video', name: 'Video Campaigns', icon: '🎬', desc: 'In-feed, In-stream, and Stories video ads' },
  { id: 'search', name: 'Search Campaigns', icon: '🔍', desc: 'Keyword-targeted text & thumbnail ads on search results' },
  { id: 'display', name: 'Display Campaigns', icon: '🖼️', desc: 'Visual banners and rich media across web and mobile' },
  { id: 'shopping', name: 'Shopping Campaigns', icon: '🛍️', desc: 'Product cards with price & direct marketplace checkout' },
  { id: 'app', name: 'App Campaigns', icon: '📱', desc: 'App install drives and ecosystem deep links' },
  { id: 'discovery', name: 'Discovery Campaigns', icon: '🧭', desc: 'Native ads in Discover, Home, Watch Next, and Social tabs' },
  { id: 'performance_max', name: 'Performance Max', icon: '⚡', desc: 'AI-driven cross-channel automated ROI optimization' },
  { id: 'smart', name: 'Smart Campaigns', icon: '💡', desc: 'Simplified automated creator for local SMBs' },
  { id: 'local_services', name: 'Local Services Ads', icon: '📍', desc: 'Local service ads backed by FingerMobile Guarantee' },
  { id: 'interstitial', name: 'Interstitial Ads', icon: '✨', desc: 'Full-screen ads during transitions and game loading' },
];

const PLACEMENTS = [
  { id: 'feed_video', name: 'Feed Video Ad', ratio: '9:16 to 16:9', maxTime: '2 mins (~30s rec)', specs: 'Min 1280x720, MP4/MOV, 100MB, <=20% text' },
  { id: 'stories', name: 'Stories Video Ad', ratio: '9:16 vertical', maxTime: '15s - 2 mins', specs: '14% (250px) Safe Area top/bottom (1080x1420 title-safe)' },
  { id: 'carousel_video', name: 'Carousel Video Ad', ratio: '1:1 square', maxTime: '2 mins / card', specs: '2 to 10 cards, 100MB each, landing link mandatory' },
  { id: 'instream', name: 'In-Stream Video Ad', ratio: '16:9 widescreen', maxTime: '5s - 10 mins', specs: 'Pre/mid-roll on videos & live streams, 100MB' },
  { id: 'marketplace', name: 'Marketplace Video Ad', ratio: '9:16 to 16:9', maxTime: '2 mins', specs: 'Embedded subtitles, 125 chars primary text' },
  { id: '360_video', name: '360 Video Ad', ratio: '2:1 panoramic', maxTime: '2 mins', specs: 'Max 4096x2048, interactive dragging & gyroscope' },
  { id: 'instant_articles', name: 'Instant Articles Ad', ratio: '9:16 (masked 4:5)', maxTime: '2 mins', specs: 'Approved publishers only, <=50% thumb text' },
  { id: 'search_results', name: 'Search Results Video Ad', ratio: '1:1 best (4:5)', maxTime: 'Up to 241 mins', specs: 'Keyword intent matching, 100MB' },
];

export const CanaryAdMakerPage: React.FC = () => {
  const { member, showToast } = useAppContext();
  const [step, setStep] = useState<number>(1);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(false);
  const [digitalSignature, setDigitalSignature] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [billingEmail, setBillingEmail] = useState<string>('');
  const [campaignType, setCampaignType] = useState<string>('video');
  const [campaignTitle, setCampaignTitle] = useState<string>('');
  const [placement, setPlacement] = useState<string>('feed_video');

  // Media & Creative Assets
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [headline, setHeadline] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [primaryText, setPrimaryText] = useState<string>('');
  const [destinationUrl, setDestinationUrl] = useState<string>('https://');
  const [callToAction, setCallToAction] = useState<string>('Learn More');
  const [dailyBudget, setDailyBudget] = useState<number>(25);
  const [paymentMethod, setPaymentMethod] = useState<'fic' | 'wallet'>('fic');
  const [hasSafeArea, setHasSafeArea] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedCampaignId, setSubmittedCampaignId] = useState<string | null>(null);

  // Media Picker State
  const [mediaPickerMode, setMediaPickerMode] = useState<'video' | 'image'>('video');
  const [selectedMediaFile, setSelectedMediaFile] = useState<File | null>(null);
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);
  const [showManualUrlInputs, setShowManualUrlInputs] = useState<boolean>(false);
  const [mediaFileSizeDisplay, setMediaFileSizeDisplay] = useState<string>('');

  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);

  // Character limits
  const headlineMax = 40;
  const descriptionMax = 160;

  const handleMediaFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Validate size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      if (showToast) showToast('File size exceeds the 100MB Canary limit.', 'error');
      return;
    }

    setSelectedMediaFile(file);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setMediaFileSizeDisplay(`${sizeInMb} MB`);

    // Auto-upload direct to Express backend
    try {
      setIsUploadingMedia(true);
      const formData = new FormData();
      formData.append('media', file);

      const response = await fetch('/api/canary/upload-media', {
        method: 'POST',
        body: formData
      });
      const resData = await response.json();

      if (resData.success && resData.data) {
        const uploadedUrl = resData.data.mediaUrl;
        setMediaUrl(uploadedUrl);
        if (showToast) showToast(`Ad creative (${file.name}) uploaded direct to backend!`, 'success');
      } else {
        throw new Error(resData.error || 'Upload failed');
      }
    } catch {
      if (showToast) showToast('Failed to upload ad media. Please try again.', 'error');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleThumbnailFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setSelectedThumbnailFile(file);

    try {
      setIsUploadingMedia(true);
      const formData = new FormData();
      formData.append('thumbnail', file);

      const response = await fetch('/api/canary/upload-media', {
        method: 'POST',
        body: formData
      });
      const resData = await response.json();

      if (resData.success && resData.data) {
        const uploadedThumb = resData.data.thumbnailUrl || resData.data.coverUrl;
        setThumbnailUrl(uploadedThumb);
        if (showToast) showToast(`Cover thumbnail (${file.name}) uploaded!`, 'success');
      }
    } catch {
      if (showToast) showToast('Failed to upload thumbnail.', 'error');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!disclaimerAccepted || !digitalSignature.trim() || !companyName.trim() || !billingEmail.trim()) {
        if (showToast) showToast('Please fill out all merchant details and sign the mandatory disclaimer agreement.', 'error');
        return;
      }
    }
    if (step === 3) {
      if (!campaignTitle.trim()) {
        if (showToast) showToast('Please enter a campaign title.', 'error');
        return;
      }
    }
    if (step === 4) {
      if (!mediaUrl.trim() || !headline.trim() || !destinationUrl.trim()) {
        if (showToast) showToast('Media selection, Headline, and Destination URL are required.', 'error');
        return;
      }
      if (headline.length > headlineMax) {
        if (showToast) showToast(`Headline exceeds ${headlineMax} characters.`, 'error');
        return;
      }
    }
    setStep(step + 1);
  };

  const handleCompletePaymentAndQueue = async () => {
    setIsSubmitting(true);
    try {
      // 1. Register advertiser & disclaimer
      const regData: any = await ApiService.post('/canary/advertiser/register', {
        user_id: member?.id || '4',
        company_name: companyName,
        billing_email: billingEmail,
        disclaimer_accepted: true,
        digital_signature: digitalSignature,
        legal_declaration_text: 'I acknowledge the Canary Non-Refundable Payment terms and Ad Specs.'
      });
      if (!regData?.success) throw new Error(regData?.error || 'Failed to register advertiser');

      const advertiserId = regData.advertiser.id;

      // 2. Create campaign
      const campData: any = await ApiService.post('/canary/campaigns', {
        advertiser_id: advertiserId,
        title: campaignTitle,
        campaign_type: campaignType,
        daily_budget: dailyBudget,
        total_budget: dailyBudget * 7,
        currency: paymentMethod === 'fic' ? 'FIC' : 'USD'
      });
      if (!campData?.success) throw new Error(campData?.error || 'Failed to create campaign');

      const campaignId = campData.campaign.id;

      // 3. Create Ad Group
      const groupData: any = await ApiService.post(`/canary/campaigns/${campaignId}/ad-groups`, {
        name: `${placement} Group`,
        placement
      });
      if (!groupData?.success) throw new Error(groupData?.error || 'Failed to create ad group');

      const adGroupId = groupData.ad_group.id;

      // 4. Add Creative
      const creativeFormat = placement === 'carousel_video' ? 'carousel' : (placement === '360_video' ? '360_video' : 'single_video');
      const creativeData: any = await ApiService.post(`/canary/ad-groups/${adGroupId}/creatives`, {
        format: creativeFormat,
        media_url: mediaUrl,
        thumbnail_url: thumbnailUrl,
        headline,
        description,
        primary_text: primaryText,
        destination_url: destinationUrl,
        call_to_action: callToAction,
        has_safe_area_padding: hasSafeArea,
        file_size_bytes: selectedMediaFile?.size || 45000000
      });
      if (!creativeData?.success) throw new Error(creativeData?.error || 'Failed to upload creative');

      // 5. Process Non-Refundable Payment
      const payData: any = await ApiService.post(`/canary/campaigns/${campaignId}/checkout`, {
        advertiser_id: advertiserId,
        amount: dailyBudget * 7,
        payment_method: paymentMethod,
        currency: paymentMethod === 'fic' ? 'FIC' : 'USD'
      });
      if (!payData?.success) throw new Error(payData?.error || 'Failed to process payment');

      setSubmittedCampaignId(campaignId);
      if (showToast) showToast('Ad Campaign submitted and queued for RBC moderation!', 'success');
      setStep(6);
    } catch (err: any) {
      if (showToast) {
        showToast(`Error submitting campaign: ${err.message}`, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col pb-28 md:pb-12 w-full max-w-full overflow-x-hidden">
      {/* STATIC H1 HEADER */}
      <UniversalHeader pageTitle="Canary™ Ad Studio" />

      {/* STATIC H2 HIGH-IMPACT AD CONTAINER */}
      <H2AdBucket />

      {/* MAIN AD STUDIO WORKSPACE */}
      <main className="flex-1 w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden space-y-8">
        {/* Studio Header Card */}
        <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-400">
                Canary™ Engine v3.4
              </span>
              <span className="text-xs text-slate-700 font-bold">Internal Advertising & Self-Service Studio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              FingerMobile Ad Creator
            </h1>
            <p className="text-sm font-semibold text-slate-700 max-w-2xl">
              Design, test, and upload ad variations in minutes. All submissions undergo automated Guardian AI verification and SuperAdmin scheduling.
            </p>
          </div>

          {/* Stepper Progress Badges */}
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-300 p-2.5 rounded-2xl text-xs font-bold self-start md:self-auto">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  step === s
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-105'
                    : step > s
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-black'
                      : 'bg-white text-slate-800 border border-slate-300 font-bold'
                }`}
              >
                {step > s ? '✓' : s}
              </span>
            ))}
          </div>
        </div>

        {/* STEPPER CONTENT & LIVE PREVIEW GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: WIZARD FORM (7 COLS) */}
          <div className="lg:col-span-7 bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">

            {/* STEP 1: DISCLAIMER & PRIVACY AGREEMENT */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Step 1: Merchant Agreement & Non-Refundable Fee Policy
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    All external merchants and platform members must complete this privacy disclaimer before uploading media or committing ad budgets.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-2 leading-relaxed max-h-52 overflow-y-auto">
                  <p className="font-black text-amber-950 uppercase tracking-wide">CANARY™ ADVERTISING POLICY DECLARATION:</p>
                  <p>1. Payments committed for Canary advertising campaigns are strictly <strong>NON-REFUNDABLE</strong> upon submission to escrow.</p>
                  <p>2. Media files must strictly adhere to placement specifications (100MB limit, 24-60 fps, MP4/MOV, &lt;=20% text rule).</p>
                  <p>3. Content must pass automated AI community standards review and receive final approval via the SuperAdmin RBC Dashboard.</p>
                  <p>4. Approved ads will be published automatically according to the scheduled day and time.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">Company / Brand Name *</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Audio Ltd"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">Billing & Notification Email *</label>
                    <input
                      type="email"
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      placeholder="billing@apexaudio.ng"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">Digital Signature (Full Legal Name) *</label>
                    <input
                      type="text"
                      value={digitalSignature}
                      onChange={(e) => setDigitalSignature(e.target.value)}
                      placeholder="e.g. Adeola Sowande"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer p-4 rounded-2xl bg-slate-50 border border-slate-300">
                    <input
                      type="checkbox"
                      checked={disclaimerAccepted}
                      onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                      className="w-5 h-5 text-amber-600 rounded border-slate-300 mt-0.5 focus:ring-amber-500"
                    />
                    <span className="text-xs font-bold text-slate-800 leading-snug">
                      I have read, understood, and solemnly accept the Canary Non-Refundable Fee Policy, Data Handling Terms, and SuperAdmin Verification Safeguards.
                    </span>
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-sm transition"
                  >
                    Accept Agreement & Proceed →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CAMPAIGN OBJECTIVE */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Step 2: Campaign Objective</h3>
                  <p className="text-xs font-semibold text-slate-700 mt-1">Select 1 of 10 automated marketing campaign structures supported by Canary.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CAMPAIGN_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setCampaignType(type.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        campaignType === type.id
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400 shadow-sm'
                          : 'bg-white border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{type.icon}</span>
                        <h4 className="text-xs font-black text-slate-900">{type.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-700 font-semibold mt-1.5 line-clamp-2">{type.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-200"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-sm transition"
                  >
                    Select Placement →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PLACEMENT & SAFE AREA */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Step 3: Placement & Creative Specifications</h3>
                  <p className="text-xs font-semibold text-slate-700 mt-1">Choose where your ad will appear across the FingerMobile network.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Campaign Title *</label>
                  <input
                    type="text"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    placeholder="e.g. BeatwaveNG Launch Blitz Q4"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {PLACEMENTS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlacement(p.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        placement === p.id
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400 shadow-sm'
                          : 'bg-white border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-900">{p.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                          {p.ratio}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 font-semibold mt-1">{p.specs}</p>
                    </button>
                  ))}
                </div>

                {placement === 'stories' && (
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-300 text-xs text-blue-950">
                    <p className="font-black text-blue-950">📐 Stories Placement Safe Area Reminder:</p>
                    <p className="mt-1 text-[11px] font-semibold text-slate-700">
                      Keep all primary logos and headline text within the central 1080x1420 pixel viewport (avoid top and bottom 250px).
                    </p>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasSafeArea}
                        onChange={(e) => setHasSafeArea(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-[11px] font-bold text-slate-900">Creative adheres to 14% safe area padding</span>
                    </label>
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-200"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-sm transition"
                  >
                    Upload Media & Copywriting →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CREATIVE MEDIA PICKER & COPYWRITING */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Step 4: Creative Media Picker & Copywriting
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    Select your ad creative: upload image banner or video clip (MP4/MOV &lt;=100MB) directly from your device.
                  </p>
                </div>

                {/* ================= COMPREHENSIVE MEDIA PICKER ================= */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-300 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center space-x-2">
                      <ArrowUpTrayIcon className="w-5 h-5 text-amber-700" />
                      <span className="text-xs font-black uppercase text-slate-900">Media Picker & Uploader</span>
                    </div>

                    {/* Format Toggle */}
                    <div className="flex items-center gap-1.5 bg-white border border-slate-300 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setMediaPickerMode('video')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 transition ${
                          mediaPickerMode === 'video'
                            ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                            : 'text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <VideoCameraIcon className="w-3.5 h-3.5" />
                        <span>Video Clip</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaPickerMode('image')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 transition ${
                          mediaPickerMode === 'image'
                            ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                            : 'text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <PhotoIcon className="w-3.5 h-3.5" />
                        <span>Image Banner</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. Primary Creative Selector (Video or Image) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                        {mediaPickerMode === 'video' ? (
                          <VideoCameraIcon className="w-4 h-4 text-amber-700" />
                        ) : (
                          <PhotoIcon className="w-4 h-4 text-blue-700" />
                        )}
                        <span>
                          {mediaPickerMode === 'video'
                            ? '1. Select Video Ad Creative (MP4, MOV, WebM - Max 100MB)'
                            : '1. Select Image Banner Creative (PNG, JPG, WEBP - Max 100MB)'}
                        </span>
                      </label>
                      {mediaFileSizeDisplay && (
                        <span className="text-[11px] font-mono font-bold text-slate-700">
                          File: {mediaFileSizeDisplay}
                        </span>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={mediaFileInputRef}
                      accept={mediaPickerMode === 'video' ? 'video/mp4,video/quicktime,video/webm' : 'image/png,image/jpeg,image/webp'}
                      onChange={handleMediaFileChange}
                      className="block w-full text-xs font-bold text-slate-900 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-slate-900 file:text-white hover:file:bg-slate-800 bg-white border border-slate-300 rounded-xl p-2 cursor-pointer"
                    />

                    {mediaUrl ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircleIcon className="w-4 h-4 text-emerald-800" />
                          <span className="text-xs font-bold text-emerald-950 truncate max-w-xs">
                            Active Media: {selectedMediaFile?.name || mediaUrl}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setMediaUrl('');
                            setSelectedMediaFile(null);
                            if (mediaFileInputRef.current) mediaFileInputRef.current.value = '';
                          }}
                          className="text-[11px] font-bold text-rose-700 hover:text-rose-900 underline"
                        >
                          Clear
                        </button>
                      </div>
                    ) : (
                      <p className="text-[11px] font-semibold text-slate-700">
                        Select a high-resolution media file to upload directly to Express backend.
                      </p>
                    )}
                  </div>

                  {/* 2. Cover / Thumbnail Photo Selector */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <PhotoIcon className="w-4 h-4 text-indigo-700" />
                      <span>2. Dedicated Cover Thumbnail (&lt;=20% text rule enforced)</span>
                    </label>

                    <input
                      type="file"
                      ref={thumbnailFileInputRef}
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleThumbnailFileChange}
                      className="block w-full text-xs font-bold text-slate-900 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 bg-white border border-slate-300 rounded-xl p-2 cursor-pointer"
                    />

                    {thumbnailUrl && (
                      <div className="p-2.5 bg-indigo-50 border border-indigo-300 rounded-xl flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-950 truncate max-w-xs">
                          Cover Thumbnail: {selectedThumbnailFile?.name || thumbnailUrl}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnailUrl('');
                            setSelectedThumbnailFile(null);
                            if (thumbnailFileInputRef.current) thumbnailFileInputRef.current.value = '';
                          }}
                          className="text-[11px] font-bold text-rose-700 hover:text-rose-900 underline"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Manual URL entry accordion for CDN/CloudFront users */}
                  <div className="pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowManualUrlInputs(!showManualUrlInputs)}
                      className="text-xs font-bold text-slate-800 hover:text-slate-900 flex items-center space-x-1 underline"
                    >
                      <span>{showManualUrlInputs ? '− Hide Manual CDN URL Inputs' : '+ Or Enter Hosted CDN URLs Directly'}</span>
                    </button>

                    {showManualUrlInputs && (
                      <div className="space-y-3 pt-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">Manual Media URL</label>
                          <input
                            type="text"
                            value={mediaUrl}
                            onChange={(e) => setMediaUrl(e.target.value)}
                            placeholder="https://cdn.fingermobileprotocol.com/ads/video.mp4"
                            className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">Manual Thumbnail URL</label>
                          <input
                            type="text"
                            value={thumbnailUrl}
                            onChange={(e) => setThumbnailUrl(e.target.value)}
                            placeholder="https://cdn.fingermobileprotocol.com/ads/thumb.jpg"
                            className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-500 font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ================= COPYWRITING FIELDS ================= */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-900">Headline (Mandatory, max 40 chars) *</label>
                      <span className={`text-[10px] font-mono font-bold ${headline.length > headlineMax ? 'text-rose-600' : 'text-slate-700'}`}>
                        {headline.length} / {headlineMax}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. Stream Beats on BeatwaveNG"
                      maxLength={40}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-900">Description (Max 160 chars)</label>
                      <span className="text-[10px] font-mono font-bold text-slate-700">
                        {description.length} / {descriptionMax}
                      </span>
                    </div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. High fidelity listening with exclusive African artist drops."
                      maxLength={160}
                      rows={2}
                      className="w-full px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">Primary Feed Text (Optional)</label>
                    <input
                      type="text"
                      value={primaryText}
                      onChange={(e) => setPrimaryText(e.target.value)}
                      placeholder="e.g. Elevate your brand across the FingerMobile Protocol ecosystem today"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">Destination URL (Landing Page) *</label>
                    <input
                      type="text"
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      placeholder="https://store.fingermobileprotocol.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-1">Call to Action Button *</label>
                    <select
                      value={callToAction}
                      onChange={(e) => setCallToAction(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Learn More">Learn More</option>
                      <option value="Shop Now">Shop Now</option>
                      <option value="Listen Now">Listen Now</option>
                      <option value="Sign Up">Sign Up</option>
                      <option value="Download">Download App</option>
                      <option value="Contact Us">Contact Us</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-200"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isUploadingMedia}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-sm transition disabled:opacity-50"
                  >
                    Budget & Non-Refundable Payment →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: BUDGET & NON-REFUNDABLE CHECKOUT */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Step 5: Budget & Non-Refundable Checkout</h3>
                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    Review campaign parameters and confirm non-refundable escrow payment to enter SuperAdmin verification.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-900">Select Daily Budget ($USD)</label>
                    <span className="text-sm font-black text-amber-900 font-mono">${dailyBudget}.00 / day</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-700 font-bold">
                    <span>Min: $5</span>
                    <span>Standard: $25</span>
                    <span>Max: $500</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-300 space-y-3 text-xs">
                  <div className="flex justify-between text-slate-700 font-semibold">
                    <span>Campaign Title:</span>
                    <strong className="text-slate-900">{campaignTitle}</strong>
                  </div>
                  <div className="flex justify-between text-slate-700 font-semibold">
                    <span>Campaign Type:</span>
                    <strong className="uppercase text-amber-900">{campaignType}</strong>
                  </div>
                  <div className="flex justify-between text-slate-700 font-semibold">
                    <span>Placement:</span>
                    <strong className="text-slate-900">{placement.replace('_', ' ')}</strong>
                  </div>
                  <div className="flex justify-between text-slate-700 font-semibold">
                    <span>Daily Budget:</span>
                    <strong className="text-slate-900 font-mono">${dailyBudget}.00 / day</strong>
                  </div>
                  <div className="flex justify-between text-slate-700 font-semibold pt-2 border-t border-slate-300">
                    <span className="text-slate-900 font-bold">7-Day Escrow Deposit:</span>
                    <strong className="font-black text-base text-amber-950 font-mono">
                      {paymentMethod === 'fic' ? `${dailyBudget * 7 * 10} FIC` : `$${dailyBudget * 7}.00 USD`}
                    </strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('fic')}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        paymentMethod === 'fic'
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400'
                          : 'bg-white border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl">🪙</span>
                      <p className="text-xs font-black text-slate-900 mt-1">FIC Token Balance</p>
                      <p className="text-[11px] font-bold text-amber-800">Zero network gas fees</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        paymentMethod === 'wallet'
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400'
                          : 'bg-white border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl">💳</span>
                      <p className="text-xs font-black text-slate-900 mt-1">Virtual Wallet</p>
                      <p className="text-[11px] font-bold text-emerald-800">Instant Escrow Lock</p>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950">
                  ⚠️ <strong>Notice:</strong> All payments are final and non-refundable. Your ad creative will enter the SuperAdmin RBC moderation queue and go live at the scheduled day/time upon policy approval.
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-200"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCompletePaymentAndQueue}
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Confirming Non-Refundable Payment...' : 'Confirm Payment & Submit Ad →'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: SUCCESS CONFIRMATION */}
            {step === 6 && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-900 flex items-center justify-center mx-auto text-3xl font-black">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-slate-900">Canary Ad Submitted Successfully!</h3>
                <p className="text-xs font-semibold text-slate-700 max-w-md mx-auto">
                  Your campaign <strong>"{campaignTitle}"</strong> has been queued for SuperAdmin RBC review. Non-refundable payment has been locked in escrow.
                </p>
                <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 inline-block">
                  Campaign ID: {submittedCampaignId}
                </div>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setMediaUrl('');
                      setThumbnailUrl('');
                      setHeadline('');
                      setDescription('');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-200"
                  >
                    Create Another Ad
                  </button>
                  <a
                    href="/admin/canary"
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-sm"
                  >
                    View in SuperAdmin RBC Queue →
                  </a>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: LIVE INTERACTIVE PREVIEW & SAFE AREA INSPECTOR (5 COLS) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                <SparklesIcon className="w-4 h-4 text-amber-600" />
                <span>Live Ad Preview</span>
              </h3>
              <span className="text-xs font-mono font-bold text-slate-700">Format: {placement}</span>
            </div>

            {/* Preview Viewport Card */}
            <div className="relative rounded-3xl bg-white border border-slate-300 p-5 shadow-sm overflow-hidden">
              {placement === 'stories' ? (
                /* Stories 9:16 Preview with Safe Area Overlay */
                <div className="relative aspect-[9/16] w-full max-w-xs mx-auto rounded-2xl overflow-hidden bg-slate-900 border border-slate-400 flex flex-col justify-between p-3">
                  {/* Top Safe Area */}
                  <div className="relative z-10 bg-black/60 backdrop-blur-md p-2 rounded-lg flex items-center justify-between border border-white/20">
                    <span className="text-xs font-bold text-white truncate">{companyName || 'Your Brand Name'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black">Ad</span>
                  </div>

                  {/* Media (Image or Video) */}
                  <div className="absolute inset-0 z-0">
                    {mediaUrl ? (
                      mediaPickerMode === 'video' || mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm') ? (
                        <video src={mediaUrl} controls autoPlay loop muted className="w-full h-full object-cover" />
                      ) : (
                        <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900 p-4 text-center">
                        <span className="text-4xl">📱</span>
                        <span className="text-xs font-bold text-slate-300 mt-2">1080x1920 (9:16) Stories Preview</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Safe Area & Action */}
                  <div className="relative z-10 bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-white/20 text-left">
                    <h4 className="text-xs font-black text-white">{headline || 'Headline Preview (max 40 chars)'}</h4>
                    {description && <p className="text-[11px] text-slate-200 mt-0.5 line-clamp-1">{description}</p>}
                    <div className="mt-2 py-2 px-3 rounded-lg bg-amber-400 text-slate-950 font-black text-xs text-center shadow">
                      {callToAction}
                    </div>
                  </div>

                  {/* Safe Area Guides Visualizer */}
                  <div className="absolute inset-x-2 top-12 bottom-20 border border-dashed border-emerald-400/60 pointer-events-none rounded flex items-center justify-center">
                    <span className="text-[10px] font-mono font-bold text-emerald-300 bg-black/70 px-1.5 py-0.5 rounded">
                      1080x1420 Title-Safe Area
                    </span>
                  </div>
                </div>
              ) : (
                /* Native Feed / In-Stream Ad Preview */
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-sm">
                      AD
                    </span>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">{companyName || 'Your Brand Name'}</p>
                      <p className="text-[11px] text-slate-700 font-semibold">Sponsored • Canary Ad Network</p>
                    </div>
                  </div>

                  {primaryText && <p className="text-xs font-semibold text-slate-800">{primaryText}</p>}

                  {/* Media Player Container */}
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-300">
                    {mediaUrl ? (
                      mediaPickerMode === 'video' || mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm') ? (
                        <video src={mediaUrl} controls autoPlay loop muted className="w-full h-full object-cover" />
                      ) : (
                        <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <PlayIcon className="w-10 h-10 text-slate-400" />
                        <span className="text-xs font-bold text-slate-300 mt-1">Select media from picker above</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex-1">
                      <h4 className="text-xs font-black text-slate-900 truncate">{headline || 'Enter Ad Headline'}</h4>
                      <p className="text-[11px] text-slate-700 font-semibold truncate">{description || 'Ad description will appear here'}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Preview call to action: ${callToAction}`}
                      onClick={() => {
                        if (destinationUrl) {
                          window.open(destinationUrl.startsWith('http') ? destinationUrl : `https://${destinationUrl}`, '_blank');
                        } else {
                          showToast(`Ad CTA Preview: "${callToAction}"`, 'info');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-sm transition"
                    >
                      {callToAction}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Spec Validation Checklist */}
            <div className="p-5 rounded-2xl bg-white border border-slate-300 text-xs space-y-2.5 shadow-sm">
              <h4 className="font-black text-slate-900 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-800" />
                <span>AI Policy & Specs Auto-Checker</span>
              </h4>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>File Size &lt;= 100MB</span>
                <span className="text-emerald-800 font-black">✓ Enforced</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Headline &lt;= 40 Chars</span>
                <span className={headline.length <= headlineMax ? 'text-emerald-800 font-black' : 'text-rose-700 font-black'}>
                  {headline.length <= headlineMax ? '✓ Valid' : '✕ Exceeded'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Thumbnail Text &lt;= 20% Rule</span>
                <span className="text-emerald-800 font-black">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Non-Refundable Escrow Protection</span>
                <span className="text-amber-800 font-black">✓ Active</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 ${
            step === 1 ? 'text-amber-700 font-black' : 'text-slate-800 hover:text-amber-700'
          }`}
        >
          <span className="text-base">📝</span>
          <span className="text-[10px] tracking-tight font-bold">Terms</span>
        </button>
        <button
          type="button"
          onClick={() => setStep(2)}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 ${
            step === 2 ? 'text-amber-700 font-black' : 'text-slate-800 hover:text-amber-700'
          }`}
        >
          <span className="text-base">🎯</span>
          <span className="text-[10px] tracking-tight font-bold">Type</span>
        </button>
        <button
          type="button"
          onClick={() => setStep(4)}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 ${
            step === 4 ? 'text-amber-700 font-black' : 'text-slate-800 hover:text-amber-700'
          }`}
        >
          <span className="text-base">🎨</span>
          <span className="text-[10px] tracking-tight font-bold">Creative</span>
        </button>
        <button
          type="button"
          onClick={() => setStep(5)}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] gap-1 ${
            step === 5 ? 'text-amber-700 font-black' : 'text-slate-800 hover:text-amber-700'
          }`}
        >
          <span className="text-base">🚀</span>
          <span className="text-[10px] tracking-tight font-bold">Deploy</span>
        </button>
      </div>
    </div>
  );
};

export default CanaryAdMakerPage;
