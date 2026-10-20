import React, { useState } from 'react';
import { CreatorTier, RegistrationStatus, AdmissionMode } from '../../types/creatorOnboarding';

export interface TierRowProps {
  countryCode: string;
  tier: CreatorTier;
  initialCapacity: number;
  initialActive: number;
  initialRegStatus: RegistrationStatus;
  initialAdmissionMode: AdmissionMode;
  onSave: (payload: {
    countryCode: string;
    tier: CreatorTier;
    maxCapacity: number;
    registrationStatus: RegistrationStatus;
    admissionMode: AdmissionMode;
  }) => Promise<void>;
}

export const SuperAdminTierRow: React.FC<TierRowProps> = ({
  countryCode,
  tier,
  initialCapacity,
  initialActive,
  initialRegStatus,
  initialAdmissionMode,
  onSave,
}) => {
  const [capacity, setCapacity] = useState(initialCapacity);
  const [regStatus, setRegStatus] = useState<RegistrationStatus>(initialRegStatus);
  const [admissionMode, setAdmissionMode] = useState<AdmissionMode>(initialAdmissionMode);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isCapacityInvalid = capacity < initialActive;

  const handleSave = async () => {
    if (isCapacityInvalid) return;
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await onSave({
        countryCode,
        tier,
        maxCapacity: capacity,
        registrationStatus: regStatus,
        admissionMode
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to update tier rule:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getTierBadge = () => {
    switch (tier) {
      case 'TIER_1':
        return <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40">Tier 1 (Elite)</span>;
      case 'TIER_2':
        return <span className="px-2 py-0.5 rounded text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">Tier 2 (Pro)</span>;
      case 'TIER_3':
        return <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40">Tier 3 (Micro)</span>;
      default:
        return tier;
    }
  };

  return (
    <tr className="border-b border-gray-700 bg-gray-900/60 text-white text-sm hover:bg-gray-800/40 transition">
      <td className="py-4 px-4 font-semibold">{getTierBadge()}</td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={capacity}
            min={initialActive}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className={`w-24 rounded border px-2 py-1 bg-gray-800 text-white ${
              isCapacityInvalid ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
          />
          <span className="text-gray-300 font-medium text-xs">/ {initialActive} active</span>
        </div>
        {isCapacityInvalid && (
          <span className="text-xs text-red-400 block mt-1">Cannot be lower than active count</span>
        )}
      </td>
      
      {/* Toggle 1: Registration Status */}
      <td className="py-4 px-4">
        <select
          value={regStatus}
          onChange={(e) => setRegStatus(e.target.value as RegistrationStatus)}
          className="bg-gray-800 border border-gray-600 rounded px-2.5 py-1 text-white text-xs focus:ring-1 focus:ring-blue-500 outline-none"
        >
          <option value="OPEN">Open</option>
          <option value="WAITLIST">Waitlist Only</option>
          <option value="CLOSED">Closed</option>
        </select>
      </td>

      {/* Toggle 2: Admission Mode */}
      <td className="py-4 px-4">
        <select
          value={admissionMode}
          onChange={(e) => setAdmissionMode(e.target.value as AdmissionMode)}
          className="bg-gray-800 border border-gray-600 rounded px-2.5 py-1 text-white text-xs focus:ring-1 focus:ring-blue-500 outline-none"
        >
          <option value="AUTO_ADMIT">Auto-Admit</option>
          <option value="MANUAL_APPROVAL">Manual Review</option>
          <option value="INVITE_ONLY">Invite / Token Only</option>
        </select>
      </td>

      <td className="py-4 px-4 text-right">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || isCapacityInvalid}
          className={`px-3.5 py-1.5 rounded text-xs font-medium transition cursor-pointer ${
            savedSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed text-white'
          }`}
        >
          {isSaving ? 'Saving...' : savedSuccess ? 'Saved ✓' : 'Update'}
        </button>
      </td>
    </tr>
  );
};

export default SuperAdminTierRow;
