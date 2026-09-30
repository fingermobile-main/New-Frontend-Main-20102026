import React, { ReactNode, createContext, useContext, useState } from 'react';

interface PostContextType {
  posts: any[];
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
  selectedPost: any | null;
  setSelectedPost: React.Dispatch<React.SetStateAction<any | null>>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  return (
    <PostContext.Provider value={{ posts, setPosts, selectedPost, setSelectedPost }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = (): PostContextType => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};
