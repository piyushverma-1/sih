"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  GaugeCircle,
  CheckCircle2,
  AlertTriangle,
  ScanSearch,
  Sparkles,
  ArrowRight,
  RefreshCcw,
  Building2,
  MapPin,
  Wallet
} from "lucide-react";
import { loadProfile } from "@/lib/store-client";
import { semanticSearch } from "@/lib/semantic-search";
import { scoreResume, pickTargetInternships } from "@/lib/ats-scorer";
import { rankInternships } from "@/lib/skill-matcher";
import { DOMAIN_LABEL } from "@/lib/types";
import type {
  AtsBreakdown,
  AtsResult,
  CandidateProfile,
  Internship,
  ParsedResume
} from "@/lib/types";

interface ViewState {
  resume: ParsedResume;
  ats: AtsResult;
  hits: ReturnType<typeof semanticSearch>;
  ranked: ReturnType<typeof rankInternships>;
}

export default function UploadResultsPage() {
  const [state, setState] = useState<ViewState | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const p = await loadProfile();
      if (cancelled || !p.resume || !p.ats) return;
      const hits = semanticSearch(p.resume, { limit: 6 });
      const ranked = rankInternships(
        p.resume,
        p.selectedDomains.length ? p.selectedDomains : p.resume.detectedDomains
      );
      setState({ resume: p.resume, ats: p.ats, hits, ranked });
      setProfile(p);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!state || !profile) {
    return (
      <main className="space-y-6">
        <div className="card p-10 text-center">
            <GaugeCircle className="size-10 text-brand-500 mx-auto animate-pulse" />
            <p className="mt-3 font-medium">Loading your results…</p>
            <p className="text-sm text-ink-700">
              If nothing shows, head back and upload a resume first.
            </p>
            <Link href="/upload" className="btn-primary mt-5 inline-flex">
              Go to upload
            </Link>
          </div>
      </main>
    );
  }

  const { resume, ats, hits, ranked } = state;

  return (
    <main className="space-y-8">
      <header className="card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 size-56 bg-brand-200/40 blur-3xl rounded-full" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="chip">
              <Sparkles className="size-3" /> ATS Analysis Complete
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
              {resume.name ?? "Your resume"} — scored in 7 dimensions
            </h1>
            <p className="mt-2 text-ink-700 text-sm">
              {ats.verdict} overall. Below: ATS breakdown, semantic search across internships,
              and the skill keywords that move the needle.
            </p>
          </div>
          <Link href="/upload" className="btn-ghost">
            <RefreshCcw className="size-4" /> Re-upload
          </Link>
        </div>
      </header>

      <section className="grid lg:grid-cols-3 gap-6">
        <ScoreCard ats={ats} />
        <KeywordCard ats={ats} />
        <DomainCard resume={resume} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">ATS dimension breakdown</h2>
        <BreakdownGrid breakdown={ats.breakdown} />
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <StrengthsAndGaps ats={ats} />
        <TopMatches ranked={ranked} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <ScanSearch className="size-5 text-brand-600" /> Semantic search across internships
        </h2>
        <p className="text-sm text-ink-700 mb-4">
          Ranked by TF-IDF similarity over your resume tokens (skills, projects, experience)
          and each role's title, description and required stack.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {hits.map((hit) => (
            <HitCard key={hit.internship.id} hit={hit} resume={resume} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Extracted from your resume</h2>
        <ExtractedGrid resume={resume} />
      </section>

      <section className="card p-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-semibold">Next: lock in your domains</div>
          <p className="text-sm text-ink-700">
            We'll tailor the assessment to up to 2 stacks you want to validate.
          </p>
        </div>
        <Link href="/domains" className="btn-primary">
          Choose domains <ArrowRight className="size-4" />
        </Link>
      </section>
    </main>
  );
}

