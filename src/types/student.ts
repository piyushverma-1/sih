export type TargetRoleId =
  | "fullstack"
  | "java-backend"
  | "python-dev"
  | "data-analyst"
  | "data-scientist"
  | "cybersecurity"
  | "cloud"
  | "devops"
  | "ai-ml"
  | "uiux";

export interface StudentProfile {
  name: string;
  email: string;
  dob?: string;
  college: string;
  branch: string;
  cgpa: number;
  gradYear: number;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  avatar?: string;
}

export interface TargetRole {
  id: TargetRoleId;
  title: string;
  requiredSkills: TargetSkillRequirement[];
  minCgpa: number;
  eligibleBranches: string[];
  eligibleGradYears: number[];
}

export interface TargetSkillRequirement {
  skillId: string;
  level: "High" | "Medium" | "Low";
  weight: number;
}

export type SkillStatus = "VERIFIED" | "PARTIAL" | "UNVERIFIED";

export interface SkillEvidence {
  skillId: string;
  skillName: string;
  status: SkillStatus;
  confidence: number;
  sources: Array<"RESUME" | "PROJECT" | "ASSESSMENT" | "SELF">;
  assessmentScore?: number;
}

export interface ATSAnalysis {
  score: number;
  keywordMatch: number;
  sectionCompleteness: number;
  formattingScore: number;
  experienceEvidence: number;
  quantificationScore: number;
  missingKeywords: string[];
  actionableFixes: Array<{ before: string; after: string }>;
  extracted: {
    academics: Array<{ institution: string; degree?: string; field?: string; year?: string }>;
    skills: string[];
    certifications: string[];
    projects: Array<{ name: string; description: string; tech: string[] }>;
  };
}

export type QuestionType = "mcq" | "code_output" | "debugging" | "dsa";
export type QuestionSection = "tech" | "verbal" | "quant" | "dsa";

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  section: QuestionSection;
  difficulty: 1 | 2 | 3;
  questionText: string;
  options: string[];
  answerKey: number;
  explanation?: string;
  skillTag?: string;
  codeSnippet?: string;
}

export interface JobReadinessIndex {
  totalJRI: number;
  resumeScore: number;
  technicalScore: number;
  assessmentScore: number;
  projectScore: number;
  certScore: number;
  aptitudeScore: number;
  projectedGains: Array<{ action: string; delta: number }>;
  band: "Beginner" | "Developing" | "Ready" | "Strong" | "Top Candidate";
}

export interface InternshipOpportunity {
  id: string;
  title: string;
  company: string;
  logoColor: string;
  location: string;
  stipend: string;
  durationWeeks: number;
  domain: string;
  description: string;
  requiredSkillIds: string[];
  niceToHaveSkillIds?: string[];
  fixedCriteria: {
    minCgpa: number;
    branch: string[];
    gradYear: number[];
  };
  improvableCriteria: string[];
  applicants: number;
  postedAt: string;
}

export interface ApplicationRecord {
  id: string;
  internshipId: string;
  stage: "Applied" | "Shortlisted" | "Online Assessment" | "Technical Interview" | "Selected" | "Rejected";
  appliedAt: string;
  nextDeadline?: string;
  history: Array<{ stage: ApplicationRecord["stage"]; at: string }>;
  notes: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xp: number;
  type: "resume" | "aptitude" | "skills" | "project" | "streak";
  target: number;
  progress: number;
  completed: boolean;
  badge?: string;
}

export interface CareerTwin {
  profile: StudentProfile | null;
  ats: import("../lib/types").AtsResult | null;
  resume: import("../lib/types").ParsedResume | null;
  skills: SkillEvidence[];
  targetRoleIds: TargetRoleId[];
  interests: string[];
  jri: JobReadinessIndex;
  assessment: {
    lastScore: number;
    lastTechScore: number;
    lastVerbalScore: number;
    lastQuantScore: number;
    lastDsaScore: number;
    completedAt?: string;
  };
  xp: number;
  level: number;
  streak: number;
  applications: ApplicationRecord[];
  portfolioPublic: boolean;
}

