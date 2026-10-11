import { NextRequest, NextResponse } from "next/server";
import { GithubService } from "@/lib/github/github-service";
import type { GithubProfile, GithubRepository } from "@/types/github";

const githubService = new GithubService();

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { url?: string; username?: string };
    const raw = body.url ?? body.username ?? "";

    if (!raw.trim()) {
      return NextResponse.json({ error: "GitHub username or profile URL is required." }, { status: 400 });
    }

    const { profile, repositories } = await githubService.connect(raw.trim());

    const payload = {
      profile,
      repositories,
      connected: true,
      githubUsername: profile.username,
      lastSyncedAt: new Date().toISOString(),
      syncStatus: "success" as const,
      error: null,
    };

    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to connect GitHub.";
    const status = message.toLowerCase().includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message, connected: false, syncStatus: "error" }, { status });
  }
}

export type GithubConnectResponse = {
  profile: GithubProfile;
  repositories: GithubRepository[];
  connected: boolean;
  githubUsername: string | null;
  lastSyncedAt: string | null;
  syncStatus: "idle" | "connecting" | "syncing" | "success" | "error";
  error: string | null;
};
