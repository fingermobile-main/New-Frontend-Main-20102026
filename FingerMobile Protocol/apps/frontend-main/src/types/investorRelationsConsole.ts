import { AfricanVoiceLine } from '../services/SuperViAudioEngine';

export interface InvestorRelationsConsoleItem {
  id: string;
  domain: string;
  name: string;
  code: string;
  category: 'Equity Cap Table' | 'Venture Capital' | 'Sovereign Funds' | 'Employee Incentive' | 'Token Treasury' | 'Dividend Distribution' | 'Secondary Trading' | 'Audit & Compliance' | 'Regulatory Filings' | 'ESG Initiatives' | 'Capital Preservation' | 'Capital Markets' | string;
  status: 'active' | 'frozen';
  display_order: number;
  investor_class?: string;
  valuation_cap_usd?: number;
  equity_allocated_pct?: number;
  vesting_cliff_months?: number;
  total_token_grant_fic?: number;
  dividend_yield_annual?: number;
  prospectus_pdf_url?: string;
  voice_tag?: AfricanVoiceLine;
  notes?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface InvestorRelationsConsoleOverview {
  summary: {
    total_items: string | number;
    active_count: string | number;
    frozen_count: string | number;
    peak_valuation_usd: string | number;
    total_tokens_granted: string | number;
    avg_dividend_yield: string | number;
    total_equity_allocated: string | number;
  };
  categories: Array<{
    category: string;
    count: string | number;
    tokens_allocated: string | number;
  }>;
  totalSpawns: number;
  timestamp: string;
}

export interface InvestorRelationsConsoleSpawn {
  id: string;
  console_title: string;
  target_domain: string;
  route: string;
  icon_name: string;
  badge_text: string;
  status: string;
  config: Record<string, any>;
  created_at?: string;
}
