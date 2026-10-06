export interface LuxuryProduct {
  id: string;
  name: string;
  brand: string;
  category: 'haute-couture' | 'timepieces' | 'fine-jewelry' | 'leather-goods' | 'footwear' | 'bespoke-suits' | 'perfumery' | 'accessories';
  targetAudience: 'men' | 'women' | 'unisex';
  ageGroup: string;
  price: number; // in USD or FIC equivalent
  rating: number;
  salesCount: number;
  inStock: boolean;
  ownitExclusive: boolean;
  limitedEdition: boolean;
  totalQuantity: number;
  availableQuantity: number;
  origin: string;
  craftsmanshipHours: number;
  image: string;
  gallery: string[];
  description: string;
  specifications: Record<string, string>;
  curatorNote: string;
  tags: string[];
}

export const LUXURY_CATEGORIES = [
  { id: 'all', name: 'All Collections', count: 30 },
  { id: 'haute-couture', name: 'Haute Couture & Evening Gowns', count: 6 },
  { id: 'timepieces', name: 'Swiss High Horology', count: 5 },
  { id: 'fine-jewelry', name: 'High Jewelry & Gemstones', count: 5 },
  { id: 'leather-goods', name: 'Exotic Leather & Handbags', count: 5 },
  { id: 'bespoke-suits', name: 'Bespoke Tailoring & Suiting', count: 4 },
  { id: 'footwear', name: 'Artisanal Footwear', count: 3 },
  { id: 'perfumery', name: 'Private Blend Perfumery', count: 2 },
];

