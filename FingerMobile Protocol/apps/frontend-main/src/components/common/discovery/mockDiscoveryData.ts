import { SharedInterestMember, LapidaireQuestionItem } from './types';

export const BEATWAVE_DISCOVERY_MEMBERS: SharedInterestMember[] = [
  {
    id: 'bw-mem-1',
    name: 'Amina Bello',
    handle: '@amina_sounds',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    verified: true,
    ninVerified: true,
    location: 'Lagos, Nigeria',
    bio: 'Audiophile & vinyl collector. Obsessed with live acoustic brass, talking drums, and Afro-Futurist lo-fi jazz.',
    compatibilityScore: 98,
    memberTier: 'Sovereign',
    isOnline: true,
    colaboPinExchanged: false,
    sharedInterests: [
      { id: 'si-1', category: 'same_album', label: 'Same Album', value: 'Timeless (Davido)', icon: '💿' },
      { id: 'si-2', category: 'same_artist', label: 'Same Artist', value: 'Asake', icon: '🎤' },
      { id: 'si-3', category: 'same_concert', label: 'Same Concert', value: 'Felabration 2026 Live Arena', icon: '🎟️' },
      { id: 'si-4', category: 'same_ai_playlist', label: 'Same AI Playlist', value: 'Afro-Futurism Highlife Stems', icon: '✨' },
      { id: 'si-5', category: 'same_album_cover', label: 'Same Album Cover', value: 'Yoruba Cyber-Bronze Mask Aesthetics', icon: '🎨' },
      { id: 'si-6', category: 'same_song', label: 'Same Song', value: 'Lonely At The Top', icon: '🎵' }
    ],
    lapidaireAnswers: [
      {
        questionId: 1,
        category: 'Acoustic Philosophy',
        question: 'What acoustic gear defines your sacred listening ritual?',
        answer: 'Open-back planar magnetic headphones paired with a 24-bit/192kHz DAC, immersed in dark room acoustics.'
      },
      {
        questionId: 2,
        category: 'Live Experience',
        question: 'What concert memory gives you goosebumps to this day?',
        answer: 'The sunset drum breakdown at Felabration when 12 percussionists locked into a hypnotic sovereign polyrhythm.'
      }
    ],
    favoriteMedia: {
      title: 'Timeless Master Edition',
      subtitle: 'Davido • 24-bit Lossless FLAC',
      type: 'audio',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
      extraBadge: 'Lossless 192kHz'
    }
  },
  {
    id: 'bw-mem-2',
    name: 'Chidi Okafor',
    handle: '@chidi_vibes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    verified: true,
    ninVerified: true,
    location: 'Abuja & London',
    bio: 'Music curator and sound architect. Building collaborative VirDrive playlists with creators across continents.',
    compatibilityScore: 95,
    memberTier: 'Pro Creator',
    isOnline: true,
    colaboPinExchanged: false,
    sharedInterests: [
      { id: 'si-7', category: 'same_artist', label: 'Same Artist', value: 'Burna Boy', icon: '🎤' },
      { id: 'si-8', category: 'same_album', label: 'Same Album', value: 'African Giant', icon: '💿' },
      { id: 'si-9', category: 'same_song', label: 'Same Song', value: 'Last Last & Ye', icon: '🎵' },
      { id: 'si-10', category: 'same_ai_music', label: 'Same AI Music', value: 'Pidgin Griot Lo-Fi Beats', icon: '🤖' },
      { id: 'si-11', category: 'same_recommendation', label: 'Same Recommendation', value: 'SoundOcean Studio Master Library', icon: '🌊' },
      { id: 'si-12', category: 'same_event', label: 'Same Event', value: 'Afro Nation Portugal 2026', icon: '🌍' }
    ],
    lapidaireAnswers: [
      {
        questionId: 3,
        category: 'Colabo Ethics',
        question: 'How do you curate shared Colabo+ playlists with fellow members?',
        answer: 'Zero ego: every member brings one rare gem a day, and we vote through encrypted sovereign PINs.'
      }
    ],
    favoriteMedia: {
      title: 'African Giant (Deluxe)',
      subtitle: 'Burna Boy • Atlantic / Spaceship',
      type: 'audio',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
      extraBadge: 'Grammy Winner'
    }
  },
  {
    id: 'bw-mem-3',
    name: 'Zainab Diallo',
    handle: '@zainab_acoustics',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    verified: true,
    ninVerified: true,
    location: 'Dakar & Paris',
    bio: 'Vocal trainer, neo-soul composer, and podcast host. Exploring Sahelian strings and soulful rhythms.',
    compatibilityScore: 93,
    memberTier: 'Sovereign',
    isOnline: false,
    colaboPinExchanged: false,
    sharedInterests: [
      { id: 'si-13', category: 'same_artist', label: 'Same Artist', value: 'Tems', icon: '🎤' },
      { id: 'si-14', category: 'same_ai_playlist', label: 'Same AI Playlist', value: 'Cosmic Griot Odyssey', icon: '✨' },
      { id: 'si-15', category: 'same_album_cover', label: 'Same Album Cover', value: 'Sahelian Sunset Minimalist Gold', icon: '🎨' },
      { id: 'si-16', category: 'same_concert', label: 'Same Concert', value: 'Flytime Fest Eko Convention', icon: '🎟️' },
      { id: 'si-17', category: 'same_playlist', label: 'Same Playlist', value: 'Deep Acoustic Soul Sessions', icon: '🎧' }
    ],
    lapidaireAnswers: [
      {
        questionId: 4,
        category: 'Songwriting Spirit',
        question: 'What sparks your most authentic musical resonance?',
        answer: 'Unprocessed acoustic kora mixed with warm sub-bass in the dead of the night.'
      }
    ],
    favoriteMedia: {
      title: 'Born in the Wild',
      subtitle: 'Tems • RCA Records',
      type: 'audio',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      extraBadge: 'Spatial Audio'
    }
  },
  {
    id: 'bw-mem-4',
    name: 'Femi Adeleke',
    handle: '@femi_grooves',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    verified: true,
    ninVerified: false,
    location: 'Ibadan & Toronto',
    bio: 'Afrobeat historian, DJ, and brass synthesizer specialist. Preserving 1970s Kalakuta vinyl masters.',
    compatibilityScore: 91,
    memberTier: 'Founding Pioneer',
    isOnline: true,
    colaboPinExchanged: false,
    sharedInterests: [
      { id: 'si-18', category: 'same_artist', label: 'Same Artist', value: 'Fela Kuti & Egypt 80', icon: '🎷' },
      { id: 'si-19', category: 'same_album', label: 'Same Album', value: 'Zombie / Sorrow Tears & Blood', icon: '💿' },
      { id: 'si-20', category: 'same_ai_music', label: 'Same AI Music', value: 'Analog Tape Saturation 1978', icon: '🤖' },
      { id: 'si-21', category: 'same_recommendation', label: 'Same Recommendation', value: 'Highlife Pioneers Rediscovery', icon: '📻' },
      { id: 'si-22', category: 'same_album_cover', label: 'Same Album Cover', value: 'Lemi Ghariokwu Hand-Painted Covers', icon: '🎨' }
    ],
    lapidaireAnswers: [
      {
        questionId: 5,
        category: 'Heritage Roots',
        question: 'Why does analog Afrobeat hold timeless power?',
        answer: 'Because Fela composed for liberation, not for algorithms. The horn arrangements speak directly to the pulse.'
      }
    ],
    favoriteMedia: {
      title: 'Water No Get Enemy',
      subtitle: 'Fela Kuti • Master Restoration',
      type: 'audio',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
      extraBadge: 'Master Tape 1975'
    }
  },
  {
    id: 'bw-mem-5',
    name: 'Ngozi Eze',
    handle: '@ngozi_melodies',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    verified: true,
    ninVerified: true,
    location: 'Enugu & New York',
    bio: 'Indie vocalist and AI audio prompt designer. Crafting 30-day temporal audio novels and spoken word.',
    compatibilityScore: 94,
    memberTier: 'Sovereign',
    isOnline: false,
    colaboPinExchanged: false,
    sharedInterests: [
      { id: 'si-23', category: 'same_album', label: 'Same Album', value: 'Lungu Boy (Asake)', icon: '💿' },
      { id: 'si-24', category: 'same_artist', label: 'Same Artist', value: 'Omah Lay', icon: '🎤' },
      { id: 'si-25', category: 'same_concert', label: 'Same Concert', value: 'Flytime Fest Eko Convention', icon: '🎟️' },
      { id: 'si-26', category: 'same_ai_playlist', label: 'Same AI Playlist', value: 'Acoustic Soul Resonance', icon: '✨' },
      { id: 'si-27', category: 'same_song', label: 'Same Song', value: 'MMS (Asake & Wizkid)', icon: '🎵' }
    ],
    lapidaireAnswers: [
      {
        questionId: 6,
        category: 'Storytelling',
        question: 'How do you view AI-Assisted AudioNovels?',
        answer: 'A sovereign vehicle for modern African oral traditions, carrying ancestral warmth to global listeners.'
      }
    ],
    favoriteMedia: {
      title: 'Lungu Boy',
      subtitle: 'Asake • YBNL / Empire',
      type: 'audio',
      imageUrl: 'https://images.unsplash.com/photo-1445985543470-41fdd6ce388d?w=400',
      extraBadge: 'Billboard #1'
    }
  },
  {
    id: 'bw-mem-6',
    name: 'Kwame Mensah',
    handle: '@kwame_beats',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    verified: true,
    ninVerified: true,
    location: 'Accra, Ghana',
    bio: 'Producer, drill architect, and sound designer. Experimenting with Ghanaian Palmwine and Highlife synths.',
    compatibilityScore: 89,
    memberTier: 'Pro Creator',
    isOnline: true,
    colaboPinExchanged: false,
    sharedInterests: [
      { id: 'si-28', category: 'same_artist', label: 'Same Artist', value: 'Black Sherif', icon: '🎤' },
      { id: 'si-29', category: 'same_album', label: 'Same Album', value: 'The Villain I Never Was', icon: '💿' },
      { id: 'si-30', category: 'same_ai_music', label: 'Same AI Music', value: 'Ghanaian Drill Synthesizer Stems', icon: '🤖' },
      { id: 'si-31', category: 'same_playlist', label: 'Same Playlist', value: 'West Coast Highlife & Drill Fusion', icon: '🎧' },
      { id: 'si-32', category: 'same_event', label: 'Same Event', value: 'Afrochella / Afro Future 2026', icon: '🌍' }
    ],
    lapidaireAnswers: [
      {
        questionId: 7,
        category: 'Sovereign Audio',
        question: 'What is the most liberating aspect of decentralized music protocol?',
        answer: 'Zero middleman exploitation. Creators hold their keys, fans share directly via VirDrive, and sound stays pure.'
      }
    ],
    favoriteMedia: {
      title: 'Kwaku the Hustler Master',
      subtitle: 'Black Sherif • Highlife Drill',
      type: 'audio',
      imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400',
      extraBadge: 'Lossless Studio'
    }
  }
];

