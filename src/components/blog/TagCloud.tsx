import React, { useEffect, useState } from 'react';
import { blogService, BlogTag } from '../../services/blogService';

interface TagCloudProps {
  onSelectTag?: (tag: BlogTag) => void;
  maxTags?: number;
  minFontSize?: number;
  maxFontSize?: number;
}

const TagCloud: React.FC<TagCloudProps> = ({
  onSelectTag,
  maxTags = 50,
  minFontSize = 12,
  maxFontSize = 32
}) => {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await blogService.getTags();

      // Sort by usage count and limit to maxTags
      const sortedTags = (data || [])
        .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
        .slice(0, maxTags);

      setTags(sortedTags);
      setError(null);
    } catch (err) {
      setError('Failed to load tags');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateFontSize = (usageCount: number, minCount: number, maxCount: number) => {
    if (maxCount === minCount) return (minFontSize + maxFontSize) / 2;

    const ratio = (usageCount - minCount) / (maxCount - minCount);
    return minFontSize + (ratio * (maxFontSize - minFontSize));
  };

  const getTagColor = (index: number, total: number) => {
    // Generate a pleasing color palette based on position
    const hue = (index / total) * 360;
    return `hsl(${hue}, 70%, 45%)`;
  };

  const handleTagClick = (tag: BlogTag) => {
    setSelectedTag(tag.id);
    if (onSelectTag) {
      onSelectTag(tag);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadTags}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-6xl mb-4">🏷️</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Tags Available</h3>
        <p className="text-gray-600">Tags will appear here as articles are published</p>
      </div>
    );
  }

  // Calculate min and max usage counts for scaling
  const usageCounts = tags.map(t => t.usage_count || 0);
  const minCount = Math.min(...usageCounts);
  const maxCount = Math.max(...usageCounts);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Popular Tags</h2>
        <span className="text-sm text-gray-600">
          {tags.length} tag{tags.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Info Box */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
        <p className="text-sm text-purple-800">
          <strong>Tip:</strong> Click on any tag to filter articles by topic. Larger tags indicate more popular topics.
        </p>
      </div>

      {/* Tag Cloud */}
      <div className="bg-white border border-slate-300 rounded-lg p-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {tags.map((tag, index) => {
            const fontSize = calculateFontSize(tag.usage_count || 0, minCount, maxCount);
            const color = getTagColor(index, tags.length);
            const isSelected = selectedTag === tag.id;

            return (
              <button
                key={tag.id}
                onClick={() => handleTagClick(tag)}
                className={`transition-all duration-200 hover:scale-110 ${
                  isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                }`}
                style={{
                  fontSize: `${fontSize}px`,
                  color: isSelected ? '#9333ea' : color,
                  fontWeight: fontSize > 20 ? 600 : 400,
                  padding: `${Math.max(4, fontSize / 4)}px ${Math.max(8, fontSize / 2)}px`,
                  borderRadius: '9999px',
                  backgroundColor: isSelected ? '#f3e8ff' : 'transparent',
                  border: isSelected ? '2px solid #9333ea' : 'none'
                }}
                title={`${tag.name} - ${tag.usage_count} article${tag.usage_count !== 1 ? 's' : ''}`}
              >
                {tag.name}
                <span className="ml-1 text-xs opacity-60">({tag.usage_count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Tags List */}
      <div className="bg-gray-50 border border-slate-300 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Top 10 Most Popular</h3>
        <div className="space-y-2">
          {tags.slice(0, 10).map((tag, index) => (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                selectedTag === tag.id
                  ? 'bg-purple-100 text-purple-900'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                <span className="font-medium">{tag.name}</span>
              </div>
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                {tag.usage_count} {tag.usage_count === 1 ? 'post' : 'posts'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '12px' }}>Small</span>
          <span className="text-gray-400">= Less popular</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '24px', fontWeight: 600 }}>Large</span>
          <span className="text-gray-400">= More popular</span>
        </div>
      </div>
    </div>
  );
};

export default TagCloud;
