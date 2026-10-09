/*
 * FingerMobile Protocol™ - Sovereign Franchise Network & Operations
 * Regional Licensing, Operational Terminals, Smart Payouts & Expansion Portal
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import {
  BuildingStorefrontIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  PlusIcon,
  ArrowPathIcon,
  XMarkIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon
} from '../icons';

export interface FranchiseEntity {
  id: string;
  name: string;
  operatingLicenseNo: string;
  tier: 'Flagship Premium' | 'Standard Metro' | 'Regional Affiliate';
  region: string;
  city: string;
  address: string;
  activeTerminals: number;
  revenueSharePercentage: number;
  grossVolumeFic: number;
  netPayoutFic: number;
  contactEmail: string;
  contactPhone: string;
  status: 'active' | 'pending_audit' | 'onboarding';
  foundedYear: number;
}

const DEFAULT_FRANCHISES: FranchiseEntity[] = [
  {
    id: 'fr-001',
    name: 'GraceLink Urban Hub Lagos',
    operatingLicenseNo: 'GLBT-NG-2026-081',
    tier: 'Flagship Premium',
    region: 'South West Nigeria',
    city: 'Lagos',
    address: 'Plot 14 Victoria Island Financial Crescent, Lagos',
    activeTerminals: 6,
    revenueSharePercentage: 15.0,
    grossVolumeFic: 245000,
    netPayoutFic: 36750,
    contactEmail: 'lagos.hub@fingermobile.org',
    contactPhone: '+234 1 234 5678',
    status: 'active',
    foundedYear: 2024
  },
  {
    id: 'fr-002',
    name: 'FingerMobile Abuja Creative Center',
    operatingLicenseNo: 'GLBT-NG-2026-094',
    tier: 'Standard Metro',
    region: 'Federal Capital Territory',
    city: 'Abuja',
    address: 'Plot 1042 Central Business District, Towers II, Abuja',
    activeTerminals: 4,
    revenueSharePercentage: 12.5,
    grossVolumeFic: 168000,
    netPayoutFic: 21000,
    contactEmail: 'abuja.center@fingermobile.org',
    contactPhone: '+234 9 876 5432',
    status: 'active',
    foundedYear: 2025
  },
  {
    id: 'fr-003',
    name: 'Port Harcourt Digital Lounge',
    operatingLicenseNo: 'GLBT-NG-2026-112',
    tier: 'Regional Affiliate',
    region: 'South South Nigeria',
    city: 'Port Harcourt',
    address: '42 Trans-Amadi Industrial Layout, Port Harcourt',
    activeTerminals: 2,
    revenueSharePercentage: 10.0,
    grossVolumeFic: 94000,
    netPayoutFic: 9400,
    contactEmail: 'ph.lounge@fingermobile.org',
    contactPhone: '+234 84 123 456',
    status: 'active',
    foundedYear: 2025
  },
  {
    id: 'fr-004',
    name: 'London Canary Wharf Media Node',
    operatingLicenseNo: 'GLBT-UK-2026-018',
    tier: 'Flagship Premium',
    region: 'Greater London, United Kingdom',
    city: 'London',
    address: '1 Canada Square, Level 28, Canary Wharf, London E14 5AA',
    activeTerminals: 5,
    revenueSharePercentage: 15.0,
    grossVolumeFic: 320000,
    netPayoutFic: 48000,
    contactEmail: 'london.node@fingermobile.org',
    contactPhone: '+44 20 7946 0912',
    status: 'active',
    foundedYear: 2025
  },
  {
    id: 'fr-005',
    name: 'Richmond Innovation Terminal (USA)',
    operatingLicenseNo: 'GLBT-US-2026-004',
    tier: 'Flagship Premium',
    region: 'Texas, United States',
    city: 'Richmond',
    address: 'Grand Parkway Tech Center, Suite 400, Richmond, TX 77406',
    activeTerminals: 4,
    revenueSharePercentage: 15.0,
    grossVolumeFic: 280000,
    netPayoutFic: 42000,
    contactEmail: 'richmond.terminal@fingermobile.org',
    contactPhone: '+1 832 555 0198',
    status: 'active',
    foundedYear: 2025
  }
];

const FranchisePage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();

  const [franchises, setFranchises] = useState<FranchiseEntity[]>(DEFAULT_FRANCHISES);
  const [activeTab, setActiveTab] = useState<'network' | 'tiers' | 'payouts' | 'apply'>('network');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [inspectingFranchise, setInspectingFranchise] = useState<FranchiseEntity | null>(null);

  // Application Wizard Form State
  const [applyForm, setApplyForm] = useState({
    legalEntityName: '',
    registrationNo: '',
    regionCity: '',
    proposedAddress: '',
    tier: 'Standard Metro',
    terminalsCount: 2,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    stakedFicDeposit: 500
  });
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [appSuccessData, setAppSuccessData] = useState<{
    trackingId: string;
    entityName: string;
    tier: string;
  } | null>(null);

  // Aggregated Operational Totals
  const totalGrossFic = franchises.reduce((acc, f) => acc + f.grossVolumeFic, 0);
  const totalNetPayoutsFic = franchises.reduce((acc, f) => acc + f.netPayoutFic, 0);
  const totalTerminals = franchises.reduce((acc, f) => acc + f.activeTerminals, 0);

  const filteredFranchises = franchises.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.operatingLicenseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || f.city === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.legalEntityName || !applyForm.registrationNo || !applyForm.regionCity) {
      showToast('Please fill all mandatory corporate registration fields', 'error');
      return;
    }

    try {
      setIsSubmittingApp(true);
      await new Promise((res) => setTimeout(res, 1000));

      const trackingId = `FM-FR-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`;
      const newFranchise: FranchiseEntity = {
        id: `fr-new-${Date.now()}`,
        name: applyForm.legalEntityName,
        operatingLicenseNo: `GLBT-PROV-${Math.floor(100 + Math.random() * 900)}`,
        tier: applyForm.tier as any,
        region: applyForm.regionCity,
        city: applyForm.regionCity.split(',')[0].trim(),
        address: applyForm.proposedAddress || 'Under Sovereign Provisioning',
        activeTerminals: applyForm.terminalsCount,
        revenueSharePercentage: applyForm.tier === 'Flagship Premium' ? 15.0 : applyForm.tier === 'Standard Metro' ? 12.5 : 10.0,
        grossVolumeFic: 0,
        netPayoutFic: 0,
        contactEmail: applyForm.contactEmail,
        contactPhone: applyForm.contactPhone,
        status: 'onboarding',
        foundedYear: 2026
      };

      setFranchises([newFranchise, ...franchises]);
      setAppSuccessData({
        trackingId,
        entityName: applyForm.legalEntityName,
        tier: applyForm.tier
      });
      showToast(`Franchise application recorded! Tracking ID: ${trackingId}`, 'success');
    } catch {
      showToast('Failed to record franchise application', 'error');
    } finally {
      setIsSubmittingApp(false);
    }
  };

  return (
    <MainLayout pageTitle="Franchise Operations">
      <div className="min-h-screen bg-slate-50 text-gray-900 pb-16">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-indigo-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-purple-900/40">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-3 border border-purple-500/30">
                <BuildingStorefrontIcon className="w-4 h-4 text-purple-400" />
                Sovereign Commercial Hubs & Regional Infrastructure
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Global Franchise Network
              </h1>
              <p className="mt-2 text-purple-200 text-sm max-w-2xl">
                Operate high-traffic physical & virtual FingerMobile terminals, verify creator commerce, and participate in automated 10.0% – 15.0% platform revenue share.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('apply')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl text-sm font-bold shadow-xl shadow-purple-600/30 flex items-center gap-2 transition-transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5" />
              Apply for Territory License
            </button>
          </div>
        </div>

        {/* Global Operational Metrics Deck */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-md flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <BuildingStorefrontIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Licensed Entities</p>
                <p className="text-2xl font-black text-gray-900 mt-0.5">{franchises.length} Hubs</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-md flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <MapPinIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Terminals</p>
                <p className="text-2xl font-black text-gray-900 mt-0.5">{totalTerminals} Units</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-md flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CurrencyDollarIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Network Gross Volume</p>
                <p className="text-2xl font-black text-gray-900 mt-0.5">{totalGrossFic.toLocaleString()} FIC</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-md flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Settled Smart Payouts</p>
                <p className="text-2xl font-black text-amber-600 mt-0.5">{totalNetPayoutsFic.toLocaleString()} FIC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex border-b border-gray-200 gap-6">
            <button
              onClick={() => setActiveTab('network')}
              className={`pb-3.5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'network'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <BuildingStorefrontIcon className="w-4 h-4" />
              Franchise Entities ({filteredFranchises.length})
            </button>
            <button
              onClick={() => setActiveTab('tiers')}
              className={`pb-3.5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'tiers'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <ChartBarIcon className="w-4 h-4" />
              Licensing Tiers & Economics
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`pb-3.5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'payouts'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <CurrencyDollarIcon className="w-4 h-4" />
              Smart Payouts Ledger
            </button>
            <button
              onClick={() => setActiveTab('apply')}
              className={`pb-3.5 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'apply'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <DocumentTextIcon className="w-4 h-4" />
              Application Wizard
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Tab 1: Network Directory */}
          {activeTab === 'network' && (
            <div className="space-y-6">
              {/* Filter Toolbar */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    placeholder="Search by name, license # or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                  {['all', 'Lagos', 'Abuja', 'Port Harcourt', 'London', 'Richmond'].map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedRegion(city)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                        selectedRegion === city
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {city === 'all' ? 'All Locations' : city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Franchise Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFranchises.map((f) => (
                  <div
                    key={f.id}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
                          {f.tier}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full ${
                          f.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          <CheckCircleIcon className="w-3.5 h-3.5" />
                          {f.status === 'active' ? 'Operational' : 'Onboarding'}
                        </span>
                      </div>

                      <h3 className="font-black text-gray-900 text-lg leading-snug">{f.name}</h3>
                      <p className="text-xs font-mono text-gray-500 mt-1">License: {f.operatingLicenseNo}</p>

                      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{f.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span>{f.contactPhone}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100 text-center">
                        <div className="p-2 bg-gray-50 rounded-xl">
                          <span className="text-[10px] text-gray-400 block font-bold">Terminals</span>
                          <span className="text-sm font-black text-gray-900">{f.activeTerminals}</span>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-xl">
                          <span className="text-[10px] text-gray-400 block font-bold">Rev Share</span>
                          <span className="text-sm font-black text-purple-700">{f.revenueSharePercentage}%</span>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-xl">
                          <span className="text-[10px] text-gray-400 block font-bold">Net Payout</span>
                          <span className="text-sm font-black text-emerald-700">{f.netPayoutFic.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-gray-100 flex gap-2">
                      <button
                        onClick={() => setInspectingFranchise(f)}
                        className="flex-1 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors"
                      >
                        Inspect Hub
                      </button>
                      <button
                        onClick={() => showToast(`Initiating operational audit for ${f.operatingLicenseNo}`, 'info')}
                        className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600"
                        title="Audit Terminal"
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Licensing Tiers & Economics */}
          {activeTab === 'tiers' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Regional Affiliate Lounge',
                  share: '10.0%',
                  deposit: '250 FIC (₦250,000)',
                  terminals: '1 Active Physical Terminal',
                  features: [
                    'Sovereign POS Hardware Terminal',
                    'PhotoCredits Local Creator Vetting',
                    'Direct FIC Cash-In & Cash-Out Desk',
                    'Standard Operational Dashboard',
                    'Monthly Smart Settlement'
                  ]
                },
                {
                  name: 'Standard Metro Center',
                  share: '12.5%',
                  deposit: '500 FIC (₦500,000)',
                  terminals: '2 – 4 Co-Branded Terminals',
                  recommended: true,
                  features: [
                    'Multi-Terminal Hardware Pods',
                    'Exclusive 5km Territorial Rights',
                    'Priority Dancia-4Tv Livestream Node',
                    'BeatwaveNG Creator Audio Studio Rights',
                    'Bi-Weekly Smart Settlement',
                    'Official Co-Marketing & Advertising Pack'
                  ]
                },
                {
                  name: 'Flagship Premium Hub',
                  share: '15.0%',
                  deposit: '1,200 FIC (₦1,200,000)',
                  terminals: '5+ Full Suite Terminals',
                  features: [
                    'Metropolitan Exclusive Territory',
                    'Full Mii™ Hologram Showcase Rig',
                    'Canary Ads Regional Revenue Share',
                    'Dedicated Sovereign Node Host Server',
                    'Real-Time Instant Smart Settlement',
                    'Executive Board Governance Representation'
                  ]
                }
              ].map((tier, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-sm flex flex-col justify-between ${
                    tier.recommended
                      ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-xl'
                      : 'border-gray-200'
                  }`}
                >
                  <div>
                    {tier.recommended && (
                      <span className="px-3 py-1 bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full inline-block mb-3">
                        Most Popular Tier
                      </span>
                    )}
                    <h3 className="text-xl font-black text-gray-900">{tier.name}</h3>
                    <div className="mt-4 mb-6">
                      <span className="text-4xl font-black text-purple-700">{tier.share}</span>
                      <span className="text-xs text-gray-500 block mt-1">Platform Net Revenue Share</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-6 text-xs space-y-1">
                      <p className="text-gray-500">Security Deposit: <strong className="text-gray-900">{tier.deposit}</strong></p>
                      <p className="text-gray-500">Hardware Allocation: <strong className="text-gray-900">{tier.terminals}</strong></p>
                    </div>

                    <div className="space-y-3">
                      {tier.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-700">
                          <CheckCircleIcon className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setApplyForm({ ...applyForm, tier: tier.name });
                      setActiveTab('apply');
                    }}
                    className={`mt-8 w-full py-3 rounded-xl text-xs font-bold transition-all ${
                      tier.recommended
                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    Select {tier.name}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Smart Payouts Ledger */}
          {activeTab === 'payouts' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-gray-900 text-base">Smart Payouts Settlement Ledger</h3>
                  <p className="text-xs text-gray-500">Automated blockchain smart settlements executed for licensed nodes</p>
                </div>
                <button
                  onClick={() => showToast('Ledger synced with Sovereign Contract Node', 'success')}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowPathIcon className="w-3.5 h-3.5" />
                  Sync On-Chain
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <th className="py-3 px-5">Franchise Node</th>
                      <th className="py-3 px-5">Territory</th>
                      <th className="py-3 px-5">License Number</th>
                      <th className="py-3 px-5">Gross Volume</th>
                      <th className="py-3 px-5">Share %</th>
                      <th className="py-3 px-5">Net Payout</th>
                      <th className="py-3 px-5">Settlement Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {franchises.map((f) => (
                      <tr key={f.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="py-4 px-5 font-bold text-gray-900">{f.name}</td>
                        <td className="py-4 px-5 text-gray-600">{f.city}, {f.region}</td>
                        <td className="py-4 px-5 font-mono text-gray-500">{f.operatingLicenseNo}</td>
                        <td className="py-4 px-5 font-semibold text-gray-800">{f.grossVolumeFic.toLocaleString()} FIC</td>
                        <td className="py-4 px-5 font-bold text-purple-700">{f.revenueSharePercentage}%</td>
                        <td className="py-4 px-5 font-black text-emerald-700">{f.netPayoutFic.toLocaleString()} FIC</td>
                        <td className="py-4 px-5">
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                            Settled On-Chain
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Application Wizard */}
          {activeTab === 'apply' && (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8">
              <div className="mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-black text-gray-900">Franchise Territory Application</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Submit your corporate entity credentials for sovereign node validation and hardware deployment.
                </p>
              </div>

              {appSuccessData ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-black text-gray-900">Application Submitted!</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Your franchise application for <strong>{appSuccessData.entityName}</strong> has been logged.
                  </p>
                  <div className="my-6 p-4 bg-slate-900 rounded-2xl text-left font-mono text-xs text-emerald-400 space-y-1">
                    <p className="text-gray-400 text-[10px]">APPLICATION RECEIPT</p>
                    <p>TRACKING_ID: {appSuccessData.trackingId}</p>
                    <p>TIER: {appSuccessData.tier}</p>
                    <p>STATUS: PROVISIONING_KYC_VERIFICATION</p>
                    <p>ESTIMATED_AUDIT: 48 HOURS</p>
                  </div>
                  <button
                    onClick={() => {
                      setAppSuccessData(null);
                      setActiveTab('network');
                    }}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
                  >
                    View in Network Directory
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Corporate Entity Legal Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Meridian Digital Ventures Ltd"
                      value={applyForm.legalEntityName}
                      onChange={(e) => setApplyForm({ ...applyForm, legalEntityName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CAC / Delaware / UK Reg. No.</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. RC-1849204"
                        value={applyForm.registrationNo}
                        onChange={(e) => setApplyForm({ ...applyForm, registrationNo: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Proposed Territory / City</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lekki Phase 1, Lagos"
                        value={applyForm.regionCity}
                        onChange={(e) => setApplyForm({ ...applyForm, regionCity: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Facility Physical Address</label>
                    <input
                      type="text"
                      placeholder="Street address of proposed commercial terminal location..."
                      value={applyForm.proposedAddress}
                      onChange={(e) => setApplyForm({ ...applyForm, proposedAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Licensing Tier</label>
                      <select
                        value={applyForm.tier}
                        onChange={(e) => setApplyForm({ ...applyForm, tier: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      >
                        <option value="Regional Affiliate">Regional Affiliate (10.0%)</option>
                        <option value="Standard Metro">Standard Metro (12.5%)</option>
                        <option value="Flagship Premium">Flagship Premium (15.0%)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Allocated Terminals</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={applyForm.terminalsCount}
                        onChange={(e) => setApplyForm({ ...applyForm, terminalsCount: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Email</label>
                      <input
                        type="email"
                        required
                        placeholder="ops@company.com"
                        value={applyForm.contactEmail}
                        onChange={(e) => setApplyForm({ ...applyForm, contactEmail: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        required
                        placeholder="+234 801 234 5678"
                        value={applyForm.contactPhone}
                        onChange={(e) => setApplyForm({ ...applyForm, contactPhone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-100 flex justify-between items-center text-xs text-purple-900">
                    <span>Available Escrow Balance: <strong>{ficBalance.toFixed(2)} FIC</strong></span>
                    <span className="font-semibold text-purple-700">Protected Legal Stake</span>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={isSubmittingApp}
                      className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                    >
                      {isSubmittingApp ? (
                        'Validating Corporate Entity...'
                      ) : (
                        <>
                          <CheckCircleIcon className="w-5 h-5" />
                          Submit Sovereign Franchise Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal: Franchise Node Inspection */}
        {inspectingFranchise && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-50 text-purple-700">
                    {inspectingFranchise.tier}
                  </span>
                  <h3 className="text-xl font-black text-gray-900 mt-1">{inspectingFranchise.name}</h3>
                </div>
                <button
                  onClick={() => setInspectingFranchise(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Operating License:</span>
                    <span className="font-mono font-bold text-gray-900">{inspectingFranchise.operatingLicenseNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Territory / City:</span>
                    <span className="font-bold text-gray-900">{inspectingFranchise.city}, {inspectingFranchise.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Physical Address:</span>
                    <span className="font-semibold text-gray-800 text-right max-w-xs">{inspectingFranchise.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Founded:</span>
                    <span className="font-bold text-gray-900">{inspectingFranchise.foundedYear}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`mailto:${inspectingFranchise.contactEmail}`}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 flex items-center gap-2 text-xs font-bold text-gray-700"
                  >
                    <EnvelopeIcon className="w-4 h-4 text-purple-600" />
                    <span>Contact Operations</span>
                  </a>
                  <a
                    href={`tel:${inspectingFranchise.contactPhone}`}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 flex items-center gap-2 text-xs font-bold text-gray-700"
                  >
                    <PhoneIcon className="w-4 h-4 text-purple-600" />
                    <span>Direct Hotline</span>
                  </a>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setInspectingFranchise(null)}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
                  >
                    Close Inspection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FranchisePage;
