/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: Endpoints for user profile and settings management
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     membername:
 *                       type: string
 *                     avatar_url:
 *                       type: string
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update the current user's profile
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - membername
 *             properties:
 *               membername:
 *                 type: string
 *                 description: New membername
 *               avatar_url:
 *                 type: string
 *                 description: URL to the new avatar image
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     membername:
 *                       type: string
 *                     avatar_url:
 *                       type: string
 *       400:
 *         description: Membername is required
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/settings:
 *   put:
 *     summary: Update the current user's settings
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notifications_enabled:
 *                 type: boolean
 *               privacy_level:
 *                 type: string
 *     responses:
 *       200:
 *         description: User settings updated successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/{id}/ces:
 *   get:
 *     summary: Get the Content Engagement Score (CES) for a user
 *     tags: [User Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: CES retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     likes:
 *                       type: integer
 *                     saves:
 *                       type: integer
 *                     comments:
 *                       type: integer
 *       500:
 *         description: Internal server error
 */
