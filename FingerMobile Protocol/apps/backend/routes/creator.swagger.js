/**
 * @swagger
 * tags:
 *   name: Creator
 *   description: Content creator API
 *
 * /api/creator/schedule:
 *   post:
 *     summary: Schedule content for publishing
 *     tags: [Creator]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - scheduledFor
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               scheduledFor:
 *                 type: string
 *                 format: date-time
 *               platforms:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Content scheduled successfully
 *       500:
 *         description: Internal server error
 */
