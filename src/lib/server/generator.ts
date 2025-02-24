import { error } from '@sveltejs/kit';
import type { GeneratorResult, DeploymentStatus } from '$lib/types';
import { createRepository, uploadFiles, enablePages, getGitHubUser } from './github';
import { logger } from '$lib/utils/logger';

export async function generateApp({ 
    name, 
    specs, 
    token,
    onStatus = () => {} 
}: { 
    name: string;
    specs: File;
    token: string;
    onStatus?: (status: DeploymentStatus) => void;
}): Promise<GeneratorResult> {
    try {
        onStatus({ step: 'init' });
        
        // Get user info
        const user = await getGitHubUser(token);

        // Parse artifact specs
        const specsText = await specs.text();
        const artifactFiles = parseArtifact(specsText);

        // Create repository
        const repo = await createRepository(token, name, onStatus);

        // Upload all files
        await uploadFiles(token, user.login, name, artifactFiles, onStatus);

        // Enable GitHub Pages and set up deployment
        await enablePages(token, user.login, name, onStatus);

        // Return the GitHub Pages URL
        const url = `https://${user.login}.github.io/${name}`;
        logger.info(`App generated successfully: ${url}`);
        
        return {
            success: true,
            url,
            status: { step: 'deploy' }
        };
    } catch (e) {
        logger.error('Generation error:', e);
        return {
            success: false,
            error: 'Failed to generate app. Please try again.',
            status: {
                step: e.step || 'init',
                error: e.message
            }
        };
    }
}

function parseArtifact(content: string): Array<{ path: string; content: string }> {
    try {
        const files: Array<{ path: string; content: string }> = [];
        const lines = content.split('\n');
        let currentPath = '';
        let currentContent = '';
        let isReadingContent = false;

        for (const line of lines) {
            if (line.startsWith('├── ') || line.startsWith('└── ')) {
                if (currentPath && currentContent) {
                    files.push({
                        path: currentPath,
                        content: currentContent.trim()
                    });
                }
                currentPath = line.replace('├── ', '').replace('└── ', '');
                currentContent = '';
                isReadingContent = false;
            } else if (line.startsWith('    ')) {
                isReadingContent = true;
                if (isReadingContent) {
                    currentContent += line.substring(4) + '\n';
                }
            }
        }

        // Don't forget the last file
        if (currentPath && currentContent) {
            files.push({
                path: currentPath,
                content: currentContent.trim()
            });
        }

        return files;
    } catch (e) {
        logger.error('Error parsing artifact:', e);
        throw new Error('Invalid artifact format');
    }
}
