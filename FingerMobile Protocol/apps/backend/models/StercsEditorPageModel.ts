const { Pool } = require('pg');

class StercsEditorPageModel {
  pool: any;

  constructor(pool: any) {
    this.pool = pool;
  }

  async getPage(id: string) {
    const query = `
      SELECT * FROM stercs_editor_pages WHERE id = $1
    `;
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }
  
  async getPageBySlug(slug: string) {
    const query = `
      SELECT * FROM stercs_editor_pages WHERE slug = $1
    `;
    const result = await this.pool.query(query, [slug]);
    return result.rows[0] || null;
  }

  async savePage(title: string, slug: string, components: any, theme: any, status: string = 'published') {
    const query = `
      INSERT INTO stercs_editor_pages (title, slug, components, theme, status)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (slug) DO UPDATE
      SET components = EXCLUDED.components,
          title = EXCLUDED.title,
          theme = EXCLUDED.theme,
          status = EXCLUDED.status,
          updated_at = NOW()
      RETURNING *;
    `;
    const result = await this.pool.query(query, [title, slug, JSON.stringify(components), JSON.stringify(theme), status]);
    return result.rows[0];
  }

  async listPages() {
    const query = `
      SELECT id, title, slug, status, created_at, updated_at
      FROM stercs_editor_pages
      ORDER BY updated_at DESC
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }
}

export = StercsEditorPageModel;