export const TARGET_ROLES: TargetRole[] = [
  {
    id: "fullstack",
    title: "Full-Stack Developer",
    requiredSkills: [
      { skillId: "html", level: "High", weight: 8 },
      { skillId: "css", level: "High", weight: 8 },
      { skillId: "js", level: "High", weight: 10 },
      { skillId: "ts", level: "Medium", weight: 7 },
      { skillId: "react", level: "High", weight: 10 },
      { skillId: "next", level: "High", weight: 9 },
      { skillId: "node", level: "High", weight: 9 },
      { skillId: "rest", level: "High", weight: 7 },
      { skillId: "sql", level: "High", weight: 8 },
    ],
    minCgpa: 6.5,
    eligibleBranches: ["CSE", "IT", "ECE", "EEE"],
    eligibleGradYears: [2026, 2027, 2028],
  },
  {
    id: "java-backend",
    title: "Java Backend Developer",
    requiredSkills: [
      { skillId: "java", level: "High", weight: 10 },
      { skillId: "spring", level: "High", weight: 9 },
      { skillId: "oop", level: "High", weight: 8 },
      { skillId: "sql", level: "High", weight: 8 },
      { skillId: "junit", level: "Medium", weight: 5 },
    ],
    minCgpa: 6.5,
    eligibleBranches: ["CSE", "IT"],
    eligibleGradYears: [2026, 2027, 2028],
  },
  {
    id: "python-dev",
    title: "Python Developer",
    requiredSkills: [
      { skillId: "python", level: "High", weight: 10 },
      { skillId: "pandas", level: "High", weight: 7 },
      { skillId: "numpy", level: "Medium", weight: 6 },
      { skillId: "sql", level: "Medium", weight: 6 },
    ],
    minCgpa: 6.0,
    eligibleBranches: ["CSE", "IT", "ECE", "EEE"],
    eligibleGradYears: [2026, 2027, 2028],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    requiredSkills: [
      { skillId: "sql", level: "High", weight: 9 },
      { skillId: "python", level: "High", weight: 8 },
      { skillId: "pandas", level: "High", weight: 8 },
      { skillId: "stats", level: "High", weight: 7 },
      { skillId: "tableau", level: "Medium", weight: 6 },
    ],
    minCgpa: 6.0,
    eligibleBranches: ["CSE", "IT", "ECE", "EEE"],
    eligibleGradYears: [2026, 2027, 2028],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    requiredSkills: [
      { skillId: "python", level: "High", weight: 10 },
      { skillId: "pandas", level: "High", weight: 8 },
      { skillId: "numpy", level: "High", weight: 7 },
      { skillId: "ml", level: "High", weight: 9 },
      { skillId: "sklearn", level: "High", weight: 7 },
      { skillId: "stats", level: "High", weight: 8 },
    ],
    minCgpa: 6.5,
    eligibleBranches: ["CSE", "IT"],
    eligibleGradYears: [2026, 2027, 2028],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Analyst",
    requiredSkills: [
      { skillId: "python", level: "Medium", weight: 6 },
      { skillId: "sql", level: "Medium", weight: 5 },
      { skillId: "node", level: "Medium", weight: 5 },
    ],
    minCgpa: 6.0,
    eligibleBranches: ["CSE", "IT"],
    eligibleGradYears: [2026, 2027, 2028],
  },
  {
    id: "cloud",
    title: "Cloud Engineer",
    requiredSkills: [
      { skillId: "node", level: "High", weight: 7 },
      { skillId: "sql", level: "Medium", weight: 6 },
      { skillId: "python", level: "Medium", weight: 6 },
    ],
    minCgpa: 6.0,
    eligibleBranches: ["CSE", "IT", "ECE"],
    eligibleGradYears: [2026, 2027, 2028],
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    requiredSkills: [
      { skillId: "node", level: "High", weight: 7 },
      { skillId: "python", level: "High", weight: 7 },
      { skillId: "sql", level: "Medium", weight: 5 },
    ],
    minCgpa: 6.0,
    eligibleBranches: ["CSE", "IT", "ECE"],
    eligibleGradYears: [2026, 2027, 2028],
  },
  {
    id: "ai-ml",
    title: "AI/ML Engineer",
    requiredSkills: [
      { skillId: "python", level: "High", weight: 10 },
      { skillId: "pandas", level: "High", weight: 7 },
      { skillId: "numpy", level: "High", weight: 7 },
      { skillId: "ml", level: "High", weight: 10 },
      { skillId: "sklearn", level: "High", weight: 7 },
      { skillId: "stats", level: "High", weight: 8 },
    ],
    minCgpa: 6.5,
    eligibleBranches: ["CSE", "IT"],
    eligibleGradYears: [2026, 2027, 2028],
  },
  {
    id: "uiux",
    title: "UI/UX Designer",
    requiredSkills: [
      { skillId: "figma", level: "High", weight: 9 },
      { skillId: "wireframe", level: "High", weight: 7 },
      { skillId: "ux-research", level: "High", weight: 7 },
      { skillId: "design-systems", level: "Medium", weight: 6 },
      { skillId: "prototyping", level: "High", weight: 7 },
    ],
    minCgpa: 5.5,
    eligibleBranches: ["CSE", "IT", "Design", "Any"],
    eligibleGradYears: [2026, 2027, 2028],
  },
];

export const TARGET_ROLE_BY_ID: Record<TargetRoleId, TargetRole> = TARGET_ROLES.reduce(
  (acc, r) => ({ ...acc, [r.id]: r }),
  {} as Record<TargetRoleId, TargetRole>
);
