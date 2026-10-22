import React from 'react';

interface Tag {
  name: string;
  count: number;
}

interface ForumPopularTagsProps {
  onTagClick?: (tag: string) => void;
}

const defaultTags: Tag[] = [
  { name: 'FingerMobile', count: 1250 },
  { name: 'Tech', count: 843 },
  { name: 'Innovation', count: 652 },
  { name: 'Community', count: 541 },
  { name: 'AI', count: 423 },
  { name: 'Crypto', count: 310 },
  { name: 'NFT', count: 289 },
  { name: 'Web3', count: 195 },
];

const ForumPopularTags: React.FC<ForumPopularTagsProps> = ({ onTagClick }) => {
  return (
    <div className="glass rounded-2xl p-5 border border-white/40 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
      <h3 className="text-sm font-bold text-gray-900 mb-4 tracking-wide uppercase">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {defaultTags.map((tag) => (
          <button
            key={tag.name}
            onClick={() => onTagClick?.(tag.name)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/60 hover:bg-white text-gray-700 hover:text-brand-blue text-sm rounded-lg cursor-pointer transition-colors border border-slate-200 hover:border-brand-blue/30 shadow-sm"
          >
            <span className="text-brand-blue font-bold">#{tag.name}</span>
            <span className="text-xs text-slate-700 bg-gray-50 px-1.5 py-0.5 rounded-md font-medium">
              {tag.count > 1000 ? `${(tag.count / 1000).toFixed(1)}k` : tag.count}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-label="Show more forum tags"
        onClick={() => window.location.assign('/trends')}
        className="w-full mt-4 py-2 text-sm text-brand-blue hover:text-blue-700 font-bold transition-colors"
      >
        Show More Tags
      </button>
    </div>
  );
};

export default ForumPopularTags;
