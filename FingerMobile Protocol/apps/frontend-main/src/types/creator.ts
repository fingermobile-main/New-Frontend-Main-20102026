export interface CreatorMetric {name: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

export interface CreatorContentPerformance {id: string;
  type: 'post' | 'video' | 'image';
  title: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagement: number;
  thumbnail: string;
}

export interface CreatorScheduledContent {id: string;
  title: string;
  date: string;
  type: 'post' | 'video' | 'image';
}

export interface CreatorDetailedMetric {id: string;
  title: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
  watch: string;
  rate: string;
  watchTime?: string; // Added for compatibility
}

export interface CreatorAgeDistribution {range: string;
  percentage: number;
  members: string;
}

export interface CreatorGenderSplit {male: number;
  female: number;
}

export interface CreatorTopInterest {interest: string;
  percentage: number;
}

export interface CreatorGeographicReach {country: string;
  percentage: number;
  members: string;
}

export interface CreatorEarnings {totalEarnings: string;
  contentRevenue: string;
  affiliateEarnings: string;
  revenueBySource: {
  source: string;
  percentage: number;
  amount: string;
  color: string;
  }[];
topPerforming: {content: string;
  revenue: string;
  change: number;
  }[];
  month?: string; // Added for compatibility
  earnings?: number; // Added for compatibility
}

export interface CreatorBestPostingTime {day: string;
  time: string;
  engagement: 'Low' | 'Medium' | 'High' | 'Very High';
  hour?: number; // Added for compatibility
}

// Additional types for creator service
export interface CreatorAudienceDemographics { ageGroups: {
  range: string;
  percentage: number }[];
genderDistribution: {male: number;
  female: number;
  other: number };
geographicDistribution: {country: string;
  percentage: number }[];
interests: string[];
}

export interface CreatorActivity {activityId: string;
  type: 'upload' | 'comment' | 'like' | 'share' | 'live';
  contentId: string;
  timestamp: Date;
  engagement: number;
}

export interface CreatorContentItem {id: string;
  title: string;
  thumbnail: string;
  type: 'video' | 'image' | 'audio';
  uploadDate: Date;
  stats: {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  };
}

export {};
