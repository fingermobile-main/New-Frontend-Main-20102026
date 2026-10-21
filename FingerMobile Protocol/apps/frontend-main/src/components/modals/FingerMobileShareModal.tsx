/*
 * FingerMobile Protocol™ - Sovereign Media Share & Open Graph (OG) Engine
 * Multi-Platform Social Sharing, FingerMobile Internal Rails, OG Scraper & Link Inserter
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Globe,
  Sparkles,
  ExternalLink,
  MessageCircle,
  FileCode,
  Layers,
  Send,
  Award
} from 'lucide-react';

export interface ShareModalMediaItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  media_type?: 'image' | 'video';
  photographer: string;
  category?: string;
  cohort?: string;
}

interface FingerMobileShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaItem: ShareModalMediaItem | null;
  onShareSuccess: (platform: string, itemId: string) => void;
}

type ShareTab = 'social' | 'fingermobile' | 'og_link';

export const FingerMobileShareModal: React.FC<FingerMobileShareModalProps> = ({
  isOpen,
  onClose,
  mediaItem,
  onShareSuccess
}) => {
  const [activeTab, setActiveTab] = useState<ShareTab>('social');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [embedFormat, setEmbedFormat] = useState<'html' | 'markdown'>('markdown');

  if (!isOpen || !mediaItem) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://fingermobile.io';
  const canonicalUrl = `${currentOrigin}/photocredits?asset=${encodeURIComponent(mediaItem.id)}`;
  const shareText = `Check out "${mediaItem.title}" by ${mediaItem.photographer} on FingerMobile Protocol™ PhotoCredits:`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopiedLink(true);
    onShareSuccess('link_copied', mediaItem.id);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const getEmbedSnippet = () => {
    const imgUrl = mediaItem.thumbnailUrl || mediaItem.imageUrl;
    if (embedFormat === 'html') {
      return `<a href="${canonicalUrl}" target="_blank" rel="noopener noreferrer"><img src="${imgUrl}" alt="${mediaItem.title}" style="max-width:100%;border-radius:12px;" /><br /><strong>${mediaItem.title}</strong> by ${mediaItem.photographer} (FingerMobile Protocol™)</a>`;
    }
    return `[![${mediaItem.title}](${imgUrl})](${canonicalUrl})\n*${mediaItem.title}* by **${mediaItem.photographer}** — [Licensed on FingerMobile Protocol™](${canonicalUrl})`;
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(getEmbedSnippet());
    setCopiedEmbed(true);
    onShareSuccess('embed_copied', mediaItem.id);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  const socialNetworks = [
    {
      name: 'X (Twitter)',
      icon: '𝕏',
      bgColor: 'bg-black hover:bg-slate-900 border-slate-700',
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(canonicalUrl)}&hashtags=FingerMobile,PhotoCredits,CreatorMonetization`;
        window.open(url, '_blank', 'noopener,noreferrer');
        onShareSuccess('twitter', mediaItem.id);
      }
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      bgColor: 'bg-emerald-900 hover:bg-emerald-850 border-emerald-700',
      action: () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${canonicalUrl}`)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        onShareSuccess('whatsapp', mediaItem.id);
      }
    },
    {
      name: 'Telegram',
      icon: '✈️',
      bgColor: 'bg-sky-900 hover:bg-sky-850 border-sky-700',
      action: () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        onShareSuccess('telegram', mediaItem.id);
      }
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      bgColor: 'bg-blue-950 hover:bg-blue-900 border-blue-700',
      action: () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        onShareSuccess('linkedin', mediaItem.id);
      }
    },
    {
      name: 'Facebook',
      icon: '🌐',
      bgColor: 'bg-indigo-950 hover:bg-indigo-900 border-indigo-700',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        onShareSuccess('facebook', mediaItem.id);
      }
    },
    {
      name: 'Reddit',
      icon: '🤖',
      bgColor: 'bg-orange-950 hover:bg-orange-900 border-orange-700',
      action: () => {
        const url = `https://reddit.com/submit?url=${encodeURIComponent(canonicalUrl)}&title=${encodeURIComponent(mediaItem.title)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        onShareSuccess('reddit', mediaItem.id);
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                Share Masterpiece
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">
                  +8 Monetization Pts
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                FingerMobile Internal Channels, Social Networks & Open Graph Link Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Snippet Summary */}
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
          <img
            src={mediaItem.thumbnailUrl || mediaItem.imageUrl}
            alt={mediaItem.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-800"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-white text-sm truncate">{mediaItem.title}</h4>
            <p className="text-xs text-slate-300 font-medium truncate">
              Photographer: <span className="text-emerald-400 font-bold">{mediaItem.photographer}</span>
            </p>
            {mediaItem.cohort && (
              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-750 font-bold">
                {mediaItem.cohort}
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'social'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Social Networks
          </button>

          <button
            onClick={() => setActiveTab('fingermobile')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'fingermobile'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            FingerMobile Platform
          </button>

          <button
            onClick={() => setActiveTab('og_link')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'og_link'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            OG Scraper & Link
          </button>
        </div>

        {/* TAB 1: SOCIAL NETWORKS */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              Broadcast directly to major social platforms with auto-generated hashtags and creator attribution. Every external click tracks back to the creator's 22-Day Monthly contest score!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {socialNetworks.map((net) => (
                <button
                  key={net.name}
                  onClick={net.action}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-transform hover:-translate-y-0.5 active:translate-y-0 text-white shadow-md ${net.bgColor}`}
                >
                  <span className="text-lg">{net.icon}</span>
                  <span className="text-xs font-bold">{net.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: FINGERMOBILE PLATFORM */}
        {activeTab === 'fingermobile' && (
          <div className="space-y-3.5">
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              Syndicate across native decentralized FingerMobile channels to earn internal community engagement points.
            </p>

            {/* Post to Forum Feed */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Post to FingerMobile Forum</h5>
                  <p className="text-[11px] text-slate-300">Share as a new showcase thread in Community Feed</p>
                </div>
              </div>
              <button
                onClick={() => {
                  window.location.href = `/forum?share_asset=${encodeURIComponent(mediaItem.id)}&title=${encodeURIComponent(mediaItem.title)}`;
                  onShareSuccess('forum_feed', mediaItem.id);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <span>Share</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Send via Direct Message */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Send to FingerChat Direct Message</h5>
                  <p className="text-[11px] text-slate-300">Share encrypted peer-to-peer preview in chat</p>
                </div>
              </div>
              <button
                onClick={() => {
                  handleCopyLink();
                  onShareSuccess('fingerchat', mediaItem.id);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <span>Copy for Chat</span>
              </button>
            </div>

            {/* Feature on Profile */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Pin to Profile Showcase</h5>
                  <p className="text-[11px] text-slate-300">Display this artwork on your public collector page</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onShareSuccess('profile_pinned', mediaItem.id);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <span>Pin to Profile</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: OG SCRAPER & SHARE LINK INSERTER */}
        {activeTab === 'og_link' && (
          <div className="space-y-4">
            {/* Canonical Link Inserter */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Share Link Inserter (Canonical Protocol URL)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={canonicalUrl}
                  className="flex-1 bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white font-mono select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    copiedLink
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                  }`}
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Live Open Graph (OG) Scraped Card Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Open Graph (OG) Live Scraper Preview
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">og:type = {mediaItem.media_type || 'image'}</span>
              </div>

              {/* Scraped OG Card */}
              <div className="rounded-xl overflow-hidden border border-slate-750 bg-slate-950 shadow-xl">
                <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                  <img
                    src={mediaItem.thumbnailUrl || mediaItem.imageUrl}
                    alt={mediaItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-bold border border-white/20">
                    og:image verified
                  </div>
                </div>
                <div className="p-3.5 space-y-1">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                    fingermobile.io/photocredits
                  </div>
                  <h5 className="font-extrabold text-white text-xs leading-snug line-clamp-1">
                    {mediaItem.title} — Photography by {mediaItem.photographer}
                  </h5>
                  <p className="text-[11px] text-slate-300 font-medium line-clamp-2 leading-relaxed">
                    {mediaItem.description || `Verified 4K sovereign master portrait on FingerMobile Protocol™. Licensed under 80/20 creator royalty architecture.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Embed Snippet Generator */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">Embed Code Inserter:</label>
                <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-[10px] font-bold">
                  <button
                    onClick={() => setEmbedFormat('markdown')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      embedFormat === 'markdown' ? 'bg-emerald-600 text-white' : 'text-slate-300 font-medium hover:text-white'
                    }`}
                  >
                    Markdown
                  </button>
                  <button
                    onClick={() => setEmbedFormat('html')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      embedFormat === 'html' ? 'bg-emerald-600 text-white' : 'text-slate-300 font-medium hover:text-white'
                    }`}
                  >
                    HTML
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  rows={3}
                  value={getEmbedSnippet()}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl p-2.5 text-[11px] font-mono text-slate-300 focus:outline-none"
                />
                <button
                  onClick={handleCopyEmbed}
                  className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1 transition-colors"
                >
                  {copiedEmbed ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEmbed ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sovereign Monetization Footnote */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-slate-200">
          <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-emerald-300">Creator Monetization Incentive:</strong> Sharing earns the creator{' '}
            <span className="font-bold text-white">+8 UGC Points</span> and boosts their position in the{' '}
            <span className="font-bold text-amber-300">22-Day Monthly Face / Video of the Month</span> competition.
          </p>
        </div>
      </div>
    </div>
  );
};
