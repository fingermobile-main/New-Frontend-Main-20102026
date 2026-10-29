'use strict';

/**
 * FingerMobile Protocol™ - Unified Visual Commerce Search Engine
 * Cross-store image feature extraction & multimodal catalog matching
 * Covers: Marketplace, OwnIt, Flamingo, Storefront, FingerLux, and General Catalog
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const { pool } = require('../db');
const logger = require('../utils/logger');
const crossStoreSearchService = require('./crossStoreSearchService');

const STORE_CONFIGS = {
  marketplace: {
    name: 'MarketPlace',
    badgeColor: '#2563EB',
    routePrefix: '/marketplace',
    categories: ['Hardware & Protocol', 'Hardware & Security', 'Wearables & IoT', 'Audio Gear', 'Flagship Apparel', 'Electronics & Audio']
  },
  ownit: {
    name: 'OwnIt',
    badgeColor: '#D97706',
    routePrefix: '/ownit',
    categories: ['Haute Horlogerie', 'Fine Jewelry & Gems', 'Digital Provenance & 3D Stems', 'Rare Collectibles', 'Music Publishing & Sync']
  },
  flamingo: {
    name: 'Flamingo',
    badgeColor: '#E11D48',
    routePrefix: '/flamingo',
    categories: ['Intimate Wellness & Adult Tech', 'Sensual Lounge & Silk', 'Wands & Full Body', 'Air-Suction', 'Lingerie & Apparel']
  },
  storefront: {
    name: 'Storefront',
    badgeColor: '#059669',
    routePrefix: '/storefronts',
    categories: ['Vendor Boutique', 'Artisan Goods', 'Boutique Apparel', 'Creator Merchandise', 'Coffee & Specialty']
  },
  fingerlux: {
    name: 'FingerLux',
    badgeColor: '#7C3AED',
    routePrefix: '/fingerlux',
    categories: ['VIP Membership & Bookings', 'Luxury Hospitality', 'Supercars & Aviation', 'Private Enclaves']
  }
};

class VisualSearchCommerceService {
  /**
   * Extract visual features and dominant color profile from an image
   * @param {string|Buffer} imageInput - Local file path, Buffer, or remote URL
   * @returns {Promise<Object>} Visual feature profile
   */
  async extractVisualFeatures(imageInput) {
    try {
      let imageBuffer;

      if (Buffer.isBuffer(imageInput)) {
        imageBuffer = imageInput;
      } else if (typeof imageInput === 'string' && (imageInput.startsWith('http://') || imageInput.startsWith('https://'))) {
        const response = await axios.get(imageInput, {
          responseType: 'arraybuffer',
          timeout: 8000
        });
        imageBuffer = Buffer.from(response.data);
      } else if (typeof imageInput === 'string' && fs.existsSync(imageInput)) {
        imageBuffer = fs.readFileSync(imageInput);
      } else {
        // Fallback default image buffer
        return {
          dominant_color: '#1E293B',
          color_name: 'Slate Black',
          color_family: 'black',
          aspect_ratio: 'square',
          brightness: 'dark',
          visual_tags: ['hardware', 'luxury', 'sleek', 'sovereign'],
          detected_category: 'General Commerce'
        };
      }

      // Analyze image with sharp
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      // Resize to 32x32 to extract mean RGB color & tone
      const { data, info } = await image
        .resize(32, 32, { fit: 'cover' })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      let sumR = 0, sumG = 0, sumB = 0;
      const pixelCount = info.width * info.height;

      for (let i = 0; i < data.length; i += 3) {
        sumR += data[i];
        sumG += data[i + 1];
        sumB += data[i + 2];
      }

      const avgR = Math.round(sumR / pixelCount);
      const avgG = Math.round(sumG / pixelCount);
      const avgB = Math.round(sumB / pixelCount);
      const hexColor = `#${((1 << 24) + (avgR << 16) + (avgG << 8) + avgB).toString(16).slice(1).toUpperCase()}`;

      // Color classification
      const brightness = Math.round((avgR * 299 + avgG * 587 + avgB * 114) / 1000);
      let colorFamily = 'slate';
      let colorName = 'Slate Charcoal';
      let visualTags = [];

      if (avgR < 55 && avgG < 55 && avgB < 55) {
        colorFamily = 'black';
        colorName = 'Matte Obsidian';
        visualTags = ['matte black', 'stealth', 'hardware', 'cyberpunk', 'oled', 'dark'];
      } else if (avgR > 210 && avgG > 210 && avgB > 210) {
        colorFamily = 'white';
        colorName = 'Pearl White';
        visualTags = ['minimalist', 'white', 'clean', 'modern', 'platinum'];
      } else if (avgR > 160 && avgG > 120 && avgB < 90) {
        colorFamily = 'gold';
        colorName = 'Sovereign Gold';
        visualTags = ['gold', 'luxury', 'horology', 'jewelry', 'gemstone', 'vintage'];
      } else if (avgR > 180 && avgG < 110 && avgB > 130) {
        colorFamily = 'pink';
        colorName = 'Flamingo Rose';
        visualTags = ['rose', 'silk', 'intimate', 'flamingo', 'apparel', 'soft'];
      } else if (avgB > avgR + 30 && avgB > avgG) {
        colorFamily = 'blue';
        colorName = 'Sapphire Cyan';
        visualTags = ['blue', 'digital', 'tech', 'audio', 'earphones', 'holographic'];
      } else if (avgG > avgR + 25 && avgG > avgB) {
        colorFamily = 'emerald';
        colorName = 'Emerald Green';
        visualTags = ['emerald', 'artisan', 'botanical', 'storefront', 'fresh', 'craft'];
      } else {
        colorFamily = brightness > 128 ? 'light-neutral' : 'dark-neutral';
        colorName = brightness > 128 ? 'Silver Mist' : 'Graphite Slate';
        visualTags = ['metallic', 'titanium', 'modern', 'hardware', 'lifestyle'];
      }

      // Aspect ratio
      let aspectRatio = 'square';
      if (metadata.width && metadata.height) {
        const ratio = metadata.width / metadata.height;
        if (ratio > 1.25) aspectRatio = 'landscape';
        else if (ratio < 0.8) aspectRatio = 'portrait';
      }

      // Infer primary probable category
      let detectedCategory = 'Hardware & Protocol';
      if (colorFamily === 'gold') detectedCategory = 'Haute Horlogerie & Fine Jewelry';
      else if (colorFamily === 'pink') detectedCategory = 'Sensual Lounge & Silk';
      else if (colorFamily === 'emerald') detectedCategory = 'Vendor Boutique';
      else if (colorFamily === 'blue') detectedCategory = 'Electronics & Audio';

      return {
        dominant_color: hexColor,
        rgb: { r: avgR, g: avgG, b: avgB },
        color_name: colorName,
        color_family: colorFamily,
        aspect_ratio: aspectRatio,
        brightness: brightness < 80 ? 'deep-dark' : brightness > 180 ? 'high-light' : 'balanced',
        visual_tags: visualTags,
        detected_category: detectedCategory
      };
    } catch (err) {
      logger.warn('VisualSearch: Feature extraction warning, using heuristic fallback:', err.message);
      return {
        dominant_color: '#0F172A',
        color_name: 'Obsidian Black',
        color_family: 'black',
        aspect_ratio: 'square',
        brightness: 'balanced',
        visual_tags: ['hardware', 'luxury', 'sovereign', 'electronics'],
        detected_category: 'Hardware & Protocol'
      };
    }
  }

  /**
   * Search across all store catalogs matching visual features and granulated search parameters
   */
  async searchByImage({
    imageInput,
    imageUrl,
    store = 'all',
    q = '',
    category = 'all',
    minPrice = 0,
    maxPrice = null,
    inStock = false,
    sortBy = 'similarity',
    limit = 24,
    offset = 0
  }) {
    // 1. Extract visual features from the query image
    const visualProfile = await this.extractVisualFeatures(imageInput || imageUrl);

    // 2. Fetch raw items from PostgreSQL tables & curated fallback catalog
    const allProducts = await this.fetchAllStoreProducts();

    // 3. Score each product against visual features, query keywords, and deep filters
    const scoredProducts = [];
    const queryKeywords = (q || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
    const targetStoreLower = (store || 'all').toLowerCase();
    const targetCategoryLower = (category || 'all').toLowerCase();

    for (const prod of allProducts) {
      // Store filter
      if (targetStoreLower !== 'all' && prod.store_key !== targetStoreLower) {
        continue;
      }

      // Category filter
      if (targetCategoryLower !== 'all' && prod.category.toLowerCase() !== targetCategoryLower) {
        continue;
      }

      // In stock filter
      if (inStock && !prod.in_stock) {
        continue;
      }

      // Price filters (checked against primary currency price)
      const effectivePrice = Number(prod.price_fic || prod.price || 0);
      if (minPrice && effectivePrice < Number(minPrice)) {
        continue;
      }
      if (maxPrice && effectivePrice > Number(maxPrice)) {
        continue;
      }

      // --- MULTIDIMENSIONAL SIMILARITY CALCULATION ---
      let similarityScore = 65; // Base visual similarity floor
      const matchedVisualTags = [];

      const prodText = `${prod.name} ${prod.category} ${prod.description || ''} ${(prod.tags || []).join(' ')}`.toLowerCase();

      // A. Color Family & Palette Proximity
      const colorKeywords = {
        black: ['black', 'dark', 'obsidian', 'matte', 'charcoal', 'oled', 'shadow', 'cyberpunk'],
        white: ['white', 'pearl', 'light', 'clean', 'ivory', 'platinum', 'silver'],
        gold: ['gold', 'golden', 'yellow', 'amber', 'champagne', 'jewelry', 'gem', 'horology', 'diamond'],
        pink: ['pink', 'rose', 'silk', 'kimono', 'velvet', 'intimate', 'sensual', 'flamingo'],
        blue: ['blue', 'cyan', 'sapphire', 'audio', 'earphones', 'holographic', 'digital', 'synthwave'],
        emerald: ['emerald', 'green', 'artisan', 'espresso', 'roast', 'botanical', 'craft']
      };

      const familyTags = colorKeywords[visualProfile.color_family] || ['modern', 'tech'];
      let colorMatchCount = 0;
      for (const tag of familyTags) {
        if (prodText.includes(tag)) {
          colorMatchCount++;
          if (!matchedVisualTags.includes(tag)) matchedVisualTags.push(tag);
        }
      }

      similarityScore += Math.min(colorMatchCount * 5, 18);

      // B. Category & Visual Tag Alignment
      for (const vTag of visualProfile.visual_tags) {
        if (prodText.includes(vTag.toLowerCase())) {
          similarityScore += 4;
          if (!matchedVisualTags.includes(vTag)) matchedVisualTags.push(vTag);
        }
      }

      // C. Additional Granular Search Keywords Match
      if (queryKeywords.length > 0) {
        let kwMatches = 0;
        for (const kw of queryKeywords) {
          if (prodText.includes(kw)) {
            kwMatches++;
            if (!matchedVisualTags.includes(kw)) matchedVisualTags.push(kw);
          }
        }
        if (kwMatches === 0 && targetStoreLower === 'all') {
          // If explicit keyword was given and doesn't match at all, penalize
          similarityScore -= 15;
        } else {
          similarityScore += kwMatches * 6;
        }
      }

      // D. Store Specialization Boost
      if (prod.store_key === 'ownit' && visualProfile.color_family === 'gold') similarityScore += 4;
      if (prod.store_key === 'flamingo' && visualProfile.color_family === 'pink') similarityScore += 4;
      if (prod.store_key === 'marketplace' && visualProfile.color_family === 'black') similarityScore += 4;

      // Cap similarity percentage between 68% and 99%
      const finalScore = Math.min(99, Math.max(68, Math.round(similarityScore)));

      scoredProducts.push({
        ...prod,
        visual_similarity_score: finalScore,
        matched_visual_tags: matchedVisualTags.slice(0, 5)
      });
    }

    // 4. Sorting
    if (sortBy === 'similarity') {
      scoredProducts.sort((a, b) => b.visual_similarity_score - a.visual_similarity_score);
    } else if (sortBy === 'price_asc') {
      scoredProducts.sort((a, b) => Number(a.price_fic || a.price) - Number(b.price_fic || b.price));
    } else if (sortBy === 'price_desc') {
      scoredProducts.sort((a, b) => Number(b.price_fic || b.price) - Number(a.price_fic || a.price));
    } else if (sortBy === 'rating') {
      scoredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    // Store breakdown summary counts
    const storesSummary = {
      all: scoredProducts.length,
      marketplace: scoredProducts.filter(p => p.store_key === 'marketplace').length,
      ownit: scoredProducts.filter(p => p.store_key === 'ownit').length,
      flamingo: scoredProducts.filter(p => p.store_key === 'flamingo').length,
      storefront: scoredProducts.filter(p => p.store_key === 'storefront').length,
      fingerlux: scoredProducts.filter(p => p.store_key === 'fingerlux').length
    };

    const paginated = scoredProducts.slice(Number(offset), Number(offset) + Number(limit));

    return {
      query_image: {
        url: imageUrl || (typeof imageInput === 'string' && imageInput.startsWith('/uploads') ? imageInput : '/assets/branding/sample-search.png'),
        ...visualProfile
      },
      applied_filters: {
        store,
        category,
        minPrice,
        maxPrice,
        q,
        inStock,
        sortBy
      },
      total_matches: scoredProducts.length,
      stores_summary: storesSummary,
      results: paginated
    };
  }

  /**
   * Aggregates items from PostgreSQL and curated stores
   */
  async fetchAllStoreProducts() {
    const products = [];

    // 1. Marketplace Products
    try {
      const res = await pool.query(
        `SELECT id, name, category, price, price_fic, description, images, is_active, stock_quantity, rating 
         FROM marketplace_products 
         WHERE is_active = true 
         ORDER BY id ASC;`
      );
      res.rows.forEach(r => {
        const primaryImage = (r.images && r.images.length > 0) ? r.images[0] : '/assets/marketplace/placeholder.jpg';
        products.push({
          id: `mkt-${r.id}`,
          raw_id: r.id,
          name: r.name,
          title: r.name,
          category: r.category || 'Hardware & Security',
          price: Number(r.price_fic || r.price),
          price_fic: Number(r.price_fic || r.price),
          price_usd: Number(r.price || r.price_fic),
          currency: 'FIC',
          store: STORE_CONFIGS.marketplace.name,
          store_key: 'marketplace',
          store_badge_color: STORE_CONFIGS.marketplace.badgeColor,
          image_url: primaryImage,
          images: r.images || [primaryImage],
          in_stock: (r.stock_quantity ?? 10) > 0,
          stock_quantity: r.stock_quantity ?? 10,
          rating: Number(r.rating || 5.0),
          description: r.description || '',
          deep_link: `/marketplace?product=${r.id}`
        });
      });
    } catch (err) {
      logger.warn('VisualSearch: Failed to query marketplace_products:', err.message);
    }

    // 2. OwnIt Products
    try {
      const res = await pool.query(
        `SELECT id, name, brand, category, price_fic, price_usd, description, media_4k_urls, is_active, stock, rating, rarity_level 
         FROM ownit_products 
         WHERE is_active = true 
         ORDER BY created_at DESC;`
      );
      res.rows.forEach(r => {
        const primaryImage = (r.media_4k_urls && r.media_4k_urls.length > 0) ? r.media_4k_urls[0] : '/assets/ownit/placeholder.jpg';
        products.push({
          id: `own-${r.id}`,
          raw_id: r.id,
          name: r.name,
          title: r.name,
          category: r.category || 'Haute Horlogerie',
          brand: r.brand || 'OwnIt Luxury',
          price: Number(r.price_fic),
          price_fic: Number(r.price_fic),
          price_usd: Number(r.price_usd),
          currency: 'FIC',
          store: STORE_CONFIGS.ownit.name,
          store_key: 'ownit',
          store_badge_color: STORE_CONFIGS.ownit.badgeColor,
          image_url: primaryImage,
          images: r.media_4k_urls || [primaryImage],
          in_stock: (r.stock ?? 1) > 0,
          stock_quantity: r.stock ?? 1,
          rating: Number(r.rating || 5.0),
          rarity_level: r.rarity_level || 'Unique 1-of-1',
          description: r.description || '',
          deep_link: `/ownit?product=${r.id}`
        });
      });
    } catch (err) {
      logger.warn('VisualSearch: Failed to query ownit_products:', err.message);
    }

    // 3. Flamingo Products
    try {
      const res = await pool.query(
        `SELECT id, name, category, price, description, images, image_url, is_available, stock_quantity, rating, brand, tags 
         FROM flamingo_products 
         WHERE is_available = true 
         LIMIT 250;`
      );
      res.rows.forEach(r => {
        const primaryImage = r.image_url || ((r.images && r.images.length > 0) ? r.images[0] : '/assets/flamingo/placeholder.jpg');
        products.push({
          id: `flam-${r.id}`,
          raw_id: r.id,
          name: r.name,
          title: r.name,
          category: r.category || 'Intimate Wellness & Adult Tech',
          brand: r.brand || 'Flamingo Intimates',
          price: Number(r.price),
          price_fic: Number(r.price),
          price_usd: Number(r.price),
          currency: 'USD',
          store: STORE_CONFIGS.flamingo.name,
          store_key: 'flamingo',
          store_badge_color: STORE_CONFIGS.flamingo.badgeColor,
          image_url: primaryImage,
          images: r.images || [primaryImage],
          in_stock: (r.stock_quantity ?? 10) > 0,
          stock_quantity: r.stock_quantity ?? 10,
          rating: Number(r.rating || 4.8),
          tags: r.tags || [],
          description: r.description || '',
          deep_link: `/flamingo?product=${r.id}`
        });
      });
    } catch (err) {
      logger.warn('VisualSearch: Failed to query flamingo_products:', err.message);
    }

    // 4. Storefront Products
    try {
      const res = await pool.query(
        `SELECT id, name, category, price, compare_at_price, description, images, status, visibility, tags, vendor 
         FROM storefront_products 
         WHERE status = 'active' OR visibility = 'visible' 
         LIMIT 100;`
      );
      res.rows.forEach(r => {
        let parsedImgs = [];
        try {
          parsedImgs = typeof r.images === 'string' ? JSON.parse(r.images) : (r.images || []);
        } catch {
          parsedImgs = [];
        }
        const primaryImage = parsedImgs.length > 0 ? (typeof parsedImgs[0] === 'string' ? parsedImgs[0] : parsedImgs[0].url) : '/assets/storefront/placeholder.jpg';
        products.push({
          id: `stf-${r.id}`,
          raw_id: r.id,
          name: r.name,
          title: r.name,
          category: r.category || 'Vendor Boutique',
          vendor: r.vendor || 'Boutique Store',
          price: Number(r.price),
          price_fic: Number(r.price),
          price_usd: Number(r.price),
          currency: 'USD',
          store: STORE_CONFIGS.storefront.name,
          store_key: 'storefront',
          store_badge_color: STORE_CONFIGS.storefront.badgeColor,
          image_url: primaryImage,
          images: parsedImgs,
          in_stock: true,
          stock_quantity: 25,
          rating: 4.9,
          tags: r.tags || [],
          description: r.description || '',
          deep_link: `/storefronts?product=${r.id}`
        });
      });
    } catch (err) {
      logger.warn('VisualSearch: Failed to query storefront_products:', err.message);
    }

    // 5. Curated crossStoreSearchService items (Guarantees Storefront & FingerLux coverage if tables empty)
    const crossStoreData = await crossStoreSearchService.searchAcrossStores({ limit: 50 });
    if (crossStoreData && crossStoreData.results) {
      crossStoreData.results.forEach(item => {
        const storeKey = (item.store || '').toLowerCase();
        // Only append if not already well represented or for luxury/storefront catalogs
        if (storeKey === 'storefront' || storeKey === 'fingerlux' || !products.some(p => p.title === item.title)) {
          products.push({
            id: `cur-${item.id}`,
            raw_id: item.id,
            name: item.title,
            title: item.title,
            category: item.category,
            price: Number(item.price),
            price_fic: Number(item.price),
            price_usd: Number(item.price),
            currency: item.currency || 'FIC',
            store: item.store,
            store_key: storeKey === 'marketplace' ? 'marketplace' : storeKey === 'ownit' ? 'ownit' : storeKey === 'flamingo' ? 'flamingo' : storeKey === 'storefront' ? 'storefront' : 'fingerlux',
            store_badge_color: item.storeBadgeColor || '#2563EB',
            image_url: item.imageUrl,
            images: [item.imageUrl],
            in_stock: item.inStock !== false,
            stock_quantity: 50,
            rating: item.rating || 5.0,
            description: item.category || '',
            deep_link: storeKey === 'ownit' ? '/ownit' : storeKey === 'flamingo' ? '/flamingo' : storeKey === 'storefront' ? '/storefronts' : storeKey === 'fingerlux' ? '/fingerlux' : '/marketplace'
          });
        }
      });
    }

    return products;
  }
}

module.exports = new VisualSearchCommerceService();

