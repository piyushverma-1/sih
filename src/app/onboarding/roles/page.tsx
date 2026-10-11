"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, AlertTriangle, Briefcase, CheckCircle2 } from "lucide-react";
import { useCareerTwin } from "@/lib/store-z";
import { TARGET_ROLES, type TargetRoleId } from "@/types/student";
import clsx from "clsx";

export default function OnboardingRolesPage() {
  const router = useRouter();
  const twin = useCareerTwin((s) => s.twin);
  const setTargetRoles = useCareerTwin((s) => s.setTargetRoles);
  const [picked, setPicked] = useState<TargetRoleId[]>(twin.targetRoleIds);
  const [warn, setWarn] = useState(false);

  function toggle(id: TargetRoleId) {
    setWarn(false);
    setPicked((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id);
      if (p.length >= 2) {
        setWarn(true);
        return p;
      }
      return [...p, id];
    });
  }

  return (
    <section className="card p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Pick up to 2 target roles</h2>
        <p className="text-sm text-ink-700">Your Career Twin personalises JRI and gap analysis around these.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {TARGET_ROLES.map((r) => {
          const active = picked.includes(r.id);
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => toggle(r.id)}
              className={clsx(
                "rounded-2xl border-2 p-4 text-left transition flex items-center justify-between gap-3",
                active ? "border-brand-500 bg-brand-50" : "border-ink-200 hover:bg-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="size-5 text-brand-600" />
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-ink-700">{r.requiredSkills.length} key skills</div>
                </div>
              </div>
              {active ? <CheckCircle2 className="size-5 text-brand-600" /> : null}
            </button>
          );
        })}
      </div>

      {warn && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 px-4 py-2 text-sm flex items-center gap-2">
          <AlertTriangle className="size-4" /> You can only pick 2 target roles. Deselect one to swap.
        </div>
      )}

      <div className="flex justify-between">
        <button className="btn-ghost" onClick={() => router.push("/onboarding/interests")}>
          <ArrowLeft className="size-4" /> Back
        </button>
        <button
          className="btn-primary"
          disabled={!picked.length}
          onClick={() => {
            setTargetRoles(picked);
            router.push("/onboarding/resume");
          }}
        >
          Continue <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  );
}