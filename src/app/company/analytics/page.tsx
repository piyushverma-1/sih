"use client";

import { useMemo } from "react";
import { FileBarChart, Users, CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AnalyticsPage() {
  const opportunities = useCompanyStore((s) => s.opportunities);
  const applications = useCompanyStore((s) => s.applications);
  const offers = useCompanyStore((s) => s.offers);

  const funnelData = useMemo(() => {
    const stages = ["Applied", "Eligible", "Shortlisted", "Interview", "Selected", "Joined"];
    return stages.map((stage) => ({ stage, count: applications.filter((a) => a.stage === stage).length }));
  }, [applications]);

  const performance = useMemo(() => {
    return opportunities.map((o) => {
      const oppApps = applications.filter((a) => a.opportunityId === o.id);
      const shortlisted = oppApps.filter((a) => ["Shortlisted", "Assessment", "Interview", "Selected", "Offer", "Joined"].includes(a.stage)).length;
      const interview = oppApps.filter((a) => ["Interview", "Selected", "Offer", "Joined"].includes(a.stage)).length;
      const selected = oppApps.filter((a) => ["Selected", "Offer", "Joined"].includes(a.stage)).length;
      return {
        title: o.title,
        applications: oppApps.length,
        eligible: oppApps.filter((a) => a.stage !== "Applied").length,
        shortlisted,
        interview,
        selected,
      };
    });
  }, [opportunities, applications]);

  const selectionRate = applications.length ? Math.round((offers.filter((o) => o.status === "JOINED").length / applications.length) * 100) : 0;

  return (
    <main className="space-y-6">
      <header className="card p-6">
        <span className="chip"><FileBarChart className="size-3" /> Analytics</span>
        <h1 className="mt-2 text-2xl font-bold">Recruitment analytics</h1>
        <p className="text-sm text-ink-700">Track outcomes, ratios and trends across opportunities.</p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Applications" value={applications.length} />
        <Stat label="Eligible" value={applications.filter((a) => a.stage !== "Applied").length} />
        <Stat label="Shortlisted" value={applications.filter((a) => ["Shortlisted", "Assessment", "Interview", "Selected", "Offer", "Joined"].includes(a.stage)).length} />
        <Stat label="Selection rate" value={`${selectionRate}%`} />
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold">Recruitment funnel</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f7" />
                <XAxis dataKey="stage" tick={{ fontSize: 12 }} stroke="#8590ad" />
                <YAxis tick={{ fontSize: 12 }} stroke="#8590ad" />
                <Tooltip />
                <Bar dataKey="count" fill="url(#funnelGrad)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="funnelGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3a5dff" />
                    <stop offset="100%" stopColor="#845adf" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold">Opportunity performance</h2>
          <div className="mt-4 space-y-3">
            {performance.map((p) => (
              <div key={p.title} className="rounded-xl border border-ink-100 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{p.title}</span>
                  <span className="text-xs text-ink-700">{p.applications} apps</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-ink-100">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.min(100, p.applications * 10)}%` }} />
                </div>
                <div className="mt-1 text-xs text-ink-400">Eligible {p.eligible} · Shortlisted {p.shortlisted} · Interview {p.interview} · Selected {p.selected}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-xs text-ink-400">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
