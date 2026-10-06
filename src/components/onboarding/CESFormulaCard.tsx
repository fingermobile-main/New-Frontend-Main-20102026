import React from 'react';
import { Sparkles, Heart, Bookmark, MessageSquare, Share2, UserPlus, Info } from 'lucide-react';

export const CESFormulaCard: React.FC = () => {
  const metrics = [
    { name: 'Likes', points: '1 pt', icon: Heart, color: 'text-rose-400 bg-rose-500/10' },
    { name: 'Saves / Collects', points: '1 pt', icon: Bookmark, color: 'text-amber-400 bg-amber-500/10' },
    { name: 'Comments', points: '4 pts', icon: MessageSquare, color: 'text-blue-400 bg-blue-500/10' },
    { name: 'Shares', points: '4 pts', icon: Share2, color: 'text-indigo-400 bg-indigo-500/10' },
    { name: 'Follows', points: '8 pts', icon: UserPlus, color: 'text-emerald-400 bg-emerald-500/10' },
  ];

  return (
    <div className="bg-slate-900 border border-indigo-900/60 rounded-xl p-5 text-left shadow-xl space-y-4">
      <div className="flex items-center space-x-2 text-indigo-400">
        <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
        <h3 className="font-bold text-white text-base">Community Engagement Score (CES)</h3>
      </div>
      
      <p className="text-xs text-slate-300 leading-relaxed">
        FingerMobile utilizes an algorithmic recommendation system prioritizing high-intent community interactions:
      </p>

      {/* Formula Display Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center font-mono text-xs text-indigo-300">
        CES = (Likes × 1) + (Saves × 1) + (Comments × 4) + (Shares × 4) + (Follows × 8)
      </div>

      {/* Grid of Weights */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.name} className="flex items-center space-x-2 p-2 bg-slate-800/60 border border-slate-700/50 rounded-lg">
              <div className={`p-1.5 rounded-md ${m.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">{m.name}</p>
                <p className="text-xs font-bold text-white">{m.points}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-start space-x-2 p-2.5 bg-blue-950/30 border border-blue-800/40 rounded-lg text-xs text-blue-300">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <span>
          <strong>Pro Tip:</strong> Prioritize Collects & Comments. Tutorials and checklists prompt members to save for later, directly accelerating your post reach!
        </span>
      </div>
    </div>
  );
};

export default CESFormulaCard;
