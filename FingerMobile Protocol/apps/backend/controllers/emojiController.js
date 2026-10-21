/**
 * FingerMobile Protocol - Brand Emoji Pack Controller
 * Serves the official 5D mint-green glass emojis strictly required across all
 * Toasts, Notifications, Voiceline Commentary, and Reactions.
 *
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

const { contentDb } = require('../db/db');
const logger = require('../config/logger');

// Authoritative In-Memory Fallback Catalog conforming to 058 migration
const BRAND_EMOJIS_CATALOG = [
  {
    id: 'fm-emoji-thumbs-up',
    name: 'FingerMobile Thumbs-Up Wink',
    slug: 'thumbs-up',
    category: 'toast',
    toast_type: 'success',
    image_url: '/assets/emojis/thumbs_up_wink.png',
    asset_filename: 'IMG_20261021_074750_919.png',
    color_hex: '#defaf2',
    description: 'Official brand success emoji with winking eye, thumbs up, yellow lip lining and light red tongue',
    display_order: 1
  },
  {
    id: 'fm-emoji-cool-sunglasses',
    name: 'FingerMobile Cool Sunglasses',
    slug: 'cool-sunglasses',
    category: 'reactions',
    toast_type: null,
    image_url: '/assets/emojis/cool_sunglasses.png',
    asset_filename: 'IMG_20261021_074934_746.png',
    color_hex: '#defaf2',
    description: 'Sleek dark gold glasses with double thumbs-up mint glass emoji',
    display_order: 2
  },
  {
    id: 'fm-emoji-heart-eyes',
    name: 'FingerMobile Heart Eyes',
    slug: 'heart-eyes',
    category: 'reactions',
    toast_type: null,
    image_url: '/assets/emojis/heart_eyes.png',
    asset_filename: 'IMG_20261021_075340_782.png',
    color_hex: '#defaf2',
    description: 'Vibrant red heart eyes with hands on cheeks mint glass emoji',
    display_order: 3
  },
  {
    id: 'fm-emoji-kissing-heart',
    name: 'FingerMobile Blowing Love',
    slug: 'blowing-love',
    category: 'reactions',
    toast_type: null,
    image_url: '/assets/emojis/kissing_heart.png',
    asset_filename: 'IMG_20261021_075457_940.png',
    color_hex: '#defaf2',
    description: 'Winking blowing love heart kiss mint glass emoji',
    display_order: 4
  },
  {
    id: 'fm-emoji-tears-of-joy',
    name: 'FingerMobile Tears of Joy',
    slug: 'tears-of-joy',
    category: 'reactions',
    toast_type: null,
    image_url: '/assets/emojis/tears_of_joy.png',
    asset_filename: 'IMG_20261021_075534_544.png',
    color_hex: '#defaf2',
    description: 'Laughing with tears of joy mint glass emoji',
    display_order: 5
  },
  {
    id: 'fm-emoji-headphones-music',
    name: 'FingerMobile Happy Music',
    slug: 'headphones-music',
    category: 'voiceline',
    toast_type: 'voiceline',
    image_url: '/assets/emojis/headphones_music.png',
    asset_filename: 'IMG_20261021_075633_783.png',
    color_hex: '#defaf2',
    description: 'African commentary and voiceline speaker emoji with gold headphones and musical notes',
    display_order: 6
  },
  {
    id: 'fm-emoji-surprise-dismay',
    name: 'FingerMobile Surprise & Dismay',
    slug: 'surprise-dismay',
    category: 'toast',
    toast_type: 'error',
    image_url: '/assets/emojis/surprise_dismay.png',
    asset_filename: 'IMG_20261021_075724_991.png',
    color_hex: '#defaf2',
    description: 'Official brand error and alert emoji with wide surprised mouth and hands on cheeks',
    display_order: 7
  },
  {
    id: 'fm-emoji-peace-sign',
    name: 'FingerMobile Peace Sign',
    slug: 'peace-sign',
    category: 'reactions',
    toast_type: null,
    image_url: '/assets/emojis/peace_sign.png',
    asset_filename: 'IMG_20261021_075837_474.png',
    color_hex: '#defaf2',
    description: 'Peace sign winking mint glass emoji',
    display_order: 8
  },
  {
    id: 'fm-emoji-crown-royalty',
    name: 'FingerMobile Sovereign Crown',
    slug: 'crown-royalty',
    category: 'reactions',
    toast_type: null,
    image_url: '/assets/emojis/crown_royalty.png',
    asset_filename: 'IMG_20261021_075925_217.png',
    color_hex: '#defaf2',
    description: 'Gold sovereign hallmark crown king mint glass emoji',
    display_order: 9
  },
  {
    id: 'fm-emoji-sleeping-napping',
    name: 'FingerMobile Sleeping Away',
    slug: 'sleeping-away',
    category: 'status',
    toast_type: null,
    image_url: '/assets/emojis/sleeping_napping.png',
    asset_filename: 'IMG_20261021_080046_572.png',
    color_hex: '#defaf2',
    description: 'Away and offline status emoji sleeping peacefully with golden Zzz',
    display_order: 10
  },
  {
    id: 'fm-emoji-star-eyes',
    name: 'FingerMobile Star Eyes Gem',
    slug: 'star-eyes',
    category: 'reactions',
    toast_type: null,
    image_url: '/assets/emojis/star_eyes.png',
    asset_filename: 'IMG_20261021_080140_681.png',
    color_hex: '#defaf2',
    description: 'Gold star eyes double thumbs-up celebration for Gems transactions',
    display_order: 11
  },
  {
    id: 'fm-emoji-idea-laptop',
    name: 'FingerMobile Idea & Laptop',
    slug: 'idea-laptop',
    category: 'toast',
    toast_type: 'info',
    image_url: '/assets/emojis/idea_laptop.png',
    asset_filename: 'IMG_20261021_080345_907.png',
    color_hex: '#defaf2',
    description: 'Official brand info emoji with black eyeglasses, glowing idea bulb and laptop',
    display_order: 12
  },
  {
    id: 'fm-emoji-glasses-5d',
    name: 'FingerMobile Sovereign Glasses 5D',
    slug: 'fingermobile-glasses-5d',
    category: 'branding',
    toast_type: null,
    image_url: '/assets/emojis/fingermobile_glasses_5d.jpg',
    asset_filename: 'FingerMobile Emoji 2.jpg',
    color_hex: '#defaf2',
    description: 'Macro close-up with FingerMobile sharply engraved on the right glass frame',
    display_order: 13
  }
];

const getAllEmojis = async (req, res) => {
  try {
    if (contentDb) {
      const dbResult = await contentDb.query(
        'SELECT * FROM fingermobile_emojis WHERE is_active = true ORDER BY display_order ASC'
      );
      if (dbResult && dbResult.rows && dbResult.rows.length > 0) {
        return res.json({ success: true, count: dbResult.rows.length, data: dbResult.rows });
      }
    }
  } catch (err) {
    logger.warn('Failed to query fingermobile_emojis table, using fallback catalog: ' + err.message);
  }

  return res.json({ success: true, count: BRAND_EMOJIS_CATALOG.length, data: BRAND_EMOJIS_CATALOG });
};

const getEmojiBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    if (contentDb) {
      const dbResult = await contentDb.query(
        'SELECT * FROM fingermobile_emojis WHERE slug = $1 AND is_active = true LIMIT 1',
        [slug]
      );
      if (dbResult && dbResult.rows && dbResult.rows.length > 0) {
        return res.json({ success: true, data: dbResult.rows[0] });
      }
    }
  } catch (err) {
    logger.warn('Failed to query fingermobile_emojis for slug, using fallback catalog');
  }

  const found = BRAND_EMOJIS_CATALOG.find(e => e.slug === slug);
  if (found) {
    return res.json({ success: true, data: found });
  }

  return res.status(404).json({ success: false, message: 'Emoji not found' });
};

const getToastEmoji = async (req, res) => {
  const { type } = req.params; // 'success' | 'error' | 'info' | 'warning' | 'voiceline'
  const targetType = type === 'warning' ? 'error' : type;

  const found = BRAND_EMOJIS_CATALOG.find(e => e.toast_type === targetType) || BRAND_EMOJIS_CATALOG[0];
  return res.json({ success: true, data: found });
};

module.exports = {
  getAllEmojis,
  getEmojiBySlug,
  getToastEmoji,
  BRAND_EMOJIS_CATALOG
};
