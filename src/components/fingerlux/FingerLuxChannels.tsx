import React, { useState } from 'react';
import type { StaffMember, FingerLuxService } from '../../types/fingerLuxScheduling';
import { ShareIcon, CheckIcon } from '../../icons';

interface FingerLuxChannelsProps {
  staff: StaffMember[];
  services: FingerLuxService[];
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const FingerLuxChannels: React.FC<FingerLuxChannelsProps> = ({
  staff,
  services,
  showToast
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const copyToClipboard = (link: string, label: string) => {
    navigator.clipboard?.writeText(link);
    setCopiedLink(link);
    showToast(`Copied ${label} to clipboard!`, 'info');
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const MASTER_BOOKING_LINK = 'https://fingerlux.protocol/book/sovereign-concierge';

  return (
    <div className="space-y-6">
      {/* Channels Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border border-indigo-900 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
            Omnichannel Booking Reach
          </span>
          <h2 className="text-xl font-black text-white mt-1.5">
            Get Booked From Anywhere Instantly
          </h2>
          <p className="text-xs text-indigo-200/80 mt-1 max-w-xl">
            Reflect live availability across social media, Google AI Mode, your website, and direct encrypted chat links so clients can book appointments in seconds without double-booking.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 shrink-0">
          <span className="text-2xl">⚡</span>
          <div>
            <div className="text-xs font-black text-white">Google AI Mode Indexed</div>
            <div className="text-[10px] text-emerald-400 font-semibold">Live Availability Synchronized</div>
          </div>
        </div>
      </div>

      {/* Grid: Shareable Links + Social Embeds + Google AI Mode Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Master Link & Specialist Direct Links */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-black text-slate-900">Shareable Instant Booking Links</h3>
            <p className="text-xs text-slate-700">
              Share directly via WhatsApp, Signal, bio links, or email signatures.
            </p>
          </div>

          {/* Master Company Link */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-950 block">
              Global Master Booking Portal
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={MASTER_BOOKING_LINK}
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 select-all focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(MASTER_BOOKING_LINK, 'Master Booking Link')}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                {copiedLink === MASTER_BOOKING_LINK ? <CheckIcon className="w-4 h-4" /> : <ShareIcon className="w-4 h-4" />}
                <span>{copiedLink === MASTER_BOOKING_LINK ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Specialist Links */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
              Specialist Direct Links:
            </span>

            {staff.slice(0, 3).map((sm) => {
              const specLink = `https://fingerlux.protocol/book/${sm.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
              const isCopied = copiedLink === specLink;

              return (
                <div
                  key={sm.id}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={sm.avatar}
                      alt={sm.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-300"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{sm.name}</div>
                      <div className="text-[10px] font-semibold text-slate-600 truncate">{sm.role}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(specLink, `${sm.name}'s link`)}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 hover:border-indigo-500 rounded-xl text-xs font-bold text-indigo-700 transition cursor-pointer shrink-0"
                  >
                    {isCopied ? '✓ Copied' : 'Copy Link'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Col: Social Media Bio & Web Embed Widget */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-black text-slate-900">Social Bio & Website Embed</h3>
            <p className="text-xs text-slate-700">
              Embed FingerLux into Instagram, TikTok, LinkedIn, or any custom website.
            </p>
          </div>

          {/* Social Bio Snippet */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-900 block">Instagram / TikTok Link-in-Bio</span>
            <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono text-[11px] font-bold text-slate-800">
              💎 Book VIP Luxury Concierge & Suites: fingerlux.protocol/bio/vip
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard('fingerlux.protocol/bio/vip', 'Link-in-Bio text')}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 transition cursor-pointer"
            >
              Copy Social Bio Snippet ↗
            </button>
          </div>

          {/* Website Iframe Code */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-900 block">Responsive Website Embed (HTML)</span>
            <div className="p-2.5 bg-slate-900 text-slate-100 rounded-xl font-mono text-[10px] overflow-x-auto border border-slate-800">
              {`<iframe src="https://fingerlux.protocol/embed" width="100%" height="700" frameborder="0"></iframe>`}
            </div>
            <button
              type="button"
              onClick={() =>
                copyToClipboard(
                  '<iframe src="https://fingerlux.protocol/embed" width="100%" height="700" frameborder="0"></iframe>',
                  'HTML Embed snippet'
                )
              }
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 transition cursor-pointer"
            >
              Copy Embed Code ↗
            </button>
          </div>
        </div>

        {/* Right Col: Google AI Mode & Gemini Search Live Preview */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 border border-indigo-900 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
              Google AI Mode Live
            </span>
            <span className="text-xs font-bold text-slate-200">✨ Gemini 2.0</span>
          </div>

          <div>
            <h3 className="text-base font-black text-white">Google AI Search Availability Card</h3>
            <p className="text-xs text-indigo-200/80 mt-1">
              When clients prompt Google AI Search, your live openings appear directly in the search answer.
            </p>
          </div>

          {/* Mock Google AI Search Result Card */}
          <div className="p-4 rounded-2xl bg-white text-slate-900 space-y-2.5 shadow-lg border border-slate-300">
            <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>google.com/search?q=book+sovereign+spa+dubai</span>
            </div>

            <div className="font-black text-xs text-slate-900">
              AI Overview: Found 1 Prestige Availability
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between items-start">
                <div className="font-bold text-indigo-950">
                  FingerLux Dubai Marina Sovereign Flagship
                </div>
                <span className="text-[10px] font-bold text-amber-700">★ 5.0 (428)</span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium">
                Next Open Slot: Tomorrow at 10:00 AM with Dr. Elena Rostova
              </p>
              <div className="text-[10px] text-emerald-800 font-black">
                ✓ Verified Live Availability • Instant Booking Supported
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast('Simulating direct booking link from Google AI Mode!', 'success')}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Book Instantly on FingerLux ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
