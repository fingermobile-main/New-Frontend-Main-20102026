import React, { useState } from 'react';
import { useToast } from '../Toast';
import {
  ShareIcon,
  LinkIcon,
  SparklesIcon,
  XMarkIcon as CloseIcon,
  CheckIcon,
  ExclamationTriangleIcon as AlertTriangleIcon
} from '@heroicons/react/24/outline';

export interface SocialEmbedProduct {
  id: string;
  name: string;
  price: number;
  currency?: string;
  imageUrl?: string;
  platform?: 'marketplace' | 'ownit' | 'flamingo' | 'storefront' | 'fingerlux';
  sellerName?: string;
  description?: string;
  isNsfw?: boolean;
}

interface SocialEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: SocialEmbedProduct | null;
  isNsfw?: boolean;
}

export const SocialEmbedModal: React.FC<SocialEmbedModalProps> = ({
  isOpen,
  onClose,
  product,
  isNsfw
}) => {
  const { addToast } = useToast();
  const [selectedDestination, setSelectedDestination] = useState<
    'postcard' | 'forum' | 'mii' | 'groups' | 'blog' | 'gems' | 'hallmarks'
  >('postcard');
  const [embedCustomNote, setEmbedCustomNote] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isOpen || !product) return null;

  const isFlamingoOrNsfw = isNsfw || product.platform === 'flamingo' || product.isNsfw;
  const productShareUrl = `${window.location.origin}/${product.platform || 'marketplace'}?item=${product.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productShareUrl);
    setCopiedLink(true);
    addToast('Product share link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareExternal = (channel: 'whatsapp' | 'twitter' | 'telegram') => {
    const text = encodeURIComponent(
      `Check out "${product.name}" on FingerMobile Protocol™ (${product.price} ${product.currency || 'USD'}): ${productShareUrl}`
    );
    let url = '';
    if (channel === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${text}`;
    } else if (channel === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${text}`;
    } else if (channel === 'telegram') {
      url = `https://t.me/share/url?url=${encodeURIComponent(productShareUrl)}&text=${encodeURIComponent(product.name)}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleExecuteEmbed = async () => {
    setIsPublishing(true);
    try {
      // Simulate platform post publishing bridge injection
      await new Promise((resolve) => setTimeout(resolve, 800));

      const payload = {
        destination: selectedDestination,
        productId: product.id,
        platform: product.platform,
        name: product.name,
        price: product.price,
        note: embedCustomNote,
        isNsfw: isFlamingoOrNsfw,
        timestamp: new Date().toISOString()
      };

      // Store in session bridge for PostPublishing / target module
      sessionStorage.setItem('fm_pending_embed_card', JSON.stringify(payload));

      addToast(
        `Successfully embedded "${product.name}" into ${selectedDestination.toUpperCase()}!`,
        'success'
      );
      onClose();
    } catch {
      addToast('Failed to process embed. Please retry.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="social-embed-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg overflow-hidden bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShareIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 id="social-embed-title" className="text-base font-bold text-white tracking-tight">
                Embed & Share Product
              </h2>
              <p className="text-xs text-slate-400">
                Universal Cross-Social Bridge • FingerMobile Protocol™
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close embed modal"
            className="p-1.5 text-slate-400 rounded-lg hover:text-white hover:bg-slate-800 transition"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Product Mini Preview */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-950 shrink-0">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/150'}
                alt={product.name}
                className={`w-full h-full object-cover ${isFlamingoOrNsfw ? 'filter blur-sm hover:blur-none transition' : ''}`}
              />
              {isFlamingoOrNsfw && (
                <div className="absolute inset-0 bg-pink-950/60 flex items-center justify-center">
                  <span className="text-[10px] font-black tracking-widest text-pink-300">19+</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {product.platform || 'Platform'}
                </span>
                {isFlamingoOrNsfw && (
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    Discreet / 19+
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-sm text-white truncate mt-1">{product.name}</h3>
              <p className="text-xs text-amber-400 font-bold">
                {product.price.toLocaleString()} {product.currency || 'USD'}
              </p>
            </div>
          </div>

          {/* Adult / NSFW Compliance Notice */}
          {isFlamingoOrNsfw && (
            <div className="p-3 bg-pink-950/30 border border-pink-500/30 rounded-xl flex items-start gap-2.5 text-xs text-pink-200">
              <AlertTriangleIcon className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-pink-300">Protected Adult Content Verification</p>
                <p className="text-pink-300/80 mt-0.5">
                  This product will embed with an automatic blur filter and age disclosure. Only verified 19+ members can unblur inside feeds.
                </p>
              </div>
            </div>
          )}

          {/* Destination Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Destination Platform
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'postcard', label: 'Postcards / Feed', icon: '📬' },
                { id: 'forum', label: 'Forum Discussion', icon: '💬' },
                { id: 'mii', label: 'Mii Showcase', icon: '👤' },
                { id: 'groups', label: 'Groups & Circles', icon: '👥' },
                { id: 'blog', label: 'Blog / Editorial', icon: '📝' },
                { id: 'hallmarks', label: 'Hallmarks / Gems', icon: '💎' }
              ].map((dest) => (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => setSelectedDestination(dest.id as any)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition text-left ${
                    selectedDestination === dest.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">{dest.icon}</span>
                  <span className="truncate">{dest.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Accompanying Note */}
          <div>
            <label htmlFor="embed-note" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Accompanying Caption / Note (Optional)
            </label>
            <textarea
              id="embed-note"
              rows={2}
              value={embedCustomNote}
              onChange={(e) => setEmbedCustomNote(e.target.value)}
              placeholder="Add your thoughts, recommendation, or discount code..."
              className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Quick External Social Sharing */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Share to External Social Media
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleShareExternal('whatsapp')}
                className="flex-1 py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold transition"
              >
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => handleShareExternal('twitter')}
                className="flex-1 py-2 px-3 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold transition"
              >
                X (Twitter)
              </button>
              <button
                type="button"
                onClick={() => handleShareExternal('telegram')}
                className="flex-1 py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold transition"
              >
                Telegram
              </button>
            </div>
          </div>

          {/* Direct Link Copy */}
          <div className="flex items-center gap-2 p-2 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400 truncate flex-1 px-2 font-mono">
              {productShareUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shrink-0"
            >
              {copiedLink ? <CheckIcon className="w-4 h-4 text-emerald-400" /> : <LinkIcon className="w-4 h-4" />}
              {copiedLink ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-950/60 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPublishing}
            onClick={handleExecuteEmbed}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition flex items-center gap-2"
          >
            {isPublishing ? (
              'Publishing...'
            ) : (
              <>
                <SparklesIcon className="w-4 h-4" />
                Embed into {selectedDestination.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialEmbedModal;
