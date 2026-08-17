import React, { useState } from 'react';
import type { Post as PostType, Video, Product } from '../types';

export interface CommunityContextType {
  displayOption: "card" | "row";
  setDisplayOption: (option: "card" | "row") => void;
  posts: PostType[];
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
  videos: Video[];
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const CommunityContext = React.createContext<CommunityContextType | undefined>(
  undefined,
);

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [displayOption, setDisplayOption] = React.useState<"card" | "row">("card");
  const [posts, setPosts] = React.useState<PostType[]>([]);
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);

  const contextValue = React.useMemo(() => ({
    displayOption,
    setDisplayOption,
    posts,
    setPosts,
    videos,
    setVideos,
    products,
    setProducts
  }), [displayOption, posts, videos, products]);

  return (
    <CommunityContext.Provider value={contextValue}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = (): CommunityContextType => {
  const context = React.useContext(CommunityContext);
  if (context === undefined) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }
  return context;
};
