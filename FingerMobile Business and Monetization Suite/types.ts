// types.ts
import { ReactNode } from 'react';

// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  preferences?: UserPreferences;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  socialLinks?: SocialLinks;
  privacySettings?: PrivacySettings;
  notificationSettings?: NotificationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  website?: string;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  searchVisibility: 'public' | 'private';
  allowMessaging: boolean;
  showEmail: boolean;
  showLocation: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications?: boolean;
  notificationFrequency: 'instant' | 'daily' | 'weekly';
  marketingEmails: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  privacyLevel: number;
  marketingConsent: boolean;
  dataSharingConsent: boolean;
}

export enum UserRole {
  GUEST = 'guest',
  VERIFIED_USER = 'verified_user',
  CREATOR = 'creator',
  MERCHANT = 'merchant',
  MODERATOR = 'moderator',
  PLATFORM_ADMIN = 'platform_admin',
  SYSTEM_ENGINEER = 'system_engineer',
  AFFILIATE_PARTNER = 'affiliate_partner',
  PREMIUM_MEMBER = 'premium_member',
  BUSINESS_CLIENT = 'business_client',
  API_CONSUMER = 'api_consumer'
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Platform Configuration Types
export interface PlatformConfig {
  platformId: string;
  platformName: string;
  defaultPageId: string;
  defaultUserId: string;
  policyKey: string;
  monetizationEnabled: boolean;
  commissionStructure: CommissionStructure;
  featureFlags: FeatureFlags;
}

export interface CommissionStructure {
  standardRate: number;
  premiumRate?: number; // Made optional
  enterpriseRate?: number; // Made optional
  volumeTiers?: TierThreshold[]; // Added for tiered commission structures
  customRates?: boolean; // Added for custom rate configurations
  bonusRate?: number; // Added for bonus calculations
}

export interface FeatureFlags {
  enableRevenueSharing: boolean;
  enableCommissionTracking: boolean;
  enablePerformanceMetrics: boolean;
  enablePartnerDashboards: boolean;
}

// Affiliate and Partnership Types
export interface AffiliateProgram {
  id: string;
  name: string;
  description: string;
  commissionRate: number;
  requirements: string[];
  benefits: string[];
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  termsUrl?: string;
}

export interface AffiliatePartner {
  id: string;
  userId: string;
  programId: string;
  partnerCode: string;
  commissionRate: number;
  status: AffiliateStatus;
  joinDate: string;
  lastPayoutDate?: string;
  totalEarnings: number;
  totalPayouts: number;
  trackingParams: TrackingParams;
  performanceMetrics: PerformanceMetrics;
  paymentDetails: PaymentDetails;
}

export interface TrackingParams {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  customParams: Record<string, string>;
}

export interface PerformanceMetrics {
  clicks: number;
  conversions: number;
  revenueGenerated: number;
  commissionEarned: number;
  conversionRate: number;
  avgOrderValue: number;
  uniqueVisitors: number;
  bounceRate: number;
  timeOnSite: number;
}

export interface PaymentDetails {
  method: PaymentMethod;
  details: PaymentMethodInfo;
  preferredCurrency: string;
  minimumPayoutAmount: number;
  payoutSchedule: PayoutSchedule;
}

export interface PaymentMethodInfo {
  paypalEmail?: string;
  bankAccount?: BankAccountDetails;
  cryptocurrencyAddress?: string;
}

export interface BankAccountDetails {
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  bankAddress: string;
  country: string;
  currency: string;
}

export enum PaymentMethod {
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CRYPTOCURRENCY = 'cryptocurrency',
  MOBILE_MONEY = 'mobile_money'
}

export enum PayoutSchedule {
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi-weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly'
}

export enum AffiliateStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TERMINATED = 'terminated',
  INACTIVE = 'inactive'
}

// Monetization and Revenue Types
export interface RevenueModel {
  id: string;
  name: string;
  description: string;
  type: RevenueModelType;
  commissionStructure: CommissionStructure;
  eligibilityCriteria: EligibilityCriteria;
  terms: string;
  isActive: boolean;
}

