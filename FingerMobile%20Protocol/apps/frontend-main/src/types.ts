export type Program = {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  // Additional properties used in the UI
  title?: string;
  category?: string;
  thumbnailUrl?: string;
  isLive?: boolean;
  viewCount?: number;
  duration?: string;
};

export type GuardianSystemStatus = {
  id: string;
  componentName: string;
  status: 'operational' | 'degraded' | 'down';
  lastChecked: string;
  message?: string;
  // Additional properties used in the UI
  module?: string;
  description?: string;
};

export type GuardianAlert = {
  id: string;
  alertType: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  // Additional properties used in the UI
  title?: string;
  suggestion?: string;
};

export type Topic = {
  id: string;
  name: string;
  description?: string;
};

// Define extended types for UI components
export type TopicType = Topic & {
  isTrending?: boolean;
  coverImageUrl?: string;
};

export type Hashtag = {
  id: string;
  name: string;
  count?: number;
};

// Define extended type for UI components
export type HashtagType = Hashtag & {
  isTrending?: boolean;
  category?: string;
};

export type AgenticAiResponse = {
  id: string;
  query: string;
  response: string;
  confidence: number;
  sources?: string[];
  timestamp: string;
  // Additional properties used in the UI
  plan?: string;
  changes?: Array<Record<string, unknown>>;
  agentId?: string;
};

export type MediaTemplate = {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio';
  properties: Record<string, unknown>;
  thumbnailUrl?: string;
  // Additional properties used in the service
  description?: string;
  category?: string;
  tags?: string[];
  previewUrl?: string;
  downloadUrl?: string;
  fileSize?: number;
  fileType?: string;
  isPublic?: boolean;
  licenseType?: string;
  updatedAt?: string;
};

export type Paylink = {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  description?: string;
  status: 'active' | 'expired' | 'used';
  createdAt: string;
  expiresAt?: string;
  // Additional property used in the service
  url?: string;
};

export type AIGovernanceConfig = {
  id: string;
  policyName: string;
  rules: Array<Record<string, unknown>>;
  isActive: boolean;
  createdAt: string;
  // Additional properties used in the utility
  policies?: Record<string, unknown>;
  defaultPolicyId?: string;
};
