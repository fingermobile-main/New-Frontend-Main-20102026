/**
 * FingerMobile Protocol™ Sovereign Financial Database Layer
 * Client-Side Relational Store & Audit Ledger
 *
 * Implements relational schemas, primary keys, foreign keys, versioned snapshots,
 * and persistent storage across the entire platform financial ecosystem.
 */

import api from './api';
import {
  ApprovalStatus,
  BankAccountRail,
  CostTccBoqData,
  FinancialLineItem,
  IncomeStatementSheetData,
  BalanceSheetData,
  StartupFundsData,
  CapexOpexDancia4TvData,
  DEFAULT_INCOME_STATEMENT,
  DEFAULT_BALANCE_SHEET,
  DEFAULT_COST_TCC_BOQ,
  DEFAULT_STARTUP_FUNDS,
  DEFAULT_CAPEX_OPEX_DANCIA4TV,
  PLATFORM_REVENUE_RAILS,
  PLATFORM_PROFIT_RAILS
} from '../constants/platformFinancialEcosystemData';

export type SheetKey =
  | 'income_statement'
  | 'balance_sheet'
  | 'cost_tcc_boq'
  | 'startup_funds'
  | 'capex_opex_dancia';

// ----------------------------------------------------------------------------
// RELATIONAL DATABASE TABLE SCHEMAS
// ----------------------------------------------------------------------------

export interface DbTableEcosystemConfig {
  id: 'PRIMARY_CONFIG';
  loanInterestRatePercent: number; // e.g. 33%
  loanPrincipalNgn: number;       // e.g. ₦426,700,000
  taxRatePercent: number;          // e.g. 10%
  usdNgnExchangeRate: number;      // e.g. ₦1,550
  cfoName: string;
  superAdminName: string;
  activeFiscalYear: string;
  lastUpdated: string;
}

export interface DbTableBankRails {
  id: string;
  railType: 'TOP_LINE_REVENUE' | 'BOTTOM_LINE_PROFIT';
  bankName: string;
  accountName: string;
  accountNumber: string;
  currency: 'NGN' | 'GBP' | 'EUR' | 'USD';
  ussdCode: string;
  swiftCode: string;
  branch: string;
  address: string;
  purpose: string;
  status: 'ACTIVE_ONLINE' | 'THROTTLED' | 'MAINTENANCE';
  lastVerifiedAt: string;
}

export interface DbTableSheetMetadata {
  sheetKey: SheetKey;
  title: string;
  version: number;
  status: ApprovalStatus;
  lastEditedBy: string;
  lastEditedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
  checksum?: string;
}

export interface DbTableAuditRecord {
  id: string;
  sheetKey: SheetKey;
  sheetLabel: string;
  action:
    | 'DRAFT_SAVED'
    | 'SUBMITTED_FOR_APPROVAL'
    | 'SUPER_ADMIN_APPROVED'
    | 'UNLOCK_FOR_REVISION'
    | 'SHEET_RESET'
    | 'HEARTBEAT_SYNC'
    | 'BANK_RAILS_UPDATED'
    | 'CONFIG_UPDATED';
  actor: string;
  actorRole: 'CFO' | 'SUPER_ADMIN' | 'SYSTEM_HEARTBEAT';
  notes: string;
  version: number;
  timestamp: string;
  payloadSummary?: string;
}

export interface DbTableHeartbeatTelemetry {
  id: string;
  timestamp: string;
  sourceService: 'SUBSCRIPTIONS' | 'STOREFRONT' | 'CANARY_ADS' | 'DANCIA_TV' | 'FIC_TREASURY' | 'SYSTEM_AGGREGATOR';
  metricName: string;
  liveAmountNgn: number;
  syncTarget: string;
  status: 'SUCCESS' | 'PENDING';
}

