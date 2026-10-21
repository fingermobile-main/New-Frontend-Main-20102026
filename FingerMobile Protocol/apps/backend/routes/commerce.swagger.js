/**
 * @swagger
 * tags:
 *   name: Commerce
 *   description: E-commerce cart and orders API
 *
 * /api/commerce/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Commerce]
 *     responses:
 *       200:
 *         description: Cart details
 *
 * /api/commerce/cart/items:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Commerce]
 *     responses:
 *       201:
 *         description: Item added successfully
 *
 * /api/commerce/cart/items/{id}:
 *   put:
 *     summary: Update a cart item
 *     tags: [Commerce]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Commerce]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item removed successfully
 *
 * /api/commerce/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Commerce]
 *     responses:
 *       200:
 *         description: A list of orders
 *   post:
 *     summary: Create a new order
 *     tags: [Commerce]
 *     responses:
 *       201:
 *         description: Order created successfully
 *
 * /api/commerce/orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Commerce]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 */
