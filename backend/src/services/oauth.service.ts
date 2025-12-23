import axios from 'axios';
import { config } from '../config/env';
import { PKCEService } from './pkce.service';

export interface TokenResponse {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
    patient?: string;
    scope: string;
}

/**
 * OAuth Service
 * Handles OAuth 2.0 authorization flow with PKCE
 */
export class OAuthService {
    /**
     * Generate authorization URL with PKCE parameters
     * @param state - Random state parameter for CSRF protection
     * @param codeChallenge - PKCE code challenge
     * @returns Authorization URL
     */
    static generateAuthorizationUrl(state: string, codeChallenge: string): string {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: config.oauth.clientId,
            redirect_uri: config.oauth.redirectUri,
            scope: config.oauth.scopes,
            state,
            aud: config.openemr.fhirBaseUrl,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
        });

        return `${config.oauth.authorizationUrl}?${params.toString()}`;
    }

    /**
     * Exchange authorization code for access token
     * @param code - Authorization code from callback
     * @param codeVerifier - PKCE code verifier
     * @returns Token response with access token and patient ID
     */
    static async exchangeCodeForToken(
        code: string,
        codeVerifier: string
    ): Promise<TokenResponse> {
        try {
            const params: any = {
                grant_type: 'authorization_code',
                code,
                redirect_uri: config.oauth.redirectUri,
                client_id: config.oauth.clientId,
                code_verifier: codeVerifier,
            };

            // Add client_secret if available (for confidential clients)
            if (config.oauth.clientSecret) {
                params.client_secret = config.oauth.clientSecret;
            }

            const response = await axios.post<TokenResponse>(
                config.oauth.tokenUrl,
                new URLSearchParams(params),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            console.log('Token exchange successful. Granted scopes:', response.data.scope);
            return response.data;
        } catch (error: any) {
            console.error('Token exchange error:', error.response?.data || error.message);
            throw new Error('Failed to exchange authorization code for token');
        }
    }

    /**
     * Refresh access token using refresh token
     * @param refreshToken - Refresh token
     * @returns New token response
     */
    static async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
        try {
            const params: any = {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: config.oauth.clientId,
            };

            // Add client_secret if available (for confidential clients)
            if (config.oauth.clientSecret) {
                params.client_secret = config.oauth.clientSecret;
            }

            const response = await axios.post<TokenResponse>(
                config.oauth.tokenUrl,
                new URLSearchParams(params),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Token refresh error:', error.response?.data || error.message);
            throw new Error('Failed to refresh access token');
        }
    }
}
