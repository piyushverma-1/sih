"use client";

import { useState, useMemo } from "react";
import { Search, Sparkles, CheckCircle2, XCircle, Copy } from "lucide-react";
import { useCareerTwin } from "@/lib/store-z";
import { SKILLS } from "@/lib/sample-data";
import { semanticSearch } from "@/lib/semantic-search";
import type { ParsedResume } from "@/lib/types";
import clsx from "clsx";

export default function JobAnalyzerPage() {
  const twin = useCareerTwin((s) => s.twin);
  const [jd, setJd] = useState("");

  const result = useMemo(() => {
    if (!jd.trim() || !twin.resume) return null;
    const pseudo: ParsedResume = {
      ...twin.resume,
      text: jd,
    };
    const hits = semanticSearch(pseudo, { limit: 1 });
    return hits[0] ?? null;
  }, [jd, twin.resume]);

  const jdLower = jd.toLowerCase();
  const matched = SKILLS.filter((s) => jdLower.includes(s.name.toLowerCase()) && twin.resume?.detectedSkillIds.includes(s.id));
  const missing = SKILLS.filter((s) => jdLower.includes(s.name.toLowerCase()) && !twin.resume?.detectedSkillIds.includes(s.id));

  return (
    <main className="space-y-6">
      <header className="card p-6 sm:p-8">
        <span className="chip"><Search className="size-3" /> JD Analyzer</span>
        <h1 className="mt-2 text-2xl font-bold">Resume vs Job Description</h1>
        <p className="text-sm text-ink-700">Paste any JD and instantly see semantic match, missing keywords and copy-pastable bullets.</p>
      </header>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="text-sm font-semibold">Job description</div>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the job description here…"
            className="mt-2 w-full h-64 rounded-xl border border-ink-200 p-3 text-sm"
          />
          {result && (
            <div className="mt-3 text-sm">Match score: <span className="font-bold text-brand-700">{result.score}</span></div>
          )}
        </div>
        <div className="space-y-3">
          <div className="card p-5">
            <div className="text-sm font-semibold">Keyword match</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {matched.length ? matched.map((s) => (
                <span key={s.id} className="chip bg-emerald-50 text-emerald-700"><CheckCircle2 className="size-3" /> {s.name}</span>
              )) : <span className="text-xs text-ink-400">No matched keywords yet.</span>}
              {missing.length ? missing.map((s) => (
                <span key={s.id} className="chip bg-rose-50 text-rose-700"><XCircle className="size-3" /> {s.name}</span>
              )) : null}
            </div>
          </div>
          <div className="card p-5">
            <div className="text-sm font-semibold flex items-center gap-2"><Sparkles className="size-4 text-brand-600" /> Suggested resume bullets</div>
            <ul className="mt-2 space-y-2 text-sm">
              {[
                "Built a production-grade REST API serving 10k+ requests/day with 99.9% uptime using Node.js, Express and PostgreSQL.",
                "Designed and shipped a responsive React + TypeScript dashboard, improving load time by 35% across 12k MAU.",
                "Implemented end-to-end tests with Jest and Supertest, raising coverage from 38% to 71% in 8 weeks.",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="flex-1">{b}</span>
                  <button onClick={() => navigator.clipboard?.writeText(b)} className="text-brand-700 inline-flex items-center gap-1 text-xs"><Copy className="size-3" /> Copy</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}