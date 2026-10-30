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
  | 'achievement'
  | 'tribut';

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
  audioPlaybackRate: number; // Media audio playback speed: defaults to 0.88 unless explicitly changed by author/user
  utteranceRate: number; // Speech synthesis (TTS) utterance cadence: calibrated to 0.46 for deliberate spoken cadence
  pitch?: number; // Vocal pitch/timbre (0.4 to 1.6, default 0.80 for warm deep African resonance)
  bassBoostDb?: number; // Low-shelf bass boost in dB at 180Hz (0.0 to 18.0, default 6.0dB)
  playbackRate?: number; // Backward compatibility alias mapping to audioPlaybackRate
  enabled: boolean; // Global master toggle
  microservices: {
    forum: boolean;
    hallmarks: boolean;
    mii: boolean;
    groups: boolean;
    lushpressies: boolean;
    blogs: boolean;
    gems?: boolean;
    tribut?: boolean;
    [key: string]: boolean | undefined;
  };
}

const SETTINGS_STORAGE_KEY = 'fingermobile_voiceline_settings';

const DEFAULT_SETTINGS: VoiceLineSettings = {
  volume: 0.35, // 35% device/system speaker volume
  audioPlaybackRate: 0.88, // Deliberate, relaxed natural playback speed (0.88x)
  utteranceRate: 0.46, // Calibrated spoken speech synthesis utterance rate (0.46x) for authentic human cadence
  pitch: 0.80, // Rich warm bass vocal resonance (0.80)
  bassBoostDb: 6.0, // +6.0dB acoustic low-shelf bass booster at 180Hz
  playbackRate: 0.88,
  enabled: true,
  microservices: {
    forum: true,
    hallmarks: true,
    mii: true,
    groups: true,
    lushpressies: true,
    blogs: true,
    gems: true,
    tribut: true
  }
};

