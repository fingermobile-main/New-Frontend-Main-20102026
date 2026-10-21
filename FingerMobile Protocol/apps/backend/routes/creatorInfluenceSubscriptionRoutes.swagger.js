/**
 * @swagger
 * tags:
 *   name: creatorInfluenceSubscriptionRoutes
 *   description: Auto-generated endpoints for creatorInfluenceSubscriptionRoutes
 */

/**
 * @swagger
 * /creatorInfluenceSubscriptionRoutes/tiers:
 *   get:
 *     summary: GET /tiers
 *     tags: [creatorInfluenceSubscriptionRoutes]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /creatorInfluenceSubscriptionRoutes/recommend/{member_id}:
 *   post:
 *     summary: POST /recommend/:member_id
 *     tags: [creatorInfluenceSubscriptionRoutes]
 *     parameters:
 *       - in: path
 *         name: member_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /creatorInfluenceSubscriptionRoutes:
 *   post:
 *     summary: POST /
 *     tags: [creatorInfluenceSubscriptionRoutes]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /creatorInfluenceSubscriptionRoutes/member/{member_id}:
 *   get:
 *     summary: GET /member/:member_id
 *     tags: [creatorInfluenceSubscriptionRoutes]
 *     parameters:
 *       - in: path
 *         name: member_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /creatorInfluenceSubscriptionRoutes/benefits/{level}:
 *   get:
 *     summary: GET /benefits/:level
 *     tags: [creatorInfluenceSubscriptionRoutes]
 *     parameters:
 *       - in: path
 *         name: level
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /creatorInfluenceSubscriptionRoutes/upgrade/{member_id}:
 *   patch:
 *     summary: PATCH /upgrade/:member_id
 *     tags: [creatorInfluenceSubscriptionRoutes]
 *     parameters:
 *       - in: path
 *         name: member_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /creatorInfluenceSubscriptionRoutes/downgrade/{member_id}:
 *   patch:
 *     summary: PATCH /downgrade/:member_id
 *     tags: [creatorInfluenceSubscriptionRoutes]
 *     parameters:
 *       - in: path
 *         name: member_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /creatorInfluenceSubscriptionRoutes/cancel/{subscription_id}:
 *   delete:
 *     summary: DELETE /cancel/:subscription_id
 *     tags: [creatorInfluenceSubscriptionRoutes]
 *     parameters:
 *       - in: path
 *         name: subscription_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /creatorInfluenceSubscriptionRoutes/access/{member_id}/{feature}:
 *   get:
 *     summary: GET /access/:member_id/:feature
 *     tags: [creatorInfluenceSubscriptionRoutes]
 *     parameters:
 *       - in: path
 *         name: member_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: feature
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /creatorInfluenceSubscriptionRoutes/payment:
 *   post:
 *     summary: POST /payment
 *     tags: [creatorInfluenceSubscriptionRoutes]
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /creatorInfluenceSubscriptionRoutes/usage/{member_id}:
 *   get:
 *     summary: GET /usage/:member_id
 *     tags: [creatorInfluenceSubscriptionRoutes]
 *     parameters:
 *       - in: path
 *         name: member_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /creatorInfluenceSubscriptionRoutes/billing/{member_id}:
 *   get:
 *     summary: GET /billing/:member_id
 *     tags: [creatorInfluenceSubscriptionRoutes]
 *     parameters:
 *       - in: path
 *         name: member_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */

/**
 * @swagger
 * /creatorInfluenceSubscriptionRoutes/invoice/{subscription_id}:
 *   get:
 *     summary: GET /invoice/:subscription_id
 *     tags: [creatorInfluenceSubscriptionRoutes]
 *     parameters:
 *       - in: path
 *         name: subscription_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       201:
 *         description: Created successfully
 *       204:
 *         description: Deleted successfully
 */
