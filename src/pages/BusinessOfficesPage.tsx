import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  ShieldCheck,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle2,
  Send,
  X,
  Search,
  FileText,
  BadgeCheck,
  Users,
  Sparkles
} from 'lucide-react';

export interface CorporateOffice {
  id: string;
  name: string;
  region: string;
  country: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  isHeadquarters?: boolean;
  isVirtual?: boolean;
  hours: string;
  amenities: string[];
  imageUrl: string;
  licenseNumber?: string;
}

const CORPORATE_OFFICES: CorporateOffice[] = [
  {
    id: 'abuja-hq',
    name: 'National Executive Headquarters',
    region: 'Nigeria',
    country: 'Nigeria',
    address: '#Gilbert Nwanna Crescent, Kubwa',
    city: 'Abuja, F.C.T.',
    phone: '+234 801 234 5678',
    email: 'admin@fingermobile.org',
    isHeadquarters: true,
    isVirtual: false,
    hours: 'Mon - Fri: 8:00 AM - 6:00 PM (WAT)',
    amenities: [
      'Executive Boardroom & Governance Chamber',
      'Protocol Engineering & National Data Center',
      'Regulatory Compliance & Legal Department',
      'Security Operations Center (SOC Tier-3)'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    licenseNumber: 'CAC/RC/2026/FMP-00192'
  },
  {
    id: 'usa-hq',
    name: 'Global Protocol & International HQ',
    region: 'North America',
    country: 'United States',
    address: '#7307, Branford Park Ln',
    city: 'Richmond, Texas 77407',
    phone: '+1 (832) 555-0199',
    email: 'usa@fingermobile.org',
    isHeadquarters: true,
    isVirtual: false,
    hours: 'Mon - Fri: 9:00 AM - 5:00 PM (CST)',
    amenities: [
      'Global Protocol Architecture Team',
      'International Investor Relations & Venture Desk',
      'Smart Contract & Web3 Security Audit Suite',
      'Cross-Border Settlement Clearing'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    licenseNumber: 'DELAWARE-CORP-SEC-92810'
  },
  {
    id: 'lagos-hub',
    name: 'Commercial, Media & Creator Hub',
    region: 'Nigeria',
    country: 'Nigeria',
    address: '123 Victoria Island Commercial Corridor',
    city: 'Lagos',
    phone: '+234 800 123 4567',
    email: 'lagos@fingermobile.org',
    isHeadquarters: false,
    isVirtual: false,
    hours: '24/7 Creator Operations',
    amenities: [
      'Dancia-4Tv 4K Live Broadcast Studios',
      'BeatwaveNG Acoustic Sound Mixing Booths',
      'PhotoCredits HD High-Speed Upload Terminals',
      'Storefront Logistics & Merchant Fulfillment Hub'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    licenseNumber: 'LASG-COMM-REG-847291'
  },
  {
    id: 'london-office',
    name: 'European Operations & Fintech Office',
    region: 'Europe & UK',
    country: 'United Kingdom',
    address: 'Level 24, One Canada Square, Canary Wharf',
    city: 'London E14 5AA',
    phone: '+44 20 7946 0912',
    email: 'london@fingermobile.org',
    isHeadquarters: false,
    isVirtual: false,
    hours: 'Mon - Fri: 9:00 AM - 5:30 PM (GMT)',
    amenities: [
      'European Cross-Border Payment Gateway Hub',
      'UK FCA Compliance Liaison Desk',
      'Enterprise Liquidity & Institutional Relations',
      'High-Speed Private Financial Dark-Fiber Node'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    licenseNumber: 'UK-CH-14285910'
  },
  {
    id: 'accra-office',
    name: 'West Africa Francophone & Anglophone Gateway',
    region: 'Pan-Africa',
    country: 'Ghana',
    address: '7 Independence Avenue, Airport City',
    city: 'Accra',
    phone: '+233 30 274 5800',
    email: 'ghana@fingermobile.org',
    isHeadquarters: false,
    isVirtual: false,
    hours: 'Mon - Fri: 8:30 AM - 5:30 PM (GMT)',
    amenities: [
      'Regional Merchant Onboarding Pavilion',
      'Cross-Border Mobile Money Integration Node',
      'Creator Content Studio (Accra Sound Lab)',
      'Community Living Room & Event Terrace'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    licenseNumber: 'GH-RGD-CS829104'
  },
  {
    id: 'nairobi-office',
    name: 'East Africa Tech & Mobile Money Hub',
    region: 'Pan-Africa',
    country: 'Kenya',
    address: 'The Mirage, Tower 2, Chiromo Road, Westlands',
    city: 'Nairobi',
    phone: '+254 20 765 4321',
    email: 'nairobi@fingermobile.org',
    isHeadquarters: false,
    isVirtual: false,
    hours: 'Mon - Fri: 8:30 AM - 6:00 PM (EAT)',
    amenities: [
      'M-Pesa & East Africa Settlement Engine',
      'Swahili & Regional Language Localization Lab',
      'GameOn & Esports Tournament Server Room',
      'P2P Escrow Telemetry Center'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80',
    licenseNumber: 'KE-BRS-CPR/2026/982'
  },
  {
    id: 'johannesburg-office',
    name: 'Southern Africa Media & Commercial Center',
    region: 'Pan-Africa',
    country: 'South Africa',
    address: '150 West Street, Sandton',
    city: 'Johannesburg 2196',
    phone: '+27 11 883 0000',
    email: 'safrica@fingermobile.org',
    isHeadquarters: false,
    isVirtual: false,
    hours: 'Mon - Fri: 8:30 AM - 5:00 PM (SAST)',
    amenities: [
      'Broadcast Relay & Content Mastering Suite',
      'Commercial Brand Licensing & Canary Ads Agency',
      'Franchise Partner Operations Desk',
      'Web3 Developer Acceleration Sandbox'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    licenseNumber: 'CIPC-2026/839102/07'
  },
  {
    id: 'virtual-node',
    name: 'Decentralized Virtual Meta Terminal',
    region: 'Metaverse',
    country: 'Decentralized Cloud',
    address: 'Node #001 (Web3 / Global RPC Cluster)',
    city: 'Decentralized Protocol',
    phone: 'Protocol VOIP / Discord SIP',
    email: 'protocol@fingermobile.org',
    isHeadquarters: false,
    isVirtual: true,
    hours: '24/7/365 Autonomous Protocol Uptime',
    amenities: [
      'Virtual Reality Conference Auditorium',
      'Automated Escrow & Instant Payout Engine',
      'On-Chain Multi-Signature Vault',
      'Zero-Latency Global CDN Edge Relay'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    licenseNumber: 'PROTOCOL-RPC-HASH-9941F'
  }
];

export const BusinessOfficesPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [selectedOffice, setSelectedOffice] = useState<CorporateOffice | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingPurpose, setBookingPurpose] = useState('Creator Studio Session');
  const [attendeeCount, setAttendeeCount] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const regionTabs = ['All', 'Nigeria', 'North America', 'Europe & UK', 'Pan-Africa', 'Metaverse'];

  const filteredOffices = useMemo(() => {
    return CORPORATE_OFFICES.filter((office) => {
      const matchesRegion =
        selectedRegion === 'All' || office.region === selectedRegion;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        office.name.toLowerCase().includes(q) ||
        office.city.toLowerCase().includes(q) ||
        office.country.toLowerCase().includes(q) ||
        office.address.toLowerCase().includes(q) ||
        office.amenities.some((a) => a.toLowerCase().includes(q));
      return matchesRegion && matchesSearch;
    });
  }, [selectedRegion, searchQuery]);

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingEmail || !bookingDate) {
      showToast('Please fill in all booking fields', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(
        `Appointment confirmed for ${bookingName} at ${selectedOffice?.name}! Check ${bookingEmail} for your VIP Security Pass.`,
        'success'
      );
      setSelectedOffice(null);
      setBookingName('');
      setBookingEmail('');
      setBookingDate('');
      setAttendeeCount('1');
    }, 600);
  };

  return (
    <MainLayout pageTitle="Business Offices & Global Locations">
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30">
                  <Building2 className="w-7 h-7 text-amber-400" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                  Corporate Offices & Global Network Hubs
                </h1>
              </div>
              <p className="text-sm text-slate-400 max-w-2xl">
                FingerMobile Protocol operates sovereign governance centers, broadcast studios, and decentralized metaverse terminals spanning Nigeria, the United States, the United Kingdom, Ghana, Kenya, South Africa, and the global Web3 ecosystem.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400">Vault Balance: </span>
                <span className="font-mono font-bold text-amber-400">{ficBalance.toLocaleString()} FIC</span>
              </div>
            </div>
          </div>

          {/* Leadership & Corporate Governance */}
          <div className="p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
                Corporate Leadership & Sovereign Governance
              </h2>
              <p className="text-xs text-slate-400">
                Founders, executive directors, and communications leadership directing the global growth and statutory compliance of FingerMobile Protocol.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Leader 1: Mbah Israel Obinna */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/40 transition-all flex flex-col justify-between group shadow-lg">
                <div className="flex items-start gap-4">
                  <img
                    src="/assets/branding/mbah_israel_obinna.jpeg"
                    alt="Mbah Israel Obinna"
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-amber-400/40 shadow-md group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-bold text-amber-400 mb-1">
                      <BadgeCheck className="w-3 h-3 text-amber-400" />
                      FOUNDER & ARCHITECT
                    </div>
                    <h3 className="font-extrabold text-base text-white">Mbah Israel Obinna</h3>
                    <p className="text-xs text-amber-400 font-semibold mt-0.5">
                      Chief Executive Officer & Chief Technical Officer and Founder
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                  Senior Data Analyst, Intellectual Property Owner, the Visionary, Framework Designer, Social Media Ideologist and Pioneer, specializing in customer behavior analysis, retention, and Cyber Security Framework engineering.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>ID: FM-FOUNDER-001</span>
                  <span className="text-amber-400 font-bold">STERCS™ Sovereign</span>
                </div>
              </div>

              {/* Leader 2: Mrs Eunice Emonena Mbah */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/40 transition-all flex flex-col justify-between group shadow-lg">
                <div className="flex items-start gap-4">
                  <img
                    src="/assets/branding/eunice_emonena_mbah.webp"
                    alt="Mrs Eunice Emonena Mbah"
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-amber-400/40 shadow-md group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-[10px] font-bold text-emerald-400 mb-1">
                      <BadgeCheck className="w-3 h-3 text-emerald-400" />
                      CO-FOUNDER
                    </div>
                    <h3 className="font-extrabold text-base text-white">Mrs Eunice Emonena Mbah</h3>
                    <p className="text-xs text-amber-400 font-semibold mt-0.5">
                      Group Company Secretary & Co Founder
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                  Corporate Governance & Statutory Compliance Lead, managing institutional registry, stakeholder alignment, regulatory filings across CAC Nigeria, UK Companies House, and global entity charters.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>ID: FM-COFOUNDER-002</span>
                  <span className="text-emerald-400 font-bold">Statutory Governance</span>
                </div>
              </div>

              {/* Leader 3: Mercy Kulem */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/40 transition-all flex flex-col justify-between group shadow-lg">
                <div className="flex items-start gap-4">
                  <img
                    src="/assets/branding/mercy_kulem.webp"
                    alt="Mercy Kulem"
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-amber-400/40 shadow-md group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-400/10 border border-purple-400/30 text-[10px] font-bold text-purple-400 mb-1">
                      <BadgeCheck className="w-3 h-3 text-purple-400" />
                      EXECUTIVE LEAD
                    </div>
                    <h3 className="font-extrabold text-base text-white">Mercy Kulem</h3>
                    <p className="text-xs text-amber-400 font-semibold mt-0.5">
                      Group Communications Marketing Head
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                  Head of Group Communications & Global Brand Marketing, spearheading institutional narrative, creator acquisition, public relations, omnichannel campaign strategies, and brand equity.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>ID: FM-EXEC-003</span>
                  <span className="text-purple-400 font-bold">Omnichannel Comms</span>
                </div>
              </div>
            </div>

            {/* Corporate Registration Badges */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                <span>CAC Nigeria Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                <span>Delaware Corp Entity #92810</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                <span>UK Companies House Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                <span>FinCEN & AML Compliant</span>
              </div>
            </div>
          </div>

          {/* Core Sovereign Brand Ecosystem (BeatWaveNg, Dancia-4Tv, Infinite Coin, Lush Pressies) */}
          <div className="p-6 md:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  Core Sovereign Brand Ecosystem
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Decentralized multi-role entertainment, broadcasting, tokenomics, and matchmaking verticals powered by FingerMobile Protocol.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-400">
                <span>4 Core Protocols</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Brand 1: BeatWaveNg */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between group shadow-lg">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 p-2 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                    <img
                      src="/assets/logos/beatwaveng_logo.png"
                      alt="BeatWaveNg"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-extrabold text-base text-white">BeatWaveNg</h3>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    Audio & Live Beats Broadcast
                  </p>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    Sovereign music streaming, live internet radio stations, DJ mixtape distribution, genre aggregators, and professional master studio equalizers.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-900">
                  <a
                    href="/beatwave-ng"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
                  >
                    <span>Launch BeatWaveNg</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

              {/* Brand 2: Dancia-4Tv */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between group shadow-lg">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 p-2 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                    <img
                      src="/assets/logos/dancia4tv_logo.png"
                      alt="Dancia-4Tv"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-extrabold text-base text-white">Dancia-4Tv</h3>
                  <p className="text-[11px] text-blue-400 font-semibold mt-0.5">
                    4K Television & Visual Reels
                  </p>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    High-definition broadcast television network, cultural choreography, creator video reels, interactive studio showcases, and livestreams.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-900">
                  <a
                    href="/dancia-tv"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    <span>Tune into Dancia-4Tv</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

              {/* Brand 3: Infinite Coin */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-lg">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 p-2 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                    <img
                      src="/assets/logos/fic_logo.png"
                      alt="Infinite Coin (FIC)"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-extrabold text-base text-white">Infinite Coin (FIC)</h3>
                  <p className="text-[11px] text-amber-400 font-semibold mt-0.5">
                    Sovereign Protocol Currency
                  </p>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    Cryptographic utility coin powering on-chain and off-chain settlements, peer-to-peer tipping, corporate vaults, and marketplace liquidation.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-900">
                  <a
                    href="/wallet"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline"
                  >
                    <span>Open FIC Vault</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

              {/* Brand 4: Lush Pressies */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-pink-500/50 transition-all flex flex-col justify-between group shadow-lg">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 p-2 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                    <img
                      src="/assets/logos/lushpressies_logo.png"
                      alt="Lush Pressies"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-extrabold text-base text-white">Lush Pressies</h3>
                  <p className="text-[11px] text-pink-400 font-semibold mt-0.5">
                    Matchmaking & Luxury Plushies
                  </p>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    Empathetic social connection, consensual 6-digit PIN handshake verification, Lapidaire icebreaker Q&A, and plushies gift exchanges.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-900">
                  <a
                    href="/lush-pressies"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 hover:text-pink-300 hover:underline"
                  >
                    <span>Enter Lush Pressies</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                {regionTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSelectedRegion(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedRegion === tab
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search city, country, or facility..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Offices Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Office Directory & Sovereign Facilities ({filteredOffices.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredOffices.map((office) => (
                <div
                  key={office.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={office.imageUrl}
                      alt={office.name}
                      className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {office.isHeadquarters && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-md">
                          HEADQUARTERS
                        </span>
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          office.isVirtual
                            ? 'bg-purple-900/80 text-purple-200 border border-purple-700'
                            : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                        }`}
                      >
                        {office.isVirtual ? 'VIRTUAL NODE' : 'PHYSICAL CENTER'}
                      </span>
                    </div>

                    {office.licenseNumber && (
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-sm border border-slate-800 text-[10px] font-mono text-slate-300">
                        {office.licenseNumber}
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{office.name}</h3>
                      <p className="text-xs text-amber-400 font-semibold mt-0.5">
                        {office.city}, {office.country}
                      </p>

                      <div className="mt-4 space-y-2 text-xs text-slate-300">
                        <p className="flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                          <span>{office.address}, {office.city}</span>
                        </p>
                        <p className="flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <a href={`tel:${office.phone}`} className="hover:text-amber-300 transition-colors">
                            {office.phone}
                          </a>
                        </p>
                        <p className="flex items-center gap-2.5">
                          <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <a href={`mailto:${office.email}`} className="text-blue-400 hover:underline">
                            {office.email}
                          </a>
                        </p>
                        <p className="flex items-center gap-2.5">
                          <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <span>{office.hours}</span>
                        </p>
                      </div>

                      {/* Amenities */}
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Facilities & Services
                        </p>
                        <ul className="space-y-1.5">
                          {office.amenities.map((amenity, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                              <span>{amenity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedOffice(office)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Schedule Visit / Access
                      </button>
                      <a
                        href={`mailto:${office.email}?subject=Inquiry for ${office.name}`}
                        className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Inquire
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Modal */}
          {selectedOffice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
                <button
                  type="button"
                  onClick={() => setSelectedOffice(null)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-amber-400" />
                  <div>
                    <h3 className="font-bold text-lg text-white">Schedule an Office Visit</h3>
                    <p className="text-xs text-slate-400">{selectedOffice.name}</p>
                  </div>
                </div>

                <form onSubmit={handleBookVisit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@company.com"
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Attendees</label>
                      <div className="relative">
                        <Users className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <select
                          value={attendeeCount}
                          onChange={(e) => setAttendeeCount(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none"
                        >
                          <option value="1">1 Person (Solo VIP)</option>
                          <option value="2-3">2-3 Delegation</option>
                          <option value="4-10">4-10 Team Group</option>
                          <option value="10+">10+ Corporate Group</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Purpose of Visit</label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={bookingPurpose}
                        onChange={(e) => setBookingPurpose(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none"
                      >
                        <option value="Creator Studio Session">Studio Recording (Dancia-4Tv / BeatwaveNG)</option>
                        <option value="Franchise Consultation">Franchise & Regional Partner Meeting</option>
                        <option value="Legal & Verification">Identity Verification & Entity Filings</option>
                        <option value="Enterprise Protocol Consultation">Enterprise Protocol & Liquidity Consultation</option>
                        <option value="Tour">Facility & SOC Operations Tour</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedOffice(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BusinessOfficesPage;
