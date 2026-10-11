"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ApplicationRecord,
  CareerTwin,
  JobReadinessIndex,
  Quest,
  SkillEvidence,
  SkillStatus,
  StudentProfile,
  TargetRoleId,
  AssessmentQuestion,
} from "@/types/student";
import type { GithubProfile, GithubRepository, SyncStatus } from "@/types/github";
import type { AtsResult, ParsedResume } from "@/lib/types";
import { INTERNSHIPS_FIXTURE } from "@/mock/internships";
import { TARGET_ROLE_BY_ID } from "@/types/student";

const emptyJri: JobReadinessIndex = {
  totalJRI: 0,
  resumeScore: 0,
  technicalScore: 0,
  assessmentScore: 0,
  projectScore: 0,
  certScore: 0,
  aptitudeScore: 0,
  projectedGains: [],
  band: "Beginner",
};

const initialTwin: CareerTwin = {
  profile: null,
  ats: null,
  resume: null,
  skills: [],
  targetRoleIds: [],
  interests: [],
  jri: emptyJri,
  assessment: {
    lastScore: 0,
    lastTechScore: 0,
    lastVerbalScore: 0,
    lastQuantScore: 0,
    lastDsaScore: 0,
  },
  xp: 0,
  level: 1,
  streak: 0,
  applications: [],
  portfolioPublic: false,
};

const initialGithub: {
  connected: boolean;
  githubProfile: GithubProfile | null;
  githubUsername: string | null;
  repositories: GithubRepository[];
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  error: string | null;
} = {
  connected: false,
  githubProfile: null,
  githubUsername: null,
  repositories: [],
  syncStatus: "idle",
  lastSyncedAt: null,
  error: null,
};

interface CareerTwinStore {
  twin: CareerTwin;
  setProfile: (profile: StudentProfile) => void;
  setInterests: (interests: string[]) => void;
  setTargetRoles: (ids: TargetRoleId[]) => void;
  setResume: (resume: ParsedResume, ats: AtsResult) => void;
  setSkills: (skills: SkillEvidence[]) => void;
  promoteSkill: (skillId: string, status: SkillStatus) => void;
  recordAssessment: (q: {
    score: number;
    tech: number;
    verbal: number;
    quant: number;
    dsa: number;
  }) => void;
  setJri: (jri: JobReadinessIndex) => void;
  addApplication: (internshipId: string) => void;
  moveApplication: (id: string, stage: ApplicationRecord["stage"]) => void;
  setApplicationNotes: (id: string, notes: string) => void;
  removeApplication: (id: string) => void;
  setPortfolioPublic: (v: boolean) => void;
  addXp: (xp: number) => void;
  reset: () => void;
  github: typeof initialGithub;
  setGithubProfile: (profile: GithubProfile | null) => void;
  setGithubRepositories: (repositories: GithubRepository[]) => void;
  setGithubSyncStatus: (status: SyncStatus) => void;
  setGithubError: (error: string | null) => void;
  setGithubConnected: (connected: boolean) => void;
  resetGithub: () => void;
}

