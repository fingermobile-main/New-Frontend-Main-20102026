/**
 * @swagger
 * tags:
 *   name: Storefront
 *   description: Storefront management and commerce API
 *
 * /api/storefront:
 *   get:
 *     summary: Get all stores
 *     tags: [Storefront]
 *     responses:
 *       200:
 *         description: A list of stores
 *   post:
 *     summary: Create a new store
 *     tags: [Storefront]
 *     responses:
 *       201:
 *         description: Store created successfully
 *
 * /api/storefront/products:
 *   get:
 *     summary: Get products across stores
 *     tags: [Storefront]
 *     responses:
 *       200:
 *         description: A list of products
 *   post:
 *     summary: Add a new product to default store
 *     tags: [Storefront]
 *     responses:
 *       201:
 *         description: Product added successfully
 *
 * /api/storefront/orders/my-orders:
 *   get:
 *     summary: Get user's orders
 *     tags: [Storefront]
 *     responses:
 *       200:
 *         description: List of user orders
 *
 * /api/storefront/stats:
 *   get:
 *     summary: Get storefront statistics
 *     tags: [Storefront]
 *     responses:
 *       200:
 *         description: Storefront statistics
 *
 * /api/storefront/{slug}:
 *   get:
 *     summary: Get a store by slug
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store details
 *
 * /api/storefront/{storeId}:
 *   put:
 *     summary: Update a store
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store updated successfully
 *   delete:
 *     summary: Delete a store
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store deleted successfully
 *
 * /api/storefront/users/{userId}/storefronts:
 *   get:
 *     summary: Get stores owned by a user
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user's stores
 *
 * /api/storefront/{storeId}/products:
 *   get:
 *     summary: Get products of a store
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of store products
 *   post:
 *     summary: Add a product to a store
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Product added successfully
 *
 * /api/storefront/products/{productId}:
 *   get:
 *     summary: Get product details
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *   put:
 *     summary: Update a product
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *   delete:
 *     summary: Delete a product
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *
 * /api/storefront/products/{productId}/inventory:
 *   get:
 *     summary: Get product inventory
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product inventory details
 *
 * /api/storefront/inventory/{inventoryId}:
 *   put:
 *     summary: Update inventory
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: inventoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory updated successfully
 *
 * /api/storefront/inventory/{inventoryId}/restock:
 *   post:
 *     summary: Restock inventory
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: inventoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory restocked successfully
 *
 * /api/storefront/inventory/{inventoryId}/logs:
 *   get:
 *     summary: Get inventory logs
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: inventoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory history logs
 *
 * /api/storefront/{storeId}/inventory/low-stock:
 *   get:
 *     summary: Get low stock inventory items for a store
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Low stock items
 *
 * /api/storefront/{storeId}/analytics/daily:
 *   get:
 *     summary: Get daily analytics for a store
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daily analytics data
 *
 * /api/storefront/{storeId}/analytics/events:
 *   get:
 *     summary: Get analytics events for a store
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analytics events data
 *
 * /api/storefront/{storeId}/analytics/dashboard:
 *   get:
 *     summary: Get analytics dashboard data for a store
 *     tags: [Storefront]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dashboard data
 */
