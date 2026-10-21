import React, { useState, useRef, useEffect } from 'react';
import { FINGERMOBILE_EMOJI_REGISTRY, FingerMobileEmojiItem } from '../../services/emojiPackService';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export interface FingerMobileEmojiPickerProps {
  onSelectEmoji: (emoji: FingerMobileEmojiItem) => void;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  position?: 'top' | 'bottom';
  align?: 'left' | 'right';
  className?: string;
}

export const FingerMobileEmojiPicker: React.FC<FingerMobileEmojiPickerProps> = ({
  onSelectEmoji,
  isOpen,
  onClose,
  title = 'FingerMobile Emojis',
  position = 'top',
  align = 'left',
  className = '',
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredEmojis = FINGERMOBILE_EMOJI_REGISTRY.filter((emoji) => {
    const matchesCategory =
      selectedCategory === 'all' || emoji.category === selectedCategory;
    const matchesSearch =
      search === '' ||
      emoji.name.toLowerCase().includes(search.toLowerCase()) ||
      emoji.slug.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      ref={pickerRef}
      className={`absolute z-50 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-3xl shadow-2xl p-3.5 space-y-2.5 animate-in fade-in zoom-in-95 ${
        position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
      } ${align === 'right' ? 'right-0' : 'left-0'} ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-[#defaf2] p-0.5 border border-emerald-300 flex items-center justify-center">
            <img
              src="/assets/emojis/thumbs_up_wink.png"
              alt="FingerMobile Brand"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xs font-black text-slate-900 dark:text-white">
            {title}
          </span>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-md border border-emerald-300">
            5D Mint
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
          title="Close emoji picker"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <MagnifyingGlassIcon className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        <input
          type="text"
          placeholder="Search brand emojis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      {/* Categories Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 text-[11px] font-bold">
        {[
          { id: 'all', label: 'All' },
          { id: 'reactions', label: 'Reactions' },
          { id: 'toast', label: 'Status' },
          { id: 'branding', label: 'Brand' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
              selectedCategory === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Emojis */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
        {filteredEmojis.map((emoji) => (
          <button
            key={emoji.id}
            type="button"
            onClick={() => {
              onSelectEmoji(emoji);
              onClose();
            }}
            title={emoji.name}
            className="group relative p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 bg-white dark:bg-slate-800 hover:bg-[#defaf2]/40 transition flex flex-col items-center justify-center cursor-pointer shadow-2xs hover:scale-110 duration-150"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#defaf2] via-[#bbf2e3] to-[#e6fff8] p-1 border border-emerald-300 flex items-center justify-center overflow-hidden">
              <img
                src={emoji.imageUrl}
                alt={emoji.altText}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <span className="text-[9px] font-medium text-slate-700 dark:text-slate-300 truncate w-full text-center mt-1">
              {emoji.name.split(' ')[1] || emoji.name}
            </span>
          </button>
        ))}
        {filteredEmojis.length === 0 && (
          <div className="col-span-4 py-6 text-center text-xs text-slate-500">
            No FingerMobile emojis found for "{search}"
          </div>
        )}
      </div>

      <div className="text-[10px] text-slate-500 text-center border-t border-slate-100 dark:border-slate-800 pt-1.5 font-medium">
        ✨ Official 5D Mint-Green Sovereign Emoji Pack
      </div>
    </div>
  );
};

export default FingerMobileEmojiPicker;
