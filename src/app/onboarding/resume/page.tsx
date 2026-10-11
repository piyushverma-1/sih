"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, UploadCloud, FileText, Loader2 } from "lucide-react";
import { parseResume } from "@/lib/resume-parser";
import { scoreResume, pickTargetInternships } from "@/lib/ats-scorer";
import { semanticSearch } from "@/lib/semantic-search";
import { saveProfile } from "@/lib/store-client";
import { useCareerTwin } from "@/lib/store-z";
import { buildSkillEvidence } from "@/lib/career-engine";
import type { ParsedResume } from "@/lib/types";

const PHASES = [
  "Extracting text",
  "Detecting skills & projects",
  "Checking formatting",
  "Benchmarking against target role",
];

export default function OnboardingResumePage() {
  const router = useRouter();
  const setResume = useCareerTwin((s) => s.setResume);
  const setSkills = useCareerTwin((s) => s.setSkills);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function processFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const advance = setInterval(() => setPhase((p) => Math.min(p + 1, PHASES.length - 1)), 700);
      const tick = setInterval(() => setProgress((p) => Math.min(p + 7, 95)), 120);
      const parsed = await parseResume(file, { filename: file.name });
      const targets = pickTargetInternships(parsed, [], 3);
      const ats = scoreResume(parsed, targets);
      const hits = semanticSearch(parsed, { limit: 5 });
      setResume(parsed, ats);
      const skills = buildSkillEvidence({ ...useCareerTwin.getState().twin, resume: parsed });
      setSkills(skills);
      await saveProfile({ resume: parsed, ats });
      void hits;
      clearInterval(advance);
      clearInterval(tick);
      setProgress(100);
      setTimeout(() => router.push("/student/dashboard"), 350);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not parse the resume.");
      setBusy(false);
    }
  }

  return (
    <section className="card p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Upload your resume</h2>
        <p className="text-sm text-ink-700">We'll parse it like a real ATS, score it and seed your skill evidence.</p>
      </div>

      {!busy ? (
        <label className="block">
          <div className="rounded-2xl border-2 border-dashed border-ink-200 hover:bg-white p-10 text-center cursor-pointer">
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void processFile(f);
              }}
            />
            <UploadCloud className="size-10 text-brand-500 mx-auto" />
            <p className="mt-2 font-medium">Drop your resume or browse</p>
            <p className="text-xs text-ink-700">PDF, DOCX or TXT — parsed locally</p>
          </div>
        </label>
      ) : (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6">
          <div className="flex items-center gap-3">
            <Loader2 className="size-5 text-brand-600 animate-spin" />
            <div className="font-medium">{PHASES[phase]}…</div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white">
            <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <ul className="mt-4 space-y-1 text-sm">
            {PHASES.map((p, i) => (
              <li key={p} className={"flex items-center gap-2 " + (i <= phase ? "text-ink-900" : "text-ink-400")}>
                {i < phase ? <FileText className="size-3" /> : i === phase ? <Loader2 className="size-3 animate-spin" /> : <span className="size-3 inline-block rounded-full bg-ink-200" />}
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-800 px-4 py-2 text-sm">{error}</div>
      )}

      <div className="flex justify-between">
        <button className="btn-ghost" onClick={() => router.push("/onboarding/roles")} disabled={busy}>
          <ArrowLeft className="size-4" /> Back
        </button>
        <button className="btn-primary" onClick={() => router.push("/student/dashboard")} disabled={busy}>
          Skip for now <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  );
}