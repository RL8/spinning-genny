import { logger } from '$lib/utils/logger';
import type { DeploymentStatus } from '$lib/types';
import { GITHUB_SCOPES, DEPLOY_WORKFLOW } from '$lib/config/constants';

export async function getGitHubUser(token: string) {
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch GitHub user');
        }

        return response.json();
    } catch (error) {
        logger.error('Error fetching GitHub user:', error);
        throw error;
    }
}

export async function createRepository(
    token: string,
    name: string,
    onStatus: (status: DeploymentStatus) => void
) {
    try {
        onStatus({ step: 'create-repo' });
        
        const response = await fetch('https://api.github.com/user/repos', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                private: false,
                auto_init: true,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create repository');
        }

        const repo = await response.json();
        logger.info('Repository created:', repo.full_name);
        return repo;
    } catch (error) {
        logger.error('Error creating repository:', error);
        onStatus({ step: 'create-repo', error: 'Failed to create repository' });
        throw error;
    }
}

export async function uploadFiles(
    token: string,
    owner: string,
    repo: string,
    files: Array<{ path: string; content: string }>,
    onStatus: (status: DeploymentStatus) => void
) {
    try {
        onStatus({ step: 'upload-files' });
        
        await Promise.all(
            files.map(async (file) => {
                const response = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
                    {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/vnd.github.v3+json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: `Add ${file.path}`,
                            content: Buffer.from(file.content).toString('base64'),
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to upload ${file.path}`);
                }
                
                logger.info(`Uploaded file: ${file.path}`);
            })
        );
    } catch (error) {
        logger.error('Error uploading files:', error);
        onStatus({ step: 'upload-files', error: 'Failed to upload files' });
        throw error;
    }
}

export async function enablePages(
    token: string,
    owner: string,
    repo: string,
    onStatus: (status: DeploymentStatus) => void
) {
    try {
        onStatus({ step: 'enable-pages' });
        
        // First, enable GitHub Pages
        await fetch(`https://api.github.com/repos/${owner}/${repo}/pages`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                source: {
                    branch: 'main',
                    path: '/build'
                },
            }),
        });

        // Then add the deployment workflow
        await uploadFiles(token, owner, repo, [
            {
                path: '.github/workflows/deploy.yml',
                content: DEPLOY_WORKFLOW,
            },
        ], onStatus);

        onStatus({ step: 'deploy' });
        logger.info(`Pages enabled for: ${owner}/${repo}`);
    } catch (error) {
        logger.error('Error enabling Pages:', error);
        onStatus({ step: 'enable-pages', error: 'Failed to enable GitHub Pages' });
        throw error;
    }
}
