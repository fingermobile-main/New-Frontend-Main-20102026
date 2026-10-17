import React, { useState, useEffect } from 'react';

// ─── Shared close button ──────────────────────────────────────────────────────
const CloseBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

// ─── Backdrop wrapper ─────────────────────────────────────────────────────────
const ModalWrap: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({ onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

// ─── Reply Modal ──────────────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

export const ReplyModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  if (!isOpen) return null;
  return (
    <ModalWrap onClose={onClose}>
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">💬 Reply to Post</h2>
        <CloseBtn onClick={onClose} />
      </div>
      <div className="p-4">
        <textarea
          autoFocus
          className="w-full bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none min-h-[120px] text-sm text-slate-900 font-bold placeholder:text-slate-400"
          placeholder="Write your reply..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
        <button
          onClick={() => { if (content.trim()) { onSubmit(content); setContent(''); onClose(); } }}
          disabled={!content.trim()}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reply
        </button>
      </div>
    </ModalWrap>
  );
};

// ─── Report Modal ─────────────────────────────────────────────────────────────
const REPORT_REASONS = [
  'Spam or misleading',
  'Hate speech or discrimination',
  'Harassment or bullying',
  'Nudity or sexual content',
  'Violence or dangerous content',
  'Intellectual property violation',
  'Other',
];

export const ReportModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [extra, setExtra] = useState('');
  if (!isOpen) return null;
  return (
    <ModalWrap onClose={onClose}>
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">⚠️ Report Post</h2>
        <CloseBtn onClick={onClose} />
      </div>
      <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
        <p className="text-sm text-gray-600 dark:text-gray-400">Select a reason for reporting:</p>
        <div className="space-y-2">
          {REPORT_REASONS.map(r => (
            <button
              key={r} type="button" onClick={() => setReason(r)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium border transition ${
                reason === r
                  ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-300 hover:bg-red-50/50'
              }`}
            >{r}</button>
          ))}
        </div>
        <textarea
          className="w-full bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:outline-none resize-none min-h-[70px] text-sm text-slate-900 font-bold placeholder:text-slate-400"
          placeholder="Additional details (optional)..."
          value={extra}
          onChange={e => setExtra(e.target.value)}
        />
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
        <button
          onClick={() => { if (reason) { onSubmit(`${reason}${extra ? ': ' + extra : ''}`); setReason(''); setExtra(''); onClose(); } }}
          disabled={!reason}
          className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Report
        </button>
      </div>
    </ModalWrap>
  );
};

// ─── Edit Post Modal (own posts only) ────────────────────────────────────────
interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
  initialContent: string;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({ isOpen, onClose, onSubmit, initialContent }) => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (isOpen) setContent(initialContent);
  }, [isOpen, initialContent]);

  if (!isOpen) return null;

  const isChanged = content.trim() !== initialContent.trim();

  return (
    <ModalWrap onClose={onClose}>
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">✏️ Edit Post</h2>
        <CloseBtn onClick={onClose} />
      </div>
      <div className="p-4">
        <textarea
          autoFocus
          className="w-full bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none min-h-[150px] text-sm text-slate-900 dark:text-gray-200 font-bold placeholder:text-slate-400"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <p className="text-[11px] text-gray-400 mt-1.5">
          Edit history is tracked. Posts are subject to community guidelines.
        </p>
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition">
          Cancel
        </button>
        <button
          onClick={() => { if (content.trim() && isChanged) { onSubmit(content.trim()); onClose(); } }}
          disabled={!content.trim() || !isChanged}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Changes
        </button>
      </div>
    </ModalWrap>
  );
};
