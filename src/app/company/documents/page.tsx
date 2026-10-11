"use client";

import { useMemo, useState } from "react";
import { FileText, Plus, Trash2, Upload } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import type { DocumentRecord } from "@/types/company";

const TYPES = ["offer_letter", "job_description", "interview_document", "project_brief", "training_material", "certificate", "mou", "other"];

export default function DocumentsPage() {
  const docs = useCompanyStore((s) => s.documents);
  const upsert = useCompanyStore((s) => s.upsertDocument);
  const remove = useCompanyStore((s) => s.removeDocument);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<DocumentRecord>>({
    title: "",
    type: "job_description",
    accessRoles: ["ADMIN", "HR_MANAGER"],
  });

  return (
    <main className="space-y-6">
      <header className="card p-6 flex items-end justify-between gap-3">
        <div>
          <span className="chip"><FileText className="size-3" /> Documents</span>
          <h1 className="mt-2 text-2xl font-bold">Secure document repository</h1>
          <p className="text-sm text-ink-700">{docs.length} documents.</p>
        </div>
        <button className="btn-primary" onClick={() => setOpen(true)}><Plus className="size-4" /> Upload document</button>
      </header>

      <section className="card p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-ink-400 border-b border-ink-100">
                <th className="py-2 pr-3">Title</th>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Access roles</th>
                <th className="py-2 pr-3">Version</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id} className="border-b border-ink-50">
                  <td className="py-2 pr-3 font-medium">{d.title}</td>
                  <td className="py-2 pr-3">{d.type.replace("_", " ")}</td>
                  <td className="py-2 pr-3">{d.accessRoles.join(", ")}</td>
                  <td className="py-2 pr-3">v{d.version}</td>
                  <td className="py-2">
                    <button onClick={() => remove(d.id)} className="text-rose-700 inline-flex items-center gap-1 text-xs"><Trash2 className="size-3" /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="card p-6 max-w-md w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Upload document</h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="mt-4 space-y-3">
              <Field label="Title"><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
              <Field label="Type">
                <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as DocumentRecord["type"] })}>
                  {TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                </select>
              </Field>
              <Field label="URL"><input className="input" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /></Field>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="file"
                  className="text-sm"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setForm({ ...form, url: URL.createObjectURL(f), title: form.title || f.name });
                  }}
                />
                <Upload className="size-4" />
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => { upsert({ ...(form as DocumentRecord), id: `doc_${Date.now()}`, companyId: "demo-company", uploadedBy: "rec_1", uploadedAt: new Date().toISOString(), version: 1 }); setOpen(false); }}>Upload</button>
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
