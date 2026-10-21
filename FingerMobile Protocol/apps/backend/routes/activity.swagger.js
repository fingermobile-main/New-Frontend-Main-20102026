/**
 * @swagger
 * tags:
 *   name: activity
 *   description: Auto-generated endpoints for activity
 */

/**
 * @swagger
 * /activity:
 *   get:
 *     summary: GET /
 *     tags: [activity]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   post:
 *     summary: POST /
 *     tags: [activity]
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
 * /activity/own:
 *   get:
 *     summary: GET /own
 *     tags: [activity]
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
 * /activity/member/{memberId}:
 *   get:
 *     summary: GET /member/:memberId
 *     tags: [activity]
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
 * /activity/types/{activityType}:
 *   get:
 *     summary: GET /types/:activityType
 *     tags: [activity]
 *     parameters:
 *       - in: path
 *         name: activityType
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
 * /activity/content/{contentId}:
 *   get:
 *     summary: GET /content/:contentId
 *     tags: [activity]
 *     parameters:
 *       - in: path
 *         name: contentId
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
 * /activity/recent/{days}?:
 *   get:
 *     summary: GET /recent/:days?
 *     tags: [activity]
 *     parameters:
 *       - in: path
 *         name: days
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
 * /activity/stats/{memberId}:
 *   get:
 *     summary: GET /stats/:memberId
 *     tags: [activity]
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
 * /activity/{activityId}:
 *   delete:
 *     summary: DELETE /:activityId
 *     tags: [activity]
 *     parameters:
 *       - in: path
 *         name: activityId
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