function ScoreCard({ ats }: { ats: AtsResult }) {
  const ring = useMemo(() => {
    const radius = 56;
    const circ = 2 * Math.PI * radius;
    const offset = circ * (1 - ats.overall / 100);
    return { radius, circ, offset };
  }, [ats.overall]);

  const verdictTone: Record<typeof ats.verdict, string> = {
    Excellent: "text-emerald-600 bg-emerald-50",
    Strong: "text-brand-700 bg-brand-50",
    Good: "text-amber-700 bg-amber-50",
    Fair: "text-orange-700 bg-orange-50",
    Poor: "text-rose-700 bg-rose-50",
  };

  return (
    <div className="card p-6 flex items-center gap-5">
      <div className="relative size-40 shrink-0">
        <svg viewBox="0 0 140 140" className="size-full -rotate-90">
          <circle
            cx="70"
            cy="70"
            r={ring.radius}
            stroke="rgb(236, 238, 245)"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="70"
            cy="70"
            r={ring.radius}
            stroke="url(#scoreGrad)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={ring.circ}
            strokeDashoffset={ring.offset}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3a5dff" />
              <stop offset="100%" stopColor="#845adf" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-3xl font-bold">{ats.overall}</div>
            <div className="text-[10px] uppercase tracking-wider text-ink-400">ATS / 100</div>
          </div>
        </div>
      </div>
      <div>
        <div className={`chip ${verdictTone[ats.verdict]}`}>
          <GaugeCircle className="size-3" /> {ats.verdict}
        </div>
        <div className="mt-2 text-sm text-ink-700">
          Weighted across formatting, contact, skills, experience, education, projects and
          impact — the same signals enterprise ATS systems look for.
        </div>
      </div>
    </div>
  );
}

function KeywordCard({ ats }: { ats: AtsResult }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 font-semibold">
        <Sparkles className="size-4 text-brand-600" /> Keywords
      </div>
      <div className="mt-3">
        <div className="text-xs uppercase tracking-wider text-ink-400">Hits</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ats.keywordHits.length ? (
            ats.keywordHits.map((k) => (
              <span key={k} className="chip bg-brand-50 text-brand-700">
                <CheckCircle2 className="size-3" /> {k}
              </span>
            ))
          ) : (
            <span className="text-sm text-ink-700">No target role selected.</span>
          )}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-xs uppercase tracking-wider text-ink-400">Misses</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ats.keywordMisses.length ? (
            ats.keywordMisses.map((k) => (
              <span key={k} className="chip bg-rose-50 text-rose-700">
                <AlertTriangle className="size-3" /> {k}
              </span>
            ))
          ) : (
            <span className="text-sm text-ink-700">Nothing critical missing — great coverage.</span>
          )}
        </div>
      </div>
    </div>
  );
}

