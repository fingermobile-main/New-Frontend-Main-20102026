/**
 * @swagger
 * tags:
 *   name: Connections
 *   description: Member connections and social graph API
 *
 * /api/connections:
 *   get:
 *     summary: Get my connections
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of connected members
 *
 * /api/connections/requests:
 *   get:
 *     summary: Get pending connection requests
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending requests
 *
 * /api/connections/request/{targetMemberId}:
 *   post:
 *     summary: Send a connection request
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetMemberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Connection request sent
 *
 * /api/connections/accept/{requestId}:
 *   post:
 *     summary: Accept a connection request
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Connection request accepted
 *
 * /api/connections/reject/{requestId}:
 *   post:
 *     summary: Reject a connection request
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Connection request rejected
 *
 * /api/connections/remove/{connectedMemberId}:
 *   delete:
 *     summary: Remove a connection
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: connectedMemberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Connection removed
 *
 * /api/connections/block/{targetMemberId}:
 *   post:
 *     summary: Block a member
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetMemberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member blocked
 *
 * /api/connections/unblock/{blockedMemberId}:
 *   delete:
 *     summary: Unblock a member
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blockedMemberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member unblocked
 *
 * /api/connections/blocked:
 *   get:
 *     summary: Get blocked members
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of blocked members
 *
 * /api/connections/search/{query}:
 *   get:
 *     summary: Search connections
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 *
 * /api/connections/suggestions:
 *   get:
 *     summary: Get connection suggestions
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Suggested members to connect with
 */
