"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Map, ArrowRight, Sparkles, ExternalLink, CheckCircle2 } from "lucide-react";
import { useCareerTwin } from "@/lib/store-z";
import { buildGapMatrix, computeJri, topBlocker } from "@/lib/career-engine";
import { LEARNING_RESOURCES } from "@/mock/resources";
import { TARGET_ROLE_BY_ID, type TargetRoleId } from "@/types/student";

const STAGES = ["Gap Identified", "Learn Module", "Practice Task", "Build Project", "Re-assess & Verify"];

export default function RoadmapPage() {
  const twin = useCareerTwin((s) => s.twin);
  const setJri = useCareerTwin((s) => s.setJri);

  const roleId = twin.targetRoleIds[0] as TargetRoleId | undefined;
  const role = roleId ? TARGET_ROLE_BY_ID[roleId] : null;
  const matrix = useMemo(() => (roleId ? buildGapMatrix(twin, roleId) : []), [twin, roleId]);
  const blocker = topBlocker(matrix);
  const gaps = matrix.filter((m) => m.currentLevel !== "VERIFIED").slice(0, 6);

  useEffect(() => {
    const j = computeJri(twin);
    if (j.totalJRI !== twin.jri.totalJRI) setJri(j);
  }, [twin, setJri]);

  return (
    <main className="space-y-6">
      <header className="card p-6 sm:p-8">
        <span className="chip"><Map className="size-3" /> Roadmap</span>
        <h1 className="mt-2 text-2xl font-bold">Your path to {role?.title ?? "your target role"}</h1>
        <p className="text-sm text-ink-700">Follow the milestones. Each gap has curated resources and a clear verification step.</p>
      </header>

      {blocker && (
        <section className="card p-5 border-brand-200 bg-brand-50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-brand-700">Next best action</div>
            <div className="font-semibold mt-1">Verify <span className="text-brand-700">{blocker.skillName}</span> — your biggest blocker for {role?.title ?? "this role"}.</div>
          </div>
          <Link href="/student/assessment" className="btn-primary">Take assessment <ArrowRight className="size-4" /></Link>
        </section>
      )}

      <section className="card p-5">
        <div className="font-semibold flex items-center gap-2"><Sparkles className="size-4 text-brand-600" /> Milestone pathway</div>
        <ol className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
          {STAGES.map((s, i) => (
            <li key={s} className="rounded-xl border border-ink-200 bg-white p-3 text-sm">
              <div className="text-xs text-ink-400">Step {i + 1}</div>
              <div className="font-medium">{s}</div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Resources for your gaps</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {ghips(gaps).map((g) => {
            const resources = LEARNING_RESOURCES.filter((r) => r.skillId === g.skillId);
            return (
              <div key={g.skillId} className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{g.skillName}</div>
                  <span className="chip bg-rose-50 text-rose-700 text-[10px]">{g.impact}</span>
                </div>
                <p className="text-xs text-ink-700 mt-1">Required at {g.requiredLevel} level · {g.currentLevel === "UNVERIFIED" ? "Missing" : "Partial"}</p>
                <ul className="mt-3 space-y-2">
                  {resources.length ? resources.map((r) => (
                    <li key={r.url} className="flex items-center justify-between gap-2 text-sm">
                      <a href={r.url} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline flex items-center gap-1">
                        {r.title} <ExternalLink className="size-3" />
                      </a>
                      <span className="text-xs text-ink-400">{r.source} · {r.duration} · {r.difficulty}</span>
                    </li>
                  )) : (
                    <li className="text-xs text-ink-400">No curated resources yet — search the web or talk to a mentor.</li>
                  )}
                </ul>
                <Link href="/student/assessment" className="mt-3 inline-flex items-center gap-1 text-xs text-brand-700 hover:underline">
                  Verify this skill <ArrowRight className="size-3" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card p-6 flex items-center justify-between">
        <div>
          <div className="font-semibold flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600" /> Track your XP</div>
          <p className="text-sm text-ink-700">Earn XP and unlock badges by completing quests.</p>
        </div>
        <Link href="/student/skill-quest" className="btn-primary">Open skill quest <ArrowRight className="size-4" /></Link>
      </section>
    </main>
  );
}

function ghips<T>(arr: T[]): T[] { return arr; }