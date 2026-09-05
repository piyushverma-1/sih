"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserPlus, GraduationCap } from "lucide-react";
import { useCareerTwin } from "@/lib/store-z";

export default function SignupPage() {
  const router = useRouter();
  const setProfile = useCareerTwin((s) => s.setProfile);
  const [form, setForm] = useState({ name: "", email: "", college: "", branch: "CSE", cgpa: 7.0, gradYear: 2027 });
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid academic email.");
    if (!form.college.trim()) return setError("College is required.");
    setProfile({ ...form, cgpa: Number(form.cgpa), gradYear: Number(form.gradYear) });
    router.push("/onboarding/interests");
  }

  return (
    <main className="max-w-md mx-auto">
      <section className="card p-8 space-y-4">
        <div className="flex items-center gap-2">
          <UserPlus className="size-5 text-brand-600" />
          <h1 className="text-xl font-semibold">Create your Career Twin</h1>
        </div>
        <form onSubmit={submit} className="space-y-3 text-sm">
          <Field label="Full name">
            <input className="inp" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Academic email">
            <div className="relative">
              <GraduationCap className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input className="inp pl-9" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </Field>
          <Field label="College">
            <input className="inp" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
          </Field>
          <div className="grid grid-cols-3 gap-2">
            <Field label="Branch">
              <select className="inp" value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}>
                {["CSE", "IT", "ECE", "EEE", "Mech", "Design", "Other"].map((b) => <option key={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="CGPA">
              <input className="inp" type="number" step="0.1" min={0} max={10} value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: Number(e.target.value) })} />
            </Field>
            <Field label="Grad">
              <select className="inp" value={form.gradYear} onChange={(e) => setForm({ ...form, gradYear: Number(e.target.value) })}>
                {[2025, 2026, 2027, 2028, 2029].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
          </div>
          {error && <div className="rounded-lg bg-rose-50 text-rose-700 text-sm px-3 py-2">{error}</div>}
          <button className="btn-primary w-full">
            <UserPlus className="size-4" /> Create account
          </button>
        </form>
        <div className="text-sm text-ink-700 text-center">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-brand-600">Sign in</Link>
        </div>
        <style jsx>{`
          :global(.inp) {
            @apply w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200;
          }
        `}</style>
      </section>
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