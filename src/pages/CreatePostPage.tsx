import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useAI } from '../contexts/AIContext';
import { useWeb3 } from '../contexts/Web3Context';
import apiService from '../services/apiService';
import H2Composer from '../components/H2Composer';
import { TagProductSearchBar } from '../components/dashboard/stores/TagProductSearchBar';
import { CrossStoreProduct } from '../types/roles-permissions';
import MediaEditorModal, { EditedMediaResult } from '../components/MediaEditorModal';
import {
  SparklesIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  TrashIcon,
  PencilIcon,
  ArrowUpTrayIcon
} from '../icons';
import {
  XMarkIcon,
  PlusIcon,
  AdjustmentsHorizontalIcon,
  ScissorsIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export interface AttachedMediaItem {
  id: string;
  file?: File;
  url: string;
  type: 'image' | 'video';
  name: string;
  size: number;
  editedResult?: EditedMediaResult;
}

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, ficBalance } = useAppContext();
  const { generatePostContent, isLoading: aiLoading, error } = useAI();
  // eslint-disable-next-line no-unused-vars
  const { balance } = useWeb3();

  // Core post state
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [postType, setPostType] = useState<'text' | 'image' | 'video'>('text');
  const [tags, setTags] = useState<string>('');
  const [taggedProducts, setTaggedProducts] = useState<CrossStoreProduct[]>([]);

  // Multi-attachment state (CapCut & Banuba Editor integration)
  const [attachments, setAttachments] = useState<AttachedMediaItem[]>([]);
  const [editingMediaIndex, setEditingMediaIndex] = useState<number | null>(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Community consensus poll state
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['Yes / Agree', 'No / Disagree']);

  // UI state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [showH2Composer, setShowH2Composer] = useState<boolean>(false);

  // AI Generator
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const generatedContent = await generatePostContent(prompt);
      setContent(generatedContent);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to generate content:', err);
      showToast('Failed to generate content', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseH2Composer = () => {
    setShowH2Composer(true);
  };

  // Multi-attachment file selector
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: AttachedMediaItem[] = Array.from(files).map((file) => {
      const isVideo = file.type.startsWith('video');
      const url = URL.createObjectURL(file);
      return {
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        file,
        url,
        type: isVideo ? 'video' : 'image',
        name: file.name,
        size: file.size
      };
    });

    setAttachments((prev) => [...prev, ...newItems]);

    // Auto-update post type
    if (newItems.some((i) => i.type === 'video')) {
      setPostType('video');
    } else if (newItems.length > 0 && postType === 'text') {
      setPostType('image');
    }

    showToast(`Added ${newItems.length} file${newItems.length > 1 ? 's' : ''}`, 'info');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOpenEditor = (index: number) => {
    setEditingMediaIndex(index);
    setIsEditorModalOpen(true);
  };

  const handleSaveEditedMedia = (result: EditedMediaResult) => {
    if (editingMediaIndex !== null && attachments[editingMediaIndex]) {
      setAttachments((prev) => {
        const copy = [...prev];
        copy[editingMediaIndex] = {
          ...copy[editingMediaIndex],
          url: result.url,
          editedResult: result
        };
        return copy;
      });
      showToast('Media filter and adjustments applied successfully! ✓', 'success');
    }
    setIsEditorModalOpen(false);
    setEditingMediaIndex(null);
  };

  // Poll handlers
  const handleAddPollOption = () => {
    if (pollOptions.length >= 6) {
      showToast('Maximum of 6 poll options allowed', 'warning');
      return;
    }
    setPollOptions((prev) => [...prev, `Option ${prev.length + 1}`]);
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length <= 2) {
      showToast('Polls require at least 2 options', 'warning');
      return;
    }
    setPollOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePollOptionChange = (idx: number, text: string) => {
    setPollOptions((prev) => prev.map((opt, i) => (i === idx ? text : opt)));
  };

  // Form submit
  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      showToast('Please fill in both title and content', 'error');
      return;
    }

    setIsPosting(true);
    try {
      const formattedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      const mediaUrls = attachments.map((a) => a.url);

      const formattedAttachments = attachments.map((a) => ({
        type: a.type === 'video' ? 'uhd_media' : 'uhd_media',
        data: {
          url: a.url,
          filename: a.name,
          size: a.size,
          mediaType: a.type,
          filter: a.editedResult?.filter || 'normal',
          crop: a.editedResult?.crop || 'free',
          rotation: a.editedResult?.rotation || 0,
          playbackRate: a.editedResult?.playbackRate || 1.0,
          trim: a.editedResult?.trim
        }
      }));

      const pollPayload =
        showPoll && pollQuestion.trim()
          ? {
              question: pollQuestion.trim(),
              options: pollOptions.filter((o) => o.trim().length > 0)
            }
          : undefined;

      await apiService.post('/api/posts', {
        title,
        content,
        post_type: postType,
        tags: formattedTags,
        media_urls: mediaUrls,
        attachments: formattedAttachments,
        tagged_products: taggedProducts,
        poll: pollPayload
      });

      showToast('Post published successfully!', 'success');
      setTitle('');
      setContent('');
      setTags('');
      setPrompt('');
      setAttachments([]);
      setTaggedProducts([]);
      setShowPoll(false);
      navigate('/forum');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to publish post:', err);
      showToast('Failed to publish post to server', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  const activeEditingMedia =
    editingMediaIndex !== null ? attachments[editingMediaIndex] : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-inner">
                <SparklesIcon className="h-8 w-8 text-amber-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Create Sovereign Post &amp; Postcard</h1>
                <p className="mt-1 text-blue-100 text-sm">
                  Publish rich multi-media stories, Banuba shader presets, CapCut timeline clips, &amp; polls
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
              <CheckCircleIcon className="w-4 h-4 text-emerald-300" />
              <span>Multi-Attachment SDK Active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Composer Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
              {/* Post Type Selector */}
              <div className="flex space-x-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPostType('text')}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                    postType === 'text'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <DocumentTextIcon className="h-4 w-4" />
                  Text Story
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('image')}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                    postType === 'image'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <PhotoIcon className="h-4 w-4" />
                  Photo Gallery
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('video')}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                    postType === 'video'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <VideoCameraIcon className="h-4 w-4" />
                  Video Reel
                </button>
              </div>

              {/* Title Input */}
              <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your story an engaging headline..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-semibold transition"
                />
              </div>

              {/* Content Textarea */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Story Content
                  </label>
                  <span className="text-[11px] text-slate-400">{content.length} characters</span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share what is on your mind or generate ideas using the AI assistant below..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 text-sm leading-relaxed transition"
                />
              </div>

              {/* Multi-Attachment File Dropzone & Manager */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Media Attachments ({attachments.length})
                  </label>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    Banuba Shaders &amp; CapCut Speed/Trim
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFilesSelected}
                  className="hidden"
                  id="postcard-multi-file-input"
                />

                {/* Dropzone Container */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/60 dark:bg-slate-800/40 hover:bg-indigo-50/40 dark:hover:bg-slate-800/70 transition group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition shadow-xs">
                    <PhotoIcon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Click to browse or drop photos &amp; videos
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Select multiple files at once. Supports PNG, JPG, MP4, MOV, WebM with OpenCut client-side hardware rendering.
                  </p>
                </div>

                {/* Attached Media Cards Strip */}
                {attachments.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {attachments.map((item, index) => (
                      <div
                        key={item.id}
                        className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 group shadow-sm flex flex-col justify-between"
                      >
                        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                          {item.type === 'video' ? (
                            <video
                              src={item.url}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                            />
                          ) : (
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          )}

                          {/* Media Type Badge */}
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                            {item.type === 'video' ? '🎬 VIDEO' : '📷 PHOTO'}
                          </span>

                          {/* Preset Badge if Edited */}
                          {item.editedResult?.filter && (
                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-600/90 text-white backdrop-blur-xs flex items-center gap-1">
                              <SparklesIcon className="w-3 h-3 text-amber-300" />
                              {item.editedResult.filter}
                            </span>
                          )}

                          {/* Delete Item Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveAttachment(item.id);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/60 hover:bg-rose-600 text-white transition backdrop-blur-xs"
                            title="Remove attachment"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Card Footer with Edit / Preset Trigger */}
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-850 flex items-center justify-between gap-1 border-t border-slate-100 dark:border-slate-750">
                          <div className="truncate flex-1">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={item.name}>
                              {item.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {(item.size / (1024 * 1024)).toFixed(1)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenEditor(index)}
                            className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition shrink-0"
                            title="Apply Banuba Filters & OpenCut Cropping"
                          >
                            <ScissorsIcon className="w-3 h-3" />
                            <span>Filters &amp; Crop</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Generation Prompt Drawer */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-purple-50/50 dark:from-slate-800/60 dark:to-slate-850/60 border border-indigo-100 dark:border-slate-700 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <SparklesIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wider">
                    AI Content Copilot (5 FIC)
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. 'Excited to announce our new Web3 creator drop today!'"
                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
                    disabled={isGenerating}
                  />
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    {isGenerating ? (
                      <>
                        <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-3.5 h-3.5" />
                        Generate
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleUseH2Composer}
                    disabled={aiLoading}
                    className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1 shrink-0"
                  >
                    <PencilIcon className="w-3.5 h-3.5" />
                    H2 Studio
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-rose-600 text-xs mb-4 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-800">
                  {error}
                </div>
              )}

              {/* Interactive Consensus Poll Accordion */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📊</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Interactive Community Poll
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPoll(!showPoll)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                      showPoll
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {showPoll ? 'Enabled ✓' : '+ Add Poll'}
                  </button>
                </div>

                {showPoll && (
                  <div className="space-y-3 mt-3 pt-3 border-t border-slate-200 dark:border-slate-750">
                    <input
                      type="text"
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      placeholder="Ask a question for your audience..."
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500"
                    />

                    <div className="space-y-2">
                      {pollOptions.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                            placeholder={`Option ${idx + 1}`}
                            className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                          />
                          {pollOptions.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemovePollOption(idx)}
                              className="p-1 text-slate-400 hover:text-rose-500"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {pollOptions.length < 6 && (
                      <button
                        type="button"
                        onClick={handleAddPollOption}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <PlusIcon className="w-3.5 h-3.5" />
                        Add another option
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Publish Action Button */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePost}
                  disabled={isPosting}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isPosting ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Publishing to Sovereign Ledger...
                    </>
                  ) : (
                    <>
                      <ArrowUpTrayIcon className="h-4 w-4 stroke-2" />
                      Publish Post &amp; Broadcast
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Column: Commerce Tagging & Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sticky top-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-indigo-500" />
                Commerce &amp; Tags
              </h3>

              {/* Multi-Store Product Tagging */}
              <div className="mb-6">
                <TagProductSearchBar
                  selectedProducts={taggedProducts}
                  onSelectProduct={(product) => {
                    if (!taggedProducts.some((p) => p.id === product.id)) {
                      setTaggedProducts([...taggedProducts, product]);
                      showToast(`Tagged ${product.title} from ${product.store}`, 'success');
                    }
                  }}
                  onRemoveProduct={(productId) => {
                    setTaggedProducts(taggedProducts.filter((p) => p.id !== productId));
                  }}
                />
              </div>

              {/* Hashtags Input */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Tags &amp; Categories
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="#lifestyle, #travel, #ownit"
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 text-xs"
                />
                <p className="mt-1.5 text-[11px] text-slate-400">Separate multiple tags with commas</p>
              </div>

              {/* FIC Balance Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <CurrencyDollarIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">FIC Sovereign Balance</p>
                    <p className="text-lg font-mono font-bold text-blue-900 dark:text-white">
                      {ficBalance.toFixed(2)} FIC
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-blue-600 dark:text-blue-400">
                  AI content generation consumes 5 FIC per prompt.
                </p>
              </div>

              {/* Guidelines list */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-2">
                  Postcard Best Practices
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    Attach UHD photos &amp; apply Banuba filters
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    Use CapCut speed adjustment on videos
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    Embed cross-store products for commission
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banuba & OpenCut Media Editor Modal */}
      {isEditorModalOpen && activeEditingMedia && (
        <MediaEditorModal
          isOpen={isEditorModalOpen}
          onClose={() => {
            setIsEditorModalOpen(false);
            setEditingMediaIndex(null);
          }}
          mediaUrl={activeEditingMedia.url}
          mediaType={activeEditingMedia.type}
          mediaName={activeEditingMedia.name}
          onSave={handleSaveEditedMedia}
        />
      )}

      {showH2Composer && <H2Composer />}
    </div>
  );
};

export default CreatePostPage;
