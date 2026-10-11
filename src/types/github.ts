export type SyncStatus = "idle" | "connecting" | "syncing" | "success" | "error";

export interface GithubRepository {
  id: string;
  githubId: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  languages: string[];
  topics: string[];
  stars: number;
  forks: number;
  isFork: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GithubProfile {
  username: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string | null;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  location: string | null;
  company: string | null;
  email: string | null;
  blog: string | null;
  twitterUsername: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GithubState {
  connected: boolean;
  githubProfile: GithubProfile | null;
  githubUsername: string | null;
  repositories: GithubRepository[];
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  error: string | null;
}
