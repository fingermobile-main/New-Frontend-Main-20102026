import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import type { FeatureToggle } from '../../../types';
import { PuzzlePieceIcon } from '../../../components/icons';
import adminOperationsService from '../../../services/adminOperationsService';
import PlatformOwnershipCard from '../../../components/dashboard/PlatformOwnershipCard';

const defaultFallbackToggles: FeatureToggle[] = [
  {
    id: 'tropical_gifts',
    name: 'Tropical Fruit Gifts',
    description: 'Enable time-sensitive tropical fruit gifts (3pm - 12am daily) and holiday multipliers.',
    enabled: true,
    specialDays: ['2026-12-25', '2026-01-01', '2026-07-04']
  },
  {
    id: 'biometric_attestation',
    name: 'Biometric Enclave Proofs',
    description: 'Require hardware-rooted fingerprint enclave proofs for high-value FIC transfers.',
    enabled: true
  },
  {
    id: 'instant_fiat_settlement',
    name: 'Instant Fiat Payout Gateway',
    description: 'SEPA/FedNow instant liquidity channel for verified sovereign creators.',
    enabled: true
  },
  {
    id: 'guardian_threat_radar',
    name: 'GUARDIAN™ Autonomous Sentinel Radar',
    description: 'Real-time AI behavioral anomaly detection and automated circuit breaker triggers.',
    enabled: true
  }
];

const FeatureTogglesPage: React.FC = () => {
  const { featureToggles, setFeatureToggles, showToast } = useAppContext();
  const [localToggles, setLocalToggles] = useState<FeatureToggle[]>(defaultFallbackToggles);
  const [newSpecialDay, setNewSpecialDay] = useState('');
  const [saving, setSaving] = useState(false);

  const activeToggles = (featureToggles && featureToggles.length > 0) ? featureToggles : localToggles;

  useEffect(() => {
    const loadToggles = async () => {
      try {
        const settings = await adminOperationsService.getSettings();
        const toggleSetting = settings.find((s: any) => s.config_key === 'feature_toggles');
        if (toggleSetting && toggleSetting.config_value) {
          const val = typeof toggleSetting.config_value === 'string'
            ? JSON.parse(toggleSetting.config_value)
            : toggleSetting.config_value;
          if (Array.isArray(val) && setFeatureToggles) {
            setFeatureToggles(val);
          }
        }
      } catch (err) {
        console.warn('Could not load feature toggles from backend, using fallbacks:', err);
      }
    };
    loadToggles();
  }, [setFeatureToggles]);

  const tropicalGiftsToggle = activeToggles.find((t: FeatureToggle) => t.id === 'tropical_gifts');

  const handleToggle = (id: string, enabled: boolean) => {
    const updated = activeToggles.map((t: FeatureToggle) => (t.id === id ? { ...t, enabled } : t));
    setLocalToggles(updated);
    setFeatureToggles?.(updated);
    showToast(`Feature "${id}" ${enabled ? 'enabled' : 'disabled'}`, 'info');
  };

  const handleAddSpecialDay = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSpecialDay && tropicalGiftsToggle && featureToggles) {
      if (tropicalGiftsToggle.specialDays?.includes(newSpecialDay)) {
        showToast('This special day has already been added.');
        return;
      }

      const updatedDays = [...(tropicalGiftsToggle.specialDays || []), newSpecialDay].sort();
      const updated = featureToggles.map((t: FeatureToggle) => t.id === 'tropical_gifts' ? { ...t, specialDays: updatedDays } : t);
      setFeatureToggles?.(updated);
      setNewSpecialDay('');
    }
  };

  const handleRemoveSpecialDay = (dayToRemove: string) => {
    if (tropicalGiftsToggle && featureToggles) {
      const updatedDays = (tropicalGiftsToggle.specialDays || []).filter((d: string) => d !== dayToRemove);
      const updated = featureToggles.map((t: FeatureToggle) => t.id === 'tropical_gifts' ? { ...t, specialDays: updatedDays } : t);
      setFeatureToggles?.(updated);
    }
  };

  const handleUpdateSpecialDay = (index: number, value: string) => {
    if (!featureToggles) return;
    const updated = featureToggles.map((d: FeatureToggle) =>
      d.id === 'tropical_gifts'
        ? {
          ...d,
          specialDays: (d.specialDays || []).map((day: string, i: number) =>
            i === index ? value : day
          )
        }
        : d
    );
    setFeatureToggles?.(updated);
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      await adminOperationsService.updateSetting(
        'feature_toggles',
        featureToggles,
        'operations',
        'Platform feature toggles and seasonal fruit gift overrides'
      );
      showToast('Feature toggle settings saved successfully!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to save feature toggles', 'error');
    } finally {
      setSaving(false);
    }
  };

    return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Feature Toggles & Operations</h1>
          <p className="text-sm text-slate-700 font-medium mt-1">
            Dynamic runtime switches, seasonal gift schedules, and cryptographic circuit breakers.
          </p>
        </div>
        <button
          onClick={handleSaveChanges}
          disabled={saving}
          className="px-5 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-xs disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Sovereign Platform Ownership Proof */}
      <PlatformOwnershipCard />

      {/* Toggles Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeToggles.map((toggle: FeatureToggle) => (
          <div key={toggle.id} className="bg-white p-6 rounded-2xl shadow-xs border border-slate-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <PuzzlePieceIcon className="w-5 h-5 text-blue-600" />
                  {toggle.name || toggle.id}
                </h3>
                <span
                  className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    toggle.enabled
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                      : 'bg-slate-100 text-slate-800 border border-slate-300'
                  }`}
                >
                  {toggle.enabled ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>
              <p className="text-sm text-slate-700 font-medium">
                {toggle.description || 'System runtime feature flag'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Runtime Status</span>
              <button
                onClick={() => handleToggle(toggle.id, !toggle.enabled)}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-colors border ${
                  toggle.enabled
                    ? 'bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                {toggle.enabled ? 'Disable Flag' : 'Enable Flag'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Special Days Override for Tropical Gifts */}
      {tropicalGiftsToggle && (
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-300 space-y-4">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <PuzzlePieceIcon className="w-5 h-5 text-blue-600" />
              Tropical Fruit Gifts: 24-Hour Special Epochs
            </h2>
            <p className="text-sm text-slate-700 font-medium mt-1">
              On specified calendar dates, the 3pm-12am time constraint is suspended and gifting is unlocked 24 hours.
            </p>
          </div>

          <form onSubmit={handleAddSpecialDay} className="flex flex-wrap gap-3 items-center">
            <input
              type="date"
              value={newSpecialDay}
              onChange={(e) => setNewSpecialDay(e.target.value)}
              className="p-2 border rounded-xl text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
            >
              + Add Epoch Date
            </button>
          </form>

          <div className="flex flex-wrap gap-2 pt-2">
            {(tropicalGiftsToggle.specialDays || []).map((day: string) => (
              <div
                key={day}
                className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl text-sm border text-blue-950 border-blue-300 font-bold"
              >
                <span>📅 {day}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSpecialDay(day)}
                  className="text-rose-600 font-black text-xs hover:bg-rose-100 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureTogglesPage;
