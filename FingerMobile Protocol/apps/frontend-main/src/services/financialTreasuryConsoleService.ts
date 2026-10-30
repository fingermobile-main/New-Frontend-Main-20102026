import { api } from './api';
import {
  FinancialTreasuryDomain,
  FinancialTreasuryItem,
  FinancialTreasuryOverview,
  FinancialSpawnedConsole,
  CreateFinancialItemPayload,
  ReorderEntry
} from '../types/financialTreasuryConsole';

export const financialTreasuryConsoleService = {
  /**
   * Fetch overarching financial & treasury overview metrics
   */
  async getOverview(): Promise<FinancialTreasuryOverview> {
    const response = await api.get('/financial-treasury-console/overview');
    return response.data.data;
  },

  /**
   * Fetch financial items (optionally filtered by domain)
   */
  async getItems(domain?: FinancialTreasuryDomain | 'all'): Promise<FinancialTreasuryItem[]> {
    const params = domain && domain !== 'all' ? { domain } : {};
    const response = await api.get('/financial-treasury-console/items', { params });
    return response.data.data || [];
  },

  /**
   * Create a new financial ledger item, escrow, fee rule, or prize pool
   */
  async createItem(payload: CreateFinancialItemPayload): Promise<FinancialTreasuryItem> {
    const response = await api.post('/financial-treasury-console/items', payload);
    return response.data.data;
  },

  /**
   * Update an existing financial console item
   */
  async updateItem(id: string, payload: Partial<FinancialTreasuryItem>): Promise<FinancialTreasuryItem> {
    const response = await api.put(`/financial-treasury-console/items/${id}`, payload);
    return response.data.data;
  },

  /**
   * Toggle freeze / unfreeze status on a financial item
   */
  async toggleFreeze(id: string): Promise<FinancialTreasuryItem> {
    const response = await api.patch(`/financial-treasury-console/items/${id}/freeze`);
    return response.data.data;
  },

  /**
   * Reorder financial items atomically in PostgreSQL
   */
  async reorderItems(orders: ReorderEntry[]): Promise<void> {
    await api.post('/financial-treasury-console/reorder', { orders });
  },

  /**
   * Purge an item from the console
   */
  async deleteItem(id: string): Promise<void> {
    await api.delete(`/financial-treasury-console/items/${id}`);
  },

  /**
   * Multipart upload for audited invoices, tournament deeds, regulatory forms
   */
  async uploadMedia(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{ url: string; filename: string; originalName: string; size: number }> {
    const formData = new FormData();
    formData.append('media', file);

    const response = await api.post('/financial-treasury-console/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      }
    });

    return response.data.data;
  },

  /**
   * Spawn a new dedicated sub-console with one click
   */
  async spawnConsole(data: {
    console_title: string;
    target_domain: string;
    icon_name?: string;
    badge_text?: string;
    route?: string;
    config?: Record<string, any>;
  }): Promise<FinancialSpawnedConsole> {
    const response = await api.post('/financial-treasury-console/spawns', data);
    return response.data.data;
  },

  /**
   * Retrieve all dynamically spawned financial consoles
   */
  async getSpawns(): Promise<FinancialSpawnedConsole[]> {
    const response = await api.get('/financial-treasury-console/spawns');
    return response.data.data || [];
  },

  /**
   * Dynamic Platform Pricing, Values & FIC Rates Governance
   */
  async getPricingRules(): Promise<{ rules: import('../types/financialTreasuryConsole').PlatformPricingRule[]; auditLogs: import('../types/financialTreasuryConsole').PlatformPricingAuditLog[] }> {
    const response = await api.get('/financial-treasury-console/pricing-rules');
    return response.data.data;
  },

  async updatePricingRule(
    id: string,
    payload: Partial<import('../types/financialTreasuryConsole').PlatformPricingRule> & { reason?: string; updated_by?: string }
  ): Promise<import('../types/financialTreasuryConsole').PlatformPricingRule> {
    const response = await api.put(`/financial-treasury-console/pricing-rules/${id}`, payload);
    return response.data.data;
  },

  async createPricingRule(
    payload: Partial<import('../types/financialTreasuryConsole').PlatformPricingRule>
  ): Promise<import('../types/financialTreasuryConsole').PlatformPricingRule> {
    const response = await api.post('/financial-treasury-console/pricing-rules', payload);
    return response.data.data;
  },

  async deletePricingRule(id: string): Promise<void> {
    await api.delete(`/financial-treasury-console/pricing-rules/${id}`);
  }
};
