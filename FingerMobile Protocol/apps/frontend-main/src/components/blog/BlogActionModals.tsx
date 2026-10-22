import React, { useState } from 'react';
import { XIcon } from '../icons';

export interface BlogComment {
  id: string;
  author: string;
  avatar?: string;
  text: string;
  createdAt: string;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle?: string;
  postId?: string | number;
  onCommentSubmitted?: (postId: string | number, comment: string) => void;
}

export const BlogCommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  postTitle,
  postId,
  onCommentSubmitted
}) => {
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<BlogComment[]>([
    {
      id: 'c1',
      author: 'Nia Adebayo',
      text: 'Remarkable article! The architectural perspective on data sovereignty is so timely.',
      createdAt: '12m ago'
    },
    {
      id: 'c2',
      author: 'Kofi Mensah',
      text: 'Loved the section on micro-tipping. We need more decentralized platforms like this.',
      createdAt: '1h ago'
    }
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: BlogComment = {
      id: 'c_' + Date.now(),
      author: 'You',
      text: commentText.trim(),
      createdAt: 'Just now'
    };

    setCommentsList([newComment, ...commentsList]);
    if (onCommentSubmitted && postId) {
      onCommentSubmitted(postId, commentText.trim());
    }
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <span>💬</span> Comments & Discussion
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate max-w-sm mt-0.5">
              {postTitle || 'Community Blog Article'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full text-slate-700 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Join the discussion... Share your thoughts, critique, or insights."
              rows={3}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold placeholder:text-slate-400"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs transition shadow-sm"
              >
                Post Comment →
              </button>
            </div>
          </form>

          <div className="border-t border-slate-200 dark:border-gray-800 pt-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Community Responses ({commentsList.length})
            </h4>
            {commentsList.map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700/60 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900 dark:text-white">@{c.author}</span>
                  <span className="text-[10px] text-slate-700">{c.createdAt}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface SendGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle?: string;
  authorName?: string;
  userFicBalance?: number;
  onGiftSent?: (amount: number, giftName: string) => void;
}

export const BlogSendGiftModal: React.FC<SendGiftModalProps> = ({
  isOpen,
  onClose,
  postTitle,
  authorName,
  userFicBalance = 500,
  onGiftSent
}) => {
  const [selectedGift, setSelectedGift] = useState({
    id: 'gem',
    name: 'Sparkling Gem',
    amount: 25,
    icon: '💎'
  });
  const [memo, setMemo] = useState('Loved this article, keep creating!');

  const GIFTS = [
    { id: 'blossom', name: 'Digital Blossom', amount: 10, icon: '🌸' },
    { id: 'gem', name: 'Sparkling Gem', amount: 25, icon: '💎' },
    { id: 'crown', name: 'Sovereign Crown', amount: 50, icon: '👑' },
    { id: 'diamond', name: 'Diamond Hallmark', amount: 100, icon: '💍' }
  ];

  if (!isOpen) return null;

  const handleSend = () => {
    if (onGiftSent) {
      onGiftSent(selectedGift.amount, selectedGift.name);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <span>🎁</span> Send Sovereign Gift
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5 truncate max-w-xs">
              Reward @{authorName || 'Author'} for &quot;{postTitle || 'Article'}&quot;
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full text-slate-700 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              Select Gift Tier
            </label>
            <div className="grid grid-cols-2 gap-3">
              {GIFTS.map((g) => {
                const isSelected = selectedGift.id === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGift(g)}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 ring-2 ring-orange-500/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <span className="text-2xl">{g.icon}</span>
                    <div>
                      <div className="font-bold text-xs text-gray-900 dark:text-white">{g.name}</div>
                      <div className="text-xs font-bold text-orange-600 dark:text-orange-400">{g.amount} FIC</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
              Personal Appreciation Memo
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Add an encouraging note..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold placeholder:text-slate-400"
            />
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800/80 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-700">Your FIC Balance:</span>
            <span className="font-bold text-gray-900 dark:text-white">{userFicBalance} FIC</span>
          </div>

          <button
            type="button"
            onClick={handleSend}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition"
          >
            Send {selectedGift.amount} FIC Gift ({selectedGift.icon}) →
          </button>
        </div>
      </div>
    </div>
  );
};

interface PaylinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle?: string;
  onPaylinkCreated?: (link: string) => void;
}

export const BlogPaylinkModal: React.FC<PaylinkModalProps> = ({
  isOpen,
  onClose,
  postTitle,
  onPaylinkCreated
}) => {
  const [amount, setAmount] = useState('50');
  const [currency, setCurrency] = useState<'FIC' | 'NGN' | 'USD'>('FIC');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    const code = 'pl_' + Math.random().toString(36).substring(2, 10);
    const link = `http://localhost:3002/pay/${code}?amt=${amount}&cur=${currency}`;
    setGeneratedLink(link);
    if (onPaylinkCreated) {
      onPaylinkCreated(link);
    }
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <span>🔗</span> Create Sovereign Paylink
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5 truncate max-w-xs">
              For: {postTitle || 'Editorial Content'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full text-slate-700 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="FIC">FIC Token</option>
                <option value="NGN">NGN (₦)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          {!generatedLink ? (
            <button
              type="button"
              onClick={handleGenerate}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition"
            >
              Generate Instant Paylink →
            </button>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl text-xs">
                <span className="block text-slate-700 text-[10px] uppercase font-bold">Your Shareable Paylink:</span>
                <p className="font-mono text-purple-700 dark:text-purple-300 break-all select-all font-semibold mt-1">
                  {generatedLink}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <span>{copied ? '✓ Copied to Clipboard!' : '📋 Copy Paylink'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface TokenizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle?: string;
  onTokenized?: () => void;
}

export const BlogTokenizeModal: React.FC<TokenizeModalProps> = ({
  isOpen,
  onClose,
  postTitle,
  onTokenized
}) => {
  const [royaltyRate, setRoyaltyRate] = useState(5);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  if (!isOpen) return null;

  const handleMint = () => {
    setIsMinting(true);
    setTimeout(() => {
      setIsMinting(false);
      setMintSuccess(true);
      if (onTokenized) onTokenized();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
              <span>🪙</span> Tokenize Article to Hallmarks
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5 truncate max-w-xs">
              Mint as Sovereign Proof-of-Achievement NFT
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full text-slate-700 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!mintSuccess ? (
            <>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs space-y-2 border border-slate-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-slate-700">Asset:</span>
                  <span className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{postTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Smart Standard:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">ERC-721 / HallMarks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Network:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">FingerMobile Sovereign L2</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                  Creator Secondary Royalty Split (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={royaltyRate}
                  onChange={(e) => setRoyaltyRate(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                />
                <span className="text-[10px] text-slate-700 mt-0.5 block">
                  Earn {royaltyRate}% perpetually on every secondary trade and ad revenue commission.
                </span>
              </div>

              <button
                type="button"
                onClick={handleMint}
                disabled={isMinting}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition"
              >
                {isMinting ? 'Minting On-Chain...' : 'Confirm & Mint Article Token →'}
              </button>
            </>
          ) : (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-950 border border-green-400 font-bold flex items-center justify-center text-2xl mx-auto  font-black">
                ✓
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white text-base">Token Minted Successfully!</h4>
              <p className="text-xs text-slate-700 max-w-xs mx-auto">
                Your editorial asset has been registered as a Sovereign Proof-of-Achievement Hallmarks token.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
