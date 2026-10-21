/**
 * @swagger
 * tags:
 *   name: photocredits
 *   description: Auto-generated endpoints for photocredits
 */

/**
 * @swagger
 * /photocredits:
 *   get:
 *     summary: GET /
 *     tags: [photocredits]
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
 * /photocredits/{photoId}:
 *   get:
 *     summary: GET /:photoId
 *     tags: [photocredits]
 *     parameters:
 *       - in: path
 *         name: photoId
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
 *     summary: PUT /:photoId
 *     tags: [photocredits]
 *     parameters:
 *       - in: path
 *         name: photoId
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
 * /photocredits/upload:
 *   post:
 *     summary: POST /upload
 *     tags: [photocredits]
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
 * /photocredits/{photoId}/purchase-license:
 *   post:
 *     summary: POST /:photoId/purchase-license
 *     tags: [photocredits]
 *     parameters:
 *       - in: path
 *         name: photoId
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
 * /photocredits/licenses/user/{userId}:
 *   get:
 *     summary: GET /licenses/user/:userId
 *     tags: [photocredits]
 *     parameters:
 *       - in: path
 *         name: userId
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
 * /photocredits/categories:
 *   get:
 *     summary: GET /categories
 *     tags: [photocredits]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
