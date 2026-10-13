/**
 * ==============================================================================
 * FingerMobile Protocol - Plunk Email Service Integration
 * ==============================================================================
 * Headless Email Platform Integration (Alternative to Resend / SendGrid)
 * Supports Self-Hosted Plunk (via Docker Compose) and Plunk Cloud API.
 * ==============================================================================
 */

export interface PlunkSendOptions {
  to: string | string[];
  subject: string;
  body: string; // Markdown or HTML
  name?: string;
  from?: string;
  reply?: string;
  subscribed?: boolean;
  data?: Record<string, any>;
  headers?: Record<string, string>;
}

export interface PlunkTrackEventOptions {
  event: string;
  email: string;
  data?: Record<string, any>;
}

export interface PlunkContactOptions {
  email: string;
  subscribed?: boolean;
  data?: Record<string, any>;
}

export interface PlunkSendResponse {
  success: boolean;
  id?: string;
  timestamp?: string;
  error?: string;
}

export class PlunkEmailService {
  private apiUrl: string;
  private apiKey: string;
  private defaultFrom: string;
  private defaultFromName: string;

  constructor() {
    this.apiUrl = (process.env.PLUNK_API_URL || 'http://localhost:9000').replace(/\/+$/, '');
    this.apiKey = process.env.PLUNK_API_KEY || 'pk_test_fingermobile_plunk_key';
    this.defaultFrom = process.env.EMAIL_FROM || 'notifications@fingermobile.com';
    this.defaultFromName = process.env.EMAIL_FROM_NAME || 'FingerMobile Protocol';
  }

  /**
   * Send a transactional or broadcast email via Plunk REST API
   * POST /v1/send
   */
  async sendEmail(options: PlunkSendOptions): Promise<PlunkSendResponse> {
    try {
      const endpoint = `${this.apiUrl}/v1/send`;
      const payload = {
        to: Array.isArray(options.to) ? options.to[0] : options.to,
        subject: options.subject,
        body: options.body,
        name: options.name || this.defaultFromName,
        from: options.from || this.defaultFrom,
        subscribed: options.subscribed !== false,
        data: options.data || {},
        headers: {
          'X-Entity-Ref-ID': `fmp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          'List-Unsubscribe': `<mailto:unsubscribe@fingermobile.com>, <https://fingermobile.com/unsubscribe>`,
          ...(options.headers || {})
        }
      };

      // Call Plunk REST API with Authorization Bearer
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[PlunkEmailService] HTTP ${response.status} from Plunk:`, errorText);
        
        // Return structured error response rather than crashing
        return {
          success: false,
          error: `Plunk API Error (${response.status}): ${errorText}`
        };
      }

      const data = await response.json().catch(() => ({}));
      return {
        success: true,
        id: data.id || `plunk_${Date.now()}`,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('[PlunkEmailService] Network or dispatch error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Trigger an automated event workflow in Plunk
   * POST /v1/track
   */
  async trackEvent(options: PlunkTrackEventOptions): Promise<{ success: boolean; error?: string }> {
    try {
      const endpoint = `${this.apiUrl}/v1/track`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(options)
      });

      if (!response.ok) {
        const err = await response.text();
        return { success: false, error: err };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Create or update contact in Plunk
   * POST /v1/contacts
   */
  async syncContact(options: PlunkContactOptions): Promise<{ success: boolean; contact?: any; error?: string }> {
    try {
      const endpoint = `${this.apiUrl}/v1/contacts`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          email: options.email,
          subscribed: options.subscribed !== false,
          data: options.data || {}
        })
      });

      if (!response.ok) {
        const err = await response.text();
        return { success: false, error: err };
      }

      const resData = await response.json().catch(() => ({}));
      return { success: true, contact: resData };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Check connection and health of Plunk server
   */
  async getHealthStatus(): Promise<{ online: boolean; mode: string; url: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(`${this.apiUrl}/health`, {
        signal: controller.signal
      }).catch(() => null);
      
      clearTimeout(timeoutId);

      const isOnline = response ? response.ok : false;
      return {
        online: isOnline,
        mode: this.apiUrl.includes('localhost') || this.apiUrl.includes('127.0.0.1') ? 'self-hosted' : 'cloud',
        url: this.apiUrl
      };
    } catch {
      return {
        online: false,
        mode: 'self-hosted',
        url: this.apiUrl
      };
    }
  }
}

export const plunkEmailService = new PlunkEmailService();
