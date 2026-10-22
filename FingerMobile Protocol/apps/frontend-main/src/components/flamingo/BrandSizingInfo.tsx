import { Link} from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { flamingoService, FlamingoBrandSizing } from '../../services/flamingoService';

interface BrandSizingInfoProps {
  brandName?: string;
}

const fitPatternIcons = {
  true_to_size: '✅',
  runs_small: '📏',
  runs_large: '📐',
  slim_fit: '👔',
  relaxed_fit: '👕',
  oversized: '🧥'
};

const fitPatternColors = {
  true_to_size: 'bg-green-100 text-green-950 border border-green-400 font-bold',
  runs_small: 'bg-red-100 text-red-950 border border-red-400 font-bold',
  runs_large: 'bg-orange-100 text-orange-800',
  slim_fit: 'bg-blue-100 text-blue-950 border border-blue-400 font-bold',
  relaxed_fit: 'bg-purple-100 text-purple-950 border border-purple-400 font-bold',
  oversized: 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
};

const getFitIcon = (pattern: string | undefined): string => {
  if (!pattern) return '❓';
  return fitPatternIcons[pattern as keyof typeof fitPatternIcons] || '❓';
};

const getFitColor = (pattern: string | undefined): string => {
  if (!pattern) return 'bg-gray-100 text-gray-800';
  return fitPatternColors[pattern as keyof typeof fitPatternColors] || 'bg-gray-100 text-gray-800';
};

const formatPatternLabel = (pattern: string): string => {
  return pattern.replace('_', ' ').charAt(0).toUpperCase() + pattern.slice(1).replace('_', ' ');
};

const BrandSizingInfo: React.FC<BrandSizingInfoProps> = ({ brandName }) => {
  const [brandSizings, setBrandSizings] = useState<FlamingoBrandSizing[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>(brandName || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBrandSizings();
  }, []);

  const loadBrandSizings = async () => {
    try {
      setLoading(true);
      const data = await flamingoService.getBrandSizings();
      setBrandSizings(data || []);

      if (!selectedBrand && data && data.length > 0) {
        setSelectedBrand(data[0].brand_name);
      }

      setError(null);
    } catch (err) {
      setError('Failed to load brand sizing information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedSizing = brandSizings.find(b => b.brand_name === selectedBrand);

  const getFitAdvice = (pattern: string) => {
    switch (pattern) {
    case 'runs_small':
      return 'Consider sizing up for a comfortable fit';
    case 'runs_large':
      return 'Consider sizing down for a better fit';
    case 'slim_fit':
      return 'Designed for a close-to-body fit';
    case 'relaxed_fit':
      return 'Designed for a loose, comfortable fit';
    case 'oversized':
      return 'Intentionally oversized for a streetwear look';
    default:
      return 'Order your usual size';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadBrandSizings}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Brand Sizing Guide</h2>
      </div>

      {/* Brand Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {brandSizings.map((brand) => (
          <button
            key={brand.brand_name}
            onClick={() => setSelectedBrand(brand.brand_name)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              selectedBrand === brand.brand_name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {brand.brand_name}
          </button>
        ))}
      </div>

      {/* Selected Brand Info */}
      {selectedSizing && (
        <div className="space-y-4">
          {/* Brand Header Card */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-blue-900">{selectedSizing.brand_name}</h3>
                {selectedSizing.description && (
                  <p className="text-sm text-blue-700 mt-1">{selectedSizing.description}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-600 mb-1">Overall Fit Pattern</p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  getFitColor(selectedSizing.fit_pattern)
                }`}>
                  {getFitIcon(selectedSizing.fit_pattern)}{' '}
                  {selectedSizing.fit_pattern ? formatPatternLabel(selectedSizing.fit_pattern) : 'N/A'}
                </span>
              </div>
            </div>

            {/* Fit Advice */}
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Sizing Tip:</strong> {getFitAdvice(selectedSizing.fit_pattern || '')}
              </p>
            </div>
          </div>

          {/* Category-Specific Patterns */}
          {selectedSizing.category_patterns && Object.keys(selectedSizing.category_patterns).length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Category-Specific Fit</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(selectedSizing.category_patterns).map(([category, pattern]) => (
                  <div
                    key={category}
                    className="bg-white border border-slate-300 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900 capitalize">
                        {category.replace('_', ' ')}
                      </h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getFitColor(typeof pattern === 'string' ? pattern : undefined)
                      }`}>
                        {getFitIcon(typeof pattern === 'string' ? pattern : undefined)}{' '}
                        {typeof pattern === 'string' ? formatPatternLabel(pattern) : String(pattern)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {getFitAdvice(typeof pattern === 'string' ? pattern : String(pattern))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Insights */}
          {selectedSizing.community_notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">👥 Community Insights</h4>
              <p className="text-sm text-yellow-800 whitespace-pre-wrap">
                {selectedSizing.community_notes}
              </p>
            </div>
          )}

          {/* Size Conversion Table Link */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">Need Exact Measurements?</h4>
                <p className="text-sm text-purple-700">
                  View detailed size charts with chest, waist, and hip measurements
                </p>
              </div>
              <button
                type="button"
                aria-label={`View size chart for ${selectedSizing.brand_name}`}
                onClick={() => window.location.assign(`/flamingo/size-charts?brand=${encodeURIComponent(selectedSizing.brand_name)}`)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
              >
                View Size Chart →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedSizing && brandSizings.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-slate-700">No brand sizing information available</p>
        </div>
      )}
    </div>
  );
};

export default BrandSizingInfo;
