/**
 * @swagger
 * tags:
 *   name: security
 *   description: Auto-generated endpoints for security
 */

/**
 * @swagger
 * /security/enable-mfa:
 *   post:
 *     summary: POST /enable-mfa
 *     tags: [security]
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
 * /security/settings:
 *   get:
 *     summary: GET /settings
 *     tags: [security]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   put:
 *     summary: PUT /settings
 *     tags: [security]
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
 * /security/sessions:
 *   get:
 *     summary: GET /sessions
 *     tags: [security]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   delete:
 *     summary: DELETE /sessions
 *     tags: [security]
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
 * /security/sessions/{sessionId}:
 *   delete:
 *     summary: DELETE /sessions/:sessionId
 *     tags: [security]
 *     parameters:
 *       - in: path
 *         name: sessionId
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
 * /security/events:
 *   get:
 *     summary: GET /events
 *     tags: [security]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
