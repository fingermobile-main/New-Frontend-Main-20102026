/**
 * FINGERMOBILE PROTOCOL - BRAND EMOJI PACK SERVICE
 * Enforces the brand requirement: "FingerMobile must only use its own emoji Pack."
 * All Toasts, Notifications, Voiceline popups, and living room reactions MUST
 * render FingerMobile's own 5D mint-green glossy emojis (#defaf2).
 *
 * Source: /FingerMobile Protocol/Assets/FingerMobile Emojis
 *
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

export interface FingerMobileEmojiItem {
  id: string;
  name: string;
  slug: string;
  category: 'toast' | 'voiceline' | 'reactions' | 'status' | 'branding';
  toastType?: 'success' | 'error' | 'info' | 'warning' | 'voiceline';
  imageUrl: string;
  altText: string;
  colorHex: string;
}

export const FINGERMOBILE_EMOJI_REGISTRY: FingerMobileEmojiItem[] = [
  {
    id: 'fm-emoji-thumbs-up',
    name: 'FingerMobile Thumbs-Up Wink',
    slug: 'thumbs-up',
    category: 'toast',
    toastType: 'success',
    imageUrl: '/assets/emojis/thumbs_up_wink.png',
    altText: 'FingerMobile 5D Thumbs Up Mint Emoji',
    colorHex: '#defaf2'
  },
  {
    id: 'fm-emoji-surprise-dismay',
    name: 'FingerMobile Surprise & Dismay',
    slug: 'surprise-dismay',
    category: 'toast',
    toastType: 'error',
    imageUrl: '/assets/emojis/surprise_dismay.png',
    altText: 'FingerMobile 5D Alert Error Mint Emoji',
    colorHex: '#defaf2'
  },
  {
    id: 'fm-emoji-idea-laptop',
    name: 'FingerMobile Idea & Laptop',
    slug: 'idea-laptop',
    category: 'toast',
    toastType: 'info',
    imageUrl: '/assets/emojis/idea_laptop.png',
    altText: 'FingerMobile 5D Idea Info Mint Emoji',
    colorHex: '#defaf2'
  },
  {
    id: 'fm-emoji-warning',
    name: 'FingerMobile Warning Caution',
    slug: 'warning',
    category: 'toast',
    toastType: 'warning',
    imageUrl: '/assets/emojis/surprise_dismay.png',
    altText: 'FingerMobile 5D Warning Caution Mint Emoji',
    colorHex: '#defaf2'
  },
  {
    id: 'fm-emoji-headphones-music',
    name: 'FingerMobile Happy Music & VoiceLine',
    slug: 'headphones-music',
    category: 'voiceline',
    toastType: 'voiceline',
    imageUrl: '/assets/emojis/headphones_music.png',
    altText: 'FingerMobile 5D VoiceLine Commentary Mint Emoji',
    colorHex: '#defaf2'
  },
  {
    id: 'fm-emoji-cool-sunglasses',
    name: 'FingerMobile Cool Sunglasses',
    slug: 'cool-sunglasses',
    category: 'reactions',
    imageUrl: '/assets/emojis/cool_sunglasses.png',
    altText: 'FingerMobile 5D Cool Sunglasses Mint Emoji',
    colorHex: '#defaf2'
  },
  {
    id: 'fm-emoji-heart-eyes',
    name: 'FingerMobile Heart Eyes',
    slug: 'heart-eyes',
    category: 'reactions',
    imageUrl: '/assets/emojis/heart_eyes.png',
    altText: 'FingerMobile 5D Heart Eyes Mint Emoji',
    colorHex: '#defaf2'
  },
  {
    id: 'fm-emoji-blowing-love',
    name: 'FingerMobile Blowing Love',
    slug: 'blowing-love',
    category: 'reactions',
    imageUrl: '/assets/emojis/kissing_heart.png',
    altText: 'FingerMobile 5D Blowing Love Mint Emoji',
    colorHex: '#defaf2'
  },
  {
    id: 'fm-emoji-tears-of-joy',
    name: 'FingerMobile Tears of Joy',
    slug: 'tears-of-joy',
    category: 'reactions',
    imageUrl: '/assets/emojis/tears_of_joy.png',
    altText: 'FingerMobile 5D Tears of Joy Mint Emoji',
    colorHex: '#defaf2'
  },
  {
    id: 'fm-emoji-peace-sign',
    name: 'FingerMobile Peace Sign',
    slug: 'peace-sign',
    category: 'reactions',
    imageUrl: '/assets/emojis/peace_sign.png',
    altText: 'FingerMobile 5D Peace Sign Mint Emoji',
    colorHex: '#defaf2'
  },
  {
    id: 'fm-emoji-crown-royalty',
    name: 'FingerMobile Sovereign Crown',
    slug: 'crown-royalty',
    category: 'reactions',
    imageUrl: '/assets/emojis/crown_royalty.png',
    altText: 'FingerMobile 5D Sovereign Crown Mint Emoji',
    colorHex: '#defaf2'
  },
  {
    id: 'fm-emoji-star-eyes',
    name: 'FingerMobile Star Eyes Gem',
    slug: 'star-eyes',
    category: 'reactions',
    imageUrl: '/assets/emojis/star_eyes.png',
    altText: 'FingerMobile 5D Star Eyes Celebration Mint Emoji',
    colorHex: '#defaf2'
  },
  {
    id: 'fm-emoji-sleeping-napping',
    name: 'FingerMobile Sleeping Away',
    slug: 'sleeping-away',
    category: 'status',
    imageUrl: '/assets/emojis/sleeping_napping.png',
    altText: 'FingerMobile 5D Sleeping Away Mint Emoji',
    colorHex: '#defaf2'
  },
  {
    id: 'fm-emoji-glasses-5d',
    name: 'FingerMobile Sovereign Glasses 5D',
    slug: 'fingermobile-glasses-5d',
    category: 'branding',
    imageUrl: '/assets/emojis/fingermobile_glasses_5d.jpg',
    altText: 'FingerMobile 5D Macro Eyeglasses Engraved Mint Emoji',
    colorHex: '#defaf2'
  }
];

class EmojiPackService {
  /**
   * Retrieves the official brand 5D emoji mapped to a toast notification type.
   */
  public getToastEmoji(type: 'success' | 'error' | 'info' | 'warning' | 'voiceline' = 'info'): FingerMobileEmojiItem {
    const match = FINGERMOBILE_EMOJI_REGISTRY.find(e => e.toastType === type);
    return match || FINGERMOBILE_EMOJI_REGISTRY[0];
  }

  /**
   * Retrieves a voice line commentary emoji based on the category.
   */
  public getVoiceLineEmoji(category: string): FingerMobileEmojiItem {
    const cat = category.toLowerCase();
    if (cat.includes('music') || cat.includes('general') || cat.includes('greeting') || cat.includes('forum')) {
      return this.getEmojiBySlug('headphones-music');
    }
    if (cat.includes('gem') || cat.includes('earnings') || cat.includes('combo') || cat.includes('supervi')) {
      return this.getEmojiBySlug('star-eyes');
    }
    if (cat.includes('hallmark') || cat.includes('appraisal') || cat.includes('boastful')) {
      return this.getEmojiBySlug('crown-royalty');
    }
    if (cat.includes('surprise') || cat.includes('stun') || cat.includes('lamentation')) {
      return this.getEmojiBySlug('surprise-dismay');
    }
    if (cat.includes('affection') || cat.includes('love') || cat.includes('lushpressies')) {
      return this.getEmojiBySlug('blowing-love');
    }
    return this.getEmojiBySlug('thumbs-up');
  }

  /**
   * Retrieves an emoji by its slug identifier.
   */
  public getEmojiBySlug(slug: string): FingerMobileEmojiItem {
    const found = FINGERMOBILE_EMOJI_REGISTRY.find(e => e.slug === slug);
    return found || FINGERMOBILE_EMOJI_REGISTRY[0];
  }

  /**
   * Official Brand Reactions list to replace standard Unicode emojis on broadcasts and posts.
   */
  public getReactionEmojis(): FingerMobileEmojiItem[] {
    return [
      this.getEmojiBySlug('thumbs-up'),
      this.getEmojiBySlug('star-eyes'),
      this.getEmojiBySlug('crown-royalty'),
      this.getEmojiBySlug('headphones-music'),
      this.getEmojiBySlug('cool-sunglasses'),
      this.getEmojiBySlug('blowing-love')
    ];
  }

  /**
   * Full emoji catalog
   */
  public getAllEmojis(): FingerMobileEmojiItem[] {
    return FINGERMOBILE_EMOJI_REGISTRY;
  }
}

export const emojiPackService = new EmojiPackService();
export default emojiPackService;
