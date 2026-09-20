import { Pool, QueryResult } from 'pg';
import { 
  BusinessSuiteOverview, 
  MonetizationMetrics, 
  PlatformConfig, 
  AdminData, 
  Revenue,
  Eligibility
} from './shared/types';

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'fingermobile_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// Repository interfaces
interface BusinessSuiteOverviewRepository {
  findByUserId(userId: string): Promise<BusinessSuiteOverview | null>;
  create(overview: Omit<BusinessSuiteOverview, 'id'>): Promise<BusinessSuiteOverview>;
  update(userId: string, overview: Partial<BusinessSuiteOverview>): Promise<BusinessSuiteOverview>;
}

interface MonetizationMetricsRepository {
  findByUserId(userId: string): Promise<MonetizationMetrics | null>;
  create(metrics: Omit<MonetizationMetrics, 'id'>): Promise<MonetizationMetrics>;
  update(userId: string, metrics: Partial<MonetizationMetrics>): Promise<MonetizationMetrics>;
}

interface PlatformConfigRepository {
  findById(id: string): Promise<PlatformConfig | null>;
  update(id: string, config: Partial<PlatformConfig>): Promise<PlatformConfig>;
}

interface AdminDataRepository {
  findById(id: string): Promise<AdminData | null>;
  update(id: string, data: Partial<AdminData>): Promise<AdminData>;
}

interface RevenueRepository {
  findByUserId(userId: string): Promise<Revenue | null>;
  create(revenue: Omit<Revenue, 'id'>): Promise<Revenue>;
  update(userId: string, revenue: Partial<Revenue>): Promise<Revenue>;
}

// Define a type for objects that include a userId
interface WithUserId {
  userId: string;
}

// Define a type for eligibility with products
interface EligibilityWithProducts {
  userId: string;
  products?: Array<{
    product: string;
    status: string;
    passedRules?: string[];
    failedRules?: string[];
    nextActions?: string[];
  }>;
  // Include other Eligibility properties here as needed
  universalStatus: 'eligible' | 'ineligible' | 'conditional';
}

