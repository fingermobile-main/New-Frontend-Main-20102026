// ads.ts - Type definitions for Ads Dashboard

export interface AdsMetric {name: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

export interface AdsPerformanceData {id: string;
  campaign: string;
  budget: string;
  spend: string;
  clicks: string;
  impressions: string;
  ctr: string;
  cpm: string;
  conversions: string;
  convRate: string;
  status: "Active" | "Paused" | "Completed" | "Draft";
}

export interface TopPerformingCampaign {name: string;
  value: string;
  change: number;
}

export interface PerformanceMetric {id: string;
  metric: string;
  value: string;
  change: string;
  benchmark: string;
  industry: string;
}

export interface DemographicData {category: string;
  percentage: number;
  value: string;
}

export interface InterestData {interest: string;
  percentage: number;
}

export interface GeographicData {country: string;
  percentage: number;
  members: string;
}
  
export {};  
