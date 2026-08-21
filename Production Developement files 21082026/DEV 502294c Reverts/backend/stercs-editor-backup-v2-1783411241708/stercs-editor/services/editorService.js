const { identityDb } = require("../../db");

class EditorService {
  // Create a new project
  static async createProject(memberId, projectData) {
    try {
      const { name, description, projectType, theme } = projectData;

      const query = `
        INSERT INTO stercs_projects (member_id, name, description, project_type, theme)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, description, project_type, theme, created_at
      `;

      const result = await identityDb.query(query, [
        memberId,
        name,
        description || "",
        projectType || "website",
        theme || "light"
      ]);

      return result.rows[0];
    } catch (error) {
      logger.error("Error creating, project:", error);
      throw error;
    }
  }

  // Get member projects
  static async getMemberProjects(memberId) {
    try {
      const query = `
        SELECT id, name, description, project_type, theme, created_at, updated_at, is_published, published_url
        FROM stercs_projects
        WHERE member_id = $1
        ORDER BY updated_at DESC
      `;

      const result = await identityDb.query(query, [memberId]);
      return result.rows;
    } catch (error) {
      logger.error("Error getting member, projects:", error);
      throw error;
    }
  }

  // Save page content
  static async savePageContent(pageId, content) {
    try {
      const query = `
        UPDATE stercs_pages
        SET content = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, title, slug
      `;

      const result = await identityDb.query(query, [content, pageId]);
      return result.rows[0];
    } catch (error) {
      logger.error("Error saving page, content:", error);
      throw error;
    }
  }

  // Create a new page
  static async createPage(projectId, pageData) {
    try {
      const { title, slug, content, metaData } = pageData;

      const query = `
        INSERT INTO stercs_pages (project_id, title, slug, content, meta_data)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, title, slug, created_at
      `;

      const result = await identityDb.query(query, [
        projectId,
        title,
        slug,
        content || {},
        metaData || {}
      ]);

      return result.rows[0];
    } catch (error) {
      logger.error("Error creating, page:", error);
      throw error;
    }
  }

  // Get project pages
  static async getProjectPages(projectId) {
    try {
      const query = `
        SELECT id, title, slug, content, created_at, updated_at, is_published
        FROM stercs_pages
        WHERE project_id = $1
        ORDER BY updated_at DESC
      `;

      const result = await identityDb.query(query, [projectId]);
      return result.rows;
    } catch (error) {
      logger.error("Error getting project, pages:", error);
      throw error;
    }
  }

  // Get available components
  static async getAvailableComponents() {
    try {
      const query = `
        SELECT id, name, type, category, properties, html_template, css_styles
        FROM stercs_components
        WHERE is_active = TRUE
        ORDER BY category, name
      `;

      const result = await identityDb.query(query);
      return result.rows;
    } catch (error) {
      logger.error("Error getting, components:", error);
      throw error;
    }
  }

  // Create component instance
  static async createComponentInstance(
    pageId,
    componentId,
    instanceProps,
    positionData,
  ) {
    try {
      const query = `
        INSERT INTO stercs_component_instances (page_id, component_id, instance_props, position_data)
        VALUES ($1, $2, $3, $4)
        RETURNING id, page_id, component_id, created_at
      `;

      const result = await identityDb.query(query, [
        pageId,
        componentId,
        instanceProps,
        positionData
      ]);

      return result.rows[0];
    } catch (error) {
      logger.error("Error creating component, instance:", error);
      throw error;
    }
  }

  // Get page components
  static async getPageComponents(pageId) {
    try {
      const query = `
        SELECT 
          ci.id,
          ci.component_id,
          c.name,
          c.type,
          c.category,
          ci.instance_props,
          ci.position_data,
          ci.created_at,
          ci.updated_at
        FROM stercs_component_instances ci
        JOIN stercs_components c ON ci.component_id = c.id
        WHERE ci.page_id = $1
        ORDER BY ci.created_at
      `;

      const result = await identityDb.query(query, [pageId]);
      return result.rows;
    } catch (error) {
      logger.error("Error getting page, components:", error);
      throw error;
    }
  }

