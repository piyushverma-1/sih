import { NextRequest, NextResponse } from "next/server";
import type { GithubProfile } from "@/types/github";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const profile = (await readProfile()) as GithubProfile | null;
  return NextResponse.json({ profile });
}

export async function readProfile(): Promise<GithubProfile | null> {
  return null;
}