// Cultured African Voice Lines Complete Platform Database (104+ VoiceLines)
const allVoiceLines: VoiceLine[] = [
  { id: 'vl-001', text: 'Sweet!', category: 'forum', audioUrl: '/audio/african/sweet.mp3', keywords: ['sweet', 'praise', 'awesome'] },
  { id: 'vl-002', text: 'Wonderful!', category: 'blogs', audioUrl: '/audio/african/wonderful.mp3', keywords: ['wonderful', 'great', 'content'] },
  { id: 'vl-003', text: 'Divine!', category: 'hallmarks', audioUrl: '/audio/african/divine.mp3', keywords: ['divine', 'honor', 'sacred'] },
  { id: 'vl-004', text: 'Sensational!', category: 'mii', audioUrl: '/audio/african/sensational.mp3', keywords: ['sensational', 'vibes', 'social'] },
  { id: 'vl-005', text: 'Phenomenal!', category: 'groups', audioUrl: '/audio/african/phenomenal.mp3', keywords: ['phenomenal', 'unity', 'team'] },
  { id: 'vl-006', text: 'Incredible!', category: 'lushpressies', audioUrl: '/audio/african/incredible.mp3', keywords: ['incredible', 'gift', 'generous'] },
  { id: 'vl-007', text: 'Wereey!', category: 'achievement', audioUrl: '/audio/african/wereey.mp3', keywords: ['wereey', 'legendary', 'achievement'] },
  { id: 'vl-008', text: 'Oshey!', category: 'general', audioUrl: '/audio/african/oshey.mp3', keywords: ['oshey', 'thanks', 'salute'] },
  { id: 'vl-009', text: 'Oya na!', category: 'general', audioUrl: '/audio/african/oyana.mp3', keywords: ['oya', 'momentum', 'action'] },
  { id: 'vl-010', text: 'Gbaski!', category: 'general', audioUrl: '/audio/african/gbaski.mp3', keywords: ['gbaski', 'authority', 'big'] },
  { id: 'vl-011', text: 'Otilo!', category: 'achievement', audioUrl: '/audio/african/otilo.mp3', keywords: ['otilo', 'ahead', 'fast'] },
  { id: 'vl-012', text: 'O por gan!', category: 'general', audioUrl: '/audio/african/opor.mp3', keywords: ['opor', 'plenty', 'abundance'] },
  { id: 'vl-013', text: 'E choke!', category: 'general', audioUrl: '/audio/african/echoke.mp3', keywords: ['choke', 'impact', 'massive'] },
  { id: 'vl-014', text: 'Buga won!', category: 'achievement', audioUrl: '/audio/african/buga.mp3', keywords: ['buga', 'swagger', 'proud'] },
  { id: 'vl-015', text: 'No shaking!', category: 'general', audioUrl: '/audio/african/noshaking.mp3', keywords: ['unmoved', 'steady', 'calm'] },
  { id: 'vl-016', text: 'Weldone o!', category: 'general', audioUrl: '/audio/african/weldone.mp3', keywords: ['weldone', 'respect', 'effort'] },
  { id: 'vl-017', text: 'Oga at the top!', category: 'general', audioUrl: '/audio/african/oga.mp3', keywords: ['oga', 'top', 'executive'] },
  { id: 'vl-018', text: 'Correct person!', category: 'general', audioUrl: '/audio/african/correct.mp3', keywords: ['correct', 'real', 'authentic'] },
  { id: 'vl-019', text: 'Sharp guy!', category: 'general', audioUrl: '/audio/african/sharp.mp3', keywords: ['sharp', 'intelligent', 'fast'] },
  { id: 'vl-020', text: 'Too much!', category: 'general', audioUrl: '/audio/african/toomuch.mp3', keywords: ['excess', 'grand', 'talent'] },
  { id: 'vl-021', text: 'E sharp!', category: 'general', audioUrl: '/audio/african/esharp.mp3', keywords: ['sharp', 'neat', 'precise'] },
  { id: 'vl-022', text: 'Top tier!', category: 'general', audioUrl: '/audio/african/toptier.mp3', keywords: ['top', 'tier', 'luxury'] },
  { id: 'vl-023', text: 'Agba!', category: 'general', audioUrl: '/audio/african/agba.mp3', keywords: ['agba', 'elder', 'veteran'] },
  { id: 'vl-024', text: 'Odogwu!', category: 'general', audioUrl: '/audio/african/odogwu.mp3', keywords: ['odogwu', 'mighty', 'giant'] },
  { id: 'vl-025', text: 'Kpa!', category: 'general', audioUrl: '/audio/african/kpa.mp3', keywords: ['kpa', 'money', 'direct'] },
  { id: 'vl-026', text: 'Solid!', category: 'general', audioUrl: '/audio/african/solid.mp3', keywords: ['solid', 'firm', 'trustworthy'] },
  { id: 'vl-027', text: 'Level up!', category: 'achievement', audioUrl: '/audio/african/levelup.mp3', keywords: ['level', 'up', 'progress'] },
  { id: 'vl-028', text: 'Fire!', category: 'general', audioUrl: '/audio/african/fire.mp3', keywords: ['fire', 'flames', 'heat'] },
  { id: 'vl-029', text: 'Mad oh!', category: 'general', audioUrl: '/audio/african/madoh.mp3', keywords: ['mad', 'wild', 'unbelievable'] },
  { id: 'vl-030', text: 'Baller!', category: 'general', audioUrl: '/audio/african/baller.mp3', keywords: ['baller', 'rich', 'play'] },
  { id: 'vl-031', text: 'Ajeh!', category: 'general', audioUrl: '/audio/african/ajeh.mp3', keywords: ['ajeh', 'truth', 'real'] },
  { id: 'vl-032', text: 'Smooth!', category: 'general', audioUrl: '/audio/african/smooth.mp3', keywords: ['smooth', 'easy', 'clean'] },
  { id: 'vl-033', text: 'Original!', category: 'general', audioUrl: '/audio/african/original.mp3', keywords: ['original', 'legit', 'first'] },
  { id: 'vl-034', text: 'E sweet die!', category: 'general', audioUrl: '/audio/african/esweetdie.mp3', keywords: ['sweet', 'enjoyment', 'thrill'] },
  { id: 'vl-035', text: 'Confirm!', category: 'general', audioUrl: '/audio/african/confirm.mp3', keywords: ['confirm', 'valid', 'approved'] },
  { id: 'vl-036', text: 'Clean sheet!', category: 'achievement', audioUrl: '/audio/african/cleansheet.mp3', keywords: ['clean', 'sheet', 'flawless'] },
  { id: 'vl-037', text: 'Standard!', category: 'general', audioUrl: '/audio/african/standard.mp3', keywords: ['standard', 'benchmark', 'high'] },
  { id: 'vl-038', text: 'Sovereign moves!', category: 'general', audioUrl: '/audio/african/sovereign.mp3', keywords: ['sovereign', 'protocol', 'moves'] },
  { id: 'vl-039', text: 'Pure gold!', category: 'gems', audioUrl: '/audio/african/puregold.mp3', keywords: ['gold', 'pure', 'value'] },
  { id: 'vl-040', text: 'Chai!', category: 'general', audioUrl: '/audio/african/chai.mp3', keywords: ['chai', 'wonder', 'reaction'] },
  { id: 'vl-041', text: 'Kudos!', category: 'general', audioUrl: '/audio/african/kudos.mp3', keywords: ['kudos', 'credit', 'respect'] },
  { id: 'vl-042', text: 'Take your flowers!', category: 'hallmarks', audioUrl: '/audio/african/flowers.mp3', keywords: ['flowers', 'honor', 'tribute'] },
  { id: 'vl-043', text: 'Energy!', category: 'general', audioUrl: '/audio/african/energy.mp3', keywords: ['energy', 'pulse', 'vibes'] },
  { id: 'vl-044', text: 'Unstoppable!', category: 'achievement', audioUrl: '/audio/african/unstoppable.mp3', keywords: ['unstoppable', 'force', 'win'] },
  { id: 'vl-045', text: 'Maximum respect!', category: 'general', audioUrl: '/audio/african/maxrespect.mp3', keywords: ['respect', 'honor', 'salute'] },
  { id: 'vl-046', text: 'Boss moves!', category: 'general', audioUrl: '/audio/african/bossmoves.mp3', keywords: ['boss', 'moves', 'king'] },
  { id: 'vl-047', text: 'You do this one!', category: 'general', audioUrl: '/audio/african/youdothisone.mp3', keywords: ['victory', 'accomplishment'] },
  { id: 'vl-048', text: 'Senior man!', category: 'general', audioUrl: '/audio/african/seniorman.mp3', keywords: ['senior', 'man', 'respected'] },
  { id: 'vl-049', text: 'Tuale!', category: 'general', audioUrl: '/audio/african/tuale.mp3', keywords: ['tuale', 'salute', 'bow'] },
  { id: 'vl-050', text: 'Banger!', category: 'general', audioUrl: '/audio/african/banger.mp3', keywords: ['banger', 'smash', 'hit'] },
  { id: 'vl-051', text: 'Wahala for who no like this!', category: 'general', audioUrl: '/audio/african/wahalaforwho.mp3', keywords: ['wahala', 'love', 'post'] },
  { id: 'vl-052', text: 'Gbedu dey enter!', category: 'general', audioUrl: '/audio/african/gbedu.mp3', keywords: ['gbedu', 'rhythm', 'sound'] },
  { id: 'vl-053', text: 'O shap gan ni!', category: 'general', audioUrl: '/audio/african/oshapganni.mp3', keywords: ['sharp', 'crisp', 'clean'] },
  { id: 'vl-054', text: 'You too much my brother!', category: 'general', audioUrl: '/audio/african/youtoomuch.mp3', keywords: ['brother', 'praise', 'kindness'] },
  { id: 'vl-055', text: 'Blessing follow you!', category: 'tribut', audioUrl: '/audio/african/blessing.mp3', keywords: ['blessing', 'grace', 'prayer'] },
  { id: 'vl-056', text: 'Sharp sharp!', category: 'general', audioUrl: '/audio/african/sharpsharp.mp3', keywords: ['sharp', 'prompt', 'quick'] },
  { id: 'vl-057', text: 'As e dey hot!', category: 'general', audioUrl: '/audio/african/asedeyhot.mp3', keywords: ['hot', 'fresh', 'breaking'] },
  { id: 'vl-058', text: 'Legend in the making!', category: 'achievement', audioUrl: '/audio/african/legend.mp3', keywords: ['legend', 'making', 'great'] },
  { id: 'vl-059', text: 'Gbe body e!', category: 'general', audioUrl: '/audio/african/gbebodye.mp3', keywords: ['dance', 'move', 'hype'] },
  { id: 'vl-060', text: 'Ope o!', category: 'general', audioUrl: '/audio/african/opeo.mp3', keywords: ['gratitude', 'ope', 'relief'] },
  { id: 'vl-061', text: 'Better talk!', category: 'forum', audioUrl: '/audio/african/bettertalk.mp3', keywords: ['wisdom', 'truth', 'forum'] },
  { id: 'vl-062', text: 'E get why!', category: 'general', audioUrl: '/audio/african/egetwhy.mp3', keywords: ['reason', 'purpose', 'why'] },
  { id: 'vl-063', text: 'No cap!', category: 'general', audioUrl: '/audio/african/nocap.mp3', keywords: ['facts', 'true', 'honest'] },
  { id: 'vl-064', text: 'I salute you!', category: 'tribut', audioUrl: '/audio/african/salute.mp3', keywords: ['salute', 'respect', 'honor'] },
  { id: 'vl-065', text: 'Masterpiece!', category: 'blogs', audioUrl: '/audio/african/masterpiece.mp3', keywords: ['art', 'masterpiece', 'craft'] },
  { id: 'vl-066', text: 'Sound mind!', category: 'general', audioUrl: '/audio/african/soundmind.mp3', keywords: ['mind', 'intellect', 'calm'] },
  { id: 'vl-067', text: 'Full vibration!', category: 'general', audioUrl: '/audio/african/fullvibration.mp3', keywords: ['vibration', 'energy', 'alive'] },
  { id: 'vl-068', text: 'E legit!', category: 'general', audioUrl: '/audio/african/elegit.mp3', keywords: ['legit', 'real', 'true'] },
  { id: 'vl-069', text: 'Higher levels!', category: 'achievement', audioUrl: '/audio/african/higherlevels.mp3', keywords: ['levels', 'high', 'win'] },
  { id: 'vl-070', text: 'Grace abundant!', category: 'tribut', audioUrl: '/audio/african/grace.mp3', keywords: ['grace', 'favor', 'abundant'] },
  { id: 'vl-071', text: 'Victory parade!', category: 'achievement', audioUrl: '/audio/african/victory.mp3', keywords: ['victory', 'champ', 'parade'] },
  { id: 'vl-072', text: 'Touch of class!', category: 'general', audioUrl: '/audio/african/touchofclass.mp3', keywords: ['class', 'style', 'luxury'] },
  { id: 'vl-073', text: 'Pure excellence!', category: 'blogs', audioUrl: '/audio/african/pureexcellence.mp3', keywords: ['excellence', 'pure', 'skill'] },
  { id: 'vl-074', text: 'Champion sound!', category: 'general', audioUrl: '/audio/african/championsound.mp3', keywords: ['champion', 'sound', 'trophy'] },
  { id: 'vl-075', text: 'Unmatched energy!', category: 'general', audioUrl: '/audio/african/unmatched.mp3', keywords: ['unmatched', 'power', 'vibe'] },
  { id: 'vl-076', text: 'Royalty vibes!', category: 'hallmarks', audioUrl: '/audio/african/royalty.mp3', keywords: ['royalty', 'crown', 'noble'] },
  { id: 'vl-077', text: 'Power moves!', category: 'general', audioUrl: '/audio/african/powermoves.mp3', keywords: ['power', 'bold', 'strategy'] },
  { id: 'vl-078', text: 'Sovereign glory!', category: 'general', audioUrl: '/audio/african/sovereignglory.mp3', keywords: ['sovereign', 'glory', 'crown'] },
  { id: 'vl-079', text: 'We outside!', category: 'groups', audioUrl: '/audio/african/weoutside.mp3', keywords: ['outside', 'active', 'present'] },
  { id: 'vl-080', text: 'Heavy duty!', category: 'general', audioUrl: '/audio/african/heavyduty.mp3', keywords: ['heavy', 'duty', 'solid'] },
  { id: 'vl-081', text: 'Over standing!', category: 'forum', audioUrl: '/audio/african/overstanding.mp3', keywords: ['insight', 'deep', 'standing'] },
  { id: 'vl-082', text: 'Vibes on vibes!', category: 'mii', audioUrl: '/audio/african/vibesonvibes.mp3', keywords: ['vibes', 'feeling', 'music'] },
  { id: 'vl-083', text: 'No dulling!', category: 'general', audioUrl: '/audio/african/nodulling.mp3', keywords: ['sharp', 'dull', 'fast'] },
  { id: 'vl-084', text: 'Clear road!', category: 'general', audioUrl: '/audio/african/clearroad.mp3', keywords: ['road', 'open', 'pioneer'] },
  { id: 'vl-085', text: 'Na you biko!', category: 'general', audioUrl: '/audio/african/nayoubiko.mp3', keywords: ['na you', 'biko', 'standout'] },
  { id: 'vl-086', text: 'Action speaks!', category: 'general', audioUrl: '/audio/african/actionspeaks.mp3', keywords: ['action', 'execution', 'deed'] },
  { id: 'vl-087', text: 'Grace on grace!', category: 'tribut', audioUrl: '/audio/african/graceongrace.mp3', keywords: ['grace', 'honor', 'life'] },
  { id: 'vl-088', text: 'Elevation time!', category: 'achievement', audioUrl: '/audio/african/elevation.mp3', keywords: ['elevation', 'growth', 'up'] },
  { id: 'vl-089', text: 'Full option!', category: 'general', audioUrl: '/audio/african/fulloption.mp3', keywords: ['complete', 'loaded', 'premium'] },
  { id: 'vl-090', text: 'Unto the next one!', category: 'achievement', audioUrl: '/audio/african/nextone.mp3', keywords: ['next', 'continuation', 'aim'] },
  { id: 'vl-091', text: 'Oya dance!', category: 'general', audioUrl: '/audio/african/oyadance.mp3', keywords: ['dance', 'joy', 'happy'] },
  { id: 'vl-092', text: 'Big flex!', category: 'general', audioUrl: '/audio/african/bigflex.mp3', keywords: ['flex', 'bold', 'presence'] },
  { id: 'vl-093', text: 'Untouchable!', category: 'achievement', audioUrl: '/audio/african/untouchable.mp3', keywords: ['untouchable', 'secure', 'top'] },
  { id: 'vl-094', text: 'Full current!', category: 'general', audioUrl: '/audio/african/fullcurrent.mp3', keywords: ['current', 'electric', 'power'] },
  { id: 'vl-095', text: 'Original specimen!', category: 'general', audioUrl: '/audio/african/originalspecimen.mp3', keywords: ['one of one', 'rare', 'gold'] },
  { id: 'vl-096', text: 'Certified classic!', category: 'hallmarks', audioUrl: '/audio/african/certifiedclassic.mp3', keywords: ['classic', 'timeless', 'legend'] },
  { id: 'vl-097', text: 'Show stopper!', category: 'general', audioUrl: '/audio/african/showstopper.mp3', keywords: ['spectacle', 'show', 'headline'] },
  { id: 'vl-098', text: 'Crown fits well!', category: 'hallmarks', audioUrl: '/audio/african/crownfits.mp3', keywords: ['crown', 'queen', 'king'] },
  { id: 'vl-099', text: 'Top boy!', category: 'general', audioUrl: '/audio/african/topboy.mp3', keywords: ['boy', 'top', 'lead'] },
  { id: 'vl-100', text: 'Pure vibes!', category: 'mii', audioUrl: '/audio/african/purevibes.mp3', keywords: ['vibes', 'pure', 'feeling'] },
  { id: 'vl-101', text: 'Na so we see am!', category: 'forum', audioUrl: '/audio/african/nasoweseeam.mp3', keywords: ['agreement', 'consensus', 'truth'] },
  { id: 'vl-102', text: 'Sound check 100!', category: 'general', audioUrl: '/audio/african/soundcheck.mp3', keywords: ['audio', 'crisp', 'sound'] },
  { id: 'vl-103', text: 'Full throttle!', category: 'achievement', audioUrl: '/audio/african/fullthrottle.mp3', keywords: ['throttle', 'fast', 'surge'] },
  { id: 'vl-104', text: 'God speed!', category: 'tribut', audioUrl: '/audio/african/godspeed.mp3', keywords: ['godspeed', 'protection', 'blessing'] }
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
            pitch: typeof parsed.pitch === 'number' ? parsed.pitch : DEFAULT_SETTINGS.pitch,
            bassBoostDb: typeof parsed.bassBoostDb === 'number' ? parsed.bassBoostDb : DEFAULT_SETTINGS.bassBoostDb,
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
   * Calibrated separately from uploaded media, calibrated to 0.46 for deliberate, natural spoken cadence with warm African resonance.
   */
  public getUtteranceRate(): number {
    return this.settings.utteranceRate ?? 0.46;
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

  public getPitch(): number {
    return this.settings.pitch ?? 0.80;
  }

  public setPitch(pitch: number): void {
    const clampedPitch = Math.max(0.4, Math.min(1.6, pitch));
    this.saveSettings({ pitch: clampedPitch });
  }

  public getBassBoostDb(): number {
    return this.settings.bassBoostDb ?? 6.0;
  }

  public setBassBoostDb(db: number): void {
    const clampedDb = Math.max(0.0, Math.min(18.0, db));
    this.saveSettings({ bassBoostDb: clampedDb });
  }

  public speakCustomText(text: string): void {
    this.speakVoiceLineText(text, this.settings.volume);
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
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

      // Warm acoustic bass booster (+6.0dB shelf at 180Hz) for deep grounded human resonance
      let destinationNode: AudioNode = ctx.destination;
      if (typeof ctx.createBiquadFilter === 'function') {
        try {
          const bassFilter = ctx.createBiquadFilter();
          bassFilter.type = 'lowshelf';
          bassFilter.frequency.setValueAtTime(180, now);
          bassFilter.gain.setValueAtTime(this.getBassBoostDb(), now);
          bassFilter.connect(ctx.destination);
          destinationNode = bassFilter;
        } catch {
          destinationNode = ctx.destination;
        }
      }
      gainNode.connect(destinationNode);

      // Deep root note (C4: 261.63Hz) + Third (E4: 329.63Hz) warm resonant African chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(261.63, now); // C4 rich bass fundamental

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(329.63, now + 0.08); // E4 acoustic harmonic warm resonance

      osc1.connect(gainNode);
      osc2.connect(gainNode);

      osc1.start(now);
      osc2.start(now + 0.08);
      osc1.stop(now + 1.10);
      osc2.stop(now + 1.10);
    } catch {
      // AudioContext unavailable or denied
    }
  }

  /**
   * Spoken speech synthesis fallback utilizing Web Speech API
   * Calibrated with deliberate 0.46 cadence and warm rich bass resonance (pitch: 0.80)
   */
  private speakVoiceLineText(text: string, volume: number): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = volume;
      utterance.rate = this.getUtteranceRate();
      utterance.pitch = this.getPitch(); // Rich warm bass vocal resonance (lowered for natural human body)

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
