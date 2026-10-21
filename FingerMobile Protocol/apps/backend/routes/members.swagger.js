/**
 * @swagger
 * tags:
 *   name: Members
 *   description: User profiles, followers, and member management
 */

/**
 * @swagger
 * /members:
 *   get:
 *     summary: Get all members
 *     description: Retrieve a paginated list of platform members.
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of members
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /members/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve the profile of the authenticated user.
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /members/{memberId}:
 *   get:
 *     summary: Get member by ID
 *     description: Retrieve public profile data for a specific member.
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the member
 *     responses:
 *       200:
 *         description: Member profile data
 *       404:
 *         description: Member not found
 *   put:
 *     summary: Update member profile
 *     description: Update profile information for the authenticated member.
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       403:
 *         description: Forbidden (cannot edit other users)
 */

/**
 * @swagger
 * /members/{memberId}/follow:
 *   post:
 *     summary: Follow a member
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully followed member
 */

/**
 * @swagger
 * /members/{memberId}/unfollow:
 *   post:
 *     summary: Unfollow a member
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully unfollowed member
 */
