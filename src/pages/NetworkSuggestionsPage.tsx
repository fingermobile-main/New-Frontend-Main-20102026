import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import {
  Users,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Filter,
  ArrowRight
} from 'lucide-react';

interface RecommendedPeer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  guild: string;
  mutualCount: number;
  mutualNames: string;
  relevanceReason: string;
  isVerified: boolean;
  status: 'none' | 'pending' | 'connected';
  category: 'media' | 'engineering' | 'governance' | 'music' | 'commerce';
}

const INITIAL_RECOMMENDATIONS: RecommendedPeer[] = [
  {
    id: 'peer-1',
    name: 'Dr. Amina Bello',
    handle: 'aminabello',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    role: 'Cryptographic Lead & ZKP Core',
    guild: 'Victoria Island Security Guild',
    mutualCount: 14,
    mutualNames: 'Obinna Mbah, Sarah Jenkins',
    relevanceReason: 'Co-contributor on Zero-Knowledge Enclave Protocols',
    isVerified: true,
    status: 'none',
    category: 'engineering'
  },
  {
    id: 'peer-2',
    name: 'Tariq Al-Mansoor',
    handle: 'tariqbeats',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    role: 'Beatwave Master Producer',
    guild: 'Lagos Sound Labs',
    mutualCount: 9,
    mutualNames: 'Chen Wei, Amara Diallo',
    relevanceReason: 'Top producer in Afrobeats & Lossless Audio Stems',
    isVerified: true,
    status: 'none',
    category: 'music'
  },
  {
    id: 'peer-3',
    name: 'Amara Diallo',
    handle: 'amaradiallo',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    role: 'Governance Council Member',
    guild: 'West Africa Sovereign Enclave',
    mutualCount: 22,
    mutualNames: 'Obinna Mbah, Alex Chen',
    relevanceReason: 'Active voter on Protocol Charter Amendments',
    isVerified: true,
    status: 'connected',
    category: 'governance'
  },
  {
    id: 'peer-4',
    name: 'Chen Wei',
    handle: 'chenwei',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
    role: '3D Metaverse & Avatar Architect',
    guild: 'Tokyo Decentralized Spatial',
    mutualCount: 8,
    mutualNames: 'Sarah Jenkins, Marcus Vance',
    relevanceReason: 'Created 12 custom Mii™ avatars & Dancia 3D stages',
    isVerified: true,
    status: 'none',
    category: 'engineering'
  },
  {
    id: 'peer-5',
    name: 'Zara Okafor',
    handle: 'zaraflair',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    role: 'Luxury Storefront Merchant',
    guild: 'OwnIt Sovereign Commerce',
    mutualCount: 11,
    mutualNames: 'Obinna Mbah, Amina Bello',
    relevanceReason: 'Verified merchant with 99.8% escrow trust score',
    isVerified: true,
    status: 'none',
    category: 'commerce'
  },
  {
    id: 'peer-6',
    name: 'Marcus Vance',
    handle: 'marcusmedia',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    role: 'FingerShorts Film Director',
    guild: 'Nollywood 4K Digital Cinema',
    mutualCount: 6,
    mutualNames: 'Tariq Al-Mansoor',
    relevanceReason: 'Directs top-trending 48-hour decentralized film shorts',
    isVerified: true,
    status: 'none',
    category: 'media'
  },
  {
    id: 'peer-7',
    name: 'Folake Adeyemi',
    handle: 'folakelegal',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
    role: 'Sovereign Legal Counsel',
    guild: 'African Continental Trade Guild',
    mutualCount: 17,
    mutualNames: 'Obinna Mbah, Folashade Balogun',
    relevanceReason: 'Formulated Nigeria & Pan-African Sovereign Digital Charters',
    isVerified: true,
    status: 'pending',
    category: 'governance'
  },
  {
    id: 'peer-8',
    name: 'Kwame Mensah',
    handle: 'kwametech',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200',
    role: 'P2P Mesh Network Engineer',
    guild: 'Accra Wireless Infrastructure',
    mutualCount: 7,
    mutualNames: 'Dr. Amina Bello',
    relevanceReason: 'Deploys localized zero-latency Wi-Fi and Bluetooth mesh relays',
    isVerified: true,
    status: 'none',
    category: 'engineering'
  },
  {
    id: 'peer-9',
    name: 'Nkechi Eze',
    handle: 'nkechimedia',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    role: 'Dancia-4Tv Live Host',
    guild: 'Pan-African Broadcast Guild',
    mutualCount: 13,
    mutualNames: 'Marcus Vance, Tariq Al-Mansoor',
    relevanceReason: 'Hosts live weekly Creator Showcase with 18,000+ viewers',
    isVerified: true,
    status: 'none',
    category: 'media'
  },
  {
    id: 'peer-10',
    name: 'Lucas Silva',
    handle: 'lucasnodes',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    role: 'Validator & Node Custodian',
    guild: 'São Paulo LatAm Enclave',
    mutualCount: 5,
    mutualNames: 'Kwame Mensah, Dr. Amina Bello',
    relevanceReason: 'Operates high-availability validator node in South America',
    isVerified: true,
    status: 'none',
    category: 'engineering'
  },
  {
    id: 'peer-11',
    name: 'Zainab Touré',
    handle: 'zainabeco',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200',
    role: 'FIC Tokenomics Analyst',
    guild: 'Dakar Financial Lab',
    mutualCount: 12,
    mutualNames: 'Zara Okafor, Obinna Mbah',
    relevanceReason: 'Monitors liquidity pools and sovereign merchant settlement',
    isVerified: true,
    status: 'none',
    category: 'commerce'
  },
  {
    id: 'peer-12',
    name: 'Emeka Nwosu',
    handle: 'emekaproductions',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200',
    role: 'Audio Engineering Specialist',
    guild: 'Enugu Acoustic Enclave',
    mutualCount: 8,
    mutualNames: 'Tariq Al-Mansoor',
    relevanceReason: 'Mixing and stem mastering on Beatwave sovereign tracks',
    isVerified: true,
    status: 'none',
    category: 'music'
  }
];

