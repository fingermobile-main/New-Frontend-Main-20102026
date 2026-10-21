'use strict';

/**
 * FingerMobile Protocol™ - Cross-Store Catalog Crawler & Product Search Service
 * Crawls and aggregates items across 5 commercial modules:
 * 1. MarketPlace
 * 2. OwnIt
 * 3. Flamingo
 * 4. Storefront
 * 5. FingerLux
 * Also supports Gift Cards, FIC Tip tokens, and Discount Coupons.
 */

const STORE_MODULES = {
  MARKETPLACE: 'MarketPlace',
  OWNIT: 'OwnIt',
  FLAMINGO: 'Flamingo',
  STOREFRONT: 'Storefront',
  FINGERLUX: 'FingerLux',
};

const MOCK_CROSS_STORE_CATALOG = [
  // FingerLux Luxury Services & Curation
  {
    id: 'prod_lux_01',
    title: 'FingerLux Sovereign Concierge 1-Month Pass',
    price: 450,
    currency: 'FIC',
    fiatPrice: '$450.00',
    store: STORE_MODULES.FINGERLUX,
    storeBadgeColor: '#D97706',
    category: 'VIP Membership & Bookings',
    rating: 4.9,
    imageUrl: '/assets/luxury/concierge.jpg',
    inStock: true,
    canBeGifted: true,
    canTipFIC: true,
  },
  {
    id: 'prod_lux_02',
    title: 'Private Yacht Experience Lagos Lagoon',
    price: 1800,
    currency: 'FIC',
    fiatPrice: '$1,800.00',
    store: STORE_MODULES.FINGERLUX,
    storeBadgeColor: '#D97706',
    category: 'Luxury Hospitality',
    rating: 5.0,
    imageUrl: '/assets/luxury/yacht.jpg',
    inStock: true,
    canBeGifted: true,
  },

  // Marketplace
  {
    id: 'prod_mkt_01',
    title: 'Cyberpunk OLED Studio Earphones Pro',
    price: 85,
    currency: 'FIC',
    fiatPrice: '$85.00',
    store: STORE_MODULES.MARKETPLACE,
    storeBadgeColor: '#2563EB',
    category: 'Electronics & Audio',
    rating: 4.8,
    imageUrl: '/assets/marketplace/earphones.jpg',
    inStock: true,
    canBeGifted: true,
  },
  {
    id: 'prod_mkt_02',
    title: 'FingerMobile Holographic Mech Hoodie',
    price: 65,
    currency: 'FIC',
    fiatPrice: '$65.00',
    store: STORE_MODULES.MARKETPLACE,
    storeBadgeColor: '#2563EB',
    category: 'Apparel',
    rating: 4.7,
    imageUrl: '/assets/marketplace/hoodie.jpg',
    inStock: true,
    canBeGifted: true,
  },

  // OwnIt Licensed Assets
  {
    id: 'prod_own_01',
    title: 'OwnIt Master Digital Certificate #089 (3D Avatar Rig)',
    price: 120,
    currency: 'FIC',
    fiatPrice: '$120.00',
    store: STORE_MODULES.OWNIT,
    storeBadgeColor: '#7C3AED',
    category: 'Digital Provenance & 3D Stems',
    rating: 4.9,
    imageUrl: '/assets/ownit/avatar_rig.jpg',
    inStock: true,
    canBeGifted: true,
  },
  {
    id: 'prod_own_02',
    title: 'Beatwave Royalty License: Synthwave Sunset 24-bit',
    price: 95,
    currency: 'FIC',
    fiatPrice: '$95.00',
    store: STORE_MODULES.OWNIT,
    storeBadgeColor: '#7C3AED',
    category: 'Music Publishing & Sync',
    rating: 5.0,
    imageUrl: '/assets/ownit/music_license.jpg',
    inStock: true,
    canBeGifted: true,
  },

  // Flamingo Adult & Intimate Wellness Catalog
  {
    id: 'prod_flam_01',
    title: 'Flamingo Pulse Elite Touch Sensor Massager',
    price: 135,
    currency: 'FIC',
    fiatPrice: '$135.00',
    store: STORE_MODULES.FLAMINGO,
    storeBadgeColor: '#E11D48',
    category: 'Intimate Wellness & Adult Tech',
    rating: 4.9,
    imageUrl: '/assets/flamingo/pulse_elite.jpg',
    inStock: true,
    canBeGifted: true,
  },
  {
    id: 'prod_flam_02',
    title: 'Flamingo Velvet Touch Silk Kimono & Set',
    price: 110,
    currency: 'FIC',
    fiatPrice: '$110.00',
    store: STORE_MODULES.FLAMINGO,
    storeBadgeColor: '#E11D48',
    category: 'Sensual Lounge & Silk',
    rating: 4.8,
    imageUrl: '/assets/flamingo/kimono.jpg',
    inStock: true,
    canBeGifted: true,
  },

  // Storefronts
  {
    id: 'prod_stf_01',
    title: 'Artisan Espresso Roast Limited Blend 1KG',
    price: 25,
    currency: 'FIC',
    fiatPrice: '$25.00',
    store: STORE_MODULES.STOREFRONT,
    storeBadgeColor: '#059669',
    category: 'Vendor Boutique',
    rating: 4.9,
    imageUrl: '/assets/storefront/coffee.jpg',
    inStock: true,
    canBeGifted: true,
  },

  // Gifting & Mediums (Gift cards, Coupons, FIC Tips)
  {
    id: 'gift_card_50',
    title: 'FingerMobile 50 FIC Universal Gift Card',
    price: 50,
    currency: 'FIC',
    fiatPrice: '$50.00',
    store: 'Universal Gift Card',
    storeBadgeColor: '#0284C7',
    category: 'Gift Card & Voucher',
    rating: 5.0,
    imageUrl: '/assets/gifting/giftcard50.jpg',
    inStock: true,
    canBeGifted: true,
  },
  {
    id: 'coupon_vip_20',
    title: '20% OFF Storewide VIP Coupon Voucher',
    price: 10,
    currency: 'FIC',
    fiatPrice: '$10.00',
    store: 'Universal Coupon',
    storeBadgeColor: '#10B981',
    category: 'Discount Voucher',
    rating: 5.0,
    imageUrl: '/assets/gifting/coupon.jpg',
    inStock: true,
    canBeGifted: true,
  },
];

class CrossStoreSearchService {
  async searchAcrossStores({ query = '', storeFilter = 'all', limit = 20 }) {
    let results = [...MOCK_CROSS_STORE_CATALOG];

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.store.toLowerCase().includes(q)
      );
    }

    if (storeFilter && storeFilter !== 'all') {
      results = results.filter(
        (item) => item.store.toLowerCase() === storeFilter.toLowerCase()
      );
    }

    // Determine stores matched in this search
    const matchingStores = Array.from(new Set(results.map((item) => item.store)));

    return {
      results: results.slice(0, Number(limit)),
      totalFound: results.length,
      matchingStores,
      supportedStores: [
        STORE_MODULES.MARKETPLACE,
        STORE_MODULES.OWNIT,
        STORE_MODULES.FLAMINGO,
        STORE_MODULES.STOREFRONT,
        STORE_MODULES.FINGERLUX,
      ],
    };
  }
}

module.exports = new CrossStoreSearchService();
