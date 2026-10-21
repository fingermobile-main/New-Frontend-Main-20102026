/**
 * @swagger
 * tags:
 *   name: OAuth2
 *   description: Social authentication and account linking
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth2 authentication
 *     tags: [OAuth2]
 *     description: Redirects the user to Google for authentication.
 *     responses:
 *       302:
 *         description: Redirect to Google consent screen
 */

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback handler
 *     tags: [OAuth2]
 *     description: Handles the callback from Google after successful authentication. Issues a JWT and redirects to frontend.
 *     responses:
 *       302:
 *         description: Redirect to frontend with token on success or error page on failure
 */

/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     summary: Initiate Facebook OAuth2 authentication
 *     tags: [OAuth2]
 *     description: Redirects the user to Facebook for authentication.
 *     responses:
 *       302:
 *         description: Redirect to Facebook consent screen
 */

/**
 * @swagger
 * /auth/facebook/callback:
 *   get:
 *     summary: Facebook OAuth2 callback handler
 *     tags: [OAuth2]
 *     description: Handles the callback from Facebook after successful authentication. Issues a JWT and redirects to frontend.
 *     responses:
 *       302:
 *         description: Redirect to frontend with token on success or error page on failure
 */

/**
 * @swagger
 * /auth/link/google:
 *   get:
 *     summary: Link Google account
 *     tags: [OAuth2]
 *     description: Initiates linking an existing account with a Google account. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       302:
 *         description: Redirect to Google consent screen
 */

/**
 * @swagger
 * /auth/link/google/callback:
 *   get:
 *     summary: Link Google account callback
 *     tags: [OAuth2]
 *     description: Handles the callback to link a Google account.
 *     responses:
 *       302:
 *         description: Redirect to frontend settings with success or error parameter
 */

/**
 * @swagger
 * /auth/link/facebook:
 *   get:
 *     summary: Link Facebook account
 *     tags: [OAuth2]
 *     description: Initiates linking an existing account with a Facebook account. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       302:
 *         description: Redirect to Facebook consent screen
 */

/**
 * @swagger
 * /auth/link/facebook/callback:
 *   get:
 *     summary: Link Facebook account callback
 *     tags: [OAuth2]
 *     description: Handles the callback to link a Facebook account.
 *     responses:
 *       302:
 *         description: Redirect to frontend settings with success or error parameter
 */