  // Save project settings
  static async saveProjectSettings(projectId, settings) {
    try {
      const query = `
        UPDATE stercs_projects
        SET settings = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, name, settings
      `;

      const result = await identityDb.query(query, [settings, projectId]);
      return result.rows[0];
    } catch (error) {
      logger.error("Error saving project, settings:", error);
      throw error;
    }
  }

  // Publish project
  static async publishProject(projectId) {
    try {
      // Generate a unique URL for the published project
      const uniqueId = Math.random().toString(36).substring(2, 10);
      const publishedUrl = `,
https://${uniqueId}.stercs.app`;

      const query = `
        UPDATE stercs_projects
        SET is_published = TRUE, published_url = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, name, published_url
      `;

      const result = await identityDb.query(query, [publishedUrl, projectId]);
      return result.rows[0];
    } catch (error) {
      logger.error("Error publishing, project:", error);
      throw error;
    }
  }

  // Get project by ID
  static async getProjectById(projectId) {
    try {
      const query = `
        SELECT id, name, description, project_type, theme, settings, is_published, published_url, created_at, updated_at
        FROM stercs_projects
        WHERE id = $1
      `;

      const result = await identityDb.query(query, [projectId]);
      return result.rows[0];
    } catch (error) {
      logger.error("Error getting project by, ID:", error);
      throw error;
    }
  }

  // Get page by ID
  static async getPageById(pageId) {
    try {
      const query = `
        SELECT id, project_id, title, slug, content, meta_data, is_published, created_at, updated_at
        FROM stercs_pages
        WHERE id = $1
      `;

      const result = await identityDb.query(query, [pageId]);
      return result.rows[0];
    } catch (error) {
      logger.error("Error getting page by, ID:", error);
      throw error;
    }
  }

  // Get templates
  static async getTemplates(isPublic = false, category = null) {
    try {
      let query = `
        SELECT id, name, description, category, content, created_at, author_id
        FROM stercs_templates
        WHERE 1=1
      `;

      const params = [];
      let paramIndex = 1;

      if (isPublic) {
        query += ` AND is_public = TRUE`;
      }

      if (category) {
        query += ` AND category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }

      query += ` ORDER BY created_at DESC`;

      const result = await identityDb.query(query, params);
      return result.rows;
    } catch (error) {
      logger.error("Error getting, templates:", error);
      throw error;
    }
  }

  // Create a new template
  static async createTemplate(templateData) {
    try {
      const { name, description, category, content, isPublic, authorId } =
        templateData;

      const query = `
        INSERT INTO stercs_templates (name, description, category, content, is_public, author_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, description, category, created_at
      `;

      const result = await identityDb.query(query, [
        name,
        description,
        category,
        content,
        isPublic || false,
        authorId || null
      ]);

      return result.rows[0];
    } catch (error) {
      logger.error("Error creating, template:", error);
      throw error;
    }
  }

  // Upload asset
  static async uploadAsset(memberId, assetData) {
    try {
      const {
        filename,
        originalName,
        filePath,
        fileType,
        fileSize,
        altText,
        tags
      } = assetData;

      const query = `
        INSERT INTO stercs_assets (member_id, filename, original_name, file_path, file_type, file_size, alt_text, tags)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, filename, original_name, file_path, file_type, file_size, alt_text, tags, created_at
      `;

      const result = await identityDb.query(query, [
        memberId,
        filename,
        originalName,
        filePath,
        fileType,
        fileSize,
        altText,
        tags || []
      ]);

      return result.rows[0];
    } catch (error) {
      logger.error("Error uploading, asset:", error);
      throw error;
    }
  }

  // Get member assets
  static async getMemberAssets(memberId) {
    try {
      const query = `
        SELECT id, filename, original_name, file_path, file_type, file_size, alt_text, tags, created_at
        FROM stercs_assets
        WHERE member_id = $1
        ORDER BY created_at DESC
      `;

      const result = await identityDb.query(query, [memberId]);
      return result.rows;
    } catch (error) {
      logger.error("Error getting member, assets:", error);
      throw error;
    }
  }

  // Get editor status
  static async getStatus() {
    try {
      // Return basic status information about the editor service
      return {status: "active",
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
  features: {
  projects: true,
  pages: true,
  components: true,
  templates: true,
  assets: true
        }
      };
    } catch (error) {
      logger.error("Error getting editor, status:", error);
      throw error;
    }
  }
}

module.exports = EditorService;
