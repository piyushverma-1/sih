"use client";

import { useMemo, useState } from "react";
import {
  KanbanSquare, Building2, CalendarClock, ChevronRight, Trash2, MessageSquare
} from "lucide-react";
import { useCareerTwin, ALL_INTERNSHIPS } from "@/lib/store-z";
import type { ApplicationRecord } from "@/types/student";
import clsx from "clsx";

const STAGES: ApplicationRecord["stage"][] = [
  "Applied", "Shortlisted", "Online Assessment", "Technical Interview", "Selected", "Rejected"
];

export default function ApplicationsPage() {
  const apps = useCareerTwin((s) => s.twin.applications);
  const move = useCareerTwin((s) => s.moveApplication);
  const remove = useCareerTwin((s) => s.removeApplication);
  const setNotes = useCareerTwin((s) => s.setApplicationNotes);
  const [openId, setOpenId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const out: Record<string, ApplicationRecord[]> = {};
    STAGES.forEach((s) => (out[s] = []));
    apps.forEach((a) => out[a.stage].push(a));
    return out;
  }, [apps]);

  return (
    <main className="space-y-6">
      <header className="card p-6">
        <span className="chip"><KanbanSquare className="size-3" /> Pipeline</span>
        <h1 className="mt-2 text-2xl font-bold">Application tracker</h1>
        <p className="text-sm text-ink-700">Drag-and-drop a card to move stages. Click a card to see history and add notes.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {STAGES.map((s) => (
          <div key={s} className="card p-3 min-h-[160px]">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-ink-400">
              <span>{s}</span>
              <span className="chip bg-ink-50 text-ink-700">{grouped[s].length}</span>
            </div>
            <div className="mt-2 space-y-2">
              {grouped[s].map((a) => {
                const i = ALL_INTERNSHIPS.find((x) => x.id === a.internshipId);
                return (
                  <div key={a.id} className="rounded-xl border border-ink-100 p-2 bg-white">
                    <div className="text-sm font-semibold">{i?.title ?? a.internshipId}</div>
                    <div className="text-xs text-ink-700 flex items-center gap-1"><Building2 className="size-3" /> {i?.company}</div>
                    <div className="text-[10px] text-ink-400 flex items-center gap-1 mt-1"><CalendarClock className="size-3" /> Applied {new Date(a.appliedAt).toLocaleDateString()}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {STAGES.filter((x) => x !== a.stage).slice(0, 2).map((next) => (
                        <button
                          key={next}
                          onClick={() => move(a.id, next)}
                          className="text-[10px] rounded-md border border-ink-200 px-1.5 py-0.5 hover:bg-ink-50"
                        >
                          → {next}
                        </button>
                      ))}
                      <button onClick={() => setOpenId(a.id)} className="text-[10px] text-brand-700 hover:underline ml-auto inline-flex items-center gap-0.5">
                        <MessageSquare className="size-3" /> Notes
                      </button>
                    </div>
                    {openId === a.id && (
                      <div className="mt-2">
                        <textarea
                          className="w-full rounded-md border border-ink-200 p-1.5 text-xs"
                          rows={2}
                          placeholder="Interview notes…"
                          defaultValue={a.notes}
                          onBlur={(e) => setNotes(a.id, e.target.value)}
                        />
                        <details className="text-[10px] text-ink-500 mt-1">
                          <summary className="cursor-pointer">History ({a.history.length})</summary>
                          <ul className="mt-1 space-y-0.5">
                            {a.history.map((h, i) => (
                              <li key={i}>{new Date(h.at).toLocaleString()} — {h.stage}</li>
                            ))}
                          </ul>
                        </details>
                        <button onClick={() => remove(a.id)} className="mt-1 text-[10px] text-rose-700 inline-flex items-center gap-1">
                          <Trash2 className="size-3" /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}