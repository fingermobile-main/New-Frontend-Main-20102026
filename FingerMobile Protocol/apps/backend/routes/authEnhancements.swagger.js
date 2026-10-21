/**
 * @swagger
 * tags:
 *   name: authEnhancements
 *   description: Auto-generated endpoints for authEnhancements
 */

/**
 * @swagger
 * /authEnhancements/refresh-token:
 *   post:
 *     summary: POST /refresh-token
 *     tags: [authEnhancements]
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
 * /authEnhancements/logout-all-devices:
 *   post:
 *     summary: POST /logout-all-devices
 *     tags: [authEnhancements]
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
 * /authEnhancements/sessions:
 *   get:
 *     summary: GET /sessions
 *     tags: [authEnhancements]
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
 * /authEnhancements/session/{id}:
 *   delete:
 *     summary: DELETE /session/:id
 *     tags: [authEnhancements]
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
 * /authEnhancements/mfa/enable:
 *   post:
 *     summary: POST /mfa/enable
 *     tags: [authEnhancements]
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
 * /authEnhancements/mfa/verify:
 *   post:
 *     summary: POST /mfa/verify
 *     tags: [authEnhancements]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
