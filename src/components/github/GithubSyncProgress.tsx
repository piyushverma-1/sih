"use client";

import type { SyncStatus } from "@/types/github";

const STEPS: { status: Exclude<SyncStatus, "idle" | "error">; label: string }[] = [
  { status: "connecting", label: "Validating GitHub" },
  { status: "syncing", label: "Fetching Repositories" },
  { status: "success", label: "Complete" },
];

interface GithubSyncProgressProps {
  status: SyncStatus;
}

export default function GithubSyncProgress({ status }: GithubSyncProgressProps) {
  if (status === "idle" || status === "error") return null;

  const currentIndex = STEPS.findIndex((step) => step.status === status);

  return (
    <div className="card p-5 space-y-3">
      <div className="text-sm font-medium text-ink-700">Syncing GitHub</div>
      <div className="space-y-2">
        {STEPS.map((step, index) => {
          const active = index === currentIndex;
          const completed = index < currentIndex;
          return (
            <div key={step.status} className="flex items-center gap-2 text-sm">
              <span
                className={[
                  "size-2 rounded-full",
                  completed ? "bg-brand-600" : active ? "bg-brand-400 animate-pulse" : "bg-ink-200",
                ].join(" ")}
              />
              <span className={active ? "text-ink-900 font-medium" : "text-ink-600"}>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
