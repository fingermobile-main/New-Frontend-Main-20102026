/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Endpoints for managing likes on posts and other items
 */

/**
 * @swagger
 * /likes:
 *   get:
 *     summary: Retrieve likes for a specific post or user
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         description: Filter by post ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset
 *     responses:
 *       200:
 *         description: Likes retrieved successfully
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new like
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID of the post or item being liked
 *               itemType:
 *                 type: string
 *                 default: post
 *                 description: Type of item (e.g., post, comment)
 *     responses:
 *       201:
 *         description: Item liked successfully
 *       400:
 *         description: Post ID is required
 *       409:
 *         description: User already liked this item
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Remove a like
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: string
 *               itemType:
 *                 type: string
 *                 default: post
 *     responses:
 *       200:
 *         description: Like removed successfully
 *       404:
 *         description: Like not found
 *       500:
 *         description: Internal server error
 */
