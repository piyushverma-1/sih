"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brain, CheckCircle2, ArrowRight, Sparkles, RefreshCcw } from "lucide-react";
import { useCareerTwin } from "@/lib/store-z";

interface LastResult {
  score: number;
  tech: number;
  dsa: number;
  verbal: number;
  quant: number;
  total: number;
  answered: number;
  correct: number;
}

export default function AssessmentResultPage() {
  const twin = useCareerTwin((s) => s.twin);
  const [last, setLast] = useState<LastResult | null>(null);
  useEffect(() => {
    const raw = sessionStorage.getItem("assessment:last");
    if (raw) setLast(JSON.parse(raw));
  }, []);

  const promoted = twin.skills.filter((s) => s.status === "VERIFIED" && s.sources.includes("ASSESSMENT"));

  const result = last ?? {
    score: twin.assessment.lastScore,
    tech: twin.assessment.lastTechScore,
    dsa: twin.assessment.lastDsaScore,
    verbal: twin.assessment.lastVerbalScore,
    quant: twin.assessment.lastQuantScore,
    total: 100,
    answered: 0,
    correct: 0,
  };

  return (
    <main className="space-y-6">
      <header className="card p-6">
        <span className="chip"><Brain className="size-3" /> Results</span>
        <h1 className="mt-2 text-2xl font-bold">You scored {result.score}%</h1>
        <p className="text-sm text-ink-700">Skills with ≥80% accuracy in the assessment were promoted to Verified.</p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Technical" value={result.tech} />
        <Stat label="DSA" value={result.dsa} />
        <Stat label="Verbal" value={result.verbal} />
        <Stat label="Quantitative" value={result.quant} />
      </section>

      <section className="card p-6">
        <div className="flex items-center gap-2 font-semibold"><Sparkles className="size-4 text-brand-600" /> Promoted to Verified</div>
        {promoted.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {promoted.map((s) => (
              <span key={s.skillId} className="chip bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="size-3" /> {s.skillName}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-3 text-sm text-ink-700">No skills were promoted this attempt. Re-take the assessment and score ≥80% on a skill's tagged questions to verify it.</div>
        )}
      </section>

      <section className="card p-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/student/dashboard" className="btn-ghost">Back to dashboard</Link>
        <div className="flex gap-2">
          <Link href="/student/assessment" className="btn-ghost"><RefreshCcw className="size-4" /> Re-take</Link>
          <Link href="/student/roadmap" className="btn-primary">Next: roadmap <ArrowRight className="size-4" /></Link>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-wider text-ink-400">{label}</div>
      <div className="mt-1 text-3xl font-bold">{value}%</div>
      <div className="mt-2 h-2 rounded-full bg-ink-100">
        <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}