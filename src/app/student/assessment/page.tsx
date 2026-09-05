"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Brain, ChevronLeft, ChevronRight, Flag, Eraser, CheckCircle2,
  AlertTriangle, Clock, BookOpenCheck
} from "lucide-react";
import { useCareerTwin } from "@/lib/store-z";
import { QUESTION_BANK, SKILL_TO_QUESTION } from "@/mock/questions";
import type { AssessmentQuestion, QuestionSection } from "@/types/student";
import clsx from "clsx";

const SECTIONS: { key: QuestionSection; label: string }[] = [
  { key: "tech", label: "Technical" },
  { key: "dsa", label: "DSA" },
  { key: "verbal", label: "Verbal" },
  { key: "quant", label: "Quantitative" },
];

type Status = "unanswered" | "answered" | "marked" | "current";

const DURATION_SEC = 90 * 60;

export default function AssessmentPage() {
  const router = useRouter();
  const recordAssessment = useCareerTwin((s) => s.recordAssessment);
  const promoteSkill = useCareerTwin((s) => s.promoteSkill);
  const setSkills = useCareerTwin((s) => s.setSkills);
  const twin = useCareerTwin((s) => s.twin);
  const [order] = useState<AssessmentQuestion[]>(() => shuffle([...QUESTION_BANK]));
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState(0);
  const [section, setSection] = useState<QuestionSection>("tech");
  const [secondsLeft, setSecondsLeft] = useState(DURATION_SEC);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const sectionQuestions = useMemo(
    () => order.filter((q) => q.section === section),
    [order, section]
  );

  useEffect(() => {
    const idx = order.findIndex((q) => q.section === section);
    if (idx >= 0) setCurrent(idx);
  }, [section, order]);

  const currentQ = order[current];
  if (!currentQ) return null;

  function pick(i: number) {
    setAnswers((a) => ({ ...a, [currentQ.id]: i }));
  }
  function next() { if (current < order.length - 1) setCurrent(current + 1); }
  function prev() { if (current > 0) setCurrent(current - 1); }
  function mark() {
    const next = new Set(marked);
    if (next.has(currentQ.id)) next.delete(currentQ.id); else next.add(currentQ.id);
    setMarked(next);
  }
  function clearResponse() {
    setAnswers((a) => {
      const c = { ...a };
      delete c[currentQ.id];
      return c;
    });
  }

  function submit() {
    const total = order.length;
    let correct = 0;
    const techQ = order.filter((q) => q.section === "tech");
    const dsaQ = order.filter((q) => q.section === "dsa");
    const verQ = order.filter((q) => q.section === "verbal");
    const qaQ = order.filter((q) => q.section === "quant");
    const count = (arr: AssessmentQuestion[]) =>
      arr.filter((q) => answers[q.id] === q.answerKey).length;
    const techC = count(techQ);
    const dsaC = count(dsaQ);
    const verC = count(verQ);
    const qaC = count(qaQ);
    correct = techC + dsaC + verC + qaC;

    const score = Math.round((correct / total) * 100);
    const tech = techQ.length ? Math.round((techC / techQ.length) * 100) : 0;
    const dsa = dsaQ.length ? Math.round((dsaC / dsaQ.length) * 100) : 0;
    const verbal = verQ.length ? Math.round((verC / verQ.length) * 100) : 0;
    const quant = qaQ.length ? Math.round((qaC / qaQ.length) * 100) : 0;

    recordAssessment({ score, tech, verbal, quant, dsa });

    const upgraded = twin.skills.map((s) => {
      const taggedQs = SKILL_TO_QUESTION[s.skillId] ?? [];
      const relevant = order.filter((q) => taggedQs.includes(q.id));
      if (!relevant.length) return s;
      const correctCount = relevant.filter((q) => answers[q.id] === q.answerKey).length;
      const pct = Math.round((correctCount / relevant.length) * 100);
      if (pct >= 80) {
        return { ...s, status: "VERIFIED" as const, confidence: 0.9, sources: Array.from(new Set([...s.sources, "ASSESSMENT" as const])) };
      }
      return s;
    });
    setSkills(upgraded);

    sessionStorage.setItem("assessment:last", JSON.stringify({ score, tech, dsa, verbal, quant, total, answered: Object.keys(answers).length, correct }));
    router.push("/student/assessment/result");
  }

  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / order.length) * 100);
  const unanswered = order.length - answeredCount;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <main className="space-y-4">
      <header className="card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Brain className="size-5 text-brand-600" />
          <h1 className="font-semibold">Adaptive Assessment · {order.length} questions</h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="chip bg-ink-50 text-ink-700">{answeredCount}/{order.length} answered · {progressPct}%</div>
          <div className="chip bg-rose-50 text-rose-700 flex items-center gap-1"><Clock className="size-3" /> {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={clsx(
              "rounded-full px-3 py-1 text-xs border",
              section === s.key ? "bg-brand-600 text-white border-brand-600" : "bg-white text-ink-700 border-ink-200 hover:bg-ink-50"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 card p-6 space-y-4">
          <div className="text-xs uppercase tracking-wider text-ink-400">Question {current + 1} of {order.length} · {currentQ.section.toUpperCase()}</div>
          <div className="text-base font-medium whitespace-pre-wrap">{currentQ.questionText}</div>
          {currentQ.codeSnippet && (
            <pre className="rounded-xl bg-ink-900 text-ink-50 p-3 text-xs overflow-x-auto"><code>{currentQ.codeSnippet}</code></pre>
          )}
          <div className="space-y-2">
            {currentQ.options.map((opt, i) => {
              const picked = answers[currentQ.id] === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(i)}
                  className={clsx(
                    "w-full text-left rounded-xl border-2 px-4 py-2 text-sm transition",
                    picked ? "border-brand-500 bg-brand-50" : "border-ink-200 hover:bg-white"
                  )}
                >
                  <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-ink-100">
            <div className="flex gap-2">
              <button className="btn-ghost" onClick={prev}><ChevronLeft className="size-4" /> Previous</button>
              <button className="btn-ghost" onClick={next}>Next <ChevronRight className="size-4" /></button>
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost" onClick={mark}><Flag className={"size-4 " + (marked.has(currentQ.id) ? "text-amber-600" : "")} /> {marked.has(currentQ.id) ? "Unmark" : "Mark for review"}</button>
              <button className="btn-ghost" onClick={clearResponse}><Eraser className="size-4" /> Clear</button>
              <button className="btn-primary" onClick={() => setConfirmSubmit(true)}><BookOpenCheck className="size-4" /> Submit</button>
            </div>
          </div>
        </section>

        <aside className="card p-4">
          <div className="text-sm font-semibold mb-2">Question palette</div>
          <div className="grid grid-cols-8 gap-1.5">
            {sectionQuestions.map((q) => {
              const isCurrent = q.id === currentQ.id;
              const status: Status = isCurrent
                ? "current"
                : answers[q.id] !== undefined
                  ? "answered"
                  : marked.has(q.id)
                    ? "marked"
                    : "unanswered";
              const idx = order.findIndex((x) => x.id === q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrent(idx)}
                  className={clsx(
                    "size-8 rounded-md text-xs font-semibold border",
                    status === "current" && "bg-brand-600 text-white border-brand-600",
                    status === "answered" && "bg-emerald-100 text-emerald-800 border-emerald-200",
                    status === "marked" && "bg-purple-100 text-purple-800 border-purple-200",
                    status === "unanswered" && "bg-white text-ink-700 border-ink-200"
                  )}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-ink-700">
            <Legend swatch="bg-emerald-100 border-emerald-200" label="Answered" />
            <Legend swatch="bg-purple-100 border-purple-200" label="Marked" />
            <Legend swatch="bg-white border-ink-200" label="Unanswered" />
            <Legend swatch="bg-brand-600 border-brand-600" label="Current" />
          </div>
          <div className="mt-4 text-xs text-ink-700">
            {unanswered} unanswered. {marked.size} marked for review.
          </div>
        </aside>
      </div>

      {confirmSubmit && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="card p-6 max-w-md w-full">
            <div className="flex items-center gap-2 font-semibold"><AlertTriangle className="size-4 text-amber-600" /> Submit assessment?</div>
            <p className="mt-2 text-sm text-ink-700">You have {unanswered} unanswered question{unanswered === 1 ? "" : "s"} and {marked.size} marked for review.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setConfirmSubmit(false)}>Keep going</button>
              <button className="btn-primary" onClick={submit}><CheckCircle2 className="size-4" /> Submit</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={"inline-block size-3 rounded border " + swatch} />
      {label}
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}