declare global {
  namespace App {
    interface Locals {
      user: import('$lib/types').GitHubUser | null;
    }
    interface Error {
      message: string;
    }
  }
}

export {};
