import Link from "next/link";
import {
  UploadCloud,
  GaugeCircle,
  Layers3,
  Timer,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function Home() {
  const steps = [
    {
      icon: <UploadCloud className="size-5" />,
      title: "Upload Resume",
      desc: "Drag-and-drop your PDF/DOCX. We parse it just like an enterprise ATS would."
    },
    {
      icon: <GaugeCircle className="size-5" />,
      title: "ATS Score + Skill Gap",
      desc: "See your match against real internships and discover what's missing."
    },
    {
      icon: <Layers3 className="size-5" />,
      title: "Pick Your Stack",
      desc: "Choose up to two domains — Web, App, Data, Java, Python, UI/UX."
    },
    {
      icon: <Timer className="size-5" />,
      title: "Adaptive Assessment",
      desc: "Timed aptitude + domain MCQs that auto-update your Job Readiness Index."
    }
  ];

  return (
    <main className="space-y-14">
      <section className="card relative overflow-hidden p-8 sm:p-12">
        <div className="absolute -top-20 -right-20 size-72 bg-brand-200/40 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -left-24 size-72 bg-fuchsia-200/40 blur-3xl rounded-full" />
        <div className="relative max-w-3xl">
          <span className="chip">
            <Sparkles className="size-3" /> Smart India Hackathon Prototype
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">
            Bridge the gap between <span className="text-brand-600">students</span> and{" "}
            <span className="text-brand-600">internships</span>.
          </h1>
          <p className="mt-4 text-ink-700 text-lg">
            SkillBridge parses your resume like a real ATS, scores it, shows exactly which skills
            you&apos;re missing for target internships, and lets you validate them with an adaptive,
            gamified test — all in one flow.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/auth/signup" className="btn-primary">
              Start with your resume <ArrowRight className="size-4" />
            </Link>
            <Link href="/student/dashboard" className="btn-ghost">
              View sample dashboard
            </Link>
          </div>
          <ul className="mt-6 grid sm:grid-cols-2 gap-2 text-sm text-ink-700">
            {[
              "Real ATS-style parsing & scoring",
              "Semantic skill matching",
              "Adaptive, timed assessments",
              "Instant Job Readiness Index updates"
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-brand-600" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">How it works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={s.title} className="card p-5">
              <div className="size-9 rounded-xl bg-brand-50 text-brand-700 grid place-items-center">
                {s.icon}
              </div>
              <div className="mt-3 text-xs uppercase tracking-wider text-ink-400">
                Step {i + 1}
              </div>
              <div className="mt-1 font-semibold">{s.title}</div>
              <p className="mt-1 text-sm text-ink-700">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}