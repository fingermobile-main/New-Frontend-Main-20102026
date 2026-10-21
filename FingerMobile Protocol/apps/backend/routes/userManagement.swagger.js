/**
 * @swagger
 * tags:
 *   name: userManagement
 *   description: Auto-generated endpoints for userManagement
 */

/**
 * @swagger
 * /userManagement/profile:
 *   get:
 *     summary: GET /profile
 *     tags: [userManagement]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   put:
 *     summary: PUT /profile
 *     tags: [userManagement]
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
 * /userManagement/settings:
 *   put:
 *     summary: PUT /settings
 *     tags: [userManagement]
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
 * /userManagement/{id}/ces:
 *   get:
 *     summary: GET /:id/ces
 *     tags: [userManagement]
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
