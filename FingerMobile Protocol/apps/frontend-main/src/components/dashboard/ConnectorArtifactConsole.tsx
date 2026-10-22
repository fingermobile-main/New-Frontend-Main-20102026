import React, { useState, useEffect } from 'react';
import {
  Database,
  BarChart3,
  ShieldCheck,
  Coins,
  Video,
  Megaphone,
  Landmark,
  CreditCard,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Play,
  Sliders,
  Filter,
  Calendar,
  Layers,
  Key,
  HelpCircle,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Terminal,
  Activity,
  User,
  Zap,
  Lock,
  ArrowUpRight,
  Clock,
  Sparkles
} from 'lucide-react';
import connectorArtifactService, {
  Connector,
  ConnectorAccount,
  ConnectorField,
  ConnectorSchema,
  ConnectorOptions,
  ConnectorAction,
  RunActionResponse
} from '../../services/connectorArtifactService';

export const ConnectorArtifactConsole: React.FC = () => {
  // Navigation sub-tabs within Console
  const [activeView, setActiveView] = useState<'discovery' | 'schema' | 'ingestion' | 'actions' | 'audit'>('discovery');

  // 1. Account & Discovery state
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [accounts, setAccounts] = useState<ConnectorAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedConnector, setSelectedConnector] = useState<string>('meta_ads');
  const [selectedAccount, setSelectedAccount] = useState<string>('');

  // 2. Schema & Mapping state
  const [schema, setSchema] = useState<ConnectorSchema | null>(null);
  const [options, setOptions] = useState<ConnectorOptions | null>(null);

  // 3. Data Ingestion state
  const [dateFrom, setDateFrom] = useState<string>('2026-10-01');
  const [dateTo, setDateTo] = useState<string>('2026-10-09');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [queryResult, setQueryResult] = useState<any[]>([]);
  const [queryLoading, setQueryLoading] = useState<boolean>(false);

  // 4. Actions & Execution state
  const [actions, setActions] = useState<ConnectorAction[]>([]);
  const [selectedAction, setSelectedAction] = useState<ConnectorAction | null>(null);
  const [actionPayload, setActionPayload] = useState<Record<string, any>>({});
  const [actionModalOpen, setActionModalOpen] = useState<boolean>(false);
  const [actionExecuting, setActionExecuting] = useState<boolean>(false);
  const [actionResult, setActionResult] = useState<RunActionResponse | null>(null);
  const [actionLogs, setActionLogs] = useState<any[]>([]);

  // 5. Auth & Connect info modal state
  const [authModalConnector, setAuthModalConnector] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string>('');
  const [connectInfo, setConnectInfo] = useState<any>(null);
  const [subscriptionUrl, setSubscriptionUrl] = useState<string>('');

  // General loading & feedback
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  // When connector changes, refresh schema & options & actions
  useEffect(() => {
    if (selectedConnector) {
      loadConnectorDetails(selectedConnector);
    }
  }, [selectedConnector]);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [connList, accList, userProf, subInfo, logsList] = await Promise.all([
        connectorArtifactService.getConnectors(),
        connectorArtifactService.getAccounts(),
        connectorArtifactService.getCurrentUser(),
        connectorArtifactService.getSubscriptionUrl(),
        connectorArtifactService.getActionLogs(15)
      ]);

      setConnectors(connList);
      setAccounts(accList);
      setCurrentUser(userProf);
      setSubscriptionUrl(subInfo.subscription_url);
      setActionLogs(logsList);

      if (connList.length > 0 && !selectedConnector) {
        setSelectedConnector(connList[0].id);
      }
    } catch (err: any) {
      showNotification('error', `Failed to load connector infrastructure: ${err.message || 'Network error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadConnectorDetails = async (connId: string) => {
    try {
      const [fieldsRes, optsRes, actsRes] = await Promise.all([
        connectorArtifactService.getFields(connId),
        connectorArtifactService.getOptions(connId),
        connectorArtifactService.listActions(connId)
      ]);

      setSchema(fieldsRes);
      setOptions(optsRes);
      setActions(actsRes);

      // Pre-select top metrics & dimensions
      const defaultFieldSelection = [
        ...fieldsRes.dimensions.slice(0, 2).map((d: ConnectorField) => d.id),
        ...fieldsRes.metrics.slice(0, 3).map((m: ConnectorField) => m.id)
      ];
      setSelectedFields(defaultFieldSelection);

      // Automatically trigger initial data ingestion for selected connector
      runDataIngestion(connId, defaultFieldSelection);
    } catch (err: any) {
      showNotification('error', `Error loading schema for ${connId}: ${err.message || 'Not found'}`);
    }
  };

  const runDataIngestion = async (connId = selectedConnector, fields = selectedFields) => {
    setQueryLoading(true);
    try {
      const res = await connectorArtifactService.getData({
        connector: connId,
        accounts: selectedAccount ? [selectedAccount] : [],
        date_from: dateFrom,
        date_to: dateTo,
        fields: fields.length > 0 ? fields : undefined
      });

      setQueryResult(res.data || []);
      showNotification('success', `Retrieved ${res.rows_count || res.data?.length || 0} live data rows from ${connId}`);
    } catch (err: any) {
      showNotification('error', `Query execution failed: ${err.message || 'Connector query timeout'}`);
    } finally {
      setQueryLoading(false);
    }
  };

  const handleOpenAuthModal = async (connId: string) => {
    setAuthModalConnector(connId);
    try {
      const [url, info] = await Promise.all([
        connectorArtifactService.getConnectorAuthorizationUrl(connId),
        connectorArtifactService.getConnectorConnectInfo(connId)
      ]);
      setAuthUrl(url);
      setConnectInfo(info);
    } catch (err: any) {
      showNotification('error', `Failed to retrieve auth details for ${connId}`);
    }
  };

  const handleOpenActionModal = (action: ConnectorAction) => {
    setSelectedAction(action);
    // Initialize default payload based on parameters
    const initialPayload: Record<string, any> = {};
    if (action.parameters) {
      Object.entries(action.parameters).forEach(([key, param]: [string, any]) => {
        if (param.enum && param.enum.length > 0) {
          initialPayload[key] = param.enum[0];
        } else if (param.type === 'number') {
          initialPayload[key] = 100;
        } else if (key === 'user_id') {
          initialPayload[key] = '1';
        } else if (key === 'ip_address') {
          initialPayload[key] = '198.51.100.24';
        } else {
          initialPayload[key] = '';
        }
      });
    }
    setActionPayload(initialPayload);
    setActionResult(null);
    setActionModalOpen(true);
  };

  const handleExecuteActionConfirmed = async () => {
    if (!selectedAction) return;

    setActionExecuting(true);
    try {
      // Step 1: Intentionally verify prompt if safety check triggered
      const res = await connectorArtifactService.runAction(
        selectedAction.connector || selectedConnector,
        selectedAction.id,
        actionPayload,
        true // confirmed = true
      );

      setActionResult(res);
      showNotification('success', `Action '${selectedAction.name}' executed successfully!`);
      // Refresh audit logs
      const updatedLogs = await connectorArtifactService.getActionLogs(15);
      setActionLogs(updatedLogs);
    } catch (err: any) {
      showNotification('error', `Execution failed: ${err.message || 'Write operation rejected'}`);
    } finally {
      setActionExecuting(false);
    }
  };

  const getConnectorIcon = (category: string) => {
    switch (category) {
      case 'marketing':
        return <Megaphone className="w-5 h-5 text-pink-400" />;
      case 'analytics':
        return <BarChart3 className="w-5 h-5 text-blue-400" />;
      case 'payment':
        return <CreditCard className="w-5 h-5 text-emerald-400" />;
      case 'web3':
        return <Coins className="w-5 h-5 text-amber-400" />;
      case 'security':
        return <ShieldCheck className="w-5 h-5 text-red-400" />;
      case 'governance':
        return <Landmark className="w-5 h-5 text-purple-400" />;
      case 'media':
        return <Video className="w-5 h-5 text-cyan-400" />;
      case 'database':
      default:
        return <Database className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              : notification.type === 'error'
              ? 'bg-red-950/80 border-red-500/50 text-red-200'
              : 'bg-blue-950/80 border-blue-500/50 text-blue-200'
          }`}
        >
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {notification.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-400" />}
          {notification.type === 'info' && <Activity className="w-5 h-5 text-blue-400" />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Top Banner & User Quota Bar (get_current_user & get_subscription_url) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 border border-indigo-500/40 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Live Lifecycle Engine
              </span>
              <span className="px-3 py-1 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                8 Active Connectors
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-2 tracking-tight">
              Connector & Live Artifact Workbench
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              End-to-end management for Windsor/MCP-compliant reading, discovery, schema inspection, multi-dimensional ingestion, and safe action execution.
            </p>
          </div>

          {/* User Profile & Plan Badge */}
          {currentUser && (
            <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur-md border border-slate-700/60 rounded-xl p-3 shadow-inner">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold">
                <User className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{currentUser.username}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {currentUser.plan}
                  </span>
                </div>
                <div className="text-slate-300 font-medium mt-0.5">
                  Queries: <span className="text-emerald-400 font-mono font-medium">{currentUser.quotas?.monthly_data_queries_used}</span> / {currentUser.quotas?.monthly_data_queries_max}
                </div>
              </div>
              <a
                href={subscriptionUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="ml-2 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1 shadow-md shadow-indigo-600/30"
              >
                <span>Upgrade</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* View Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-800/80">
          {[
            { id: 'discovery', label: '1. Account & Discovery', icon: Layers, count: connectors.length },
            { id: 'schema', label: '2. Schema & Mapping', icon: Sliders, count: schema?.all_fields?.length },
            { id: 'ingestion', label: '3. Data Ingestion', icon: BarChart3, count: queryResult.length },
            { id: 'actions', label: '4. Action Tools (Write)', icon: Play, count: actions.length },
            { id: 'audit', label: '5. Action Audit Logs', icon: Terminal, count: actionLogs.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Connector Switcher Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-300 whitespace-nowrap">Active Connector:</span>
          <select
            value={selectedConnector}
            onChange={e => setSelectedConnector(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full md:w-64"
          >
            {connectors.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.category})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => loadInitialData()}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync All Connectors</span>
          </button>
          <button
            onClick={() => handleOpenAuthModal(selectedConnector)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Manage Auth & Links</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Account & Discovery (get_connectors & get_accounts) */}
      {activeView === 'discovery' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {connectors.map(conn => {
              const isSelected = selectedConnector === conn.id;
              const connAccounts = accounts.filter(a => a.connector_id === conn.id);
              return (
                <div
                  key={conn.id}
                  onClick={() => setSelectedConnector(conn.id)}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-gradient-to-b from-indigo-950/70 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-950/50'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/60 shadow-md">
                      {getConnectorIcon(conn.category)}
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {conn.status}
                    </span>
                  </div>

                  <h3 className="font-semibold text-white text-sm mt-3 group-hover:text-indigo-300 transition-colors">
                    {conn.name}
                  </h3>
                  <div className="text-xs text-slate-300 font-medium mt-1 flex items-center justify-between">
                    <span className="capitalize">{conn.category}</span>
                    <span className="font-mono text-[11px] text-slate-300">{conn.auth_type}</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Linked Accounts:</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-indigo-300 font-semibold text-[11px]">
                      {connAccounts.length}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {conn.permissions.slice(0, 2).map((perm, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 font-medium border border-slate-700/40">
                        {perm}
                      </span>
                    ))}
                    {conn.permissions.length > 2 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 font-medium">
                        +{conn.permissions.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Directory Sheet of Linked Accounts (get_accounts) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Linked Account Directory Sheet (get_accounts)
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Filtered by active connector: <span className="text-indigo-400 font-medium">{selectedConnector}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedAccount('')}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  !selectedAccount
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800 text-slate-300 font-medium border-slate-700 hover:text-white'
                }`}
              >
                Show All Accounts ({accounts.length})
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/60 text-slate-200 border-b border-slate-800 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Account ID</th>
                    <th className="px-5 py-3.5">Account Name</th>
                    <th className="px-5 py-3.5">External ID</th>
                    <th className="px-5 py-3.5">Currency</th>
                    <th className="px-5 py-3.5">Timezone</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {accounts
                    .filter(a => !selectedConnector || a.connector_id === selectedConnector || !selectedAccount)
                    .map(acc => (
                      <tr
                        key={acc.id}
                        className={`hover:bg-slate-800/40 transition-colors ${
                          selectedAccount === acc.id ? 'bg-indigo-950/40' : ''
                        }`}
                      >
                        <td className="px-5 py-3 font-mono text-indigo-300 font-semibold">{acc.id}</td>
                        <td className="px-5 py-3 text-white font-medium">{acc.account_name}</td>
                        <td className="px-5 py-3 font-mono text-slate-300 text-[11px]">{acc.external_account_id}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                            {acc.currency}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-300 font-medium">{acc.timezone}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {acc.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedAccount(acc.id);
                              setActiveView('ingestion');
                              showNotification('info', `Filtering queries for account ${acc.account_name}`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs transition-colors"
                          >
                            Query Data
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Schema & Mapping Tools (get_fields & get_options) */}
      {activeView === 'schema' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  Schema & Mapping Inspector (get_fields & get_options)
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Distinguishing <span className="text-emerald-400 font-medium">Metrics</span> (numeric/percentage aggregates) vs{' '}
                  <span className="text-blue-400 font-medium">Dimensions</span> (breakdown criteria) for {selectedConnector}.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-medium">Total Fields:</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-mono font-semibold text-xs">
                  {schema?.all_fields?.length || 0}
                </span>
              </div>
            </div>

            {/* Split View: Dimensions vs Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Dimensions Box */}
              <div className="bg-slate-950/60 rounded-xl border border-blue-500/20 p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <h4 className="font-semibold text-white text-sm">Dimensions (Group Criteria)</h4>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono">
                    {schema?.dimensions?.length || 0} fields
                  </span>
                </div>
                <div className="space-y-2.5 mt-4">
                  {schema?.dimensions?.map(field => (
                    <div
                      key={field.id}
                      className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-colors flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-xs">{field.name}</span>
                          <span className="font-mono text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20">
                            {field.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium mt-1">{field.description}</p>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {field.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics Box */}
              <div className="bg-slate-950/60 rounded-xl border border-emerald-500/20 p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <h4 className="font-semibold text-white text-sm">Metrics (Numeric / Performance Values)</h4>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">
                    {schema?.metrics?.length || 0} fields
                  </span>
                </div>
                <div className="space-y-2.5 mt-4">
                  {schema?.metrics?.map(field => (
                    <div
                      key={field.id}
                      className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-colors flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-xs">{field.name}</span>
                          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            {field.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium mt-1">{field.description}</p>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
                        {field.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Platform Options & Variables (get_options) */}
            {options && options.options && (
              <div className="mt-6 p-5 rounded-xl bg-slate-950/40 border border-slate-800">
                <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  Discovered Platform Variables & Filters (get_options)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {options.options.date_filter_columns && (
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[11px] text-slate-300 uppercase font-bold">Valid Date Filter Columns:</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {options.options.date_filter_columns.map(col => (
                          <span key={col} className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-mono text-[11px] border border-purple-500/20">
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {options.options.attribution_windows && (
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[11px] text-slate-300 uppercase font-bold">Attribution Windows:</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {options.options.attribution_windows.map(win => (
                          <span key={win} className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[11px] border border-cyan-500/20">
                            {win}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {options.options.supported_breakdowns && (
                    <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[11px] text-slate-300 uppercase font-bold">Supported Breakdowns:</span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {options.options.supported_breakdowns.map(bd => (
                          <span key={bd} className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[11px] border border-amber-500/20">
                            {bd}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: Data Ingestion Tools (get_data) */}
      {activeView === 'ingestion' && (
        <div className="space-y-6">
          {/* Query Workbench Control Bar */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  Data Ingestion Query Runner (get_data)
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Targeted queries with date ranges, accounts, and metrics/dimensions filters.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => runDataIngestion()}
                  disabled={queryLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <Play className={`w-3.5 h-3.5 ${queryLoading ? 'animate-spin' : ''}`} />
                  <span>{queryLoading ? 'Executing Query...' : 'Run Targeted Query'}</span>
                </button>
              </div>
            </div>

            {/* Filter Parameters Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Date Range Start:</label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Date Range End:</label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Target Account:</label>
                <select
                  value={selectedAccount}
                  onChange={e => setSelectedAccount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">All Connected Accounts</option>
                  {accounts
                    .filter(a => a.connector_id === selectedConnector)
                    .map(a => (
                      <option key={a.id} value={a.id}>
                        {a.account_name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Fields Included:</label>
                <div className="text-[11px] bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-indigo-300 font-mono truncate">
                  {selectedFields.length > 0 ? selectedFields.join(', ') : 'All fields'}
                </div>
              </div>
            </div>
          </div>

          {/* Results Table & KPI Summary */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <h4 className="font-semibold text-white text-xs">
                  Query Execution Results ({queryResult.length} rows)
                </h4>
              </div>
              <span className="text-[11px] text-slate-300 font-mono font-medium">
                Range: {dateFrom} → {dateTo}
              </span>
            </div>

            {queryResult.length === 0 ? (
              <div className="p-12 text-center text-slate-300">
                <BarChart3 className="w-10 h-10 mx-auto text-slate-500 mb-2" />
                <p className="text-xs font-medium">No records returned. Click "Run Targeted Query" to fetch live data.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/60 text-slate-200 border-b border-slate-800 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      {Object.keys(queryResult[0]).map(key => (
                        <th key={key} className="px-5 py-3 font-semibold">
                          {key.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {queryResult.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        {Object.entries(row).map(([key, val], cellIdx) => (
                          <td key={cellIdx} className="px-5 py-3 text-slate-200">
                            {typeof val === 'number' ? (
                              <span className="font-mono text-emerald-400">
                                {key.includes('spend') || key.includes('amount')
                                  ? `$${val.toLocaleString()}`
                                  : val.toLocaleString()}
                              </span>
                            ) : typeof val === 'object' ? (
                              JSON.stringify(val)
                            ) : (
                              String(val)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 4: Action Tools (Write - list_actions & run_action) */}
      {activeView === 'actions' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-amber-400" />
                  Action Tools & State Mutations (list_actions & run_action)
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Execute write operations and parameter modifications back to connector accounts with mandatory confirmation safeguards.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Confirmation Safeguard Enabled
              </span>
            </div>

            {/* List Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {actions.map(action => (
                <div
                  key={action.id}
                  className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {action.id}
                      </span>
                      <span className="text-[10px] uppercase font-mono text-slate-300 font-medium">
                        {action.connector || selectedConnector}
                      </span>
                    </div>
                    <h4 className="font-semibold text-white text-sm mt-2">{action.name}</h4>
                    <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">{action.description}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-300 font-medium font-mono">
                      {Object.keys(action.parameters || {}).length} params
                    </span>
                    <button
                      onClick={() => handleOpenActionModal(action)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      <span>Configure & Run</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: Action Audit Logs (get_action_logs) */}
      {activeView === 'audit' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Connector Action Audit Trail (get_action_logs)
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Immutable record of every state modification executed by users or agentic workflows.
                </p>
              </div>
              <button
                onClick={async () => {
                  const updated = await connectorArtifactService.getActionLogs(25);
                  setActionLogs(updated);
                  showNotification('info', 'Audit logs refreshed');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Log</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/60 text-slate-200 border-b border-slate-800 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Log ID</th>
                    <th className="px-5 py-3.5">Connector</th>
                    <th className="px-5 py-3.5">Action Name</th>
                    <th className="px-5 py-3.5">Executed By</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Payload Preview</th>
                    <th className="px-5 py-3.5 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {actionLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-300 font-medium">
                        No actions logged yet. Run an action to record an audit entry.
                      </td>
                    </tr>
                  ) : (
                    actionLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-3 font-mono text-cyan-400">#{log.id}</td>
                        <td className="px-5 py-3 text-white font-medium">{log.connector_id}</td>
                        <td className="px-5 py-3 font-mono text-amber-300 text-[11px]">{log.action_name}</td>
                        <td className="px-5 py-3 text-slate-300">{log.executed_by}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {log.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-mono text-slate-300 text-[11px] max-w-xs truncate">
                          {typeof log.payload === 'string' ? log.payload : JSON.stringify(log.payload)}
                        </td>
                        <td className="px-5 py-3 text-right text-slate-300 font-mono text-[11px]">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Mandatory Action Confirmation & Runner Modal */}
      {actionModalOpen && selectedAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Confirm Live Action Execution</h3>
                  <span className="text-xs text-indigo-300 font-mono">{selectedAction.id}</span>
                </div>
              </div>
              <button
                onClick={() => setActionModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-300 font-semibold mb-0.5">MANDATORY CONFIRMATION WARNING:</strong>
                  This operation modifies live state on <span className="font-semibold text-white">{selectedAction.connector || selectedConnector}</span>. Please review the parameter values below before confirming execution.
                </div>
              </div>

              {/* Dynamic Parameter Inputs */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Action Parameters Schema:
                </label>
                {Object.entries(selectedAction.parameters || {}).map(([paramName, paramConfig]: [string, any]) => (
                  <div key={paramName} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium font-mono">{paramName}</span>
                      <span className="text-slate-300 font-medium text-[10px]">{paramConfig.description}</span>
                    </div>

                    {paramConfig.enum ? (
                      <select
                        value={actionPayload[paramName] || ''}
                        onChange={e => setActionPayload({ ...actionPayload, [paramName]: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        {paramConfig.enum.map((opt: string) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : paramConfig.type === 'number' ? (
                      <input
                        type="number"
                        value={actionPayload[paramName] || 0}
                        onChange={e => setActionPayload({ ...actionPayload, [paramName]: parseFloat(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={actionPayload[paramName] || ''}
                        placeholder={paramConfig.description}
                        onChange={e => setActionPayload({ ...actionPayload, [paramName]: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Result Preview if executed */}
              {actionResult && (
                <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Execution Result Verified</span>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto p-2 bg-slate-900 rounded">
                    {JSON.stringify(actionResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setActionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteActionConfirmed}
                disabled={actionExecuting}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{actionExecuting ? 'Executing Mutation...' : 'Confirm & Execute Live Action'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Auth & Connection Link Management (get_connector_authorization_url & get_connector_connect_info) */}
      {authModalConnector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Connector Auth & Link Manager</h3>
                  <span className="text-xs text-slate-300 font-medium">{authModalConnector}</span>
                </div>
              </div>
              <button
                onClick={() => setAuthModalConnector(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {/* OAuth Authorization Link */}
              <div>
                <label className="text-slate-300 font-semibold block mb-2">
                  Browser OAuth Authorization URL (get_connector_authorization_url):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={authUrl}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 text-xs font-mono"
                  />
                  <a
                    href={authUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1 shrink-0 transition-colors"
                  >
                    <span>Connect</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Developer Instructions (get_connector_connect_info) */}
              {connectInfo && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    Developer Connection Instructions:
                  </h4>
                  <ul className="space-y-1.5 text-slate-300 font-medium">
                    {connectInfo.instructions?.map((step: string, idx: number) => (
                      <li key={idx} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">API Documentation:</span>
                    <a
                      href={connectInfo.documentation_url || '/docs/connectors'}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>View Docs</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setAuthModalConnector(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectorArtifactConsole;
