"use client";

import { Github } from "lucide-react";
import type { GithubRepository } from "@/types/github";

interface GithubRepositoryCardProps {
  repository: GithubRepository;
}

export default function GithubRepositoryCard({ repository }: GithubRepositoryCardProps) {
  return (
    <div className="card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-brand-700">
          <Github className="size-4" />
          <a href={repository.htmlUrl} target="_blank" rel="noreferrer" className="hover:underline">
            {repository.fullName}
          </a>
        </div>
        <div className="text-xs text-ink-500">
          {repository.isArchived ? "Archived" : repository.isFork ? "Fork" : "Source"}
        </div>
      </div>
      <p className="text-sm text-ink-700 line-clamp-2">{repository.description ?? "No description provided."}</p>
      <div className="flex flex-wrap gap-2 text-xs text-ink-600">
        {repository.languages.map((language) => (
          <span key={language} className="rounded-lg bg-brand-50 px-2 py-0.5 text-brand-700">
            {language}
          </span>
        ))}
        {repository.topics.map((topic) => (
          <span key={topic} className="rounded-lg bg-ink-100 px-2 py-0.5 text-ink-700">
            {topic}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3 text-xs text-ink-500">
        <span>⭐ {repository.stars}</span>
        <span>⑂ {repository.forks}</span>
        <span>Updated {new Date(repository.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
