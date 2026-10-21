import api from './api';

export const MasterDashboardService = {
  async getOverview() {
    try {
      const response: any = await api.get('/master-dashboard/overview');
      return response.data;
    } catch (error) {
      console.error('Failed to get MasterDashboard overview:', error);
      throw error;
    }
  },

  async getWorkspaces() {
    try {
      const response: any = await api.get('/master-dashboard/workspaces');
      return response.data;
    } catch (error) {
      console.error('Failed to get workspaces:', error);
      throw error;
    }
  },

  async getTopContent() {
    try {
      const response: any = await api.get('/master-dashboard/content/top');
      return response.data;
    } catch (error) {
      console.error('Failed to get top content:', error);
      throw error;
    }
  },

  async getHealth() {
    try {
      const response: any = await api.get('/master-dashboard/health');
      return response.data;
    } catch (error) {
      console.error('Failed to get system health:', error);
      throw error;
    }
  }
};
