import React, { useState } from 'react';

// ─── Shared helpers ───────────────────────────────────────────────────────────
const CloseBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

const ModalWrap: React.FC<{ onClose: () => void; children: React.ReactNode; maxW?: string }> = ({ onClose, children, maxW = 'max-w-lg' }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className={`bg-white dark:bg-gray-800 rounded-2xl w-full ${maxW} overflow-hidden shadow-2xl`} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

// ─── Lumina AI Modal ──────────────────────────────────────────────────────────
// Requires: POST /api/lumina/ask
interface LuminaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LuminaAIModal: React.FC<LuminaModalProps> = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('/api/lumina/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ question: question.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnswer(data.answer || data.data?.answer || 'No answer returned.');
      } else {
        setAnswer('The /api/lumina/ask endpoint is not yet active. Please implement it on the backend.');
      }
    } catch {
      setAnswer('Could not reach Lumina AI. The endpoint /api/lumina/ask needs to be implemented on the backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrap onClose={onClose}>
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <div>
            <h2 className="font-black text-base">Lumina AI</h2>
            <p className="text-violet-200 text-xs">Your intelligent community assistant</p>
          </div>
        </div>
        <CloseBtn onClick={onClose} />
      </div>
      <div className="p-4 space-y-3">
        <textarea
          autoFocus
          className="w-full bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none min-h-[100px] text-sm text-slate-900 font-bold placeholder:text-slate-400"
          placeholder="Ask Lumina anything about the community, forum rules, FIC tokens, events..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleAsk(); }}
        />
        <div className="flex flex-wrap gap-1.5">
          {['How do FIC tokens work?', 'What are the forum rules?', 'How do I earn from posts?'].map(q => (
            <button key={q} type="button" onClick={() => setQuestion(q)}
              className="text-xs px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-950 dark:text-violet-400 border border-violet-400 dark:border-violet-700 hover:bg-violet-100 transition font-black"
            >{q}</button>
          ))}
        </div>
        {(loading || answer) && (
          <div className="rounded-xl border border-violet-200 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-950/20 p-4">
            {loading ? (
              <div className="flex items-center gap-2 text-violet-600">
                <div className="animate-spin w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full" />
                <span className="text-sm">Lumina is thinking...</span>
              </div>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{answer}</p>
            )}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">Ctrl+Enter to submit</span>
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className="px-6 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-lg font-medium hover:from-violet-600 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Asking...' : 'Ask Lumina'}
        </button>
      </div>
    </ModalWrap>
  );
};

// ─── Feeling / Activity Selector Modal ───────────────────────────────────────
// Requires: DB field `activity_type` on forum_threads + PUT /api/forums/threads/:id/activity
const FEELINGS = [
  { emoji: '😊', label: 'Happy' }, { emoji: '😂', label: 'Laughing' },
  { emoji: '😍', label: 'In Love' }, { emoji: '🤩', label: 'Excited' },
  { emoji: '😎', label: 'Confident' }, { emoji: '🤔', label: 'Thinking' },
  { emoji: '😤', label: 'Determined' }, { emoji: '😢', label: 'Sad' },
  { emoji: '😡', label: 'Angry' }, { emoji: '😴', label: 'Tired' },
  { emoji: '🥳', label: 'Celebrating' }, { emoji: '🙏', label: 'Grateful' },
];

const ACTIVITIES = [
  { emoji: '🎵', label: 'Listening to music' }, { emoji: '📚', label: 'Reading' },
  { emoji: '🎮', label: 'Gaming' }, { emoji: '🏃', label: 'Working out' },
  { emoji: '✈️', label: 'Travelling' }, { emoji: '🍕', label: 'Eating' },
  { emoji: '💪', label: 'Grinding' }, { emoji: '🎉', label: 'Partying' },
  { emoji: '👨‍💻', label: 'Coding' }, { emoji: '🌙', label: 'Late night vibes' },
  { emoji: '☕', label: 'Coffee time' }, { emoji: '🙌', label: 'Celebrating wins' },
];

interface FeelingActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tag: string) => void;
}

