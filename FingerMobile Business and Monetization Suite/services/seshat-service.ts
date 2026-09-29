import { SeshatPage } from '../shared/types.js';
import { db } from '../database.js';

function mapRow(row: Record<string, unknown>): SeshatPage {
  return {
    id: row.id as string,
    title: row.title as string,
    content: row.content as string,
    author: row.author as string,
    status: row.status as SeshatPage['status'],
    tags: row.tags_json ? JSON.parse(row.tags_json as string) : [],
    views: (row.views as number) || 0,
    likes: (row.likes as number) || 0,
    shares: (row.shares as number) || 0,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string)
  };
}

/**
 * Seshat Service
 * Manages Seshat content pages stored in the seshat_content_pages SQLite table.
 */
export class SeshatService {
  static async getData(): Promise<{ pages: SeshatPage[]; metrics: Record<string, unknown>; settings: Record<string, unknown> }> {
    const rows = db.prepare(
      "SELECT * FROM seshat_content_pages ORDER BY created_at DESC"
    ).all() as Record<string, unknown>[];

    const pages = rows.map(mapRow);

    const totalViews = pages.reduce((sum, p) => sum + p.views, 0);
    const totalLikes = pages.reduce((sum, p) => sum + p.likes, 0);
    const publishedCount = pages.filter(p => p.status === 'published').length;

    return {
      pages,
      metrics: {
        totalPages: pages.length,
        publishedPages: publishedCount,
        totalViews,
        totalLikes
      },
      settings: {
        defaultStatus: 'draft',
        allowPublicSubmissions: false
      }
    };
  }

  static getAllPages(): SeshatPage[] {
    const rows = db.prepare('SELECT * FROM seshat_content_pages ORDER BY created_at DESC').all() as Record<string, unknown>[];
    return rows.map(mapRow);
  }

  static getPageById(id: string): SeshatPage | null {
    const row = db.prepare('SELECT * FROM seshat_content_pages WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    return row ? mapRow(row) : null;
  }

  static createPage(pageData: Omit<SeshatPage, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'shares'>): SeshatPage {
    const id = `sp-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    db.prepare(`
      INSERT INTO seshat_content_pages (id, title, content, author, status, tags_json)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, pageData.title, pageData.content, pageData.author, pageData.status || 'draft', JSON.stringify(pageData.tags || []));
    return this.getPageById(id)!;
  }

  static async updateData(updateData: Record<string, unknown>): Promise<void> {
    // updateData may contain page updates by id
    if (updateData.id && typeof updateData.id === 'string') {
      const fields: string[] = [];
      const vals: unknown[] = [];
      if (updateData.title) { fields.push('title = ?'); vals.push(updateData.title); }
      if (updateData.content) { fields.push('content = ?'); vals.push(updateData.content); }
      if (updateData.status) { fields.push('status = ?'); vals.push(updateData.status); }
      if (updateData.tags) { fields.push('tags_json = ?'); vals.push(JSON.stringify(updateData.tags)); }
      if (fields.length > 0) {
        fields.push('updated_at = CURRENT_TIMESTAMP');
        vals.push(updateData.id);
        db.prepare(`UPDATE seshat_content_pages SET ${fields.join(', ')} WHERE id = ?`).run(...vals);
      }
    }
  }
}

export const seshatService = SeshatService;