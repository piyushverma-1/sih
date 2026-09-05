"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Building2, MapPin, Wallet, Clock, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ArrowLeft, Plus
} from "lucide-react";
import { useCareerTwin, ALL_INTERNSHIPS } from "@/lib/store-z";
import { eligibilityFor } from "@/lib/career-engine";
import { TARGET_ROLE_BY_ID } from "@/types/student";
import { SKILL_BY_ID } from "@/lib/sample-data";
import clsx from "clsx";

export default function InternshipDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const twin = useCareerTwin((s) => s.twin);
  const addApplication = useCareerTwin((s) => s.addApplication);
  const applied = twin.applications.some((a) => a.internshipId === id);
  const internship = ALL_INTERNSHIPS.find((i) => i.id === id);

  const eligibility = useMemo(() => {
    if (!internship) return null;
    const targetRole = TARGET_ROLE_BY_ID[internship.id.split("-")[0] === "fs" ? "fullstack" : internship.id.split("-")[0] === "ds" ? "data-scientist" : "fullstack"];
    return { ...eligibilityFor(targetRole, twin), role: targetRole };
  }, [internship, twin]);

  if (!internship || !eligibility) {
    return <div className="card p-6">Internship not found. <Link href="/student/internships" className="text-brand-600">Back</Link></div>;
  }

  const matched = internship.requiredSkillIds.filter((sid) => twin.resume?.detectedSkillIds.includes(sid));
  const missing = internship.requiredSkillIds.filter((sid) => !twin.resume?.detectedSkillIds.includes(sid));
  const passesFixed = eligibility.passesFixed;

  return (
    <main className="space-y-6">
      <header className="card p-6 sm:p-8">
        <Link href="/student/internships" className="text-xs text-ink-700 inline-flex items-center gap-1 hover:text-ink-900"><ArrowLeft className="size-3" /> Back</Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{internship.title}</h1>
            <div className="text-sm text-ink-700 flex flex-wrap items-center gap-3 mt-1">
              <span className="inline-flex items-center gap-1"><Building2 className="size-3" /> {internship.company}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {internship.location}</span>
              <span className="inline-flex items-center gap-1"><Wallet className="size-3" /> {internship.stipend}</span>
              <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {internship.durationWeeks} weeks</span>
            </div>
          </div>
          <button
            disabled={!passesFixed || applied}
            onClick={() => addApplication(internship.id)}
            className={clsx("btn-primary", (!passesFixed || applied) && "opacity-50 cursor-not-allowed")}
          >
            {applied ? "Applied" : passesFixed ? "One-click apply" : "Not eligible yet"}
          </button>
        </div>
      </header>

      <section className="card p-6">
        <h2 className="font-semibold">About the role</h2>
        <p className="mt-2 text-sm text-ink-700">{internship.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {internship.requiredSkillIds.map((id) => (
            <span key={id} className={clsx("chip", matched.includes(id) ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
              {matched.includes(id) ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />} {SKILL_BY_ID.get(id)?.name ?? id}
            </span>
          ))}
        </div>
        {missing.length > 0 && (
          <div className="mt-3 text-xs text-ink-700">Missing: {missing.map((id) => SKILL_BY_ID.get(id)?.name ?? id).join(", ")}</div>
        )}
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="font-semibold flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600" /> Fixed criteria (Pass/Fail)</div>
          <ul className="mt-3 space-y-2 text-sm">
            <Row label="CGPA" pass={(twin.profile?.cgpa ?? 0) >= internship.fixedCriteria.minCgpa} value={`Min ${internship.fixedCriteria.minCgpa} · You ${twin.profile?.cgpa ?? "—"}`} />
            <Row label="Branch" pass={internship.fixedCriteria.branch.includes(twin.profile?.branch ?? "") || internship.fixedCriteria.branch.includes("Any")} value={`Required ${internship.fixedCriteria.branch.join("/")} · You ${twin.profile?.branch ?? "—"}`} />
            <Row label="Grad year" pass={internship.fixedCriteria.gradYear.includes(twin.profile?.gradYear ?? 0)} value={`Required ${internship.fixedCriteria.gradYear.join("/")} · You ${twin.profile?.gradYear ?? "—"}`} />
          </ul>
        </div>
        <div className="card p-5">
          <div className="font-semibold flex items-center gap-2"><AlertTriangle className="size-4 text-amber-600" /> Improvable criteria</div>
          <ul className="mt-3 space-y-2 text-sm">
            {internship.improvableCriteria.map((c) => (
              <li key={c} className="flex items-start gap-2">
                <ArrowRight className="size-3 mt-1 text-amber-600" />
                <span>{c}</span>
                <Link href="/student/roadmap" className="ml-auto text-xs text-brand-700 hover:underline">Open quest</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

function Row({ label, pass, value }: { label: string; pass: boolean; value: string }) {
  return (
    <li className="flex items-center justify-between gap-2">
      <div>
        <div className="text-xs text-ink-400">{label}</div>
        <div className="text-ink-700">{value}</div>
      </div>
      <span className={clsx("chip", pass ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
        {pass ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />} {pass ? "Pass" : "Fail"}
      </span>
    </li>
  );
}