export interface DbTableDoubleEntrySweep {
  id: string;
  timestamp: string;
  grossRevenueNgn: number;
  deductionsNgn: {
    cogs: number;
    opex: number;
    debtService: number;
    taxReserve: number;
  };
  netProfitSweptNgn: number;
  inflowBankRail: string;
  destinationSurplusRail: string;
  sweepStatus: 'COMMITTED_TO_FIDELITY_AREA8' | 'PENDING_BATCH';
}

// ----------------------------------------------------------------------------
// LOCAL STORAGE KEYS (Sovereign Database Relational Engine)
// ----------------------------------------------------------------------------
const STORAGE_PREFIX = 'fmp_db_';
export const DB_KEYS = {
  CONFIG: `${STORAGE_PREFIX}tb_ecosystem_config`,
  BANK_RAILS: `${STORAGE_PREFIX}tb_bank_rails`,
  SHEET_METADATA: `${STORAGE_PREFIX}tb_sheet_metadata`,
  LINE_ITEMS: `${STORAGE_PREFIX}tb_line_items_`, // appended with sheetKey
  AUDIT_LOG: 'fmp_financial_audit_log', // backwards compatible
  HEARTBEAT_LOG: `${STORAGE_PREFIX}tb_heartbeat_telemetry`,
  SWEEPS_LEDGER: `${STORAGE_PREFIX}tb_double_entry_sweeps`,
};

// ----------------------------------------------------------------------------
// DATABASE INITIALIZATION & SEEDING
// ----------------------------------------------------------------------------

export class FinancialEcosystemDatabase {
  private static instance: FinancialEcosystemDatabase;

  public static getInstance(): FinancialEcosystemDatabase {
    if (!FinancialEcosystemDatabase.instance) {
      FinancialEcosystemDatabase.instance = new FinancialEcosystemDatabase();
    }
    return FinancialEcosystemDatabase.instance;
  }

  constructor() {
    this.seedDefaultsIfEmpty();
  }

  private seedDefaultsIfEmpty() {
    try {
      // 1. Ecosystem Config
      if (!localStorage.getItem(DB_KEYS.CONFIG)) {
        const defaultConfig: DbTableEcosystemConfig = {
          id: 'PRIMARY_CONFIG',
          loanInterestRatePercent: 33.0,
          loanPrincipalNgn: 426700000,
          taxRatePercent: 10.0,
          usdNgnExchangeRate: 1550,
          cfoName: 'Mrs. Mbah Eunice Emonena (CFO)',
          superAdminName: 'Mbah Israel Obinna (SUPER ADMIN - Supreme Authority)',
          activeFiscalYear: '2026/2027',
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(defaultConfig));
      }

      // 2. Bank Rails
      if (!localStorage.getItem(DB_KEYS.BANK_RAILS)) {
        const initialRails: DbTableBankRails[] = [
          ...PLATFORM_REVENUE_RAILS.accounts.map((acc) => ({
            id: `rail_rev_${acc.id}`,
            railType: 'TOP_LINE_REVENUE' as const,
            bankName: acc.bankName,
            accountName: acc.accountName,
            accountNumber: acc.accountNumber,
            currency: acc.currency,
            ussdCode: acc.ussdCode,
            swiftCode: acc.swiftCode,
            branch: acc.branch,
            address: acc.address,
            purpose: acc.purpose,
            status: acc.status,
            lastVerifiedAt: new Date().toISOString()
          })),
          {
            id: 'rail_profit_abuja',
            railType: 'BOTTOM_LINE_PROFIT' as const,
            bankName: PLATFORM_PROFIT_RAILS.bankName,
            accountName: PLATFORM_PROFIT_RAILS.accountName,
            accountNumber: PLATFORM_PROFIT_RAILS.accountNumber,
            currency: 'NGN',
            ussdCode: PLATFORM_PROFIT_RAILS.ussdCode,
            swiftCode: PLATFORM_PROFIT_RAILS.swiftCode,
            branch: `${PLATFORM_PROFIT_RAILS.branchName}, ${PLATFORM_PROFIT_RAILS.branchCity}`,
            address: PLATFORM_PROFIT_RAILS.corporateAddress,
            purpose: PLATFORM_PROFIT_RAILS.purpose,
            status: 'ACTIVE_ONLINE',
            lastVerifiedAt: new Date().toISOString()
          }
        ];
        localStorage.setItem(DB_KEYS.BANK_RAILS, JSON.stringify(initialRails));
      }

      // 3. Ensure legacy sheets have metadata records
      this.ensureSheetMetadata();
    } catch (e) {
      console.warn('Financial database initialization note:', e);
    }
  }

