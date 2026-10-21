import React, { useCallback, useEffect, useState } from 'react';
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ExclamationTriangleIcon,
  SignalIcon,
  GlobeAmericasIcon,
  SpeakerWaveIcon,
  LockClosedIcon,
  ArrowPathIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  PlayIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import voiceLineServiceInstance, {
  VoiceLineSettings,
} from '../../services/VoiceLineService';

interface DefConState {
  currentLevel: number;
  status: string;
  isPlatformShutdown: boolean;
  emergencyDispatchedAt: string | null;
  dispatchedRecipients: string[];
  requiresPromptCode: boolean;
  lastRebootAt: string | null;
  devPromptCodeNotice?: string;
}

interface GeoRestrictionItem {
  id: number;
  region_type: string;
  region_name: string;
  freeze_all_services: boolean;
  frozen_services: string[];
  blocked_ips: string[];
  blocked_macs: string[];
  severity: string;
  reason: string;
  is_active: boolean;
  created_at: string;
}

const DEFCON_LEVELS = [
  {
    level: 5,
    name: 'DEFCON 5',
    title: 'Normal Peace Time Readiness',
    description: 'Baseline telemetry, normal traffic filtering, standard fraud analysis, baseline Sentinel / Guardian heartbeats.',
    threshold: 'Standard continuous operational mode',
    badgeColor: 'border-emerald-400 bg-emerald-100 text-emerald-950',
    indicatorColor: 'bg-emerald-500',
  },
  {
    level: 4,
    name: 'DEFCON 4',
    title: 'Heightened Readiness',
    description: 'Above-normal readiness with increased intelligence gathering and stronger security measures across all nodes.',
    threshold: 'Elevated brute-force or regional anomalies detected',
    badgeColor: 'border-blue-400 bg-blue-100 text-blue-950',
    indicatorColor: 'bg-blue-500',
  },
  {
    level: 3,
    name: 'DEFCON 3',
    title: 'Force Readiness Escalation',
    description: 'An increase in force readiness above normal; select EMERGENCY PROTOCOLS and SET ready to deploy in 15 minutes.',
    threshold: 'Deploy ready within 15 minutes upon confirmation',
    badgeColor: 'border-amber-400 bg-amber-100 text-amber-950',
    indicatorColor: 'bg-amber-500',
  },
  {
    level: 2,
    name: 'DEFCON 2',
    title: 'Critical Threat Readiness',
    description: 'A further increase in FingerMobile Security readiness; all EMERGENCY PROTOCOLS are deployed and mitigation of all risk in six Minutes or less.',
    threshold: 'Total risk mitigation in 6 minutes or less',
    badgeColor: 'border-orange-400 bg-orange-100 text-orange-950',
    indicatorColor: 'bg-orange-600',
  },
  {
    level: 1,
    name: 'DEFCON 1',
    title: 'Maximum Emergency Protocol (PRO-MTS)',
    description: 'Maximum EMERGENCY PROTOCOLS activated (PRO-MTS). Encrypted emergency alert dispatched to Sovereign response leadership. Awaiting Prompt AI 6-Digit Numeric Token to execute Conclusive, Irrevocable, Absolute All Console Imminent Shutdown.',
    threshold: 'Immediate Automated Dispatch & Console Lock',
    badgeColor: 'border-rose-500 bg-rose-100 text-rose-950',
    indicatorColor: 'bg-rose-600 animate-pulse',
  },
];

const PLATFORM_MICROSERVICES = [
  { key: 'dancia4tv', label: 'Dancia-4Tv' },
  { key: 'beatwaveng', label: 'BeatwaveNG' },
  { key: 'lushpressies', label: 'LushPressies' },
  { key: 'marketplace', label: 'MarketPlace' },
  { key: 'fingerlux', label: 'FingerLux' },
  { key: 'supervi', label: 'SuperVi & FingerWars' },
  { key: 'flamingo', label: 'Flamingo' },
  { key: 'tribut', label: 'Tribut' },
  { key: 'camus', label: 'Camus' },
  { key: 'financials', label: 'Financial Settlements' },
];

