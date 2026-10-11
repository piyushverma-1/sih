"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  Sparkles,
  GaugeCircle,
  ScanSearch,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { parseResume } from "@/lib/resume-parser";
import { scoreResume, pickTargetInternships } from "@/lib/ats-scorer";
import { semanticSearch } from "@/lib/semantic-search";
import { saveProfile } from "@/lib/store-client";
import type { CandidateProfile, ParsedResume } from "@/lib/types";

const SAMPLE_RESUME = `Ananya Sharma
Frontend Engineer | ananya.sharma@email.com | +91 98765 43210
github.com/ananyas | linkedin.com/in/ananyas

SUMMARY
Frontend engineer with 3 years of experience building React + TypeScript
applications. Passionate about accessible interfaces and design systems.

EDUCATION
B.Tech in Computer Science, IIT Roorkee, 2019 - 2023

EXPERIENCE
Frontend Engineer, Nimbus Labs
Jan 2023 - Present
- Built a React + TypeScript dashboard used by 12k MAUs, reducing load time by 35%
- Migrated the legacy CSS to Tailwind, cutting bundle size by 22%
- Mentored 2 interns on Next.js, REST APIs and component design

Software Engineering Intern, Paperplane
May 2022 - Dec 2022
- Shipped Flutter screens for a wellness app with 50k installs
- Wrote unit tests in Dart, increasing coverage from 38% to 71%

PROJECTS
InternSetu - Resume + ATS scorer
Next.js, React, TypeScript, Tailwind
- Built an adaptive assessment engine with framer-motion animations
- Implemented file-based persistence and ATS scoring across 7 dimensions

DevShare - Code snippet sharing app
React, Node.js, REST, PostgreSQL
- Designed REST APIs and a SQL schema for snippets and comments

SKILLS
HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind, Node.js,
REST APIs, SQL, Flutter, Dart, Figma`;

export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setFilename(file.name);
      setBusy(true);
      try {
        const parsed = await parseResume(file, { filename: file.name });
        if (!parsed.wordCount) {
          throw new Error("We couldn't read any text from that file. Try a plain-text resume or DOCX/PDF with selectable text.");
        }
        await persistAndScore(parsed);
        router.push("/upload/results");
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : "Something went wrong parsing the resume.");
        setBusy(false);
      }
    },
    [router]
  );

  const loadSample = useCallback(async () => {
    setBusy(true);
    setError(null);
    setFilename("sample-resume.txt");
    try {
      const parsed = await parseResume(SAMPLE_RESUME);
      await persistAndScore(parsed);
      router.push("/upload/results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load sample.");
      setBusy(false);
    }
  }, [router]);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) void handleFile(file);
    },
    [handleFile]
  );

  return (
    <main className="space-y-8">
      <header className="card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 size-56 bg-brand-200/40 blur-3xl rounded-full" />
        <div className="relative">
          <span className="chip">
            <Sparkles className="size-3" /> Step 1 of 4
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
            Upload your resume
          </h1>
          <p className="mt-2 text-ink-700 max-w-2xl">
            We parse it like a real ATS — extracting skills, projects and experience — then run a
            7-dimension score and a semantic search across real internships.
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 card p-6">
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload resume file"
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            className={[
              "rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all",
              dragActive
                ? "border-brand-500 bg-brand-50"
                : "border-ink-200 bg-ink-50/40 hover:bg-white",
            ].join(" ")}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,.txt,.md"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
              }}
            />
            {busy ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="size-8 text-brand-600 animate-spin" />
                <p className="font-medium">Parsing {filename ?? "resume"}…</p>
                <p className="text-sm text-ink-700">
                  Running ATS scoring and semantic match against internships
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="size-14 rounded-2xl bg-brand-100 text-brand-700 grid place-items-center">
                  <UploadCloud className="size-7" />
                </div>
                <p className="font-semibold">
                  Drag &amp; drop your resume, or{" "}
                  <span className="text-brand-600">browse</span>
                </p>
                <p className="text-sm text-ink-700">
                  PDF, DOCX or TXT · Parsed in your browser, nothing uploaded
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between text-sm">
            <button
              type="button"
              className="btn-ghost"
              onClick={loadSample}
              disabled={busy}
            >
              <FileText className="size-4" /> Try a sample resume
            </button>
            <Link href="/dashboard" className="text-ink-700 hover:text-ink-900">
              Skip to sample dashboard →
            </Link>
          </div>
        </section>

        <aside className="space-y-4">
          <FeatureCard
            icon={<ScanSearch className="size-5" />}
            title="Semantic search"
            desc="TF-IDF over your resume and the internship catalog finds roles that match even when wording differs."
          />
          <FeatureCard
            icon={<GaugeCircle className="size-5" />}
            title="7-dim ATS score"
            desc="Format, contact, skills, experience, education, projects, impact — each scored 0-100."
          />
          <FeatureCard
            icon={<CheckCircle2 className="size-5" />}
            title="Skill gap insights"
            desc="See which keywords your resume is missing for each shortlisted internship."
          />
        </aside>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="card p-4 flex gap-3">
      <div className="size-9 rounded-xl bg-brand-50 text-brand-700 grid place-items-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-sm">{title}</div>
        <p className="text-xs text-ink-700 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

async function persistAndScore(parsed: ParsedResume) {
  const targets = pickTargetInternships(parsed, [], 3);
  const ats = scoreResume(parsed, targets);
  const results = semanticSearch(parsed, { limit: 5 });
  const profile = await saveProfile({
    resume: parsed,
    ats,
    selectedDomains: parsed.detectedDomains.length ? parsed.detectedDomains : [],
    jri: {
      score: 0,
      band: "Beginner",
      atsScore: ats.overall,
      skillCoverage: 0,
      quizAccuracy: 0,
      quizAttempts: 0,
      updatedAt: new Date().toISOString(),
    },
  });
  void profile;
  void results;
}