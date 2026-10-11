"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus, Trash2, ChevronLeft, ChevronRight, Sparkles, GaugeCircle, ArrowRight, Briefcase
} from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import type { Opportunity, OpportunityType, OpportunityStatus } from "@/types/company";
import clsx from "clsx";

const STEPS = ["Basic Details", "Eligibility", "Skills", "Recruitment", "Preview"] as const;
type Step = typeof STEPS[number];

const TYPES: OpportunityType[] = ["INTERNSHIP", "PLACEMENT", "APPRENTICESHIP", "LIVE_PROJECT", "FREELANCE", "INDUSTRIAL_TRAINING"];
const STATUSES: OpportunityStatus[] = ["DRAFT", "PUBLISHED", "PAUSED", "CLOSED", "ARCHIVED"];

const emptyOpp: Omit<Opportunity, "id" | "companyId" | "createdAt" | "updatedAt" | "applicants" | "shortlisted" | "qualityScore" | "qualityFixes"> = {
  postingType: "INTERNSHIP",
  title: "",
  department: "",
  description: "",
  duration: "",
  location: "",
  workMode: "Hybrid",
  stipend: "",
  openings: 1,
  degree: [],
  branch: [],
  gradYear: [2026, 2027],
  minCgpa: 6.0,
  backlogPolicy: "No active backlogs",
  experience: "",
  requiredSkills: [],
  preferredSkills: [],
  softSkills: [],
  applicationDeadline: "",
  shortlistQuota: 10,
  selectionProcess: "",
  interviewType: "Online",
  interviewStages: ["Technical", "HR"],
  status: "DRAFT",
  publishedAt: undefined,
};

