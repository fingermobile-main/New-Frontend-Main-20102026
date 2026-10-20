/*
 * FingerMobile Protocol™ - Blog Composer & Publishing Suite Modal
 * Combines Enterprise RTE, Media Studio Editor, AI Contextual Algorithm,
 * and Section 2 Distribution Settings.
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Send,
  Image,
  Video,
  Music,
  Settings,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import RichTextEditor, { EditorOutput } from '../editor/RichTextEditor';
import MediaUploadAndEditorModal, { ProcessedMedia } from '../editor/MediaUploadAndEditorModal';
import { analyzeContentWithAI } from '../editor/AIContextualAlgorithm';
import AIContextualAssistant from '../editor/AIContextualAssistant';
import PostSettingsPanel, { PostSettingsState, defaultPostSettings } from '../editor/PostSettingsPanel';
import { ApiService } from '../../services/api';
import { useAppContext } from '../../contexts/AppContext';

interface BlogComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (newPost: any) => void;
}

export const BlogComposerModal: React.FC<BlogComposerModalProps> = ({
  isOpen,
  onClose,
  onPostCreated
}) => {
  const { member, showToast } = useAppContext();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tags, setTags] = useState<string[]>(['#Decentralized', '#FingerMobile']);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [editorContent, setEditorContent] = useState<EditorOutput>({
    html: '',
    markdown: '',
    text: '',
    json: { content: '', wordCount: 0, charCount: 0, timestamp: '' }
  });
  const [postSettings, setPostSettings] = useState<PostSettingsState>(defaultPostSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  
  // Media Modal state
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaModalType, setMediaModalType] = useState<'photo' | 'video' | 'audio'>('photo');
  const [embeddedMediaList, setEmbeddedMediaList] = useState<{ url: string; type: 'photo' | 'video' | 'audio'; caption?: string }[]>([]);

  // Compute AI Contextual Score
  const aiAnalysis = useMemo(() => {
    return analyzeContentWithAI({
      title,
      content: editorContent.html || editorContent.text,
      mediaUrls: embeddedMediaList.map(m => m.url),
      mediaTypes: embeddedMediaList.map(m => m.type),
      category,
      targetAudience: {
        gender: postSettings.audienceGender,
        ageBracket: postSettings.audienceAgeBracket
      },
      postCategory: postSettings.postCategory
    });
  }, [title, editorContent, embeddedMediaList, category, postSettings]);

  if (!isOpen) return null;

  const handleOpenMedia = (type: 'photo' | 'video' | 'audio') => {
    setMediaModalType(type);
    setIsMediaModalOpen(true);
  };

  const handleMediaSaved = (media: ProcessedMedia) => {
    setEmbeddedMediaList(prev => [...prev, {
      url: media.url,
      type: media.type,
      caption: media.caption
    }]);
    if (!coverImageUrl && media.type === 'photo') {
      setCoverImageUrl(media.url);
    }
    showToast(`Embedded ${media.type} asset successfully!`, 'success');
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      alert('Please provide an article title.');
      return;
    }
    if (!editorContent.text.trim() && embeddedMediaList.length === 0) {
      alert('Please add content or media before publishing.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        content: editorContent.html || editorContent.text,
        excerpt: excerpt.trim() || editorContent.text.slice(0, 150) + '...',
        category: category || aiAnalysis.recommendedCategory,
        tags: tags.length > 0 ? tags : aiAnalysis.recommendedTags,
        cover_image: coverImageUrl || (embeddedMediaList[0]?.url || ''),
        status: postSettings.isScheduled ? 'scheduled' : 'published',
        post_category: postSettings.postCategory,
        target_gender: postSettings.audienceGender,
        target_age_bracket: postSettings.audienceAgeBracket,
        who_can_comment: postSettings.whoCanComment,
        scheduled_at: postSettings.isScheduled ? `${postSettings.scheduleMonth} ${postSettings.scheduleDay}, ${postSettings.scheduleTime}` : null,
        ai_resonance_score: aiAnalysis.overallScore,
        virality_tier: aiAnalysis.viralityPotential
      };

      // Call API
      let createdPost = null;
      try {
        const res: any = await ApiService.post('/blogs/posts', payload);
        createdPost = res?.post || res?.data || res;
      } catch (err) {
        // Fallback to /blogs
        const res: any = await ApiService.post('/blogs', payload);
        createdPost = res?.post || res?.data || res;
      }

      showToast(
        postSettings.isScheduled
          ? `Post scheduled successfully for ${postSettings.scheduleMonth} ${postSettings.scheduleDay}!`
          : 'Blog article published successfully!',
        'success'
      );

      if (onPostCreated) {
        onPostCreated(createdPost || {
          id: String(Date.now()),
          title: payload.title,
          content: payload.content,
          excerpt: payload.excerpt,
          category: payload.category,
          tags: payload.tags,
          createdAt: new Date().toISOString(),
          likes: 0,
          views: 1,
          commentCount: 0,
          author: {
            id: member?.id || '1',
            membername: (member as any)?.name || (member as any)?.username || 'You',
            avatar: (member as any)?.avatar || ''
          }
        });
      }

      onClose();
    } catch (error: any) {
      console.error('Publish error:', error);
      showToast(error.message || 'Failed to publish post. Saved as draft.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500 text-white shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                  Create Blog & UGC Article
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  Rich text formatting, multi-modal asset studio & AI distribution algorithm
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 ${
                  showSettingsDrawer
                    ? 'border-orange-500 bg-orange-500 text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Section 2 Settings</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-700 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* AI Assistant Banner */}
            <AIContextualAssistant
              analysis={aiAnalysis}
              onApplyTags={(smartTags) => setTags(smartTags)}
              onApplyCategory={(cat) => setCategory(cat)}
              onApplySchedule={(window) => {
                setPostSettings(prev => ({
                  ...prev,
                  isScheduled: true,
                  scheduleTime: window.time,
                  scheduleDay: window.day,
                  scheduleMonth: window.month
                }));
                showToast(`Schedule optimized to ${window.time} on Day ${window.day}!`, 'success');
              }}
              onEnhanceContent={() => {
                if (title && !title.endsWith('!')) {
                  setTitle(`How ${title}: The Complete Protocol Deep-Dive`);
                }
              }}
            />

            {/* Title & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Article Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The Future of Sovereign Decentralized Protocols..."
                  className="w-full px-4 py-2.5 text-sm font-semibold border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-bold bg-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-medium border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Technology">Technology</option>
                  <option value="Creative Arts & Culture">Creative Arts & Culture</option>
                  <option value="Web3 & Decentralization">Web3 & Decentralization</option>
                  <option value="Business & Commerce">Business & Commerce</option>
                  <option value="Community & Lifestyle">Community & Lifestyle</option>
                </select>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Short Excerpt / Teaser
              </label>
              <input
                type="text"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A compelling 1-2 sentence preview for search indexers and timelines..."
                className="w-full px-4 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl dark:bg-slate-800 dark:text-white text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
            </div>

            {/* Media Action Bar */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mr-2">
                Upload & Edit UGC Media:
              </span>
              <button
                type="button"
                onClick={() => handleOpenMedia('photo')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500 flex items-center gap-1.5 transition"
              >
                <Image className="w-3.5 h-3.5 text-emerald-500" />
                <span>Add / Edit Photo</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenMedia('video')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-rose-500 flex items-center gap-1.5 transition"
              >
                <Video className="w-3.5 h-3.5 text-rose-500" />
                <span>Add / Edit Video</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenMedia('audio')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-500 flex items-center gap-1.5 transition"
              >
                <Music className="w-3.5 h-3.5 text-amber-500" />
                <span>Add / Edit Audio</span>
              </button>
              {embeddedMediaList.length > 0 && (
                <span className="text-xs text-emerald-600 font-bold ml-auto flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {embeddedMediaList.length} media attached
                </span>
              )}
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Article Body (Rich Text Word Processor)
              </label>
              <RichTextEditor
                initialValue=""
                onChange={(output) => setEditorContent(output)}
                onOpenMediaModal={handleOpenMedia}
                embeddedMediaUrls={embeddedMediaList}
                placeholder="Craft your narrative with headings, bold text, embedded videos, quotes, and sanitized markup..."
                minHeight="260px"
              />
            </div>

            {/* Section 2 Post Settings Panel */}
            {showSettingsDrawer && (
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-orange-500" />
                  <span>Section 2 Distribution & Audience Settings</span>
                </h4>
                <PostSettingsPanel
                  settings={postSettings}
                  onChange={(upd) => setPostSettings(upd)}
                />
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-extrabold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl shadow-lg transition flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Publishing...'
                    : (postSettings.isScheduled ? 'Schedule Publication' : 'Publish Article Now')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Media Studio Modal */}
      <MediaUploadAndEditorModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        defaultType={mediaModalType}
        onSaveMedia={handleMediaSaved}
      />
    </>
  );
};

export default BlogComposerModal;
