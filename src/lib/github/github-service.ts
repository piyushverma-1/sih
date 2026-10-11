import type { GithubProfile, GithubRepository } from "@/types/github";
import { GithubRepositoryFetcher } from "./github-repository-fetcher";

export class GithubService {
  private fetcher: GithubRepositoryFetcher;

  constructor(fetcher = new GithubRepositoryFetcher()) {
    this.fetcher = fetcher;
  }

  async connect(username: string): Promise<{ profile: GithubProfile; repositories: GithubRepository[] }> {
    const sanitized = this.extractUsername(username);
    const [profile, repositories] = await Promise.all([
      this.fetcher.fetchProfile(sanitized),
      this.fetcher.fetchRepositories(sanitized),
    ]);

    return { profile, repositories };
  }

  async sync(username: string): Promise<{ profile: GithubProfile; repositories: GithubRepository[] }> {
    const sanitized = this.extractUsername(username);
    const [profile, repositories] = await Promise.all([
      this.fetcher.fetchProfile(sanitized),
      this.fetcher.fetchRepositories(sanitized),
    ]);

    return { profile, repositories };
  }

  private extractUsername(input: string): string {
    const trimmed = input.trim();
    const urlPatterns = [
      /^https?:\/\/github\.com\/([^\/?#]+)/i,
      /^https?:\/\/www\.github\.com\/([^\/?#]+)/i,
    ];

    for (const pattern of urlPatterns) {
      const match = trimmed.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    if (/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37})$/.test(trimmed)) {
      return trimmed;
    }

    throw new Error("Invalid GitHub username or profile URL.");
  }
}
