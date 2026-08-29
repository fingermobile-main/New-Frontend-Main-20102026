import Database from 'better-sqlite3';
import { promises as fs } from 'fs';
import path from 'path';

// In-memory storage for development
let db: Map<string, any> = new Map();

// Initialize database
const initializeDatabase = async () => {
  try {
    // Load persisted data if it exists
    const dbPath = path.join(process.cwd(), 'db.json');
    try {
      const data = await fs.readFile(dbPath, 'utf8');
      db = new Map(Object.entries(JSON.parse(data)));
    } catch (error) {
      // File doesn't exist yet, initialize with defaults
      console.log('Initializing new database...');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Persist database to file
const persistDatabase = async () => {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    await fs.writeFile(dbPath, JSON.stringify(Object.fromEntries(db), null, 2));
  } catch (error) {
    console.error('Error persisting database:', error);
  }
};

// Initialize database connection
const db = new Database('./fingermobile.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    fullName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    age INTEGER,
    countryCode TEXT,
    accountAgeDays INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS hallmark_pages (
    id TEXT PRIMARY KEY,
    ownerUserId TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    followersCount INTEGER DEFAULT 0,
    visibility TEXT DEFAULT 'public',
    freeUntil DATETIME,
    billingPlan TEXT DEFAULT 'free_trial',
    verifiedBusiness BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerUserId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS monetization_applications (
    id TEXT PRIMARY KEY,
    hallmarkPageId TEXT NOT NULL,
    productKey TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    submittedAt DATETIME,
    decisionNotes TEXT,
    FOREIGN KEY (hallmarkPageId) REFERENCES hallmark_pages(id)
  );

  CREATE TABLE IF NOT EXISTS platform_config (
    id TEXT PRIMARY KEY,
    minimumAge INTEGER DEFAULT 18,
    minimumPayoutThreshold REAL DEFAULT 100.0,
    hallmarkMonthlyFee REAL DEFAULT 9.99,
    hallmarkYearlyFee REAL DEFAULT 99.99,
    revenueSharePercentage REAL DEFAULT 50.0,
    giftsCashValue REAL DEFAULT 0.05,
    supportedCountries TEXT DEFAULT '["US", "CA", "GB"]',
    policyVersion TEXT DEFAULT '1.0.0',
    affiliateBonusPercentage REAL DEFAULT 10.0
  );
`);

export { db, initializeDatabase, persistDatabase };
