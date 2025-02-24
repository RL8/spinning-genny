export const GITHUB_REPO_NAME_REGEX = /^[a-zA-Z0-9_.-]+$/;
export const GITHUB_REPO_NAME_MAX_LENGTH = 100;

export function validateRepoName(name: string): string | null {
  if (!name) return 'Repository name is required';
  if (!GITHUB_REPO_NAME_REGEX.test(name)) {
    return 'Repository name can only contain letters, numbers, hyphens, periods, and underscores';
  }
  if (name.length > GITHUB_REPO_NAME_MAX_LENGTH) {
    return 'Repository name cannot exceed 100 characters';
  }
  return null;
}

export function validateArtifactFile(file: File): string | null {
  if (!file) return 'Artifact file is required';
  if (file.type !== 'text/plain') return 'Only .txt files are allowed';
  if (file.size > 5 * 1024 * 1024) return 'File size cannot exceed 5MB';
  return null;
}
