/**
 * @swagger
 * tags:
 *   name: Gamification
 *   description: Gamification and achievements API
 *
 * /api/gamification/profile/{memberId}:
 *   get:
 *     summary: Get gamification profile
 *     tags: [Gamification]
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
 *         description: Gamification profile details
 *
 * /api/gamification/achievements:
 *   get:
 *     summary: Get all available achievements
 *     tags: [Gamification]
 *     responses:
 *       200:
 *         description: A list of achievements
 *
 * /api/gamification/achievements/{memberId}:
 *   get:
 *     summary: Get achievements for a member
 *     tags: [Gamification]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member achievements
 *
 * /api/gamification/badges/{memberId}:
 *   get:
 *     summary: Get badges for a member
 *     tags: [Gamification]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member badges
 *
 * /api/gamification/leaderboard:
 *   get:
 *     summary: Get the gamification leaderboard
 *     tags: [Gamification]
 *     responses:
 *       200:
 *         description: Leaderboard data
 *
 * /api/gamification/progress/{memberId}:
 *   get:
 *     summary: Get progress for a member
 *     tags: [Gamification]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member progress
 *
 * /api/gamification/streak/{memberId}:
 *   get:
 *     summary: Get streak for a member
 *     tags: [Gamification]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member streak data
 *
 * /api/gamification/update-streak/{memberId}:
 *   post:
 *     summary: Update streak for a member
 *     tags: [Gamification]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Streak updated
 *
 * /api/gamification/award-points:
 *   post:
 *     summary: Award points to a member
 *     tags: [Gamification]
 *     responses:
 *       200:
 *         description: Points awarded
 */
