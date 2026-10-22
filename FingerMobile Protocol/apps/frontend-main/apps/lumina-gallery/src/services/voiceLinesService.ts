/**
 * Voice Lines Service for Lumina Gallery Game
 * Implements 52 African Nigerian Igbo/Yoruba accent voice lines
 */

interface VoiceLine {id: string;
  text: string;
  category: string;
  accent: string;
}

class VoiceLinesService {
  private voiceLines: VoiceLine[] = [];

  constructor() {
    this.initializeVoiceLines();
  }

  private initializeVoiceLines() {
    // Achievement & Success lines (8)
    this.voiceLines.push(
      {id: 'ach-001',
  text: "Waw! You dey smash am o! Una go far!",
  category: 'achievement',
  accent: 'yoruba' },
      {id: 'ach-002',
  text: "Chai! This one sweet pass honey! Well done!",
  category: 'achievement',
  accent: 'ibo' },
      {id: 'ach-003',
  text: "Oya! You don carry am go! Big congrats!",
  category: 'achievement',
  accent: 'yoruba' },
      {id: 'ach-004',
  text: "Ihe oma! You just show say you be the boss!",
  category: 'achievement',
  accent: 'ibo' },
      {id: 'ach-005',
  text: "Ẹ kú iṣẹ́! You just fire am well well!",
  category: 'achievement',
  accent: 'yoruba' },
      {id: 'ach-006',
  text: "Nna! This na big thing you just do!",
  category: 'achievement',
  accent: 'ibo' },
      {id: 'ach-007',
  text: "Joor! You don carry am go! Una go far!",
  category: 'achievement',
  accent: 'yoruba' },
      {id: 'ach-008',
  text: "Ndioma! Your work fit make person jealous!",
  category: 'achievement',
  accent: 'ibo' }
    );

    // Greeting & Social lines (12)
    this.voiceLines.push(
      {id: 'greet-001',
  text: "Ẹ kaáàrọ̀! Welcome my people! How far business?",
  category: 'greeting',
  accent: 'yoruba' },
      {id: 'greet-002',
  text: "Kedu! Hope say una dey enjoy life?",
  category: 'greeting',
  accent: 'ibo' },
      {id: 'greet-003',
  text: "Ẹ kúáàárọ̀! Today go better pass yesterday!",
  category: 'greeting',
  accent: 'yoruba' },
      {id: 'greet-004',
  text: "Nnọọ! Come join us make una happy today!",
  category: 'greeting',
  accent: 'ibo' },
      {id: 'greet-005',
  text: "Kí ni fẹ́? Hope say you ready make money today?",
  category: 'greeting',
  accent: 'yoruba' },
      {id: 'greet-006',
  text: "Ị kene mma! Let's go make una rich today!",
  category: 'greeting',
  accent: 'ibo' },
      {id: 'greet-007',
  text: "Bawo ni? Una go chop fine today!",
  category: 'greeting',
  accent: 'yoruba' },
      {id: 'greet-008',
  text: "Kedu ka ọ dị! Life good, let's enjoy am!",
  category: 'greeting',
  accent: 'ibo' },
      {id: 'greet-009',
  text: "Kaabo! Make una see say today fit better!",
  category: 'greeting',
  accent: 'yoruba' },
      {id: 'greet-010',
  text: "Ndi owe! Let's work together make una reach goal!",
  category: 'greeting',
  accent: 'ibo' },
      {id: 'greet-011',
  text: "Ẹ n lẹ́ o! Make we scatter everywhere with success today!",
  category: 'greeting',
  accent: 'yoruba' },
      {id: 'greet-012',
  text: "Daalụ nnoo! How far chop, how far work?",
  category: 'greeting',
  accent: 'ibo' }
    );

    // Funding & Requests (4)
    this.voiceLines.push(
      {id: 'fund-001',
  text: "Brother, small money go make big money! Support us!",
  category: 'funding',
  accent: 'yoruba' },
      {id: 'fund-002',
  text: "We need small support make we reach big goal!",
  category: 'funding',
  accent: 'ibo' },
      {id: 'fund-003',
  text: "Come support us make we build big thing!",
  category: 'funding',
  accent: 'yoruba' },
      {id: 'fund-004',
  text: "Investment now go bring big return later!",
  category: 'funding',
  accent: 'ibo' }
    );

    // Affection & Social (3)
    this.voiceLines.push(
      {id: 'aff-001',
  text: "I love una people! Together we go grow!",
  category: 'affection',
  accent: 'yoruba' },
      {id: 'aff-002',
  text: "You my family! We go succeed together!",
  category: 'affection',
  accent: 'ibo' },
      {id: 'aff-003',
  text: "Omo mi! You go far well well!",
  category: 'affection',
  accent: 'yoruba' }
    );

    // Appraisal & Expressions (19)
    this.voiceLines.push(
      {id: 'appr-001',
  text: "Chai! This one sweet pass honey! I like am!",
  category: 'appraisal',
  accent: 'ibo' },
      {id: 'appr-002',
  text: "Waw! This one sharp sharp! Very nice!",
  category: 'appraisal',
  accent: 'yoruba' },
      {id: 'appr-003',
  text: "Ihe oma! This work fit make person jealous!",
  category: 'appraisal',
  accent: 'ibo' },
      {id: 'appr-004',
  text: "Sublime! This beauty go enter heaven!",
  category: 'appraisal',
  accent: 'yoruba' },
      {id: 'appr-005',
  text: "Nna! This thing go better pass I think!",
  category: 'appraisal',
  accent: 'ibo' },
      {id: 'appr-006',
  text: "Ẹ kú iṣẹ́! This quality go hard to get!",
  category: 'appraisal',
  accent: 'yoruba' },
      {id: 'appr-007',
  text: "This na pure class! No competition!",
  category: 'appraisal',
  accent: 'ibo' },
      {id: 'appr-008',
  text: "This one fit make person call am 'perfect'!",
  category: 'appraisal',
  accent: 'yoruba' },
      {id: 'appr-009',
  text: "Wahala finish! This one easy pass!",
  category: 'appraisal',
  accent: 'ibo' },
      {id: 'appr-010',
  text: "This one clean finish! No stress!",
  category: 'appraisal',
  accent: 'yoruba' },
      {id: 'appr-011',
  text: "This na real deal! No be small thing!",
  category: 'appraisal',
  accent: 'ibo' },
      {id: 'appr-012',
  text: "This one shine bright pass sun!",
  category: 'appraisal',
  accent: 'yoruba' },
      {id: 'appr-013',
  text: "This work fit make person call owner 'genius'!",
  category: 'appraisal',
  accent: 'ibo' },
      {id: 'appr-014',
  text: "This one make sense! This one fit business!",
  category: 'appraisal',
  accent: 'yoruba' },
      {id: 'appr-015',
  text: "This na pure gold! No be silver!",
  category: 'appraisal',
  accent: 'ibo' },
      {id: 'appr-016',
  text: "This one pass exam without stress!",
  category: 'appraisal',
  accent: 'yoruba' },
      {id: 'appr-017',
  text: "This one fit make person forget food!",
  category: 'appraisal',
  accent: 'ibo' },
      {id: 'appr-018',
  text: "This beauty go make person call owner 'artist'!",
  category: 'appraisal',
  accent: 'yoruba' },
      {id: 'appr-019',
  text: "This one work well! No wahala!",
  category: 'appraisal',
  accent: 'ibo' }
    );

    // Combo announcements (6)
    this.voiceLines.push(
      {id: 'combo-001',
  text: "Double success! Double happiness! Go go go!",
  category: 'combo',
  accent: 'yoruba' },
      {id: 'combo-002',
  text: "Two times success! Una don fit business!",
  category: 'combo',
  accent: 'ibo' },
      {id: 'combo-003',
  text: "Triple blessing! Baba God don do am again!",
  category: 'combo',
  accent: 'yoruba' },
      {id: 'combo-004',
  text: "Big combo! Money go rain like rain!",
  category: 'combo',
  accent: 'ibo' },
      {id: 'combo-005',
  text: "Combo king! Una go make history today!",
  category: 'combo',
  accent: 'yoruba' },
      {id: 'combo-006',
  text: "Success chain! Una go reach the top soon!",
  category: 'combo',
  accent: 'ibo' }
    );
  }