// Implementations
export const businessSuiteOverviewRepository: BusinessSuiteOverviewRepository = {
  async findByUserId(userId: string): Promise<BusinessSuiteOverview | null> {
    const result: QueryResult = await pool.query(
      'SELECT * FROM business_suite_overviews WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  },

  async create(overview: Omit<BusinessSuiteOverview, 'id'>): Promise<BusinessSuiteOverview> {
    // Extract userId separately since it's not part of the overview object itself
    const { userId, ...overviewData } = overview as WithUserId & Omit<BusinessSuiteOverview, 'id'>;
    
    // Convert object properties to individual parameters
    const columns = Object.keys(overviewData);
    const values = Object.values(overviewData);
    
    // Build dynamic query
    const paramCount = columns.length;
    const placeholders = Array.from({ length: paramCount }, (_, i) => `$${i + 1}`).join(', ');
    
    const query = `
      INSERT INTO business_suite_overviews (${columns.join(', ')}, user_id)
      VALUES (${placeholders}, $${paramCount + 1})
      RETURNING *
    `;
    
    const result: QueryResult = await pool.query(query, [...values, userId]);
    return result.rows[0];
  },

  async update(userId: string, overview: Partial<BusinessSuiteOverview>): Promise<BusinessSuiteOverview> {
    const columns = Object.keys(overview);
    if (columns.length === 0) {
      throw new Error('No fields to update');
    }
    
    const values = Object.values(overview);
    const setClause = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');
    
    const query = `
      UPDATE business_suite_overviews
      SET ${setClause}
      WHERE user_id = $${values.length + 1}
      RETURNING *
    `;
    
    const result: QueryResult = await pool.query(query, [...values, userId]);
    return result.rows[0];
  }
};

export const monetizationMetricsRepository: MonetizationMetricsRepository = {
  async findByUserId(userId: string): Promise<MonetizationMetrics | null> {
    const result: QueryResult = await pool.query(
      'SELECT * FROM monetization_metrics WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  },

  async create(metrics: Omit<MonetizationMetrics, 'id'>): Promise<MonetizationMetrics> {
    const { userId, ...metricsData } = metrics as WithUserId & Omit<MonetizationMetrics, 'id'>;
    
    const columns = Object.keys(metricsData);
    const values = Object.values(metricsData);
    
    const paramCount = columns.length;
    const placeholders = Array.from({ length: paramCount }, (_, i) => `$${i + 1}`).join(', ');
    
    const query = `
      INSERT INTO monetization_metrics (${columns.join(', ')}, user_id)
      VALUES (${placeholders}, $${paramCount + 1})
      RETURNING *
    `;
    
    const result: QueryResult = await pool.query(query, [...values, userId]);
    return result.rows[0];
  },

  async update(userId: string, metrics: Partial<MonetizationMetrics>): Promise<MonetizationMetrics> {
    const columns = Object.keys(metrics);
    if (columns.length === 0) {
      throw new Error('No fields to update');
    }
    
    const values = Object.values(metrics);
    const setClause = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');
    
    const query = `
      UPDATE monetization_metrics
      SET ${setClause}
      WHERE user_id = $${values.length + 1}
      RETURNING *
    `;
    
    const result: QueryResult = await pool.query(query, [...values, userId]);
    return result.rows[0];
  }
};

export const platformConfigRepository: PlatformConfigRepository = {
  async findById(id: string): Promise<PlatformConfig | null> {
    const result: QueryResult = await pool.query(
      'SELECT * FROM platform_configs WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  async update(id: string, config: Partial<PlatformConfig>): Promise<PlatformConfig> {
    const columns = Object.keys(config);
    if (columns.length === 0) {
      throw new Error('No fields to update');
    }
    
    const values = Object.values(config);
    const setClause = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');
    
    const query = `
      UPDATE platform_configs
      SET ${setClause}
      WHERE id = $${values.length + 1}
      RETURNING *
    `;
    
    const result: QueryResult = await pool.query(query, [...values, id]);
    return result.rows[0];
  }
};

export const adminDataRepository: AdminDataRepository = {
  async findById(id: string): Promise<AdminData | null> {
    const result: QueryResult = await pool.query(
      'SELECT * FROM admin_data WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  async update(id: string, data: Partial<AdminData>): Promise<AdminData> {
    const columns = Object.keys(data);
    if (columns.length === 0) {
      throw new Error('No fields to update');
    }
    
    const values = Object.values(data);
    const setClause = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');
    
    const query = `
      UPDATE admin_data
      SET ${setClause}
      WHERE id = $${values.length + 1}
      RETURNING *
    `;
    
    const result: QueryResult = await pool.query(query, [...values, id]);
    return result.rows[0];
  }
};

export const revenueRepository: RevenueRepository = {
  async findByUserId(userId: string): Promise<Revenue | null> {
    const result: QueryResult = await pool.query(
      'SELECT * FROM revenue WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  },

  async create(revenue: Omit<Revenue, 'id'>): Promise<Revenue> {
    const { userId, ...revenueData } = revenue as WithUserId & Omit<Revenue, 'id'>;
    
    const columns = Object.keys(revenueData);
    const values = Object.values(revenueData);
    
    const paramCount = columns.length;
    const placeholders = Array.from({ length: paramCount }, (_, i) => `$${i + 1}`).join(', ');
    
    const query = `
      INSERT INTO revenue (${columns.join(', ')}, user_id)
      VALUES (${placeholders}, $${paramCount + 1})
      RETURNING *
    `;
    
    const result: QueryResult = await pool.query(query, [...values, userId]);
    return result.rows[0];
  },

  async update(userId: string, revenue: Partial<Revenue>): Promise<Revenue> {
    const columns = Object.keys(revenue);
    if (columns.length === 0) {
      throw new Error('No fields to update');
    }
    
    const values = Object.values(revenue);
    const setClause = columns.map((col, idx) => `${col} = $${idx + 1}`).join(', ');
    
    const query = `
      UPDATE revenue
      SET ${setClause}
      WHERE user_id = $${values.length + 1}
      RETURNING *
    `;
    
    const result: QueryResult = await pool.query(query, [...values, userId]);
    return result.rows[0];
  }
};

// Fix the eligibility data - the original code had an issue with the products property
export const eligibilityRepository = {
  async findByUserId(userId: string): Promise<Eligibility | null> {
    const result: QueryResult = await pool.query(
      'SELECT * FROM eligibility WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  },

  async create(eligibility: Omit<Eligibility, 'id'>): Promise<Eligibility> {
    const { userId, products, ...eligibilityData } = eligibility as EligibilityWithProducts;
    
    // Insert eligibility record
    const eligibilityColumns = Object.keys(eligibilityData);
    const eligibilityValues = Object.values(eligibilityData);
    
    const eligibilityParamCount = eligibilityColumns.length;
    const eligibilityPlaceholders = Array.from({ length: eligibilityParamCount }, (_, i) => `$${i + 1}`).join(', ');
    
    const eligibilityQuery = `
      INSERT INTO eligibility (${eligibilityColumns.join(', ')}, user_id)
      VALUES (${eligibilityPlaceholders}, $${eligibilityParamCount + 1})
      RETURNING *
    `;
    
    const eligibilityResult: QueryResult = await pool.query(eligibilityQuery, [...eligibilityValues, userId]);
    
    // Handle products separately if needed
    if (products && Array.isArray(products)) {
      for (const product of products) {
        await pool.query(
          'INSERT INTO eligibility_products (eligibility_id, product, status, passed_rules, failed_rules, next_actions) VALUES ($1, $2, $3, $4, $5, $6)',
          [eligibilityResult.rows[0].id, product.product, product.status, JSON.stringify(product.passedRules || []), JSON.stringify(product.failedRules || []), JSON.stringify(product.nextActions || [])]
        );
      }
    }
    
    return eligibilityResult.rows[0];
  }
};