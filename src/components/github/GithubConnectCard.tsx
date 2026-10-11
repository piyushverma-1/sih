"use client";

import { useState, type FormEvent } from "react";
import { Github, ArrowRight } from "lucide-react";
import type { SyncStatus } from "@/types/github";

type Status = "idle" | "connecting" | "syncing" | "success" | "error";

interface GithubConnectCardProps {
  connected: boolean;
  username: string | null;
  repositoriesCount: number;
  lastSyncedAt: string | null;
  status: Status;
  error: string | null;
  onSubmit: (url: string) => void;
  onSync: () => void;
}

export default function GithubConnectCard({
  connected,
  username,
  repositoriesCount,
  lastSyncedAt,
  status,
  error,
  onSubmit,
  onSync,
}: GithubConnectCardProps) {
  const [url, setUrl] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    onSubmit(url.trim());
  }

  const busy = status === "connecting" || status === "syncing";

  return (
    <section className="card p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Github className="size-5 text-brand-600" />
        <h1 className="text-xl font-semibold">Connect Your GitHub</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-medium text-ink-700 mb-1 block">GitHub Profile URL</label>
          <input
            className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm"
            placeholder="https://github.com/username"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={busy}
          />
        </div>
        <button className="btn-primary w-full" disabled={busy || !url.trim()}>
          <ArrowRight className="size-4" /> Connect GitHub
        </button>
      </form>

      {!connected && !error && status === "idle" && (
        <p className="text-sm text-ink-500">Not Connected</p>
      )}

      {error && <p className="text-sm text-rose-700">{error}</p>}

      {connected && username && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 space-y-1 text-sm text-emerald-800">
          <p>✓ GitHub Connected</p>
          <p>Username: {username}</p>
          <p>Repositories Found: {repositoriesCount}</p>
          <p>Last Synced: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : "Just now"}</p>
          <button className="btn-primary mt-2" onClick={onSync} disabled={busy}>
            Sync GitHub
          </button>
        </div>
      )}
    </section>
  );
}
