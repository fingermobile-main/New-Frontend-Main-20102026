import React, { useState } from 'react';
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

  // Profile State
  const [profile, setProfile] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Alice Smith',
    username: user?.username || 'alicesmith',
    email: user?.email || 'alice@fingermobile.org',
    phone: (user as any)?.phone || '+234 801 234 5678',
    bio: (user as any)?.bio || 'Digital creator, photographer, and music enthusiast exploring Web3 storytelling on FingerMobile.',
    avatarUrl: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    location: 'Lagos, Nigeria'
  });

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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      if (user && setUser) {
        setUser({
          ...user,
          username: profile.username,
          email: profile.email,
          avatar: profile.avatarUrl
        });
      }
      setIsSaving(false);
      showToast('Profile updated successfully!', 'success');
    }, 600);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (security.newPassword && security.newPassword !== security.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSecurity((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      showToast('Security settings and 2FA updated!', 'success');
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
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <Sliders className="w-8 h-8 text-amber-400" />
                Account Settings & Preferences
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Configure your FingerMobile identity, dual-factor authentication, privacy controls, and playback engine.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-2">
                <span className="text-slate-400">FIC Balance:</span>
                <span className="font-bold text-amber-400">{ficBalance.toLocaleString()} FIC</span>
              </div>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation Tabs */}
            <nav className="lg:col-span-1 space-y-1.5" aria-label="Settings navigation">
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
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                      isActive
                        ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30 shadow-lg shadow-amber-950/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Content Area */}
            <main className="lg:col-span-3">
              {/* TAB 1: PROFILE */}
              {activeTab === 'profile' && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-400" />
                    Public Profile & Member Identity
                  </h2>
                  <p className="text-xs text-slate-400 mb-6">
                    Manage how your public persona appears across Communities, PhotoCredits, and Storefronts.
                  </p>

                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
                      <img
                        src={profile.avatarUrl}
                        alt="Profile avatar preview"
                        className="w-20 h-20 rounded-full object-cover ring-2 ring-amber-400/50 shadow-md"
                      />
                      <div className="flex-1 w-full space-y-2">
                        <label className="text-xs font-semibold text-slate-300 block">Avatar URL</label>
                        <input
                          type="url"
                          value={profile.avatarUrl}
                          onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Display Name</label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Username / Handle</label>
                        <input
                          type="text"
                          value={profile.username}
                          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Bio / Headline</label>
                      <textarea
                        rows={3}
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-800">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg transition-all text-sm"
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
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      Two-Factor Authentication & Verification
                    </h2>
                    <p className="text-xs text-slate-400 mb-6">
                      Protect your FingerMobile wallet, creator earnings, and protocol operations with strict TOTP multi-factor verification.
                    </p>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-6 h-6 text-emerald-400" />
                        <div>
                          <p className="text-sm font-semibold text-white">Authenticator App (TOTP)</p>
                          <p className="text-xs text-slate-400">Use Google Authenticator, 1Password, or Authy for secure one-time passcode login.</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Active & Guarded
                      </span>
                    </div>
                  </div>

                  {/* Change Password */}
                  <form onSubmit={handleSaveSecurity} className="space-y-4 pt-6 border-t border-slate-800">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      Change Password
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Current Password</label>
                        <input
                          type="password"
                          value={security.currentPassword}
                          onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">New Password</label>
                        <input
                          type="password"
                          value={security.newPassword}
                          onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={security.confirmPassword}
                          onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all text-sm"
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
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-400" />
                      Privacy & Visibility Governance
                    </h2>
                    <p className="text-xs text-slate-400 mb-6">
                      Decide who can discover your profile, direct message you, or inspect your community activities.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">Profile Visibility Tier</p>
                        <p className="text-xs text-slate-400">Controls discoverability across global search and discovery feeds.</p>
                      </div>
                      <select
                        value={privacy.profileVisibility}
                        onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                        className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                      >
                        <option value="public">Public (Open Discoverability)</option>
                        <option value="members_only">Members Only (Private & Visible)</option>
                        <option value="secret">Secret (Hidden from Search)</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">Online Presence Indicator</p>
                        <p className="text-xs text-slate-400">Show active status when you are streaming or chatting in groups.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.showOnlineStatus}
                        onChange={(e) => setPrivacy({ ...privacy, showOnlineStatus: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-500 bg-slate-900 border-slate-700"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">Read Receipts</p>
                        <p className="text-xs text-slate-400">Allow senders to see when you have read their direct messages.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={privacy.readReceipts}
                        onChange={(e) => setPrivacy({ ...privacy, readReceipts: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-500 bg-slate-900 border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => showToast('Export data request generated. Check your email.', 'info')}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      Download My Data (GDPR / NDPR Export)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveGeneric('Privacy')}
                      className="px-6 py-2.5 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold rounded-xl text-sm"
                    >
                      Save Privacy Settings
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-purple-400" />
                      Notification Channels & Alerts
                    </h2>
                    <p className="text-xs text-slate-400 mb-6">
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
                      <div key={item.key} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">{item.label}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={(notifications as any)[item.key]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="w-4 h-4 rounded text-purple-500 bg-slate-900 border-slate-700"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleSaveGeneric('Notification')}
                      className="px-6 py-2.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl text-sm"
                    >
                      Save Notification Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: MEDIA & VOICELINES */}
              {activeTab === 'media' && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-8">
                  {/* VoiceLines Audio Engine Card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-950 to-slate-900 border border-amber-500/30 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Volume2 className="w-5 h-5 text-amber-400" />
                          <h2 className="text-xl font-bold text-white">VoiceLines & Commentary Audio Engine</h2>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            Pipecat AI Powered
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Cultured African voice lines triggered when members post comments across platform microservices. Plays at default 35% system speaker volume.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-300">
                          {voiceSettings.enabled ? 'Audio Active' : 'Muted'}
                        </span>
                        <input
                          type="checkbox"
                          checked={voiceSettings.enabled}
                          onChange={(e) => handleToggleVoiceMaster(e.target.checked)}
                          className="w-5 h-5 rounded text-amber-500 bg-slate-900 border-slate-700 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Volume Slider & Test Button */}
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                            Commentary VoiceLine Volume: {Math.round(voiceSettings.volume * 100)}%
                          </label>
                          <p className="text-[11px] text-slate-400">
                            Standard protocol volume is preset to 35% to provide gentle auditory ambiance without overpowering device media.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleVolumeChange(0.35)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset to 35%
                          </button>
                          <button
                            type="button"
                            onClick={handleTestVoiceLine}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-bold text-slate-950 shadow-md transition"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Audition VoiceLine
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <VolumeX className="w-4 h-4 text-slate-500" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={Math.round(voiceSettings.volume * 100)}
                          onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
                          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                        />
                        <Volume2 className="w-4 h-4 text-amber-400" />
                      </div>
                    </div>

                    {/* Per-Microservice Toggles */}
                    <div className="space-y-3 pt-3 border-t border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Platform Microservice VoiceLine Switches
                        </h4>
                        <span className="text-[11px] text-slate-400">Enable or silence voice commentary by section</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { key: 'forum', name: 'Community Forum', desc: 'Post and reply comments' },
                          { key: 'hallmarks', name: 'Hallmarks', desc: 'Milestone accolades & honours' },
                          { key: 'mii', name: 'Mii Encounters', desc: 'Disappearing peer commentary' },
                          { key: 'groups', name: 'Digital Living Rooms', desc: 'Group threads & discussions' },
                          { key: 'lushpressies', name: 'LushPressies', desc: 'Dating comments & matching' },
                          { key: 'blogs', name: 'Community Blogs', desc: 'Article discussions & replies' }
                        ].map((ms) => {
                          const isEnabled = voiceSettings.microservices[ms.key] !== false && voiceSettings.enabled;
                          return (
                            <div
                              key={ms.key}
                              className={`p-3.5 rounded-xl border transition flex items-center justify-between ${
                                isEnabled
                                  ? 'bg-slate-950 border-amber-500/30'
                                  : 'bg-slate-950/50 border-slate-800 opacity-60'
                              }`}
                            >
                              <div className="pr-2">
                                <p className="text-xs font-bold text-white">{ms.name}</p>
                                <p className="text-[10px] text-slate-400">{ms.desc}</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={voiceSettings.microservices[ms.key] !== false}
                                disabled={!voiceSettings.enabled}
                                onChange={(e) => handleToggleMicroserviceVoice(ms.key, e.target.checked)}
                                className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 cursor-pointer"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Dancia-4Tv & BeatwaveNG Media Settings */}
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Tv className="w-5 h-5 text-amber-400" />
                      Dancia-4Tv & BeatwaveNG Media Engine
                    </h2>
                    <p className="text-xs text-slate-400 mb-6">
                      Fine-tune hardware acceleration, UHD streaming resolution, and studio master equalizer presets.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block">Default Video Quality</label>
                      <select
                        value={mediaSettings.streamQuality}
                        onChange={(e) => setMediaSettings({ ...mediaSettings, streamQuality: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white"
                      >
                        <option value="4k">4K Ultra HD (High Bandwidth)</option>
                        <option value="1080p">1080p Full HD (Recommended)</option>
                        <option value="720p">720p HD</option>
                        <option value="auto">Auto Adaptive Bitrate</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block">Audio Equalizer Preset</label>
                      <select
                        value={mediaSettings.audioEqualizer}
                        onChange={(e) => setMediaSettings({ ...mediaSettings, audioEqualizer: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white"
                      >
                        <option value="studio_master">Studio Master (Acoustic Transparency)</option>
                        <option value="bass_boost">Club Bass Boost</option>
                        <option value="vocal_boost">Podcast Vocal Enhance</option>
                        <option value="flat">Reference Flat (Neutral)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">Hardware Acceleration</p>
                        <p className="text-xs text-slate-400">Leverage GPU acceleration for smooth 60fps WebGL visualizers.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={mediaSettings.hardwareAcceleration}
                        onChange={(e) => setMediaSettings({ ...mediaSettings, hardwareAcceleration: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                      />
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">Autoplay Next Track / Stream</p>
                        <p className="text-xs text-slate-400">Seamless transition between BeatwaveNG playlists and Dancia live streams.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={mediaSettings.autoplayVideos}
                        onChange={(e) => setMediaSettings({ ...mediaSettings, autoplayVideos: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleSaveGeneric('Media & Playback')}
                      className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm"
                    >
                      Save Media Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 6: BILLING & WALLETS */}
              {activeTab === 'billing' && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-emerald-400" />
                      Wallets, Payouts & Currencies
                    </h2>
                    <p className="text-xs text-slate-400 mb-6">
                      Manage connected Web3 wallets, payout destinations, and preferred platform settlement currencies.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/30 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Connected Protocol Wallet</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900 text-emerald-200">Verified</span>
                    </div>
                    <p className="font-mono text-sm text-slate-200 break-all">{billing.walletAddress}</p>
                    <p className="text-xs text-slate-400">
                      Balance: <strong className="text-emerald-300">{ficBalance.toLocaleString()} FIC</strong> • Native on-chain escrow active
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block">Primary Display Currency</label>
                      <select
                        value={billing.primaryCurrency}
                        onChange={(e) => setBilling({ ...billing, primaryCurrency: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white"
                      >
                        <option value="FIC">FIC (Fingercoin Protocol Native)</option>
                        <option value="NGN">NGN (Nigerian Naira - LoanSqr Integrated)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <label className="text-xs font-semibold text-slate-300 block">Minimum Creator Payout Threshold</label>
                      <input
                        type="number"
                        value={billing.minPayoutThreshold}
                        onChange={(e) => setBilling({ ...billing, minPayoutThreshold: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleSaveGeneric('Billing & Wallet')}
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm"
                    >
                      Save Financial Settings
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 7: DEVELOPER */}
              {activeTab === 'developer' && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Key className="w-5 h-5 text-indigo-400" />
                      Developer API Keys & Webhooks
                    </h2>
                    <p className="text-xs text-slate-400 mb-6">
                      Authenticate external apps, discord bots, or automated store synchronization pipelines.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">Production API Key</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        readOnly
                        value={apiKey}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl font-mono text-xs text-indigo-300"
                      />
                      <button
                        type="button"
                        onClick={handleCopyApiKey}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedKey ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">Webhook Endpoint URL</label>
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl font-mono text-xs text-slate-200"
                    />
                    <p className="text-[11px] text-slate-500">
                      Receives HTTP POST payloads for events: <code>order.completed</code>, <code>gem.gifted</code>, <code>license.purchased</code>.
                    </p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleSaveGeneric('Developer API')}
                      className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl text-sm"
                    >
                      Save Webhook Settings
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
