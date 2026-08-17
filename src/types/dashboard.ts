export interface SystemMetric {name: string; value: string; change: number; icon: string; color: string;
}

export interface BusinessOffice {id: string; name: string; address: string; city: string; country: string; phone: string; email: string;
  isVirtual?: boolean;
  contact?: string;
}

export interface MemberActivity {id: string; member: string; action: string; timestamp: string; ip: string; location: string;
}

export interface SystemAlert {id: string; title: string; description?: string; severity: "low" | "medium" | "high" | "critical"; timestamp: string; resolved: boolean;
}

export interface SecurityEvent {id: string; type: "login" | "suspicious" | "blocked" | "successful"; severity: "low" | "medium" | "high" | "critical"; memberId: string; ipAddress: string; location: string; device: string; timestamp: string; action: string; status: "resolved" | "investigating" | "pending";
}

export interface MonetizationData {totalRevenue: string; subscriptionRevenue: string; giftRevenue: string; revenueBySource: { source: string; percentage: number; amount: string; color: string;
  }[]; topPerforming: {
  region: string; revenue: string; change: number;
  }[];
}

// Renamed to DashboardAdCampaign to avoid duplicate export conflict with models.ts
export interface DashboardAdCampaign {id: string; name: string; budget: string; spend: string; clicks: string; ctr: string; status: "Active" | "Paused" | "Completed";
  [key: string]: any;
}

// Re-export AdCampaign from models for convenience
export type { AdCampaign } from './models';

export interface UGCMetric {name: string; value: string; change: number; icon: string; color: string;
}

export interface ContentPerformance {id: string; type: "post" | "video"; title: string; likes: number; comments: number; shares: number; views: number; engagement: number; thumbnail: string;
}

export interface AudienceDemographic {country: string; percentage: number; members: string;
}

export interface UGCActivity {
  id: string;
  memberId?: string;
  member?: string; action: string; content: string; timestamp: string; type: string;
}

export interface ContentItem {id: string; title: string; type: "post" | "video" | "image";
  createdAt: string; likes: number; comments: number;
}

export interface DetailedMetric {id: string; title: string; views: string; likes: string; comments: string; shares: string; watch: string; rate: string;
}

export interface AgeDistribution {range: string; percentage: number; members: string;
}

export interface GenderSplit {male: number; female: number;
}

export interface TopInterest {interest: string; percentage: number;
}

export interface GeographicReach {country: string; percentage: number; members: string;
}

export interface MonetizationEarnings {totalEarnings: string; contentRevenue: string; affiliateEarnings: string; revenueBySource: { source: string; percentage: number; amount: string; color: string;
  }[]; topPerforming: {
  content: string; revenue: string; change: number;
  }[];
}

export interface ScheduledContent {id: string; title: string; date: string; type: "post" | "video" | "image";
}

export interface BestPostingTime {day: string; time: string; engagement: "Low" | "Medium" | "High" | "Very High";
}
