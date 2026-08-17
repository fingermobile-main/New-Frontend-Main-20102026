import React from 'react';
import { PostContext, PostContextType } from '../contexts/PostContext';

export const usePostContext = (): PostContextType => {
  const context = React.useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePostContext must be used within a PostProvider");
  }

  return context;
};
