import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useAppContext } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';
import {
  CheckCircle2,
  Sparkles,
  Zap,
  CreditCard,
  Crown,
  PlusCircle,
  X,
  Edit3,
  Trash2,
  Search,
  Filter,
  DollarSign,
  Coins,
  Sliders,
  ExternalLink
} from 'lucide-react';

export interface SubscriptionModel {
  id: string;
  name: string;
  category: 'platform' | 'media' | 'luxury' | 'creator' | 'community' | 'fintech';
  monthlyFIC: number;
  monthlyNaira: number;
  badge: string;
  isPopular?: boolean;
  route: string;
  description: string;
  features: string[];
  screenName: string;
}

export interface ScreenSubscriptionAuditItem {
  id: string;
  screenName: string;
  route: string;
  category: string;
  plans: string;
  ficPrice: string;
  fiatPrice: string;
  quotaBenefits: string;
  gatedStatus: 'Gated SVoD/TVoD' | 'Paywalled Channel' | 'VIP Fleet Tier' | 'Escrow & Gifting' | 'Provenance Escrow' | '250k Mega Cap' | 'Commercial Licensing' | 'Enterprise Float' | 'Biometric API Shield' | 'DSP Auction';
}

const INITIAL_ALL_SUBSCRIPTIONS: SubscriptionModel[] = [
  // 1. Platform Core Tiers
  {
    id: 'plan-explorer',
    name: 'Sovereign Explorer',
    category: 'platform',
    monthlyFIC: 0,
    monthlyNaira: 0,
    badge: 'Standard',
    route: '/',
    screenName: 'HomePage & Core Discovery',
    description: 'Basic social discovery and standard P2P encrypted messaging across the network.',
    features: [
      'Basic Social Posting & Feeds',
      'Encrypted P2P Messaging',
      '10 GB Local Media Vault Quota',
      'Standard Video & Music Streaming',
      'Community Directory Access'
    ]
  },
  {
    id: 'plan-rising',
    name: 'Rising Creator',
    category: 'platform',
    monthlyFIC: 1,
    monthlyNaira: 100,
    badge: 'Starter Pack',
    route: '/creatordashboard',
    screenName: 'Creator Studio & Dashboard',
    description: 'Designed for emerging artists, streamers, and photographers entering monetization.',
    features: [
      'Verified Creator Badge',
      'AI Hashtag & Caption Optimizer',
      'Basic Analytics & Follower Graphs',
      'Creator Storefront Setup (5.0% fee)',
      'Audio Stem Downloads (5/mo)'
    ]
  },
  {
    id: 'plan-growth',
    name: 'Growth Creator',
    category: 'platform',
    monthlyFIC: 5,
    monthlyNaira: 500,
    badge: 'Visibility Pack',
    isPopular: true,
    route: '/monetization',
    screenName: 'Monetization Hub',
    description: 'Boost discoverability by 500% across the global feed and unlock 4K streaming.',
    features: [
      '5x Algorithm Recommendation Priority',
      '4K HDR Livestreaming on Dancia-4Tv',
      'Affiliate Storefront & Paylink Tools',
      'Lower Storefront Commission (3.5%)',
      'Unlimited Audio Stem Downloads',
      'Priority Support Queue'
    ]
  },
  {
    id: 'plan-pro',
    name: 'Professional Creator',
    category: 'platform',
    monthlyFIC: 20,
    monthlyNaira: 2000,
    badge: 'Monetization Pro',
    route: '/creatordashboard',
    screenName: 'Creator Influence Suite',
    description: 'For full-time independent creators with active follower communities and product sales.',
    features: [
      'Gold Verified Sovereign Checkmark',
      'Ad Revenue Sharing (70/30 split)',
      'Custom Channel Subscription Creator',
      'Lowest Storefront Commission (2.0%)',
      '7-Day Accelerated Escrow Releases',
      'AI Video Enhancement & Mastering'
    ]
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise / Sovereign',
    category: 'platform',
    monthlyFIC: 100,
    monthlyNaira: 10000,
    badge: 'Media Network',
    route: '/master-dashboard',
    screenName: 'Master Enterprise Console',
    description: 'For media companies, record labels, and sovereign franchise operators.',
    features: [
      'Platinum Sovereign Network Badge',
      'Ultra-Low Storefront Fee (0.75%)',
      'Ultra-Fast 3-Day Escrow Payouts',
      'Dedicated Account Executive',
      'Custom Domain Routing & API Access',
      'White-Label Telemetry Dashboards'
    ]
  },

  // 2. Media & Streaming
  {
    id: 'plan-dancia',
    name: 'Dancia-4Tv Cinema Pass',
    category: 'media',
    monthlyFIC: 10,
    monthlyNaira: 1000,
    badge: '4K Ultra-HD Cinema',
    isPopular: true,
    route: '/dancia4tv',
    screenName: 'Dancia-4Tv Broadcast',
    description: 'Unlimited access to sovereign 4K cinema premieres, sound clash replays, and creator TVoD channels.',
    features: [
      '4K HDR Dolby Atmos Streams',
      'Unlimited Sound Clash Livestreams',
      'Pay-Per-View Cinema Archives',
      'Ad-Free Picture-in-Picture Mode',
      'Offline Download Quota (50 films)'
    ]
  },
  {
    id: 'plan-beatwave',
    name: 'BeatwaveNG Lossless Hi-Fi',
    category: 'media',
    monthlyFIC: 8,
    monthlyNaira: 800,
    badge: 'Master FLAC Audio',
    route: '/beatwaveng',
    screenName: 'BeatwaveNG SoundRiver',
    description: 'Studio master 24-bit lossless audio streaming with uncompressed audio stem download packs.',
    features: [
      'Bit-Perfect 24-bit / 192kHz FLAC',
      'Master Multitrack Stem Downloads',
      'Direct Creator Tipping & Vaults',
      'Personal AI Playlist Generator',
      'Zero-Compression Mobile Streaming'
    ]
  },

  // 3. Luxury & Lifestyle
  {
    id: 'plan-fingerlux',
    name: 'FingerLux Presidential Fleet',
    category: 'luxury',
    monthlyFIC: 50,
    monthlyNaira: 5000,
    badge: 'VIP Presidential',
    route: '/fingerlux',
    screenName: 'FingerLux VIP Escorts',
    description: 'Armored presidential vehicle transfers, chauffeur airport escorts, and private island estate charters.',
    features: [
      'Armed Chauffeur Airport Escorts',
      'Luxury Yacht Charter Bookings',
      'Presidential Oceanfront Villa Access',
      'FIC Instant Escrow Settlement',
      '24/7 Diplomatic Concierge Desk'
    ]
  },
  {
    id: 'plan-lush',
    name: 'Lush-Pressies VIP Matchmaker',
    category: 'luxury',
    monthlyFIC: 12,
    monthlyNaira: 1200,
    badge: 'Romance & Plushies',
    route: '/lushpressies',
    screenName: 'Lush-Pressies Gifting',
    description: 'Digital 3D plushie collectibles, incognito matchmaking, and encrypted romantic escrow gifting.',
    features: [
      '3D Animated Plushie Vault Access',
      'Incognito Ghost Dating Mode',
      'Radiant Emerald Gift Boxes',
      'Priority Matchmaker Algorithm',
      'Creator Escrow Tipping Discounts'
    ]
  },
  {
    id: 'plan-ownit',
    name: 'OwnIt Haute Provenance',
    category: 'luxury',
    monthlyFIC: 25,
    monthlyNaira: 2500,
    badge: 'Haute Horology',
    route: '/ownit',
    screenName: 'OwnIt Luxury Goods',
    description: 'Immutable luxury goods authentication, luxury watch auction pass, and digital provenance passports.',
    features: [
      'Watch & Jewelry Certificate Passports',
      'Private High-Value Auction Bidding',
      'Certified Appraiser Concierge',
      'Physical Custody Escrow Vaults',
      'Counterfeit Fraud Insurance Protection'
    ]
  },
  {
    id: 'plan-flamingo',
    name: 'Flamingo 18+ Private Chamber',
    category: 'luxury',
    monthlyFIC: 15,
    monthlyNaira: 1500,
    badge: '18+ Private Vault',
    route: '/flamingo',
    screenName: 'Flamingo Storefront',
    description: 'Private adult storefront and verified adult creator subscriptions with zero-knowledge encryption.',
    features: [
      'Age-Verified Zero-Knowledge Keycards',
      'Encrypted Private 1-on-1 Chambers',
      'Anonymous FIC Direct Settlements',
      'Zero Statement Bank Tracing',
      'VIP Exclusive Creator Galleries'
    ]
  },

  // 4. Creator & Merchant Studio
  {
    id: 'plan-stercs',
    name: 'Stercs 4K AI Render Cloud',
    category: 'creator',
    monthlyFIC: 18,
    monthlyNaira: 1800,
    badge: 'AI Master Studio',
    route: '/stercs',
    screenName: 'Stercs Creator Studio',
    description: 'Neural video mastering, cloud GPU render quotas, and multi-track sovereign timeline editing.',
    features: [
      'Cloud GPU 4K 60fps Render Farm',
      'Neural Voice Denoise & Mastering',
      'AI Background Scene Replacement',
      'Unlimited Motion Graphics Presets',
      'Cross-Platform Batch Publishing'
    ]
  },
  {
    id: 'plan-storefront',
    name: 'My Storefront Merchant Elite',
    category: 'creator',
    monthlyFIC: 20,
    monthlyNaira: 2000,
    badge: '0% Commission Mall',
    route: '/mystorefront',
    screenName: 'Member Storefront Portal',
    description: 'Enterprise commerce portal with unlimited SKU uploads, customized domains, and automated inventory.',
    features: [
      'Zero (0%) Platform Sales Commission',
      'Unlimited Product Catalog SKUs',
      'Multi-Currency NGN/FIC/USD Checkout',
      'Automated Logistics API Webhooks',
      'Same-Day Merchant Escrow Releases'
    ]
  },
  {
    id: 'plan-photocredits',
    name: 'PhotoCredits Commercial Pro',
    category: 'creator',
    monthlyFIC: 10,
    monthlyNaira: 1000,
    badge: 'Stock & Friday Pool',
    route: '/photocredits',
    screenName: 'PhotoCredits Media Hub',
    description: 'Commercial licensing for global media assets and automatic qualification for Friday Creator Prize Pools.',
    features: [
      'Full Worldwide Commercial Rights',
      'Friday Creator Prize Pool Tickets',
      'Raw UHD 50MP Photo Downloads',
      'Royalty Ledger Smart Contract Split',
      'AI Image Watermark Remover'
    ]
  },

  // 5. Community & Esports Arena
  {
    id: 'plan-hallmarks',
    name: 'HallMarks Sovereign 250k',
    category: 'community',
    monthlyFIC: 30,
    monthlyNaira: 3000,
    badge: '250k Mega-Community',
    route: '/hallmarks',
    screenName: 'HallMarks Verification',
    description: 'Create mega-communities supporting up to 250,000 members with custom prestige badge issuing.',
    features: [
      '250,000 Member Channel Capacity',
      'Official Sovereign Badge Issuer Rights',
      'Automated Moderation Guardrails',
      'Community Vault Multi-Sig Wallets',
      'Custom Vanity URLs & Invitations'
    ]
  },
  {
    id: 'plan-gameon',
    name: 'GameOn Esports Season Pass',
    category: 'community',
    monthlyFIC: 6,
    monthlyNaira: 600,
    badge: 'Pro Battle Pass',
    route: '/gameon',
    screenName: 'GameOn Tournament Arena',
    description: 'Tournament registrations, pro brackets, live spectator lounge, and monthly FIC cash prize pools.',
    features: [
      'VIP Bracket Registration Quota',
      'Spectator High-Bitrate Lounge',
      'Exclusive Player Avatar Skins',
      'Weekly Battle Ladder Tournaments',
      'Cash Prize Auto-Deposit to Vault'
    ]
  },
  {
    id: 'plan-fingerwars',
    name: 'FingerWars Clash Arena Pro',
    category: 'community',
    monthlyFIC: 8,
    monthlyNaira: 800,
    badge: 'Clash Challenger',
    route: '/fingerwars',
    screenName: 'FingerWars Battle League',
    description: 'Sovereign rap, beat, and art clash arenas. Challenge top rankers and bet verified FIC stakes.',
    features: [
      'Ranked Arena Challenge Entries',
      'Crowd Voting Power Multiplier (2x)',
      'Escrow Staked Token Matchmaking',
      'Hall of Fame Trophy Profile Badges',
      'Direct Clash Producer Feedback'
    ]
  },

  // 6. Fintech & Security Infrastructure
  {
    id: 'plan-guardian',
    name: 'Guardian AI Enterprise Shield',
    category: 'fintech',
    monthlyFIC: 35,
    monthlyNaira: 3500,
    badge: 'Biometric Anti-Fraud',
    route: '/guardian-protection',
    screenName: 'Guardian Protection Center',
    description: 'Biometric live-motion face verification, automated deepfake defense, and high-value vault fraud protection.',
    features: [
      'Real-Time Biometric Face Authentication',
      'Deepfake & Synthetic Media Scans',
      'Automated Suspicious Outflow Lock',
      'High-Value Escrow Multi-Sig Gate',
      'Priority Cyber Security Incident Team'
    ]
  },
  {
    id: 'plan-loansqr',
    name: 'LoanSqr SME Commercial Float',
    category: 'fintech',
    monthlyFIC: 40,
    monthlyNaira: 4000,
    badge: 'SME Micro-Finance',
    route: '/loansqr',
    screenName: 'LoanSqr Float Engine',
    description: 'Merchant working capital float engine with instant algorithmic credit lines and 24h disbursement.',
    features: [
      'Instant Credit Line Scoring (Up to ₦5M)',
      '0.8% Subsidized Merchant Float Rate',
      '24-Hour Vault Disbursement',
      'Automated Point-of-Sale Repayment',
      'Financial Statement Auditing Reports'
    ]
  },
  {
    id: 'plan-canary',
    name: 'Canary Ads DSP Campaign Suite',
    category: 'fintech',
    monthlyFIC: 25,
    monthlyNaira: 2500,
    badge: 'DSP Ad Booster',
    route: '/canaryads',
    screenName: 'Canary Ads Management',
    description: 'Programmatic sponsored campaign builder with targeted feed insertions and real-time impression bidding.',
    features: [
      '50,000 Guaranteed Feed Impressions',
      'Granular Demographic & Geo Filters',
      'Real-Time Click & Conversion Telemetry',
      'Native Sponsored Post Embeds',
      'A/B Creative Split Testing Tools'
    ]
  },
  {
    id: 'plan-franchise',
    name: 'Franchise Territorial License',
    category: 'fintech',
    monthlyFIC: 250,
    monthlyNaira: 25000,
    badge: 'Territorial Sovereign',
    route: '/franchise',
    screenName: 'Franchise Management',
    description: 'Full regional node operator license with territorial revenue share and local merchant onboarding rights.',
    features: [
      'Exclusive Regional Territory Rights',
      '30% Platform Net Fee Royalty Share',
      'Sub-Admin Regional Control Panel',
      'Direct Fiat Gateway Settlement Node',
      'Quarterly Board Governance Voting'
    ]
  }
];

