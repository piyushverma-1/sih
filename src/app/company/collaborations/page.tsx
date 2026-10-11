"use client";

import { useMemo, useState } from "react";
import { FlaskConical, Plus, ArrowRight } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import type { CollaborationProposal } from "@/types/company";
import clsx from "clsx";

const TYPES = [
  { value: "guest_lecture", label: "Guest Lecture" },
  { value: "workshop", label: "Workshop" },
  { value: "industry_visit", label: "Industry Visit" },
  { value: "live_project", label: "Live Project" },
  { value: "research", label: "Research" },
  { value: "consultancy", label: "Consultancy" },
  { value: "fdp", label: "FDP" },
  { value: "faculty_internship", label: "Faculty Internship" },
] as const;

export default function CollaborationsPage() {
  const proposals = useCompanyStore((s) => s.collaborationProposals);
  const upsert = useCompanyStore((s) => s.upsertCollaboration);
  const updateStatus = useCompanyStore((s) => s.updateCollaborationStatus);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<CollaborationProposal>>({
    type: "guest_lecture",
    title: "",
    description: "",
    status: "REQUESTED",
  });

  const byStatus = useMemo(() => {
    const map = new Map<string, CollaborationProposal[]>();
    proposals.forEach((p) => map.set(p.status, [...(map.get(p.status) ?? []), p]));
    return map;
  }, [proposals]);

  function submit() {
    upsert({
      ...(form as CollaborationProposal),
      id: `col_${Date.now()}`,
      companyId: "demo-company",
      institutionId: "demo-inst",
      institutionName: "IIT Roorkee",
      proposedAt: new Date().toISOString(),
    });
    setOpen(false);
  }

  return (
    <main className="space-y-6">
      <header className="card p-6 flex items-end justify-between gap-3">
        <div>
          <span className="chip"><FlaskConical className="size-3" /> Collaborations</span>
          <h1 className="mt-2 text-2xl font-bold">Academia–industry collaboration hub</h1>
          <p className="text-sm text-ink-700">{proposals.length} proposals across {TYPES.length} types.</p>
        </div>
        <button className="btn-primary" onClick={() => setOpen(true)}><Plus className="size-4" /> New proposal</button>
      </header>

      <section className="space-y-4">
        {TYPES.map(({ value, label }) => (
          <div key={value} className="card p-5">
            <h3 className="font-semibold">{label}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {(byStatus.get("REQUESTED") ?? []).filter((p) => p.type === value).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-ink-700">{p.institutionName}</div>
                  </div>
                  <div className="flex gap-2">
                    {p.status === "REQUESTED" && (
                      <>
                        <button onClick={() => updateStatus(p.id, "APPROVED")} className="text-[10px] rounded-md bg-emerald-50 text-emerald-700 px-2 py-1">Approve</button>
                        <button onClick={() => updateStatus(p.id, "REJECTED")} className="text-[10px] rounded-md bg-rose-50 text-rose-700 px-2 py-1">Reject</button>
                      </>
                    )}
                    <span className={clsx("chip text-[10px]", statusColor(p.status))}>{p.status}</span>
                  </div>
                </li>
              ))}
              {!byStatus.get("REQUESTED")?.filter((p) => p.type === value).length && (
                <li className="text-xs text-ink-400">No {label.toLowerCase()} proposals.</li>
              )}
            </ul>
          </div>
        ))}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="card p-6 max-w-md w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">New collaboration proposal</h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="mt-4 space-y-3">
              <Field label="Type">
                <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CollaborationProposal["type"] })}>
                  {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>
              <Field label="Title"><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
              <Field label="Description"><textarea className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></Field>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={submit}>Send proposal</button>
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

function statusColor(status: string) {
  switch (status) {
    case "APPROVED": return "bg-emerald-50 text-emerald-700";
    case "IN_PROGRESS": return "bg-brand-50 text-brand-700";
    case "COMPLETED": return "bg-emerald-50 text-emerald-700";
    case "REJECTED": return "bg-rose-50 text-rose-700";
    default: return "bg-amber-50 text-amber-700";
  }
}
