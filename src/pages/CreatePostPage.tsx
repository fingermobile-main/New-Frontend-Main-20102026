import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useAI } from '../contexts/AIContext';
import { useWeb3 } from '../contexts/Web3Context';
import apiService from '../services/apiService';
import H2Composer from '../components/H2Composer';
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

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, ficBalance } = useAppContext();
  const { generatePostContent, isLoading: aiLoading, error } = useAI();
  // eslint-disable-next-line no-unused-vars
  const { balance } = useWeb3();
  const [prompt, setPrompt] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [showH2Composer, setShowH2Composer] = useState<boolean>(false);
  const [postType, setPostType] = useState<'text' | 'image' | 'video'>('text');
  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<string>('');

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

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      showToast('Please fill in both title and content', 'error');
      return;
    }

    setIsPosting(true);
    try {
      const formattedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
      await apiService.post('/api/posts', {
        title,
        content,
        post_type: postType,
        tags: formattedTags
      });

      showToast('Post published successfully!', 'success');
      setTitle('');
      setContent('');
      setTags('');
      setPrompt('');
      navigate('/forum');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to publish post:', err);
      showToast('Failed to publish post to server', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-8">
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-lg">
              <SparklesIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold">Create Post</h1>
              <p className="mt-1 text-blue-100">
                Share your thoughts with the community
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setPostType('text')}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center ${
                    postType === 'text'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Text
                </button>
                <button
                  onClick={() => setPostType('image')}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center ${
                    postType === 'image'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <PhotoIcon className="h-5 w-5 mr-2" />
                  Image
                </button>
                <button
                  onClick={() => setPostType('video')}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center ${
                    postType === 'video'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <VideoCameraIcon className="h-5 w-5 mr-2" />
                  Video
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your post a title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What do you want to post about?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'My recent trip to Paris' or 'Trying a new recipe'"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                  disabled={isGenerating}
                />
              </div>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Content'}
                </button>

                <button
                  onClick={handleUseH2Composer}
                  disabled={aiLoading}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  AI Editing Tools
                </button>
              </div>

              {error && (
                <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {content && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Generated Content</h3>
                    <button
                      onClick={() => setContent('')}
                      className="text-gray-500 hover:text-red-500 flex items-center"
                    >
                      <TrashIcon className="h-5 w-5 mr-1" />
                      Clear
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 mb-6 min-h-[120px] bg-gray-50">
                    {content}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handlePost}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 flex items-center"
                    >
                      <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                      Publish Post
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
                    >
                      <PencilIcon className="h-5 w-5 mr-2" />
                      Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Post Details</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="#travel #adventure #life"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-700">FIC Balance</p>
                    <p className="text-lg font-bold text-blue-900">{ficBalance.toFixed(2)} FIC</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-blue-600">
                  AI content generation costs 5 FIC
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Tips for Great Content</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Write engaging titles
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Use relevant hashtags
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Include high-quality media
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Post consistently
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showH2Composer && <H2Composer />}
    </div>
  );
};

export default CreatePostPage;
