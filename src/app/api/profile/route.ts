import { NextRequest, NextResponse } from "next/server";
import {
  loadProfileServer,
  saveProfileServer,
  resetProfileServer,
} from "@/lib/store";
import type { CandidateProfile } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {

  const profile = await loadProfileServer();
  return NextResponse.json(profile);
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { patch?: Partial<CandidateProfile> };
  const next = await saveProfileServer(body.patch ?? {});
  return NextResponse.json(next);
}

export async function DELETE() {
  const next = await resetProfileServer();
  return NextResponse.json(next);
}