  /**
   * Get a random voice line by category
   */
  getRandomVoiceLineByCategory(category: string): VoiceLine | null {
    const categoryLines = this.voiceLines.filter(line => line.category === category);
    if (categoryLines.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * categoryLines.length);
    return categoryLines[randomIndex];
  }

  /**
   * Get a random voice line from any category
   */
  getRandomVoiceLine(): VoiceLine {
    const randomIndex = Math.floor(Math.random() * this.voiceLines.length);
    return this.voiceLines[randomIndex];
  }

  /**
   * Get all voice lines by category
   */
  getVoiceLinesByCategory(category: string): VoiceLine[] {
    return this.voiceLines.filter(line => line.category === category);
  }

  /**
   * Helper function to query speech engines securely
   */
  private getNigerianOrEnglishVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    
    // Attempt exact match for Nigeria, fallback to broader rules
    const targetVoice = voices.find(v => 
      v.lang.includes('en-NG') || 
      v.name.toLowerCase().includes('ng') ||
      v.name.toLowerCase().includes('nigeria')
    );

    return targetVoice || voices.find(v => v.lang.startsWith('en-')) || null;
  }

  /**
   * Play a voice line using the Web Speech API with safe asynchronous checking
   */
  async playVoiceLine(text: string,
lang: string = 'en-NG'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported in this environment');
        return resolve();
      }

      const runUtterance = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voice = this.getNigerianOrEnglishVoice();
        
        if (voice) utterance.voice = voice;
        utterance.lang = lang;
        utterance.rate = 0.72;
        utterance.pitch = 0.8;
        
        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(event);
        
        window.speechSynthesis.speak(utterance);
      };

      // Solves browser background loader delay for speech lists
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => runUtterance();
      } else {
        runUtterance();
      }
    });
  }

  /**
   * Trigger a voice line by category
   */
  async triggerVoiceLineByCategory(category: string): Promise<void> {
    const voiceLine = this.getRandomVoiceLineByCategory(category);
    if (voiceLine) {
      try {
        await this.playVoiceLine(voiceLine.text);
      } catch (error) {
        console.error('Error playing voice line:', error);
      }
    }
  }

  /**
   * Get total count of voice lines
   */
  getTotalVoiceLinesCount(): number {
    return this.voiceLines.length;
  }

  /**
   * Get count by category
   */
  getCountByCategory(): Record<string, number> {
    const counts: Record<string, number> = {};
    
    this.voiceLines.forEach((line) => {
      counts[line.category] = (counts[line.category] || 0) + 1;
    });
    
    return counts;
  }
}

// Create a singleton instance
const voiceLinesService = new VoiceLinesService();
export { VoiceLinesService, voiceLinesService };
export type { VoiceLine };
