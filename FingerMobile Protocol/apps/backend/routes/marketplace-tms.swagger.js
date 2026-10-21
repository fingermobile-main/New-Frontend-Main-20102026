/**
 * @swagger
 * tags:
 *   name: Marketplace-TMS
 *   description: Marketplace Transportation Management System API
 *
 * /api/marketplace-tms:
 *   get:
 *     summary: Get all TMS orders
 *     tags: [Marketplace-TMS]
 *     responses:
 *       200:
 *         description: A list of TMS orders
 *   post:
 *     summary: Create a new TMS order
 *     tags: [Marketplace-TMS]
 *     responses:
 *       201:
 *         description: TMS order created successfully
 *
 * /api/marketplace-tms/{orderId}:
 *   get:
 *     summary: Get a TMS order by ID
 *     tags: [Marketplace-TMS]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: TMS order details
 *   put:
 *     summary: Update a TMS order
 *     tags: [Marketplace-TMS]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: TMS order updated successfully
 *
 * /api/marketplace-tms/{orderId}/tracking:
 *   get:
 *     summary: Get tracking info for a TMS order
 *     tags: [Marketplace-TMS]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tracking details for the order
 */
