"use client";

import { useMemo, useState } from "react";
import { Trophy, Plus, ArrowRight } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import type { LiveProject, ProjectStage } from "@/types/company";

const STAGES: ProjectStage[] = ["Proposal", "Prototype", "Testing", "Final", "Completed"];

export default function ProjectsPage() {
  const projects = useCompanyStore((s) => s.liveProjects);
  const upsert = useCompanyStore((s) => s.upsertLiveProject);
  const updateStage = useCompanyStore((s) => s.updateProjectStage);
  const submit = useCompanyStore((s) => s.submitProject);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<LiveProject>>({
    title: "",
    description: "",
    durationWeeks: 4,
    teamSize: 4,
    requiredSkills: [],
    deliverables: [],
    milestones: [],
    stage: "Proposal",
  });

  return (
    <main className="space-y-6">
      <header className="card p-6 flex items-end justify-between gap-3">
        <div>
          <span className="chip"><Trophy className="size-3" /> Live Projects</span>
          <h1 className="mt-2 text-2xl font-bold">Industry projects for students</h1>
          <p className="text-sm text-ink-700">{projects.length} active projects.</p>
        </div>
        <button className="btn-primary" onClick={() => setOpen(true)}><Plus className="size-4" /> Post project</button>
      </header>

      <section className="grid sm:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="card p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <div className="text-xs text-ink-700">{p.durationWeeks} weeks · {p.teamSize} members · Stage: {p.stage}</div>
              </div>
              <span className={clsx("chip text-[10px]", stageColor(p.stage))}>{p.stage}</span>
            </div>
            <p className="text-sm text-ink-700 line-clamp-2">{p.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {p.requiredSkills.map((s) => <span key={s} className="chip bg-brand-50 text-brand-700 text-[10px]">{s}</span>)}
            </div>
            <div className="text-xs text-ink-400">Milestones: {p.milestones.length} · Submissions: {p.submissions.length}</div>
            <div className="flex gap-2">
              <select
                className="input w-auto text-xs"
                value={p.stage}
                onChange={(e) => updateStage(p.id, e.target.value as ProjectStage)}
              >
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => submit(p.id, { id: `sub_${Date.now()}`, teamName: "Demo Team" })} className="text-xs rounded-md border border-ink-200 px-2 py-1 hover:bg-ink-50">Demo submit</button>
            </div>
          </div>
        ))}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="card p-6 max-w-md w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Post live project</h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="mt-4 space-y-3">
              <Field label="Title"><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
              <Field label="Description"><textarea className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Duration (weeks)"><input type="number" className="input" value={form.durationWeeks} onChange={(e) => setForm({ ...form, durationWeeks: Number(e.target.value) })} /></Field>
                <Field label="Team size"><input type="number" className="input" value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: Number(e.target.value) })} /></Field>
              </div>
              <Field label="Required skills (comma separated)"><input className="input" value={(form.requiredSkills ?? []).join(", ")} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} /></Field>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => { upsert({ ...(form as LiveProject), id: `proj_${Date.now()}`, companyId: "demo-company", submissions: [], createdAt: new Date().toISOString() }); setOpen(false); }}>Post project</button>
            </div>
            <style jsx>{`
              :global(.input) {
                @apply w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200;
              }
            `}</style>
          </div>
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <div className="text-xs font-medium text-ink-700 mb-1">{label}</div>
      {children}
    </label>
  );
}

function clsx(...args: (string | boolean | undefined)[]) { return args.filter(Boolean).join(" "); }
function stageColor(stage: string) {
  switch (stage) {
    case "Proposal": return "bg-ink-50 text-ink-700";
    case "Prototype": return "bg-brand-50 text-brand-700";
    case "Testing": return "bg-amber-50 text-amber-700";
    case "Final": return "bg-fuchsia-50 text-fuchsia-700";
    case "Completed": return "bg-emerald-50 text-emerald-700";
    default: return "bg-ink-50 text-ink-700";
  }
}
