import React, {} from 'react';
/**
 * Flamingo Service - Size Guide & Outfit Builder
 * Handles body measurements, size recommendations, and outfit creation
 */

import { api } from './api';

// Types
export interface FlamingoCategory {id: string;
  name: string;
  slug: string;
  type: 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes' | 'accessories';
  description?: string;
  icon_url?: string;
  measurement_guide?: any;
  display_order: number;
  is_active: boolean;
}

export interface FlamingoSizeChart {id: string;
  brand_name: string;
  category_id: string;
  sizes: any[];
  region: 'US' | 'UK' | 'EU' | 'JP' | 'CN' | 'INT';
  gender?: 'men' | 'women' | 'unisex' | 'kids';
  last_updated?: string;
  source_url?: string;
  verified: boolean;
}

export interface FlamingoBrandSizing {id: string;
  brand_name: string;
  description?: string;
  community_notes?: string;
  fits_true_to_size: boolean;
  runs_small: boolean;
  runs_large: boolean;
  fit_notes?: string;
  category_sizing?: any;
  avg_fit_rating?: number;
  total_ratings: number;
  fit_pattern?: string;
  category_patterns?: any;
}

export interface FlamingoMeasurements {id: string;
  user_id: string;
  height_cm?: number;
  weight_kg?: number;
  body_type?: 'slim' | 'athletic' | 'average' | 'curvy' | 'plus';
  chest_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
  shoulder_width_cm?: number;
  arm_length_cm?: number;
  inseam_cm?: number;
  thigh_cm?: number;
  foot_length_cm?: number;
  shoe_size_us?: number;
  shoe_size_eu?: number;
  preferred_fit: 'slim' | 'regular' | 'relaxed' | 'oversized';
  is_public: boolean;
}

// Alias for backward compatibility
export type FlamingoMeasurement = FlamingoMeasurements;

export interface FlamingoSizeRecommendation {id: string;
  user_id: string;
  brand_name: string;
  category_id: string;
  recommended_size: string;
  confidence_score: number;
  confidence_level?: 'low' | 'medium' | 'high';
  alternative_sizes?: any[];
  reasoning?: string;
  based_on_measurements: boolean;
  based_on_purchase_history: boolean;
  based_on_community_data: boolean;
  fit_pattern?: string;
  user_feedback?: 'perfect' | 'too_small' | 'too_large' | 'not_tried';
  feedback_date?: string;
  created_at?: string;
}

export interface FlamingoOutfit {id: string;
  user_id: string;
  name: string;
  description?: string;
  occasion?: 'casual' | 'formal' | 'business' | 'party' | 'workout' | 'date' | 'travel' | 'other';
  season?: 'spring' | 'summer' | 'fall' | 'winter' | 'all_season';
  style_tags: string[];
  color_palette?: string[];
  is_public: boolean;
  is_favorite: boolean;
  likes_count: number;
  saves_count: number;
  views_count: number;
  items_count?: number;
  items?: FlamingoOutfitItem[];
  creator_name?: string;
  created_at?: string;
}

export interface FlamingoOutfitItem {id: string;
  outfit_id: string;
  item_name: string;
  category: string;
  brand?: string;
  color?: string;
  size?: string;
  product_id?: string;
  product_url?: string;
  price?: number;
  position: number;
  item_type: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory';
  image_url?: string;
}

class FlamingoService {
  private baseUrl = '/api/flamingo';

  // Categories
  async getCategories(): Promise<FlamingoCategory[]> {
    const response = await api.get(`${this.baseUrl}/categories`);
    return response.data;
  }

  // Size Charts
  async getSizeCharts(params?: { brand_name?: string; category_id?: string; region?: string; gender?: string }): Promise<FlamingoSizeChart[]> {
    const response = await api.get(`${this.baseUrl}/size-charts`, { params });
    return response.data;
  }

  async getSizeChart(
  id: string): Promise<FlamingoSizeChart> {
    const response = await api.get(`${this.baseUrl}/size-charts/${id}`);
    return response.data;
  }

  async createSizeChart(
  chartData: Partial<FlamingoSizeChart>): Promise<FlamingoSizeChart> {
    const response = await api.post(`${this.baseUrl}/size-charts`, chartData);
    return response.data;
  }

  // Brand Sizing
  async getBrandSizings(): Promise<FlamingoBrandSizing[]> {
    const response = await api.get(`${this.baseUrl}/brand-sizings`);
    return response.data;
  }

