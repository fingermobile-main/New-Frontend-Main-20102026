/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Media content management API
 *
 * /api/media:
 *   get:
 *     summary: Get all media
 *     tags: [Media]
 *     responses:
 *       200:
 *         description: A list of media items
 *
 * /api/media/{mediaId}:
 *   get:
 *     summary: Get a media item by ID
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: mediaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media details
 *   put:
 *     summary: Update a media item
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: mediaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media updated successfully
 *   delete:
 *     summary: Delete a media item
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: mediaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media deleted successfully
 *
 * /api/media/upload:
 *   post:
 *     summary: Upload new media
 *     tags: [Media]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Media uploaded successfully
 *
 * /api/media/user/{userId}:
 *   get:
 *     summary: Get media by a specific user
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of the user's media
 *
 * /api/media/trending:
 *   get:
 *     summary: Get trending media
 *     tags: [Media]
 *     responses:
 *       200:
 *         description: A list of trending media items
 */
