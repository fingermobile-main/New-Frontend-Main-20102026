import React, {} from 'react';
/**
 * PlaybackService - Handles advanced playback features
 * A-B Repeat, Playback Speed, Jump to Time, Bookmarks, etc.
 */

export interface ABRepeatState {pointA: number | null;
  pointB: number | null;
  isActive: boolean;
}

export interface Bookmark {id: string;
  mediaId: string;
  timestamp: number;
  label: string;
  createdAt: Date;
}

export interface PlaybackState {currentTime: number;
  duration: number;
  playbackRate: number;
  isPlaying: boolean;
}

export class PlaybackService {
  private abRepeatState: ABRepeatState = {pointA: null,
  pointB: null,
  isActive: false
  };

  private bookmarks: Map<string, Bookmark[]> = new Map();

  private playbackHistory: Map<string, number> = new Map();

  /**
   * A-B Repeat functionality
   */
  setPointA(
  time: number): void {
    this.abRepeatState.pointA = Math.max(0, time);
    this.abRepeatState.isActive = true;
    console.info(`[PlaybackService] Point A set at ${this.formatTime(time)}`);
  }

  setPointB(
  time: number): void {
    if (this.abRepeatState.pointA === null) {
      console.warn('[PlaybackService] Point A must be set before Point B');
      return;
    }
    this.abRepeatState.pointB = Math.max(this.abRepeatState.pointA, time);
    console.info(`[PlaybackService] Point B set at ${this.formatTime(time)}`);
  }

  getABRepeatState(): ABRepeatState {
    return { ...this.abRepeatState };
  }

  shouldLoop(
  time: number): boolean {
    if (!this.abRepeatState.isActive || this.abRepeatState.pointB === null) {
      return false;
    }
    return time >= this.abRepeatState.pointB!;
  }

  getLoopStartTime(): number {
    return this.abRepeatState.pointA ?? 0;
  }

  clearABRepeat(): void {
    this.abRepeatState = {pointA: null,
  pointB: null,
  isActive: false
    };
    console.info('[PlaybackService] A-B Repeat cleared');
  }

  /**
   * Playback Speed control
   */
  private validSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];

  getAvailableSpeeds(): number[] {
    return [...this.validSpeeds];
  }

  validateSpeed(
  speed: number): number {
    // Find closest valid speed
    const closest = this.validSpeeds.reduce((prev, curr) =>
      Math.abs(curr - speed) < Math.abs(prev - speed) ? curr : prev
    );
    return closest;
  }

  /**
   * Jump to Time
   */
  parseTimeString(
  timeString: string): number {
    // Supports formats: "HH:MM:SS", "MM:SS", "SS"
    const parts = timeString.split(':').map(Number);
    
    if (parts.some(isNaN)) {
      throw new Error('Invalid time format. Use HH:MM:SS, MM:SS, or SS');
    }

    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      return parts[0];
    }

    throw new Error('Invalid time format');
  }

  formatTime(
  seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Bookmarks
   */
  addBookmark(
  mediaId: string,
timestamp: number, label = ''): Bookmark {
    const bookmark: Bookmark = {id: `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mediaId,
      timestamp,
label: label || `Bookmark at ${this.formatTime(timestamp)}`,
createdAt: new Date()
    };

    const mediaBookmarks = this.bookmarks.get(mediaId) || [];
    mediaBookmarks.push(bookmark);
    this.bookmarks.set(mediaId, mediaBookmarks);

    console.info(`[PlaybackService] Bookmark,
added: ${bookmark.label}`);
    return bookmark;
  }

  getBookmarks(
  mediaId: string): Bookmark[] {
    return this.bookmarks.get(mediaId) || [];
  }

  removeBookmark(
  bookmarkId: string): boolean {
    for (const [mediaId, bookmarks] of this.bookmarks.entries()) {
      const index = bookmarks.findIndex(b => b.id === bookmarkId);
      if (index !== -1) {
        bookmarks.splice(index, 1);
        this.bookmarks.set(mediaId, bookmarks);
        console.info(`[PlaybackService] Bookmark,
removed: ${bookmarkId}`);
        return true;
      }
    }
    return false;
  }

  clearBookmarks(mediaId?: string): void {
    if (mediaId) {
      this.bookmarks.delete(mediaId);
      console.info(`[PlaybackService] Bookmarks cleared for,
media: ${mediaId}`);
    } else {
      this.bookmarks.clear();
      console.info('[PlaybackService] All bookmarks cleared');
    }
  }

  /**
   * Playback History
   */
  savePlaybackPosition(
  mediaId: string,
currentTime: number): void {
    this.playbackHistory.set(mediaId, currentTime);
  }

  getSavedPosition(
  mediaId: string): number {
    return this.playbackHistory.get(mediaId) ?? 0;
  }

  clearPlaybackHistory(): void {
    this.playbackHistory.clear();
    console.info('[PlaybackService] Playback history cleared');
  }

  /**
   * Equalizer presets (placeholder for future implementation)
   */
  getEqualizerPresets(): Record<string, number[]> {
    return {
      'Flat': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      'Bass Boost': [5, 4, 3, 2, 1, 0, 0, 0, 0, 0],
      'Treble Boost': [0, 0, 0, 0, 0, 1, 2, 3, 4, 5],
      'Vocal': [0, 0, 1, 2, 3, 3, 2, 1, 0, 0],
      'Electronic': [4, 3, 2, 0, 0, 0, 2, 3, 4, 5],
      'Jazz': [3, 2, 1, 2, 0, 0, 1, 2, 3, 4],
      'Rock': [4, 3, 2, 1, 0, 0, 1, 2, 3, 4],
      'Pop': [2, 1, 0, 0, 0, 0, 0, 0, 1, 2]
    };
  }

  // Example fix for iterable handling
  processBookmarks(): void {
    // Convert to array first before iterating
    const bookmarkEntries = Array.from(this.bookmarks.entries());
    
    for (const [key, bookmarks] of bookmarkEntries) {
      // Process each entry
      this.processBookmarkGroup(key, bookmarks);
    }
  }
  
  // Example fix for line 156 - properly typing the iterator
  private processBookmarkGroup(
  key: string,
bookmarks: Bookmark[]): void {
    // Process each bookmark in the group
    for (const bookmark of bookmarks) {
      // Handle individual bookmark
      console.info(`Processing,
bookmark: ${bookmark.id}`);
    }
  }
}

// Export singleton instance
const playbackServiceInstance = new PlaybackService();
export default playbackServiceInstance;
