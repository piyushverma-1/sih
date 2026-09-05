"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCareerTwin } from "@/lib/store-z";

export default function OnboardingIndex() {
  const router = useRouter();
  const twin = useCareerTwin((s) => s.twin);

  useEffect(() => {
    if (!twin.profile) router.replace("/onboarding/profile");
    else if (!twin.interests.length) router.replace("/onboarding/interests");
    else if (!twin.targetRoleIds.length) router.replace("/onboarding/roles");
    else router.replace("/onboarding/resume");
  }, [router, twin]);

  return (
    <section className="card p-6 text-sm text-ink-700">
      Loading onboarding…
    </section>
  );
}