export const CURATED_LUXURY_PRODUCTS: LuxuryProduct[] = [
  // --- 1. HAUTE COUTURE & EVENING WEAR (WOMEN & MEN 25-55) ---
  {
    id: 'ownit-001',
    name: 'Aurelia 24k Gold Threaded Silk Gown',
    brand: 'Maison D’Élégance',
    category: 'haute-couture',
    targetAudience: 'women',
    ageGroup: '25-55',
    price: 34500,
    rating: 4.98,
    salesCount: 12,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 15,
    availableQuantity: 3,
    origin: 'Paris, France',
    craftsmanshipHours: 320,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Hand-embroidered evening gown woven with 24-karat gold metallic threads over pure Mulberry silk velvet. Tailored for grand galas and red-carpet premieres.',
    specifications: {
      Material: '100% Silk Velvet with 24k Gold Threading',
      Lining: 'Pure Silk Crepe de Chine',
      Fit: 'Bespoke Sculpted Silhouette',
      Care: 'Specialist Atelier Dry Clean Only'
    },
    curatorNote: 'A masterpiece of Parisian haute couture, engineered to capture light with every movement.',
    tags: ['Haute Couture', '24k Gold', 'Evening Gown', 'Red Carpet', 'Paris']
  },
  {
    id: 'ownit-002',
    name: 'The Emperor Vicuña & Silk Tuxedo',
    brand: 'Savile Row Atelier No. 1',
    category: 'bespoke-suits',
    targetAudience: 'men',
    ageGroup: '35-55',
    price: 28900,
    rating: 4.97,
    salesCount: 18,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 20,
    availableQuantity: 4,
    origin: 'London, United Kingdom',
    craftsmanshipHours: 180,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Woven from Peruvian Vicuña fiber—the rare fleece of the Andes—blended with pure Mulberry silk. Satin lapels hand-stitched by master tailors in Mayfair.',
    specifications: {
      Fabric: '100% Peruvian Vicuña & Mulberry Silk',
      Buttons: 'Hand-Carved Black Mother of Pearl',
      Construction: 'Full Canvas Hand-Padded Chest Piece'
    },
    curatorNote: 'Vicuña is softer than cashmere and five times rarer. Reserved for distinguished connoisseurs.',
    tags: ['Vicuña', 'Bespoke Tuxedo', 'Savile Row', 'Gentlemen', 'Executive']
  },
  {
    id: 'ownit-003',
    name: 'Sovereign Emerald Cut Diamond Collier',
    brand: 'Vanderbilt & Co. High Jewelry',
    category: 'fine-jewelry',
    targetAudience: 'women',
    ageGroup: '30-55',
    price: 185000,
    rating: 5.0,
    salesCount: 3,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 5,
    availableQuantity: 2,
    origin: 'Geneva, Switzerland',
    craftsmanshipHours: 450,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Featuring a central 12.4 carat D-Flawless emerald-cut diamond, flanked by 32 baguette-cut diamonds set in platinum 950.',
    specifications: {
      CentralGem: '12.4ct Emerald Cut Diamond (D Color, Flawless)',
      SideStones: '8.6ct Total Weight Baguette Cut',
      Metal: 'Platinum 950',
      Certification: 'GIA & SSEF Dual Certification'
    },
    curatorNote: 'An investment-grade high jewelry creation with museum-quality stone clarity and perfection.',
    tags: ['High Jewelry', '12ct Diamond', 'Platinum', 'Investment Grade', 'Swiss Made']
  },
  {
    id: 'ownit-004',
    name: 'Geneva Grand Tourbillon Rose Gold 18k',
    brand: 'Chronos Horologie',
    category: 'timepieces',
    targetAudience: 'unisex',
    ageGroup: '30-55',
    price: 142000,
    rating: 4.99,
    salesCount: 8,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 10,
    availableQuantity: 2,
    origin: 'Geneva, Switzerland',
    craftsmanshipHours: 520,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Single-axis flying tourbillon movement with perpetual calendar and moonphase indication. Housed in a hand-polished 18k Rose Gold case with sapphire crystal caseback.',
    specifications: {
      Movement: 'Caliber CH-908 Automatic Flying Tourbillon',
      PowerReserve: '72 Hours Dual Barrel',
      CaseDiameter: '41mm 18k Rose Gold',
      Strap: 'Hand-Stitched Mississippi Alligator Leather'
    },
    curatorNote: 'The pinnacle of Swiss mechanical watchmaking, finished with hand-beveled Anglage edges.',
    tags: ['Tourbillon', '18k Gold', 'Swiss Watch', 'Horology', 'Perpetual Calendar']
  },
  {
    id: 'ownit-005',
    name: 'Verdant Imperial Crocodile Birkin 35',
    brand: 'Atelier de L’Hermitage',
    category: 'leather-goods',
    targetAudience: 'women',
    ageGroup: '28-55',
    price: 68000,
    rating: 4.96,
    salesCount: 5,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 7,
    availableQuantity: 1,
    origin: 'Florence, Italy',
    craftsmanshipHours: 140,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Crafted from Porosus saltwater crocodile leather in deep emerald green, accented with 24k gold-plated brass lock and key hardware.',
    specifications: {
      Material: 'Grade-A Porosus Crocodile Skin',
      Hardware: '24k Gold Plated Palladium Brass',
      Dimensions: '35cm x 28cm x 18cm',
      Inclusions: 'Clochette, Lock, Keys, Rain Cover, CITES Certificate'
    },
    curatorNote: 'The holy grail of leather luxury goods. Comes with full international CITES documentation.',
    tags: ['Crocodile Handbag', 'Emerald Green', '24k Gold', 'Exotic Leather', 'Birkin Style']
  },
  {
    id: 'ownit-006',
    name: 'Midnight Sapphire Silk Tuxedo Gown',
    brand: 'Valerie St. Laurent',
    category: 'haute-couture',
    targetAudience: 'women',
    ageGroup: '25-45',
    price: 22000,
    rating: 4.94,
    salesCount: 14,
    inStock: true,
    ownitExclusive: false,
    limitedEdition: true,
    totalQuantity: 25,
    availableQuantity: 6,
    origin: 'Milan, Italy',
    craftsmanshipHours: 210,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'A striking fusion of classic menswear suiting and dramatic evening couture. Midnight blue silk faille with structured shoulder pads and thigh-high slit.',
    specifications: {
      Fabric: '100% Heavyweight Italian Faille Silk',
      Details: 'Satin Peaked Lapel & Crystal Buttons',
      Closure: 'Concealed Rear Silk Zipper'
    },
    curatorNote: 'Commanding power dressing for gala hostesses and high-profile executives.',
    tags: ['Tuxedo Gown', 'Milan Fashion', 'Silk Faille', 'Empowered Luxury']
  },
  {
    id: 'ownit-007',
    name: 'Royal Oak Skeleton Ceramic Automatic',
    brand: 'Kaiser & Cie',
    category: 'timepieces',
    targetAudience: 'men',
    ageGroup: '28-50',
    price: 94000,
    rating: 4.95,
    salesCount: 11,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 12,
    availableQuantity: 2,
    origin: 'Le Brassus, Switzerland',
    craftsmanshipHours: 380,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Full jet-black scratch-resistant ceramic case and bracelet, surrounding an ultra-thin openworked skeleton movement with gold rotor.',
    specifications: {
      CaseMaterial: 'High-Tech Zirconia Ceramic',
      Dial: 'Sapphire Crystal Skeletonized',
      WaterResistance: '100 Meters / 10 Bar'
    },
    curatorNote: 'Modern haute horlogerie in indestructible ceramic for the contemporary titan.',
    tags: ['Ceramic Watch', 'Skeleton Dial', 'Swiss Made', 'Ultra Luxury']
  },
  {
    id: 'ownit-008',
    name: 'Bespoke Double-Breasted Cashmere Overcoat',
    brand: 'Bespoke Tailoring Milano',
    category: 'bespoke-suits',
    targetAudience: 'men',
    ageGroup: '30-55',
    price: 16500,
    rating: 4.92,
    salesCount: 22,
    inStock: true,
    ownitExclusive: false,
    limitedEdition: false,
    totalQuantity: 30,
    availableQuantity: 8,
    origin: 'Milan, Italy',
    craftsmanshipHours: 95,
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Pure 100% Loro Piana baby cashmere double-breasted overcoat in camel hue. Horn buttons and hand-stitched pick seams throughout.',
    specifications: {
      Material: '100% Loro Piana Baby Cashmere',
      Lining: 'Bemberg Cupro',
      Weight: '550g per meter Winter Weight'
    },
    curatorNote: 'Timeless elegance and supreme warmth for European winters and global travel.',
    tags: ['Cashmere Overcoat', 'Loro Piana', 'Italian Tailoring', 'Winter Luxury']
  },
  {
    id: 'ownit-009',
    name: 'Burmese Ruby & Diamond Cocktail Ring',
    brand: 'Cartier Royal Vault Collection',
    category: 'fine-jewelry',
    targetAudience: 'women',
    ageGroup: '35-55',
    price: 112000,
    rating: 4.99,
    salesCount: 4,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 6,
    availableQuantity: 1,
    origin: 'Paris, France',
    craftsmanshipHours: 290,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Unheated 7.2ct Burmese "Pigeon\'s Blood" Ruby surrounded by two tiers of pear-shaped brilliant diamonds in 18k White Gold.',
    specifications: {
      CenterStone: '7.2ct Natural Burmese Ruby (No Heat)',
      SideDiamonds: '4.8ct Total Weight Pear Cut',
      Metal: '18k White Gold & Platinum Prongs'
    },
    curatorNote: 'Pigeon\'s Blood Rubies from Myanmar are among the world\'s rarest natural gems.',
    tags: ['Burmese Ruby', 'Cocktail Ring', 'Pigeons Blood', 'Paris Jewelry']
  },
  {
    id: 'ownit-010',
    name: 'The Sovereign Alligator Travel Holdall',
    brand: 'Scavia Leatherworks',
    category: 'leather-goods',
    targetAudience: 'men',
    ageGroup: '30-55',
    price: 42000,
    rating: 4.91,
    salesCount: 9,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 10,
    availableQuantity: 3,
    origin: 'Florence, Italy',
    craftsmanshipHours: 160,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Executive weekend weekender duffel handcrafted from matte American alligator skin with solid brushed titanium hardware and suede interior.',
    specifications: {
      Exterior: 'Matte Black Alligator Leather',
      Interior: 'Alcantara Suede with Padded Laptop Sleeve',
      Dimensions: '50cm x 30cm x 25cm (Carry-On Approved)'
    },
    curatorNote: 'Engineered for private jet travelers who compromise on nothing.',
    tags: ['Alligator Duffel', 'Executive Luggage', 'Private Jet', 'Italian Leather']
  },
  {
    id: 'ownit-011',
    name: 'L’Elixir Imperial Oud Private Perfume 100ml',
    brand: 'Parfums de Sovereign',
    category: 'perfumery',
    targetAudience: 'unisex',
    ageGroup: '25-55',
    price: 4500,
    rating: 4.97,
    salesCount: 65,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 100,
    availableQuantity: 24,
    origin: 'Grasse, France',
    craftsmanshipHours: 60,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Aged 50-year-old wild Cambodian Oud extract blended with Taif Rose, Ambergris, and rare Florentine Iris. Housed in a hand-cut crystal flacon topped with gold.',
    specifications: {
      Concentration: 'Extrait de Parfum (35% Oil Concentration)',
      Bottle: 'Baccarat Crystal with 24k Gold Leaf Stopper',
      Volume: '100ml / 3.4 fl. oz'
    },
    curatorNote: 'Sublime sillage with unmatched longevity. Only 100 bottles blended annually.',
    tags: ['Cambodian Oud', 'Baccarat Crystal', 'Haute Perfumery', 'Grasse']
  },
  {
    id: 'ownit-012',
    name: 'Venetian Gold Embroidered Velvet Loafers',
    brand: 'Stefano Bemer Artisans',
    category: 'footwear',
    targetAudience: 'men',
    ageGroup: '25-50',
    price: 3800,
    rating: 4.89,
    salesCount: 34,
    inStock: true,
    ownitExclusive: false,
    limitedEdition: false,
    totalQuantity: 50,
    availableQuantity: 15,
    origin: 'Florence, Italy',
    craftsmanshipHours: 45,
    image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Hand-welted evening loafers crafted from deep navy velvet with gold bullion thread embroidery of the Royal Crest.',
    specifications: {
      Upper: 'Italian Cotton Velvet & Gold Bullion Thread',
      Sole: 'Oak Bark Tanned Leather Sole',
      Construction: 'Goodyear Hand-Welted'
    },
    curatorNote: 'Designed to accompany tuxedo attire or tailored evening trousers.',
    tags: ['Velvet Loafers', 'Gold Embroidery', 'Bespoke Shoes', 'Florence']
  },
  {
    id: 'ownit-013',
    name: 'Chinchilla Fur & Cashmere Cape',
    brand: 'Fendi Haute Fourrure',
    category: 'haute-couture',
    targetAudience: 'women',
    ageGroup: '35-55',
    price: 48000,
    rating: 4.96,
    salesCount: 6,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 8,
    availableQuantity: 2,
    origin: 'Rome, Italy',
    craftsmanshipHours: 240,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Silken natural grey Chinchilla pelt trim combined with double-faced Loro Piana cashmere cape. Incomparable softness and warmth.',
    specifications: {
      Material: 'Certified Sustainable Natural Chinchilla Fur & Cashmere',
      Lining: 'Silk Jacquard Monogram',
      Origin: 'Rome Fur Atelier'
    },
    curatorNote: 'Ethically sourced certified pelt with unmatched velvety texture.',
    tags: ['Chinchilla Fur', 'Cashmere Cape', 'Haute Fourrure', 'Rome Atelier']
  },
  {
    id: 'ownit-014',
    name: 'Platinum Perpetual Calendar Moonphase 40mm',
    brand: 'A. Lange & Söhne Masterpieces',
    category: 'timepieces',
    targetAudience: 'men',
    ageGroup: '35-55',
    price: 128000,
    rating: 5.0,
    salesCount: 5,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 8,
    availableQuantity: 1,
    origin: 'Glashütte, Germany',
    craftsmanshipHours: 480,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'German silver movement components hand-engraved with floral motifs. Solid platinum 950 case with outsize date display and astronomical moonphase.',
    specifications: {
      Case: 'Solid Platinum 950',
      Movement: 'Caliber L095.2 In-House Hand-Wound',
      Accuracy: '+/- 1 Second Per Day'
    },
    curatorNote: 'Glashütte watchmaking precision at its absolute pinnacle.',
    tags: ['German Watch', 'Platinum', 'Perpetual Calendar', 'Glashütte']
  },
  {
    id: 'ownit-015',
    name: 'South Sea Pearl & Diamond Tiara Brooch',
    brand: 'Boucheron Paris',
    category: 'fine-jewelry',
    targetAudience: 'women',
    ageGroup: '30-55',
    price: 76000,
    rating: 4.93,
    salesCount: 7,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 10,
    availableQuantity: 3,
    origin: 'Paris, France',
    craftsmanshipHours: 310,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Transformable high jewelry piece that functions as both a red-carpet hair tiara and a statement chest brooch. 15-17mm Australian South Sea cultured pearls.',
    specifications: {
      Pearls: '15mm to 17mm AAA Grade Australian South Sea Pearls',
      Diamonds: '9.2ct VVS Marquis and Brilliant Cut Diamonds',
      Function: '2-in-1 Tiara and Brooch Convertible Mechanism'
    },
    curatorNote: 'Versatile royal splendor designed for tiara galas or coat adornment.',
    tags: ['South Sea Pearls', 'Tiara Brooch', 'Paris High Jewelry', 'Transformable']
  },
  {
    id: 'ownit-016',
    name: 'Hand-Painted Silk Kimono Robe Couture',
    brand: 'Kyoto Yuzen Masters',
    category: 'haute-couture',
    targetAudience: 'women',
    ageGroup: '25-50',
    price: 19500,
    rating: 4.97,
    salesCount: 9,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 10,
    availableQuantity: 2,
    origin: 'Kyoto, Japan',
    craftsmanshipHours: 400,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Traditional Kyo-Yuzen hand-dyed and gold-leaf embossed ceremonial silk kimono. Depicts cherry blossoms and golden phoenixes.',
    specifications: {
      Fabric: 'Tango Chirimen Heavy Silk',
      Technique: 'Yuzen Hand-Dyeing & Kanazawa Gold Leaf Stenciling',
      Inclusions: 'Hand-Woven Silk Obi Sash'
    },
    curatorNote: 'Designated a living national treasure art piece from Kyoto\'s historic Gion district.',
    tags: ['Kyoto Silk', 'Kimono Couture', 'Gold Leaf', 'Japanese Art']
  },
  {
    id: 'ownit-017',
    name: 'Bespoke Alligator Monk Strap Shoes',
    brand: 'John Lobb St. James’s',
    category: 'footwear',
    targetAudience: 'men',
    ageGroup: '30-55',
    price: 8900,
    rating: 4.95,
    salesCount: 16,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 20,
    availableQuantity: 4,
    origin: 'London, United Kingdom',
    craftsmanshipHours: 85,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Double monk strap dress shoes handcrafted on a custom wooden last from hand-dyed chestnut American alligator hide.',
    specifications: {
      Leather: 'Chestnut Mississippi Alligator',
      Buckles: 'Solid Sterling Silver Hand-Engraved Buckles',
      Construction: 'Bespoke Hand-Stitched Welt'
    },
    curatorNote: 'Includes custom wooden shoe trees carved to match your foot anatomy.',
    tags: ['Bespoke Shoes', 'Alligator Leather', 'John Lobb', 'London Tailoring']
  },
  {
    id: 'ownit-018',
    name: 'The Sovereign Diamond Encrusted Eyewear',
    brand: 'LOTOS Gold & Jewels',
    category: 'fine-jewelry',
    targetAudience: 'unisex',
    ageGroup: '30-55',
    price: 32000,
    rating: 4.88,
    salesCount: 11,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 15,
    availableQuantity: 5,
    origin: 'Pforzheim, Germany',
    craftsmanshipHours: 120,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Solid 18k White Gold rimless sunglasses frames set with 110 pave-set round brilliant diamonds along the temples and bridge.',
    specifications: {
      Frame: '18k White Gold (750 purity)',
      Diamonds: '2.5ct Total Weight VVS Clear Diamonds',
      Lenses: 'Zeiss Anti-Reflective Polarized Gold Mirrors'
    },
    curatorNote: 'The ultimate statement in luxury eyewear, guaranteed for life.',
    tags: ['Diamond Eyewear', '18k Gold Glasses', 'Zeiss Lenses', 'Lotos Germany']
  },
  {
    id: 'ownit-019',
    name: 'Bespoke Italian Silk Velvet Smoking Jacket',
    brand: 'Rubinacci Napoli',
    category: 'bespoke-suits',
    targetAudience: 'men',
    ageGroup: '28-55',
    price: 12500,
    rating: 4.94,
    salesCount: 20,
    inStock: true,
    ownitExclusive: false,
    limitedEdition: false,
    totalQuantity: 25,
    availableQuantity: 7,
    origin: 'Naples, Italy',
    craftsmanshipHours: 70,
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Deep burgundy silk velvet host smoking jacket with quilted satin shawl collar and silk frog closures.',
    specifications: {
      Body: '100% Neapolitan Silk Velvet',
      Collar: 'Quilted Mulberry Silk Satin',
      Style: 'Sartoria Neapolitana Unstructured Shoulder'
    },
    curatorNote: 'Designed for high-society home entertaining and private club lounge gatherings.',
    tags: ['Smoking Jacket', 'Neapolitan Tailoring', 'Burgundy Velvet', 'Rubinacci']
  },
  {
    id: 'ownit-020',
    name: 'Ostrich Leather Kelly Briefcase 40',
    brand: 'Maison de Cuir Paris',
    category: 'leather-goods',
    targetAudience: 'unisex',
    ageGroup: '30-55',
    price: 29500,
    rating: 4.91,
    salesCount: 14,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 18,
    availableQuantity: 4,
    origin: 'Paris, France',
    craftsmanshipHours: 110,
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Cognac brown South African quill ostrich leather business case with palladium turnlock hardware and shoulder strap.',
    specifications: {
      Leather: 'Full Quill South African Ostrich Skin',
      Hardware: 'Palladium Plated Brass',
      Compartments: 'Dual Document Dividers & Pen Loops'
    },
    curatorNote: 'Ostrich hide gains a rich patina with age while remaining exceptionally durable.',
    tags: ['Ostrich Briefcase', 'Executive Bag', 'Paris Leather', 'Cognac']
  },
  {
    id: 'ownit-021',
    name: 'High Jewelry Diamond & Sapphire Serpent Cuff',
    brand: 'Bulgari Heritage Vault',
    category: 'fine-jewelry',
    targetAudience: 'women',
    ageGroup: '25-55',
    price: 135000,
    rating: 4.99,
    salesCount: 4,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 5,
    availableQuantity: 1,
    origin: 'Rome, Italy',
    craftsmanshipHours: 360,
    image: 'https://images.unsplash.com/photo-1611591475179-67014808357a?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1611591475179-67014808357a?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Iconic coiled serpent bracelet in 18k Rose Gold, adorned with blue Royal Sri Lankan sapphires and pavé diamonds.',
    specifications: {
      Sapphires: '14.5ct Sri Lankan Royal Blue Sapphires',
      Diamonds: '6.8ct Brilliant Cut Pavé',
      Mechanism: 'Tubogas Flexible Gold Core'
    },
    curatorNote: 'An immortal symbol of wisdom, vitality, and Roman high jewelry mastery.',
    tags: ['Serpent Bracelet', 'Sapphire & Diamond', 'Bulgari Style', 'Rome High Jewelry']
  },
  {
    id: 'ownit-022',
    name: 'Sartorial Cashmere & Mink Fur Coat',
    brand: 'Brunello Cucinelli Solomeo',
    category: 'haute-couture',
    targetAudience: 'men',
    ageGroup: '30-55',
    price: 24500,
    rating: 4.93,
    salesCount: 10,
    inStock: true,
    ownitExclusive: false,
    limitedEdition: true,
    totalQuantity: 15,
    availableQuantity: 3,
    origin: 'Solomeo, Italy',
    craftsmanshipHours: 130,
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Ultra-lightweight rib-knit cashmere parka coat lined with shaved Scandinavian mink fur and water-repellent silk outer shell.',
    specifications: {
      Outer: 'Storm System Water-Repellent Silk & Cashmere',
      Lining: '100% Shaved Sheared Mink Fur',
      Trim: 'Horn Buttons & Suede Collar Accent'
    },
    curatorNote: 'Understated quiet luxury created in the medieval Italian village of Solomeo.',
    tags: ['Quiet Luxury', 'Mink Cashmere', 'Italian Menswear', 'Solomeo']
  },
  {
    id: 'ownit-023',
    name: 'Artisan Crystal & Diamond Decanter Set',
    brand: 'Saint-Louis Crystal 1586',
    category: 'accessories',
    targetAudience: 'unisex',
    ageGroup: '25-55',
    price: 14500,
    rating: 4.92,
    salesCount: 18,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 25,
    availableQuantity: 6,
    origin: 'Saint-Louis-lès-Bitche, France',
    craftsmanshipHours: 100,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Mouth-blown double-cased mouth-cut crystal spirits decanter and 4 tumbler glasses detailed with 24k gold leaf and diamond facets.',
    specifications: {
      Material: '30% Lead Crystal Mouth-Blown',
      Decoration: 'Hand-Cut Diamond Pattern & 24k Gold Inlay',
      Inclusions: 'Wooden Presentation Case with Velvet Lining'
    },
    curatorNote: 'Hand-cut by French Master Craftsmen (Meilleurs Ouvriers de France).',
    tags: ['Crystal Decanter', '24k Gold', 'Fine Spirits', 'French Craft']
  },
  {
    id: 'ownit-024',
    name: 'Platinum Skeleton Minute Repeater',
    brand: 'Vacheron Constantin Vault',
    category: 'timepieces',
    targetAudience: 'men',
    ageGroup: '35-55',
    price: 215000,
    rating: 5.0,
    salesCount: 2,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 3,
    availableQuantity: 1,
    origin: 'Geneva, Switzerland',
    craftsmanshipHours: 650,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Chimes the hours, quarters, and minutes on tuned steel gongs upon demand. Fully visible skeleton movement with Hallmark of Geneva certification.',
    specifications: {
      Complication: 'Minute Repeater & Skeleton Display',
      Certification: 'Poinçon de Genève (Geneva Seal)',
      Case: 'Platinum 950 (39mm)'
    },
    curatorNote: 'A holy grail chiming timepiece representing the apex of acoustic horology.',
    tags: ['Minute Repeater', 'Geneva Seal', 'Platinum Watch', 'Horology Apex']
  },
  {
    id: 'ownit-025',
    name: 'Hand-Embroidered Venetian Silk Shawl',
    brand: 'Fortuny Venice',
    category: 'accessories',
    targetAudience: 'women',
    ageGroup: '25-55',
    price: 6400,
    rating: 4.9,
    salesCount: 28,
    inStock: true,
    ownitExclusive: false,
    limitedEdition: true,
    totalQuantity: 40,
    availableQuantity: 12,
    origin: 'Venice, Italy',
    craftsmanshipHours: 60,
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Pleated silk Delphos shawl dyed with natural madder root and pomegranate pigment, finished with Murano glass beads along the border.',
    specifications: {
      Material: '100% Venetian Silk Faille & Murano Glass Beads',
      Dyeing: 'Natural Plant Pigments',
      Dimensions: '220cm x 90cm'
    },
    curatorNote: 'Handmade on historic wooden printing blocks in Venice since 1906.',
    tags: ['Venetian Silk', 'Fortuny Shawl', 'Murano Glass', 'Venice Art']
  },
  {
    id: 'ownit-026',
    name: 'Bespoke Crocodile Skin Oxford Shoes',
    brand: 'Berluti Master Shoemaker',
    category: 'footwear',
    targetAudience: 'men',
    ageGroup: '30-55',
    price: 11500,
    rating: 4.96,
    salesCount: 15,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 20,
    availableQuantity: 5,
    origin: 'Paris, France',
    craftsmanshipHours: 90,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Single-cut seamless Oxford dress shoes in hand-patinated midnight blue Venetian alligator skin with signature calligraphy engraving.',
    specifications: {
      Leather: 'Alligator Leather with Scritto Engraving',
      Patina: 'Hand-Applied Tobacco & Midnight Blue Dual Tone',
      Sole: 'Hand-Stitched Blake Construction'
    },
    curatorNote: 'Each patina is an unrepeatable work of art created with essential oils in Paris.',
    tags: ['Berluti Patina', 'Alligator Oxfords', 'Paris Shoes', 'Calligraphy Leather']
  },
  {
    id: 'ownit-027',
    name: 'Rose Gold & Diamond Pavé Serpenti Ring',
    brand: 'Chopard High Joaillerie',
    category: 'fine-jewelry',
    targetAudience: 'women',
    ageGroup: '25-45',
    price: 24000,
    rating: 4.94,
    salesCount: 21,
    inStock: true,
    ownitExclusive: false,
    limitedEdition: false,
    totalQuantity: 30,
    availableQuantity: 9,
    origin: 'Geneva, Switzerland',
    craftsmanshipHours: 110,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Ethical 18k Rose Gold coiling band encrusted with 2.8 carats of mobile happy diamonds that dance freely under sapphire glass.',
    specifications: {
      Gold: '100% Fairmined Certified 18k Rose Gold',
      Diamonds: '2.8ct VVS Top Wesselton',
      Design: 'Floating Diamond Movement'
    },
    curatorNote: 'Crafted under Chopard\'s Journey to Sustainable Luxury protocol.',
    tags: ['Fairmined Gold', 'Happy Diamonds', 'Chopard', 'Geneva Jewelry']
  },
  {
    id: 'ownit-028',
    name: 'Private Jet Executive Leather Travel Set',
    brand: 'Trussardi Custom Atelier',
    category: 'leather-goods',
    targetAudience: 'unisex',
    ageGroup: '30-55',
    price: 18900,
    rating: 4.89,
    salesCount: 19,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 25,
    availableQuantity: 8,
    origin: 'Milan, Italy',
    craftsmanshipHours: 75,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Matching 4-piece travel suite including cabin trolley, garment carrier, passport wallet, and vanity kit in full-grain calfskin.',
    specifications: {
      Leather: 'Full-Grain Tuscan Calfskin in Midnight Black',
      Hardware: 'Gunmetal Anodized Aluminum Zippers',
      Wheels: 'Silent 360-Degree Japanese Hinomoto Wheels'
    },
    curatorNote: 'Equipped with integrated FingerMobile NFC authentication tag for ownership verification.',
    tags: ['Travel Suite', 'Tuscan Leather', 'Private Jet', 'Milan Luxury']
  },
  {
    id: 'ownit-029',
    name: 'Nuit de Diamond Concentré Parfum 50ml',
    brand: 'Henry Jacques Parfums',
    category: 'perfumery',
    targetAudience: 'women',
    ageGroup: '25-55',
    price: 8200,
    rating: 4.98,
    salesCount: 31,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 40,
    availableQuantity: 7,
    origin: 'Paris, France',
    craftsmanshipHours: 80,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Pure perfume oil extracted through traditional cold enfleurage of night-blooming jasmine, damask rose, and black amber.',
    specifications: {
      Formula: '100% Pure Perfume Essence (Zero Alcohol Dilution)',
      Bottle: 'Hand-Cut Crystal Crystal Flacon with Gold Dipstick',
      Volume: '50ml'
    },
    curatorNote: 'A single drop lasts over 48 hours on skin.',
    tags: ['Pure Oil Perfume', 'Cold Enfleurage', 'Henry Jacques', 'Paris Niche']
  },
  {
    id: 'ownit-030',
    name: 'Bespoke 3-Piece Vicuña Wool & Silk Suit',
    brand: 'Brioni Master Tailors',
    category: 'bespoke-suits',
    targetAudience: 'men',
    ageGroup: '35-55',
    price: 31000,
    rating: 4.99,
    salesCount: 13,
    inStock: true,
    ownitExclusive: true,
    limitedEdition: true,
    totalQuantity: 15,
    availableQuantity: 3,
    origin: 'Penne, Italy',
    craftsmanshipHours: 220,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85'
    ],
    description: 'Three-piece bespoke suit handcrafted in Penne from ultra-rare Super 220s wool, vicuña, and silk blend in midnight navy pinstripe.',
    specifications: {
      Fabric: 'Super 220s Wool, Vicuña & Silk Blend',
      Structure: 'Full Canvas Hand-Stitched Construction',
      Inclusions: 'Matching Double-Breasted Waistcoat'
    },
    curatorNote: 'Worn by heads of state and business pioneers across Geneva, London, and New York.',
    tags: ['Brioni Bespoke', 'Super 220s', 'Vicuña Suit', 'Italian Gentleman']
  }
];
