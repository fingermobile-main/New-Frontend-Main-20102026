const express = require('express');
const router = express.Router();
const blogTemplateController = require('../controllers/BlogTemplateController');

/**
 * @route   GET /api/blog-templates
 * @desc    Get all free & SEO-optimized blog templates
 * @access  Public
 */
router.get('/', blogTemplateController.getBlogTemplates);

/**
 * @route   POST /api/blog-templates
 * @desc    Create and persist a custom blog template in PostgreSQL
 * @access  Public / Admin
 */
router.post('/', blogTemplateController.createTemplate);

/**
 * @route   GET /api/blog-templates/:id
 * @desc    Get template details by ID
 * @access  Public
 */
router.get('/:id', blogTemplateController.getTemplateById);

/**
 * @route   POST /api/blog-templates/scaffold
 * @desc    Scaffold selected template into application directory
 * @access  Public / Admin
 */
router.post('/scaffold', blogTemplateController.scaffoldTemplate);

/**
 * @route   POST /api/blog-templates/:id/customize
 * @desc    Save template customization options (colors, fonts, SEO)
 * @access  Public / Admin
 */
router.post('/:id/customize', blogTemplateController.customizeTemplate);

/**
 * @route   DELETE /api/blog-templates/:id
 * @desc    Delete custom template from PostgreSQL
 * @access  Public / Admin
 */
router.delete('/:id', blogTemplateController.deleteTemplate);

module.exports = router;
