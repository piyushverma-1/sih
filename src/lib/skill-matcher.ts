import type {
  Domain,
  Internship,
  MatchResult,
  ParsedResume,
  SkillGapItem,
} from "./types";
import { INTERNSHIPS, SKILL_BY_DOMAIN, SKILL_BY_ID } from "./sample-data";

export interface MatchableInternship {
  id: string;
  requiredSkillIds: string[];
  niceToHaveSkillIds?: string[];
}

export function matchInternship(
  resume: ParsedResume,
  internship: MatchableInternship
): MatchResult {
  const have = new Set(resume.detectedSkillIds);
  const matched: SkillGapItem[] = [];
  const missing: SkillGapItem[] = [];
  const partial: SkillGapItem[] = [];

  const required = internship.requiredSkillIds;
  const nice = internship.niceToHaveSkillIds ?? [];
  const totalWeight = required.reduce((acc, id) => acc + (SKILL_BY_ID.get(id)?.weight ?? 5), 0);

  let earned = 0;
  for (const id of required) {
    const skill = SKILL_BY_ID.get(id);
    if (!skill) continue;
    const item = makeItem(skill, have.has(id) ? "have" : "missing");
    if (have.has(id)) {
      matched.push(item);
      earned += skill.weight;
    } else if (partialOverlap(skill, resume)) {
      partial.push({ ...item, status: "partial" });
      earned += skill.weight * 0.5;
    } else {
      missing.push(item);
    }
  }

  for (const id of nice) {
    if (have.has(id)) {
      const skill = SKILL_BY_ID.get(id);
      if (skill) matched.push(makeItem(skill, "have"));
    }
  }

  const matchPct = totalWeight === 0 ? 0 : Math.round((earned / totalWeight) * 100);
  return { internshipId: internship.id, matchPct, matched, missing, partial };
}

export function rankInternships(
  resume: ParsedResume,
  domains: Domain[] = [],
  limit?: number
): MatchResult[] {
  const pool = domains.length
    ? INTERNSHIPS.filter((i) => domains.includes(i.domain))
    : INTERNSHIPS;
  const ranked = pool
    .map((i) => matchInternship(resume, i))
    .sort((a, b) => b.matchPct - a.matchPct);
  return typeof limit === "number" ? ranked.slice(0, limit) : ranked;
}

export function skillGapForInternship(
  resume: ParsedResume,
  internship: Internship
): SkillGapItem[] {
  return matchInternship(resume, internship).missing;
}

export function domainSkillGap(
  resume: ParsedResume,
  domain: Domain
): SkillGapItem[] {
  const have = new Set(resume.detectedSkillIds);
  return SKILL_BY_DOMAIN[domain]
    .map((skill) => makeItem(skill, have.has(skill.id) ? "have" : "missing"))
    .filter((item) => item.status !== "have")
    .sort((a, b) => b.importance - a.importance);
}

export function overallSkillCoverage(resume: ParsedResume): number {
  const have = new Set(resume.detectedSkillIds);
  if (!have.size) return 0;
  const weightedTotal = Array.from(have).reduce(
    (acc, id) => acc + (SKILL_BY_ID.get(id)?.weight ?? 5),
    0
  );
  const max = 100;
  return Math.min(max, Math.round((weightedTotal / max) * 100));
}

export type { MatchResult, SkillGapItem };

function partialOverlap(
  skill: { id: string; name: string; aliases?: string[] },
  resume: ParsedResume
): boolean {
  const text = resume.text.toLowerCase();
  const needles = [skill.name.toLowerCase(), ...(skill.aliases ?? []).map((a) => a.toLowerCase())];
  return needles.some((n) => text.includes(n)) && !resume.detectedSkillIds.includes(skill.id);
}

function makeItem(
  skill: { id: string; name: string; domain: Domain; weight: number },
  status: SkillGapItem["status"]
): SkillGapItem {
  return {
    skillId: skill.id,
    skillName: skill.name,
    domain: skill.domain,
    status,
    importance: skill.weight,
  };
}