import React, { useState } from 'react';
import { useAppContext } from "../contexts/AppContext";
import { logError } from '../utils/errorLogger';
import { useAI } from '../contexts/AIContext';
import { useWeb3 } from '../contexts/Web3Context';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
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
  const { showToast, ficBalance } = useAppContext();
  const { generatePostContent, isLoading: aiLoading, error } = useAI();
  const { balance } = useWeb3();
  const [prompt, setPrompt] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showH2Composer, setShowH2Composer] = useState<boolean>(false);
  const [postType, setPostType] = useState<"text" | "image" | "video">("text");
  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<string>("");

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      showToast("Please enter a prompt", "error");
      return;
    }

    setIsGenerating(true);
    try {
      const generatedContent = await generatePostContent(prompt);
      if (generatedContent) {
        setContent(generatedContent);
        showToast("Content generated successfully!", "success");
      }
    } catch (err) {
      logError(err as Error);
      showToast("Error generating content", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      showToast("Please fill in all required fields", "error");
      return;
    }
    
    // TODO: Implement actual post creation logic
    showToast("Post published successfully!", "success");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <PageHeader title="Create New Post" />
      
      <div className="max-w-4xl mx-auto p-4">
        {/* Post Type Selector */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Post Type</h2>
          <div className="flex space-x-4">
            {(['text', 'image', 'video'] as const).map(type => (
              <button
                key={type}
                className={`px-4 py-2 rounded-lg capitalize ${
                  postType === type 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setPostType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* AI Content Generation */}
        <div className="bg-gray-800 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <SparklesIcon className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold">AI Content Generator</h2>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Describe what you want to write about</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Write a post about the benefits of renewable energy..."
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
            />
          </div>
          
          <button
            onClick={handleGenerateContent}
            disabled={aiLoading || isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            <SparklesIcon className="h-5 w-5" />
            {aiLoading || isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
          
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>

        {/* Post Title */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Post Content */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm text-gray-400">Content *</label>
            <button 
              onClick={() => setShowH2Composer(!showH2Composer)}
              className="text-sm text-orange-500 hover:underline"
            >
              {showH2Composer ? 'Hide Editor' : 'Show Advanced Editor'}
            </button>
          </div>
          
          {showH2Composer ? (
            <H2Composer initialValue={content} onChange={setContent} />
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[200px]"
            />
          )}
        </div>

        {/* Tags */}
        <div className="mb-8">
          <label className="block text-sm text-gray-400 mb-2">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags separated by commas"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-800">
          <button
            onClick={handleSubmit}
            className="flex-1 min-w-[150px] px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Publish Post
          </button>
          <button className="flex-1 min-w-[150px] px-4 py-3 bg-gray-800 text-white rounded-lg font-medium border border-gray-700 hover:bg-gray-700 transition-colors">
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;