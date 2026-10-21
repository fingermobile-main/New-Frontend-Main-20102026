export type CreatorTier = 'TIER_1' | 'TIER_2' | 'TIER_3';
export type RegistrationStatus = 'OPEN' | 'WAITLIST' | 'CLOSED';
export type AdmissionMode = 'AUTO_ADMIT' | 'MANUAL_APPROVAL' | 'INVITE_ONLY';

export interface RegionalTierConfig {
  tier: CreatorTier;
  maxCapacity: number;
  reservedCount?: number;
  currentActive: number;
  waitlistCount?: number;
  registrationStatus: RegistrationStatus; // Toggle 1
  admissionMode: AdmissionMode;           // Toggle 2
  minFollowersRequired?: number;
  kycRequired: boolean;
}

export interface CountryCreatorRuleState {
  countryCode: string;          // ISO Alpha-2 (e.g., 'NG', 'GH', 'GB', 'US', 'IN')
  countryName: string;
  isRegionEnabled: boolean;     // Master switch for region
  tiers: Record<CreatorTier, RegionalTierConfig>;
  updatedAt: string;
  updatedBy: string;
}

export interface CohortInfo {
  id: string;
  name: string;
  totalSeats: number;
  claimedSeats: number;
  availableSeats: number;
  percentageFilled: number;
  closesAt: string;
  status: string;
}

export interface CountryAvailabilityData {
  countryCode: string;
  activeCohort: CohortInfo | null;
  waitlistCohort: CohortInfo | null;
  tiers: Array<{
    tier: CreatorTier;
    max_capacity: number;
    reserved_count: number;
    current_active: number;
    registration_status: RegistrationStatus;
    admission_mode: AdmissionMode;
  }>;
}
