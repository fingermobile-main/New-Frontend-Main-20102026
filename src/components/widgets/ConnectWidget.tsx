/*
 * FingerMobile Protocol™ - Sovereign Connect Widget
 * P2P Network Discovery & Mutual Connections for Left Column
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Check, Sparkles, ArrowRight } from 'lucide-react';

export interface ConnectPeer {
  id: string;
  name: string;
  handle: string;
  role: string;
  avatar: string;
  mutualCount: number;
  isOnline: boolean;
}

interface ConnectWidgetProps {
  pageContext?: 'forum' | 'tribut' | 'hallmarks' | 'blogs' | 'groups' | 'gems' | 'trends' | 'lushpressies';
}

const DEFAULT_PEERS: Record<string, ConnectPeer[]> = {
  default: [
    {
      id: 'cp-1',
      name: 'Nia Adebayo',
      handle: '@nia_architect',
      role: 'Sovereign Node Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      mutualCount: 14,
      isOnline: true
    },
    {
      id: 'cp-2',
      name: 'Tariq Al-Mansoor',
      handle: '@tariq_node',
      role: 'WebRTC Protocol Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      mutualCount: 9,
      isOnline: true
    },
    {
      id: 'cp-3',
      name: 'Amina Bello',
      handle: '@amina_curator',
      role: 'Heritage Art Collector',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      mutualCount: 6,
      isOnline: false
    }
  ],
  tribut: [
    {
      id: 'cp-t1',
      name: 'Zainab Okafor',
      handle: '@zainab_visuals',
      role: 'Visual Identity Lead',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
      mutualCount: 18,
      isOnline: true
    },
    {
      id: 'cp-t2',
      name: 'Kwame Mensah',
      handle: '@kwame_curation',
      role: 'Afrofuturist Moodboarder',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      mutualCount: 11,
      isOnline: true
    },
    {
      id: 'cp-t3',
      name: 'Chiamaka Eze',
      handle: '@chia_tribut',
      role: 'Fashion Pin Designer',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      mutualCount: 8,
      isOnline: false
    }
  ],
  hallmarks: [
    {
      id: 'cp-h1',
      name: 'Dr. Adeyemi Adeleke',
      handle: '@adeyemi_hallmarks',
      role: 'Mega-Node Custodian',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      mutualCount: 22,
      isOnline: true
    },
    {
      id: 'cp-h2',
      name: 'Folashade Balogun',
      handle: '@fola_governance',
      role: '50-PIN Policy Auditor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      mutualCount: 15,
      isOnline: true
    }
  ],
  blogs: [
    {
      id: 'cp-b1',
      name: 'Ebenezer Wright',
      handle: '@ebenezer_essays',
      role: 'Cryptographic Columnist',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      mutualCount: 16,
      isOnline: true
    },
    {
      id: 'cp-b2',
      name: 'Halima Sadiq',
      handle: '@halima_dispatches',
      role: 'Investigative Essayist',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      mutualCount: 12,
      isOnline: false
    }
  ],
  groups: [
    {
      id: 'cp-g1',
      name: 'Kofi Asare',
      handle: '@kofi_salons',
      role: 'Living Room Host',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      mutualCount: 20,
      isOnline: true
    },
    {
      id: 'cp-g2',
      name: 'Yewande Silva',
      handle: '@yewande_p2p',
      role: 'Community Moderator',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150',
      mutualCount: 14,
      isOnline: true
    }
  ],
  gems: [
    {
      id: 'cp-gm1',
      name: 'Timi Dakolo',
      handle: '@timi_gems',
      role: 'Gem Vault Guardian',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      mutualCount: 19,
      isOnline: true
    },
    {
      id: 'cp-gm2',
      name: 'Simisola Green',
      handle: '@simi_staking',
      role: 'Yield Token Strategist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      mutualCount: 13,
      isOnline: true
    }
  ],
  trends: [
    {
      id: 'cp-tr1',
      name: 'Damilola Ogunleye',
      handle: '@dami_radar',
      role: 'Cultural Radar Analyst',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      mutualCount: 25,
      isOnline: true
    },
    {
      id: 'cp-tr2',
      name: 'Nnenna Ike',
      handle: '@nnenna_style',
      role: 'Red-Carpet Curator',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
      mutualCount: 17,
      isOnline: true
    }
  ],
  lushpressies: [
    {
      id: 'cp-lp1',
      name: 'Victoria Odunjo',
      handle: '@vicky_lapidaire',
      role: 'Lapidaire Socialite',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      mutualCount: 31,
      isOnline: true
    },
    {
      id: 'cp-lp2',
      name: 'Marcus Sterling',
      handle: '@marcus_plush',
      role: 'Luxury Gifting Patron',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      mutualCount: 14,
      isOnline: true
    }
  ]
};

export const ConnectWidget: React.FC<ConnectWidgetProps> = ({ pageContext = 'default' }) => {
  const navigate = useNavigate();
  const peers = DEFAULT_PEERS[pageContext] || DEFAULT_PEERS.default;
  const [connectedIds, setConnectedIds] = useState<Record<string, boolean>>({});

  const handleToggleConnect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConnectedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 p-4 shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Connect
            </h3>
            <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">
              Suggested peer nodes & creators
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
          P2P Mesh
        </span>
      </div>

      {/* Suggested Peers List */}
      <div className="space-y-2.5">
        {peers.map((peer) => {
          const isConnected = !!connectedIds[peer.id];
          return (
            <div
              key={peer.id}
              className="flex items-center justify-between gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-blue-300 transition-colors"
            >
              <div className="relative shrink-0">
                <img
                  src={peer.avatar}
                  alt={peer.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                />
                {peer.isOnline && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"
                    title="Online Now"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {peer.name}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium truncate">
                  {peer.role}
                </p>
                <span className="text-[9px] text-blue-700 dark:text-blue-400 font-semibold">
                  {peer.mutualCount} mutual connections
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => handleToggleConnect(peer.id, e)}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  isConnected
                    ? 'bg-emerald-100 text-emerald-950 border border-emerald-400 hover:bg-emerald-200'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                }`}
                aria-label={isConnected ? `Connected with ${peer.name}` : `Connect with ${peer.name}`}
              >
                {isConnected ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-800" />
                    <span>Linked</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3" />
                    <span>Connect</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Link */}
      <button
        type="button"
        onClick={() => navigate('/forum')}
        className="w-full pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
      >
        <span>Explore All Verified Peers</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};

export default ConnectWidget;
