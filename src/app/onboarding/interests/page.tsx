"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Code2, Database, Brain, Shield, Cloud, Smartphone, Palette } from "lucide-react";
import { useCareerTwin } from "@/lib/store-z";
import clsx from "clsx";

const INTERESTS = [
  { id: "web", label: "Web Development", icon: Code2 },
  { id: "app", label: "App Development", icon: Smartphone },
  { id: "data", label: "Data Science", icon: Database },
  { id: "java", label: "Java", icon: Code2 },
  { id: "python", label: "Python", icon: Code2 },
  { id: "uiux", label: "UI / UX Design", icon: Palette },
  { id: "ai-ml", label: "AI / ML", icon: Brain },
  { id: "cloud", label: "Cloud", icon: Cloud },
  { id: "cybersecurity", label: "Cybersecurity", icon: Shield },
  { id: "devops", label: "DevOps", icon: Cloud },
];

export default function OnboardingInterestsPage() {
  const router = useRouter();
  const twin = useCareerTwin((s) => s.twin);
  const setInterests = useCareerTwin((s) => s.setInterests);
  const [picked, setPicked] = useState<string[]>(twin.interests);

  function toggle(id: string) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  return (
    <section className="card p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Pick your interests</h2>
        <p className="text-sm text-ink-700">Choose the stacks you want to explore. You can refine later.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {INTERESTS.map((it) => {
          const active = picked.includes(it.id);
          const Icon = it.icon;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => toggle(it.id)}
              className={clsx(
                "rounded-2xl border-2 p-4 text-left transition flex items-center gap-3",
                active ? "border-brand-500 bg-brand-50" : "border-ink-200 hover:bg-white"
              )}
            >
              <div className={clsx("size-9 rounded-xl grid place-items-center", active ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-700")}>
                <Icon className="size-4" />
              </div>
              <div className="font-medium text-sm">{it.label}</div>
            </button>
          );
        })}
      </div>
      <div className="flex justify-between">
        <button className="btn-ghost" onClick={() => router.push("/onboarding/profile")}>
          <ArrowLeft className="size-4" /> Back
        </button>
        <button
          className="btn-primary"
          disabled={!picked.length}
          onClick={() => {
            setInterests(picked);
            router.push("/onboarding/roles");
          }}
        >
          Continue <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  );
}