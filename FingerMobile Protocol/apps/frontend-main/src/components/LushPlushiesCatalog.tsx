import React, { useState, useEffect } from 'react';

export interface LushGiftProduct {
  product_id: string;
  product_name: string;
  product_description: string;
  product_price: number | string;
  product_image: string;
  product_category: string;
  product_subcategory: string;
  product_status: string;
  product_sold_status: string;
  product_price_in_fic: number | string;
  Product_price_in_FIC?: number | string;
  product_created_at?: string;
  product_updated_at?: string;
}

export const LUSH_PLUSHIE_CATEGORIES = [
  'The Ultimate Luxury Faux-Fur Blanket',
  'Indulgent Plush Bathrobes & Slippers',
  'Sophisticated Living Room Textures',
  'Sensual Bedding Upgrades',
  'Date Night & Travel Cozy Goods',
  'Elegant & Mature Character Plushies',
  'Romantic Bath & Body Textures',
  'Nostalgic & Pop Culture Plush',
  'Quirky & Humorous Adult Plush'
] as const;

export const DEFAULT_PLUSHIES_CATALOG: LushGiftProduct[] = [
  // 1. The Ultimate Luxury Faux-Fur Blanket
  {
    product_id: 'plush_blanket_01',
    product_name: 'Chinchilla-Style Weighted Luxury Throw',
    product_description: 'A plush, dense 15-lb weighted blanket that feels incredibly realistic and adds immediate romance and grounding calm to a couch or lounge.',
    product_price: 240.00,
    product_image: '/images/plushies/chinchilla_weighted_throw.jpg',
    product_category: 'The Ultimate Luxury Faux-Fur Blanket',
    product_subcategory: 'Chinchilla-Style Weighted Throw',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 240.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_blanket_02',
    product_name: 'Ribbed Faux-Mink Sculpted Blanket',
    product_description: 'Offers a modern, textured aesthetic that looks beautiful draped over a bed. Velvety smooth channels trap ambient warmth effortlessly.',
    product_price: 180.00,
    product_image: '/images/plushies/ribbed_faux_mink_blanket.jpg',
    product_category: 'The Ultimate Luxury Faux-Fur Blanket',
    product_subcategory: 'Ribbed Faux-Mink Blanket',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 180.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_blanket_03',
    product_name: 'Oversized "Cuddle" Throw (60" x 80")',
    product_description: 'Specifically scaled to 60" x 80" so partners can comfortably share it without fighting for coverage during quiet movie nights.',
    product_price: 210.00,
    product_image: '/images/plushies/oversized_cuddle_throw.jpg',
    product_category: 'The Ultimate Luxury Faux-Fur Blanket',
    product_subcategory: 'Oversized "Cuddle" Throw',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 210.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_blanket_04',
    product_name: 'Sheared Beaver Faux-Fur Heavy Blanket',
    product_description: 'An exceptionally dense, velvety-smooth option providing deeply luxurious thermal insulation and tactile satisfaction.',
    product_price: 260.00,
    product_image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop',
    product_category: 'The Ultimate Luxury Faux-Fur Blanket',
    product_subcategory: 'Sheared Beaver Faux-Fur Blanket',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 260.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },

  // 2. Indulgent Plush Bathrobes & Slippers
  {
    product_id: 'plush_robe_01',
    product_name: 'Turkish Cloud Cotton Embroidered Plush Robes',
    product_description: 'Matching embroidered his/hers robes crafted from 700 GSM Aegean long-staple cotton that are thick, absorbent, and cloud-soft.',
    product_price: 160.00,
    product_image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop',
    product_category: 'Indulgent Plush Bathrobes & Slippers',
    product_subcategory: 'Turkish Cotton Plush Robes',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 160.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_robe_02',
    product_name: 'Sherpa-Lined Floor-Length Fleece Robe',
    product_description: 'Long, floor-length options featuring deep plush sherpa collars and double-faced microfleece that feel like a continuous hug.',
    product_price: 140.00,
    product_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop',
    product_category: 'Indulgent Plush Bathrobes & Slippers',
    product_subcategory: 'Sherpa-Lined Fleece Robes',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 140.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_robe_03',
    product_name: 'Memory Foam Velvet Plush Slides',
    product_description: 'Premium indoor slippers with a high-density memory foam footbed and velvet finish making walking on hard floors feel effortless.',
    product_price: 65.00,
    product_image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop',
    product_category: 'Indulgent Plush Bathrobes & Slippers',
    product_subcategory: 'Memory Foam Plush Slides',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 65.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_robe_04',
    product_name: 'Shearling Warm Ankle Bootie Slippers',
    product_description: 'Cozy, ankle-high plush boots with genuine shearling lining tailored for the partner who always complains about cold feet.',
    product_price: 95.00,
    product_image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop',
    product_category: 'Indulgent Plush Bathrobes & Slippers',
    product_subcategory: 'Shearling Bootie Slippers',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 95.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },

  // 3. Sophisticated Living Room Textures
  {
    product_id: 'plush_decor_01',
    product_name: 'Sculptural Bouclé Ball Accent Pillows (Pair)',
    product_description: 'Trendy, structural, yet incredibly soft sphere cushions that invite tactile touch and serve as a modern design statement.',
    product_price: 85.00,
    product_image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop',
    product_category: 'Sophisticated Living Room Textures',
    product_subcategory: 'Bouclé Ball Pillows',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 85.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_decor_02',
    product_name: 'Faux-Rabbit Fur Jewel-Tone Cushions',
    product_description: 'Intensely soft throw cushions in romantic jewel tones like emerald green, royal burgundy, and dusty rose.',
    product_price: 75.00,
    product_image: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=800&auto=format&fit=crop',
    product_category: 'Sophisticated Living Room Textures',
    product_subcategory: 'Faux-Rabbit Fur Pillows',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 75.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_decor_03',
    product_name: 'Plush Orthopedic Body Pillow with Cooling Silk Case',
    product_description: 'A functional ergonomic sleep aid wrapped in a premium 22-Momme mulberry cooling silk pillowcase.',
    product_price: 110.00,
    product_image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop',
    product_category: 'Sophisticated Living Room Textures',
    product_subcategory: 'Plush Body Pillow with Silk Pillowcase',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 110.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_decor_04',
    product_name: 'Genuine High-Pile Icelandic Sheepskin Bedside Rug',
    product_description: 'A plush, ethically-sourced sheepskin rug placed right by the bedside for a cloud-soft landing every morning.',
    product_price: 150.00,
    product_image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&auto=format&fit=crop',
    product_category: 'Sophisticated Living Room Textures',
    product_subcategory: 'Sheepskin Area Rug',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 150.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },

  // 4. Sensual Bedding Upgrades
  {
    product_id: 'plush_bedding_01',
    product_name: 'Shimmering Crushed Velvet Romance Duvet Cover',
    product_description: 'A shimmering crushed velvet exterior backed by breathable 400-thread-count Egyptian cotton that feels silk-soft against skin.',
    product_price: 220.00,
    product_image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop',
    product_category: 'Sensual Bedding Upgrades',
    product_subcategory: 'Crushed Velvet Duvet Cover',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 220.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_bedding_02',
    product_name: 'Cloud-Comfort Hotel Plush Mattress Topper',
    product_description: 'A 3-inch baffled box topper packed with micro-gel down alternative that transforms any bed into a 5-star hotel mattress.',
    product_price: 175.00,
    product_image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop',
    product_category: 'Sensual Bedding Upgrades',
    product_subcategory: 'Plush Mattress Topper',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 175.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_bedding_03',
    product_name: 'Ultra-Soft Micro-Flannel Thermal Sheet Set',
    product_description: 'Deeply comforting flannel sheets with anti-pill weave that completely eliminates cold sheets on winter nights.',
    product_price: 130.00,
    product_image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&auto=format&fit=crop',
    product_category: 'Sensual Bedding Upgrades',
    product_subcategory: 'Flannel or Fleece Sheet Sets',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 130.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_bedding_04',
    product_name: 'Textured Quilted Velvet & Plush Coverlet',
    product_description: 'A low-profile but highly textured extra quilt layer for the foot of the bed with modern diamond geometric stitching.',
    product_price: 145.00,
    product_image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=800&auto=format&fit=crop',
    product_category: 'Sensual Bedding Upgrades',
    product_subcategory: 'Quilted Plush Coverlet',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 145.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },

  // 5. Date Night & Travel Cozy Goods
  {
    product_id: 'plush_travel_01',
    product_name: 'Waterproof Fleece Outdoor Plush Picnic Blanket',
    product_description: 'A waterproof-backed blanket with a thick, soft fleece top perfect for romantic park dates, twilight wine sessions, or stargazing.',
    product_price: 80.00,
    product_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
    product_category: 'Date Night & Travel Cozy Goods',
    product_subcategory: 'Outdoor Plush Picnic Blanket',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 80.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_travel_02',
    product_name: 'Wearable Sherpa Blanket Couple Hoodies',
    product_description: 'Matching oversized plush fleece hoodies lined with thick sherpa, custom-built for cozy backyard fire-pit date nights.',
    product_price: 110.00,
    product_image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop',
    product_category: 'Date Night & Travel Cozy Goods',
    product_subcategory: 'Wearable Sherpa Blanket Hoodies',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 110.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_travel_03',
    product_name: 'Velvet Travel Neck Pillow & Eye Mask Set',
    product_description: 'Ergonomic high-density memory foam neck pillow with matching 100% blackout silk eye mask for romantic weekend getaways.',
    product_price: 60.00,
    product_image: 'https://images.unsplash.com/photo-1520038410233-7e6692767b70?w=800&auto=format&fit=crop',
    product_category: 'Date Night & Travel Cozy Goods',
    product_subcategory: 'Plush Travel Neck Pillows & Eye Mask Sets',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 60.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_travel_04',
    product_name: 'Ergonomic Memory Foam Padded Car Seat Cushion',
    product_description: 'Plush microfiber memory foam cushions that relieve pressure and ensure maximum luxury comfort on scenic coastal road trips.',
    product_price: 70.00,
    product_image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop',
    product_category: 'Date Night & Travel Cozy Goods',
    product_subcategory: 'Padded Car Seat Cushions',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 70.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },

  // 6. Elegant & Mature Character Plushies
  {
    product_id: 'plush_char_01',
    product_name: 'Jellycat Amuseable Red Heart Romance Keepsake',
    product_description: 'A classy, whimsical scarlet heart plush with sweet corduroy legs that looks charming on a nightstand, vanity, or bedside shelf.',
    product_price: 55.00,
    product_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop',
    product_category: 'Elegant & Mature Character Plushies',
    product_subcategory: 'Jellycat Amuseable Red Heart',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 55.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_char_02',
    product_name: 'Steiff Classic Mohair Heirloom Collectible Bear',
    product_description: 'A timeless, German-handcrafted heirloom collectible bear made with genuine mohair, brass button in ear, and jointed limbs.',
    product_price: 220.00,
    product_image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop',
    product_category: 'Elegant & Mature Character Plushies',
    product_subcategory: 'Steiff Classic Mohair Bear',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 220.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_char_03',
    product_name: 'Custom Sentimental Furry Pet Plush Portrait',
    product_description: 'A deeply sentimental, custom-crafted plush replica of your partner\'s beloved pet, hand-finished to match exact markings.',
    product_price: 195.00,
    product_image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop',
    product_category: 'Elegant & Mature Character Plushies',
    product_subcategory: 'Custom Plush Portrait of Pet',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 195.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_char_04',
    product_name: 'Warmies Microwavable Plush Lavender Wrap',
    product_description: 'A soothing weighted neck wrap infused with real French lavender buds and organic grains that can be warmed in the microwave.',
    product_price: 45.00,
    product_image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&auto=format&fit=crop',
    product_category: 'Elegant & Mature Character Plushies',
    product_subcategory: '"Warmies" Microwavable Plush Lavender Wrap',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 45.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_char_05',
    product_name: 'Jellycat Amuseable To-Go Coffee & Snake Plant Plush',
    product_description: 'Whimsical, high-end plush duo shaped like a potted botanical plant and morning latte cup, looking aesthetic on any desk.',
    product_price: 68.00,
    product_image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop',
    product_category: 'Elegant & Mature Character Plushies',
    product_subcategory: 'Jellycat Amuseable Coffee or Plant Plush',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 68.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_char_06',
    product_name: 'Homedics Weighted Aromatherapy Sloth',
    product_description: 'A gentle 4.5-lb weighted sloth companion offering grounding deep-touch pressure, paired with a subtle calming eucalyptus scent pouch.',
    product_price: 58.00,
    product_image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop',
    product_category: 'Elegant & Mature Character Plushies',
    product_subcategory: 'Homedics Weighted Aromatherapy Sloth',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 58.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_char_07',
    product_name: 'Squishmallow Extra-Large 20-Inch Lumbar Companion',
    product_description: 'Marshmallow-soft cloud texture that makes an exceptional couch pillow, movie night headrest, or comfortable cuddle bolster.',
    product_price: 65.00,
    product_image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop',
    product_category: 'Elegant & Mature Character Plushies',
    product_subcategory: 'Squishmallow Extra-Large 20-inch',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 65.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_char_08',
    product_name: 'Pangea / Huggaroo Weighted Warmable Puppy',
    product_description: 'A weighted puppy plush infused with French lavender, engineered to ease neck and shoulder tension after long workdays.',
    product_price: 62.00,
    product_image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop',
    product_category: 'Elegant & Mature Character Plushies',
    product_subcategory: 'Pangea / Huggaroo Weighted Warmable Puppy',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 62.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },

  // 7. Romantic Bath & Body Textures
  {
    product_id: 'plush_bath_01',
    product_name: 'Ergonomic Plush Bath Kneeling & Massage Cushion',
    product_description: 'A water-resistant, ultra-thick memory foam kneeling mat designed for giving luxurious romantic bubble bath back massages and foot rubs.',
    product_price: 48.00,
    product_image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&auto=format&fit=crop',
    product_category: 'Romantic Bath & Body Textures',
    product_subcategory: 'Plush Bath Kneeling Cushion',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 48.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_bath_02',
    product_name: 'Cloud-Step Ultra-Dense Microfiber Luxury Bath Mat',
    product_description: 'An ultra-dense microfiber plush rug that feels like stepping onto warm velvet clouds post-shower with non-slip latex backing.',
    product_price: 52.00,
    product_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop',
    product_category: 'Romantic Bath & Body Textures',
    product_subcategory: 'High-Pile Luxury Bath Mats',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 52.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_bath_03',
    product_name: 'Whipped Shea & Cocoa Body Butter Romance Spa Set',
    product_description: 'Thick, velvety, whipped organic shea butter and sweet almond massage creams scented with Tahitian vanilla and sandalwood.',
    product_price: 68.00,
    product_image: 'https://images.unsplash.com/photo-1608248597359-00f7b036cfae?w=800&auto=format&fit=crop',
    product_category: 'Romantic Bath & Body Textures',
    product_subcategory: 'Whipped Body Butter Sets',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 68.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_bath_04',
    product_name: 'Gentle Silk-Plush Microfiber Hair Wrap',
    product_description: 'An ultra-absorbent, lightweight hair turban lined with satin to protect curls and dry hair gently without friction.',
    product_price: 36.00,
    product_image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop',
    product_category: 'Romantic Bath & Body Textures',
    product_subcategory: 'Plush Microfiber Hair Wrap',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 36.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },

  // 8. Nostalgic & Pop Culture Plush
  {
    product_id: 'plush_pop_01',
    product_name: 'Original 90s Tamagotchi Virtual Pet Companion Plush',
    product_description: 'Soft, oversized 14-inch plush version of the classic 90s handheld virtual pet with embroidered pixel screen graphics.',
    product_price: 49.00,
    product_image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop',
    product_category: 'Nostalgic & Pop Culture Plush',
    product_subcategory: 'Original Tamagotchi Companion Plush',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 49.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_pop_02',
    product_name: 'Giant Pokemon Snorlax Sleeping Bean Bag Chair Plush',
    product_description: 'A massive 40-inch ultra-plush bean bag chair shaped like the iconic sleepy Pokemon, perfect for adult lounge spaces.',
    product_price: 230.00,
    product_image: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&auto=format&fit=crop',
    product_category: 'Nostalgic & Pop Culture Plush',
    product_subcategory: 'Pokemon Snorlax Bean Bag Chair / Large Plush',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 230.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_pop_03',
    product_name: 'Star Wars Grogu (Baby Yoda) Interactive Sound Plush',
    product_description: 'Features authentic motion and sound effects, plush robes, and sculpted vinyl head—a beloved collectible for media rooms.',
    product_price: 75.00,
    product_image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=800&auto=format&fit=crop',
    product_category: 'Nostalgic & Pop Culture Plush',
    product_subcategory: 'Star Wars Grogu (Baby Yoda) Talking Plush',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 75.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_pop_04',
    product_name: 'Studio Ghibli Totoro Oversized Nap Cushion',
    product_description: 'A large, velvety Totoro with signature belly leaf, doubling as an ultra-comfortable reading bolster and afternoon nap pillow.',
    product_price: 85.00,
    product_image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop',
    product_category: 'Nostalgic & Pop Culture Plush',
    product_subcategory: 'Studio Ghibli Totoro Nap Pillow',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 85.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },

  // 9. Quirky & Humorous Adult Plush
  {
    product_id: 'plush_quirk_01',
    product_name: 'Giant Cult-Favorite IKEA Djungelskog Plush Bear',
    product_description: 'The giant, 39-inch wonderfully goofy plush brown bear that has become a globally beloved comfort icon for adult apartments.',
    product_price: 90.00,
    product_image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop',
    product_category: 'Quirky & Humorous Adult Plush',
    product_subcategory: 'IKEA Soft Toy Rodret / Knorrig / Djungelskog',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 90.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_quirk_02',
    product_name: 'Jellycat Artisanal Baked Bean & Avocado Toast Duo',
    product_description: 'Hilariously quirky food-themed plush pair adding a witty, stylish pop of culinary personality to a contemporary living room.',
    product_price: 52.00,
    product_image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop',
    product_category: 'Quirky & Humorous Adult Plush',
    product_subcategory: 'Jellycat Baked Bean / Avocado Toast Plush',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 52.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_quirk_03',
    product_name: 'Smoko Toast USB-Powered Heated Foot Warmers',
    product_description: 'Ultra-plush smiling toast-shaped slippers that plug into any USB port to keep feet warm during late-night laptop sessions.',
    product_price: 56.00,
    product_image: 'https://images.unsplash.com/photo-1582845512747-e42001c95638?w=800&auto=format&fit=crop',
    product_category: 'Quirky & Humorous Adult Plush',
    product_subcategory: 'Smoko Toast USB-Warmable Foot Warmer',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 56.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  },
  {
    product_id: 'plush_quirk_04',
    product_name: 'GiantMicrobes Plush Caffeine Molecule & Tardigrade Duo',
    product_description: 'Soft, scientifically accurate oversized plush toys that make clever, witty conversation pieces for coffee lovers and science enthusiasts.',
    product_price: 48.00,
    product_image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop',
    product_category: 'Quirky & Humorous Adult Plush',
    product_subcategory: 'Giant Microbes Giant Plush',
    product_status: 'active',
    product_sold_status: 'available',
    product_price_in_fic: 48.00,
    product_created_at: '2026-10-01T08:00:00Z',
    product_updated_at: '2026-10-01T08:00:00Z'
  }
];

