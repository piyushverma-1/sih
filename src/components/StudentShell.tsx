"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Brain,
  Trophy,
  Map,
  Briefcase,
  KanbanSquare,
  IdCard,
  FlaskConical,
  Search,
  ChevronLeft,
  LogOut,
  RefreshCcw,
} from "lucide-react";
import clsx from "clsx";
import { useCareerTwin } from "@/lib/store-z";

const NAV = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/resume-analysis", label: "Resume", icon: FileText },
  { href: "/student/skills", label: "Skills", icon: Sparkles },
  { href: "/student/assessment", label: "Assessment", icon: Brain },
  { href: "/student/roadmap", label: "Roadmap", icon: Map },
  { href: "/student/skill-quest", label: "Skill Quest", icon: Trophy },
  { href: "/student/internships", label: "Internships", icon: Briefcase },
  { href: "/student/applications", label: "Applications", icon: KanbanSquare },
  { href: "/student/portfolio", label: "Portfolio", icon: IdCard },
  { href: "/student/career-simulator", label: "Career Simulator", icon: FlaskConical },
  { href: "/student/job-analyzer", label: "JD Analyzer", icon: Search },
];

export default function StudentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const twin = useCareerTwin((s) => s.twin);
  const reset = useCareerTwin((s) => s.reset);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="flex gap-6">
      <aside
        className={clsx(
          "lg:sticky lg:top-6 lg:self-start lg:w-64 shrink-0",
          "fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-soft border-r border-ink-100 p-4 transition-transform lg:translate-x-0 lg:bg-transparent lg:shadow-none lg:border-0 lg:p-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="card p-4">
          <Link href="/student/dashboard" className="flex items-center gap-2">
            <span className="size-9 rounded-xl bg-brand-600 grid place-items-center text-white font-black">S</span>
            <div>
              <div className="font-semibold leading-tight">SkillBridge</div>
              <div className="text-xs text-ink-400">Student Module</div>
            </div>
          </Link>

          <div className="mt-4 rounded-xl bg-brand-50 px-3 py-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-ink-700">JRI</span>
              <span className="font-bold text-brand-700">{twin.jri.totalJRI}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-white">
              <div className="h-full rounded-full bg-brand-600" style={{ width: `${twin.jri.totalJRI}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-ink-700">
              <span>Lvl {twin.level} · {twin.xp} XP</span>
              <span>🔥 {twin.streak}d</span>
            </div>
          </div>

          <nav className="mt-4 space-y-1 text-sm">
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = pathname === n.href || pathname?.startsWith(n.href + "/");
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={clsx(
                    "flex items-center gap-2 rounded-lg px-3 py-2 transition",
                    active
                      ? "bg-brand-50 text-brand-700 font-medium"
                      : "text-ink-700 hover:bg-ink-50"
                  )}
                >
                  <Icon className="size-4" /> {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-ink-100 pt-3 space-y-1 text-xs">
            <Link href="/onboarding" className="flex items-center gap-2 text-ink-700 hover:text-ink-900">
              <RefreshCcw className="size-3.5" /> Re-run onboarding
            </Link>
            <button
              onClick={() => {
                reset();
                router.push("/");
              }}
              className="flex items-center gap-2 text-ink-700 hover:text-ink-900"
            >
              <LogOut className="size-3.5" /> Reset twin
            </button>
            <Link href="/" className="flex items-center gap-2 text-ink-700 hover:text-ink-900">
              <ChevronLeft className="size-3.5" /> Back to landing
            </Link>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <button
        className="lg:hidden fixed top-3 left-3 z-50 size-9 rounded-xl bg-white shadow-soft grid place-items-center"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle sidebar"
      >
        <LayoutDashboard className="size-4 text-ink-700" />
      </button>

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}