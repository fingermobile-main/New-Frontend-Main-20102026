import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Award,
  Gift,
  Crown,
  Music,
  Film,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Menu,
} from 'lucide-react';

interface ShowcaseItem {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  narrative: string;
  image: string;
  fallbackImage: string;
  link: string;
  ctaText: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderAccent: string;
  badgeStyle: string;
  glowColor: string;
  tags: string[];
}

const TOP_ROW_ITEMS: ShowcaseItem[] = [
  {
    id: 'forum',
    name: 'Forum',
    badge: 'Decentralized Town Square',
    tagline: 'Community Debates & Topic Channels',
    narrative:
      'The sovereign town square for ideas, knowledge, and real-time community engagement. Join vibrant topic channels, debate verified threads, follow hashtags, and connect with global thinkers across decentralized threads.',
    image: '/assets/showcase/fourm_screen_uhd.jpg',
    fallbackImage:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=85',
    link: '/forum',
    ctaText: 'Enter Forum',
    icon: MessageSquare,
    accentColor: 'from-emerald-500/20 to-teal-500/5',
    borderAccent: 'group-hover:border-emerald-400/60',
    badgeStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    tags: [
      'Active Discussion Threads',
      'Trending #Hashtags',
      'Verified Channels',
    ],
  },
  {
    id: 'hallmarks',
    name: 'HallMarks',
    badge: 'Official Verification & Merit',
    tagline: 'Milestone Trophies & Reputation',
    narrative:
      'The official recognition and verification standard of FingerMobile. Earn prestige credentials, track reputation scores, unlock gold and platinum milestone trophy tiers, and establish immutable authenticity across the platform.',
    image: '/assets/showcase/hallmarks_screen_uhd.jpg',
    fallbackImage:
      'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?w=1200&auto=format&fit=crop&q=85',
    link: '/hallmarks',
    ctaText: 'View HallMarks',
    icon: Award,
    accentColor: 'from-amber-500/20 to-yellow-500/5',
    borderAccent: 'group-hover:border-amber-400/60',
    badgeStyle: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    tags: [
      'Verified Creator Badges',
      'Milestone Trophies',
      'Reputation 985/1000',
    ],
  },
  {
    id: 'lushpressies',
    name: 'Lush-Pressies',
    badge: 'Luxury Gifting & Romance',
    tagline: '3D Plushies & Creator Rewards',
    narrative:
      'Next-generation digital gifting, meaningful connections, and luxury creator rewards. Surprise loved ones with 3D animated plushies, send radiant emerald gift boxes, tip your favorite creators, and experience gamified romance and appreciation.',
    image: '/assets/showcase/lushpressies_screen_uhd.jpg?v=2',
    fallbackImage:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&auto=format&fit=crop&q=85',
    link: '/lushpressies',
    ctaText: 'Explore Lush-Pressies',
    icon: Gift,
    accentColor: 'from-rose-500/20 to-emerald-500/10',
    borderAccent: 'group-hover:border-rose-400/60',
    badgeStyle: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    tags: [
      '3D Collectible Plushies',
      'Radiant Emerald Boxes',
      'Creator Tipping Tokens',
    ],
  },
];

