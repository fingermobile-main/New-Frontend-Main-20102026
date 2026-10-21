/**
 * @swagger
 * tags:
 *   name: Voicefeed
 *   description: Audio clips and voicefeed management
 */

/**
 * @swagger
 * /voicefeed/clips:
 *   get:
 *     summary: Get all voice clips
 *     tags: [Voicefeed]
 *     responses:
 *       200:
 *         description: List of voice clips retrieved successfully
 *   post:
 *     summary: Create a new voice clip
 *     tags: [Voicefeed]
 *     responses:
 *       201:
 *         description: Voice clip created successfully
 */

/**
 * @swagger
 * /voicefeed/clips/{clipId}:
 *   get:
 *     summary: Get voice clip by ID
 *     tags: [Voicefeed]
 *     parameters:
 *       - in: path
 *         name: clipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Voice clip retrieved successfully
 *   put:
 *     summary: Update voice clip
 *     tags: [Voicefeed]
 *     parameters:
 *       - in: path
 *         name: clipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Voice clip updated successfully
 *   delete:
 *     summary: Delete voice clip
 *     tags: [Voicefeed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Voice clip deleted successfully
 */

/**
 * @swagger
 * /voicefeed/clips/{clipId}/like:
 *   post:
 *     summary: Like a voice clip
 *     tags: [Voicefeed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Voice clip liked successfully
 *   delete:
 *     summary: Unlike a voice clip
 *     tags: [Voicefeed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Voice clip unliked successfully
 */

/**
 * @swagger
 * /voicefeed/members/{memberId}/clips:
 *   get:
 *     summary: Get voice clips by a specific member
 *     tags: [Voicefeed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Voice clips retrieved successfully
 */

/**
 * @swagger
 * /voicefeed/clips/{clipId}/comments:
 *   get:
 *     summary: Get comments for a voice clip
 *     tags: [Voicefeed]
 *     parameters:
 *       - in: path
 *         name: clipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *   post:
 *     summary: Add a comment to a voice clip
 *     tags: [Voicefeed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 */

/**
 * @swagger
 * /voicefeed/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Voicefeed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Comment deleted successfully
 */
