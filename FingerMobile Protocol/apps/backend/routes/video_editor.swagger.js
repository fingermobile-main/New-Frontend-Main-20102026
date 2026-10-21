/**
 * @swagger
 * tags:
 *   name: VideoEditor
 *   description: Cloud-based video editing and project management
 */

/**
 * @swagger
 * /video-editor/upload:
 *   post:
 *     summary: Upload a video asset
 *     tags: [VideoEditor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Video asset uploaded successfully
 */

/**
 * @swagger
 * /video-editor/projects:
 *   post:
 *     summary: Create a new video project
 *     tags: [VideoEditor]
 *     responses:
 *       201:
 *         description: Video project created successfully
 *   get:
 *     summary: Get all video projects
 *     tags: [VideoEditor]
 *     responses:
 *       200:
 *         description: List of video projects retrieved successfully
 */

/**
 * @swagger
 * /video-editor/projects/{projectId}:
 *   get:
 *     summary: Get video project by ID
 *     tags: [VideoEditor]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video project retrieved successfully
 *   put:
 *     summary: Update video project
 *     tags: [VideoEditor]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video project updated successfully
 *   delete:
 *     summary: Delete video project
 *     tags: [VideoEditor]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Video project deleted successfully
 */

/**
 * @swagger
 * /video-editor/projects/{projectId}/save-draft:
 *   post:
 *     summary: Save project as a draft
 *     tags: [VideoEditor]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Draft saved successfully
 */

/**
 * @swagger
 * /video-editor/projects/{projectId}/schedule:
 *   post:
 *     summary: Schedule project for rendering/publishing
 *     tags: [VideoEditor]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Project scheduled successfully
 */

/**
 * @swagger
 * /video-editor/projects/{projectId}/publish:
 *   post:
 *     summary: Publish video project
 *     tags: [VideoEditor]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Project published successfully
 */

/**
 * @swagger
 * /video-editor/jobs:
 *   post:
 *     summary: Create a processing job for video rendering
 *     tags: [VideoEditor]
 *     responses:
 *       201:
 *         description: Job created successfully
 */

/**
 * @swagger
 * /video-editor/jobs/{jobId}:
 *   get:
 *     summary: Get status of a processing job
 *     tags: [VideoEditor]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job status retrieved successfully
 */

/**
 * @swagger
 * /video-editor/projects/{projectId}/jobs:
 *   get:
 *     summary: Get processing jobs for a specific project
 *     tags: [VideoEditor]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of jobs retrieved successfully
 */

/**
 * @swagger
 * /video-editor/jobs/{jobId}/cancel:
 *   post:
 *     summary: Cancel a processing job
 *     tags: [VideoEditor]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Job cancelled successfully
 */
