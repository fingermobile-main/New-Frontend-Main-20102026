import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import adminOperationsService from '../../../services/adminOperationsService';
import PlatformOwnershipCard from '../../../components/dashboard/PlatformOwnershipCard';

const GeneralSettingsPage = () => {
  const { settings, updateSettings, showToast } = useAppContext();
  const [siteName, setSiteName] = useState('FingerMobile Protocol');
  const [siteDescription, setSiteDescription] = useState('The official community platform.');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const allSettings = await adminOperationsService.getSettings();
        const titleSetting = allSettings.find((s: any) => s.config_key === 'site_title');
        const descSetting = allSettings.find((s: any) => s.config_key === 'site_description');
        if (titleSetting && titleSetting.config_value) {
          const val = typeof titleSetting.config_value === 'string'
            ? titleSetting.config_value.replace(/^"|"$/g, '')
            : titleSetting.config_value;
          setSiteName(val);
        }
        if (descSetting && descSetting.config_value) {
          const val = typeof descSetting.config_value === 'string'
            ? descSetting.config_value.replace(/^"|"$/g, '')
            : descSetting.config_value;
          setSiteDescription(val);
        }
      } catch (err) {
        console.warn('Failed to load settings from DB:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminOperationsService.updateSetting('site_title', siteName, 'general', 'Official platform title');
      await adminOperationsService.updateSetting('site_description', siteDescription, 'general', 'Official platform description');
      updateSettings?.({ ...settings, siteName, siteDescription } as any);
      showToast('Settings saved to PostgreSQL successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">General Platform Settings</h1>
        <p className="text-sm font-medium text-slate-700 mt-1">Configure foundational brand metadata and protocol identity parameters.</p>
      </div>

      {/* Sovereign Platform Ownership Proof */}
      <PlatformOwnershipCard />
      <div className="max-w-2xl">
        <form onSubmit={handleSave} className="bg-white p-8 rounded-xl shadow-sm border border-slate-300 space-y-6">
          <div>
            <label htmlFor="siteName" className="block text-sm font-bold text-slate-800 mb-1">Site Name</label>
            <input
              id="siteName"
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full mt-1 p-2.5 border border-slate-300 rounded-lg text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              required
            />
          </div>
          <div>
            <label htmlFor="siteDescription" className="block text-sm font-bold text-slate-800 mb-1">Site Description</label>
            <textarea
              id="siteDescription"
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              rows={3}
              className="w-full mt-1 p-2.5 border border-slate-300 rounded-lg text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              required
            />
          </div>
          <div className="pt-4 border-t border-slate-300 flex justify-end">
            <button type="submit" disabled={isSaving} className="px-6 py-2.5 text-sm font-bold bg-brand-blue text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors shadow-sm">
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneralSettingsPage;
