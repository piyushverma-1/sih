"use client";

import { useMemo } from "react";
import { Brain, TrendingUp } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { SKILL_BY_ID } from "@/lib/sample-data";

export default function CompanySkillsPage() {
  const opportunities = useCompanyStore((s) => s.opportunities);

  const demand = useMemo(() => {
    const freq = new Map<string, number>();
    opportunities.forEach((o) => (o.requiredSkills ?? []).forEach((s) => freq.set(s, (freq.get(s) ?? 0) + 1)));
    const total = opportunities.length || 1;
    return Array.from(freq.entries())
      .map(([skill, count]) => ({ skill: SKILL_BY_ID.get(skill)?.name ?? skill, count, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [opportunities]);

  return (
    <main className="space-y-6">
      <header className="card p-6">
        <span className="chip"><Brain className="size-3" /> Skill Intelligence</span>
        <h1 className="mt-2 text-2xl font-bold">Skill demand & talent availability</h1>
        <p className="text-sm text-ink-700">Aggregated across your active opportunities.</p>
      </header>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold">Top demanded skills</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demand}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f7" />
                <XAxis dataKey="skill" tick={{ fontSize: 11 }} stroke="#8590ad" />
                <YAxis tick={{ fontSize: 12 }} stroke="#8590ad" />
                <Tooltip />
                <Bar dataKey="count" fill="url(#skillGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="skillGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#845adf" />
                    <stop offset="100%" stopColor="#3a5dff" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold flex items-center gap-2"><TrendingUp className="size-4 text-brand-600" /> Demand table</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-400 border-b border-ink-100">
                  <th className="py-2 pr-3">Skill</th>
                  <th className="py-2 pr-3">Demand</th>
                  <th className="py-2">% of opportunities</th>
                </tr>
              </thead>
              <tbody>
                {demand.map((d) => (
                  <tr key={d.skill} className="border-b border-ink-50">
                    <td className="py-2 pr-3 font-medium">{d.skill}</td>
                    <td className="py-2 pr-3">{d.count}</td>
                    <td className="py-2">{d.pct}%</td>
                  </tr>
                ))}
                {!demand.length && (
                  <tr><td colSpan={3} className="py-4 text-sm text-ink-400">No demand data yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
