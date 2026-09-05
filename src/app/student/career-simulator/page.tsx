"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FlaskConical, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { useCareerTwin } from "@/lib/store-z";
import { buildGapMatrix, computeJri } from "@/lib/career-engine";
import { TARGET_ROLES, type TargetRoleId } from "@/types/student";
import clsx from "clsx";

export default function CareerSimulatorPage() {
  const twin = useCareerTwin((s) => s.twin);
  const [simulated, setSimulated] = useState<TargetRoleId | null>(null);
  const roleId = simulated ?? twin.targetRoleIds[0] ?? "fullstack";
  const role = TARGET_ROLES.find((r) => r.id === roleId)!;
  const matrix = useMemo(() => buildGapMatrix(twin, roleId), [twin, roleId]);
  const jri = useMemo(() => computeJri({ ...twin, targetRoleIds: [roleId] }), [twin, roleId]);

  return (
    <main className="space-y-6">
      <header className="card p-6 sm:p-8">
        <span className="chip"><FlaskConical className="size-3" /> Career Simulator</span>
        <h1 className="mt-2 text-2xl font-bold">What if you pivoted?</h1>
        <p className="text-sm text-ink-700">Switch roles and instantly see how JRI and gap matrix change.</p>
      </header>

      <section className="card p-4 flex flex-wrap gap-2">
        {TARGET_ROLES.map((r) => (
          <button
            key={r.id}
            onClick={() => setSimulated(r.id)}
            className={clsx(
              "rounded-full px-3 py-1 text-xs border",
              roleId === r.id ? "bg-brand-600 text-white border-brand-600" : "bg-white text-ink-700 border-ink-200 hover:bg-ink-50"
            )}
          >
            {r.title}
          </button>
        ))}
        {simulated && (
          <button onClick={() => setSimulated(null)} className="ml-auto text-xs text-ink-700 inline-flex items-center gap-1 hover:text-ink-900">
            <RotateCcw className="size-3" /> Reset
          </button>
        )}
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-xs uppercase tracking-wider text-ink-400">Simulated JRI</div>
          <div className="text-3xl font-bold mt-1">{jri.totalJRI}</div>
          <div className="text-xs text-ink-700">{jri.band}</div>
        </div>
        <div className="card p-5">
          <div className="text-xs uppercase tracking-wider text-ink-400">Top blockers</div>
          <ul className="mt-2 text-sm space-y-1">
            {matrix.filter((m) => m.currentLevel !== "VERIFIED").slice(0, 4).map((m) => (
              <li key={m.skillId} className="flex items-center justify-between">
                <span>{m.skillName}</span>
                <span className="chip bg-rose-50 text-rose-700 text-[10px]">{m.impact}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <div className="text-xs uppercase tracking-wider text-ink-400">Required at min CGPA</div>
          <div className="text-3xl font-bold mt-1">{role.minCgpa}</div>
          <div className="text-xs text-ink-700">You: {twin.profile?.cgpa ?? "—"}</div>
        </div>
      </section>

      <section className="card p-6 flex items-center justify-between">
        <div>
          <div className="font-semibold flex items-center gap-2"><Sparkles className="size-4 text-brand-600" /> Ready to commit?</div>
          <p className="text-sm text-ink-700">Save this role to your Career Twin and update your assessment focus.</p>
        </div>
        <Link href="/onboarding/roles" className="btn-primary">Update target roles <ArrowRight className="size-4" /></Link>
      </section>
    </main>
  );
}