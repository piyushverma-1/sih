"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, GraduationCap, Mail } from "lucide-react";
import { useCareerTwin } from "@/lib/store-z";

export default function OnboardingProfilePage() {
  const router = useRouter();
  const setProfile = useCareerTwin((s) => s.setProfile);
  const twin = useCareerTwin((s) => s.twin);
  const [form, setForm] = useState({
    name: twin.profile?.name ?? "",
    email: twin.profile?.email ?? "",
    dob: twin.profile?.dob ?? "",
    college: twin.profile?.college ?? "",
    branch: twin.profile?.branch ?? "CSE",
    cgpa: twin.profile?.cgpa ?? 7.0,
    gradYear: twin.profile?.gradYear ?? 2027,
    linkedin: twin.profile?.linkedin ?? "",
    github: twin.profile?.github ?? "",
    portfolio: twin.profile?.portfolio ?? "",
  });
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function next() {
    setError(null);
    if (!form.name.trim()) return setError("Name is required.");
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email.");
    if (!form.college.trim()) return setError("College is required.");
    if (form.cgpa < 0 || form.cgpa > 10) return setError("CGPA must be between 0 and 10.");
    if (![2025, 2026, 2027, 2028, 2029].includes(Number(form.gradYear))) return setError("Graduation year must be 2025-2029.");
    setProfile({ ...form, cgpa: Number(form.cgpa), gradYear: Number(form.gradYear) });
    router.push("/onboarding/interests");
  }

  return (
    <section className="card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <GraduationCap className="size-5 text-brand-600" />
        <h2 className="text-lg font-semibold">Personal &amp; academic details</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name">
          <input className="input" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Ananya Sharma" />
        </Field>
        <Field label="Academic email">
          <div className="relative">
            <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input className="input pl-9" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@college.edu" />
          </div>
        </Field>
        <Field label="Date of birth">
          <input type="date" className="input" value={form.dob} onChange={(e) => update("dob", e.target.value)} />
        </Field>
        <Field label="College">
          <input className="input" value={form.college} onChange={(e) => update("college", e.target.value)} placeholder="IIT Roorkee" />
        </Field>
        <Field label="Branch">
          <select className="input" value={form.branch} onChange={(e) => update("branch", e.target.value)}>
            {["CSE", "IT", "ECE", "EEE", "Mech", "Design", "Other"].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </Field>
        <Field label="CGPA (0-10)">
          <input type="number" step="0.1" min={0} max={10} className="input" value={form.cgpa} onChange={(e) => update("cgpa", Number(e.target.value))} />
        </Field>
        <Field label="Graduation year">
          <select className="input" value={form.gradYear} onChange={(e) => update("gradYear", Number(e.target.value))}>
            {[2025, 2026, 2027, 2028, 2029].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </Field>
        <Field label="LinkedIn URL">
          <input className="input" value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." />
        </Field>
        <Field label="GitHub URL">
          <input className="input" value={form.github} onChange={(e) => update("github", e.target.value)} placeholder="https://github.com/..." />
        </Field>
        <Field label="Portfolio URL" full>
          <input className="input" value={form.portfolio} onChange={(e) => update("portfolio", e.target.value)} placeholder="https://..." />
        </Field>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-800 px-4 py-2 text-sm">{error}</div>
      )}

      <div className="flex justify-end">
        <button className="btn-primary" onClick={next}>
          Continue <ArrowRight className="size-4" />
        </button>
      </div>

      <style jsx>{`
        :global(.input) {
          @apply w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200;
        }
      `}</style>
    </section>
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