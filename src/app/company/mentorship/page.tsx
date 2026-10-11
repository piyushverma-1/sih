"use client";

import { useMemo, useState } from "react";
import { GraduationCap, Plus, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import type { Mentor, MentorStatus, MentorshipRequest } from "@/types/company";

export default function MentorshipPage() {
  const mentors = useCompanyStore((s) => s.mentors);
  const upsertMentor = useCompanyStore((s) => s.upsertMentor);
  const requestMentorship = useCompanyStore((s) => s.requestMentorship);
  const updateStatus = useCompanyStore((s) => s.updateMentorshipStatus);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Mentor>>({
    name: "",
    designation: "",
    expertise: [],
    experienceYears: 5,
    bio: "",
    slots: 2,
    available: true,
  });

  const allRequests = useMemo(() => mentors.flatMap((m) => m.mentorshipRequests.map((r) => ({ ...r, mentorName: m.name, mentorId: m.id }))), [mentors]);

  function submitMentor() {
    upsertMentor({
      ...(form as Mentor),
      id: `m_${Date.now()}`,
      companyId: "demo-company",
      mentorshipRequests: [],
    });
    setOpen(false);
  }

  function demoRequest() {
    requestMentorship(mentors[0]?.id ?? "", {
      id: `req_${Date.now()}`,
      mentorId: mentors[0]?.id ?? "",
      studentId: "demo-student",
      studentName: "Demo Student",
      status: "REQUESTED",
      message: "I would like mentorship on system design and React.",
      requestedAt: new Date().toISOString(),
    });
  }

  return (
    <main className="space-y-6">
      <header className="card p-6 flex items-end justify-between gap-3">
        <div>
          <span className="chip"><GraduationCap className="size-3" /> Mentorship</span>
          <h1 className="mt-2 text-2xl font-bold">Mentor management</h1>
          <p className="text-sm text-ink-700">{mentors.length} mentors · {allRequests.length} requests</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={demoRequest}>Demo request</button>
          <button className="btn-primary" onClick={() => setOpen(true)}><Plus className="size-4" /> Add mentor</button>
        </div>
      </header>

      <section className="grid sm:grid-cols-2 gap-4">
        {mentors.map((m) => (
          <div key={m.id} className="card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{m.name}</div>
                <div className="text-xs text-ink-700">{m.designation} · {m.experienceYears} yrs</div>
              </div>
              <span className={clsx("chip text-[10px]", m.available ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>{m.available ? "Available" : "Unavailable"}</span>
            </div>
            <p className="text-xs text-ink-700">{m.bio}</p>
            <div className="flex flex-wrap gap-1.5">
              {m.expertise.map((e) => <span key={e} className="chip bg-brand-50 text-brand-700 text-[10px]">{e}</span>)}
            </div>
            <div className="text-xs text-ink-400">{m.slots} slots · {m.mentorshipRequests.length} requests</div>
            {m.mentorshipRequests.map((r) => (
              <div key={r.id} className="rounded-xl border border-ink-100 p-2 text-xs">
                <div className="font-medium">{r.studentName}</div>
                <div className="text-ink-700">{r.message}</div>
                <div className="text-ink-400">{r.status}</div>
                {r.status === "REQUESTED" && (
                  <div className="mt-1 flex gap-1">
                    <button onClick={() => updateStatus(m.id, r.id, "APPROVED")} className="text-[10px] rounded-md bg-emerald-50 text-emerald-700 px-2 py-0.5">Approve</button>
                    <button onClick={() => updateStatus(m.id, r.id, "REJECTED")} className="text-[10px] rounded-md bg-rose-50 text-rose-700 px-2 py-0.5">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="card p-6 max-w-md w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add mentor</h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="mt-4 space-y-3">
              <Field label="Name"><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Designation"><input className="input" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} /></Field>
              <Field label="Expertise (comma separated)"><input className="input" value={(form.expertise ?? []).join(", ")} onChange={(e) => setForm({ ...form, expertise: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} /></Field>
              <Field label="Experience years"><input type="number" className="input" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })} /></Field>
              <Field label="Bio"><textarea className="input" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2} /></Field>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={submitMentor}>Add mentor</button>
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
