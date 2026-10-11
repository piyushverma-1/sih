"use client";

import { useMemo, useState } from "react";
import { Users, Plus, Trash2, Shield } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import type { Recruiter } from "@/types/company";

const ROLES = ["ADMIN", "HR_MANAGER", "RECRUITER", "INTERVIEWER", "HIRING_MANAGER", "MENTOR", "VIEWER"] as const;

export default function TeamPage() {
  const recruiters = useCompanyStore((s) => s.recruiters);
  const upsert = useCompanyStore((s) => s.upsertRecruiter);
  const remove = useCompanyStore((s) => s.removeRecruiter);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Recruiter>>({
    name: "",
    email: "",
    role: "RECRUITER",
  });

  const byRole = useMemo(() => {
    const map = new Map<string, Recruiter[]>();
    recruiters.forEach((r) => map.set(r.role, [...(map.get(r.role) ?? []), r]));
    return map;
  }, [recruiters]);

  function submit() {
    upsert({
      ...(form as Recruiter),
      id: `rec_${Date.now()}`,
      companyId: "demo-company",
      assignedOpportunities: [],
      assignedPools: [],
      createdAt: new Date().toISOString(),
    });
    setOpen(false);
  }

  return (
    <main className="space-y-6">
      <header className="card p-6 flex items-end justify-between gap-3">
        <div>
          <span className="chip"><Users className="size-3" /> Recruiter Team</span>
          <h1 className="mt-2 text-2xl font-bold">Team & permissions</h1>
          <p className="text-sm text-ink-700">{recruiters.length} members.</p>
        </div>
        <button className="btn-primary" onClick={() => setOpen(true)}><Plus className="size-4" /> Invite member</button>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recruiters.map((r) => (
          <div key={r.id} className="card p-5 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-ink-700">{r.email}</div>
              </div>
              <span className="chip bg-brand-50 text-brand-700 text-[10px] flex items-center gap-1"><Shield className="size-3" /> {r.role}</span>
            </div>
            <div className="text-xs text-ink-400">Assigned opportunities: {r.assignedOpportunities.length}</div>
            <button onClick={() => { if (window.confirm(`Remove ${r.name}?`)) remove(r.id); }} className="text-xs text-rose-700 inline-flex items-center gap-1"><Trash2 className="size-3" /> Remove</button>
          </div>
        ))}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="card p-6 max-w-md w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Invite team member</h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="mt-4 space-y-3">
              <Field label="Name"><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Email"><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
              <Field label="Role">
                <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Recruiter["role"] })}>
                  {ROLES.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
                </select>
              </Field>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={submit}>Invite</button>
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
