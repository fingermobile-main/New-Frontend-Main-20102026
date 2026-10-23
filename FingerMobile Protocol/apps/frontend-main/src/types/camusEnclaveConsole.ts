import { AfricanVoiceLine } from '../services/SuperViAudioEngine';

export interface CamusEnclaveConsoleItem {
  id: string;
  domain: string;
  name: string;
  code: string;
  category: 'Hardware Security Modules' | 'Enclave Partitions' | 'Physical Security' | 'Cryptographic Proofs' | 'Quantum Resistance' | 'Confidential Compute' | 'Multi-Party Computation' | 'Hardware Entropy' | 'Key Lifecycle' | 'Vault Interfaces' | 'Emergency Killswitch' | 'Forensic Audit' | string;
  status: 'active' | 'frozen';
  display_order: number;
  hsm_slot?: string;
  key_algorithm?: string;
  attestation_state?: string;
  tamper_sensor_status?: string;
  zero_trust_score?: number;
  enclave_cert_url?: string;
  voice_tag?: AfricanVoiceLine;
  notes?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface CamusEnclaveConsoleOverview {
  summary: {
    total_items: string | number;
    active_count: string | number;
    frozen_count: string | number;
    total_hsm_modules: string | number;
    total_enclaves: string | number;
    total_tamper_sensors: string | number;
    total_zk_provers: string | number;
    avg_trust_score: string | number;
  };
  categories: Array<{
    category: string;
    count: string | number;
    avg_score: string | number;
  }>;
  totalSpawns: number;
  timestamp: string;
}

export interface CamusEnclaveConsoleSpawn {
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
