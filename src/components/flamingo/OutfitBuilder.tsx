import React, { useState } from 'react';
import { flamingoService, FlamingoOutfit } from '../../services/flamingoService';

interface OutfitBuilderProps {
  userId: string;
  onSave?: (outfit: FlamingoOutfit) => void;
  onCancel?: () => void;
}

const occasions = [
  { value: 'casual', label: 'Casual', icon: '👕' },
  { value: 'formal', label: 'Formal', icon: '👔' },
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'party', label: 'Party', icon: '🎉' },
  { value: 'workout', label: 'Workout', icon: '🏋️' },
  { value: 'date', label: 'Date Night', icon: '💕' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'other', label: 'Other', icon: '✨' }
];

const seasons = [
  { value: 'spring', label: 'Spring', color: 'bg-green-100 text-green-800' },
  { value: 'summer', label: 'Summer', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'fall', label: 'Fall', color: 'bg-orange-100 text-orange-800' },
  { value: 'winter', label: 'Winter', color: 'bg-blue-100 text-blue-800' },
  { value: 'all_season', label: 'All Seasons', color: 'bg-purple-100 text-purple-800' }
];

const OutfitBuilder: React.FC<OutfitBuilderProps> = ({
  userId,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    occasion: '' as 'casual' | 'formal' | 'business' | 'party' | 'workout' | 'date' | 'travel' | 'other' | '',
    season: '' as 'spring' | 'summer' | 'fall' | 'winter' | 'all_season' | '',
    is_public: true,
    is_favorite: false,
    style_tags: [] as string[],
    color_palette: [] as string[],
    items: [] as any[],
    likes_count: 0,
    saves_count: 0,
    views_count: 0
  });
  const [newTag, setNewTag] = useState('');
  const [newColor, setNewColor] = useState('#000000');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.occasion) {
      setError('Please fill in required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Filter out empty strings to match FlamingoOutfit interface
      const outfitData = {
        ...formData,
        occasion: formData.occasion || undefined,
        season: formData.season || undefined
      };

      const outfit = await flamingoService.createOutfit(outfitData);

      if (onSave && outfit) {
        onSave(outfit);
      }
    } catch (err) {
      setError('Failed to create outfit. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.style_tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        style_tags: [...prev.style_tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      style_tags: prev.style_tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addColor = () => {
    if (!formData.color_palette.includes(newColor)) {
      setFormData(prev => ({
        ...prev,
        color_palette: [...prev.color_palette, newColor]
      }));
    }
  };

  const removeColor = (colorToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      color_palette: prev.color_palette.filter(color => color !== colorToRemove)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Build New Outfit</h3>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Outfit Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Outfit Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Summer Casual Look"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your outfit..."
          />
        </div>

        {/* Occasion Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occasion *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {occasions.map((occasion) => (
              <button
                key={occasion.value}
                type="button"
                onClick={() => setFormData({...formData, occasion: occasion.value as typeof formData.occasion})}
                className={`px-3 py-2 rounded-lg border-2 transition-colors ${
                  formData.occasion === occasion.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{occasion.icon}</span>
                <span className="ml-1 text-sm">{occasion.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Season Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Season
          </label>
          <div className="flex flex-wrap gap-2">
            {seasons.map((season) => (
              <button
                key={season.value}
                type="button"
                onClick={() => setFormData({...formData, season: season.value as typeof formData.season})}
                className={`px-3 py-2 rounded-lg border-2 transition-colors ${
                  formData.season === season.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className={`text-xs font-medium ${season.color.split(' ')[1]}`}>
                  {season.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Style Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Style Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Add a tag (e.g., minimalist, vintage)"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Add
            </button>
          </div>
          {formData.style_tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.style_tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Color Palette */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color Palette
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <button
              type="button"
              onClick={addColor}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Add Color
            </button>
          </div>
          {formData.color_palette.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.color_palette.map((color) => (
                <div
                  key={color}
                  className="relative group"
                >
                  <div
                    className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Visibility Toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_public}
              onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Make Public</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_favorite}
              onChange={(e) => setFormData({...formData, is_favorite: e.target.checked})}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Mark as Favorite</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating...' : 'Create Outfit'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OutfitBuilder;