interface LushPlushiesCatalogProps {
  onGiftSelect?: (product: LushGiftProduct) => void;
  userId: string;
}

const LushPlushiesCatalog: React.FC<LushPlushiesCatalogProps> = ({ onGiftSelect, userId }) => {
  const [catalog, setCatalog] = useState<LushGiftProduct[]>(DEFAULT_PLUSHIES_CATALOG);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price_low' | 'price_high' | 'name'>('price_low');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading catalog data
    const loadCatalog = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would fetch from an API
        // const response = await fetch('/api/lushpressies/catalog');
        // const data = await response.json();
        // setCatalog(data.products);
      } catch (error) {
        console.error('Error loading catalog:', error);
        setCatalog(DEFAULT_PLUSHIES_CATALOG);
      } finally {
        setIsLoading(false);
      }
    };

    loadCatalog();
  }, []);

  const filteredProducts = catalog.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.product_category === selectedCategory;
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.product_description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_low') {
      return Number(a.product_price) - Number(b.product_price);
    } else if (sortBy === 'price_high') {
      return Number(b.product_price) - Number(a.product_price);
    } else if (sortBy === 'name') {
      return a.product_name.localeCompare(b.product_name);
    }
    return 0;
  });

  const handleGiftSelect = (product: LushGiftProduct) => {
    if (onGiftSelect) {
      onGiftSelect(product);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lush Pressies Virtual Gift Shop</h1>
        <p className="mt-2 text-gray-600">Curated weighted & comfort plushies for meaningful connections</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search gifts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
        >
          <option value="All">All Categories</option>
          {LUSH_PLUSHIE_CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
        >
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <div
            key={product.product_id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleGiftSelect(product)}
          >
            <div className="relative">
              {product.product_image.startsWith('http') ? (
                <img
                  src={product.product_image}
                  alt={product.product_name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <div className="text-slate-700">Gift Image</div>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium">
                ${product.product_price}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{product.product_name}</h3>
              <p className="text-sm text-slate-700 mb-2">{product.product_category}</p>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.product_description}
              </p>

              <button
                type="button"
                aria-label={`Send ${product.product_name} as a gift`}
                onClick={() => window.location.assign(`/gifts/checkout?product=${encodeURIComponent(product.product_id)}`)}
                className="w-full bg-gradient-to-r from-amber-500 to-rose-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Send as Gift
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No gifts found</h3>
          <p className="mt-1 text-sm text-slate-700 font-medium">Try adjusting your search or category filters.</p>
        </div>
      )}
    </div>
  );
};

export default LushPlushiesCatalog;
