/**
 * @swagger
 * tags:
 *   name: voicelines
 *   description: Auto-generated endpoints for voicelines
 */

/**
 * @swagger
 * /voicelines/voicelines:
 *   get:
 *     summary: GET /voicelines
 *     tags: [voicelines]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   post:
 *     summary: POST /voicelines
 *     tags: [voicelines]
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
 * /voicelines/voicelines/{voiceLineId}:
 *   get:
 *     summary: GET /voicelines/:voiceLineId
 *     tags: [voicelines]
 *     parameters:
 *       - in: path
 *         name: voiceLineId
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
 *   put:
 *     summary: PUT /voicelines/:voiceLineId
 *     tags: [voicelines]
 *     parameters:
 *       - in: path
 *         name: voiceLineId
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
 *     summary: DELETE /voicelines/:voiceLineId
 *     tags: [voicelines]
 *     parameters:
 *       - in: path
 *         name: voiceLineId
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
 * /voicelines/voicelines/{voiceLineId}/like:
 *   post:
 *     summary: POST /voicelines/:voiceLineId/like
 *     tags: [voicelines]
 *     parameters:
 *       - in: path
 *         name: voiceLineId
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
 *     summary: DELETE /voicelines/:voiceLineId/like
 *     tags: [voicelines]
 *     parameters:
 *       - in: path
 *         name: voiceLineId
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
 * /voicelines/members/{memberId}/voicelines:
 *   get:
 *     summary: GET /members/:memberId/voicelines
 *     tags: [voicelines]
 *     parameters:
 *       - in: path
 *         name: memberId
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
 * /voicelines/voicelines/{voiceLineId}/comments:
 *   get:
 *     summary: GET /voicelines/:voiceLineId/comments
 *     tags: [voicelines]
 *     parameters:
 *       - in: path
 *         name: voiceLineId
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
 *   post:
 *     summary: POST /voicelines/:voiceLineId/comments
 *     tags: [voicelines]
 *     parameters:
 *       - in: path
 *         name: voiceLineId
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
 * /voicelines/comments/{commentId}:
 *   delete:
 *     summary: DELETE /comments/:commentId
 *     tags: [voicelines]
 *     parameters:
 *       - in: path
 *         name: commentId
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
