"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud, RefreshCcw, Sparkles, GaugeCircle, Clipboard,
  CheckCircle2, AlertTriangle, ArrowRight, FileText, Eye, EyeOff
} from "lucide-react";
import { parseResume } from "@/lib/resume-parser";
import { scoreResume, pickTargetInternships } from "@/lib/ats-scorer";
import { useCareerTwin } from "@/lib/store-z";
import { buildSkillEvidence, computeJri } from "@/lib/career-engine";
import { SKILL_BY_ID } from "@/lib/sample-data";
import type { ParsedResume, AtsResult } from "@/lib/types";

interface ATSView {
  resume: ParsedResume;
  ats: AtsResult;
}

const FIX_CARDS = [
  { before: "Worked on website", after: "Developed a React + TypeScript dashboard used by 12k MAUs, reducing load time by 35%" },
  { before: "Built backend", after: "Architected 8 Node.js REST APIs powering payments, deployed to AWS ECS, p99 latency 180ms" },
  { before: "Did data analysis", after: "Analyzed 2M events in Pandas, built churn model (F1 0.78) shipped to production via Airflow" },
  { before: "Helped team", after: "Mentored 2 interns on Spring Boot + testing; raised coverage 38% → 71% in 8 weeks" },
];

export default function ResumeAnalysisPage() {
  const router = useRouter();
  const twin = useCareerTwin((s) => s.twin);
  const setResume = useCareerTwin((s) => s.setResume);
  const setSkills = useCareerTwin((s) => s.setSkills);
  const setJri = useCareerTwin((s) => s.setJri);
  const [view, setView] = useState<ATSView | null>(twin.resume && twin.ats ? { resume: twin.resume, ats: twin.ats as unknown as AtsResult } : null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (twin.resume && twin.ats) {
      setView({ resume: twin.resume, ats: twin.ats as unknown as AtsResult });
    }
  }, [twin.resume, twin.ats]);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const parsed = await parseResume(file, { filename: file.name });
      const targets = pickTargetInternships(parsed, [], 3);
      const ats = scoreResume(parsed, targets);
      setResume(parsed, ats);
      const skills = buildSkillEvidence({ ...useCareerTwin.getState().twin, resume: parsed });
      setSkills(skills);
      setJri(computeJri({ ...useCareerTwin.getState().twin, resume: parsed, ats: ats as unknown as import("@/types/student").CareerTwin["ats"], skills }));
      setView({ resume: parsed, ats });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Parse error.");
    } finally {
      setBusy(false);
    }
  }

  if (!view) {
    return (
      <main className="space-y-6">
        <header className="card p-6 sm:p-8">
          <span className="chip"><Sparkles className="size-3" /> Resume Intelligence</span>
          <h1 className="mt-2 text-2xl font-bold">Upload your resume</h1>
          <p className="text-sm text-ink-700">PDF / DOCX / TXT — parsed locally with full ATS scoring.</p>
        </header>
        <section className="card p-6">
          <label className="block">
            <div className="rounded-2xl border-2 border-dashed border-ink-200 hover:bg-white p-12 text-center cursor-pointer">
              <input
                type="file"
                accept=".pdf,.docx,.txt,.md"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleFile(f);
                }}
              />
              {busy ? (
                <div className="text-sm text-ink-700">Parsing…</div>
              ) : (
                <>
                  <UploadCloud className="size-10 text-brand-500 mx-auto" />
                  <p className="mt-2 font-medium">Drop your resume or browse</p>
                  <p className="text-xs text-ink-700">PDF, DOCX or TXT</p>
                </>
              )}
            </div>
          </label>
          {error && <div className="mt-3 text-sm text-rose-700">{error}</div>}
        </section>
      </main>
    );
  }

  return <AnalysisView view={view} onReupload={async (f) => handleFile(f)} onReset={() => { setView(null); setResume(null as unknown as ParsedResume, null as unknown as AtsResult); }} onContinue={() => router.push("/student/skills")} />;
}

