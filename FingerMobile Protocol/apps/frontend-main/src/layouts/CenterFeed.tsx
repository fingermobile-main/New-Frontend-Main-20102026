import React, { useState, useEffect, useRef } from 'react';
import CategorySelector from '../components/CategorySelector';
import { FORUM_CATEGORIES } from '../data/categories';
import CensorshipSelector, { CensorshipOptions } from '../components/CensorshipSelector';
import CensoredPostWrapper from '../components/CensoredPostWrapper';
import { useAppContext } from '../contexts/AppContext';
import api from '../services/api';
import uploadService from '../services/UploadService';

export interface FeedPost {
  id: string | number;
  author: string;
  handle: string;
  time: string;
  content: string;
  category?: string;
  likes: number;
  comments: number;
  reposts: number;
  media_urls?: string[];
  censorship: CensorshipOptions;
  liked?: boolean;
}

interface CommentItem {
  id: string;
  author_name: string;
  author_avatar?: string;
  content: string;
  created_at: string;
}

const fallbackPosts: FeedPost[] = [
  {
    id: 'mock-1',
    author: 'Alice Cooper',
    handle: '@alice_web3',
    time: '2h ago',
    content: 'Just deployed my first smart contract on FingerMobile! The developer experience is incredibly smooth. Highly recommend checking out the new documentation.',
    category: 'General Discussion',
    likes: 124,
    comments: 18,
    reposts: 5,
    media_urls: [],
    censorship: {
      tags: [],
      visualEffect: 'NONE',
      interactionRule: 'NONE'
    }
  },
  {
    id: 'mock-2',
    author: 'Bob Smith',
    handle: '@bob_builder',
    time: '4h ago',
    content: 'Who is excited for the upcoming FingerMobile protocol upgrade? The new zero-knowledge proofs integration is going to be a game changer for privacy.',
    category: 'Technology',
    likes: 342,
    comments: 56,
    reposts: 21,
    media_urls: [],
    censorship: {
      tags: ['Spoiler'],
      visualEffect: 'BLUR',
      interactionRule: 'CLICK_TO_REVEAL'
    }
  },
  {
    id: 'mock-3',
    author: 'Charlie Day',
    handle: '@charlie_d',
    time: '5h ago',
    content: 'This post is restricted to members 18 and over. Contains graphic themes that some may find disturbing.',
    category: 'Connect',
    likes: 89,
    comments: 12,
    reposts: 2,
    media_urls: [],
    censorship: {
      tags: ['18+', 'NSFW', 'Violence'],
      visualEffect: 'INTERSTITIAL',
      interactionRule: '15_SEC_TIMER'
    }
  },
  {
    id: 'mock-4',
    author: 'Dana Scully',
    handle: '@dana_x',
    time: '6h ago',
    content: 'The truth is out there, but this message will self-destruct once you read it.',
    category: 'General Discussion',
    likes: 156,
    comments: 0,
    reposts: 0,
    media_urls: [],
    censorship: {
      tags: [],
      visualEffect: 'CENSOR_BAR',
      interactionRule: 'VIEW_ONCE'
    }
  }
];

