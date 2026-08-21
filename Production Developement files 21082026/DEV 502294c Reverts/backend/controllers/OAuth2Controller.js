/**
 * OAuth2Controller
 * OAuth2/OIDC endpoints for authorization and token management
 */

const OAuth2OIDCService = require('../services/OAuth2OIDCService');
const logger = require('../utils/logger');

class OAuth2Controller {
    /**
     * GET /oauth/authorize
     * OAuth2 authorization endpoint
     */
    async authorize(req, res) {
        try {
            const { client_id, redirect_uri, scope, state, code_challenge, code_challenge_method } = req.query;

            // Validate required parameters
            if (!client_id || !redirect_uri || !scope) {
                return res.status(400).json({
                    error: 'invalid_request',
                    error_description: 'Missing required parameters'
                });
            }

            // Verify client exists (in production, check database)
            // For now, accept any client_id for development

            // Parse scopes
            const scopes = scope.split(' ');

            // Generate authorization code with PKCE
            const authCode = await OAuth2OIDCService.generateAuthorizationCode(
                client_id,
                req.user.id, // Authenticated user
                scopes,
                redirect_uri
            );

            // Redirect back to client with authorization code
            const redirectUrl = new URL(redirect_uri);
            redirectUrl.searchParams.set('code', authCode.code);
            redirectUrl.searchParams.set('state', state);

            res.redirect(redirectUrl.toString());
        } catch (error) {
            logger.error('Error in authorize:', error);
            res.status(500).json({
                error: 'server_error',
                error_description: 'Internal server error'
            });
        }
    }

    /**
     * POST /oauth/token
     * OAuth2 token endpoint
     */
    async token(req, res) {
        try {
            const { grant_type, code, client_id, client_secret, redirect_uri, code_verifier, refresh_token } = req.body;

            if (grant_type === 'authorization_code') {
                // Authorization code grant
                if (!code || !client_id || !redirect_uri || !code_verifier) {
                    return res.status(400).json({
                        error: 'invalid_request',
                        error_description: 'Missing required parameters for authorization_code grant'
                    });
                }

                const tokens = await OAuth2OIDCService.exchangeCodeForTokens(
                    code,
                    client_id,
                    code_verifier,
                    redirect_uri
                );

                return res.json(tokens);

            } else if (grant_type === 'refresh_token') {
                // Refresh token grant
                if (!refresh_token) {
                    return res.status(400).json({
                        error: 'invalid_request',
                        error_description: 'Missing refresh_token parameter'
                    });
                }

                const tokens = await OAuth2OIDCService.rotateRefreshToken(refresh_token);

                return res.json(tokens);

            } else {
                return res.status(400).json({
                    error: 'unsupported_grant_type',
                    error_description: 'Grant type not supported'
                });
            }
        } catch (error) {
            logger.error('Error in token endpoint:', error);
            
            if (error.message.includes('Invalid') || error.message.includes('expired')) {
                return res.status(401).json({
                    error: 'invalid_grant',
                    error_description: error.message
                });
            }

            if (error.message.includes('Security violation')) {
                return res.status(403).json({
                    error: 'access_denied',
                    error_description: error.message
                });
            }

            res.status(500).json({
                error: 'server_error',
                error_description: 'Internal server error'
            });
        }
    }

    /**
     * GET /oauth/userinfo
     * OIDC userinfo endpoint
     */
    async userinfo(req, res) {
        try {
            // Extract token from Authorization header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    error: 'invalid_token',
                    error_description: 'Missing or invalid authorization header'
                });
            }

            const token = authHeader.substring(7);
            const validation = await OAuth2OIDCService.validateAccessToken(token);

            if (!validation.valid) {
                return res.status(401).json({
                    error: 'invalid_token',
                    error_description: validation.error
                });
            }

            // Get user info from database
            const userResult = await pool.query(
                'SELECT id, email, username, role, created_at FROM members WHERE id = $1',
                [validation.userId]
            );

            if (userResult.rows.length === 0) {
                return res.status(404).json({
                    error: 'invalid_token',
                    error_description: 'User not found'
                });
            }

            const user = userResult.rows[0];

            res.json({
                sub: user.id.toString(),
                email: user.email,
                preferred_username: user.username,
                role: user.role,
                created_at: user.created_at
            });
        } catch (error) {
            logger.error('Error in userinfo:', error);
            res.status(500).json({
                error: 'server_error',
                error_description: 'Internal server error'
            });
        }
    }

    /**
     * GET /.well-known/openid-configuration
     * OIDC discovery endpoint
     */
    async discovery(req, res) {
        try {
            const config = OAuth2OIDCService.getDiscoveryDocument();
            res.json(config);
        } catch (error) {
            logger.error('Error in discovery:', error);
            res.status(500).json({
                error: 'server_error',
                error_description: 'Internal server error'
            });
        }
    }

    /**
     * GET /.well-known/jwks.json
     * JWKS endpoint
     */
    async jwks(req, res) {
        try {
            const jwks = OAuth2OIDCService.getJWKS();
            res.json(jwks);
        } catch (error) {
            logger.error('Error in jwks:', error);
            res.status(500).json({
                error: 'server_error',
                error_description: 'Internal server error'
            });
        }
    }

    /**
     * POST /api/auth/revoke
     * Revoke refresh token
     */
    async revoke(req, res) {
        try {
            const { refresh_token } = req.body;

            if (!refresh_token) {
                return res.status(400).json({
                    success: false,
                    message: 'refresh_token is required'
                });
            }

            const result = await OAuth2OIDCService.revokeToken(refresh_token);

            res.json(result);
        } catch (error) {
            logger.error('Error in revoke:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to revoke token',
                error: error.message
            });
        }
    }

    /**
     * POST /api/auth/rotate
     * Rotate refresh token (get new access/refresh pair)
     */
    async rotate(req, res) {
        try {
            const { refresh_token } = req.body;

            if (!refresh_token) {
                return res.status(400).json({
                    success: false,
                    message: 'refresh_token is required'
                });
            }

            const tokens = await OAuth2OIDCService.rotateRefreshToken(refresh_token);

            res.json({
                success: true,
                ...tokens
            });
        } catch (error) {
            logger.error('Error in rotate:', error);
            
            if (error.message.includes('Security violation')) {
                return res.status(403).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(401).json({
                success: false,
                message: 'Failed to rotate token',
                error: error.message
            });
        }
    }
}

module.exports = new OAuth2Controller();