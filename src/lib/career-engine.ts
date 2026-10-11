import type { CareerTwin, JobReadinessIndex, Quest, SkillEvidence, SkillStatus, TargetRole, TargetRoleId } from "@/types/student";
import { TARGET_ROLE_BY_ID } from "@/types/student";
import { SKILL_BY_ID } from "@/lib/sample-data";

export function classifySkill(
  skillId: string,
  twin: CareerTwin
): { status: SkillStatus; confidence: number; sources: SkillEvidence["sources"] } {
  const sources: SkillEvidence["sources"] = [];
  if (twin.resume?.detectedSkillIds.includes(skillId)) sources.push("RESUME");
  if (twin.resume?.projects.some((p: import("./types").ProjectEntry) => p.tech.some((t: string) => t.toLowerCase() === SKILL_BY_ID.get(skillId)?.name.toLowerCase()))) {
    sources.push("PROJECT");
  }
  const tag = mapSkillToTag(skillId);
  if (tag && twin.assessment.lastScore > 0) {
    const sectionScore = getSectionScore(twin, tag);
    if (sectionScore >= 80) sources.push("ASSESSMENT");
  }
  if (sources.length >= 2) return { status: "VERIFIED", confidence: 0.9, sources };
  if (sources.length === 1) return { status: "PARTIAL", confidence: 0.6, sources };
  return { status: "UNVERIFIED", confidence: 0.2, sources };
}

function mapSkillToTag(skillId: string): "tech" | "verbal" | "quant" | "dsa" | null {
  const map: Record<string, "tech" | "verbal" | "quant" | "dsa"> = {
    html: "tech", css: "tech", js: "tech", ts: "tech", react: "tech", next: "tech",
    tailwind: "tech", node: "tech", rest: "tech", sql: "tech", python: "tech",
    pandas: "tech", numpy: "tech", ml: "tech", sklearn: "tech", stats: "quant",
    tableau: "tech", java: "tech", spring: "tech", oop: "tech", junit: "tech",
    kotlin: "tech", android: "tech", flutter: "tech", dart: "tech", swift: "tech",
    figma: "tech", wireframe: "tech", "ux-research": "tech", "design-systems": "tech",
    prototyping: "tech", dsa: "dsa",
  };
  return map[skillId] ?? null;
}

function getSectionScore(twin: CareerTwin, tag: "tech" | "verbal" | "quant" | "dsa"): number {
  switch (tag) {
    case "tech": return twin.assessment.lastTechScore;
    case "verbal": return twin.assessment.lastVerbalScore;
    case "quant": return twin.assessment.lastQuantScore;
    case "dsa": return twin.assessment.lastDsaScore;
  }
}

export function buildSkillEvidence(twin: CareerTwin): SkillEvidence[] {
  const ids = new Set<string>(twin.resume?.detectedSkillIds ?? []);
  for (const id of twin.targetRoleIds) {
    TARGET_ROLE_BY_ID[id].requiredSkills.forEach((s) => ids.add(s.skillId));
  }
  return Array.from(ids).map((id) => {
    const c = classifySkill(id, twin);
    const name = SKILL_BY_ID.get(id)?.name ?? id;
    return { skillId: id, skillName: name, ...c };
  });
}

export function computeJri(twin: CareerTwin): JobReadinessIndex {
  const resumeScore = (twin.ats as unknown as { overall?: number } | null)?.overall ?? twin.jri.resumeScore;
  const technical = technicalScore(twin);
  const assessmentScore = twin.assessment.lastScore || twin.jri.assessmentScore;
  const projectScore = Math.min(100, (twin.resume?.projects.length ?? 0) * 25);
  const certScore = Math.min(100, ((twin.resume?.text.match(/certif/gi)?.length ?? 0) * 30));
  const aptitudeScore = Math.round(
    (twin.assessment.lastQuantScore + twin.assessment.lastVerbalScore) / 2
  );
  const profileCompleteness = profileCompletenessScore(twin);

  const total = Math.round(
    0.2 * resumeScore +
    0.25 * technical +
    0.25 * assessmentScore +
    0.15 * projectScore +
    0.1 * aptitudeScore +
    0.05 * profileCompleteness
  );

  const band = total >= 85
    ? "Top Candidate"
    : total >= 70
      ? "Strong"
      : total >= 55
        ? "Ready"
        : total >= 35
          ? "Developing"
          : "Beginner";

  return {
    totalJRI: total,
    resumeScore,
    technicalScore: technical,
    assessmentScore,
    projectScore,
    certScore,
    aptitudeScore,
    projectedGains: projectGains(twin),
    band,
  };
}

