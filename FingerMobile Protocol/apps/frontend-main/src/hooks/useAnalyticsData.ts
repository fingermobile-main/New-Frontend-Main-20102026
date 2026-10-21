import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

interface AnalyticsMetric {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon?: React.ReactNode; // Icon will be handled in the component
}

interface HeatmapDataPoint {
  x: number;
  y: number;
  intensity: number;
}

interface AnalyticsData {
  metrics: AnalyticsMetric[];
  heatmapData: HeatmapDataPoint[];
  engagementData: {
  name: string;
  value: number;
  }[];
  trafficData: {
  name: string;
  value: number;
  }[];
  deviceData: {
  name: string;
  value: number;
  }[];
  engagementMetrics: {
  likes: string;
  comments: string;
  shares: string;
  saves: string;
  };
  heatmapInsights: {
  highEngagementAreas: string;
  clickPatterns: string;
  scrollDepth: string;
  };
  deviceAnalytics: {
  mobile: {
    members: string;
    percentage: string;
  };
  desktop: {
    members: string;
    percentage: string;
  };
  tablet: {
    members: string;
    percentage: string;
  };
  };
  topRegions: {
  country: string;
  members: string;
  percentage: string;
  }[];
}

interface UseAnalyticsDataResult {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
}

export const useAnalyticsData = (
  timeRange: string
): UseAnalyticsDataResult => {
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetching all data in parallel
        const [
          metricsResponse,
          heatmapResponse,
          engagementResponse,
          trafficResponse,
          deviceResponse,
          engagementMetricsResponse,
          heatmapInsightsResponse,
          deviceAnalyticsResponse,
          topRegionsResponse
        ] = await Promise.all([
          ApiService.request<AnalyticsMetric[]>(
            `/analytics/metrics?timeRange=${timeRange}`,
            {method: 'GET'}
          ),
          ApiService.request<HeatmapDataPoint[]>(
            `/analytics/heatmap?timeRange=${timeRange}`,
            {method: 'GET'}
          ),
          ApiService.request<{name: string; value: number }[]>(
            `/analytics/engagement-chart?timeRange=${timeRange}`,
            {method: 'GET'}
          ),
          ApiService.request<{name: string; value: number }[]>(
            `/analytics/traffic-chart?timeRange=${timeRange}`,
            {method: 'GET'}
          ),
          ApiService.request<{name: string; value: number }[]>(
            `/analytics/device-distribution?timeRange=${timeRange}`,
            {method: 'GET'}
          ),
          ApiService.request<{likes: string; comments: string; shares: string; saves: string;}>(
            `/analytics/engagement-metrics?timeRange=${timeRange}`,
            {method: 'GET'}
          ),
          ApiService.request<{highEngagementAreas: string; clickPatterns: string; scrollDepth: string;}>(
            `/analytics/heatmap-insights?timeRange=${timeRange}`,
            {method: 'GET'}
          ),
          ApiService.request<{mobile: { members: string; percentage: string }; desktop: { members: string; percentage: string }; tablet: { members: string; percentage: string };}>(
            `/analytics/device-analytics?timeRange=${timeRange}`,
            {method: 'GET'}
          ),
          ApiService.request<
            {country: string; members: string; percentage: string }[]
          >(`/analytics/top-regions?timeRange=${timeRange}`, {method: 'GET'})
        ]);

        if (
          metricsResponse &&
          heatmapResponse &&
          engagementResponse &&
          trafficResponse &&
          deviceResponse &&
          engagementMetricsResponse &&
          heatmapInsightsResponse &&
          deviceAnalyticsResponse &&
          topRegionsResponse
        ) {
          setData({
            metrics: metricsResponse,
            heatmapData: heatmapResponse,
            engagementData: engagementResponse,
            trafficData: trafficResponse,
            deviceData: deviceResponse,
            engagementMetrics: engagementMetricsResponse,
            heatmapInsights: heatmapInsightsResponse,
            deviceAnalytics: deviceAnalyticsResponse,
            topRegions: topRegionsResponse
          });
        } else {
          setError('One or more analytics data fetches failed.');
        }
      } catch (err) {
        setError('Failed to fetch analytics data.');
        console.error('Error fetching analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  return { data, loading, error };
};
