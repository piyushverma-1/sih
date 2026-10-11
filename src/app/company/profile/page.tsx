"use client";

import { useState } from "react";
import { Building2, Globe, Linkedin, MapPin, Users, Shield, Sparkles, CheckCircle2 } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import clsx from "clsx";

export default function CompanyProfilePage() {
  const profile = useCompanyStore((s) => s.profile);
  const updateProfile = useCompanyStore((s) => s.updateProfile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  function save() {
    updateProfile(form);
    setEditing(false);
  }

  const sections = [
    { label: "Identity", fields: ["name", "email", "industry", "companyType", "foundedYear", "size"] },
    { label: "Locations", fields: ["headquarters", "locations", "website", "linkedin"] },
    { label: "Hiring", fields: ["hiringDomains", "jobRoles", "hiringLocations", "workMode"] },
    { label: "Eligibility", fields: ["preferredDegrees", "preferredBranches", "minCgpa", "backlogPolicy", "experienceRequirement"] },
    { label: "Skills", fields: ["preferredTechnicalSkills", "preferredSoftSkills"] },
    { label: "Contact", fields: ["contactName", "contactEmail", "contactPhone"] },
  ];

  return (
    <main className="space-y-6">
      <header className="card p-6 sm:p-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="chip"><Building2 className="size-3" /> Company Profile</span>
          <h1 className="mt-2 text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm text-ink-700">{profile.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={clsx("chip", statusColor(profile.status))}>
            <Shield className="size-3" /> {profile.status.replace("_", " ")}
          </span>
          {!editing && (
            <button className="btn-primary" onClick={() => setEditing(true)}>
              Edit profile
            </button>
          )}
        </div>
      </header>

      {profile.status === "VERIFIED" && (
        <section className="card p-5 border-emerald-200 bg-emerald-50 flex items-center gap-3">
          <CheckCircle2 className="size-5 text-emerald-600" />
          <div>
            <div className="font-semibold text-emerald-900">Verified Industry Partner</div>
            <div className="text-sm text-emerald-800">This company has passed identity, email and recruiter verification.</div>
          </div>
        </section>
      )}

      <section className="grid sm:grid-cols-3 gap-4">
        <div className="card p-5 flex items-center gap-3">
          <div className="size-12 rounded-2xl grid place-items-center text-white text-lg font-bold" style={{ background: profile.logoColor }}>
            {profile.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="text-xs text-ink-400">Company</div>
            <div className="font-semibold">{profile.name}</div>
            <div className="text-xs text-ink-700">{profile.industry} · {profile.companyType}</div>
          </div>
        </div>
        <div className="card p-5">
          <div className="text-xs text-ink-400">Reputation</div>
          <div className="mt-2 space-y-1 text-sm">
            <div>Response rate: {profile.reputation.responseRate}%</div>
            <div>Completion rate: {profile.reputation.completionRate}%</div>
            <div>Offer conversion: {profile.reputation.offerConversion}%</div>
            <div>Avg turnaround: {profile.reputation.hiringTurnaroundDays} days</div>
          </div>
        </div>
        <div className="card p-5">
          <div className="text-xs text-ink-400">Links</div>
          <ul className="mt-2 text-sm space-y-1">
            <li className="flex items-center gap-2"><Globe className="size-3" /> <a href={profile.website} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">Website</a></li>
            <li className="flex items-center gap-2"><Linkedin className="size-3" /> <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-brand-700 hover:underline">LinkedIn</a></li>
            <li className="flex items-center gap-2"><MapPin className="size-3" /> {profile.headquarters}</li>
          </ul>
        </div>
      </section>

      {editing ? (
        <section className="card p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Company name">
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Email">
              <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Description" full>
              <textarea className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </Field>
            <Field label="Industry">
              <input className="input" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            </Field>
            <Field label="Company type">
              <input className="input" value={form.companyType} onChange={(e) => setForm({ ...form, companyType: e.target.value })} />
            </Field>
            <Field label="Founded year">
              <input type="number" className="input" value={form.foundedYear} onChange={(e) => setForm({ ...form, foundedYear: Number(e.target.value) })} />
            </Field>
            <Field label="Size">
              <input className="input" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
            </Field>
            <Field label="Headquarters">
              <input className="input" value={form.headquarters} onChange={(e) => setForm({ ...form, headquarters: e.target.value })} />
            </Field>
            <Field label="Locations (comma separated)">
              <input className="input" value={form.locations.join(", ")} onChange={(e) => setForm({ ...form, locations: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} />
            </Field>
            <Field label="Website">
              <input className="input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </Field>
            <Field label="LinkedIn">
              <input className="input" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
            </Field>
            <Field label="Hiring domains">
              <input className="input" value={form.hiringDomains.join(", ")} onChange={(e) => setForm({ ...form, hiringDomains: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} />
            </Field>
            <Field label="Job roles">
              <input className="input" value={form.jobRoles.join(", ")} onChange={(e) => setForm({ ...form, jobRoles: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} />
            </Field>
            <Field label="Preferred degrees">
              <input className="input" value={form.preferredDegrees.join(", ")} onChange={(e) => setForm({ ...form, preferredDegrees: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} />
            </Field>
            <Field label="Preferred branches">
              <input className="input" value={form.preferredBranches.join(", ")} onChange={(e) => setForm({ ...form, preferredBranches: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} />
            </Field>
            <Field label="Min CGPA">
              <input type="number" step="0.1" className="input" value={form.minCgpa} onChange={(e) => setForm({ ...form, minCgpa: Number(e.target.value) })} />
            </Field>
            <Field label="Backlog policy">
              <input className="input" value={form.backlogPolicy} onChange={(e) => setForm({ ...form, backlogPolicy: e.target.value })} />
            </Field>
            <Field label="Experience requirement">
              <input className="input" value={form.experienceRequirement} onChange={(e) => setForm({ ...form, experienceRequirement: e.target.value })} />
            </Field>
            <Field label="Technical skills">
              <input className="input" value={form.preferredTechnicalSkills.join(", ")} onChange={(e) => setForm({ ...form, preferredTechnicalSkills: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} />
            </Field>
            <Field label="Soft skills">
              <input className="input" value={form.preferredSoftSkills.join(", ")} onChange={(e) => setForm({ ...form, preferredSoftSkills: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} />
            </Field>
            <Field label="Hiring locations">
              <input className="input" value={form.hiringLocations.join(", ")} onChange={(e) => setForm({ ...form, hiringLocations: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} />
            </Field>
            <Field label="Work mode">
              <input className="input" value={form.workMode} onChange={(e) => setForm({ ...form, workMode: e.target.value })} />
            </Field>
            <Field label="Contact name">
              <input className="input" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
            </Field>
            <Field label="Contact email">
              <input className="input" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
            </Field>
            <Field label="Contact phone">
              <input className="input" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
            </Field>
          </div>
          <div className="flex justify-end gap-2">
            <button className="btn-ghost" onClick={() => { setForm(profile); setEditing(false); }}>Cancel</button>
            <button className="btn-primary" onClick={save}><Sparkles className="size-4" /> Save profile</button>
          </div>
          <style jsx>{`
            :global(.input) {
              @apply w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200;
            }
          `}</style>
        </section>
      ) : (
        <section className="space-y-4">
          {sections.map((sec) => (
            <div key={sec.label} className="card p-5">
              <h3 className="font-semibold">{sec.label}</h3>
              <dl className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                {sec.fields.map((field) => (
                  <div key={field}>
                    <dt className="text-xs text-ink-400">{field.replace(/([A-Z])/g, " $1").trim()}</dt>
                    <dd className="text-ink-900">{renderValue(form[field as keyof typeof form])}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </section>
      )}
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

function renderValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ") || "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value ?? "—");
}

function statusColor(status: string) {
  switch (status) {
    case "VERIFIED": return "bg-emerald-50 text-emerald-700";
    case "PENDING": return "bg-amber-50 text-amber-700";
    case "UNDER_REVIEW": return "bg-brand-50 text-brand-700";
    case "REJECTED": return "bg-rose-50 text-rose-700";
    default: return "bg-ink-50 text-ink-700";
  }
}
