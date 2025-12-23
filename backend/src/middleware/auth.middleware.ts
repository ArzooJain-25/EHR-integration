import { Request, Response, NextFunction } from 'express';

/**
 * Authentication Middleware
 * Verifies that user has a valid session with access token
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.accessToken) {
        return res.status(401).json({
            error: {
                code: 'UNAUTHORIZED',
                message: 'No active session. Please login first.',
            },
        });
    }

    // Check if token is expired
    if (req.session.expiresAt && Date.now() >= req.session.expiresAt) {
        return res.status(401).json({
            error: {
                code: 'TOKEN_EXPIRED',
                message: 'Access token has expired. Please refresh or login again.',
            },
        });
    }

    next();
};
