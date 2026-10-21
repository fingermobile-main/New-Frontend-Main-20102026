/**
 * @swagger
 * tags:
 *   name: Achievements
 *   description: Achievements and rewards API
 *
 * /api/achievements:
 *   get:
 *     summary: Get user achievements
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's achievements
 *
 * /api/achievements/available:
 *   get:
 *     summary: Get all available achievements
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all available achievements
 *
 * /api/achievements/{achievementId}/claim:
 *   post:
 *     summary: Claim an achievement reward
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: achievementId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Achievement reward claimed
 *
 * /api/achievements/leaderboard:
 *   get:
 *     summary: Get achievements leaderboard
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Achievements leaderboard data
 */
