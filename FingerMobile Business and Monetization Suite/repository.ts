import { promises as fs } from 'fs';
import path from 'path';

// Import types
import type {
  User,
  SeshatPage,
  MonetizationMetrics,
  PlatformConfig,
  PayoutAccount,
  MonetizationApplication,
  KYCRecord,
  KYBRecord,
  ContentPost,
  InboxMessage,
  Conversation,
  AdCampaign,
  Subscription,
  ShopProduct,
  Lead,
  AnalyticsEvent,
  TeamMember,
  ContentMetrics,
  WebhookEvent,
  AffiliateEvent,
  AuditLog,
  BusinessVerification,
  Payout,
  RevenueLedgerEntry
} from './types';

// Define file paths for data persistence
const DATA_DIR = './data';
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESHAT_PAGES_FILE = path.join(DATA_DIR, 'seshat_pages.json');
const METRICS_FILE = path.join(DATA_DIR, 'metrics.json');

// Ensure data directory exists
async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Helper function to read JSON file
async function readJsonFile(filePath: string): Promise<any[]> {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Helper function to write JSON file
async function writeJsonFile(filePath: string, data: any[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Repository functions
export const findAllUsers = async (): Promise<User[]> => {
  await ensureDataDir();
  return await readJsonFile(USERS_FILE);
};

export const findUserById = async (id: string): Promise<User | undefined> => {
  const users = await findAllUsers();
  return users.find(user => user.id === id);
};

export const createUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  await ensureDataDir();
  const users = await findAllUsers();
  
  const newUser: User = {
    ...userData,
    id: `user_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  await writeJsonFile(USERS_FILE, users);
  
  return newUser;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User | null> => {
  await ensureDataDir();
  const users = await findAllUsers();
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return null;
  }
  
  users[userIndex] = { ...users[userIndex], ...userData, updatedAt: new Date().toISOString() };
  await writeJsonFile(USERS_FILE, users);
  
  return users[userIndex];
};

export const findAllSeshatPages = async (): Promise<SeshatPage[]> => {
  await ensureDataDir();
  return await readJsonFile(SESHAT_PAGES_FILE);
};

export const findSeshatPageById = async (id: string): Promise<SeshatPage | undefined> => {
  const pages = await findAllSeshatPages();
  return pages.find(page => page.id === id);
};

export const createSeshatPage = async (pageData: Omit<SeshatPage, 'id' | 'createdAt' | 'followersCount' | 'billingPlan' | 'verifiedBusiness'>): Promise<SeshatPage> => {
  await ensureDataDir();
  const pages = await findAllSeshatPages();
  
  const newPage: SeshatPage = {
    ...pageData,
    id: `page_${Date.now()}`,
    followersCount: 0,
    billingPlan: 'free_trial',
    verifiedBusiness: false,
    createdAt: new Date().toISOString(),
  };
  
  pages.push(newPage);
  await writeJsonFile(SESHAT_PAGES_FILE, pages);
  
  return newPage;
};

export const updateSeshatPage = async (id: string, pageData: Partial<SeshatPage>): Promise<SeshatPage | null> => {
  await ensureDataDir();
  const pages = await findAllSeshatPages();
  const pageIndex = pages.findIndex(page => page.id === id);
  
  if (pageIndex === -1) {
    return null;
  }
  
  pages[pageIndex] = { ...pages[pageIndex], ...pageData };
  await writeJsonFile(SESHAT_PAGES_FILE, pages);
  
  return pages[pageIndex];
};

export const findAllMetrics = async (): Promise<MonetizationMetrics[]> => {
  await ensureDataDir();
  return await readJsonFile(METRICS_FILE);
};

export const findMetricsByUserId = async (userId: string): Promise<MonetizationMetrics | undefined> => {
  const metrics = await findAllMetrics();
  return metrics.find(m => m.id === userId); // Note: This assumes id field in metrics refers to userId
};

export const createMetrics = async (metricsData: Omit<MonetizationMetrics, 'id'>): Promise<MonetizationMetrics> => {
  await ensureDataDir();
  const metrics = await findAllMetrics();
  
  const newMetrics: MonetizationMetrics = {
    ...metricsData,
    id: `metrics_${Date.now()}`,
  };
  
  metrics.push(newMetrics);
  await writeJsonFile(METRICS_FILE, metrics);
  
  return newMetrics;
};

export const updateMetrics = async (id: string, metricsData: Partial<MonetizationMetrics>): Promise<MonetizationMetrics | null> => {
  await ensureDataDir();
  const metrics = await findAllMetrics();
  const metricIndex = metrics.findIndex(m => m.id === id);
  
  if (metricIndex === -1) {
    return null;
  }
  
  metrics[metricIndex] = { ...metrics[metricIndex], ...metricsData };
  await writeJsonFile(METRICS_FILE, metrics);
  
  return metrics[metricIndex];
};

// Additional repository methods for other entities would go here
// For brevity, I'm implementing a few key ones:

export const createMonetizationApplication = async (
  applicationData: Omit<MonetizationApplication, 'id' | 'submittedAt' | 'status'>
): Promise<MonetizationApplication> => {
  const newApplication: MonetizationApplication = {
    ...applicationData,
    id: `app_${Date.now()}`,
    status: 'submitted',
    submittedAt: new Date().toISOString(),
  };
  return newApplication;
};

export const createKYCRecord = async (
  kycData: Omit<KYCRecord, 'id' | 'submittedAt' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<KYCRecord> => {
  const newKYC: KYCRecord = {
    ...kycData,
    id: `kyc_${Date.now()}`,
    status: 'PENDING',
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return newKYC;
};

export const createKYBRecord = async (
  kybData: Omit<KYBRecord, 'id' | 'submittedAt' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<KYBRecord> => {
  const newKYB: KYBRecord = {
    ...kybData,
    id: `kyb_${Date.now()}`,
    status: 'PENDING',
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return newKYB;
};