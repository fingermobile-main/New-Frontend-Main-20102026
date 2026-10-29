/**
 * FINGERMOBILE PROTOCOL - AUDIO & VOICE LINE ENGINE
 * Integrates Pipecat AI Voice SDK (@pipecat-ai/client-js), HTML5 Audio,
 * Web Speech Synthesis & Web Audio API fallback pipelines.
 * Enforces African cultured voice lines playing at 35% volume on comment posting.
 *
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import { ApiResponse } from '../types/api';

export type VoiceLineCategory =
  | 'general'
  | 'sugarcrush'
  | 'fingerwars'
  | 'acquisition'
  | 'greeting'
  | 'lamentation'
  | 'exclamation'
  | 'earnings'
  | 'surprise'
  | 'appraisal'
  | 'enticement'
  | 'boastful'
  | 'request'
  | 'funding'
  | 'affection'
  | 'agreement'
  | 'expression'
  | 'stun'
  | 'combo'
  | 'combo_small'
  | 'combo_large'
  | 'combo_colossal'
  | 'supervi'
  | 'gameon'
  | 'forum'
  | 'gems'
  | 'hallmarks'
  | 'mii'
  | 'groups'
  | 'lushpressies'
  | 'blogs'
  | 'achievement';

export interface VoiceLine {
  id: string;
  text: string;
  category: VoiceLineCategory;
  audioUrl: string;
  keywords: string[];
}

export interface VoiceLineLogPayload {
  voiceLineId: string;
  eventType: string;
  microservice?: string;
  timestamp: string;
  memberId: string | null;
}

export interface VoiceLineSettings {
  volume: number; // 0.0 to 1.0 (default 0.35)
  audioPlaybackRate: number; // Media audio playback speed: defaults to 1.0 (natural uploaded media rate) unless explicitly changed by author/user
  utteranceRate: number; // Speech synthesis (TTS) utterance cadence: independent from media audio, calibrated to 0.60 for deliberate spoken cadence
  playbackRate?: number; // Backward compatibility alias mapping to audioPlaybackRate
  enabled: boolean; // Global master toggle
  microservices: {
    forum: boolean;
    hallmarks: boolean;
    mii: boolean;
    groups: boolean;
    lushpressies: boolean;
    blogs: boolean;
    [key: string]: boolean;
  };
}

const SETTINGS_STORAGE_KEY = 'fingermobile_voiceline_settings';

const DEFAULT_SETTINGS: VoiceLineSettings = {
  volume: 0.35, // 35% device/system speaker volume
  audioPlaybackRate: 0.92, // Deliberate, relaxed natural playback speed (0.92x)
  utteranceRate: 0.52, // Calibrated spoken speech synthesis utterance rate (0.52x) for authentic human cadence
  playbackRate: 0.92,
  enabled: true,
  microservices: {
    forum: true,
    hallmarks: true,
    mii: true,
    groups: true,
    lushpressies: true,
    blogs: true
  }
};

// Cultured African Voice Lines Database
const allVoiceLines: VoiceLine[] = [
  { id: 'ev-1', text: 'Great!', category: 'forum', audioUrl: '/audio/african/great.mp3', keywords: ['achievement', 'success', 'forum', 'win'] },
  { id: 'ev-2', text: 'Sugar crush', category: 'sugarcrush', audioUrl: '/audio/african/sugar-crush.mp3', keywords: ['achievement', 'success', 'win'] },
  { id: 'ev-3', text: 'Wooow!', category: 'general', audioUrl: '/audio/african/woooow.mp3', keywords: ['disappointment', 'excitement', 'level', 'move'] },
  { id: 'ev-4', text: 'Oh yeeeaah!', category: 'general', audioUrl: '/audio/african/oh-yeaah.mp3', keywords: ['gameplay', 'matches', 'effects', 'goal'] },
  { id: 'ev-5', text: 'Bootilicious!', category: 'fingerwars', audioUrl: '/audio/african/bootilicious.mp3', keywords: ['fingerwars', 'level', 'points'] },
  { id: 'ev-6', text: 'Oooh yeah go on!', category: 'groups', audioUrl: '/audio/african/oooh-yeah-go-on.mp3', keywords: ['groups', 'progress', 'momentum'] },
  { id: 'ev-7', text: 'Nice One, you\'re there already', category: 'fingerwars', audioUrl: '/audio/african/nice-one.mp3', keywords: ['variations', 'progress', 'completion'] },
  { id: 'ev-8', text: 'You\'re mine', category: 'acquisition', audioUrl: '/audio/african/youre-mine.mp3', keywords: ['acquisition', 'objects', 'gifts', 'earnings'] },
  { id: 'ev-9', text: 'Hi ya doing', category: 'greeting', audioUrl: '/audio/african/hi-ya-doing.mp3', keywords: ['greeting', 'meeting', 'first', 'time'] },
  { id: 'ev-10', text: 'Wahala Dey', category: 'lamentation', audioUrl: '/audio/african/wahala-dey.mp3', keywords: ['obstacle', 'problem', 'issue'] },
  { id: 'ev-11', text: 'See Gobe', category: 'lamentation', audioUrl: '/audio/african/see-gobe.mp3', keywords: ['obstacle', 'seeing', 'encountering'] },
  { id: 'ev-12', text: 'Kilode', category: 'exclamation', audioUrl: '/audio/african/kilode.mp3', keywords: ['questioning', 'activity', 'reason', 'answer'] },
  { id: 'ev-13', text: 'Owo ni Koko', category: 'earnings', audioUrl: '/audio/african/owo-ni-koko.mp3', keywords: ['points', 'gifts', 'money', 'bonus', 'FIC'] },
  { id: 'ev-14', text: 'Wonderful', category: 'blogs', audioUrl: '/audio/african/wonderful.mp3', keywords: ['surprise', 'amazement', 'blogs', 'wonderful'] },
  { id: 'ev-15', text: 'Get a Hug', category: 'lushpressies', audioUrl: '/audio/african/get-a-hug.mp3', keywords: ['affection', 'lushpressies', 'hug'] },
  { id: 'ev-16', text: 'Dance for me', category: 'enticement', audioUrl: '/audio/african/dance-for-me.mp3', keywords: ['happy', 'retry', 'redo', 'earn', 'achieve'] },
  { id: 'ev-17', text: 'Play my music!!', category: 'boastful', audioUrl: '/audio/african/play-my-music.mp3', keywords: ['boast', 'earned', 'achieved', 'acquired'] },
  { id: 'ev-18', text: 'Dash me naa, Abeg come Bless me na', category: 'request', audioUrl: '/audio/african/dash-me-abeg.mp3', keywords: ['request', 'give', 'gift', 'funding'] },
  { id: 'ev-19', text: 'Gift me', category: 'request', audioUrl: '/audio/african/gift-me.mp3', keywords: ['request', 'give', 'gift'] },
  { id: 'ev-20', text: 'Thank you', category: 'appraisal', audioUrl: '/audio/african/thank-you.mp3', keywords: ['appreciation', 'receiving', 'gifts', 'achievement'] },
  { id: 'ev-21', text: 'I need Urgent 2k', category: 'funding', audioUrl: '/audio/african/i-need-urgent-2k.mp3', keywords: ['funding', 'begging', 'request'] },
  { id: 'ev-22', text: 'Urgent 2k', category: 'funding', audioUrl: '/audio/african/urgent-2k.mp3', keywords: ['funding', 'request'] },
  { id: 'ev-23', text: 'Urgent 5k', category: 'funding', audioUrl: '/audio/african/urgent-5k.mp3', keywords: ['funding', 'request'] },
  { id: 'ev-24', text: 'I need Urgent 5k', category: 'funding', audioUrl: '/audio/african/i-need-urgent-5k.mp3', keywords: ['funding', 'begging', 'request'] },
  { id: 'ev-25', text: 'Miss me', category: 'lushpressies', audioUrl: '/audio/african/miss-me.mp3', keywords: ['affection', 'lushpressies', 'matching', 'return'] },
  { id: 'ev-26', text: 'I miss you', category: 'lushpressies', audioUrl: '/audio/african/i-miss-you.mp3', keywords: ['affection', 'lushpressies', 'match', 'return'] },
  { id: 'ev-27', text: 'Let\'s do this', category: 'groups', audioUrl: '/audio/african/lets-do-this.mp3', keywords: ['agreement', 'action', 'groups'] },
  { id: 'ev-28', text: 'Awesome', category: 'blogs', audioUrl: '/audio/african/awesome.mp3', keywords: ['appraisal', 'affirmation', 'blogs', 'gifts'] },
  { id: 'ev-29', text: 'Thumbs up!', category: 'blogs', audioUrl: '/audio/african/thumbs-up.mp3', keywords: ['appraisal', 'blogs', 'achievement', 'thumbs'] },
  { id: 'ev-30', text: 'Say whaaaaaaa', category: 'expression', audioUrl: '/audio/african/say-whaaaa.mp3', keywords: ['excitement', 'shock', 'jolt', 'surprise'] },
  { id: 'ev-31', text: 'Whatever', category: 'expression', audioUrl: '/audio/african/whatever.mp3', keywords: ['restrictions', 'freedom', 'surprise'] },
  { id: 'ev-32', text: 'Stunning!', category: 'mii', audioUrl: '/audio/african/stunning.mp3', keywords: ['mii', 'affirmation', 'stunning', 'avatar'] },
  { id: 'ev-33', text: 'You look great', category: 'mii', audioUrl: '/audio/african/you-look-great.mp3', keywords: ['mii', 'avatar', 'style', 'great'] },
  { id: 'ev-34', text: 'Wereey', category: 'achievement', audioUrl: '/audio/african/wereey.mp3', keywords: ['stunt', 'achieved', 'impossible'] },
  { id: 'ev-35', text: 'Madt o!', category: 'achievement', audioUrl: '/audio/african/madt-o.mp3', keywords: ['stunt', 'achieved', 'unusual'] },
  { id: 'ev-36', text: 'Sharp!', category: 'forum', audioUrl: '/audio/african/sharp.mp3', keywords: ['forum', 'achieved', 'sharp'] },
  { id: 'ev-37', text: 'Oomo you gbaski', category: 'forum', audioUrl: '/audio/african/oomo-gbaski.mp3', keywords: ['forum', 'great', 'work', 'gbaski'] },
  { id: 'ev-38', text: 'O B O!', category: 'hallmarks', audioUrl: '/audio/african/o-b-o.mp3', keywords: ['hallmarks', 'big', 'status'] },
  { id: 'ev-39', text: 'Billion Dollar Gang', category: 'hallmarks', audioUrl: '/audio/african/billion-dollar-gang.mp3', keywords: ['hallmarks', 'success', 'billion'] },
  { id: 'ev-40', text: 'Correct', category: 'forum', audioUrl: '/audio/african/correct.mp3', keywords: ['forum', 'achievement', 'correct'] },
  { id: 'ev-41', text: 'oOoOO ma Gaddddd!', category: 'achievement', audioUrl: '/audio/african/ooooma-gaddddd.mp3', keywords: ['stunt', 'new', 'colossal'] },
  { id: 'ev-42', text: 'My Goodness', category: 'stun', audioUrl: '/audio/african/my-goodness.mp3', keywords: ['appraisal', 'surprise'] },
  { id: 'ev-43', text: 'You\'re Endowed', category: 'mii', audioUrl: '/audio/african/youre-endowed.mp3', keywords: ['mii', 'physical', 'attributes'] },
  { id: 'ev-44', text: 'You\'re gorgeous', category: 'mii', audioUrl: '/audio/african/youre-gorgeous.mp3', keywords: ['mii', 'gorgeous', 'admirations'] },
  { id: 'ev-45', text: 'Divine', category: 'hallmarks', audioUrl: '/audio/african/divine.mp3', keywords: ['hallmarks', 'divine', 'impressive'] },
  { id: 'ev-46', text: 'Blessings Blessings Blessings', category: 'hallmarks', audioUrl: '/audio/african/blessings-blessings.mp3', keywords: ['hallmarks', 'blessings'] },
  { id: 'cb-1', text: 'Small combo!', category: 'combo_small', audioUrl: '/audio/african/small-combo.mp3', keywords: ['small', 'combo'] },
  { id: 'cb-2', text: 'Great combo!', category: 'combo_large', audioUrl: '/audio/african/great-combo.mp3', keywords: ['great', 'combo'] },
  { id: 'cb-3', text: 'Colossal combo!', category: 'combo_colossal', audioUrl: '/audio/african/colossal-combo.mp3', keywords: ['colossal', 'combo'] },
  { id: 'cb-4', text: 'Sweet!', category: 'lushpressies', audioUrl: '/audio/african/sweet.mp3', keywords: ['sweet', 'lushpressies'] },
  { id: 'cb-5', text: 'Boom!', category: 'groups', audioUrl: '/audio/african/boom.mp3', keywords: ['boom', 'groups'] },
  { id: 'cm-1', text: 'Great post!', category: 'forum', audioUrl: '/audio/african/great-post.mp3', keywords: ['forum', 'post', 'community'] },
  { id: 'cm-2', text: 'Gem found!', category: 'gems', audioUrl: '/audio/african/gem-found.mp3', keywords: ['gems', 'discovery', 'valuable'] }
];

class VoiceLineService {
  private static instance: VoiceLineService;
  private audioContext: AudioContext | null = null;
  private initialized = false;
  private memberId: string | null = null;
  private settings: VoiceLineSettings = { ...DEFAULT_SETTINGS };

  private constructor() {
    this.loadSettings();
  }

  public static getInstance(): VoiceLineService {
    if (!VoiceLineService.instance) {
      VoiceLineService.instance = new VoiceLineService();
    }
    return VoiceLineService.instance;
  }

  /**
   * Loads voice line audio preferences from storage
   */
  public loadSettings(): VoiceLineSettings {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const resolvedAudioRate =
            typeof parsed.audioPlaybackRate === 'number'
              ? parsed.audioPlaybackRate
              : (typeof parsed.playbackRate === 'number' ? parsed.playbackRate : DEFAULT_SETTINGS.audioPlaybackRate);
          const resolvedUtteranceRate =
            typeof parsed.utteranceRate === 'number' ? parsed.utteranceRate : DEFAULT_SETTINGS.utteranceRate;

          this.settings = {
            volume: typeof parsed.volume === 'number' ? parsed.volume : DEFAULT_SETTINGS.volume,
            audioPlaybackRate: resolvedAudioRate,
            utteranceRate: resolvedUtteranceRate,
            playbackRate: resolvedAudioRate,
            enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : DEFAULT_SETTINGS.enabled,
            microservices: {
              ...DEFAULT_SETTINGS.microservices,
              ...(parsed.microservices || {})
            }
          };
          return this.settings;
        }
      } catch {
        // Fallback to default settings
      }
    }
    this.settings = { ...DEFAULT_SETTINGS };
    return this.settings;
  }

  /**
   * Persists voice line preferences
   */
  public saveSettings(newSettings: Partial<VoiceLineSettings>): VoiceLineSettings {
    const updatedAudioRate =
      newSettings.audioPlaybackRate !== undefined
        ? newSettings.audioPlaybackRate
        : (newSettings.playbackRate !== undefined ? newSettings.playbackRate : this.settings.audioPlaybackRate);

    this.settings = {
      ...this.settings,
      ...newSettings,
      audioPlaybackRate: updatedAudioRate,
      playbackRate: updatedAudioRate,
      microservices: {
        ...this.settings.microservices,
        ...(newSettings.microservices || {})
      }
    };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
      } catch {
        // Silent storage fallback
      }
    }
    return this.settings;
  }

  public getSettings(): VoiceLineSettings {
    return this.settings;
  }

  public getVoiceLineVolume(): number {
    return this.settings.volume;
  }

  public setVoiceLineVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings({ volume: clampedVolume });
  }

  public setVolume(volume: number): void {
    this.setVoiceLineVolume(volume);
  }

  /**
   * Media Audio Playback Rate:
   * Preserves natural recording/uploaded media speed (1.0x) unless explicitly configured by user/author.
   */
  public getAudioPlaybackRate(): number {
    return this.settings.audioPlaybackRate ?? 1.0;
  }

  public setAudioPlaybackRate(rate: number): void {
    const clampedRate = Math.max(0.5, Math.min(2.0, rate));
    this.saveSettings({ audioPlaybackRate: clampedRate, playbackRate: clampedRate });
  }

  /**
   * Web Speech Synthesis (TTS) Utterance Cadence:
   * Calibrated separately from uploaded media, calibrated to 0.60 for deliberate spoken cadence.
   */
  public getUtteranceRate(): number {
    return this.settings.utteranceRate ?? 0.60;
  }

  public setUtteranceRate(rate: number): void {
    const clampedRate = Math.max(0.3, Math.min(1.5, rate));
    this.saveSettings({ utteranceRate: clampedRate });
  }

  public getPlaybackRate(): number {
    return this.getAudioPlaybackRate();
  }

  public setPlaybackRate(rate: number): void {
    this.setAudioPlaybackRate(rate);
  }

  public isMicroserviceVoiceLineEnabled(microservice: string): boolean {
    if (!this.settings.enabled) return false;
    if (microservice in this.settings.microservices) {
      return this.settings.microservices[microservice] !== false;
    }
    return true;
  }

  public setMicroserviceVoiceLineEnabled(microservice: string, enabled: boolean): void {
    const microservices = {
      ...this.settings.microservices,
      [microservice]: enabled
    };
    this.saveSettings({ microservices });
  }

  /**
   * Initialize AudioContext with SSR protection
   */
  public async initialize(memberId?: string): Promise<void> {
    if (this.initialized) return;

    return new Promise((resolve) => {
      if (typeof window !== 'undefined') {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          try {
            this.audioContext = new AudioContextClass();
          } catch {
            // Audio context permission delayed until user gesture
          }
        }
      }
      this.initialized = true;
      this.memberId = memberId || null;
      resolve();
    });
  }

  private getBaseHeaders(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  public async fetchVoiceLinesByCategory(category: VoiceLineCategory): Promise<VoiceLine[]> {
    try {
      const response = await fetch(`/api/voice-lines/categories/${category}`, {
        method: 'GET',
        headers: this.getBaseHeaders()
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return json.data || json;
    } catch {
      return this.getVoiceLinesByCategory(category);
    }
  }

  public async fetchRandomVoiceLineByCategory(category: VoiceLineCategory): Promise<VoiceLine | null> {
    try {
      const response = await fetch(`/api/voice-lines/categories/${category}/random`, {
        method: 'GET',
        headers: this.getBaseHeaders()
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return json.data || json;
    } catch {
      return this.getRandomVoiceLineByCategory(category);
    }
  }

  public async fetchVoiceLineCategories(): Promise<VoiceLineCategory[]> {
    try {
      const response = await fetch('/api/voice-lines/categories', {
        method: 'GET',
        headers: this.getBaseHeaders()
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      if (json.data && Array.isArray(json.data)) {
        return json.data.map((c: { category: string }) => c.category as VoiceLineCategory);
      }
      return json;
    } catch {
      const uniqueCategories = Array.from(new Set(allVoiceLines.map((vl) => vl.category)));
      return uniqueCategories as VoiceLineCategory[];
    }
  }

  public getVoiceLinesByCategory(category: VoiceLineCategory): VoiceLine[] {
    return allVoiceLines.filter((line) => line.category === category);
  }

  public getAllVoiceLines(): ApiResponse<VoiceLine[]> {
    return {
      success: true,
      data: allVoiceLines
    };
  }

  public getRandomVoiceLineByCategory(category: VoiceLineCategory): VoiceLine | null {
    const lines = this.getVoiceLinesByCategory(category);
    if (lines.length === 0) {
      // Fallback to general lines
      const generalLines = this.getVoiceLinesByCategory('general');
      if (generalLines.length === 0) return allVoiceLines[0];
      return generalLines[Math.floor(Math.random() * generalLines.length)];
    }
    return lines[Math.floor(Math.random() * lines.length)];
  }

  public async searchVoiceLines(keyword: string): Promise<VoiceLine[]> {
    try {
      const response = await fetch(`/api/voice-lines/search?q=${encodeURIComponent(keyword)}`, {
        method: 'GET',
        headers: this.getBaseHeaders()
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return json.data || json;
    } catch {
      return this.searchVoiceLinesLocal(keyword);
    }
  }

  private searchVoiceLinesLocal(keyword: string): VoiceLine[] {
    const lowerKeyword = keyword.toLowerCase().trim();
    if (!lowerKeyword) return [];

    return allVoiceLines.filter(
      (line) =>
        line.text.toLowerCase().includes(lowerKeyword) ||
        line.keywords.some((kw) => kw.toLowerCase().includes(lowerKeyword))
    );
  }

  public async logVoiceLinePlay(voiceLineId: string, eventType = 'play', microservice = 'general'): Promise<void> {
    try {
      const logBody: VoiceLineLogPayload = {
        voiceLineId,
        eventType,
        microservice,
        timestamp: new Date().toISOString(),
        memberId: this.memberId
      };

      await fetch('/api/voice-lines/log', {
        method: 'POST',
        headers: this.getBaseHeaders(),
        body: JSON.stringify(logBody)
      });
    } catch {
      // Silent metric catch
    }
  }

  /**
   * Harmonic synthesized acoustic chime fallback via Web Audio API.
   * Plays a pleasant major third chime calibrated to 35% volume.
   */
  private playHarmonicChime(volume: number): void {
    if (typeof window === 'undefined') return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = this.audioContext || new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume * 0.4, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      gainNode.connect(ctx.destination);

      // Root note (E5) + Third (G#5) pleasant African notification chord
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now); // E5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(830.61, now + 0.08); // G#5

      osc1.connect(gainNode);
      osc2.connect(gainNode);

      osc1.start(now);
      osc2.start(now + 0.08);
      osc1.stop(now + 0.8);
      osc2.stop(now + 0.8);
    } catch {
      // AudioContext unavailable or denied
    }
  }

  /**
   * Spoken speech synthesis fallback utilizing Web Speech API
   */
  private speakVoiceLineText(text: string, volume: number): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = volume;
      utterance.rate = this.getUtteranceRate();
      utterance.pitch = 1.0;

      // Select natural English voice if present
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Premium'))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis fallback failure safe
    }
  }

  /**
   * Actionable Commentary Audio Trigger
   * Triggered when members post comments across:
   * ForumPage, Hallmarks, Mii, Groups, LushPressies, Blogs.
   * Plays the designated voice line at 35% system speaker volume (or user-defined volume).
   */
  public async playCommentaryVoiceLine(
    microservice: VoiceLineCategory,
    memberId?: string
  ): Promise<void> {
    if (!this.isMicroserviceVoiceLineEnabled(microservice)) {
      return;
    }

    if (memberId) {
      this.memberId = memberId;
    }

    const volume = this.getVoiceLineVolume();
    const candidateLine = this.getRandomVoiceLineByCategory(microservice as VoiceLineCategory) || allVoiceLines[0];

    await this.playVoiceLine(candidateLine.text, candidateLine.id, `commentary:${microservice}`, microservice, volume);
  }

  /**
   * Multi-layered Playback Pipeline:
   * Level 1: Native Audio File (.mp3)
   * Level 2: Web Speech Synthesis of the African voice line phrase
   * Level 3: Web Audio API Harmonic Chime
   */
  public async playVoiceLine(
    text: string,
    voiceLineId?: string,
    eventType = 'general',
    microservice = 'general',
    overrideVolume?: number
  ): Promise<void> {
    const volume = overrideVolume !== undefined ? overrideVolume : this.getVoiceLineVolume();

    if (volume <= 0 || !this.settings.enabled) {
      return;
    }

    let matchingLine: VoiceLine | undefined;
    if (voiceLineId) {
      matchingLine = allVoiceLines.find((line) => line.id === voiceLineId);
    } else {
      matchingLine = allVoiceLines.find((line) => line.text.toLowerCase() === text.toLowerCase());
    }

    const phraseToPlay = matchingLine ? matchingLine.text : text;

    // Level 0: Visual 5D Mint-Green Reaction Dispatch IMMEDIATELY (1.2s max display)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('fingermobile:voiceline', {
          detail: {
            text: phraseToPlay,
            voiceLineId: matchingLine ? matchingLine.id : voiceLineId,
            category: matchingLine ? matchingLine.category : microservice,
            eventType,
            microservice,
            timestamp: Date.now()
          }
        })
      );
    }

    let playedSuccessfully = false;

    // Level 1: Attempt HTML5 Audio Playback
    if (matchingLine && matchingLine.audioUrl && typeof window !== 'undefined') {
      try {
        const audio = new Audio(matchingLine.audioUrl);
        audio.volume = volume;
        // Preserves natural playback speed (1.0x) unless changed
        audio.playbackRate = this.getAudioPlaybackRate();
        
        await new Promise<void>((resolve, reject) => {
          let resolved = false;
          const onPlay = () => {
            if (!resolved) {
              resolved = true;
              playedSuccessfully = true;
              resolve();
            }
          };
          const onError = (e: any) => {
            if (!resolved) {
              resolved = true;
              reject(e);
            }
          };
          audio.addEventListener('playing', onPlay, { once: true });
          audio.addEventListener('error', onError, { once: true });

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => onPlay())
              .catch((err) => onError(err));
          } else {
            onPlay();
          }
        });
      } catch {
        // Physical file blocked by browser autoplay policy or failed, fall through to Chime & TTS
        playedSuccessfully = false;
      }
    }

    // Level 2 & 3: Resilient Pipecat / Speech Synthesis & Harmonic Chime
    if (!playedSuccessfully) {
      this.playHarmonicChime(volume);
      this.speakVoiceLineText(phraseToPlay, volume);
    }

    if (matchingLine) {
      this.logVoiceLinePlay(matchingLine.id, eventType, microservice);
    }
  }
}

const voiceLineServiceInstance = VoiceLineService.getInstance();
export { VoiceLineService };
export default voiceLineServiceInstance;
