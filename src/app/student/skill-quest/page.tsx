"use client";

import { useEffect, useMemo } from "react";
import { Trophy, Flame, Star, Sparkles, Award } from "lucide-react";
import { useCareerTwin } from "@/lib/store-z";
import { buildQuests, computeJri } from "@/lib/career-engine";
import clsx from "clsx";

export default function SkillQuestPage() {
  const twin = useCareerTwin((s) => s.twin);
  const setJri = useCareerTwin((s) => s.setJri);
  const quests = useMemo(() => buildQuests(twin), [twin]);
  const xpToNext = (twin.level * 500) - twin.xp;
  const pctToNext = Math.round((twin.xp / (twin.level * 500)) * 100);

  useEffect(() => {
    const j = computeJri(twin);
    if (j.totalJRI !== twin.jri.totalJRI) setJri(j);
  }, [twin, setJri]);

  return (
    <main className="space-y-6">
      <header className="card p-6 sm:p-8">
        <span className="chip"><Trophy className="size-3" /> Skill Quest</span>
        <h1 className="mt-2 text-2xl font-bold">Career Twin HUD</h1>
        <p className="text-sm text-ink-700">Earn XP, maintain streaks and unlock badges.</p>
      </header>

      <section className="grid sm:grid-cols-3 gap-4">
        <Hud label="Level" value={`Lvl ${twin.level}`} sub={`${twin.xp} XP`} pct={pctToNext} />
        <Hud label="Streak" value={`${twin.streak} day${twin.streak === 1 ? "" : "s"}`} sub="Daily activity" icon={<Flame className="size-4 text-rose-600" />} pct={Math.min(100, twin.streak * 20)} />
        <Hud label="JRI" value={`${twin.jri.totalJRI}`} sub={twin.jri.band} pct={twin.jri.totalJRI} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Quest mission board</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {quests.map((q) => (
            <div key={q.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  <span className="text-xl">{q.badge}</span>
                  {q.title}
                </div>
                <span className="chip bg-brand-50 text-brand-700">+{q.xp} XP</span>
              </div>
              <p className="mt-1 text-sm text-ink-700">{q.description}</p>
              <div className="mt-3 h-2 rounded-full bg-ink-100">
                <div className={clsx("h-full rounded-full", q.completed ? "bg-emerald-500" : "bg-brand-500")} style={{ width: `${Math.min(100, q.progress)}%` }} />
              </div>
              <div className="mt-1 text-xs text-ink-400">{Math.min(100, q.progress)}% · target {q.target}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <div className="font-semibold flex items-center gap-2"><Award className="size-4 text-amber-600" /> Skill badges</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { name: "Resume Master", unlocked: (twin.ats as unknown as { overall?: number } | null)?.overall ? (twin.ats as unknown as { overall?: number })!.overall! >= 80 : false },
            { name: "Quant Ace", unlocked: twin.assessment.lastQuantScore >= 80 },
            { name: "DSA Decimator", unlocked: twin.assessment.lastDsaScore >= 80 },
            { name: "Verifier", unlocked: twin.skills.filter((s) => s.status === "VERIFIED").length >= 3 },
            { name: "Streak Keeper", unlocked: twin.streak >= 3 },
          ].map((b) => (
            <span key={b.name} className={clsx("chip", b.unlocked ? "bg-amber-50 text-amber-800" : "bg-ink-50 text-ink-400")}>
              <Star className="size-3" /> {b.name}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}

function Hud({ label, value, sub, pct, icon }: { label: string; value: string; sub: string; pct: number; icon?: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between text-xs uppercase tracking-wider text-ink-400">
        <span>{label}</span>
        {icon}
      </div>
      <div className="mt-1 text-3xl font-bold">{value}</div>
      <div className="text-xs text-ink-700">{sub}</div>
      <div className="mt-2 h-2 rounded-full bg-ink-100">
        <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500" style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
}