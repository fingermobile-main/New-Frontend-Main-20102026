import React, { useState } from 'react';
import {
  ShieldCheck,
  Crown,
  Lock,
  Mail,
  Phone,
  CheckCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  Scan,
  Globe2,
  Fingerprint,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { PLATFORM_OWNERSHIP, PlatformOwnerProfile } from '../../constants/platformOwnership';
import { LiveMotionFaceVerificationModal } from '../auth/LiveMotionFaceVerificationModal';

interface Props {
  compact?: boolean;
}

export const PlatformOwnershipCard: React.FC<Props> = ({ compact = false }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [activeBiometricModal, setActiveBiometricModal] = useState<{
    isOpen: boolean;
    targetIdentity: 'FOUNDER' | 'COFOUNDER';
    ownerName: string;
    nin: string;
  } | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleLaunchBiometric = (target: 'FOUNDER' | 'COFOUNDER') => {
    const owner = target === 'FOUNDER' ? PLATFORM_OWNERSHIP.founder : PLATFORM_OWNERSHIP.coFounder;
    setActiveBiometricModal({
      isOpen: true,
      targetIdentity: target,
      ownerName: owner.name,
      nin: owner.meansOfIdentification.number
    });
  };

  const renderOwnerCard = (owner: PlatformOwnerProfile, isRoot: boolean) => {
    return (
      <div
        key={owner.id}
        className={`relative overflow-hidden rounded-2xl p-6 border transition-all shadow-2xl ${
          isRoot
            ? 'bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-900 border-amber-500/50 shadow-amber-500/10'
            : 'bg-gradient-to-br from-purple-950/40 via-slate-950 to-slate-900 border-purple-500/50 shadow-purple-500/10'
        }`}
      >
        {/* Top Badges & Seal */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg ${
                isRoot
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-amber-500/30'
                  : 'bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-purple-500/30'
              }`}
            >
              {isRoot ? '👑' : '⭐'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Name explicitly in bold white font */}
                <h3 className="text-xl font-black text-white tracking-tight drop-shadow-sm">
                  {owner.name}
                </h3>
                <span
                  className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold border shadow-sm ${
                    isRoot
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                      : 'bg-purple-500/20 text-purple-200 border-purple-400/50'
                  }`}
                >
                  {owner.title}
                </span>
              </div>
              <p className="text-xs text-white font-semibold mt-0.5 flex items-center gap-1.5 opacity-90">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
                {owner.roleBadge}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ROOT MASTER SEAL</span>
          </div>
        </div>

        {/* Roles Breakdown Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {owner.roles.map((r) => (
            <span
              key={r}
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-white shadow-xs"
            >
              ✓ {r}
            </span>
          ))}
        </div>

        {/* Access Level Description */}
        <div className="mb-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs shadow-inner">
          <div className="flex items-center gap-2 font-bold text-white mb-1">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Master Dashboard & STERCS Dashboard Authority:</span>
          </div>
          <p className="text-white text-xs leading-relaxed font-medium pl-6">
            {owner.accessLevelDescription}
          </p>
        </div>

        {/* Means of Identification & Biometry Verification Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Means of Identification (NIN) */}
          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                Means of Identification
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                NIN VERIFIED
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/90 border border-slate-700">
              <span className="text-sm font-black font-mono text-white tracking-wide">
                {owner.meansOfIdentification.formatted}
              </span>
              <button
                onClick={() => copyToClipboard(owner.meansOfIdentification.number, `${owner.id}-nin`)}
                className="text-slate-200 hover:text-white p-1 rounded transition-colors"
                title="Copy NIN"
              >
                {copiedKey === `${owner.id}-nin` ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Biometry (Live/Motion Facial ID) */}
          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Scan className="w-3.5 h-3.5 text-emerald-400" />
                Biometry Authentication
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                MOTION DETECT
              </span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/90 border border-slate-700">
              <span className="text-xs font-black font-mono text-white pl-1">
                {owner.biometry}
              </span>
              <button
                onClick={() => handleLaunchBiometric(isRoot ? 'FOUNDER' : 'COFOUNDER')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-[11px] shadow-sm transition-all"
                title="Scan Live Face"
              >
                <Scan className="w-3 h-3" />
                <span>Scan / Verify</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
          {/* Emails */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold mb-2.5">
              <Mail className="w-4 h-4 text-sky-400" />
              <span>Official Emails ({owner.emails.length}):</span>
            </div>
            <div className="space-y-1.5">
              {owner.emails.map((email, idx) => (
                <div
                  key={email}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/90 border border-slate-800/90 hover:bg-slate-800/80 transition-colors"
                >
                  <span className="font-mono text-white font-bold truncate max-w-[210px]" title={email}>
                    {email}
                    {email.toLowerCase() === owner.signinEmail.toLowerCase() && (
                      <span className="ml-1.5 text-[10px] text-amber-300 font-extrabold bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30">
                        (Sign-In Email)
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => copyToClipboard(email, `${owner.id}-email-${idx}`)}
                    className="text-slate-200 hover:text-white p-1 rounded transition-colors"
                    title="Copy Email"
                  >
                    {copiedKey === `${owner.id}-email-${idx}` ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Telephones */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold mb-2.5">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Direct Telephones ({owner.phones.length}):</span>
            </div>
            <div className="space-y-1.5">
              {owner.phones.map((phone, idx) => (
                <div
                  key={phone}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/90 border border-slate-800/90 hover:bg-slate-800/80 transition-colors"
                >
                  <span className="font-mono text-white font-bold">{phone}</span>
                  <button
                    onClick={() => copyToClipboard(phone, `${owner.id}-phone-${idx}`)}
                    className="text-slate-200 hover:text-white p-1 rounded transition-colors"
                    title="Copy Phone"
                  >
                    {copiedKey === `${owner.id}-phone-${idx}` ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Bar & Prominent Jurisdiction */}
        <div className="pt-3 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ACTIVE UNREVOKABLE ROOT CREDENTIAL
          </span>
          <span className="flex items-center gap-1.5 text-white font-black bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-700">
            <Globe2 className="w-4 h-4 text-emerald-400 inline" />
            <span>Jurisdiction: Nigeria (NG) & Global Sovereign Network.</span>
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-zinc-950 border-2 border-slate-700 p-6 shadow-2xl text-white">
        {/* Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-amber-500/20">
              🏛️
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-black text-white tracking-tight drop-shadow-sm">
                  FingerMobile Protocol — Platform Ownership & Master Control Authority
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-sm">
                  HARDCODED ROOT
                </span>
              </div>
              <p className="text-xs text-white font-medium opacity-90 mt-0.5">
                Official Executive Governance, Master Control & Dashboard Authority Configuration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Prominent Global Sovereign Jurisdiction Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs font-mono font-bold text-white shadow-sm">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <span>Jurisdiction: Nigeria (NG) & Global Sovereign Network.</span>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-white transition-colors shadow-sm"
            >
              <span>{isExpanded ? 'Collapse' : 'View Owners'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Global Jurisdiction Banner on Mobile */}
        <div className="sm:hidden mb-4 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs font-mono font-bold text-white flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Jurisdiction: Nigeria (NG) & Global Sovereign Network.</span>
        </div>

        {/* Open-Source Face SDK Notice */}
        <div className="mb-4 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Scan className="w-4 h-4 text-emerald-400" />
            <span>Biometric Engine Architecture:</span>
            <span className="font-mono text-emerald-300">
              3DiVi Face SDK • FacePlugin Liveness SDK • OpenFace Behavior Toolkit
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-200 font-semibold">
            Platform Dependencies Installed • Live/Motion Active
          </span>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {renderOwnerCard(PLATFORM_OWNERSHIP.founder, true)}
            {renderOwnerCard(PLATFORM_OWNERSHIP.coFounder, false)}
          </div>
        )}
      </div>

      {/* Live Motion Facial ID Verification Modal */}
      {activeBiometricModal && (
        <LiveMotionFaceVerificationModal
          isOpen={activeBiometricModal.isOpen}
          onClose={() => setActiveBiometricModal(null)}
          targetIdentity={activeBiometricModal.targetIdentity}
          ownerName={activeBiometricModal.ownerName}
          nin={activeBiometricModal.nin}
        />
      )}
    </>
  );
};

export default PlatformOwnershipCard;
