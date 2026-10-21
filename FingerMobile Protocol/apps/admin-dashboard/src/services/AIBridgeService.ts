import api from './api';

export interface PromptRequest {
  prompt: string;
  apiKey?: string;
  targetEngine?: 'guardian' | 'gemini';
  context?: string;
  targetPlatform?: string;
}

export interface PromptResponse {
  result: string;
  actionTaken: string;
  success: boolean;
  targetEngine?: 'guardian' | 'gemini';
  timestamp: string;
}

export const AIBridgeService = {
  async executePrompt(data: PromptRequest): Promise<PromptResponse> {
    try {
      const response: any = await api.post('/master-dashboard/ai-bridge', data);
      return response.data;
    } catch (error) {
      console.error('AI Bridge prompt execution failed:', error);
      throw error;
    }
  },
  
  async getPromptHistory(): Promise<any[]> {
    try {
      const response: any = await api.get('/master-dashboard/health');
      return response.data.history || [];
    } catch (error) {
      console.error('Failed to get prompt history', error);
      return [];
    }
  }
};
