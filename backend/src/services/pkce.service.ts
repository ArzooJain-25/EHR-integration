import crypto from 'crypto';

/**
 * PKCE (Proof Key for Code Exchange) Service
 * Implements RFC 7636 for OAuth 2.0 public clients
 */
export class PKCEService {
    /**
     * Generate a cryptographically random code verifier
     * @returns Base64URL-encoded random string (128 characters)
     */
    static generateCodeVerifier(): string {
        const buffer = crypto.randomBytes(96);
        return this.base64URLEncode(buffer);
    }

    /**
     * Generate code challenge from verifier using SHA-256
     * @param verifier - The code verifier
     * @returns Base64URL-encoded SHA-256 hash of the verifier
     */
    static generateCodeChallenge(verifier: string): string {
        const hash = crypto.createHash('sha256').update(verifier).digest();
        return this.base64URLEncode(hash);
    }

    /**
     * Base64URL encode a buffer (URL-safe, no padding)
     * @param buffer - Buffer to encode
     * @returns Base64URL-encoded string
     */
    private static base64URLEncode(buffer: Buffer): string {
        return buffer
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
}
