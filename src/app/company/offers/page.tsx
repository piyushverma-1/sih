"use client";

import { useMemo, useState } from "react";
import { Plus, Download, Sparkles } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import type { Offer } from "@/types/company";

export default function OffersPage() {
  const offers = useCompanyStore((s) => s.offers);
  const createOffer = useCompanyStore((s) => s.createOffer);
  const updateStatus = useCompanyStore((s) => s.updateOfferStatus);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Offer>>({
    role: "",
    joiningDate: "",
    stipend: "",
    location: "",
    status: "OFFERED",
    notes: "",
  });

  const stats = useMemo(() => {
    const offered = offers.filter((o) => o.status === "OFFERED").length;
    const accepted = offers.filter((o) => o.status === "ACCEPTED").length;
    const joined = offers.filter((o) => o.status === "JOINED").length;
    const declined = offers.filter((o) => o.status === "DECLINED").length;
    return { offered, accepted, joined, declined, total: offers.length };
  }, [offers]);

  function submit() {
    createOffer({
      ...(form as Offer),
      id: `offer_${Date.now()}`,
      applicationId: "",
      opportunityId: "",
      candidateName: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setOpen(false);
    setForm({ role: "", joiningDate: "", stipend: "", location: "", status: "OFFERED", notes: "" });
  }

  return (
    <main className="space-y-6">
      <header className="card p-6 flex items-end justify-between gap-3">
        <div>
          <span className="chip"><Sparkles className="size-3" /> Offers & Joining</span>
          <h1 className="mt-2 text-2xl font-bold">Offer management</h1>
          <p className="text-sm text-ink-700">{offers.length} offers · {stats.joined} joined · {stats.accepted} accepted · {stats.declined} declined</p>
        </div>
        <button className="btn-primary" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> New offer
        </button>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Offered" value={stats.offered} />
        <Stat label="Accepted" value={stats.accepted} />
        <Stat label="Joined" value={stats.joined} />
        <Stat label="Declined" value={stats.declined} />
      </section>

      <section className="card p-5">
        <h2 className="font-semibold">All offers</h2>
        {offers.length ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-400 border-b border-ink-100">
                  <th className="py-2 pr-3">Candidate</th>
                  <th className="py-2 pr-3">Role</th>
                  <th className="py-2 pr-3">Stipend</th>
                  <th className="py-2 pr-3">Joining date</th>
                  <th className="py-2 pr-3">Location</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o) => (
                  <tr key={o.id} className="border-b border-ink-50">
                    <td className="py-2 pr-3 font-medium">{o.candidateName}</td>
                    <td className="py-2 pr-3">{o.role}</td>
                    <td className="py-2 pr-3">{o.stipend}</td>
                    <td className="py-2 pr-3">{o.joiningDate}</td>
                    <td className="py-2 pr-3">{o.location}</td>
                    <td className="py-2">
                      <select
                        className="rounded-md border border-ink-200 bg-white px-2 py-1 text-xs"
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value as Offer["status"])}
                      >
                        {["OFFERED", "ACCEPTED", "DECLINED", "JOINED"].map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-3 text-sm text-ink-700">No offers yet. Select candidates from interviews.</div>
        )}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="card p-6 max-w-md w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">New offer</h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="mt-4 space-y-3">
              <Field label="Candidate name"><input className="input" value={form.candidateName} onChange={(e) => setForm({ ...form, candidateName: e.target.value })} /></Field>
              <Field label="Role"><input className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></Field>
              <Field label="Stipend/salary"><input className="input" value={form.stipend} onChange={(e) => setForm({ ...form, stipend: e.target.value })} /></Field>
              <Field label="Joining date"><input type="date" className="input" value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} /></Field>
              <Field label="Location"><input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
              <Field label="Notes"><textarea className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} /></Field>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={submit}>Create offer</button>
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-xs text-ink-400">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
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
