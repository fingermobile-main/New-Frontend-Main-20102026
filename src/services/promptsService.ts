import React, {} from 'react';
import { api } from './api';
import { logError, ErrorType } from '../utils/errorLogger';

// promptsService.ts
// Service for PROMPTS Threat Analyzer: AI-powered prompt threat detection

export interface PromptAnalysis {
  analysis_id: string;
  timestamp: string;
  threats_found: any[];
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  countermeasures: string[];
  recommendations: string[];
}

// Alias for backward compatibility
export type ThreatAnalysis = PromptAnalysis;

export interface ThreatPattern {
  id: string;
  type: string;
  severity: string;
  description?: string;
  countermeasures: string[];
}

export interface Countermeasure {
  threat_type: string;
  actions: string[];
  priority: string;
}

export class PromptsService {
  /**
   * Analyze prompt for threats using Python PROMPTS backend
   */
  async analyzePrompt(promptData: any, context?: unknown): Promise<PromptAnalysis> {
    try {
      const response = await api.post('/prompts/analyze', {
        promptData,
        context
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Analysis failed');
      }

      return response.data.data;
    } catch (error: any) {
      logError(error, ErrorType.AUTH_ERROR, {context: 'PromptsService.analyzePrompt'});
      throw error;
    }
  }

  /**
   * Get threat patterns database
   */
  async getThreatPatterns(): Promise<ThreatPattern[]> {
    try {
      const response = await api.get('/prompts/threat-patterns');

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to get threat patterns');
      }

      return response.data.data;
    } catch (error: any) {
      logError(error, ErrorType.AUTH_ERROR, {context: 'PromptsService.getThreatPatterns'});
      throw error;
    }
  }

  /**
   * Get countermeasures for specific threat type
   */
  async getCountermeasures(threatType: string): Promise<Countermeasure> {
    try {
      const response = await api.get(`/prompts/countermeasures/${threatType}`);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to get countermeasures');
      }

      return response.data.data;
    } catch (error: any) {
      logError(error, ErrorType.AUTH_ERROR, {context: 'PromptsService.getCountermeasures'});
      throw error;
    }
  }

  /**
   * Get analyzed threats history
   */
  async getAnalyzedThreats(limit: number = 50): Promise<any[]> {
    try {
      const response = await api.get(`/prompts/analyzed-threats?limit=${limit}`);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to get analyzed threats');
      }

      return response.data.data;
    } catch (error: any) {
      logError(error, ErrorType.AUTH_ERROR, {context: 'PromptsService.getAnalyzedThreats'});
      throw error;
    }
  }

  /**
   * Mitigate identified threat
   */
  async mitigateThreat(threatId: string, action: string): Promise<unknown> {
    try {
      const response = await api.post(`/prompts/mitigate/${threatId}`, { action });
      return response.data;
    } catch (error: any) {
      logError(error, ErrorType.AUTH_ERROR, {context: 'PromptsService.mitigateThreat'});
      throw error;
    }
  }
}

export default new PromptsService();
