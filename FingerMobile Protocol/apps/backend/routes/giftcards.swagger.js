/**
 * @swagger
 * tags:
 *   name: Giftcards
 *   description: Giftcard management API
 *
 * /api/giftcards:
 *   get:
 *     summary: Get all giftcards
 *     tags: [Giftcards]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, redeemed, expired, cancelled]
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *           enum: [NGN, USD, EUR, GBP]
 *     responses:
 *       200:
 *         description: A list of giftcards
 *   post:
 *     summary: Create a new giftcard
 *     tags: [Giftcards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *                 enum: [NGN, USD, EUR, GBP]
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Giftcard created successfully
 *
 * /api/giftcards/stats:
 *   get:
 *     summary: Get giftcard stats
 *     tags: [Giftcards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Giftcard statistics
 *
 * /api/giftcards/{id}:
 *   get:
 *     summary: Get a giftcard by ID
 *     tags: [Giftcards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Giftcard details
 *   put:
 *     summary: Update a giftcard
 *     tags: [Giftcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [active, cancelled]
 *     responses:
 *       200:
 *         description: Giftcard updated successfully
 *   delete:
 *     summary: Delete a giftcard
 *     tags: [Giftcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Giftcard deleted successfully
 *
 * /api/giftcards/{id}/redeem:
 *   post:
 *     summary: Redeem a giftcard
 *     tags: [Giftcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Giftcard redeemed successfully
 */
