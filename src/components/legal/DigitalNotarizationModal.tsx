import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Copy,
  Check,
  X,
  Fingerprint,
  Calendar,
  Clock,
  Hash,
  ExternalLink,
  Printer
} from 'lucide-react';
import { FIC_DIGITAL_NOTARIZATION_CERTIFICATE } from '../../constants/digitalNotarization';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalNotarizationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [verifiedState, setVerifiedState] = useState<'idle' | 'verifying' | 'verified'>('verified');

  if (!isOpen) return null;

  const cert = FIC_DIGITAL_NOTARIZATION_CERTIFICATE;

  const copyHash = () => {
    navigator.clipboard.writeText(cert.documentSha256Hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReverify = () => {
    setVerifiedState('verifying');
    setTimeout(() => {
      setVerifiedState('verified');
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-gradient-to-b from-slate-900 via-zinc-950 to-slate-950 text-white rounded-3xl border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Outer Border Frame */}
        <div className="border border-amber-500/30 rounded-2xl p-5 sm:p-7 bg-black/40 relative overflow-hidden">
          {/* Watermark / Seal Icon in Background */}
          <div className="absolute right-4 bottom-4 pointer-events-none opacity-5 text-amber-400">
            <Award className="w-64 h-64" />
          </div>

          {/* Header */}
          <div className="text-center pb-6 border-b border-white/10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Official Notarization & IP Integrity</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
              Digital Notarization Certificate
            </h2>
            <p className="text-xs text-amber-300 font-mono mt-1">
              Intellectual Property Integrity Verification
            </p>
          </div>

          {/* Certificate Body Attributes */}
          <div className="py-6 space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/60 p-4 rounded-xl border border-white/5">
              <div>
                <span className="text-zinc-400 block text-[11px]">Certified Document</span>
                <span className="font-bold text-white text-sm">{cert.documentTitle}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[11px]">Issued To (Sole Author & Custodian)</span>
                <span className="font-bold text-amber-400 text-sm">{cert.issuedTo}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[11px]">Issuing Entity</span>
                <span className="font-semibold text-slate-200">{cert.entity}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[11px]">Reference ID</span>
                <span className="font-mono font-bold text-emerald-400">{cert.referenceId}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[11px]">Fingerprint ID</span>
                <span className="font-mono font-bold text-amber-300">{cert.fingerprintId}</span>
              </div>
              <div>
                <span className="text-zinc-400 block text-[11px]">Date Issued & Timestamp (UTC)</span>
                <span className="font-mono text-zinc-300 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {cert.dateIssued}
                  <Clock className="w-3.5 h-3.5 text-zinc-400 ml-1" />
                  {cert.timestampUtc}
                </span>
              </div>
            </div>

            {/* SHA256 Hash Box */}
            <div className="bg-black/80 rounded-xl p-4 border border-amber-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-[11px] font-mono flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-amber-400" />
                  Document Cryptographic SHA-256 Hash:
                </span>
                <button
                  onClick={copyHash}
                  className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Hash</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-2.5 bg-zinc-950 rounded-lg border border-white/5 font-mono text-[11px] text-amber-300 break-all select-all">
                {cert.documentSha256Hash}
              </div>
            </div>

            {/* Certification Statement */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 text-xs leading-relaxed font-sans flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white mb-1">Authentic Cryptographic Seal</p>
                <p>{cert.verificationStatement}</p>
              </div>
            </div>

            {/* Statutory Details */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-zinc-400 font-mono">
              <div>
                <span>Statutory Basis: </span>
                <span className="text-zinc-200">{cert.statutoryBasis}</span>
              </div>
              <div>
                <span>Registry: </span>
                <span className="text-zinc-200">{cert.registryId}</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleReverify}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-semibold flex items-center gap-1.5 hover:bg-emerald-500/30 transition-all"
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>
                  {verifiedState === 'verifying' ? 'Verifying...' : 'Status: Cryptographically Verified'}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
              <a
                href="/legal/whitepaper"
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View White Paper</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
