"use client";

import { useMemo, useState } from "react";
import { GraduationCap, Plus, Users, CheckCircle2 } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import type { LearningProgram } from "@/types/company";

export default function LearningPage() {
  const programs = useCompanyStore((s) => s.learningPrograms);
  const upsert = useCompanyStore((s) => s.upsertLearningProgram);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<LearningProgram>>({
    title: "",
    description: "",
    type: "course",
    duration: "",
    level: "Beginner",
    deliveryMode: "Online",
    prerequisites: [],
    hasCertificate: false,
    skills: [],
    slots: 20,
    enrolled: [],
  });

  const stats = useMemo(() => {
    const total = programs.length;
    const totalEnrolled = programs.reduce((acc, p) => acc + p.enrolled.length, 0);
    const certs = programs.filter((p) => p.hasCertificate).length;
    return { total, totalEnrolled, certs };
  }, [programs]);

  function submit() {
    upsert({
      ...(form as LearningProgram),
      id: `lp_${Date.now()}`,
      companyId: "demo-company",
      createdAt: new Date().toISOString(),
    });
    setOpen(false);
    setForm({ title: "", description: "", type: "course", duration: "", level: "Beginner", deliveryMode: "Online", prerequisites: [], hasCertificate: false, skills: [], slots: 20, enrolled: [] });
  }

  return (
    <main className="space-y-6">
      <header className="card p-6 flex items-end justify-between gap-3">
        <div>
          <span className="chip"><GraduationCap className="size-3" /> Learning Programs</span>
          <h1 className="mt-2 text-2xl font-bold">Courses, workshops & bootcamps</h1>
          <p className="text-sm text-ink-700">{programs.length} programs · {stats.totalEnrolled} enrollments · {stats.certs} with certificates</p>
        </div>
        <button className="btn-primary" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Create program
        </button>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs.map((p) => (
          <div key={p.id} className="card p-5 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase text-ink-400">{p.type}</div>
                <h3 className="font-semibold">{p.title}</h3>
              </div>
              <span className="chip bg-brand-50 text-brand-700 text-[10px]">{p.level}</span>
            </div>
            <p className="text-sm text-ink-700 line-clamp-2">{p.description}</p>
            <div className="text-xs text-ink-700">{p.duration} · {p.deliveryMode} · {p.slots} slots</div>
            <div className="flex flex-wrap gap-1.5">
              {p.skills.map((s) => <span key={s} className="chip bg-ink-50 text-ink-700 text-[10px]">{s}</span>)}
            </div>
            <div className="text-xs text-ink-400">{p.enrolled.length} enrolled · {p.hasCertificate ? "Certificate" : "No certificate"}</div>
          </div>
        ))}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="card p-6 max-w-md w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create program</h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="mt-4 space-y-3">
              <Field label="Title"><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
              <Field label="Description"><textarea className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Type">
                  <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as LearningProgram["type"] })}>
                    {["course", "certification", "workshop", "bootcamp", "training", "mentorship"].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Level">
                  <select className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as LearningProgram["level"] })}>
                    {["Beginner", "Intermediate", "Advanced"].map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Duration"><input className="input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></Field>
                <Field label="Delivery mode"><input className="input" value={form.deliveryMode} onChange={(e) => setForm({ ...form, deliveryMode: e.target.value })} /></Field>
              </div>
              <Field label="Skills (comma separated)"><input className="input" value={(form.skills ?? []).join(", ")} onChange={(e) => setForm({ ...form, skills: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} /></Field>
              <div className="flex items-center gap-2">
                <input id="cert" type="checkbox" checked={form.hasCertificate} onChange={(e) => setForm({ ...form, hasCertificate: e.target.checked })} />
                <label htmlFor="cert" className="text-sm">Certificate available</label>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={submit}>Create</button>
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
