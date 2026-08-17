import React, {} from 'react';
import type {
  DanciaIARCClassification as IARCClassification,
  DanciaMonetizationModel as MonetizationModel
} from '../types/dancia4tv';

// Define missing types locally since they aren't exported from "../types"
interface Video {
  id?: string;
  title?: string;
  description?: string;
  duration?: number;
  thumbnailUrl?: string;
  videoUrl?: string;
  genre?: string[];
  releaseDate?: string;
  rating?: string;
  views?: number;
  likes?: number;
  dislikes?: number;
  isPublic?: boolean;
  isPremium?: boolean;
  parentId?: string;
  childId?: string;
  creatorId?: string;
  creatorName?: string;
  categories?: string[];
  tags?: string[];
  subtitles?: {language: string;
  url: string }[];
  audioTracks?: {language: string;
  url: string }[];
  drmEnabled?: boolean;
  drmPolicy?: string;
  drmKey?: string;
  encryptionStatus?: "none" | "partial" | "full";
  thumbnailBlurDataURL?: string;
  hlsUrl?: string;
  dashUrl?: string;
  uploadDate?: string;
  lastModified?: string;
  visibility?: "public" | "private" | "unlisted";
  monetizationModel?: MonetizationModel;
  revenueShare?: number;
  licenseTerms?: string;
  parentalGuidelines?: string;
  iarcClassification?: IARCClassification;
  complianceStatus?: "pending" | "approved" | "rejected";
  geoRestrictions?: string[];
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  isLive?: boolean;
  liveViewers?: number;
  streamKey?: string;
  transcodingStatus?: "pending" | "processing" | "completed" | "failed";
  transcodingProgress?: number;
  originalResolution?: string;
  availableResolutions?: string[];
  bitrate?: number;
  frameRate?: number;
  codec?: string;
  aspectRatio?: string;
  audioCodec?: string;
  audioBitrate?: number;
  audioChannels?: number;
  captions?: {language: string;
  label: string;
  url: string;
  }[];
  chapters?: {title: string;
  startTime: number;
  endTime: number;
  }[];
  relatedVideos?: string[];
  nextVideo?: string;
  previousVideo?: string;
  metadata?: Record<string, unknown>;
  analytics?: {views: number;
  uniqueViewers: number;
  averageWatchTime: number;
  completionRate: number;
  engagementRate: number;
  likes: number;
  dislikes: number;
  shares: number;
  comments: number;
  revenueGenerated: number;
  };
  accessibilityFeatures?: {audioDescription: boolean;
  signLanguage: boolean;
  easyToRead: boolean;
  };
  accessibilityOptions?: {
    audioDescriptionUrl?: string;
    signLanguageUrl?: string;
  };
  adInsertionPoints?: number[];
  adBreaks?: {startTime: number;
  duration: number;
  adType: "preroll" | "midroll" | "postroll";
  }[];
  contentModerationStatus?: "pending" | "approved" | "flagged";
  moderationNotes?: string;
  creatorRevenue?: number;
  platformRevenue?: number;
  royaltyAmount?: number;
  licensingHistory?: {date: string;
  licensee: string;
  territory: string;
  amount: number;
  }[];
  distributionChannels?: string[];
  syndicationRights?: {territory: string;
  duration: number;
  exclusivity: boolean;
  }[];
  contentProtection?: {watermarking: boolean;
  fingerprinting: boolean;
  securePlayback: boolean;
  };
  userRatings?: {userId: string;
  rating: number;
    review?: string;
  timestamp: string;
  }[];
  contentWarnings?: string[];
  ageRating?: number;
  accessibilityCompliance?: boolean;
  contentAuthenticity?: {verificationStatus: "verified" | "unverified" | "under_review";
  verificationMethod: string;
  authenticityScore: number;
  };
  url?: string;
  thumbnail?: string;
  isProcessed?: boolean;
  processingProgress?: number;
  originalFilename?: string;
  fileSize?: number;
  bitRate?: number;
  language?: string;
  country?: string;
  isDownloadable?: boolean;
  downloadLimit?: number;
  downloadExpiry?: string;
  monetized?: boolean;
  licenseKey?: string;
  licenseExpiry?: string;
  category?: string;
  uploader?: string;
  IARCClassification?: IARCClassification;
  uploadFee?: number;
  length?: number;
  resolution?: string;
  contentTags?: string[];
  createdAt?: string;
  uploaderID?: string;
  authorId?: string;
  engagementScore?: number;
  sampleRate?: number;
  channels?: number;
  downloadCount?: number;
  shareCount?: number;
  saveCount?: number;
  likeCount?: number;
  mashupCount?: number;
  videoID?: string;
  [key: string]: any;
}