export default function OpportunitiesPage() {
  const opportunities = useCompanyStore((s) => s.opportunities);
  const upsert = useCompanyStore((s) => s.upsertOpportunity);
  const remove = useCompanyStore((s) => s.deleteOpportunity);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return opportunities;
    return opportunities.filter((o) => o.status === filter);
  }, [opportunities, filter]);

  return (
    <main className="space-y-6">
      <header className="card p-6 sm:p-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="chip"><Briefcase className="size-3" /> Opportunity Management</span>
          <h1 className="mt-2 text-2xl font-bold">Your opportunities</h1>
          <p className="text-sm text-ink-700">Create, publish and manage internships, placements and projects.</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingId(null); setWizardOpen(true); }}>
          <Plus className="size-4" /> Create opportunity
        </button>
      </header>

      <section className="card p-4 flex flex-wrap gap-2">
        <div className="flex gap-1">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={clsx(
                "rounded-full px-3 py-1 text-xs border",
                filter === s ? "bg-brand-600 text-white border-brand-600" : "bg-white text-ink-700 border-ink-200 hover:bg-ink-50"
              )}
            >
              {s === "all" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        {filtered.map((opp) => (
          <div key={opp.id} className="card p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-ink-400">{opp.postingType.replace("_", " ")}</div>
                <h3 className="font-semibold mt-1">{opp.title}</h3>
                <div className="text-xs text-ink-700">{opp.department} · {opp.location} · {opp.workMode}</div>
              </div>
              <span className={clsx("chip text-[10px]", statusColor(opp.status))}>{opp.status}</span>
            </div>
            <p className="text-sm text-ink-700 line-clamp-2">{opp.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {opp.requiredSkills.slice(0, 5).map((s) => (
                <span key={s} className="chip bg-brand-50 text-brand-700 text-[10px]">{s}</span>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-ink-400">
              <span>Deadline: {opp.applicationDeadline || "—"}</span>
              <div className="flex gap-2">
                <Link href={`/company/opportunities/${opp.id}`} className="text-brand-700 hover:underline">View</Link>
                <button onClick={() => { setEditingId(opp.id); setWizardOpen(true); }} className="text-brand-700 hover:underline">Edit</button>
                <button onClick={() => { if (window.confirm("Delete this opportunity?")) remove(opp.id); }} className="text-rose-700 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {wizardOpen && (
        <OpportunityWizard
          opportunityId={editingId}
          onClose={() => { setWizardOpen(false); setEditingId(null); }}
        />
      )}
    </main>
  );
}

function OpportunityWizard({ opportunityId, onClose }: { opportunityId: string | null; onClose: () => void }) {
  const opportunities = useCompanyStore((s) => s.opportunities);
  const upsert = useCompanyStore((s) => s.upsertOpportunity);
  const existing = opportunityId ? opportunities.find((o) => o.id === opportunityId) : null;
  const [step, setStep] = useState<Step>("Basic Details");
  const [form, setForm] = useState<Partial<Opportunity>>(() => existing ? { ...existing } : { ...emptyOpp, companyId: "demo-company" });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateArray<K extends keyof typeof form>(key: K, value: string) {
    update(key, value.split(",").map((x) => x.trim()).filter(Boolean) as (typeof form)[K]);
  }

  const quality = useMemo(() => scoreQuality(form), [form]);
  const currentIdx = STEPS.indexOf(step);

  function publish() {
    const id = opportunityId ?? `opp_${Date.now()}`;
    const now = new Date().toISOString();
    upsert({
      ...(form as Opportunity),
      id,
      companyId: "demo-company",
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      publishedAt: (form.status === "PUBLISHED" ? now : existing?.publishedAt) ?? undefined,
      applicants: existing?.applicants ?? [],
      shortlisted: existing?.shortlisted ?? [],
      qualityScore: quality.score,
      qualityFixes: quality.fixes,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="card p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{existing ? "Edit opportunity" : "Create opportunity"}</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700">✕</button>
        </div>

        <ol className="mt-4 flex items-center gap-2 text-xs">
          {STEPS.map((s) => {
            const active = s === step;
            const done = STEPS.indexOf(s) < currentIdx;
            return (
              <li key={s} className="flex-1">
                <button
                  onClick={() => setStep(s)}
                  className={clsx(
                    "block rounded-lg border px-3 py-2 transition",
                    active ? "border-brand-500 bg-brand-50 text-brand-700" : done ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-ink-200"
                  )}
                >
                  <div className="text-[10px] uppercase tracking-wider">Step {STEPS.indexOf(s) + 1}</div>
                  <div className="font-medium">{s}</div>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-4 space-y-3">
          {step === "Basic Details" && (
            <>
              <Field label="Opportunity type">
                <select className="input" value={form.postingType} onChange={(e) => update("postingType", e.target.value as OpportunityType)}>
                  {TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                </select>
              </Field>
              <Field label="Title">
                <input className="input" value={form.title} onChange={(e) => update("title", e.target.value)} />
              </Field>
              <Field label="Department">
                <input className="input" value={form.department} onChange={(e) => update("department", e.target.value)} />
              </Field>
              <Field label="Description" full>
                <textarea className="input" value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Duration"><input className="input" value={form.duration} onChange={(e) => update("duration", e.target.value)} /></Field>
                <Field label="Location"><input className="input" value={form.location} onChange={(e) => update("location", e.target.value)} /></Field>
                <Field label="Work mode">
                  <select className="input" value={form.workMode} onChange={(e) => update("workMode", e.target.value)}>
                    {["Remote", "Hybrid", "On-site"].map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </Field>
                <Field label="Stipend / salary"><input className="input" value={form.stipend} onChange={(e) => update("stipend", e.target.value)} /></Field>
                <Field label="Openings">
                  <input type="number" className="input" value={form.openings} onChange={(e) => update("openings", Number(e.target.value))} />
                </Field>
              </div>
            </>
          )}

          {step === "Eligibility" && (
            <>
              <Field label="Eligible degrees (comma separated)">
                <input className="input" value={(form.degree ?? []).join(", ")} onChange={(e) => updateArray("degree", e.target.value)} />
              </Field>
              <Field label="Eligible branches">
                <input className="input" value={(form.branch ?? []).join(", ")} onChange={(e) => updateArray("branch", e.target.value)} />
              </Field>
              <Field label="Eligible graduation years (comma separated)">
                <input className="input" value={(form.gradYear ?? []).join(", ")} onChange={(e) => updateArray("gradYear", e.target.value)} />
              </Field>
              <Field label="Minimum CGPA">
                <input type="number" step="0.1" className="input" value={form.minCgpa} onChange={(e) => update("minCgpa", Number(e.target.value))} />
              </Field>
              <Field label="Backlog policy">
                <input className="input" value={form.backlogPolicy} onChange={(e) => update("backlogPolicy", e.target.value)} />
              </Field>
              <Field label="Experience requirement">
                <input className="input" value={form.experience} onChange={(e) => update("experience", e.target.value)} />
              </Field>
            </>
          )}

          {step === "Skills" && (
            <>
              <Field label="Required skills (comma separated)">
                <input className="input" value={(form.requiredSkills ?? []).join(", ")} onChange={(e) => updateArray("requiredSkills", e.target.value)} />
              </Field>
              <Field label="Preferred skills">
                <input className="input" value={(form.preferredSkills ?? []).join(", ")} onChange={(e) => updateArray("preferredSkills", e.target.value)} />
              </Field>
              <Field label="Soft skills">
                <input className="input" value={(form.softSkills ?? []).join(", ")} onChange={(e) => updateArray("softSkills", e.target.value)} />
              </Field>
            </>
          )}

          {step === "Recruitment" && (
            <>
              <Field label="Application deadline">
                <input type="date" className="input" value={form.applicationDeadline} onChange={(e) => update("applicationDeadline", e.target.value)} />
              </Field>
              <Field label="Shortlist quota">
                <input type="number" className="input" value={form.shortlistQuota} onChange={(e) => update("shortlistQuota", Number(e.target.value))} />
              </Field>
              <Field label="Selection process">
                <input className="input" value={form.selectionProcess} onChange={(e) => update("selectionProcess", e.target.value)} />
              </Field>
              <Field label="Interview type">
                <input className="input" value={form.interviewType} onChange={(e) => update("interviewType", e.target.value)} />
              </Field>
              <Field label="Interview stages (comma separated)">
                <input className="input" value={(form.interviewStages ?? []).join(", ")} onChange={(e) => updateArray("interviewStages", e.target.value)} />
              </Field>
            </>
          )}

          {step === "Preview" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GaugeCircle className="size-5 text-brand-600" />
                <div>
                  <div className="font-semibold">Quality score: {quality.score}/100</div>
                  <div className="text-xs text-ink-700">{quality.fixes.length > 0 ? "Improvements suggested:" : "Looks good to publish."}</div>
                </div>
              </div>
              {quality.fixes.length > 0 && (
                <ul className="space-y-1 text-sm text-amber-800">
                  {quality.fixes.map((f) => <li key={f}>• {f}</li>)}
                </ul>
              )}
              <div className="rounded-xl border border-ink-200 p-4 text-sm space-y-2">
                <div className="font-semibold">{form.title || "Untitled"}</div>
                <div className="text-xs text-ink-400">{form.postingType} · {form.department} · {form.location} · {form.workMode}</div>
                <p className="text-ink-700 whitespace-pre-wrap">{form.description}</p>
                <div className="text-xs text-ink-700">Skills: {(form.requiredSkills ?? []).join(", ")}</div>
                <div className="text-xs text-ink-700">Deadline: {form.applicationDeadline || "—"}</div>
              </div>
              <div className="flex justify-end gap-2">
                <select
                  className="input w-auto"
                  value={form.status}
                  onChange={(e) => update("status", e.target.value as OpportunityStatus)}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            className="btn-ghost"
            disabled={currentIdx === 0}
            onClick={() => setStep(STEPS[currentIdx - 1])}
          >
            <ChevronLeft className="size-4" /> Back
          </button>
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            {currentIdx < STEPS.length - 1 ? (
              <button className="btn-primary" onClick={() => setStep(STEPS[currentIdx + 1])}>
                Next <ChevronRight className="size-4" />
              </button>
            ) : (
              <button className="btn-primary" onClick={publish}>
                <Sparkles className="size-4" /> {existing ? "Update" : "Publish"}
              </button>
            )}
          </div>
        </div>

        <style jsx>{`
          :global(.input) {
            @apply w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200;
          }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={full ? "sm:col-span-2" : ""}>
      <div className="text-xs font-medium text-ink-700 mb-1">{label}</div>
      {children}
    </label>
  );
}

function scoreQuality(form: Partial<Opportunity>) {
  let score = 0;
  const fixes: string[] = [];
  if (form.title?.trim()) score += 15; else fixes.push("Add a clear job title");
  if (form.description?.trim() && form.description.length > 80) score += 25; else fixes.push("Write a clear description (80+ chars)");
  if ((form.requiredSkills?.length ?? 0) >= 3) score += 20; else fixes.push("Add at least 3 required skills");
  if ((form.degree?.length ?? 0) > 0) score += 10; else fixes.push("Specify eligible degrees");
  if ((form.branch?.length ?? 0) > 0) score += 10; else fixes.push("Specify eligible branches");
  if (form.minCgpa != null) score += 5; else fixes.push("Set minimum CGPA");
  if (form.stipend?.trim()) score += 10; else fixes.push("Mention stipend/salary");
  if (form.applicationDeadline) score += 5; else fixes.push("Add application deadline");
  return { score: Math.min(100, score), fixes };
}

function statusColor(status: string) {
  switch (status) {
    case "PUBLISHED": return "bg-emerald-50 text-emerald-700";
    case "DRAFT": return "bg-ink-50 text-ink-700";
    case "PAUSED": return "bg-amber-50 text-amber-700";
    case "CLOSED": return "bg-rose-50 text-rose-700";
    case "ARCHIVED": return "bg-brand-50 text-brand-700";
    default: return "bg-ink-50 text-ink-700";
  }
}