const SAMPLE_VOICE_PREVIEWS = [
  { id: 'forum', label: '"Great!" (Forum/Win)', category: 'forum' as const },
  { id: 'lushpressies', label: '"Sweet!" (LushPressies)', category: 'lushpressies' as const },
  { id: 'achievement', label: '"Wereey" (Achievement)', category: 'achievement' as const },
  { id: 'blogs', label: '"Wonderful" (Blogs)', category: 'blogs' as const },
  { id: 'hallmarks', label: '"Divine" (Hallmarks)', category: 'hallmarks' as const },
];

const StercsControlCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'defcon' | 'heatmap' | 'voicelines'>('defcon');
  const [defconState, setDefconState] = useState<DefConState>({
    currentLevel: 5,
    status: 'peace_time',
    isPlatformShutdown: false,
    emergencyDispatchedAt: null,
    dispatchedRecipients: [],
    requiresPromptCode: false,
    lastRebootAt: null,
  });
  const [loadingDefcon, setLoadingDefcon] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [rebootCodeInput, setRebootCodeInput] = useState('');
  const [rebootOrderInput, setRebootOrderInput] = useState('');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Geo-restrictions state
  const [geoRestrictions, setGeoRestrictions] = useState<GeoRestrictionItem[]>([]);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [newRegionType, setNewRegionType] = useState('country');
  const [newRegionName, setNewRegionName] = useState('');
  const [newFreezeAll, setNewFreezeAll] = useState(false);
  const [newFrozenServices, setNewFrozenServices] = useState<string[]>([]);
  const [newBlockedIps, setNewBlockedIps] = useState('');
  const [newBlockedMacs, setNewBlockedMacs] = useState('');
  const [newSeverity, setNewSeverity] = useState('warning');
  const [newReason, setNewReason] = useState('');

  // Voice Line Studio state
  const [voiceSettings, setVoiceSettings] = useState<VoiceLineSettings>(() =>
    voiceLineServiceInstance.getSettings()
  );

  const fetchDefConState = useCallback(async () => {
    setLoadingDefcon(true);
    try {
      const res = await axios.get('/api/stercs/defcon');
      if (res.data?.success && res.data?.data) {
        setDefconState(res.data.data);
      }
    } catch {
      // Local fallback
    } finally {
      setLoadingDefcon(false);
    }
  }, []);

  const fetchGeoRestrictions = useCallback(async () => {
    setLoadingGeo(true);
    try {
      const res = await axios.get('/api/stercs/geo-restrictions');
      if (res.data?.success && Array.isArray(res.data?.data)) {
        setGeoRestrictions(res.data.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingGeo(false);
    }
  }, []);

  useEffect(() => {
    void fetchDefConState();
    void fetchGeoRestrictions();
  }, [fetchDefConState, fetchGeoRestrictions]);

  const handleSetDefCon = async (level: number) => {
    setActionMessage(null);
    try {
      const res = await axios.post('/api/stercs/defcon', {
        level,
        reason: `Operator updated defense condition to Level ${level} via STERCS Console.`,
      });
      if (res.data?.success) {
        setDefconState(res.data.data);
        setActionMessage({
          type: 'success',
          text: `DefCon and Command level updated to Level ${level}.`,
        });
      }
    } catch (err: unknown) {
      setActionMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update DefCon level.',
      });
    }
  };

  const handleVerifyShutdown = async () => {
    if (!promptInput.trim()) {
      setActionMessage({ type: 'error', text: 'Enter the 6-digit Prompt AI code sent to SuperAdmin GSM numbers.' });
      return;
    }
    setActionMessage(null);
    try {
      const res = await axios.post('/api/stercs/defcon/verify-shutdown', {
        promptCode: promptInput.trim(),
      });
      if (res.data?.success) {
        setDefconState((prev) => ({
          ...prev,
          isPlatformShutdown: true,
          status: 'absolute_platform_shutdown',
        }));
        setPromptInput('');
        setActionMessage({
          type: 'success',
          text: 'Conclusive, Irrevocable, Absolute All Console Imminent Shutdown executed. Platform taken offline.',
        });
      }
    } catch (err: unknown) {
      setActionMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Invalid code or shutdown failed.',
      });
    }
  };

  const handleRebootPlatform = async () => {
    if (!rebootCodeInput.trim() || !rebootOrderInput.trim()) {
      setActionMessage({ type: 'error', text: 'SuperAdmin Reboot Order and Backup Code are required.' });
      return;
    }
    setActionMessage(null);
    try {
      const res = await axios.post('/api/stercs/defcon/reboot', {
        rebootOrder: rebootOrderInput.trim(),
        backupCode: rebootCodeInput.trim(),
      });
      if (res.data?.success) {
        setDefconState((prev) => ({
          ...prev,
          currentLevel: 5,
          status: 'peace_time',
          isPlatformShutdown: false,
        }));
        setRebootCodeInput('');
        setRebootOrderInput('');
        setActionMessage({
          type: 'success',
          text: 'Platform successfully rebooted and restored to DEFCON 5 peace time readiness.',
        });
      }
    } catch (err: unknown) {
      setActionMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Cold-boot failed. Check cryptographic backup code.',
      });
    }
  };

  const handleAddGeoRestriction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegionName.trim()) return;

    setActionMessage(null);
    try {
      const res = await axios.post('/api/stercs/geo-restrictions', {
        region_type: newRegionType,
        region_name: newRegionName.trim(),
        freeze_all_services: newFreezeAll,
        frozen_services: newFrozenServices,
        blocked_ips: newBlockedIps ? newBlockedIps.split(',').map((s) => s.trim()) : [],
        blocked_macs: newBlockedMacs ? newBlockedMacs.split(',').map((s) => s.trim()) : [],
        severity: newSeverity,
        reason: newReason.trim(),
      });
      if (res.data?.success) {
        setNewRegionName('');
        setNewReason('');
        setNewBlockedIps('');
        setNewBlockedMacs('');
        setNewFrozenServices([]);
        setNewFreezeAll(false);
        setActionMessage({ type: 'success', text: `Geo-restriction enforced on ${newRegionName}.` });
        void fetchGeoRestrictions();
      }
    } catch (err: unknown) {
      setActionMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to enforce geo-restriction.',
      });
    }
  };

  const handleDeleteGeoRestriction = async (id: number) => {
    try {
      await axios.delete(`/api/stercs/geo-restrictions/${id}`);
      setGeoRestrictions((prev) => prev.filter((item) => item.id !== id));
      setActionMessage({ type: 'success', text: 'Geo-restriction lifted.' });
    } catch {
      setActionMessage({ type: 'error', text: 'Failed to lift geo-restriction.' });
    }
  };

  const handleToggleFrozenService = (key: string) => {
    setNewFrozenServices((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value);
    voiceLineServiceInstance.setPlaybackRate(rate);
    setVoiceSettings({ ...voiceLineServiceInstance.getSettings() });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    voiceLineServiceInstance.setVolume(vol);
    setVoiceSettings({ ...voiceLineServiceInstance.getSettings() });
  };

  const handleToggleVoiceMicroservice = (msKey: string) => {
    const current = !!voiceSettings.microservices[msKey];
    voiceLineServiceInstance.setMicroserviceVoiceLineEnabled(msKey, !current);
    setVoiceSettings({ ...voiceLineServiceInstance.getSettings() });
  };

  const currentLevelInfo = DEFCON_LEVELS.find((d) => d.level === defconState.currentLevel) || DEFCON_LEVELS[0];

  return (
    <div className="rounded-xl border border-slate-300 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <ShieldCheckIcon className="h-5 w-5 text-emerald-400" />
            </span>
            <h2 className="text-xl font-black text-slate-900">
              STERCS Command & Defense Readiness Console
            </h2>
          </div>
          <p className="mt-1 text-xs font-medium text-slate-700">
            Defense Readiness Condition (DefCon), Universal Platform Geo-Restrictions, and Voice Cadence Studio
          </p>
        </div>

        {/* Global Status Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5">
            <span className={`h-3 w-3 rounded-full ${currentLevelInfo.indicatorColor}`} />
            <span className="text-xs font-black text-slate-900">{currentLevelInfo.name}</span>
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${currentLevelInfo.badgeColor}`}>
              {defconState.isPlatformShutdown ? 'PLATFORM OFFLINE' : defconState.status.toUpperCase()}
            </span>
          </div>
          <button
            onClick={() => {
              void fetchDefConState();
              void fetchGeoRestrictions();
            }}
            disabled={loadingDefcon || loadingGeo}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 disabled:opacity-50"
            title="Refresh telemetry"
          >
            <ArrowPathIcon className={`h-4 w-4 text-slate-600 ${loadingDefcon ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`mb-5 flex items-center justify-between rounded-lg border p-3 text-xs font-bold ${
            actionMessage.type === 'success'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
              : 'border-rose-300 bg-rose-50 text-rose-950'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="ml-4 text-slate-600 hover:text-slate-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('defcon')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-black transition-colors ${
            activeTab === 'defcon'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <SignalIcon className="h-4 w-4" />
          DefCon & Command (Levels 5 - 1)
        </button>
        <button
          onClick={() => setActiveTab('heatmap')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-black transition-colors ${
            activeTab === 'heatmap'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <GlobeAmericasIcon className="h-4 w-4" />
          Universal Geo-Restrictions & Heatmaps
        </button>
        <button
          onClick={() => setActiveTab('voicelines')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-black transition-colors ${
            activeTab === 'voicelines'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <SpeakerWaveIcon className="h-4 w-4" />
          Voice Line Cadence & Studio
        </button>
      </div>

      {/* TAB 1: DEFCON & COMMAND FIVE-LEVEL ALERT SYSTEM */}
      {activeTab === 'defcon' && (
        <div className="space-y-6">
          {/* Shutdown Alert Banner if offline */}
          {defconState.isPlatformShutdown && (
            <div className="rounded-xl border border-rose-400 bg-rose-50 p-5">
              <div className="flex items-start gap-3">
                <NoSymbolIcon className="h-6 w-6 flex-shrink-0 text-rose-600" />
                <div className="flex-1">
                  <h4 className="text-sm font-black text-rose-950">
                    PLATFORM OFFLINE: CONCLUSIVE, IRREVOCABLE, ABSOLUTE ALL CONSOLE IMMINENT SHUTDOWN
                  </h4>
                  <p className="mt-1 text-xs text-rose-900">
                    All external interfaces, socket connections, and management consoles are isolated. Cold-boot requires the SuperAdmin Reboot Order and Cryptographic Backup Code.
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Enter Sovereign Reboot Order (e.g. REBOOT-ALPHA-01)"
                      value={rebootOrderInput}
                      onChange={(e) => setRebootOrderInput(e.target.value)}
                      className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                    />
                    <input
                      type="password"
                      placeholder="Enter Cryptographic Backup Code (e.g. 749822)"
                      value={rebootCodeInput}
                      onChange={(e) => setRebootCodeInput(e.target.value)}
                      className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <button
                    onClick={handleRebootPlatform}
                    className="mt-3 flex items-center gap-2 rounded-lg bg-rose-700 px-4 py-2 text-xs font-black text-white hover:bg-rose-800"
                  >
                    <KeyIcon className="h-4 w-4" />
                    Authorize Cold-Boot & Restore Platform
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DefCon 1 Prompt Code Modal/Section if awaiting verification */}
          {!defconState.isPlatformShutdown && defconState.currentLevel === 1 && (
            <div className="rounded-xl border-2 border-rose-500 bg-rose-50 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-6 w-6 flex-shrink-0 text-rose-600 animate-pulse" />
                <div className="flex-1">
                  <h4 className="text-sm font-black text-rose-950">
                    DEFCON 1 ACTIVE: MAXIMUM EMERGENCY PROTOCOLS ENGAGED (PRO-MTS)
                  </h4>
                  <p className="mt-1 text-xs text-rose-900">
                    Automated encrypted dispatch sent to sovereign response ring: <span className="font-mono text-rose-950 font-bold">obinnambah100@gmail.com, gracelinkbustech@gmail.com, founder@fingermobileprotocol.com, eunicembah@gmail.com, philipatiks@yahoo.com</span>.
                  </p>
                  <p className="mt-1 text-xs font-bold text-rose-950">
                    Awaiting Prompt AI 6-Digit Numeric Token dispatched to SuperAdmin mobile GSM numbers.
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="6-Digit Token"
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      className="w-40 rounded-lg border-2 border-rose-400 bg-white px-3 py-2 text-center text-sm font-black tracking-widest text-slate-900"
                    />
                    <button
                      onClick={handleVerifyShutdown}
                      className="flex items-center gap-2 rounded-lg bg-rose-700 px-4 py-2 text-xs font-black text-white hover:bg-rose-800 shadow"
                    >
                      <LockClosedIcon className="h-4 w-4" />
                      Execute Conclusive, Irrevocable Absolute All Console Imminent Shutdown
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Defense Readiness Level Matrix Cards */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
            {DEFCON_LEVELS.map((item) => {
              const isSelected = defconState.currentLevel === item.level;
              return (
                <div
                  key={item.level}
                  className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50 shadow-md ring-2 ring-slate-900'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-black text-white ${item.indicatorColor}`}>
                        {item.level}
                      </span>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-black ${item.badgeColor}`}>
                        {item.name}
                      </span>
                    </div>

                    <h4 className="mt-3 text-xs font-black text-slate-900">{item.title}</h4>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-slate-700">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <p className="text-[10px] font-bold text-slate-600">SLA / Trigger:</p>
                    <p className="text-[10px] font-medium text-slate-800">{item.threshold}</p>
                    <button
                      onClick={() => handleSetDefCon(item.level)}
                      disabled={isSelected || defconState.isPlatformShutdown}
                      className={`mt-3 w-full rounded-lg py-1.5 text-xs font-black transition-colors ${
                        isSelected
                          ? 'bg-slate-900 text-white cursor-default'
                          : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 disabled:opacity-40'
                      }`}
                    >
                      {isSelected ? 'Active Level' : `Engage Level ${item.level}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Guardian Protocol Stack */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Coordinated Autonomous Defense Mesh:
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div className="rounded-lg border border-slate-300 bg-white p-3 text-center">
                <span className="text-xs font-black text-slate-900">Guardian AI</span>
                <p className="text-[10px] text-slate-600">Fraud & Zero-Trust</p>
                <span className="mt-1 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-950">Active</span>
              </div>
              <div className="rounded-lg border border-slate-300 bg-white p-3 text-center">
                <span className="text-xs font-black text-slate-900">Sentinel AI</span>
                <p className="text-[10px] text-slate-600">Perimeter Defense</p>
                <span className="mt-1 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-950">Active</span>
              </div>
              <div className="rounded-lg border border-slate-300 bg-white p-3 text-center">
                <span className="text-xs font-black text-slate-900">Sentient AI</span>
                <p className="text-[10px] text-slate-600">Cognitive Risk Scoring</p>
                <span className="mt-1 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-950">Active</span>
              </div>
              <div className="rounded-lg border border-slate-300 bg-white p-3 text-center">
                <span className="text-xs font-black text-slate-900">STERCS AI</span>
                <p className="text-[10px] text-slate-600">Console Security</p>
                <span className="mt-1 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-950">Active</span>
              </div>
              <div className="rounded-lg border border-slate-300 bg-white p-3 text-center">
                <span className="text-xs font-black text-slate-900">Prompt AI</span>
                <p className="text-[10px] text-slate-600">Token Dispatcher</p>
                <span className="mt-1 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-950">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UNIVERSAL PLATFORM GEO-RESTRICTIONS & HEATMAPS */}
      {activeTab === 'heatmap' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <GlobeAmericasIcon className="h-5 w-5 flex-shrink-0 text-blue-600" />
              <div>
                <h4 className="text-xs font-black text-blue-950">
                  Universal Sovereign Geofencing & Heatmap Protection
                </h4>
                <p className="mt-0.5 text-xs text-blue-900">
                  Enforces platform-wide or selective microservice quarantine across Continents, Countries, States, Districts, or Hot Areas. Blocks IP ranges and Hardware MAC addresses at the STERCS perimeter.
                </p>
              </div>
            </div>
          </div>

          {/* Add Restriction Form */}
          <form onSubmit={handleAddGeoRestriction} className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-black text-slate-900">Enforce New Geo-Restriction or Hot Area Lockdown</h4>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold text-slate-800">Jurisdiction Level</label>
                <select
                  value={newRegionType}
                  onChange={(e) => setNewRegionType(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                >
                  <option value="continent">Continent</option>
                  <option value="country">Country</option>
                  <option value="state">State / Province</option>
                  <option value="district">District / Municipality</option>
                  <option value="hot_area">Hot Area / Local Radius</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800">Region / Area Name</label>
                <input
                  type="text"
                  placeholder="e.g. Victoria Island, Lagos, Nigeria"
                  value={newRegionName}
                  onChange={(e) => setNewRegionName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800">Threat Severity</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                >
                  <option value="advisory">Advisory</option>
                  <option value="warning">Warning</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical Lockdown</option>
                </select>
              </div>
            </div>

            {/* Service Freeze Checkboxes */}
            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-black text-slate-900">
                  <input
                    type="checkbox"
                    checked={newFreezeAll}
                    onChange={(e) => setNewFreezeAll(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  Freeze All Platform Services for this Region
                </label>
                <span className="text-[11px] font-medium text-slate-600">
                  Or selectively choose microservices below:
                </span>
              </div>

              {!newFreezeAll && (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {PLATFORM_MICROSERVICES.map((ms) => {
                    const isChecked = newFrozenServices.includes(ms.key);
                    return (
                      <label
                        key={ms.key}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                          isChecked
                            ? 'border-rose-400 bg-rose-50 text-rose-950'
                            : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleFrozenService(ms.key)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-rose-600"
                        />
                        {ms.label}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Blocked IP / MAC inputs */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Blocked IP Addresses / Subnets (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 197.210.0.0/16, 102.89.44.12"
                  value={newBlockedIps}
                  onChange={(e) => setNewBlockedIps(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Blocked Hardware MAC Addresses (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 00:1A:2B:3C:4D:5E, AA:BB:CC:DD:EE:FF"
                  value={newBlockedMacs}
                  onChange={(e) => setNewBlockedMacs(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-800">Lockout Justification / Audit Reason</label>
              <input
                type="text"
                placeholder="e.g. Regulatory embargo, unverified cellular spoofing cluster, regional fraud surge"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-black text-white hover:bg-slate-800 shadow"
              >
                <NoSymbolIcon className="h-4 w-4" />
                Enforce Regional Quarantine
              </button>
            </div>
          </form>

          {/* Active Restrictions Table */}
          <div className="rounded-xl border border-slate-300 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Active Platform Geofence & Heatmap Rules ({geoRestrictions.length})
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 text-slate-800 font-black">
                    <th className="py-2.5 px-4">Jurisdiction / Area</th>
                    <th className="py-2.5 px-4">Scope</th>
                    <th className="py-2.5 px-4">Severity</th>
                    <th className="py-2.5 px-4">Perimeter Defense</th>
                    <th className="py-2.5 px-4">Reason</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {geoRestrictions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-slate-600">
                        No active geo-quarantines. All global platform services operational.
                      </td>
                    </tr>
                  ) : (
                    geoRestrictions.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {item.region_name}
                          <span className="block text-[10px] uppercase text-slate-600 font-semibold">
                            {item.region_type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-800">
                          {item.freeze_all_services ? (
                            <span className="inline-block rounded border border-rose-300 bg-rose-50 px-2 py-0.5 text-[10px] font-black text-rose-950">
                              All Platform Services Frozen
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(item.frozen_services) && item.frozen_services.length > 0 ? (
                                item.frozen_services.map((s) => (
                                  <span key={s} className="rounded bg-slate-100 border border-slate-300 px-1.5 py-0.5 text-[9px] font-bold text-slate-800">
                                    {s}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] text-slate-600">General monitoring</span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-black uppercase ${
                            item.severity === 'critical'
                              ? 'border border-rose-400 bg-rose-100 text-rose-950'
                              : 'border border-amber-400 bg-amber-100 text-amber-950'
                          }`}>
                            {item.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 text-[11px]">
                          <div>IPs: {Array.isArray(item.blocked_ips) ? item.blocked_ips.length : 0}</div>
                          <div>MACs: {Array.isArray(item.blocked_macs) ? item.blocked_macs.length : 0}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                          {item.reason || '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteGeoRestriction(item.id)}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-50"
                          >
                            Lift
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VOICE LINE CADENCE & STUDIO */}
      {activeTab === 'voicelines' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
            <div className="flex items-start gap-3">
              <SpeakerWaveIcon className="h-5 w-5 flex-shrink-0 text-purple-600" />
              <div>
                <h4 className="text-xs font-black text-purple-950">
                  Global Voice Lines Cadence, Volume & Studio Console
                </h4>
                <p className="mt-0.5 text-xs text-purple-900">
                  Calibrate natural African voice line tempo, sound level, and microservice integration. Default calibrated to 0.85x for relaxed, resonant cadence.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Playback Tempo Controller */}
            <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-900">Voice Line Playback Tempo</span>
                <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-black text-emerald-400">
                  {(voiceSettings.playbackRate ?? 0.85).toFixed(2)}x
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-700">
                Calibrated speed range from 0.50x (slowest) to 1.50x (fastest). Baseline standard is 0.85x.
              </p>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={voiceSettings.playbackRate ?? 0.85}
                onChange={handleTempoChange}
                className="mt-4 w-full accent-slate-900"
              />
              <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-600">
                <span>0.50x (Slow)</span>
                <span className="text-emerald-700 font-black">0.85x (Calibrated Standard)</span>
                <span>1.50x (Fast)</span>
              </div>
            </div>

            {/* Volume Controller */}
            <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-900">Master Audio Volume</span>
                <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-black text-emerald-400">
                  {Math.round((voiceSettings.volume ?? 0.35) * 100)}%
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-700">
                Controls ambient commentary sound level across all web and mobile clients.
              </p>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={voiceSettings.volume ?? 0.35}
                onChange={handleVolumeChange}
                className="mt-4 w-full accent-slate-900"
              />
              <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-600">
                <span>0% (Mute)</span>
                <span className="text-emerald-700 font-black">35% (Comfort Volume)</span>
                <span>100% (Max)</span>
              </div>
            </div>
          </div>

          {/* Microservice Voice Toggles */}
          <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
            <h4 className="text-xs font-black uppercase text-slate-900">Microservice Commentary Audio Toggles</h4>
            <p className="mt-1 text-xs text-slate-700">
              Enable or silence automated cultured African commentary voice lines per microservice:
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-6">
              {['forum', 'hallmarks', 'mii', 'groups', 'lushpressies', 'blogs'].map((key) => {
                const isEnabled = !!voiceSettings.microservices[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleToggleVoiceMicroservice(key)}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-bold transition-colors ${
                      isEnabled
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-950'
                        : 'border-slate-300 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="capitalize">{key}</span>
                    {isEnabled ? (
                      <CheckCircleIcon className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <NoSymbolIcon className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Playback Preview Console */}
          <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
            <h4 className="text-xs font-black uppercase text-slate-900">Interactive African Voice Line Audition Studio</h4>
            <p className="mt-1 text-xs text-slate-700">
              Test live sound playback with active tempo and volume calibration:
            </p>

            <div className="mt-4 flex flex-wrap gap-2.5">
              {SAMPLE_VOICE_PREVIEWS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => voiceLineServiceInstance.playCommentaryVoiceLine(sample.category)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 hover:border-slate-900 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <PlayIcon className="h-3.5 w-3.5 text-emerald-600" />
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StercsControlCenter;
