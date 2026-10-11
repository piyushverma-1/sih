"use client";

import { useState, useMemo } from "react";
import { Brain, Sparkles, Send } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import clsx from "clsx";

const SAMPLE_QUERIES = [
  "Find me candidates for a Python backend internship.",
  "Show candidates above 80% match.",
  "Which skills are hardest to find?",
  "Why are applications low?",
];

export default function AIAssistantPage() {
  const apps = useCompanyStore((s) => s.applications);
  const opportunities = useCompanyStore((s) => s.opportunities);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);

  const answer = useMemo(() => {
    const q = query.toLowerCase();
    if (q.includes("python") || q.includes("backend")) {
      const matches = apps.filter((a) => a.skills.some((s) => ["python", "django", "flask", "fastapi"].includes(s)));
      return `Found ${matches.length} candidates with backend/Python skills. Top match: ${matches[0]?.studentName ?? "—"} at ${matches[0]?.matchPercentage ?? 0}% compatibility.`;
    }
    if (q.includes("80") || q.includes("above")) {
      const matches = apps.filter((a) => a.matchPercentage >= 80);
      return `${matches.length} candidates are above 80% match. They are strong shortlist candidates.`;
    }
    if (q.includes("hardest") || q.includes("skills")) {
      const freq = new Map<string, number>();
      opportunities.forEach((o) => (o.requiredSkills ?? []).forEach((s) => freq.set(s, (freq.get(s) ?? 0) + 1)));
      const sorted = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
      return `Hardest-to-find skills from active opportunities: ${sorted.map(([s, c]) => `${s} (${c})`).join(", ")}. Consider launching learning programs for these.`;
    }
    if (q.includes("low") || q.includes("application")) {
      const published = opportunities.filter((o) => o.status === "PUBLISHED");
      const avg = published.length ? Math.round(apps.length / published.length) : 0;
      return `You have ${published.length} published opportunities with avg ${avg} applicants each. To improve volume: check eligibility restrictiveness, stipend competitiveness, and deadline visibility.`;
    }
    return "I can help you find candidates, analyze skill shortages, review opportunity performance, and suggest improvements. Try asking about candidate matches, skill demand, or application volume.";
  }, [query, apps, opportunities]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setMessages((m) => [...m, { role: "user", text: query }, { role: "assistant", text: answer }]);
    setQuery("");
  }

  return (
    <main className="space-y-6">
      <header className="card p-6">
        <span className="chip"><Brain className="size-3" /> AI Recruiter Assistant</span>
        <h1 className="mt-2 text-2xl font-bold">Ask anything about your talent pipeline</h1>
        <p className="text-sm text-ink-700">Natural-language queries grounded in your company data.</p>
      </header>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <div className="h-96 overflow-y-auto space-y-3">
            {messages.length === 0 && (
              <div className="text-sm text-ink-400">Ask about candidates, skills, or opportunity performance.</div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={clsx("rounded-xl p-3 text-sm", m.role === "user" ? "bg-brand-50 text-brand-900" : "bg-ink-50 text-ink-900")}>
                <div className="text-[10px] uppercase tracking-wider text-ink-400 mb-1">{m.role}</div>
                {m.text}
              </div>
            ))}
            {query && !messages.length && (
              <div className="rounded-xl p-3 text-sm bg-brand-50 text-brand-900">
                <div className="text-[10px] uppercase tracking-wider text-ink-400 mb-1">assistant</div>
                {answer}
              </div>
            )}
          </div>
          <form onSubmit={submit} className="mt-3 flex gap-2">
            <input
              className="flex-1 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
              placeholder='Try: "Find candidates for Python backend internship"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn-primary"><Send className="size-4" /></button>
          </form>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold">Suggested queries</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {SAMPLE_QUERIES.map((q) => (
              <li key={q}>
                <button onClick={() => setQuery(q)} className="text-brand-700 hover:underline text-left">{q}</button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <h3 className="font-semibold text-sm">AI Recommendations</h3>
            <ul className="mt-2 space-y-1 text-xs text-ink-700">
              <li>• Launch learning program for top demanded skills.</li>
              <li>• Review CGPA cutoff for wider reach.</li>
              <li>• Post similar roles for consistency.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
