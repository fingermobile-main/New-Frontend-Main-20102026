import React, {} from 'react';
/**
 * SEADS Service - Sustainable Energy and Development Solutions
 * Handles green energy projects, carbon credits, and sustainability tracking
 */

import { api } from './api';

export interface EnergyProject {id: string; name: string;
  description?: string;
  type: 'solar' | 'wind' | 'hydro' | 'biomass';
  location: string;
  capacity_kw: number;
  status: 'planning' | 'active' | 'completed';
  carbon_offset_tons: number;
  created_at: string;
}

export interface CarbonCredit {id: string; project_id: string;
  amount_tons: number;
  price_per_ton: number;
  status: 'available' | 'sold' | 'retired';
  verified_by: string;
  verification_date: string;
}

export interface SustainabilityMetric {member_id: string; energy_saved_kwh: number;
  carbon_reduced_tons: number;
  trees_planted: number;
  waste_recycled_kg: number;
  period: string;
}

export interface GreenInitiative {id: string; title: string;
  description?: string;
  category: string;
  impact_score: number;
  participants_count: number;
  start_date: string;
  end_date: string;
}

class SeadsService {
  private baseUrl = '/api/seads';

  async getProjects(type?: string): Promise<EnergyProject[]> {
    const response = await api.get(`${this.baseUrl}/projects`, {params: { type }
    });
    return response.data;
  }

  async getProject(projectId: string): Promise<EnergyProject> {
    const response = await api.get(`${this.baseUrl}/projects/${projectId}`);
    return response.data;
  }

  async createProject(project: Partial<EnergyProject>): Promise<EnergyProject> {
    const response = await api.post(`${this.baseUrl}/projects`, project);
    return response.data;
  }

  async getCarbonCredits(availableOnly = false): Promise<CarbonCredit[]> {
    const response = await api.get(`${this.baseUrl}/carbon-credits`, {params: {
  available: availableOnly }
    });
    return response.data;
  }

  async purchaseCarbonCredit(creditId: string,
quantity: number): Promise<void> {
    await api.post(`${this.baseUrl}/carbon-credits/${creditId}/purchase`, { quantity });
  }

  async trackSustainability(metrics: Partial<SustainabilityMetric>): Promise<SustainabilityMetric> {
    const response = await api.post(`${this.baseUrl}/sustainability/track`, metrics);
    return response.data;
  }

  async getMyMetrics(): Promise<SustainabilityMetric[]> {
    const response = await api.get(`${this.baseUrl}/sustainability/my-metrics`);
    return response.data;
  }

  async getInitiatives(category?: string): Promise<GreenInitiative[]> {
    const response = await api.get(`${this.baseUrl}/initiatives`, {params: { category }
    });
    return response.data;
  }

  async joinInitiative(initiativeId: string): Promise<void> {
    await api.post(`${this.baseUrl}/initiatives/${initiativeId}/join`);
  }

  async getImpactDashboard(): Promise<{total_projects: number; total_carbon_offset: number;
  total_participants: number;
  energy_generated_kwh: number;
  }> {
    const response = await api.get(`${this.baseUrl}/impact-dashboard`);
    return response.data;
  }
}

export const seadsService = new SeadsService();
