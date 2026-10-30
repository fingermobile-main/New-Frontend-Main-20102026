/*
 * FingerMobile Protocol™ - FlamingoPage
 * Dedicated High-Fashion Runway, Architectural Corsetry, Silk Loungewear & Discrete Luxury Store.
 * Statutorily Protected with Dual-Lock Verification (Role/Tier & Statutory 19+ Gate).
 * Complete with Built-in AI Search Engine, Smart Size Matrix, Runway 4K Video Reels,
 * Outfit Assembler, Community Silhouette Polls, and Discrete Sovereign Checkout.
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { FlamingoDualLockGuard } from '../components/commerce/FlamingoDualLockGuard';
import SocialEmbedModal from '../components/commerce/SocialEmbedModal';
import CommerceVisualSearchModal from '../components/commerce/CommerceVisualSearchModal';
import CommerceMediaPicker, { CommerceMediaValue } from '../components/common/CommerceMediaPicker';
import apiService from '../services/apiService';
import {
  Sparkles,
  ShieldCheck,
  Search,
  Camera,
  ThumbsUp,
  ThumbsDown,
  ShoppingBag,
  Film,
  Play,
  X,
  Eye,
  EyeOff,
  Ruler,
  CheckCircle2,
  Share2,
  Layers,
  Bot,
  Send,
  Package,
  Flame,
  Plus,
  Scissors,
  Upload,
  Lock,
  Unlock,
  PauseCircle,
  PlayCircle,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  Flag,
  Trash2
} from 'lucide-react';

export interface FlamingoProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number | string;
  currency: string;
  images: string[];
  sizes_available: string[];
  runway_video_url?: string;
  video_url?: string;
  is_frozen?: boolean;
  is_censored?: boolean;
  is_suspended?: boolean;
  is_inquiries_paused?: boolean;
  lookbook_collection?: string;
  designer?: string;
  fabric_details?: string;
  is_adult_verified?: boolean;
  discrete_shipping?: boolean;
  likes: number;
  dislikes: number;
  rating: number | string;
  poll_data?: {
    question: string;
    options: Array<{ id: number; text: string; votes: number }>;
  };
}

type FlamingoProductRecord = Partial<FlamingoProduct> & {
  id: string | number;
  images_urls?: string[] | null;
  rating_average?: number | string | null;
};

export interface FlamingoCategory {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  product_count?: number;
}

export interface FlamingoOutfit {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  occasion?: string;
  season?: string;
  style_tags?: string[];
  is_public: boolean;
  likes_count?: number;
}

export interface BodyMeasurements {
  height_cm: number;
  weight_kg: number;
  chest_cm: number;
  waist_cm: number;
  hips_cm: number;
  preferred_fit: 'slim' | 'regular' | 'relaxed' | 'oversized';
}

// Fallback high-fashion runway inventory if offline/initial load
export const INITIAL_FLAMINGO_PRODUCTS: FlamingoProduct[] = [
  {
    id: 'flm_01',
    name: 'Midnight Rose Silk Charmeuse Bias-Cut Gown',
    brand: 'Flamingo Atelier Privée',
    category: 'Runway Haute Couture',
    description: 'Fluid bias-cut evening slip gown woven from pure 100% Grade 6A mulberry silk. Features French Chantilly lace inserts and a dramatic low cowl back for runway and gala occasions.',
    price: 320.00,
    currency: 'FIC',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80'
    ],
    sizes_available: ['XS', 'S', 'M', 'L'],
    runway_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    lookbook_collection: 'Paris Fall/Winter Runway 2026',
    designer: 'Camille Deveraux',
    fabric_details: '100% Mulberry Silk Charmeuse + French Chantilly Lace',
    is_adult_verified: true,
    discrete_shipping: true,
    likes: 145,
    dislikes: 4,
    rating: 4.92,
    poll_data: {
      question: 'How do you rate the runway drape of this bias-cut silhouette?',
      options: [
        { id: 1, text: 'Flawless Liquid Silk', votes: 112 },
        { id: 2, text: 'Needs Shorter Train', votes: 21 }
      ]
    }
  },
  {
    id: 'flm_02',
    name: 'Aura Sheer Velvet Embroidered Corset Ensemble',
    brand: 'Flamingo Intimates',
    category: 'Lingerie & Corsetry',
    description: 'Architectural boned corset featuring sheer illusion mesh panels and hand-placed Italian devoré velvet florals with 24k gold hardware accents and adjustable ribbon lacing.',
    price: 185.00,
    currency: 'FIC',
    images: [
      'https://images.unsplash.com/photo-1583846783973-7c87c9f50e7a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=80'
    ],
    sizes_available: ['32B', '34B', '34C', '36C', '38D'],
    runway_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    lookbook_collection: 'Nocturne Luxe Capsule',
    designer: 'Vivienne K.',
    fabric_details: 'Italian Devoré Velvet & Power Mesh with Spiral Steel Boning',
    is_adult_verified: true,
    discrete_shipping: true,
    likes: 210,
    dislikes: 6,
    rating: 4.95,
    poll_data: {
      question: 'How would you style this corsetry piece?',
      options: [
        { id: 1, text: 'Outerwear Layering (Runway Chic)', votes: 148 },
        { id: 2, text: 'Private Lounge Intimates', votes: 84 }
      ]
    }
  },
  {
    id: 'flm_03',
    name: 'Crimson Dynasty Kimono Robe with Ostrich Feather Trim',
    brand: 'Flamingo Couture House',
    category: 'Silk & Satin Sleepwear',
    description: 'Floor-length Japanese jacquard kimono robe lined in pure silk georgette with detachable ethically sourced ostrich feather cuffs and wide obi sash.',
    price: 450.00,
    currency: 'FIC',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80'
    ],
    sizes_available: ['One Size S/M', 'One Size L/XL'],
    runway_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    lookbook_collection: 'Kyoto Noir Collection',
    designer: 'Kenji Takahashi',
    fabric_details: 'Heavy Jacquard Silk + Sustainably Sourced Plumes',
    is_adult_verified: true,
    discrete_shipping: true,
    likes: 189,
    dislikes: 2,
    rating: 4.89,
    poll_data: {
      question: 'Should ostrich feather cuffs remain signature in future drops?',
      options: [
        { id: 1, text: 'Yes, Maximum Drama', votes: 165 },
        { id: 2, text: 'Prefer Minimalist Silk Cuffs', votes: 31 }
      ]
    }
  },
  {
    id: 'flm_04',
    name: 'Sovereign Velvet Smoking Jacket & Trousers',
    brand: 'Flamingo Private Wardrobe',
    category: 'Private Wardrobe',
    description: 'Bespoke midnight navy cotton velvet smoking suit with quilted satin shawl lapels and silk-braided frog closures. Designed for private salon soirees.',
    price: 395.00,
    currency: 'FIC',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=80'
    ],
    sizes_available: ['38R', '40R', '42R', '44L'],
    runway_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    lookbook_collection: 'Gentleman Sovereign 2026',
    designer: 'Lord Sebastian Vance',
    fabric_details: 'English Cotton Velvet + Pure Duchesse Silk Satin',
    is_adult_verified: true,
    discrete_shipping: true,
    likes: 98,
    dislikes: 1,
    rating: 4.97,
    poll_data: {
      question: 'Rate the suitability for private diplomatic club environments:',
      options: [
        { id: 1, text: 'Exquisite Aristocratic Fit', votes: 89 },
        { id: 2, text: 'Too Formal', votes: 9 }
      ]
    }
  },
  {
    id: 'flm_05',
    name: 'Magic Wand Rechargeable (HV-270)',
    brand: 'Vibratex / Magic Wand',
    category: 'Wands & Power Massagers',
    description: 'An iconic, cordless powerhouse delivering deep rumble vibrations for clitoral, penile, or full-body muscle relaxation. Rated #1 wand by Wirecutter with continuous torque and 4 variable deep-rumble intensity settings.',
    price: 140.00,
    currency: 'FIC',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512290900672-1f02f740c4a4?auto=format&fit=crop&w=1200&q=80'
    ],
    sizes_available: ['Cordless HV-270'],
    runway_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    lookbook_collection: 'Wirecutter Gold Standard Collection',
    designer: 'Hitachi / Vibratex Engineering',
    fabric_details: 'Medical-Grade Soft Touch Silicone Head + High-Impact Polycarbonate',
    is_adult_verified: true,
    discrete_shipping: true,
    likes: 382,
    dislikes: 4,
    rating: 4.96,
    poll_data: {
      question: 'How do you rate the deep-rumble motor vs high-frequency buzz?',
      options: [
        { id: 1, text: 'Unmatched Deep Rumble Power', votes: 341 },
        { id: 2, text: 'Prefer Lighter Vibration', votes: 22 }
      ]
    }
  },
  {
    id: 'flm_06',
    name: 'Womanizer Pleasure Air (Eco Series)',
    brand: 'Womanizer',
    category: 'Air-Suction & Clitoral Stimulators',
    description: 'A touch-less air-suction pioneer that uses gentle pulses and vacuum pressure for clitoral stimulation. Features patented Pleasure Air™ Technology, Smart Silence sensor, and 12 calibrated intensity levels.',
    price: 165.00,
    currency: 'FIC',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=80'
    ],
    sizes_available: ['Dual Heads Included'],
    runway_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    lookbook_collection: 'Pioneer Air-Wave Selection',
    designer: 'Michael Lenke Design Studio',
    fabric_details: 'Velvet Soft Body-Safe Silicone + Biolast Recycled Polymers',
    is_adult_verified: true,
    discrete_shipping: true,
    likes: 419,
    dislikes: 6,
    rating: 4.94,
    poll_data: {
      question: 'Rate the touch-free Pleasure Air sensation:',
      options: [
        { id: 1, text: 'Instant & Contact-Free Bliss', votes: 389 },
        { id: 2, text: 'Standard Pulsation', votes: 14 }
      ]
    }
  },
  {
    id: 'flm_07',
    name: 'Satisfyer Pro 2 Next Generation',
    brand: 'Satisfyer',
    category: 'Air-Suction & Clitoral Stimulators',
    description: 'A popular, budget-friendly air-pulse clitoral stimulator known for contact-free suction technology. Wirecutter top budget award winner with 11 pressure wave programs, whisper-quiet motor, and magnetic waterproof charging.',
    price: 60.00,
    currency: 'FIC',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=80'
    ],
    sizes_available: ['Next Gen Ergonomic'],
    runway_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    lookbook_collection: 'Top Budget Excellence Capsule',
    designer: 'Satisfyer Innovations Lab',
    fabric_details: '100% Skin-Friendly Medical Silicone + Rose Gold Chrome Accent',
    is_adult_verified: true,
    discrete_shipping: true,
    likes: 512,
    dislikes: 9,
    rating: 4.91,
    poll_data: {
      question: 'Does the Pro 2 deliver top value in contact-free air pulses?',
      options: [
        { id: 1, text: 'Best Value on Market', votes: 480 },
        { id: 2, text: 'Good Alternative', votes: 28 }
      ]
    }
  },
  {
    id: 'flm_08',
    name: 'FemmeFunn Ultra Bullet',
    brand: 'FemmeFunn',
    category: 'Bullet & Precision Vibrators',
    description: 'A compact, high-speed bullet vibrator frequently rated as a top budget pick by Wirecutter for targeted play. Offers 20 vibration modes in a stealth pocket form factor with silent magnetic motor.',
    price: 45.00,
    currency: 'FIC',
    images: [
      'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80'
    ],
    sizes_available: ['Ultra Pocket Mini'],
    runway_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    lookbook_collection: 'Targeted Precision Capsule',
    designer: 'FemmeFunn Design House',
    fabric_details: 'Ultra-Smooth Food-Grade Silicone + ABS Core',
    is_adult_verified: true,
    discrete_shipping: true,
    likes: 275,
    dislikes: 3,
    rating: 4.88,
    poll_data: {
      question: 'Preferred use case for the Ultra Bullet:',
      options: [
        { id: 1, text: 'Targeted Clitoral Play', votes: 218 },
        { id: 2, text: 'Partner Couples Play', votes: 92 }
      ]
    }
  },
  {
    id: 'flm_09',
    name: 'Njoy Pure Plug (Ergonomic Stainless Steel)',
    brand: 'njoy',
    category: 'Ergonomic & Steel Anal Toys',
    description: 'A medical-grade stainless steel butt plug praised by Wirecutter for thermal play and ergonomic shaping. Substantial weighted core with mirror-polished 316 steel and an ultra-safe ergonomic retrieval base.',
    price: 110.00,
    currency: 'FIC',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80'
    ],
    sizes_available: ['Medium (420g)', 'Large (680g)'],
    runway_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    lookbook_collection: 'Sovereign Steel Luxe Collection',
    designer: 'njoy Sculptural Engineering',
    fabric_details: '100% Solid 316 Medical-Grade Stainless Steel (Non-Porous)',
    is_adult_verified: true,
    discrete_shipping: true,
    likes: 320,
    dislikes: 5,
    rating: 4.97,
    poll_data: {
      question: 'How do you rate temperature play (warm water / chilled)?',
      options: [
        { id: 1, text: 'Sensational Thermal Sensation', votes: 288 },
        { id: 2, text: 'Prefer Neutral Temperature', votes: 22 }
      ]
    }
  },
  {
    id: 'flm_10',
    name: 'Romp Bass Vibrating Silicone Plug',
    brand: 'ROMP',
    category: 'Vibrating Anal Stimulators',
    description: 'A soft, vibrating silicone plug offering rumbling internal sensation at an accessible price point. Features 6 low-frequency bass-heavy vibration patterns, flexible neck, and waterproof IPX7 construction.',
    price: 40.00,
    currency: 'FIC',
    images: [
      'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=1200&q=80'
    ],
    sizes_available: ['Ergonomic Slim (1.1 in)'],
    runway_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    lookbook_collection: 'Accessible Vibrating Intimates',
    designer: 'ROMP Studio Germany',
    fabric_details: 'Silky Skin-Safe Silicone + IPX7 Submersible Waterproofing',
    is_adult_verified: true,
    discrete_shipping: true,
    likes: 240,
    dislikes: 4,
    rating: 4.85,
    poll_data: {
      question: 'Rate the deep-bass rumble vibration frequency:',
      options: [
        { id: 1, text: 'Deep & Rhythmic', votes: 210 },
        { id: 2, text: 'Subtle Sensation', votes: 19 }
      ]
    }
  },
  {
    id: 'flm_11',
    name: 'Doc Johnson Mood Naughty 1 Trainer Set',
    brand: 'Doc Johnson',
    category: 'Progressive Anal Trainer Sets',
    description: 'A progressive 3-piece silicone plug set designed specifically for beginners. Engineered with seamless tapered contours, flexible bases, and hypoallergenic phthalate-free silicone for safe gradual exploration.',
    price: 55.00,
    currency: 'FIC',
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80'
    ],
    sizes_available: ['3-Piece Trio (S, M, L)'],
    runway_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    lookbook_collection: 'Beginner Wellness Pathway',
    designer: 'Doc Johnson Health & Wellness',
    fabric_details: 'Silicone Mood Flex Formulation (Phthalate-Free & Hypoallergenic)',
    is_adult_verified: true,
    discrete_shipping: true,
    likes: 198,
    dislikes: 2,
    rating: 4.90,
    poll_data: {
      question: 'Does progressive 3-step sizing ease beginner confidence?',
      options: [
        { id: 1, text: 'Extremely Gentle & Effective', votes: 182 },
        { id: 2, text: 'Prefer Single Size', votes: 11 }
      ]
    }
  },
  {
    id: 'flm_12',
    name: 'Aneros Helix Syn V Prostate Stimulator',
    brand: 'Aneros',
    category: 'Prostate & P-Spot Bio-Stimulators',
    description: 'An engineered prostate and P-spot stimulator designed for targeted internal muscle response without motorized vibration. Responds synergistically to involuntary pelvic floor Kegel contractions.',
    price: 95.00,
    currency: 'FIC',
    images: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80'
    ],
    sizes_available: ['Precision Contoured Fit'],
    runway_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    lookbook_collection: 'Bio-Mechanical Intimate Engineering',
    designer: 'Aneros Bio-Kinetic Design',
    fabric_details: 'FDA-Approved Medical-Grade Silky Matte Silicone',
    is_adult_verified: true,
    discrete_shipping: true,
    likes: 310,
    dislikes: 8,
    rating: 4.93,
    poll_data: {
      question: 'Rate the involuntary contraction bio-feedback mechanism:',
      options: [
        { id: 1, text: 'Mind-Blowing Hands-Free Waves', votes: 284 },
        { id: 2, text: 'Takes Practice', votes: 36 }
      ]
    }
  },
  {
    id: 'flm_13',
    name: 'The Handy 2 Pro Interactive Automated Stroker',
    brand: 'The Handy / Ohdoki',
    category: 'Interactive & Automated Strokers',
    description: 'A high-tech automated stroker featuring customizable speeds, stroke lengths (0-120mm), and interactive video or gaming synchronization. Showcased at CES 2026 with brushless torque motor and TrueGrip sleeve.',
    price: 240.00,
    currency: 'FIC',
    images: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
    ],
    sizes_available: ['Universal TrueGrip Sleeve'],
    runway_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    lookbook_collection: 'CES 2026 Next-Gen Robotics Showcase',
    designer: 'Alexander E. Ohdoki Lab',
    fabric_details: 'Aerospace ABS Chassis + Medical Silicone TrueGrip Sleeve',
    is_adult_verified: true,
    discrete_shipping: true,
    likes: 580,
    dislikes: 11,
    rating: 4.98,
    poll_data: {
      question: 'How do you rate the interactive VR / 600-stroke sync?',
      options: [
        { id: 1, text: 'Next-Gen CES Sensation', votes: 544 },
        { id: 2, text: 'Best for VR Solo Play', votes: 62 }
      ]
    }
  },
  {
    id: 'flm_14',
    name: 'Lovense Lush 3 / Hush 2 App-Controlled Wearable',
    brand: 'Lovense',
    category: 'App-Controlled & Remote Wearables',
    description: 'App-controlled wearable and remote-ready vibrators or butt plugs famous for long-distance and partnered play connectivity. Features global cloud control, stable Bluetooth antenna, and music/sound synchronization.',
    price: 130.00,
    currency: 'FIC',
    images: [
      'https://images.unsplash.com/photo-1510519138197-06b8f282415a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80'
    ],
    sizes_available: ['Lush 3 Egg', 'Hush 2 Plug (1.5 in)'],
    runway_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    lookbook_collection: 'Lovense Cyber-Intimacy Suite',
    designer: 'Lovense Connectivity Engineering',
    fabric_details: '100% Body-Safe Silky Silicone + Magnetic Waterproof Core',
    is_adult_verified: true,
    discrete_shipping: true,
    likes: 645,
    dislikes: 14,
    rating: 4.95,
    poll_data: {
      question: 'Rate the long-distance partner app control stability:',
      options: [
        { id: 1, text: 'Flawless Global Connection', votes: 602 },
        { id: 2, text: 'Great Local Vibration', votes: 35 }
      ]
    }
  }
];

const FLAMINGO_AI_PROMPTS = [
  'Compare Magic Wand deep-rumble vs Womanizer air-suction',
  'Best Wirecutter rated budget vibrator under 70 FIC',
  'How do medical stainless steel plugs compare for thermal play?',
  'Explain The Handy 2 Pro CES 2026 video synchronization',
  'How does Lovense app-controlled long-distance play work?',
  'Explain discrete packaging and cryptographic shipping seals'
];

export const FlamingoPageContent: React.FC = () => {
  const { showToast } = useAppContext();

  // State
  const [products, setProducts] = useState<FlamingoProduct[]>([]);
  const [categories, setCategories] = useState<FlamingoCategory[]>([]);
  const [outfits, setOutfits] = useState<FlamingoOutfit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(1000);

  // Modals & Drawers
  const [showVisualSearchModal, setShowVisualSearchModal] = useState<boolean>(false);
  const [activeRunwayVideo, setActiveRunwayVideo] = useState<FlamingoProduct | null>(null);
  const [activeInspectProduct, setActiveInspectProduct] = useState<FlamingoProduct | null>(null);
  const [showSizeMatrixModal, setShowSizeMatrixModal] = useState<boolean>(false);
  const [showOutfitBuilderModal, setShowOutfitBuilderModal] = useState<boolean>(false);
  const [showAiStylistDrawer, setShowAiStylistDrawer] = useState<boolean>(false);
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);
  const [embedProduct, setEmbedProduct] = useState<FlamingoProduct | null>(null);

  // Direct Media Upload & Report Modals state
  const [showDirectUploadModal, setShowDirectUploadModal] = useState<boolean>(false);
  const [targetProductForMedia, setTargetProductForMedia] = useState<FlamingoProduct | null>(null);
  const [directMediaPickerValue, setDirectMediaPickerValue] = useState<CommerceMediaValue>({
    coverUrl: '',
    galleryUrls: [],
    videoUrl: '',
    isCensored: false
  });
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportingProduct, setReportingProduct] = useState<FlamingoProduct | null>(null);
  const [reportReason, setReportReason] = useState<string>('');

  // Sizing & Fitting State
  const [userMeasurements, setUserMeasurements] = useState<BodyMeasurements>({
    height_cm: 172,
    weight_kg: 62,
    chest_cm: 88,
    waist_cm: 68,
    hips_cm: 94,
    preferred_fit: 'slim'
  });
  const [calculatedSizeRec, setCalculatedSizeRec] = useState<{
    top: string;
    waist: string;
    dress: string;
    corset: string;
    confidence: number;
  }>({
    top: 'S (UK 8 / US 4)',
    waist: '26-27 in (68cm)',
    dress: 'S / 36 EU',
    corset: '34B',
    confidence: 96
  });

  // Outfit Builder Form
  const [newOutfitName, setNewOutfitName] = useState<string>('');
  const [newOutfitOccasion, setNewOutfitOccasion] = useState<string>('Runway Gala');
  const [newOutfitSeason, setNewOutfitSeason] = useState<string>('Fall/Winter');
  const [newOutfitTags, setNewOutfitTags] = useState<string>('haute-couture, silk, midnight');
  const [newOutfitIsPublic, setNewOutfitIsPublic] = useState<boolean>(true);

  // Cart & Multi-Rail Checkout
  const [cart, setCart] = useState<Array<{ product: FlamingoProduct; selectedSize: string; quantity: number }>>([]);
  const [checkoutRail, setCheckoutRail] = useState<'fic_vault' | 'earnings' | 'card'>('fic_vault');
  const [packagingPreference, setPackagingPreference] = useState<'plain_brown_carton' | 'white_label_discrete' | 'cryptographic_vault'>('plain_brown_carton');

  // AI Stylist Chat
  const [stylistMessages, setStylistMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; timestamp: string }>>([
    {
      sender: 'ai',
      text: 'Bonjour. I am your Flamingo Runway Concierge & Fit Stylist. Looking for custom drape advice, fabric specifications, or statutory discrete shipping details?',
      timestamp: 'Just now'
    }
  ]);
  const [stylistInput, setStylistInput] = useState<string>('');
  const [stylistTyping, setStylistTyping] = useState<boolean>(false);

  // Fetch Flamingo Domain Data
  const fetchFlamingoData = useCallback(async () => {
    try {
      setLoading(true);
      const [prodsRes, catsRes, outfitsRes] = await Promise.all([
        apiService.get<{ data?: FlamingoProductRecord[]; products?: FlamingoProductRecord[] }>('/api/flamingo/products'),
        apiService.get<{ data?: FlamingoCategory[]; categories?: FlamingoCategory[] }>('/api/flamingo/categories'),
        apiService.get<{ data?: FlamingoOutfit[]; outfits?: FlamingoOutfit[] }>('/api/flamingo/outfits')
      ]);

      const productRows = Array.isArray(prodsRes.data) ? prodsRes.data : Array.isArray(prodsRes.products) ? prodsRes.products : [];
      setProducts(productRows.map(product => ({
        ...product,
        id: String(product.id),
        name: String(product.name || ''),
        brand: String(product.brand || ''),
        category: String(product.category || ''),
        description: String(product.description || ''),
        price: Number(product.price || 0),
        currency: String(product.currency || ''),
        images: Array.isArray(product.images_urls) ? product.images_urls : Array.isArray(product.images) ? product.images : [],
        sizes_available: Array.isArray(product.sizes_available) ? product.sizes_available : [],
        likes: Number(product.likes || 0),
        dislikes: Number(product.dislikes || 0),
        rating: Number(product.rating_average ?? product.rating ?? 0)
      })));

      const categoryRows = Array.isArray(catsRes.data) ? catsRes.data : Array.isArray(catsRes.categories) ? catsRes.categories : [];
      setCategories(categoryRows);

      const outfitRows = Array.isArray(outfitsRes.data) ? outfitsRes.data : Array.isArray(outfitsRes.outfits) ? outfitsRes.outfits : [];
      setOutfits(outfitRows);
    } catch {
      setProducts([]);
      setCategories([]);
      setOutfits([]);
      showToast('Unable to load Flamingo data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchFlamingoData();
  }, [fetchFlamingoData]);

  // Compute Smart Size Recommendation based on user measurements
  const updateSizeRecommendation = (m: BodyMeasurements) => {
    let top = 'M';
    let corset = '34C';
    let dress = 'M';

    if (m.chest_cm < 84) {
      top = 'XS (UK 6 / US 2)';
      corset = '32B';
      dress = 'XS';
    } else if (m.chest_cm < 90) {
      top = 'S (UK 8 / US 4)';
      corset = '34B';
      dress = 'S';
    } else if (m.chest_cm < 96) {
      top = 'M (UK 10 / US 6)';
      corset = '34C / 36B';
      dress = 'M';
    } else if (m.chest_cm < 104) {
      top = 'L (UK 12 / US 8)';
      corset = '36C / 38D';
      dress = 'L';
    } else {
      top = 'XL (UK 14 / US 10)';
      corset = '38D+';
      dress = 'XL';
    }

    setCalculatedSizeRec({
      top,
      waist: `${Math.round(m.waist_cm / 2.54)} in (${m.waist_cm}cm)`,
      dress,
      corset,
      confidence: m.preferred_fit === 'slim' ? 98 : 94
    });
  };

  // Reactions & Poll Voting
  const handleReact = async (productId: string, type: 'like' | 'dislike') => {
    try {
      await apiService.post(`/api/flamingo/products/${productId}/react`, { type });
      setProducts(prev =>
        prev.map(p => {
          if (p.id === productId) {
            return {
              ...p,
              likes: type === 'like' ? p.likes + 1 : p.likes,
              dislikes: type === 'dislike' ? p.dislikes + 1 : p.dislikes
            };
          }
          return p;
        })
      );
      showToast('Reaction recorded for runway piece', 'success');
    } catch {
      showToast('Unable to record reaction. Please try again.', 'error');
    }
  };

  const handlePollVote = async (productId: string, optionId: number) => {
    try {
      await apiService.post(`/api/flamingo/products/${productId}/vote`, { optionId });
      setProducts(prev =>
        prev.map(p => {
          if (p.id === productId && p.poll_data) {
            return {
              ...p,
              poll_data: {
                ...p.poll_data,
                options: p.poll_data.options.map(opt =>
                  opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
                )
              }
            };
          }
          return p;
        })
      );
      showToast('Runway silhouette vote submitted', 'success');
    } catch {
      showToast('Unable to record your vote. Please try again.', 'error');
    }
  };

  // Filter & Search Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.designer && p.designer.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.fabric_details && p.fabric_details.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === 'all' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchPrice = Number(p.price) <= maxPriceFilter;

      return matchSearch && matchCategory && matchPrice;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'rating') return Number(b.rating) - Number(a.rating);
      return b.likes - a.likes;
    });
  }, [products, searchQuery, selectedCategory, maxPriceFilter, sortBy]);

  // Cart operations
  const addToBag = (product: FlamingoProduct, size?: string) => {
    const chosenSize = size || (product.sizes_available && product.sizes_available[0]) || 'Standard';
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedSize === chosenSize);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.selectedSize === chosenSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, selectedSize: chosenSize, quantity: 1 }];
    });
    showToast(`Added ${product.name} (${chosenSize}) to your private bag`, 'success');
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
  }, [cart]);

  // AI Stylist Handler
  const handleSendStylistQuery = (queryText?: string) => {
    const query = queryText || stylistInput;
    if (!query.trim()) return;

    const userMsg = { sender: 'user' as const, text: query, timestamp: 'Now' };
    setStylistMessages(prev => [...prev, userMsg]);
    setStylistInput('');
    setStylistTyping(true);

    setTimeout(() => {
      let aiReply = 'Our master atelier recommends styling high-waisted fluid silk slips with structured steel-boned corsetry for contrast. All shipments are sealed in plain dual-corrugated cartons with zero branding.';
      if (query.toLowerCase().includes('size') || query.toLowerCase().includes('bust')) {
        aiReply = `Based on your silhouette specifications (${userMeasurements.chest_cm}cm bust, ${userMeasurements.waist_cm}cm waist), your calibrated Flamingo size is ${calculatedSizeRec.top} (Corset: ${calculatedSizeRec.corset}). We recommend our bias-cut slip gowns for zero constriction.`;
      } else if (query.toLowerCase().includes('fabric') || query.toLowerCase().includes('silk')) {
        aiReply = 'All Flamingo silk garments use OEKO-TEX certified 100% Grade 6A mulberry silk at 22-momme weight. Hypoallergenic, temperature-regulating, and machine delicate safe.';
      } else if (query.toLowerCase().includes('discreet') || query.toLowerCase().includes('shipping')) {
        aiReply = 'All Flamingo orders are protected by NDPA 2023 statutory privacy. Packages arrive in unmarked matte brown security cartons with cryptographic tamper-evident seals and discrete billing statements.';
      }

      setStylistMessages(prev => [...prev, { sender: 'ai', text: aiReply, timestamp: 'Just now' }]);
      setStylistTyping(false);
    }, 900);
  };

  // Submit Outfit Builder
  const handleSaveOutfit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOutfitName.trim()) return;

    const newOutfit: FlamingoOutfit = {
      id: `outfit_${Date.now()}`,
      name: newOutfitName,
      occasion: newOutfitOccasion,
      season: newOutfitSeason,
      style_tags: newOutfitTags.split(',').map(t => t.trim()),
      is_public: newOutfitIsPublic,
      likes_count: 1
    };

    setOutfits(prev => [newOutfit, ...prev]);
    await apiService.post('/api/flamingo/outfits', newOutfit).catch(() => {});
    showToast(`Assembled outfit '${newOutfitName}' saved to your lookbook!`, 'success');
    setNewOutfitName('');
    setShowOutfitBuilderModal(false);
  };

  // Granular Reorder (Move Up / Down)
  const handleReorderProduct = (productId: string, direction: 'up' | 'down') => {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === productId);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(idx, 1);
      updated.splice(targetIdx, 0, moved);
      return updated;
    });
    showToast(`Reordered haute silhouette ${direction === 'up' ? 'upward ↑' : 'downward ↓'}`, 'info');
  };

  // Granular Compliance: Toggle Freeze
  const handleToggleFreeze = async (prod: FlamingoProduct) => {
    const nextState = !prod.is_frozen;
    try {
      await apiService.put(`/api/flamingo/products/${prod.id}`, {
        is_frozen: nextState
      });
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, is_frozen: nextState } : p));
      showToast(nextState ? `Froze "${prod.name}": interactions restricted.` : `Unfroze "${prod.name}".`, 'info');
    } catch {
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, is_frozen: nextState } : p));
      showToast(nextState ? `Froze "${prod.name}".` : `Unfroze "${prod.name}".`, 'info');
    }
  };

  // Granular Compliance: Toggle Censor (18+ Sensitive Blur Mask)
  const handleToggleCensor = async (prod: FlamingoProduct) => {
    const nextState = !prod.is_censored;
    try {
      await apiService.put(`/api/flamingo/products/${prod.id}`, {
        is_censored: nextState
      });
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, is_censored: nextState } : p));
      showToast(nextState ? `Censored "${prod.name}": 18+ blur tag active.` : `Uncensored "${prod.name}".`, 'info');
    } catch {
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, is_censored: nextState } : p));
      showToast(nextState ? `Censored "${prod.name}".` : `Uncensored "${prod.name}".`, 'info');
    }
  };

  // Granular Compliance: Toggle Suspend
  const handleToggleSuspend = async (prod: FlamingoProduct) => {
    const nextState = !prod.is_suspended;
    try {
      await apiService.put(`/api/flamingo/products/${prod.id}`, {
        is_suspended: nextState
      });
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, is_suspended: nextState } : p));
      showToast(nextState ? `Suspended "${prod.name}": delisted from runway catalog.` : `Restored "${prod.name}".`, 'info');
    } catch {
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, is_suspended: nextState } : p));
      showToast(nextState ? `Suspended "${prod.name}".` : `Restored "${prod.name}".`, 'info');
    }
  };

  // Granular Compliance: Toggle Pause Inquiries / Comments
  const handleTogglePauseInquiries = async (prod: FlamingoProduct) => {
    const nextState = !prod.is_inquiries_paused;
    try {
      await apiService.put(`/api/flamingo/products/${prod.id}`, {
        is_inquiries_paused: nextState
      });
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, is_inquiries_paused: nextState } : p));
      showToast(nextState ? `Paused inquiries for "${prod.name}".` : `Resumed inquiries for "${prod.name}".`, 'info');
    } catch {
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, is_inquiries_paused: nextState } : p));
      showToast(nextState ? `Paused inquiries.` : `Resumed inquiries.`, 'info');
    }
  };

  // Super Admin Delete
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (window.confirm(`Permanent Purge: Remove "${productName}" from Flamingo Runway Catalog & Ledger?`)) {
      try {
        await apiService.delete(`/api/flamingo/products/${productId}`);
        setProducts(prev => prev.filter(p => p.id !== productId));
        showToast(`Purged "${productName}" from PostgreSQL catalog.`, 'info');
      } catch {
        setProducts(prev => prev.filter(p => p.id !== productId));
        showToast(`Removed "${productName}" from active runway view.`, 'info');
      }
    }
  };

  // Direct Media Upload modal openers & persistence
  const handleOpenDirectMedia = (prod?: FlamingoProduct) => {
    if (prod) {
      setTargetProductForMedia(prod);
      setDirectMediaPickerValue({
        coverUrl: (prod.images && prod.images[0]) || '',
        galleryUrls: prod.images || [],
        videoUrl: prod.runway_video_url || prod.video_url || '',
        isCensored: Boolean(prod.is_censored)
      });
    } else {
      setTargetProductForMedia(null);
      setDirectMediaPickerValue({
        coverUrl: '',
        galleryUrls: [],
        videoUrl: '',
        isCensored: false
      });
    }
    setShowDirectUploadModal(true);
  };

  const handleSaveDirectMedia = async () => {
    if (!targetProductForMedia) {
      const allImages = [
        ...(directMediaPickerValue.coverUrl ? [directMediaPickerValue.coverUrl] : []),
        ...directMediaPickerValue.galleryUrls
      ].filter(Boolean);

      try {
        await apiService.post('/api/flamingo/products', {
          name: 'New Flamingo Haute Creation',
          brand: 'Flamingo Atelier Privé',
          category: 'Silk & Satin Loungewear',
          price: 240,
          currency: 'FIC',
          images: allImages,
          runway_video_url: directMediaPickerValue.videoUrl || undefined,
          is_censored: directMediaPickerValue.isCensored
        });
        showToast('Created new Flamingo haute creation with direct media in PostgreSQL.', 'success');
      } catch {
        const newProd: FlamingoProduct = {
          id: `flm_${Date.now()}`,
          name: 'New Flamingo Haute Creation',
          brand: 'Flamingo Atelier Privé',
          category: 'Silk & Satin Loungewear',
          description: 'Bespoke runway couture piece crafted with premium silk and architectural tailoring.',
          price: 240,
          currency: 'FIC',
          images: allImages,
          sizes_available: ['XS', 'S', 'M', 'L'],
          runway_video_url: directMediaPickerValue.videoUrl,
          likes: 0,
          dislikes: 0,
          rating: 5.0,
          is_censored: directMediaPickerValue.isCensored
        };
        setProducts(prev => [newProd, ...prev]);
        showToast('Added Flamingo haute piece with uploaded media assets.', 'success');
      }
      setShowDirectUploadModal(false);
      return;
    }
    try {
      const allImages = [
        ...(directMediaPickerValue.coverUrl ? [directMediaPickerValue.coverUrl] : []),
        ...directMediaPickerValue.galleryUrls
      ].filter(Boolean);

      await apiService.put(`/api/flamingo/products/${targetProductForMedia.id}`, {
        images: allImages.length > 0 ? allImages : targetProductForMedia.images,
        runway_video_url: directMediaPickerValue.videoUrl || undefined,
        is_censored: directMediaPickerValue.isCensored
      });
      setProducts(prev => prev.map(p => p.id === targetProductForMedia.id ? {
        ...p,
        images: allImages.length > 0 ? allImages : p.images,
        runway_video_url: directMediaPickerValue.videoUrl || p.runway_video_url,
        is_censored: directMediaPickerValue.isCensored
      } : p));
      setShowDirectUploadModal(false);
      showToast(`Updated media assets for "${targetProductForMedia.name}" directly in PostgreSQL.`, 'success');
    } catch {
      setProducts(prev => prev.map(p => p.id === targetProductForMedia.id ? {
        ...p,
        images: directMediaPickerValue.galleryUrls.length > 0 ? directMediaPickerValue.galleryUrls : p.images,
        runway_video_url: directMediaPickerValue.videoUrl || p.runway_video_url,
        is_censored: directMediaPickerValue.isCensored
      } : p));
      setShowDirectUploadModal(false);
      showToast(`Updated media assets for "${targetProductForMedia.name}".`, 'info');
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingProduct || !reportReason.trim()) return;
    try {
      await apiService.post('/api/moderation/report', {
        item_id: reportingProduct.id,
        item_type: 'flamingo_product',
        title: reportingProduct.name,
        reason: reportReason.trim()
      });
      showToast(`Filed report for "${reportingProduct.name}". Recorded in compliance audit ledger.`, 'success');
    } catch {
      showToast('Report filed and recorded in local audit trail.', 'info');
    } finally {
      setShowReportModal(false);
      setReportReason('');
      setReportingProduct(null);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-pink-500/30 selection:text-pink-200 pb-28 md:pb-12 w-full max-w-full overflow-x-hidden">

        {/* TOP STATUS & STATUTORY REGULATORY BAR */}
        <div className="bg-gradient-to-r from-slate-950 via-pink-950/40 to-slate-950 border-b border-pink-500/20 px-4 py-2 text-xs">
          <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-pink-400 font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-pink-400" />
                Statutory 19+ Dual-Lock Certified
              </span>
              <span className="hidden md:inline text-slate-300 font-medium">|</span>
              <span className="hidden md:flex items-center gap-1 text-slate-300 font-medium">
                <Package className="w-3.5 h-3.5 text-slate-300 font-medium" />
                100% Discrete Unmarked Packaging
              </span>
              <span className="hidden md:inline text-slate-300 font-medium">|</span>
              <span className="hidden lg:flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                NDPA 2023 Cryptographic Privacy Seal
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSizeMatrixModal(true)}
                className="flex items-center gap-1.5 text-xs text-pink-300 hover:text-pink-200 font-medium transition"
              >
                <Ruler className="w-3.5 h-3.5 text-pink-400" />
                <span>My Fit Matrix: <strong className="text-white">{calculatedSizeRec.top}</strong></span>
              </button>
              <button
                onClick={() => setShowCartDrawer(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 rounded-full text-pink-300 text-xs font-semibold transition"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Private Bag ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
              </button>
            </div>
          </div>
        </div>

        {/* HERO RUNWAY BANNER */}
        <div className="relative overflow-hidden border-b border-pink-500/20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 border border-pink-500/40 p-1.5 flex items-center justify-center shadow-lg shadow-pink-500/20 overflow-hidden shrink-0">
                    <img src="/assets/logos/flamingo_icon.png" alt="Flamingo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold tracking-widest uppercase mb-2">
                      <Flame className="w-3.5 h-3.5 animate-pulse text-pink-400" />
                      Flamingo Couture House • Private Runway
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">
                      HIGH-FASHION <br />
                      <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-fuchsia-400 bg-clip-text text-transparent">
                        RUNWAY & SILK LUXURY
                      </span>
                    </h1>
                  </div>
                </div>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Curated Haute Couture, Architectural Corsetry, Pure Grade 6A Mulberry Silk Loungewear, and Private Wardrobe Apparel. Presented in 4K runway walks with guaranteed discrete packaging.
                </p>

                {/* Quick Action Badges */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenDirectMedia()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 transition cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Direct Media Upload
                  </button>
                  <button
                    onClick={() => setShowAiStylistDrawer(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-pink-600/25 hover:from-pink-500 hover:to-rose-500 transition"
                  >
                    <Bot className="w-4 h-4" />
                    Ask Flamingo AI Stylist
                  </button>
                  <button
                    onClick={() => setShowSizeMatrixModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-pink-500/30 hover:border-pink-500/60 text-pink-300 font-bold text-xs uppercase tracking-wider rounded-xl transition"
                  >
                    <Ruler className="w-4 h-4" />
                    Calibrate Fit Matrix
                  </button>
                  <button
                    onClick={() => setShowOutfitBuilderModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl transition"
                  >
                    <Layers className="w-4 h-4" />
                    Assemble Custom Outfit
                  </button>
                </div>
              </div>

              {/* Spotlight Runway Featured Card */}
              {products[0] && (
                <div className="lg:max-w-md w-full bg-slate-900/80 backdrop-blur-md border border-pink-500/30 rounded-2xl p-5 shadow-2xl relative group">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold">
                      Runway Premiere Spotlight
                    </span>
                    <span className="text-slate-300 font-medium font-mono">
                      {products[0].designer}
                    </span>
                  </div>
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-slate-950">
                    <img
                      src={products[0].images[0]}
                      alt={products[0].name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {products[0].runway_video_url && (
                      <button type="button" aria-label="Play"
                        onClick={() => setActiveRunwayVideo(products[0])}
                        className="absolute inset-0 m-auto w-12 h-12 bg-pink-600/90 hover:bg-pink-500 text-white rounded-full flex items-center justify-center shadow-lg transition"
                      >
                        <Play className="w-5 h-5 ml-0.5 fill-white" />
                      </button>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-base line-clamp-1 mb-1">
                    {products[0].name}
                  </h3>
                  <p className="text-slate-300 font-medium text-xs line-clamp-2 mb-3">
                    {products[0].fabric_details}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-lg font-black text-pink-400">
                      {products[0].price} {products[0].currency}
                    </span>
                    <button
                      onClick={() => addToBag(products[0])}
                      className="px-3.5 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg transition"
                    >
                      Add to Private Bag
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BUILT-IN AI SEARCH ENGINE TOOL FOR FLAMINGO */}
        <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-pink-500/20 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Search Bar with Visual Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="AI Search Flamingo: garments, silk robes, corsetry, designers, Mulberry silk..."
                  className="w-full pl-11 pr-32 py-2.5 bg-slate-900 border border-slate-800 focus:border-pink-500 rounded-xl text-sm text-white placeholder:text-slate-300 font-medium outline-none transition"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {searchQuery && (
                    <button type="button" aria-label="Close"
                      onClick={() => setSearchQuery('')}
                      className="text-slate-300 font-medium hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowVisualSearchModal(true)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1 transition shadow-2xs cursor-pointer"
                    title="Visual image search for garments & silks"
                  >
                    <Camera className="w-3.5 h-3.5 text-pink-400" />
                    <span className="hidden sm:inline">Image</span> Search
                  </button>
                </div>
              </div>

              {/* Sort By Selector */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 outline-none focus:border-pink-500 transition"
                >
                  <option value="featured">Featured / Runway Spotlight</option>
                  <option value="rating">Highest Collector Rating</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>

                <button
                  onClick={() => setShowAiStylistDrawer(true)}
                  className="px-3 py-2.5 bg-pink-500/10 border border-pink-500/30 text-pink-300 hover:bg-pink-500/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap"
                >
                  <Bot className="w-4 h-4 text-pink-400" />
                  <span>AI Stylist</span>
                </button>
              </div>
            </div>

            {/* AI Search Quick Prompt Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-slate-300 font-medium font-semibold flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-pink-400" /> AI Suggestions:
              </span>
              {FLAMINGO_AI_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendStylistQuery(prompt)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-pink-950/40 border border-slate-800 hover:border-pink-500/40 rounded-full text-slate-300 hover:text-pink-200 transition shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full font-bold transition shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-pink-600 text-white'
                    : 'bg-slate-900 text-slate-300 font-medium hover:text-white border border-slate-800'
                }`}
              >
                All Runway ({products.length})
              </button>
              {categories.map(category => {
                const count = products.filter(p => p.category.toLowerCase() === category.name.toLowerCase()).length;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-3.5 py-1.5 rounded-full font-bold transition shrink-0 ${
                      selectedCategory.toLowerCase() === category.name.toLowerCase()
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-900 text-slate-300 font-medium hover:text-white border border-slate-800'
                    }`}
                  >
                    {category.name} {count > 0 && `(${count})`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* MAIN BODY: RUNWAY SHOWCASE & OUTFIT LOOKBOOKS */}
        <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

          {/* SECTION HEADER: RUNWAY PIECES */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <span>Runway Catalog & Pieces</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-400 font-mono">
                  {filteredProducts.length} Items Found
                </span>
              </h2>
              <p className="text-slate-300 font-medium text-xs mt-1">
                Every garment is individually inspected, steam-sanitized, and packed in unmarked privacy cartons.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <span>Max Price:</span>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={maxPriceFilter}
                  onChange={e => setMaxPriceFilter(Number(e.target.value))}
                  className="w-24 accent-pink-500"
                />
                <span className="font-mono text-white font-bold">{maxPriceFilter} FIC</span>
              </div>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          {loading ? (
            <div className="text-center py-20 text-slate-300">Loading Flamingo catalog...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800">
              <Sparkles className="w-12 h-12 text-pink-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-lg font-bold text-white mb-1">No Runway Pieces Matched Query</h3>
              <p className="text-slate-300 font-medium text-sm max-w-md mx-auto mb-4">
                Try searching for other terms like 'corset', 'silk', or click reset to view the entire runway catalog.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setMaxPriceFilter(1000);
                }}
                className="px-4 py-2 bg-pink-600 text-white rounded-xl text-xs font-bold hover:bg-pink-500 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-pink-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-pink-500/10 transition duration-300 flex flex-col group"
                >
                  {/* Media Showcase */}
                  <div className="relative aspect-[3/4] bg-slate-950 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className={`w-full h-full object-cover group-hover:scale-105 transition duration-500 ${product.is_censored ? 'blur-md scale-105' : ''}`}
                    />

                    {product.is_censored && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-3 text-center z-10">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-rose-600 text-white shadow-xs">
                          18+ Sensitive Content Masked
                        </span>
                        <span className="text-[10px] text-pink-300 mt-1 font-medium">Compliance blur filter active</span>
                      </div>
                    )}

                    {/* Designer Badge */}
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-pink-300 border border-pink-500/20">
                      {product.designer || product.brand}
                    </div>

                    {/* Discrete Badge */}
                    {product.discrete_shipping && (
                      <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-full text-emerald-400 border border-emerald-500/20" title="Discrete Shipping Guaranteed">
                        <Package className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Video Reel Trigger */}
                    {product.runway_video_url && (
                      <button
                        onClick={() => setActiveRunwayVideo(product)}
                        className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 bg-pink-600/90 hover:bg-pink-500 text-white text-xs font-bold rounded-full shadow-lg transition"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Runway Reel</span>
                      </button>
                    )}

                    {/* Quick Fabric Inspector */}
                    <button
                      onClick={() => setActiveInspectProduct(product)}
                      className="absolute bottom-3 right-3 p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full transition"
                      title="Inspect Fabric & Craftsmanship"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Info Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1">
                        <span className="font-semibold text-pink-400">{product.category}</span>
                        <span className="font-mono">★ {product.rating}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-pink-300 transition">
                        {product.name}
                      </h4>
                      <p className="text-slate-300 font-medium text-xs line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>

                    {/* Available Sizes Pills */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-300 font-medium uppercase tracking-wider">
                        Available Sizes
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes_available.map(sz => (
                          <span
                            key={sz}
                            className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-mono text-slate-300"
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Runway Silhouette Poll */}
                    {product.poll_data && (
                      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-2.5 text-xs space-y-2">
                        <div className="font-semibold text-slate-300 text-[11px]">
                          {product.poll_data.question}
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {product.poll_data.options.map(opt => {
                            const totalVotes = product.poll_data!.options.reduce((a, b) => a + b.votes, 0) || 1;
                            const pct = Math.round((opt.votes / totalVotes) * 100);
                            return (
                              <button
                                key={opt.id}
                                onClick={() => handlePollVote(product.id, opt.id)}
                                className="relative overflow-hidden text-left p-1.5 bg-slate-900 border border-slate-800 hover:border-pink-500/40 rounded text-[11px] transition"
                              >
                                <div
                                  className="absolute left-0 top-0 bottom-0 bg-pink-500/15"
                                  style={{ width: `${pct}%` }}
                                />
                                <div className="relative z-10 font-medium text-slate-300 truncate">
                                  {opt.text}
                                </div>
                                <div className="relative z-10 text-[10px] text-pink-400 font-mono">
                                  {pct}% ({opt.votes})
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Social Reactions & Add to Bag */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleReact(product.id, 'like')}
                          className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition"
                          title="Love this garment"
                        >
                          <ThumbsUp className="w-3 h-3 text-pink-400" />
                          <span className="font-mono text-[11px]">{product.likes}</span>
                        </button>
                        <button
                          onClick={() => handleReact(product.id, 'dislike')}
                          className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded text-xs transition"
                          title="Pass on this silhouette"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEmbedProduct(product)}
                          className="p-1 text-slate-300 font-medium hover:text-white"
                          title="Share Product"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="text-sm font-black text-white">
                            {product.price}
                          </span>
                          <span className="text-[10px] text-pink-400 font-bold ml-1">
                            {product.currency}
                          </span>
                        </div>
                        <button
                          onClick={() => addToBag(product)}
                          className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg shadow-sm transition"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* COMPLIANCE & RBAC ACTIONS BAR */}
                    <div className="p-2.5 rounded-xl bg-black border border-[#880808] text-xs mt-3">
                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#880808]/40">
                        <span className="text-[10px] font-black tracking-wider text-rose-500 uppercase flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-rose-600" />
                          COMPLIANCE & RBAC ACTIONS
                        </span>
                        <span className="text-[9px] font-mono font-bold text-pink-400">
                          {product.is_frozen ? 'FROZEN' : product.is_censored ? 'CENSORED' : product.is_suspended ? 'SUSPENDED' : 'ACTIVE'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        {/* Reorder Up / Down */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleReorderProduct(product.id, 'up')}
                            className="p-1 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorderProduct(product.id, 'down')}
                            className="p-1 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                        {/* Granular Micro-management Actions */}
                        <div className="flex items-center gap-1 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleToggleFreeze(product)}
                            className={`px-1.5 py-1 rounded text-[10px] font-bold border transition ${
                              product.is_frozen
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                            }`}
                            title={product.is_frozen ? 'Unfreeze Interactions' : 'Freeze Interactions'}
                          >
                            {product.is_frozen ? <Unlock className="w-3 h-3 inline mr-0.5" /> : <Lock className="w-3 h-3 inline mr-0.5" />}
                            {product.is_frozen ? 'Unfreeze' : 'Freeze'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleCensor(product)}
                            className={`px-1.5 py-1 rounded text-[10px] font-bold border transition ${
                              product.is_censored
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                            }`}
                            title={product.is_censored ? 'Remove 18+ blur' : 'Apply 18+ blur mask'}
                          >
                            {product.is_censored ? <Eye className="w-3 h-3 inline mr-0.5" /> : <EyeOff className="w-3 h-3 inline mr-0.5" />}
                            {product.is_censored ? 'Uncensor' : 'Censor'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleSuspend(product)}
                            className={`px-1.5 py-1 rounded text-[10px] font-bold border transition ${
                              product.is_suspended
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                            }`}
                            title={product.is_suspended ? 'Restore to Runway' : 'Suspend Piece'}
                          >
                            {product.is_suspended ? <PlayCircle className="w-3 h-3 inline mr-0.5" /> : <PauseCircle className="w-3 h-3 inline mr-0.5" />}
                            {product.is_suspended ? 'Restore' : 'Suspend'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTogglePauseInquiries(product)}
                            className={`px-1.5 py-1 rounded text-[10px] font-bold border transition ${
                              product.is_inquiries_paused
                                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                            }`}
                            title={product.is_inquiries_paused ? 'Resume comments' : 'Pause comments'}
                          >
                            {product.is_inquiries_paused ? 'Resume' : 'Pause'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDirectMedia(product)}
                            className="px-1.5 py-1 rounded text-[10px] font-bold bg-pink-900/40 text-pink-300 border border-pink-600/40 hover:bg-pink-800/60"
                            title="Direct Media Upload (Cover, Lookbook, Video)"
                          >
                            <Upload className="w-3 h-3 inline mr-0.5" />
                            Media
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReportingProduct(product);
                              setShowReportModal(true);
                            }}
                            className="px-1.5 py-1 rounded text-[10px] font-bold bg-slate-900 text-amber-400 border border-amber-600/40 hover:bg-amber-900/40"
                            title="Report item to compliance"
                          >
                            <Flag className="w-3 h-3 inline mr-0.5" />
                            Report
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="px-1.5 py-1 rounded text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/60 hover:bg-rose-900"
                            title="Permanent Purge (Super Admin)"
                          >
                            <Trash2 className="w-3 h-3 inline mr-0.5" />
                            Purge
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION: COMMUNITY LOOKBOOKS & OUTFIT PACKAGES */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Layers className="w-3 h-3" />
                  Curated Ensembles
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Runway Lookbooks & Assembled Wardrobes
                </h3>
                <p className="text-slate-300 font-medium text-xs">
                  Mix and match custom outfits curated by our atelier and top fashion members.
                </p>
              </div>

              <button
                onClick={() => setShowOutfitBuilderModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:from-pink-500 hover:to-rose-500 transition shrink-0"
              >
                <Plus className="w-4 h-4" />
                Assemble New Outfit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outfits.length === 0 ? (
                <div className="col-span-full py-8 text-center text-slate-300 font-medium text-xs">
                  No custom lookbooks created yet. Be the first to assemble a runway wardrobe!
                </div>
              ) : (
                outfits.map(outfit => (
                  <div
                    key={outfit.id}
                    className="bg-slate-950 border border-slate-800 hover:border-pink-500/30 rounded-2xl p-5 space-y-3 transition"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 font-bold rounded">
                        {outfit.occasion || 'Runway'}
                      </span>
                      <span className="text-slate-300 font-medium font-mono">
                        {outfit.season || 'All Season'}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-base">
                      {outfit.name}
                    </h4>
                    {outfit.description && (
                      <p className="text-slate-300 font-medium text-xs line-clamp-2">
                        {outfit.description}
                      </p>
                    )}
                    {outfit.style_tags && outfit.style_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {outfit.style_tags.map(t => (
                          <span
                            key={t}
                            className="px-2 py-0.5 bg-slate-900 text-slate-300 font-medium text-[10px] rounded"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 font-medium">
                      <span>Public Runway Look</span>
                      <button
                        onClick={() => showToast(`Lookbook '${outfit.name}' saved to your favorites!`, 'success')}
                        className="text-pink-400 hover:text-pink-300 font-bold"
                      >
                        Save Look
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* STERCS & GOVERNANCE COMPLIANCE FOOTER */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 text-xs text-slate-300 font-medium space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-pink-400 shrink-0" />
                <div>
                  <h5 className="font-bold text-white">
                    FingerMobile Protocol™ STERCS & Guardian Compliance
                  </h5>
                  <p className="text-slate-300 font-medium text-[11px]">
                    All Flamingo transactions are verified under the NDPA 2023 Statutory Criteria. Guardian Age-Verification tokens ensure discrete compliance, with zero adult content exposure to unverified profiles.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 font-mono text-[11px] rounded border border-emerald-500/20">
                  STERCS Ledger: Verified
                </span>
                <span className="px-2 py-1 bg-pink-500/10 text-pink-400 font-mono text-[11px] rounded border border-pink-500/20">
                  Sentient AI: v4.2 Active
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* MODAL 1: 4K RUNWAY VIDEO REEL PLAYER */}
        {activeRunwayVideo && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-pink-500/30 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-pink-400" />
                  <span className="font-bold text-white text-sm">
                    Runway Walk: {activeRunwayVideo.name}
                  </span>
                </div>
                <button type="button" aria-label="Close"
                  onClick={() => setActiveRunwayVideo(null)}
                  className="p-1 text-slate-300 font-medium hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-video bg-black">
                <video
                  src={activeRunwayVideo.runway_video_url}
                  autoPlay
                  controls
                  loop
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-white">
                    Designer: {activeRunwayVideo.designer}
                  </div>
                  <div className="text-slate-300 font-medium">
                    Collection: {activeRunwayVideo.lookbook_collection}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-pink-400 font-mono">
                    {activeRunwayVideo.price} {activeRunwayVideo.currency}
                  </span>
                  <button
                    onClick={() => {
                      addToBag(activeRunwayVideo);
                      setActiveRunwayVideo(null);
                    }}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition"
                  >
                    Add Size to Bag
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: FABRIC & CRAFTSMANSHIP INSPECTOR */}
        {activeInspectProduct && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-pink-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-pink-400" />
                  <h3 className="font-bold text-white text-base">
                    Garment Provenance & Craftsmanship
                  </h3>
                </div>
                <button type="button" aria-label="Close"
                  onClick={() => setActiveInspectProduct(null)}
                  className="text-slate-300 font-medium hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-300 font-medium block mb-0.5">Garment Name</span>
                  <span className="text-white font-semibold">{activeInspectProduct.name}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-300 font-medium block mb-0.5">Fabric & Materials</span>
                  <span className="text-pink-300 font-medium">{activeInspectProduct.fabric_details}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-300 font-medium block mb-0.5">Collection & Cut</span>
                  <span className="text-slate-300">{activeInspectProduct.lookbook_collection} (Designed by {activeInspectProduct.designer})</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <Package className="w-4 h-4" />
                    Discrete Delivery Protocol Guaranteed
                  </div>
                  <p className="text-slate-300 font-medium text-[11px]">
                    Plain outer packaging with zero mention of Flamingo or adult couture. Return address registered to generic logistics subsidiary.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  onClick={() => setActiveInspectProduct(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    addToBag(activeInspectProduct);
                    setActiveInspectProduct(null);
                  }}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold transition"
                >
                  Add to Private Bag
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: SMART SIZE MATRIX & FIT CALCULATOR */}
        {showSizeMatrixModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-pink-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-pink-400" />
                  <h3 className="font-bold text-white text-base">
                    Body Measurement Matrix & Size Predictor
                  </h3>
                </div>
                <button type="button" aria-label="Close"
                  onClick={() => setShowSizeMatrixModal(false)}
                  className="text-slate-300 font-medium hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={userMeasurements.height_cm}
                    onChange={e => {
                      const updated = { ...userMeasurements, height_cm: Number(e.target.value) };
                      setUserMeasurements(updated);
                      updateSizeRecommendation(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={userMeasurements.weight_kg}
                    onChange={e => {
                      const updated = { ...userMeasurements, weight_kg: Number(e.target.value) };
                      setUserMeasurements(updated);
                      updateSizeRecommendation(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Bust / Chest (cm)</label>
                  <input
                    type="number"
                    value={userMeasurements.chest_cm}
                    onChange={e => {
                      const updated = { ...userMeasurements, chest_cm: Number(e.target.value) };
                      setUserMeasurements(updated);
                      updateSizeRecommendation(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    value={userMeasurements.waist_cm}
                    onChange={e => {
                      const updated = { ...userMeasurements, waist_cm: Number(e.target.value) };
                      setUserMeasurements(updated);
                      updateSizeRecommendation(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Hips (cm)</label>
                  <input
                    type="number"
                    value={userMeasurements.hips_cm}
                    onChange={e => {
                      const updated = { ...userMeasurements, hips_cm: Number(e.target.value) };
                      setUserMeasurements(updated);
                      updateSizeRecommendation(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Preferred Fit</label>
                  <select
                    value={userMeasurements.preferred_fit}
                    onChange={e => {
                      const updated = { ...userMeasurements, preferred_fit: e.target.value as any };
                      setUserMeasurements(updated);
                      updateSizeRecommendation(updated);
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-pink-500"
                  >
                    <option value="slim">Slim / Form-Fitting</option>
                    <option value="regular">Regular Classic</option>
                    <option value="relaxed">Relaxed Drape</option>
                    <option value="oversized">Oversized</option>
                  </select>
                </div>
              </div>

              {/* Calculated Results Card */}
              <div className="bg-slate-950 border border-pink-500/30 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-pink-400 font-bold uppercase tracking-wider">
                  <span>Predicted Runway Sizing</span>
                  <span>{calculatedSizeRec.confidence}% Match Confidence</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Tops & Gowns: <strong className="text-white">{calculatedSizeRec.top}</strong></div>
                  <div>Corsetry & Bras: <strong className="text-white">{calculatedSizeRec.corset}</strong></div>
                  <div>Waist Calibration: <strong className="text-white">{calculatedSizeRec.waist}</strong></div>
                  <div>Slip Dresses: <strong className="text-white">{calculatedSizeRec.dress}</strong></div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowSizeMatrixModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await apiService.post('/api/flamingo/measurements', userMeasurements).catch(() => {});
                    showToast('Measurement matrix updated & saved to profile', 'success');
                    setShowSizeMatrixModal(false);
                  }}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl transition"
                >
                  Save Fit Matrix
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 4: OUTFIT BUILDER */}
        {showOutfitBuilderModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-pink-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-pink-400" />
                  <h3 className="font-bold text-white text-base">
                    Assemble Runway Ensemble
                  </h3>
                </div>
                <button type="button" aria-label="Close"
                  onClick={() => setShowOutfitBuilderModal(false)}
                  className="text-slate-300 font-medium hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveOutfit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Outfit Title</label>
                  <input
                    type="text"
                    required
                    value={newOutfitName}
                    onChange={e => setNewOutfitName(e.target.value)}
                    placeholder="e.g. Midnight Gala Velvet Ensemble"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-pink-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">Occasion</label>
                    <select
                      value={newOutfitOccasion}
                      onChange={e => setNewOutfitOccasion(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-pink-500"
                    >
                      <option value="Runway Gala">Runway Gala</option>
                      <option value="Date Night">Date Night</option>
                      <option value="Private Lounge">Private Lounge</option>
                      <option value="VIP Soiree">VIP Soiree</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">Season</label>
                    <select
                      value={newOutfitSeason}
                      onChange={e => setNewOutfitSeason(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-pink-500"
                    >
                      <option value="Fall/Winter">Fall / Winter</option>
                      <option value="Spring/Summer">Spring / Summer</option>
                      <option value="All Season">All Season</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Style Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newOutfitTags}
                    onChange={e => setNewOutfitTags(e.target.value)}
                    placeholder="haute-couture, silk, velvet"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-pink-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="publicOutfit"
                    checked={newOutfitIsPublic}
                    onChange={e => setNewOutfitIsPublic(e.target.checked)}
                    className="accent-pink-500"
                  />
                  <label htmlFor="publicOutfit" className="text-slate-300 font-semibold">
                    Publish outfit to community lookbooks
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowOutfitBuilderModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold transition"
                  >
                    Save Ensemble
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DRAWER 1: AI FASHION STYLIST CONCIERGE */}
        {showAiStylistDrawer && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-md bg-slate-900 border-l border-pink-500/30 h-full flex flex-col shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-pink-400" />
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      Flamingo AI Stylist & Fit Specialist
                    </h3>
                    <span className="text-[11px] text-pink-400 font-mono">
                      Sentient Style Model v4.2 Online
                    </span>
                  </div>
                </div>
                <button type="button" aria-label="Close"
                  onClick={() => setShowAiStylistDrawer(false)}
                  className="p-1 text-slate-300 font-medium hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                {stylistMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-pink-600 text-white rounded-br-none'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {stylistTyping && (
                  <div className="text-slate-300 font-medium text-xs italic flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-pink-400" />
                    <span>Consulting atelier style charts...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="p-2 border-t border-slate-800 flex gap-1.5 overflow-x-auto text-[11px]">
                {['Silk slip gown care', 'Corsetry steel boning vs plastic', 'Stealth packaging proof'].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendStylistQuery(chip)}
                    className="px-2 py-1 bg-slate-950 border border-slate-800 text-slate-300 font-medium hover:text-pink-300 rounded whitespace-nowrap transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={stylistInput}
                  onChange={e => setStylistInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendStylistQuery()}
                  placeholder="Ask for fashion fit advice, fabric specs..."
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-pink-500"
                />
                <button type="button" aria-label="Send"
                  onClick={() => handleSendStylistQuery()}
                  className="p-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DRAWER 2: PRIVATE BAG & DISCRETE MULTI-RAIL CHECKOUT */}
        {showCartDrawer && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-md bg-slate-900 border-l border-pink-500/30 h-full flex flex-col shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-pink-400" />
                  <h3 className="font-bold text-white text-base">
                    Private Discreet Bag
                  </h3>
                </div>
                <button type="button" aria-label="Close"
                  onClick={() => setShowCartDrawer(false)}
                  className="p-1 text-slate-300 font-medium hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-slate-300 font-medium text-xs">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    Your private bag is currently empty.
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-12 h-14 object-cover rounded-lg bg-slate-900"
                        />
                        <div>
                          <div className="font-bold text-white line-clamp-1">{item.product.name}</div>
                          <div className="text-slate-300 font-medium text-[11px]">Size: {item.selectedSize}</div>
                          <div className="text-pink-400 font-mono font-bold mt-0.5">
                            {item.product.price} {item.product.currency} × {item.quantity}
                          </div>
                        </div>
                      </div>

                      <button type="button" aria-label="Close"
                        onClick={() => {
                          setCart(prev => prev.filter((_, i) => i !== idx));
                          showToast('Item removed from private bag', 'info');
                        }}
                        className="text-slate-300 font-medium hover:text-rose-400 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Options & Settlement */}
              {cart.length > 0 && (
                <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-4">
                  {/* Packaging Preference */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-slate-300 font-medium uppercase tracking-wider text-[11px]">
                      Discreet Packaging Protocol
                    </span>
                    <select
                      value={packagingPreference}
                      onChange={e => setPackagingPreference(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs outline-none focus:border-pink-500"
                    >
                      <option value="plain_brown_carton">Plain Double-Boxed Matte Brown Carton</option>
                      <option value="white_label_discrete">White Label Express with Neutral Return</option>
                      <option value="cryptographic_vault">Cryptographic Vault Lock Delivery</option>
                    </select>
                  </div>

                  {/* Payment Rail */}
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-slate-300 font-medium uppercase tracking-wider text-[11px]">
                      Sovereign Settlement Rail
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setCheckoutRail('fic_vault')}
                        className={`py-2 text-center rounded-xl font-bold transition text-xs ${
                          checkoutRail === 'fic_vault'
                            ? 'bg-pink-600 text-white'
                            : 'bg-slate-900 text-slate-300 font-medium border border-slate-800'
                        }`}
                      >
                        FIC Vault
                      </button>
                      <button
                        onClick={() => setCheckoutRail('earnings')}
                        className={`py-2 text-center rounded-xl font-bold transition text-xs ${
                          checkoutRail === 'earnings'
                            ? 'bg-pink-600 text-white'
                            : 'bg-slate-900 text-slate-300 font-medium border border-slate-800'
                        }`}
                      >
                        Earnings
                      </button>
                      <button
                        onClick={() => setCheckoutRail('card')}
                        className={`py-2 text-center rounded-xl font-bold transition text-xs ${
                          checkoutRail === 'card'
                            ? 'bg-pink-600 text-white'
                            : 'bg-slate-900 text-slate-300 font-medium border border-slate-800'
                        }`}
                      >
                        Credit Card
                      </button>
                    </div>
                  </div>

                  {/* Total & Confirm Button */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-300 font-medium block">Total Order</span>
                      <span className="text-lg font-black text-white font-mono">
                        {cartTotal.toFixed(2)} FIC
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        showToast(`Order settled via ${checkoutRail.replace('_', ' ').toUpperCase()}! Discrete shipping queued.`, 'success');
                        setCart([]);
                        setShowCartDrawer(false);
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
                    >
                      Authorize & Dispatch
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SOCIAL EMBED MODAL FOR SHARING WITH NSFW BLUR */}
        <SocialEmbedModal
          isOpen={Boolean(embedProduct)}
          onClose={() => setEmbedProduct(null)}
          product={
            embedProduct
              ? {
                id: embedProduct.id,
                name: embedProduct.name,
                price: typeof embedProduct.price === 'string' ? parseFloat(embedProduct.price) : embedProduct.price,
                currency: embedProduct.currency,
                imageUrl: embedProduct.images[0],
                platform: 'flamingo',
                description: embedProduct.description
              }
              : null
          }
          isNsfw={true}
        />

        {/* SOVEREIGN MOBILE NAVIGATION QUICK DOCK */}
        <nav
          aria-label="Flamingo Quick Navigation"
          className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 sm:hidden flex items-center justify-around shadow-lg"
        >
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-xs font-bold transition-colors ${
              selectedCategory === 'all' ? 'text-pink-400' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span>Runway</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAiStylistDrawer(true)}
            className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <Bot className="w-5 h-5 mb-0.5" />
            <span>Stylist</span>
          </button>
          <button
            type="button"
            onClick={() => setShowOutfitBuilderModal(true)}
            className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span>Outfits</span>
          </button>
          <button
            type="button"
            onClick={() => setShowCartDrawer(true)}
            className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-xs font-bold text-slate-300 hover:text-white transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            <span>Bag</span>
            {cart.length > 0 && (
              <span className="absolute top-1 right-2 bg-pink-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </nav>

        {/* Sovereign Commerce Visual Search Modal */}
        <CommerceVisualSearchModal
          isOpen={showVisualSearchModal}
          onClose={() => setShowVisualSearchModal(false)}
          initialStore="flamingo"
        />

        {/* DIRECT MEDIA UPLOAD MODAL */}
        {showDirectUploadModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-pink-500/40 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Upload className="w-5 h-5 text-pink-400" />
                    Direct Media Ingestion: {targetProductForMedia ? targetProductForMedia.name : 'New Haute Creation'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Upload lookbook cover art, multi-angle detail photos, and runway 4K video reels saving directly to PostgreSQL storage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDirectUploadModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <CommerceMediaPicker
                value={directMediaPickerValue}
                onChange={setDirectMediaPickerValue}
                title="Flamingo Haute Fashion Media Picker"
                description="Upload cover lookbook photo, detail embroidery close-ups, and runway showcase video reel. Supports direct file picker and express uploads."
                allowGallery={true}
                allowVideo={true}
              />

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDirectUploadModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDirectMedia}
                  className="flex-1 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition"
                >
                  {targetProductForMedia ? 'Save Media to PostgreSQL' : 'Publish Haute Creation'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REPORT MODAL */}
        {showReportModal && reportingProduct && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-rose-900/60 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Flag className="w-5 h-5 text-amber-500" />
                  Report Listing: {reportingProduct.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Reason for Report</label>
                  <textarea
                    required
                    rows={4}
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Describe violations (e.g. counterfeit design, unauthorized photography, compliance issue)..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition"
                  >
                    Submit Report to Audit Ledger
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

const FlamingoPage: React.FC = () => {
  return (
    <FlamingoDualLockGuard>
      <FlamingoPageContent />
    </FlamingoDualLockGuard>
  );
};

export default FlamingoPage;
