/* eslint-disable no-unused-vars */
const logger = require('../../utils/logger');
const { contentDb } = require('../../db');
const { logSecurityEvent } = require('../../utils/securityLogger');

class PageService {
  // Create a new page
  static async createPage(memberId, projectId, pageData) {
    try {
      const { title, slug, content, templateId } = pageData;

      // Verify member has access to project
      const projectResult = await contentDb.query(
        'SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2',
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Project not found or not owned by member');
      }

      // Check if slug already exists in this project
      const existingPage = await contentDb.query(
        'SELECT * FROM stercs_pages WHERE project_id = $1 AND slug = $2',
        [projectId, slug],
      );

      if (existingPage.rows.length > 0) {
        throw new Error('Page with this slug already exists in the project');
      }

      // Create the new page
      const result = await contentDb.query(
        `INSERT INTO stercs_pages (project_id, title, slug, content, meta_data)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          projectId,
          title,
          slug,
          content || {},
          {description: pageData.description || '',
            keywords: pageData.keywords || [],
            author: pageData.author || '',
            ogImage: pageData.ogImage || '',
            isPublished: false
          }
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, 'PAGE_CREATE', {
        projectId,
        pageId: result.rows[0].id,
        title
      });

      return {success: true,
        page: result.rows[0],
        message: 'Page created successfully'
      };
    } catch (error) {
      logger.error('Error creating, page:', error);
      throw error;
    }
  }

  // Get all pages for a project
  static async getProjectPages(memberId, projectId) {
    try {
      // Verify member has access to project
      const projectResult = await contentDb.query(
        'SELECT * FROM stercs_projects WHERE id = $1 AND member_id = $2',
        [projectId, memberId],
      );

      if (projectResult.rows.length === 0) {
        throw new Error('Project not found or not owned by member');
      }

      const result = await contentDb.query(
        'SELECT * FROM stercs_pages WHERE project_id = $1 ORDER BY created_at DESC',
        [projectId],
      );

      return {success: true,
        pages: result.rows,
        message: 'Pages retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting project, pages:', error);
      throw error;
    }
  }

  // Get a specific page
  static async getPage(memberId, pageId) {
    try {
      // Verify member has access to the page (through project ownership)
      const pageResult = await contentDb.query(
        `
        SELECT p.* FROM stercs_pages p
        JOIN stercs_projects pr ON p.project_id = pr.id
        WHERE p.id = $1 AND pr.member_id = $2
      `,
        [pageId, memberId],
      );

      if (pageResult.rows.length === 0) {
        throw new Error('Page not found or not owned by member');
      }

      return {success: true,
        page: pageResult.rows[0],
        message: 'Page retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting, page:', error);
      throw error;
    }
  }

  // Update a page
  static async updatePage(memberId, pageId, pageData) {
    try {
      const { title, slug, content, meta_data } = pageData;

      // Verify member has access to the page
      const pageResult = await contentDb.query(
        `
        SELECT p.* FROM stercs_pages p
        JOIN stercs_projects pr ON p.project_id = pr.id
        WHERE p.id = $1 AND pr.member_id = $2
      `,
        [pageId, memberId],
      );

      if (pageResult.rows.length === 0) {
        throw new Error('Page not found or not owned by member');
      }

      // Check if slug already exists for another page in the same project
      if (slug) {
        const existingPage = await contentDb.query(
          'SELECT * FROM stercs_pages WHERE project_id = $1 AND slug = $2 AND id != $3',
          [pageResult.rows[0].project_id, slug, pageId],
        );

        if (existingPage.rows.length > 0) {
          throw new Error('Page with this slug already exists in the project');
        }
      }

      // Build update query dynamically
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 2; // First param is pageId

      if (title !== undefined) {
        updateFields.push(`title = $${paramIndex}`);
        updateValues.push(title);
        paramIndex++;
      }

      if (slug !== undefined) {
        updateFields.push(`slug = $${paramIndex}`);
        updateValues.push(slug);
        paramIndex++;
      }

      if (content !== undefined) {
        updateFields.push(`content = $${paramIndex}`);
        updateValues.push(content);
        paramIndex++;
      }

      if (meta_data !== undefined) {
        updateFields.push(`meta_data = $${paramIndex}`);
        updateValues.push(meta_data);
        paramIndex++;
      }

      updateValues.unshift(pageId); // Add pageId as first value

      const query = `UPDATE stercs_pages SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
      const result = await contentDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, 'PAGE_UPDATE', {
        pageId,
        title: result.rows[0].title
      });

      return {success: true,
        page: result.rows[0],
        message: 'Page updated successfully'
      };
    } catch (error) {
      logger.error('Error updating, page:', error);
      throw error;
    }
  }

