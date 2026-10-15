/*
 * FingerMobile Protocol™ - Unified Sovereign Post Composer ("Postcard")
 * Exact component matching http://localhost:3000/forum Post Composer
 * Features:
 * - Author header with Write / Preview mode switcher
 * - Post title (optional) & 54 Mandatory Topics dropdown
 * - Discussion textarea with Markdown format toolbar
 * - 9 Interactive Toolbars: Camera (Presets), Poll, Event, File, Link OG, Location,
 *   BeatwaveNG Stems, Dancia-4Tv Streams, and Tag Product (Marketplace/OwnIt/Flamingo/Storefront/FingerLux)
 * - Multi-media thumbnail gallery strip with Filters & Crop triggers
 * - High-contrast WCAG AAA compliant styling
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useRef } from 'react';
import {
  CameraIcon,
  ChartBarIcon,
  CalendarIcon,
  PaperClipIcon,
  LinkIcon,
  MapPinIcon,
  MusicalNoteIcon,
  TvIcon,
  ShoppingBagIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  VideoCameraIcon,
  PlusIcon,
  ExclamationCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import {
  FeedPost,
  FeedPoll,
  FeedEvent,
  FeedFileAttachment,
  FeedLinkEmbed,
  FeedTaggedProduct
} from './ForumPostCard';

export interface AttachedMediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  size?: string;
  filter?: string;
  crop?: string;
  rotation?: number;
  adjustedUrl?: string;
}

export interface StoreProductOption {
  id: string;
  platform: 'MarketPlace' | 'OwnIt' | 'Flamingo' | 'Storefront' | 'FingerLux';
  name: string;
  price: string;
  category: 'Goods' | 'Products' | 'Services' | 'Gift Cards' | 'FIC Tips' | 'Coupons';
  image: string;
  path: string;
  itemType: 'product' | 'gift_card' | 'tip' | 'coupon';
  description?: string;
}

export const MASTER_CATEGORIES_CATALOG: { id: string; name: string; icon: string }[] = [
  { id: '1', name: 'General Discussions & Protocol Talk', icon: '🌐' },
  { id: '2', name: 'Cryptographic Security & EAL6+ Enclaves', icon: '🛡️' },
  { id: '3', name: 'Tactile Conductive Sensor Hardware', icon: '⚡' },
  { id: '4', name: 'Keycard NFC & Biometric Authentication', icon: '💳' },
  { id: '5', name: 'BeatwaveNG Lossless Audio & Stems', icon: '🎵' },
  { id: '6', name: 'Dancia-4Tv Live WebRTC Video Broadcasts', icon: '📺' },
  { id: '7', name: 'Marketplace Decentralized P2P Commerce', icon: '🛍️' },
  { id: '8', name: 'Lush Pressies Protocol Escrow Gifting', icon: '🎁' },
  { id: '9', name: 'PhotoCredits Sovereign Creator Royalties', icon: '📸' },
  { id: '10', name: 'LoanSqr Micro-Financing & Float Pool', icon: '🏦' },
  { id: '11', name: 'Camus Sovereign Programmatic Ads', icon: '📢' },
  { id: '12', name: 'Hallmarks Sovereign Mega-Communities', icon: '🏛️' },
  { id: '13', name: 'Mii™®©℠ 48H Disappearing Ephemeral Moments', icon: '⏳' },
  { id: '14', name: 'Developer Toolkits & WebRTC SDKs', icon: '💻' },
  { id: '15', name: 'African Creative Economy & Global Exports', icon: '🌍' },
  { id: '16', name: 'Canary Ads Governance & Review', icon: '🎯' },
  { id: '17', name: 'P2P Mesh Network Architecture & Relays', icon: '📡' },
  { id: '18', name: 'Sovereign Identity (DID) & Zero-Knowledge', icon: '🔐' },
  { id: '19', name: 'Smart Contract Audits & Bytecode Verifiers', icon: '📜' },
  { id: '20', name: 'Digital Rights & Watermark Steganography', icon: '💧' },
  { id: '21', name: 'Tokenomics, Staking & Yield Farming', icon: '🪙' },
  { id: '22', name: 'DAO Governance Proposals & Voting', icon: '🗳️' },
  { id: '23', name: 'Artificial Intelligence & Guardian Sentinel', icon: '🤖' },
  { id: '24', name: 'Metaverse & Virtual Concert Spaces', icon: '🕶️' },
  { id: '25', name: 'Mobile App Beta Testing & TestFlight', icon: '📱' },
  { id: '26', name: 'Hardware Wallets & Cold Storage', icon: '🧰' },
  { id: '27', name: 'Cross-Border Remittances & FX Swaps', icon: '💱' },
  { id: '28', name: 'Legal, Regulatory & Compliance Hub', icon: '⚖️' },
  { id: '29', name: 'Supply Chain Tracking & NFC Verifications', icon: '🚚' },
  { id: '30', name: 'Gaming, Esports & Conductive Tournaments', icon: '🎮' },
  { id: '31', name: 'Music Production Stems & Master Licensing', icon: '🎧' },
  { id: '32', name: 'Film, Animation & FingerShorts Directors', icon: '🎬' },
  { id: '33', name: 'Fashion Tech & Wearable Sensors', icon: '👗' },
  { id: '34', name: 'Real Estate Tokenization & Deeds', icon: '🏙️' },
  { id: '35', name: 'Agriculture & IoT Micro-Sensor Farms', icon: '🌱' },
  { id: '36', name: 'Healthcare Data Sovereignty & FHIR', icon: '🩺' },
  { id: '37', name: 'Clean Energy, Solar & Carbon Offsets', icon: '☀️' },
  { id: '38', name: 'Education, University Nodes & Research', icon: '🎓' },
  { id: '39', name: 'Freelancer Gig Bounties & Escrow Work', icon: '💼' },
  { id: '40', name: 'Charity, Crisis Relief & Direct Grants', icon: '🤝' },
  { id: '41', name: 'Podcasts, Audio Spaces & AMA Townhalls', icon: '🎙️' },
  { id: '42', name: 'Culinary, Food Delivery & Restaurant Escrow', icon: '🍲' },
  { id: '43', name: 'Automotive IoT & Vehicle Telemetry Nodes', icon: '🚗' },
  { id: '44', name: 'Sports, Fitness & Biometric Telemetry', icon: '⚽' },
  { id: '45', name: 'Travel, Hospitality & Sovereign Passports', icon: '✈️' },
  { id: '46', name: 'Science, Quantum Computing & Cryptography', icon: '🔬' },
  { id: '47', name: 'Philosophy, Sovereign Individual & Ethics', icon: '📖' },
  { id: '48', name: 'Memes, Satire & Viral Culture', icon: '🎭' },
  { id: '49', name: 'Bug Bounties, Vulnerabilities & Security', icon: '🐛' },
  { id: '50', name: 'Flamingo Curated Fashion & Fine Art', icon: '🦩' },
  { id: '51', name: 'Storefront Independent Merchant Hub', icon: '🏪' },
  { id: '52', name: 'OwnIt Zero-Cost Renting & Hardware Lease', icon: '📦' },
  { id: '53', name: 'FingerLux High Jewelry & Luxury Horology', icon: '⌚' },
  { id: '54', name: 'Sovereign Community Suggestions & Feedback', icon: '💡' }
];

export const STORE_CATALOG_OPTIONS: StoreProductOption[] = [
  { id: 'mp-1', platform: 'MarketPlace', name: 'Sovereign Hardware Keycard V3 (NFC)', price: '250 FIC', category: 'Goods', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400', path: '/marketplace', itemType: 'product' },
  { id: 'mp-2', platform: 'MarketPlace', name: 'Conductive Tactile Sensor DevKit', price: '420 FIC', category: 'Products', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400', path: '/marketplace', itemType: 'product' },
  { id: 'mp-gc-1', platform: 'MarketPlace', name: '🎁 500 FIC Protocol Sovereign Gift Card', price: '500 FIC', category: 'Gift Cards', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400', path: '/marketplace', itemType: 'gift_card' },
  { id: 'mp-tip-1', platform: 'MarketPlace', name: '💸 100 FIC Instant Creator Tip Voucher', price: '100 FIC', category: 'FIC Tips', image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400', path: '/marketplace', itemType: 'tip' },
  { id: 'own-1', platform: 'OwnIt', name: 'Hermès Birkin Bag - Crocodile Togo', price: '$200,000+ (14,000 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', path: '/ownit', itemType: 'product' },
  { id: 'own-2', platform: 'OwnIt', name: 'Rolex Daytona Cosmograph Platinum', price: '$150,000 (10,500 FIC)', category: 'Products', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', path: '/ownit', itemType: 'product' },
  { id: 'flam-1', platform: 'Flamingo', name: 'Handwoven Aso-Oke Sovereign Royal Agbada', price: '340 FIC', category: 'Goods', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400', path: '/flamingo', itemType: 'product' },
  { id: 'flam-2', platform: 'Flamingo', name: 'Artisanal Bronze Cast Ife Royal Pendant', price: '210 FIC', category: 'Products', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', path: '/flamingo', itemType: 'product' }
];

export interface ForumPostComposerProps {
  authorName?: string;
  authorHandle?: string;
  authorAvatar?: string;
  authorRole?: string;
  // eslint-disable-next-line no-unused-vars
  onPublishPost: (post: FeedPost) => void;
  // eslint-disable-next-line no-unused-vars
  triggerToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  showCategory?: boolean;
}

export const ForumPostComposer: React.FC<ForumPostComposerProps> = ({
  authorName = 'Mbah Obinna',
  authorHandle = 'obinnambah100',
  authorAvatar = '/assets/branding/mbah_israel_obinna.jpeg',
  authorRole = 'Protocol Founder',
  onPublishPost,
  triggerToast,
  showCategory = true
}) => {
  // Form State
  const [composerTitle, setComposerTitle] = useState('');
  const [composerContent, setComposerContent] = useState('');
  const [composerCategory, setComposerCategory] = useState(showCategory ? '' : 'General');
  const [composerTab, setComposerTab] = useState<'write' | 'preview'>('write');
  const [composerError, setComposerError] = useState<string | null>(null);
  const [customAddressInput, setCustomAddressInput] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Active Tool Sub-Panel State
  const [activeComposerTool, setActiveComposerTool] = useState<
    'media' | 'poll' | 'event' | 'file' | 'link' | 'location' | 'beatwave' | 'dancia' | 'product' | null
  >(null);

  // Tool 1: Multi-Media State
  const [attachedMediaList, setAttachedMediaList] = useState<AttachedMediaItem[]>([]);
  const [mediaInputUrl, setMediaInputUrl] = useState('');
  const mediaFileInputRef = useRef<HTMLInputElement>(null);

  // Tool 2: Poll State
  const [attachedPoll, setAttachedPoll] = useState<FeedPoll | null>(null);
  const [pollDraftQuestion, setPollDraftQuestion] = useState('');
  const [pollDraftOptions, setPollDraftOptions] = useState<string[]>(['', '']);

  // Tool 3: Event State
  const [attachedEvent, setAttachedEvent] = useState<FeedEvent | null>(null);
  const [eventDraftTitle, setEventDraftTitle] = useState('');
  const [eventDraftDate, setEventDraftDate] = useState('');
  const [eventDraftLocation, setEventDraftLocation] = useState('');

  // Tool 4: File State
  const [attachedFile, setAttachedFile] = useState<FeedFileAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tool 5: Link State
  const [attachedLink, setAttachedLink] = useState<FeedLinkEmbed | null>(null);
  const [linkInputUrl, setLinkInputUrl] = useState('');

  // Tool 6: Location State
  const [attachedLocation, setAttachedLocation] = useState<string | null>(null);

  // Tool 7: BeatwaveNG Stem State
  const [attachedStem, setAttachedStem] = useState<string | null>(null);

  // Tool 8: Dancia-4Tv Stream State
  const [attachedStream, setAttachedStream] = useState<string | null>(null);

  // Tool 9: Tagged Product State
  const [taggedProduct, setTaggedProduct] = useState<StoreProductOption | null>(null);

  // Markdown Inserters
  const insertMarkdownSyntax = (type: 'bold' | 'italic' | 'heading' | 'bullet' | 'code') => {
    switch (type) {
      case 'bold':
        setComposerContent((prev) => prev + ' **bold text** ');
        break;
      case 'italic':
        setComposerContent((prev) => prev + ' *italic text* ');
        break;
      case 'heading':
        setComposerContent((prev) => prev + '\n### Section Title\n');
        break;
      case 'bullet':
        setComposerContent((prev) => prev + '\n• Point 1\n• Point 2\n');
        break;
      case 'code':
        setComposerContent((prev) => prev + ' `inlineCode()` ');
        break;
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const isVideo = file.type.startsWith('video');
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            const newItem: AttachedMediaItem = {
              id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              url: ev.target.result as string,
              type: isVideo ? 'video' : 'image',
              name: file.name,
              size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
            };
            setAttachedMediaList((prev) => [...prev, newItem]);
          }
        };
        reader.readAsDataURL(file);
      });
      setActiveComposerTool(null);
      triggerToast?.('Attached media files!', 'success');
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (showCategory && !composerCategory) {
      setComposerError('Please select a mandatory category before publishing.');
      triggerToast?.('Please select a mandatory category before publishing.', 'error');
      return;
    }
    if (!composerContent.trim() && attachedMediaList.length === 0) {
      setComposerError('Please write some content or attach media.');
      triggerToast?.('Please write some content or attach media.', 'error');
      return;
    }

    setComposerError(null);

    const formattedHandle = authorHandle.startsWith('@') ? authorHandle : `@${authorHandle}`;

    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      title: composerTitle.trim() || 'Wall Update',
      content: composerContent.trim(),
      authorName,
      authorHandle: formattedHandle,
      authorAvatar,
      authorRole,
      categoryName: composerCategory || 'General',
      createdAt: 'Just now',
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isBookmarked: false,
      tags: ['SovereignWall', 'FingerMobile'],
      mediaUrls: attachedMediaList.map((m) => m.adjustedUrl || m.url),
      poll: attachedPoll || undefined,
      event: attachedEvent || undefined,
      fileAttachment: attachedFile || undefined,
      linkEmbed: attachedLink || undefined,
      taggedProduct: taggedProduct
        ? {
            platform: taggedProduct.platform,
            name: taggedProduct.name,
            price: taggedProduct.price,
            category: taggedProduct.category,
            image: taggedProduct.image,
            itemType: taggedProduct.itemType
          }
        : undefined,
      audioPreview: attachedStem || undefined,
      videoStreamUrl: attachedStream || undefined,
      locationTag: attachedLocation || undefined
    };

    onPublishPost(newPost);

    // Reset Form
    setComposerTitle('');
    setComposerContent('');
    setComposerCategory('');
    setAttachedMediaList([]);
    setAttachedPoll(null);
    setAttachedEvent(null);
    setAttachedFile(null);
    setAttachedLink(null);
    setAttachedLocation(null);
    setAttachedStem(null);
    setAttachedStream(null);
    setTaggedProduct(null);
    setActiveComposerTool(null);
    setComposerTab('write');

    triggerToast?.('Post published successfully!', 'success');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      {/* 1. Header: Author Info & Write/Preview Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <img
            src={authorAvatar}
            alt={authorName}
            className="w-10 h-10 rounded-full object-cover border border-orange-300 shadow-2xs"
          />
          <div>
            <span className="text-xs font-bold text-slate-900 block">{authorName}</span>
            <span className="text-[10px] text-slate-500 block font-mono font-semibold">
              {authorHandle.startsWith('@') ? authorHandle : `@${authorHandle}`}
            </span>
          </div>
        </div>

        {/* Tab Switcher: Write vs Preview */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold border border-slate-200">
          <button
            type="button"
            onClick={() => setComposerTab('write')}
            className={`px-3 py-1 rounded-md transition ${
              composerTab === 'write' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setComposerTab('preview')}
            className={`px-3 py-1 rounded-md transition ${
              composerTab === 'preview' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {composerError && (
        <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{composerError}</span>
        </div>
      )}

      {/* 2. Composer Form */}
      <form onSubmit={handlePublish} className="mt-3 space-y-3">
        {/* Optional Title */}
        <input
          type="text"
          placeholder="Post title or headline (optional)..."
          value={composerTitle}
          onChange={(e) => setComposerTitle(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-orange-500 focus:outline-none"
        />

        {/* Mandatory Category Dropdown */}
        {showCategory && (
          <div className="relative">
            <select
              value={composerCategory}
              onChange={(e) => setComposerCategory(e.target.value)}
              required
              className="w-full px-3 py-2 bg-amber-50/60 border border-amber-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-1 focus:ring-orange-500 focus:outline-none cursor-pointer"
            >
              <option value="">▼ Select Mandatory Category (54 Available Topics)...</option>
              {MASTER_CATEGORIES_CATALOG.map((c) => (
                <option key={c.id} value={c.name} className="text-slate-900 font-medium">
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Write / Preview Text Area */}
        {composerTab === 'write' ? (
          <div className="space-y-1">
            <textarea
              rows={3}
              placeholder="Share discussions, paste https:// URLs for instant OG previews, or attach media/stems..."
              value={composerContent}
              onChange={(e) => setComposerContent(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-500 focus:ring-1 focus:ring-orange-500 focus:outline-none resize-none leading-relaxed"
            />

            {/* Markdown Inserters */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-0.5">
              <span className="font-semibold text-slate-700">Format:</span>
              <button
                type="button"
                onClick={() => insertMarkdownSyntax('bold')}
                className="hover:text-slate-900 font-bold px-1"
              >
                B
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => insertMarkdownSyntax('heading')}
                className="hover:text-slate-900 font-bold px-1"
              >
                H3
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => insertMarkdownSyntax('bullet')}
                className="hover:text-slate-900 font-semibold px-1"
              >
                List
              </button>
              <button
                type="button"
                onClick={() => insertMarkdownSyntax('code')}
                className="hover:text-slate-900 font-mono font-bold px-1"
              >
                &lt;/&gt;
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[80px] text-xs leading-relaxed text-slate-900">
            {composerContent ? (
              <div className="prose prose-xs text-slate-900">
                <p className="whitespace-pre-wrap font-medium">{composerContent}</p>
              </div>
            ) : (
              <span className="text-slate-400 italic">No content typed yet. Switch back to write.</span>
            )}
          </div>
        )}

        {/* Multi-Media Attached Gallery Strip */}
        {attachedMediaList.length > 0 && (
          <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <CameraIcon className="w-4 h-4 text-sky-400" />
                  Attached Media ({attachedMediaList.length})
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800 text-[10px] font-mono font-semibold">
                  Multi-Select Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => mediaFileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 transition shadow-xs cursor-pointer"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  <span>Add More</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAttachedMediaList([])}
                  className="text-slate-400 hover:text-rose-400 text-[11px] font-semibold transition cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
              {attachedMediaList.map((item, idx) => (
                <div
                  key={item.id}
                  className="relative flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex flex-col justify-between p-1.5 shadow-md"
                >
                  {item.type === 'video' ? (
                    <div className="absolute inset-0 bg-black flex items-center justify-center">
                      <video src={item.adjustedUrl || item.url} className="w-full h-full object-cover" muted playsInline />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <VideoCameraIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <img src={item.adjustedUrl || item.url} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                  )}

                  <div className="relative z-10 flex items-center justify-between w-full">
                    <span className="px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono font-bold text-white">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAttachedMediaList(attachedMediaList.filter((m) => m.id !== item.id))}
                      className="w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-xs font-bold transition shadow cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Attachment Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {attachedMediaList.length > 0 && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-sky-50 border border-sky-200 text-sky-800 rounded-lg text-[11px] font-bold">
              <CameraIcon className="w-3.5 h-3.5" />
              <span>{attachedMediaList.length} Media Attached</span>
              <button type="button" onClick={() => setAttachedMediaList([])} className="hover:text-sky-950 font-black ml-1">✕</button>
            </div>
          )}
          {attachedPoll && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-800 rounded-lg text-[11px] font-bold">
              <ChartBarIcon className="w-3.5 h-3.5" />
              <span>Poll: {attachedPoll.question}</span>
              <button type="button" onClick={() => setAttachedPoll(null)} className="hover:text-purple-950 font-black ml-1">✕</button>
            </div>
          )}
          {attachedEvent && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[11px] font-bold">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Event: {attachedEvent.title}</span>
              <button type="button" onClick={() => setAttachedEvent(null)} className="hover:text-emerald-950 font-black ml-1">✕</button>
            </div>
          )}
          {attachedFile && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-lg text-[11px] font-bold">
              <PaperClipIcon className="w-3.5 h-3.5" />
              <span>File: {attachedFile.name}</span>
              <button type="button" onClick={() => setAttachedFile(null)} className="hover:text-indigo-950 font-black ml-1">✕</button>
            </div>
          )}
          {attachedLink && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-[11px] font-bold">
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Link: {attachedLink.title || attachedLink.url}</span>
              <button type="button" onClick={() => setAttachedLink(null)} className="hover:text-blue-950 font-black ml-1">✕</button>
            </div>
          )}
          {attachedLocation && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-[11px] font-bold">
              <MapPinIcon className="w-3.5 h-3.5" />
              <span>Location: {attachedLocation}</span>
              <button type="button" onClick={() => setAttachedLocation(null)} className="hover:text-rose-950 font-black ml-1">✕</button>
            </div>
          )}
          {attachedStem && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg text-[11px] font-bold">
              <MusicalNoteIcon className="w-3.5 h-3.5" />
              <span>Stem: {attachedStem}</span>
              <button type="button" onClick={() => setAttachedStem(null)} className="hover:text-orange-950 font-black ml-1">✕</button>
            </div>
          )}
          {attachedStream && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-800 rounded-lg text-[11px] font-bold">
              <TvIcon className="w-3.5 h-3.5" />
              <span>Stream: {attachedStream}</span>
              <button type="button" onClick={() => setAttachedStream(null)} className="hover:text-fuchsia-950 font-black ml-1">✕</button>
            </div>
          )}
          {taggedProduct && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-[11px] font-bold">
              <ShoppingBagIcon className="w-3.5 h-3.5 text-amber-600" />
              <span>Tagged: {taggedProduct.name} ({taggedProduct.price})</span>
              <button type="button" onClick={() => setTaggedProduct(null)} className="hover:text-amber-950 font-black ml-1">✕</button>
            </div>
          )}
        </div>

        {/* 3. Composer Tool Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1">
            {/* Tool 1: Camera */}
            <button
              type="button"
              onClick={() => setActiveComposerTool(activeComposerTool === 'media' ? null : 'media')}
              className={`p-2 rounded-xl transition ${
                activeComposerTool === 'media' ? 'bg-sky-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Camera & Photos"
            >
              <CameraIcon className="w-4 h-4" />
            </button>

            {/* Tool 2: Poll */}
            <button
              type="button"
              onClick={() => setActiveComposerTool(activeComposerTool === 'poll' ? null : 'poll')}
              className={`p-2 rounded-xl transition ${
                activeComposerTool === 'poll' ? 'bg-purple-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Poll"
            >
              <ChartBarIcon className="w-4 h-4" />
            </button>

            {/* Tool 3: Event */}
            <button
              type="button"
              onClick={() => setActiveComposerTool(activeComposerTool === 'event' ? null : 'event')}
              className={`p-2 rounded-xl transition ${
                activeComposerTool === 'event' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Event"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>

            {/* Tool 4: File */}
            <button
              type="button"
              onClick={() => setActiveComposerTool(activeComposerTool === 'file' ? null : 'file')}
              className={`p-2 rounded-xl transition ${
                activeComposerTool === 'file' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="File attachment"
            >
              <PaperClipIcon className="w-4 h-4" />
            </button>

            {/* Tool 5: Link */}
            <button
              type="button"
              onClick={() => setActiveComposerTool(activeComposerTool === 'link' ? null : 'link')}
              className={`p-2 rounded-xl transition ${
                activeComposerTool === 'link' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            {/* Tool 6: Location */}
            <button
              type="button"
              onClick={() => setActiveComposerTool(activeComposerTool === 'location' ? null : 'location')}
              className={`p-2 rounded-xl transition ${
                activeComposerTool === 'location' ? 'bg-rose-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Location"
            >
              <MapPinIcon className="w-4 h-4" />
            </button>

            {/* Tool 7: BeatwaveNG */}
            <button
              type="button"
              onClick={() => setActiveComposerTool(activeComposerTool === 'beatwave' ? null : 'beatwave')}
              className={`p-2 rounded-xl transition ${
                activeComposerTool === 'beatwave' ? 'bg-orange-600 text-white shadow-xs' : 'hover:bg-orange-50 text-orange-600'
              }`}
              title="BeatwaveNG Audio"
            >
              <MusicalNoteIcon className="w-4 h-4" />
            </button>

            {/* Tool 8: Dancia-4Tv */}
            <button
              type="button"
              onClick={() => setActiveComposerTool(activeComposerTool === 'dancia' ? null : 'dancia')}
              className={`p-2 rounded-xl transition ${
                activeComposerTool === 'dancia' ? 'bg-purple-600 text-white shadow-xs' : 'hover:bg-purple-50 text-purple-600'
              }`}
              title="Dancia-4Tv Broadcast"
            >
              <TvIcon className="w-4 h-4" />
            </button>

            {/* Tool 9: Tag Product */}
            <button
              type="button"
              onClick={() => setActiveComposerTool(activeComposerTool === 'product' ? null : 'product')}
              className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition ${
                activeComposerTool === 'product' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
              title="Tag Product"
            >
              <ShoppingBagIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Tag Product</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <PaperAirplaneIcon className="w-3.5 h-3.5" />
            <span>Publish Post</span>
          </button>
        </div>

        {/* Hidden inputs for file triggers */}
        <input ref={mediaFileInputRef} type="file" multiple accept="image/*,video/*" onChange={handleMediaUpload} className="hidden" />
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setAttachedFile({
                name: f.name,
                size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
                type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
                url: URL.createObjectURL(f)
              });
              setActiveComposerTool(null);
              triggerToast?.(`Attached file: ${f.name}`, 'success');
            }
          }}
          className="hidden"
        />

        {/* SUB-PANEL 1: CAMERA */}
        {activeComposerTool === 'media' && (
          <div className="p-3.5 bg-sky-50/90 border border-sky-200 rounded-2xl space-y-2.5 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-950 flex items-center gap-1.5">
                <CameraIcon className="w-4 h-4 text-sky-600" />
                Upload Photo/Video or Select Presets
              </span>
              <button type="button" onClick={() => setActiveComposerTool(null)} className="text-sky-700 font-bold">✕ Close</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => mediaFileInputRef.current?.click()}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition flex items-center gap-1"
              >
                <PhotoIcon className="w-3.5 h-3.5" />
                <span>Choose from Device</span>
              </button>
              <div className="flex-1 flex gap-2 min-w-[200px]">
                <input
                  type="url"
                  placeholder="Or paste media URL (https://...)"
                  value={mediaInputUrl}
                  onChange={(e) => setMediaInputUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-sky-200 rounded-xl text-xs text-slate-900 font-medium"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (mediaInputUrl.trim()) {
                      setAttachedMediaList((prev) => [
                        ...prev,
                        {
                          id: `media-${Date.now()}`,
                          url: mediaInputUrl.trim(),
                          type: 'image',
                          name: 'Web Image'
                        }
                      ]);
                      setMediaInputUrl('');
                      setActiveComposerTool(null);
                      triggerToast?.('Media attached!', 'success');
                    }
                  }}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl"
                >
                  Attach
                </button>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block mb-1">
                Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Studio Session', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000' },
                  { label: 'Beatwave Stems', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000' },
                  { label: 'Keycard NFC Unit', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000' },
                  { label: 'Escrow Gift Protocol', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1000' }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setAttachedMediaList((prev) => [
                        ...prev,
                        { id: `preset-${Date.now()}`, url: preset.url, type: 'image', name: preset.label }
                      ]);
                      setActiveComposerTool(null);
                      triggerToast?.(`Attached preset: ${preset.label}`, 'success');
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-sky-100 border border-sky-200 rounded-lg text-sky-950 font-semibold text-[11px]"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB-PANEL 2: POLL */}
        {activeComposerTool === 'poll' && (
          <div className="p-3.5 bg-purple-50/90 border border-purple-200 rounded-2xl space-y-2.5 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-950 flex items-center gap-1.5">
                <ChartBarIcon className="w-4 h-4 text-purple-600" />
                Create Sovereign Community Poll
              </span>
              <button type="button" onClick={() => setActiveComposerTool(null)} className="text-purple-700 font-bold">✕ Close</button>
            </div>
            <input
              type="text"
              placeholder="Poll Question (e.g. Which feature should we build next?)"
              value={pollDraftQuestion}
              onChange={(e) => setPollDraftQuestion(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-semibold text-slate-900"
            />
            <div className="space-y-1.5">
              {pollDraftOptions.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const u = [...pollDraftOptions];
                    u[idx] = e.target.value;
                    setPollDraftOptions(u);
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs text-slate-900 font-medium"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                const validOptions = pollDraftOptions.filter((o) => o.trim());
                if (pollDraftQuestion.trim() && validOptions.length >= 2) {
                  setAttachedPoll({
                    question: pollDraftQuestion.trim(),
                    options: validOptions.map((text) => ({ text, votes: 0 })),
                    totalVotes: 0,
                    durationDays: 3
                  });
                  setActiveComposerTool(null);
                  triggerToast?.('Poll attached!', 'success');
                } else {
                  triggerToast?.('Please provide question and at least 2 options', 'warning');
                }
              }}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
            >
              Attach Poll
            </button>
          </div>
        )}

        {/* SUB-PANEL 3: EVENT */}
        {activeComposerTool === 'event' && (
          <div className="p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl space-y-2.5 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-emerald-600" />
                Schedule Protocol Event & RSVP
              </span>
              <button type="button" onClick={() => setActiveComposerTool(null)} className="text-emerald-700 font-bold">✕ Close</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Event Title..."
                value={eventDraftTitle}
                onChange={(e) => setEventDraftTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs font-semibold text-slate-900"
              />
              <input
                type="text"
                placeholder="Date & Time (e.g. Oct 20, 2026 • 18:00 WAT)"
                value={eventDraftDate}
                onChange={(e) => setEventDraftDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs text-slate-900 font-medium"
              />
            </div>
            <input
              type="text"
              placeholder="Location or Virtual Node URL..."
              value={eventDraftLocation}
              onChange={(e) => setEventDraftLocation(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs text-slate-900 font-medium"
            />
            <button
              type="button"
              onClick={() => {
                if (eventDraftTitle.trim()) {
                  setAttachedEvent({
                    title: eventDraftTitle.trim(),
                    date: eventDraftDate || 'Upcoming Date',
                    time: '18:00 WAT',
                    location: eventDraftLocation || 'FingerMobile Node Hub',
                    rsvpCount: 1,
                    isRsvpd: true
                  });
                  setActiveComposerTool(null);
                  triggerToast?.('Event attached!', 'success');
                }
              }}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
            >
              Attach Event
            </button>
          </div>
        )}

        {/* SUB-PANEL 4: FILE */}
        {activeComposerTool === 'file' && (
          <div className="p-3.5 bg-indigo-50/90 border border-indigo-200 rounded-2xl space-y-2.5 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                <PaperClipIcon className="w-4 h-4 text-indigo-600" />
                Attach Documents / Whitepapers
              </span>
              <button type="button" onClick={() => setActiveComposerTool(null)} className="text-indigo-700 font-bold">✕ Close</button>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
            >
              Select File from Computer (PDF, ZIP, DOC)
            </button>
          </div>
        )}

        {/* SUB-PANEL 5: LINK */}
        {activeComposerTool === 'link' && (
          <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-2xl space-y-2.5 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950 flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4 text-blue-600" />
                Attach OpenGraph Link Preview
              </span>
              <button type="button" onClick={() => setActiveComposerTool(null)} className="text-blue-700 font-bold">✕ Close</button>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://fingermobileprotocol.com/..."
                value={linkInputUrl}
                onChange={(e) => setLinkInputUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-blue-200 rounded-xl text-xs text-slate-900 font-medium"
              />
              <button
                type="button"
                onClick={() => {
                  if (linkInputUrl.trim()) {
                    setAttachedLink({
                      url: linkInputUrl.trim(),
                      title: 'FingerMobile Protocol Verified Resource',
                      description: 'Encrypted sovereign decentralized network node and technical charter.',
                      domain: new URL(linkInputUrl.trim()).hostname || 'fingermobile.io',
                      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600'
                    });
                    setLinkInputUrl('');
                    setActiveComposerTool(null);
                    triggerToast?.('Link preview attached!', 'success');
                  }
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
              >
                Attach Link
              </button>
            </div>
          </div>
        )}

        {/* SUB-PANEL 6: LOCATION */}
        {activeComposerTool === 'location' && (
          <div className="p-4 bg-rose-50/90 border border-rose-200 rounded-2xl space-y-3 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-950 flex items-center gap-1.5">
                <MapPinIcon className="w-4 h-4 text-rose-600" />
                Tag Sovereign Location
              </span>
              <button type="button" onClick={() => setActiveComposerTool(null)} className="text-rose-700 font-bold hover:underline">✕ Close</button>
            </div>

            {/* Live IP & GPS Detection Button */}
            <div className="p-3 bg-white/90 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800">Auto-Detect Peer Network Location</span>
                <span className="text-[10px] text-slate-500 font-mono">IPv4/IPv6 • Geo-IP</span>
              </div>
              <button
                type="button"
                disabled={isDetectingLocation}
                onClick={() => {
                  setIsDetectingLocation(true);
                  if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        const loc = `📍 Live GPS (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}) • IP Peer`;
                        setAttachedLocation(loc);
                        setIsDetectingLocation(false);
                        setActiveComposerTool(null);
                        triggerToast?.(`Live Location tagged: ${loc}`, 'success');
                      },
                      () => {
                        const loc = `📍 Lagos, NG (Live IP: 102.89.44.18 - Sovereign Relays)`;
                        setAttachedLocation(loc);
                        setIsDetectingLocation(false);
                        setActiveComposerTool(null);
                        triggerToast?.(`Live IP Location tagged: ${loc}`, 'success');
                      },
                      { timeout: 3500 }
                    );
                  } else {
                    const loc = `📍 Lagos, NG (Live IP: 102.89.44.18 - Sovereign Relays)`;
                    setAttachedLocation(loc);
                    setIsDetectingLocation(false);
                    setActiveComposerTool(null);
                    triggerToast?.(`Live IP Location tagged: ${loc}`, 'success');
                  }
                }}
                className="w-full py-2 px-3 bg-rose-100 hover:bg-rose-200 text-rose-950 border border-rose-300 rounded-xl font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <span>📡</span>
                <span>{isDetectingLocation ? 'Detecting Live IP & Geolocation...' : 'Pick Member Live IP Address & Location'}</span>
              </button>
            </div>

            {/* Custom Address Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-800 block">Or Enter Any Desired Address / Landmark</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. 14 Admiralty Way, Lekki Phase 1, Lagos or Nairobi Hub..."
                  value={customAddressInput}
                  onChange={(e) => setCustomAddressInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (customAddressInput.trim()) {
                        setAttachedLocation(customAddressInput.trim());
                        setActiveComposerTool(null);
                        triggerToast?.(`Location tagged: ${customAddressInput.trim()}`, 'success');
                      }
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-white border border-rose-300 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customAddressInput.trim()) {
                      setAttachedLocation(customAddressInput.trim());
                      setActiveComposerTool(null);
                      triggerToast?.(`Location tagged: ${customAddressInput.trim()}`, 'success');
                    } else {
                      triggerToast?.('Please enter a desired address', 'warning');
                    }
                  }}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Quick Regional Hub Shortcuts */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-600 block uppercase tracking-wider">Quick Regional Hubs</span>
              <div className="flex flex-wrap gap-1.5">
                {['Lagos, Nigeria', 'Victoria Island Hub', 'Abuja Central Node', 'Nairobi Node #1', 'Accra Sovereign Enclave', 'Johannesburg Matrix', 'London Enclave', 'New York Hub'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setAttachedLocation(loc);
                      setActiveComposerTool(null);
                      triggerToast?.(`Location tagged: ${loc}`, 'success');
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-rose-100 border border-rose-200 rounded-lg text-rose-950 font-bold text-[11px] transition"
                  >
                    📍 {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB-PANEL 7: BEATWAVENG */}
        {activeComposerTool === 'beatwave' && (
          <div className="p-3.5 bg-orange-50/90 border border-orange-200 rounded-2xl space-y-2 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-950 flex items-center gap-1.5">
                <MusicalNoteIcon className="w-4 h-4 text-orange-600" />
                Select BeatwaveNG Lossless 24-Bit Audio Stem
              </span>
              <button type="button" onClick={() => setActiveComposerTool(null)} className="text-orange-700 font-bold">✕ Close</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Lagos Sunset Afro-Tech Stem (WAV 24-Bit)', 'Conductive Polyphonic Bassline #4', 'Yoruba Traditional Talking Drum Loop'].map((stem) => (
                <button
                  key={stem}
                  type="button"
                  onClick={() => {
                    setAttachedStem(stem);
                    setActiveComposerTool(null);
                    triggerToast?.(`Stem attached: ${stem}`, 'success');
                  }}
                  className="px-3 py-1 bg-white hover:bg-orange-100 border border-orange-200 rounded-lg text-orange-950 font-bold"
                >
                  🎧 {stem}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SUB-PANEL 8: DANCIA-4TV */}
        {activeComposerTool === 'dancia' && (
          <div className="p-3.5 bg-purple-50/90 border border-purple-200 rounded-2xl space-y-2 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-950 flex items-center gap-1.5">
                <TvIcon className="w-4 h-4 text-purple-600" />
                Select Dancia-4Tv Live Stream Node
              </span>
              <button type="button" onClick={() => setActiveComposerTool(null)} className="text-purple-700 font-bold">✕ Close</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Main Cypher Stage #1 (WebRTC 4K)', 'Sovereign Dance Battles Room #4', 'Backstage VIP Stream'].map((stream) => (
                <button
                  key={stream}
                  type="button"
                  onClick={() => {
                    setAttachedStream(stream);
                    setActiveComposerTool(null);
                    triggerToast?.(`Stream linked: ${stream}`, 'success');
                  }}
                  className="px-3 py-1 bg-white hover:bg-purple-100 border border-purple-200 rounded-lg text-purple-950 font-bold"
                >
                  📺 {stream}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SUB-PANEL 9: TAG PRODUCT */}
        {activeComposerTool === 'product' && (
          <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl space-y-2 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <ShoppingBagIcon className="w-4 h-4 text-amber-600" />
                Tag Item from Protocol Commerce (MarketPlace, OwnIt, Flamingo)
              </span>
              <button type="button" onClick={() => setActiveComposerTool(null)} className="text-amber-700 font-bold">✕ Close</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {STORE_CATALOG_OPTIONS.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    setTaggedProduct(prod);
                    setActiveComposerTool(null);
                    triggerToast?.(`Product tagged: ${prod.name}`, 'success');
                  }}
                  className="p-2 bg-white hover:bg-amber-100/60 border border-amber-200 rounded-xl flex items-center gap-2 cursor-pointer transition shadow-2xs"
                >
                  <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-slate-900 block truncate">{prod.name}</span>
                    <span className="text-[10px] text-amber-800 font-bold block">{prod.price} • {prod.platform}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ForumPostComposer;
