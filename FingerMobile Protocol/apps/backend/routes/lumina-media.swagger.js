/**
 * @swagger
 * tags:
 *   name: lumina-media
 *   description: Auto-generated endpoints for lumina-media
 */

/**
 * @swagger
 * /lumina-media/upload:
 *   post:
 *     summary: POST /upload
 *     tags: [lumina-media]
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
 * /lumina-media/transcode:
 *   post:
 *     summary: POST /transcode
 *     tags: [lumina-media]
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
 * /lumina-media/apply-filter:
 *   post:
 *     summary: POST /apply-filter
 *     tags: [lumina-media]
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
 * /lumina-media/files/{id}:
 *   get:
 *     summary: GET /files/:id
 *     tags: [lumina-media]
 *     parameters:
 *       - in: path
 *         name: id
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
 *   delete:
 *     summary: DELETE /files/:id
 *     tags: [lumina-media]
 *     parameters:
 *       - in: path
 *         name: id
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
 * /lumina-media/my-assets:
 *   get:
 *     summary: GET /my-assets
 *     tags: [lumina-media]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
