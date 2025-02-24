import type { LayoutServerLoad } from './$types';
import { getGitHubUser } from '$lib/server/github';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
  const token = cookies.get('github_token');
  
  if (!token) {
    return {
      user: null
    };
  }

  try {
    const user = await getGitHubUser(token);
    locals.user = user;  // Store in locals for server-side access
    return {
      user
    };
  } catch (error) {
    cookies.delete('github_token', { path: '/' });
    return {
      user: null
    };
  }
};
