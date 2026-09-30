import React from 'react';
import { PostContext } from '../contexts/PostContext';

export const usePost = () => {
  const context = React.useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }

  return context;
};