export default function CenterFeed() {
  const { showToast } = useAppContext();

  // Categories & Censorship
  const defaultCategory = FORUM_CATEGORIES.find(c => c.name === 'General Discussion')?.id || FORUM_CATEGORIES[0].id;
  const [selectedCategoryId, setSelectedCategoryId] = useState(defaultCategory);
  const [censorshipOptions, setCensorshipOptions] = useState<CensorshipOptions>({
    tags: [],
    visualEffect: 'NONE',
    interactionRule: 'NONE'
  });

  // Posts State
  const [posts, setPosts] = useState<FeedPost[]>(fallbackPosts);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  // Composer State
  const [postContent, setPostContent] = useState('');
  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Hidden File Inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Comments Thread State
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | number | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, CommentItem[]>>({});
  const [loadingCommentsPostId, setLoadingCommentsPostId] = useState<string | number | null>(null);
  const [commentInputMap, setCommentInputMap] = useState<Record<string, string>>({});
  const [submittingCommentPostId, setSubmittingCommentPostId] = useState<string | number | null>(null);

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  // Fetch live posts directly from PostgreSQL
  const fetchPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const res = await api.get('/posts?limit=30');
      const rawPosts = res.data?.data?.posts || res.data?.posts || (Array.isArray(res.data) ? res.data : []);

      if (rawPosts && rawPosts.length > 0) {
        const mapped: FeedPost[] = rawPosts.map((p: any) => {
          const media = Array.isArray(p.media_urls)
            ? p.media_urls
            : (p.image_url ? [p.image_url] : []);
          const authorName = p.author_name || 'Protocol User';
          const authorHandle = `@${authorName.toLowerCase().replace(/\s+/g, '_')}`;

          return {
            id: p.id,
            author: authorName,
            handle: authorHandle,
            time: formatRelativeTime(p.created_at),
            content: p.content || p.body || '',
            category: p.category_name || 'General',
            likes: Number(p.likes_count || 0),
            comments: Number(p.comments_count || p.replies_count || 0),
            reposts: Number(p.shares_count || 0),
            media_urls: media,
            censorship: p.censorship || {
              tags: Array.isArray(p.tags) ? p.tags : [],
              visualEffect: 'NONE',
              interactionRule: 'NONE'
            },
            liked: Boolean(p.is_liked)
          };
        });
        setPosts(mapped);
      }
    } catch (err: any) {
      console.warn('Using fallback posts due to fetch error:', err?.message);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Upload handler for media
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'video' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      showToast(`Uploading ${fileType}...`, 'info');
      const res = await uploadService.uploadFile(file, fileType);
      const fileUrl = res.url || (res as any).data?.url || (res as any).fileUrl;

      if (fileUrl) {
        setUploadedMedia((prev) => [...prev, fileUrl]);
        showToast(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} attached`, 'success');
      } else {
        showToast('Media attached successfully', 'success');
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      showToast(`Upload failed: ${err?.message || 'Server error'}`, 'error');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  // Submit Post
  const handleCreatePost = async () => {
    const trimmed = postContent.trim();
    if (!trimmed && uploadedMedia.length === 0) {
      showToast('Please type a message or attach media before posting', 'error');
      return;
    }

    try {
      setIsPosting(true);
      const selectedCat = FORUM_CATEGORIES.find((c) => c.id === selectedCategoryId);
      const payload = {
        content: trimmed || 'Media Post',
        title: trimmed ? (trimmed.length > 50 ? trimmed.slice(0, 47) + '...' : trimmed) : 'Protocol Update',
        category_id: selectedCategoryId,
        category_name: selectedCat?.name || 'General Discussion',
        media_urls: uploadedMedia,
        tags: censorshipOptions.tags,
        post_type: 'post'
      };

      const res = await api.post('/posts', payload);
      const createdPost = res.data?.data || res.data;

      // Create new FeedPost object to prepend immediately
      const newFeedItem: FeedPost = {
        id: createdPost?.id || `temp-${Date.now()}`,
        author: createdPost?.author_name || 'You',
        handle: '@you',
        time: 'Just now',
        content: payload.content,
        category: payload.category_name,
        likes: 0,
        comments: 0,
        reposts: 0,
        media_urls: uploadedMedia,
        censorship: censorshipOptions,
        liked: false
      };

      setPosts((prev) => [newFeedItem, ...prev]);
      setPostContent('');
      setUploadedMedia([]);
      setCensorshipOptions({ tags: [], visualEffect: 'NONE', interactionRule: 'NONE' });
      showToast('Post published and persisted to PostgreSQL', 'success');
    } catch (err: any) {
      console.error('Failed to create post:', err);
      showToast(`Failed to publish post: ${err?.response?.data?.message || err.message}`, 'error');
    } finally {
      setIsPosting(false);
    }
  };

  // Handle Like
  const handleLike = async (post: FeedPost) => {
    const stringId = String(post.id);
    try {
      const res = await api.post(`/posts/${post.id}/like`);
      const isLiked = res.data?.data?.liked ?? !post.liked;
      const newLikesCount = res.data?.data?.likes ?? (isLiked ? post.likes + 1 : Math.max(0, post.likes - 1));

      setPosts((prev) =>
        prev.map((p) =>
          String(p.id) === stringId
            ? { ...p, liked: isLiked, likes: newLikesCount }
            : p
        )
      );
      showToast(isLiked ? 'Post liked' : 'Post unliked', 'info');
    } catch (err: any) {
      // Optimistic fallback toggle
      setPosts((prev) =>
        prev.map((p) =>
          String(p.id) === stringId
            ? { ...p, liked: !p.liked, likes: p.liked ? Math.max(0, p.likes - 1) : p.likes + 1 }
            : p
        )
      );
      showToast(post.liked ? 'Post unliked' : 'Post liked', 'info');
    }
  };

  // Handle Repost
  const handleRepost = (post: FeedPost) => {
    const stringId = String(post.id);
    setPosts((prev) =>
      prev.map((p) =>
        String(p.id) === stringId ? { ...p, reposts: p.reposts + 1 } : p
      )
    );
    showToast('Post reposted to your protocol wall', 'success');
  };

  // Handle Share
  const handleShare = async (post: FeedPost) => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(postUrl);
      showToast('Post link copied to clipboard', 'info');
    } else {
      showToast(`Share URL: ${postUrl}`, 'info');
    }
  };

  // Toggle & Load Comments
  const handleToggleComments = async (post: FeedPost) => {
    const stringId = String(post.id);
    if (expandedCommentsPostId === post.id) {
      setExpandedCommentsPostId(null);
      return;
    }

    setExpandedCommentsPostId(post.id);
    if (!commentsMap[stringId]) {
      try {
        setLoadingCommentsPostId(post.id);
        const res = await api.get(`/posts/${post.id}/comments`);
        const list = res.data?.data?.comments || res.data?.comments || [];
        setCommentsMap((prev) => ({ ...prev, [stringId]: list }));
      } catch (err) {
        console.warn('Could not fetch comments for post:', err);
        setCommentsMap((prev) => ({ ...prev, [stringId]: [] }));
      } finally {
        setLoadingCommentsPostId(null);
      }
    }
  };

  // Add Comment
  const handleAddComment = async (postId: string | number) => {
    const stringId = String(postId);
    const commentText = (commentInputMap[stringId] || '').trim();
    if (!commentText) return;

    try {
      setSubmittingCommentPostId(postId);
      const res = await api.post(`/posts/${postId}/comments`, { content: commentText });
      const created = res.data?.data || {
        id: `c-${Date.now()}`,
        author_name: 'You',
        content: commentText,
        created_at: new Date().toISOString()
      };

      setCommentsMap((prev) => ({
        ...prev,
        [stringId]: [created, ...(prev[stringId] || [])]
      }));

      // Increment comment count on post
      setPosts((prev) =>
        prev.map((p) => (String(p.id) === stringId ? { ...p, comments: p.comments + 1 } : p))
      );

      setCommentInputMap((prev) => ({ ...prev, [stringId]: '' }));
      showToast('Comment posted successfully', 'success');
    } catch (err: any) {
      console.error('Failed to post comment:', err);
      showToast(`Failed to post comment: ${err?.message || 'Server error'}`, 'error');
    } finally {
      setSubmittingCommentPostId(null);
    }
  };

  return (
    <div className="w-full pb-20">
      {/* Hidden file inputs for media uploads */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        onChange={(e) => handleFileUpload(e, 'image')}
        className="hidden"
        aria-hidden="true"
      />
      <input
        type="file"
        ref={videoInputRef}
        accept="video/*"
        onChange={(e) => handleFileUpload(e, 'video')}
        className="hidden"
        aria-hidden="true"
      />
      <input
        type="file"
        ref={docInputRef}
        onChange={(e) => handleFileUpload(e, 'file')}
        className="hidden"
        aria-hidden="true"
      />

      {/* Create Post Input */}
      <div className="p-4 border-b border-slate-300 bg-white">
        <div className="flex items-center flex-wrap gap-2">
          <CategorySelector
            selectedCategoryId={selectedCategoryId}
            onChange={setSelectedCategoryId}
          />
          <CensorshipSelector
            options={censorshipOptions}
            onChange={setCensorshipOptions}
          />
          <button
            onClick={fetchPosts}
            aria-label="Refresh feed"
            className="ml-auto text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-300 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            ↻ Refresh Feed
          </button>
        </div>

        <div className="flex space-x-4 mt-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-xs">
            FM
          </div>
          <div className="flex-1">
            <textarea
              className="w-full bg-white text-base resize-none outline-none placeholder:text-slate-400 p-2 text-slate-900 font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="What's happening in the sovereign protocol community?"
              rows={3}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              aria-label="Create a post"
            />

            {/* Media previews */}
            {uploadedMedia.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {uploadedMedia.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-slate-300 bg-slate-100 h-20 w-20 flex items-center justify-center"
                  >
                    <img
                      src={url}
                      alt="Uploaded media preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <button
                      onClick={() => setUploadedMedia((prev) => prev.filter((_, i) => i !== idx))}
                      aria-label="Remove media"
                      className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200">
          <div className="flex items-center space-x-1 text-indigo-600">
            <button
              onClick={() => imageInputRef.current?.click()}
              disabled={isUploading}
              aria-label="Attach image"
              title="Attach image"
              className="p-2 hover:bg-indigo-50 rounded-full transition-colors disabled:opacity-50 text-indigo-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => videoInputRef.current?.click()}
              disabled={isUploading}
              aria-label="Attach video"
              title="Attach video"
              className="p-2 hover:bg-indigo-50 rounded-full transition-colors disabled:opacity-50 text-indigo-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              onClick={() => docInputRef.current?.click()}
              disabled={isUploading}
              aria-label="Attach file"
              title="Attach file"
              className="p-2 hover:bg-indigo-50 rounded-full transition-colors disabled:opacity-50 text-indigo-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            {isUploading && (
              <span className="text-xs font-bold text-slate-700 ml-2 animate-pulse">
                Uploading media...
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">
              {postContent.length} chars
            </span>
            <button
              onClick={handleCreatePost}
              disabled={isPosting || (!postContent.trim() && uploadedMedia.length === 0)}
              aria-label="Publish post"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>

      {/* Feed Divider */}
      <div className="h-2 bg-slate-100 border-b border-slate-200" />

      {/* Loading state indicator */}
      {isLoadingPosts && (
        <div className="p-4 text-center text-sm font-bold text-slate-700 bg-white">
          Loading live feed from PostgreSQL...
        </div>
      )}

      {/* Posts */}
      <div className="divide-y divide-slate-200">
        {posts.map((post) => (
          <article
            key={post.id}
            className="p-4 bg-white hover:bg-slate-50/80 transition-colors border-b border-slate-200"
          >
            <div className="flex space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-black text-sm shadow-xs">
                {post.author ? post.author.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1.5 truncate">
                    <h3 className="font-black text-slate-900 truncate text-sm">
                      {post.author}
                    </h3>
                    <span className="text-slate-700 text-xs truncate font-medium">
                      {post.handle}
                    </span>
                    <span className="text-slate-500 text-xs">·</span>
                    <span className="text-slate-700 text-xs font-medium">
                      {post.time}
                    </span>
                  </div>
                  {post.category && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-indigo-50 text-indigo-950 border border-indigo-200 rounded-full flex-shrink-0 ml-2">
                      {post.category}
                    </span>
                  )}
                </div>

                <CensoredPostWrapper options={post.censorship}>
                  <p className="mt-1 text-slate-800 text-[15px] leading-relaxed font-normal whitespace-pre-wrap">
                    {post.content}
                  </p>
                </CensoredPostWrapper>

                {/* Media attachments */}
                {post.media_urls && post.media_urls.length > 0 && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-slate-300 max-h-96 bg-slate-100 flex items-center justify-center">
                    <img
                      src={post.media_urls[0]}
                      alt="Post visual attachment"
                      className="w-full h-auto max-h-96 object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center justify-between mt-3 max-w-md text-slate-700">
                  {/* Comments toggle button */}
                  <button
                    onClick={() => handleToggleComments(post)}
                    aria-label={`View comments on post by ${post.author}`}
                    className="flex items-center space-x-2 group hover:text-indigo-600 transition-colors"
                  >
                    <div className="p-1.5 rounded-full group-hover:bg-indigo-50 transition-colors">
                      <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600">{post.comments}</span>
                  </button>

                  {/* Repost button */}
                  <button
                    onClick={() => handleRepost(post)}
                    aria-label={`Repost post by ${post.author}`}
                    className="flex items-center space-x-2 group hover:text-emerald-600 transition-colors"
                  >
                    <div className="p-1.5 rounded-full group-hover:bg-emerald-50 transition-colors">
                      <svg className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-600">{post.reposts}</span>
                  </button>

                  {/* Like button */}
                  <button
                    onClick={() => handleLike(post)}
                    aria-label={`Like post by ${post.author}`}
                    className={`flex items-center space-x-2 group transition-colors ${
                      post.liked ? 'text-rose-600' : 'hover:text-rose-600'
                    }`}
                  >
                    <div className="p-1.5 rounded-full group-hover:bg-rose-50 transition-colors">
                      <svg
                        className={`w-5 h-5 transition-colors ${
                          post.liked ? 'fill-rose-600 text-rose-600' : 'text-slate-600 group-hover:text-rose-600'
                        }`}
                        fill={post.liked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <span className={`text-sm font-bold ${post.liked ? 'text-rose-600' : 'text-slate-800 group-hover:text-rose-600'}`}>
                      {post.likes}
                    </span>
                  </button>

                  {/* Share button */}
                  <button
                    onClick={() => handleShare(post)}
                    aria-label={`Share post by ${post.author}`}
                    className="flex items-center space-x-2 group hover:text-indigo-600 transition-colors"
                  >
                    <div className="p-1.5 rounded-full group-hover:bg-indigo-50 transition-colors">
                      <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                  </button>
                </div>

                {/* Inline Comments Section */}
                {expandedCommentsPostId === post.id && (
                  <div className="mt-4 pt-3 border-t border-slate-200 space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        aria-label="Write a comment"
                        value={commentInputMap[String(post.id)] || ''}
                        onChange={(e) =>
                          setCommentInputMap((prev) => ({
                            ...prev,
                            [String(post.id)]: e.target.value
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                        className="flex-1 px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={submittingCommentPostId === post.id || !commentInputMap[String(post.id)]?.trim()}
                        aria-label="Submit comment"
                        className="px-4 py-1.5 text-xs font-black bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition shadow-xs"
                      >
                        {submittingCommentPostId === post.id ? 'Posting...' : 'Reply'}
                      </button>
                    </div>

                    {loadingCommentsPostId === post.id ? (
                      <p className="text-xs font-bold text-slate-600 py-2">Loading comments...</p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {(commentsMap[String(post.id)] || []).length === 0 ? (
                          <p className="text-xs text-slate-600 py-1 font-medium">No comments yet. Start the conversation!</p>
                        ) : (
                          (commentsMap[String(post.id)] || []).map((c) => (
                            <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-black text-slate-900">{c.author_name}</span>
                                <span className="text-slate-600 text-[11px] font-medium">{formatRelativeTime(c.created_at)}</span>
                              </div>
                              <p className="text-slate-800 font-medium whitespace-pre-wrap">{c.content}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
