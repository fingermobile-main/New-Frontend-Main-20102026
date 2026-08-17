import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import { Post, Video } from '../types';

interface ContentState {
  posts: Post[];
  videos: Video[];
  loading: boolean;
  error: string | null;
  originalityScores: Record<string, number>; // Map of contentId to originality score
  dwellTimes: Record<string, number>; // Map of contentId to dwell time in ms
  aiDisclosed: Record<string, boolean>; // Map of contentId to whether AI was disclosed
}

type ContentAction =
  | { type: typeof SET_CONTENT; payload: { posts?: Post[]; videos?: Video[] } }
  | { type: typeof ADD_POST; payload: Post }
  | { type: typeof ADD_VIDEO; payload: Video }
  | { type: typeof UPDATE_POST; payload: Post }
  | { type: typeof DELETE_POST; payload: string }
  | { type: typeof DELETE_VIDEO; payload: string }
  | { type: typeof SET_LOADING; payload: boolean }
  | { type: typeof SET_ERROR; payload: string | null }
  | { type: typeof SET_ORIGINALITY_SCORE; payload: { contentId: string; score: number } }
  | { type: typeof SET_DWELL_TIME; payload: { contentId: string; dwellTimeMs: number } }
  | { type: typeof SET_AI_DISCLOSED; payload: { contentId: string; disclosed: boolean } };

const initialState: ContentState = {
  posts: [],
  videos: [],
  loading: false,
  error: null,
  originalityScores: {},
  dwellTimes: {},
  aiDisclosed: {}
};

// Action types
const SET_CONTENT = 'SET_CONTENT';
const ADD_POST = 'ADD_POST';
const ADD_VIDEO = 'ADD_VIDEO';
const UPDATE_POST = 'UPDATE_POST';
const DELETE_POST = 'DELETE_POST';
const DELETE_VIDEO = 'DELETE_VIDEO';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
const SET_ORIGINALITY_SCORE = 'SET_ORIGINALITY_SCORE';
const SET_DWELL_TIME = 'SET_DWELL_TIME';
const SET_AI_DISCLOSED = 'SET_AI_DISCLOSED';

const contentReducer = (state: ContentState, action: ContentAction): ContentState => {
  switch (action.type) {
    case SET_CONTENT:
      return {
        ...state,
        posts: action.payload.posts || state.posts,
        videos: action.payload.videos || state.videos,
        loading: false,
        error: null
      };
    case ADD_POST:
      return {
        ...state,
        posts: [...state.posts, action.payload],
        loading: false
      };
    case ADD_VIDEO:
      return {
        ...state,
        videos: [...state.videos, action.payload],
        loading: false
      };
    case UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map(post => 
          post.id === action.payload.id ? { ...post, ...action.payload } : post
        ),
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
        loading: false
      };
    case DELETE_VIDEO:
      return {
        ...state,
        videos: state.videos.filter(video => video.id !== action.payload),
        loading: false
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case SET_ORIGINALITY_SCORE:
      return {
        ...state,
        originalityScores: {
          ...state.originalityScores,
          [action.payload.contentId]: action.payload.score
        }
      };
    case SET_DWELL_TIME:
      return {
        ...state,
        dwellTimes: {
          ...state.dwellTimes,
          [action.payload.contentId]: action.payload.dwellTimeMs
        }
      };
    case SET_AI_DISCLOSED:
      return {
        ...state,
        aiDisclosed: {
          ...state.aiDisclosed,
          [action.payload.contentId]: action.payload.disclosed
        }
      };
    default:
      return state;
  }
};

interface ContentContextType extends ContentState {
  fetchPosts: () => Promise<void>;
  fetchVideos: () => Promise<void>;
  createPost: (postData: Omit<Post, 'id' | 'createdAt'>) => Promise<Post>;
  createVideo: (videoData: Omit<Video, 'id' | 'uploadDate'>) => Promise<Video>;
  updatePost: (postId: string, postData: Partial<Post>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  deleteVideo: (videoId: string) => Promise<void>;
  uploadMedia: (file: File, type: 'image' | 'video' | 'carousel' | 'profile-video') => Promise<string>;
  getOriginalityScore: (contentId: string) => number;
  setOriginalityScore: (contentId: string, score: number) => void;
  recordDwellTime: (contentId: string, dwellTimeMs: number) => void;
  markAsAIDisclosed: (contentId: string, disclosed: boolean) => void;
  createCarousel: (cardData: Array<{ title: string; content: string; mediaUrl: string }>) => Promise<Post>;
  createReel: (mediaFiles: File[]) => Promise<Video>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

export const ContentProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(contentReducer, initialState);

  const fetchPosts = useCallback(async () => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await fetch('/api/content/posts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const posts = await response.json() as Post[];
      dispatch({ type: SET_CONTENT, payload: { posts } });
    } catch {
      dispatch({ type: SET_ERROR, payload: 'Failed to fetch posts' });
    }
  }, []);