function DomainCard({ resume }: { resume: ParsedResume }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 font-semibold">
        <ScanSearch className="size-4 text-brand-600" /> Detected domains
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {resume.detectedDomains.length ? (
          resume.detectedDomains.map((d) => (
            <span key={d} className="chip bg-brand-50 text-brand-700">
              {DOMAIN_LABEL[d]}
            </span>
          ))
        ) : (
          <span className="text-sm text-ink-700">
            No strong domain signals yet. Add more role-specific skills.
          </span>
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Stat label="Detected skills" value={resume.detectedSkillIds.length} />
        <Stat label="Years exp." value={resume.yearsOfExperience} />
        <Stat label="Projects" value={resume.projects.length} />
        <Stat label="Words" value={resume.wordCount} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-ink-50 px-3 py-2">
      <div className="text-xs text-ink-400">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function BreakdownGrid({ breakdown }: { breakdown: AtsBreakdown }) {
  const dims: Array<[keyof AtsBreakdown, string]> = [
    ["formatting", "Formatting"],
    ["contactInfo", "Contact info"],
    ["skills", "Skills"],
    ["experience", "Experience"],
    ["education", "Education"],
    ["projects", "Projects"],
    ["impact", "Impact"],
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {dims.map(([k, label]) => {
        const score = breakdown[k];
        const tone =
          score >= 75
            ? "from-brand-500 to-fuchsia-500"
            : score >= 50
              ? "from-amber-400 to-amber-600"
              : "from-rose-400 to-rose-600";
        return (
          <div key={k} className="card p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{label}</span>
              <span className="font-semibold">{score}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-ink-100 overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${tone}`} style={{ width: `${score}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StrengthsAndGaps({ ats }: { ats: AtsResult }) {
  return (
    <div className="card p-6">
      <div className="font-semibold">Strengths &amp; improvements</div>
      <div className="mt-4 space-y-3">
        <Block title="What you did well" items={ats.strengths} tone="brand" />
        <Block title="What to fix next" items={ats.improvements} tone="rose" />
      </div>
    </div>
  );
}

function Block({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "brand" | "rose";
}) {
  const Icon = tone === "brand" ? CheckCircle2 : AlertTriangle;
  const color = tone === "brand" ? "text-brand-600" : "text-rose-600";
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-ink-400 mb-2">{title}</div>
      <ul className="space-y-2 text-sm">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2">
            <Icon className={`size-4 mt-0.5 ${color}`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TopMatches({
  ranked,
}: {
  ranked: ReturnType<typeof rankInternships>;
}) {
  const top = ranked.slice(0, 3);
  return (
    <div className="card p-6">
      <div className="font-semibold flex items-center gap-2">
        <Sparkles className="size-4 text-brand-600" /> Top skill-matched roles
      </div>
      <div className="mt-3 space-y-3">
        {top.length ? (
          top.map((r) => {
            const i = r.matched.find((m) => m.status === "have");
            const internship = top.find(() => true);
            void internship;
            return (
              <div key={r.internshipId} className="rounded-xl border border-ink-100 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{r.internshipId}</div>
                  <div className="text-sm font-bold text-brand-700">{r.matchPct}%</div>
                </div>
                <div className="mt-1 text-xs text-ink-700">
                  Matched: {r.matched.slice(0, 4).map((m) => m.skillName).join(", ") || "—"} ·
                  Missing: {r.missing.slice(0, 3).map((m) => m.skillName).join(", ") || "—"}
                </div>
                {i && <div className="hidden">{i.skillName}</div>}
              </div>
            );
          })
        ) : (
          <div className="text-sm text-ink-700">No matching roles found.</div>
        )}
      </div>
    </div>
  );
}

function HitCard({
  hit,
  resume,
}: {
  hit: ReturnType<typeof semanticSearch>[number];
  resume: ParsedResume;
}) {
  const internship: Internship = hit.internship;
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-400">
            {DOMAIN_LABEL[internship.domain]}
          </div>
          <h3 className="font-semibold mt-1">{internship.title}</h3>
          <div className="text-xs text-ink-700 flex flex-wrap items-center gap-3 mt-1">
            <span className="inline-flex items-center gap-1">
              <Building2 className="size-3" /> {internship.company}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" /> {internship.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Wallet className="size-3" /> {internship.stipend}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-ink-400">Score</div>
          <div className="text-2xl font-bold text-brand-700">{hit.score}</div>
        </div>
      </div>
      <p className="text-sm text-ink-700">{internship.description}</p>
      <div className="text-xs text-ink-700 italic">{hit.explanation}</div>
      <div className="flex flex-wrap gap-1.5">
        {hit.matchedSkills.length ? (
          hit.matchedSkills.map((s) => (
            <span key={s} className="chip bg-brand-50 text-brand-700">
              <CheckCircle2 className="size-3" /> {s}
            </span>
          ))
        ) : (
          <span className="text-xs text-ink-400">
            Resume doesn't explicitly list these skills yet.
          </span>
        )}
      </div>
      <div className="text-xs text-ink-400">
        {resume.detectedSkillIds.length} detected skills · {internship.applicants} applicants
      </div>
    </div>
  );
}

function ExtractedGrid({ resume }: { resume: ParsedResume }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="card p-5">
        <div className="font-semibold">Contact</div>
        <div className="mt-2 text-sm space-y-1">
          <div>{resume.name ?? <span className="text-ink-400">No name detected</span>}</div>
          <div className="text-ink-700">{resume.email ?? "—"}</div>
          <div className="text-ink-700">{resume.phone ?? "—"}</div>
          {resume.links.map((l) => (
            <a
              key={l}
              href={l.startsWith("http") ? l : `https://${l}`}
              target="_blank"
              rel="noreferrer"
              className="block text-brand-600 hover:underline text-xs"
            >
              {l}
            </a>
          ))}
        </div>
      </div>
      <div className="card p-5">
        <div className="font-semibold">Experience</div>
        <div className="mt-2 space-y-3 text-sm">
          {resume.experience.length ? (
            resume.experience.map((e, i) => (
              <div key={`${e.company}-${i}`}>
                <div className="font-medium">{e.role ?? e.company}</div>
                <div className="text-xs text-ink-700">
                  {e.company}
                  {e.duration ? ` · ${e.duration}` : ""}
                </div>
                {e.bullets.length ? (
                  <ul className="mt-1 list-disc list-inside text-xs text-ink-700 space-y-0.5">
                    {e.bullets.slice(0, 3).map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))
          ) : (
            <div className="text-ink-400 text-sm">No experience section found.</div>
          )}
        </div>
      </div>
      <div className="card p-5">
        <div className="font-semibold">Projects</div>
        <div className="mt-2 space-y-3 text-sm">
          {resume.projects.length ? (
            resume.projects.map((p, i) => (
              <div key={`${p.name}-${i}`}>
                <div className="font-medium">{p.name}</div>
                {p.description ? (
                  <div className="text-xs text-ink-700 mt-0.5 line-clamp-3">{p.description}</div>
                ) : null}
                {p.tech.length ? (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.tech.slice(0, 6).map((t) => (
                      <span key={t} className="chip text-[10px] py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="text-ink-400 text-sm">No projects section found.</div>
          )}
        </div>
      </div>
    </div>
  );
}