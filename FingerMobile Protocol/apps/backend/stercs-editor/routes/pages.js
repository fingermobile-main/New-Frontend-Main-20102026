const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/authenticate');
const PageService = require('../services/pageService');
const { contentDb } = require('../../db');
const logger = require('../../config/logger');

// Helper to ensure a default project exists for a member
async function ensureDefaultProject(memberId) {
  const result = await contentDb.query(
    'SELECT id FROM stercs_projects WHERE member_id = $1 LIMIT 1',
    [memberId]
  );
  if (result.rows.length > 0) return result.rows[0].id;

  const insert = await contentDb.query(
    `INSERT INTO stercs_projects (member_id, name, description)
     VALUES ($1, $2, $3) RETURNING id`,
    [memberId, 'Main Enterprise Project', 'Default project for STERCS editor']
  );
  return insert.rows[0].id;
}

// Apply admin authentication to all page routes
router.use(requireAdmin);

// Page routes
router.get('/', async (req, res) => {
  try {
    const memberId = req.user?.id || 1;
    let { projectId } = req.query;

    if (!projectId) {
      projectId = await ensureDefaultProject(memberId);
    }

    const result = await PageService.getProjectPages(memberId, projectId);

    res.status(200).json({success: true,
      data: result
    });
  } catch (error) {
    logger.error('Page retrieval error:', error);
    res.status(500).json({success: false,
      message: 'Failed to retrieve pages',
      error: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const memberId = req.user?.id || 1;
    let { projectId, title, slug, components, theme } = req.body;

    if (!title || !slug) {
      return res.status(400).json({success: false,
        message: 'Page title and slug are required'
      });
    }

    if (!projectId) {
      projectId = await ensureDefaultProject(memberId);
    }

    const pageData = {
      title,
      slug,
      content: components || [],
      meta_data: { theme }
    };

    const result = await PageService.createPage(memberId, projectId, pageData);

    res.status(201).json({success: true,
      data: result
    });
  } catch (error) {
    logger.error('Page creation error:', error);
    res.status(500).json({success: false,
      message: 'Failed to create page',
      error: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.user?.id || 1;
    const { title, slug, components, theme } = req.body;

    const pageData = {};
    if (title) pageData.title = title;
    if (slug) pageData.slug = slug;
    if (components) pageData.content = components;
    if (theme) pageData.meta_data = { theme };

    const result = await PageService.updatePage(memberId, id, pageData);

    res.status(200).json({success: true,
      data: result
    });
  } catch (error) {
    logger.error('Page update error:', error);
    res.status(500).json({success: false,
      message: 'Failed to update page',
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const memberId = req.user?.id || 1;

    const result = await PageService.deletePage(memberId, id);

    res.status(200).json({success: true,
      data: result
    });
  } catch (error) {
    logger.error('Page deletion error:', error);
    res.status(500).json({success: false,
      message: 'Failed to delete page',
      error: error.message
    });
  }
});

module.exports = router;
