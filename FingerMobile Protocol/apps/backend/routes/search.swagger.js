/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Endpoints for full-text search and Elasticsearch integration
 */

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Full-text search
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Type of content to search for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *       400:
 *         description: Search query required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /search/suggestions:
 *   get:
 *     summary: Autocomplete suggestions
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Suggestions retrieved successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /search/index:
 *   post:
 *     summary: Index content in Elasticsearch
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documentId
 *               - documentType
 *               - data
 *             properties:
 *               documentId:
 *                 type: string
 *               documentType:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Document indexed successfully
 *       400:
 *         description: documentId, documentType, and data required
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /search/index/{id}:
 *   delete:
 *     summary: Remove document from Elasticsearch index
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document removed from index
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Internal server error
 */
