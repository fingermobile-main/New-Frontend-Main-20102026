class CognitiveLoadDetector {
  /**
   * Detects cognitive load based on user interaction patterns
   * @param {Object} interactionData - Object containing user interaction metrics
   * @returns {Number} Cognitive load score from 0-100
   */
  detectCognitiveLoad(interactionData) {
    // Initialize cognitive load score
    let cognitiveLoad = 0;
    
    // Factor 1: Checking behavior (pull-to-refresh frequency)
    // Higher refresh rate indicates higher cognitive load
    if (interactionData.refreshFrequency) {
      // Normalize to 0-30 scale (3+ refreshes/min = high load)
      cognitiveLoad += Math.min(30, interactionData.refreshFrequency * 10);
    }
    
    // Factor 2: Interaction intensity (clicks per minute)
    if (interactionData.clicksPerMinute) {
      // Very high interaction (>20/min) indicates cognitive stress
      if (interactionData.clicksPerMinute > 20) {
        cognitiveLoad += 25;
      } else if (interactionData.clicksPerMinute > 10) {
        cognitiveLoad += 15;
      } else if (interactionData.clicksPerMinute > 5) {
        cognitiveLoad += 8;
      }
    }
    
    // Factor 3: Session duration
    if (interactionData.sessionDurationMinutes) {
      // Extended sessions (>60 mins) contribute to fatigue
      if (interactionData.sessionDurationMinutes > 60) {
        cognitiveLoad += 20;
      } else if (interactionData.sessionDurationMinutes > 30) {
        cognitiveLoad += 10;
      }
    }
    
    // Factor 4: Multitasking (simultaneous activities)
    if (interactionData.simultaneousActivities) {
      // More activities happening at once increases cognitive load
      cognitiveLoad += Math.min(20, (interactionData.simultaneousActivities - 1) * 7);
    }
    
    // Factor 5: Error rate (typos, misclicks)
    if (interactionData.errorRate) {
      // Higher error rates indicate cognitive overload
      cognitiveLoad += Math.min(15, interactionData.errorRate * 50);
    }
    
    // Ensure cognitive load is between 0 and 100
    return Math.min(100, Math.max(0, Math.round(cognitiveLoad)));
  }
  
  /**
   * Determines appropriate notification timing based on cognitive load
   * @param {Number} cognitiveLoad - Cognitive load score (0-100)
   * @param {Boolean} isCriticalNotification - Whether notification is critical
   * @returns {Object} Notification timing decision
   */
  determineNotificationTiming(cognitiveLoad, isCriticalNotification = false) {
    // Thresholds for different cognitive load levels
    const LOW_LOAD_THRESHOLD = 30;
    const HIGH_LOAD_THRESHOLD = 70;
    
    if (isCriticalNotification) {
      // Always send critical notifications but consider optimal timing
      return {
        shouldSend: true,
        delay: cognitiveLoad > HIGH_LOAD_THRESHOLD ? 5000 : 0, // Delay 5s if high load
        priority: 'critical'
      };
    }
    
    // If cognitive load is high, defer non-critical notifications
    if (cognitiveLoad > HIGH_LOAD_THRESHOLD) {
      return {
        shouldSend: false,
        delay: 10000, // Wait for better moment
        priority: 'deferred'
      };
    }
    
    // If cognitive load is moderate, consider sending with delay
    if (cognitiveLoad > LOW_LOAD_THRESHOLD) {
      return {
        shouldSend: true,
        delay: 2000, // Small delay to ensure focus
        priority: 'standard'
      };
    }
    
    // If cognitive load is low, send immediately
    return {
      shouldSend: true,
      delay: 0,
      priority: 'immediate'
    };
  }
  
  /**
   * Adjusts user's cognitive load in their profile
   * @param {Object} user - User object
   * @param {Number} newLoad - New cognitive load value
   * @returns {Number} Updated cognitive load value
   */
  updateUserCognitiveLoad(user, newLoad) {
    // Gradually update the cognitive load to prevent sudden changes
    const currentLoad = user.cognitiveLoad || 0;
    
    // Use a weighted average to smooth the transition
    // This prevents sudden spikes due to temporary events
    const updatedLoad = Math.round((currentLoad * 0.7) + (newLoad * 0.3));
    
    // Update the user's cognitive load in the database
    // (This would typically involve a database update)
    user.cognitiveLoad = updatedLoad;
    
    return updatedLoad;
  }
  
  /**
   * Checks if a time is within user's quiet hours
   * @param {Object} user - User object with notification settings
   * @param {Date} timeToCheck - Time to check (defaults to now)
   * @returns {Boolean} True if in quiet hours
   */
  isInQuietHours(user, timeToCheck = new Date()) {
    if (!user.notificationSettings?.cognitiveTiming) {
      // If cognitive timing is disabled, don't apply quiet hours
      return false;
    }
    
    const startHour = parseInt(user.notificationSettings.quietHoursStart.split(':')[0]);
    const startMinute = parseInt(user.notificationSettings.quietHoursStart.split(':')[1]);
    const endHour = parseInt(user.notificationSettings.quietHoursEnd.split(':')[0]);
    const endMinute = parseInt(user.notificationSettings.quietHoursEnd.split(':')[1]);
    
    const currentHour = timeToCheck.getHours();
    const currentMinute = timeToCheck.getMinutes();
    
    // Convert times to minutes from midnight for easier comparison
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // Handle overnight case (e.g. 22:00 to 07:00)
    if (startTimeInMinutes > endTimeInMinutes) {
      // Overnight quiet hours (e.g. 22:00 to 07:00)
      return currentTimeInMinutes >= startTimeInMinutes || currentTimeInMinutes < endTimeInMinutes;
    } else {
      // Same day quiet hours (e.g. 22:00 to 23:00)
      return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes;
    }
  }
}

module.exports = new CognitiveLoadDetector();