  // Publish or unpublish a page
  static async setPublishStatus(memberId, pageId, isPublished) {
    try {
      // Verify member has access to the page
      const pageResult = await contentDb.query(
        `
        SELECT p.* FROM stercs_pages p
        JOIN stercs_projects pr ON p.project_id = pr.id
        WHERE p.id = $1 AND pr.member_id = $2
      `,
        [pageId, memberId],
      );

      if (pageResult.rows.length === 0) {
        throw new Error('Page not found or not owned by member');
      }

      const result = await contentDb.query(
        `UPDATE stercs_pages SET is_published = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *`,
        [isPublished, pageId],
      );

      // Log security event
      await logSecurityEvent(
        memberId,
        isPublished ? 'PAGE_PUBLISH' : 'PAGE_UNPUBLISH',
        {
          pageId,
          title: result.rows[0].title
        },
      );

      return {success: true,
        page: result.rows[0],
        message: isPublished
          ? 'Page published successfully'
          : 'Page unpublished successfully'
      };
    } catch (error) {
      logger.error('Error setting publish, status:', error);
      throw error;
    }
  }

  // Delete a page
  static async deletePage(memberId, pageId) {
    try {
      // Verify member has access to the page
      const pageResult = await contentDb.query(
        `
        SELECT p.* FROM stercs_pages p
        JOIN stercs_projects pr ON p.project_id = pr.id
        WHERE p.id = $1 AND pr.member_id = $2
      `,
        [pageId, memberId],
      );

      if (pageResult.rows.length === 0) {
        throw new Error('Page not found or not owned by member');
      }

      await contentDb.query('DELETE FROM stercs_pages WHERE id = $1', [
        pageId
      ]);

      // Log security event
      await logSecurityEvent(memberId, 'PAGE_DELETE', {
        pageId
      });

      return {success: true,
        message: 'Page deleted successfully'
      };
    } catch (error) {
      logger.error('Error deleting, page:', error);
      throw error;
    }
  }

  // Get available templates
  static async getTemplates(memberId, options = {}) {
    try {
      let query = 'SELECT * FROM stercs_templates WHERE 1=1';
      const params = [];

      if (options.isPublic) {
        query += ' AND is_public = true';
      } else {
        // Include public templates and member's own templates
        query += ` AND (is_public = true OR author_id = $${params.length + 1})`;
        params.push(memberId);
      }

      if (options.category) {
        query += ` AND category = $${params.length + 1}`;
        params.push(options.category);
      }

      query += ' ORDER BY created_at DESC';

      const result = await contentDb.query(query, params);

      return {success: true,
        templates: result.rows,
        message: 'Templates retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting, templates:', error);
      throw error;
    }
  }

  // Create a new template from a page
  static async createTemplateFromPage(memberId, pageId, templateData) {
    try {
      // Verify member has access to the page
      const pageResult = await contentDb.query(
        `
        SELECT p.content FROM stercs_pages p
        JOIN stercs_projects pr ON p.project_id = pr.id
        WHERE p.id = $1 AND pr.member_id = $2
      `,
        [pageId, memberId],
      );

      if (pageResult.rows.length === 0) {
        throw new Error('Page not found or not owned by member');
      }

      const { name, description, category, isPublic = false } = templateData;

      const result = await contentDb.query(
        `INSERT INTO stercs_templates (name, description, category, content, is_public, author_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          name,
          description,
          category,
          pageResult.rows[0].content,
          isPublic,
          memberId
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, 'TEMPLATE_CREATE', {templateId: result.rows[0].id,
        name
      });

      return {success: true,
        template: result.rows[0],
        message: 'Template created successfully'
      };
    } catch (error) {
      logger.error('Error creating template from, page:', error);
      throw error;
    }
  }
}

module.exports = PageService;
