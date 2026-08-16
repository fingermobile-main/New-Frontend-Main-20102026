/*
 * FingerMobile Protocol™ - Watch Time Processor Utility
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

class WatchTimeProcessor {
  processSegments(sessionData) {
    const segments = [];
    let currentSegment = { start: 0, end: 0, watched: false };
    
    sessionData.forEach(event => {
      if (event.type === 'seek') {
        // Handle seek events
        segments.push({ ...currentSegment, end: event.time });
        currentSegment = { start: event.time, end: event.time, watched: false };
      } else if (event.type === 'play') {
        currentSegment.watched = true;
      } else if (event.type === 'pause') {
        currentSegment.watched = false;
      }
      
      currentSegment.end = event.time;
    });
    
    segments.push(currentSegment);
    return segments;
  }

  categorizeSegments(segments) {
    const categories = {
      'very_short': 0,    // 0-3s
      'short': 0,         // 3-10s
      'medium': 0,        // 10-30s
      'long': 0,          // 30s-10m
      'very_long': 0,     // 10m+
    };

    segments.forEach(segment => {
      const duration = segment.end - segment.start;
      if (duration <= 3) categories['very_short']++;
      else if (duration <= 10) categories['short']++;
      else if (duration <= 30) categories['medium']++;
      else if (duration <= 600) categories['long']++;
      else categories['very_long']++;
    });

    return categories;
  }
  
  calculateAverageWatchTime(segments) {
    if (!segments || segments.length === 0) return 0;
    
    const totalWatchTime = segments.reduce((sum, segment) => {
      if (segment.watched) {
        return sum + (segment.end - segment.start);
      }
      return sum;
    }, 0);
    
    return totalWatchTime / segments.length;
  }
}

module.exports = new WatchTimeProcessor();