import React, {} from 'react';
export interface MemberMetrics {memberId: string;
  followerCount: number;
  totalViews: number;
  totalShares: number;
  totalWatchTime: number; // in minutes
  activeVideos: number;
  returnViewers: number;
  postEngagements: number;
  consecutiveDays500Followers: number;
  lastUpdated: Date;
}

export interface EligibilityDetails {meetsRequirements: boolean;
  missingRequirements: string[];
  nextCheckDate: Date;
}

export interface MonetizationEligibility {memberId: string;
  inStreamAds: boolean;
  gems: boolean;
  subscriptions: boolean;
  brandedContent: boolean;
  affiliateMarketing: boolean;
  contentMonetization: boolean;
  shopAccess: boolean;
  lastChecked: Date;
  inStreamAdsDetails: EligibilityDetails;
  gemsDetails: EligibilityDetails;
  subscriptionsDetails: EligibilityDetails;
  brandedContentDetails: EligibilityDetails;
  affiliateMarketingDetails: EligibilityDetails;
  contentMonetizationDetails: EligibilityDetails;
}

export interface CountryEligibility {countryCode: string;
  countryName: string;
  eligible: boolean;
  monetizationFeatures: string[]; // Which features are available in this country
}

export interface PaymentInformation {memberId: string;
  fingerprint: string;
  phoneNumber: string;
  email: string;
  bankAccount: {accountNumber: string;
  bankName: string;
  accountHolderName: string;
  };
debitCard: {last4Digits: string;
  expiryDate: string;
  cardHolderName: string;
  };
address: {street: string;
  city: string;
  state: string;
  country: string;
  gpsCoordinates: {lat: number;
  lng: number;
    };
  };
governmentId: {idNumber: string;
  expiryDate: Date;
  documentUrl: string;
  };
changeHistory: {date: Date;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  }[];
}

export interface GemTransaction {id: string;
  senderMemberid: string;
  recipientMemberid: string;
  gemType: "MARBLE" | "EMERALD" | "SAPPHIRE" | "RUBY" | "DIAMOND";
  quantity: number;
  amountFic: number;
  transactionDate: Date;
  postId?: string;
}

export interface MonetizationEarning {id: string;
  memberId: string;
  earningType:
    | "VIEWS"
    | "GEMS"
    | "SUBSCRIPTIONS"
    | "ADS"
    | "AFFILIATE"
    | "SHOP_SALES";
  amountFic: number;
  details: Record<string,
  unknown>;
  earningDate: Date;
}

// Community Page Monetization Types
export interface CommunityRevenue {id: string;
  communityId: string;
  communityType: "hallmarks" | "gems" | "blogs" | "groups";
  totalRevenue: number;
  platformShare: number;
  creatorShare: number;
  marketplaceShare: number;
  period: string; // e.g., "2023-06"
  breakdown: {subscriptions: number;
  contentMonetization: number;
  marketplaceSales: number;
  };
lastUpdated: Date;
}

export interface CommunitySubscription {id: string;
  communityId: string;
  memberId: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  currency: string;
  interval: "monthly" | "yearly";
  status: "active" | "cancelled" | "expired";
}

export interface RevenueDistribution {id: string;
  communityId: string;
  period: string;
  totalAmount: number;
  platformAmount: number;
  creatorAmount: number;
  marketplaceAmount: number;
  distributionDate: Date;
  status: "pending" | "processed" | "failed";
}

export interface CommunityEarning {id: string;
  memberId: string;
  communityId: string;
  communityType: "hallmarks" | "gems" | "blogs" | "groups";
  amountFic: number;
  earningType: "SUBSCRIPTIONS" | "CONTENT_MONETIZATION" | "MARKETPLACE_SALES";
  details: Record<string,
  unknown>;
  earningDate: Date;
}

export interface GemPricing {gemType: "MARBLE" | "EMERALD" | "SAPPHIRE" | "RUBY" | "DIAMOND";
  memberPrice: number; // Price member pays per gem
  creatorEarning: number; // How much creator earns per 5 gems
}

export interface EarningsReport {period: string;
  totalEarnings: number;
  earningsByType: {views: number;
  gems: number;
  subscriptions: number;
  ads: number;
  affiliate: number;
  shop: number;
  };
topPerformingContent: {postId: string;
  title: string;
  earnings: number;
  }[];
}
  
export {};  
