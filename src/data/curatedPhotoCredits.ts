/*
 * FingerMobile Protocol™ - Curated High-Definition PhotoCredits Catalog
 * 15 4K/8K Realistic Close-Up Editorial Photographs + 5 4K Cinematic Videos
 * 5 Demographics:
 * 1. Black American, Female model, age 30's (3 photos + 1 video)
 * 2. American, Female Model, 30's (3 photos + 1 video)
 * 3. Irish, Female Model, 30's (3 photos + 1 video)
 * 4. Venezuelan, Female model, 30's (3 photos + 1 video)
 * 5. Black African Female Model, 20's (3 photos + 1 video)
 * Professional 85mm lens, golden hour, photorealistic skin & fabric textures.
 */

export interface CameraExif {
  camera?: string;
  lens?: string;
  iso?: number;
  shutter?: string;
  aperture?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollData {
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string | null;
}

export interface CuratedMediaItem {
  id: string;
  photo_id?: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  media_type: 'image' | 'video';
  cohort: string;
  photographer: string;
  location: string;
  category: string;
  tags: string[];
  likes: number;
  dislikes: number;
  saves?: number;
  comments?: number;
  downloads: number;
  shares: number;
  rating: number;
  price_credits: number;
  license_type: 'Royalty-Free Standard' | 'Editorial Use Only' | 'Commercial Extended';
  camera_info: CameraExif;
  poll_data: PollData;
}

export const CURATED_PHOTOCREDITS_ITEMS: CuratedMediaItem[] = [
  // =========================================================================
  // COHORT 1: Black American, Female model, age 30's (3 Photos + 1 Video)
  // =========================================================================
  {
    id: 'pc-ba-01',
    photo_id: 'ph-ba-01',
    title: 'Manhattan Skyline Golden Hour Flow',
    description: 'Cinematic 4k photograph of a Black American woman in her mid-30s standing in a stylish urban city environment. She is wearing a highly detailed, colorful, and elegant flowing dress. Captured during golden hour with dramatic natural lighting accentuating her radiant skin textures and hair. Shot on a professional 85mm lens, high-fashion editorial style.',
    imageUrl: '/assets/photocredits/black_american_1.jpg',
    thumbnailUrl: '/assets/photocredits/black_american_1.jpg',
    media_type: 'image',
    cohort: 'Black American, Female (30\'s)',
    photographer: 'Marcus Vance Studios',
    location: 'New York City, NY',
    category: 'Portraits & Fashion',
    tags: ['8k', '4k', 'Black American', 'Golden Hour', 'High Fashion', '85mm'],
    likes: 384,
    dislikes: 4,
    downloads: 142,
    shares: 68,
    rating: 4.95,
    price_credits: 45,
    license_type: 'Royalty-Free Standard',
    camera_info: {
      camera: 'Sony A7R V (61MP)',
      lens: 'Sony FE 85mm f/1.4 GM',
      iso: 100,
      shutter: '1/320s',
      aperture: 'f/1.4'
    },
    poll_data: {
      question: 'Which visual element commands the strongest editorial presence?',
      options: [
        { id: 'opt-1', text: 'Intricate silk fabric movement in wind', votes: 148 },
        { id: 'opt-2', text: 'Warm golden hour specular rim light', votes: 196 },
        { id: 'opt-3', text: 'Shallow depth of field bokeh over skyline', votes: 84 }
      ],
      totalVotes: 428
    }
  },
  {
    id: 'pc-ba-02',
    photo_id: 'ph-ba-02',
    title: 'Harlem Renaissance Radiance Close-Up',
    description: 'Ultra-detailed 8K macro portrait of a Black American female model in her 30s. Warm amber backlight highlighting dewy skin tones, defined cheekbones, and artisanal bronze earrings. Natural expression with genuine grace and cinematic depth.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85',
    media_type: 'image',
    cohort: 'Black American, Female (30\'s)',
    photographer: 'Aaliyah King Imagery',
    location: 'Harlem, New York',
    category: 'Portraits & Fashion',
    tags: ['Close-up', 'Black American', 'Editorial', 'Natural Skin', '85mm'],
    likes: 492,
    dislikes: 6,
    downloads: 189,
    shares: 95,
    rating: 4.98,
    price_credits: 50,
    license_type: 'Commercial Extended',
    camera_info: {
      camera: 'Canon EOS R5 C',
      lens: 'Canon RF 85mm f/1.2L USM',
      iso: 125,
      shutter: '1/250s',
      aperture: 'f/1.4'
    },
    poll_data: {
      question: 'Best suited placement for this high-fashion close-up?',
      options: [
        { id: 'opt-1', text: 'Luxury Magazine Cover Issue', votes: 230 },
        { id: 'opt-2', text: 'Global Skincare & Beauty Billboard', votes: 182 },
        { id: 'opt-3', text: 'Fine Art Sovereign NFT Collection', votes: 94 }
      ],
      totalVotes: 506
    }
  },
  {
    id: 'pc-ba-03',
    photo_id: 'ph-ba-03',
    title: 'Brooklyn Terrace Velvet Dusk',
    description: 'High-fashion editorial portrait of a mid-30s Black American model in a custom structured magenta cape gown. Captured against soft city twilight, rich deep tones, delicate gold accents, and sharp photorealistic textures.',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1600&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=85',
    media_type: 'image',
    cohort: 'Black American, Female (30\'s)',
    photographer: 'Derrick Cole Visuals',
    location: 'Brooklyn, New York',
    category: 'Portraits & Fashion',
    tags: ['High Fashion', 'Black American', 'Editorial', 'Dusk', 'Couture'],
    likes: 318,
    dislikes: 3,
    downloads: 110,
    shares: 44,
    rating: 4.88,
    price_credits: 40,
    license_type: 'Editorial Use Only',
    camera_info: {
      camera: 'Nikon Z9',
      lens: 'Nikkor Z 85mm f/1.2 S',
      iso: 200,
      shutter: '1/200s',
      aperture: 'f/1.8'
    },
    poll_data: {
      question: 'Rate the chromatic temperature of this twilight shot:',
      options: [
        { id: 'opt-1', text: 'Flawlessly balanced dusk purple & gold', votes: 165 },
        { id: 'opt-2', text: 'Cinematic mood with deep shadows', votes: 140 }
      ],
      totalVotes: 305
    }
  },
  {
    id: 'pc-ba-04-vid',
    photo_id: 'ph-ba-04-vid',
    title: 'SoHo Sunset Promenade 4K Fashion Reel',
    description: 'Ultra HD 4K slow-motion fashion film capturing the 30s Black American model striding gracefully across a cobblestone SoHo boulevard during golden hour. Flowing silk dress catches the low sun rays with dynamic camera motion.',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-the-city-at-sunset-39875-large.mp4',
    media_type: 'video',
    cohort: 'Black American, Female (30\'s)',
    photographer: 'Vance Cinema Collective',
    location: 'SoHo, New York',
    category: '4K Cinematic Video',
    tags: ['4K Video', 'Black American', 'Slow Motion', 'Golden Hour', 'Cinema'],
    likes: 560,
    dislikes: 2,
    downloads: 240,
    shares: 138,
    rating: 4.99,
    price_credits: 75,
    license_type: 'Commercial Extended',
    camera_info: {
      camera: 'RED V-Raptor 8K VV',
      lens: 'Cooke S4/i 85mm T2.0 Prime',
      iso: 250,
      shutter: '1/96s (48fps)',
      aperture: 'T2.0'
    },
    poll_data: {
      question: 'How do you rate the 4K cinematic slow-motion grade?',
      options: [
        { id: 'opt-1', text: 'Academy-level color grade and flow', votes: 312 },
        { id: 'opt-2', text: 'Perfect for commercial brand reels', votes: 198 }
      ],
      totalVotes: 510
    }
  },

  // =========================================================================
  // COHORT 2: American, Female Model, 30's (3 Photos + 1 Video)
  // =========================================================================
  {
    id: 'pc-us-01',
    photo_id: 'ph-us-01',
    title: 'Hollywood Hills Modern Terraces Sunset',
    description: 'Cinematic 4k photograph of an American woman in her mid-30s standing on a chic architectural glass terrace overlooking Los Angeles at sunset. Elegant silk emerald gown, natural radiant skin textures, and warm golden rim light on flowing brunette waves. Shot on 85mm lens.',
    imageUrl: '/assets/photocredits/american_1.jpg',
    thumbnailUrl: '/assets/photocredits/american_1.jpg',
    media_type: 'image',
    cohort: 'American, Female Model (30\'s)',
    photographer: 'Elena Sterling Creative',
    location: 'Los Angeles, California',
    category: 'Portraits & Fashion',
    tags: ['8k', '4k', 'American', 'Sunset', 'Architectural', '85mm'],
    likes: 412,
    dislikes: 5,
    downloads: 165,
    shares: 72,
    rating: 4.93,
    price_credits: 45,
    license_type: 'Royalty-Free Standard',
    camera_info: {
      camera: 'Leica SL2',
      lens: 'Leica APO-Summicron-SL 90mm f/2 ASPH',
      iso: 100,
      shutter: '1/400s',
      aperture: 'f/2.0'
    },
    poll_data: {
      question: 'Which setting best captures this aesthetic?',
      options: [
        { id: 'opt-1', text: 'Modern Beverly Hills Architecture', votes: 215 },
        { id: 'opt-2', text: 'Malibu Coastal Golden Sunset', votes: 178 }
      ],
      totalVotes: 393
    }
  },
  {
    id: 'pc-us-02',
    photo_id: 'ph-us-02',
    title: 'California Golden Hour Radiance',
    description: 'Crisp 8K close-up portrait of an American woman in her 30s. Soft natural backlighting with delicate lens flare, genuine warm smile, photorealistic skin and hair strands against a dreamy bokeh of sunlit hills.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=85',
    media_type: 'image',
    cohort: 'American, Female Model (30\'s)',
    photographer: 'Harrison Ford Studios',
    location: 'Santa Barbara, California',
    category: 'Portraits & Fashion',
    tags: ['Close-up', 'American', 'Natural Light', 'Warm Glow', 'Editorial'],
    likes: 388,
    dislikes: 4,
    downloads: 145,
    shares: 56,
    rating: 4.91,
    price_credits: 40,
    license_type: 'Royalty-Free Standard',
    camera_info: {
      camera: 'Sony A1',
      lens: 'Sony FE 85mm f/1.4 GM',
      iso: 100,
      shutter: '1/500s',
      aperture: 'f/1.4'
    },
    poll_data: {
      question: 'Preferred editorial treatment for natural freckles and lighting?',
      options: [
        { id: 'opt-1', text: 'Keep 100% natural raw skin texture (Current)', votes: 295 },
        { id: 'opt-2', text: 'Smooth studio high-key polish', votes: 45 }
      ],
      totalVotes: 340
    }
  },
  {
    id: 'pc-us-03',
    photo_id: 'ph-us-03',
    title: 'Studio Minimalist Linen Elegance',
    description: 'High-fashion American editorial portrait in a minimalist loft studio. Model in an oversized cream linen suit with sculpted gold neck collar. Clean directional shadows and exceptional dynamic range.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=85',
    media_type: 'image',
    cohort: 'American, Female Model (30\'s)',
    photographer: 'Claire Bennett Studio',
    location: 'Chicago, Illinois',
    category: 'Portraits & Fashion',
    tags: ['Studio', 'American', 'Minimalist', 'Linen', 'High Fashion'],
    likes: 290,
    dislikes: 3,
    downloads: 102,
    shares: 41,
    rating: 4.87,
    price_credits: 35,
    license_type: 'Editorial Use Only',
    camera_info: {
      camera: 'Hasselblad X2D 100C',
      lens: 'XCD 90mm f/2.5 V',
      iso: 64,
      shutter: '1/250s',
      aperture: 'f/2.5'
    },
    poll_data: {
      question: 'Ideal brand alignment for this minimalist campaign?',
      options: [
        { id: 'opt-1', text: 'High-end Sustainable Fashion House', votes: 180 },
        { id: 'opt-2', text: 'Fintech / Protocol Executive Leadership', votes: 120 }
      ],
      totalVotes: 300
    }
  },
  {
    id: 'pc-us-04-vid',
    photo_id: 'ph-us-04-vid',
    title: 'Pacific Coast Highway Motion Vignette',
    description: 'Stunning 4K cinema clip of the American model walking toward the Pacific sunset at golden hour, hair gently billowing in the ocean breeze with warm cinematic halation.',
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1600&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-smiling-at-the-camera-40616-large.mp4',
    media_type: 'video',
    cohort: 'American, Female Model (30\'s)',
    photographer: 'Sterling Pacific Films',
    location: 'Big Sur, California',
    category: '4K Cinematic Video',
    tags: ['4K Video', 'American', 'Pacific Coast', 'Golden Hour', 'Smile'],
    likes: 470,
    dislikes: 1,
    downloads: 198,
    shares: 88,
    rating: 4.97,
    price_credits: 70,
    license_type: 'Commercial Extended',
    camera_info: {
      camera: 'ARRI Alexa Mini LF',
      lens: 'ARRI Signature Prime 75mm T1.8',
      iso: 800,
      shutter: '1/48s',
      aperture: 'T2.0'
    },
    poll_data: {
      question: 'Does the natural sun flare enhance or distract from the subject?',
      options: [
        { id: 'opt-1', text: 'Enhances the emotional warmth dramatically', votes: 340 },
        { id: 'opt-2', text: 'Prefer a cleaner controlled studio backlight', votes: 45 }
      ],
      totalVotes: 385
    }
  },

  // =========================================================================
  // COHORT 3: Irish, Female Model, 30's (3 Photos + 1 Video)
  // =========================================================================
  {
    id: 'pc-ir-01',
    photo_id: 'ph-ir-01',
    title: 'Cliffs of Moher Emerald Twilight',
    description: 'Cinematic 4k photograph of an Irish woman in her early 30s with striking emerald eyes and auburn hair, standing on a misty seaside cliff overlooking the ocean at sunset. Wearing an elegant cream knit haute couture coat and dress with subtle gold earrings. Natural freckles, photorealistic skin textures, shot on 85mm lens.',
    imageUrl: '/assets/photocredits/irish_1.jpg',
    thumbnailUrl: '/assets/photocredits/irish_1.jpg',
    media_type: 'image',
    cohort: 'Irish, Female Model (30\'s)',
    photographer: 'Liam O’Connor Fine Art',
    location: 'Cliffs of Moher, Co. Clare, Ireland',
    category: 'Portraits & Fashion',
    tags: ['8k', '4k', 'Irish', 'Emerald Eyes', 'Cliffs', 'Auburn Hair', '85mm'],
    likes: 465,
    dislikes: 3,
    downloads: 195,
    shares: 94,
    rating: 4.97,
    price_credits: 48,
    license_type: 'Royalty-Free Standard',
    camera_info: {
      camera: 'Canon EOS R5',
      lens: 'Canon RF 85mm f/1.2L USM DS',
      iso: 160,
      shutter: '1/320s',
      aperture: 'f/1.4'
    },
    poll_data: {
      question: 'What element creates the most emotional impact in this Irish coastal portrait?',
      options: [
        { id: 'opt-1', text: 'Piercing emerald eye color against sea mist', votes: 260 },
        { id: 'opt-2', text: 'Aran-inspired cable knit luxury texture', votes: 140 },
        { id: 'opt-3', text: 'Distant crashing Atlantic wave bokeh', votes: 88 }
      ],
      totalVotes: 488
    }
  },
  {
    id: 'pc-ir-02',
    photo_id: 'ph-ir-02',
    title: 'Galway Bay Atlantic Breeze Portrait',
    description: 'Breathtaking 8K close-up of a 30s Irish model. Auburn curls catching the maritime sunset light, soft freckled cheeks, sharp green irises, and an introspective serene expression. High-fashion magazine editorial grade.',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=85',
    media_type: 'image',
    cohort: 'Irish, Female Model (30\'s)',
    photographer: 'Siobhan Kelly Visuals',
    location: 'Galway, Ireland',
    category: 'Portraits & Fashion',
    tags: ['Close-up', 'Irish', 'Celtic', 'Ocean', 'Natural Beauty'],
    likes: 405,
    dislikes: 4,
    downloads: 160,
    shares: 75,
    rating: 4.92,
    price_credits: 42,
    license_type: 'Commercial Extended',
    camera_info: {
      camera: 'Sony A7R V',
      lens: 'Sigma 85mm f/1.4 DG DN Art',
      iso: 100,
      shutter: '1/500s',
      aperture: 'f/1.4'
    },
    poll_data: {
      question: 'Would this image work best for travel heritage or beauty campaigns?',
      options: [
        { id: 'opt-1', text: 'Luxury Tourism & Celtic Heritage', votes: 198 },
        { id: 'opt-2', text: 'Organic Skincare & Clean Beauty', votes: 212 }
      ],
      totalVotes: 410
    }
  },
  {
    id: 'pc-ir-03',
    photo_id: 'ph-ir-03',
    title: 'Dublin Georgian Doorway Velvet Dusk',
    description: 'High-fashion editorial of an Irish female model in an emerald velvet trench coat standing by an 18th-century Dublin fanlight doorway. Rich architectural textures, warm brass lanterns, and sharp depth of field.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1600&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=85',
    media_type: 'image',
    cohort: 'Irish, Female Model (30\'s)',
    photographer: 'Conor MacCarthy Photography',
    location: 'Dublin, Ireland',
    category: 'Portraits & Fashion',
    tags: ['Dublin', 'Irish', 'Velvet', 'Heritage', 'Editorial'],
    likes: 340,
    dislikes: 2,
    downloads: 125,
    shares: 48,
    rating: 4.9,
    price_credits: 38,
    license_type: 'Royalty-Free Standard',
    camera_info: {
      camera: 'Nikon Z8',
      lens: 'Nikkor Z 85mm f/1.8 S',
      iso: 250,
      shutter: '1/160s',
      aperture: 'f/1.8'
    },
    poll_data: {
      question: 'Rate the architectural context integration:',
      options: [
        { id: 'opt-1', text: 'Classic Georgian architecture pairs perfectly', votes: 185 },
        { id: 'opt-2', text: 'Prefer open outdoor landscape', votes: 65 }
      ],
      totalVotes: 250
    }
  },
  {
    id: 'pc-ir-04-vid',
    photo_id: 'ph-ir-04-vid',
    title: 'Wild Atlantic Way 4K Wind & Sea Film',
    description: 'Epic 4K cinema sequence of the Irish model turning toward the Atlantic sea cliffs at sunset, wind carrying her auburn hair as waves break on the rocks below in slow motion.',
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1600&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-walking-on-the-beach-at-sunset-39871-large.mp4',
    media_type: 'video',
    cohort: 'Irish, Female Model (30\'s)',
    photographer: 'Atlantic Cinema Works',
    location: 'Donegal, Ireland',
    category: '4K Cinematic Video',
    tags: ['4K Video', 'Irish', 'Atlantic Ocean', 'Slow Motion', 'Atmospheric'],
    likes: 512,
    dislikes: 2,
    downloads: 215,
    shares: 110,
    rating: 4.98,
    price_credits: 75,
    license_type: 'Commercial Extended',
    camera_info: {
      camera: 'RED Komodo-X 6K',
      lens: 'Zeiss Supreme Prime 85mm T1.5',
      iso: 400,
      shutter: '1/120s (60fps)',
      aperture: 'T2.0'
    },
    poll_data: {
      question: 'Is this clip ready for commercial streaming OTT broadcast?',
      options: [
        { id: 'opt-1', text: 'Yes, broadcast ready 10-bit 4K color', votes: 320 },
        { id: 'opt-2', text: 'Needs minor grading for darker drama', votes: 52 }
      ],
      totalVotes: 372
    }
  },

  // =========================================================================
  // COHORT 4: Venezuelan, Female model, 30's (3 Photos + 1 Video)
  // =========================================================================
  {
    id: 'pc-ve-01',
    photo_id: 'ph-ve-01',
    title: 'Caracas Colonial Courtyard Golden Twilight',
    description: 'Cinematic 4k photograph of a Venezuelan woman in her early 30s with sun-kissed radiant skin and lustrous dark hair. Standing in an elegant tropical courtyard with stone arches and flowering bougainvillea. Wearing a couture terracotta halter gown with artisan brass neckpiece. Golden hour sunset, 85mm lens, high-fashion editorial.',
    imageUrl: '/assets/photocredits/venezuelan_1.jpg',
    thumbnailUrl: '/assets/photocredits/venezuelan_1.jpg',
    media_type: 'image',
    cohort: 'Venezuelan, Female model (30\'s)',
    photographer: 'Mateo Rivas Couture',
    location: 'Caracas, Venezuela',
    category: 'Portraits & Fashion',
    tags: ['8k', '4k', 'Venezuelan', 'Terracotta', 'Courtyard', 'Golden Hour', '85mm'],
    likes: 478,
    dislikes: 4,
    downloads: 182,
    shares: 91,
    rating: 4.96,
    price_credits: 46,
    license_type: 'Royalty-Free Standard',
    camera_info: {
      camera: 'Sony A7R V',
      lens: 'Sony FE 85mm f/1.4 GM II',
      iso: 100,
      shutter: '1/320s',
      aperture: 'f/1.4'
    },
    poll_data: {
      question: 'Which styling choice elevates this Venezuelan fashion portrait the most?',
      options: [
        { id: 'opt-1', text: 'Flowing terracotta silk gown against colonial stone', votes: 215 },
        { id: 'opt-2', text: 'Artisan hand-hammered brass choker', votes: 154 },
        { id: 'opt-3', text: 'Pink bougainvillea floral framing', votes: 98 }
      ],
      totalVotes: 467
    }
  },
  {
    id: 'pc-ve-02',
    photo_id: 'ph-ve-02',
    title: 'Isla Margarita Sun-Drenched Editorial Close-Up',
    description: 'Radiant 8K portrait of a Venezuelan female model in her 30s. Warm golden sunset skimming high cheekbones, luminous olive skin tone, dark eyes with deep warmth, and delicate gold filigree earrings.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85',
    media_type: 'image',
    cohort: 'Venezuelan, Female model (30\'s)',
    photographer: 'Camila Delgado Studio',
    location: 'Isla Margarita, Venezuela',
    category: 'Portraits & Fashion',
    tags: ['Close-up', 'Venezuelan', 'Sun-Kissed', 'Editorial', 'Golden Hour'],
    likes: 395,
    dislikes: 3,
    downloads: 150,
    shares: 66,
    rating: 4.91,
    price_credits: 42,
    license_type: 'Commercial Extended',
    camera_info: {
      camera: 'Canon EOS R5',
      lens: 'Canon RF 85mm f/1.2L USM',
      iso: 125,
      shutter: '1/400s',
      aperture: 'f/1.6'
    },
    poll_data: {
      question: 'Which lighting balance highlights the skin tones best?',
      options: [
        { id: 'opt-1', text: 'Warm 3200K natural tropical sunset (Current)', votes: 245 },
        { id: 'opt-2', text: 'Cool 5600K high-fashion daylight balance', votes: 68 }
      ],
      totalVotes: 313
    }
  },
  {
    id: 'pc-ve-03',
    photo_id: 'ph-ve-03',
    title: 'Avila Mountain Crest Silk Scarf Elegance',
    description: 'High-fashion editorial overlooking the Caracas valley from Mount Avila. Model wearing a turquoise and coral printed silk dress with gold bangles as the mountain breeze creates dramatic fabric movement.',
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1600&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=85',
    media_type: 'image',
    cohort: 'Venezuelan, Female model (30\'s)',
    photographer: 'Andres Mendoza Films',
    location: 'El Avila National Park, Venezuela',
    category: 'Portraits & Fashion',
    tags: ['Mountain', 'Venezuelan', 'Silk', 'Couture', 'Wind'],
    likes: 320,
    dislikes: 2,
    downloads: 115,
    shares: 51,
    rating: 4.89,
    price_credits: 38,
    license_type: 'Royalty-Free Standard',
    camera_info: {
      camera: 'Nikon Z9',
      lens: 'Nikkor Z 85mm f/1.2 S',
      iso: 100,
      shutter: '1/640s',
      aperture: 'f/2.0'
    },
    poll_data: {
      question: 'Preferred editorial crop for magazine layout?',
      options: [
        { id: 'opt-1', text: 'Full length showing dress flow', votes: 195 },
        { id: 'opt-2', text: 'Tight torso crop focusing on jewelry', votes: 92 }
      ],
      totalVotes: 287
    }
  },
  {
    id: 'pc-ve-04-vid',
    photo_id: 'ph-ve-04-vid',
    title: 'Hacienda Tropical Spin 4K Fashion Motion',
    description: 'Dynamic 4K motion sequence of the Venezuelan model twirling in a flowing terracotta dress inside an architectural hacienda courtyard. Sunlight reflects through water fountain droplets with cinematic grace.',
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1600&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-spinning-in-a-floral-dress-41132-large.mp4',
    media_type: 'video',
    cohort: 'Venezuelan, Female model (30\'s)',
    photographer: 'Caracas Cinema House',
    location: 'Caracas, Venezuela',
    category: '4K Cinematic Video',
    tags: ['4K Video', 'Venezuelan', 'Spin', 'Hacienda', 'Movement'],
    likes: 520,
    dislikes: 3,
    downloads: 228,
    shares: 120,
    rating: 4.97,
    price_credits: 75,
    license_type: 'Commercial Extended',
    camera_info: {
      camera: 'Sony FX6 Cinema Line',
      lens: 'Sony FE 85mm f/1.4 GM',
      iso: 320,
      shutter: '1/120s (60fps)',
      aperture: 'f/1.8'
    },
    poll_data: {
      question: 'Rate the fluid movement and dynamic lighting integration:',
      options: [
        { id: 'opt-1', text: 'Hypnotic and fluid 10/10 motion', votes: 285 },
        { id: 'opt-2', text: 'Great for summer lifestyle TV spot', votes: 160 }
      ],
      totalVotes: 445
    }
  },

  // =========================================================================
  // COHORT 5: Black African Female Model, 20's (3 Photos + 1 Video)
  // =========================================================================
  {
    id: 'pc-af-01',
    photo_id: 'ph-af-01',
    title: 'Lagos Waterfront Avant-Garde Cape Gown',
    description: 'Cinematic 4k photograph of a Black African woman in her mid-20s with glowing deep melanin skin, sculpted high cheekbones, and intricate braided crown hairstyle. Wearing an avant-garde royal blue and gold structural cape dress against a futuristic skyline. Dramatic golden hour lighting, 85mm lens, high-fashion editorial.',
    imageUrl: '/assets/photocredits/black_african_1.jpg',
    thumbnailUrl: '/assets/photocredits/black_african_1.jpg',
    media_type: 'image',
    cohort: 'Black African, Female (20\'s)',
    photographer: 'Kelechi Amadi-Obi Fine Art',
    location: 'Victoria Island, Lagos, Nigeria',
    category: 'Portraits & Fashion',
    tags: ['8k', '4k', 'Black African', 'Royal Blue', 'Crown Braids', 'Lagos', '85mm'],
    likes: 580,
    dislikes: 2,
    downloads: 245,
    shares: 140,
    rating: 4.99,
    price_credits: 50,
    license_type: 'Royalty-Free Standard',
    camera_info: {
      camera: 'Hasselblad H6D-100c',
      lens: 'HC 100mm f/2.2',
      iso: 100,
      shutter: '1/250s',
      aperture: 'f/2.2'
    },
    poll_data: {
      question: 'Which cultural aesthetic is most striking in this masterpiece?',
      options: [
        { id: 'opt-1', text: 'The braided crown and ceremonial gold hairpins', votes: 290 },
        { id: 'opt-2', text: 'The royal blue and gold embroidered cape gown', votes: 220 },
        { id: 'opt-3', text: 'The contrast of deep melanin and sunset skyline', votes: 185 }
      ],
      totalVotes: 695
    }
  },
  {
    id: 'pc-af-02',
    photo_id: 'ph-af-02',
    title: 'Eunice Emonenna Mbah - Haute Couture Nigerian Model Portrait',
    description: 'Ultra-high-definition 8K editorial beauty portrait of Nigerian supermodel Eunice Emonenna Mbah. Radiant glowing skin, sculpted features, and captivating natural elegance captured on professional 85mm lens in Lagos.',
    imageUrl: '/assets/photocredits/eunice_mbah.jpg',
    thumbnailUrl: '/assets/photocredits/eunice_mbah.jpg',
    media_type: 'image',
    cohort: 'Black African, Female (20\'s)',
    photographer: 'FingerMobile Sovereign Studios',
    location: 'Victoria Island, Lagos, Nigeria',
    category: 'Portraits & Fashion',
    tags: ['Eunice Mbah', 'Black African', 'Close-up', '8k', 'Editorial', 'Melanin', '85mm'],
    likes: 640,
    dislikes: 1,
    downloads: 275,
    shares: 135,
    rating: 4.99,
    price_credits: 55,
    license_type: 'Commercial Extended',
    camera_info: {
      camera: 'Sony A1 (50.1MP)',
      lens: 'Sony FE 85mm f/1.4 GM',
      iso: 100,
      shutter: '1/320s',
      aperture: 'f/1.4'
    },
    poll_data: {
      question: 'Best editorial placement for Eunice Emonenna Mbah master portrait?',
      options: [
        { id: 'opt-1', text: 'Global Luxury & High-Fashion Magazine Cover', votes: 345 },
        { id: 'opt-2', text: 'Decentralized Sovereign Art NFT Gallery', votes: 210 }
      ],
      totalVotes: 555
    }
  },
  {
    id: 'pc-af-03',
    photo_id: 'ph-af-03',
    title: 'Mercy Kulem - Radiant Melanin Editorial Portrait',
    description: 'Stunning 4K close-up photograph of Mercy Kulem, featuring dramatic natural lighting that accentuates her features, flawless complexion, and serene expression. Shot on a professional 85mm prime lens.',
    imageUrl: '/assets/photocredits/mercy_kulem.jpg',
    thumbnailUrl: '/assets/photocredits/mercy_kulem.jpg',
    media_type: 'image',
    cohort: 'Black African, Female (20\'s)',
    photographer: 'FingerMobile Sovereign Studios',
    location: 'Lagos, Nigeria',
    category: 'Portraits & Fashion',
    tags: ['Mercy Kulem', 'Black African', 'Radiant', 'Editorial', 'Portraits', '85mm'],
    likes: 512,
    dislikes: 2,
    downloads: 198,
    shares: 92,
    rating: 4.97,
    price_credits: 48,
    license_type: 'Royalty-Free Standard',
    camera_info: {
      camera: 'Canon EOS R5 C',
      lens: 'Canon RF 85mm f/1.2L USM',
      iso: 160,
      shutter: '1/200s',
      aperture: 'f/1.4'
    },
    poll_data: {
      question: 'Which lighting characteristic creates the highest artistic impact?',
      options: [
        { id: 'opt-1', text: 'Warm specular catchlights in eyes', votes: 260 },
        { id: 'opt-2', text: 'Soft directional studio chiaroscuro', votes: 165 }
      ],
      totalVotes: 425
    }
  },
  {
    id: 'pc-af-04-vid',
    photo_id: 'ph-af-04-vid',
    title: 'Lekki Atlantic Horizon 4K Runway Film',
    description: '4K cinema footage of the 20s Black African model striding forward on a mirrored runway over the Atlantic surf. Royal blue cape catching the sunset wind, warm golden skin tones, and ultra-high fidelity 60fps slow motion.',
    imageUrl: '/assets/photocredits/eunice_2.jpg',
    thumbnailUrl: '/assets/photocredits/eunice_2.jpg',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-smiling-at-the-camera-40618-large.mp4',
    media_type: 'video',
    cohort: 'Black African, Female (20\'s)',
    photographer: 'Eko Motion Picture Arts',
    location: 'Lagos, Nigeria',
    category: '4K Cinematic Video',
    tags: ['4K Video', 'Black African', 'Lagos', 'Runway', 'Melanin', 'Cinema'],
    likes: 620,
    dislikes: 1,
    downloads: 290,
    shares: 165,
    rating: 5.0,
    price_credits: 80,
    license_type: 'Commercial Extended',
    camera_info: {
      camera: 'ARRI Alexa 35',
      lens: 'Cooke Anamorphic /i Full Frame Plus 85mm',
      iso: 400,
      shutter: '1/120s (60fps)',
      aperture: 'T2.3'
    },
    poll_data: {
      question: 'Rate this 4K film as an entry for the 26-Day Friday Monthly Giveaway Champion:',
      options: [
        { id: 'opt-1', text: 'Undisputed 1st Place (50,000 FIC Champion)', votes: 410 },
        { id: 'opt-2', text: 'Top 3 Podium Contender', votes: 125 }
      ],
      totalVotes: 535
    }
  },

  // =========================================================================
  // AUTHENTIC FEATURED ASSETS (FingerMobile Curated Collection)
  // =========================================================================
  {
    id: 'pc-feat-01',
    photo_id: 'ph-feat-01',
    title: 'Eunice - Contemporary High-Fashion Stride II',
    description: 'Authentic 4K studio fashion shoot of Eunice. Dynamic elegance, rich textures, and editorial composure, demonstrating the sovereign power of modern African haute couture.',
    imageUrl: '/assets/photocredits/eunice_2.jpg',
    thumbnailUrl: '/assets/photocredits/eunice_2.jpg',
    media_type: 'image',
    cohort: 'Black African, Female (20\'s)',
    photographer: 'FingerMobile Sovereign Studios',
    location: 'Lagos, Nigeria',
    category: 'Portraits & Fashion',
    tags: ['Eunice', 'African Fashion', 'Studio', '4k', 'Editorial'],
    likes: 475,
    dislikes: 1,
    downloads: 162,
    shares: 80,
    rating: 4.96,
    price_credits: 50,
    license_type: 'Royalty-Free Standard',
    camera_info: {
      camera: 'Sony A7R V (61MP)',
      lens: 'Sony FE 85mm f/1.4 GM',
      iso: 100,
      shutter: '1/250s',
      aperture: 'f/1.8'
    },
    poll_data: {
      question: 'What is the standout quality of this authentic portrait?',
      options: [
        { id: 'opt-1', text: 'Natural confidence and poise', votes: 215 },
        { id: 'opt-2', text: 'Pristine color grading and sharpness', votes: 140 }
      ],
      totalVotes: 355
    }
  },
  {
    id: 'pc-feat-02',
    photo_id: 'ph-feat-02',
    title: 'Eunice - Golden Radiance Fine-Art Close-Up III',
    description: 'Intimate fine-art photograph focusing on facial symmetry, warmth, and expressive eyes under sculpted softbox lighting.',
    imageUrl: '/assets/photocredits/eunice_3.jpg',
    thumbnailUrl: '/assets/photocredits/eunice_3.jpg',
    media_type: 'image',
    cohort: 'Black African, Female (20\'s)',
    photographer: 'FingerMobile Sovereign Studios',
    location: 'Lagos, Nigeria',
    category: 'Portraits & Fashion',
    tags: ['Eunice', 'Fine-Art', 'Close-up', 'Radiance', '4k'],
    likes: 490,
    dislikes: 0,
    downloads: 180,
    shares: 95,
    rating: 4.98,
    price_credits: 52,
    license_type: 'Commercial Extended',
    camera_info: {
      camera: 'Sony A1',
      lens: 'Sony FE 85mm f/1.4 GM',
      iso: 100,
      shutter: '1/320s',
      aperture: 'f/1.4'
    },
    poll_data: {
      question: 'Ideal campaign placement for this portrait:',
      options: [
        { id: 'opt-1', text: 'Premium Skincare / Beauty Billboard', votes: 290 },
        { id: 'opt-2', text: 'Editorial Art Book Cover', votes: 145 }
      ],
      totalVotes: 435
    }
  },
  {
    id: 'pc-feat-03',
    photo_id: 'ph-feat-03',
    title: 'Eunice - Sovereign Glamour Series IV',
    description: 'High-contrast glamour composition highlighting couture styling and timeless poise.',
    imageUrl: '/assets/photocredits/eunice_4.jpg',
    thumbnailUrl: '/assets/photocredits/eunice_4.jpg',
    media_type: 'image',
    cohort: 'Black African, Female (20\'s)',
    photographer: 'FingerMobile Sovereign Studios',
    location: 'Lagos, Nigeria',
    category: 'Portraits & Fashion',
    tags: ['Eunice', 'Glamour', 'Couture', 'Lagos', 'High Fashion'],
    likes: 430,
    dislikes: 2,
    downloads: 155,
    shares: 72,
    rating: 4.93,
    price_credits: 46,
    license_type: 'Royalty-Free Standard',
    camera_info: {
      camera: 'Nikon Z9',
      lens: 'NIKKOR Z 85mm f/1.2 S',
      iso: 125,
      shutter: '1/250s',
      aperture: 'f/1.4'
    },
    poll_data: {
      question: 'Which styling element resonates strongest?',
      options: [
        { id: 'opt-1', text: 'Editorial makeup refinement', votes: 180 },
        { id: 'opt-2', text: 'Modern minimalist background framing', votes: 120 }
      ],
      totalVotes: 300
    }
  },
  {
    id: 'pc-feat-04',
    photo_id: 'ph-feat-04',
    title: 'Eunice - Signature Elegance Showcase V',
    description: 'Crisp studio portrait celebrating confidence, elegance, and sovereign creative identity.',
    imageUrl: '/assets/photocredits/eunice_5.jpg',
    thumbnailUrl: '/assets/photocredits/eunice_5.jpg',
    media_type: 'image',
    cohort: 'Black African, Female (20\'s)',
    photographer: 'FingerMobile Sovereign Studios',
    location: 'Lagos, Nigeria',
    category: 'Portraits & Fashion',
    tags: ['Eunice', 'Elegance', 'Signature', 'Studio', '85mm'],
    likes: 450,
    dislikes: 1,
    downloads: 168,
    shares: 84,
    rating: 4.95,
    price_credits: 48,
    license_type: 'Royalty-Free Standard',
    camera_info: {
      camera: 'Canon EOS R5',
      lens: 'Canon RF 85mm f/1.2L',
      iso: 100,
      shutter: '1/200s',
      aperture: 'f/1.6'
    },
    poll_data: {
      question: 'Vote for community favorite showcase:',
      options: [
        { id: 'opt-1', text: 'Top 5 Weekly Spotlight', votes: 220 },
        { id: 'opt-2', text: 'Staff Curator Pick', votes: 175 }
      ],
      totalVotes: 395
    }
  },
  {
    id: 'pc-feat-05',
    photo_id: 'ph-feat-05',
    title: 'Obinna - FingerMobile Executive & Founder Masterclass Portrait',
    description: 'Official executive high-definition portrait of Obinna, Founder & Protocol Architect of FingerMobile Protocol™. Captured in crisp studio lighting symbolizing visionary leadership in sovereign digital economies.',
    imageUrl: '/assets/photocredits/obinna_profile.jpg',
    thumbnailUrl: '/assets/photocredits/obinna_profile.jpg',
    media_type: 'image',
    cohort: 'Executive Leadership',
    photographer: 'FingerMobile Media House',
    location: 'FingerMobile HQ, Lagos',
    category: 'Leadership & Executives',
    tags: ['Obinna', 'Founder', 'FingerMobile', 'Executive', 'Protocol', 'Visionary'],
    likes: 1250,
    dislikes: 0,
    downloads: 580,
    shares: 340,
    rating: 5.0,
    price_credits: 100,
    license_type: 'Commercial Extended',
    camera_info: {
      camera: 'Hasselblad H6D-100c',
      lens: 'HC 100mm f/2.2',
      iso: 64,
      shutter: '1/250s',
      aperture: 'f/2.8'
    },
    poll_data: {
      question: 'Which milestone makes FingerMobile most revolutionary?',
      options: [
        { id: 'opt-1', text: '80% guaranteed sovereign creator royalty payouts', votes: 580 },
        { id: 'opt-2', text: 'Universal cross-platform protocol interoperability', votes: 410 },
        { id: 'opt-3', text: 'Decentralized 26-Day Friday UGC giveaway engine', votes: 320 }
      ],
      totalVotes: 1310
    }
  },
  {
    id: 'pc-feat-06',
    photo_id: 'ph-feat-06',
    title: 'FingerMobile Curated Protocol Masterpiece',
    description: 'High-definition editorial master photograph from the official FingerMobile PhotoCredits archival vault.',
    imageUrl: '/assets/photocredits/sample_photocredits.jpg',
    thumbnailUrl: '/assets/photocredits/sample_photocredits.jpg',
    media_type: 'image',
    cohort: 'Curated Masterpiece',
    photographer: 'FingerMobile Protocol Archives',
    location: 'Decentralized Sovereign Ledger',
    category: 'Architecture',
    tags: ['Masterpiece', 'Archival', 'FingerMobile', '8k', '4k'],
    likes: 670,
    dislikes: 2,
    downloads: 295,
    shares: 110,
    rating: 4.96,
    price_credits: 55,
    license_type: 'Royalty-Free Standard',
    camera_info: {
      camera: 'Leica SL2',
      lens: 'Leica APO-Summicron-SL 75mm f/2 ASPH',
      iso: 100,
      shutter: '1/500s',
      aperture: 'f/2.8'
    },
    poll_data: {
      question: 'Select ideal licensing use case:',
      options: [
        { id: 'opt-1', text: 'Web3 dApp Hero Artwork', votes: 230 },
        { id: 'opt-2', text: 'High-Impact Editorial Publication', votes: 180 }
      ],
      totalVotes: 410
    }
  }
];
