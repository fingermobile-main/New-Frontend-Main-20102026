import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { ShieldCheckIcon, CogIcon, ExclamationTriangleIcon, KeyIcon } from '../icons';
import { useAppContext } from '../contexts/AppContext';
import adminOperationsService from '../services/adminOperationsService';

const AdminSecuritySettingsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    requireMFA: true,
    sessionTimeout: 15,
    maxLoginAttempts: 3,
    passwordExpirationDays: 90,
    ipWhitelisting: false,
    auditLogRetentionDays: 365
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const allSettings = await adminOperationsService.getSettings();
        const secSetting = allSettings.find(s => s.config_key === 'security_policies');
        if (secSetting && secSetting.config_value) {
          const val = typeof secSetting.config_value === 'string' 
            ? JSON.parse(secSetting.config_value) 
            : secSetting.config_value;
          setSettings(prev => ({ ...prev, ...val }));
        }
      } catch (err) {
        console.error('Failed to load security settings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : Number(value)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminOperationsService.updateSetting(
        'security_policies',
        settings,
        'security',
        'Global authentication and security policy thresholds'
      );
      showToast('Security configuration saved successfully', 'success');
    } catch (err) {
      console.error('Failed to save security configuration:', err);
      showToast('Failed to save security configuration', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-inner">
              <CogIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Security Settings</h1>
              <p className="text-slate-500 font-medium mt-1">Configure global security policies and thresholds</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <ShieldCheckIcon className="w-6 h-6 text-indigo-500" />
              Authentication Policies
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900">Require Multi-Factor Authentication (MFA)</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Enforce MFA for all administrative accounts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="requireMFA" checked={settings.requireMFA} onChange={handleChange} className="sr-only peer" />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900">IP Whitelisting</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Restrict admin access to trusted IP addresses</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="ipWhitelisting" checked={settings.ipWhitelisting} onChange={handleChange} className="sr-only peer" />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Max Login Attempts</label>
                  <select name="maxLoginAttempts" value={settings.maxLoginAttempts} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium">
                    <option value={3}>3 Attempts</option>
                    <option value={5}>5 Attempts</option>
                    <option value={10}>10 Attempts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Session Timeout (Minutes)</label>
                  <select name="sessionTimeout" value={settings.sessionTimeout} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium">
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={60}>1 Hour</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <KeyIcon className="w-6 h-6 text-indigo-500" />
              Data & Password Policies
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Password Expiration (Days)</label>
                <select name="passwordExpirationDays" value={settings.passwordExpirationDays} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium">
                  <option value={30}>30 Days</option>
                  <option value={90}>90 Days</option>
                  <option value={180}>180 Days</option>
                  <option value={365}>1 Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Audit Log Retention (Days)</label>
                <select name="auditLogRetentionDays" value={settings.auditLogRetentionDays} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 font-medium">
                  <option value={90}>90 Days</option>
                  <option value={180}>180 Days</option>
                  <option value={365}>1 Year</option>
                  <option value={730}>2 Years</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 flex items-start gap-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900">Warning: Global Impact</h3>
              <p className="text-sm text-amber-700 font-medium mt-1">Changes to security policies affect all active administrative sessions and may require immediate re-authentication.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving || loading}
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 text-lg"
            >
              {saving ? 'Saving Settings...' : 'Save Security Configuration'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AdminSecuritySettingsPage;
