import React, { useState } from 'react';

/*
 * FingerMobile Protocol™ - About Page Component
 * Copyright © 2025-2026 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import {
  Shield,
  Award,
  Globe,
  Users,
  Cpu,
  Landmark,
  Sparkles,
  MapPin,
  ExternalLink,
  DollarSign,
  Layers,
  BookOpen,
  Lock,
  Compass,
  Share2,
  Gift,
  Link as LinkIcon,
  Activity,
  Headphones,
  Scale,
  Send,
  Building2,
  BadgeCheck,
  ChevronRight
} from 'lucide-react';

import GiftModal from '../../components/GiftModal';
import CreatePaylinkModal from '../../components/CreatePaylinkModal';
import { useAppContext } from '../../contexts/AppContext';
import MainLayout from '../../layouts/MainLayout';
import apiService from '../../services/api.service';

interface FeaturePillar {
  title: string;
  tagline: string;
  description: string;
  metric: string;
  metricLabel: string;
  icon: React.ReactNode;
  accent: string;
}

interface StatisticItem {
  value: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

interface GovernancePortfolioItem {
  id: number;
  name: string;
  lead: string;
  focus: string;
  status: string;
}

const AboutPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [giftAmount, setGiftAmount] = useState('');
  const [paylinkAmount, setPaylinkAmount] = useState('');
  const [paylinkDescription, setPaylinkDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'founder' | 'technology' | 'governance' | 'contact'>('overview');

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    message: ''
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  const statistics: StatisticItem[] = [
    {
      value: '230+',
      label: 'Production Screens',
      sublabel: 'Full-featured digital metropolis',
      icon: <Layers className="w-6 h-6 text-blue-600" />
    },
    {
      value: '60',
      label: 'Forum Sectors',
      sublabel: 'Cultural, artistic & tech verticals',
      icon: <Users className="w-6 h-6 text-purple-600" />
    },
    {
      value: '53',
      label: 'Lagos Voice Lines',
      sublabel: 'Street-smart urban audio commentaries',
      icon: <Headphones className="w-6 h-6 text-emerald-600" />
    },
    {
      value: '18',
      label: 'Governance Portfolios',
      sublabel: 'Institutional checks & sovereign vaults',
      icon: <Landmark className="w-6 h-6 text-amber-600" />
    }
  ];

  const featurePillars: FeaturePillar[] = [
    {
      title: 'Cultural Heritage as an Asset Class',
      tagline: 'Bridging Indigenous Assets to Modern Wealth',
      description: 'FingerMobile transforms ancestral arts, oral histories, indigenous music, and craft techniques into sovereign, monetizable digital assets. Artisans and cultural custodians earn directly without exploitative intermediaries.',
      metric: '100%',
      metricLabel: 'Creator IP Ownership',
      icon: <Compass className="w-7 h-7 text-amber-600" />,
      accent: 'border-amber-300 bg-amber-50/50'
    },
    {
      title: 'Behavioral Retention & CES Engine',
      tagline: 'Value-First Engagement over Toxic Addiction',
      description: 'Engineered on the Customer Engagement Score (CES) formula by Founder Mbah Israel Obinna. The protocol rewards authentic contributions, meaningful watch time, community mentorship, and genuine transactions rather than outrage-driven metrics.',
      metric: '3.8x',
      metricLabel: 'Cohort Retention vs Legacy',
      icon: <Activity className="w-7 h-7 text-blue-600" />,
      accent: 'border-blue-300 bg-blue-50/50'
    },
    {
      title: 'Dual-Ledger Sovereign Monetary System',
      tagline: 'FIC & CIC Currency Architecture',
      description: 'Features a synchronized monetary topology: FIC (Finger Internet Currency) powers global cross-border micro-tipping, paylinks, and streaming gifts, while CIC (Community Indigenous Currency) fuels localized grassroots commerce.',
      metric: '0% Middleman',
      metricLabel: 'Direct P2P Settlement',
      icon: <DollarSign className="w-7 h-7 text-emerald-600" />,
      accent: 'border-emerald-300 bg-emerald-50/50'
    },
    {
      title: 'Lagos Urban Audio Engine (Pipecat / TTS)',
      tagline: 'Cultural Authenticity in Every Interaction',
      description: 'The platform integrates 53 bespoke Lagos audio commentaries voiced with genuine Nigerian street-smart inflection. From celebratory forum gifts to intense FingerWars battles, audio commentary creates an unmatched sense of place and vibe.',
      metric: '53 Lines',
      metricLabel: 'Dynamic Audio Commentary',
      icon: <Headphones className="w-7 h-7 text-purple-600" />,
      accent: 'border-purple-300 bg-purple-50/50'
    },
    {
      title: 'Enterprise WORM Audit & Guardian AI',
      tagline: 'Immutable Transparency & CSAE Protection',
      description: 'All governance events, administrative updates, and treasury transfers are permanently chronicled in Write-Once-Read-Many (WORM) audit trails. Guardian AI executes zero-tolerance real-time child protection and content dignity scanning.',
      metric: 'Zero-Tolerance',
      metricLabel: 'CSAE & Fraud Shield',
      icon: <Shield className="w-7 h-7 text-rose-600" />,
      accent: 'border-rose-300 bg-rose-50/50'
    },
    {
      title: 'Universal High-Contrast Accessibility',
      tagline: 'WCAG AAA Strict Visual Hierarchy',
      description: 'Designed under rigorous ergonomic rules: slate-900 high-contrast typography, deep-tint status badges, and defined structural borders ensure crystal-clear readability and accessible navigation across all lighting environments.',
      metric: '15.9:1',
      metricLabel: 'AAA Contrast Ratio',
      icon: <Sparkles className="w-7 h-7 text-indigo-600" />,
      accent: 'border-indigo-300 bg-indigo-50/50'
    }
  ];

  const governancePortfolios: GovernancePortfolioItem[] = [
    { id: 1, name: 'Sovereign Treasury & Vault Protocol', lead: 'Mrs. Mbah Eunice Emonena (CFO)', focus: 'FIC/CIC liquidity, multi-tier reserve custody & anti-inflationary locks', status: 'Active & Enforced' },
    { id: 2, name: 'Behavioral Architecture & IP Defense', lead: 'Mbah Israel Obinna (Founder)', focus: 'CES algorithmic retention, patent governance & creator copyright protection', status: 'Active & Enforced' },
    { id: 3, name: 'Cultural Curation & Lagos Audio Heritage', lead: 'African Cultural Directorate', focus: 'Preservation of indigenous arts, dialect nuances & Lagos street voice-lines', status: 'Active & Enforced' },
    { id: 4, name: 'Guardian AI Compliance & CSAE Zero-Tolerance', lead: 'Trust & Safety Council', focus: 'Real-time multi-modal scanning, child safety shields & law enforcement liaison', status: 'Active & Enforced' },
    { id: 5, name: 'Enterprise Franchise & B2B Monetization', lead: 'Global Business Directorate', focus: 'Regional franchise licensing, enterprise white-label & SME onboarding', status: 'Active & Enforced' },
    { id: 6, name: 'Immutable WORM Audit & Legal Sovereignty', lead: 'Corporate Secretariat', focus: 'Cryptographic log provenance, regulatory filing & statutory compliance', status: 'Active & Enforced' }
  ];

  const onOpenGiftModal = () => {
    if (ficBalance <= 0) {
      showToast('Your FIC balance is 0. Please fund your wallet to send a gift.', 'error');
      return;
    }
    setShowGiftModal(true);
  };

  const onOpenPaylinkModal = () => {
    if (ficBalance <= 0) {
      showToast('Your FIC balance is 0. Please fund your wallet to create a paylink.', 'error');
      return;
    }
    setShowPaylinkModal(true);
  };

  const handleSendGift = async () => {
    if (!giftAmount || parseFloat(giftAmount) <= 0) {
      showToast('Please enter a valid gift amount.', 'error');
      return;
    }
    if (parseFloat(giftAmount) > ficBalance) {
      showToast('Insufficient FIC balance to send this gift.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.sendGift({ amount: parseFloat(giftAmount) });
      showToast(`Successfully sent a gift of ${giftAmount} FIC!`, 'success');
      setGiftAmount('');
      setShowGiftModal(false);
    } catch {
      showToast('Failed to send gift. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreatePaylink = async () => {
    if (!paylinkAmount || parseFloat(paylinkAmount) <= 0) {
      showToast('Please enter a valid paylink amount.', 'error');
      return;
    }
    if (parseFloat(paylinkAmount) > ficBalance) {
      showToast('Insufficient FIC balance to create this paylink.', 'error');
      return;
    }
    if (!paylinkDescription.trim()) {
      showToast('Please add a description for the paylink.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.createPaylink({
        amount: parseFloat(paylinkAmount),
        description: paylinkDescription
      });
      showToast(`Successfully created a paylink for ${paylinkAmount} FIC!`, 'success');
      setPaylinkAmount('');
      setPaylinkDescription('');
      setShowPaylinkModal(false);
    } catch {
      showToast('Failed to create paylink. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setIsSubmittingContact(true);
    setTimeout(() => {
      setIsSubmittingContact(false);
      showToast('Inquiry dispatched successfully to the Executive Secretariat.', 'success');
      setContactForm({
        name: '',
        email: '',
        category: 'General Inquiry',
        subject: '',
        message: ''
      });
    }, 1200);
  };

  return (
    <MainLayout pageTitle="About FingerMobile Protocol™">
      <div className="w-full max-w-full overflow-x-hidden text-slate-900 pb-28 md:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Executive Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 p-8 sm:p-12 text-white shadow-xl border border-slate-800">
          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <BadgeCheck className="w-4 h-4 text-blue-400" />
              Sovereign Cultural-Economic Infrastructure
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              FingerMobile Protocol™©®
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 font-medium leading-relaxed">
              A Decentralized Trendy Urban Social Media Platform pioneering the monetization of cultural heritage,
              artisan craftsmanship, and behavioral retention algorithms for global creators and SMEs.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="https://www.linkedin.com/in/obinnambah100/?isSelfProfile=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg transition-all focus:ring-2 focus:ring-blue-300"
              >
                <Share2 className="w-4 h-4" />
                Connect with Visionary Founder on LinkedIn
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setActiveTab('founder')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-700 font-semibold text-sm transition-all"
              >
                Read Founder Dossier
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* Subtle background glow */}
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Global Statistics Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statistics.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
            >
              <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0">
                {stat.icon}
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-sm font-bold text-slate-800">{stat.label}</p>
                <p className="text-xs text-slate-700 font-medium">{stat.sublabel}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-1.5 overflow-x-auto">
          <nav className="flex space-x-2 min-w-max">
            {[
              { id: 'overview', label: 'Platform Overview & Pillars', icon: Compass },
              { id: 'founder', label: 'Visionary Founder & Leadership', icon: Award },
              { id: 'technology', label: 'STERCS & Technical Innovation', icon: Cpu },
              { id: 'governance', label: 'Corporate Governance & Values', icon: Landmark },
              { id: 'contact', label: 'Global Directory & Contact', icon: Building2 }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <TabIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-700 font-bold'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* TAB 1: OVERVIEW & PILLARS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Mission & Sovereign Manifesto */}
            <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">The Sovereign Manifesto</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  Reclaiming Digital Dignity & Cultural Prosperity
                </h2>
              </div>
              <div className="prose max-w-none text-slate-700 space-y-4 font-medium text-base leading-relaxed">
                <p>
                  <strong className="text-slate-900 font-bold">FingerMobile Protocol™©®</strong> is not merely a social network; it is a
                  sovereign digital ecosystem engineered to disrupt the extractive paradigm of legacy big tech. For decades, global platforms
                  have colonized human attention, scraped indigenous creative works, and centralized advertising billions while leaving creators,
                  local artisans, and grassroots communities economically disenfranchised.
                </p>
                <p>
                  Conceived and authored by visionary <strong className="text-slate-900 font-bold">Mbah Israel Obinna</strong>, FingerMobile establishes
                  an unshakeable standard of <span className="text-slate-900 font-semibold underline decoration-blue-500">Reciprocal Digital Economics</span>.
                  Here, cultural heritage is recognized as a living, liquid asset class. Our architecture links ancestral identity, folklore,
                  fashion, and artisan craft directly to modern digital skills, peer-to-peer micro-monetization, and high-concurrency cloud infrastructure.
                </p>
                <p>
                  Every participant—from street vendors and traditional bead makers to contemporary vloggers, enterprise franchises, and tech pioneers—retains
                  complete ownership over their intellectual property, audience relationships, and financial distributions.
                </p>
              </div>

              {/* Verified Badges Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <p className="text-xs font-bold uppercase text-blue-900">Proprietary IP Status</p>
                  <p className="text-base font-extrabold text-blue-950 mt-1">Sole & Exclusive Property</p>
                  <p className="text-xs text-blue-800 mt-1">Registered & protected under international intellectual property statutes.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="text-xs font-bold uppercase text-emerald-900">Economic Model</p>
                  <p className="text-base font-extrabold text-emerald-950 mt-1">Dual-Ledger FIC & CIC</p>
                  <p className="text-xs text-emerald-800 mt-1">Autonomous vault liquidity without predatory intermediary fees.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                  <p className="text-xs font-bold uppercase text-purple-900">Cultural Foundation</p>
                  <p className="text-base font-extrabold text-purple-950 mt-1">53 Lagos Audio Voice Lines</p>
                  <p className="text-xs text-purple-800 mt-1">Real-time street commentary celebrating authentic Afrocentric urban pulse.</p>
                </div>
              </div>
            </div>

            {/* Foundational Pillars Grid */}
            <div>
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Architectural Foundations</span>
                <h3 className="text-2xl font-black text-slate-900">The 6 Pillars of FingerMobile</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featurePillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl border p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${pillar.accent}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 rounded-lg bg-white shadow-sm border border-slate-200">
                          {pillar.icon}
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">
                          {pillar.metric}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 leading-snug">{pillar.title}</h4>
                      <p className="text-xs font-bold text-blue-700 mt-1 mb-2">{pillar.tagline}</p>
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">{pillar.description}</p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Standard:</span>
                      <span className="text-slate-900">{pillar.metricLabel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VISIONARY FOUNDER & LEADERSHIP */}
        {activeTab === 'founder' && (
          <div className="space-y-8">
            {/* Mbah Israel Obinna - Master Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Founder Portrait */}
                  <div className="relative group">
                    <img
                      src="/assets/branding/mbah_israel_obinna.jpeg"
                      onError={(e) => {
                        // Fallback to photocredits portrait if branding path fails
                        (e.target as HTMLImageElement).src = '/assets/photocredits/obinna_profile.jpg';
                      }}
                      alt="Mbah Israel Obinna"
                      className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover object-top border-4 border-white/20 shadow-2xl"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full shadow-lg border-2 border-slate-900">
                      <BadgeCheck className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Header Dossier */}
                  <div className="space-y-2 text-center md:text-left flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400 text-blue-200 text-xs font-bold uppercase tracking-wider">
                      Visionary & Founder • Sole Intellectual Property Owner
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      Mbah Israel Obinna
                    </h2>
                    <p className="text-lg font-bold text-blue-300">
                      Senior Data Analyst, Intellectual Property Owner, Social Media Ideologist
                    </p>
                    <p className="text-sm text-slate-700 max-w-2xl font-medium">
                      Pioneer of Cultural Heritage Integration with Modern Cloud & Decentralized Technology.
                      Architect of the Customer Engagement Score (CES) and Sovereign Enterprise Governance Framework.
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
                      <a
                        href="https://www.linkedin.com/in/obinnambah100/?isSelfProfile=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Verified LinkedIn Profile: in/obinnambah100
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-slate-200 text-xs font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        Richmond, TX (USA) & Lagos (Nigeria)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comprehensive Visionary Dossier & Ideology */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* 4 Core Pillars of Obinna's Ideology */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-xl border border-slate-300 bg-slate-50 space-y-2">
                    <div className="flex items-center gap-2 text-blue-700 font-bold">
                      <Activity className="w-5 h-5" />
                      <h4 className="text-base font-black text-slate-900">Customer Behavior Analysis & Retention</h4>
                    </div>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      As a Senior Data Analyst, Mbah Israel Obinna rejected the vanity dopamine loops of legacy platforms.
                      Instead, he engineered predictive cohort retention models based on organic utility, skill acquisition,
                      and measurable peer compensation. By tracking behavioral drop-offs and cognitive friction points,
                      he developed FingerMobile to be an empowering daily utility rather than an attention-draining treadmill.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-slate-300 bg-slate-50 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-700 font-bold">
                      <Lock className="w-5 h-5" />
                      <h4 className="text-base font-black text-slate-900">Intellectual Property Ownership Architecture</h4>
                    </div>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      As the sole and exclusive intellectual property owner of the FingerMobile™ and FingerMobile Protocol™
                      platforms, Obinna authored the legal and algorithmic infrastructure ensuring that creators never surrender
                      copyrights. Traditional terms-of-service seize creator rights; FingerMobile enforces immutable, cryptographic
                      provenance for all user-generated content and cultural artifacts.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-slate-300 bg-slate-50 space-y-2">
                    <div className="flex items-center gap-2 text-purple-700 font-bold">
                      <Globe className="w-5 h-5" />
                      <h4 className="text-base font-black text-slate-900">Social Media Ideology: Reciprocal Economics</h4>
                    </div>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      Obinna’s social ideology dismantles the &quot;digital sharecropping&quot; model of Web2. He advocates that
                      attention, data, and cultural output are economic assets owned by the individual. Under FingerMobile,
                      advertising revenue, platform growth, and transaction velocity are automatically recirculated into the
                      wallets of active community members, forum leaders, and verified artisans.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-slate-300 bg-slate-50 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                      <Sparkles className="w-5 h-5" />
                      <h4 className="text-base font-black text-slate-900">Cultural Heritage Integration with Modern Tech</h4>
                    </div>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      Pioneering the synthesis of African cultural resonance with Silicon-grade technology, Obinna commissioned
                      and directed the 53 Lagos audio voice commentaries and cultural forum taxonomies. He proves that indigenous
                      traditions, linguistic street pride, and local enterprise are the ultimate engines of global digital distinction.
                    </p>
                  </div>
                </div>

                {/* Detailed Founder Narrative */}
                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <h3 className="text-xl font-black text-slate-900">The Vision in the Founder&apos;s Words</h3>
                  <blockquote className="p-5 rounded-xl border-l-4 border-blue-600 bg-blue-50/60 text-slate-800 italic font-medium leading-relaxed">
                    &ldquo;We did not build FingerMobile to copy what exists; we built it to rectify what was broken.
                    Technology without cultural identity is hollow, and social media without economic ownership is exploitation.
                    Our mission is to arm every creator, artisan, and entrepreneur with the sovereign tools to convert their
                    heritage and creative discipline into lifelong economic freedom.&rdquo;
                    <span className="block not-italic font-bold text-slate-900 mt-2 text-sm">
                      — Mbah Israel Obinna, Visionary & Founder
                    </span>
                  </blockquote>
                </div>
              </div>
            </div>

            {/* Co-Founder & CFO Profile */}
            <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative group flex-shrink-0">
                  <img
                    src="/assets/branding/eunice_emonena_mbah.webp"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/photocredits/eunice_emonena_mbah.webp';
                    }}
                    alt="Mrs. Mbah Eunice Emonena"
                    className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover object-top border-4 border-emerald-400/30 shadow-2xl"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                    <BadgeCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-2 text-center md:text-left flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-950 text-xs font-bold uppercase tracking-wider font-black">
                    Executive Council • Co-Founder
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Mrs. Mbah Eunice Emonena
                  </h3>
                  <p className="text-base font-bold text-emerald-800">
                    Co-Founder & Chief Financial Officer (CFO)
                  </p>
                  <p className="text-sm text-slate-700 font-medium max-w-3xl leading-relaxed">
                    Co-governing the supreme corporate authority of FingerMobile Protocol Communication. Mrs. Mbah Eunice Emonena
                    stewards institutional fiscal discipline, multi-tier treasury vault governance, statutory anti-money laundering (AML)
                    compliance, and the dual-key authorization protocol that safeguards user and enterprise balances.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold">
                      Treasury Multi-Signature Custody
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold">
                      Fiscal Compliance & Audits
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold">
                      FIC / CIC Dual-Vault Oversight
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Governance Leadership Matrix (18 Portfolios Summary) */}
            <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Supreme Corporate Governance</span>
                  <h3 className="text-xl font-black text-slate-900">Executive Portfolios & Oversight Matrix</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-950 border border-blue-400 text-xs font-bold font-black">
                  18 Mandates Active
                </span>
              </div>
              <p className="text-sm text-slate-700 font-medium">
                Under the Sovereign Enterprise Corporate Governance Charter (mandated October 14, 2026), platform administration
                is segregated into 18 specialized operational portfolios governed by least-privilege role-based access control (RBAC).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {governancePortfolios.map((port) => (
                  <div key={port.id} className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-xs font-black">
                        Portfolio #{port.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 text-xs font-bold font-black">
                        {port.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">{port.name}</h4>
                    <p className="text-xs font-bold text-blue-700">{port.lead}</p>
                    <p className="text-xs text-slate-700 font-medium">{port.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STERCS & TECHNICAL INNOVATION */}
        {activeTab === 'technology' && (
          <div className="space-y-8">
            {/* The STERCS Framework Card */}
            <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Proprietary System Architecture</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  The STERCS Framework
                </h2>
                <p className="text-sm text-slate-700 font-medium mt-1">
                  Social • Technology • Economic • Regulatory • Cultural • Security
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    code: 'S',
                    name: 'Social Dimension',
                    detail: 'High-trust community spheres, peer networking, respectful social matching (Lush Pressies), and collaborative spaces with zero algorithmic toxicity.',
                    icon: <Users className="w-6 h-6 text-blue-600" />
                  },
                  {
                    code: 'T',
                    name: 'Technology Stack',
                    detail: 'Microservices with Node.js/TypeScript backends, React 18 single-page architecture, Pipecat real-time audio orchestration, and high-throughput WebSockets.',
                    icon: <Cpu className="w-6 h-6 text-purple-600" />
                  },
                  {
                    code: 'E',
                    name: 'Economic Ledger',
                    detail: 'Dual-currency sovereign circulation: FIC (Finger Internet Currency) and CIC (Community Indigenous Currency) with instant peer paylinks and multi-signature vaults.',
                    icon: <DollarSign className="w-6 h-6 text-emerald-600" />
                  },
                  {
                    code: 'R',
                    name: 'Regulatory Compliance',
                    detail: 'Strict alignment with global consumer protection, NDPR, GDPR, and anti-money laundering frameworks, supported by immutable cryptographic WORM logs.',
                    icon: <Scale className="w-6 h-6 text-amber-600" />
                  },
                  {
                    code: 'C',
                    name: 'Cultural Provenance',
                    detail: 'Preservation of indigenous arts, 53 Lagos audio voice commentaries, native artisan masterclasses, and decentralized folklore transmission.',
                    icon: <BookOpen className="w-6 h-6 text-rose-600" />
                  },
                  {
                    code: 'S',
                    name: 'Security & Guardian AI',
                    detail: 'Zero-tolerance CSAE neural screening, biometric gatekeeping, tamper-evident audit pipelines, and least-privilege role boundaries.',
                    icon: <Shield className="w-6 h-6 text-indigo-600" />
                  }
                ].map((st, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-slate-300 bg-slate-50 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-black text-slate-900 shadow-sm">
                        {st.code}
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">{st.name}</h4>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed pt-2">{st.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Behavioral Retention & CES Formula */}
            <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Algorithmic Innovation</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  Customer Engagement Score (CES) Engine
                </h3>
              </div>
              <div className="prose max-w-none text-slate-700 font-medium space-y-4">
                <p>
                  Unlike traditional platforms that optimize for rage and high-churn addiction, Mbah Israel Obinna formulated
                  the <strong className="text-slate-900 font-bold">Customer Engagement Score (CES)</strong>. CES governs content discovery,
                  monetization tier eligibility, and community reputation:
                </p>
                <div className="p-4 rounded-xl bg-slate-900 text-blue-200 font-mono text-sm sm:text-base border border-slate-800 shadow-inner overflow-x-auto">
                  <code>CES = (w₁ • QualityWatchTime) + (w₂ • VerifiedP2PTransactions) + (w₃ • CulturalContribution) - (w₄ • ToxicFrictionFlags)</code>
                </div>
                <p>
                  This mathematical governance ensures that genuine educators, master artisans, and constructive community leaders
                  rise to the top of discovery feeds, while low-effort spam and coordinated bad actors are mathematically demoted.
                </p>
              </div>
            </div>

            {/* Lagos Urban Voice Commentary Engine */}
            <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-600">Acoustic Cultural Layer</span>
                  <h3 className="text-xl font-black text-slate-900">53 Lagos Urban Voice Commentaries</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-950 border border-purple-400 text-xs font-bold font-black">
                  Pipecat / Edge-TTS Audio
                </span>
              </div>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                FingerMobile includes an intelligent, non-blocking real-time audio pipeline. Voiced in authentic Lagos English
                cadence, 53 unique audio commentaries are distributed across forums, gem acquisitions, and gaming battles.
                Calibrated to a pleasant 35% background volume, the audio engine celebrates milestones with phrases like
                <em> &quot;Sharp guy, you get eye for better things!&quot;</em> and <em>&quot;Omo, who go settle this matter? Finger wars don begin!&quot;</em>
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: CORPORATE GOVERNANCE & VALUES */}
        {activeTab === 'governance' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Ethics, Privacy & Stewardship</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  Corporate Governance & Sovereign Values
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-slate-300 bg-white space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-100 border border-blue-300 text-blue-900">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">Anti-Surveillance & Data Dignity</h3>
                  </div>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    FingerMobile Protocol will never sell, lease, or broker member behavioral data to third-party advertisers.
                    User data is encrypted at rest and in transit, belonging strictly to the individual.
                  </p>
                </div>

                <div className="p-6 rounded-xl border border-slate-300 bg-white space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-900">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">Child Safety & CSAE Zero-Tolerance</h3>
                  </div>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    We maintain an uncompromised zero-tolerance posture against child sexual abuse material (CSAE) and exploitation.
                    Real-time neural scanners actively monitor payloads, with immediate termination and law enforcement referral.
                  </p>
                </div>

                <div className="p-6 rounded-xl border border-slate-300 bg-white space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">Dual-Key Treasury Governance</h3>
                  </div>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    Financial reserves are locked in multi-tier vaults. Minting new currency or adjusting global economics
                    requires mutual cryptographic concurrence from Founder Mbah Israel Obinna and CFO Mrs. Mbah Eunice Emonena.
                  </p>
                </div>

                <div className="p-6 rounded-xl border border-slate-300 bg-white space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-purple-100 border border-purple-300 text-purple-900">
                      <Award className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">100% Creator IP Protection</h3>
                  </div>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    Every article, media post, digital artwork, and video uploaded to FingerMobile remains the sole intellectual
                    property of the uploading creator. The platform acts as a neutral, high-performance distribution rail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GLOBAL DIRECTORY & CONTACT */}
        {activeTab === 'contact' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Headquarters & Official Directory */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Global Presence</span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">Operational Centers</h3>
                  </div>

                  {/* US Headquarters */}
                  <div className="space-y-2 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      United States Corporate HQ
                    </div>
                    <p className="text-sm text-slate-700 font-medium">
                      7307 Brandford Park Lane<br />
                      Richmond, TX 77407<br />
                      United States of America
                    </p>
                  </div>

                  {/* African Operations */}
                  <div className="space-y-2 border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Globe className="w-4 h-4 text-emerald-600" />
                      African Operations & Innovation Hub
                    </div>
                    <p className="text-sm text-slate-700 font-medium">
                      Lagos State & F.C.T. Abuja<br />
                      Federal Republic of Nigeria
                    </p>
                  </div>

                  {/* Direct Contact Channels */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-700 font-bold">Corporate Emails</p>
                      <a href="mailto:info@fingermobileprotocol.com" className="text-sm font-bold text-blue-700 hover:underline block">
                        info@fingermobileprotocol.com
                      </a>
                      <a href="mailto:fingermobileprotocol@gmail.com" className="text-sm font-bold text-blue-700 hover:underline block">
                        fingermobileprotocol@gmail.com
                      </a>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-slate-700 font-bold">Executive Telephone</p>
                      <p className="text-sm font-bold text-slate-800">+234 818 222 7289</p>
                      <p className="text-sm font-bold text-slate-800">+234 808 885 5752</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-slate-700 font-bold">Official Web Domains</p>
                      <a href="https://fingermobileprotocol.com" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-700 hover:underline block">
                        https://fingermobileprotocol.com
                      </a>
                      <a href="https://www.fingermobileprotocol.com" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-700 hover:underline block">
                        https://www.fingermobileprotocol.com
                      </a>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase text-slate-700 font-bold">Founder LinkedIn</p>
                      <a
                        href="https://www.linkedin.com/in/obinnambah100/?isSelfProfile=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:underline mt-1"
                      >
                        <Share2 className="w-4 h-4" />
                        linkedin.com/in/obinnambah100
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Executive Inquiry Dispatcher */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Executive Secretariat</span>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">Direct Platform Inquiry & Franchise Dispatch</h3>
                    <p className="text-sm text-slate-700 font-medium mt-1">
                      Send a verified message to the FingerMobile Executive Council for institutional partnerships, media inquiries, or technical support.
                    </p>
                  </div>

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-800 mb-1">
                          Full Legal Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="e.g. Dr. Ngozi Adebayo"
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 font-bold bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-800 mb-1">
                          Official Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="name@organization.com"
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 font-bold bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-800 mb-1">
                          Inquiry Category
                        </label>
                        <select
                          value={contactForm.category}
                          onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 font-bold bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          <option>General Inquiry</option>
                          <option>Enterprise Franchise Partnership</option>
                          <option>Artisan / SME Onboarding</option>
                          <option>Cultural Curation & Media</option>
                          <option>Investor & Treasury Relations</option>
                          <option>Technical Protocol Support</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-800 mb-1">
                          Subject Headline *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          placeholder="e.g. Franchise Regional Deployment"
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 font-bold bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-800 mb-1">
                        Executive Message *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Detail your request, proposal, or inquiry here..."
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 font-bold bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingContact}
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {isSubmittingContact ? 'Transmitting Dispatch...' : 'Dispatch Executive Inquiry'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Financial Action Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 border border-blue-300 text-blue-900">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-600">Your Live FIC Balance</p>
              <p className="text-2xl font-black text-slate-900">{ficBalance.toFixed(2)} FIC</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenGiftModal}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors focus:ring-2 focus:ring-blue-500"
            >
              <Gift className="w-4 h-4" />
              Send Gift (FIC)
            </button>
            <button
              type="button"
              onClick={onOpenPaylinkModal}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors focus:ring-2 focus:ring-emerald-500"
            >
              <LinkIcon className="w-4 h-4" />
              Create Paylink
            </button>
          </div>
        </div>

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
          <button
            onClick={() => setActiveTab('overview')}
            aria-label="Overview Tab"
            className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
              activeTab === 'overview' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
            }`}
          >
            <span className="text-base">🌐</span>
            <span>About</span>
          </button>
          <button
            onClick={() => setActiveTab('founder')}
            aria-label="Founder Tab"
            className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
              activeTab === 'founder' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
            }`}
          >
            <span className="text-base">👤</span>
            <span>Founder</span>
          </button>
          <button
            onClick={() => setActiveTab('technology')}
            aria-label="Technology Tab"
            className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
              activeTab === 'technology' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
            }`}
          >
            <span className="text-base">⚡</span>
            <span>Tech</span>
          </button>
          <button
            onClick={() => setActiveTab('governance')}
            aria-label="Governance Tab"
            className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
              activeTab === 'governance' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
            }`}
          >
            <span className="text-base">🏛️</span>
            <span>Gov</span>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            aria-label="Contact Tab"
            className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
              activeTab === 'contact' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
            }`}
          >
            <span className="text-base">✉️</span>
            <span>Contact</span>
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to Top"
            className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
          >
            <span className="text-base">⬆️</span>
            <span>Top</span>
          </button>
        </div>

      </div>

      {/* Gift Modal */}
      <GiftModal
        isOpen={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        onSendGift={handleSendGift}
        giftAmount={giftAmount}
        setGiftAmount={setGiftAmount}
        ficBalance={ficBalance}
        isProcessing={isProcessing}
      />

      {/* Paylink Modal */}
      <CreatePaylinkModal
        isOpen={showPaylinkModal}
        onClose={() => setShowPaylinkModal(false)}
        onCreatePaylink={handleCreatePaylink}
        paylinkAmount={paylinkAmount}
        setPaylinkAmount={setPaylinkAmount}
        paylinkDescription={paylinkDescription}
        setPaylinkDescription={setPaylinkDescription}
        ficBalance={ficBalance}
        isProcessing={isProcessing}
      />
    </MainLayout>
  );
};

export default AboutPage;
