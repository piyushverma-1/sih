export type Domain =
  | "web"
  | "app"
  | "data"
  | "java"
  | "python"
  | "uiux";

export const DOMAINS: Domain[] = [
  "web",
  "app",
  "data",
  "java",
  "python",
  "uiux",
];

export const DOMAIN_LABEL: Record<Domain, string> = {
  web: "Web Development",
  app: "App Development",
  data: "Data Science",
  java: "Java",
  python: "Python",
  uiux: "UI / UX Design",
};

export interface Skill {
  id: string;
  name: string;
  domain: Domain;
  weight: number;
  aliases?: string[];
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  domain: Domain;
  location: string;
  stipend: string;
  durationWeeks: number;
  description: string;
  requiredSkillIds: string[];
  niceToHaveSkillIds?: string[];
  postedAt: string;
  applicants: number;
}

export interface ParsedResume {
  name?: string;
  email?: string;
  phone?: string;
  links: string[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  rawSkills: string[];
  detectedSkillIds: string[];
  detectedDomains: Domain[];
  yearsOfExperience: number;
  wordCount: number;
  text: string;
}

export interface EducationEntry {
  institution: string;
  degree?: string;
  field?: string;
  startYear?: number;
  endYear?: number;
}

export interface ExperienceEntry {
  company: string;
  role?: string;
  duration?: string;
  bullets: string[];
}

export interface ProjectEntry {
  name: string;
  description: string;
  tech: string[];
}

export type AtsVerdict = "Poor" | "Fair" | "Good" | "Strong" | "Excellent";

export interface AtsBreakdown {
  formatting: number;
  contactInfo: number;
  skills: number;
  experience: number;
  education: number;
  projects: number;
  impact: number;
}

export interface AtsResult {
  overall: number;
  verdict: AtsVerdict;
  breakdown: AtsBreakdown;
  strengths: string[];
  improvements: string[];
  keywordHits: string[];
  keywordMisses: string[];
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  domain: Domain;
  status: "have" | "partial" | "missing";
  importance: number;
}

export interface MatchResult {
  internshipId: string;
  matchPct: number;
  matched: SkillGapItem[];
  missing: SkillGapItem[];
  partial: SkillGapItem[];
}

export interface JobReadinessIndex {
  score: number;
  band: "Beginner" | "Developing" | "Ready" | "Strong" | "Top Candidate";
  atsScore: number;
  skillCoverage: number;
  quizAccuracy: number;
  quizAttempts: number;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  domain: Domain;
  type: "aptitude" | "domain";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  difficulty: 1 | 2 | 3;
}

export interface QuizAttempt {
  id: string;
  domain: Domain;
  startedAt: string;
  completedAt?: string;
  answers: { questionId: string; selectedIndex: number; correct: boolean }[];
  score: number;
  totalQuestions: number;
  difficulty: 1 | 2 | 3;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  resume?: ParsedResume;
  ats?: AtsResult;
  selectedDomains: Domain[];
  jri: JobReadinessIndex;
  quizAttempts: QuizAttempt[];
  savedInternships: string[];
}

export type { StudentProfile, TargetRole, TargetRoleId, TargetSkillRequirement, SkillEvidence, SkillStatus, ATSAnalysis, AssessmentQuestion, JobReadinessIndex as NewJRI, InternshipOpportunity, ApplicationRecord, Quest, CareerTwin, QuestionType, QuestionSection } from "@/types/student";
