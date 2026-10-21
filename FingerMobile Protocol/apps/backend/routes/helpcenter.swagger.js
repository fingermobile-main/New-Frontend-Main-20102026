/**
 * @swagger
 * tags:
 *   name: helpcenter
 *   description: Auto-generated endpoints for helpcenter
 */

/**
 * @swagger
 * /helpcenter/faqs:
 *   get:
 *     summary: GET /faqs
 *     tags: [helpcenter]
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
 * /helpcenter/categories:
 *   get:
 *     summary: GET /categories
 *     tags: [helpcenter]
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
 * /helpcenter/faqs/{id}/feedback:
 *   post:
 *     summary: POST /faqs/:id/feedback
 *     tags: [helpcenter]
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
 * /helpcenter/tickets:
 *   post:
 *     summary: POST /tickets
 *     tags: [helpcenter]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   get:
 *     summary: GET /tickets
 *     tags: [helpcenter]
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
 * /helpcenter/tickets/{id}:
 *   get:
 *     summary: GET /tickets/:id
 *     tags: [helpcenter]
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
 * /helpcenter/tickets/{id}/messages:
 *   post:
 *     summary: POST /tickets/:id/messages
 *     tags: [helpcenter]
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
 * /helpcenter/tickets/{id}/status:
 *   put:
 *     summary: PUT /tickets/:id/status
 *     tags: [helpcenter]
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
 * /helpcenter/stats:
 *   get:
 *     summary: GET /stats
 *     tags: [helpcenter]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
