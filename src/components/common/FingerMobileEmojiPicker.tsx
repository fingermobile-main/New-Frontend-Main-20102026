import React, { useState, useMemo } from 'react';
import { Sparkles, X, Search, Radio, MessageSquare, Headphones, ShieldCheck } from 'lucide-react';
import { emojiPackService, FingerMobileEmojiItem, FINGERMOBILE_EMOJI_REGISTRY } from '../../services/emojiPackService';

interface FingerMobileEmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: FingerMobileEmojiItem) => void;
  className?: string;
  title?: string;
}

type CategoryTab = 'all' | 'reactions' | 'voiceline' | 'toast' | 'branding';

export const FingerMobileEmojiPicker: React.FC<FingerMobileEmojiPickerProps> = ({
  isOpen,
  onClose,
  onSelectEmoji,
  className = '',
  title = 'FingerMobile™ Sovereign Emoji Pack'
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredEmoji, setHoveredEmoji] = useState<FingerMobileEmojiItem | null>(null);

  const filteredEmojis = useMemo(() => {
    return FINGERMOBILE_EMOJI_REGISTRY.filter((item) => {
      const matchesCategory =
        activeCategory === 'all'
          ? true
          : activeCategory === 'toast'
          ? item.category === 'toast' || item.category === 'status'
          : item.category === activeCategory;

      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.altText.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="FingerMobile Emoji Picker"
      className={`relative z-50 w-80 sm:w-96 rounded-2xl bg-white border-2 border-emerald-400/80 shadow-2xl overflow-hidden font-sans ${className}`}
      style={{
        boxShadow: '0 20px 40px -15px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.1)'
      }}
    >
      {/* Brand Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 p-3.5 text-white flex items-center justify-between border-b border-emerald-500/30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-400/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black tracking-wide text-white uppercase flex items-center gap-1.5">
              {title}
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                5D Mint
              </span>
            </h3>
            <p className="text-[10px] text-emerald-200/80 font-medium">
              Sovereign branding asset • Glossy glass #defaf2
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close emoji picker"
          className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-2.5 bg-slate-50 border-b border-slate-200">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FingerMobile 5D emojis..."
            className="w-full pl-8 pr-3 py-1.5 text-xs text-slate-900 font-bold border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 placeholder:font-normal"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 mt-2 overflow-x-auto no-scrollbar pb-0.5">
          {(
            [
              { id: 'all', label: 'All', icon: Sparkles },
              { id: 'reactions', label: 'Reactions', icon: MessageSquare },
              { id: 'voiceline', label: 'VoiceLine', icon: Headphones },
              { id: 'toast', label: 'Alerts', icon: Radio },
              { id: 'branding', label: 'Brand 5D', icon: ShieldCheck }
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Emoji Grid */}
      <div className="p-3 max-h-60 overflow-y-auto grid grid-cols-4 sm:grid-cols-5 gap-2.5 bg-white">
        {filteredEmojis.map((emoji) => (
          <button
            key={emoji.id}
            onClick={() => {
              onSelectEmoji(emoji);
            }}
            onMouseEnter={() => setHoveredEmoji(emoji)}
            onMouseLeave={() => setHoveredEmoji(null)}
            title={emoji.name}
            className="group relative flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-400 transition-all cursor-pointer active:scale-95"
          >
            <div className="relative w-11 h-11 flex items-center justify-center">
              <img
                src={emoji.imageUrl}
                alt={emoji.altText}
                className="w-10 h-10 object-contain rounded-full shadow-sm group-hover:scale-115 transition-transform duration-200"
                loading="lazy"
              />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-white" />
            </div>
            <span className="mt-1 text-[10px] font-bold text-slate-800 truncate max-w-full group-hover:text-emerald-900">
              {emoji.name.replace('FingerMobile ', '')}
            </span>
          </button>
        ))}

        {filteredEmojis.length === 0 && (
          <div className="col-span-full py-8 text-center text-xs text-slate-500 font-medium">
            No FingerMobile brand emoji found for &quot;{searchQuery}&quot;
          </div>
        )}
      </div>

      {/* Hovered Emoji Preview Footer */}
      <div className="p-2.5 bg-gradient-to-r from-emerald-50 to-slate-50 border-t border-slate-200 flex items-center justify-between">
        {hoveredEmoji ? (
          <div className="flex items-center gap-2">
            <img
              src={hoveredEmoji.imageUrl}
              alt={hoveredEmoji.name}
              className="w-7 h-7 object-contain rounded-full border border-emerald-400/50 bg-white"
            />
            <div className="leading-tight">
              <p className="text-[11px] font-black text-slate-900">{hoveredEmoji.name}</p>
              <p className="text-[10px] text-emerald-800 font-semibold font-mono">:{hoveredEmoji.slug}:</p>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-slate-600 font-medium">
            FingerMobile official 5D mint-green glass emoji pack
          </p>
        )}
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 font-bold border border-emerald-300">
          #defaf2
        </span>
      </div>
    </div>
  );
};

export default FingerMobileEmojiPicker;
