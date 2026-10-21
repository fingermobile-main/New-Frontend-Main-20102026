/**
 * @swagger
 * tags:
 *   name: Forums
 *   description: Forum categories, threads, and posts management
 */

/**
 * @swagger
 * /forums/posts:
 *   get:
 *     summary: Get all forum posts
 *     description: Retrieve a paginated list of all forum posts.
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of posts
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /forums/categories:
 *   get:
 *     summary: Get all forum categories
 *     description: Retrieve all available forum categories.
 *     tags: [Forums]
 *     responses:
 *       200:
 *         description: A list of forum categories
 */

/**
 * @swagger
 * /forums/{categoryId}/threads:
 *   get:
 *     summary: Get threads by category
 *     description: Retrieve forum threads for a specific category.
 *     tags: [Forums]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the category
 *     responses:
 *       200:
 *         description: A list of threads
 *       404:
 *         description: Category not found
 *   post:
 *     summary: Create a new forum thread
 *     description: Create a new thread within a specific category.
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Thread created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /forums/posts:
 *   post:
 *     summary: Create a new forum post/reply
 *     description: Create a reply post in a specific thread.
 *     tags: [Forums]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [thread_id, content]
 *             properties:
 *               thread_id:
 *                 type: string
 *                 format: uuid
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /forums/threads/{threadId}/posts:
 *   get:
 *     summary: Get posts in a forum thread
 *     tags: [Forums]
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of posts for the thread
 *       404:
 *         description: Thread not found
 */
