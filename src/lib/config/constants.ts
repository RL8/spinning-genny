/**
 * GitHub OAuth scopes required for the application
 */
export const GITHUB_SCOPES = [
    'repo',           // Full control of private repositories
    'workflow',       // Update GitHub Action workflows
    'user',          // Read user profile data
    'admin:repo_hook' // Manage repository hooks
];

/**
 * GitHub Actions workflow for deploying Swiftie apps
 */
export const DEPLOY_WORKFLOW = {
    name: 'Deploy Swiftie App',
    ref: 'refs/heads/main',
    path: '.github/workflows/deploy.yml'
};

/**
 * Maximum allowed file size for artifact uploads (in bytes)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Valid file extensions for artifact uploads
 */
export const VALID_EXTENSIONS = ['.txt'];