export const DANCIA_DISCOVERY_MEMBERS: SharedInterestMember[] = [
  {
    id: 'dc-mem-1',
    name: 'Tunde Bakare',
    handle: '@tunde_cinema',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
    verified: true,
    ninVerified: true,
    location: 'Lagos, Nigeria',
    bio: 'Cinematographer & colourist. Filming high-contrast Nigerian noir, 4K anamorphic lens trials, and visual poetry.',
    compatibilityScore: 98,
    memberTier: 'Sovereign',
    isOnline: true,
    colaboPinExchanged: false,
    sharedInterests: [
      { id: 'dsi-1', category: 'same_movie', label: 'Same Movie', value: 'Lekki Tollgate Midnight', icon: '🎬' },
      { id: 'dsi-2', category: 'same_director', label: 'Same Director', value: 'Kunle Afolayan', icon: '🎥' },
      { id: 'dsi-3', category: 'same_genre', label: 'Same Cinema Genre', value: 'Afro-Futurist Noir', icon: '🎞️' },
      { id: 'dsi-4', category: 'same_premiere', label: 'Same Premiere / Event', value: 'Africa Movie Academy Awards 2026 Live', icon: '🏆' },
      { id: 'dsi-5', category: 'same_watchlist', label: 'Same Watchlist', value: 'Sovereign 4K Transcoding Ingests', icon: '📺' }
    ],
    lapidaireAnswers: [
      {
        questionId: 101,
        category: 'Visual Directing',
        question: 'What visual element makes a scene unforgettable?',
        answer: 'Practical amber street-lighting bouncing off rain-slicked asphalt in midnight Lagos with slow tracking shots.'
      },
      {
        questionId: 102,
        category: 'Cinema Ethos',
        question: 'How do you define African cinematic sovereignty?',
        answer: 'Owning our visual archive on decentralized storage, untouched by Hollywood censors or streaming gatekeepers.'
      }
    ],
    favoriteMedia: {
      title: 'Lekki Tollgate Midnight',
      subtitle: 'Dir: Kunle Afolayan • 4K HDR',
      type: 'video',
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400',
      extraBadge: '4K Ultra HD'
    }
  },
  {
    id: 'dc-mem-2',
    name: 'Simi Adeleke',
    handle: '@simi_screens',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    verified: true,
    ninVerified: true,
    location: 'London & Ibadan',
    bio: 'Screenwriter and indie film distributor. Passionate about female-led African thrillers and live watch parties.',
    compatibilityScore: 96,
    memberTier: 'Pro Creator',
    isOnline: true,
    colaboPinExchanged: false,
    sharedInterests: [
      { id: 'dsi-6', category: 'same_movie', label: 'Same Movie', value: 'The Cyber-Heist of Marina Wharf', icon: '🎬' },
      { id: 'dsi-7', category: 'same_director', label: 'Same Director', value: 'Kemi Adetiba', icon: '🎥' },
      { id: 'dsi-8', category: 'same_genre', label: 'Same Genre', value: 'Mainland Street Action Thriller', icon: '💥' },
      { id: 'dsi-9', category: 'same_video_stem', label: 'Same Video Stem', value: 'Temporal 3-Day Raw Film Reels', icon: '⏱️' },
      { id: 'dsi-10', category: 'same_watchlist', label: 'Same Watchlist', value: 'Dancia Sovereign Action Collection', icon: '🍿' }
    ],
    lapidaireAnswers: [
      {
        questionId: 103,
        category: 'Screenplay Rhythm',
        question: 'What gives a heist film genuine pulse?',
        answer: 'Unapologetic local dialogue, high stakes grounded in economic reality, and relentless pacing.'
      }
    ],
    favoriteMedia: {
      title: 'The Cyber-Heist of Marina Wharf',
      subtitle: 'Dir: Kemi Adetiba • Dolby Atmos',
      type: 'video',
      imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
      extraBadge: 'Dolby Atmos'
    }
  },
  {
    id: 'dc-mem-3',
    name: 'Emeka Nwosu',
    handle: '@emeka_films',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400',
    verified: true,
    ninVerified: true,
    location: 'Enugu & Berlin',
    bio: 'Documentary filmmaker and folklorist. Capturing indigenous Igbo masquerades and mythological cinema.',
    compatibilityScore: 92,
    memberTier: 'Founding Pioneer',
    isOnline: false,
    colaboPinExchanged: false,
    sharedInterests: [
      { id: 'dsi-11', category: 'same_movie', label: 'Same Movie', value: 'Anikulapo: Rise of the Phoenix', icon: '🎬' },
      { id: 'dsi-12', category: 'same_director', label: 'Same Director', value: 'Tunde Kelani', icon: '🎥' },
      { id: 'dsi-13', category: 'same_genre', label: 'Same Genre', value: 'Yoruba Mythological Epic', icon: '🔥' },
      { id: 'dsi-14', category: 'same_premiere', label: 'Same Premiere', value: 'Lagos International Film Festival', icon: '🏆' },
      { id: 'dsi-15', category: 'same_video_stem', label: 'Same Video Stem', value: 'Indigenous Costume B-Roll Masters', icon: '👘' }
    ],
    lapidaireAnswers: [
      {
        questionId: 104,
        category: 'Mythology in Film',
        question: 'Why do ancestral epics resonate so powerfully in 2026?',
        answer: 'Because African mythology contains quantum metaphors for spiritual balance, nature, and human destiny.'
      }
    ],
    favoriteMedia: {
      title: 'Anikulapo Epics',
      subtitle: 'Dir: Tunde Kelani • Historical Epic',
      type: 'video',
      imageUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400',
      extraBadge: 'Festival Laurels'
    }
  },
  {
    id: 'dc-mem-4',
    name: 'Fatima Al-Hassan',
    handle: '@fatima_directs',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    verified: true,
    ninVerified: true,
    location: 'Kano & Dubai',
    bio: 'Sahelian film pioneer and drone cinematographer. Documenting desert nomad caravan trails.',
    compatibilityScore: 94,
    memberTier: 'Sovereign',
    isOnline: true,
    colaboPinExchanged: false,
    sharedInterests: [
      { id: 'dsi-16', category: 'same_movie', label: 'Same Movie', value: 'Echoes of the Sahara', icon: '🎬' },
      { id: 'dsi-17', category: 'same_genre', label: 'Same Genre', value: 'Sahelian Docu-Drama', icon: '🏜️' },
      { id: 'dsi-18', category: 'same_live_stream', label: 'Same Live Stream', value: 'Dancia Sovereign News Desk Live', icon: '📡' },
      { id: 'dsi-19', category: 'same_watchlist', label: 'Same Watchlist', value: 'High-Definition Northern Film Canon', icon: '📺' }
    ],
    lapidaireAnswers: [
      {
        questionId: 105,
        category: 'Documentary Truth',
        question: 'What is the responsibility of the non-fiction filmmaker?',
        answer: 'To let the subjects tell their truths without patronizing Western voiceovers or framing.'
      }
    ],
    favoriteMedia: {
      title: 'Echoes of the Sahara',
      subtitle: 'Dir: Fatima Al-Hassan • 4K Drone Footage',
      type: 'video',
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
      extraBadge: '4K Drone'
    }
  },
  {
    id: 'dc-mem-5',
    name: 'David Adeleke',
    handle: '@david_visuals',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    verified: true,
    ninVerified: false,
    location: 'Abuja, Nigeria',
    bio: 'Independent action choreographer and VFX animator. Creating 3D virtual film sets on Dancia-4Tv.',
    compatibilityScore: 90,
    memberTier: 'Pro Creator',
    isOnline: false,
    colaboPinExchanged: false,
    sharedInterests: [
      { id: 'dsi-20', category: 'same_movie', label: 'Same Movie', value: 'Underground Lagos Street Cypher', icon: '🎬' },
      { id: 'dsi-21', category: 'same_director', label: 'Same Director', value: 'Genevieve Nnaji', icon: '🎥' },
      { id: 'dsi-22', category: 'same_genre', label: 'Same Genre', value: 'Urban Indie Documentary', icon: '🏙️' },
      { id: 'dsi-23', category: 'same_video_stem', label: 'Same Video Stem', value: 'Raw 4K Camera B-Roll', icon: '📽️' }
    ],
    lapidaireAnswers: [
      {
        questionId: 106,
        category: 'Action Choreography',
        question: 'What separates cheap stunts from genuine cinema combat?',
        answer: 'Spatial geography and emotional stakes: every punch must advance the character arc.'
      }
    ],
    favoriteMedia: {
      title: 'Underground Street Cypher',
      subtitle: 'Dir: Mainland Boyz • 1080p Full HD',
      type: 'video',
      imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
      extraBadge: 'Action Cut'
    }
  }
];

