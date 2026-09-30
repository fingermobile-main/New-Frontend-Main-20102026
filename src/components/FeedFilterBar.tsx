import React, { useState } from 'react';
interface FeedFilterBarProps {
  onFilterChange?: (filters: any) => void;
  categories?: string[];
}

const FeedFilterBar: React.FC<FeedFilterBarProps> = ({
  onFilterChange,
  categories = ['All', 'Trending', 'Recent', 'Popular', 'Following', 'Videos', 'Photos', 'Articles']
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [contentType, setContentType] = useState<string[]>(['all']);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (onFilterChange) {
      onFilterChange({ category, sortBy, dateRange, contentType });
    }
  };

  const handleSortChange = (sort: 'recent' | 'popular' | 'trending') => {
    setSortBy(sort);
    if (onFilterChange) {
      onFilterChange({ category: selectedCategory, sortBy: sort, dateRange, contentType });
    }
  };

  const toggleContentType = (type: string) => {
    setContentType(prev =>
      prev.includes(type) && type !== 'all'
        ? prev.filter(t => t !== type)
        : type === 'all'
          ? ['all']
          : [...prev.filter(t => t !== 'all'), type]
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Main Filter Bar */}
      <div className="p-4 space-y-3">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort and Filter Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Time:</span>
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value as any);
                if (onFilterChange) {
                  onFilterChange({ category: selectedCategory, sortBy, dateRange: e.target.value, contentType });
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <span>⚙️</span>
            Advanced Filters
            <span className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>▼</span>
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4 mt-4 space-y-4 animate-fade-in">
            {/* Content Type Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'video', 'photo', 'article', 'poll'].map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleContentType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                      contentType.includes(type)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'all' ? 'All Types' : type + 's'}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Likes</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                <input
                  type="text"
                  placeholder="Search author..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (onFilterChange) {
                    onFilterChange({ category: selectedCategory, sortBy, dateRange, contentType });
                  }
                  setShowFilters(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Apply Filters
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSortBy('recent');
                  setDateRange('all');
                  setContentType(['all']);
                  if (onFilterChange) {
                    onFilterChange({ category: 'All', sortBy: 'recent', dateRange: 'all', contentType: ['all'] });
                  }
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Reset All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(selectedCategory !== 'All' || sortBy !== 'recent' || dateRange !== 'all') && (
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600 font-medium">Active filters:</span>

          {selectedCategory !== 'All' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {selectedCategory} ✕
            </span>
          )}

          {sortBy !== 'recent' && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium capitalize">
              {sortBy} ✕
            </span>
          )}

          {dateRange !== 'all' && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              {dateRange} ✕
            </span>
          )}

          <button
            onClick={() => {
              setSelectedCategory('All');
              setSortBy('recent');
              setDateRange('all');
              if (onFilterChange) {
                onFilterChange({ category: 'All', sortBy: 'recent', dateRange: 'all', contentType });
              }
            }}
            className="text-sm text-red-600 hover:text-red-700 font-medium ml-auto"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedFilterBar;
