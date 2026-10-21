/**
 * @swagger
 * tags:
 *   name: permanence
 *   description: Auto-generated endpoints for permanence
 */

/**
 * @swagger
 * /permanence/challenges:
 *   get:
 *     summary: GET /challenges
 *     tags: [permanence]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   post:
 *     summary: POST /challenges
 *     tags: [permanence]
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
 * /permanence/challenges/{id}:
 *   get:
 *     summary: GET /challenges/:id
 *     tags: [permanence]
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
 *     summary: PUT /challenges/:id
 *     tags: [permanence]
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
 *     summary: DELETE /challenges/:id
 *     tags: [permanence]
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
 * /permanence/challenges/{id}/participate:
 *   post:
 *     summary: POST /challenges/:id/participate
 *     tags: [permanence]
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
 * /permanence/challenges/{id}/stake:
 *   post:
 *     summary: POST /challenges/:id/stake
 *     tags: [permanence]
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
 * /permanence/streams:
 *   get:
 *     summary: GET /streams
 *     tags: [permanence]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   post:
 *     summary: POST /streams
 *     tags: [permanence]
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
 * /permanence/streams/{id}/start:
 *   put:
 *     summary: PUT /streams/:id/start
 *     tags: [permanence]
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
 * /permanence/streams/{id}/stop:
 *   put:
 *     summary: PUT /streams/:id/stop
 *     tags: [permanence]
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
