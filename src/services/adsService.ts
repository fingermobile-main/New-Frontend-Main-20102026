import React, {} from 'react';
// adsService.ts
// Ads Dashboard API Functions

import { api } from './api';
import {
  AdsMetric,
  AdsPerformanceData,
  TopPerformingCampaign,
  PerformanceMetric,
  DemographicData,
  InterestData,
  GeographicData
} from '../types/ads';
import {
  adsMetricsData,
  adsPerformanceData,
  topPerformingCampaignsData,
  performanceMetricsData,
  demographicsData,
  interestsData,
  geographicData
} from '../data/adsData';

class AdsService {
  private static instance: AdsService;

  private constructor() {}

  public static getInstance(): AdsService {
    if (!AdsService.instance) {
      AdsService.instance = new AdsService();
    }
    return AdsService.instance;
  }

  public async getMetrics(timeRange?: string): Promise<AdsMetric[]> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const url = timeRange ? `/ads/dashboard/metrics?timeRange=${timeRange}` : '/ads/dashboard/metrics';
      const response = await api.get(url, {headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching metrics:", error);
      // Return mock data in case of error
      return adsMetricsData;
    }
  }

  public async getPerformanceData(timeRange?: string): Promise<AdsPerformanceData[]> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const url = timeRange ? `/ads/dashboard/performance?timeRange=${timeRange}` : '/ads/dashboard/performance';
      const response = await api.get(url, {headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching performance data:", error);
      // Return mock data in case of error
      return adsPerformanceData;
    }
  }

  public async getTopPerformingCampaigns(): Promise<TopPerformingCampaign[]> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await api.get("/ads/dashboard/top-campaigns", {headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching top performing campaigns:", error);
      // Return mock data in case of error
      return topPerformingCampaignsData;
    }
  }

  public async getPerformanceMetrics(): Promise<PerformanceMetric[]> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await api.get("/ads/dashboard/performance-metrics", {headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching performance metrics:", error);
      // Return mock data in case of error
      return performanceMetricsData;
    }
  }

  public async getDemographics(): Promise<DemographicData[]> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await api.get("/ads/dashboard/demographics", {headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching demographics:", error);
      // Return mock data in case of error
      return demographicsData;
    }
  }

  public async getInterests(): Promise<InterestData[]> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await api.get("/ads/dashboard/interests", {headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching interests:", error);
      // Return mock data in case of error
      return interestsData;
    }
  }

  public async getGeographicData(): Promise<GeographicData[]> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await api.get("/ads/dashboard/geographic", {headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching geographic data:", error);
      // Return mock data in case of error
      return geographicData;
    }
  }
}

export default AdsService.getInstance();