/**
 * Connector & Live Artifact Lifecycle Service
 * Provides client-side access to Account & Discovery, Schema & Mapping,
 * Data Ingestion, Auth & Links, and Action write execution tools.
 * FingerMobile Protocol™ - October 2026
 */

import { api } from './api';

export interface Connector {
  id: string;
  name: string;
  category: 'marketing' | 'sales' | 'payment' | 'web3' | 'security' | 'governance' | 'media' | 'database';
  icon?: string;
  status: 'connected' | 'requires_auth' | 'expired';
  auth_type: string;
  permissions: string[];
  attached_accounts_count: number;
  live_accounts_count?: number;
  last_synced_at?: string;
}

export interface ConnectorAccount {
  id: string;
  connector_id: string;
  connector_name?: string;
  account_name: string;
  external_account_id: string;
  status: 'active' | 'inactive' | 'pending';
  currency: string;
  timezone: string;
  permissions?: string[];
}

export interface ConnectorField {
  id: string;
  name: string;
  type: 'string' | 'integer' | 'currency' | 'percentage' | 'date' | 'timestamp' | 'boolean' | 'seconds';
  description: string;
}

export interface ConnectorSchema {
  connector: string;
  dimensions: ConnectorField[];
  metrics: ConnectorField[];
  all_fields: ConnectorField[];
}

export interface ConnectorOptions {
  connector: string;
  account: string;
  options: {
    date_filter_columns?: string[];
    attribution_windows?: string[];
    supported_breakdowns?: string[];
    currencies?: string[];
    tables?: string[];
    [key: string]: any;
  };
}

export interface ConnectorDataQuery {
  connector: string;
  accounts?: string[];
  date_from?: string;
  date_to?: string;
  fields?: string[];
  filters?: Record<string, any>;
}

export interface ConnectorDataResponse {
  success: boolean;
  connector: string;
  date_range: { date_from: string; date_to: string };
  data: Record<string, any>[];
  rows_count: number;
}

export interface ConnectorAction {
  id: string;
  name: string;
  description: string;
  connector?: string;
  parameters: Record<string, { type: string; description: string; required?: boolean; enum?: string[] }>;
}

export interface RunActionResponse {
  success: boolean;
  message?: string;
  require_confirmation?: boolean;
  confirmation_prompt?: string;
  result?: any;
  log?: any;
}

export class ConnectorArtifactService {
  /**
   * 1. get_connectors: Lists all integrated connectors & permissions
   */
  async getConnectors(): Promise<Connector[]> {
    const res = await api.get('/connectors');
    return res.data?.data || res.data?.connectors || [];
  }

  /**
   * 2. get_accounts: Retrieves directory sheet of linked accounts
   */
  async getAccounts(connectorId?: string): Promise<ConnectorAccount[]> {
    const res = await api.get('/connectors/accounts', {
      params: connectorId ? { connector: connectorId } : {}
    });
    return res.data?.data || res.data?.accounts || [];
  }

  /**
   * 3. get_current_user: Quick sanity check on authenticated user & tier limits
   */
  async getCurrentUser(): Promise<any> {
    const res = await api.get('/connectors/user');
    return res.data?.data || null;
  }

  /**
   * 4. get_fields: Returns schema differentiating metrics vs dimensions
   */
  async getFields(connectorId: string): Promise<ConnectorSchema> {
    const res = await api.get('/connectors/fields', {
      params: { connector: connectorId }
    });
    return res.data || { connector: connectorId, dimensions: [], metrics: [], all_fields: [] };
  }

  /**
   * 5. get_options: Discovers valid date-filter columns & platform variables
   */
  async getOptions(connectorId: string, accountId?: string): Promise<ConnectorOptions> {
    const res = await api.get('/connectors/options', {
      params: { connector: connectorId, account: accountId }
    });
    return res.data || { connector: connectorId, account: accountId || 'default', options: {} };
  }

  /**
   * 6. get_data: Runs targeted query against connector
   */
  async getData(query: ConnectorDataQuery): Promise<ConnectorDataResponse> {
    const res = await api.post('/connectors/data', query);
    return res.data || { success: false, connector: query.connector, date_range: { date_from: '', date_to: '' }, data: [], rows_count: 0 };
  }

  /**
   * 7. get_connector_authorization_url: Generates OAuth connect link
   */
  async getConnectorAuthorizationUrl(connectorId: string): Promise<string> {
    const res = await api.get('/connectors/auth-url', {
      params: { connector: connectorId }
    });
    return res.data?.authorization_url || '';
  }

  /**
   * 8. get_connector_connect_info: Manual developer instructions and connect link
   */
  async getConnectorConnectInfo(connectorId: string): Promise<any> {
    const res = await api.get('/connectors/connect-info', {
      params: { connector: connectorId }
    });
    return res.data?.data || null;
  }

  /**
   * 9. get_subscription_url: Link to manage or upgrade API billing plan
   */
  async getSubscriptionUrl(): Promise<{ subscription_url: string; markdown_link: string }> {
    const res = await api.get('/connectors/subscription-url');
    return {
      subscription_url: res.data?.subscription_url || '',
      markdown_link: res.data?.markdown_link || ''
    };
  }

  /**
   * 10. list_actions: List available write operations matching JSON schema
   */
  async listActions(connectorId?: string): Promise<ConnectorAction[]> {
    const res = await api.get('/connectors/actions', {
      params: connectorId ? { connector: connectorId } : {}
    });
    return res.data?.actions || [];
  }

  /**
   * 11. run_action: Execute state change or write operation with confirmation
   */
  async runAction(
    connector: string,
    actionName: string,
    payload: Record<string, any> = {},
    confirmed: boolean = false
  ): Promise<RunActionResponse> {
    const res = await api.post('/connectors/action', {
      connector,
      action_name: actionName,
      payload,
      confirmed
    });
    return res.data;
  }

  /**
   * 12. get_action_logs: Retrieve audit history of executed actions
   */
  async getActionLogs(limit: number = 25): Promise<any[]> {
    const res = await api.get('/connectors/action-logs', {
      params: { limit }
    });
    return res.data?.logs || [];
  }
}

export const connectorArtifactService = new ConnectorArtifactService();
export default connectorArtifactService;
