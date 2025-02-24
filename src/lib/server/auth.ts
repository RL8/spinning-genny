import { GITHUB_SCOPES } from '$lib/config/constants';
import { logger } from '$lib/utils/logger';

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!clientId || !clientSecret) {
    throw new Error('GitHub OAuth credentials not configured');
}

export async function getGitHubToken(code: string): Promise<string> {
    try {
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to get GitHub token');
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        logger.error('Auth error:', error);
        throw error;
    }
}

export function getGitHubAuthUrl(): string {
    const params = new URLSearchParams({
        client_id: clientId,
        scope: GITHUB_SCOPES.join(' '),
        redirect_uri: `${process.env.PUBLIC_URL}/auth/callback`,
    });

    return `https://github.com/login/oauth/authorize?${params}`;
}