export const useCareerTwin = create<CareerTwinStore>()(
  persist(
    (set) => ({
      twin: initialTwin,
      github: initialGithub,
      setProfile: (profile) => set((s) => ({ twin: { ...s.twin, profile } })),
      setInterests: (interests) => set((s) => ({ twin: { ...s.twin, interests } })),
      setTargetRoles: (ids) => set((s) => ({ twin: { ...s.twin, targetRoleIds: ids } })),
      setResume: (resume, ats) =>
        set((s) => ({
          twin: { ...s.twin, resume, ats: ats as unknown as CareerTwin["ats"] },
        })),
      setSkills: (skills) => set((s) => ({ twin: { ...s.twin, skills } })),
      promoteSkill: (skillId, status) =>
        set((s) => ({
          twin: {
            ...s.twin,
            skills: s.twin.skills.map((sk) =>
              sk.skillId === skillId
                ? { ...sk, status, confidence: status === "VERIFIED" ? 0.95 : 0.6 }
                : sk
            ),
          },
        })),
      recordAssessment: ({ score, tech, verbal, quant, dsa }) =>
        set((s) => ({
          twin: {
            ...s.twin,
            assessment: {
              lastScore: score,
              lastTechScore: tech,
              lastVerbalScore: verbal,
              lastQuantScore: quant,
              lastDsaScore: dsa,
              completedAt: new Date().toISOString(),
            },
            xp: s.twin.xp + 100,
            streak: s.twin.streak + 1,
            level: 1 + Math.floor((s.twin.xp + 100) / 500),
          },
        })),
      setJri: (jri) => set((s) => ({ twin: { ...s.twin, jri } })),
      addApplication: (internshipId) =>
        set((s) => {
          if (s.twin.applications.some((a) => a.internshipId === internshipId)) return s;
          const now = new Date().toISOString();
          const app: ApplicationRecord = {
            id: `app_${Date.now()}`,
            internshipId,
            stage: "Applied",
            appliedAt: now,
            history: [{ stage: "Applied", at: now }],
            notes: "",
          };
          return { twin: { ...s.twin, applications: [app, ...s.twin.applications] } };
        }),
      moveApplication: (id, stage) =>
        set((s) => ({
          twin: {
            ...s.twin,
            applications: s.twin.applications.map((a) =>
              a.id === id
                ? {
                    ...a,
                    stage,
                    history: [...a.history, { stage, at: new Date().toISOString() }],
                  }
                : a
            ),
          },
        })),
      setApplicationNotes: (id, notes) =>
        set((s) => ({
          twin: {
            ...s.twin,
            applications: s.twin.applications.map((a) =>
              a.id === id ? { ...a, notes } : a
            ),
          },
        })),
      removeApplication: (id) =>
        set((s) => ({
          twin: { ...s.twin, applications: s.twin.applications.filter((a) => a.id !== id) },
        })),
      setPortfolioPublic: (v) =>
        set((s) => ({ twin: { ...s.twin, portfolioPublic: v } })),
      addXp: (xp) =>
        set((s) => ({
          twin: {
            ...s.twin,
            xp: s.twin.xp + xp,
            level: 1 + Math.floor((s.twin.xp + xp) / 500),
          },
        })),
      reset: () => set({ twin: initialTwin, github: initialGithub }),
      setGithubProfile: (githubProfile) =>
        set((s) => ({
          github: {
            ...s.github,
            githubProfile,
            githubUsername: githubProfile?.username ?? null,
            connected: !!githubProfile,
            lastSyncedAt: githubProfile ? new Date().toISOString() : s.github.lastSyncedAt,
          },
        })),
      setGithubRepositories: (repositories) =>
        set((s) => ({
          github: { ...s.github, repositories },
        })),
      setGithubSyncStatus: (syncStatus) =>
        set((s) => ({
          github: { ...s.github, syncStatus },
        })),
      setGithubError: (error) =>
        set((s) => ({
          github: { ...s.github, error, syncStatus: error ? "error" : s.github.syncStatus },
        })),
      setGithubConnected: (connected) =>
        set((s) => ({
          github: { ...s.github, connected },
        })),
      resetGithub: () =>
        set((s) => ({
          github: initialGithub,
        })),
    }),
    {
      name: "skillbridge-twin",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function targetRoleSkills(ids: TargetRoleId[]): string[] {
  return Array.from(new Set(ids.flatMap((id) => TARGET_ROLE_BY_ID[id]?.requiredSkills.map((s) => s.skillId) ?? [])));
}

export function internshipById(id: string) {
  return INTERNSHIPS_FIXTURE.find((i) => i.id === id);
}

export const ALL_INTERNSHIPS = INTERNSHIPS_FIXTURE;

export type { AssessmentQuestion };
