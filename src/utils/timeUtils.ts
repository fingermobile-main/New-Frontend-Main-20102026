import React, {} from 'react';
/**
 * Format seconds into MM:SS or HH:MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export const formatTime = (
  seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Parse time string (MM:SS or HH:MM:SS) to seconds
 * @param timeString - Time string in MM:SS or HH:MM:SS format
 * @returns Time in seconds
 */
export const parseTime = (
  timeString: string): number => {
  const parts = timeString.split(':').map(Number);

  if (parts.length === 2) {
    // MM:SS format
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS format
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return 0;
};

/**
 * Calculate progress percentage
 * @param current - Current time in seconds
 * @param total - Total duration in seconds
 * @returns Progress percentage (0-100)
 */
export const calculateProgress = (
  current: number,
  total: number): number => {
  if (total === 0) return 0;
  return Math.min(100, Math.max(0, (current / total) * 100));
};