export const NetworkSuggestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [peers, setPeers] = useState<RecommendedPeer[]>(INITIAL_RECOMMENDATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleConnect = (peerId: string) => {
    setPeers((prev) =>
      prev.map((p) => {
        if (p.id === peerId) {
          if (p.status === 'none') {
            showToast(`Connection request sent to @${p.handle}!`, 'success');
            return { ...p, status: 'pending' };
          } else if (p.status === 'pending') {
            showToast(`Connection request cancelled for @${p.handle}`, 'info');
            return { ...p, status: 'none' };
          }
        }
        return p;
      })
    );
  };

  const handleDismiss = (peerId: string) => {
    setPeers((prev) => prev.filter((p) => p.id !== peerId));
    showToast('Recommendation dismissed', 'info');
  };

  const filteredPeers = peers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.guild.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout pageTitle="Connections & Network Discovery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700">
          <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-black tracking-wide border border-sky-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                SOVEREIGN NETWORK GRAPH • 12 DISCOVERIES
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Connections & Recommendations
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Discover verified protocol builders, cryptographic leads, media directors, and governance stewards curated to expand your sovereign network enclave.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition shadow-sm flex items-center gap-2"
              >
                <span>Back to My Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-300 p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name, handle, role, or guild..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Filter className="w-4 h-4 text-slate-500" />
              <span>Showing {filteredPeers.length} recommendations</span>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
            {[
              { id: 'all', label: 'All Recommendations' },
              { id: 'engineering', label: 'Core Engineering & ZKP' },
              { id: 'music', label: 'Sound & Beatwave' },
              { id: 'media', label: 'Media & FingerShorts' },
              { id: 'governance', label: 'Governance & Charters' },
              { id: 'commerce', label: 'Commerce & Storefronts' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  selectedCategory === cat.id
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Connections Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPeers.map((peer) => (
            <div
              key={peer.id}
              className="bg-white rounded-3xl border border-slate-300 p-5 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Avatar, Name, Handle, Verification */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-300 shadow-xs"
                      />
                      {peer.isVerified && (
                        <div
                          className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-sky-600 text-white"
                          title="Verified Sovereign Peer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        {peer.name}
                      </h3>
                      <p className="text-xs text-slate-700 font-medium">@{peer.handle}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-950 text-[10px] font-bold border border-sky-200">
                        {peer.role}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDismiss(peer.id)}
                    className="text-slate-700 hover:text-slate-700 text-xs p-1"
                    title="Dismiss recommendation"
                  >
                    ✕
                  </button>
                </div>

                {/* Relevance Reason */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-snug">
                  <span className="font-bold text-slate-900 block mb-0.5 text-[11px] uppercase tracking-wider">Common Affinity</span>
                  {peer.relevanceReason}
                </div>

                {/* Mutual connections & Guild */}
                <div className="space-y-1 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>
                      <strong className="text-slate-900">{peer.mutualCount} mutual connections</strong> ({peer.mutualNames})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 pl-5">
                    Enclave: <strong>{peer.guild}</strong>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleConnect(peer.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                    peer.status === 'connected'
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                      : peer.status === 'pending'
                      ? 'bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200'
                      : 'bg-sky-600 hover:bg-sky-700 text-white'
                  }`}
                >
                  {peer.status === 'connected' ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-700" />
                      <span>Connected</span>
                    </>
                  ) : peer.status === 'pending' ? (
                    <>
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>Pending Request</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4" />
                      <span>Connect</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition"
                  title="View Profile Wall"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPeers.length === 0 && (
          <div className="bg-white p-12 rounded-3xl border border-slate-300 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No matching connections found</h3>
            <p className="text-xs text-slate-600">Try modifying your search keywords or category filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default NetworkSuggestionsPage;
