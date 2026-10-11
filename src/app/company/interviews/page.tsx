"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Plus, Clock, Video, MapPin, CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { useCompanyStore } from "@/lib/store-company";
import type { Interview, InterviewFeedback, InterviewStatus } from "@/types/company";
import clsx from "clsx";

export default function InterviewsPage() {
  const interviews = useCompanyStore((s) => s.interviews);
  const upsert = useCompanyStore((s) => s.upsertInterview);
  const updateStatus = useCompanyStore((s) => s.updateInterviewStatus);
  const saveFeedback = useCompanyStore((s) => s.saveInterviewFeedback);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);

  const upcoming = useMemo(() => interviews.filter((i) => i.status === "SCHEDULED"), [interviews]);
  const completed = useMemo(() => interviews.filter((i) => i.status === "COMPLETED"), [interviews]);

  return (
    <main className="space-y-6">
      <header className="card p-6 flex items-end justify-between gap-3">
        <div>
          <span className="chip"><CalendarClock className="size-3" /> Interviews</span>
          <h1 className="mt-2 text-2xl font-bold">Interview management</h1>
          <p className="text-sm text-ink-700">{upcoming.length} upcoming · {completed.length} completed</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingId(null); setOpen(true); }}>
          <Plus className="size-4" /> Schedule interview
        </button>
      </header>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold">Upcoming</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {upcoming.map((int) => (
              <li key={int.id} className="rounded-xl border border-ink-100 p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{int.candidateName}</div>
                  <span className="chip bg-brand-50 text-brand-700 text-[10px]">{int.round}/{int.totalRounds}</span>
                </div>
                <div className="text-xs text-ink-700 mt-1 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1"><CalendarClock className="size-3" /> {int.date} {int.time}</span>
                  <span className="inline-flex items-center gap-1">{int.type === "ONLINE" ? <Video className="size-3" /> : <MapPin className="size-3" />} {int.type}</span>
                </div>
                <div className="text-xs text-ink-500 mt-1">Interviewer: {int.interviewerName}</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => { updateStatus(int.id, "COMPLETED"); setFeedbackId(int.id); }} className="text-[10px] rounded-md bg-emerald-50 text-emerald-700 px-2 py-1">Mark complete</button>
                  <button onClick={() => updateStatus(int.id, "CANCELLED")} className="text-[10px] rounded-md bg-rose-50 text-rose-700 px-2 py-1">Cancel</button>
                </div>
              </li>
            ))}
            {!upcoming.length && <li className="text-xs text-ink-400">No upcoming interviews.</li>}
          </ul>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold">Completed</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {completed.map((int) => (
              <li key={int.id} className="rounded-xl border border-ink-100 p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{int.candidateName}</div>
                  <span className="chip bg-emerald-50 text-emerald-700 text-[10px]">Completed</span>
                </div>
                {int.feedback && (
                  <div className="mt-2 text-xs text-ink-700 space-y-1">
                    <div>Technical: {int.feedback.technicalKnowledge}/10 · Communication: {int.feedback.communication}/10</div>
                    <div>Problem Solving: {int.feedback.problemSolving}/10 · Domain: {int.feedback.domainKnowledge}/10</div>
                    <div>Culture Fit: {int.feedback.cultureFit}/10 · Overall: {int.feedback.overall}/10</div>
                    <div>Recommendation: {int.feedback.recommendation}</div>
                  </div>
                )}
              </li>
            ))}
            {!completed.length && <li className="text-xs text-ink-400">No completed interviews.</li>}
          </ul>
        </div>
      </section>

      {open && (
        <InterviewWizard
          interviewId={editingId}
          onClose={() => { setOpen(false); setEditingId(null); }}
          onSave={(interview) => { upsert(interview); setOpen(false); setEditingId(null); }}
        />
      )}

      {feedbackId && (
        <FeedbackModal
          interviewId={feedbackId}
          onClose={() => setFeedbackId(null)}
          onSave={(feedback) => { saveFeedback(feedbackId, feedback); setFeedbackId(null); }}
        />
      )}
    </main>
  );
}

