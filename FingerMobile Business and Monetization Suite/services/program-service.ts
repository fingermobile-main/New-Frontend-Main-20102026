import { ProgramDefinition } from '../shared/types';
import { db } from '../database.js';

// Pre-populate with default plans if empty
const initDefaultPrograms = () => {
  const count = db.prepare('SELECT count(*) as count FROM programs').get() as { count: number };
  if (count.count === 0) {
    const insert = db.prepare(`
      INSERT INTO programs (id, name, title, description, summary, features_json, requirements_json, monthly_price, yearly_price, eligibility_requirements_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run('basic', 'Basic Plan', 'Basic Tier', 'Entry level monetization plan', 'Entry level', JSON.stringify(['Basic analytics', 'Limited support', 'Standard payouts']), JSON.stringify([]), 9.99, 99.99, '{}');
    insert.run('premium', 'Premium Plan', 'Premium Tier', 'Advanced monetization features', 'Advanced', JSON.stringify(['Advanced analytics', 'Priority support', 'Faster payouts', 'Marketing tools']), JSON.stringify([]), 29.99, 299.99, '{}');
    insert.run('enterprise', 'Enterprise Plan', 'Enterprise Tier', 'Full monetization suite', 'Full suite', JSON.stringify(['All premium features', 'Custom integrations', 'Dedicated support', 'Custom pricing']), JSON.stringify([]), 99.99, 999.99, '{}');
  }
};

initDefaultPrograms();

function mapRowToProgram(row: Record<string, unknown>): ProgramDefinition {
  return {
    id: row.id as string,
    name: row.name as string,
    title: row.title as string | undefined,
    description: row.description as string,
    summary: row.summary as string | undefined,
    features: row.features_json ? JSON.parse(row.features_json as string) : [],
    requirements: row.requirements_json ? JSON.parse(row.requirements_json as string) : undefined,
    pricing: {
      monthly: row.monthly_price as number,
      yearly: row.yearly_price as number
    },
    eligibilityRequirements: row.eligibility_requirements_json ? JSON.parse(row.eligibility_requirements_json as string) : {}
  };
}

export const getProgramDefinition = async (id: string): Promise<ProgramDefinition | null> => {
  const row = db.prepare('SELECT * FROM programs WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!row) return null;
  return mapRowToProgram(row);
};

export const getAllProgramDefinitions = async (): Promise<ProgramDefinition[]> => {
  const rows = db.prepare('SELECT * FROM programs').all() as Record<string, unknown>[];
  return rows.map(mapRowToProgram);
};

export default {
  getProgramDefinition,
  getAllProgramDefinitions
};