export enum RevenueModelType {
  SUBSCRIPTION = 'subscription',
  COMMISSION = 'commission',
  FREEMIUM = 'freemium',
  ADVERTISING = 'advertising',
  LICENSING = 'licensing',
  PARTNERSHIP = 'partnership'
}

export interface EligibilityCriteria {
  minimumActivity: number;
  verificationRequirements: string[];
  performanceThresholds: PerformanceThresholds;
}

export interface PerformanceThresholds {
  minimumClicks: number;
  minimumConversions: number;
  minimumRevenue: number;
  minimumConversionRate: number;
}

export interface CommissionRule {
  id: string;
  name: string;
  description: string;
  rate: number;
  conditions: CommissionConditions;
  effectiveDate: string;
  expiryDate?: string;
  isActive: boolean;
}

export interface CommissionConditions {
  minimumTransactionValue?: number;
  productCategories?: string[];
  customerGeography?: string[];
  timeBased?: TimeBasedCondition;
  volumeBased?: VolumeBasedCondition;
}

export interface TimeBasedCondition {
  startTime?: string;
  endTime?: string;
  daysOfWeek?: number[];
  seasonality?: SeasonalityCondition;
}

export interface SeasonalityCondition {
  startDate: string;
  endDate: string;
  multiplier: number;
}

export interface VolumeBasedCondition {
  tierThresholds: TierThreshold[];
  progressive: boolean;
}

export interface TierThreshold {
  minVolume: number;
  maxVolume?: number;
  rate: number;
  threshold?: number; // Added to match constants
  bonusRate?: number; // Added to match constants
}

// Content and Product Types
export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  authorId: string;
  status: ContentStatus;
  visibility: Visibility;
  publishDate?: string;
  tags: string[];
  categories: string[];
  featuredImage?: string;
  seoMeta?: SeoMeta;
  engagementMetrics?: EngagementMetrics;
  monetizationSettings?: MonetizationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  vendorId: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  inventory: InventoryInfo;
  images: Image[];
  variants?: ProductVariant[];
  tags: string[];
  seoMeta?: SeoMeta;
  status: ProductStatus;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryInfo {
  quantity: number;
  trackInventory: boolean;
  lowStockThreshold: number;
  reservedQuantity: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventory: InventoryInfo;
  attributes: Record<string, string>;
  images?: Image[];
}

export interface Image {
  id: string;
  url: string;
  altText?: string;
  caption?: string;
  isFeatured?: boolean;
}

export interface SeoMeta {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface EngagementMetrics {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  saves: number;
  conversions: number;
  conversionRate: number;
  averageTimeSpent: number;
  bounceRate: number;
}

export interface MonetizationSettings {
  enableAffiliateLinks: boolean;
  commissionRate: number;
  enableSponsoredContent: boolean;
  enablePaywall: boolean;
  pricingModel: PricingModel;
  price?: number;
  trialPeriod?: number;
  billingCycle?: BillingCycle;
}

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  PENDING_REVIEW = 'pending_review',
  SCHEDULED = 'scheduled'
}

export enum ProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued'
}

export enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted',
  FRIENDS_ONLY = 'friends_only'
}

export enum PricingModel {
  ONE_TIME = 'one_time',
  SUBSCRIPTION = 'subscription',
  FREEMIUM = 'freemium',
  PAY_PER_USE = 'pay_per_use',
  BUNDLE = 'bundle'
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  QUARTERLY = 'quarterly',
  WEEKLY = 'weekly'
}

// Transaction and Payment Types
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  source: TransactionSource;
  referenceId: string;
  userId: string;
  partnerId?: string;
  commissionAmount?: number;
  commissionRate?: number;
  metadata?: Record<string, unknown>;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum TransactionType {
  SALE = 'sale',
  REFUND = 'refund',
  COMMISSION = 'commission',
  PAYOUT = 'payout',
  CHARGE = 'charge',
  CREDIT = 'credit'
}

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum TransactionSource {
  WEBSITE = 'website',
  MOBILE_APP = 'mobile_app',
  API = 'api',
  PARTNER_INTEGRATION = 'partner_integration',
  DIRECT_UPLOAD = 'direct_upload'
}

