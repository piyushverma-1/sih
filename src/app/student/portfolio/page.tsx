"use client";

import { useState } from "react";
import {
  IdCard, Download, Share2, Mail, Github, Linkedin, ExternalLink, Globe,
  CheckCircle2, Sparkles, Eye, EyeOff
} from "lucide-react";
import { useCareerTwin } from "@/lib/store-z";
import { SKILL_BY_ID } from "@/lib/sample-data";
import clsx from "clsx";

export default function PortfolioPage() {
  const twin = useCareerTwin((s) => s.twin);
  const setPublic = useCareerTwin((s) => s.setPortfolioPublic);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const verified = twin.skills.filter((s) => s.status === "VERIFIED");

  function downloadPDF() {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(portfolioHtml());
    win.document.close();
    setTimeout(() => win.print(), 400);
  }

  function shareLink() {
    const slug = (twin.profile?.name ?? "student").toLowerCase().replace(/\s+/g, "-");
    const url = `${location.origin}/p/${slug}`;
    setShareUrl(url);
    navigator.clipboard?.writeText(url).catch(() => {});
  }

  return (
    <main className="space-y-6">
      <header className="card p-6 sm:p-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="chip"><IdCard className="size-3" /> Digital Portfolio</span>
          <h1 className="mt-2 text-2xl font-bold">{twin.profile?.name ?? "Your Portfolio"}</h1>
          <p className="text-sm text-ink-700">{twin.targetRoleIds.map((id) => id).join(" · ") || "Target roles will appear here"}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={() => setPublic(!twin.portfolioPublic)}>
            {twin.portfolioPublic ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            {twin.portfolioPublic ? "Public" : "Private"}
          </button>
          <button className="btn-ghost" onClick={shareLink}><Share2 className="size-4" /> Share link</button>
          <button className="btn-primary" onClick={downloadPDF}><Download className="size-4" /> Download PDF</button>
        </div>
      </header>

      {shareUrl && (
        <div className="card p-3 text-xs text-ink-700">
          Shareable link copied: <span className="font-mono text-brand-700">{shareUrl}</span>
        </div>
      )}

      <section className="grid md:grid-cols-3 gap-4">
        <div className="card p-5 flex items-center gap-3">
          <div className="size-16 rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 grid place-items-center text-white text-2xl font-bold">
            {(twin.profile?.name ?? "S").slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold">{twin.profile?.name ?? "Add your name"}</div>
            <div className="text-xs text-ink-700">{twin.profile?.email ?? "—"}</div>
            <div className="text-xs text-ink-700">{twin.profile?.college ?? "—"}</div>
          </div>
        </div>
        <div className="card p-5">
          <div className="text-xs uppercase tracking-wider text-ink-400">JRI</div>
          <div className="text-3xl font-bold mt-1">{twin.jri.totalJRI}</div>
          <div className="text-xs text-ink-700">{twin.jri.band}</div>
        </div>
        <div className="card p-5">
          <div className="text-xs uppercase tracking-wider text-ink-400">Contact</div>
          <ul className="mt-2 text-sm space-y-1">
            {twin.profile?.linkedin && <li className="flex items-center gap-2"><Linkedin className="size-4" /> <a className="text-brand-700 hover:underline" href={twin.profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>}
            {twin.profile?.github && <li className="flex items-center gap-2"><Github className="size-4" /> <a className="text-brand-700 hover:underline" href={twin.profile.github} target="_blank" rel="noreferrer">GitHub</a></li>}
            {twin.profile?.portfolio && <li className="flex items-center gap-2"><Globe className="size-4" /> <a className="text-brand-700 hover:underline" href={twin.profile.portfolio} target="_blank" rel="noreferrer">Portfolio</a></li>}
            {twin.profile?.email && <li className="flex items-center gap-2"><Mail className="size-4" /> {twin.profile.email}</li>}
          </ul>
        </div>
      </section>

      <section className="card p-6">
        <div className="font-semibold flex items-center gap-2"><Sparkles className="size-4 text-brand-600" /> Verified skills</div>
        {verified.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {verified.map((s) => (
              <span key={s.skillId} className="chip bg-emerald-50 text-emerald-800">
                <CheckCircle2 className="size-3" /> {s.skillName}
                <span className="ml-1 text-[9px] uppercase tracking-wider">Verified by {Array.from(new Set(s.sources.map((x) => x))).join("+")}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-ink-700">No verified skills yet. Take the assessment or add more projects to verify skills.</p>
        )}
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="font-semibold">Academic timeline</div>
          <ul className="mt-3 space-y-2 text-sm">
            {(twin.resume?.education ?? []).map((e, i) => (
              <li key={i}>
                <div className="font-medium">{e.institution}</div>
                <div className="text-xs text-ink-700">{e.degree ?? "Degree"}{e.field ? " · " + e.field : ""}{e.endYear ? " · " + e.endYear : ""}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <div className="font-semibold">Featured projects</div>
          <ul className="mt-3 space-y-2 text-sm">
            {(twin.resume?.projects ?? []).map((p, i) => (
              <li key={i}>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-ink-700 line-clamp-2">{p.description}</div>
                {p.tech.length ? <div className="text-[10px] text-ink-400">{p.tech.join(" · ")}</div> : null}
              </li>
            ))}
            {!twin.resume?.projects?.length && <li className="text-ink-400">Add projects in your resume.</li>}
          </ul>
        </div>
      </section>
    </main>
  );
}

function portfolioHtml(): string {
  const t = useCareerTwin.getState().twin;
  const verified = t.skills.filter((s) => s.status === "VERIFIED");
  return `<!doctype html><html><head><meta charset="utf-8"/><title>${t.profile?.name ?? "Portfolio"}</title>
  <style>
    body{font-family:Inter,system-ui,sans-serif;padding:32px;color:#0f1530;}
    h1{font-size:28px;margin:0}
    h2{font-size:18px;margin:24px 0 8px;border-bottom:1px solid #d4d8e6;padding-bottom:4px}
    .chip{display:inline-block;border-radius:999px;padding:4px 10px;margin:2px;background:#eef4ff;color:#1d2dd6;font-size:12px}
    .row{display:flex;gap:8px;flex-wrap:wrap}
  </style></head><body>
  <h1>${t.profile?.name ?? "Your Name"}</h1>
  <div>${t.profile?.email ?? ""} · ${t.profile?.college ?? ""} · CGPA ${t.profile?.cgpa ?? ""} · ${t.profile?.branch ?? ""} · ${t.profile?.gradYear ?? ""}</div>
  <h2>Verified Skills</h2>
  <div class="row">${verified.map((s) => `<span class="chip">${s.skillName} (${s.sources.join("+")})</span>`).join("")}</div>
  <h2>Education</h2>
  ${(t.resume?.education ?? []).map((e) => `<div><b>${e.institution}</b> — ${e.degree ?? ""} ${e.field ?? ""} ${e.endYear ?? ""}</div>`).join("")}
  <h2>Projects</h2>
  ${(t.resume?.projects ?? []).map((p) => `<div><b>${p.name}</b> — ${p.description}<br/><i>${p.tech.join(", ")}</i></div>`).join("")}
  <h2>Experience</h2>
  ${(t.resume?.experience ?? []).map((e) => `<div><b>${e.role ?? e.company}</b> — ${e.company} ${e.duration ?? ""}<ul>${e.bullets.map((b) => `<li>${b}</li>`).join("")}</ul></div>`).join("")}
  <h2>Contact</h2>
  <div>${(t.profile?.linkedin ?? "")} · ${(t.profile?.github ?? "")} · ${(t.profile?.portfolio ?? "")}</div>
  <script>setTimeout(()=>window.print(),300)</script>
  </body></html>`;
}