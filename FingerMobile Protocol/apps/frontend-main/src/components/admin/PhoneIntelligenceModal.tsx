import React, { useState, useEffect } from 'react';
import {
  Phone,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Radio,
  ExternalLink,
  RefreshCw,
  X,
  Search,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import apiService from '../../services/apiService';

export interface PhoneIntelligenceData {
  isValid: boolean;
  raw: string;
  e164: string;
  country: string | null;
  countryCallingCode: string | null;
  nationalNumber: string;
  lineType: string;
  carrier: string;
  isVoip: boolean;
  isDisposable: boolean;
  isTollFree: boolean;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendation: string;
  osintFootprints: Array<{
    engine: string;
    query: string;
    url: string;
  }>;
  phoneinfoga?: any;
  scannedAt?: string;
}

interface PhoneIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhone?: string;
  memberName?: string;
}

export const PhoneIntelligenceModal: React.FC<PhoneIntelligenceModalProps> = ({
  isOpen,
  onClose,
  initialPhone = '',
  memberName
}) => {
  const [phoneInput, setPhoneInput] = useState<string>(initialPhone);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<PhoneIntelligenceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runScan = async (targetPhone: string) => {
    if (!targetPhone || !targetPhone.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await apiService.post('/api/phone/scan', {
        phone: targetPhone.trim(),
        country: 'NG'
      });

      if (res && res.success && res.data) {
        setData(res.data);
      } else {
        setError(res?.message || 'Failed to scan phone intelligence');
      }
    } catch (err: any) {
      setError(err?.message || 'Error executing telephony reconnaissance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setPhoneInput(initialPhone);
      if (initialPhone) {
        runScan(initialPhone);
      } else {
        setData(null);
      }
    }
  }, [isOpen, initialPhone]);

  if (!isOpen) return null;

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'LOW':
        return 'bg-emerald-100 text-emerald-950 border border-emerald-400';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-950 border border-amber-400';
      case 'HIGH':
        return 'bg-orange-100 text-orange-950 border border-orange-400';
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-950 border border-rose-400';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Guardian AI • PhoneInfoga Telephony Reconnaissance
              </h3>
              <p className="text-xs text-slate-700 font-medium">
                {memberName ? `Member Target: @${memberName}` : 'Global Telecom & OSINT Footprint Engine'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-5 border-b border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runScan(phoneInput);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Enter telephone number (e.g. +234 803 123 4567 or 08031234567)..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !phoneInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Execute Scan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-950">Scan Diagnostic Alert</h4>
                <p className="text-xs text-rose-900 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
              <p className="text-sm font-bold text-slate-900">Querying Telecom Gateway & OSINT Indexes...</p>
              <p className="text-xs text-slate-700 font-medium">Running E.164 parsing, carrier detection, and digital footprints</p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Top Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-300">
                  <span className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">Format E.164</span>
                  <span className="text-sm font-black text-slate-900 font-mono mt-0.5 block truncate">{data.e164}</span>
                  <span className="text-[10px] text-emerald-800 font-bold block mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" /> Valid Syntax
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-300">
                  <span className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">Carrier Network</span>
                  <span className="text-xs font-black text-slate-900 mt-0.5 block truncate flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    {data.carrier}
                  </span>
                  <span className="text-[10px] text-slate-700 font-medium block mt-1">Country: {data.country || 'Global'}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-300">
                  <span className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">Line Type</span>
                  <span className="text-xs font-black text-slate-900 mt-0.5 block truncate">{data.lineType}</span>
                  <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${data.isVoip ? 'bg-orange-100 text-orange-950 border border-orange-400' : 'bg-emerald-100 text-emerald-950 border border-emerald-400'}`}>
                    {data.isVoip ? 'VOIP / Virtual' : 'Physical SIM'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-300">
                  <span className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">Risk Level</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-base font-black text-slate-900">{data.riskScore}%</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getRiskBadge(data.riskLevel)}`}>
                      {data.riskLevel}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-700 font-medium block mt-1 truncate">Rec: {data.recommendation}</span>
                </div>
              </div>

              {/* High Risk VOIP Warning Alert */}
              {data.isVoip && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">VOIP / Virtual Line Detected</h4>
                    <p className="text-xs text-amber-900 font-medium mt-0.5">
                      This telephone number is routed via a virtual VOIP carrier. Guardian AI policies recommend requiring secondary biometric hardware signatures for withdrawals and sensitive account changes.
                    </p>
                  </div>
                </div>
              )}

              {/* OSINT Footprint Dorks */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    OSINT Digital Footprints & Investigation Dorks
                  </h4>
                  <span className="text-[11px] font-bold text-slate-700">{data.osintFootprints.length} Scanners</span>
                </div>

                <div className="divide-y divide-slate-200 rounded-2xl border border-slate-300 bg-white overflow-hidden">
                  {data.osintFootprints.map((dork, i) => (
                    <div key={i} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{dork.engine}</span>
                        <code className="text-[10px] font-mono text-slate-700 block mt-0.5">{dork.query}</code>
                      </div>
                      <a
                        href={dork.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1 transition"
                      >
                        <span>Investigate</span>
                        <ExternalLink className="w-3 h-3 text-slate-600" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-600 space-y-2">
              <Phone className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-900">Ready to Scan</p>
              <p className="text-xs text-slate-700 font-medium max-w-sm mx-auto">
                Enter an international or national telephone number above to retrieve carrier data, VOIP detection, and digital footprints.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700 font-medium">
          <span className="flex items-center gap-1 text-slate-800 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            GDPR Article 6(1)(f) Fraud Prevention Compliant
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneIntelligenceModal;

