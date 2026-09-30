import React, { useState } from 'react';
interface ContentSchedulerProps {
  creatorId: string;
  onSchedule?: (postData: any) => void;
}

const ContentScheduler: React.FC<ContentSchedulerProps> = ({ creatorId, onSchedule }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [platforms, setPlatforms] = useState<string[]>(['main']);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const platforms_list = [
    { id: 'main', name: 'Main Feed', icon: '📱' },
    { id: 'stories', name: 'Stories', icon: '📸' },
    { id: 'reels', name: 'Reels', icon: '🎬' },
    { id: 'blog', name: 'Blog', icon: '📝' }
  ];

  const categories = [
    'Technology', 'Lifestyle', 'Education', 'Entertainment',
    'Business', 'Health', 'Travel', 'Food', 'Fashion', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      setError('Please select a date and time');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);

      const postData = {
        title,
        content,
        scheduledFor: scheduledDateTime.toISOString(),
        platforms,
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        status: 'scheduled'
      };

      // Mock API call - replace with actual service
      console.info('Scheduling post:', postData);

      if (onSchedule) {
        onSchedule(postData);
      }

      setSuccess(`Post scheduled for ${scheduledDateTime.toLocaleString()}`);

      // Reset form
      setTitle('');
      setContent('');
      setScheduledDate('');
      setScheduledTime('');
      setCategory('');
      setTags('');

    } catch (err: any) {
      setError(err.message || 'Failed to schedule post');
    } finally {
      setSubmitting(false);
    }
  };

  const togglePlatform = (platformId: string) => {
    setPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const getMinDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Schedule Content</h2>
        <p className="text-sm text-indigo-100 mt-1">Plan and automate your content publishing</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter post title"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Write your content here..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">{content.length} characters</p>
        </div>

        {/* Schedule Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time *
            </label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Platforms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Publish To
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {platforms_list.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => togglePlatform(platform.id)}
                className={`p-3 border-2 rounded-lg transition-all ${
                  platforms.includes(platform.id)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{platform.icon}</div>
                <div className="text-sm font-medium">{platform.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="tech, tutorial, beginner"
          />
        </div>

        {/* Preview Box */}
        {scheduledDate && scheduledTime && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📅 Scheduled For</h4>
            <p className="text-blue-800">
              {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Scheduling...
              </span>
            ) : (
              'Schedule Post'
            )}
          </button>

          <button
            type="button"
            onClick={() => {/* save as draft */}}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Save Draft
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentScheduler;
