import React, { useState } from 'react';
interface ComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (content: string, options: unknown) => void;
}

const ComposerModal: React.FC<ComposerModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [content, setContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [privacy, setPrivacy] = useState<'public' | 'followers' | 'private'>('public');
  const [allowComments, setAllowComments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      if (onSubmit) {
        await onSubmit(content, {
          media: selectedMedia,
          privacy,
          allowComments
        });
      }
      // Reset and close
      setContent('');
      setSelectedMedia([]);
      onClose();
    } catch (err) {
      console.error('Failed to submit post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedMedia(Array.from(e.target.files));
    }
  };

  const removeMedia = (index: number) => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const charCount = content.length;
  const maxChars = 280;
  const remaining = maxChars - charCount;

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
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Text Input */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              rows={6}
              maxLength={maxChars}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />

            {/* Character Counter */}
            <div className="flex items-center justify-between text-sm">
              <span className={`${remaining < 20 ? 'text-red-600' : 'text-gray-500'}`}>
                {remaining} characters remaining
              </span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    remaining < 20 ? 'bg-red-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${(charCount / maxChars) * 100}%` }}
                />
              </div>
            </div>

            {/* Media Preview */}
            {selectedMedia.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {selectedMedia.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeMedia(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Privacy Settings */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Privacy</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPrivacy('public')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                    privacy === 'public'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  🌍 Public
                </button>
                <button
                  onClick={() => setPrivacy('followers')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                    privacy === 'followers'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  👥 Followers
                </button>
                <button
                  onClick={() => setPrivacy('private')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                    privacy === 'private'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  🔒 Private
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allowComments"
                checked={allowComments}
                onChange={(e) => setAllowComments(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="allowComments" className="text-sm text-gray-700">
                Allow comments
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            {/* Media Upload Button */}
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
              <span className="text-xl">📷</span>
              <span className="text-sm font-medium">Add Media</span>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaSelect}
                className="hidden"
              />
            </label>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Posting...
                </span>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposerModal;
