import React, { useState } from 'react';
import {
  Users,
  Plus,
  Key,
  Play,
  Pause,
  Music,
  Share2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Disc
} from 'lucide-react';
import { useBeatwaveNG, ColaboSession, Track } from '../../contexts/BeatwaveNGContext';
import { formatTime } from '../../utils/timeUtils';

export const ColaboTab: React.FC = () => {
  const {
    colaboSessions,
    createColaboSession,
    joinColaboSession,
    addTrackToColaboSession,
    playTrack,
    currentTrack,
    isPlaying,
    tracks
  } = useBeatwaveNG();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [joinPin, setJoinPin] = useState('');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    colaboSessions.length > 0 ? colaboSessions[0].id : null
  );
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);

  const selectedSession = colaboSessions.find((s) => s.id === activeSessionId) || colaboSessions[0];

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const session = await createColaboSession(newTitle.trim());
    setActiveSessionId(session.id);
    setNewTitle('');
    setShowCreateModal(false);
  };

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinPin.trim()) return;
    const success = await joinColaboSession(joinPin.trim());
    if (success) {
      setJoinPin('');
      setShowJoinModal(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Colabo+ Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/40 flex items-center gap-1.5">
              <Users size={14} />
              Colabo+ Shared Jam Rooms
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
              Exchange PIN Required
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Collaborative Sovereign Playlists
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Create real-time shared playlists with fellow creators. Exchanging 6-digit Sovereign PINs ensures secure, private curation and decentralized rights tracking.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all shadow-md"
          >
            <Key size={14} className="text-amber-400" />
            Join with PIN
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30"
          >
            <Plus size={14} />
            Create Colabo+ Room
          </button>
        </div>
      </div>

      {/* Main Grid: Active Sessions & Selected Session Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sessions List */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 px-1">
            Active Colabo+ Rooms ({colaboSessions.length})
          </h3>

          <div className="space-y-3">
            {colaboSessions.map((session) => {
              const isSelected = session.id === selectedSession?.id;
              return (
                <div
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-400 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">{session.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 border border-slate-700">
                      <Key size={9} />
                      PIN: {session.pin}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-medium mt-1">Host: {session.hostName}</p>

                  {/* Contributors Avatars */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-300 font-medium">
                    <div className="flex items-center -space-x-2">
                      {session.contributors.map((c) => (
                        <img
                          key={c.id}
                          src={c.avatar}
                          alt={c.name}
                          title={`${c.name} (${c.role})`}
                          className="w-6 h-6 rounded-full border-2 border-slate-900 object-cover"
                        />
                      ))}
                      <span className="pl-3 text-[10px] text-slate-300 font-semibold">
                        {session.contributors.length} members
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      {session.tracks.length} tracks
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 Cols): Selected Session Details & Track Queue */}
        {selectedSession && (
          <div className="lg:col-span-2 space-y-5 p-6 rounded-3xl bg-slate-900/70 border border-slate-800">
            {/* Session Top Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white">{selectedSession.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                    PIN: #{selectedSession.pin}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Host: <strong className="text-slate-200">{selectedSession.hostName}</strong> • Real-time sovereign synchronized session
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddTrackModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Plus size={13} />
                  Add Track to Room
                </button>
              </div>
            </div>

            {/* Contributors Pills */}
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-300 block mb-2">
                Room Curators & Contributors
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedSession.contributors.map((c) => (
                  <div
                    key={c.id}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs"
                  >
                    <img src={c.avatar} alt={c.name} className="w-5 h-5 rounded-full object-cover" />
                    <span className="font-bold text-slate-200">{c.name}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-900 text-emerald-400 font-semibold">
                      {c.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Track List */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-300 block mb-1">
                Collaborative Queue ({selectedSession.tracks.length} tracks)
              </span>

              {selectedSession.tracks.map((track, idx) => {
                const isCurrentPlaying = currentTrack?.id === track.id && isPlaying;
                return (
                  <div
                    key={`${track.id}-${idx}`}
                    className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button type="button" aria-label="Pause"
                        onClick={() => playTrack(track, selectedSession.tracks)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          isCurrentPlaying
                            ? 'bg-emerald-500 text-black shadow-md'
                            : 'bg-slate-800 hover:bg-emerald-600 text-white'
                        }`}
                      >
                        {isCurrentPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                      </button>

                      <img
                        src={track.coverArt}
                        alt={track.title}
                        className="w-10 h-10 rounded-xl object-cover"
                      />

                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{track.title}</div>
                        <div className="text-[11px] text-slate-300 font-medium truncate">{track.artist}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 text-[10px] font-semibold border border-slate-800">
                        Added by Room
                      </span>
                      <span className="text-xs font-mono text-slate-300 font-medium">
                        {formatTime(track.duration)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Create New Colabo+ Jam Room</h3>
            <p className="text-xs text-slate-300 font-medium">
              A unique 6-digit Join PIN will be generated. Share the PIN with friends or fellow producers to collaborate.
            </p>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Room Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lagos Late Night Studio Jam"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
                >
                  Create Room & PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join via PIN Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Join Colabo+ Room by PIN</h3>
            <p className="text-xs text-slate-300 font-medium">
              Enter the 6-digit PIN shared by the room creator to verify your access.
            </p>
            <form onSubmit={handleJoinSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">6-Digit Room PIN *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 482910"
                  value={joinPin}
                  onChange={(e) => setJoinPin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-center text-lg font-mono tracking-widest text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-black"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
                >
                  Verify & Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Track to Room Modal */}
      {showAddTrackModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Add Track to {selectedSession.title}</h3>
              <button
                onClick={() => setShowAddTrackModal(false)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {tracks.map((t) => (
                <div
                  key={t.id}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={t.coverArt} alt={t.title} className="w-9 h-9 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{t.title}</div>
                      <div className="text-[10px] text-slate-300 font-medium truncate">{t.artist}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addTrackToColaboSession(selectedSession.id, t);
                      setShowAddTrackModal(false);
                    }}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColaboTab;
