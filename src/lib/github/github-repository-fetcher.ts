import type { GithubProfile, GithubRepository } from "@/types/github";

export class GithubRepositoryFetcher {
  async fetchProfile(username: string): Promise<GithubProfile> {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 0 },
    });

    if (res.status === 404) {
      throw new Error("GitHub user not found.");
    }
    if (!res.ok) {
      throw new Error(`GitHub profile request failed: ${res.status}`);
    }

    const data = (await res.json()) as {
      login: string;
      name: string | null;
      bio: string | null;
      avatar_url: string;
      html_url: string;
      public_repos: number;
      followers: number;
      following: number;
      location: string | null;
      company: string | null;
      email: string | null;
      blog: string | null;
      twitter_username: string | null;
      created_at: string;
      updated_at: string;
    };

    return {
      username: data.login,
      name: data.name,
      bio: data.bio,
      avatarUrl: data.avatar_url,
      htmlUrl: data.html_url,
      publicRepos: data.public_repos,
      followers: data.followers,
      following: data.following,
      location: data.location,
      company: data.company,
      email: data.email,
      blog: data.blog,
      twitterUsername: data.twitter_username,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async fetchRepositories(username: string): Promise<GithubRepository[]> {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 0 },
      }
    );

    if (res.status === 404) {
      throw new Error("GitHub user not found.");
    }
    if (!res.ok) {
      throw new Error(`GitHub repositories request failed: ${res.status}`);
    }

    const items = (await res.json()) as Array<{
      id: number;
      name: string;
      full_name: string;
      description: string | null;
      html_url: string;
      language: string | null;
      topics: string[];
      stargazers_count: number;
      forks_count: number;
      fork: boolean;
      archived: boolean;
      created_at: string;
      updated_at: string;
    }>;

    return items.map((repo) => ({
      id: `gh_repo_${repo.id}`,
      githubId: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      htmlUrl: repo.html_url,
      languages: repo.language ? [repo.language] : [],
      topics: repo.topics ?? [],
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      isFork: repo.fork,
      isArchived: repo.archived,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
    }));
  }
}