const BOTTOM_ROW_ITEMS: ShowcaseItem[] = [
  {
    id: 'fingerlux',
    name: 'FingerLux',
    badge: 'VIP Hospitality & Charters',
    tagline: 'Chauffeur Escorts & Luxury Villas',
    narrative:
      'Ultra-luxury hospitality, chauffeur airport escorts, and private estate bookings. Experience armored VIP fleet transfers, superyacht charters, presidential oceanfront villas, and seamless FIC token settlement.',
    image: '/assets/showcase/fingerlux_screen_uhd.jpg',
    fallbackImage:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&auto=format&fit=crop&q=85',
    link: '/fingerlux',
    ctaText: 'Discover FingerLux',
    icon: Crown,
    accentColor: 'from-cyan-500/20 to-blue-500/5',
    borderAccent: 'group-hover:border-cyan-400/60',
    badgeStyle: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    tags: [
      'Chauffeur Airport Escorts',
      'Superyacht Charters',
      'FIC Token Settlement',
    ],
  },
  {
    id: 'beatwaveng',
    name: 'BeatwaveNG',
    badge: 'Sovereign Music & Audio Studio',
    tagline: 'SoundRiver Hi-Fi & 70+ Genres',
    narrative:
      'Sovereign music streaming, audio production, and beat distribution. Immerse yourself in SoundRiver and SoundOcean lossless tiers, 10-band equalizer, live taste stations, and 70+ genres from Afrobeats to global sounds.',
    image: '/assets/showcase/beatwaveng_screen_uhd.jpg',
    fallbackImage:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=85',
    link: '/beatwaveng',
    ctaText: 'Launch BeatwaveNG',
    icon: Music,
    accentColor: 'from-emerald-500/20 to-violet-500/10',
    borderAccent: 'group-hover:border-emerald-400/60',
    badgeStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    tags: ['SoundRiver Hi-Fi', '70+ Curated Genres', '10-Band Equalizer'],
  },
  {
    id: 'dancia4tv',
    name: 'Dancia-4Tv',
    badge: '4K Cinema & TV Network',
    tagline: 'Multi-VoD & AI Movie Studios',
    narrative:
      'High-definition cinematic streaming and creator television network. Watch SVoD, TVoD, and AI Studio movie premieres, celebrate Nollywood and international films in stunning 4K UHD with interactive playback.',
    image: '/assets/showcase/dancia4tv_screen_uhd.jpg',
    fallbackImage:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=85',
    link: '/dancia4tv',
    ctaText: 'Stream Dancia-4Tv',
    icon: Film,
    accentColor: 'from-amber-500/20 to-rose-500/10',
    borderAccent: 'group-hover:border-amber-400/60',
    badgeStyle: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    tags: ['4K UHD Cinema Stream', 'SVoD & TVoD Premiere', 'AI Movie Studios'],
  },
  {
    id: 'ownit',
    name: 'OwnIt',
    badge: 'Celebrity Red-Carpet Mall',
    tagline: 'Haute Horology & Provenance',
    narrative:
      'Celebrity red-carpet luxury shopping mall and haute atelier storefronts. Discover curated high horology, bespoke suiting, and fine jewelry backed by cryptographic SHA-256 authenticity provenance certificates.',
    image: '/assets/showcase/ownit_screen_uhd.jpg',
    fallbackImage:
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&auto=format&fit=crop&q=85',
    link: '/ownit',
    ctaText: 'Shop OwnIt',
    icon: ShoppingBag,
    accentColor: 'from-purple-500/20 to-amber-500/10',
    borderAccent: 'group-hover:border-purple-400/60',
    badgeStyle: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    tags: [
      'Haute Couture & Timepieces',
      'Celebrity Pavilions',
      'SHA-256 Certificates',
    ],
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-white font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      {/* Background Graphic Layer */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transform scale-105"
        style={{
          backgroundImage: 'url(\'/assets/FingerMobile-Login-screen-Background-image.webp\'), url(\'/assets/branding/backgrounds/FingerMobile Login screen Background image.webp\')',
        }}
        aria-hidden="true"
      />

      {/* Dark Ambient Glassmorphism Vignette */}
      <div
        className="fixed inset-0 z-0 bg-gradient-to-b from-black/80 via-zinc-950/80 to-black/95 backdrop-blur-[2px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Radial Glow Highlights */}
      <div
        className="fixed -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 right-10 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Main Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <header className="w-full border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Orange Burger Menu / Drawer Button */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-drawer-menu'))}
                className="p-2 -ml-2 rounded-xl text-[#ff6b00] hover:text-[#ff8533] hover:bg-orange-500/10 transition flex items-center justify-center mr-1 focus:outline-none cursor-pointer"
                aria-label="Open Navigation Drawer"
                title="Platform Navigation (385 Pages / 230+ Screens)"
              >
                <Menu className="w-6 h-6 text-[#ff6b00]" />
              </button>

              {/* Header H1 with FingerMobile Orange Logo */}
              <h1 className="flex items-center">
                <Link to="/" className="flex items-center gap-3.5 group">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
                    <img
                      src="/assets/branding/fingermobile/logo-orange.webp"
                      alt="FingerMobile Orange Logo"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/logos/fingermobile_logo.webp';
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tight text-white group-hover:text-[#ff6b00] transition-colors">
                      FingerMobile<span className="text-[#ff6b00]">™</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#ff6b00]/90 -mt-1">
                      Protocol
                    </span>
                  </div>
                </Link>
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-1.5 text-xs font-bold text-zinc-100">
              <Link
                to="/forum"
                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
              >
                Forum
              </Link>
              <Link
                to="/hallmarks"
                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
              >
                HallMarks
              </Link>
              <Link
                to="/lushpressies"
                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
              >
                Lush-Pressies
              </Link>
              <Link
                to="/fingerlux"
                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
              >
                FingerLux
              </Link>
              <Link
                to="/beatwaveng"
                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
              >
                BeatwaveNG
              </Link>
              <Link
                to="/dancia4tv"
                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
              >
                Dancia-4Tv
              </Link>
              <Link
                to="/ownit"
                className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
              >
                OwnIt
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold text-white hover:text-emerald-300 transition-colors border border-white/20 hover:border-white/40 rounded-xl bg-white/10 backdrop-blur"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Header Section */}
        <section className="pt-12 pb-8 sm:pt-16 sm:pb-12 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold tracking-wide uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-300" />
            <span>Sovereign Platform Ecosystem • 7 Core Modules</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">
              FingerMobile
            </span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-zinc-100 font-semibold max-w-3xl mx-auto leading-relaxed">
            Connect, share, and grow with our innovative social platform.
          </p>

          <p className="mt-3 text-sm text-zinc-200 font-medium max-w-2xl mx-auto leading-relaxed">
            Experience the complete two-tier platform showcase — curated
            community discourse, verified merits, bespoke gifting, VIP
            hospitality, high-fidelity music, 4K cinema, and celebrity
            red-carpet commerce.
          </p>
        </section>

        {/* Showcase Grid: Two (2) Rows, Seven (7) Cards */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full space-y-12">
          {/* Row 1 Header & 3 Cards */}
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30">
                  R1
                </span>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Top Row: Community, Recognition & Luxury Gifting
                  </h2>
                  <p className="text-xs text-zinc-200 font-medium">
                    Three (3) foundational interactive modules powering member
                    connection
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-zinc-200">
                3 Screen Modules
              </span>
            </div>

            {/* Top Row: Exactly 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {TOP_ROW_ITEMS.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <article
                    key={item.id}
                    className={`group relative flex flex-col rounded-2xl bg-zinc-900/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-white/15 ${item.borderAccent} shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex-1 overflow-hidden`}
                    style={{
                      boxShadow: `0 10px 30px -10px ${item.glowColor}`,
                    }}
                  >
                    {/* Top Row Badge Index */}
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-white/20 text-[11px] font-black text-white">
                      <span className="text-emerald-400">0{index + 1}</span>
                      <span className="text-zinc-400">•</span>
                      <span>{item.name}</span>
                    </div>

                    {/* UHD Graphic Container (16:9 Aspect Ratio) */}
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                      <img
                        src={item.image}
                        alt={`${item.name} UHD Screen Showcase`}
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== item.fallbackImage) {
                            target.src = item.fallbackImage;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-black/30" />

                      {/* Floating Category Pill on Image */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${item.badgeStyle} backdrop-blur-md`}
                        >
                          {item.badge}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-black/75 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          <IconComponent className="w-4 h-4 text-emerald-300" />
                        </div>
                      </div>
                    </div>

                    {/* Card Content & Narrative */}
                    <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                            {item.name}
                          </h3>
                        </div>
                        <p className="text-xs font-bold text-emerald-300 mb-3">
                          {item.tagline}
                        </p>
                        <p className="text-xs text-zinc-100 font-normal leading-relaxed text-justify">
                          {item.narrative}
                        </p>
                      </div>

                      {/* Feature Highlights Tags */}
                      <div className="space-y-3 pt-2 border-t border-white/10">
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-zinc-100 flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Interactive Action CTA */}
                        <Link
                          to={item.link}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-slate-900 text-white text-xs font-black border border-white/20 hover:border-emerald-400 transition-all duration-200 group/btn mt-1"
                        >
                          <span>{item.ctaText}</span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Row 2 Header & 4 Cards */}
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-black border border-cyan-500/30">
                  R2
                </span>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Bottom Row: Hospitality, Hi-Fi Audio, Cinema & Commerce
                  </h2>
                  <p className="text-xs text-zinc-200 font-medium">
                    Four (4) ultra-luxury and media streaming platforms
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-zinc-200">
                4 Screen Modules
              </span>
            </div>

            {/* Bottom Row: Exactly 4 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {BOTTOM_ROW_ITEMS.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <article
                    key={item.id}
                    className={`group relative flex flex-col rounded-2xl bg-zinc-900/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-white/15 ${item.borderAccent} shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex-1 overflow-hidden`}
                    style={{
                      boxShadow: `0 10px 30px -10px ${item.glowColor}`,
                    }}
                  >
                    {/* Bottom Row Badge Index */}
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-white/20 text-[11px] font-black text-white">
                      <span className="text-cyan-400">0{index + 4}</span>
                      <span className="text-zinc-400">•</span>
                      <span>{item.name}</span>
                    </div>

                    {/* UHD Graphic Container (16:9 Aspect Ratio) */}
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                      <img
                        src={item.image}
                        alt={`${item.name} UHD Screen Showcase`}
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== item.fallbackImage) {
                            target.src = item.fallbackImage;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-black/30" />

                      {/* Floating Category Pill on Image */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${item.badgeStyle} backdrop-blur-md truncate max-w-[170px]`}
                        >
                          {item.badge}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-black/75 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform flex-shrink-0 ml-1">
                          <IconComponent className="w-3.5 h-3.5 text-cyan-300" />
                        </div>
                      </div>
                    </div>

                    {/* Card Content & Narrative */}
                    <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-black text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                            {item.name}
                          </h3>
                        </div>
                        <p className="text-[11px] font-bold text-cyan-300 mb-2">
                          {item.tagline}
                        </p>
                        <p className="text-xs text-zinc-100 font-normal leading-relaxed text-justify">
                          {item.narrative}
                        </p>
                      </div>

                      {/* Feature Highlights Tags */}
                      <div className="space-y-3 pt-2 border-t border-white/10">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-zinc-100 flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5 text-cyan-400 flex-shrink-0" />
                              <span className="truncate">{tag}</span>
                            </span>
                          ))}
                        </div>

                        {/* Interactive Action CTA */}
                        <Link
                          to={item.link}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-slate-900 text-white text-xs font-black border border-white/20 hover:border-cyan-400 transition-all duration-200 group/btn mt-1"
                        >
                          <span>{item.ctaText}</span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Quick Launchpad & Getting Started Bar */}
          <section className="rounded-3xl p-8 sm:p-10 border border-white/20 bg-gradient-to-r from-zinc-900/95 via-black/90 to-zinc-900/95 backdrop-blur-2xl shadow-2xl text-center relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-black tracking-widest uppercase text-emerald-300">
                Join The Sovereign FingerMobile Experience
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Ready to explore all 7 ecosystems?
              </h2>
              <p className="text-sm text-zinc-100 font-medium leading-relaxed">
                Create your verified profile today to participate in
                discussions, earn milestone badges, gift custom plushies,
                charter luxury travel, stream lossless audio, and collect
                red-carpet items.
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-black tracking-wide shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-black border border-white/25 transition-all"
                >
                  Sign In to Dashboard
                </Link>
                <Link
                  to="/about"
                  className="px-6 py-3 rounded-xl bg-transparent hover:bg-white/10 text-zinc-100 hover:text-white text-xs font-bold transition-all"
                >
                  Learn About Protocol →
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-white/15 bg-black/80 backdrop-blur-xl py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-200">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">
                FingerMobile Protocol™
              </span>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-200 font-medium">© 2026 Mbah Israel Obinna. All Rights Reserved.</span>
            </div>
            <div className="flex items-center gap-6 font-semibold text-zinc-200">
              <Link
                to="/privacy-policy"
                className="hover:text-emerald-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="hover:text-emerald-300 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/platform-service-of-use"
                className="hover:text-emerald-300 transition-colors"
              >
                Platform Service of Use
              </Link>
              <Link
                to="/legal"
                className="hover:text-emerald-300 transition-colors"
              >
                Legal Suite
              </Link>
              <Link
                to="/support"
                className="hover:text-emerald-300 transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
