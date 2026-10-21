import React, { useState, useMemo } from 'react';
import { QuickReplyItem } from '../../gems/types';
import autoReplyService from '../../../services/autoReplyService';
import { Zap, Search, ChevronRight, X, Sparkles } from 'lucide-react';

interface QuickReplyPickerProps {
  onSelectQuickReply: (text: string, quickReplyItem: QuickReplyItem) => void;
  className?: string;
}

export const QuickReplyPicker: React.FC<QuickReplyPickerProps> = ({
  onSelectQuickReply,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const settings = autoReplyService.getSettings();
  const quickReplies = settings.quickReplies || [];

  const filteredReplies = useMemo(() => {
    return quickReplies.filter((qr) => {
      const matchesSearch =
        qr.shortcut.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qr.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'all' || qr.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [quickReplies, searchQuery, selectedCategory]);

  const handleSelect = (qr: QuickReplyItem) => {
    const interpolated = autoReplyService.interpolateVariables(qr.content);
    onSelectQuickReply(interpolated, qr);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Quick Replies & Keyboard Shortcuts"
        className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-500/50 text-sky-400 hover:text-sky-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
      >
        <Zap className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Quick Replies</span>
        <span className="font-mono text-[10px] bg-slate-950 px-1 py-0.5 rounded text-sky-300 border border-slate-800">
          /
        </span>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 bottom-full mb-2 w-80 sm:w-96 bg-slate-950 border border-sky-500/40 rounded-2xl p-3.5 shadow-2xl z-50 animate-fade-in text-white space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Quick Replies ({quickReplies.length}/50)</h4>
                  <p className="text-[10px] text-slate-300">Insert pre-saved response</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-300 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search shortcuts (e.g. /pricing, /hours)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
              {['all', 'pricing', 'hours', 'portfolio', 'booking', 'support'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded-md font-semibold capitalize whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Replies List */}
            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
              {filteredReplies.length === 0 ? (
                <div className="text-center py-6 text-slate-300 text-xs">
                  No quick reply shortcuts found.
                </div>
              ) : (
                filteredReplies.map((qr) => (
                  <button
                    key={qr.id}
                    type="button"
                    onClick={() => handleSelect(qr)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/40 transition group flex items-start justify-between gap-2 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30">
                          {qr.shortcut}
                        </span>
                        <span className="font-bold text-xs text-white group-hover:text-sky-300 transition line-clamp-1">
                          {qr.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {qr.content}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
