import React, { useState } from 'react';
import { api } from '../../services/api';

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
        post_type: 'scheduled',
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        media_urls: [],
        attachments: [],
        composer_metadata: {
          scheduledFor: scheduledDateTime.toISOString(),
          platforms,
          category
        }
      };

      const response = await api.post('/posts', postData);

      if (onSchedule) {
        onSchedule(response.data?.data || postData);
      }

      setSuccess(`Post scheduled for ${scheduledDateTime.toLocaleString()} and persisted to database.`);

      // Reset form
      setTitle('');
      setContent('');
      setScheduledDate('');
      setScheduledTime('');
      setCategory('');
      setTags('');

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to schedule post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim() && !content.trim()) {
      setError('Please enter a title or content before saving as draft');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const draftPayload = {
        title,
        content,
        post_type: 'draft',
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        composer_metadata: {
          category,
          platforms
        }
      };

      await api.post('/posts/draft', draftPayload);
      setSuccess('Draft successfully synchronized to PostgreSQL storage.');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save draft');
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

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 px-6 py-4 border-b border-indigo-800">
        <h2 className="text-xl font-black text-white">Schedule Content</h2>
        <p className="text-sm font-medium text-indigo-100 mt-1">Plan and automate your content publishing directly to the platform</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Success Message */}
        {success && (
          <div className="bg-emerald-100 border border-emerald-400 text-emerald-950 rounded-xl p-4 font-bold shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-emerald-800 text-lg">✓</span>
              <p>{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-rose-100 border border-rose-400 text-rose-950 rounded-xl p-4 font-bold shadow-xs">
            <p>{error}</p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            Post Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg text-slate-900 font-bold border border-slate-300 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
            placeholder="Enter post title"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            Post Content *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full px-4 py-2.5 rounded-lg text-slate-900 font-bold border border-slate-300 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
            placeholder="Write your content here..."
            required
          />
          <p className="text-xs font-semibold text-slate-700 mt-1.5">{content.length} characters</p>
        </div>
        {/* Schedule Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Publication Date *
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 rounded-lg text-slate-900 font-bold border border-slate-300 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Publication Time *
            </label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg text-slate-900 font-bold border border-slate-300 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
              required
            />
          </div>
        </div>

        {/* Platforms */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            Target Channels
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {platforms_list.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => togglePlatform(platform.id)}
                className={`p-3 border-2 rounded-xl transition-all cursor-pointer ${
                  platforms.includes(platform.id)
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold shadow-xs'
                    : 'border-slate-300 hover:border-slate-400 text-slate-800 font-semibold bg-white'
                }`}
              >
                <div className="text-2xl mb-1">{platform.icon}</div>
                <div className="text-sm">{platform.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            Content Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg text-slate-900 font-bold border border-slate-300 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
            placeholder="tech, tutorial, protocol, business"
          />
        </div>

        {/* Preview Box */}
        {scheduledDate && scheduledTime && (
          <div className="bg-blue-50 border border-blue-300 rounded-xl p-4 shadow-xs">
            <h4 className="font-black text-blue-950 mb-1">📅 Scheduled For:</h4>
            <p className="text-sm font-bold text-blue-900">
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

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-300">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-5 py-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl transition-all font-black text-sm shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Scheduling Post...</span>
              </>
            ) : (
              'Schedule Post'
            )}
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={handleSaveDraft}
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl transition-all font-bold text-sm shadow-xs cursor-pointer disabled:opacity-50"
          >
            Save Draft
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentScheduler;