export interface Payout {
  id: string;
  partnerId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PayoutStatus;
  scheduledDate: string;
  processedDate?: string;
  transactionId?: string;
  fees?: number;
  netAmount: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export enum PayoutStatus {
  SCHEDULED = 'scheduled',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold'
}

// Analytics and Reporting Types
export interface AnalyticsReport {
  id: string;
  name: string;
  type: ReportType;
  userId: string;
  filters: ReportFilters;
  data: ReportData;
  schedule?: ReportSchedule;
  deliveryPreferences?: DeliveryPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface ReportFilters {
  dateRange: DateRange;
  metrics: string[];
  dimensions: string[];
  segments?: string[];
  granularity?: Granularity;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export enum ReportType {
  PERFORMANCE = 'performance',
  REVENUE = 'revenue',
  AFFILIATE = 'affiliate',
  COMMISSION = 'commission',
  PAYOUT = 'payout',
  CUSTOM = 'custom'
}

export interface ReportData {
  columns: ReportColumn[];
  rows: unknown[][];
  summary: ReportSummary;
  charts?: ChartData[];
}

export interface ReportColumn {
  id: string;
  name: string;
  dataType: DataType;
  format?: string;
}

export enum DataType {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  CURRENCY = 'currency'
}

export interface ReportSummary {
  totalRecords: number;
  computedMetrics: Record<string, number>;
  insights?: string[];
  recommendations?: string[];
}

export interface ChartData {
  type: ChartType;
  title: string;
  data: ChartSeries[];
  options?: ChartOptions;
}

export interface ChartSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface ChartOptions {
  title?: string;
  legend?: boolean;
  tooltip?: boolean;
  grid?: boolean;
  responsive?: boolean;
}

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  DOUGHNUT = 'doughnut',
  AREA = 'area',
  COLUMN = 'column'
}

export interface ReportSchedule {
  frequency: Frequency;
  interval: number;
  startTime: string;
  timezone: string;
  nextRun?: string;
}

export enum Frequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export interface DeliveryPreferences {
  format: ExportFormat;
  deliveryMethod: DeliveryMethod;
  recipients: string[];
  includeVisualizations: boolean;
  includeInsights: boolean;
}

export enum ExportFormat {
  CSV = 'csv',
  PDF = 'pdf',
  XLSX = 'xlsx',
  JSON = 'json'
}

export enum DeliveryMethod {
  EMAIL = 'email',
  DOWNLOAD = 'download',
  API = 'api',
  FTP = 'ftp'
}

export interface Granularity {
  level: GranularityLevel;
  customInterval?: number;
}

export enum GranularityLevel {
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

// Tracking and Attribution Types
export interface TrackingLink {
  id: string;
  partnerId: string;
  destinationUrl: string;
  trackingParams: TrackingParams;
  clicks: number;
  conversions: number;
  status: LinkStatus;
  expirationDate?: string;
  password?: string;
  customDomain?: string;
  createdAt: string;
  updatedAt: string;
}

export enum LinkStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  EXPIRED = 'expired',
  DISABLED = 'disabled'
}

export interface Conversion {
  id: string;
  trackingLinkId: string;
  partnerId: string;
  transactionId: string;
  value: number;
  currency: string;
  commissionAmount: number;
  commissionRate: number;
  status: ConversionStatus;
  attributionData: AttributionData;
  recordedAt: string;
  createdAt: string;
}

export interface AttributionData {
  clickId: string;
  sessionId: string;
  userAgent: string;
  ipAddress: string;
  referrer: string;
  landingPage: string;
  timeOnPage: number;
  conversionPath: ConversionPathStep[];
}

export interface ConversionPathStep {
  url: string;
  timestamp: string;
  referrer?: string;
  timeOnPage?: number;
}

export enum ConversionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  CHARGEBACK = 'chargeback'
}

// System and Admin Types
export interface SystemConfig {
  id: string;
  key: string;
  value: unknown;
  valueType: ConfigValueType;
  scope: ConfigScope;
  isEncrypted: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ConfigValueType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  JSON = 'json',
  ARRAY = 'array'
}

export enum ConfigScope {
  GLOBAL = 'global',
  TENANT = 'tenant',
  USER = 'user',
  APPLICATION = 'application'
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: unknown;
  read: boolean;
  readAt?: string;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  PROMOTIONAL = 'promotional',
  SYSTEM = 'system',
  AFFILIATE = 'affiliate'
}

export interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  isActive: boolean;
  retryPolicy: RetryPolicy;
  rateLimit: RateLimit;
  createdAt: string;
  updatedAt: string;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffStrategy: BackoffStrategy;
  retryDelay: number;
  maxRetryDelay: number;
}

