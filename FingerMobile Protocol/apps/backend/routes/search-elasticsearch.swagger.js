/**
 * @swagger
 * tags:
 *   name: search-elasticsearch
 *   description: Auto-generated endpoints for search-elasticsearch
 */

/**
 * @swagger
 * /search-elasticsearch:
 *   get:
 *     summary: GET /
 *     tags: [search-elasticsearch]
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
 * /search-elasticsearch/autocomplete:
 *   get:
 *     summary: GET /autocomplete
 *     tags: [search-elasticsearch]
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
 * /search-elasticsearch/facets:
 *   get:
 *     summary: GET /facets
 *     tags: [search-elasticsearch]
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
 * /search-elasticsearch/reindex:
 *   post:
 *     summary: POST /reindex
 *     tags: [search-elasticsearch]
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
 * /search-elasticsearch/index/{type}/{id}:
 *   post:
 *     summary: POST /index/:type/:id
 *     tags: [search-elasticsearch]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
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
