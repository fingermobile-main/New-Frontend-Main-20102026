/**
 * Types for E-Learning, NYSC SAED & EduTech Console
 * FingerMobile Protocol™ Production Control Plane
 * Phase 9: Course Syllabi, Accreditation Proofs, Student Enrolment, Certification Tiers & DefCon Holds
 */

export type ElearningNyscDomain =
  | 'nysc_saed_skills'
  | 'coding_web3_bootcamp'
  | 'vocational_fashion'
  | 'financial_literacy_crypto'
  | 'stem_robotics_iot'
  | 'agribusiness_hydroponics';

export interface ElearningNyscItem {
  id: string | number;
  domain: ElearningNyscDomain;
  name: string;
  code: string;
  category: string;
  instructor_name: string;
  accreditation_body: string;
  price_fiat: number | string;
  price_fic: number | string;
  enrolled_students: number;
  completion_rate: number | string;
  curriculum_modules: number;
  status: 'active' | 'frozen';
  display_order: number;
  certification_level: string;
  tags?: string[];
  voice_tag?: string | null;
  document_url?: string | null;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ElearningNyscSummary {
  total_items: string | number;
  active_count: string | number;
  frozen_count: string | number;
  total_students: string | number;
  average_completion_rate: string | number;
  total_curriculum_modules: string | number;
  estimated_gross_fiat: string | number;
  estimated_gross_fic: string | number;
  total_nysc_courses: string | number;
  total_web3_courses: string | number;
}

export interface ElearningNyscDomainStat {
  domain: string;
  count: string | number;
  domain_students: string | number;
  avg_completion: string | number;
}

export interface ElearningNyscOverview {
  summary: ElearningNyscSummary;
  domains: ElearningNyscDomainStat[];
  totalSpawns: number;
  timestamp: string;
}

export interface ElearningNyscSpawnedConsole {
  id: number;
  title: string;
  domain: string;
  badge: string;
  description: string;
  created_at: string;
}

export interface CreateElearningNyscItemPayload {
  domain: ElearningNyscDomain;
  name: string;
  code: string;
  category: string;
  instructor_name?: string;
  accreditation_body?: string;
  price_fiat?: number;
  price_fic?: number;
  enrolled_students?: number;
  completion_rate?: number;
  curriculum_modules?: number;
  status?: 'active' | 'frozen';
  certification_level?: string;
  tags?: string[];
  voice_tag?: string;
  document_url?: string;
  metadata?: Record<string, any>;
}
