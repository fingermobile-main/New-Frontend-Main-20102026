/**
 * @swagger
 * tags:
 *   name: Community
 *   description: Endpoints for managing community rules, moderators, roles, and analytics
 */

/**
 * @swagger
 * /community/rules:
 *   post:
 *     summary: Create a community rule
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               communityType:
 *                 type: string
 *                 description: Type of community
 *               communityId:
 *                 type: string
 *                 description: ID of the community
 *               ruleTitle:
 *                 type: string
 *               ruleDescription:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rule created successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /community/rules/{communityType}/{communityId}:
 *   get:
 *     summary: Get community rules
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: communityType
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of rules
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /community/rules/{id}:
 *   put:
 *     summary: Update a community rule
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ruleTitle:
 *                 type: string
 *               ruleDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rule updated successfully
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a community rule
 *     tags: [Community]
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
 *         description: Rule deleted successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /community/moderators:
 *   post:
 *     summary: Assign a moderator to a community
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               communityType:
 *                 type: string
 *               communityId:
 *                 type: string
 *               memberId:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Moderator assigned successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /community/moderators/{communityType}/{communityId}:
 *   get:
 *     summary: Get community moderators
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: communityType
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of moderators
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /community/moderators/{id}:
 *   delete:
 *     summary: Remove a moderator from a community
 *     tags: [Community]
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
 *         description: Moderator removed successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /community/members/{communityType}/{communityId}/{memberId}/role:
 *   put:
 *     summary: Update a member's role in a community
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityType
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member role updated successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /community/analytics/{communityType}/{communityId}:
 *   get:
 *     summary: Get community analytics
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityType
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /community/analytics/{communityType}/{communityId}/refresh:
 *   post:
 *     summary: Refresh community analytics
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityType
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analytics refreshed successfully
 *       500:
 *         description: Internal server error
 */
