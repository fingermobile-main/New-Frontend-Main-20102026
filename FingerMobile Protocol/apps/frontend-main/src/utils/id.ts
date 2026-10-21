import React from 'react';
export const generateUniqueId = (): string => {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};
