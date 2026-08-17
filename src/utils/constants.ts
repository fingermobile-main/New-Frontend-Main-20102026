// Constants for the application

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
export const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const TOAST_DURATION = 3000;
export const MAX_NOTIFICATIONS = 5;

// Export an empty object to satisfy the module requirement
export {};