interface Playlist {
  id?: string;
  title?: string;
  description?: string;
  creatorId?: string;
  creatorName?: string;
  videos?: string[]; // Array of video IDs
  thumbnailUrl?: string;
  privacy?: "public" | "private" | "unlisted";
  createdAt?: string;
  updatedAt?: string;
  viewCount?: number;
  likeCount?: number;
  shareCount?: number;
  commentCount?: number;
  tags?: string[];
  categories?: string[];
  isPublic?: boolean;
  isCollaborative?: boolean;
  collaborators?: string[];
  metadata?: Record<string, unknown>;
  featured?: boolean;
  promoted?: boolean;
  promotionExpiry?: string;
  playlistType?: "custom" | "auto-generated" | "smart";
  autoGenerateCriteria?: {tags: string[];
  categories: string[];
  dateRange: {
  start: string;
  end: string;
    };
maxItems: number;
  };
  sortingOrder?: "chronological" | "reverse-chronological" | "popular" | "random";
  duration?: number; // Total duration of all videos in seconds
  language?: string;
  region?: string;
  contentModerationStatus?: "pending" | "approved" | "flagged";
  moderationNotes?: string;
  monetizationEnabled?: boolean;
  monetizationModel?: MonetizationModel;
  revenueGenerated?: number;
  thumbnailBlurDataURL?: string;
  lastUpdatedBy?: string;
  version?: number;
  syncWithPersonalCollection?: boolean;
  allowComments?: boolean;
  allowEmbedding?: boolean;
  allowDownload?: boolean;
  sharingPermissions?: {shareExternally: boolean;
  embedAllowed: boolean;
  downloadAllowed: boolean;
  restrictToOrganization: boolean;
  };
  recommendations?: {algorithm: string;
  enabled: boolean;
  criteria: string[];
  };
  analytics?: {totalViews: number;
  uniqueViewers: number;
  averageCompletionRate: number;
  engagementMetrics: {
  clicks: number;
  impressions: number;
  ctr: number;
    };
  };
  parentalGuidelines?: string;
  iarcClassification?: IARCClassification;
  contentWarnings?: string[];
  ageRating?: number;
  accessibilityFeatures?: {audioDescription: boolean;
  signLanguage: boolean;
  easyToRead: boolean;
  };
  contentAuthenticity?: {verificationStatus: "verified" | "unverified" | "under_review";
  verificationMethod: string;
  authenticityScore: number;
  };
  [key: string]: any;
}

// Mock IARC Classifications
export const,
iarcClassifications: IARCClassification[] = [
  {classificationID: "1",
  rating: "18+",
  description:
      "Suitable for persons 22 years and above. Contains explicit Violence,
  frequent Coarse Language,
  Horror and simulated Sexual scenes."
  },
  {classificationID: "2",
  rating: "PG-13",
  description:
      "Parental guidance suggested. May contain material inappropriate for children under 13."
  },
  {classificationID: "3",
  rating: "PG",
  description:
      "Parental guidance suggested. Some material may not be suitable for children."
  }
];

// Mock Monetization Models
export const,
monetizationModels: MonetizationModel[] = [
  {modelID: "1",
  name: "Starter Pack",
  description: "Entry-level monetization package for content creators",
  revenueShare: 50,
  thresholds: {
  likes: 1000000,
  shares: 100000,
  comments: 200000
    }
  },
  {modelID: "2",
  name: "Gem Pack",
  description:
      "Intermediate monetization package for growing content creators",
  revenueShare: 60,
  thresholds: {
  likes: 2000000,
  shares: 300000,
  comments: 500000
    }
  },
  {modelID: "3",
  name: "Hallmarks Pack",
  description:
      "Advanced monetization package for established content creators",
  revenueShare: 70,
  thresholds: {
  likes: 5000000,
  shares: 500000,
  comments: 1500000
    }
  },
  {modelID: "4",
  name: "UGC Upload",
  description: "Member-generated content upload options",
  revenueShare: 30,
  thresholds: {
  likes: 0,
  shares: 0,
  comments: 0
    }
  }
];

// Mock Videos for different genres
export const,
mockVideos: Video[] = [
  // Action
  {id: "action1",
  videoID: "action1",
  title: "Mission,
  Impossible: Final Reckoning",
  description:
      "Ethan Hunt faces his most challenging mission yet as he tries to prevent a global catastrophe.",
  genre: ["Action"],
  url: "/videos/mission-impossible.mp4",
  videoUrl: "/videos/mission-impossible.mp4",
  duration: 8280,
  uploadDate: new Date("2025-01-15").toISOString(),
  thumbnail: "/images/mission-impossible-thumb.jpg",
  thumbnailUrl: "/images/mission-impossible-thumb.jpg",
  views: 1000000,
  likes: 50000,
  // Fix subtitles and audioTracks to match the expected type {
  language: string;
  url: string; },
subtitles: [], // Keep as an empty array or add proper objects like {language: "en",
  url: "/path/to/subtitles.vtt" },
audioTracks: [{language: "English",
  url: "/audio/english-track.m4a" }], // Changed to object format,