  private ensureSheetMetadata() {
    const sheets: SheetKey[] = [
      'income_statement',
      'balance_sheet',
      'cost_tcc_boq',
      'startup_funds',
      'capex_opex_dancia'
    ];
    sheets.forEach((key) => {
      const metaKey = `${DB_KEYS.SHEET_METADATA}_${key}`;
      if (!localStorage.getItem(metaKey)) {
        const defaultMeta: DbTableSheetMetadata = {
          sheetKey: key,
          title: this.getSheetTitle(key),
          version: 1,
          status: 'DRAFT',
          lastEditedBy: 'Mrs. Mbah Eunice Emonena (CFO)',
          lastEditedAt: new Date().toISOString(),
          notes: 'Initial Sovereign Financial Draft'
        };
        localStorage.setItem(metaKey, JSON.stringify(defaultMeta));
      }
    });
  }

  public getSheetTitle(key: SheetKey): string {
    switch (key) {
      case 'income_statement':
        return '8. Income Statement (P&L)';
      case 'balance_sheet':
        return '10. Balance Sheet';
      case 'cost_tcc_boq':
        return 'COST - TCC Infrastructure BoQ';
      case 'startup_funds':
        return '1. Required Start-Up Funds';
      case 'capex_opex_dancia':
        return 'CAPEX & OPEX (2) - Dancia-4Tv BoQ';
    }
  }

  // --------------------------------------------------------------------------
  // CONFIG REPOSITORY
  // --------------------------------------------------------------------------
  public getConfig(): DbTableEcosystemConfig {
    const raw = localStorage.getItem(DB_KEYS.CONFIG);
    if (!raw) {
      return {
        id: 'PRIMARY_CONFIG',
        loanInterestRatePercent: 33.0,
        loanPrincipalNgn: 426700000,
        taxRatePercent: 10.0,
        usdNgnExchangeRate: 1550,
        cfoName: 'Mrs. Mbah Eunice Emonena (CFO)',
        superAdminName: 'Mbah Israel Obinna (SUPER ADMIN - Supreme Authority)',
        activeFiscalYear: '2026/2027',
        lastUpdated: new Date().toISOString()
      };
    }
    return JSON.parse(raw);
  }

  public updateConfig(partial: Partial<DbTableEcosystemConfig>, actor: string, actorRole: 'CFO' | 'SUPER_ADMIN'): DbTableEcosystemConfig {
    const current = this.getConfig();
    const updated: DbTableEcosystemConfig = {
      ...current,
      ...partial,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(updated));
    this.recordAudit({
      sheetKey: 'income_statement',
      sheetLabel: 'Ecosystem Financial Config',
      action: 'CONFIG_UPDATED',
      actor,
      actorRole,
      notes: `Updated ecosystem rates: Debt Rate=${updated.loanInterestRatePercent}%, Principal=₦${updated.loanPrincipalNgn.toLocaleString()}, Tax=${updated.taxRatePercent}%`,
      version: 1
    });
    return updated;
  }

  // --------------------------------------------------------------------------
  // BANK RAILS REPOSITORY
  // --------------------------------------------------------------------------
  public getBankRails(): DbTableBankRails[] {
    const raw = localStorage.getItem(DB_KEYS.BANK_RAILS);
    return raw ? JSON.parse(raw) : [];
  }

