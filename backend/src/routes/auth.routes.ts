import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { OAuthService } from '../services/oauth.service';
import { PKCEService } from '../services/pkce.service';
import { config } from '../config/env';

const router = Router();

/**
 * GET /auth/login
 * Initiate OAuth authorization flow
 */
router.get('/login', (req: Request, res: Response) => {
    try {
        // Generate PKCE parameters
        const codeVerifier = PKCEService.generateCodeVerifier();
        const codeChallenge = PKCEService.generateCodeChallenge(codeVerifier);

        // Generate state for CSRF protection
        const state = crypto.randomBytes(16).toString('hex');

        // Store in session for callback
        req.session.codeVerifier = codeVerifier;
        req.session.state = state;

        // Generate authorization URL
        const authUrl = OAuthService.generateAuthorizationUrl(state, codeChallenge);

        // Redirect to OpenEMR authorization page
        res.redirect(authUrl);
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({
            error: {
                code: 'LOGIN_ERROR',
                message: 'Failed to initiate login',
            },
        });
    }
});

/**
 * GET /auth/callback
 * OAuth callback handler
 */
router.get('/callback', async (req: Request, res: Response) => {
    try {
        const { code, state } = req.query;

        // Validate state parameter
        if (!state || state !== req.session.state) {
            return res.status(400).json({
                error: {
                    code: 'INVALID_STATE',
                    message: 'Invalid state parameter',
                },
            });
        }

        // Validate authorization code
        if (!code || typeof code !== 'string') {
            return res.status(400).json({
                error: {
                    code: 'MISSING_CODE',
                    message: 'Authorization code not provided',
                },
            });
        }

        // Get code verifier from session
        const codeVerifier = req.session.codeVerifier;
        if (!codeVerifier) {
            return res.status(400).json({
                error: {
                    code: 'MISSING_VERIFIER',
                    message: 'Code verifier not found in session',
                },
            });
        }

        // Exchange code for tokens
        const tokenResponse = await OAuthService.exchangeCodeForToken(code, codeVerifier);

        // Store tokens in session
        req.session.accessToken = tokenResponse.access_token;
        req.session.refreshToken = tokenResponse.refresh_token;
        req.session.patientId = tokenResponse.patient;
        req.session.expiresAt = Date.now() + (tokenResponse.expires_in * 1000);

        // Clear temporary data
        delete req.session.codeVerifier;
        delete req.session.state;

        // Redirect to frontend
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.redirect(`${config.frontend.url}?error=session_save_failed`);
            }
            res.redirect(`${config.frontend.url}/dashboard?login=success`);
        });
    } catch (error: any) {
        console.error('Callback error:', error);
        res.redirect(`${config.frontend.url}?error=auth_failed`);
    }
});

/**
 * POST /auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req: Request, res: Response) => {
    try {
        const refreshToken = req.session.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                error: {
                    code: 'NO_REFRESH_TOKEN',
                    message: 'No refresh token available',
                },
            });
        }

        // Refresh the token
        const tokenResponse = await OAuthService.refreshAccessToken(refreshToken);

        // Update session
        req.session.accessToken = tokenResponse.access_token;
        if (tokenResponse.refresh_token) {
            req.session.refreshToken = tokenResponse.refresh_token;
        }
        req.session.expiresAt = Date.now() + (tokenResponse.expires_in * 1000);

        res.json({
            message: 'Token refreshed successfully',
            expiresIn: tokenResponse.expires_in,
        });
    } catch (error: any) {
        console.error('Refresh error:', error);
        res.status(500).json({
            error: {
                code: 'REFRESH_FAILED',
                message: 'Failed to refresh token',
            },
        });
    }
});

/**
 * POST /auth/logout
 * Clear session
 */
router.post('/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                error: {
                    code: 'LOGOUT_ERROR',
                    message: 'Failed to logout',
                },
            });
        }

        res.json({ message: 'Logged out successfully' });
    });
});

/**
 * GET /auth/status
 * Check authentication status
 */
router.get('/status', (req: Request, res: Response) => {
    console.log('Session in status:', {
        id: req.sessionID,
        hasToken: !!req.session.accessToken,
        patientId: req.session.patientId
    });

    const isAuthenticated = !!req.session.accessToken;

    res.json({
        authenticated: isAuthenticated,
        patientId: req.session.patientId || null,
        expiresAt: req.session.expiresAt || null,
    });
});

export default router;