drmEnabled: false,
encryptionStatus: "none", // Fixed to match expected type,
transcodingStatus: "completed",
originalFilename: "mission-impossible-final-reckoning.mp4",
fileSize: 2048000000,
bitRate: 128000,
frameRate: 30,
aspectRatio: ",
16:9",
language: "en",
country: "US",
isDownloadable: true,
downloadLimit: 5,
downloadExpiry: "",
monetized: true,
revenueShare: 0.7,
licenseKey: "",
licenseExpiry: "",
tags: ["spy", "thriller", "action"],
isProcessed: true,
processingProgress: 100,
category: "Action",
isPublic: true,
releaseDate: new Date("2025-01-15").toISOString(),
rating: "4.5",
isPremium: false,
creatorId: "studio1",
creatorName: "FingerMobile TV",
categories: ["Action"],
dislikes: 0,
uploader: "FingerMobile TV",
IARCClassification: iarcClassifications[0],
monetizationModel: monetizationModels[0],
uploadFee: 50,
length: 8280, // 2h 18m,
resolution: "4K",
contentTags: ["spy", "thriller", "action"],
createdAt: new Date("2025-01-15").toISOString(),
uploaderID: "studio1",
authorId: "studio1",
engagementScore: 0.92,
bitrate: 128000,
codec: "H.25",
sampleRate: 48000,
channels: 6,
downloadCount: 2500000,
shareCount: 450000,
saveCount: 320000,
likeCount: 3800000,
mashupCount: 85000,
lastModified: "2024-05-14",
visibility: "public",
licenseTerms: "Standard YouTube License",
parentalGuidelines: "PG-13",
iarcClassification: {classificationID: "iarc-1",
  rating: "PG-13",
  description: "Moderate action violence" },
complianceStatus: "approved",
captions: [],
chapters: [],
relatedVideos: [],
metadata: {},
analytics: {views: 1000000,
  uniqueViewers: 800000,
  averageWatchTime: 4000,
  completionRate: 0.85,
  engagementRate: 0.15,
  likes: 50000,
  dislikes: 0,
  shares: 25000,
  comments: 1500,
  revenueGenerated: 5000
      },
accessibilityFeatures: {audioDescription: true,
  signLanguage: false,
  easyToRead: false
      },
adInsertionPoints: [120, 300, 600],
adBreaks: [],
contentModerationStatus: "approved",
licensingHistory: [],
distributionChannels: ["streaming"],
syndicationRights: [{territory: "Global",
  duration: 365,
  exclusivity: true }],
contentProtection: {watermarking: true,
  fingerprinting: true,
  securePlayback: true
      },