  async getBrandSizing(
  brandName: string): Promise<FlamingoBrandSizing> {
    const response = await api.get(`${this.baseUrl}/brand-sizings/${encodeURIComponent(brandName)}`);
    return response.data;
  }

  async updateBrandSizing(
  brandName: string,
sizingData: Partial<FlamingoBrandSizing>): Promise<FlamingoBrandSizing> {
    const response = await api.put(`${this.baseUrl}/brand-sizings/${encodeURIComponent(brandName)}`, sizingData);
    return response.data;
  }

  // User Measurements
  async getMeasurements(
  userId: string): Promise<FlamingoMeasurements | null> {
    try {
      const response = await api.get(`${this.baseUrl}/measurements/${userId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async saveMeasurements(
  userId: string,
measurements: Partial<FlamingoMeasurements>): Promise<FlamingoMeasurements> {
    const response = await api.post(`${this.baseUrl}/measurements/${userId}`, measurements);
    return response.data;
  }

  async updateMeasurements(
  userId: string,
measurements: Partial<FlamingoMeasurements>): Promise<FlamingoMeasurements> {
    const response = await api.put(`${this.baseUrl}/measurements/${userId}`, measurements);
    return response.data;
  }

  // Size Recommendations
  async getSizeRecommendations(
  userId: string, params?: { brand_name?: string; category_id?: string }): Promise<FlamingoSizeRecommendation[]> {
    const response = await api.get(`${this.baseUrl}/users/${userId}/recommendations`, { params });
    return response.data;
  }

  async getSizeRecommendation(
  userId: string,
brandName: string,
categoryId: string): Promise<FlamingoSizeRecommendation | null> {
    try {
      const response = await api.get(`${this.baseUrl}/users/${userId}/recommendations/${encodeURIComponent(brandName)}/${categoryId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async submitFeedback(
  recommendationId: string,
feedback: 'perfect' | 'too_small' | 'too_large' | 'not_tried'): Promise<void> {
    await api.post(`${this.baseUrl}/recommendations/${recommendationId}/feedback`, { feedback });
  }

  // Outfits
  async getOutfits(
  userId: string, params?: { is_public?: boolean; is_favorite?: boolean; occasion?: string }): Promise<FlamingoOutfit[]> {
    const response = await api.get(`${this.baseUrl}/users/${userId}/outfits`, { params });
    return response.data;
  }

  async getOutfit(
  outfitId: string): Promise<FlamingoOutfit> {
    const response = await api.get(`${this.baseUrl}/outfits/${outfitId}`);
    return response.data;
  }

  async createOutfit(
  outfitData: Partial<FlamingoOutfit>): Promise<FlamingoOutfit> {
    const response = await api.post(`${this.baseUrl}/outfits`, outfitData);
    return response.data;
  }

  async updateOutfit(
  outfitId: string,
outfitData: Partial<FlamingoOutfit>): Promise<FlamingoOutfit> {
    const response = await api.put(`${this.baseUrl}/outfits/${outfitId}`, outfitData);
    return response.data;
  }

  async deleteOutfit(
  outfitId: string): Promise<void> {
    await api.delete(`${this.baseUrl}/outfits/${outfitId}`);
  }

  // Outfit Items
  async addOutfitItem(
  outfitId: string,
itemData: Partial<FlamingoOutfitItem>): Promise<FlamingoOutfitItem> {
    const response = await api.post(`${this.baseUrl}/outfits/${outfitId}/items`, itemData);
    return response.data;
  }

  async updateOutfitItem(
  itemId: string,
itemData: Partial<FlamingoOutfitItem>): Promise<FlamingoOutfitItem> {
    const response = await api.put(`${this.baseUrl}/outfit-items/${itemId}`, itemData);
    return response.data;
  }

  async removeOutfitItem(
  itemId: string): Promise<void> {
    await api.delete(`${this.baseUrl}/outfit-items/${itemId}`);
  }

  // Public Outfits Discovery
  async getPublicOutfits(params?: { limit?: number; offset?: number; occasion?: string; season?: string }): Promise<{outfits: FlamingoOutfit[];
  total: number }> {
    const response = await api.get(`${this.baseUrl}/public-outfits`, { params });
    return response.data;
  }

  // Like/Save Outfit
  async likeOutfit(
  outfitId: string): Promise<void> {
    await api.post(`${this.baseUrl}/outfits/${outfitId}/like`);
  }

  async saveOutfit(
  outfitId: string): Promise<void> {
    await api.post(`${this.baseUrl}/outfits/${outfitId}/save`);
  }
}

export const flamingoService = new FlamingoService();