export const BEATWAVE_LAPIDAIRE_QUESTIONS: LapidaireQuestionItem[] = [
  {
    id: 1,
    domain: 'beatwaveng',
    category: 'Acoustic Rituals',
    question: 'What is your sacred listening environment of choice?',
    options: [
      'Midnight dark room with audiophile planar headphones & DAC',
      'Open highway road trip with subwoofers vibrating the chassis',
      'Intimate acoustic lounge with live talking drums and brass',
      'Communal balcony gathering with friends sharing a high-res speaker'
    ],
    resonanceImpact: '+12% Acoustic Alignment'
  },
  {
    id: 2,
    domain: 'beatwaveng',
    category: 'Colabo+ & VirDrive',
    question: 'What is your primary rule when collaborating on shared playlists?',
    options: [
      'Strict quality curation: Only uncompressed lossless tracks allowed',
      'Eclectic diversity: Blending highlife, amapiano, and drill fearlessly',
      'Mood coherence: Every transition must feel like a cinematic journey',
      'Democracy by vote: Every member exchanges PINs to add their anthem'
    ],
    resonanceImpact: '+15% Colabo Compatibility'
  },
  {
    id: 3,
    domain: 'beatwaveng',
    category: 'Concert & Energy',
    question: 'Which live music experience resonates with your soul most?',
    options: [
      'Euphoric 50,000-person stadium festival with pyrotechnics',
      'Ancestral midnight shrine at Felabration with brass solos',
      'Secret underground acoustic jazz cellar with 40 people',
      'Sunrise beach rave with amapiano log drums rolling over waves'
    ],
    resonanceImpact: '+14% Energy Resonance'
  },
  {
    id: 4,
    domain: 'beatwaveng',
    category: 'Sovereign Music Philosophy',
    question: 'How do you perceive decentralized protocol music ownership?',
    options: [
      'Empowering artists with direct micropayments and zero corporate rent',
      'Permanent uncensored cultural preservation on sovereign nodes',
      'High-fidelity lossless playback without algorithmic downgrade',
      'Community ownership of master stems and collaborative remixing'
    ],
    resonanceImpact: '+18% Sovereign Alignment'
  },
  {
    id: 5,
    domain: 'beatwaveng',
    category: 'AI Griot & Storytelling',
    question: 'What role should AI play in contemporary African oral storytelling?',
    options: [
      'Amplifying ancient folktales through realistic Pidgin and Yoruba vocal cadences',
      'Generating rich background instrumentation for spoken word artists',
      'Translating indigenous poetry across universal plain English and world languages',
      'Assisting independent creators in mastering 30-minute AudioNovels'
    ],
    resonanceImpact: '+11% Creative Resonance'
  }
];

