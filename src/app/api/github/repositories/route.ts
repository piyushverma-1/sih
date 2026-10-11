import { NextRequest, NextResponse } from "next/server";
import type { GithubRepository } from "@/types/github";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const repositories = (await readRepositories()) as GithubRepository[];
  return NextResponse.json({ repositories });
}

export async function readRepositories(): Promise<GithubRepository[]> {
  return [];
}
