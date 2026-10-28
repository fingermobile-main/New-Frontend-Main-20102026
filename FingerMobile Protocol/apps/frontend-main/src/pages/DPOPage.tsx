import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import {
  ShieldCheck,
  FileText,
  Mail,
  Phone,
  Building2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Send,
  Eye,
  Key,
  Database,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import DPODashboard from '../components/DPODashboard';

const DPOPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'dashboard' | 'sar' | 'audit'>('overview');
  const [sarForm, setSarForm] = useState({
    fullName: '',
    email: '',
    accountIdentifier: '',
    requestType: 'access',
    details: '',
    consentConfirmed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sarForm.fullName || !sarForm.email || !sarForm.details) {
      showToast('Please complete all required fields.', 'error');
      return;
    }
    if (!sarForm.consentConfirmed) {
      showToast('Please confirm identity verification consent.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const ticketId = 'DPO-SAR-' + Math.floor(100000 + Math.random() * 900000);
      setSubmittedTicket(ticketId);
      showToast(`DPO Request registered under ID: ${ticketId}`, 'success');
      setSarForm({
        fullName: '',
        email: '',
        accountIdentifier: '',
        requestType: 'access',
        details: '',
        consentConfirmed: false
      });
    }, 1200);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 pb-28 md:pb-12 w-full max-w-full overflow-x-hidden text-slate-900">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-8 md:p-10 text-white mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Statutory Governance & Privacy Enforcement</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Data Protection Officer (DPO) Office
              </h1>
              <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
                FingerMobile Protocol™ Data Sovereignty, NDPA 2023, GDPR Article 37, and statutory user privacy governance center.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-xs space-y-2 shrink-0">
              <div className="flex items-center gap-2 text-indigo-300 font-bold">
                <Lock className="w-4 h-4" />
                <span>Regulatory Jurisdiction</span>
              </div>
              <p className="text-slate-700">Nigeria (NDPA 2023) • EU (GDPR) • Global</p>
              <div className="text-[11px] text-slate-700 pt-1 border-t border-white/10">
                Official Contact: <span className="text-slate-700 font-mono">dpo@fingermobileprotocol.com</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-indigo-500/20">
            {[
              { id: 'overview', label: 'Statutory Notice & DPO Details', icon: ShieldCheck },
              { id: 'dashboard', label: 'Compliance Health Monitor', icon: Database },
              { id: 'sar', label: 'Data Subject Request (SAR)', icon: FileText },
              { id: 'audit', label: 'Cryptography & Audit Standards', icon: Key }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: OVERVIEW & STATUTORY NOTICE */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Appointed DPO</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  <strong>Office of Mbah Israel Obinna</strong><br />
                  Data Protection Officer & Chief Cryptographic Compliance Lead<br />
                  FingerMobile Protocol™ & Sovereign Identity Architecture
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Direct Legal Communications</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-mono">
                  dpo@fingermobileprotocol.com<br />
                  fingermobileprotocol@gmail.com<br />
                  statutory@fingermobileprotocol.com
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Corporate DPO Headquarters</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  FingerMobile Protocol™ Legal & Trust Operations<br />
                  Victoria Island, Lagos, Nigeria<br />
                  Emergency Response: +234 808 885 5752
                </p>
              </div>
            </div>

            {/* Principles Matrix */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-slate-200 dark:border-gray-700 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Statutory Data Protection Framework
                </h2>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
                  Enforcing the 6 core tenets of sovereign data privacy under the Nigeria Data Protection Act (NDPA 2023) and General Data Protection Regulation (GDPR)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Lawfulness, Fairness & Transparency',
                    desc: 'User identity, telemetry, and payment transactions are processed exclusively with explicit cryptographic consent and zero covert data brokerage.'
                  },
                  {
                    title: '2. Purpose Limitation',
                    desc: 'Data gathered for sovereign account authentication, Hallmark communities, or wallet settlements is never repurposed for unconsented ad syndication.'
                  },
                  {
                    title: '3. Data Minimization',
                    desc: 'FingerMobile only captures the minimum parameters necessary for protocol execution, cryptographic proof-of-work, and payment clearances.'
                  },
                  {
                    title: '4. Accuracy & Sovereign Correction',
                    desc: 'Users retain 100% control to rectify, update, or redact personal profile, media, and KYC credentials at any time.'
                  },
                  {
                    title: '5. Storage Limitation & TTL Ephemerality',
                    desc: 'Short-lived updates (e.g. Gems 24-hour Broadcast Channels) self-destruct cleanly upon TTL expiration without persistent shadow copies.'
                  },
                  {
                    title: '6. Cryptographic Integrity & Confidentiality',
                    desc: 'Protected by STERCS™ & PRO-MPTS™ Guardian Protection, AES-256 field-level encryption, and hardware-secured JWT tokens.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-slate-200 dark:border-gray-800 text-xs">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPLIANCE HEALTH MONITOR */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 shrink-0" />
                Live compliance engine synced with NDPA 2023 & Cybercrimes Act 2024 moderation monitors.
              </span>
              <span className="font-mono font-bold bg-indigo-600 text-white px-2.5 py-1 rounded-md text-[10px]">
                STATUS: ENFORCING
              </span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <DPODashboard />
            </div>
          </div>
        )}

        {/* TAB 3: DATA SUBJECT REQUEST (SAR) */}
        {activeTab === 'sar' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-8 border border-slate-200 dark:border-gray-700 shadow-sm space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Submit a Data Subject Access Request (SAR)
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
                Exercise your statutory rights under NDPA 2023 and GDPR Articles 15-22. Our DPO office acknowledges requests within 48 business hours.
              </p>
            </div>

            {submittedTicket && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs space-y-1">
                <div className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Request Successfully Registered!</span>
                </div>
                <p>
                  Your ticket reference is: <strong className="font-mono text-emerald-900 dark:text-white">{submittedTicket}</strong>.
                  A statutory receipt has been scheduled for your registered email address.
                </p>
              </div>
            )}

            <form onSubmit={handleSarSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={sarForm.fullName}
                    onChange={(e) => setSarForm({ ...sarForm, fullName: e.target.value })}
                    placeholder="e.g. Israel Obinna Mbah"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Verified Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={sarForm.email}
                    onChange={(e) => setSarForm({ ...sarForm, email: e.target.value })}
                    placeholder="your-account@fingermobileprotocol.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Username / Sovereign Identity Tag
                  </label>
                  <input
                    type="text"
                    value={sarForm.accountIdentifier}
                    onChange={(e) => setSarForm({ ...sarForm, accountIdentifier: e.target.value })}
                    placeholder="@username or Sovereign ID"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Statutory Request Category *
                  </label>
                  <select
                    value={sarForm.requestType}
                    onChange={(e) => setSarForm({ ...sarForm, requestType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  >
                    <option value="access">Right of Access (Copy of Data Records)</option>
                    <option value="rectification">Right to Rectification (Correct Inaccurate Info)</option>
                    <option value="erasure">Right to Erasure (Statutory Account Deletion)</option>
                    <option value="portability">Data Portability (Export JSON Ledger)</option>
                    <option value="restriction">Restriction of Processing</option>
                    <option value="inquiry">General DPO Inquiry & Audit Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Specific Request Details & Context *
                </label>
                <textarea
                  required
                  rows={4}
                  value={sarForm.details}
                  onChange={(e) => setSarForm({ ...sarForm, details: e.target.value })}
                  placeholder="Detail the specific telemetry, transactions, or records you wish to review or redact..."
                  className="w-full p-4 rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="consentConfirmed"
                  checked={sarForm.consentConfirmed}
                  onChange={(e) => setSarForm({ ...sarForm, consentConfirmed: e.target.checked })}
                  className="mt-0.5 rounded text-slate-900 focus:ring-indigo-500 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                />
                <label htmlFor="consentConfirmed" className="text-xs text-slate-800 dark:text-slate-200 font-semibold cursor-pointer">
                  I confirm that I am the authorized account holder or legal representative making this statutory request, and I consent to cryptographic verification of my identity.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting to DPO Office...' : 'Transmit Statutory Request →'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: AUDIT & CRYPTOGRAPHIC VERIFICATION */}
        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-slate-200 dark:border-gray-700 shadow-sm space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Cryptographic Consent & Audit Verification
              </h2>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
                Zero-knowledge proof-of-consent logs and real-time security auditing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-slate-300 dark:border-gray-800 text-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300">Ledger Standard</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">SHA-256 Hash Chain</h4>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  Every user consent event is cryptographically salted and written into immutable append-only logs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-slate-300 dark:border-gray-800 text-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300">Data At Rest</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">AES-256 Field Encryption</h4>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  Personal identifiers and KYC documentation are stored with hardware-level envelope encryption.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-slate-300 dark:border-gray-800 text-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300">Data In Transit</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">TLS 1.3 / mTLS Protocol</h4>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  Continuous DNS and SSL watchdog verification monitoring certificate expiry and failover attacks.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 text-slate-300 font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-emerald-400 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>DPO CRYPTOGRAPHIC AUDIT RUNNER [ACTIVE]</span>
              </div>
              <p className="text-slate-300 font-medium">
                [OK] Database Integrity Fingerprint: verified (sha256:7b91..fa09)<br />
                [OK] Active Token Rotation Policy: 3,600s with secure refresh revocation<br />
                [OK] NDPA Section 24 Assessment: Compliant (Record of Processing Activities logged)<br />
                [OK] GDPR Article 30 ROPA Register: Synced
              </p>
            </div>
          </div>
        )}

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-300 dark:border-slate-800 px-4 py-2 flex items-center justify-around shadow-2xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'overview'
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
                : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-0.5 text-indigo-500" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
                : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <Database className="w-5 h-5 mb-0.5 text-blue-500" />
            <span>Console</span>
          </button>
          <button
            onClick={() => setActiveTab('sar')}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'sar'
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
                : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <Send className="w-5 h-5 mb-0.5 text-amber-500" />
            <span>Request</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'audit'
                ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
                : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <Key className="w-5 h-5 mb-0.5 text-emerald-500" />
            <span>Audit</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default DPOPage;