  public saveBankRails(rails: DbTableBankRails[], actor: string, actorRole: 'CFO' | 'SUPER_ADMIN') {
    localStorage.setItem(DB_KEYS.BANK_RAILS, JSON.stringify(rails));
    this.recordAudit({
      sheetKey: 'income_statement',
      sheetLabel: '1. Sovereign Bank Rails',
      action: 'BANK_RAILS_UPDATED',
      actor,
      actorRole,
      notes: `Updated ${rails.length} Sovereign Bank Rails (Fidelity Revenue & Profit destinations).`,
      version: 1
    });
  }

  // --------------------------------------------------------------------------
  // SHEET METADATA & APPROVAL WORKFLOW
  // --------------------------------------------------------------------------
  public getSheetMetadata(sheetKey: SheetKey): DbTableSheetMetadata {
    const raw = localStorage.getItem(`${DB_KEYS.SHEET_METADATA}_${sheetKey}`);
    if (raw) return JSON.parse(raw);
    return {
      sheetKey,
      title: this.getSheetTitle(sheetKey),
      version: 1,
      status: 'DRAFT',
      lastEditedBy: 'Mrs. Mbah Eunice Emonena (CFO)',
      lastEditedAt: new Date().toISOString(),
      notes: 'Initial Baseline'
    };
  }

  public setSheetMetadata(meta: DbTableSheetMetadata) {
    localStorage.setItem(`${DB_KEYS.SHEET_METADATA}_${meta.sheetKey}`, JSON.stringify(meta));
  }

  // --------------------------------------------------------------------------
  // AUDIT TRAIL LOGGING
  // --------------------------------------------------------------------------
  public recordAudit(record: Omit<DbTableAuditRecord, 'id' | 'timestamp'>): DbTableAuditRecord {
    const existingRaw = localStorage.getItem(DB_KEYS.AUDIT_LOG);
    const existing: DbTableAuditRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
    const fullRecord: DbTableAuditRecord = {
      ...record,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    };
    const updated = [fullRecord, ...existing].slice(0, 300);
    localStorage.setItem(DB_KEYS.AUDIT_LOG, JSON.stringify(updated));
    return fullRecord;
  }

  public getAuditTrail(): DbTableAuditRecord[] {
    const raw = localStorage.getItem(DB_KEYS.AUDIT_LOG);
    return raw ? JSON.parse(raw) : [];
  }

  // --------------------------------------------------------------------------
  // HEARTBEAT TELEMETRY LOGGING
  // --------------------------------------------------------------------------
  public logHeartbeat(telemetry: Omit<DbTableHeartbeatTelemetry, 'id' | 'timestamp'>) {
    const raw = localStorage.getItem(DB_KEYS.HEARTBEAT_LOG);
    const existing: DbTableHeartbeatTelemetry[] = raw ? JSON.parse(raw) : [];
    const entry: DbTableHeartbeatTelemetry = {
      ...telemetry,
      id: `hb_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    const updated = [entry, ...existing].slice(0, 100);
    localStorage.setItem(DB_KEYS.HEARTBEAT_LOG, JSON.stringify(updated));
  }

  public getRecentHeartbeats(): DbTableHeartbeatTelemetry[] {
    const raw = localStorage.getItem(DB_KEYS.HEARTBEAT_LOG);
    return raw ? JSON.parse(raw) : [];
  }

  // --------------------------------------------------------------------------
  // DOUBLE-ENTRY SWEEP LEDGER
  // --------------------------------------------------------------------------
  public commitSweep(sweep: Omit<DbTableDoubleEntrySweep, 'id' | 'timestamp'>): DbTableDoubleEntrySweep {
    const raw = localStorage.getItem(DB_KEYS.SWEEPS_LEDGER);
    const existing: DbTableDoubleEntrySweep[] = raw ? JSON.parse(raw) : [];
    const entry: DbTableDoubleEntrySweep = {
      ...sweep,
      id: `sweep_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    const updated = [entry, ...existing].slice(0, 200);
    localStorage.setItem(DB_KEYS.SWEEPS_LEDGER, JSON.stringify(updated));
    return entry;
  }

  public getSweeps(): DbTableDoubleEntrySweep[] {
    const raw = localStorage.getItem(DB_KEYS.SWEEPS_LEDGER);
    return raw ? JSON.parse(raw) : [];
  }

  // --------------------------------------------------------------------------
  // ASYNC POSTGRESQL FINANCIAL ECOSYSTEM PERSISTENCE
  // --------------------------------------------------------------------------

  public async fetchSheetFromPostgres(key: SheetKey): Promise<any> {
    try {
      const response = await api.get(`/financials/ecosystem/sheets/${key}`);
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`[FinancialDB] Could not fetch sheet ${key} from PostgreSQL backend, using fallback cache:`, err);
    }
    return null;
  }

