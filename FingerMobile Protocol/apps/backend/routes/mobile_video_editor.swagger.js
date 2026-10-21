/**
 * @swagger
 * tags:
 *   name: MobileVideoEditor
 *   description: Mobile-optimized video editing and project management
 */

/**
 * @swagger
 * /mobile-video-editor/projects:
 *   post:
 *     summary: Create a new mobile video project
 *     tags: [MobileVideoEditor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Project created successfully
 *   get:
 *     summary: Get all mobile video projects
 *     tags: [MobileVideoEditor]
 *     responses:
 *       200:
 *         description: List of projects retrieved successfully
 */

/**
 * @swagger
 * /mobile-video-editor/projects/{projectId}:
 *   get:
 *     summary: Get mobile video project by ID
 *     tags: [MobileVideoEditor]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 */

/**
 * @swagger
 * /mobile-video-editor/projects/{projectId}/effects:
 *   post:
 *     summary: Add effects to a project
 *     tags: [MobileVideoEditor]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Effects added successfully
 */

/**
 * @swagger
 * /mobile-video-editor/projects/{projectId}/filters:
 *   post:
 *     summary: Add filters to a project
 *     tags: [MobileVideoEditor]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Filters added successfully
 */

/**
 * @swagger
 * /mobile-video-editor/projects/{projectId}/text:
 *   post:
 *     summary: Add text layers to a project
 *     tags: [MobileVideoEditor]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Text added successfully
 */

/**
 * @swagger
 * /mobile-video-editor/projects/{projectId}/stickers:
 *   post:
 *     summary: Add stickers to a project
 *     tags: [MobileVideoEditor]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Stickers added successfully
 */

/**
 * @swagger
 * /mobile-video-editor/projects/{projectId}/render:
 *   post:
 *     summary: Render a mobile video project
 *     tags: [MobileVideoEditor]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Project render started successfully
 */

/**
 * @swagger
 * /mobile-video-editor/projects/{projectId}/export:
 *   post:
 *     summary: Export a mobile video project
 *     tags: [MobileVideoEditor]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Project export started successfully
 */
