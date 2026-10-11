"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Building2, Users, Briefcase, FileText, Brain,
  GraduationCap, FlaskConical, Trophy, FileBarChart, Settings,
  ChevronLeft, LogOut, Bell
} from "lucide-react";
import clsx from "clsx";
import { useCompanyStore } from "@/lib/store-company";

const NAV = [
  { href: "/company/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/company/profile", label: "Company Profile", icon: Building2 },
  { href: "/company/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/company/applications", label: "Applications", icon: Users },
  { href: "/company/candidates", label: "Candidates", icon: FileText },
  { href: "/company/interviews", label: "Interviews", icon: GraduationCap },
  { href: "/company/offers", label: "Offers", icon: FileText },
  { href: "/company/learning", label: "Learning", icon: GraduationCap },
  { href: "/company/mentorship", label: "Mentorship", icon: GraduationCap },
  { href: "/company/collaborations", label: "Collaborations", icon: FlaskConical },
  { href: "/company/projects", label: "Live Projects", icon: Trophy },
  { href: "/company/challenges", label: "Challenges", icon: Trophy },
  { href: "/company/analytics", label: "Analytics", icon: FileBarChart },
  { href: "/company/skills", label: "Skill Intelligence", icon: Brain },
  { href: "/company/team", label: "Recruiter Team", icon: Users },
  { href: "/company/documents", label: "Documents", icon: FileText },
  { href: "/company/ai-assistant", label: "AI Assistant", icon: Brain },
];

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const profile = useCompanyStore((s) => s.profile);
  const unread = useCompanyStore((s) => s.notifications.filter((n) => !n.read).length);

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
          <Link href="/company/dashboard" className="flex items-center gap-2">
            <div className="size-9 rounded-xl grid place-items-center text-white font-black" style={{ background: profile.logoColor }}>
              {profile.name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold leading-tight">{profile.name}</div>
              <div className="text-xs text-ink-400">Industry Command Center</div>
            </div>
          </Link>

          {profile.status !== "VERIFIED" && (
            <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Status: {profile.status.replace("_", " ")}
            </div>
          )}

          <nav className="mt-4 space-y-1 text-sm max-h-[calc(100vh-220px)] overflow-y-auto">
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
                  {n.href === "/company/applications" && unread > 0 && (
                    <span className="ml-auto size-2 rounded-full bg-rose-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-ink-100 pt-3 space-y-1 text-xs">
            <Link href="/" className="flex items-center gap-2 text-ink-700 hover:text-ink-900">
              <ChevronLeft className="size-3.5" /> Back to landing
            </Link>
            <button
              onClick={() => {
                useCompanyStore.getState().reset();
                router.push("/");
              }}
              className="flex items-center gap-2 text-ink-700 hover:text-ink-900"
            >
              <LogOut className="size-3.5" /> Reset demo
            </button>
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
        <Building2 className="size-4 text-ink-700" />
      </button>

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
