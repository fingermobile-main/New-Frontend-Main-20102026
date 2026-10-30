import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheckIcon,
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
  CloudArrowUpIcon,
  ClockIcon,
  WifiIcon,
  ServerStackIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import voiceLineServiceInstance, {
  VoiceLineSettings,
} from '../../services/VoiceLineService';
import {
  CONTINENTS_DATA,
  COUNTRIES_BY_CONTINENT,
  ALL_SOVEREIGN_COUNTRIES,
  NIGERIAN_STATES_AND_LGAS,
  PLATFORM_ALL_SERVICES,
  CURATED_NETWORK_PROVIDERS,
  KNOWN_VPN_PROVIDERS,
  NetworkProviderItem,
} from '../../data/sovereignGeoData';

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
  continent?: string;
  country?: string;
  state_province?: string;
  district_lga?: string;
  freeze_all_services: boolean;
  frozen_services: string[];
  duration_value?: number;
  duration_unit?: string;
  expires_at?: string | null;
  blocked_ips: string[];
  blocked_macs: string[];
  blocked_isps?: string[];
  block_vpn_proxies?: boolean;
  satellite_roaming_safe_harbor?: boolean;
  enforcement_level?: string;
  severity: string;
  reason: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
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

export interface StercsControlCenterProps {
  defaultTab?: 'defcon' | 'heatmap' | 'voicelines';
}

