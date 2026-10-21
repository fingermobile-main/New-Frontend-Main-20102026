import React, { useState } from 'react';
import UniversalHeader from '../components/layout/UniversalHeader';
import H2AdBucket from '../components/layout/H2AdBucket';
import { useAppContext } from '../contexts/AppContext';
import { ApiService } from '../services/api';

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
  const [step, setStep] = useState(1);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [digitalSignature, setDigitalSignature] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [campaignType, setCampaignType] = useState('video');
  const [campaignTitle, setCampaignTitle] = useState('');
  const [placement, setPlacement] = useState('feed_video');
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [primaryText, setPrimaryText] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('https://');
  const [callToAction, setCallToAction] = useState('Learn More');
  const [dailyBudget, setDailyBudget] = useState(25);
  const [paymentMethod, setPaymentMethod] = useState<'fic' | 'wallet'>('fic');
  const [hasSafeArea, setHasSafeArea] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCampaignId, setSubmittedCampaignId] = useState<string | null>(null);

  // Character limits
  const headlineMax = 40;
  const descriptionMax = 160;

  const handleNextStep = () => {
    if (step === 1) {
      if (!disclaimerAccepted || !digitalSignature.trim() || !companyName.trim() || !billingEmail.trim()) {
        alert('Please fill out all merchant details and sign the mandatory disclaimer agreement.');
        return;
      }
    }
    if (step === 3) {
      if (!campaignTitle.trim()) {
        alert('Please enter a campaign title.');
        return;
      }
    }
    if (step === 4) {
      if (!mediaUrl.trim() || !headline.trim() || !destinationUrl.trim()) {
        alert('Media URL, Headline, and Destination URL are required.');
        return;
      }
      if (headline.length > headlineMax) {
        alert(`Headline exceeds ${headlineMax} characters.`);
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
        file_size_bytes: 45000000
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
      alert(`Error submitting campaign: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* STATIC H1 HEADER */}
      <UniversalHeader pageTitle="Canary™ Ad Studio" />

      {/* STATIC H2 HIGH-IMPACT AD CONTAINER (3X LARGER THAN H1) */}
      <H2AdBucket />

      {/* MAIN AD STUDIO WORKSPACE */}
      <main className="flex-1 w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 py-8">
        {/* Studio Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
                Canary™ Engine
              </span>
              <span className="text-xs text-slate-300 font-medium">Internal Advertising & Self-Service Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">FingerMobile Ad Creator</h1>
            <p className="text-xs text-slate-300 font-medium mt-1 max-w-2xl">
              Design, test, and adapt ad variations in minutes. All submissions undergo automated AI guidelines review and SuperAdmin scheduling.
            </p>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs font-bold">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  step === s
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg scale-105'
                    : step > s
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                }`}
              >
                {step > s ? '✓' : s}
              </span>
            ))}
          </div>
        </div>

        {/* STEPPER CONTENT & LIVE PREVIEW GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">

          {/* LEFT COLUMN: WIZARD FORM (7 COLS) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">

            {/* STEP 1: DISCLAIMER & PRIVACY AGREEMENT */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-black text-white">Step 1: Merchant Agreement & Non-Refundable Fee Policy</h3>
                  <p className="text-xs text-slate-300 font-medium mt-1">
                    All external merchants and platform members must complete this privacy disclaimer before uploading media or committing ad budgets.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2 leading-relaxed max-h-48 overflow-y-auto">
                  <p className="font-bold text-amber-400">CANARY™ ADVERTISING POLICY DECLARATION:</p>
                  <p>1. Payments committed for Canary advertising campaigns are strictly <strong>NON-REFUNDABLE</strong> upon submission to escrow.</p>
                  <p>2. Media files must strictly adhere to placement specifications (100MB limit, 24-60 fps, MP4/MOV, &lt;=20% text rule).</p>
                  <p>3. Content must pass automated AI community standards review and receive final approval via the SuperAdmin RBC Dashboard.</p>
                  <p>4. Approved ads will be published automatically according to the scheduled day and time.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Company / Brand Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Audio Ltd"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Billing & Notification Email</label>
                    <input
                      type="email"
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      placeholder="merchant@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Digital Signature (Full Legal Name)</label>
                    <input
                      type="text"
                      value={digitalSignature}
                      onChange={(e) => setDigitalSignature(e.target.value)}
                      placeholder="e.g. Jane Doe, CEO"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={disclaimerAccepted}
                      onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-xs text-slate-300">
                      I have read, understood, and irrevocably accept the Canary Privacy Agreement, Community Standards, and Non-Refundable Payment terms.
                    </span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg transition-all"
                >
                  Accept & Choose Campaign Objective →
                </button>
              </div>
            )}

            {/* STEP 2: 10 MARKETING CAMPAIGN TYPES */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-black text-white">Step 2: Choose Marketing Campaign Type</h3>
                  <p className="text-xs text-slate-300 font-medium mt-1">Select 1 of 10 automated marketing campaign structures supported by Canary.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                  {CAMPAIGN_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setCampaignType(type.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all ${
                        campaignType === type.id
                          ? 'bg-amber-500/10 border-amber-500 shadow-md ring-1 ring-amber-500'
                          : 'bg-slate-800/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{type.icon}</span>
                        <h4 className="text-xs font-bold text-white">{type.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium mt-1.5 line-clamp-2">{type.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg"
                  >
                    Configure Placement & Specs →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PLACEMENT & SPECIFICATIONS */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-black text-white">Step 3: Placement & Video Size Specs</h3>
                  <p className="text-xs text-slate-300 font-medium mt-1">Choose where your video ad will appear across the FingerMobile network.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Campaign Title</label>
                  <input
                    type="text"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    placeholder="e.g. Q4 Flagship Product Launch"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                  {PLACEMENTS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlacement(p.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all ${
                        placement === p.id
                          ? 'bg-amber-500/10 border-amber-500 shadow-md ring-1 ring-amber-500'
                          : 'bg-slate-800/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <h4 className="text-xs font-bold text-white">{p.name}</h4>
                      <p className="text-[10px] font-mono text-amber-400 mt-0.5">{p.ratio}</p>
                      <p className="text-[11px] text-slate-300 font-medium mt-1">{p.specs}</p>
                    </button>
                  ))}
                </div>

                {placement === 'stories' && (
                  <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                    <p className="font-bold text-indigo-300">📐 Stories Safe Area Requirement (14% / 250px):</p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      Ensure key visual elements, text, and logos are located inside the 1080x1420 px title-safe area to prevent occlusion by the profile header and CTA bar.
                    </p>
                    <label className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={hasSafeArea}
                        onChange={(e) => setHasSafeArea(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-[11px] font-bold text-white">Creative adheres to 14% safe area padding</span>
                    </label>
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg"
                  >
                    Upload Media & Copywriting →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CREATIVE MEDIA & COPYWRITING */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-white">Step 4: Creative Media & Copywriting</h3>
                  <p className="text-xs text-slate-300 font-medium mt-1">Upload video source (MP4/MOV &lt;=100MB) and define text elements.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Video / Media URL (100MB limit)</label>
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://cdn.fingermobileprotocol.com/ads/my_canary_video.mp4"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Thumbnail URL (&lt;=20% text rule enforced)</label>
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://cdn.fingermobileprotocol.com/ads/thumb1.jpg"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-300">Headline (Mandatory, max 40 chars)</label>
                    <span className={`text-[10px] font-mono ${headline.length > headlineMax ? 'text-rose-400 font-bold' : 'text-slate-300 font-medium'}`}>
                      {headline.length} / {headlineMax}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Stream Beats on BeatwaveNG"
                    maxLength={40}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-300">Description</label>
                    <span className="text-[10px] font-mono text-slate-300 font-medium">
                      {description.length} / {descriptionMax}
                    </span>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. High fidelity listening with exclusive artist drops."
                    maxLength={160}
                    rows={2}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Primary Feed Text (Optional)</label>
                  <input
                    type="text"
                    value={primaryText}
                    onChange={(e) => setPrimaryText(e.target.value)}
                    placeholder="e.g. Elevate your brand across FingerMobile today"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Destination URL (Landing Page)</label>
                  <input
                    type="text"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    placeholder="https://store.fingermobileprotocol.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Call to Action Button</label>
                  <select
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Learn More">Learn More</option>
                    <option value="Shop Now">Shop Now</option>
                    <option value="Listen Now">Listen Now</option>
                    <option value="Sign Up">Sign Up</option>
                    <option value="Download">Download App</option>
                    <option value="Contact Us">Contact Us</option>
                  </select>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg"
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
                  <h3 className="text-lg font-black text-white">Step 5: Budget & Non-Refundable Checkout</h3>
                  <p className="text-xs text-slate-300 font-medium mt-1">Review costs and confirm escrow payment to move ad to SuperAdmin review.</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-300">Select Daily Budget ($USD)</label>
                    <span className="text-xs font-black text-amber-400">${dailyBudget}.00 / day</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-300 font-medium">
                    <span>Min: $5</span>
                    <span>Standard: $25</span>
                    <span>Max: $500</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Campaign Title:</span>
                    <span className="font-bold text-white">{campaignTitle}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Campaign Type:</span>
                    <span className="font-bold uppercase text-amber-400">{campaignType}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Placement:</span>
                    <span className="font-bold text-white">{placement.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Daily Budget:</span>
                    <span className="font-bold text-white">${dailyBudget}.00 / day</span>
                  </div>
                  <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-700">
                    <span>7-Day Escrow Deposit:</span>
                    <span className="font-black text-base text-amber-400">
                      {paymentMethod === 'fic' ? `${dailyBudget * 7 * 10} FIC` : `$${dailyBudget * 7}.00 USD`}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('fic')}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        paymentMethod === 'fic'
                          ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                    >
                      <span className="text-xl">🪙</span>
                      <p className="text-xs font-bold text-white mt-1">FIC Token Balance</p>
                      <p className="text-[10px] text-amber-400">Zero gas fees</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        paymentMethod === 'wallet'
                          ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                    >
                      <span className="text-xl">💳</span>
                      <p className="text-xs font-bold text-white mt-1">Virtual Wallet</p>
                      <p className="text-[10px] text-emerald-400">Instant Escrow Lock</p>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-[11px] text-rose-300">
                  ⚠️ <strong>Notice:</strong> All payments are final and non-refundable. Your ad will enter the SuperAdmin queue and go live at the scheduled day/time upon policy approval.
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCompletePaymentAndQueue}
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'Confirming Non-Refundable Payment...' : 'Confirm Payment & Submit Ad →'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: SUCCESS CONFIRMATION */}
            {step === 6 && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
                  ✓
                </div>
                <h3 className="text-xl font-black text-white">Canary Ad Submitted Successfully!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Your campaign <strong>"{campaignTitle}"</strong> has been queued for SuperAdmin RBC review. Non-refundable payment has been locked in escrow.
                </p>
                <div className="p-3 bg-slate-800/80 rounded-xl text-xs font-mono text-amber-400 inline-block">
                  Campaign ID: {submittedCampaignId}
                </div>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700"
                  >
                    Create Another Ad
                  </button>
                  <a
                    href="/admin/canary"
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black hover:brightness-110"
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
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">Live Ad Preview</h3>
              <span className="text-[10px] text-slate-300 font-medium font-mono">Format: {placement}</span>
            </div>

            {/* Preview Viewport */}
            <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-4 shadow-2xl overflow-hidden">
              {placement === 'stories' ? (
                /* Stories 9:16 Preview with Safe Area Overlay */
                <div className="relative aspect-[9/16] w-full max-w-xs mx-auto rounded-2xl overflow-hidden bg-black border border-slate-700 flex flex-col justify-between p-3">
                  {/* Top Safe Area (14% / 250px) */}
                  <div className="relative z-10 bg-black/40 backdrop-blur-md p-2 rounded-lg flex items-center justify-between border border-white/10">
                    <span className="text-[10px] font-bold text-white truncate">{companyName || 'Your Brand'}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Ad</span>
                  </div>

                  {/* Media */}
                  <div className="absolute inset-0 z-0">
                    {mediaUrl ? (
                      <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-950 p-4 text-center">
                        <span className="text-3xl">📱</span>
                        <span className="text-[10px] mt-2">1080x1920 (9:16) Media Preview</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Safe Area & Action */}
                  <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-left">
                    <h4 className="text-xs font-black text-white">{headline || 'Headline Preview (max 40 chars)'}</h4>
                    {description && <p className="text-[10px] text-slate-300 mt-0.5 line-clamp-1">{description}</p>}
                    <div className="mt-2 py-1.5 px-3 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] text-center">
                      {callToAction}
                    </div>
                  </div>

                  {/* Safe Area Guides Visualizer */}
                  <div className="absolute inset-x-2 top-12 bottom-20 border border-dashed border-emerald-400/40 pointer-events-none rounded flex items-center justify-center">
                    <span className="text-[9px] font-mono text-emerald-400/60 bg-black/50 px-1 rounded">1080x1420 Title-Safe Area</span>
                  </div>
                </div>
              ) : (
                /* Native Feed / In-Stream Ad Preview */
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] font-black text-amber-400">
                      AD
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">{companyName || 'Your Brand Name'}</p>
                      <p className="text-[10px] text-slate-300 font-medium">Sponsored • Canary Network</p>
                    </div>
                  </div>

                  {primaryText && <p className="text-xs text-slate-300">{primaryText}</p>}

                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    {mediaUrl ? (
                      <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                        <span className="text-2xl">📺</span>
                        <span className="text-[10px] mt-1">Video / Image Media</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{headline || 'Enter Ad Headline'}</h4>
                      <p className="text-[11px] text-slate-300 font-medium truncate">{description || 'Ad description will appear here'}</p>
                    </div>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs"
                    >
                      {callToAction}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Spec Validation Checklist */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <span>🛡️</span>
                <span>AI Policy & Specs Auto-Checker</span>
              </h4>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>File Size &lt;= 100MB</span>
                <span className="text-emerald-400 font-bold">✓ Enforced</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Headline &lt;= 40 Chars</span>
                <span className={headline.length <= headlineMax ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {headline.length <= headlineMax ? '✓ Valid' : '✕ Exceeded'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Thumbnail Text &lt;= 20% Rule</span>
                <span className="text-emerald-400 font-bold">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Non-Refundable Escrow Protection</span>
                <span className="text-amber-400 font-bold">✓ Active</span>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default CanaryAdMakerPage;