userRatings: []
    },
    {id: "action2",
  videoID: "action2", // Extra property but OK due to indexer,
  title: "Fast &,
  Furious: Tokyo Drift",
  description: "High-speed street racing in the neon-lit streets of Tokyo.",
  genre: ["Action"], // Extra property but OK due to indexer,
  url: "/videos/action2.mp4",
  videoUrl: "/videos/action2.mp4", // Adding required property,
  duration: 6720,
  uploadDate: new Date("2025-02-20").toISOString(),
  thumbnail: "/images/fast-furious-thumb.jpg", // Changed from thumbnailUrl to thumbnail,
  thumbnailUrl: "/images/fast-furious-thumb.jpg", // Adding required property,
  views: 1800000,
  likes: 2900000,
  subtitles: [],
  audioTracks: [{
  language: "English",
  url: "/audio/english-track.m4a" }, {language: "Japanese",
  url: "/audio/japanese-track.m4a" }],
drmEnabled: false,
encryptionStatus: "none",
transcodingStatus: "completed",
originalFilename: "fast-furious-tokyo-drift.mp4",
fileSize: 1843200000,
bitRate: 112000,
frameRate: 30,
aspectRatio: ",
16:9",
language: "en",
country: "JP",
isDownloadable: true,
downloadLimit: 5,
downloadExpiry: "",
monetized: true,
revenueShare: 0.7,
licenseKey: "",
licenseExpiry: "",
dislikes: 0,
isPublic: true,
      // Adding missing required properties,
releaseDate: new Date("2025-02-20").toISOString(),
rating: "4.2",
isPremium: false,
creatorId: "studio2",
creatorName: "Fast Films",
categories: ["Action"],
isProcessed: true,
processingProgress: 100,
category: "Action",
tags: ["racing", "cars", "tokyo"],
parentalGuidelines: "PG-13",
iarcClassification: {classificationID: "iarc-4",
  rating: "PG-13",
  description: "Moderate violence" },
complianceStatus: "approved",
monetizationModel: {modelID: "model-2",
  name: "Gem Pack",
  description: "Revenue sharing model",
  revenueShare: 0.7,
  thresholds: {
  likes: 100,
  shares: 50,
  comments: 25 } },
lastModified: "2024-05-14",
visibility: "public",
licenseTerms: "Standard YouTube License",
contentModerationStatus: "approved",
moderationNotes: "Passed automated review",
creatorRevenue: 11000.75,
platformRevenue: 4950.34,
royaltyAmount: 1100.08,
licensingHistory: [{date: "2024-02-20",
  licensee: "GlobalStream Inc.",
  territory: "NA",
  amount: 2200.00
      }],
distributionChannels: ["YouTube", "Dancia4TV", "Mobile App"],
syndicationRights: [{territory: "Global",
  duration: 365,
  exclusivity: true
      }],
contentProtection: {watermarking: true,
  fingerprinting: true,
  securePlayback: true
      },
userRatings: [],
contentWarnings: ["Action", "Violence", "Explosions"],
ageRating: 13,
accessibilityCompliance: true,
contentAuthenticity: {verificationStatus: "verified",
  verificationMethod: "Blockchain hash verification",
  authenticityScore: 97.2
      },
captions: [],
chapters: [],
relatedVideos: [],
metadata: {},
analytics: {views: 1800000,
  uniqueViewers: 1500000,
  averageWatchTime: 75,
  completionRate: 0.68,
  engagementRate: 0.14,
  likes: 2900000,
  dislikes: 0,
  shares: 5800,
  comments: 1900,
  revenueGenerated: 11000.75
      },
accessibilityFeatures: {audioDescription: true,
  signLanguage: false,
  easyToRead: false
      },
accessibilityOptions: {audioDescriptionUrl: "/accessibility/fast-x-audio-description.mp4"
      },
adInsertionPoints: [0, 300, 1200, 2400, 3600],
adBreaks: [
        {startTime: 0,
  duration: 30,
  adType: "preroll"
        },
        {startTime: 600,
  duration: 15,
  adType: "midroll"
        }
      ]
    },
  // Drama
  {id: "drama1",
  videoID: "drama1",
  title: "The Last,
  Kingdom: Season 5",
  description: "The final season of the epic Viking saga continues.",
  genre: ["Drama"],
  url: "/videos/drama1.mp4",
  videoUrl: "/videos/drama1.mp4", // Adding required property,
  duration: 18000,
  uploadDate: new Date("2025-03-10").toISOString(),
  thumbnailUrl: "/images/last-kingdom-thumb.jpg",
  thumbnail: "/images/last-kingdom-thumb.jpg", // Adding required property,
  views: 3200000,
  likes: 4800000,
  subtitles: [],
  audioTracks: [{
  language: "English",
  url: "/audio/english-track.m4a" }],
drmEnabled: false,
encryptionStatus: "none",
transcodingStatus: "completed",
originalFilename: "the-last-kingdom-season-5.mp4",
fileSize: 4096000000,
bitRate: 144000,
frameRate: 30,
aspectRatio: ",
16:9",
language: "en",
country: "GB",
isDownloadable: true,
downloadLimit: 5,
downloadExpiry: "",
monetized: true,
revenueShare: 0.7,
licenseKey: "",
licenseExpiry: "",
dislikes: 0, // Adding missing required property,
isPublic: true,
tags: ["viking", "historical", "drama"],
    // Adding missing required properties,
creatorId: "studio3",
creatorName: "FingerMobile TV",
categories: ["Drama"],
isProcessed: true,
processingProgress: 100,
category: "Drama",
releaseDate: new Date("2025-03-10").toISOString(),
rating: "4.7",
isPremium: false,
IARCClassification: iarcClassifications[0],
monetizationModel: monetizationModels[2],
uploadFee: 50,
length: 18000,
resolution: "4K",
contentTags: ["viking", "historical", "drama"],
createdAt: new Date("2025-03-10").toISOString(),
uploaderID: "studio3",
authorId: "studio3",
engagementScore: 0.95,
bitrate: 128000,
codec: "H.25",
sampleRate: 48000,
channels: 6,
downloadCount: 3200000,
shareCount: 580000,
saveCount: 420000,
likeCount: 4800000,
mashupCount: 95000,
uploader: "FingerMobile TV"
  },
  {id: "drama2",
  videoID: "drama2",
  title: "The Last,
  Kingdom: Season 5",
  description: "The final season of the epic Viking saga continues.",
  genre: ["Drama"],
  url: "/videos/drama2.mp4",
  videoUrl: "/videos/drama2.mp4",
  duration: 3240,
  uploadDate: new Date("2025-03-15").toISOString(),
  thumbnail: "/images/last-kingdom-thumb.jpg",
  thumbnailUrl: "/images/last-kingdom-thumb.jpg",
  views: 1500000,
  likes: 2500000,
  // Adding more missing properties required by Video interface,
  subtitles: [],
  audioTracks: [{
  language: "English",
  url: "/audio/english-track.m4a" }],
drmEnabled: false,
encryptionStatus: "none",
transcodingStatus: "completed",
originalFilename: "the-last-kingdom-s5-finale.mp4",
fileSize: 1638400000,
bitRate: 95000,
frameRate: 30,
aspectRatio: ",
16:9",
language: "en",
country: "UK",
isDownloadable: true,
downloadLimit: 3,
downloadExpiry: "30d",
monetized: true,
revenueShare: 0.65,
licenseKey: "LAST-KINGDOM-S5-2025",
licenseExpiry: "2026-03-15",
dislikes: 0,
isPublic: true,
    // Adding missing required properties,
releaseDate: new Date("2025-03-15").toISOString(),
rating: "4.5",
isPremium: false,
creatorId: "studio3",
creatorName: "Viking Studios",
categories: ["Drama"],
isProcessed: true,
processingProgress: 100,
category: "Drama",
tags: ["vikings", "historical", "epic"],
parentalGuidelines: "TV-14",
iarcClassification: {classificationID: "iarc-5",
  rating: "PG-13",
  description: "Moderate violence" },
complianceStatus: "approved",
monetizationModel: {modelID: "model-3",
  name: "UGC Upload",
  description: "User-generated content model",
  revenueShare: 0.6,
  thresholds: {
  likes: 50,
  shares: 25,
  comments: 10 } },
lastModified: "2024-05-14",
visibility: "public",
licenseTerms: "Standard YouTube License",
contentModerationStatus: "approved",
moderationNotes: "Passed automated and manual review",
creatorRevenue: 9750.25,
platformRevenue: 3393.09,
royaltyAmount: 975.03,
licensingHistory: [{date: "2024-03-15",
  licensee: "GlobalStream Inc.",
  territory: "NA",
  amount: 1950.00
    }],
distributionChannels: ["YouTube", "Dancia4TV", "Mobile App"],
syndicationRights: [{territory: "Global",
  duration: 365,
  exclusivity: true
    }],
contentProtection: {watermarking: true,
  fingerprinting: true,
  securePlayback: true
    },
userRatings: [],
contentWarnings: ["Violence", "Adult themes"],
ageRating: 14,
accessibilityCompliance: true,
contentAuthenticity: {verificationStatus: "verified",
  verificationMethod: "Blockchain hash verification",
  authenticityScore: 96.8
    },
captions: [],
chapters: [],
relatedVideos: [],
metadata: {},
analytics: {views: 1500000,
  uniqueViewers: 1200000,
  averageWatchTime: 85,
  completionRate: 0.78,
  engagementRate: 0.13,
  likes: 2500000,
  dislikes: 0,
  shares: 4500,
  comments: 1800,
  revenueGenerated: 9750.25
    },
accessibilityFeatures: {audioDescription: true,
  signLanguage: false,
  easyToRead: false
    },
accessibilityOptions: {audioDescriptionUrl: "/accessibility/last-kingdom-audio-description.mp4"
    },
adInsertionPoints: [0, 300, 1200, 2400],
adBreaks: [
      {startTime: 0,
  duration: 30,
  adType: "preroll"
      },
      {startTime: 900,
  duration: 15,
  adType: "midroll"
      }
    ],
uploader: "FingerMobile TV"
  },
  // Comedy
  {id: "comedy1",
  videoID: "comedy1",
  title: ",
  Superbad: College Days",
  description: "Two best friends navigate the chaos of college life.",
  genre: ["Comedy"],
  url: "/videos/comedy1.mp4",
  videoUrl: "/videos/comedy1.mp4", // Adding required property,
  duration: 6120,
  uploadDate: new Date("2025-01-30").toISOString(),
  thumbnailUrl: "/images/superbad-thumb.jpg",
  thumbnail: "/images/superbad-thumb.jpg", // Adding required property,
  views: 1500000,
  likes: 2200000,
  // Adding more missing properties required by Video interface,
  subtitles: [],
  audioTracks: [{
  language: "English",
  url: "/audio/english-track.m4a" }],
drmEnabled: false,
encryptionStatus: "none",
transcodingStatus: "completed",
originalFilename: "superbad-college-days.mp4",
fileSize: 1638400000,
bitRate: 108000,
frameRate: 30,
aspectRatio: ",
16:9",
language: "en",
country: "US",
isDownloadable: true,
downloadLimit: 5,
downloadExpiry: "",
monetized: true,
revenueShare: 0.7,
licenseKey: "",
licenseExpiry: "",
dislikes: 0, // Adding missing required property,
isPublic: true,
tags: ["college", "friendship", "comedy"],
    // Adding missing required properties,
creatorId: "studio4",
creatorName: "FingerMobile TV",
categories: ["Comedy"],
isProcessed: true,
processingProgress: 100,
category: "Comedy",
releaseDate: new Date("2025-01-30").toISOString(),
rating: "4.1",
isPremium: false,
IARCClassification: iarcClassifications[0],
monetizationModel: monetizationModels[0],
uploadFee: 50,
length: 6120,
resolution: "1080p",
contentTags: ["college", "friendship", "comedy"],
createdAt: new Date("2025-01-30").toISOString(),
uploaderID: "studio4",
authorId: "studio4",
engagementScore: 0.85,
bitrate: 96000,
codec: "H.24",
sampleRate: 44100,
channels: 2,
downloadCount: 1500000,
shareCount: 280000,
saveCount: 190000,
likeCount: 2200000,
mashupCount: 45000,
uploader: "FingerMobile TV"
  },
  // Horror
  {id: "horror1",
  videoID: "horror1",
  title: "The,
  Conjuring: Shadows",
  description: "A family encounters malevolent spirits in their new home.",
  genre: ["Horror"],
  url: "/videos/horror1.mp4",
  videoUrl: "/videos/horror1.mp4", // Adding required property,
  duration: 7080,
  uploadDate: new Date("2025-02-14").toISOString(),
  thumbnailUrl: "/images/conjuring-thumb.jpg",
  thumbnail: "/images/conjuring-thumb.jpg", // Adding required property,
  views: 2100000,
  likes: 3100000,
  // Adding more missing properties required by Video interface,
  subtitles: [],
  audioTracks: [{
  language: "English",
  url: "/audio/english-track.m4a" }],
drmEnabled: false,
encryptionStatus: "none",
transcodingStatus: "completed",
originalFilename: "the-conjuring-shadows.mp4",
fileSize: 2048000000,
bitRate: 112000,
frameRate: 30,
aspectRatio: ",
16:9",
language: "en",
country: "US",
isDownloadable: true,
downloadLimit: 5,
downloadExpiry: "",
monetized: true,
revenueShare: 0.7,
licenseKey: "",
licenseExpiry: "",
dislikes: 0, // Adding missing required property,
isPublic: true,
tags: ["supernatural", "scary", "horror"],
    // Adding missing required properties,
creatorId: "studio5",
creatorName: "FingerMobile TV",
categories: ["Horror"],
isProcessed: true,
processingProgress: 100,
category: "Horror",
releaseDate: new Date("2025-02-14").toISOString(),
rating: "4.3",
isPremium: false,
IARCClassification: iarcClassifications[0],
monetizationModel: monetizationModels[1],
uploadFee: 50,
length: 7080,
resolution: "4K",
contentTags: ["supernatural", "scary", "horror"],
createdAt: new Date("2025-02-14").toISOString(),
uploaderID: "studio5",
authorId: "studio5",
engagementScore: 0.89,
bitrate: 112000,
codec: "H.25",
sampleRate: 48000,
channels: 6,
downloadCount: 2100000,
shareCount: 390000,
saveCount: 280000,
likeCount: 3100000,
mashupCount: 72000,
uploader: "FingerMobile TV"
  },
  // Adventure
  {id: "adventure1",
  videoID: "adventure1",
  title: "Indiana,
  Jones: The Lost Artifact",
  description:
      "The legendary archaeologist searches for a mysterious ancient artifact.",
  genre: ["Adventure"],
  url: "/videos/adventure1.mp4",
  videoUrl: "/videos/adventure1.mp4", // Adding required property,
  duration: 8100,
  uploadDate: new Date("2025-03-22").toISOString(),
  thumbnailUrl: "/images/indiana-jones-thumb.jpg",
  thumbnail: "/images/indiana-jones-thumb.jpg", // Adding required property,
  views: 2800000,
  likes: 4100000,
  // Adding more missing properties required by Video interface,
  subtitles: [],
  audioTracks: [{
  language: "English",
  url: "/audio/english-track.m4a" }],
drmEnabled: false,
encryptionStatus: "none",
transcodingStatus: "completed",
originalFilename: "indiana-jones-lost-artifact.mp4",
fileSize: 2457600000,
bitRate: 128000,
frameRate: 30,
aspectRatio: ",
16:9",
language: "en",
country: "US",
isDownloadable: true,
downloadLimit: 5,
downloadExpiry: "",
monetized: true,
revenueShare: 0.7,
licenseKey: "",
licenseExpiry: "",
dislikes: 0, // Adding missing required property,
isPublic: true,
tags: ["archaeology", "treasure", "adventure"],
    // Adding missing required properties,
creatorId: "studio1",
creatorName: "FingerMobile TV",
categories: ["Adventure"],
isProcessed: true,
processingProgress: 100,
category: "Adventure",
releaseDate: new Date("2025-03-22").toISOString(),
rating: "4.6",
isPremium: false,
IARCClassification: iarcClassifications[0],
monetizationModel: monetizationModels[2],
uploadFee: 50,
length: 8100,
resolution: "4K",
contentTags: ["archaeology", "treasure", "adventure"],
createdAt: new Date("2025-03-22").toISOString(),
uploaderID: "studio1",
authorId: "studio1",
engagementScore: 0.93,
bitrate: 128000,
codec: "H.25",
sampleRate: 48000,
channels: 6,
downloadCount: 2800000,
shareCount: 510000,
saveCount: 380000,
likeCount: 4100000,
mashupCount: 92000,
uploader: "FingerMobile TV"
  },
  // Superhero
  {id: "superhero1",
  videoID: "superhero1",
  title: ",
  Marvel: Infinity War Part II",
  description:
      "The Avengers face their greatest threat yet in this epic conclusion.",
  genre: ["Superhero"],
  url: "/videos/superhero1.mp4",
  videoUrl: "/videos/superhero1.mp4", // Adding required property,
  duration: 9600,
  uploadDate: new Date("2025-04-05").toISOString(),
  thumbnailUrl: "/images/avengers-thumb.jpg",
  thumbnail: "/images/avengers-thumb.jpg", // Adding required property,
  views: 5200000,
  likes: 7800000,
  // Adding more missing properties required by Video interface,
  subtitles: [], // Fixed to match expected type,
  audioTracks: [
      {
  language: "English",
  url: "/audio/english-track.m4a" },
      {language: "Spanish",
  url: "/audio/spanish-track.m4a" },
      {language: "French",
  url: "/audio/french-track.m4a" }
    ],
drmEnabled: true,
encryptionStatus: "full", // Fixed to match expected type ("none" | "partial" | "full"),
transcodingStatus: "completed",
originalFilename: "marvel-infinity-war-part-2.mp4",
fileSize: 2867200000,
bitRate: 150000,
frameRate: 24,
aspectRatio: "2.,
35:1",
language: "en",
country: "US",
isDownloadable: true,
downloadLimit: 3,
downloadExpiry: "30d",
monetized: true,
revenueShare: 0.75,
licenseKey: "MCU-2025-INFINITY-WAR-II",
licenseExpiry: "2026-04-05",
dislikes: 0, // Adding missing required property,
isPublic: true,
tags: ["marvel", "avengers", "superhero"],
    // Adding missing required properties,
creatorId: "studio6",
creatorName: "FingerMobile TV",
categories: ["Superhero"],
isProcessed: true,
processingProgress: 100,
category: "Superhero",
releaseDate: new Date("2025-04-05").toISOString(),
rating: "4.8",
isPremium: true,
IARCClassification: iarcClassifications[0],
monetizationModel: monetizationModels[2],
uploadFee: 50,
length: 9600,
resolution: "4K",
contentTags: ["marvel", "avengers", "superhero"],
createdAt: new Date("2025-04-05").toISOString(),
uploaderID: "studio6",
authorId: "studio6",
engagementScore: 0.98,
bitrate: 144000,
codec: "H.25",
sampleRate: 48000,
channels: 6,
downloadCount: 5200000,
shareCount: 980000,
saveCount: 720000,
likeCount: 7800000,
mashupCount: 150000,
uploader: "FingerMobile TV"
  },
  {id: "superhero2",
  videoID: "superhero2",
  title: ",
  Avengers: Age of Ultron",
  description:
      "The Avengers face their greatest threat yet in this epic conclusion.",
  genre: ["Superhero"],
  url: "/videos/superhero2.mp4",
  videoUrl: "/videos/superhero2.mp4", // Adding required property,
  duration: 9600,
  uploadDate: new Date("2025-04-05").toISOString(),
  thumbnailUrl: "/images/avengers-thumb.jpg",
  thumbnail: "/images/avengers-thumb.jpg", // Adding required property,
  views: 5200000,
  likes: 7800000,
  // Adding more missing properties required by Video interface,
  subtitles: [],
  audioTracks: [{
  language: "English",
  url: "/audio/english-track.m4a" }],
drmEnabled: false,
encryptionStatus: "none",
transcodingStatus: "completed",
originalFilename: "avengers-age-of-ultron.mp4",
fileSize: 2048000000,
bitRate: 100000,
frameRate: 30,
aspectRatio: ",
16:9",
language: "en",
country: "US",
isDownloadable: true,
downloadLimit: 3,
downloadExpiry: "30d",
monetized: true,
revenueShare: 0.7,
licenseKey: "AVENGERS-AOU-2025",
licenseExpiry: "2026-12-31",
parentalGuidelines: "PG-13",
iarcClassification: {classificationID: "iarc-2",
  rating: "PG-13",
  description: "Moderate violence and action" },
complianceStatus: "approved",
geoRestrictions: [],
monetizationModel: {modelID: "model-2",
  name: "Gem Pack",
  description: "Premium revenue sharing",
  revenueShare: 0.7,
  thresholds: {
  likes: 100,
  shares: 50,
  comments: 20 } },
lastModified: "2024-05-14",
visibility: "public",
licenseTerms: "Standard YouTube License",
contentModerationStatus: "approved",
moderationNotes: "Passed automated and manual review",
creatorRevenue: 12500.50,
platformRevenue: 5625.23,
royaltyAmount: 1250.05,
licensingHistory: [{date: "2024-01-15",
  licensee: "GlobalStream Inc.",
  territory: "NA",
  amount: 2500.00
    }],
distributionChannels: ["YouTube", "Dancia4TV", "Mobile App"],
syndicationRights: [{territory: "Global",
  duration: 365,
  exclusivity: true
    }],
contentProtection: {watermarking: true,
  fingerprinting: true,
  securePlayback: true
    },
userRatings: [],
contentWarnings: ["Violence", "Action sequences"],
ageRating: 13,
accessibilityCompliance: true,
contentAuthenticity: {verificationStatus: "verified",
  verificationMethod: "Blockchain hash verification",
  authenticityScore: 98.5
    },
captions: [],
chapters: [],
relatedVideos: [],
metadata: {},
analytics: {views: 1500000,
  uniqueViewers: 1250000,
  averageWatchTime: 78,
  completionRate: 0.65,
  engagementRate: 0.12,
  likes: 25000,
  dislikes: 500,
  shares: 5000,
  comments: 1500,
  revenueGenerated: 12500.50
    },
accessibilityFeatures: {audioDescription: true,
  signLanguage: false,
  easyToRead: false
    },
accessibilityOptions: {audioDescriptionUrl: "/accessibility/avengers-audio-description.mp4"
    },
adInsertionPoints: [0, 300, 1200, 2400],
adBreaks: [
      {startTime: 0,
  duration: 30,
  adType: "preroll"
      },
      {startTime: 300,
  duration: 15,
  adType: "midroll"
      }
    ],
mashupCount: 50000
  }
];

