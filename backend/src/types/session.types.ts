import 'express-session';

declare module 'express-session' {
    interface SessionData {
        accessToken?: string;
        refreshToken?: string;
        patientId?: string;
        expiresAt?: number;
        codeVerifier?: string;
        state?: string;
    }
}
