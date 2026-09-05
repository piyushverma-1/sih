"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Briefcase, MapPin, Wallet, Search, Sparkles, X, CheckCircle2, AlertTriangle
} from "lucide-react";
import { useCareerTwin } from "@/lib/store-z";
import { ALL_INTERNSHIPS } from "@/lib/store-z";
import { matchInternship, type MatchResult, type SkillGapItem } from "@/lib/skill-matcher";
import { SKILL_BY_ID } from "@/lib/sample-data";
import type { InternshipOpportunity } from "@/types/student";
import clsx from "clsx";

export default function InternshipsPage() {
  const twin = useCareerTwin((s) => s.twin);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "eligible" | "almost">("all");
  const [modal, setModal] = useState<{ internship: InternshipOpportunity; match: MatchResult } | null>(null);

  const results = useMemo(() => {
    const list = ALL_INTERNSHIPS
      .map((i) => {
        const match = matchInternship(twin.resume ?? emptyResume(twin), i);
        return { internship: i, match };
      })
      .filter((r) =>
        query
          ? r.internship.title.toLowerCase().includes(query.toLowerCase()) ||
            r.internship.company.toLowerCase().includes(query.toLowerCase()) ||
            r.internship.description.toLowerCase().includes(query.toLowerCase())
          : true
      );
    return list.sort((a, b) => b.match.matchPct - a.match.matchPct);
  }, [twin, query]);

  const visible = results.filter(({ match }) => {
    if (filter === "eligible") return match.matchPct >= 70;
    if (filter === "almost") return match.matchPct >= 40 && match.matchPct < 70;
    return true;
  });

  return (
    <main className="space-y-6">
      <header className="card p-6 sm:p-8">
        <span className="chip"><Briefcase className="size-3" /> Internship Discovery</span>
        <h1 className="mt-2 text-2xl font-bold">Find your fit</h1>
        <p className="text-sm text-ink-700">{ALL_INTERNSHIPS.length} opportunities ranked by skill fit against your resume.</p>
      </header>

      <section className="card p-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            className="w-full rounded-xl border border-ink-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-brand-500"
            placeholder="Search by role, company or skill"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {(["all", "eligible", "almost"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "rounded-full px-3 py-1 text-xs border",
                filter === f ? "bg-brand-600 text-white border-brand-600" : "bg-white text-ink-700 border-ink-200 hover:bg-ink-50"
              )}
            >
              {f === "all" ? "All" : f === "eligible" ? "Eligible (≥70%)" : "Almost (40-70%)"}
            </button>
          ))}
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        {visible.map(({ internship, match }) => (
          <InternshipCard key={internship.id} internship={internship} match={match} onWhy={() => setModal({ internship, match })} />
        ))}
      </section>

      {modal && <WhyModal {...modal} onClose={() => setModal(null)} />}
    </main>
  );
}

function InternshipCard({ internship, match, onWhy }: { internship: InternshipOpportunity; match: MatchResult; onWhy: () => void }) {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-400">{internship.domain}</div>
          <h3 className="font-semibold mt-1">{internship.title}</h3>
          <div className="text-xs text-ink-700 flex flex-wrap items-center gap-3 mt-1">
            <span>{internship.company}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {internship.location}</span>
            <span className="inline-flex items-center gap-1"><Wallet className="size-3" /> {internship.stipend}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-ink-400">Match</div>
          <div className="text-2xl font-bold text-brand-700">{match.matchPct}%</div>
        </div>
      </div>
      <p className="text-sm text-ink-700">{internship.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {match.matched.slice(0, 5).map((m) => (
          <span key={m.skillId} className="chip bg-emerald-50 text-emerald-700"><CheckCircle2 className="size-3" /> {m.skillName}</span>
        ))}
        {match.missing.slice(0, 3).map((m) => (
          <span key={m.skillId} className="chip bg-rose-50 text-rose-700"><AlertTriangle className="size-3" /> {m.skillName}</span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-ink-400">
        <span>{internship.applicants} applicants · {internship.postedAt}</span>
        <div className="flex gap-2">
          <button onClick={onWhy} className="text-brand-700 hover:underline">Why this match?</button>
          <Link href={`/student/internships/${internship.id}`} className="text-brand-700 hover:underline">Details →</Link>
        </div>
      </div>
    </div>
  );
}

function WhyModal({ internship, match, onClose }: { internship: InternshipOpportunity; match: MatchResult; onClose: () => void }) {
  const skillsFit = clamp(match.matchPct * 0.5);
  const eduFit = 20;
  const expFit = 10;
  const assessmentFit = 12;
  const total = Math.min(100, skillsFit + eduFit + expFit + assessmentFit);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="card p-6 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-ink-400 hover:text-ink-700"><X className="size-4" /></button>
        <div className="flex items-center gap-2 font-semibold"><Sparkles className="size-4 text-brand-600" /> Why this match?</div>
        <div className="mt-2 text-sm text-ink-700">{internship.title} · {internship.company}</div>
        <ul className="mt-3 space-y-1 text-sm">
          <li>Skills fit: {Math.round(skillsFit)}/50</li>
          <li>Education fit: {eduFit}/20</li>
          <li>Experience fit: {expFit}/10</li>
          <li>Assessment fit: {assessmentFit}/15</li>
        </ul>
        <div className="mt-2 font-semibold">Total: {Math.round(total)}%</div>
      </div>
    </div>
  );
}

function emptyResume(twin: ReturnType<typeof useCareerTwin.getState>["twin"]): import("@/lib/types").ParsedResume {
  return {
    name: twin.profile?.name,
    email: twin.profile?.email,
    phone: undefined,
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
}

function clamp(n: number) { return Math.max(0, Math.min(50, Math.round(n))); }