export enum BackoffStrategy {
  FIXED = 'fixed',
  LINEAR = 'linear',
  EXPONENTIAL = 'exponential'
}

export interface RateLimit {
  requestsPerMinute: number;
  burstLimit: number;
}

export interface AdminUser {
  id: string;
  userId: string;
  role: AdminRole;
  permissions: string[];
  assignedModules: string[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  SYSTEM_ADMIN = 'system_admin',
  CONTENT_MODERATOR = 'content_moderator',
  AFFILIATE_MANAGER = 'affiliate_manager',
  FINANCE_MANAGER = 'finance_manager',
  SUPPORT_AGENT = 'support_agent'
}

// Program and Campaign Types
export interface ProgramDefinition {
  id: string;
  name: string;
  description: string;
  requirements: string[]; // Fixed: Changed from Record<string, unknown> to string[]
  benefits: string[];
  commissionStructure: CommissionStructure;
  duration: string;
  terms: string;
  isActive: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  programId: string;
  startDate: string;
  endDate?: string;
  targetAudience: TargetAudience;
  promotionalMaterials: PromotionalMaterial[];
  trackingParams: TrackingParams;
  budget: number;
  status: CampaignStatus;
  metrics?: CampaignMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface TargetAudience {
  demographics: DemographicCriteria;
  interests: string[];
  behaviors: string[];
  geography: string[];
}

export interface DemographicCriteria {
  ageRange?: { min: number; max: number };
  gender?: ('male' | 'female' | 'other')[];
  incomeLevel?: string[];
  educationLevel?: string[];
  occupation?: string[];
}

export interface PromotionalMaterial {
  id: string;
  type: MaterialType;
  title: string;
  content: string;
  assetUrl?: string;
  downloadUrl?: string;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum MaterialType {
  BANNER_AD = 'banner_ad',
  TEXT_AD = 'text_ad',
  VIDEO_AD = 'video_ad',
  SOCIAL_POST = 'social_post',
  EMAIL_TEMPLATE = 'email_template',
  LANDING_PAGE = 'landing_page'
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVISION = 'needs_revision'
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  roi: number;
  cpc: number;
  ctr: number;
  conversionRate: number;
}

export enum CampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Subscription and Billing Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  features: string[];
  limitations: Limitation[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Limitation {
  feature: string;
  limit: number | string;
  appliesTo: LimitationScope;
}

export enum LimitationScope {
  USER = 'user',
  ORGANIZATION = 'organization',
  API = 'api',
  FEATURE = 'feature'
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  trialEndDate?: string;
  cancellationDate?: string;
  autoRenew: boolean;
  paymentMethodId?: string;
  billingInfo?: BillingInfo;
  createdAt: string;
  updatedAt: string;
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  PAUSED = 'paused'
}

export interface BillingInfo {
  cardLastFour: string;
  cardBrand: string;
  expiryMonth: number;
  expiryYear: number;
  billingEmail: string;
  billingAddress: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Extended Universal Profile Types
export interface ExtendedUniversalProfile {
  profileId: string;
  profileType: string;
  personalInformation: PersonalInformation;
  behavioralInsights: BehavioralInsights;
  psychologicalProfiling: PsychologicalProfiling;
  contextualAdaptation: ContextualAdaptation;
  privacyControls: PrivacyControls;
  securitySettings: SecuritySettings;
  integrationCapabilities: IntegrationCapabilities;
  evolutionMechanisms: EvolutionMechanisms;
  complianceFrameworks: ComplianceFrameworks;
  auditTrail: AuditTrail;
}

export interface PersonalInformation {
  demographicData: DemographicData;
  lifestyleFactors: LifestyleFactors;
  professionalData: ProfessionalData;
  socialConnections: SocialConnections;
}

export interface DemographicData {
  age: number | null;
  gender: string | null;
  location: string | null;
  language: string;
  culturalPreferences: string[];
}

export interface LifestyleFactors {
  interests: string[];
  hobbies: string[];
  preferences: Record<string, unknown>;
  behaviorPatterns: Record<string, unknown>;
}

export interface ProfessionalData {
  occupation: string | null;
  industry: string | null;
  seniority: string | null;
  skills: string[];
  careerGoals: string[];
}

export interface SocialConnections {
  networks: string[];
  influenceLevel: string | null;
  engagementStyle: string | null;
}

export interface BehavioralInsights {
  interactionPatterns: InteractionPatterns;
  decisionMaking: DecisionMaking;
  learningStyle: LearningStyle;
}

export interface InteractionPatterns {
  peakActivityTimes: string[];
  preferredChannels: string[];
  responseRates: Record<string, number>;
  engagementTriggers: string[];
}

export interface DecisionMaking {
  riskTolerance: string | null;
  decisionSpeed: string | null;
  influenceSusceptibility: string | null;
  valuePriorities: string[];
}

export interface LearningStyle {
  preference: string | null;
  pace: string | null;
  retentionMethods: string[];
  feedbackReceptiveness: string | null;
}

export interface PsychologicalProfiling {
  personalityTraits: PersonalityTraits;
  cognitiveBiases: string[];
  motivationDrivers: string[];
  stressIndicators: string[];
}

export interface PersonalityTraits {
  openness: number | null;
  conscientiousness: number | null;
  extraversion: number | null;
  agreeableness: number | null;
  neuroticism: number | null;
}

export interface ContextualAdaptation {
  situationalAwareness: SituationalAwareness;
  adaptiveInterfaces: AdaptiveInterfaces;
  personalizedRecommendations: PersonalizedRecommendations;
}

export interface SituationalAwareness {
  environmentalFactors: Record<string, unknown>;
  temporalConsiderations: Record<string, unknown>;
  socialContext: Record<string, unknown>;
  deviceCapabilities: Record<string, unknown>;
}

export interface AdaptiveInterfaces {
  uiPreferences: Record<string, unknown>;
  accessibilityNeeds: string[];
  interactionModalities: string[];
}

export interface PersonalizedRecommendations {
  contentSuggestions: string[];
  timingOptimization: Record<string, unknown>;
  relevanceScoring: Record<string, number>;
}

export interface PrivacyControls {
  dataSharingPermissions: DataSharingPermissions;
  optOutPreferences: string[];
  dataRetentionChoices: Record<string, unknown>;
  profilingConsent: boolean;
}

export interface DataSharingPermissions {
  personalData: boolean;
  behavioralData: boolean;
  demographicData: boolean;
  inferredData: boolean;
}

export interface SecuritySettings {
  authenticationPreferences: AuthenticationPreferences;
  privacyShielding: PrivacyShielding;
  threatProtection: ThreatProtection;
}

export interface AuthenticationPreferences {
  primaryMethod: string;
  secondaryMethods: string[];
  biometricOptions: string[];
  securityQuestions: string[];
}

export interface PrivacyShielding {
  dataObfuscation: boolean;
  syntheticIdentity: boolean;
  sessionAnonymization: boolean;
}

export interface ThreatProtection {
  anomalyDetection: boolean;
  fraudPrevention: boolean;
  identitySpoofing: boolean;
}

export interface IntegrationCapabilities {
  thirdPartyConnectors: string[];
  dataPortability: DataPortability;
  interoperabilityStandards: string[];
}

export interface DataPortability {
  exportFormats: string[];
  transferProtocols: string[];
  validationChecks: boolean;
}

export interface EvolutionMechanisms {
  selfUpdating: boolean;
  feedbackIntegration: boolean;
  preferenceLearning: boolean;
  contextPrediction: boolean;
}

export interface ComplianceFrameworks {
  gdpr: unknown;
  ccpa: boolean;
  hipaa: boolean;
  sox: boolean;
  iso27001: boolean;
}

export interface AuditTrail {
  profileChanges: boolean;
  dataAccess: boolean;
  consentModifications: boolean;
  automatedDecisions: boolean;
}

// API Response Types
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export interface ApiError {
  code: string;
  message: string;
  details?: string;
  timestamp: string;
  path?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNext: boolean;
  hasPrev: boolean;
  pageSize: number;
}

// Form and Validation Types
export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  defaultValue?: unknown;
  validation?: FieldValidation;
  options?: SelectOption[];
  placeholder?: string;
  helpText?: string;
}

export enum FormFieldType {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  TEXTAREA = 'textarea',
  DATE = 'date',
  NUMBER = 'number',
  FILE = 'file'
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customValidator?: (value: unknown) => boolean | string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// UI Component Types
export interface TableColumn<T = unknown> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: ReactNode;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  children: ReactNode;
}

// Business Suite Specific Types
export interface AffiliateData {
  id: string;
  name: string;
  email: string;
  commissionRate: number;
  totalSales: number;
  totalCommission: number;
  status: string;
  joinDate: string;
}

export interface CommissionData {
  id: string;
  affiliateId: string;
  saleAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: string;
  createdAt: string;
}

export interface PayoutData {
  id: string;
  affiliateId: string;
  amount: number;
  status: string;
  scheduledDate: string;
  processedDate?: string;
}

export interface PerformanceData {
  id: string;
  affiliateId: string;
  clicks: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  date: string;
}

export interface BusinessSuiteConfig {
  monetizationEnabled: boolean;
  defaultCommissionRate: number;
  payoutThreshold: number;
  trackingWindow: number; // in days
  supportedPaymentMethods: PaymentMethod[];
  enableAdvancedAnalytics: boolean;
  enableAutomatedPayouts: boolean;
}

export interface AdminData {
  totalAffiliates: number;
  totalSales: number;
  totalCommission: number;
  pendingPayouts: number;
  activePrograms: number;
}

export interface AffiliateMetrics {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalRevenue: number;
  totalCommission: number;
  avgOrderValue: number;
  topPerformingLinks: string[];
}

// Enums with corrected naming to match constants.ts
export enum RateLimitingStrategy {
  fixed_window = 'fixed_window',
  sliding_window = 'sliding_window',
  token_bucket = 'token_bucket'
}

export enum AnalyticsProvider {
  google_analytics = 'google_analytics',
  mixpanel = 'mixpanel',
  segment = 'segment',
  amplitude = 'amplitude'
}

export enum FileStorageProvider {
  aws_s3 = 'aws_s3',
  google_cloud = 'google_cloud',
  azure_blob = 'azure_blob',
  cloudinary = 'cloudinary'
}

export enum DashboardWidget {
  revenue_chart = 'revenue_chart',
  commission_breakdown = 'commission_breakdown',
  affiliate_performance = 'affiliate_performance',
  conversion_metrics = 'conversion_metrics',
  payout_summary = 'payout_summary'
}

export enum WebhookEvent {
  sale_completed = 'sale.completed',
  commission_calculated = 'commission.calculated',
  payout_initiated = 'payout.initiated',
  affiliate_registered = 'affiliate.registered',
  program_updated = 'program.updated'
}

