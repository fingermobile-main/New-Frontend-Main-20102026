/**
 * @swagger
 * tags:
 *   name: p2p-matching
 *   description: Auto-generated endpoints for p2p-matching
 */

/**
 * @swagger
 * /p2p-matching/member-profiles:
 *   get:
 *     summary: GET /member-profiles
 *     tags: [p2p-matching]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   post:
 *     summary: POST /member-profiles
 *     tags: [p2p-matching]
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
 * /p2p-matching/member-profiles/{id}:
 *   get:
 *     summary: GET /member-profiles/:id
 *     tags: [p2p-matching]
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
 * /p2p-matching/find-matches:
 *   post:
 *     summary: POST /find-matches
 *     tags: [p2p-matching]
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
 * /p2p-matching/matches:
 *   post:
 *     summary: POST /matches
 *     tags: [p2p-matching]
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
 * /p2p-matching/matches/{memberId}:
 *   get:
 *     summary: GET /matches/:memberId
 *     tags: [p2p-matching]
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
 * /p2p-matching/matches/{matchId}:
 *   put:
 *     summary: PUT /matches/:matchId
 *     tags: [p2p-matching]
 *     parameters:
 *       - in: path
 *         name: matchId
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
 * /p2p-matching/fic-subscriptions/{memberId}:
 *   get:
 *     summary: GET /fic-subscriptions/:memberId
 *     tags: [p2p-matching]
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
 * /p2p-matching/fic-subscriptions:
 *   post:
 *     summary: POST /fic-subscriptions
 *     tags: [p2p-matching]
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
 * /p2p-matching/procurement-documents:
 *   post:
 *     summary: POST /procurement-documents
 *     tags: [p2p-matching]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 *   get:
 *     summary: GET /procurement-documents
 *     tags: [p2p-matching]
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
 * /p2p-matching/three-way-matching:
 *   post:
 *     summary: POST /three-way-matching
 *     tags: [p2p-matching]
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
 * /p2p-matching/three-way-matches:
 *   get:
 *     summary: GET /three-way-matches
 *     tags: [p2p-matching]
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
 * /p2p-matching/ai-insights:
 *   post:
 *     summary: POST /ai-insights
 *     tags: [p2p-matching]
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
 * /p2p-matching/analytics-reports:
 *   get:
 *     summary: GET /analytics-reports
 *     tags: [p2p-matching]
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
 * /p2p-matching/supply-demand-policies:
 *   post:
 *     summary: POST /supply-demand-policies
 *     tags: [p2p-matching]
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
 * /p2p-matching/profile-analysis/{analyzedmemberId}:
 *   get:
 *     summary: GET /profile-analysis/:analyzedmemberId
 *     tags: [p2p-matching]
 *     parameters:
 *       - in: path
 *         name: analyzedmemberId
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
 * /p2p-matching/marketing-matches:
 *   post:
 *     summary: POST /marketing-matches
 *     tags: [p2p-matching]
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
 * /p2p-matching/sentinel-logs:
 *   get:
 *     summary: GET /sentinel-logs
 *     tags: [p2p-matching]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
