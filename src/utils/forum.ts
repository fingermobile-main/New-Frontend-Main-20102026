import React from 'react';
export const getForumCategoryBySlug = (
  slug: string,
): {
  slug: string;
  name: string;
  description?: string;
  posts?: any[];
} => {
  // Placeholder for forum utility functions
  return { 
    slug,
    name: `Category ${slug}`,
    description: `Description for ${slug}`,
    posts: []
  };
};
