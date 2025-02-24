import { redirect } from '@sveltejs/kit';
import { getGitHubAuthUrl } from '$lib/server/auth';
import { logger } from '$lib/utils/logger';

export function GET() {
    logger.info('Initiating GitHub auth flow');
    throw redirect(302, getGitHubAuthUrl());
}
