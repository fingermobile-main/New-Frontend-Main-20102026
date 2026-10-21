/**
 * @swagger
 * tags:
 *   name: Moderation
 *   description: Content and user moderation API
 *
 * /api/moderation/reports:
 *   get:
 *     summary: Get all moderation reports
 *     tags: [Moderation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reports
 *   post:
 *     summary: Create a moderation report
 *     tags: [Moderation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Report created
 *
 * /api/moderation/reports/{reportId}:
 *   get:
 *     summary: Get a report by ID
 *     tags: [Moderation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report details
 *   put:
 *     summary: Update a report
 *     tags: [Moderation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report updated
 *
 * /api/moderation/warnings/{userId}:
 *   get:
 *     summary: Get warnings for a user
 *     tags: [Moderation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User warnings
 *
 * /api/moderation/categories:
 *   get:
 *     summary: Get moderation categories
 *     tags: [Moderation]
 *     responses:
 *       200:
 *         description: List of categories
 *
 * /api/moderation/dashboard-stats:
 *   get:
 *     summary: Get moderation dashboard stats
 *     tags: [Moderation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
