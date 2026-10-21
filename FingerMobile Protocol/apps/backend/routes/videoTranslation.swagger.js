/**
 * @swagger
 * tags:
 *   name: videoTranslation
 *   description: Auto-generated endpoints for videoTranslation
 */

/**
 * @swagger
 * /videoTranslation/upload:
 *   post:
 *     summary: POST /upload
 *     tags: [videoTranslation]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /videoTranslation/status/{processingId}:
 *   get:
 *     summary: GET /status/:processingId
 *     tags: [videoTranslation]
 *     parameters:
 *       - in: path
 *         name: processingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /videoTranslation/my-videos:
 *   get:
 *     summary: GET /my-videos
 *     tags: [videoTranslation]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /videoTranslation/languages:
 *   get:
 *     summary: GET /languages
 *     tags: [videoTranslation]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /videoTranslation/quota:
 *   get:
 *     summary: GET /quota
 *     tags: [videoTranslation]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /videoTranslation/{videoId}:
 *   delete:
 *     summary: DELETE /:videoId
 *     tags: [videoTranslation]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
