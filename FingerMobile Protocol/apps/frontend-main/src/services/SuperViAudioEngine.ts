// ============================================================================
// SuperVi Audio & Haptic Engine
// Manages real African combo voice lines, Web Audio FX, soundtracks & haptics
// ============================================================================

export type AfricanVoiceLine =
  | 'small_combo'
  | 'great_combo'
  | 'colossal_combo'
  | 'stunning'
  | 'wahala'
  | 'owo_ni_koko'
  | 'gbaski'
  | 'blessings'
  | 'see_gobe'
  | 'madt_o'
  | 'sweet'
  | 'boom'
  | 'gem_found'
  | 'awesome'
  | 'thumbs_up';

class SuperViAudioEngine {
  private static instance: SuperViAudioEngine;
  private audioContext: AudioContext | null = null;
  private backgroundMusic: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private audioCache: Map<string, HTMLAudioElement> = new Map();

  private voiceFileMap: Record<string, string> = {
    small_combo: '/audio/african/small-combo.mp3',
    great_combo: '/audio/african/great-combo.mp3',
    colossal_combo: '/audio/african/colossal-combo.mp3',
    stunning: '/audio/african/stunning.mp3',
    wahala: '/audio/african/wahala-dey.mp3',
    owo_ni_koko: '/audio/african/owo-ni-koko.mp3',
    gbaski: '/audio/african/oomo-gbaski.mp3',
    blessings: '/audio/african/blessings-blessings.mp3',
    see_gobe: '/audio/african/see-gobe.mp3',
    madt_o: '/audio/african/madt-o.mp3',
    sweet: '/audio/african/sweet.mp3',
    boom: '/audio/african/boom.mp3',
    gem_found: '/audio/african/gem-found.mp3',
    awesome: '/audio/african/awesome.mp3',
    thumbs_up: '/audio/african/thumbs-up.mp3'
  };

  private constructor() {
    // Pre-cache primary voice files
    Object.entries(this.voiceFileMap).forEach(([key, url]) => {
      try {
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.audioCache.set(key, audio);
      } catch (_) {
        // Audio element pre-creation warning suppression
      }
    });
  }

  public static getInstance(): SuperViAudioEngine {
    if (!SuperViAudioEngine.instance) {
      SuperViAudioEngine.instance = new SuperViAudioEngine();
    }
    return SuperViAudioEngine.instance;
  }

  private getAudioContext(): AudioContext | null {
    if (!this.audioContext && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.backgroundMusic) {
      this.backgroundMusic.muted = muted;
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public startSoundtrack(): void {
    if (this.isMuted) return;
    try {
      if (!this.backgroundMusic) {
        this.backgroundMusic = new Audio('/audio/supervi-runner.aac');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.35;
      }
      this.backgroundMusic.play().catch(() => {
        // User interaction required to play audio on certain browsers
      });
    } catch (_) {
      // Ignored
    }
  }

  public pauseSoundtrack(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
  }

  public playVoiceLine(type: AfricanVoiceLine): void {
    if (this.isMuted) return;

    const cached = this.audioCache.get(type);
    if (cached) {
      cached.currentTime = 0;
      cached.volume = 0.9;
      cached.play().catch(() => {
        this.speakFallback(type);
      });
      return;
    }

    // If no static file, use speech synthesis with African persona
    this.speakFallback(type);
  }

  private speakFallback(type: AfricanVoiceLine): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const phrases: Record<AfricanVoiceLine, string> = {
      small_combo: 'Small combo!',
      great_combo: 'Great combo!',
      colossal_combo: 'Colossal combo!',
      stunning: 'Stunning move!',
      wahala: 'Wahala dey!',
      owo_ni_koko: 'Owo ni Koko!',
      gbaski: 'Omo you gbaski!',
      blessings: 'Blessings! Blessings!',
      see_gobe: 'See gobe!',
      madt_o: 'Madt o!',
      sweet: 'Sweet move!',
      boom: 'Boom!',
      gem_found: 'Gem found!',
      awesome: 'Awesome!',
      thumbs_up: 'Thumbs up!'
    };

    const text = phrases[type] || 'SuperVi!';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88; // Relaxed deliberate African cadence
    utterance.pitch = 0.85; // Warm human-like baritone bass resonance
    utterance.volume = 0.85;

    // Try finding an African English voice if available in the browser
    const voices = window.speechSynthesis.getVoices();
    const africanVoice = voices.find(v => v.lang.includes('NG') || v.lang.includes('ZA') || v.name.includes('Nigeria'));
    if (africanVoice) {
      utterance.voice = africanVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  /**
   * High performance synthesized Web Audio sound FX
   */
  public playSoundEffect(effect: 'JUMP' | 'SLIDE' | 'COIN' | 'POWERUP' | 'CRASH' | 'SWIPE' | 'JETPACK' | 'MAGNET' | 'FRUIT' | 'PORTAL' | 'CHASER_ROAR'): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (effect) {
      case 'SWIPE':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        break;

      case 'JUMP':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.18);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
        break;

      case 'SLIDE':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.22);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
        break;

      case 'COIN':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1320, now + 0.06);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.14);
        break;

      case 'POWERUP':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.28);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
        break;

      case 'CRASH':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
        this.triggerHaptic('HEAVY');
        break;

      case 'JETPACK':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;

      case 'MAGNET':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.linearRampToValueAtTime(680, now + 0.2);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;

      case 'FRUIT':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.setValueAtTime(990, now + 0.08);
        osc.frequency.setValueAtTime(1320, now + 0.16);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);
        osc.start(now);
        osc.stop(now + 0.24);
        break;

      case 'PORTAL':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(1800, now + 0.5);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;

      case 'CHASER_ROAR':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.45);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
        this.triggerHaptic('HEAVY');
        break;
    }
  }

  public playJump(): void {
    this.playSoundEffect('JUMP');
  }

  public playSlide(): void {
    this.playSoundEffect('SLIDE');
  }

  public playCollectOrb(): void {
    this.playSoundEffect('COIN');
  }

  public playObstacleHit(): void {
    this.playSoundEffect('CRASH');
  }

  public playSwipe(): void {
    this.playSoundEffect('SWIPE');
  }

  public playJetpack(): void {
    this.playSoundEffect('JETPACK');
  }

  public playMagnet(): void {
    this.playSoundEffect('MAGNET');
  }

  public playFruit(): void {
    this.playSoundEffect('FRUIT');
  }

  public playPortal(): void {
    this.playSoundEffect('PORTAL');
  }

  public playChaserRoar(): void {
    this.playSoundEffect('CHASER_ROAR');
  }

  /**
   * 5D Haptic Vibration Engine (Web Vibration API)
   */
  public triggerHaptic(intensity: 'LIGHT' | 'MEDIUM' | 'HEAVY' | 'COMBO' | number | number[]): void {
    if (typeof window === 'undefined' || !navigator.vibrate) return;

    try {
      if (typeof intensity === 'number' || Array.isArray(intensity)) {
        navigator.vibrate(intensity);
        return;
      }
      switch (intensity) {
        case 'LIGHT':
          navigator.vibrate(30);
          break;
        case 'MEDIUM':
          navigator.vibrate([60, 40, 60]);
          break;
        case 'HEAVY':
          navigator.vibrate([120, 60, 180]);
          break;
        case 'COMBO':
          navigator.vibrate([40, 30, 40, 30, 80]);
          break;
      }
    } catch (_) {
      // Haptics permission or browser support fallback
    }
  }
}

export { SuperViAudioEngine };
export default SuperViAudioEngine.getInstance();
