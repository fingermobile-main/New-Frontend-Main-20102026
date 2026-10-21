/**
 * @swagger
 * tags:
 *   name: nysc
 *   description: Auto-generated endpoints for nysc
 */

/**
 * @swagger
 * /nysc/batches:
 *   get:
 *     summary: GET /batches
 *     tags: [nysc]
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
 * /nysc/batches/{batchId}:
 *   get:
 *     summary: GET /batches/:batchId
 *     tags: [nysc]
 *     parameters:
 *       - in: path
 *         name: batchId
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
 * /nysc/batches/{batchId}/corpers:
 *   get:
 *     summary: GET /batches/:batchId/corpers
 *     tags: [nysc]
 *     parameters:
 *       - in: path
 *         name: batchId
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
 * /nysc/corpers/{corperId}:
 *   get:
 *     summary: GET /corpers/:corperId
 *     tags: [nysc]
 *     parameters:
 *       - in: path
 *         name: corperId
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
 * /nysc/register:
 *   post:
 *     summary: POST /register
 *     tags: [nysc]
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
 * /nysc/state/{stateCode}:
 *   get:
 *     summary: GET /state/:stateCode
 *     tags: [nysc]
 *     parameters:
 *       - in: path
 *         name: stateCode
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
 * /nysc/corpers/{corperId}/service-record:
 *   get:
 *     summary: GET /corpers/:corperId/service-record
 *     tags: [nysc]
 *     parameters:
 *       - in: path
 *         name: corperId
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
 * /nysc/projects:
 *   post:
 *     summary: POST /projects
 *     tags: [nysc]
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
 * /nysc/events:
 *   get:
 *     summary: GET /events
 *     tags: [nysc]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