function AnalysisView({
  view,
  onReupload,
  onReset,
  onContinue,
}: {
  view: ATSView;
  onReupload: (f: File) => void | Promise<void>;
  onReset: () => void;
  onContinue: () => void;
}) {
  const { ats, resume } = view;
  const radius = 56;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - ats.overall / 100);
  const tone = ats.overall >= 70 ? "text-emerald-700" : ats.overall >= 50 ? "text-amber-700" : "text-rose-700";

  return (
    <main className="space-y-6">
      <header className="card p-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="chip"><GaugeCircle className="size-3" /> Resume Analysis</span>
          <h1 className="mt-2 text-2xl font-bold">Your ATS snapshot</h1>
          <p className="text-sm text-ink-700">Verdict: {ats.verdict} · {resume.wordCount} words · {resume.detectedSkillIds.length} skills</p>
        </div>
        <div className="flex gap-2">
          <label className="btn-ghost cursor-pointer">
            <input
              type="file"
              hidden
              accept=".pdf,.docx,.txt,.md"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onReupload(f);
              }}
            />
            <RefreshCcw className="size-4" /> Re-upload
          </label>
          <button className="btn-ghost" onClick={onReset}>
            <RefreshCcw className="size-4" /> Clear
          </button>
        </div>
      </header>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 flex items-center gap-5">
          <div className="relative size-40 shrink-0">
            <svg viewBox="0 0 140 140" className="size-full -rotate-90">
              <circle cx="70" cy="70" r={radius} stroke="rgb(236, 238, 245)" strokeWidth="12" fill="none" />
              <circle cx="70" cy="70" r={radius} stroke="url(#atsGrad)" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
              <defs>
                <linearGradient id="atsGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3a5dff" />
                  <stop offset="100%" stopColor="#845adf" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className={"text-3xl font-bold " + tone}>{ats.overall}</div>
                <div className="text-[10px] uppercase tracking-wider text-ink-400">ATS / 100</div>
              </div>
            </div>
          </div>
          <div>
            <div className="chip bg-brand-50 text-brand-700">{ats.verdict}</div>
            <p className="mt-2 text-sm text-ink-700">Weighted across 7 dimensions — same signals enterprise ATS systems look for.</p>
          </div>
        </div>

        <Subscore label="Keyword match" value={ats.breakdown.skills} hint="Skills section vs target role" />
        <Subscore label="Section completeness" value={ats.breakdown.formatting + ats.breakdown.contactInfo} max={200} hint="Formatting + contact (capped 200)" />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Actionable fixes</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {FIX_CARDS.map((f) => (
            <FixCard key={f.before} before={f.before} after={f.after} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Extracted structured data</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <DataCard title="Academics" items={resume.education.map((e) => `${e.degree ?? "Degree"}${e.field ? " in " + e.field : ""} · ${e.institution}`)} icon={FileText} />
          <DataCard title="Technical skills" items={resume.detectedSkillIds.map((id) => SKILL_BY_ID.get(id)?.name ?? id)} icon={Sparkles} />
          <DataCard title="Projects" items={resume.projects.map((p) => p.name)} icon={CheckCircle2} />
        </div>
      </section>

      <section className="card p-6 flex items-center justify-between">
        <div>
          <div className="font-semibold">Continue to skills</div>
          <p className="text-sm text-ink-700">See your evidence-based skill matrix and gap.</p>
        </div>
        <button className="btn-primary" onClick={onContinue}>
          View skill matrix <ArrowRight className="size-4" />
        </button>
      </section>
    </main>
  );
}

function Subscore({ label, value, hint, max = 100 }: { label: string; value: number; hint: string; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="card p-6">
      <div className="text-xs uppercase tracking-wider text-ink-400">{label}</div>
      <div className="mt-1 text-3xl font-bold">{Math.round(value)}<span className="text-base text-ink-400">/{max}</span></div>
      <div className="mt-2 h-2 rounded-full bg-ink-100">
        <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-ink-700">{hint}</p>
    </div>
  );
}

function FixCard({ before, after }: { before: string; after: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-2 text-sm">
        <AlertTriangle className="size-4 text-rose-600 mt-0.5" />
        <div>
          <div className="text-xs uppercase text-ink-400">Before</div>
          <div className="line-through text-ink-700">{before}</div>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 text-sm">
        <CheckCircle2 className="size-4 text-emerald-600 mt-0.5" />
        <div>
          <div className="text-xs uppercase text-ink-400">After</div>
          <div className="text-ink-900">{after}</div>
        </div>
      </div>
      <button
        onClick={() => navigator.clipboard?.writeText(after)}
        className="mt-3 inline-flex items-center gap-1 text-xs text-brand-700 hover:underline"
      >
        <Clipboard className="size-3" /> Copy
      </button>
    </div>
  );
}

function DataCard({ title, items, icon: Icon }: { title: string; items: string[]; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 font-semibold">
        <Icon className="size-4 text-brand-600" /> {title}
      </div>
      <ul className="mt-3 space-y-1 text-sm">
        {items.length ? items.slice(0, 8).map((it, i) => <li key={i} className="text-ink-700">• {it}</li>) : <li className="text-ink-400">—</li>}
      </ul>
    </div>
  );
}