const PLATFORM_SCREEN_AUDIT_DATA: ScreenSubscriptionAuditItem[] = [
  { id: '1', screenName: 'Core Platform & Sovereign Network', route: '/', category: 'Core Network', plans: 'Sovereign Explorer / Pro / Enterprise', ficPrice: '0 - 100 FIC', fiatPrice: '₦0 - ₦10,000', quotaBenefits: 'Social feeds, P2P messaging, 10GB-100GB vault, 4K video, 0.75% fees', gatedStatus: 'Paywalled Channel' },
  { id: '2', screenName: 'Dancia-4Tv Broadcast Cinema', route: '/dancia4tv', category: 'Media & Entertainment', plans: 'Cinema Pass & TVoD Clashes', ficPrice: '10 FIC / mo', fiatPrice: '₦1,000 / mo', quotaBenefits: '4K Ultra-HD streams, Dolby Atmos, live sound clashes, PPV archives', gatedStatus: 'Gated SVoD/TVoD' },
  { id: '3', screenName: 'BeatwaveNG Hi-Fi SoundRiver', route: '/beatwaveng', category: 'Media & Audio', plans: 'Master FLAC Hi-Fi Pass', ficPrice: '8 FIC / mo', fiatPrice: '₦800 / mo', quotaBenefits: '24-bit 192kHz lossless audio, master multitrack stem downloads, AI playlists', gatedStatus: 'Paywalled Channel' },
  { id: '4', screenName: 'FingerLux VIP Hospitality & Fleet', route: '/fingerlux', category: 'Luxury & Lifestyle', plans: 'Presidential Fleet Concierge', ficPrice: '50 FIC / mo', fiatPrice: '₦5,000 / mo', quotaBenefits: 'Armored chauffeur airport escorts, private villa & superyacht bookings', gatedStatus: 'VIP Fleet Tier' },
  { id: '5', screenName: 'Lush-Pressies Gifting & Romance', route: '/lushpressies', category: 'Luxury & Romance', plans: 'VIP Matchmaker & Gifting', ficPrice: '12 FIC / mo', fiatPrice: '₦1,200 / mo', quotaBenefits: '3D plushie vault, ghost dating mode, radiant emerald boxes, creator tips', gatedStatus: 'Escrow & Gifting' },
  { id: '6', screenName: 'OwnIt Haute Horology & Escrow', route: '/ownit', category: 'Luxury & Commerce', plans: 'Haute Provenance Pass', ficPrice: '25 FIC / mo', fiatPrice: '₦2,500 / mo', quotaBenefits: 'Horology passports, VIP auctions, appraiser concierge, vault custody', gatedStatus: 'Provenance Escrow' },
  { id: '7', screenName: 'Flamingo 18+ Private Vault', route: '/flamingo', category: 'Privileged Adult', plans: 'Private Chamber Access', ficPrice: '15 FIC / mo', fiatPrice: '₦1,500 / mo', quotaBenefits: 'Zero-knowledge keycards, 1-on-1 chambers, zero-statement bank tracing', gatedStatus: 'Paywalled Channel' },
  { id: '8', screenName: 'HallMarks Verification Studio', route: '/hallmarks', category: 'Community & Merit', plans: 'Sovereign 250k Mega Cap', ficPrice: '30 FIC / mo', fiatPrice: '₦3,000 / mo', quotaBenefits: '250,000 members per community, badge issuing rights, multi-sig vaults', gatedStatus: '250k Mega Cap' },
  { id: '9', screenName: 'Gems Curated Highlights', route: '/gems', category: 'Discovery & Feeds', plans: 'Spotlight Boost Pass', ficPrice: '5 FIC / mo', fiatPrice: '₦500 / mo', quotaBenefits: 'Algorithmic boost 5x, top post pin, trending hashtag placement', gatedStatus: 'Paywalled Channel' },
  { id: '10', screenName: 'Groups & Circles Hub', route: '/groups', category: 'Community & Social', plans: 'Private VIP Group Circles', ficPrice: '4 FIC / mo', fiatPrice: '₦400 / mo', quotaBenefits: 'Secret subscriber-only groups, encrypted group calls, custom roles', gatedStatus: 'Paywalled Channel' },
  { id: '11', screenName: 'Blogs Sovereign Publishing', route: '/blogs', category: 'Publishing & Articles', plans: 'Paid Publication Newsletter', ficPrice: '7 FIC / mo', fiatPrice: '₦700 / mo', quotaBenefits: 'Monetized long-form articles, subscriber email blasts, paid paywalls', gatedStatus: 'Paywalled Channel' },
  { id: '12', screenName: 'GameOn Tournament Arena', route: '/gameon', category: 'Esports & Gaming', plans: 'Pro Esports Battle Pass', ficPrice: '6 FIC / mo', fiatPrice: '₦600 / mo', quotaBenefits: 'VIP bracket registration, spectator lounge, avatar skins, cash pool', gatedStatus: 'Paywalled Channel' },
  { id: '13', screenName: 'FingerWars Clash Arenas', route: '/fingerwars', category: 'Gaming & Clashes', plans: 'Clash Challenger Arena', ficPrice: '8 FIC / mo', fiatPrice: '₦800 / mo', quotaBenefits: 'High-stakes battle league, 2x voting power, token staked matchmaking', gatedStatus: 'Paywalled Channel' },
  { id: '14', screenName: 'Stercs Studio & Media Editor', route: '/stercs', category: 'Creative Tools', plans: '4K AI Render Farm Suite', ficPrice: '18 FIC / mo', fiatPrice: '₦1,800 / mo', quotaBenefits: 'Cloud GPU 4K render farm, AI voice denoiser, scene replacer, presets', gatedStatus: 'Paywalled Channel' },
  { id: '15', screenName: 'Member Storefronts & Mall', route: '/mystorefront', category: 'E-Commerce', plans: 'Merchant Elite 0% Fee', ficPrice: '20 FIC / mo', fiatPrice: '₦2,000 / mo', quotaBenefits: '0% platform sales fee, unlimited SKUs, multi-currency cart, API webhooks', gatedStatus: 'Paywalled Channel' },
  { id: '16', screenName: 'PhotoCredits Media Exchange', route: '/photocredits', category: 'Stock & Media', plans: 'Commercial License Pro', ficPrice: '10 FIC / mo', fiatPrice: '₦1,000 / mo', quotaBenefits: 'Global commercial license, Friday prize pool entry, 50MP RAW photos', gatedStatus: 'Commercial Licensing' },
  { id: '17', screenName: 'Guardian AI Cyber Protection', route: '/guardian-protection', category: 'Security & Identity', plans: 'Enterprise Biometric Shield', ficPrice: '35 FIC / mo', fiatPrice: '₦3,500 / mo', quotaBenefits: 'Live-motion face recognition, anti-deepfake scan, high-value vault lock', gatedStatus: 'Biometric API Shield' },
  { id: '18', screenName: 'LoanSqr SME Micro-Finance', route: '/loansqr', category: 'Fintech & Lending', plans: 'SME Commercial Float', ficPrice: '40 FIC / mo', fiatPrice: '₦4,000 / mo', quotaBenefits: 'Credit scoring up to ₦5M, 0.8% float rate, 24h disbursement to vault', gatedStatus: 'Enterprise Float' },
  { id: '19', screenName: 'Canary Ads Programmatic DSP', route: '/canaryads', category: 'Advertising & Marketing', plans: 'DSP Campaign Booster', ficPrice: '25 FIC / mo', fiatPrice: '₦2,500 / mo', quotaBenefits: '50,000 impressions, demographic geo filters, real-time conversion stats', gatedStatus: 'DSP Auction' },
  { id: '20', screenName: 'Franchise Sovereign Operator', route: '/franchise', category: 'Franchise & Nodes', plans: 'Territorial License Node', ficPrice: '250 FIC / mo', fiatPrice: '₦25,000 / mo', quotaBenefits: 'Regional territory exclusivity, 30% net platform royalty share, sub-admin', gatedStatus: 'Paywalled Channel' }
];

