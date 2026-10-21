/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative API
 *
 * /api/admin/members:
 *   get:
 *     summary: Get all members (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of members
 *   post:
 *     summary: Create a member (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Member created
 *
 * /api/admin/users:
 *   get:
 *     summary: Get all users (platform admins)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     summary: Manage a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User managed
 *
 * /api/admin/verification-records:
 *   get:
 *     summary: Get verification records
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of verification records
 *
 * /api/admin/update-verification-status:
 *   post:
 *     summary: Update verification status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification status updated
 *
 * /api/admin/security-events:
 *   get:
 *     summary: Get security events
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of security events
 *
 * /api/admin/configurations:
 *   get:
 *     summary: Get system configurations
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System configurations
 *
 * /api/admin/configurations/{key}:
 *   put:
 *     summary: Update a configuration
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Configuration updated
 *
 * /api/admin/rbac/roles:
 *   get:
 *     summary: Get RBAC roles
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 *
 * /api/admin/rbac/assign:
 *   post:
 *     summary: Assign RBAC role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role assigned
 *
 * /api/admin/rbac/permissions:
 *   get:
 *     summary: Get RBAC permissions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions
 *
 * /api/admin/rate-limit:
 *   get:
 *     summary: Get rate limits
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rate limits
 *   post:
 *     summary: Update rate limits
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rate limit updated
 */
