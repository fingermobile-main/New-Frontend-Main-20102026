import React, {} from 'react';
/**
 * FINGERMOBILE PROTOCOL - AUDIO & VOICE LINE ENGINE
 * PURPOSE: High-Performance Audio Playback Engine managing African Cultured Voice Line triggers.
 */

import { ApiResponse } from '../types/api';

// Strongly typed definitions for cleaner domain modeling
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
  timestamp: string;
  memberId: string | null;
}

// Immutable Local Database Store representing localized audio records
const allVoiceLines: VoiceLine[] = [
  { id: 'ev-1', text: 'Great!', category: 'general', audioUrl: '/audio/african/great.mp3', keywords: ['achievement', 'success', 'level', 'win'] },
  { id: 'ev-2', text: 'Sugar crush', category: 'sugarcrush', audioUrl: '/audio/african/sugar-crush.mp3', keywords: ['achievement', 'success', 'win'] },
  { id: 'ev-3', text: 'Wooow!', category: 'general', audioUrl: '/audio/african/woooow.mp3', keywords: ['disappointment', 'excitement', 'level', 'move'] },
  { id: 'ev-4', text: 'Oh yeeeaah!', category: 'general', audioUrl: '/audio/african/oh-yeaah.mp3', keywords: ['gameplay', 'matches', 'effects', 'goal'] },
  { id: 'ev-5', text: 'Bootilicious!', category: 'fingerwars', audioUrl: '/audio/african/bootilicious.mp3', keywords: ['fingerwars', 'level', 'points', '12points', '20points', '27points'] },
  { id: 'ev-6', text: 'Oooh yeah go on!', category: 'general', audioUrl: '/audio/african/oooh-yeah-go-on.mp3', keywords: ['objective', 'completion', 'progress'] },
  { id: 'ev-7', text: "Nice One, you're there already", category: 'fingerwars', audioUrl: '/audio/african/nice-one.mp3', keywords: ['variations', 'progress', 'completion'] },
  { id: 'ev-8', text: "You're mine", category: 'acquisition', audioUrl: '/audio/african/youre-mine.mp3', keywords: ['acquisition', 'objects', 'gifts', 'earnings'] },
  { id: 'ev-9', text: 'Hi ya doing', category: 'greeting', audioUrl: '/audio/african/hi-ya-doing.mp3', keywords: ['greeting', 'meeting', 'first', 'time'] },
  { id: 'ev-10', text: 'Wahala Dey', category: 'lamentation', audioUrl: '/audio/african/wahala-dey.mp3', keywords: ['obstacle', 'problem', 'issue'] },
  { id: 'ev-11', text: 'See Gobe', category: 'lamentation', audioUrl: '/audio/african/see-gobe.mp3', keywords: ['obstacle', 'seeing', 'encountering'] },
  { id: 'ev-12', text: 'Kilode', category: 'exclamation', audioUrl: '/audio/african/kilode.mp3', keywords: ['questioning', 'activity', 'reason', 'answer'] },
  { id: 'ev-13', text: 'Owo ni Koko', category: 'earnings', audioUrl: '/audio/african/owo-ni-koko.mp3', keywords: ['points', 'gifts', 'money', 'bonus', 'FIC'] },
  { id: 'ev-14', text: 'Wonderful', category: 'surprise', audioUrl: '/audio/african/wonderful.mp3', keywords: ['surprise', 'amazement'] },
  { id: 'ev-15', text: 'Get a Hug', category: 'appraisal', audioUrl: '/audio/african/get-a-hug.mp3', keywords: ['milestone', 'failure', 'affection'] },
  { id: 'ev-16', text: 'Dance for me', category: 'enticement', audioUrl: '/audio/african/dance-for-me.mp3', keywords: ['happy', 'retry', 'redo', 'earn', 'achieve'] },
  { id: 'ev-17', text: 'Play my music!!', category: 'boastful', audioUrl: '/audio/african/play-my-music.mp3', keywords: ['boast', 'earned', 'achieved', 'acquired'] },
  { id: 'ev-18', text: 'Dash me naa, Abeg come Bless me na', category: 'request', audioUrl: '/audio/african/dash-me-abeg.mp3', keywords: ['request', 'give', 'gift', 'funding'] },
  { id: 'ev-19', text: 'Gift me', category: 'request', audioUrl: '/audio/african/gift-me.mp3', keywords: ['request', 'give', 'gift'] },
  { id: 'ev-20', text: 'Thank you', category: 'appraisal', audioUrl: '/audio/african/thank-you.mp3', keywords: ['appreciation', 'receiving', 'gifts', 'achievement'] },
  { id: 'ev-21', text: 'I need Urgent 2k', category: 'funding', audioUrl: '/audio/african/i-need-urgent-2k.mp3', keywords: ['funding', 'begging', 'request'] },
  { id: 'ev-22', text: 'Urgent 2k', category: 'funding', audioUrl: '/audio/african/urgent-2k.mp3', keywords: ['funding', 'request'] },
  { id: 'ev-23', text: 'Urgent 5k', category: 'funding', audioUrl: '/audio/african/urgent-5k.mp3', keywords: ['funding', 'request'] },
  { id: 'ev-24', text: 'I need Urgent 5k', category: 'funding', audioUrl: '/audio/african/i-need-urgent-5k.mp3', keywords: ['funding', 'begging', 'request'] },
  { id: 'ev-25', text: 'Miss me', category: 'affection', audioUrl: '/audio/african/miss-me.mp3', keywords: ['affection', 'P2P', 'matching', 'return'] },
  { id: 'ev-26', text: 'I miss you', category: 'affection', audioUrl: '/audio/african/i-miss-you.mp3', keywords: ['affection', 'P2P', 'matching', 'return'] },
  { id: 'ev-27', text: "Let's do this", category: 'agreement', audioUrl: '/audio/african/lets-do-this.mp3', keywords: ['agreement', 'action'] },
  { id: 'ev-28', text: 'Awesome', category: 'appraisal', audioUrl: '/audio/african/awesome.mp3', keywords: ['appraisal', 'affirmation', 'achievement', 'bonus', 'gifts'] },
  { id: 'ev-29', text: 'Thumbs up!', category: 'appraisal', audioUrl: '/audio/african/thumbs-up.mp3', keywords: ['appraisal', 'affirmation', 'achievement', 'bonus', 'gifts'] },
  { id: 'ev-30', text: 'Say whaaaaaaa', category: 'expression', audioUrl: '/audio/african/say-whaaaa.mp3', keywords: ['excitement', 'shock', 'jolt', 'surprise', 'injury'] },
  { id: 'ev-31', text: 'Whatever', category: 'expression', audioUrl: '/audio/african/whatever.mp3', keywords: ['restrictions', 'freedom', 'surprise', 'confusion'] },
  { id: 'ev-32', text: 'Stunning!', category: 'appraisal', audioUrl: '/audio/african/stunning.mp3', keywords: ['appraisal', 'affirmation', 'acquisition', 'gain'] },
  { id: 'ev-33', text: 'You look great', category: 'appraisal', audioUrl: '/audio/african/you-look-great.mp3', keywords: ['appraisal', 'affirmation', 'physical'] },
  { id: 'ev-34', text: 'Wereey', category: 'achievement', audioUrl: '/audio/african/wereey.mp3', keywords: ['stunt', 'achieved', 'impossible'] },
  { id: 'ev-35', text: 'Madt o!', category: 'achievement', audioUrl: '/audio/african/madt-o.mp3', keywords: ['stunt', 'achieved', 'unusual'] },
  { id: 'ev-36', text: 'Sharp!', category: 'achievement', audioUrl: '/audio/african/sharp.mp3', keywords: ['points', 'achieved'] },
  { id: 'ev-37', text: 'Oomo you gbaski', category: 'appraisal', audioUrl: '/audio/african/oomo-gbaski.mp3', keywords: ['appraisal', 'great', 'work'] },
  { id: 'ev-38', text: 'O B O!', category: 'achievement', audioUrl: '/audio/african/o-b-o.mp3', keywords: ['earned', 'big'] },
  { id: 'ev-39', text: 'Billion Dollar Gang', category: 'achievement', audioUrl: '/audio/african/billion-dollar-gang.mp3', keywords: ['joined', 'success'] },
  { id: 'ev-40', text: 'Correct', category: 'achievement', audioUrl: '/audio/african/correct.mp3', keywords: ['achievement', 'made'] },
  { id: 'ev-41', text: 'oOoOO ma Gaddddd!', category: 'achievement', audioUrl: '/audio/african/ooooma-gaddddd.mp3', keywords: ['stunt', 'something', 'new', 'colossal'] },
  { id: 'ev-42', text: 'My Goodness', category: 'stun', audioUrl: '/audio/african/my-goodness.mp3', keywords: ['appraisal', 'surprise'] },
  { id: 'ev-43', text: "You're Endowed", category: 'stun', audioUrl: '/audio/african/youre-endowed.mp3', keywords: ['appraisal', 'physical', 'attributes'] },
  { id: 'ev-44', text: "You're gorgeous", category: 'stun', audioUrl: '/audio/african/youre-gorgeous.mp3', keywords: ['appraisal', 'admirations'] },
  { id: 'ev-45', text: 'Divine', category: 'stun', audioUrl: '/audio/african/divine.mp3', keywords: ['divine', 'mode', 'impressive', 'move'] },
  { id: 'ev-46', text: 'Blessings Blessings Blessings', category: 'stun', audioUrl: '/audio/african/blessings-blessings.mp3', keywords: ['appraisal', 'blessings'] },
  { id: 'cb-1', text: 'Small combo!', category: 'combo_small', audioUrl: '/audio/african/small-combo.mp3', keywords: ['small', 'combo', 'match'] },
  { id: 'cb-2', text: 'Great combo!', category: 'combo_large', audioUrl: '/audio/african/great-combo.mp3', keywords: ['great', 'combo', 'match'] },
  { id: 'cb-3', text: 'Colossal combo!', category: 'combo_colossal', audioUrl: '/audio/african/colossal-combo.mp3', keywords: ['colossal', 'combo', 'massive'] },
  { id: 'cb-4', text: 'Sweet!', category: 'combo', audioUrl: '/audio/african/sweet.mp3', keywords: ['good', 'nice', 'combo'] },
  { id: 'cb-5', text: 'Boom!', category: 'combo', audioUrl: '/audio/african/boom.mp3', keywords: ['powerful', 'impact', 'effect'] },
  { id: 'cb-6', text: 'Nice!', category: 'combo', audioUrl: '/audio/african/nice.mp3', keywords: ['combo', 'good'] },
  { id: 'cb-7', text: 'Fire!', category: 'combo', audioUrl: '/audio/african/fire.mp3', keywords: ['combo', 'hot'] },
  { id: 'cb-8', text: 'Lit!', category: 'combo', audioUrl: '/audio/african/lit.mp3', keywords: ['combo', 'exciting'] },
  { id: 'cb-9', text: 'Sick!', category: 'combo', audioUrl: '/audio/african/sick.mp3', keywords: ['combo', 'impressive'] },
  { id: 'fw-1', text: 'Bootilicious!', category: 'fingerwars', audioUrl: '/audio/african/bootilicious-fingerwars.mp3', keywords: ['fingerwars', 'level', 'move'] },
  { id: 'sv-1', text: 'SuperVi!', category: 'supervi', audioUrl: '/audio/african/supervi.mp3', keywords: ['supervi', 'game'] },
  { id: 'go-1', text: 'GameOn!', category: 'gameon', audioUrl: '/audio/african/gameon.mp3', keywords: ['gameon', 'start', 'play'] },
  { id: 'cm-1', text: 'Great post!', category: 'forum', audioUrl: '/audio/african/great-post.mp3', keywords: ['forum', 'post', 'community'] },
  { id: 'cm-2', text: 'Gem found!', category: 'gems', audioUrl: '/audio/african/gem-found.mp3', keywords: ['gems', 'discovery', 'valuable'] }
];

