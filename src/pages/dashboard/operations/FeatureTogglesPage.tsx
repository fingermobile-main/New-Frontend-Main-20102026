import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import type { FeatureToggle } from '../../../types';
import { PuzzlePieceIcon } from '../../../components/icons';
import adminOperationsService from '../../../services/adminOperationsService';

const FeatureTogglesPage: React.FC = () => {
  const { featureToggles, setFeatureToggles, showToast } = useAppContext();
  const [newSpecialDay, setNewSpecialDay] = useState('');
  const [saving, setSaving] = useState(false);

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
        console.warn('Could not load feature toggles from backend:', err);
      }
    };
    loadToggles();
  }, [setFeatureToggles]);

  const tropicalGiftsToggle = (featureToggles || []).find((t: FeatureToggle) => t.id === 'tropical_gifts');

  const handleToggle = (id: FeatureToggle['id'], enabled: boolean) => {
    if (!featureToggles) return;
    const updated = featureToggles.map((t: FeatureToggle) => t.id === id ? { ...t, enabled } : t);
    setFeatureToggles?.(updated);
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feature Toggles</h1>
        <button onClick={handleSaveChanges} className="px-4 py-2 text-sm font-semibold bg-brand-blue text-white rounded-full hover:bg-blue-700">
                    Save Changes
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
        {tropicalGiftsToggle && (
          <div>
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2"><PuzzlePieceIcon className="w-5 h-5" /> Tropical Fruit Gifts</h2>
                <p className="text-sm text-slate-700">Enable time-sensitive tropical fruit gifts (3pm - 12am daily).</p>
              </div>
              <label htmlFor="tropical-toggle" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="tropical-toggle"
                    className="sr-only text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    checked={tropicalGiftsToggle.enabled}
                    onChange={(e) => handleToggle('tropical_gifts', e.target.checked)}
                  />
                  <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${tropicalGiftsToggle.enabled ? 'translate-x-6 bg-brand-blue' : ''}`}></div>
                </div>
              </label>
            </div>

            <div className={`mt-4 transition-opacity ${tropicalGiftsToggle.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <h3 className="font-semibold text-gray-700">Special Days Override</h3>
              <p className="text-xs text-slate-700 mb-3">On these dates, tropical gifts will be available for 24 hours.</p>
              <form onSubmit={handleAddSpecialDay} className="flex gap-2 mb-3">
                <input
                  type="date"
                  value={newSpecialDay}
                  onChange={e => setNewSpecialDay(e.target.value)}
                  className="p-2 border rounded-md text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
                <button type="submit" className="px-4 py-2 text-sm font-semibold bg-gray-200 rounded-md hover:bg-gray-300">Add Day</button>
              </form>
              <div className="flex flex-wrap gap-2">
                {(tropicalGiftsToggle.specialDays || []).map((day: string) => (
                  <div key={day} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm border text-gray-950 border-gray-400 font-black">
                    <span>{day}</span>
                    <button onClick={() => handleRemoveSpecialDay(day)} className="text-red-500 font-bold text-xs leading-none hover:bg-red-100 rounded-full w-4 h-4 flex items-center justify-center">&times;</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureTogglesPage;