function InterviewWizard({ interviewId, onClose, onSave }: { interviewId: string | null; onClose: () => void; onSave: (i: Interview) => void }) {
  const interviews = useCompanyStore((s) => s.interviews);
  const existing = interviewId ? interviews.find((i) => i.id === interviewId) : null;
  const [form, setForm] = useState<Partial<Interview>>(() => existing ? { ...existing } : {
    applicationId: "",
    opportunityId: "",
    candidateName: "",
    interviewerName: "",
    date: "",
    time: "",
    type: "ONLINE",
    round: 1,
    totalRounds: 2,
    status: "SCHEDULED",
    notes: "",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit() {
    const interview: Interview = {
      ...(form as Interview),
      id: interviewId ?? `int_${Date.now()}`,
    };
    onSave(interview);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="card p-6 max-w-md w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{existing ? "Edit" : "Schedule"} interview</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="mt-4 space-y-3">
          <Field label="Candidate name"><input className="input" value={form.candidateName} onChange={(e) => update("candidateName", e.target.value)} /></Field>
          <Field label="Interviewer name"><input className="input" value={form.interviewerName} onChange={(e) => update("interviewerName", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><input type="date" className="input" value={form.date} onChange={(e) => update("date", e.target.value)} /></Field>
            <Field label="Time"><input type="time" className="input" value={form.time} onChange={(e) => update("time", e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <select className="input" value={form.type} onChange={(e) => update("type", e.target.value as Interview["type"])}>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
                <option value="OTHER">Other</option>
              </select>
            </Field>
            <Field label="Round">
              <input type="number" className="input" value={form.round} onChange={(e) => update("round", Number(e.target.value))} />
            </Field>
          </div>
          {form.type === "ONLINE" && (
            <Field label="Meeting link"><input className="input" value={form.meetingLink} onChange={(e) => update("meetingLink", e.target.value)} /></Field>
          )}
          <Field label="Notes"><textarea className="input" value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={3} /></Field>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit}>Save</button>
        </div>
        <style jsx>{`
          :global(.input) {
            @apply w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200;
          }
        `}</style>
      </div>
    </div>
  );
}

function FeedbackModal({ interviewId, onClose, onSave }: { interviewId: string; onClose: () => void; onSave: (f: InterviewFeedback) => void }) {
  const [form, setForm] = useState<InterviewFeedback>({
    technicalKnowledge: 0,
    communication: 0,
    problemSolving: 0,
    domainKnowledge: 0,
    cultureFit: 0,
    overall: 0,
    strengths: "",
    weaknesses: "",
    comments: "",
    recommendation: "HOLD",
  });

  function update<K extends keyof InterviewFeedback>(key: K, value: InterviewFeedback[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit() {
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="card p-6 max-w-lg w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Interview feedback</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            ["Technical Knowledge", "technicalKnowledge"],
            ["Communication", "communication"],
            ["Problem Solving", "problemSolving"],
            ["Domain Knowledge", "domainKnowledge"],
            ["Culture Fit", "cultureFit"],
            ["Overall", "overall"],
          ].map(([label, key]) => (
            <div key={key}>
              <label className="text-xs text-ink-700">{label} /10</label>
              <input
                type="range"
                min={0}
                max={10}
                className="w-full"
                value={form[key as keyof InterviewFeedback] as number}
                onChange={(e) => update(key as keyof InterviewFeedback, Number(e.target.value) as InterviewFeedback[keyof InterviewFeedback])}
              />
              <div className="text-right text-xs text-ink-700">{form[key as keyof InterviewFeedback] as number}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-3">
          <Field label="Strengths"><textarea className="input" value={form.strengths} onChange={(e) => update("strengths", e.target.value)} rows={2} /></Field>
          <Field label="Weaknesses"><textarea className="input" value={form.weaknesses} onChange={(e) => update("weaknesses", e.target.value)} rows={2} /></Field>
          <Field label="Comments"><textarea className="input" value={form.comments} onChange={(e) => update("comments", e.target.value)} rows={2} /></Field>
          <Field label="Recommendation">
            <select className="input" value={form.recommendation} onChange={(e) => update("recommendation", e.target.value as InterviewFeedback["recommendation"])}>
              <option value="REJECT">Reject</option>
              <option value="HOLD">Hold</option>
              <option value="RECOMMEND">Recommend</option>
            </select>
          </Field>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit}>Save feedback</button>
        </div>
        <style jsx>{`
          :global(.input) {
            @apply w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200;
          }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <div className="text-xs font-medium text-ink-700 mb-1">{label}</div>
      {children}
    </label>
  );
}
