/**
 * @swagger
 * tags:
 *   name: stercs-editor
 *   description: Auto-generated endpoints for stercs-editor
 */

/**
 * @swagger
 * /stercs-editor/pages:
 *   post:
 *     summary: POST /pages
 *     tags: [stercs-editor]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   get:
 *     summary: GET /pages
 *     tags: [stercs-editor]
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
 * /stercs-editor/pages/{slug}:
 *   get:
 *     summary: GET /pages/:slug
 *     tags: [stercs-editor]
 *     parameters:
 *       - in: path
 *         name: slug
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