class VoiceLineService {
  private static instance: VoiceLineService;
  private audioContext: AudioContext | null = null;
  private initialized = false;
  private memberId: string | null = null;

  private constructor() {}

  public static getInstance(): VoiceLineService {
    if (!VoiceLineService.instance) {
      VoiceLineService.instance = new VoiceLineService();
    }
    return VoiceLineService.instance;
  }

  /**
   * Initialize AudioContext with SSR protection blocks
   */
  public async initialize(memberId?: string): Promise<void> {
    if (this.initialized) return;

    return new Promise((resolve) => {
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            this.audioContext = new AudioContextClass();
          }
        }
        this.initialized = true;
        this.memberId = memberId || null;
        console.info('VoiceLineService successfully initialized with African voice line profiles.');
        resolve();
      }, 500);
    });
  }

  private getBaseHeaders(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
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

      if (!response.ok) throw new Error(`HTTP Error response: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching voice lines from API, using fallback store:', error);
      return this.getVoiceLinesByCategory(category);
    }
  }

  public async fetchRandomVoiceLineByCategory(category: VoiceLineCategory): Promise<VoiceLine | null> {
    try {
      const response = await fetch(`/api/voice-lines/categories/${category}/random`, {
        method: 'GET',
        headers: this.getBaseHeaders()
      });

      if (!response.ok) throw new Error(`HTTP Error response: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching random voice line from API, using fallback store:', error);
      return this.getRandomVoiceLineByCategory(category);
    }
  }

  public async fetchVoiceLineCategories(): Promise<VoiceLineCategory[]> {
    try {
      const response = await fetch('/api/voice-lines/categories', {
        method: 'GET',
        headers: this.getBaseHeaders()
      });

      if (!response.ok) throw new Error(`HTTP Error response: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories from API, using fallback calculations:', error);
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
    if (lines.length === 0) return null;
    return lines[Math.floor(Math.random() * lines.length)];
  }

  public async searchVoiceLines(keyword: string): Promise<VoiceLine[]> {
    try {
      const response = await fetch(`/api/voice-lines/search?q=${encodeURIComponent(keyword)}`, {
        method: 'GET',
        headers: this.getBaseHeaders()
      });

      if (!response.ok) throw new Error(`HTTP Error response: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error matching search query over API, dropping to local runtime engine:', error);
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

  public async findMatchingKeywords(text: string, voiceLines: VoiceLine[]): Promise<VoiceLine[]> {
    const lowerText = text.toLowerCase().trim();
    if (!lowerText) return [];

    return voiceLines.filter((line) => 
      line.keywords.some((kw) => {
        const lowerKw = kw.toLowerCase();
        return lowerKw.includes(lowerText) || lowerText.includes(lowerKw);
      })
    );
  }

  public async logVoiceLinePlay(voiceLineId: string, eventType = 'play'): Promise<void> {
    try {
      const logBody: VoiceLineLogPayload = {
        voiceLineId,
        eventType,
        timestamp: new Date().toISOString(),
        memberId: this.memberId
      };

      const response = await fetch('/api/voice-lines/log', {
        method: 'POST',
        headers: this.getBaseHeaders(),
        body: JSON.stringify(logBody)
      });

      if (!response.ok) throw new Error(`Failed to log audio trace event: ${response.status}`);
    } catch (error) {
      console.error('Error logging voice line tracking metrics:', error);
    }
  }

  public getRandomVoiceLineByCategories(categories: VoiceLineCategory[]): VoiceLine | null {
    const lines: VoiceLine[] = [];
    categories.forEach((category) => {
      lines.push(...this.getVoiceLinesByCategory(category));
    });
    
    if (lines.length === 0) return null;
    return lines[Math.floor(Math.random() * lines.length)];
  }

  public searchVoiceLinesLocalOnly(keyword: string): VoiceLine[] {
    return this.searchVoiceLinesLocal(keyword);
  }

  /**
   * Play asset line with automatic device fallback tracking
   */
  public async playVoiceLine(text: string, voiceLineId?: string, eventType = 'general'): Promise<void> {
    if (!this.initialized) {
      console.warn('VoiceLineService tracking alert: Playback invoked before initialization context completed.');
    }

    try {
      let matchingVoiceLine: VoiceLine | undefined;
      
      if (voiceLineId) {
        matchingVoiceLine = allVoiceLines.find((line) => line.id === voiceLineId);
      } else {
        matchingVoiceLine = allVoiceLines.find((line) => line.text.toLowerCase() === text.toLowerCase());
      }
      
      if (matchingVoiceLine && matchingVoiceLine.audioUrl && typeof window !== 'undefined') {
        console.info(`Triggering audio trace asset: "${matchingVoiceLine.text}" -> ${matchingVoiceLine.audioUrl}`);
        const audio = new Audio(matchingVoiceLine.audioUrl);
        await audio.play();
        
        await this.logVoiceLinePlay(matchingVoiceLine.id, eventType);
      } else {
        console.warn(`Audio node lookup mismatch for description: "${text}". Running execution delay thread simulator.`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.error('HTML5 Audio pipeline playback error execution:', error);
      throw error;
    }
  }
}

const voiceLineServiceInstance = VoiceLineService.getInstance();
export default voiceLineServiceInstance;