const StercsControlCenter: React.FC<StercsControlCenterProps> = ({ defaultTab }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const getInitialTab = (): 'defcon' | 'heatmap' | 'voicelines' => {
    const sub = searchParams.get('subtab') || searchParams.get('tab') || searchParams.get('view') || searchParams.get('section');
    if (sub === 'voicelines' || sub === 'voiceline') return 'voicelines';
    if (sub === 'heatmap') return 'heatmap';
    if (sub === 'defcon') return 'defcon';
    return defaultTab || 'defcon';
  };
  const [activeTab, setActiveTab] = useState<'defcon' | 'heatmap' | 'voicelines'>(getInitialTab);

  useEffect(() => {
    const sub = searchParams.get('subtab') || searchParams.get('view') || searchParams.get('section');
    if (sub === 'voicelines' || sub === 'voiceline') {
      setActiveTab('voicelines');
    } else if (sub === 'heatmap') {
      setActiveTab('heatmap');
    } else if (sub === 'defcon') {
      setActiveTab('defcon');
    }
  }, [searchParams]);

  const handleTabClick = (tab: 'defcon' | 'heatmap' | 'voicelines') => {
    setActiveTab(tab);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('subtab', tab);
      return next;
    }, { replace: true });
  };
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
  const [newRegionType, setNewRegionType] = useState<'continent' | 'country' | 'state' | 'district' | 'hot_area'>('country');
  const [newContinent, setNewContinent] = useState<string>('africa');
  const [newCountryCode, setNewCountryCode] = useState<string>('NG');
  const [newCountryName, setNewCountryName] = useState<string>('Nigeria');
  const [newStateName, setNewStateName] = useState<string>('Lagos');
  const [newDistrictLga, setNewDistrictLga] = useState<string>('Eti-Osa (Victoria Island / Lekki / Ikoyi)');
  const [newHotAreaRadiusKm, setNewHotAreaRadiusKm] = useState<number>(5);
  const [newCustomAreaName, setNewCustomAreaName] = useState<string>('');

  // Service shutdown & duration
  const [newFreezeAll, setNewFreezeAll] = useState(false);
  const [newFrozenServices, setNewFrozenServices] = useState<string[]>([]);
  const [durationValue, setDurationValue] = useState<number>(24);
  const [durationUnit, setDurationUnit] = useState<'minutes' | 'hours' | 'days' | 'weeks' | 'indefinite'>('hours');
  const [serviceSearchTerm, setServiceSearchTerm] = useState<string>('');
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState<boolean>(false);

  // Network & perimeter defense
  const [newBlockedIps, setNewBlockedIps] = useState('');
  const [newBlockedMacs, setNewBlockedMacs] = useState('');
  const [selectedIsps, setSelectedIsps] = useState<string[]>([]);
  const [blockVpnProxies, setBlockVpnProxies] = useState<boolean>(true);
  const [satelliteSafeHarbor, setSatelliteSafeHarbor] = useState<boolean>(true);
  const [enforcementLevel, setEnforcementLevel] = useState<'application_waf' | 'bgp_asn_drop' | 'perimeter_firewall'>('application_waf');

  // Severity & audit reason
  const [newSeverity, setNewSeverity] = useState('warning');
  const [newReason, setNewReason] = useState('');
  const [isSubmittingGeo, setIsSubmittingGeo] = useState(false);

  // Voice Line Studio state
  const [voiceSettings, setVoiceSettings] = useState<VoiceLineSettings>(() =>
    voiceLineServiceInstance.getSettings()
  );
  const [testPhrase, setTestPhrase] = useState('Welcome to FingerMobile Sovereign Protocol, the voice lines are live.');
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [isSavingVoiceSettings, setIsSavingVoiceSettings] = useState(false);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string | null>(null);
  const [rotationStatus, setRotationStatus] = useState(() => voiceLineServiceInstance.getRotationStatus());

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
    // Hydrate VoiceLine settings from PostgreSQL backend on mount
    voiceLineServiceInstance.syncSettingsWithBackend().then((synced) => {
      setVoiceSettings({ ...synced });
      setRotationStatus(voiceLineServiceInstance.getRotationStatus());
    }).catch(() => {});
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

  const getResolvedRegionName = useCallback((): string => {
    if (newRegionType === 'continent') {
      const cont = CONTINENTS_DATA.find((c) => c.id === newContinent);
      return cont ? `${cont.name} (${cont.countriesCount} Sovereign Nations)` : 'Africa (54 Sovereign Nations)';
    }
    if (newRegionType === 'country') {
      return newCountryName || 'Nigeria';
    }
    if (newRegionType === 'state') {
      return `${newStateName || 'Lagos'}, ${newCountryName || 'Nigeria'}`;
    }
    if (newRegionType === 'district') {
      return `${newDistrictLga || 'Eti-Osa'}, ${newStateName || 'Lagos'}, ${newCountryName || 'Nigeria'}`;
    }
    if (newRegionType === 'hot_area') {
      const area = newCustomAreaName.trim() || newDistrictLga || newStateName || 'Financial Enclave';
      return `${area} [${newHotAreaRadiusKm}km Sovereign Perimeter], ${newCountryName || 'Nigeria'}`;
    }
    return newCountryName || 'Sovereign Jurisdiction';
  }, [newRegionType, newContinent, newCountryName, newStateName, newDistrictLga, newHotAreaRadiusKm, newCustomAreaName]);

  const handleSelectContinent = (continentId: string) => {
    setNewContinent(continentId);
    const countries = COUNTRIES_BY_CONTINENT[continentId] || [];
    if (countries.length > 0) {
      setNewCountryCode(countries[0].code);
      setNewCountryName(countries[0].name);
    }
  };

  const handleSelectCountry = (code: string) => {
    const found = ALL_SOVEREIGN_COUNTRIES.find((c) => c.code === code);
    if (found) {
      setNewCountryCode(found.code);
      setNewCountryName(found.name);
      setNewContinent(found.continentId);
      if (found.code === 'NG') {
        setNewStateName('Lagos');
        setNewDistrictLga('Eti-Osa (Victoria Island / Lekki / Ikoyi)');
      }
    }
  };

  const handleSelectState = (state: string) => {
    setNewStateName(state);
    const lgas = NIGERIAN_STATES_AND_LGAS[state] || [];
    if (lgas.length > 0) {
      setNewDistrictLga(lgas[0]);
    }
  };

  const handleSelectDistrictLga = (lga: string) => {
    setNewDistrictLga(lga);
  };

  const handleToggleIsp = (provider: NetworkProviderItem) => {
    const isAlreadySelected = selectedIsps.includes(provider.name);
    if (isAlreadySelected) {
      setSelectedIsps((prev) => prev.filter((name) => name !== provider.name));
    } else {
      setSelectedIsps((prev) => [...prev, provider.name]);
      const existingIps = newBlockedIps ? newBlockedIps.split(',').map((s) => s.trim()).filter(Boolean) : [];
      const merged = Array.from(new Set([...existingIps, ...provider.subnets]));
      setNewBlockedIps(merged.join(', '));
    }
  };

  const handleToggleFrozenService = (key: string) => {
    setNewFrozenServices((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSelectAllServices = () => {
    setNewFrozenServices(PLATFORM_ALL_SERVICES.map((s) => s.key));
  };

  const handleClearAllServices = () => {
    setNewFrozenServices([]);
  };

  const handleSelectServiceCategory = (category: string) => {
    const keys = PLATFORM_ALL_SERVICES.filter((s) => s.category === category).map((s) => s.key);
    setNewFrozenServices((prev) => Array.from(new Set([...prev, ...keys])));
  };

  const handleAddGeoRestriction = async (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedName = getResolvedRegionName();
    if (!resolvedName.trim()) return;

    setIsSubmittingGeo(true);
    setActionMessage(null);
    try {
      const res = await axios.post('/api/stercs/geo-restrictions', {
        region_type: newRegionType,
        region_name: resolvedName,
        continent: newContinent,
        country: newCountryName,
        state_province: newRegionType === 'state' || newRegionType === 'district' || newRegionType === 'hot_area' ? newStateName : null,
        district_lga: newRegionType === 'district' || newRegionType === 'hot_area' ? newDistrictLga : null,
        freeze_all_services: newFreezeAll,
        frozen_services: newFreezeAll ? PLATFORM_ALL_SERVICES.map((s) => s.key) : newFrozenServices,
        duration_value: durationUnit === 'indefinite' ? null : durationValue,
        duration_unit: durationUnit,
        blocked_ips: newBlockedIps ? newBlockedIps.split(',').map((s) => s.trim()).filter(Boolean) : [],
        blocked_macs: newBlockedMacs ? newBlockedMacs.split(',').map((s) => s.trim()).filter(Boolean) : [],
        blocked_isps: selectedIsps,
        block_vpn_proxies: blockVpnProxies,
        satellite_roaming_safe_harbor: satelliteSafeHarbor,
        enforcement_level: enforcementLevel,
        severity: newSeverity,
        reason: newReason.trim() || `Sovereign ${newRegionType} geofencing perimeter quarantine enforced.`,
      });
      if (res.data?.success) {
        setNewReason('');
        setNewCustomAreaName('');
        setNewBlockedIps('');
        setNewBlockedMacs('');
        setSelectedIsps([]);
        setNewFrozenServices([]);
        setNewFreezeAll(false);
        setActionMessage({
          type: 'success',
          text: `Sovereign perimeter geofence successfully enforced on ${resolvedName}.`
        });
        void fetchGeoRestrictions();
      }
    } catch (err: unknown) {
      setActionMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to enforce sovereign geo-restriction.',
      });
    } finally {
      setIsSubmittingGeo(false);
    }
  };

  const handleDeleteGeoRestriction = async (id: number) => {
    try {
      await axios.delete(`/api/stercs/geo-restrictions/${id}`);
      setGeoRestrictions((prev) => prev.filter((item) => item.id !== id));
      setActionMessage({ type: 'success', text: 'Sovereign geo-restriction successfully lifted.' });
    } catch {
      setActionMessage({ type: 'error', text: 'Failed to lift sovereign geo-restriction.' });
    }
  };


  const handleUtteranceRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value);
    voiceLineServiceInstance.setUtteranceRate(rate);
    setVoiceSettings({ ...voiceLineServiceInstance.getSettings() });
  };

  const handleAudioPlaybackRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value);
    voiceLineServiceInstance.setAudioPlaybackRate(rate);
    setVoiceSettings({ ...voiceLineServiceInstance.getSettings() });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    voiceLineServiceInstance.setVolume(vol);
    setVoiceSettings({ ...voiceLineServiceInstance.getSettings() });
  };

  const handleBassBoostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const db = parseFloat(e.target.value);
    voiceLineServiceInstance.setBassBoostDb(db);
    setVoiceSettings({ ...voiceLineServiceInstance.getSettings() });
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pitch = parseFloat(e.target.value);
    voiceLineServiceInstance.setPitch(pitch);
    setVoiceSettings({ ...voiceLineServiceInstance.getSettings() });
  };

  const handleSpeakCustom = (textToSpeak?: string) => {
    setIsPlayingTest(true);
    voiceLineServiceInstance.speakCustomText(textToSpeak || testPhrase);
    setTimeout(() => setIsPlayingTest(false), 2000);
  };

  const handleToggleVoiceMicroservice = (msKey: string) => {
    const current = !!voiceSettings.microservices[msKey];
    voiceLineServiceInstance.setMicroserviceVoiceLineEnabled(msKey, !current);
    setVoiceSettings({ ...voiceLineServiceInstance.getSettings() });
  };

  const handleSaveVoiceLineSettings = async () => {
    setIsSavingVoiceSettings(true);
    setActionMessage(null);
    try {
      const res = await voiceLineServiceInstance.persistSettingsToBackend(voiceSettings);
      if (res.success) {
        const timeStr = new Date().toLocaleTimeString();
        setLastSavedTimestamp(timeStr);
        setVoiceSettings({ ...res.settings });
        setRotationStatus(voiceLineServiceInstance.getRotationStatus());
        setActionMessage({
          type: 'success',
          text: `VoiceLine preferences successfully saved to PostgreSQL database (voiceline_system_settings) at ${timeStr}.`
        });
      } else {
        setActionMessage({
          type: 'error',
          text: `Notice: ${res.message}`
        });
      }
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error persisting settings to PostgreSQL.'
      });
    } finally {
      setIsSavingVoiceSettings(false);
    }
  };

  const handleReloadFromDatabase = async () => {
    try {
      const synced = await voiceLineServiceInstance.syncSettingsWithBackend();
      setVoiceSettings({ ...synced });
      setRotationStatus(voiceLineServiceInstance.getRotationStatus());
      setActionMessage({
        type: 'success',
        text: 'VoiceLine preferences reloaded directly from PostgreSQL database.'
      });
    } catch {
      setActionMessage({
        type: 'error',
        text: 'Could not reach backend PostgreSQL database.'
      });
    }
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
          onClick={() => handleTabClick('defcon')}
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
          onClick={() => handleTabClick('heatmap')}
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
          onClick={() => handleTabClick('voicelines')}
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
                    Automated encrypted dispatch sent to sovereign response ring: <span className="font-mono text-rose-950 font-bold">obinnambah100@gmail.com, gracelinkbustech@gmail.com, obinnambah@fingermobileprotocol.com, eunicembah@gmail.com, philipatiks@yahoo.com</span>.
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
          {/* Header Card */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <GlobeAmericasIcon className="h-5 w-5 flex-shrink-0 text-blue-600" />
              <div>
                <h4 className="text-xs font-black text-blue-950">
                  Universal Sovereign Geofencing & Heatmap Protection
                </h4>
                <p className="mt-0.5 text-xs text-blue-900">
                  Granular multi-level sovereign perimeter defense: 7 Continents, 195 Sovereign Countries (193 UN members & 2 observer states), Sub-national Jurisdictions (States, Districts, Local Government Areas), and Hot Areas. Enforce selective microservice quarantines across all 25 platform services, schedule durations, auto-curate ISP subnets, and filter VPN/Tor proxies with Starlink satellite safe-harbor protection.
                </p>
              </div>
            </div>
          </div>

          {/* Sovereign Perimeter Defense & Heatmap Telemetry Bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div className="rounded-xl border border-slate-300 bg-white p-3.5 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-slate-700">Active Geofences</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">{geoRestrictions.length}</span>
                <span className="text-[10px] font-semibold text-emerald-800">Perimeters Enforced</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-300 bg-white p-3.5 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-slate-700">Global Coverage</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">195</span>
                <span className="text-[10px] font-semibold text-slate-700">7 Continents</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-300 bg-white p-3.5 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-slate-700">Microservice Grid</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">25</span>
                <span className="text-[10px] font-semibold text-purple-800">Quarantine Capable</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-300 bg-white p-3.5 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-slate-700">VPN / Tor Filtering</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="rounded bg-rose-100 border border-rose-300 px-1.5 py-0.5 text-[10px] font-black text-rose-950">
                  {blockVpnProxies ? 'Active' : 'Bypassed'}
                </span>
                <span className="text-[10px] text-slate-700">MaxMind GeoIP</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-300 bg-white p-3.5 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-slate-700">Satellite Safe-Harbor</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="rounded bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 text-[10px] font-black text-emerald-950">
                  {satelliteSafeHarbor ? 'Armed' : 'Disabled'}
                </span>
                <span className="text-[10px] text-slate-700">Starlink Guard</span>
              </div>
            </div>
          </div>

          {/* Enforce New Sovereign Restriction Form */}
          <form onSubmit={handleAddGeoRestriction} className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  Enforce Sovereign Jurisdiction Geofence or Hot Area Lockdown
                </h4>
                <p className="text-xs text-slate-700">
                  Select geographic jurisdiction from the official global hierarchy and configure perimeter parameters.
                </p>
              </div>

              {/* Resolved Target Pill */}
              <div className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-right">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-600 block">Formulated Perimeter Target:</span>
                <span className="text-xs font-black text-slate-900">{getResolvedRegionName()}</span>
              </div>
            </div>

            {/* STEP 1: JURISDICTION SELECTION */}
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <GlobeAmericasIcon className="h-4 w-4 text-blue-600" />
                Step 1: Select Sovereign Jurisdiction & Geographic Scope
              </span>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Jurisdiction Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Jurisdiction Level
                  </label>
                  <select
                    value={newRegionType}
                    onChange={(e) => setNewRegionType(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="continent">Continent (7 Continents)</option>
                    <option value="country">Sovereign Country (195 Nations)</option>
                    <option value="state">State / Province (Regional)</option>
                    <option value="district">District / Local Government Area (LGA)</option>
                    <option value="hot_area">Hot Area / Localized Perimeter Radius</option>
                  </select>
                </div>

                {/* Continent Dropdown (7 Continents) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Continent (7 Continents)
                  </label>
                  <select
                    value={newContinent}
                    onChange={(e) => handleSelectContinent(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    {CONTINENTS_DATA.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.countriesCount} Countries)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Country Dropdown (195 Countries) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Sovereign Country ({COUNTRIES_BY_CONTINENT[newContinent]?.length || 195} in {CONTINENTS_DATA.find(c => c.id === newContinent)?.name || 'Region'})
                  </label>
                  <select
                    value={newCountryCode}
                    onChange={(e) => handleSelectCountry(e.target.value)}
                    disabled={newRegionType === 'continent'}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    {(COUNTRIES_BY_CONTINENT[newContinent] || ALL_SOVEREIGN_COUNTRIES).map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Threat Severity */}
                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Threat Severity & Response Tier
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="advisory">Advisory (Traffic Telemetry & Alerting)</option>
                    <option value="warning">Warning (Heightened Inspection & CAPTCHA)</option>
                    <option value="high">High Risk (Selective Microservice Drop)</option>
                    <option value="critical">Critical Lockdown (Total Perimeter Severance)</option>
                  </select>
                </div>
              </div>

              {/* Sub-national Jurisdictions (States, Districts, LGAs, Hot Areas) */}
              {(newRegionType === 'state' || newRegionType === 'district' || newRegionType === 'hot_area') && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* State / Province Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800">
                      State / Province / Federal Territory
                    </label>
                    {newCountryCode === 'NG' ? (
                      <select
                        value={newStateName}
                        onChange={(e) => handleSelectState(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                      >
                        {Object.keys(NIGERIAN_STATES_AND_LGAS).map((st) => (
                          <option key={st} value={st}>
                            {st} State / Territory
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="e.g. Ontario, California, Bavaria, Gauteng"
                        value={newStateName}
                        onChange={(e) => setNewStateName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                      />
                    )}
                  </div>

                  {/* District / LGA Selector */}
                  {(newRegionType === 'district' || newRegionType === 'hot_area') && (
                    <div>
                      <label className="block text-xs font-bold text-slate-800">
                        District / Local Government Area (LGA)
                      </label>
                      {newCountryCode === 'NG' && NIGERIAN_STATES_AND_LGAS[newStateName] ? (
                        <select
                          value={newDistrictLga}
                          onChange={(e) => handleSelectDistrictLga(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                        >
                          {NIGERIAN_STATES_AND_LGAS[newStateName].map((lga) => (
                            <option key={lga} value={lga}>
                              {lga}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder="e.g. Financial Enclave, Downtown District, Port Zone"
                          value={newDistrictLga}
                          onChange={(e) => setNewDistrictLga(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                        />
                      )}
                    </div>
                  )}

                  {/* Hot Area Radius / Custom Landmark */}
                  {newRegionType === 'hot_area' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-800">
                        Hot Area Radius: {newHotAreaRadiusKm} km Perimeter
                      </label>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="range"
                          min="1"
                          max="50"
                          step="1"
                          value={newHotAreaRadiusKm}
                          onChange={(e) => setNewHotAreaRadiusKm(parseInt(e.target.value, 10))}
                          className="flex-1 accent-rose-600"
                        />
                        <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-black text-rose-400">
                          {newHotAreaRadiusKm} km
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* STEP 2: MULTI-SERVICE QUARANTINE ENGINE (ALL 25 PLATFORM SERVICES) */}
            <div className="border-t border-slate-200 pt-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <ServerStackIcon className="h-4 w-4 text-purple-600" />
                    Step 2: Platform Services Shutdown Selection (All 25 Services)
                  </span>
                  <p className="mt-0.5 text-xs text-slate-700">
                    Turn off the entire platform for this jurisdiction or selectively isolate specific microservices and financial rails.
                  </p>
                </div>

                {/* Master Freeze Toggle */}
                <label className="flex items-center gap-2.5 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-black text-rose-950 cursor-pointer shadow-sm">
                  <input
                    type="checkbox"
                    checked={newFreezeAll}
                    onChange={(e) => setNewFreezeAll(e.target.checked)}
                    className="h-4 w-4 rounded border-rose-400 text-rose-600 focus:ring-rose-600"
                  />
                  <span>Freeze ALL 25 Platform Services</span>
                </label>
              </div>

              {/* Master Freeze Banner Warning */}
              {newFreezeAll ? (
                <div className="rounded-xl border border-rose-400 bg-rose-100 p-4">
                  <div className="flex items-center gap-3">
                    <NoSymbolIcon className="h-6 w-6 text-rose-700 flex-shrink-0" />
                    <div>
                      <h5 className="text-xs font-black text-rose-950 uppercase tracking-wide">
                        Absolute Sovereign Blackout Active for {getResolvedRegionName()}
                      </h5>
                      <p className="text-xs text-rose-900 mt-0.5">
                        All 25 platform microservices, OTT video playout, music streams, financial rails (NIBSS, Paystack, Flutterwave), FIC minting, UGC forum threads, and e-commerce checkout will be severed for requests originating from this jurisdiction.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Quick Action Chips & Search */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-700 mr-1">Quick Select:</span>
                      <button
                        type="button"
                        onClick={handleSelectAllServices}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-[11px] font-bold text-slate-900 hover:bg-slate-100 cursor-pointer"
                      >
                        All 25 Services
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectServiceCategory('commerce')}
                        className="px-2.5 py-1 rounded-lg border border-amber-300 bg-amber-50 text-[11px] font-bold text-amber-950 hover:bg-amber-100 cursor-pointer"
                      >
                        Commerce & Rails (8)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectServiceCategory('media_ugc')}
                        className="px-2.5 py-1 rounded-lg border border-blue-300 bg-blue-50 text-[11px] font-bold text-blue-950 hover:bg-blue-100 cursor-pointer"
                      >
                        Media & VoD UGC (8)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectServiceCategory('social_identity')}
                        className="px-2.5 py-1 rounded-lg border border-purple-300 bg-purple-50 text-[11px] font-bold text-purple-950 hover:bg-purple-100 cursor-pointer"
                      >
                        Social & Gaming (5)
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAllServices}
                        className="px-2 py-1 rounded-lg border border-slate-300 bg-white text-[11px] font-bold text-rose-700 hover:bg-rose-50 cursor-pointer"
                      >
                        Clear Selection
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-black text-rose-400">
                        {newFrozenServices.length} / 25 Selected
                      </span>
                      <input
                        type="text"
                        placeholder="Search services..."
                        value={serviceSearchTerm}
                        onChange={(e) => setServiceSearchTerm(e.target.value)}
                        className="p-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-900 font-medium w-36 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* 25 Microservices Grid */}
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 max-h-72 overflow-y-auto p-1 border border-slate-200 rounded-xl">
                    {PLATFORM_ALL_SERVICES
                      .filter((ms) =>
                        !serviceSearchTerm ||
                        ms.label.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
                        ms.description.toLowerCase().includes(serviceSearchTerm.toLowerCase())
                      )
                      .map((ms) => {
                        const isChecked = newFrozenServices.includes(ms.key);
                        return (
                          <label
                            key={ms.key}
                            className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-xs transition-colors cursor-pointer ${
                              isChecked
                                ? 'border-rose-400 bg-rose-50 text-rose-950 shadow-sm'
                                : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleFrozenService(ms.key)}
                              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-black text-slate-900 truncate">{ms.label}</span>
                                <span className="text-[9px] uppercase font-bold text-slate-600 bg-slate-100 rounded px-1.5 py-0.2">
                                  {ms.category.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-700 leading-tight mt-0.5 line-clamp-1">
                                {ms.description}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3: DURATION SCHEDULER */}
            <div className="border-t border-slate-200 pt-5 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-amber-600" />
                Step 3: Quarantine Duration & Auto-Expiry Lifecycle
              </span>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Duration Value
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    disabled={durationUnit === 'indefinite'}
                    value={durationValue}
                    onChange={(e) => setDurationValue(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Duration Unit
                  </label>
                  <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="minutes">Minutes (Emergency Incident)</option>
                    <option value="hours">Hours (Threat Lockdown)</option>
                    <option value="days">Days (Regional Curfew / Embargo)</option>
                    <option value="weeks">Weeks (Sovereign Quarantine)</option>
                    <option value="indefinite">Indefinite (Until Manually Lifted)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="rounded-lg border border-amber-300 bg-amber-50 p-2.5">
                    <span className="text-[10px] font-black uppercase text-amber-950 block">Auto-Expiry Status:</span>
                    <span className="text-xs font-bold text-amber-900">
                      {durationUnit === 'indefinite'
                        ? 'Permanent Lockdown (Manual Lift Required)'
                        : `${durationValue} ${durationUnit} from activation time`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 4: PERIMETER NETWORK DEFENSE, ISP CURATIONS & VPN DROPS */}
            <div className="border-t border-slate-200 pt-5 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <WifiIcon className="h-4 w-4 text-emerald-600" />
                Step 4: Perimeter IP Subnets, ISP Curations & Hardware MAC Defense
              </span>

              {/* Curated ISP Buttons */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">
                    Auto-Curate Specific Network Provider / Internet Service Provider (ISP) Block:
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600">
                    Click provider to automatically curate and inject IP subnets into blocklist:
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {CURATED_NETWORK_PROVIDERS.map((provider) => {
                    const isSelected = selectedIsps.includes(provider.name);
                    return (
                      <button
                        key={provider.asn}
                        type="button"
                        onClick={() => handleToggleIsp(provider)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'border-rose-400 bg-rose-50 text-rose-950 shadow-sm'
                            : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <span>{isSelected ? '✓' : '+'}</span>
                        <span>{provider.name}</span>
                        <span className="text-[10px] font-normal text-slate-600">({provider.asn})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Blocked IP & Hardware MAC Inputs */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      Blocked IP Addresses / Subnets (Comma-separated)
                    </label>
                    <span className="text-[10px] text-slate-600 font-semibold">
                      {newBlockedIps ? newBlockedIps.split(',').filter(Boolean).length : 0} Subnets Defined
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 197.210.0.0/16, 102.89.44.12, 105.112.0.0/15"
                    value={newBlockedIps}
                    onChange={(e) => setNewBlockedIps(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                  />
                  <p className="mt-1 text-[11px] text-slate-600">
                    Accepts individual IPv4/IPv6 addresses and CIDR network subnets.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      Blocked Hardware MAC Addresses (Comma-separated)
                    </label>
                    <span className="text-[10px] text-slate-600 font-semibold">
                      {newBlockedMacs ? newBlockedMacs.split(',').filter(Boolean).length : 0} MACs Defined
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 00:1A:2B:3C:4D:5E, AA:BB:CC:DD:EE:FF"
                    value={newBlockedMacs}
                    onChange={(e) => setNewBlockedMacs(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                  />
                  <p className="mt-1 text-[11px] text-slate-600">
                    Filters hardware identifiers and mobile radio MAC addresses at gateway ingress.
                  </p>
                </div>
              </div>

              {/* VPN / Proxies & Satellite Safe-Harbor Switches */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Block VPNs */}
                <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={blockVpnProxies}
                      onChange={(e) => setBlockVpnProxies(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                    <div>
                      <span className="text-xs font-black text-slate-900 block">
                        Block Known VPNs, Commercial Proxies & Tor Exit Nodes
                      </span>
                      <p className="text-[11px] text-slate-700 mt-0.5 leading-snug">
                        Prevents regional bypass via NordVPN, ExpressVPN, Surfshark, Tor exit relays, and datacenter proxy nodes (MaxMind GeoIP integration).
                      </p>
                    </div>
                  </label>
                </div>

                {/* Satellite & Cellular Roaming Safe-Harbor */}
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-sm">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={satelliteSafeHarbor}
                      onChange={(e) => setSatelliteSafeHarbor(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="text-xs font-black text-amber-950 block flex items-center gap-1.5">
                        <ExclamationTriangleIcon className="h-4 w-4 text-amber-700" />
                        Enable Satellite (Starlink) & Cellular Roaming Safe-Harbor
                      </span>
                      <p className="text-[11px] text-amber-900 mt-0.5 leading-snug">
                        Prevents collateral lockout. Satellite providers (Starlink LEO) and cellular roaming networks occasionally misallocate IP blocks across borders. Safe-Harbor exempts verified legitimate mobile roaming traffic.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Enforcement Layer Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Perimeter Enforcement Architecture Layer
                </label>
                <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { key: 'application_waf', label: 'Application WAF & CDN Level', desc: 'Drops inbound traffic at Cloudflare edge before reaching origin server' },
                    { key: 'perimeter_firewall', label: 'Corporate NGFW Gateway', desc: 'Palo Alto / Fortinet Access Control Policy (ACP) zone drop' },
                    { key: 'bgp_asn_drop', label: 'BGP ASN & Backbone Drop', desc: 'Sovereign null-route dropping traffic at ISP peering points' },
                  ].map((layer) => (
                    <label
                      key={layer.key}
                      className={`flex flex-col rounded-lg border p-3 text-xs cursor-pointer transition-colors ${
                        enforcementLevel === layer.key
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black">{layer.label}</span>
                        <input
                          type="radio"
                          name="enforcement_level"
                          checked={enforcementLevel === layer.key}
                          onChange={() => setEnforcementLevel(layer.key as any)}
                          className="h-3.5 w-3.5"
                        />
                      </div>
                      <span className={`text-[11px] mt-1 ${enforcementLevel === layer.key ? 'text-slate-300' : 'text-slate-700'}`}>
                        {layer.desc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 5: AUDIT JUSTIFICATION & SUBMISSION */}
            <div className="border-t border-slate-200 pt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  Lockout Justification & Compliance Audit Log Reason
                </label>
                <input
                  type="text"
                  placeholder="e.g. Regulatory embargo, unverified cellular spoofing cluster, regional fraud surge"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <div className="text-xs text-slate-700">
                  Enforcing will persist rule to PostgreSQL (<code className="font-bold text-slate-900">stercs_geo_restrictions</code>) and immediately broadcast perimeter drop rules to all nodes.
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingGeo}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-black text-white hover:bg-rose-700 transition shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingGeo ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 animate-spin text-rose-400" />
                      <span>Enforcing Perimeter...</span>
                    </>
                  ) : (
                    <>
                      <NoSymbolIcon className="h-4 w-4 text-rose-400" />
                      <span>Enforce Sovereign Regional Quarantine</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Active Restrictions Table */}
          <div className="rounded-xl border border-slate-300 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Active Sovereign Geofence & Heatmap Rules ({geoRestrictions.length})
              </h4>
              <span className="text-[11px] font-bold text-slate-600">
                Persisted in PostgreSQL Table: <code className="text-slate-900">stercs_geo_restrictions</code>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 text-slate-800 font-black">
                    <th className="py-2.5 px-4">Jurisdiction & Scope</th>
                    <th className="py-2.5 px-4">Services Frozen</th>
                    <th className="py-2.5 px-4">Duration & Lifecycle</th>
                    <th className="py-2.5 px-4">Threat Tier</th>
                    <th className="py-2.5 px-4">Perimeter Defense</th>
                    <th className="py-2.5 px-4">Audit Reason</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {geoRestrictions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-slate-600">
                        No active geo-quarantines. All global platform services fully operational across all 7 continents and 195 sovereign nations.
                      </td>
                    </tr>
                  ) : (
                    geoRestrictions.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        {/* Jurisdiction */}
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <div className="font-black text-slate-900">{item.region_name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="rounded bg-slate-900 px-1.5 py-0.2 text-[9px] uppercase font-black text-cyan-300">
                              {item.region_type}
                            </span>
                            {item.continent && (
                              <span className="text-[10px] text-slate-700 font-medium">
                                • {item.continent}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Services Frozen */}
                        <td className="py-3 px-4 text-slate-800">
                          {item.freeze_all_services ? (
                            <span className="inline-block rounded border border-rose-400 bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-950">
                              ⚡ ALL 25 SERVICES FROZEN
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {Array.isArray(item.frozen_services) && item.frozen_services.length > 0 ? (
                                <>
                                  <span className="rounded bg-rose-50 border border-rose-300 px-1.5 py-0.5 text-[10px] font-black text-rose-950">
                                    {item.frozen_services.length} / 25 Services
                                  </span>
                                  {item.frozen_services.slice(0, 3).map((s) => (
                                    <span key={s} className="rounded bg-slate-100 border border-slate-300 px-1.5 py-0.5 text-[9px] font-bold text-slate-800">
                                      {s}
                                    </span>
                                  ))}
                                  {item.frozen_services.length > 3 && (
                                    <span className="text-[9px] text-slate-600 font-bold self-center">
                                      +{item.frozen_services.length - 3} more
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-[10px] text-slate-600">Active telemetry</span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Duration & Expiry */}
                        <td className="py-3 px-4 text-slate-800">
                          <div className="font-bold text-[11px] text-slate-900">
                            {item.duration_unit === 'indefinite' || !item.duration_value
                              ? 'Permanent'
                              : `${item.duration_value} ${item.duration_unit}`}
                          </div>
                          {item.expires_at ? (
                            <span className="text-[10px] text-amber-800 font-semibold block">
                              Expires: {new Date(item.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-600">Manual Lift</span>
                          )}
                        </td>

                        {/* Severity */}
                        <td className="py-3 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-black uppercase ${
                            item.severity === 'critical'
                              ? 'border border-rose-500 bg-rose-100 text-rose-950'
                              : item.severity === 'high'
                              ? 'border border-orange-500 bg-orange-100 text-orange-950'
                              : 'border border-amber-400 bg-amber-100 text-amber-950'
                          }`}>
                            {item.severity}
                          </span>
                        </td>

                        {/* Perimeter Defense */}
                        <td className="py-3 px-4 text-slate-700 text-[11px]">
                          <div className="flex flex-col gap-0.5">
                            <div>IPs: <span className="font-bold text-slate-900">{Array.isArray(item.blocked_ips) ? item.blocked_ips.length : 0}</span></div>
                            <div>MACs: <span className="font-bold text-slate-900">{Array.isArray(item.blocked_macs) ? item.blocked_macs.length : 0}</span></div>
                            {item.block_vpn_proxies !== false && (
                              <span className="text-[9px] font-black text-rose-800">VPN Dropped</span>
                            )}
                          </div>
                        </td>

                        {/* Audit Reason */}
                        <td className="py-3 px-4 text-slate-700 max-w-xs truncate text-[11px]">
                          {item.reason || '—'}
                          <span className="block text-[9px] text-slate-500">
                            Enforced: {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteGeoRestriction(item.id)}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-bold text-rose-700 hover:bg-rose-50 hover:border-rose-400 transition cursor-pointer shadow-sm"
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

      {/* TAB 3: VOICE LINE CADENCE, BASS & STUDIO */}
      {activeTab === 'voicelines' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
            <div className="flex items-start gap-3">
              <SpeakerWaveIcon className="h-5 w-5 flex-shrink-0 text-purple-600" />
              <div>
                <h4 className="text-xs font-black text-purple-950">
                  Global Voice Lines Cadence, Bass & Studio Console
                </h4>
                <p className="mt-0.5 text-xs text-purple-900">
                  Calibrate natural African voice line tempo, rich acoustic bass boost (+6.0 dB at 180 Hz), sound level, and microservice integration. Utterance speech is calibrated to a relaxed 0.46x cadence, media audio to 0.88x, and vocal pitch to 0.80 for warm human body resonance.
                </p>
              </div>
            </div>
          </div>

          {/* PostgreSQL Database Persistence & Library Rotation Banner */}
          <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    PostgreSQL Persistence Engine: Active
                  </span>
                  <span className="rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-800">
                    voiceline_system_settings
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  Preferences are persisted to the PostgreSQL database and immediately apply to all connected clients and microservices.
                  {lastSavedTimestamp && (
                    <span className="ml-2 font-bold text-emerald-800">
                      • Last saved to PostgreSQL at {lastSavedTimestamp}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-medium text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded bg-purple-50 border border-purple-200 px-2 py-0.5 font-bold text-purple-950">
                    104 African VoiceLines
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-bold text-emerald-950">
                    Universal Non-Repeating Shuffled Deck: {rotationStatus.remainingInDeck} / {rotationStatus.totalAvailable} remaining
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReloadFromDatabase}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 hover:bg-slate-50 transition shadow-sm flex items-center gap-2 cursor-pointer"
                  title="Reload settings from PostgreSQL database"
                >
                  <ArrowPathIcon className="h-4 w-4 text-slate-600" />
                  <span>Reload from DB</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveVoiceLineSettings}
                  disabled={isSavingVoiceSettings}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-black transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingVoiceSettings ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 animate-spin text-emerald-400" />
                      <span>Saving to PostgreSQL...</span>
                    </>
                  ) : (
                    <>
                      <CloudArrowUpIcon className="h-4 w-4 text-emerald-400" />
                      <span>Save VoiceLine Preferences to PostgreSQL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Spoken Speech Synthesis (TTS) Utterance Cadence Controller */}
            <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-900">Spoken Utterance Cadence</span>
                <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-black text-emerald-400">
                  {(voiceSettings.utteranceRate ?? 0.46).toFixed(2)}x
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-700">
                Independent speech synthesis tempo (0.30x to 1.50x). Baseline calibrated standard is 0.46x.
              </p>
              <input
                type="range"
                min="0.3"
                max="1.5"
                step="0.02"
                value={voiceSettings.utteranceRate ?? 0.46}
                onChange={handleUtteranceRateChange}
                className="mt-4 w-full accent-slate-900"
              />
              <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-600">
                <span>0.30x (Slow)</span>
                <span className="text-emerald-700 font-black">0.46x (African Standard)</span>
                <span>1.50x (Fast)</span>
              </div>
            </div>

            {/* Media Audio Playback Rate Controller (Uploaded Audio) */}
            <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-900">Audio Media Playback Rate</span>
                <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-black text-cyan-400">
                  {(voiceSettings.audioPlaybackRate ?? 0.88).toFixed(2)}x
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-700">
                Preserves recorded/uploaded media original speed (calibrated relaxed 0.88x tempo).
              </p>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.02"
                value={voiceSettings.audioPlaybackRate ?? 0.88}
                onChange={handleAudioPlaybackRateChange}
                className="mt-4 w-full accent-cyan-700"
              />
              <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-600">
                <span>0.50x (Slow)</span>
                <span className="text-cyan-800 font-black">0.88x (Calibrated Tempo)</span>
                <span>2.00x (2.0x)</span>
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

            {/* Acoustic Low-Shelf Bass Booster Controller */}
            <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-900">Acoustic Bass Booster (180 Hz)</span>
                <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-black text-amber-400">
                  +{(voiceSettings.bassBoostDb ?? 6.0).toFixed(1)} dB
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-700">
                Web Audio Biquad low-shelf filter for deep grounded human warmth. Baseline is +6.0 dB.
              </p>
              <input
                type="range"
                min="0.0"
                max="18.0"
                step="0.5"
                value={voiceSettings.bassBoostDb ?? 6.0}
                onChange={handleBassBoostChange}
                className="mt-4 w-full accent-amber-600"
              />
              <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-600">
                <span>0 dB (Flat)</span>
                <span className="text-amber-700 font-black">+6.0 dB (Warm Resonance)</span>
                <span>+18 dB (Heavy Bass)</span>
              </div>
            </div>

            {/* Pitch & Timbre Controller */}
            <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-900">Vocal Pitch & Timbre</span>
                <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-black text-purple-400">
                  {(voiceSettings.pitch ?? 0.80).toFixed(2)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-700">
                Lowers fundamental vocal frequency for authoritative, deep African resonance.
              </p>
              <input
                type="range"
                min="0.4"
                max="1.6"
                step="0.05"
                value={voiceSettings.pitch ?? 0.80}
                onChange={handlePitchChange}
                className="mt-4 w-full accent-purple-600"
              />
              <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-600">
                <span>0.40 (Deep Baritone)</span>
                <span className="text-purple-700 font-black">0.80 (Rich African Body)</span>
                <span>1.60 (High Treble)</span>
              </div>
            </div>

            {/* Quick Presets / Calibrated Defaults */}
            <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase text-slate-900">Calibrated Presets</span>
                <p className="mt-1 text-[11px] text-slate-700">
                  One-tap recalibration to official African VoiceLine acoustic targets.
                </p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    voiceLineServiceInstance.setUtteranceRate(0.46);
                    voiceLineServiceInstance.setAudioPlaybackRate(0.88);
                    voiceLineServiceInstance.setBassBoostDb(6.0);
                    voiceLineServiceInstance.setPitch(0.80);
                    voiceLineServiceInstance.setVolume(0.35);
                    setVoiceSettings({ ...voiceLineServiceInstance.getSettings() });
                  }}
                  className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-black hover:bg-slate-800 transition cursor-pointer"
                >
                  Apply Calibrated Standard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    voiceLineServiceInstance.setUtteranceRate(0.40);
                    voiceLineServiceInstance.setBassBoostDb(9.0);
                    voiceLineServiceInstance.setPitch(0.75);
                    setVoiceSettings({ ...voiceLineServiceInstance.getSettings() });
                  }}
                  className="px-3 py-2 bg-amber-50 border border-amber-300 text-amber-950 rounded-lg text-xs font-black hover:bg-amber-100 transition cursor-pointer"
                >
                  Extra Bass & Deliberate
                </button>
              </div>
            </div>
          </div>

          {/* Live Interactive Spoken Phrase Testing Sandbox */}
          <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
              <SpeakerWaveIcon className="w-4 h-4 text-emerald-600" />
              Live Interactive Speech & Bass Audition Sandbox
            </h4>
            <p className="text-xs text-slate-700">
              Type any phrase below to audition the exact cadence ({(voiceSettings.utteranceRate ?? 0.46).toFixed(2)}x), bass shelf (+{(voiceSettings.bassBoostDb ?? 6.0).toFixed(1)} dB), and pitch ({(voiceSettings.pitch ?? 0.80).toFixed(2)}) in your browser:
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={testPhrase}
                onChange={(e) => setTestPhrase(e.target.value)}
                placeholder="Enter test phrase..."
                className="flex-1 p-2.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleSpeakCustom()}
                disabled={isPlayingTest}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <PlayIcon className="w-4 h-4" />
                <span>{isPlayingTest ? 'Speaking...' : 'Speak with VoiceLine Engine'}</span>
              </button>
              <button
                type="button"
                onClick={() => voiceLineServiceInstance.playCommentaryVoiceLine('forum')}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <SpeakerWaveIcon className="w-4 h-4 text-emerald-400" />
                <span>Play Harmonic Bass Chime</span>
              </button>
            </div>
          </div>

          {/* Microservice Voice Toggles */}
          <div className="rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
            <h4 className="text-xs font-black uppercase text-slate-900">Microservice Commentary Audio Toggles</h4>
            <p className="mt-1 text-xs text-slate-700">
              Enable or silence automated cultured African commentary voice lines per microservice:
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {['forum', 'hallmarks', 'mii', 'groups', 'lushpressies', 'blogs', 'gems', 'tribut'].map((key) => {
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
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 hover:border-slate-900 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                >
                  <PlayIcon className="h-3.5 w-3.5 text-emerald-600" />
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom PostgreSQL Save Action Bar */}
          <div className="rounded-xl border border-slate-300 bg-slate-50 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="text-xs font-black uppercase text-slate-900">
                Commit VoiceLine Configuration to Database
              </h4>
              <p className="mt-0.5 text-xs text-slate-700">
                Saves utterance cadence ({(voiceSettings.utteranceRate ?? 0.46).toFixed(2)}x), audio media rate ({(voiceSettings.audioPlaybackRate ?? 0.88).toFixed(2)}x), volume ({Math.round((voiceSettings.volume ?? 0.35) * 100)}%), bass (+{(voiceSettings.bassBoostDb ?? 6.0).toFixed(1)} dB), and pitch ({(voiceSettings.pitch ?? 0.80).toFixed(2)}) to PostgreSQL.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReloadFromDatabase}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 hover:bg-slate-100 transition shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <ArrowPathIcon className="h-4 w-4 text-slate-600" />
                <span>Reload</span>
              </button>
              <button
                type="button"
                onClick={handleSaveVoiceLineSettings}
                disabled={isSavingVoiceSettings}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-black transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSavingVoiceSettings ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin text-emerald-400" />
                    <span>Saving to PostgreSQL...</span>
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="h-4 w-4 text-emerald-400" />
                    <span>Save VoiceLine Preferences to PostgreSQL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StercsControlCenter;
