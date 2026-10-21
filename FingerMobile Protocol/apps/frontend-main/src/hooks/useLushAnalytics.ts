import { useState, useEffect } from 'react';

interface AnalyticsEvent {
  id: string;
  eventName: string;
  userId: string;
  timestamp: string;
  properties: Record<string, any>;
}

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  averageSessionDuration: number; // in seconds
  conversionRate: number; // percentage
  engagementRate: number; // percentage
  retentionRate: number; // percentage
}

export function useLushAnalytics(userId: string) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load analytics data
  const loadAnalytics = async (startDate?: string, endDate?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/analytics/${userId}?start=${startDate}&end=${endDate}`);
      // const data = await response.json();

      // Mock data for demonstration
      const mockData: AnalyticsData = {
        totalViews: Math.floor(Math.random() * 10000) + 5000,
        uniqueVisitors: Math.floor(Math.random() * 5000) + 1000,
        averageSessionDuration: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
        conversionRate: parseFloat((Math.random() * 15 + 2).toFixed(2)), // 2-17%
        engagementRate: parseFloat((Math.random() * 25 + 10).toFixed(2)), // 10-35%
        retentionRate: parseFloat((Math.random() * 40 + 30).toFixed(2)) // 30-70%
      };

      setAnalyticsData(mockData);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error loading analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Track an event
  const trackEvent = async (eventName: string, properties: Record<string, any> = {}) => {
    try {
      // In a real app, this would send data to an analytics service
      // await fetch('/api/lushpressies/analytics/event', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     eventName,
      //     userId,
      //     timestamp: new Date().toISOString(),
      //     properties
      //   })
      // });

      // Add to local state for immediate feedback
      const newEvent: AnalyticsEvent = {
        id: `event_${Date.now()}`,
        eventName,
        userId,
        timestamp: new Date().toISOString(),
        properties
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 99)]); // Keep last 100 events
    } catch (err) {
      console.error('Error tracking event:', err);
    }
  };

  // Track page view
  const trackPageView = (pageName: string, additionalProps: Record<string, any> = {}) => {
    trackEvent('page_view', {
      page: pageName,
      url: window.location.href,
      ...additionalProps
    });
  };

  // Track user action
  const trackUserAction = (action: string, context: Record<string, any> = {}) => {
    trackEvent('user_action', {
      action,
      context,
      ...context
    });
  };

  // Track engagement
  const trackEngagement = (engagementType: string, targetId: string) => {
    trackEvent('engagement', {
      engagementType,
      targetId
    });
  };

  // Track match
  const trackMatch = (matchedUserId: string) => {
    trackEvent('match', {
      matchedUserId
    });
  };

  // Track gift sent
  const trackGiftSent = (giftId: string, recipientId: string) => {
    trackEvent('gift_sent', {
      giftId,
      recipientId
    });
  };

  // Track message sent
  const trackMessageSent = (conversationId: string, messageLength: number) => {
    trackEvent('message_sent', {
      conversationId,
      messageLength
    });
  };

  // Get recent events
  const getRecentEvents = (limit: number = 10) => {
    return events.slice(0, limit);
  };

  // Initialize analytics
  useEffect(() => {
    if (userId) {
      loadAnalytics();
    }
  }, [userId]);

  return {
    analyticsData,
    events,
    isLoading,
    error,
    loadAnalytics,
    trackEvent,
    trackPageView,
    trackUserAction,
    trackEngagement,
    trackMatch,
    trackGiftSent,
    trackMessageSent,
    getRecentEvents
  };
}