export const SubscriptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { ficBalance, showToast } = useAppContext();

  const [activeTab, setActiveTab] = useState<'cards' | 'matrix' | 'fic_management' | 'active'>('cards');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [matrixSearchQuery, setMatrixSearchQuery] = useState('');

  // Local state for all editable subscription models
  const [subscriptionCards, setSubscriptionCards] = useState<SubscriptionModel[]>(() => {
    try {
      const saved = localStorage.getItem('fingermobile_curated_subscription_models');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_err) {
      /* eslint-disable-next-line no-empty */
    }
    return INITIAL_ALL_SUBSCRIPTIONS;
  });

  const saveSubscriptionCards = (updated: SubscriptionModel[]) => {
    setSubscriptionCards(updated);
    try {
      localStorage.setItem('fingermobile_curated_subscription_models', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('fingermobile_subscriptions_changed'));
    } catch (_err) {
      /* eslint-disable-next-line no-empty */
    }
  };

  // Card Editor Modal State
  const [editingCard, setEditingCard] = useState<SubscriptionModel | null>(null);
  const [editForm, setEditForm] = useState<SubscriptionModel>({ ...INITIAL_ALL_SUBSCRIPTIONS[0] });
  const [newFeatureText, setNewFeatureText] = useState('');

  const openEditorModal = (card: SubscriptionModel) => {
    setEditingCard(card);
    setEditForm({ ...card, features: [...card.features] });
    setNewFeatureText('');
  };

  const closeEditorModal = () => {
    setEditingCard(null);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;

    const updated = subscriptionCards.map((c) => (c.id === editingCard.id ? editForm : c));
    saveSubscriptionCards(updated);
    showToast?.(`Subscription model "${editForm.name}" updated successfully!`, 'success');
    closeEditorModal();
  };

  const handleAddNewCard = () => {
    const newCard: SubscriptionModel = {
      id: `plan-custom-${Date.now()}`,
      name: 'New Custom VIP Pass',
      category: 'creator',
      monthlyFIC: 15,
      monthlyNaira: 1500,
      badge: 'Custom Pass',
      isPopular: false,
      route: '/storefronts',
      screenName: 'Custom Channel Pass',
      description: 'Exclusive tier created for specialized community benefits and token perks.',
      features: ['Full Channel Content Access', 'Direct VIP Creator Messaging', 'Custom Member Badge']
    };
    saveSubscriptionCards([newCard, ...subscriptionCards]);
    openEditorModal(newCard);
    showToast?.('New subscription tier created. Configure details below.', 'info');
  };

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this subscription model?')) {
      const updated = subscriptionCards.filter((c) => c.id !== cardId);
      saveSubscriptionCards(updated);
      showToast?.('Subscription model deleted.', 'info');
      closeEditorModal();
    }
  };

  // FIC Management State
  const [ficTargetUser, setFicTargetUser] = useState('@creator_alex');
  const [ficAllocationAmount, setFicAllocationAmount] = useState('250');
  const [ficAllocationReason, setFicAllocationReason] = useState('Milestone creator prize allocation');
  const [walletStatusState, setWalletStatusState] = useState<'active' | 'suspended' | 'frozen'>('active');
  const [earningSuspended, setEarningSuspended] = useState(false);

  // Active Subscriptions
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<SubscriptionModel | null>(null);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);

  const loadSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiService.get<any>('/api/subscriptions');
      if (res?.data && Array.isArray(res.data)) {
        setSubscriptions(
          res.data.map((s: any) => ({
            id: s.id,
            creatorName: s.name || s.creator_name || 'Creator',
            creatorAvatar: s.avatar || s.image || '',
            planName: s.tier || s.plan_name || 'VIP Pass',
            price: Number(s.price || 15),
            status: (s.status || 'active').toLowerCase(),
            renewalDate:
              s.renewal_date ||
              s.renewalDate ||
              new Date(Date.now() + 30 * 86400000).toLocaleDateString(),
            benefits: s.features || s.benefits || ['Full Audio Library Stems', 'Exclusive Discord Community']
          }))
        );
      } else {
        setSubscriptions([
          {
            id: 'sub-1',
            creatorName: 'Alex Johnson Music & Audio',
            creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
            planName: 'PRO Audio Stems Pass',
            price: 15,
            status: 'active',
            renewalDate: new Date(Date.now() + 18 * 86400000).toLocaleDateString(),
            benefits: ['Full Audio Library Stems', 'Exclusive Discord Community', 'Early Access Releases']
          }
        ]);
      }
    } catch {
      setSubscriptions([
        {
          id: 'sub-1',
          creatorName: 'Alex Johnson Music & Audio',
          creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
          planName: 'PRO Audio Stems Pass',
          price: 15,
          status: 'active',
          renewalDate: new Date(Date.now() + 18 * 86400000).toLocaleDateString(),
          benefits: ['Full Audio Library Stems', 'Exclusive Discord Community', 'Early Access Releases']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const handleUpgradePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForUpgrade) return;

    const cost = billingCycle === 'annual'
      ? Math.round(selectedPlanForUpgrade.monthlyFIC * 12 * 0.8)
      : selectedPlanForUpgrade.monthlyFIC;

    if (ficBalance < cost && cost > 0) {
      showToast?.('Insufficient FIC balance for plan upgrade', 'error');
      return;
    }

    setIsProcessingUpgrade(true);
    setTimeout(() => {
      setIsProcessingUpgrade(false);
      showToast?.(`Account successfully subscribed to ${selectedPlanForUpgrade.name}!`, 'success');
      setSelectedPlanForUpgrade(null);
    }, 700);
  };

  const filteredCards = useMemo(() => {
    if (selectedCategory === 'all') return subscriptionCards;
    return subscriptionCards.filter((c) => c.category === selectedCategory);
  }, [subscriptionCards, selectedCategory]);

  const filteredAuditData = useMemo(() => {
    if (!matrixSearchQuery.trim()) return PLATFORM_SCREEN_AUDIT_DATA;
    const q = matrixSearchQuery.toLowerCase();
    return PLATFORM_SCREEN_AUDIT_DATA.filter(
      (item) =>
        item.screenName.toLowerCase().includes(q) ||
        item.route.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.plans.toLowerCase().includes(q) ||
        item.quotaBenefits.toLowerCase().includes(q)
    );
  }, [matrixSearchQuery]);

  return (
    <MainLayout pageTitle="Platform Subscriptions & Sovereign Passes">
      <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-700 shadow-sm">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                    Subscriptions, Passes & FIC Management
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-slate-700 mt-1 max-w-2xl leading-relaxed">
                    Centralized subscription studio for all 385 pages across 20 core platform modules. Manage graphical cards, audit gated screen matrices, configure FIC token allocation rules, and enforce FIAT settlement terms.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddNewCard}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Card</span>
              </button>

              <div className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs shadow-xs">
                <span className="text-slate-800 font-bold">Vault Balance: </span>
                <span className="font-mono font-black text-amber-800">{ficBalance.toLocaleString()} FIC</span>
              </div>
            </div>
          </div>

          {/* Navigation Mode Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-300 pb-4 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('cards')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'cards'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Graphical Subscription Cards ({subscriptionCards.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('matrix')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Platform Screen Audit Matrix (20 Modules)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('fic_management')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'fic_management'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>FIC Management & FIAT Rules Console</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-300'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>My Subscribed Passes ({subscriptions.length})</span>
            </button>
          </div>

          {/* TAB 1: GRAPHICAL EDITABLE SUBSCRIPTION CARDS */}
          {activeTab === 'cards' && (
            <div className="space-y-8">
              {/* Controls Bar: Category Filter & Billing Toggle */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-300 shadow-sm">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                  <span className="text-xs text-slate-900 font-bold mr-2 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-slate-700" /> Domain:
                  </span>
                  {[
                    { id: 'all', label: 'All Cards' },
                    { id: 'platform', label: 'Platform Core' },
                    { id: 'media', label: 'Media & Streaming' },
                    { id: 'luxury', label: 'Luxury & VIP' },
                    { id: 'creator', label: 'Creator & Store' },
                    { id: 'community', label: 'Community & Arena' },
                    { id: 'fintech', label: 'Fintech & Security' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Monthly / Annual Toggle */}
                <div className="p-1 rounded-xl bg-slate-100 border border-slate-300 flex items-center gap-1 self-start md:self-auto shrink-0 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      billingCycle === 'annual'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Annual
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-extrabold bg-emerald-100 text-emerald-950 border border-emerald-400 border-emerald-400 font-black">
                      -20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCards.map((card) => {
                  const isFree = card.monthlyFIC === 0;
                  const displayCost = billingCycle === 'annual' && !isFree
                    ? Math.round(card.monthlyFIC * 12 * 0.8)
                    : card.monthlyFIC;
                  const displayNaira = billingCycle === 'annual' && !isFree
                    ? Math.round(card.monthlyNaira * 12 * 0.8)
                    : card.monthlyNaira;

                  return (
                    <div
                      key={card.id}
                      className={`relative rounded-3xl p-6 border flex flex-col justify-between transition-all group shadow-sm bg-white ${
                        card.isPopular
                          ? 'border-2 border-orange-500 shadow-orange-500/10'
                          : 'border-slate-300 hover:border-orange-500 hover:shadow-md'
                      }`}
                    >
                      {/* Top Badges & Edit Button */}
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-950 border border-amber-400 shadow-xs border-amber-400 font-black">
                            {card.badge}
                          </span>

                          <button
                            type="button"
                            onClick={() => openEditorModal(card)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-orange-600 hover:text-slate-700 text-slate-700 transition-all cursor-pointer shadow-xs border border-slate-300"
                            title="Edit Subscription Card Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {card.isPopular && (
                          <div className="mb-2">
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-orange-700 uppercase tracking-widest">
                              <Sparkles className="w-3 h-3 text-orange-600" /> Highly Recommended Tier
                            </span>
                          </div>
                        )}

                        <h3 className="font-extrabold text-slate-900 text-lg tracking-tight group-hover:text-orange-600 transition-colors">
                          {card.name}
                        </h3>
                        <p className="text-[11px] text-slate-700 font-mono mt-0.5 flex items-center gap-1">
                          <span>Screen:</span>
                          <span className="text-slate-900 font-bold">{card.screenName}</span>
                        </p>
                        <p className="text-xs font-medium text-slate-700 mt-2 min-h-[48px] leading-relaxed">
                          {card.description}
                        </p>

                        {/* Dual Currency Pricing Pill */}
                        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-300 mb-5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-mono font-black text-amber-800">
                              {isFree ? 'FREE' : `${displayCost} FIC`}
                            </span>
                            {!isFree && (
                              <span className="text-xs font-bold text-slate-700">
                                /{billingCycle === 'annual' ? 'yr' : 'mo'}
                              </span>
                            )}
                          </div>
                          {!isFree && (
                            <div className="flex items-center justify-between text-[11px] text-slate-700 mt-1 pt-1.5 border-t border-slate-200 font-mono">
                              <span className="font-bold">FIAT Parity:</span>
                              <span className="text-emerald-800 font-black">₦{displayNaira.toLocaleString()} NGN</span>
                            </div>
                          )}
                        </div>

                        {/* Features List */}
                        <div className="space-y-2 mb-6">
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-wider">
                            Gated Privileges & Quota:
                          </p>
                          {card.features.map((feature, idx) => (
                            <div key={idx} className="text-xs font-medium text-slate-800 flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 mt-0.5" />
                              <span className="leading-snug">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Card Action Button */}
                      <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPlanForUpgrade(card)}
                          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                            card.isPopular
                              ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
                              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                          }`}
                        >
                          {isFree ? 'Current Tier' : 'Select Pass'}
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(card.route)}
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
                          title={`Navigate to ${card.screenName} (${card.route})`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PLATFORM SCREEN AUDIT MATRIX (20 MODULES) */}
          {activeTab === 'matrix' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-300 shadow-sm">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Platform Subscription Scope Audit</h3>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">
                    Full architectural audit of every screen and module requiring gated subscriptions across the FingerMobile Protocol.
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={matrixSearchQuery}
                    onChange={(e) => setMatrixSearchQuery(e.target.value)}
                    placeholder="Search screen, route, or tier..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-300 text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-3xl border border-slate-300 bg-white shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-100 text-slate-900 uppercase tracking-wider text-[10px] font-bold">
                      <th className="p-4">#</th>
                      <th className="p-4">Screen / Module</th>
                      <th className="p-4">Route</th>
                      <th className="p-4">Domain Category</th>
                      <th className="p-4">Subscription Tiers</th>
                      <th className="p-4">Dual Price (FIC / FIAT)</th>
                      <th className="p-4">Gated Privileges & Quota</th>
                      <th className="p-4">Access Mechanism</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {filteredAuditData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono text-slate-600 font-bold">{item.id}</td>
                        <td className="p-4 font-extrabold text-slate-900 whitespace-nowrap">{item.screenName}</td>
                        <td className="p-4 font-mono font-bold text-blue-700 whitespace-nowrap">{item.route}</td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-900 font-bold border border-slate-300 text-[10px]">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-slate-800 whitespace-nowrap">{item.plans}</td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-mono font-black text-amber-800">{item.ficPrice}</div>
                          <div className="font-mono text-[10px] font-bold text-emerald-800">{item.fiatPrice}</div>
                        </td>
                        <td className="p-4 max-w-xs truncate text-slate-700 font-medium" title={item.quotaBenefits}>
                          {item.quotaBenefits}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-400 shadow-xs border-amber-400">
                            {item.gatedStatus}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => navigate(item.route)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-bold text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3 text-slate-700" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: FIC MANAGEMENT & FIAT RULES CONSOLE */}
          {activeTab === 'fic_management' && (
            <div className="space-y-8">
              {/* Management Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Panel 1: FIC Allocation, Earning & Balance Adjustment */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-300 shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-300">
                      <Coins className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">FIC Token Allocation & Earning Rules</h3>
                      <p className="text-xs font-medium text-slate-700">Mint, allocate, adjust creator earning quotas, and track settlement balances</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-900 block mb-1">Target Account Handle / Address</label>
                      <input
                        type="text"
                        value={ficTargetUser}
                        onChange={(e) => setFicTargetUser(e.target.value)}
                        placeholder="@username or 0x..."
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono placeholder:text-slate-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-900 block mb-1">FIC Amount</label>
                        <input
                          type="number"
                          value={ficAllocationAmount}
                          onChange={(e) => setFicAllocationAmount(e.target.value)}
                          placeholder="250"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono placeholder:text-slate-400"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-900 block mb-1">FIAT Equivalent (1 FIC = ₦100)</label>
                        <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-emerald-800 font-mono font-black flex items-center">
                          ₦{(Number(ficAllocationAmount || 0) * 100).toLocaleString()} NGN
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-900 block mb-1">Cryptographic Audit Reason</label>
                      <input
                        type="text"
                        value={ficAllocationReason}
                        onChange={(e) => setFicAllocationReason(e.target.value)}
                        placeholder="e.g. Creator Incentive Pool Monthly Allocation"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-800 font-bold">Creator Earning Stream Status:</span>
                        <span className={`font-black ${earningSuspended ? 'text-rose-700' : 'text-emerald-800'}`}>
                          {earningSuspended ? 'SUSPENDED' : 'ACTIVE (70% Net Share)'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-800 font-bold">Wallet State:</span>
                        <span className={`font-black uppercase ${walletStatusState === 'active' ? 'text-emerald-800' : walletStatusState === 'suspended' ? 'text-amber-800' : 'text-rose-700'}`}>
                          {walletStatusState}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          showToast?.(`Allocated ${ficAllocationAmount} FIC to ${ficTargetUser}. Ledger hash confirmed.`, 'success');
                        }}
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 text-xs font-extrabold transition shadow-sm cursor-pointer"
                      >
                        Allocate Tokens
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEarningSuspended(!earningSuspended);
                          showToast?.(
                            `Creator earning status for ${ficTargetUser} set to ${!earningSuspended ? 'SUSPENDED' : 'ACTIVE'}.`,
                            'info'
                          );
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 text-xs font-bold transition cursor-pointer"
                      >
                        {earningSuspended ? 'Resume Earning' : 'Suspend Earning'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const nextState = walletStatusState === 'active' ? 'suspended' : walletStatusState === 'suspended' ? 'frozen' : 'active';
                          setWalletStatusState(nextState);
                          showToast?.(`Wallet status updated to ${nextState.toUpperCase()}.`, 'info');
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          walletStatusState === 'active'
                            ? 'bg-rose-100 text-rose-950 border border-rose-300 hover:bg-rose-200'
                            : 'bg-emerald-100 text-emerald-950 border border-emerald-300 hover:bg-emerald-200'
                        }`}
                      >
                        {walletStatusState === 'active' ? 'Suspend / Freeze Wallet' : 'Unfreeze Wallet'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Panel 2: FIAT Pegging, Settlement Rails & Legal Terms */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-300 shadow-sm space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-300">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">FIAT Settlement Rules & Legal T&Cs</h3>
                      <p className="text-xs font-medium text-slate-700">Immutable protocol peg, AML regulatory limits, and payout rails</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300">
                      <span className="font-extrabold text-slate-900 block mb-1">1. Protocol Parity Peg Anchor</span>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        1 FIC is formally anchored at <strong className="text-amber-800 font-bold">₦100.00 NGN</strong> (Naira) and convertible at prevailing FX rates to USD ($0.065 USD). In-app passes must maintain synchronous FIC and FIAT parity.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300">
                      <span className="font-extrabold text-slate-900 block mb-1">2. Payout Rails & Settlement Windows</span>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        Approved settlement rails: <strong className="text-emerald-800 font-bold">NIBSS Instant Payment (NIP), Paystack, Flutterwave, and Interswitch</strong>. Creator payouts clear automatically within 7 business days; Enterprise tiers clear within 3 business days.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300">
                      <span className="font-extrabold text-slate-900 block mb-1">3. KYC Tier Limits & Anti-Money Laundering</span>
                      <ul className="text-slate-700 font-medium space-y-1.5 mt-1 pl-4 list-disc">
                        <li><strong>Tier 1 (Unverified):</strong> Maximum daily outflow of 200 FIC (₦20,000 NGN).</li>
                        <li><strong>Tier 2 (Biometric Face Verified):</strong> Maximum daily outflow of 2,000 FIC (₦200,000 NGN).</li>
                        <li><strong>Tier 3 (Government ID / Corporate):</strong> Maximum daily outflow of 20,000 FIC (₦2,000,000 NGN).</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300">
                      <span className="font-extrabold text-slate-900 block mb-1">4. Refund, Dispute & Anti-Fraud Chargeback Shield</span>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        All transactions exceeding 500 FIC require Guardian AI Live-Motion Face verification. Disputed payments trigger automatic smart-contract escrow hold for 48 hours pending peer arbitration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVE SUBSCRIBED PASSES */}
          {activeTab === 'active' && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="py-20 text-center font-bold text-slate-700">Loading your subscribed passes...</div>
              ) : subscriptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-white border border-slate-300 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            {sub.creatorAvatar ? (
                              <img
                                src={sub.creatorAvatar}
                                alt={sub.creatorName}
                                className="w-12 h-12 rounded-2xl object-cover border border-amber-400"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 font-black flex items-center justify-center text-lg border border-amber-300">
                                {sub.creatorName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-base leading-tight">{sub.creatorName}</h4>
                              <p className="text-xs font-bold text-amber-800 mt-0.5">{sub.planName}</p>
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              sub.status === 'active'
                                ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                                : 'bg-slate-100 text-slate-800 border border-slate-300'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-300 mb-4 flex justify-between items-center text-xs">
                          <div>
                            <span className="text-base font-mono font-black text-slate-900">{sub.price} FIC</span>
                            <span className="text-slate-700 font-bold"> / month</span>
                          </div>
                          <span className="text-slate-700 font-medium">Next Renewal: {sub.renewalDate}</span>
                        </div>

                        {sub.benefits && (
                          <div className="space-y-1.5 mb-6">
                            {sub.benefits.map((b: string, idx: number) => (
                              <div key={idx} className="text-xs font-medium text-slate-800 flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                                <span>{b}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-200 flex gap-3">
                        <button
                          type="button"
                          onClick={() => navigate('/storefronts')}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
                        >
                          Visit Storefront
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-white rounded-3xl border border-slate-300 space-y-3 p-8 shadow-sm">
                  <Crown className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="text-lg font-extrabold text-slate-900">No Active Creator Passes</h3>
                  <p className="text-xs font-medium text-slate-700 max-w-sm mx-auto leading-relaxed">
                    Subscribe to your favorite music producers and streamers on Storefronts or BeatwaveNG to access exclusive stems and private livestreams.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* MODAL 1: CARD EDITOR MODAL (NANO BANANA STUDIO) */}
          {editingCard && (
            <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 overflow-y-auto">
              <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative my-8 text-slate-900">
                <button
                  type="button"
                  onClick={closeEditorModal}
                  className="absolute top-5 right-5 p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-300">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Edit Subscription Card</h3>
                    <p className="text-xs font-medium text-slate-700">Modify title, pricing, features, and gated routing</p>
                  </div>
                </div>

                <form onSubmit={handleSaveCard} className="space-y-4 text-xs">
                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1">Plan / Card Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-900 block mb-1">Domain Category</label>
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="platform">Platform Core</option>
                        <option value="media">Media & Streaming</option>
                        <option value="luxury">Luxury & VIP</option>
                        <option value="creator">Creator & Store</option>
                        <option value="community">Community & Arena</option>
                        <option value="fintech">Fintech & Security</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-900 block mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={editForm.badge}
                        onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-900 block mb-1">Monthly FIC Price</label>
                      <input
                        type="number"
                        min="0"
                        value={editForm.monthlyFIC}
                        onChange={(e) => {
                          const fic = Number(e.target.value);
                          setEditForm({ ...editForm, monthlyFIC: fic, monthlyNaira: fic * 100 });
                        }}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-900 block mb-1">Monthly FIAT (₦ NGN)</label>
                      <input
                        type="number"
                        min="0"
                        value={editForm.monthlyNaira}
                        onChange={(e) => setEditForm({ ...editForm, monthlyNaira: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1">Target Screen Route</label>
                    <input
                      type="text"
                      value={editForm.route}
                      onChange={(e) => setEditForm({ ...editForm, route: e.target.value })}
                      placeholder="/dancia4tv"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold placeholder:text-slate-400"
                    />
                  </div>

                  {/* Features List Editing */}
                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1">Features / Gated Privileges</label>
                    <div className="space-y-2 mb-2 max-h-36 overflow-y-auto pr-1">
                      {editForm.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-300">
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => {
                              const updatedFeatures = [...editForm.features];
                              updatedFeatures[i] = e.target.value;
                              setEditForm({ ...editForm, features: updatedFeatures });
                            }}
                            className="flex-1 bg-transparent border-none text-slate-900 font-bold focus:outline-none text-xs border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedFeatures = editForm.features.filter((_, idx) => idx !== i);
                              setEditForm({ ...editForm, features: updatedFeatures });
                            }}
                            className="text-rose-700 hover:text-rose-900 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFeatureText}
                        onChange={(e) => setNewFeatureText(e.target.value)}
                        placeholder="Add new perk (e.g. 4K Stem Downloads)..."
                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newFeatureText.trim()) {
                            setEditForm({ ...editForm, features: [...editForm.features, newFeatureText.trim()] });
                            setNewFeatureText('');
                          }
                        }}
                        className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Popular Toggle */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isPopular"
                      checked={!!editForm.isPopular}
                      onChange={(e) => setEditForm({ ...editForm, isPopular: e.target.checked })}
                      className="rounded border-slate-300 text-slate-900 focus:ring-0 w-4 h-4 font-bold border bg-white placeholder:text-slate-400"
                    />
                    <label htmlFor="isPopular" className="text-xs text-slate-900 font-bold cursor-pointer">
                      Mark as "Recommended / Popular" Tier
                    </label>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex justify-between items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleDeleteCard(editingCard.id)}
                      className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold transition flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Card</span>
                    </button>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={closeEditorModal}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 border border-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold shadow-sm"
                      >
                        Save Card
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL 2: UPGRADE CONFIRMATION MODAL */}
          {selectedPlanForUpgrade && (
            <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
              <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-slate-900">
                <button
                  type="button"
                  onClick={() => setSelectedPlanForUpgrade(null)}
                  className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-extrabold text-slate-900 mb-1">Subscribe to {selectedPlanForUpgrade.name}</h3>
                <p className="text-xs font-medium text-slate-700 mb-4">{selectedPlanForUpgrade.description}</p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-2 mb-4 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-700 font-bold">Billing Interval:</span>
                    <span className="text-slate-900 font-black capitalize">{billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700 font-bold">Total Due Today:</span>
                    <span className="text-amber-800 font-black text-sm">
                      {billingCycle === 'annual'
                        ? `${Math.round(selectedPlanForUpgrade.monthlyFIC * 12 * 0.8)} FIC`
                        : `${selectedPlanForUpgrade.monthlyFIC} FIC`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700 font-bold">FIAT Value:</span>
                    <span className="text-emerald-800 font-black">
                      ≈ ₦{(billingCycle === 'annual' ? selectedPlanForUpgrade.monthlyNaira * 12 * 0.8 : selectedPlanForUpgrade.monthlyNaira).toLocaleString()} NGN
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-700 font-bold">Vault Balance:</span>
                    <span className="text-slate-900 font-bold">{ficBalance.toLocaleString()} FIC</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlanForUpgrade(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 rounded-xl hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpgradePlan}
                    disabled={isProcessingUpgrade}
                    className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    {isProcessingUpgrade ? 'Confirming...' : 'Confirm Subscription'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SubscriptionsPage;
