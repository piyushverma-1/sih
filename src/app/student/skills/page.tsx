"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, AlertTriangle, XCircle, Sparkles, ArrowRight, Target
} from "lucide-react";
import { useCareerTwin } from "@/lib/store-z";
import { buildGapMatrix, buildSkillEvidence, computeJri, topBlocker } from "@/lib/career-engine";
import { TARGET_ROLE_BY_ID, type TargetRoleId } from "@/types/student";
import clsx from "clsx";

export default function SkillsPage() {
  const twin = useCareerTwin((s) => s.twin);
  const setSkills = useCareerTwin((s) => s.setSkills);
  const setJri = useCareerTwin((s) => s.setJri);
  const [activeRole, setActiveRole] = useState<TargetRoleId | null>(twin.targetRoleIds[0] ?? null);

  useEffect(() => {
    if (!twin.skills.length && twin.resume) {
      const skills = buildSkillEvidence(twin);
      setSkills(skills);
    }
  }, [twin, setSkills]);

  useEffect(() => {
    if (!activeRole && twin.targetRoleIds.length) setActiveRole(twin.targetRoleIds[0]);
  }, [activeRole, twin.targetRoleIds]);

  const matrix = useMemo(() => (activeRole ? buildGapMatrix(twin, activeRole) : []), [twin, activeRole]);
  const blocker = useMemo(() => topBlocker(matrix), [matrix]);

  const counts = useMemo(() => {
    const total = twin.skills.length;
    const verified = twin.skills.filter((s) => s.status === "VERIFIED").length;
    const partial = twin.skills.filter((s) => s.status === "PARTIAL").length;
    return { total, verified, partial, missing: total - verified - partial };
  }, [twin.skills]);

  return (
    <main className="space-y-6">
      <header className="card p-6 sm:p-8">
        <span className="chip"><Sparkles className="size-3" /> Evidence-based Skills</span>
        <h1 className="mt-2 text-2xl font-bold">Skill matrix &amp; gap analysis</h1>
        <p className="text-sm text-ink-700">Skills are verified by Resume, Project or Assessment. Target role: {activeRole ? TARGET_ROLE_BY_ID[activeRole].title : "—"}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {twin.targetRoleIds.map((id) => (
            <button
              key={id}
              onClick={() => setActiveRole(id)}
              className={clsx(
                "rounded-full px-3 py-1 text-xs border",
                activeRole === id ? "bg-brand-600 text-white border-brand-600" : "bg-white text-ink-700 border-ink-200 hover:bg-ink-50"
              )}
            >
              {TARGET_ROLE_BY_ID[id].title}
            </button>
          ))}
        </div>
      </header>

      <section className="grid sm:grid-cols-3 gap-4">
        <Pill icon={<CheckCircle2 className="size-5 text-emerald-600" />} label="Verified" value={counts.verified} tone="emerald" />
        <Pill icon={<AlertTriangle className="size-5 text-amber-600" />} label="Partial" value={counts.partial} tone="amber" />
        <Pill icon={<XCircle className="size-5 text-rose-600" />} label="Missing" value={counts.missing} tone="rose" />
      </section>

      {blocker && (
        <section className="card p-5 border-rose-200 bg-rose-50 flex items-start gap-3">
          <Target className="size-5 text-rose-600 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-rose-900">Biggest roadblock: {blocker.skillName}</div>
            <div className="text-sm text-rose-800">
              Required at {blocker.requiredLevel} level for {activeRole ? TARGET_ROLE_BY_ID[activeRole].title : "your target role"}.
              Verifying this unlocks the most matching internships.
            </div>
          </div>
          <Link href="/student/assessment" className="btn-primary shrink-0">
            Take assessment <ArrowRight className="size-4" />
          </Link>
        </section>
      )}

      <section className="card p-5">
        <h2 className="text-lg font-semibold mb-3">Gap matrix</h2>
        {matrix.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-400 border-b border-ink-100">
                  <th className="py-2 pr-3">Skill</th>
                  <th className="py-2 pr-3">Required level</th>
                  <th className="py-2 pr-3">Current level</th>
                  <th className="py-2 pr-3">Gap status</th>
                  <th className="py-2">Impact</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.skillId} className="border-b border-ink-50">
                    <td className="py-2 pr-3 font-medium">{row.skillName}</td>
                    <td className="py-2 pr-3">
                      <span className={clsx("chip", row.requiredLevel === "High" ? "bg-rose-50 text-rose-700" : row.requiredLevel === "Medium" ? "bg-amber-50 text-amber-700" : "bg-ink-50 text-ink-700")}>
                        {row.requiredLevel}
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      <span className={clsx("chip", row.currentLevel === "VERIFIED" ? "bg-emerald-50 text-emerald-700" : row.currentLevel === "PARTIAL" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700")}>
                        {row.currentLevel}
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      {row.currentLevel === "VERIFIED" ? "Met" : row.currentLevel === "PARTIAL" ? "Partial" : "Missing"}
                    </td>
                    <td className="py-2">
                      <span className={clsx("chip", row.impact === "Critical" ? "bg-rose-50 text-rose-700" : row.impact === "High" ? "bg-amber-50 text-amber-700" : "bg-ink-50 text-ink-700")}>
                        {row.impact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-ink-700">Pick a target role to see your gap matrix.</div>
        )}
      </section>
    </main>
  );
}

function Pill({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: "emerald" | "amber" | "rose" }) {
  const toneClass = tone === "emerald" ? "bg-emerald-50" : tone === "amber" ? "bg-amber-50" : "bg-rose-50";
  return (
    <div className={clsx("card p-4 flex items-center gap-3", toneClass)}>
      {icon}
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-ink-700">{label}</div>
      </div>
    </div>
  );
}