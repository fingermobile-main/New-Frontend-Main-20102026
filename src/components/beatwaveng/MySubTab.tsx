import React, { useState } from 'react';
import {
  Users,
  Plus,
  Key,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useBeatwaveNG } from '../../contexts/BeatwaveNGContext';

export const MySubTab: React.FC = () => {
  const {
    mySubMembers,
    mySubMaxSeats,
    addMySubMemberByPin,
    removeMySubMember
  } = useBeatwaveNG();

  const [showAddModal, setShowAddModal] = useState(false);
  const [memberPin, setMemberPin] = useState('');
  const [memberName, setMemberName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allocatedCount = mySubMembers.length;
  const vacantSeats = Math.max(0, mySubMaxSeats - allocatedCount);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberPin.trim() || !memberName.trim()) return;
    setIsSubmitting(true);
    try {
      const success = await addMySubMemberByPin(memberPin.trim(), memberName.trim());
      if (success) {
        setShowAddModal(false);
        setMemberPin('');
        setMemberName('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/40 flex items-center gap-1.5">
              <Users size={14} />
              MySub Shared Subscription Pass
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
              Shared by Member PIN
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Sovereign Crew Plan (5 Seats)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Share your BeatwaveNG subscription with up to 4 other collaborators or family members. Simply verify and exchange their 6-digit Member PIN to grant full lossless streaming, offline downloads, and creator rights.
          </p>
        </div>

        {/* Quota Telemetry & CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-xs text-slate-300 font-bold uppercase tracking-wider">Seat Utilization</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {allocatedCount} <span className="text-xs text-slate-300 font-medium">/ {mySubMaxSeats} Seats Active</span>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            disabled={vacantSeats === 0}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30 disabled:opacity-50"
          >
            <Plus size={16} />
            Add Member by PIN
          </button>
        </div>
      </div>

      {/* Seats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Allocated Member Seats */}
        {mySubMembers.map((member, idx) => {
          const isOwner = member.id === 'sub-owner' || idx === 0;
          return (
            <div
              key={member.id}
              className={`p-6 rounded-3xl border flex flex-col justify-between transition-all shadow-xl space-y-4 ${
                isOwner
                  ? 'bg-gradient-to-b from-slate-900 to-emerald-950/30 border-emerald-500/40'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-white">{member.name}</h3>
                      {isOwner && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                          Owner
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mt-1 font-mono">
                      <Key size={12} className="text-amber-400" />
                      <span>PIN: #{member.pin}</span>
                    </div>
                  </div>
                </div>

                {!isOwner && (
                  <button
                    onClick={() => removeMySubMember(member.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-300 transition-colors"
                    title="Revoke Seat"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-300 font-medium">
                <div className="flex items-center justify-between">
                  <span>Access Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Active Lossless Crew
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>Allocated:</span>
                  <span>{member.joinedAt}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty Vacant Seats */}
        {Array.from({ length: vacantSeats }).map((_, i) => (
          <div
            key={`vacant-${i}`}
            onClick={() => setShowAddModal(true)}
            className="p-6 rounded-3xl border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-950/40 hover:bg-slate-900/40 flex flex-col items-center justify-center text-center cursor-pointer transition-all space-y-3 min-h-[190px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-emerald-400">
              <Plus size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-300">Vacant Subscription Seat</h4>
              <p className="text-xs text-slate-300 font-medium mt-0.5">Assign collaborator via 6-digit Sovereign PIN</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add Member to MySub Plan by PIN</h3>
            <p className="text-xs text-slate-300 font-medium">
              Input your collaborator's verified 6-digit Member PIN to immediately activate their seat on your Sovereign Crew subscription.
            </p>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Member Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tunde Balogun"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">6-Digit Member PIN *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 559201"
                  value={memberPin}
                  onChange={(e) => setMemberPin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-center text-lg font-mono tracking-widest text-emerald-300 font-black focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
                >
                  {isSubmitting ? 'Verifying PIN...' : 'Allocate Seat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubTab;
