import React, { useState } from 'react';
interface BoostPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId?: string;
  postTitle?: string;
  onBoost?: (boostData: any) => void;
}

const BoostPostModal: React.FC<BoostPostModalProps> = ({
  isOpen,
  onClose,
  postId,
  postTitle = 'Your Post',
  onBoost
}) => {
  const [selectedAudience, setSelectedAudience] = useState<'automatic' | 'custom'>('automatic');
  const [budget, setBudget] = useState(25);
  const [duration, setDuration] = useState(7); // days
  const [targeting, setTargeting] = useState({
    location: '',
    ageMin: 18,
    ageMax: 65,
    interests: [] as string[]
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const interestOptions = [
    'Technology', 'Business', 'Lifestyle', 'Education', 'Entertainment',
    'Health', 'Travel', 'Food', 'Fashion', 'Sports', 'Music', 'Art'
  ];

  const toggleInterest = (interest: string) => {
    setTargeting(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const calculateReach = () => {
    // Mock calculation based on budget and duration
    const baseReach = budget * 100;
    const durationMultiplier = Math.sqrt(duration);
    return Math.round(baseReach * durationMultiplier);
  };

  const calculateImpressions = () => {
    return Math.round(calculateReach() * 2.5);
  };

  const handleBoost = async () => {
    try {
      setIsProcessing(true);
      
      const boostData = {
        postId,
        budget,
        duration,
        audience: selectedAudience,
        targeting: selectedAudience === 'custom' ? targeting : null,
        estimatedReach: calculateReach(),
        estimatedImpressions: calculateImpressions()
      };
      
      if (onBoost) {
        await onBoost(boostData);
      }
      
      onClose();
    } catch (err) {
      console.error('Failed to boost post:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose} role="button" tabIndex={0}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🚀 Boost Post
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Post Preview */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Boosting:</p>
              <p className="font-semibold text-gray-900">{postTitle}</p>
            </div>

            {/* Audience Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Audience
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedAudience('automatic')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedAudience === 'automatic'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="font-semibold text-gray-900">Automatic</div>
                  <div className="text-xs text-gray-600 mt-1">AI-optimized targeting</div>
                </button>
                
                <button
                  onClick={() => setSelectedAudience('custom')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedAudience === 'custom'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-semibold text-gray-900">Custom</div>
                  <div className="text-xs text-gray-600 mt-1">Manual targeting</div>
                </button>
              </div>
            </div>

            {/* Custom Targeting Options */}
            {selectedAudience === 'custom' && (
              <div className="space-y-4 border-t border-gray-200 pt-4">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={targeting.location}
                    onChange={(e) => setTargeting(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, Country"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Range
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={targeting.ageMin}
                      onChange={(e) => setTargeting(prev => ({ ...prev, ageMin: parseInt(e.target.value) }))}
                      min={13}
                      max={targeting.ageMax}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <span className="text-gray-600">to</span>
                    <input
                      type="number"
                      value={targeting.ageMax}
                      onChange={(e) => setTargeting(prev => ({ ...prev, ageMax: parseInt(e.target.value) }))}
                      min={targeting.ageMin}
                      max={100}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          targeting.interests.includes(interest)
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Budget & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Math.max(5, parseInt(e.target.value) || 0))}
                    min={5}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Min: $5</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (days)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {[1, 3, 7, 14, 30].map(days => (
                    <option key={days} value={days}>{days} day{days > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Estimated Results */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-3">Estimated Results</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-purple-700">Reach</p>
                  <p className="text-2xl font-bold text-purple-900">{calculateReach().toLocaleString()}</p>
                  <p className="text-xs text-purple-600">people</p>
                </div>
                <div>
                  <p className="text-sm text-purple-700">Impressions</p>
                  <p className="text-2xl font-bold text-purple-900">{calculateImpressions().toLocaleString()}</p>
                  <p className="text-xs text-purple-600">views</p>
                </div>
              </div>
            </div>

            {/* Cost Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Cost:</span>
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(budget)}</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {formatCurrency(budget / duration)}/day for {duration} day{duration > 1 ? 's' : ''}
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleBoost}
              disabled={isProcessing}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Processing...
                </span>
              ) : (
                `Boost Post for ${formatCurrency(budget)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoostPostModal;