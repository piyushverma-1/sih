"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Building2, MapPin, Wallet, Clock, ArrowRight,
  CheckCircle2, AlertTriangle, Briefcase
} from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import { useCareerTwin } from "@/lib/store-z";
import { SKILL_BY_ID } from "@/lib/sample-data";
import clsx from "clsx";

export default function CompanyOpportunitiesPage() {
  const router = useRouter();
  const companyOpps = useCompanyStore((s) => s.opportunities);
  const companyApps = useCompanyStore((s) => s.applications);
  const upsertApp = useCompanyStore((s) => s.upsertApplication);
  const twin = useCareerTwin((s) => s.twin);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

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

  const opportunities = useMemo(() => {
    return companyOpps
      .filter((o) => o.status === "PUBLISHED")
      .filter((o) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          o.title.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q) ||
          o.requiredSkills.some((s) => s.toLowerCase().includes(q))
        );
      })
      .filter((o) => {
        if (filter === "all") return true;
        if (filter === "eligible") return o.minCgpa <= (twin.profile?.cgpa ?? 0);
        return true;
      })
      .sort((a, b) => new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime());
  }, [companyOpps, query, filter, twin.profile?.cgpa]);

  function apply(oppId: string) {
    const opportunity = companyOpps.find((o) => o.id === oppId);
    if (!opportunity || !twin.profile) return;

    const existing = companyApps.find((a) => a.opportunityId === oppId && a.studentId === "demo-student");
    if (existing) {
      alert("You have already applied for this opportunity.");
      return;
    }

    const app = {
      id: `app_c_${Date.now()}`,
      opportunityId: oppId,
      studentId: "demo-student",
      studentName: twin.profile.name,
      studentEmail: twin.profile.email,
      stage: "Applied" as const,
      matchPercentage: Math.round(70 + Math.random() * 25),
      atsScore: Math.round(60 + Math.random() * 30),
      cgpa: twin.profile.cgpa,
      degree: twin.profile.branch,
      branch: twin.profile.branch,
      gradYear: twin.profile.gradYear,
      skills: twin.skills.map((s) => s.skillId),
      verifiedSkills: twin.skills.filter((s) => s.status === "VERIFIED").map((s) => s.skillId),
      assessmentScore: twin.assessment.lastScore,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [{ stage: "Applied" as const, at: new Date().toISOString() }],
    };

    upsertApp(app);
    setAppliedIds((prev) => new Set(prev).add(oppId));
    alert("Application submitted successfully!");
  }

  return (
    <main className="space-y-6">
      <header className="card p-6 sm:p-8">
        <span className="chip"><Briefcase className="size-3" /> Industry Opportunities</span>
        <h1 className="mt-2 text-2xl font-bold">Internships & jobs from companies</h1>
        <p className="text-sm text-ink-700">{opportunities.length} active opportunities posted by industry partners.</p>
      </header>

      <section className="card p-4 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            className="w-full rounded-xl border border-ink-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-brand-500"
            placeholder="Search by role, skill or company"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {["all", "eligible"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "rounded-full px-3 py-1 text-xs border",
                filter === f ? "bg-brand-600 text-white border-brand-600" : "bg-white text-ink-700 border-ink-200 hover:bg-ink-50"
              )}
            >
              {f === "all" ? "All" : "Eligible for me"}
            </button>
          ))}
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        {opportunities.map((opp) => {
          const isApplied = appliedIds.has(opp.id);
          const companyProfile = useCompanyStore.getState().profile;
          const matchPct = Math.round(
            (opp.requiredSkills.filter((s) => resume.detectedSkillIds.includes(s)).length / Math.max(1, opp.requiredSkills.length)) * 100
          );

          return (
            <div key={opp.id} className="card p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-ink-400">{opp.postingType.replace("_", " ")}</div>
                  <h3 className="font-semibold mt-1">{opp.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-ink-700 mt-1">
                    <Building2 className="size-3" />
                    <span>{companyProfile.name}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {opp.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-brand-700">{matchPct}%</div>
                  <div className="text-[10px] text-ink-400">match</div>
                </div>
              </div>

              <p className="text-sm text-ink-700 line-clamp-2">{opp.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {opp.requiredSkills.slice(0, 6).map((s) => {
                  const hasSkill = resume.detectedSkillIds.includes(s);
                  return (
                    <span
                      key={s}
                      className={clsx(
                        "chip text-[10px]",
                        hasSkill ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      )}
                    >
                      {hasSkill && <CheckCircle2 className="size-3" />}
                      {!hasSkill && <AlertTriangle className="size-3" />}
                      {SKILL_BY_ID.get(s)?.name ?? s}
                    </span>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-ink-400">
                <span className="inline-flex items-center gap-1"><Wallet className="size-3" /> {opp.stipend}</span>
                <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {opp.duration}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-ink-400">
                  {opp.openings} openings · Deadline: {opp.applicationDeadline || "Open"}
                </div>
                <button
                  onClick={() => apply(opp.id)}
                  disabled={isApplied}
                  className={clsx(
                    "btn-primary text-xs",
                    isApplied && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isApplied ? "Applied" : "Apply now"}
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {opportunities.length === 0 && (
        <div className="card p-10 text-center text-sm text-ink-700">
          No opportunities found. Check back later or adjust your filters.
        </div>
      )}
    </main>
  );
}
