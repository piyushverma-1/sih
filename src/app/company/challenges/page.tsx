"use client";

import { useMemo, useState } from "react";
import { Trophy, Plus } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import type { Challenge } from "@/types/company";

export default function ChallengesPage() {
  const challenges = useCompanyStore((s) => s.challenges);
  const upsert = useCompanyStore((s) => s.upsertChallenge);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Challenge>>({
    title: "",
    description: "",
    type: "hackathon",
    startDate: "",
    endDate: "",
    skills: [],
    participants: [],
    teams: [],
    submissions: [],
  });

  return (
    <main className="space-y-6">
      <header className="card p-6 flex items-end justify-between gap-3">
        <div>
          <span className="chip"><Trophy className="size-3" /> Challenges</span>
          <h1 className="mt-2 text-2xl font-bold">Innovation challenges & hackathons</h1>
          <p className="text-sm text-ink-700">{challenges.length} challenges.</p>
        </div>
        <button className="btn-primary" onClick={() => setOpen(true)}><Plus className="size-4" /> Create challenge</button>
      </header>

      <section className="grid sm:grid-cols-2 gap-4">
        {challenges.map((c) => (
          <div key={c.id} className="card p-5 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase text-ink-400">{c.type}</div>
                <h3 className="font-semibold">{c.title}</h3>
              </div>
              <span className="chip bg-brand-50 text-brand-700 text-[10px]">{c.type}</span>
            </div>
            <p className="text-sm text-ink-700 line-clamp-2">{c.description}</p>
            <div className="text-xs text-ink-700">{c.startDate} → {c.endDate} · {c.participants.length} participants · {c.teams.length} teams · {c.submissions.length} submissions</div>
            <div className="flex flex-wrap gap-1.5">
              {c.skills.map((s) => <span key={s} className="chip bg-ink-50 text-ink-700 text-[10px]">{s}</span>
              )}
            </div>
          </div>
        ))}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="card p-6 max-w-md w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create challenge</h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="mt-4 space-y-3">
              <Field label="Title"><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
              <Field label="Description"><textarea className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start date"><input type="date" className="input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field>
                <Field label="End date"><input type="date" className="input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></Field>
              </div>
              <Field label="Skills (comma separated)"><input className="input" value={(form.skills ?? []).join(", ")} onChange={(e) => setForm({ ...form, skills: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} /></Field>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => { upsert({ ...(form as Challenge), id: `ch_${Date.now()}`, companyId: "demo-company", participants: [], teams: [], submissions: [], createdAt: new Date().toISOString() }); setOpen(false); }}>Create</button>
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
