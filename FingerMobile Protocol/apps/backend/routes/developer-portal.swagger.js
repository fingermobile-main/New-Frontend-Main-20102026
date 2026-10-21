/**
 * @swagger
 * tags:
 *   name: DeveloperPortal
 *   description: Developer Portal and API Documentation
 *
 * /api/developer-portal/openapi.json:
 *   get:
 *     summary: Get OpenAPI spec
 *     tags: [DeveloperPortal]
 *     responses:
 *       200:
 *         description: OpenAPI specification
 *
 * /api/developer-portal/examples/curl:
 *   get:
 *     summary: Get curl examples
 *     tags: [DeveloperPortal]
 *     responses:
 *       200:
 *         description: Curl examples
 *
 * /api/developer-portal/sdk/javascript:
 *   get:
 *     summary: Get JavaScript SDK
 *     tags: [DeveloperPortal]
 *     responses:
 *       200:
 *         description: JavaScript SDK download
 *
 * /api/developer-portal/sdk/python:
 *   get:
 *     summary: Get Python SDK
 *     tags: [DeveloperPortal]
 *     responses:
 *       200:
 *         description: Python SDK download
 *
 * /api/developer-portal/docs/generate:
 *   post:
 *     summary: Regenerate documentation
 *     tags: [DeveloperPortal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Documentation regenerated
 *
 * /api/developer-portal/stats:
 *   get:
 *     summary: Get API usage stats
 *     tags: [DeveloperPortal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: API stats
 */
