import type {
  AtsBreakdown,
  AtsResult,
  AtsVerdict,
  Internship,
  ParsedResume,
} from "./types";
import { INTERNSHIPS, SKILL_BY_ID } from "./sample-data";
import { countImpactMetrics, hasImpact } from "./resume-parser";

const WEIGHTS: AtsBreakdown = {
  formatting: 10,
  contactInfo: 15,
  skills: 20,
  experience: 20,
  education: 15,
  projects: 10,
  impact: 10,
};

const TOTAL_WEIGHT = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);

export function scoreResume(
  resume: ParsedResume,
  target?: Internship | Internship[]
): AtsResult {
  const targetList = (() => {
    if (!target) return [];
    return Array.isArray(target) ? target : [target];
  })();

  const breakdown: AtsBreakdown = {
    formatting: scoreFormatting(resume),
    contactInfo: scoreContactInfo(resume),
    skills: scoreSkills(resume, targetList),
    experience: scoreExperience(resume),
    education: scoreEducation(resume),
    projects: scoreProjects(resume),
    impact: scoreImpact(resume),
  };

  const weighted =
    (breakdown.formatting * WEIGHTS.formatting +
      breakdown.contactInfo * WEIGHTS.contactInfo +
      breakdown.skills * WEIGHTS.skills +
      breakdown.experience * WEIGHTS.experience +
      breakdown.education * WEIGHTS.education +
      breakdown.projects * WEIGHTS.projects +
      breakdown.impact * WEIGHTS.impact) /
    TOTAL_WEIGHT;

  const overall = clamp(Math.round(weighted), 0, 100);
  const verdict = verdictFor(overall);

  const keywordHits: string[] = [];
  const keywordMisses: string[] = [];
  if (targetList.length) {
    const required = new Set<string>();
    for (const t of targetList) for (const id of t.requiredSkillIds) required.add(id);
    for (const id of required) {
      const name = SKILL_BY_ID.get(id)?.name ?? id;
      if (resume.detectedSkillIds.includes(id)) keywordHits.push(name);
      else keywordMisses.push(name);
    }
  } else if (resume.detectedSkillIds.length) {
    keywordHits.push(
      ...resume.detectedSkillIds.map((id) => SKILL_BY_ID.get(id)?.name ?? id)
    );
  }

  return {
    overall,
    verdict,
    breakdown,
    strengths: buildStrengths(breakdown, resume),
    improvements: buildImprovements(breakdown, resume, keywordMisses),
    keywordHits,
    keywordMisses,
  };
}

function scoreFormatting(resume: ParsedResume): number {
  let score = 100;
  if (resume.wordCount < 180) score -= 35;
  else if (resume.wordCount > 1200) score -= 15;
  if (resume.text.length < 200) score -= 25;
  if (!/\n/.test(resume.text)) score -= 20;
  return clamp(score);
}

function scoreContactInfo(resume: ParsedResume): number {
  let score = 0;
  if (resume.email) score += 45;
  if (resume.phone) score += 25;
  if (resume.links.length) score += 20;
  if (resume.name) score += 10;
  return clamp(score);
}

function scoreSkills(resume: ParsedResume, targets: Internship[]): number {
  const ids = new Set(resume.detectedSkillIds);
  if (!ids.size) return 15;
  if (!targets.length) {
    if (ids.size >= 12) return 100;
    return clamp(15 + ids.size * 7);
  }
  const required = new Set<string>();
  for (const t of targets) for (const id of t.requiredSkillIds) required.add(id);
  if (!required.size) return 100;
  const hits = [...required].filter((id) => ids.has(id)).length;
  return clamp(Math.round((hits / required.size) * 100));
}

function scoreExperience(resume: ParsedResume): number {
  const entries = resume.experience;
  if (!entries.length) return 30;
  let score = 50;
  score += Math.min(entries.length, 4) * 8;
  const bulletCount = entries.reduce((acc, e) => acc + e.bullets.length, 0);
  score += Math.min(bulletCount, 12) * 2;
  if (resume.yearsOfExperience >= 1) score += 8;
  if (hasImpact(resume)) score += 6;
  return clamp(score);
}

function scoreEducation(resume: ParsedResume): number {
  if (!resume.education.length) return 20;
  let score = 60;
  if (resume.education[0].degree) score += 20;
  if (resume.education[0].field) score += 10;
  if (resume.education[0].endYear) score += 10;
  return clamp(score);
}

function scoreProjects(resume: ParsedResume): number {
  const projects = resume.projects;
  if (!projects.length) return 25;
  let score = 45;
  score += Math.min(projects.length, 4) * 12;
  const techCount = projects.reduce((acc, p) => acc + p.tech.length, 0);
  score += Math.min(techCount, 8) * 4;
  return clamp(score);
}

function scoreImpact(resume: ParsedResume): number {
  let score = 25;
  if (hasImpact(resume)) score += 30;
  const metrics = countImpactMetrics(resume);
  score += Math.min(metrics, 12) * 4;
  return clamp(score);
}

function buildStrengths(breakdown: AtsBreakdown, resume: ParsedResume): string[] {
  const out: string[] = [];
  if (breakdown.skills >= 80) out.push(`Strong skill density (${resume.detectedSkillIds.length} detected)`);
  if (breakdown.experience >= 80) out.push("Solid experience section with quantified bullets");
  if (breakdown.education >= 80) out.push("Education is complete with degree and dates");
  if (breakdown.projects >= 80) out.push("Projects showcase a relevant tech stack");
  if (breakdown.impact >= 80) out.push("Uses impact verbs and metrics");
  if (breakdown.contactInfo >= 90) out.push("Contact details are easy to find");
  if (breakdown.formatting >= 85) out.push("Clean, ATS-friendly formatting");
  if (!out.length) out.push("Good baseline — push for more metrics and depth");
  return out;
}

function buildImprovements(
  breakdown: AtsBreakdown,
  resume: ParsedResume,
  misses: string[]
): string[] {
  const out: string[] = [];
  if (breakdown.contactInfo < 80)
    out.push("Add email, phone and at least one profile link (GitHub/LinkedIn).");
  if (breakdown.skills < 70)
    out.push("Expand the skills section with role-specific keywords.");
  if (breakdown.experience < 70)
    out.push("Add 2–4 bullet points per role emphasising impact and outcomes.");
  if (breakdown.education < 70)
    out.push("Mention degree, branch and graduation year explicitly.");
  if (breakdown.projects < 70)
    out.push("Add 2–3 projects with a short description and tech stack.");
  if (breakdown.impact < 70)
    out.push("Quantify outcomes — numbers like 30%, 2x, 10k users stand out.");
  if (breakdown.formatting < 70)
    out.push("Use clear section headers (Education, Experience, Projects, Skills).");
  if (misses.length)
    out.push(`Missing keywords for target roles: ${misses.slice(0, 6).join(", ")}.`);
  if (!out.length) out.push("Looking great — keep iterating on metrics and impact.");
  return out;
}

function verdictFor(score: number): AtsVerdict {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

export function pickTargetInternships(
  resume: ParsedResume,
  selectedDomains: string[] = [],
  limit = 3
): Internship[] {
  const domains = selectedDomains.length ? selectedDomains : resume.detectedDomains;
  const candidates = INTERNSHIPS.filter((i) => domains.includes(i.domain));
  const pool = candidates.length ? candidates : INTERNSHIPS;
  return pool.slice(0, limit);
}