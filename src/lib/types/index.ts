export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
}

export interface GeneratorResult {
  success: boolean;
  url?: string;
  error?: string;
  status?: DeploymentStatus;
}

export interface DeploymentStatus {
  step: 'init' | 'create-repo' | 'upload-files' | 'enable-pages' | 'deploy';
  error?: string;
}