// Mock Playlists
export const,
mockPlaylists: Playlist[] = [
  {id: "1",
  playlistID: "1",
  title: "Action Favorites",
  name: "Action Favorites",
  creator: "member1",
  ownerID: "member1",
  videos: ["action1", "action2"],
  tracks: [], // Adjust if tracks are required,
  trackCount: 2,
  duration: 14400,
  followers: 120,
  isCollaborative: false,
  isEditable: true,
  plays: 500,
  shares: 45,
  likes: 150,
  isPublic: true,
  createdAt: new Date("2025-01-20").toISOString(),
  updatedAt: new Date("2025-03-15").toISOString(),
  tags: ["Action"],
  metadata: {
  artist: "Various",
  album: "Action Collection",
  tracks: [
        "Mission,
  Impossible: Final Reckoning",
  "Fast &,
  Furious: Tokyo Drift"
      ],
  genres: ["Action"],
  length: 14400, // Total length in seconds,
  fileSize: 20480000000, // In bytes
    }
  },
  {id: "2",
  playlistID: "2",
  title: "Drama Series Marathon",
  name: "Drama Series Marathon", // This might be extra but OK due to indexer,
  description: "A collection of popular drama series for marathon viewing",
  creator: "member2", // This might be extra but OK due to indexer,
  creatorId: "member2",
  creatorName: "DramaFan",
  ownerID: "member2",
  videos: ["drama1"],
  tracks: [],
  trackCount: 1,
  duration: 18000, // This is the total duration of videos,
  different from the property below,
  followers: 85,
  isCollaborative: false,
  isEditable: true,
  plays: 300,
  shares: 20,
  likes: 90,
  isPublic: true,
  createdAt: new Date("2025-01-25").toISOString(),
  updatedAt: new Date("2025-01-25").toISOString(),
  viewCount: 0,
  likeCount: 0,
  shareCount: 0,
  commentCount: 0,
  tags: ["Drama"],
  categories: ["Series"],
  // Removed duplicate properties,
  metadata: {}, // This remains as required,
featured: false,
promoted: false,
promotionExpiry: undefined, // Adding if needed,
playlistType: "custom",
autoGenerateCriteria: undefined, // Adding if needed,
sortingOrder: "chronological",
    // Using the duration property for the Playlist interface duration,
language: "en",
region: "US",
contentModerationStatus: "approved",
moderationNotes: undefined, // Adding if needed,
monetizationEnabled: false,
monetizationModel: undefined, // Adding if needed,
revenueGenerated: 0,
thumbnailUrl: "/images/drama-playlist-thumb.jpg",
privacy: "public",
lastUpdatedBy: "member2",
version: 1,
syncWithPersonalCollection: false,
allowComments: true,
allowEmbedding: false,
allowDownload: false,
sharingPermissions: {shareExternally: true,
  embedAllowed: false,
  downloadAllowed: false,
  restrictToOrganization: false
    },
recommendations: {algorithm: "popular",
  enabled: true,
  criteria: ["views", "likes"]
    },
analytics: {totalViews: 0,
  uniqueViewers: 0,
  averageCompletionRate: 0,
  engagementMetrics: {
  clicks: 0,
  impressions: 0,
  ctr: 0
      }
    },
parentalGuidelines: "Suitable for mature audiences",
iarcClassification: undefined, // Adding if needed,
contentWarnings: [],
ageRating: 16,
accessibilityFeatures: {audioDescription: false,
  signLanguage: false,
  easyToRead: false
    },
contentAuthenticity: {verificationStatus: "verified",
  verificationMethod: "manual",
  authenticityScore: 100
    },
collaborators: undefined, // Adding if needed,
thumbnailBlurDataURL: undefined, // Adding if needed
  }
];

// Video genres
export const videoGenres = [
  "Action",
  "Drama",
  "Comedy",
  "Horror",
  "Adventure",
  "Superhero",
  "Animation",
  "Romantic Comedy",
  "Buddy Comedy",
  "Dark Comedy",
  "Slapstick Comedy",
  "Crime",
  "Gangster",
  "Heist",
  "Caper",
  "Medical Drama",
  "Political Drama",
  "Fantasy",
  "Urban Fantasy",
  "High Fantasy",
  "Myth",
  "Historical",
  "Biography",
  "Docudrama"
];

// Movie type choices
export const movieTypeChoices = [
  "Nollywood",
  "Cannywood",
  "Hollywood",
  "Bollywood",
  "Chinese and Tamil movies",
  "Korean",
  "South African and Australian movies",
  "Mexican, Venezuelan and Puerto Rican",
  "Thai and Philippines",
  "French, German and Swiss",
  "Japanese and Taiwan"
];
