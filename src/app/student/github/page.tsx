"use client";

import { useEffect, useCallback } from "react";
import GithubConnectCard from "@/components/github/GithubConnectCard";
import GithubSyncProgress from "@/components/github/GithubSyncProgress";
import GithubRepositoryList from "@/components/github/GithubRepositoryList";
import { useCareerTwin } from "@/lib/store-z";
import type { GithubProfile, GithubRepository } from "@/types/github";

export default function StudentGithubPage() {
  const github = useCareerTwin((s) => s.github);
  const setGithubProfile = useCareerTwin((s) => s.setGithubProfile);
  const setGithubRepositories = useCareerTwin((s) => s.setGithubRepositories);
  const setGithubSyncStatus = useCareerTwin((s) => s.setGithubSyncStatus);
  const setGithubError = useCareerTwin((s) => s.setGithubError);
  const setGithubConnected = useCareerTwin((s) => s.setGithubConnected);

  const connect = useCallback(
    async (url: string) => {
      setGithubSyncStatus("connecting");
      setGithubError(null);

      try {
        const res = await fetch("/api/github/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const data = (await res.json()) as {
          profile?: GithubProfile;
          repositories?: GithubRepository[];
          connected?: boolean;
          githubUsername?: string | null;
          lastSyncedAt?: string | null;
          syncStatus?: "idle" | "connecting" | "syncing" | "success" | "error";
          error?: string | null;
        };

        if (!res.ok) {
          throw new Error(data.error ?? "Failed to connect GitHub.");
        }

        if (data.profile && data.repositories) {
          setGithubProfile(data.profile);
          setGithubRepositories(data.repositories);
          setGithubConnected(data.connected ?? true);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to connect GitHub.";
        setGithubError(message);
      } finally {
        setGithubSyncStatus("idle");
      }
    },
    [setGithubProfile, setGithubRepositories, setGithubConnected, setGithubError, setGithubSyncStatus]
  );

  const sync = useCallback(async () => {
    if (!github.githubUsername) return;
    setGithubSyncStatus("syncing");
    setGithubError(null);

    try {
      const res = await fetch("/api/github/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: github.githubUsername }),
      });

      const data = (await res.json()) as {
        profile?: GithubProfile;
        repositories?: GithubRepository[];
        lastSyncedAt?: string | null;
        syncStatus?: "idle" | "connecting" | "syncing" | "success" | "error";
        error?: string | null;
      };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to sync GitHub.");
      }

      if (data.profile && data.repositories) {
        setGithubProfile(data.profile);
        setGithubRepositories(data.repositories);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sync GitHub.";
      setGithubError(message);
    } finally {
      setGithubSyncStatus("idle");
    }
  }, [github.githubUsername, setGithubProfile, setGithubRepositories, setGithubError, setGithubSyncStatus]);

  useEffect(() => {
    if (github.lastSyncedAt) {
      setGithubSyncStatus("success");
    }
  }, [github.lastSyncedAt, setGithubSyncStatus]);

  return (
    <main className="space-y-6">
      <GithubConnectCard
        connected={github.connected}
        username={github.githubUsername}
        repositoriesCount={github.repositories.length}
        lastSyncedAt={github.lastSyncedAt}
        status={github.syncStatus}
        error={github.error}
        onSubmit={connect}
        onSync={sync}
      />
      <GithubSyncProgress status={github.syncStatus} />
      <GithubRepositoryList repositories={github.repositories} />
    </main>
  );
}
