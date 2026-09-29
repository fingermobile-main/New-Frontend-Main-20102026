import { db } from '../database.js';

interface HallmarkRecord {
  id: string;
  name: string;
  description?: string;
  category?: string;
  icon?: string;
  criteria?: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function mapRow(row: Record<string, unknown>): HallmarkRecord {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string | undefined,
    category: row.category as string | undefined,
    icon: row.icon as string | undefined,
    criteria: row.criteria_json ? JSON.parse(row.criteria_json as string) : undefined,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  };
}

/**
 * Hallmark Service
 * Manages hallmark definitions stored in the SQLite hallmarks table.
 */
export class HallmarkService {
  static getAll(): HallmarkRecord[] {
    const rows = db.prepare('SELECT * FROM hallmarks WHERE is_active = 1 ORDER BY name').all() as Record<string, unknown>[];
    return rows.map(mapRow);
  }

  static getById(id: string): HallmarkRecord | null {
    const row = db.prepare('SELECT * FROM hallmarks WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    return row ? mapRow(row) : null;
  }

  static create(hallmarkData: Omit<HallmarkRecord, 'id' | 'createdAt' | 'updatedAt'>): HallmarkRecord {
    const id = `hm-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    db.prepare(`
      INSERT INTO hallmarks (id, name, description, category, icon, criteria_json, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      hallmarkData.name,
      hallmarkData.description ?? null,
      hallmarkData.category ?? null,
      hallmarkData.icon ?? null,
      hallmarkData.criteria ? JSON.stringify(hallmarkData.criteria) : null,
      hallmarkData.isActive ? 1 : 0
    );
    return this.getById(id)!;
  }

  static update(id: string, updateData: Partial<HallmarkRecord>): HallmarkRecord | null {
    const fields: string[] = [];
    const vals: unknown[] = [];
    if (updateData.name !== undefined) { fields.push('name = ?'); vals.push(updateData.name); }
    if (updateData.description !== undefined) { fields.push('description = ?'); vals.push(updateData.description); }
    if (updateData.category !== undefined) { fields.push('category = ?'); vals.push(updateData.category); }
    if (updateData.icon !== undefined) { fields.push('icon = ?'); vals.push(updateData.icon); }
    if (updateData.criteria !== undefined) { fields.push('criteria_json = ?'); vals.push(JSON.stringify(updateData.criteria)); }
    if (updateData.isActive !== undefined) { fields.push('is_active = ?'); vals.push(updateData.isActive ? 1 : 0); }
    if (fields.length === 0) return this.getById(id);
    fields.push('updated_at = CURRENT_TIMESTAMP');
    vals.push(id);
    db.prepare(`UPDATE hallmarks SET ${fields.join(', ')} WHERE id = ?`).run(...vals);
    return this.getById(id);
  }

  static delete(id: string): void {
    db.prepare('DELETE FROM hallmarks WHERE id = ?').run(id);
  }
}

export const hallmarkService = HallmarkService;