export const DANCIA_LAPIDAIRE_QUESTIONS: LapidaireQuestionItem[] = [
  {
    id: 101,
    domain: 'dancia4tv',
    category: 'Cinema Environment',
    question: 'What is your ideal setup for experiencing premier cinema?',
    options: [
      'Darkened home theater with 4K HDR projection and spatial surround sound',
      'Historic cinema auditorium with a buzzing, vocal, reactive audience',
      'Private watch-party streaming room synchronized with fellow film buffs',
      'Quiet late-night tablet viewing with high-end noise-cancelling headphones'
    ],
    resonanceImpact: '+14% Cinema Ritual'
  },
  {
    id: 102,
    domain: 'dancia4tv',
    category: 'Directorial Taste',
    question: 'What directorial quality commands your deepest respect?',
    options: [
      'Uncompromising visual framing and practical lighting without CGI reliance',
      'Deep character empathy and naturalistic, authentic indigenous dialogue',
      'Daring nonlinear narratives and thought-provoking philosophical endings',
      'Relentless tension, explosive choreography, and masterclass audio pacing'
    ],
    resonanceImpact: '+16% Directorial Alignment'
  },
  {
    id: 103,
    domain: 'dancia4tv',
    category: 'Watch Party Etiquette',
    question: 'What is your stance during a high-stakes cinema premiere?',
    options: [
      'Dead silence until credits roll; every breath must honor the filmmaker',
      'Lively real-time commentary, collective gasps, and passionate banter',
      'Taking detailed notes on cinematography, colour grading, and sound cues',
      'Snacking and pausing occasionally to dissect plot twists with the room'
    ],
    resonanceImpact: '+12% Watch-Party Chemistry'
  },
  {
    id: 104,
    domain: 'dancia4tv',
    category: 'Sovereign Cinema Ethos',
    question: 'Why is sovereign video broadcasting vital for the African continent?',
    options: [
      'Breaking the monopoly of international streamers who undervalue local stories',
      'Preserving uncensored historical and investigative footage on decentralized rails',
      'Allowing independent filmmakers to keep 100% of box office and token revenue',
      'Fostering peer-to-peer distribution of temporal 3-day and 7-day raw film drops'
    ],
    resonanceImpact: '+20% Sovereign Alignment'
  },
  {
    id: 105,
    domain: 'dancia4tv',
    category: 'Genre Resonance',
    question: 'Which cinematic universe would you choose to inhabit for a weekend?',
    options: [
      'Neo-Lagos 2077 Afro-Futurist Cyberpunk metropolis with flying danfos',
      'Ancient Yoruba kingdom filled with warriors, divine orishas, and sacred bronze',
      'High-octane Marina Wharf heist with elite sovereign hackers and fast boats',
      'Soulful Sahelian documentary caravan under the vast starry desert sky'
    ],
    resonanceImpact: '+15% Universe Resonance'
  }
];
