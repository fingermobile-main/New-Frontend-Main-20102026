/**
 * @swagger
 * tags:
 *   name: supervi_achievements
 *   description: Auto-generated endpoints for supervi_achievements
 */

/**
 * @swagger
 * /supervi_achievements/health:
 *   get:
 *     summary: GET /health
 *     tags: [supervi_achievements]
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
 * /supervi_achievements:
 *   get:
 *     summary: GET /
 *     tags: [supervi_achievements]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   post:
 *     summary: POST /
 *     tags: [supervi_achievements]
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
 * /supervi_achievements/{id}:
 *   get:
 *     summary: GET /:id
 *     tags: [supervi_achievements]
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
 *   put:
 *     summary: PUT /:id
 *     tags: [supervi_achievements]
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
 *     summary: DELETE /:id
 *     tags: [supervi_achievements]
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
 * /supervi_achievements/members/{memberId}:
 *   get:
 *     summary: GET /members/:memberId
 *     tags: [supervi_achievements]
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
 * /supervi_achievements/members/{memberId}/{achievementId}/unlock:
 *   post:
 *     summary: POST /members/:memberId/:achievementId/unlock
 *     tags: [supervi_achievements]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: achievementId
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
 * /supervi_achievements/members/{memberId}/{achievementId}/progress:
 *   post:
 *     summary: POST /members/:memberId/:achievementId/progress
 *     tags: [supervi_achievements]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: achievementId
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
 * /supervi_achievements/members/{memberId}/stats:
 *   get:
 *     summary: GET /members/:memberId/stats
 *     tags: [supervi_achievements]
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
 * /supervi_achievements/top-achievers:
 *   get:
 *     summary: GET /top-achievers
 *     tags: [supervi_achievements]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
