import React, { useState } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterOptions {
  query?: string;
  category?: string;
  sortBy?: string;
}

interface EnhancedFilterBarProps {
  filterOptions?: {
    categories?: string[] | FilterOption[];
    sortByOptions?: FilterOption[];
    searchPlaceholder?: string;
  };
  onFiltersChange?: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

const EnhancedFilterBar: React.FC<EnhancedFilterBarProps> = ({
  filterOptions,
  onFiltersChange,
  initialFilters
}) => {
  const [query, setQuery] = React.useState(initialFilters?.query || '');
  const [category, setCategory] = React.useState(initialFilters?.category || '');
  const [sortBy, setSortBy] = React.useState(initialFilters?.sortBy || '');

  const handleApplyFilters = () => {
    onFiltersChange?.({ query, category, sortBy });
  };

  const getOptionValue = (option: string | FilterOption): string => {
    return typeof option === 'string' ? option : option.value;
  };

  const getOptionLabel = (option: string | FilterOption): string => {
    return typeof option === 'string' ? option : option.label;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Filters</span>
        </div>

        <input
          type="text"
          placeholder={filterOptions?.searchPlaceholder || 'Search...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-48"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleApplyFilters();
            }
          }}
        />

        {filterOptions?.categories && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {filterOptions.categories.map((option, index) => (
              <option key={index} value={getOptionValue(option)}>
                {getOptionLabel(option)}
              </option>
            ))}
          </select>
        )}

        {filterOptions?.sortByOptions && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort By</option>
            {filterOptions.sortByOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default EnhancedFilterBar;
