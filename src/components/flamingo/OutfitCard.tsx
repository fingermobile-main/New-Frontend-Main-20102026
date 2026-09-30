import React, {} from 'react';
import { FlamingoOutfit } from '../../services/flamingoService';

interface OutfitCardProps {
  outfit: FlamingoOutfit;
  onLike?: (outfitId: string) => void;
  onSave?: (outfitId: string) => void;
  onViewDetails?: (outfitId: string) => void;
}

const occasionIcons = {
  casual: '👕',
  formal: '👔',
  business: '💼',
  party: '🎉',
  workout: '🏋️',
  date_night: '💕',
  beach: '🏖️',
  other: '✨'
};

const seasonColors = {
  spring: 'bg-green-100 text-green-800',
  summer: 'bg-yellow-100 text-yellow-800',
  fall: 'bg-orange-100 text-orange-800',
  winter: 'bg-blue-100 text-blue-800',
  all_seasons: 'bg-purple-100 text-purple-800'
};

const OutfitCard: React.FC<OutfitCardProps> = ({
  outfit,
  onLike,
  onSave,
  onViewDetails
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header Image or Placeholder */}
      <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative">
        <div className="text-6xl">
          {outfit.occasion && occasionIcons[outfit.occasion as keyof typeof occasionIcons]}
        </div>

        {/* Favorite Badge */}
        {outfit.is_favorite && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
              ❤️ Favorite
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Metadata */}
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 text-lg mb-1">{outfit.name}</h3>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            {outfit.creator_name && (
              <span>by {outfit.creator_name}</span>
            )}
            {outfit.created_at && (
              <>
                <span>•</span>
                <span>{formatDate(outfit.created_at)}</span>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {outfit.description && (
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {outfit.description}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {outfit.occasion && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {occasionIcons[outfit.occasion as keyof typeof occasionIcons]} {outfit.occasion}
            </span>
          )}

          {outfit.season && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              seasonColors[outfit.season as keyof typeof seasonColors] || 'bg-gray-100 text-gray-700'
            }`}>
              {outfit.season}
            </span>
          )}

          {outfit.style_tags && outfit.style_tags.length > 0 && (
            <>
              {outfit.style_tags.slice(0, 3).map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                  {tag}
                </span>
              ))}
              {outfit.style_tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                  +{outfit.style_tags.length - 3}
                </span>
              )}
            </>
          )}
        </div>

        {/* Color Palette */}
        {outfit.color_palette && outfit.color_palette.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-600">Colors:</span>
            <div className="flex gap-1">
              {outfit.color_palette.map((color, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Items Count */}
        {outfit.items_count !== undefined && (
          <div className="text-sm text-gray-600 mb-3">
            {outfit.items_count} item{outfit.items_count !== 1 ? 's' : ''} in this outfit
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span>❤️</span>
            <span>{outfit.likes_count || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🔖</span>
            <span>{outfit.saves_count || 0}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          {onLike && (
            <button
              onClick={() => onLike(outfit.id)}
              className="flex-1 px-3 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors text-sm font-medium"
            >
              ❤️ Like
            </button>
          )}

          {onSave && (
            <button
              onClick={() => onSave(outfit.id)}
              className="flex-1 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
            >
              🔖 Save
            </button>
          )}

          {onViewDetails && (
            <button
              onClick={() => onViewDetails(outfit.id)}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutfitCard;
