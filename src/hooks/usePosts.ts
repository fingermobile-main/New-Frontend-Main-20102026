import { useState } from 'react';
import { Post } from '../types';

interface UsePostsReturn {
  fetchPosts: () => Promise<Post[]>;
}

export const usePosts = (): UsePostsReturn => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async (): Promise<Post[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPosts: Post[] = [
          // Add mock data structure based on the Post type
        ];
        setPosts(mockPosts);
        resolve(mockPosts);
      }, 500);
    });
  };

  return { fetchPosts };
};