  public async persistSheetToPostgres(key: SheetKey, sheetData: any, metadata?: Partial<DbTableSheetMetadata>): Promise<any> {
    // 1. Update local cache
    try {
      localStorage.setItem(`fmp_dynamic_sheet_${key}`, JSON.stringify(sheetData));
      if (metadata) {
        const metaKey = `${DB_KEYS.SHEET_METADATA}_${key}`;
        const currentMeta = this.getSheetMetadata(key);
        localStorage.setItem(metaKey, JSON.stringify({ ...currentMeta, ...metadata, sheetKey: key }));
      }
    } catch {
      // ignore local cache error
    }

    // 2. Persist directly to PostgreSQL database
    try {
      const response = await api.put(`/financials/ecosystem/sheets/${key}`, {
        sheetData,
        metadata: {
          title: this.getSheetTitle(key),
          lastEditedBy: metadata?.lastEditedBy || 'Mrs. Mbah Eunice Emonena (CFO)',
          status: metadata?.status || 'DRAFT',
          notes: metadata?.notes || '',
          version: metadata?.version || 1
        }
      });
      return response.data;
    } catch (err) {
      console.error(`[FinancialDB] Error persisting sheet ${key} to PostgreSQL:`, err);
      throw err;
    }
  }

  public async approveSheetInPostgres(key: SheetKey, approver?: string, notes?: string): Promise<any> {
    try {
      const response = await api.post(`/financials/ecosystem/sheets/${key}/approve`, {
        approver: approver || 'Mbah Israel Obinna (SUPER ADMIN - Supreme Authority)',
        notes: notes || 'Officially audited, verified, and ratified as the immutable baseline.'
      });
      return response.data;
    } catch (err) {
      console.error(`[FinancialDB] Error approving sheet ${key} in PostgreSQL:`, err);
      throw err;
    }
  }

  public async fetchAuditLogsFromPostgres(sheetKey?: SheetKey): Promise<DbTableAuditRecord[]> {
    try {
      const response = await api.get('/financials/ecosystem/audit-logs', {
        params: sheetKey ? { sheetKey } : undefined
      });
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('[FinancialDB] Could not fetch audit logs from PostgreSQL, using local store:', err);
    }
    return this.getAuditTrail();
  }

  public async commitAuditLogToPostgres(record: Omit<DbTableAuditRecord, 'id' | 'timestamp'>): Promise<DbTableAuditRecord> {
    const localRecord = this.recordAudit(record);
    try {
      await api.post('/financials/ecosystem/audit-logs', {
        sheetKey: record.sheetKey,
        sheetLabel: record.sheetLabel,
        action: record.action,
        actor: record.actor,
        actorRole: record.actorRole,
        notes: record.notes,
        version: record.version,
        payloadSummary: record.payloadSummary
      });
    } catch (err) {
      console.warn('[FinancialDB] Could not commit audit record to PostgreSQL:', err);
    }
    return localRecord;
  }
}

export const financialDb = FinancialEcosystemDatabase.getInstance();
