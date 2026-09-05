"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  LayoutDashboard, GaugeCircle, Sparkles, FileText, Brain, Trophy,
  Briefcase, KanbanSquare, Bell, ArrowRight, Target, Flame
} from "lucide-react";
import { useCareerTwin } from "@/lib/store-z";
import { buildGapMatrix, buildQuests, computeJri, topBlocker } from "@/lib/career-engine";
import { ALL_INTERNSHIPS } from "@/lib/store-z";
import { matchInternship } from "@/lib/skill-matcher";
import { TARGET_ROLE_BY_ID, type TargetRoleId } from "@/types/student";
import clsx from "clsx";

export default function DashboardPage() {
  const twin = useCareerTwin((s) => s.twin);
  const setJri = useCareerTwin((s) => s.setJri);

  const roleId = twin.targetRoleIds[0] as TargetRoleId | undefined;
  const role = roleId ? TARGET_ROLE_BY_ID[roleId] : null;
  const matrix = useMemo(() => (roleId ? buildGapMatrix(twin, roleId) : []), [twin, roleId]);
  const blocker = topBlocker(matrix);
  const quests = useMemo(() => buildQuests(twin), [twin]);

  const topInternships = useMemo(() => {
    const resume = twin.resume ?? {
      name: twin.profile?.name,
      email: twin.profile?.email,
      links: [],
      education: [],
      experience: [],
      projects: [],
      rawSkills: twin.skills.map((s) => s.skillName),
      detectedSkillIds: twin.skills.map((s) => s.skillId),
      detectedDomains: [],
      yearsOfExperience: 0,
      wordCount: 0,
      text: twin.skills.map((s) => s.skillName).join(" "),
    };
    return ALL_INTERNSHIPS
      .map((i) => ({ internship: i, match: matchInternship(resume, i) }))
      .sort((a, b) => b.match.matchPct - a.match.matchPct)
      .slice(0, 4);
  }, [twin]);

  useEffect(() => {
    const j = computeJri(twin);
    if (j.totalJRI !== twin.jri.totalJRI) setJri(j);
  }, [twin, setJri]);

  const radius = 50;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - twin.jri.totalJRI / 100);

  return (
    <main className="space-y-6">
      <header className="card p-6 sm:p-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="chip"><LayoutDashboard className="size-3" /> Career Twin</span>
          <h1 className="mt-2 text-2xl font-bold">Hi {twin.profile?.name?.split(" ")[0] ?? "Student"} 👋</h1>
          <p className="text-sm text-ink-700">Target role: {role?.title ?? "Not set"} · {twin.profile?.college ?? "Add your college in onboarding"}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="chip"><Flame className="size-3 text-rose-600" /> {twin.streak}d streak</div>
          <button className="btn-ghost relative" aria-label="Notifications">
            <Bell className="size-4" />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-rose-500" />
          </button>
        </div>
      </header>

      <section className="grid lg:grid-cols-3 gap-4">
        <div className="card p-5 flex items-center gap-4 lg:col-span-1">
          <div className="relative size-28">
            <svg viewBox="0 0 120 120" className="size-full -rotate-90">
              <circle cx="60" cy="60" r={radius} stroke="rgb(236, 238, 245)" strokeWidth="10" fill="none" />
              <circle cx="60" cy="60" r={radius} stroke="url(#jriGrad)" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
              <defs>
                <linearGradient id="jriGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3a5dff" />
                  <stop offset="100%" stopColor="#845adf" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="text-xl font-bold">{twin.jri.totalJRI}</div>
                <div className="text-[10px] uppercase tracking-wider text-ink-400">JRI</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-400">Job Readiness</div>
            <div className="text-lg font-semibold">{twin.jri.band}</div>
            <p className="text-xs text-ink-700 mt-1">Resume {twin.jri.resumeScore} · Tech {twin.jri.technicalScore} · Assessment {twin.jri.assessmentScore}</p>
          </div>
        </div>

        {blocker ? (
          <div className="card p-5 lg:col-span-2 bg-gradient-to-br from-brand-50 to-fuchsia-50 border-brand-200">
            <div className="text-xs uppercase tracking-wider text-brand-700">Next best action</div>
            <div className="mt-1 font-semibold">Your biggest bottleneck is <span className="text-brand-700">{blocker.skillName}</span> for {role?.title}.</div>
            <p className="text-sm text-ink-700 mt-1">Verifying this single skill unlocks the most matching internships.</p>
            <div className="mt-3 flex gap-2">
              <Link href="/student/assessment" className="btn-primary">Take assessment <ArrowRight className="size-4" /></Link>
              <Link href="/student/roadmap" className="btn-ghost">Open roadmap</Link>
            </div>
          </div>
        ) : (
          <div className="card p-5 lg:col-span-2">
            <div className="text-xs uppercase tracking-wider text-ink-400">Streak banner</div>
            <div className="text-lg font-semibold">🔥 {twin.streak}-day streak · {twin.xp} XP</div>
            <p className="text-sm text-ink-700 mt-1">Complete a quest today to keep it alive.</p>
            <Link href="/student/skill-quest" className="mt-3 btn-ghost inline-flex">Open skill quest</Link>
          </div>
        )}
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Metric icon={<FileText className="size-4" />} label="ATS Health" value={`${(twin.ats as unknown as { overall?: number } | null)?.overall ?? 0}`} href="/student/resume-analysis" />
        <Metric icon={<Brain className="size-4" />} label="Assessment" value={`${twin.assessment.lastScore || "—"}%`} href="/student/assessment" />
        <Metric icon={<KanbanSquare className="size-4" />} label="Applications" value={`${twin.applications.length}`} href="/student/applications" />
        <Metric icon={<Sparkles className="size-4" />} label="Verified skills" value={`${twin.skills.filter((s) => s.status === "VERIFIED").length}`} href="/student/skills" />
      </section>

      <section className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2"><Target className="size-4 text-brand-600" /> Gap matrix — {role?.title ?? "Pick a role"}</h2>
              <Link href="/student/skills" className="text-xs text-brand-700 hover:underline">Open skills</Link>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-ink-400 border-b border-ink-100">
                    <th className="py-2 pr-3">Skill</th>
                    <th className="py-2 pr-3">Required</th>
                    <th className="py-2 pr-3">Current</th>
                    <th className="py-2">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.slice(0, 6).map((m) => (
                    <tr key={m.skillId} className="border-b border-ink-50">
                      <td className="py-2 pr-3 font-medium">{m.skillName}</td>
                      <td className="py-2 pr-3">{m.requiredLevel}</td>
                      <td className="py-2 pr-3">
                        <span className={clsx("chip", m.currentLevel === "VERIFIED" ? "bg-emerald-50 text-emerald-700" : m.currentLevel === "PARTIAL" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700")}>{m.currentLevel}</span>
                      </td>
                      <td className="py-2">{m.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2"><Briefcase className="size-4 text-brand-600" /> Recommended internships</h2>
              <Link href="/student/internships" className="text-xs text-brand-700 hover:underline">See all</Link>
            </div>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              {topInternships.map(({ internship, match }) => (
                <Link key={internship.id} href={`/student/internships/${internship.id}`} className="card p-3 hover:shadow-soft">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{internship.title}</div>
                    <div className="text-sm font-bold text-brand-700">{match.matchPct}%</div>
                  </div>
                  <div className="text-xs text-ink-700">{internship.company} · {internship.location}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2"><Trophy className="size-4 text-brand-600" /> Active quest</h2>
              <Link href="/student/skill-quest" className="text-xs text-brand-700 hover:underline">All quests</Link>
            </div>
            <ul className="mt-3 space-y-3">
              {quests.slice(0, 3).map((q) => (
                <li key={q.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{q.badge} {q.title}</span>
                    <span className="text-xs text-ink-700">+{q.xp} XP</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-ink-100">
                    <div className={clsx("h-full rounded-full", q.completed ? "bg-emerald-500" : "bg-brand-500")} style={{ width: `${Math.min(100, q.progress)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold flex items-center gap-2"><GaugeCircle className="size-4 text-brand-600" /> JRI breakdown</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <BreakdownRow label="Resume" value={twin.jri.resumeScore} weight={0.2} />
              <BreakdownRow label="Tech Skills" value={twin.jri.technicalScore} weight={0.25} />
              <BreakdownRow label="Assessment" value={twin.jri.assessmentScore} weight={0.25} />
              <BreakdownRow label="Projects" value={twin.jri.projectScore} weight={0.15} />
              <BreakdownRow label="Aptitude" value={twin.jri.aptitudeScore} weight={0.1} />
              <BreakdownRow label="Profile" value={twin.profile ? 100 : 0} weight={0.05} />
            </ul>
            {twin.jri.projectedGains.length > 0 && (
              <div className="mt-3 text-xs text-ink-700">
                <div className="font-semibold text-ink-900">Why is my score {twin.jri.totalJRI}?</div>
                <ul className="mt-1 space-y-0.5">
                  {twin.jri.projectedGains.slice(0, 3).map((g) => (
                    <li key={g.action}>+{g.delta} pts if you {g.action.toLowerCase()}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  return (
    <Link href={href} className="card p-4 hover:shadow-soft flex items-center gap-3">
      <div className="size-9 rounded-xl bg-brand-50 text-brand-700 grid place-items-center">{icon}</div>
      <div>
        <div className="text-xs text-ink-400">{label}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </Link>
  );
}

function BreakdownRow({ label, value, weight }: { label: string; value: number; weight: number }) {
  const contribution = Math.round(value * weight);
  return (
    <li>
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <span className="text-xs text-ink-700">{value} × {Math.round(weight * 100)}% = <b className="text-ink-900">{contribution}</b></span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-ink-100">
        <div className="h-full rounded-full bg-brand-500" style={{ width: `${value}%` }} />
      </div>
    </li>
  );
}