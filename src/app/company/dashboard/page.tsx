"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  LayoutDashboard, GaugeCircle, Users, CheckCircle2, XCircle,
  CalendarClock, Bell, Briefcase, TrendingUp, Sparkles, ArrowRight
} from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import { SKILL_BY_ID } from "@/lib/sample-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import clsx from "clsx";

export default function CompanyDashboardPage() {
  const opportunities = useCompanyStore((s) => s.opportunities);
  const applications = useCompanyStore((s) => s.applications);
  const interviews = useCompanyStore((s) => s.interviews);
  const offers = useCompanyStore((s) => s.offers);
  const notifications = useCompanyStore((s) => s.notifications);
  const markRead = useCompanyStore((s) => s.markNotificationRead);

  const published = opportunities.filter((o) => o.status === "PUBLISHED").length;
  const totalApps = applications.length;
  const shortlisted = applications.filter((a) => a.stage === "Shortlisted" || a.stage === "Assessment" || a.stage === "Interview" || a.stage === "Selected" || a.stage === "Offer" || a.stage === "Joined").length;
  const interviewsScheduled = interviews.filter((i) => i.status === "SCHEDULED").length;
  const offersMade = offers.filter((o) => o.status === "OFFERED").length;
  const hires = offers.filter((o) => o.status === "JOINED").length;

  const funnel = useMemo(() => {
    const stages = ["Applied", "Eligible", "Shortlisted", "Interview", "Selected", "Joined"];
    return stages.map((stage) => {
      const label = stage.replace("_", " ");
      const count = applications.filter((a) => a.stage === stage).length;
      return { stage: label, count };
    });
  }, [applications]);

  const skillDemand = useMemo(() => {
    const freq = new Map<string, number>();
    opportunities.forEach((o) => {
      (o.requiredSkills ?? []).forEach((s) => freq.set(s, (freq.get(s) ?? 0) + 1));
    });
    return Array.from(freq.entries())
      .map(([skill, count]) => ({ skill: SKILL_BY_ID.get(skill)?.name ?? skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [opportunities]);

  const recentApps = applications.slice(0, 5);
  const upcomingInterviews = interviews.filter((i) => i.status === "SCHEDULED").slice(0, 5);
  const unreadNotifications = notifications.filter((n) => !n.read).slice(0, 5);

  return (
    <main className="space-y-6">
      <header className="card p-6 sm:p-8">
        <span className="chip"><LayoutDashboard className="size-3" /> Industry Dashboard</span>
        <h1 className="mt-2 text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-ink-700">Here is your recruitment command center.</p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Kpi label="Active Opportunities" value={published} icon={<Briefcase className="size-4" />} href="/company/opportunities" />
        <Kpi label="Total Applications" value={totalApps} icon={<Users className="size-4" />} href="/company/applications" />
        <Kpi label="Shortlisted" value={shortlisted} icon={<CheckCircle2 className="size-4" />} href="/company/applications" />
        <Kpi label="Interviews" value={interviewsScheduled} icon={<CalendarClock className="size-4" />} href="/company/interviews" />
        <Kpi label="Offers Made" value={offersMade} icon={<Sparkles className="size-4" />} href="/company/offers" />
        <Kpi label="Hires" value={hires} icon={<TrendingUp className="size-4" />} href="/company/offers" />
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recruitment funnel</h2>
            <Link href="/company/applications" className="text-xs text-brand-700 hover:underline">Open pipeline</Link>
          </div>
          {funnel.length ? (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnel}>
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
          ) : (
            <div className="mt-4 text-sm text-ink-700">No applications yet. Publish opportunities to attract talent.</div>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Skill demand</h2>
            <Link href="/company/skills" className="text-xs text-brand-700 hover:underline">View insights</Link>
          </div>
          {skillDemand.length ? (
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillDemand} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef0f7" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#8590ad" />
                  <YAxis type="category" dataKey="skill" tick={{ fontSize: 12 }} stroke="#8590ad" width={90} />
                  <Tooltip />
                  <Bar dataKey="count" fill="url(#skillGrad)" radius={[0, 6, 6, 0]} />
                  <defs>
                    <linearGradient id="skillGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#845adf" />
                      <stop offset="100%" stopColor="#3a5dff" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-4 text-sm text-ink-700">No skill demand data yet.</div>
          )}
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent applications</h2>
            <Link href="/company/applications" className="text-xs text-brand-700 hover:underline">See all</Link>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {recentApps.map((app) => (
              <li key={app.id} className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{app.studentName}</div>
                  <div className="text-xs text-ink-700">{app.degree} · {app.branch} · {app.cgpa}</div>
                </div>
                <span className={clsx("chip text-[10px]", stageColor(app.stage))}>{app.stage}</span>
              </li>
            ))}
            {!recentApps.length && <li className="text-xs text-ink-400">No applications yet.</li>}
          </ul>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Upcoming interviews</h2>
            <Link href="/company/interviews" className="text-xs text-brand-700 hover:underline">Calendar</Link>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {upcomingInterviews.map((int) => (
              <li key={int.id} className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{int.candidateName}</div>
                  <div className="text-xs text-ink-700">{int.date} · {int.time} · Round {int.round}/{int.totalRounds}</div>
                </div>
                <span className="chip bg-brand-50 text-brand-700 text-[10px]">{int.type}</span>
              </li>
            ))}
            {!upcomingInterviews.length && <li className="text-xs text-ink-400">No interviews scheduled.</li>}
          </ul>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Notifications</h2>
            {unreadNotifications.length > 0 && (
              <button onClick={() => useCompanyStore.getState().markAllNotificationsRead()} className="text-[10px] text-brand-700 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {unreadNotifications.map((n) => (
              <li key={n.id} className="flex items-start gap-2">
                <Bell className="size-3 mt-1 text-amber-600" />
                <div>
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-ink-700">{n.message}</div>
                </div>
                <button onClick={() => markRead(n.id)} className="ml-auto text-[10px] text-brand-700 hover:underline">Read</button>
              </li>
            ))}
            {!unreadNotifications.length && <li className="text-xs text-ink-400">You are all caught up.</li>}
          </ul>
        </div>
      </section>
    </main>
  );
}

function Kpi({ label, value, icon, href }: { label: string; value: number; icon: React.ReactNode; href: string }) {
  return (
    <Link href={href} className="card p-4 hover:shadow-soft flex items-center gap-3">
      <div className="size-9 rounded-xl bg-brand-50 text-brand-700 grid place-items-center">{icon}</div>
      <div>
        <div className="text-xs text-ink-400">{label}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </Link>
  );
}

function stageColor(stage: string) {
  switch (stage) {
    case "Applied": return "bg-ink-50 text-ink-700";
    case "Shortlisted": return "bg-brand-50 text-brand-700";
    case "Interview": return "bg-amber-50 text-amber-700";
    case "Selected": return "bg-emerald-50 text-emerald-700";
    case "Offer": return "bg-fuchsia-50 text-fuchsia-700";
    case "Joined": return "bg-emerald-50 text-emerald-700";
    default: return "bg-rose-50 text-rose-700";
  }
}
