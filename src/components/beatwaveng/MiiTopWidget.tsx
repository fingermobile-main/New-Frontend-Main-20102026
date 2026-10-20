import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
  Radio,
  Lock,
  Unlock,
  Check,
  X,
  Volume2,
  Bell,
  Sparkles,
  Key
} from 'lucide-react';
import { useBeatwaveNG } from '../../contexts/BeatwaveNGContext';

interface MiiTopWidgetProps {
  onOpenDeviceSelector: () => void;
}

export const MiiTopWidget: React.FC<MiiTopWidgetProps> = ({ onOpenDeviceSelector }) => {
  const {
    miiState,
    setMiiPrivacyMode,
    acceptMiiRequest,
    declineMiiRequest,
    currentTrack,
    isPlaying,
    activeAudioDevice
  } = useBeatwaveNG();

  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const pendingRequests = miiState.incomingRequests.filter((r) => r.status === 'pending');

  return (
    <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-4 sm:p-5 shadow-xl space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Avatar, Handle, Sovereign PIN & Followers */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
              alt="Mii Avatar"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-lg shadow-emerald-500/20"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                miiState.privacyMode === 'public'
                  ? 'bg-emerald-400 animate-pulse'
                  : miiState.privacyMode === 'private'
                  ? 'bg-amber-400'
                  : 'bg-slate-500'
              }`}
              title={`Status: ${miiState.privacyMode}`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white tracking-tight">Adebayo FM</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck size={11} />
                Sovereign Mii
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-bold border border-slate-700 flex items-center gap-1">
                <Key size={10} className="text-amber-400" />
                PIN: #749822
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300 font-medium mt-1">
              <span className="flex items-center gap-1">
                <Users size={12} className="text-emerald-400" />
                <strong className="text-white font-bold">{miiState.followersCount.toLocaleString()}</strong> Followers
              </span>
              <span>•</span>
              <span>
                <strong className="text-white font-bold">{miiState.followingCount.toLocaleString()}</strong> Following
              </span>
              <span>•</span>
              <span className="text-[11px] text-emerald-400 font-semibold">Exchanged PIN Network Active</span>
            </div>
          </div>
        </div>

        {/* Center: Live Listening Broadcast Telemetry */}
        <div className="flex-1 max-w-lg px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Radio
              size={16}
              className={`shrink-0 ${
                isPlaying && miiState.privacyMode === 'public'
                  ? 'text-emerald-400 animate-pulse'
                  : 'text-slate-500'
              }`}
            />
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-300 font-semibold">
                Live Broadcast Status
              </div>
              <div className="text-xs font-bold text-white truncate">
                {miiState.privacyMode === 'incognito' && '🕶️ Incognito (0 Activity Broadcasted)'}
                {miiState.privacyMode === 'private' && '🔒 Private (Mutual PIN Holders Only)'}
                {miiState.privacyMode === 'public' && (
                  <span>
                    Streaming:{' '}
                    <span className="text-emerald-300">
                      {currentTrack ? `${currentTrack.title} — ${currentTrack.artist}` : 'SoundRiver Live Radio'}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Privacy Mode Pills */}
            <button
              onClick={() => setMiiPrivacyMode('public')}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                miiState.privacyMode === 'public'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:text-white font-medium'
              }`}
              title="Public Broadcast"
            >
              Public
            </button>
            <button
              onClick={() => setMiiPrivacyMode('private')}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                miiState.privacyMode === 'private'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:text-white font-medium'
              }`}
              title="Private (Mutual PIN only)"
            >
              Private
            </button>
            <button
              onClick={() => setMiiPrivacyMode('incognito')}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                miiState.privacyMode === 'incognito'
                  ? 'bg-slate-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:text-white font-medium'
              }`}
              title="Incognito Stealth"
            >
              Incognito
            </button>
          </div>
        </div>

        {/* Right: Audio Device Pill & PIN Request Tray */}
        <div className="flex items-center gap-2.5 self-end lg:self-center">
          {/* Audio Output Device Quick Selector */}
          <button
            onClick={onOpenDeviceSelector}
            className="px-3 py-2 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 flex items-center gap-2 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-900"
            title="Audio Output Device"
          >
            <Volume2 size={14} className="text-emerald-400" />
            <div className="text-left">
              <div className="text-[9px] uppercase font-bold text-slate-300 leading-none">Output Device</div>
              <div className="text-white font-bold leading-tight truncate max-w-[120px]">
                {activeAudioDevice.name}
              </div>
            </div>
          </button>

          {/* Pending PIN Requests Tray */}
          <button
            onClick={() => setShowRequestsModal(true)}
            className="relative px-3 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/60 flex items-center gap-2 text-xs font-bold text-emerald-300 transition-all shadow-md"
          >
            <Key size={14} className="text-amber-400" />
            <span>PIN Tray</span>
            {pendingRequests.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-400 text-black text-[11px] font-black flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* PIN Requests Modal */}
      {showRequestsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Key className="w-4 h-4 text-amber-400" />
                Exchanged PIN Requests ({pendingRequests.length} Pending)
              </div>
              <button
                onClick={() => setShowRequestsModal(false)}
                className="text-slate-300 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              Fellow BeatwaveNG listeners request to exchange PINs to unlock mutual listening feeds, Colabo+ playlists, and VirDrive access.
            </p>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {pendingRequests.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-300 font-medium bg-slate-950/50 rounded-2xl border border-slate-800">
                  No pending PIN requests. Share your Sovereign PIN <strong className="text-white">#749822</strong> with your crew!
                </div>
              ) : (
                pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={req.avatar}
                        alt={req.fromName}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{req.fromName}</div>
                        <div className="text-[11px] text-emerald-400 font-mono">PIN: #{req.fromPin}</div>
                        <div className="text-[10px] text-slate-300 font-medium mt-0.5">{req.targetTitle}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => acceptMiiRequest(req.id)}
                        className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-md"
                        title="Accept PIN Exchange"
                      >
                        <Check size={14} />
                        Accept
                      </button>
                      <button
                        onClick={() => declineMiiRequest(req.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                        title="Decline"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowRequestsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiiTopWidget;
