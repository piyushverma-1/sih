"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, ArrowRight, LogIn } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";

export default function CompanyLoginPage() {
  const router = useRouter();
  const profile = useCompanyStore((s) => s.profile);
  const updateProfile = useCompanyStore((s) => s.updateProfile);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (!email.trim()) return setError("Email is required.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid company email.");
    
    // For demo: if email matches stored profile, log in
    // In production, this would verify password with backend
    if (profile.email && profile.email !== email) {
      setError("No account found with this email. Please sign up first.");
      return;
    }
    
    updateProfile({ email: email.trim() });
    router.push("/company/dashboard");
  }

  return (
    <main className="max-w-md mx-auto">
      <section className="card p-8 space-y-5">
        <div className="flex items-center gap-2">
          <Building2 className="size-5 text-brand-600" />
          <h1 className="text-xl font-semibold">Industry sign in</h1>
        </div>
        <p className="text-sm text-ink-700">Access your industry command center.</p>
        
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-ink-700 mb-1 block">Company email</label>
            <input
              className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm"
              placeholder="hr@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-700 mb-1 block">Password</label>
            <input
              className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>
          
          {error && <div className="rounded-lg bg-rose-50 text-rose-700 text-sm px-3 py-2">{error}</div>}
          
          <button className="btn-primary w-full">
            <LogIn className="size-4" /> Sign in
          </button>
        </form>
        
        <div className="text-sm text-ink-700 text-center">
          New company?{" "}
          <Link href="/auth/company-signup" className="text-brand-600">
            Create account <ArrowRight className="inline size-3" />
          </Link>
        </div>
        
        <div className="text-xs text-ink-400 text-center">
          Demo: Use any email to sign in, or create a new company account.
        </div>
      </section>
    </main>
  );
}
