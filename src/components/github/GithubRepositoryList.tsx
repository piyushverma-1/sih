"use client";

import type { GithubRepository } from "@/types/github";
import GithubRepositoryCard from "./GithubRepositoryCard";

interface GithubRepositoryListProps {
  repositories: GithubRepository[];
}

export default function GithubRepositoryList({ repositories }: GithubRepositoryListProps) {
  if (!repositories.length) {
    return <p className="text-sm text-ink-500">No public repositories found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {repositories.map((repository) => (
        <GithubRepositoryCard key={repository.id} repository={repository} />
      ))}
    </div>
  );
}
