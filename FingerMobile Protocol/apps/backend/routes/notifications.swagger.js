/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Endpoints for sending notifications and managing user notification preferences
 */

/**
 * @swagger
 * /notifications/email:
 *   post:
 *     summary: Send email notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *               - template
 *             properties:
 *               to:
 *                 type: string
 *               subject:
 *                 type: string
 *               template:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /notifications/sms:
 *   post:
 *     summary: Send SMS notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - message
 *             properties:
 *               to:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: SMS sent successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /notifications/push:
 *   post:
 *     summary: Send push notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetUserId
 *               - title
 *               - body
 *             properties:
 *               targetUserId:
 *                 type: string
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Push notification sent successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /notifications/register-device:
 *   post:
 *     summary: Register device for push notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceToken
 *               - platform
 *             properties:
 *               deviceToken:
 *                 type: string
 *               platform:
 *                 type: string
 *               deviceId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Device registered successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /notifications/preferences:
 *   get:
 *     summary: Get notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification preferences retrieved successfully
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update notification preferences
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: boolean
 *               sms:
 *                 type: boolean
 *               push:
 *                 type: boolean
 *               marketing:
 *                 type: boolean
 *               security_alerts:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *       500:
 *         description: Internal server error
 */
