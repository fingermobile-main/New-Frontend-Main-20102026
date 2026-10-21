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

module.exports = router;
