"use client";

import { useMemo, useState } from "react";
import { Users, Search, ChevronRight, ChevronLeft, CheckCircle2, XCircle, AlertTriangle, Filter } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import clsx from "clsx";

const STAGES = ["Applied", "AI_Screened", "Eligible", "Shortlisted", "Assessment", "Interview", "Selected", "Offer", "Joined", "Rejected"] as const;

export default function ApplicationsPage() {
  const apps = useCompanyStore((s) => s.applications);
  const moveStage = useCompanyStore((s) => s.updateApplicationStage);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return apps
      .filter((a) => (stageFilter === "all" ? true : a.stage === stageFilter))
      .filter((a) => `${a.studentName} ${a.studentEmail} ${a.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [apps, query, stageFilter]);

  const grouped = useMemo(() => {
    const out: Record<string, typeof apps> = {};
    STAGES.forEach((s) => (out[s] = []));
    apps.forEach((a) => out[a.stage].push(a));
    return out;
  }, [apps]);

  const selectedApp = selected ? apps.find((a) => a.id === selected) : null;

  return (
    <main className="space-y-6">
      <header className="card p-6">
        <span className="chip"><Users className="size-3" /> Applications</span>
        <h1 className="mt-2 text-2xl font-bold">Candidate pipeline</h1>
        <p className="text-sm text-ink-700">{apps.length} total applications across all opportunities.</p>
      </header>

      <section className="card p-4 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            className="w-full rounded-xl border border-ink-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-brand-500"
            placeholder="Search by name, email or skill"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {["all", ...STAGES].map((s) => (
            <button
              key={s}
              onClick={() => setStageFilter(s)}
              className={clsx(
                "rounded-full px-3 py-1 text-xs border",
                stageFilter === s ? "bg-brand-600 text-white border-brand-600" : "bg-white text-ink-700 border-ink-200 hover:bg-ink-50"
              )}
            >
              {s === "all" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-2">
          {filtered.map((app) => (
            <div
              key={app.id}
              onClick={() => setSelected(app.id)}
              className={clsx("card p-4 cursor-pointer", selected === app.id && "border-brand-500")}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{app.studentName}</div>
                  <div className="text-xs text-ink-700">{app.degree} · {app.branch} · CGPA {app.cgpa} · {app.gradYear}</div>
                  <div className="text-xs text-ink-400 mt-1">Match: {app.matchPercentage}% · ATS: {app.atsScore} · Assessment: {app.assessmentScore}%</div>
                </div>
                <span className={clsx("chip text-[10px]", stageColor(app.stage))}>{app.stage}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-5">
          {selectedApp ? (
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold">{selectedApp.studentName}</h3>
                <div className="text-xs text-ink-700">{selectedApp.studentEmail}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl bg-ink-50 p-2"><div className="text-lg font-bold">{selectedApp.matchPercentage}%</div><div className="text-ink-400">Match</div></div>
                <div className="rounded-xl bg-ink-50 p-2"><div className="text-lg font-bold">{selectedApp.atsScore}</div><div className="text-ink-400">ATS</div></div>
                <div className="rounded-xl bg-ink-50 p-2"><div className="text-lg font-bold">{selectedApp.assessmentScore}%</div><div className="text-ink-400">Assessment</div></div>
              </div>
              <div>
                <div className="text-xs uppercase text-ink-400">Skills</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selectedApp.skills.map((s) => (
                    <span key={s} className={clsx("chip text-[10px]", selectedApp.verifiedSkills.includes(s) ? "bg-emerald-50 text-emerald-700" : "bg-ink-50 text-ink-700")}>{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-ink-400">Move stage</div>
                <div className="mt-1 grid grid-cols-2 gap-1">
                  {STAGES.filter((s) => s !== selectedApp.stage).slice(0, 6).map((s) => (
                    <button key={s} onClick={() => moveStage(selectedApp.id, s)} className="text-[10px] rounded-md border border-ink-200 px-2 py-1 hover:bg-ink-50">
                      → {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-ink-700">Select a candidate to view details.</div>
          )}
        </div>
      </section>
    </main>
  );
}

function stageColor(stage: string) {
  switch (stage) {
    case "Applied": return "bg-ink-50 text-ink-700";
    case "AI_Screened": return "bg-brand-50 text-brand-700";
    case "Eligible": return "bg-brand-50 text-brand-700";
    case "Shortlisted": return "bg-emerald-50 text-emerald-700";
    case "Assessment": return "bg-amber-50 text-amber-700";
    case "Interview": return "bg-amber-50 text-amber-700";
    case "Selected": return "bg-emerald-50 text-emerald-700";
    case "Offer": return "bg-fuchsia-50 text-fuchsia-700";
    case "Joined": return "bg-emerald-50 text-emerald-700";
    case "Rejected": return "bg-rose-50 text-rose-700";
    default: return "bg-ink-50 text-ink-700";
  }
}
