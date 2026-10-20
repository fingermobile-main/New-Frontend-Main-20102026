/**
 * Council of Dignitaries Chamber Page
 * Route: /council/governance
 * Restricted parliamentary chamber for Distinguished & Honoured Members, Founders & CFO
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Landmark,
  Shield,
  Vote,
  Award,
  ChevronRight,
  FileText,
  CheckCircle,
  Users,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import sovereignRbacApi, { DistinguishedRank, DistinguishedDignitary } from '../../services/sovereignRbacApi';
import { usePlatformPrivilege } from '../../components/common/ExecutiveOnlyContent';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

export const CouncilDignitariesChamberPage: React.FC = () => {
  const { isExecutive } = usePlatformPrivilege();
  const [ranks, setRanks] = useState<DistinguishedRank[]>([]);
  const [dignitaries, setDignitaries] = useState<DistinguishedDignitary[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock Active Proposals in Council Chamber
  const [proposals] = useState([
    {
      id: 'PROP-2026-09',
      title: 'Allocation of 250,000 FIC to Decentralized Camus Academic Research Grant',
      proposer: 'Obinna Mbah (SuperAdmin)',
      category: 'Treasury & Grants',
      votingEnds: '3 days left',
      yesVotes: 142,
      noVotes: 8,
      status: 'Active Floor Vote'
    },
    {
      id: 'PROP-2026-08',
      title: 'Approval of Beatwave Algorithmic Royalty Distribution Ratio (85/15)',
      proposer: 'Eunice Mbah (CFO & Co-Founder)',
      category: 'Monetization Policy',
      votingEnds: '12 hours left',
      yesVotes: 210,
      noVotes: 4,
      status: 'Quorum Reached'
    }
  ]);

  useEffect(() => {
    document.title = 'Council of Dignitaries Chamber | FingerMobile Protocol';
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await sovereignRbacApi.getDistinguished();
      setRanks(data.ranks);
      setDignitaries(data.dignitaries);
    } catch (err) {
      console.error('Failed to load distinguished registry:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Link to="/forum" className="hover:text-orange-600 transition">Forum Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <span className="text-slate-900 font-extrabold flex items-center gap-1">
            <Landmark className="w-3.5 h-3.5 text-purple-600" />
            Council of Dignitaries Chamber
          </span>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-purple-100 text-purple-950 border border-purple-400 text-[11px] font-black">
            Distinguished Protocol Parliament
          </span>
        </nav>

        {/* Ownership Banner */}
        <PlatformOwnershipCard />

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-xl bg-purple-100 text-purple-900 border border-purple-300">
              <Landmark className="w-7 h-7" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Council of Dignitaries Sovereign Chamber
              </h1>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">
                Parliamentary governance floor for Founding Protocol Ambassadors, Elected Council Dignitaries, and Laureates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isExecutive && (
              <Link
                to="/admin/users-permissions"
                className="px-4 py-2 text-xs font-black rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition flex items-center gap-1.5 shadow-sm"
              >
                <Award className="w-3.5 h-3.5" />
                Appoint Council Dignitary
              </Link>
            )}
          </div>
        </div>

        {/* Dignitary Ranks Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ranks.map((r) => (
            <div key={r.id} className="p-4 rounded-xl bg-white border border-slate-300 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-950 border border-purple-300">
                  Weight: {r.voting_weight}x
                </span>
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-sm font-black text-slate-900">{r.rank_name}</h3>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed line-clamp-2">{r.description}</p>
            </div>
          ))}
        </div>

        {/* Active Governance Deliberations */}
        <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Vote className="w-4 h-4 text-purple-600" />
              Active Chamber Proposals & Floor Votes
            </h2>
            <span className="text-xs font-bold text-slate-700">Consensus Engine Active</span>
          </div>

          <div className="space-y-3">
            {proposals.map((prop) => (
              <div key={prop.id} className="p-4 rounded-xl bg-slate-50 border border-slate-300 hover:border-slate-400 transition space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-slate-900">{prop.id}</span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
                        {prop.status}
                      </span>
                      <span className="text-xs font-bold text-slate-700">{prop.category}</span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 mt-1">{prop.title}</h3>
                    <div className="text-xs text-slate-700 font-semibold mt-0.5">
                      Sponsored by: <strong className="text-slate-900">{prop.proposer}</strong> • Time Remaining: {prop.votingEnds}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => alert(`Casting Weighted Council Vote: YES on ${prop.id}`)}
                      className="px-3.5 py-1.5 text-xs font-black rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1 shadow-2xs"
                    >
                      Vote YES ({prop.yesVotes})
                    </button>
                    <button
                      onClick={() => alert(`Casting Weighted Council Vote: NO on ${prop.id}`)}
                      className="px-3.5 py-1.5 text-xs font-black rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1 shadow-2xs"
                    >
                      Vote NO ({prop.noVotes})
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouncilDignitariesChamberPage;
