/**
 * @swagger
 * tags:
 *   name: Publicitee
 *   description: Ad campaigns and impressions management
 */

/**
 * @swagger
 * /publicitee/campaigns:
 *   get:
 *     summary: Get all campaigns
 *     tags: [Publicitee]
 *     responses:
 *       200:
 *         description: List of campaigns retrieved successfully
 *   post:
 *     summary: Create a new campaign
 *     tags: [Publicitee]
 *     responses:
 *       201:
 *         description: Campaign created successfully
 */

/**
 * @swagger
 * /publicitee/campaigns/{campaignId}:
 *   get:
 *     summary: Get campaign by ID
 *     tags: [Publicitee]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign retrieved successfully
 *   put:
 *     summary: Update campaign
 *     tags: [Publicitee]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign updated successfully
 *   delete:
 *     summary: Delete campaign
 *     tags: [Publicitee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Campaign deleted successfully
 */

/**
 * @swagger
 * /publicitee/campaigns/{campaignId}/impressions:
 *   get:
 *     summary: Get impressions for a campaign
 *     tags: [Publicitee]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Impressions retrieved successfully
 */

/**
 * @swagger
 * /publicitee/impressions:
 *   post:
 *     summary: Log a new impression
 *     tags: [Publicitee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Impression logged successfully
 */

/**
 * @swagger
 * /publicitee/campaigns/{campaignId}/analytics:
 *   get:
 *     summary: Get analytics for a campaign
 *     tags: [Publicitee]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 */

/**
 * @swagger
 * /publicitee/members/{memberId}/campaigns:
 *   get:
 *     summary: Get campaigns for a specific member
 *     tags: [Publicitee]
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
 *         description: Campaigns retrieved successfully
 */
