import { MonetizationApplication } from '../shared/types.js';
import { db } from '../database.js';

function mapRow(row: Record<string, unknown>): MonetizationApplication {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    businessName: row.business_name as string,
    website: row.website as string || '',
    businessDescription: row.business_description as string || '',
    monthlyRevenue: row.monthly_revenue as number | undefined,
    country: row.country as string || '',
    productInterest: row.product_interest_json ? JSON.parse(row.product_interest_json as string) : [],
    status: row.status as MonetizationApplication['status'],
    submittedAt: new Date(row.submitted_at as string),
    reviewedAt: row.reviewed_at ? new Date(row.reviewed_at as string) : undefined,
    reviewerNotes: row.reviewer_notes as string | undefined
  };
}

export const getApplication = (id: string): MonetizationApplication | null => {
  const row = db.prepare('SELECT * FROM monetization_applications WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  return row ? mapRow(row) : null;
};

export const getAllApplications = (): MonetizationApplication[] => {
  const rows = db.prepare('SELECT * FROM monetization_applications ORDER BY submitted_at DESC').all() as Record<string, unknown>[];
  return rows.map(mapRow);
};

export const createApplication = (
  applicationData: Omit<MonetizationApplication, 'id' | 'submittedAt'>
): MonetizationApplication => {
  const id = `app-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  db.prepare(`
    INSERT INTO monetization_applications
      (id, user_id, business_name, website, business_description, monthly_revenue, country, product_interest_json, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    applicationData.userId,
    applicationData.businessName,
    applicationData.website || null,
    applicationData.businessDescription || null,
    applicationData.monthlyRevenue ?? null,
    applicationData.country || null,
    JSON.stringify(applicationData.productInterest || []),
    applicationData.status || 'pending'
  );
  return getApplication(id)!;
};

export const updateApplication = (
  id: string,
  updates: Partial<MonetizationApplication>
): MonetizationApplication | null => {
  const existing = getApplication(id);
  if (!existing) return null;

  const fields: string[] = [];
  const vals: unknown[] = [];

  if (updates.businessName !== undefined) { fields.push('business_name = ?'); vals.push(updates.businessName); }
  if (updates.website !== undefined) { fields.push('website = ?'); vals.push(updates.website); }
  if (updates.businessDescription !== undefined) { fields.push('business_description = ?'); vals.push(updates.businessDescription); }
  if (updates.monthlyRevenue !== undefined) { fields.push('monthly_revenue = ?'); vals.push(updates.monthlyRevenue); }
  if (updates.country !== undefined) { fields.push('country = ?'); vals.push(updates.country); }
  if (updates.productInterest !== undefined) { fields.push('product_interest_json = ?'); vals.push(JSON.stringify(updates.productInterest)); }
  if (updates.status !== undefined) { fields.push('status = ?'); vals.push(updates.status); }
  if (updates.reviewedAt !== undefined) { fields.push('reviewed_at = ?'); vals.push(updates.reviewedAt?.toISOString() ?? null); }
  if (updates.reviewerNotes !== undefined) { fields.push('reviewer_notes = ?'); vals.push(updates.reviewerNotes); }

  if (fields.length > 0) {
    vals.push(id);
    db.prepare(`UPDATE monetization_applications SET ${fields.join(', ')} WHERE id = ?`).run(...vals);
  }
  return getApplication(id);
};

export const deleteApplication = (id: string): boolean => {
  const result = db.prepare('DELETE FROM monetization_applications WHERE id = ?').run(id);
  return result.changes > 0;
};

export default { getApplication, getAllApplications, createApplication, updateApplication, deleteApplication };
