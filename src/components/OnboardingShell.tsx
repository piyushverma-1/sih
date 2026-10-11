"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { STEPS } from "@/app/onboarding/_steps";

export default function OnboardingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentIdx = STEPS.findIndex((s: typeof STEPS[number]) => pathname?.endsWith(s.slug));

  return (
    <main className="max-w-3xl mx-auto space-y-6">
      <header className="card p-6">
        <div className="text-xs uppercase tracking-wider text-ink-400">Onboarding</div>
        <h1 className="mt-1 text-2xl font-bold">Set up your Career Twin</h1>
        <ol className="mt-4 flex items-center gap-2 text-xs">
          {STEPS.map((s, i) => {
            const done = i < currentIdx;
            const active = i === currentIdx;
            return (
              <li key={s.slug} className="flex-1">
                <Link
                  href={s.slug}
                  className={
                    "block rounded-lg border px-3 py-2 transition " +
                    (active
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : done
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-ink-200 text-ink-700 hover:bg-white")
                  }
                >
                  <div className="text-[10px] uppercase tracking-wider">Step {i + 1}</div>
                  <div className="font-medium">{s.title}</div>
                </Link>
              </li>
            );
          })}
        </ol>
      </header>
      {children}
    </main>
  );
}