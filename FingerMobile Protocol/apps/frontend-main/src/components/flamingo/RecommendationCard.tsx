import React, { useState } from 'react';
import { FlamingoSizeRecommendation } from '../../services/flamingoService';

interface RecommendationCardProps {
  recommendation: FlamingoSizeRecommendation;
  onFeedback?: (recommendationId: string, feedback: string) => void;
}

const confidenceColors = {
  high: 'bg-green-100 text-green-950 border border-green-400 font-bold border-green-300',
  medium: 'bg-amber-100 text-amber-950 border border-amber-400 font-bold border-yellow-300',
  low: 'bg-red-100 text-red-950 border border-red-400 font-bold border-red-300'
};

const confidenceIcons = {
  high: '✅',
  medium: '⚠️',
  low: '❓'
};

const fitLabels = {
  true_to_size: 'True to Size',
  runs_small: 'Runs Small',
  runs_large: 'Runs Large'
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onFeedback
}) => {
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [selectedFeedback, setSelectedFeedback] = React.useState('');

  const handleFeedbackSubmit = () => {
    if (selectedFeedback && onFeedback) {
      onFeedback(recommendation.id, selectedFeedback);
      setShowFeedback(false);
      setSelectedFeedback('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border-2 border-slate-300 rounded-lg p-6 hover:border-blue-300 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{recommendation.brand_name}</h3>
          <p className="text-sm text-gray-600 mt-1">{recommendation.category_id}</p>
        </div>

        {/* Confidence Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          confidenceColors[recommendation.confidence_level as keyof typeof confidenceColors]
        }`}>
          {confidenceIcons[recommendation.confidence_level as keyof typeof confidenceIcons]}{' '}
          {recommendation.confidence_level
            ? recommendation.confidence_level.charAt(0).toUpperCase() + recommendation.confidence_level.slice(1)
            : 'Unknown'} Confidence
        </span>
      </div>

      {/* Recommended Size */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-700 mb-1">Recommended Size</p>
        <p className="text-3xl font-bold text-blue-900">{recommendation.recommended_size}</p>

        {recommendation.fit_pattern && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-blue-600">Fit Pattern:</span>
            <span className="px-2 py-1 bg-white rounded text-xs font-medium text-blue-800">
              {fitLabels[recommendation.fit_pattern as keyof typeof fitLabels] || recommendation.fit_pattern}
            </span>
          </div>
        )}
      </div>

      {/* Alternative Sizes */}
      {recommendation.alternative_sizes && recommendation.alternative_sizes.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Alternative Sizes</p>
          <div className="flex flex-wrap gap-2">
            {recommendation.alternative_sizes.map((size, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-100 text-gray-950 rounded-full text-sm border border-gray-400 font-black"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reasoning */}
      {recommendation.reasoning && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Why This Size?</p>
          <p className="text-sm text-gray-600">{recommendation.reasoning}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-4 text-xs text-slate-700 mb-4">
        <div>
          <span className="font-medium">Based on:</span> {recommendation.based_on_measurements ? 'Your Measurements' : 'Community Data'}
        </div>
        <div>•</div>
        <div>
          <span className="font-medium">Created:</span> {formatDate(recommendation.created_at || new Date().toISOString())}
        </div>
      </div>

      {/* Feedback Section */}
      {onFeedback && !showFeedback && (
        <button
          onClick={() => setShowFeedback(true)}
          className="w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
        >
          💬 Did this recommendation work? Share feedback
        </button>
      )}

      {showFeedback && (
        <div className="border-t border-slate-300 pt-4 mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">How did it fit?</p>
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              recommendation.confidence_level === 'high' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' :
                recommendation.confidence_level === 'medium' ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold' :
                  'bg-red-100 text-red-950 border border-red-400 font-bold'
            }`}>
              {recommendation.confidence_level
                ? recommendation.confidence_level.charAt(0).toUpperCase() + recommendation.confidence_level.slice(1)
                : 'Unknown'} Confidence
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { value: 'perfect', label: '👌 Perfect', color: 'hover:bg-green-100' },
              { value: 'too_small', label: '📏 Too Small', color: 'hover:bg-red-100' },
              { value: 'too_large', label: '📐 Too Large', color: 'hover:bg-orange-100' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedFeedback(option.value)}
                className={`px-3 py-2 rounded-lg border-2 transition-colors ${
                  selectedFeedback === option.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : `border-slate-300 bg-white text-gray-700 ${option.color}`
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleFeedbackSubmit}
              disabled={!selectedFeedback}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Feedback
            </button>
            <button
              onClick={() => setShowFeedback(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Action Button */}
      {!showFeedback && (
        <button
          type="button"
          aria-label={`View size chart for ${recommendation.brand || 'product'}`}
          onClick={() => window.location.assign(`/flamingo/size-charts?brand=${encodeURIComponent(recommendation.brand || '')}`)}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          View Size Chart →
        </button>
      )}
    </div>
  );
};

export default RecommendationCard;
