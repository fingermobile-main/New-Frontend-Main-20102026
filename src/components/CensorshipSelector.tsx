import React, { useState, useRef, useEffect } from 'react';

export type VisualEffect = 'NONE' | 'BLUR' | 'CENSOR_BAR' | 'INTERSTITIAL';
export type InteractionRule = 'NONE' | 'CLICK_TO_REVEAL' | '15_SEC_TIMER' | 'VIEW_ONCE';

export interface CensorshipOptions {
  tags: string[];
  visualEffect: VisualEffect;
  interactionRule: InteractionRule;
}

interface CensorshipSelectorProps {
  options: CensorshipOptions;
  onChange: (options: CensorshipOptions) => void;
}

const AVAILABLE_TAGS = [
  'NSFW', 'Violence', 'Substances', 'Strong Language',
  'Spoiler', '18+', 'R', 'NC-17'
];

export default function CensorshipSelector({ options, onChange }: CensorshipSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTag = (tag: string) => {
    const newTags = options.tags.includes(tag)
      ? options.tags.filter(t => t !== tag)
      : [...options.tags, tag];
    onChange({ ...options, tags: newTags });
  };

  const activeCount = options.tags.length + (options.visualEffect !== 'NONE' ? 1 : 0) + (options.interactionRule !== 'NONE' ? 1 : 0);

  return (
    <div className="relative inline-block text-left mb-3 ml-2" ref={dropdownRef}>
      <button
        type="button"
        className={`inline-flex justify-between items-center rounded-md border shadow-sm px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${
          activeCount > 0
            ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Censorship & Tags
        {activeCount > 0 && (
          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-950 border border-red-400 font-bold">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-2 w-80 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 max-h-[80vh] overflow-y-auto">
          <div className="p-4">

            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Content Warnings & Tags</h3>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      options.tags.includes(tag)
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Visual Effect</h3>
              <div className="space-y-2">
                {[
                  { value: 'NONE', label: 'No Effect' },
                  { value: 'BLUR', label: 'Backdrop Blur (Media/General)' },
                  { value: 'CENSOR_BAR', label: 'Black Censor Bars (Text)' },
                  { value: 'INTERSTITIAL', label: 'Full Warning Overlay' }
                ].map(effect => (
                  <label key={effect.value} className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="visualEffect"
                      className="h-4 w-4 text-slate-900 focus:ring-red-500 border-gray-300 font-bold border border-slate-300 rounded bg-white focus:ring-2 placeholder:text-slate-400"
                      checked={options.visualEffect === effect.value}
                      onChange={() => onChange({ ...options, visualEffect: effect.value as VisualEffect })}
                    />
                    <span className="ml-2 text-sm text-gray-700">{effect.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Interaction Rule</h3>
              <div className="space-y-2">
                {[
                  { value: 'NONE', label: 'Open / Unrestricted' },
                  { value: 'CLICK_TO_REVEAL', label: 'Click to Reveal' },
                  { value: '15_SEC_TIMER', label: '15-Second Decipher Timer' },
                  { value: 'VIEW_ONCE', label: 'View Once (Self-destruct)' }
                ].map(rule => (
                  <label key={rule.value} className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="interactionRule"
                      className="h-4 w-4 text-slate-900 focus:ring-red-500 border-gray-300 font-bold border border-slate-300 rounded bg-white focus:ring-2 placeholder:text-slate-400"
                      checked={options.interactionRule === rule.value}
                      onChange={() => onChange({ ...options, interactionRule: rule.value as InteractionRule })}
                    />
                    <span className="ml-2 text-sm text-gray-700">{rule.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
