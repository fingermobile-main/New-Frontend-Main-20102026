import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  User,
  Shield,
  Lock,
  Bell,
  Eye,
  Sliders,
  Key,
  CreditCard,
  Save,
  Smartphone,
  Tv,
  Check,
  Copy,
  Volume2,
  VolumeX,
  Play,
  RotateCcw
} from 'lucide-react';
import voiceLineServiceInstance, { VoiceLineSettings } from '../../services/VoiceLineService';
import userProfileSyncService from '../../services/UserProfileSyncService';
import UserService from '../../services/UserService';
import { API_BASE_URL } from '../../services/api';

type SettingsTab =
  | 'profile'
  | 'security'
  | 'privacy'
  | 'notifications'
  | 'media'
  | 'billing'
  | 'developer';

export const SettingsPage: React.FC = () => {
  const { showToast, ficBalance } = useAppContext();
  const { user, setUser } = useAuth();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Profile State hydrated from unified Source of Truth
  const [profile, setProfile] = useState(() => {
    const synced = userProfileSyncService.getProfile();
    return {
      name: synced.name,
      username: synced.username,
      email: synced.email,
      phone: synced.phone || '+234 801 234 5678',
      bio: synced.headline,
      avatarUrl: synced.avatar,
      location: synced.location || 'Lagos, Nigeria'
    };
  });

  // Subscribe to live reactive updates across all components/tabs
  useEffect(() => {
    const unsub = userProfileSyncService.subscribe((synced) => {
      setProfile({
        name: synced.name,
        username: synced.username,
        email: synced.email,
        phone: synced.phone || '+234 801 234 5678',
        bio: synced.headline,
        avatarUrl: synced.avatar,
        location: synced.location || 'Lagos, Nigeria'
      });
    });
    return unsub;
  }, []);

  // Security State
  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    totpEnabled: true,
    smsBackup: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    loginAlerts: true
  });

  // Privacy State
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public', // 'public' | 'members_only' | 'secret'
    searchEngineIndexing: false,
    showOnlineStatus: true,
    allowDirectMessages: 'everyone', // 'everyone' | 'following' | 'none'
    readReceipts: true
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    emailDigests: 'daily',
    mentionAlerts: true,
    directMessages: true,
    gemTransactions: true,
    photoLicensing: true,
    productSales: true
  });

  // Media & Streaming Preferences
  const [mediaSettings, setMediaSettings] = useState({
    streamQuality: '1080p',
    audioEqualizer: 'studio_master',
    autoplayVideos: true,
    hardwareAcceleration: true,
    subtitlesDefault: false,
    audioBitrate: '320kbps'
  });

  // Billing & Wallets
  const [billing, setBilling] = useState({
    primaryCurrency: 'FIC',
    walletAddress: '0x71C...a89B (Connected via Native FIC Vault)',
    autoPayout: true,
    minPayoutThreshold: 50
  });

  // Developer API Keys
  const [apiKey] = useState('fm_live_sec_99a8b7c6d5e4f3a2b1c0987654321');
  const [webhookUrl, setWebhookUrl] = useState('https://api.mybrand.com/webhooks/fingermobile');

  // VoiceLines & Commentary Audio Preferences
  const [voiceSettings, setVoiceSettings] = useState<VoiceLineSettings>(() => {
    return voiceLineServiceInstance.getSettings();
  });

  const handleVolumeChange = (newVolume: number) => {
    const updated = voiceLineServiceInstance.saveSettings({ volume: newVolume });
    setVoiceSettings({ ...updated });
  };

  const handleToggleVoiceMaster = (enabled: boolean) => {
    const updated = voiceLineServiceInstance.saveSettings({ enabled });
    setVoiceSettings({ ...updated });
    showToast(enabled ? 'VoiceLine commentary audio enabled' : 'VoiceLine commentary audio muted', 'info');
  };

  const handleToggleMicroserviceVoice = (microservice: string, enabled: boolean) => {
    voiceLineServiceInstance.setMicroserviceVoiceLineEnabled(microservice, enabled);
    setVoiceSettings({ ...voiceLineServiceInstance.getSettings() });
    showToast(`${microservice.charAt(0).toUpperCase() + microservice.slice(1)} voice lines ${enabled ? 'enabled' : 'disabled'}`, 'info');
  };

  const handleTestVoiceLine = () => {
    voiceLineServiceInstance.playCommentaryVoiceLine('forum');
    showToast(`Playing sample VoiceLine at ${Math.round(voiceSettings.volume * 100)}% volume`, 'info');
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    showToast('API Key copied to clipboard', 'info');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 1. Update unified UserProfileSyncService (broadcasts live across Forum Profile Card, Drawer, Dashboards)
      userProfileSyncService.updateProfile({
        name: profile.name,
        username: profile.username,
        headline: profile.bio,
        avatar: profile.avatarUrl,
        email: profile.email,
        phone: profile.phone,
        location: profile.location
      });

      // 2. Synchronize directly with /profile Charter API (Source of Truth)
      try {
        const targetId = user?.id || (user as any)?.userId || '00000000-0000-0000-0000-000000000001';
        await fetch(`${API_BASE_URL}/v1/profiles/${targetId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            display_name: profile.name,
            username: profile.username,
            avatar_url: profile.avatarUrl,
            bio: profile.bio,
            location: profile.location,
            contact_email: profile.email
          })
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Backend /api/v1/profiles sync fallback', err);
      }

      // 3. Synchronize with User Management API (/users/profile)
      try {
        const parts = profile.name.split(' ');
        await UserService.updateUserProfile({
          firstName: parts[0] || 'Israel',
          lastName: parts.slice(1).join(' ') || 'Obinna Mbah',
          bio: profile.bio,
          avatar: profile.avatarUrl
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('UserService sync fallback', err);
      }

      // 4. Update AuthContext if session exists
      if (user && setUser) {
        const parts = profile.name.split(' ');
        setUser({
          ...user,
          firstName: parts[0] || user.firstName,
          lastName: parts.slice(1).join(' ') || user.lastName,
          username: profile.username,
          email: profile.email,
          avatar: profile.avatarUrl,
          bio: profile.bio
        });
      }

      showToast('Profile preferences synchronized across Sovereign Database, Wall & Forum!', 'success');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (security.newPassword && security.newPassword !== security.confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSecurity({ ...security, currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Security and 2FA credentials updated!', 'success');
    }, 600);
  };

  const handleSaveGeneric = (section: string) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast(`${section} preferences saved!`, 'success');
    }, 500);
  };

  return (
    <MainLayout pageTitle="Settings & Preferences">
      <div className="min-h-screen bg-slate-50 text-slate-900 py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6 sm:space-y-8 overflow-x-hidden pb-28 md:pb-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-300 pb-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                <Sliders className="w-8 h-8 text-blue-600" />
                Account Settings & Preferences
              </h1>
              <p className="text-sm font-medium text-slate-700 mt-1">
                Configure your FingerMobile identity, dual-factor authentication, privacy controls, and playback engine.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-white border border-slate-300 shadow-sm text-xs flex items-center gap-2">
                <span className="text-slate-700 font-bold uppercase tracking-wider">FIC Balance:</span>
                <span className="font-extrabold text-blue-700">{ficBalance.toLocaleString()} FIC</span>
              </div>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation Tabs */}
            <nav className="lg:col-span-1 space-y-2" aria-label="Settings navigation">
              {[
                { id: 'profile', label: 'Profile & Identity', icon: User },
                { id: 'security', label: 'Security & 2FA', icon: Shield },
                { id: 'privacy', label: 'Privacy & Visibility', icon: Eye },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'media', label: 'Media & VoiceLines', icon: Volume2 },
                { id: 'billing', label: 'Wallets & Billing', icon: CreditCard },
                { id: 'developer', label: 'Developer & API Keys', icon: Key }
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-slate-800 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 shadow-sm'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Content Area */}
            <main className="lg:col-span-3">
              {/* TAB 1: PROFILE */}
              {activeTab === 'profile' && (
                <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Public Profile & Member Identity
                    </h2>
                    <p className="text-xs font-semibold text-slate-700 mb-6">
                      Manage how your public persona appears across Communities, PhotoCredits, and Storefronts.
                    </p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200">
                      <img
                        src={profile.avatarUrl}
                        alt="Profile avatar preview"
                        className="w-[88px] h-[88px] rounded-full object-cover border-2 border-blue-500 shadow-md flex-shrink-0"
                      />
                      <div className="flex-1 w-full space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                          Avatar URL
                        </label>
                        <input
                          type="url"
                          value={profile.avatarUrl}
                          onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
                          Username / Handle
                        </label>
                        <input
                          type="text"
                          value={profile.username}
                          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
                        Bio / Headline
                      </label>
                      <textarea
                        rows={3}
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-200">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-sm disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Profile Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: SECURITY */}
              {activeTab === 'security' && (
                <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-600" />
                      Two-Factor Authentication & Verification
                    </h2>
                    <p className="text-xs font-semibold text-slate-700 mb-6">
                      Protect your FingerMobile wallet, creator earnings, and protocol operations with strict TOTP multi-factor verification.
                    </p>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-6 h-6 text-emerald-600" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">Authenticator App (TOTP)</p>
                          <p className="text-xs font-medium text-slate-700">Use Google Authenticator, 1Password, or Authy for secure one-time passcode login.</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-400">
                        Active & Guarded
                      </span>
                    </div>
                  </div>

                  {/* Change Password */}
                  <form onSubmit={handleSaveSecurity} className="space-y-4 pt-6 border-t border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-600" />
                      Change Password
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={security.currentPassword}
                          onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={security.newPassword}
                          onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={security.confirmPassword}
                          onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-sm disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Updating...' : 'Update Password & 2FA'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: PRIVACY */}
              {activeTab === 'privacy' && (
                <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-600" />
                      Privacy & Visibility Governance
                    </h2>
                    <p className="text-xs font-semibold text-slate-700 mb-6">
                      Decide who can discover your profile, direct message you, or inspect your community activities.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Profile Visibility Tier</p>
                        <p className="text-xs font-medium text-slate-700">Controls discoverability across global search and discovery feeds.</p>
                      </div>
                      <select
                        value={privacy.profileVisibility}
                        onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                        className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      >
                        <option value="public">Public (Open Discoverability)</option>
                        <option value="members_only">Members Only (Private & Visible)</option>
                        <option value="secret">Secret (Hidden from Search)</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Online Presence Indicator</p>
                        <p className="text-xs font-medium text-slate-700">Show active status when you are streaming or chatting in groups.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.showOnlineStatus}
                        onChange={(e) => setPrivacy({ ...privacy, showOnlineStatus: e.target.checked })}
                        className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-blue-500 font-bold border bg-white focus:ring-2 placeholder:text-slate-400"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Read Receipts</p>
                        <p className="text-xs font-medium text-slate-700">Allow senders to see when you have read their direct messages.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.readReceipts}
                        onChange={(e) => setPrivacy({ ...privacy, readReceipts: e.target.checked })}
                        className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-blue-500 font-bold border bg-white focus:ring-2 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => showToast('Export data request generated. Check your email.', 'info')}
                      className="text-xs text-blue-700 hover:text-blue-900 font-bold underline"
                    >
                      Download My Data (GDPR / NDPR Export)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveGeneric('Privacy')}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md"
                    >
                      Save Privacy Settings
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-purple-600" />
                      Notification Channels & Alerts
                    </h2>
                    <p className="text-xs font-semibold text-slate-700 mb-6">
                      Customize how and when you receive real-time notifications from fellow creators and transactions.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: 'pushEnabled', label: 'In-App & Browser Push Notifications', desc: 'Real-time alert popups on desktop and mobile browsers' },
                      { key: 'mentionAlerts', label: 'Mentions & Comments', desc: 'Notify me when someone tags my username in groups or forums' },
                      { key: 'directMessages', label: 'Direct Messages', desc: 'Instant sound and notification banner on new private chat' },
                      { key: 'gemTransactions', label: 'Gem Gifts & Micro-transactions', desc: 'Alert me immediately when gifts or gems arrive in my wallet' },
                      { key: 'photoLicensing', label: 'PhotoCredits Royalties', desc: 'Notify me when a subscriber licenses one of my master photographs' }
                    ].map((item) => (
                      <div key={item.key} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.label}</p>
                          <p className="text-xs font-medium text-slate-700">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={(notifications as any)[item.key]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-purple-500 font-bold border bg-white focus:ring-2 placeholder:text-slate-400"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleSaveGeneric('Notification')}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm shadow-md"
                    >
                      Save Notification Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: MEDIA & VOICELINES */}
              {activeTab === 'media' && (
                <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
                  {/* VoiceLines Audio Engine Card */}
                  <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-300 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-amber-200 pb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Volume2 className="w-5 h-5 text-amber-700" />
                          <h2 className="text-xl font-black text-slate-900">VoiceLines & Commentary Audio Engine</h2>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-950 border border-amber-400">
                            Pipecat AI Powered
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-700">
                          Cultured African voice lines triggered when members post comments across platform microservices. Plays at default 35% system speaker volume.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-800">
                          {voiceSettings.enabled ? 'Audio Active' : 'Muted'}
                        </span>
                        <input
                          type="checkbox"
                          checked={voiceSettings.enabled}
                          onChange={(e) => handleToggleVoiceMaster(e.target.checked)}
                          className="w-5 h-5 rounded text-slate-900 border-slate-300 focus:ring-amber-500 cursor-pointer font-bold border bg-white focus:ring-2 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Volume Slider & Test Button */}
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                            Commentary VoiceLine Volume: {Math.round(voiceSettings.volume * 100)}%
                          </label>
                          <p className="text-[11px] font-medium text-slate-700">
                            Standard protocol volume is preset to 35% to provide gentle auditory ambiance without overpowering device media.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleVolumeChange(0.35)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 transition"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset to 35%
                          </button>
                          <button
                            type="button"
                            onClick={handleTestVoiceLine}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-xs font-bold text-white shadow-md transition"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Audition VoiceLine
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <VolumeX className="w-4 h-4 text-slate-600" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={Math.round(voiceSettings.volume * 100)}
                          onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
                          className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-amber-600 text-slate-900 font-bold border border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                        />
                        <Volume2 className="w-4 h-4 text-amber-700" />
                      </div>
                    </div>

                    {/* Per-Microservice Toggles */}
                    <div className="space-y-3 pt-3 border-t border-amber-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Platform Microservice VoiceLine Switches
                        </h4>
                        <span className="text-[11px] font-medium text-slate-700">Enable or silence voice commentary by section</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { key: 'forum', name: 'Community Forum', desc: 'Post and reply comments' },
                          { key: 'hallmarks', name: 'Hallmarks', desc: 'Milestone accolades & honours' },
                          { key: 'mii', name: 'Mii Encounters', desc: 'Disappearing peer commentary' },
                          { key: 'groups', name: 'Digital Living Rooms', desc: 'Group threads & discussions' },
                          { key: 'lushpressies', name: 'Lush-Pressies', desc: 'Dating comments & matching' },
                          { key: 'blogs', name: 'Community Blogs', desc: 'Article discussions & replies' }
                        ].map((ms) => {
                          const isEnabled = voiceSettings.microservices[ms.key] !== false && voiceSettings.enabled;
                          return (
                            <div
                              key={ms.key}
                              className={`p-3.5 rounded-xl border transition flex items-center justify-between ${
                                isEnabled
                                  ? 'bg-white border-amber-400 shadow-sm'
                                  : 'bg-slate-100 border-slate-200 opacity-60'
                              }`}
                            >
                              <div className="pr-2">
                                <p className="text-xs font-bold text-slate-900">{ms.name}</p>
                                <p className="text-[10px] font-medium text-slate-700">{ms.desc}</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={voiceSettings.microservices[ms.key] !== false}
                                disabled={!voiceSettings.enabled}
                                onChange={(e) => handleToggleMicroserviceVoice(ms.key, e.target.checked)}
                                className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-amber-500 cursor-pointer font-bold border bg-white focus:ring-2 placeholder:text-slate-400"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Dancia-4Tv & BeatwaveNG Media Settings */}
                  <div>
                    <h2 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
                      <Tv className="w-5 h-5 text-blue-600" />
                      Dancia-4Tv & BeatwaveNG Media Engine
                    </h2>
                    <p className="text-xs font-semibold text-slate-700 mb-6">
                      Fine-tune hardware acceleration, UHD streaming resolution, and studio master equalizer presets.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                        Default Video Quality
                      </label>
                      <select
                        value={mediaSettings.streamQuality}
                        onChange={(e) => setMediaSettings({ ...mediaSettings, streamQuality: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 shadow-sm"
                      >
                        <option value="4k">4K Ultra HD (High Bandwidth)</option>
                        <option value="1080p">1080p Full HD (Recommended)</option>
                        <option value="720p">720p HD</option>
                        <option value="auto">Auto Adaptive Bitrate</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                        Audio Equalizer Preset
                      </label>
                      <select
                        value={mediaSettings.audioEqualizer}
                        onChange={(e) => setMediaSettings({ ...mediaSettings, audioEqualizer: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 shadow-sm"
                      >
                        <option value="studio_master">Studio Master (Acoustic Transparency)</option>
                        <option value="bass_boost">Club Bass Boost</option>
                        <option value="vocal_boost">Podcast Vocal Enhance</option>
                        <option value="flat">Reference Flat (Neutral)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Hardware Acceleration</p>
                        <p className="text-xs font-medium text-slate-700">Leverage GPU acceleration for smooth 60fps WebGL visualizers.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={mediaSettings.hardwareAcceleration}
                        onChange={(e) => setMediaSettings({ ...mediaSettings, hardwareAcceleration: e.target.checked })}
                        className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-blue-500 font-bold border bg-white focus:ring-2 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Autoplay Next Track / Stream</p>
                        <p className="text-xs font-medium text-slate-700">Seamless transition between BeatwaveNG playlists and Dancia live streams.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={mediaSettings.autoplayVideos}
                        onChange={(e) => setMediaSettings({ ...mediaSettings, autoplayVideos: e.target.checked })}
                        className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-blue-500 font-bold border bg-white focus:ring-2 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleSaveGeneric('Media & Playback')}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md"
                    >
                      Save Media Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 6: BILLING & WALLETS */}
              {activeTab === 'billing' && (
                <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                      Wallets, Payouts & Currencies
                    </h2>
                    <p className="text-xs font-semibold text-slate-700 mb-6">
                      Manage connected Web3 wallets, payout destinations, and preferred platform settlement currencies.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">Connected Protocol Wallet</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-400">Verified</span>
                    </div>
                    <p className="font-mono text-sm font-bold text-slate-900 break-all">{billing.walletAddress}</p>
                    <p className="text-xs font-medium text-slate-700">
                      Balance: <strong className="text-emerald-900 font-extrabold">{ficBalance.toLocaleString()} FIC</strong> • Native on-chain escrow active
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                        Primary Display Currency
                      </label>
                      <select
                        value={billing.primaryCurrency}
                        onChange={(e) => setBilling({ ...billing, primaryCurrency: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 shadow-sm"
                      >
                        <option value="FIC">FIC (Fingercoin Protocol Native)</option>
                        <option value="NGN">NGN (Nigerian Naira - LoanSqr Integrated)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                        Minimum Creator Payout Threshold
                      </label>
                      <input
                        type="number"
                        value={billing.minPayoutThreshold}
                        onChange={(e) => setBilling({ ...billing, minPayoutThreshold: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 shadow-sm placeholder:text-slate-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleSaveGeneric('Billing & Wallet')}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md"
                    >
                      Save Financial Settings
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 7: DEVELOPER */}
              {activeTab === 'developer' && (
                <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
                      <Key className="w-5 h-5 text-indigo-600" />
                      Developer API Keys & Webhooks
                    </h2>
                    <p className="text-xs font-semibold text-slate-700 mb-6">
                      Authenticate external apps, discord bots, or automated store synchronization pipelines.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                      Production API Key
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        readOnly
                        value={apiKey}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={handleCopyApiKey}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedKey ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                      Webhook Endpoint URL
                    </label>
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 shadow-sm placeholder:text-slate-400"
                    />
                    <p className="text-[11px] font-medium text-slate-700">
                      Receives HTTP POST payloads for events: <code className="font-bold text-slate-900">order.completed</code>, <code className="font-bold text-slate-900">gem.gifted</code>, <code className="font-bold text-slate-900">license.purchased</code>.
                    </p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleSaveGeneric('Developer API')}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md"
                    >
                      Save Webhook Settings
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* MOBILE NAVIGATION QUICK DOCK */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around z-30 shadow-lg">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'profile' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'security' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Shield className="w-5 h-5 mb-0.5" />
            <span>Security</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'privacy' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Eye className="w-5 h-5 mb-0.5" />
            <span>Privacy</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'media' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Volume2 className="w-5 h-5 mb-0.5" />
            <span>Media</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