function profileCompletenessScore(twin: CareerTwin): number {
  if (!twin.profile) return 0;
  const fields = [twin.profile.name, twin.profile.email, twin.profile.college, twin.profile.branch, twin.profile.github, twin.profile.linkedin];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

function technicalScore(twin: CareerTwin): number {
  if (!twin.skills.length) return 0;
  const verified = twin.skills.filter((s) => s.status === "VERIFIED").length;
  const partial = twin.skills.filter((s) => s.status === "PARTIAL").length;
  if (!twin.skills.length) return 0;
  return Math.min(100, Math.round((verified * 100 + partial * 50) / twin.skills.length));
}

function projectGains(twin: CareerTwin): JobReadinessIndex["projectedGains"] {
  const gains: JobReadinessIndex["projectedGains"] = [];
  const missing = twin.skills.filter((s) => s.status === "UNVERIFIED").slice(0, 4);
  missing.forEach((s) => gains.push({ action: `Verify ${s.skillName}`, delta: 3 }));
  if ((twin.resume?.projects.length ?? 0) < 3) {
    gains.push({ action: "Add 1 more project to your resume", delta: 4 });
  }
  if (twin.assessment.lastScore < 60) {
    gains.push({ action: "Score ≥80% in the assessment", delta: 7 });
  }
  return gains;
}

export interface GapRow {
  skillId: string;
  skillName: string;
  requiredLevel: "High" | "Medium" | "Low";
  requiredWeight: number;
  currentLevel: SkillStatus;
  impact: "Critical" | "High" | "Medium";
  domain?: string;
}

export function buildGapMatrix(twin: CareerTwin, roleId: TargetRoleId): GapRow[] {
  const role = TARGET_ROLE_BY_ID[roleId];
  return role.requiredSkills
    .map((req) => {
      const ev = twin.skills.find((s) => s.skillId === req.skillId);
      const level = ev?.status ?? "UNVERIFIED";
      const impact: GapRow["impact"] =
        req.level === "High" && level !== "VERIFIED"
          ? "Critical"
          : req.level === "Medium" && level === "UNVERIFIED"
            ? "High"
            : level === "UNVERIFIED"
              ? "Medium"
              : "Medium";
      return {
        skillId: req.skillId,
        skillName: SKILL_BY_ID.get(req.skillId)?.name ?? req.skillId,
        requiredLevel: req.level,
        requiredWeight: req.weight,
        currentLevel: level,
        impact,
        domain: SKILL_BY_ID.get(req.skillId)?.domain,
      };
    })
    .sort((a, b) => b.requiredWeight - a.requiredWeight);
}

export function topBlocker(matrix: GapRow[]): GapRow | null {
  const critical = matrix.find((m) => m.currentLevel !== "VERIFIED");
  return critical ?? null;
}

export function buildQuests(twin: CareerTwin): Quest[] {
  const ats = (twin.ats as unknown as { overall?: number } | null)?.overall ?? 0;
  return [
    {
      id: "resume-master",
      title: "Resume Master",
      description: "Score ≥80% on ATS scoring",
      xp: 50,
      type: "resume",
      target: 80,
      progress: Math.min(100, Math.round((ats / 80) * 100)),
      completed: ats >= 80,
      badge: "📄",
    },
    {
      id: "aptitude-ace",
      title: "Aptitude Ace",
      description: "Clear the Quantitative section",
      xp: 100,
      type: "aptitude",
      target: 80,
      progress: Math.min(100, Math.round((twin.assessment.lastQuantScore / 80) * 100)),
      completed: twin.assessment.lastQuantScore >= 80,
      badge: "🧮",
    },
    {
      id: "fullstack-artisan",
      title: "Full-Stack Artisan",
      description: "Verify 3 backend skills",
      xp: 250,
      type: "skills",
      target: 3,
      progress: twin.skills.filter((s) => s.status === "VERIFIED").length,
      completed: twin.skills.filter((s) => s.status === "VERIFIED").length >= 3,
      badge: "🛠️",
    },
    {
      id: "streak-keeper",
      title: "Streak Keeper",
      description: "Maintain a 3-day activity streak",
      xp: 30,
      type: "streak",
      target: 3,
      progress: twin.streak,
      completed: twin.streak >= 3,
      badge: "🔥",
    },
    {
      id: "project-builder",
      title: "Project Builder",
      description: "List 3+ projects on your resume",
      xp: 80,
      type: "project",
      target: 3,
      progress: twin.resume?.projects.length ?? 0,
      completed: (twin.resume?.projects.length ?? 0) >= 3,
      badge: "🚀",
    },
  ];
}

export function eligibilityFor(role: TargetRole, twin: CareerTwin) {
  if (!twin.profile) {
    return { status: "NOT_ELIGIBLE" as const, reasons: ["Complete your profile"], passesFixed: false };
  }
  const reasons: string[] = [];
  const passesCgpa = (twin.profile.cgpa ?? 0) >= role.minCgpa;
  const passesBranch = role.eligibleBranches.includes(twin.profile.branch) || role.eligibleBranches.includes("Any");
  const passesYear = role.eligibleGradYears.includes(twin.profile.gradYear);
  if (!passesCgpa) reasons.push(`CGPA below ${role.minCgpa}`);
  if (!passesBranch) reasons.push("Branch not in eligible list");
  if (!passesYear) reasons.push("Graduation year not in eligible list");
  return {
    status: reasons.length === 0 ? ("ELIGIBLE" as const) : ("NOT_ELIGIBLE" as const),
    reasons,
    passesFixed: reasons.length === 0,
  };
}