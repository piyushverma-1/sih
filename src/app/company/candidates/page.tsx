"use client";

import { useMemo, useState } from "react";
import { Users, FileText, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import clsx from "clsx";

const TABS = ["Overview", "Skills", "Projects", "Education", "Certifications", "Internships", "Achievements", "Assessments", "Resume"] as const;

export default function CandidatesPage() {
  const apps = useCompanyStore((s) => s.applications);
  const [selectedId, setSelectedId] = useState<string | null>(apps[0]?.id ?? null);
  const [tab, setTab] = useState<string>("Overview");
  const selected = apps.find((a) => a.id === selectedId);

  return (
    <main className="space-y-6">
      <header className="card p-6">
        <span className="chip"><Users className="size-3" /> Candidates</span>
        <h1 className="mt-2 text-2xl font-bold">Candidate profiles</h1>
        <p className="text-sm text-ink-700">Review, compare and shortlist candidates.</p>
      </header>

      <section className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-2">
          {apps.map((app) => (
            <div
              key={app.id}
              onClick={() => { setSelectedId(app.id); setTab("Overview"); }}
              className={clsx("card p-4 cursor-pointer", selectedId === app.id && "border-brand-500")}
            >
              <div className="font-medium">{app.studentName}</div>
              <div className="text-xs text-ink-700">{app.degree} · {app.branch} · CGPA {app.cgpa}</div>
              <div className="text-xs text-ink-400 mt-1">Match {app.matchPercentage}% · ATS {app.atsScore} · Assessment {app.assessmentScore}%</div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 card p-6">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">{selected.studentName}</h2>
                  <div className="text-sm text-ink-700">{selected.studentEmail} · {selected.degree} · {selected.branch} · Grad {selected.gradYear}</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-primary" onClick={() => {}}>Shortlist</button>
                  <button className="btn-ghost" onClick={() => {}}>Compare</button>
                  <button className="btn-ghost" onClick={() => {}}>Schedule Interview</button>
                </div>
              </div>

              <div className="flex gap-2 border-b border-ink-100 pb-2 overflow-x-auto">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={clsx(
                      "rounded-full px-3 py-1 text-xs border shrink-0",
                      tab === t ? "bg-brand-600 text-white border-brand-600" : "bg-white text-ink-700 border-ink-200 hover:bg-ink-50"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="min-h-[200px]">
                {tab === "Overview" && (
                  <div className="grid sm:grid-cols-3 gap-3">
                    <StatCard label="Match %" value={`${selected.matchPercentage}%`} />
                    <StatCard label="ATS Score" value={`${selected.atsScore}`} />
                    <StatCard label="Assessment" value={`${selected.assessmentScore}%`} />
                  </div>
                )}
                {tab === "Skills" && (
                  <div className="flex flex-wrap gap-2">
                    {selected.skills.map((s) => (
                      <span key={s} className={clsx("chip", selected.verifiedSkills.includes(s) ? "bg-emerald-50 text-emerald-700" : "bg-ink-50 text-ink-700")}>{s}</span>
                    ))}
                  </div>
                )}
                {tab === "Projects" && <div className="text-sm text-ink-700">Project details would be fetched from student profile.</div>}
                {tab === "Education" && <div className="text-sm text-ink-700">{selected.degree} · {selected.branch} · {selected.gradYear}</div>}
                {tab === "Certifications" && <div className="text-sm text-ink-700">Certifications would be listed here.</div>}
                {tab === "Internships" && <div className="text-sm text-ink-700">Internship history would be listed here.</div>}
                {tab === "Achievements" && <div className="text-sm text-ink-700">Achievements would be listed here.</div>}
                {tab === "Assessments" && <div className="text-sm text-ink-700">Assessment breakdown would be listed here.</div>}
                {tab === "Resume" && <div className="text-sm text-ink-700">Resume preview/download would appear here.</div>}
              </div>
            </div>
          ) : (
            <div className="text-sm text-ink-700">Select a candidate to view their profile.</div>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-ink-50 px-3 py-2">
      <div className="text-xs text-ink-400">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
