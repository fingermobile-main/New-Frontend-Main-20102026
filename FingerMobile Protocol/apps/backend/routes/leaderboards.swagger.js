/**
 * @swagger
 * tags:
 *   name: Leaderboards
 *   description: Leaderboards management API
 *
 * /api/leaderboards:
 *   get:
 *     summary: Get all leaderboards
 *     tags: [Leaderboards]
 *     responses:
 *       200:
 *         description: A list of leaderboards
 *   post:
 *     summary: Create a new leaderboard
 *     tags: [Leaderboards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Leaderboard created successfully
 *
 * /api/leaderboards/{leaderboardId}:
 *   get:
 *     summary: Get a leaderboard by ID
 *     tags: [Leaderboards]
 *     parameters:
 *       - in: path
 *         name: leaderboardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leaderboard details
 *
 * /api/leaderboards/{leaderboardId}/positions:
 *   get:
 *     summary: Get positions on a leaderboard
 *     tags: [Leaderboards]
 *     parameters:
 *       - in: path
 *         name: leaderboardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leaderboard positions
 *
 * /api/leaderboards/{leaderboardId}/user/{userId}:
 *   get:
 *     summary: Get a user's position on a leaderboard
 *     tags: [Leaderboards]
 *     parameters:
 *       - in: path
 *         name: leaderboardId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's position
 *
 * /api/leaderboards/{leaderboardId}/score:
 *   post:
 *     summary: Submit a score to a leaderboard
 *     tags: [Leaderboards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leaderboardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Score submitted successfully
 *
 * /api/leaderboards/{leaderboardId}/top/{count}:
 *   get:
 *     summary: Get the top N positions on a leaderboard
 *     tags: [Leaderboards]
 *     parameters:
 *       - in: path
 *         name: leaderboardId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: count
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Top positions
 */