  const fetchVideos = useCallback(async () => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await fetch('/api/content/videos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const videos = await response.json() as Video[];
      dispatch({ type: SET_CONTENT, payload: { videos } });
    } catch {
      dispatch({ type: SET_ERROR, payload: 'Failed to fetch videos' });
    }
  }, []);

  const createPost = useCallback(async (postData: Omit<Post, 'id' | 'createdAt'>): Promise<Post> => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await fetch('/api/content/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        },
        body: JSON.stringify({
          ...postData,
          createdAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json() as Post;
      dispatch({ type: ADD_POST, payload: newPost });
      return newPost;
    } catch {
      dispatch({ type: SET_ERROR, payload: 'Failed to create post' });
      throw new Error('Failed to create post');
    }
  }, []);

  const createVideo = useCallback(async (videoData: Omit<Video, 'id' | 'uploadDate'>): Promise<Video> => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await fetch('/api/content/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        },
        body: JSON.stringify({
          ...videoData,
          uploadDate: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create video');
      }

      const newVideo = await response.json() as Video;
      dispatch({ type: ADD_VIDEO, payload: newVideo });
      return newVideo;
    } catch {
      dispatch({ type: SET_ERROR, payload: 'Failed to create video' });
      throw new Error('Failed to create video');
    }
  }, []);

  const updatePost = useCallback(async (postId: string, postData: Partial<Post>) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await fetch(`/api/content/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      const updatedPost = await response.json() as Post;
      dispatch({ type: UPDATE_POST, payload: updatedPost });
    } catch {
      dispatch({ type: SET_ERROR, payload: 'Failed to update post' });
    }
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await fetch(`/api/content/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      dispatch({ type: DELETE_POST, payload: postId });
    } catch {
      dispatch({ type: SET_ERROR, payload: 'Failed to delete post' });
    }
  }, []);

  const deleteVideo = useCallback(async (videoId: string) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await fetch(`/api/content/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete video');
      }

      dispatch({ type: DELETE_VIDEO, payload: videoId });
    } catch {
      dispatch({ type: SET_ERROR, payload: 'Failed to delete video' });
    }
  }, []);

  const uploadMedia = useCallback(async (file: File, type: 'image' | 'video' | 'carousel' | 'profile-video'): Promise<string> => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      // Mark as AI disclosed if this is for an AI-generated asset
      const aiDisclosed = file.name.includes('_ai_gen') || file.name.includes('_aigen');
      
      const response = await fetch('/api/content/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${type}`);
      }

      const result = await response.json();
      
      // Record if this was AI disclosed
      if (result.id && aiDisclosed) {
        dispatch({ 
          type: SET_AI_DISCLOSED, 
          payload: { contentId: result.id, disclosed: true } 
        });
      }

      return result.url;
    } catch {
      dispatch({ type: SET_ERROR, payload: `Failed to upload ${type}` });
      throw new Error(`Failed to upload ${type}`);
    }
  }, []);

  const getOriginalityScore = useCallback((contentId: string): number => {
    return state.originalityScores[contentId] || 0;
  }, [state.originalityScores]);

  const setOriginalityScore = useCallback((contentId: string, score: number) => {
    dispatch({ 
      type: SET_ORIGINALITY_SCORE, 
      payload: { contentId, score } 
    });
  }, []);

  const recordDwellTime = useCallback((contentId: string, dwellTimeMs: number) => {
    dispatch({ 
      type: SET_DWELL_TIME, 
      payload: { contentId, dwellTimeMs } 
    });
  }, []);

  const markAsAIDisclosed = useCallback((contentId: string, disclosed: boolean) => {
    dispatch({ 
      type: SET_AI_DISCLOSED, 
      payload: { contentId, disclosed } 
    });
  }, []);

  const createCarousel = useCallback(async (cards: Array<{ title: string; content: string; mediaUrl: string }>): Promise<Post> => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const postData: Omit<Post, 'id' | 'createdAt'> = {
        content: 'Interactive Carousel Post',
        author: { id: 'current-user', name: 'Current User' },
        type: 'image',
        tags: ['carousel'],
        title: 'Swipeable Cards',
        body: JSON.stringify(cards)
      };

      const response = await fetch('/api/content/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        },
        body: JSON.stringify({
          ...postData,
          createdAt: new Date().toISOString(),
          type: 'carousel'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create carousel post');
      }

      const newPost = await response.json() as Post;
      dispatch({ type: ADD_POST, payload: newPost });
      return newPost;
    } catch {
      dispatch({ type: SET_ERROR, payload: 'Failed to create carousel post' });
      throw new Error('Failed to create carousel post');
    }
  }, []);

  const createReel = useCallback(async (mediaFiles: File[]): Promise<Video> => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const uploadPromises = mediaFiles.map(file => uploadMedia(file, 'video'));
      const urls = await Promise.all(uploadPromises);

      const videoData: Omit<Video, 'id' | 'uploadDate'> = {
        title: 'New Reel',
        description: 'A newly created reel',
        url: urls[0], 
        thumbnail: '', 
        duration: 0, 
        uploader: 'current-user',
        views: 0,
        likes: 0,
        tags: ['reel', 'shorts'],
        category: 'reels'
      };

      const newVideo = await createVideo(videoData);
      return newVideo;
    } catch {
      dispatch({ type: SET_ERROR, payload: 'Failed to create reel' });
      throw new Error('Failed to create reel');
    }
  }, [uploadMedia, createVideo]);

  const contextValue = useMemo(() => ({
    ...state,
    fetchPosts,
    fetchVideos,
    createPost,
    createVideo,
    updatePost,
    deletePost,
    deleteVideo,
    uploadMedia,
    getOriginalityScore,
    setOriginalityScore,
    recordDwellTime,
    markAsAIDisclosed,
    createCarousel,
    createReel
  }), [
    state,
    fetchPosts,
    fetchVideos,
    createPost,
    createVideo,
    updatePost,
    deletePost,
    deleteVideo,
    uploadMedia,
    getOriginalityScore,
    setOriginalityScore,
    recordDwellTime,
    markAsAIDisclosed,
    createCarousel,
    createReel
  ]);

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};