export const FeelingActivityModal: React.FC<FeelingActivityModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [tab, setTab] = useState<'feeling' | 'activity'>('feeling');
  const [selected, setSelected] = useState('');
  if (!isOpen) return null;
  const items = tab === 'feeling' ? FEELINGS : ACTIVITIES;
  return (
    <ModalWrap onClose={onClose}>
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">
          {tab === 'feeling' ? '❤️ How are you feeling?' : '⚡ What are you up to?'}
        </h2>
        <CloseBtn onClick={onClose} />
      </div>
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {(['feeling', 'activity'] as const).map(t => (
          <button key={t} type="button" onClick={() => { setTab(t); setSelected(''); }}
            className={`flex-1 py-2.5 text-sm font-semibold capitalize transition ${
              tab === t ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >{t}</button>
        ))}
      </div>
      <div className="p-4 grid grid-cols-3 gap-2 max-h-[50vh] overflow-y-auto">
        {items.map(({ emoji, label }) => (
          <button key={label} type="button"
            onClick={() => setSelected(`${emoji} ${label}`)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition text-center ${
              selected === `${emoji} ${label}`
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40'
                : 'border-slate-300 dark:border-gray-700 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/20'
            }`}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-tight">{label}</span>
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{selected ? `Selected: ${selected}` : 'Pick one above'}</span>
        <button
          onClick={() => { if (selected) { onSelect(selected); onClose(); } }}
          disabled={!selected}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >Add to Post</button>
      </div>
    </ModalWrap>
  );
};

// ─── Create Room Modal ────────────────────────────────────────────────────────
// Requires: POST /api/rooms/create → { room_id, join_url }
// DB: video_rooms table (room_id, host_id, title, type, status, created_at)
// WebRTC: Daily.co / Twilio / custom TURN server
interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose, showToast }) => {
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState<'video' | 'audio'>('video');
  const [maxPeople, setMaxPeople] = useState(10);
  const [creating, setCreating] = useState(false);
  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!roomName.trim()) return;
    setCreating(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title: roomName.trim(), type: roomType, max_participants: maxPeople }),
      });
      if (res.ok) {
        const data = await res.json();
        showToast(`Room "${roomName}" created! Joining...`, 'success');
        if (data.join_url) window.open(data.join_url, '_blank');
        onClose();
      } else {
        showToast('Room creation endpoint not yet active. Coming soon with WebRTC!', 'info');
      }
    } catch {
      showToast('Room creation needs /api/rooms/create + WebRTC setup on the backend.', 'info');
    } finally {
      setCreating(false);
    }
  };

  return (
    <ModalWrap onClose={onClose}>
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎥</span>
          <div>
            <h2 className="font-black text-base">Create a Room</h2>
            <p className="text-slate-300 text-xs font-medium">Livestream or video chat with friends</p>
          </div>
        </div>
        <CloseBtn onClick={onClose} />
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Room Name</label>
          <input autoFocus type="text" maxLength={60}
            className="w-full bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-slate-900 font-bold placeholder:text-slate-400"
            placeholder="e.g. Friday Night Hangout"
            value={roomName} onChange={e => setRoomName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Room Type</label>
          <div className="flex gap-3">
            {(['video', 'audio'] as const).map(t => (
              <button key={t} type="button" onClick={() => setRoomType(t)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition ${
                  roomType === t ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 font-bold' : 'border-slate-300 dark:border-gray-700 text-slate-700 dark:text-slate-200 hover:border-orange-300'
                }`}
              >{t === 'video' ? '📹 Video' : '🎙️ Audio Only'}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Max Participants: <span className="text-orange-500 font-bold">{maxPeople}</span>
          </label>
          <input type="range" min={2} max={50} value={maxPeople} onChange={e => setMaxPeople(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1"><span>2</span><span>50</span></div>
        </div>
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            <strong>Backend Required:</strong> Needs <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded text-xs">POST /api/rooms/create</code>, a <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded text-xs">video_rooms</code> DB table, and a WebRTC provider.
          </p>
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition">Cancel</button>
        <button
          onClick={handleCreate}
          disabled={creating || !roomName.trim()}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >{creating ? 'Creating...' : '🚀 Create Room'}</button>
      </div>
    </ModalWrap>
  );
};
