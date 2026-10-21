/**
 * @swagger
 * tags:
 *   name: ugc_media_routes
 *   description: Auto-generated endpoints for ugc_media_routes
 */

/**
 * @swagger
 * /ugc_media_routes/upload:
 *   post:
 *     summary: POST /upload
 *     tags: [ugc_media_routes]
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
 * /ugc_media_routes/process/{mediaId}:
 *   post:
 *     summary: POST /process/:mediaId
 *     tags: [ugc_media_routes]
 *     parameters:
 *       - in: path
 *         name: mediaId
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
 * /ugc_media_routes/{mediaId}/metadata:
 *   get:
 *     summary: GET /:mediaId/metadata
 *     tags: [ugc_media_routes]
 *     parameters:
 *       - in: path
 *         name: mediaId
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
 * /ugc_media_routes/{mediaId}:
 *   delete:
 *     summary: DELETE /:mediaId
 *     tags: [ugc_media_routes]
 *     parameters:
 *       - in: path
 *         name: mediaId
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
