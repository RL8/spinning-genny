import { error, redirect } from '@sveltejs/kit';
import { getGitHubToken } from '$lib/server/auth';
import { logger } from '$lib/utils/logger';

export async function GET({ url, cookies }) {
    const code = url.searchParams.get('code');
    
    if (!code) {
        logger.error('No code provided in callback');
        throw error(400, 'No code provided');
    }

    try {
        const token = await getGitHubToken(code);
        
        if (!token) {
            throw new Error('No token received');
        }

        cookies.set('github_token', token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        logger.info('Successfully authenticated with GitHub');
        throw redirect(302, '/');
    } catch (e) {
        logger.error('Auth callback error:', e);
        throw error(500, 'Authentication failed');
    }
}
