"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, LogIn } from "lucide-react";
import { useCareerTwin } from "@/lib/store-z";

export default function LoginPage() {
  const router = useRouter();
  const setProfile = useCareerTwin((s) => s.setProfile);
  const twin = useCareerTwin((s) => s.twin);
  const [email, setEmail] = useState(twin.profile?.email ?? "");
  const [password, setPassword] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    if (!twin.profile) {
      setProfile({
        name: email.split("@")[0],
        email,
        college: "IIT Roorkee",
        branch: "CSE",
        cgpa: 7.5,
        gradYear: 2027,
      });
    } else if (!twin.profile.email) {
      setProfile({ ...twin.profile, email });
    }
    router.push(twin.targetRoleIds.length ? "/student/dashboard" : "/onboarding");
  }

  return (
    <main className="max-w-md mx-auto">
      <section className="card p-8 space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-5 text-brand-600" />
          <h1 className="text-xl font-semibold">Welcome back</h1>
        </div>
        <p className="text-sm text-ink-700">Sign in with your academic email.</p>
        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm"
            placeholder="you@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <input
            className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <button className="btn-primary w-full">
            <LogIn className="size-4" /> Sign in
          </button>
        </form>
        <div className="text-sm text-ink-700 text-center">
          New here?{" "}
          <Link href="/auth/signup" className="text-brand-600">
            Create an account <ArrowRight className="inline size-3" />
          </Link>
        </div>
      </section>
    </main>
  );
}