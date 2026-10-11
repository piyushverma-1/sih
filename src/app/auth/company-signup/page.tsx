"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, UserPlus, ArrowRight } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";

export default function CompanySignupPage() {
  const router = useRouter();
  const updateProfile = useCompanyStore((s) => s.updateProfile);
  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
    industry: "",
    companyType: "",
    foundedYear: "",
    size: "",
    headquarters: "",
    locations: "",
    website: "",
    linkedin: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Company name is required.");
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid company email.");
    if (!form.industry.trim()) return setError("Industry is required.");

    updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      description: form.description.trim(),
      industry: form.industry.trim(),
      companyType: form.companyType.trim(),
      foundedYear: Number(form.foundedYear),
      size: form.size.trim(),
      headquarters: form.headquarters.trim(),
      locations: form.locations.split(",").map((x) => x.trim()).filter(Boolean),
      website: form.website.trim(),
      linkedin: form.linkedin.trim(),
      contactName: form.contactName.trim(),
      contactEmail: form.contactEmail.trim(),
      contactPhone: form.contactPhone.trim(),
    });
    router.push("/company/dashboard");
  }

  return (
    <main className="max-w-2xl mx-auto">
      <section className="card p-8 space-y-5">
        <div className="flex items-center gap-2">
          <Building2 className="size-5 text-brand-600" />
          <h1 className="text-xl font-semibold">Create company account</h1>
        </div>
        <p className="text-sm text-ink-700">Register your organization to post opportunities and manage recruitment.</p>
        
        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Company name">
              <input className="inp" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Acme Technologies" />
            </Field>
            <Field label="Company email">
              <div className="relative">
                <Building2 className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input className="inp pl-9" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="hr@acme.com" />
              </div>
            </Field>
            <Field label="Industry" full>
              <input className="inp" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="Technology, Finance, Healthcare" />
            </Field>
            <Field label="Company type">
              <input className="inp" value={form.companyType} onChange={(e) => setForm({ ...form, companyType: e.target.value })} placeholder="Product, Services, Startup" />
            </Field>
            <Field label="Founded year">
              <input type="number" className="inp" value={form.foundedYear} onChange={(e) => setForm({ ...form, foundedYear: e.target.value })} />
            </Field>
            <Field label="Company size">
              <input className="inp" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="1-50, 51-200, 201-500" />
            </Field>
            <Field label="Headquarters">
              <input className="inp" value={form.headquarters} onChange={(e) => setForm({ ...form, headquarters: e.target.value })} placeholder="Bengaluru, India" />
            </Field>
            <Field label="Locations (comma separated)">
              <input className="inp" value={form.locations} onChange={(e) => setForm({ ...form, locations: e.target.value })} placeholder="Bengaluru, Hyderabad, Remote" />
            </Field>
            <Field label="Website">
              <input className="inp" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://acme.com" />
            </Field>
            <Field label="LinkedIn">
              <input className="inp" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/company/acme" />
            </Field>
            <Field label="Contact name">
              <input className="inp" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
            </Field>
            <Field label="Contact email">
              <input className="inp" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
            </Field>
            <Field label="Contact phone">
              <input className="inp" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
            </Field>
          </div>
          
          {error && <div className="rounded-lg bg-rose-50 text-rose-700 text-sm px-3 py-2">{error}</div>}
          
          <button className="btn-primary w-full">
            <UserPlus className="size-4" /> Create company account
          </button>
        </form>
        
        <div className="text-sm text-ink-700 text-center">
          Already have an account?{" "}
          <Link href="/auth/company-login" className="text-brand-600">Sign in</Link>
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

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={full ? "sm:col-span-2" : ""}>
      <div className="text-xs font-medium text-ink-700 mb-1">{label}</div>
      {children}
    </label>
  );
}
