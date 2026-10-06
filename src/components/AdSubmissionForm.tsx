import React from 'react';

interface AdSubmissionFormProps {
  onSubmit?: (_adData: any) => void;
  isLoading?: boolean;
}

const AdSubmissionForm: React.FC<AdSubmissionFormProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    media_url: '',
    thumbnail_url: '',
    destination_url: '',
    budget: '',
    duration: '7',
    category: 'general',
    campaign_type: 'display',
    ad_placement: 'h2_banner',
    ad_format: 'single_image',
    headline: '',
    primary_text: '',
    call_to_action: 'Learn More',
    target_locations: [],
    target_genders: ['all'],
    target_age_min: 18,
    target_age_max: 65,
    target_keywords: [],
    video_duration_seconds: 30,
    file_size_bytes: 0,
    aspect_ratio: '16:9',
    has_safe_area_padding: true,
    ad_frequency_hourly: 10,
    ad_days: 7,
    media_type: 'image',
    ad_height: 320,
    ad_width: 480,
    is_preroll_video: false,
    carousel_cards: [],
    thumbnail_text_percentage: 0, // For AI policy compliance
    targeting: {
      geo: 'Global',
      age: '18-45',
      interests: ['General']
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare targeting data
    const targetingData = {
      geo: formData.target_locations.join(', ') || 'Global',
      age: `${formData.target_age_min}-${formData.target_age_max}`,
      interests: formData.target_keywords.length > 0 ? formData.target_keywords : ['General']
    };

    const submissionData = {
      ...formData,
      targeting: targetingData,
      total_budget: parseFloat(formData.budget) || 100,
      daily_budget: parseFloat(formData.budget) / parseInt(formData.duration) || 10,
      currency: 'FIC',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + parseInt(formData.duration) * 24 * 60 * 60 * 1000).toISOString(),
      // Convert placement to match backend expectations
      placement: formData.ad_placement
    };

    onSubmit?.(submissionData);
  };

  const handleChange = (field: string, value: string | number | boolean | string[] | object) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDimensionChange = (dimension: 'height' | 'width', value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      [`ad_${dimension}`]: numValue,
      aspect_ratio: `${prev.ad_width}:${prev.ad_height}`.replace(`${dimension === 'width' ? prev.ad_width : numValue}`, value) // Update aspect ratio
    }));
  };

  const placementOptions = [
    { value: 'feed_video', label: 'Feed Video' },
    { value: '360_video', label: '360 Video' },
    { value: 'carousel_video', label: 'Carousel Video' },
    { value: 'instant_articles', label: 'Instant Articles' },
    { value: 'instream', label: 'In-stream' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'stories', label: 'Stories' },
    { value: 'search_results', label: 'Search Results' },
    { value: 'h2_banner', label: 'H2 Banner' },
    { value: 'interstitial', label: 'Interstitial' },
    { value: 'vertical_content_big', label: 'Vertical Content Big (6000x4000)' },
    { value: 'horizontal_main', label: 'Horizontal Main (320x480)' },
    { value: 'embedded_picture', label: 'Embedded Picture (320x480)' },
    { value: 'embedded_video', label: 'Embedded Video (320x480)' },
    { value: 'horizontal_content_big', label: 'Horizontal Content Big (3840x2160)' },
    { value: 'sponsored_ad_main', label: 'Sponsored Ad Main (800x600)' },
    { value: 'horizontal_inline', label: 'Horizontal Inline (1080x2500)' },
    { value: 'inline_small', label: 'Inline Small (250x1500)' },
    { value: 'embedded_google_ads', label: 'Embedded Google Ads (1080x2500)' },
    { value: 'embedded_instagram_ads', label: 'Embedded Instagram Ads (1080x2500)' },
    { value: 'embedded_facebook_ads', label: 'Embedded Facebook Ads (1080x2500)' }
  ];

  const campaignTypes = [
    { value: 'search', label: 'Search' },
    { value: 'display', label: 'Display' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'video', label: 'Video' },
    { value: 'app', label: 'App' },
    { value: 'discovery', label: 'Discovery' },
    { value: 'performance_max', label: 'Performance Max' },
    { value: 'smart', label: 'Smart' },
    { value: 'local_services', label: 'Local Services' },
    { value: 'interstitial', label: 'Interstitial' }
  ];

  const callToActionOptions = [
    { value: 'Learn More', label: 'Learn More' },
    { value: 'Shop Now', label: 'Shop Now' },
    { value: 'Sign Up', label: 'Sign Up' },
    { value: 'Download', label: 'Download' },
    { value: 'Watch', label: 'Watch' },
    { value: 'Play', label: 'Play' },
    { value: 'Install', label: 'Install' },
    { value: 'Book Now', label: 'Book Now' },
    { value: 'Apply Now', label: 'Apply Now' },
    { value: 'View Deal', label: 'View Deal' },
    { value: 'Get Quote', label: 'Get Quote' },
    { value: 'Contact Us', label: 'Contact Us' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Ad Title/Campaign Name
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter ad title or campaign name"
          />
        </div>

        <div>
          <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">
            Ad Headline (Max 40 chars)
          </label>
          <input
            type="text"
            id="headline"
            value={formData.headline}
            onChange={(e) => handleChange('headline', e.target.value)}
            maxLength={40}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter ad headline (max 40 characters)"
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.headline.length}/40 characters
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe your advertisement"
        />
      </div>

      <div>
        <label htmlFor="primary_text" className="block text-sm font-medium text-gray-700 mb-1">
          Primary Text
        </label>
        <textarea
          id="primary_text"
          value={formData.primary_text}
          onChange={(e) => handleChange('primary_text', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Primary text for your ad"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="media_url" className="block text-sm font-medium text-gray-700 mb-1">
            Media URL
          </label>
          <input
            type="url"
            id="media_url"
            value={formData.media_url}
            onChange={(e) => handleChange('media_url', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/ad-video.mp4"
          />
        </div>

        <div>
          <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail URL
          </label>
          <input
            type="url"
            id="thumbnail_url"
            value={formData.thumbnail_url}
            onChange={(e) => handleChange('thumbnail_url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/thumbnail.jpg"
          />
        </div>
      </div>

      <div>
        <label htmlFor="destination_url" className="block text-sm font-medium text-gray-700 mb-1">
          Destination URL
        </label>
        <input
          type="url"
          id="destination_url"
          value={formData.destination_url}
          onChange={(e) => handleChange('destination_url', e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://your-website.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget (FIC)
          </label>
          <input
            type="number"
            id="budget"
            value={formData.budget}
            onChange={(e) => handleChange('budget', e.target.value)}
            required
            min="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1000"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duration (days, max 90)
          </label>
          <select
            id="duration"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days (Max)</option>
          </select>
        </div>

        <div>
          <label htmlFor="ad_days" className="block text-sm font-medium text-gray-700 mb-1">
            Ad Days (1-90)
          </label>
          <input
            type="number"
            id="ad_days"
            value={formData.ad_days}
            onChange={(e) => handleChange('ad_days', parseInt(e.target.value) || 7)}
            min="1"
            max="90"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="7"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="general">General</option>
            <option value="technology">Technology</option>
            <option value="fashion">Fashion</option>
            <option value="entertainment">Entertainment</option>
            <option value="education">Education</option>
            <option value="health">Health</option>
            <option value="finance">Finance</option>
            <option value="sports">Sports</option>
            <option value="food">Food & Dining</option>
            <option value="travel">Travel</option>
          </select>
        </div>

        <div>
          <label htmlFor="campaign_type" className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Type
          </label>
          <select
            id="campaign_type"
            value={formData.campaign_type}
            onChange={(e) => handleChange('campaign_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {campaignTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ad_placement" className="block text-sm font-medium text-gray-700 mb-1">
            Ad Placement
          </label>
          <select
            id="ad_placement"
            value={formData.ad_placement}
            onChange={(e) => handleChange('ad_placement', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {placementOptions.map(placement => (
              <option key={placement.value} value={placement.value}>{placement.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="ad_height" className="block text-sm font-medium text-gray-700 mb-1">
            Ad Height (px)
          </label>
          <input
            type="number"
            id="ad_height"
            value={formData.ad_height}
            onChange={(e) => handleDimensionChange('height', e.target.value)}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="320"
          />
        </div>

        <div>
          <label htmlFor="ad_width" className="block text-sm font-medium text-gray-700 mb-1">
            Ad Width (px)
          </label>
          <input
            type="number"
            id="ad_width"
            value={formData.ad_width}
            onChange={(e) => handleDimensionChange('width', e.target.value)}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="480"
          />
        </div>

        <div>
          <label htmlFor="aspect_ratio" className="block text-sm font-medium text-gray-700 mb-1">
            Aspect Ratio
          </label>
          <input
            type="text"
            id="aspect_ratio"
            value={formData.aspect_ratio}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
            placeholder="Auto calculated"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="media_type" className="block text-sm font-medium text-gray-700 mb-1">
            Media Type
          </label>
          <select
            id="media_type"
            value={formData.media_type}
            onChange={(e) => handleChange('media_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div>
          <label htmlFor="video_duration_seconds" className="block text-sm font-medium text-gray-700 mb-1">
            Video Duration (sec)
          </label>
          <input
            type="number"
            id="video_duration_seconds"
            value={formData.video_duration_seconds}
            onChange={(e) => handleChange('video_duration_seconds', parseInt(e.target.value) || 30)}
            min="1"
            max="300"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="30"
          />
        </div>

        <div>
          <label htmlFor="thumbnail_text_percentage" className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail Text % (≤20% for approval)
          </label>
          <input
            type="number"
            id="thumbnail_text_percentage"
            value={formData.thumbnail_text_percentage}
            onChange={(e) => handleChange('thumbnail_text_percentage', parseInt(e.target.value) || 0)}
            min="0"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="has_safe_area_padding"
            checked={formData.has_safe_area_padding}
            onChange={(e) => handleChange('has_safe_area_padding', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="has_safe_area_padding" className="ml-2 block text-sm text-gray-700">
            Has Safe Area Padding (for Stories ads)
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_preroll_video"
            checked={formData.is_preroll_video}
            onChange={(e) => handleChange('is_preroll_video', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_preroll_video" className="ml-2 block text-sm text-gray-700">
            Is Pre-roll Video
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="call_to_action" className="block text-sm font-medium text-gray-700 mb-1">
          Call to Action
        </label>
        <select
          id="call_to_action"
          value={formData.call_to_action}
          onChange={(e) => handleChange('call_to_action', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {callToActionOptions.map(action => (
            <option key={action.value} value={action.value}>{action.label}</option>
          ))}
        </select>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Targeting Options</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="target_age_min" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Age
            </label>
            <input
              type="number"
              id="target_age_min"
              value={formData.target_age_min}
              onChange={(e) => handleChange('target_age_min', parseInt(e.target.value) || 18)}
              min="13"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="target_age_max" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Age
            </label>
            <input
              type="number"
              id="target_age_max"
              value={formData.target_age_max}
              onChange={(e) => handleChange('target_age_max', parseInt(e.target.value) || 65)}
              min="13"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="target_locations" className="block text-sm font-medium text-gray-700 mb-1">
            Target Locations (comma-separated)
          </label>
          <input
            type="text"
            id="target_locations"
            value={formData.target_locations.join(', ')}
            onChange={(e) => handleChange('target_locations', e.target.value.split(',').map(loc => loc.trim()))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Global, Nigeria, Ghana, UK"
          />
        </div>

        <div>
          <label htmlFor="target_keywords" className="block text-sm font-medium text-gray-700 mb-1">
            Target Keywords/Interests (comma-separated)
          </label>
          <input
            type="text"
            id="target_keywords"
            value={formData.target_keywords.join(', ')}
            onChange={(e) => handleChange('target_keywords', e.target.value.split(',').map(kw => kw.trim()))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Technology, Fintech, Gaming"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
      >
        {isLoading ? 'Submitting...' : 'Submit for Review'}
      </button>
    </form>
  );
};

export default AdSubmissionForm;
